import { useEffect, useMemo, useRef, useState } from "react";
import {
  Radio, Wifi, WifiOff, AlertTriangle, RefreshCw, Play, Pause,
  Download, FileText, Bell, Filter, TrendingUp, MessageCircle, Eye, ThumbsUp,
} from "lucide-react";
import {
  PLATFORM_LIST, DEFAULT_QUERIES, DEFAULT_RULES,
  fetchMentions, aggregateMetrics, evaluateRules,
  buildDigestMarkdown, buildDigestCSV, downloadString, startAutomation,
} from "../../lib/socialListening";

const WINDOWS = [
  { id: "15m", label: "15m", ms: 15 * 60_000 },
  { id: "1h",  label: "1h",  ms: 60 * 60_000 },
  { id: "24h", label: "24h", ms: 24 * 60 * 60_000 },
  { id: "7d",  label: "7d",  ms: 7 * 24 * 60 * 60_000 },
];

const SENTIMENT_COLORS = {
  positive: "teal",
  neutral:  "blue",
  negative: "red",
};

// Initial connection model — in production this should be supplied by the
// session / auth layer. We mark the always-public News/RSS source live and
// the rest as needs_auth so the user sees the connect/automate flow.
const INITIAL_CONNECTIONS = {
  x:         "connected",
  reddit:    "connected",
  youtube:   "connected",
  tiktok:    "needs_auth",
  instagram: "needs_auth",
  facebook:  "needs_auth",
  linkedin:  "needs_auth",
  news:      "connected",
};

function ConnectionPill({ status }) {
  const map = {
    connected:    { Icon: Wifi,         tone: "teal",   label: "LIVE" },
    needs_auth:   { Icon: WifiOff,      tone: "gold",   label: "AUTH" },
    rate_limited: { Icon: AlertTriangle,tone: "orange", label: "RATE" },
    disconnected: { Icon: WifiOff,      tone: "red",    label: "OFF"  },
    error:        { Icon: AlertTriangle,tone: "red",    label: "ERR"  },
  };
  const { Icon, tone, label } = map[status] || map.disconnected;
  return (
    <span className={`inline-flex items-center gap-1 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border bg-${tone}/10 border-${tone}/40 text-${tone}`}>
      <Icon className="w-2.5 h-2.5" />{label}
    </span>
  );
}

function MetricCard({ tone = "gold", label, value, hint }) {
  return (
    <div className={`rounded-lg border border-${tone}/20 bg-${tone}/5 p-3`}>
      <div className={`text-[9px] font-mono text-${tone} tracking-wider`}>{label}</div>
      <div className="text-xl font-black font-mono text-foreground mt-1">{value}</div>
      {hint && <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{hint}</div>}
    </div>
  );
}

function SeverityBadge({ severity }) {
  const tone = severity === "critical" ? "red" : severity === "high" ? "orange" : severity === "medium" ? "gold" : "teal";
  return <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-${tone}/15 text-${tone} border border-${tone}/40`}>{severity.toUpperCase()}</span>;
}

export default function SocialListeningGrid() {
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [enabled, setEnabled]       = useState(() => Object.fromEntries(PLATFORM_LIST.map((p) => [p.id, true])));
  const [queries, setQueries]       = useState(DEFAULT_QUERIES);
  const [newQuery, setNewQuery]     = useState("");
  const [windowId, setWindowId]     = useState("1h");
  const [autoOn, setAutoOn]         = useState(true);
  const [intervalSec, setIntervalSec] = useState(60);
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [filterPlatform, setFilterPlatform]   = useState("all");
  const [posts, setPosts]   = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0, positive: 0, negative: 0, neutral: 0, reach: 0, engagement: 0,
    sentimentScore: 0, perPlatform: {}, perQuery: {}, topAuthors: [],
  });
  const [alerts, setAlerts]   = useState([]);
  const [history, setHistory] = useState([]); // last few digest snapshots
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef(null);
  const win = WINDOWS.find((w) => w.id === windowId) || WINDOWS[1];

  const platformsToFetch = useMemo(
    () => PLATFORM_LIST
      .filter((p) => enabled[p.id])
      .map((p) => ({ ...p, connection: connections[p.id] }))
      .filter((p) => p.connection !== "disconnected" && p.connection !== "needs_auth"),
    [enabled, connections]
  );

  // Polling / automation lifecycle.
  useEffect(() => {
    if (cancelRef.current) cancelRef.current();
    if (!autoOn) return;
    setLoading(true);
    cancelRef.current = startAutomation({
      platforms: platformsToFetch,
      queries,
      windowMs: win.ms,
      intervalMs: intervalSec * 1000,
      run: ({ posts: p, metrics: m, alerts: a }) => {
        setPosts(p);
        setMetrics(m);
        setAlerts(a);
        setLoading(false);
        if (a.length) {
          setHistory((h) => [
            { ts: Date.now(), count: m.total, sentiment: m.sentimentScore, alerts: a.length },
            ...h,
          ].slice(0, 10));
        }
      },
    });
    return () => cancelRef.current && cancelRef.current();
  }, [autoOn, platformsToFetch, queries, win.ms, intervalSec]);

  async function refreshOnce() {
    setLoading(true);
    const p = await fetchMentions({ platforms: platformsToFetch, queries, since: Date.now() - win.ms });
    const m = aggregateMetrics(p);
    const a = evaluateRules({ metrics: m, baseline: null });
    setPosts(p); setMetrics(m); setAlerts(a);
    setLoading(false);
  }

  function addQuery() {
    const term = newQuery.trim();
    if (!term) return;
    setQueries((q) => [...q, { id: `q${Date.now()}`, term, group: "Custom", weight: 0.5 }]);
    setNewQuery("");
  }

  function removeQuery(id) {
    setQueries((q) => q.filter((x) => x.id !== id));
  }

  function reconnect(platformId) {
    setConnections((c) => ({ ...c, [platformId]: "connected" }));
  }

  function disconnect(platformId) {
    setConnections((c) => ({ ...c, [platformId]: "disconnected" }));
  }

  function exportDigestMd() {
    const md = buildDigestMarkdown({ window: win.label, metrics, alerts, posts });
    downloadString(`jamnet-digest-${win.id}-${Date.now()}.md`, md, "text/markdown");
  }

  function exportDigestCsv() {
    const csv = buildDigestCSV(posts);
    downloadString(`jamnet-mentions-${win.id}-${Date.now()}.csv`, csv, "text/csv");
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (filterSentiment !== "all" && p.sentiment !== filterSentiment) return false;
      if (filterPlatform !== "all" && p.platform !== filterPlatform) return false;
      return true;
    });
  }, [posts, filterSentiment, filterPlatform]);

  const connectedCount = Object.values(connections).filter((s) => s === "connected").length;
  const totalPlatforms = PLATFORM_LIST.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple" />
            <h2 className="text-sm font-black font-mono text-purple tracking-widest">SOCIAL LISTENING GRID</h2>
            <span className="text-[8px] font-mono text-muted-foreground border border-purple/20 bg-purple/5 px-1.5 py-0.5 rounded">
              {connectedCount}/{totalPlatforms} CONNECTED
            </span>
            {loading && (
              <span className="text-[8px] font-mono text-gold flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />syncing…
              </span>
            )}
          </div>
          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">
            Multi-platform mentions · sentiment + reach intel · automated digest reporting
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAutoOn((v) => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono border ${autoOn ? "bg-teal/15 text-teal border-teal/40" : "bg-secondary/40 text-muted-foreground border-border"}`}>
            {autoOn ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}{autoOn ? "AUTO ON" : "AUTO OFF"}
          </button>
          <button onClick={refreshOnce} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono bg-secondary/40 text-foreground border border-border hover:bg-secondary/60">
            <RefreshCw className="w-3 h-3" />REFRESH
          </button>
          <button onClick={exportDigestMd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono bg-gold/15 text-gold border border-gold/40 hover:bg-gold/25">
            <FileText className="w-3 h-3" />DIGEST .MD
          </button>
          <button onClick={exportDigestCsv} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono bg-blue/15 text-blue border border-blue/40 hover:bg-blue/25">
            <Download className="w-3 h-3" />EXPORT .CSV
          </button>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <MetricCard tone="purple" label="MENTIONS"      value={metrics.total} hint={`${win.label} window`} />
        <MetricCard tone="teal"   label="SENTIMENT"     value={`${metrics.sentimentScore}/100`} hint={`${metrics.positive}+ / ${metrics.negative}-`} />
        <MetricCard tone="gold"   label="REACH"         value={metrics.reach.toLocaleString()} hint="estimated impressions" />
        <MetricCard tone="orange" label="ENGAGEMENT"    value={metrics.engagement.toLocaleString()} hint="likes + shares + comments" />
        <MetricCard tone="blue"   label="PLATFORMS"     value={Object.keys(metrics.perPlatform).length} hint="reporting in window" />
        <MetricCard tone="red"    label="ALERTS"        value={alerts.length} hint="rules fired" />
      </div>

      {/* Platforms strip */}
      <div className="rounded-lg border border-border bg-card/40">
        <div className="px-3 py-2 border-b border-border flex items-center justify-between">
          <div className="text-[10px] font-bold font-mono text-foreground tracking-widest">PLATFORMS</div>
          <div className="text-[9px] font-mono text-muted-foreground">Toggle to include in stream + report</div>
        </div>
        <div className="p-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {PLATFORM_LIST.map((p) => {
            const status = connections[p.id];
            const isOn = enabled[p.id];
            const count = metrics.perPlatform[p.id] || 0;
            return (
              <div key={p.id} className={`rounded-md border bg-card/60 p-2 ${isOn ? `border-${p.color}/40` : "border-border opacity-70"}`}>
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-bold font-mono text-${p.color}`}>{p.name}</span>
                  <ConnectionPill status={status} />
                </div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">{count} mentions</div>
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={() => setEnabled((e) => ({ ...e, [p.id]: !e[p.id] }))} className={`flex-1 text-[9px] font-bold font-mono px-2 py-1 rounded border ${isOn ? `bg-${p.color}/10 text-${p.color} border-${p.color}/40` : "bg-secondary/40 text-muted-foreground border-border"}`}>
                    {isOn ? "TRACKING" : "PAUSED"}
                  </button>
                  {status === "needs_auth" || status === "disconnected" ? (
                    <button onClick={() => reconnect(p.id)} className="text-[9px] font-bold font-mono px-2 py-1 rounded bg-gold/15 text-gold border border-gold/40">CONNECT</button>
                  ) : (
                    <button onClick={() => disconnect(p.id)} className="text-[9px] font-bold font-mono px-2 py-1 rounded bg-secondary/40 text-muted-foreground border border-border">CUT</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Queries + Automation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card/40 p-3 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-bold font-mono text-foreground tracking-widest">TRACKED QUERIES</div>
            <div className="text-[9px] font-mono text-muted-foreground">{queries.length} terms · grouped by Ψ(t) cohort</div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {queries.map((q) => (
              <span key={q.id} className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-purple/10 text-purple border border-purple/40">
                {q.term}
                <span className="text-[8px] text-muted-foreground">· {q.group}</span>
                <button onClick={() => removeQuery(q.id)} className="text-muted-foreground hover:text-red ml-1">×</button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addQuery()}
              placeholder="add a keyword, handle, or hashtag…"
              className="flex-1 bg-background border border-border rounded px-2 py-1.5 text-[11px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple/60"
            />
            <button onClick={addQuery} className="px-3 py-1.5 text-[10px] font-bold font-mono bg-purple/20 text-purple border border-purple/40 rounded">ADD</button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/40 p-3">
          <div className="text-[10px] font-bold font-mono text-foreground tracking-widest mb-2">AUTOMATION</div>
          <label className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-2">
            <span>Window</span>
            <select value={windowId} onChange={(e) => setWindowId(e.target.value)} className="bg-background border border-border rounded text-foreground text-[10px] font-mono px-2 py-1">
              {WINDOWS.map((w) => <option key={w.id} value={w.id}>{w.label}</option>)}
            </select>
          </label>
          <label className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-2">
            <span>Refresh every</span>
            <select value={intervalSec} onChange={(e) => setIntervalSec(Number(e.target.value))} className="bg-background border border-border rounded text-foreground text-[10px] font-mono px-2 py-1">
              <option value={30}>30s</option>
              <option value={60}>1m</option>
              <option value={300}>5m</option>
              <option value={900}>15m</option>
              <option value={3600}>1h</option>
            </select>
          </label>
          <div className="text-[9px] font-mono text-muted-foreground mb-1">Active rules</div>
          <ul className="space-y-1">
            {DEFAULT_RULES.map((r) => (
              <li key={r.id} className="text-[9px] font-mono flex items-center justify-between">
                <span className="text-foreground">• {r.label}</span>
                <SeverityBadge severity={r.severity} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Alerts */}
      <div className="rounded-lg border border-border bg-card/40">
        <div className="px-3 py-2 border-b border-border flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-gold" />
          <div className="text-[10px] font-bold font-mono text-foreground tracking-widest">FIRED ALERTS</div>
          <span className="text-[9px] font-mono text-muted-foreground">{alerts.length} in window</span>
        </div>
        <div className="divide-y divide-border">
          {alerts.length === 0 && (
            <div className="px-3 py-3 text-[10px] font-mono text-muted-foreground">No automation rules fired in this window. Listening continues.</div>
          )}
          {alerts.map((a) => (
            <div key={a.id} className="px-3 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={a.severity} />
                <span className="text-[10px] font-mono text-foreground">{a.label}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground truncate">{a.message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Mentions feed */}
      <div className="rounded-lg border border-border bg-card/40">
        <div className="px-3 py-2 border-b border-border flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-blue" />
          <div className="text-[10px] font-bold font-mono text-foreground tracking-widest">FEED</div>
          <select value={filterSentiment} onChange={(e) => setFilterSentiment(e.target.value)} className="ml-auto bg-background border border-border rounded text-foreground text-[10px] font-mono px-2 py-1">
            <option value="all">All sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} className="bg-background border border-border rounded text-foreground text-[10px] font-mono px-2 py-1">
            <option value="all">All platforms</option>
            {PLATFORM_LIST.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
          {filteredPosts.length === 0 && (
            <div className="px-3 py-4 text-[10px] font-mono text-muted-foreground">No matching mentions in this window.</div>
          )}
          {filteredPosts.map((p) => {
            const tone = SENTIMENT_COLORS[p.sentiment] || "blue";
            const platformTone = p.platformColor || "purple";
            return (
              <div key={p.id} className="px-3 py-2 grid grid-cols-12 gap-2 items-start">
                <div className="col-span-2 flex flex-col gap-1">
                  <span className={`text-[9px] font-bold font-mono text-${platformTone}`}>{p.platformName}</span>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded bg-${tone}/15 text-${tone} border border-${tone}/40 w-fit`}>
                    {p.sentiment.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-7">
                  <div className="text-[11px] font-mono text-foreground line-clamp-2">{p.text}</div>
                  <div className="text-[9px] font-mono text-muted-foreground mt-0.5">
                    {p.author || "—"} · {p.query ? <span className="text-purple">#{p.query}</span> : null} · {new Date(p.timestamp || Date.now()).toLocaleTimeString()}
                  </div>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-2 text-[9px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />{p.engagement?.likes || 0}</span>
                  <span className="flex items-center gap-0.5"><MessageCircle className="w-3 h-3" />{p.engagement?.comments || 0}</span>
                  <span className="flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />{p.engagement?.shares || 0}</span>
                  <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{(p.engagement?.reach || 0).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Snapshot history */}
      <div className="rounded-lg border border-border bg-card/40 p-3">
        <div className="text-[10px] font-bold font-mono text-foreground tracking-widest mb-2">DIGEST HISTORY</div>
        {history.length === 0 ? (
          <div className="text-[10px] font-mono text-muted-foreground">No automated digests have been written this session. Alerts will trigger a snapshot.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {history.map((h) => (
              <div key={h.ts} className="rounded border border-border bg-card/60 p-2">
                <div className="text-[9px] font-mono text-muted-foreground">{new Date(h.ts).toLocaleString()}</div>
                <div className="text-[11px] font-mono text-foreground">{h.count} mentions · {h.sentiment}/100</div>
                <div className="text-[9px] font-mono text-gold">{h.alerts} alert{h.alerts === 1 ? "" : "s"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
