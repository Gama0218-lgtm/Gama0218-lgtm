# JAMNet · TruthEngine360 — Social Listening + Automated Reporting

**Surface:** `src/pages/JAMSPage.jsx`
**Engine:** `src/lib/socialListening.js`
**UI:** `src/components/jam/SocialListeningGrid.jsx`
**Route:** `/jams`

JAMNet is the Stakeholder Intelligence Platform that sits on top of LitCentral.
This file documents the **Social Listening Grid** — the optimized + automated
multi-platform listening tab the rest of the JAMS UI is organized around.

## What the engine does

The listening engine (`socialListening.js`) gives the UI one unified call to make:

```js
const posts   = await fetchMentions({ platforms, queries, since });
const metrics = aggregateMetrics(posts);
const alerts  = evaluateRules({ metrics, baseline });
```

Each `post` carries a normalized shape regardless of source platform:

```ts
{
  id, platform, platformName, platformColor,
  author, authorFollowers, text, query, queryGroup,
  timestamp, url,
  sentiment: "positive" | "neutral" | "negative",
  sentimentScore: number,                // [-1, 1]
  engagement: { likes, shares, comments, reach },
}
```

Adapters are pluggable. Wire a production source by calling `configureEngine`:

```js
import { configureEngine } from "./lib/socialListening";

configureEngine({
  analyzeSentiment: cloudSentiment,      // override the local lexicon
  adapters: {
    x:        { search: xAdapter.search },
    reddit:   { search: redditAdapter.search },
    youtube:  { search: ytAdapter.search },
    // …
  },
});
```

If a platform has no adapter registered yet, the engine returns a deterministic
demo stream tagged `demo: true` so the grid stays useful while integrations are
being negotiated.

## Connected platforms

| Platform   | Auth model        | Default status |
| ---------- | ----------------- | -------------- |
| X (Twitter)| OAuth2            | connected      |
| Reddit     | OAuth2            | connected      |
| YouTube    | API key           | connected      |
| TikTok     | OAuth2            | needs_auth     |
| Instagram  | OAuth2 (business) | needs_auth     |
| Facebook   | OAuth2 (business) | needs_auth     |
| LinkedIn   | OAuth2            | needs_auth     |
| News / RSS | none              | connected      |

The grid renders connection state per-platform (`LIVE / AUTH / RATE / OFF / ERR`)
and lets the operator pause tracking, cut a feed, or re-CONNECT.

## Automation

The Social Listening Grid runs a polling loop driven by `startAutomation`. The
operator picks a **window** (15m / 1h / 24h / 7d) and a **refresh interval**
(30s → 1h). On every tick the engine:

1. Pulls mentions for every enabled, connected platform.
2. Aggregates volume / sentiment / reach / engagement.
3. Computes a rolling baseline (EMA, 0.7 / 0.3).
4. Evaluates the rules engine against the current window vs. baseline.

### Default rules

| Rule                  | Severity | Triggers when…                                  |
| --------------------- | -------- | ----------------------------------------------- |
| `volume_spike`        | high     | mentions ≥ 2× rolling baseline                  |
| `sentiment_drop`      | high     | sentiment fell ≥ 25 points vs. baseline         |
| `keyword_surge`       | medium   | one tracked query ≥ 40% of all mentions         |
| `influencer_hit`      | medium   | an author surfaced ≥ 25k reach in the window    |
| `negative_cluster`    | critical | ≥ 35% of mentions are negative                  |

Rules are pure functions; you can extend `DEFAULT_RULES` or pass your own
`rules` into `evaluateRules` without touching the UI.

## Reporting

Two report flavors ship out of the box:

- **`buildDigestMarkdown(...)`** — a human-readable digest covering metrics,
  per-platform breakdown, top queries, top voices, fired alerts, and the ten
  most notable mentions. Wired to **`DIGEST .MD`** in the grid header.
- **`buildDigestCSV(posts)`** — flat CSV of every captured mention with
  timestamp, platform, author, sentiment, engagement, and the first 240 chars
  of body. Wired to **`EXPORT .CSV`**.

Both are written client-side via `downloadString(...)`. When a server / cloud
report sink is added, point those exports at it — the report builders return
plain strings.

The grid also keeps a rolling **DIGEST HISTORY** of every tick that fired at
least one alert, so an operator coming back to the console sees what
happened without scrolling the feed.

## Wiring a production source

A minimal X (Twitter) adapter looks like:

```js
import { configureEngine } from "./lib/socialListening";

const xAdapter = {
  async search({ queries, since, limit }) {
    const q = queries.map((x) => `"${x.term}"`).join(" OR ");
    const r = await fetch(
      `https://api.x.com/2/tweets/search/recent?query=${encodeURIComponent(q)}&max_results=${Math.min(100, limit)}&start_time=${new Date(since).toISOString()}`,
      { headers: { Authorization: `Bearer ${process.env.X_BEARER}` } },
    );
    const json = await r.json();
    return (json.data || []).map((t) => ({
      id: t.id,
      author: t.author_id,
      text: t.text,
      query: queries.find((q) => t.text.toLowerCase().includes(q.term.toLowerCase()))?.term,
      timestamp: new Date(t.created_at).getTime(),
      url: `https://x.com/i/web/status/${t.id}`,
      engagement: {
        likes:    t.public_metrics?.like_count    || 0,
        shares:   t.public_metrics?.retweet_count || 0,
        comments: t.public_metrics?.reply_count   || 0,
        reach:    t.public_metrics?.impression_count || 0,
      },
    }));
  },
};

configureEngine({ adapters: { x: xAdapter } });
```

Every other platform follows the same shape — return normalized post objects
and the engine handles sentiment, metrics, rules, and reporting.

## Cloud / scheduled reporting

The grid's polling loop is fine for an open console. For unattended cloud
operation (the "automated" half of the brief), call the same engine from a
scheduled job:

```js
import { fetchMentions, aggregateMetrics, evaluateRules, buildDigestMarkdown } from "./lib/socialListening";

export async function nightlyDigest() {
  const since   = Date.now() - 24 * 60 * 60_000;
  const posts   = await fetchMentions({ since });
  const metrics = aggregateMetrics(posts);
  const alerts  = evaluateRules({ metrics, baseline: null });
  const md      = buildDigestMarkdown({ window: "24h", metrics, alerts, posts });
  await uploadToStakeholderDrive(md);
}
```

Drop this into a cron / Supabase Edge Function / cloud scheduler — the engine
has no DOM dependencies outside `downloadString`, which is opt-in.
