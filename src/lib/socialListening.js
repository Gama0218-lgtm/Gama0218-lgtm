/**
 * src/lib/socialListening.js
 * JAMNet TruthEngine360 — Social Listening + Automated Reporting Engine
 *
 * Responsibilities:
 *   - Define the platform registry (X, Reddit, YouTube, TikTok, Instagram,
 *     Facebook, LinkedIn, News/RSS) with connection status + auth model.
 *   - Provide a unified post stream surface (`fetchMentions`) that adapters
 *     can be hot-swapped under without changing the UI.
 *   - Run a sentiment / velocity / surge engine over the unified stream.
 *   - Drive an automation rules engine (volume spike, sentiment drop,
 *     keyword surge, influencer hit) that produces alerts.
 *   - Generate Markdown + CSV digest reports on a schedule.
 *
 * Connection model: each platform reports one of
 *   "connected" | "needs_auth" | "rate_limited" | "disconnected" | "error".
 * The grid downgrades gracefully if a platform is not connected and the
 * reporting engine still works on whatever the connected set produces.
 */

export const PLATFORMS = {
  X: {
    id: "x",
    name: "X (Twitter)",
    color: "blue",
    endpoint: "https://api.x.com/2",
    rateLimit: { requests: 300, window: 900_000 },
    auth: "oauth2",
    capabilities: ["search_recent", "user_lookup", "stream_filter"],
  },
  REDDIT: {
    id: "reddit",
    name: "Reddit",
    color: "orange",
    endpoint: "https://oauth.reddit.com",
    rateLimit: { requests: 60, window: 60_000 },
    auth: "oauth2",
    capabilities: ["subreddit_search", "comment_stream", "submission_stream"],
  },
  YOUTUBE: {
    id: "youtube",
    name: "YouTube",
    color: "red",
    endpoint: "https://www.googleapis.com/youtube/v3",
    rateLimit: { requests: 10_000, window: 86_400_000 }, // 10k units/day
    auth: "api_key",
    capabilities: ["search", "comments", "video_metadata"],
  },
  TIKTOK: {
    id: "tiktok",
    name: "TikTok",
    color: "purple",
    endpoint: "https://open.tiktokapis.com/v2",
    rateLimit: { requests: 100, window: 60_000 },
    auth: "oauth2",
    capabilities: ["hashtag_search", "video_query"],
  },
  INSTAGRAM: {
    id: "instagram",
    name: "Instagram",
    color: "purple",
    endpoint: "https://graph.facebook.com/v19.0",
    rateLimit: { requests: 200, window: 3_600_000 },
    auth: "oauth2_business",
    capabilities: ["hashtag_search", "business_mentions"],
  },
  FACEBOOK: {
    id: "facebook",
    name: "Facebook",
    color: "blue",
    endpoint: "https://graph.facebook.com/v19.0",
    rateLimit: { requests: 200, window: 3_600_000 },
    auth: "oauth2_business",
    capabilities: ["page_mentions", "search"],
  },
  LINKEDIN: {
    id: "linkedin",
    name: "LinkedIn",
    color: "blue",
    endpoint: "https://api.linkedin.com/v2",
    rateLimit: { requests: 100, window: 86_400_000 },
    auth: "oauth2",
    capabilities: ["share_stream", "company_mentions"],
  },
  NEWS: {
    id: "news",
    name: "News / RSS",
    color: "teal",
    endpoint: "internal://aggregator",
    rateLimit: { requests: 1_000, window: 3_600_000 },
    auth: "none",
    capabilities: ["rss", "google_news", "press_release_wire"],
  },
};

export const PLATFORM_LIST = Object.values(PLATFORMS);

// Default tracked queries for the AUMER / Exile Patriot mission.
export const DEFAULT_QUERIES = [
  { id: "q1", term: "deported veteran",        group: "Chicano/Latino", weight: 1.0 },
  { id: "q2", term: "exile patriot",           group: "Chicano/Latino", weight: 0.9 },
  { id: "q3", term: "AUMER",                   group: "Brand",          weight: 0.8 },
  { id: "q4", term: "TruthEngine360",          group: "Brand",          weight: 0.7 },
  { id: "q5", term: "Ramos border",            group: "Border",         weight: 0.7 },
  { id: "q6", term: "veterans deportation",    group: "Veterans",       weight: 0.85 },
  { id: "q7", term: "ICE removal veteran",     group: "Veterans",       weight: 0.6 },
];

// Very small lexicon used by the local sentiment fallback. When a server-side
// model is wired in (e.g. via the cloud), `analyzeSentiment` should be
// overridden via `configureEngine`.
const POSITIVE = [
  "honor", "thank", "supports", "support", "win", "victory", "justice",
  "welcome", "home", "love", "proud", "amazing", "hero", "patriot",
  "praise", "uplift", "courage", "freedom",
];
const NEGATIVE = [
  "deport", "abandoned", "betrayed", "shame", "outrage", "ignored",
  "exile", "broken", "fail", "failing", "abuse", "tragedy", "lies",
  "scam", "fraud", "criminal", "danger",
];

let engineConfig = {
  analyzeSentiment: (text) => {
    const t = (text || "").toLowerCase();
    let pos = 0;
    let neg = 0;
    for (const w of POSITIVE) if (t.includes(w)) pos++;
    for (const w of NEGATIVE) if (t.includes(w)) neg++;
    if (pos === 0 && neg === 0) return { label: "neutral", score: 0 };
    const score = (pos - neg) / Math.max(1, pos + neg);
    const label = score > 0.15 ? "positive" : score < -0.15 ? "negative" : "neutral";
    return { label, score };
  },
  // Adapter map. Production code replaces these via configureEngine().
  adapters: {},
};

export function configureEngine(partial) {
  engineConfig = { ...engineConfig, ...partial, adapters: { ...engineConfig.adapters, ...(partial.adapters || {}) } };
}

export function analyzeSentiment(text) {
  return engineConfig.analyzeSentiment(text);
}

/**
 * Unified `fetchMentions`. If an adapter is registered for a platform we use
 * it; otherwise we synthesise a deterministic-ish demo stream so the grid
 * has something to render. The demo stream is clearly labelled `demo: true`.
 */
export async function fetchMentions({ platforms, queries, since, limit = 60 }) {
  const enabled = (platforms || PLATFORM_LIST).filter((p) => p.connection !== "disconnected");
  const queryList = queries && queries.length ? queries : DEFAULT_QUERIES;
  const out = [];

  for (const platform of enabled) {
    const adapter = engineConfig.adapters[platform.id];
    let posts;
    if (adapter && typeof adapter.search === "function") {
      try {
        posts = await adapter.search({ queries: queryList, since, limit });
      } catch (err) {
        posts = [];
        out.push(__errorMarker(platform, err));
        continue;
      }
    } else {
      posts = __demoStream(platform, queryList, limit);
    }
    for (const p of posts) {
      const sent = analyzeSentiment(`${p.title || ""} ${p.text || ""}`);
      out.push({
        ...p,
        platform: platform.id,
        platformName: platform.name,
        platformColor: platform.color,
        sentiment: sent.label,
        sentimentScore: sent.score,
      });
    }
  }
  out.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  return out;
}

function __errorMarker(platform, err) {
  return {
    id: `err-${platform.id}-${Date.now()}`,
    platform: platform.id,
    platformName: platform.name,
    isErrorMarker: true,
    text: `${platform.name} adapter error: ${err.message || err}`,
    timestamp: Date.now(),
    sentiment: "neutral",
    sentimentScore: 0,
    engagement: { likes: 0, shares: 0, comments: 0, reach: 0 },
  };
}

// Deterministic demo stream so the grid is useful before adapters are wired.
function __demoStream(platform, queries, limit) {
  const seedTime = Date.now();
  const out = [];
  const sampleAuthors = ["@vet_advocate", "@borderwatch", "@chicano_voz", "@patriot_exiled", "@aumer_official", "@veterans_first", "@truthengine"];
  const sampleBodies = {
    "deported veteran":
      "Another deported veteran left at the border crossing today — they served and were thrown away. We need leadership.",
    "exile patriot":
      "The Exile Patriot Project is doing what gatekeepers won't. Watch this story before it gets buried.",
    "AUMER":
      "AUMER Foundation just released a community brief on border outreach — credible, sourced, no spin.",
    "TruthEngine360":
      "TruthEngine360 thread breaking down the reverse-strategy: community first, gatekeepers follow.",
    "Ramos border":
      "Ramos Canon dispatch from the border hub — three new intake interviews this week.",
    "veterans deportation":
      "Veterans deportation hearing rescheduled — community organizing is the only thing moving this.",
    "ICE removal veteran":
      "Reports of an ICE removal proceeding against a Navy vet today. Need eyes on this.",
  };
  for (let i = 0; i < Math.min(limit, queries.length * 3); i++) {
    const q = queries[i % queries.length];
    out.push({
      id: `${platform.id}-${i}-${seedTime}`,
      author: sampleAuthors[i % sampleAuthors.length],
      authorFollowers: 800 + ((i * 137) % 60_000),
      title: q.term.toUpperCase(),
      text: sampleBodies[q.term] || `Tracking conversation around "${q.term}" on ${platform.name}.`,
      query: q.term,
      queryGroup: q.group,
      timestamp: seedTime - i * 60_000 * (1 + (i % 5)),
      url: `${platform.endpoint}/post/${platform.id}-${i}`,
      engagement: {
        likes:    50  + ((i * 17) % 1200),
        shares:   8   + ((i * 11) % 240),
        comments: 4   + ((i * 7)  % 120),
        reach:    1200 + ((i * 311) % 18000),
      },
      demo: true,
    });
  }
  return out;
}

// -------- Metrics ----------

export function aggregateMetrics(posts) {
  const total = posts.length;
  let pos = 0, neg = 0, neu = 0;
  let reach = 0, engagement = 0;
  const perPlatform = {};
  const perQuery = {};
  const perAuthor = {};
  for (const p of posts) {
    if (p.isErrorMarker) continue;
    if (p.sentiment === "positive") pos++;
    else if (p.sentiment === "negative") neg++;
    else neu++;
    reach += p.engagement?.reach || 0;
    engagement += (p.engagement?.likes || 0) + (p.engagement?.shares || 0) + (p.engagement?.comments || 0);

    perPlatform[p.platform] = (perPlatform[p.platform] || 0) + 1;
    if (p.query) perQuery[p.query] = (perQuery[p.query] || 0) + 1;
    if (p.author) {
      perAuthor[p.author] = perAuthor[p.author] || { author: p.author, posts: 0, reach: 0, followers: p.authorFollowers || 0 };
      perAuthor[p.author].posts += 1;
      perAuthor[p.author].reach += p.engagement?.reach || 0;
    }
  }
  const sentimentScore = total === 0 ? 0 : Math.round(((pos - neg) / total) * 100);
  return {
    total,
    positive: pos,
    negative: neg,
    neutral: neu,
    reach,
    engagement,
    sentimentScore,
    perPlatform,
    perQuery,
    topAuthors: Object.values(perAuthor).sort((a, b) => b.reach - a.reach).slice(0, 8),
  };
}

// -------- Automation rules ----------

export const DEFAULT_RULES = [
  {
    id: "volume_spike",
    label: "Volume spike (≥ 2× rolling avg)",
    severity: "high",
    evaluate: ({ metrics, baseline }) => {
      if (!baseline?.total) return null;
      const ratio = metrics.total / baseline.total;
      if (ratio >= 2) {
        return { ratio: ratio.toFixed(2), message: `Mentions surged ${ratio.toFixed(2)}× vs. baseline.` };
      }
      return null;
    },
  },
  {
    id: "sentiment_drop",
    label: "Sentiment drop (≥ 25 pt vs baseline)",
    severity: "high",
    evaluate: ({ metrics, baseline }) => {
      if (!baseline) return null;
      const delta = metrics.sentimentScore - (baseline.sentimentScore || 0);
      if (delta <= -25) {
        return { delta, message: `Sentiment dropped ${Math.abs(delta)} pts.` };
      }
      return null;
    },
  },
  {
    id: "keyword_surge",
    label: "Keyword surge (single query ≥ 40% of volume)",
    severity: "medium",
    evaluate: ({ metrics }) => {
      const top = Object.entries(metrics.perQuery).sort((a, b) => b[1] - a[1])[0];
      if (!top) return null;
      const share = top[1] / Math.max(1, metrics.total);
      if (share >= 0.4) {
        return { keyword: top[0], share, message: `"${top[0]}" is ${Math.round(share * 100)}% of conversation.` };
      }
      return null;
    },
  },
  {
    id: "influencer_hit",
    label: "Influencer reach (author > 25k reach)",
    severity: "medium",
    evaluate: ({ metrics }) => {
      const hit = metrics.topAuthors.find((a) => a.reach >= 25_000);
      if (hit) return { author: hit.author, reach: hit.reach, message: `${hit.author} reached ${hit.reach.toLocaleString()} accounts.` };
      return null;
    },
  },
  {
    id: "negative_cluster",
    label: "Negative cluster (≥ 35% negative)",
    severity: "critical",
    evaluate: ({ metrics }) => {
      const share = metrics.negative / Math.max(1, metrics.total);
      if (share >= 0.35) {
        return { share, message: `Negative sentiment cluster — ${Math.round(share * 100)}% of mentions.` };
      }
      return null;
    },
  },
];

export function evaluateRules({ metrics, baseline, rules = DEFAULT_RULES }) {
  const fired = [];
  for (const rule of rules) {
    const hit = rule.evaluate({ metrics, baseline });
    if (hit) {
      fired.push({ ...hit, id: rule.id, label: rule.label, severity: rule.severity, firedAt: Date.now() });
    }
  }
  return fired;
}

// -------- Reporting ----------

export function buildDigestMarkdown({ window, metrics, alerts, posts }) {
  const date = new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push(`# JAMNet · TruthEngine360 — Social Listening Digest`);
  lines.push(``);
  lines.push(`**Window:** ${window}  ·  **Generated:** ${date}`);
  lines.push(``);
  lines.push(`## Headline Metrics`);
  lines.push(``);
  lines.push(`| Metric | Value |`);
  lines.push(`| --- | --- |`);
  lines.push(`| Total mentions | ${metrics.total} |`);
  lines.push(`| Sentiment score | ${metrics.sentimentScore}/100 |`);
  lines.push(`| Estimated reach | ${metrics.reach.toLocaleString()} |`);
  lines.push(`| Engagement | ${metrics.engagement.toLocaleString()} |`);
  lines.push(`| Positive / Neutral / Negative | ${metrics.positive} / ${metrics.neutral} / ${metrics.negative} |`);
  lines.push(``);

  lines.push(`## Per-platform`);
  lines.push(``);
  for (const [platform, count] of Object.entries(metrics.perPlatform).sort((a, b) => b[1] - a[1])) {
    lines.push(`- **${platform}** — ${count} mentions`);
  }
  lines.push(``);

  lines.push(`## Top queries`);
  lines.push(``);
  for (const [q, count] of Object.entries(metrics.perQuery).sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    lines.push(`- \`${q}\` — ${count} mentions`);
  }
  lines.push(``);

  if (metrics.topAuthors.length) {
    lines.push(`## Top voices by reach`);
    lines.push(``);
    for (const a of metrics.topAuthors) {
      lines.push(`- ${a.author} — ${a.posts} posts, ${a.reach.toLocaleString()} reach`);
    }
    lines.push(``);
  }

  if (alerts.length) {
    lines.push(`## Alerts fired`);
    lines.push(``);
    for (const a of alerts) {
      lines.push(`- **[${a.severity.toUpperCase()}]** ${a.label} — ${a.message}`);
    }
    lines.push(``);
  } else {
    lines.push(`## Alerts fired`);
    lines.push(``);
    lines.push(`_No automation rules fired in this window._`);
    lines.push(``);
  }

  lines.push(`## Notable mentions (top 10)`);
  lines.push(``);
  for (const p of posts.slice(0, 10)) {
    if (p.isErrorMarker) continue;
    lines.push(`- **[${p.platformName}]** ${p.author || "—"} — "${(p.text || "").slice(0, 160)}" (sentiment: ${p.sentiment})`);
  }
  return lines.join("\n");
}

export function buildDigestCSV(posts) {
  const header = ["timestamp", "platform", "author", "query", "sentiment", "score", "likes", "shares", "comments", "reach", "text"];
  const rows = [header.join(",")];
  for (const p of posts) {
    if (p.isErrorMarker) continue;
    const e = p.engagement || {};
    const row = [
      new Date(p.timestamp || Date.now()).toISOString(),
      p.platform,
      p.author || "",
      p.query || "",
      p.sentiment,
      p.sentimentScore.toFixed(3),
      e.likes || 0,
      e.shares || 0,
      e.comments || 0,
      e.reach || 0,
      `"${(p.text || "").replace(/"/g, '""').slice(0, 240)}"`,
    ];
    rows.push(row.join(","));
  }
  return rows.join("\n");
}

export function downloadString(filename, text, mime = "text/plain") {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// -------- Scheduler ----------

/**
 * Lightweight automation loop. Caller passes a `run` callback which gets the
 * current posts, metrics, and fired alerts; this lets the UI surface them
 * without taking ownership of the polling. Returns a cancel function.
 */
export function startAutomation({
  platforms,
  queries,
  windowMs = 15 * 60_000,
  intervalMs = 60_000,
  run,
}) {
  let cancelled = false;
  let baseline = null;

  async function tick() {
    if (cancelled) return;
    const since = Date.now() - windowMs;
    const posts = await fetchMentions({ platforms, queries, since });
    const metrics = aggregateMetrics(posts);
    const alerts = evaluateRules({ metrics, baseline });
    if (run) run({ posts, metrics, alerts, baseline });
    // Use the first window as the baseline; afterward shift it slowly so
    // a sustained spike eventually becomes the new normal.
    baseline = baseline
      ? {
          total: baseline.total * 0.7 + metrics.total * 0.3,
          sentimentScore: baseline.sentimentScore * 0.7 + metrics.sentimentScore * 0.3,
        }
      : { total: metrics.total, sentimentScore: metrics.sentimentScore };
  }

  tick();
  const handle = setInterval(tick, intervalMs);
  return () => {
    cancelled = true;
    clearInterval(handle);
  };
}
