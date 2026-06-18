import { useEffect, useMemo, useState } from "react";
import {
  Zap, Activity, Radio, Bell, Gauge, Sparkles, TrendingUp, AlertTriangle,
  CheckCircle2, BarChart3, MessageSquare, Heart, Send, Eye,
  Twitter, Youtube, Linkedin, Instagram, Globe, FileText,
} from "lucide-react";
import {
  PLATFORM_LIST, DEFAULT_QUERIES,
  fetchMentions, aggregateMetrics, evaluateRules,
  buildDigestMarkdown, downloadString,
} from "../../lib/socialListening";

const SOCIAL_ICONS = {
  x:         { Icon: Twitter,   label: "X / Twitter" },
  reddit:    { Icon: MessageSquare, label: "Reddit" },
  youtube:   { Icon: Youtube,   label: "YouTube" },
  tiktok:    { Icon: Sparkles,  label: "TikTok" },
  instagram: { Icon: Instagram, label: "Instagram" },
  facebook:  { Icon: Globe,     label: "Facebook" },
  linkedin:  { Icon: Linkedin,  label: "LinkedIn" },
  news:      { Icon: FileText,  label: "News / RSS" },
};

const PRESET_CHANNELS = [
  { id: "social",  title: "Social listening",     chip: "High volume",  detail: "Mentions, engagement, reaction velocity, sentiment shifts, influencer spikes." },
  { id: "support", title: "Support channels",     chip: "Action-heavy", detail: "Tickets, escalations, CSAT-linked feedback, resolution friction, churn risk." },
  { id: "product", title: "Product feedback",     chip: "Insight-rich", detail: "NPS comments, feature requests, in-app prompts, release reactions." },
  { id: "media",   title: "Community and media",  chip: "Signal mining",detail: "Forum threads, creator reviews, partner commentary, public trend narratives." },
];

const REPORTS = [
  { title: "Executive summary",  detail: "Health score, platform risk, growth signals, cost and service posture." },
  { title: "Operations report",  detail: "Latency, throughput, retries, job completion, queue depth, incident markers." },
  { title: "Sentiment report",   detail: "Channel score, topic clusters, negative trends, opportunity hotspots." },
  { title: "Audience report",    detail: "Reach, interaction, campaign alignment, conversion indicators, social lift." },
];

function Sparkline({ points }) {
  // Build a smooth curve through `points` (normalized 0..1) — emits a closed
  // path for the fill + an open path for the stroke.
  const w = 900, h = 140, pad = 6;
  if (!points || points.length < 2) return null;
  const step = (w - pad * 2) / (points.length - 1);
  const coords = points.map((v, i) => [pad + i * step, pad + (1 - v) * (h - pad * 2)]);
  const path = coords
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");
  const last = coords[coords.length - 1];
  const first = coords[0];
  const fill = `${path} L${last[0]},${h} L${first[0]},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id="cd-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"  stopColor="hsl(var(--teal))" />
          <stop offset="100%" stopColor="hsl(var(--purple))" />
        </linearGradient>
        <linearGradient id="cd-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="hsl(var(--teal))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--teal))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#cd-fill)" />
      <path d={path} fill="none" stroke="url(#cd-stroke)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScoreRing({ score = 74, label = "Positive weighted sentiment" }) {
  // SVG ring so the conic gradient renders correctly in the JAMNet theme
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - Math.max(0, Math.min(100, score)) / 100);
  return (
    <div className="relative flex flex-col items-center">
      <svg width="166" height="166" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={radius} stroke="hsl(var(--border))" strokeWidth="14" fill="none" />
        <circle
          cx="80" cy="80" r={radius}
          stroke="url(#cd-ring)" strokeWidth="14" strokeLinecap="round" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="cd-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stopColor="hsl(var(--teal))" />
            <stop offset="60%" stopColor="hsl(var(--purple))" />
            <stop offset="100%" stopColor="hsl(var(--gold))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-3xl font-black font-mono text-foreground">{score}</div>
        <div className="text-[9px] text-muted-foreground font-mono mt-1 max-w-[110px] text-center">{label}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value, tone = "teal" }) {
  return (
    <div className="h-2 w-full rounded-full bg-secondary/40 overflow-hidden mt-2">
      <div className={`h-full bg-${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function Eyebrow({ tone = "teal", children }) {
  return <div className={`text-[10px] font-mono tracking-[0.22em] text-${tone} uppercase font-bold`}>{children}</div>;
}

function HeroStat({ label, value, hint, deltaTone = "teal" }) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-b from-card/60 to-card/30 p-4">
      <div className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase">{label}</div>
      <div className="text-2xl font-black font-mono text-foreground mt-1.5">{value}</div>
      {hint && <div className={`text-[10px] font-mono text-${deltaTone} mt-0.5`}>{hint}</div>}
    </div>
  );
}

function KpiCard({ label, value, hint, tone = "teal", Icon }) {
  return (
    <div className={`rounded-2xl border border-${tone}/30 bg-gradient-to-br from-${tone}/10 via-card/40 to-card/20 p-4 relative overflow-hidden`}>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full" style={{ background: `radial-gradient(circle, hsl(var(--${tone}) / 0.18), transparent 70%)` }} />
      <div className="flex items-center justify-between">
        <div className={`text-[9px] font-mono text-${tone} tracking-widest uppercase`}>{label}</div>
        {Icon && <Icon className={`w-3.5 h-3.5 text-${tone}`} />}
      </div>
      <div className="text-2xl font-black font-mono text-foreground mt-1.5">{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}

export default function CommandDashboard() {
  const [posts, setPosts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [history, setHistory] = useState([]); // for the sparkline
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      const platforms = PLATFORM_LIST.map((p) => ({ ...p, connection: "connected" }));
      const p = await fetchMentions({ platforms, queries: DEFAULT_QUERIES, since: Date.now() - 3600_000 });
      if (cancelled) return;
      const m = aggregateMetrics(p);
      const a = evaluateRules({ metrics: m, baseline: null });
      setPosts(p);
      setMetrics(m);
      setAlerts(a);
      setHistory((h) => {
        const next = [...h, { ts: Date.now(), total: m.total, sentiment: m.sentimentScore, reach: m.reach }];
        return next.slice(-24);
      });
      setLoading(false);
    }
    tick();
    const handle = setInterval(tick, 30_000);
    return () => { cancelled = true; clearInterval(handle); };
  }, []);

  // Sentiment ring score is mapped to 0..100 (engine score is -100..100)
  const ringScore = useMemo(() => {
    if (!metrics) return 0;
    return Math.max(0, Math.round((metrics.sentimentScore + 100) / 2));
  }, [metrics]);

  // Positive / neutral / negative split as % for the legend
  const split = useMemo(() => {
    if (!metrics || metrics.total === 0) return { pos: 0, neu: 0, neg: 0 };
    return {
      pos: Math.round((metrics.positive / metrics.total) * 100),
      neu: Math.round((metrics.neutral  / metrics.total) * 100),
      neg: Math.round((metrics.negative / metrics.total) * 100),
    };
  }, [metrics]);

  // Sparkline data — normalize sentiment history into 0..1
  const sparkPoints = useMemo(() => {
    if (history.length < 2) return null;
    const vals = history.map((h) => h.sentiment);
    const min = Math.min(...vals, -10);
    const max = Math.max(...vals, 10);
    const span = Math.max(1, max - min);
    return vals.map((v) => (v - min) / span);
  }, [history]);

  // Trending queries from current window
  const topQueries = useMemo(() => {
    if (!metrics) return [];
    return Object.entries(metrics.perQuery)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([term, count]) => ({ term, count, share: Math.round((count / Math.max(1, metrics.total)) * 100) }));
  }, [metrics]);

  // Channel counts driven by live perPlatform numbers
  const channelStats = useMemo(() => {
    if (!metrics) return [];
    return PLATFORM_LIST.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      mentions: metrics.perPlatform[p.id] || 0,
    }));
  }, [metrics]);

  function exportExecutiveDigest() {
    if (!metrics) return;
    const md = buildDigestMarkdown({ window: "1h", metrics, alerts, posts });
    downloadString(`jamnet-command-${Date.now()}.md`, md, "text/markdown");
  }

  return (
    <div className="space-y-5">
      {/* HERO + SENTIMENT RING */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-5">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/90 via-card/70 to-background p-7">
          <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--teal) / 0.20), transparent 65%)" }} />
          <div className="absolute -left-16 -bottom-20 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--purple) / 0.18), transparent 65%)" }} />
          <Eyebrow tone="teal">awesome dashboard · reporting · metrics · sentiment · channels</Eyebrow>
          <h1 className="font-mono text-3xl md:text-4xl lg:text-5xl font-black mt-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gold via-teal to-purple">
            Architecture intelligence,<br />but make it look elite.
          </h1>
          <p className="text-[11px] text-muted-foreground font-mono mt-3 max-w-[58ch]">
            Executive-and-operator control room for the JAMNet + LitCentral platform.
            Architecture reporting, system metrics, channel analytics, sentiment, and
            social visibility — one cinematic surface.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 relative">
            <HeroStat label="System Health"     value="98.7%"   hint="+1.8% this week"      deltaTone="teal" />
            <HeroStat label="Signals Detected"  value={metrics?.total ?? "…"} hint={`${channelStats.filter((c) => c.mentions > 0).length} channels reporting`} deltaTone="purple" />
            <HeroStat label="Sentiment Score"   value={`${ringScore}/100`}   hint={split.neg > 30 ? "watch emerging friction" : "trend within tolerance"} deltaTone={split.neg > 30 ? "gold" : "teal"} />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-5 relative">
            <button onClick={exportExecutiveDigest} className="px-3 py-1.5 text-[10px] font-bold font-mono bg-gold/15 text-gold border border-gold/40 rounded-md hover:bg-gold/25 flex items-center gap-1.5">
              <FileText className="w-3 h-3" />EXPORT EXECUTIVE DIGEST
            </button>
            {loading && <span className="text-[10px] font-mono text-muted-foreground">syncing live channels…</span>}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-gradient-to-br from-card/90 to-card/40 p-6 flex flex-col">
          <Eyebrow tone="purple">unified sentiment engine</Eyebrow>
          <h2 className="font-mono text-lg font-black mt-2 mb-3">Cross-channel mood pulse</h2>
          <div className="flex justify-center my-2">
            <ScoreRing score={ringScore} />
          </div>
          <div className="flex justify-center gap-3 flex-wrap mt-3 text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal" />Positive {split.pos}%</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue" />Neutral {split.neu}%</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red" />Negative {split.neg}%</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono mt-3">
            Trend + root-cause clusters + per-channel performance surfaced together so action paths stay visible — not a single number floating in space.
          </p>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard tone="teal"   label="P95 LATENCY"        value="238 ms"           hint="Within target"           Icon={Gauge} />
        <KpiCard tone="gold"   label="REPORT SUCCESS"     value="99.2%"            hint="Stable generation"       Icon={CheckCircle2} />
        <KpiCard tone="purple" label="CHANNELS IDENTIFIED" value={channelStats.length} hint="Social + support + product" Icon={Radio} />
        <KpiCard tone="red"    label="ANOMALY ALERTS"      value={String(alerts.length).padStart(2, "0")} hint={`${alerts.filter((a) => a.severity !== "medium").length} need review`} Icon={AlertTriangle} />
      </div>

      {/* TREND + SENTIMENT BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Eyebrow tone="teal">reporting performance</Eyebrow>
            <h2 className="font-mono text-base font-black mt-2 mb-3">Trend view with progressive disclosure</h2>
            <p className="text-[10px] text-muted-foreground font-mono mb-3">
              Top row carries critical KPIs; drill-down on demand. Role-specific reports rather than dashboards that try to show everything at once.
            </p>
            <div className="relative h-[200px] rounded-xl border border-border bg-card/60 overflow-hidden">
              <div className="absolute inset-0" style={{
                background: "repeating-linear-gradient(to right, transparent 0 70px, hsl(var(--border) / 0.5) 70px 71px), repeating-linear-gradient(to top, transparent 0 40px, hsl(var(--border) / 0.5) 40px 41px)",
              }} />
              {sparkPoints
                ? <Sparkline points={sparkPoints} />
                : <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-muted-foreground">collecting sentiment history…</div>
              }
            </div>
            <div className="flex flex-wrap gap-3 mt-3 text-[10px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal" />Architecture health</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple" />Reporting efficiency</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gold" />Sentiment trajectory</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Eyebrow tone="purple">sentiment analysis</Eyebrow>
            <h2 className="font-mono text-base font-black mt-2 mb-3">Signals by topic and urgency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card/60 p-3">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono px-2 py-1 rounded-full bg-teal/10 text-teal border border-teal/30">Positive themes</span>
                <p className="text-[10px] font-mono text-muted-foreground mt-2">Reliability, story-first messaging, community pickup, sourced briefs.</p>
                <ProgressBar value={Math.max(20, split.pos)} tone="teal" />
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-3">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono px-2 py-1 rounded-full bg-red/10 text-red border border-red/30">Negative themes</span>
                <p className="text-[10px] font-mono text-muted-foreground mt-2">Login friction, onboarding confusion, deportation news velocity.</p>
                <ProgressBar value={Math.max(10, split.neg + 10)} tone="red" />
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-3">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono px-2 py-1 rounded-full bg-gold/10 text-gold border border-gold/30">Urgent channels</span>
                <p className="text-[10px] font-mono text-muted-foreground mt-2">X mentions, app reviews, support tickets, live chat escalations.</p>
                <ProgressBar value={64} tone="gold" />
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-3">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono px-2 py-1 rounded-full bg-purple/10 text-purple border border-purple/30">Motor / classifier</span>
                <p className="text-[10px] font-mono text-muted-foreground mt-2">Polarity · intent · aspect tagging · urgency · trend clusters · channel weighting.</p>
                <ProgressBar value={88} tone="purple" />
              </div>
            </div>
          </div>

          {/* Top mentions feed preview */}
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Eyebrow tone="gold">notable mentions</Eyebrow>
            <h2 className="font-mono text-base font-black mt-2 mb-3">Top of feed · last hour</h2>
            <div className="divide-y divide-border">
              {posts.slice(0, 5).map((p) => {
                const Icon = SOCIAL_ICONS[p.platform]?.Icon || Globe;
                const tone = p.sentiment === "positive" ? "teal" : p.sentiment === "negative" ? "red" : "blue";
                return (
                  <div key={p.id} className="py-2 flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-lg bg-${p.platformColor}/15 border border-${p.platformColor}/30 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 text-${p.platformColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-mono text-foreground line-clamp-2">{p.text}</div>
                      <div className="text-[9px] font-mono text-muted-foreground mt-1 flex items-center gap-2">
                        <span className={`text-${tone}`}>{p.sentiment.toUpperCase()}</span>
                        <span>·</span>
                        <span>{p.author}</span>
                        <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" />{p.engagement?.likes ?? 0}</span>
                        <span className="flex items-center gap-0.5"><Send className="w-2.5 h-2.5" />{p.engagement?.shares ?? 0}</span>
                        <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{(p.engagement?.reach ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {posts.length === 0 && <div className="py-4 text-[10px] font-mono text-muted-foreground">no mentions in window yet…</div>}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Eyebrow tone="teal">channels identified</Eyebrow>
            <h2 className="font-mono text-base font-black mt-2 mb-3">Where the system detects signals</h2>
            <div className="flex flex-wrap gap-2">
              {channelStats.map((c) => {
                const Icon = SOCIAL_ICONS[c.id]?.Icon || Globe;
                return (
                  <span key={c.id} className={`inline-flex items-center gap-2 text-[10px] font-mono px-3 py-1.5 rounded-full bg-${c.color}/10 text-${c.color} border border-${c.color}/30`}>
                    <Icon className="w-3 h-3" />
                    {c.name}
                    <span className="text-muted-foreground">· {c.mentions}</span>
                  </span>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {PRESET_CHANNELS.map((c) => (
                <div key={c.id} className="rounded-xl border border-border bg-card/60 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold font-mono text-foreground">{c.title}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground">{c.chip}</span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">{c.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Eyebrow tone="gold">reporting modules</Eyebrow>
            <h2 className="font-mono text-base font-black mt-2 mb-3">Reports that matter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {REPORTS.map((r) => (
                <div key={r.title} className="rounded-xl border border-border bg-card/60 p-3">
                  <div className="text-[11px] font-bold font-mono text-foreground">{r.title}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">{r.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Eyebrow tone="blue">trending queries</Eyebrow>
            <h2 className="font-mono text-base font-black mt-2 mb-3">Top topics · current window</h2>
            <div className="space-y-2">
              {topQueries.length === 0 && <div className="text-[10px] font-mono text-muted-foreground">building topic distribution…</div>}
              {topQueries.map((q) => (
                <div key={q.term}>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-foreground">#{q.term}</span>
                    <span className="text-muted-foreground">{q.count} · {q.share}%</span>
                  </div>
                  <ProgressBar value={q.share} tone="purple" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <Eyebrow tone="red">priority metrics + thresholds</Eyebrow>
            <h2 className="font-mono text-base font-black mt-2 mb-3">Status board</h2>
            <table className="w-full text-[10px] font-mono">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left py-2">Metric</th>
                  <th className="text-left py-2">Current</th>
                  <th className="text-left py-2">Threshold</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["P95 API latency",          "238 ms",                         "< 300 ms", "teal",   "Healthy"],
                  ["Report generation",        "99.2%",                          "> 99%",    "teal",   "Healthy"],
                  ["Negative sentiment drift", `${split.neg}%`,                  "< 25%",    split.neg >= 25 ? "gold" : "teal", split.neg >= 25 ? "Watch" : "Healthy"],
                  ["Mentions in window",       String(metrics?.total ?? 0),      "—",        "blue",   "Live"],
                  ["Channels reporting",       String(channelStats.filter((c) => c.mentions > 0).length), "> 6", channelStats.filter((c) => c.mentions > 0).length >= 6 ? "teal" : "gold", channelStats.filter((c) => c.mentions > 0).length >= 6 ? "Strong" : "Watch"],
                ].map(([metric, current, threshold, tone, status]) => (
                  <tr key={metric} className="border-b border-border last:border-b-0">
                    <td className="py-2 text-foreground">{metric}</td>
                    <td className="py-2 text-foreground">{current}</td>
                    <td className="py-2 text-muted-foreground">{threshold}</td>
                    <td className={`py-2 text-${tone}`}>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-muted-foreground text-center pt-2">
        Overview-first layout · top-row priority KPIs · drill-down reporting · actionable metrics. Sentiment combines trend + channel + root-cause instead of one floating score.
      </div>
    </div>
  );
}
