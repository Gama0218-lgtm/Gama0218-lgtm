import { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { CHAPTERS } from "../../lib/data";

// ─── Motif Registry ────────────────────────────────────────────────────────────
// Density values (0–10) per chapter, hand-calibrated from manuscript knowledge.
const MOTIFS = [
  {
    id: "blood",
    label: "Blood",
    icon: "🩸",
    color: "red",
    desc: "Physical wound, sacrifice, inherited trauma. The body that pays the debt.",
    density: [7,4,2,1,3,2,3,9,8,9,6,5,4,3,8,5,4,3,3,3,4,3,6,3,4,7,3,3,5,7,6,5,3,3,8,7,5,5,10,4,3,4,5,6],
  },
  {
    id: "prayer",
    label: "Prayer",
    icon: "🙏",
    color: "purple",
    desc: "Foxhole liturgy, rosary, Te Deum, Yaqui ceremony. Faith under fire.",
    density: [9,5,1,0,4,2,8,2,4,2,3,7,9,3,2,3,3,2,2,3,2,5,8,2,3,3,2,2,4,4,5,4,5,3,5,4,3,7,5,6,10,4,3,9],
  },
  {
    id: "mathematics",
    label: "Mathematics",
    icon: "🔢",
    color: "blue",
    desc: "The algorithm, 628 days, casualty coordinates. Numbers as weapons of erasure.",
    density: [2,1,9,8,2,2,1,2,1,3,7,5,2,1,1,3,2,7,5,2,4,3,2,2,3,2,3,2,3,2,2,2,3,2,10,3,2,2,3,2,2,2,2,3],
  },
  {
    id: "fire",
    label: "Fire",
    icon: "🔥",
    color: "orange",
    desc: "White phosphorus, napalm, ceremonial flame, the Word was Fire. Destruction and transformation.",
    density: [3,2,4,2,2,2,3,6,5,7,4,3,3,3,6,4,3,3,3,3,3,3,5,5,4,6,3,5,5,8,8,5,4,3,6,8,5,6,10,4,3,4,4,5],
  },
  {
    id: "copper",
    label: "Copper",
    icon: "⚡",
    color: "gold",
    desc: "The taste of fear, blood in the mouth, Pentagon fluorescence. Metallic dread.",
    density: [2,3,5,7,3,4,2,7,6,8,4,3,3,3,5,4,3,5,4,3,5,4,3,4,4,6,4,5,4,6,5,4,3,3,5,4,4,4,6,3,2,3,3,4],
  },
  {
    id: "water",
    label: "Water",
    icon: "💧",
    color: "cyan",
    desc: "Baptism tunnel, monsoon, rice paddy. Purification that does not cleanse.",
    density: [4,9,2,1,5,3,4,4,5,3,3,3,2,3,3,5,4,3,3,3,3,3,6,3,4,4,5,4,3,4,4,4,3,3,4,4,4,5,3,3,4,4,3,5],
  },
  {
    id: "skin",
    label: "Skin",
    icon: "✋",
    color: "teal",
    desc: "Brown skin as target, identifier, and survival armor. The body marked by race.",
    density: [5,3,3,2,3,4,6,4,5,4,4,5,4,4,3,5,5,5,5,6,4,3,3,4,4,7,5,4,4,4,4,5,3,3,5,5,4,4,5,4,4,4,5,6],
  },
  {
    id: "flower",
    label: "Flower / Sewa",
    icon: "🌸",
    color: "purple",
    desc: "Yaqui Sewa — the flower world. Spiritual beauty that persists through violence.",
    density: [9,5,0,0,2,1,4,1,2,1,2,3,2,2,1,2,3,1,2,2,2,2,4,2,2,3,2,1,2,2,2,3,2,2,3,3,3,4,3,3,8,5,4,7],
  },
];

const COLOR_MAP = {
  red: { line: "#ef4444", bg: "rgba(239,68,68,0.15)", border: "border-red/30", text: "text-red", badge: "bg-red/10 text-red border-red/30" },
  purple: { line: "#a855f7", bg: "rgba(168,85,247,0.15)", border: "border-purple/30", text: "text-purple", badge: "bg-purple/10 text-purple border-purple/30" },
  blue: { line: "#60a5fa", bg: "rgba(96,165,250,0.15)", border: "border-blue/30", text: "text-blue", badge: "bg-blue/10 text-blue border-blue/30" },
  orange: { line: "#fb923c", bg: "rgba(251,146,60,0.15)", border: "border-orange/30", text: "text-orange", badge: "bg-orange/10 text-orange border-orange/30" },
  gold: { line: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "border-gold/30", text: "text-gold", badge: "bg-gold/10 text-gold border-gold/30" },
  cyan: { line: "#22d3ee", bg: "rgba(34,211,238,0.15)", border: "border-cyan/30", text: "text-cyan", badge: "bg-cyan/10 text-cyan border-cyan/30" },
  teal: { line: "#14b8a6", bg: "rgba(20,184,166,0.15)", border: "border-teal/30", text: "text-teal", badge: "bg-teal/10 text-teal border-teal/30" },
};

const ACT_BREAKS = [
  { afterCh: 16, label: "Act I → II" },
  { afterCh: 31, label: "Act II → III" },
];

// ─── Spark bar cell ────────────────────────────────────────────────────────────
function DensityBar({ value, color, max = 10, highlight }) {
  const pct = (value / max) * 100;
  const cfg = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <div className={`relative flex flex-col items-center justify-end h-12 w-full cursor-pointer group ${highlight ? "opacity-100" : "opacity-60 hover:opacity-100"} transition-opacity`}>
      <div className="w-full rounded-sm transition-all duration-200"
        style={{ height: `${Math.max(pct, 4)}%`, background: highlight ? cfg.line : cfg.line + "99" }} />
      {value >= 8 && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white opacity-80" />
      )}
    </div>
  );
}

// ─── Overlay heatmap cell ──────────────────────────────────────────────────────
function HeatCell({ value, color }) {
  const cfg = COLOR_MAP[color] || COLOR_MAP.blue;
  const alpha = value / 10;
  return (
    <div className="w-full h-full rounded-sm"
      style={{ background: cfg.line, opacity: Math.max(alpha * 0.85, value > 0 ? 0.07 : 0) }} />
  );
}

export default function MotifMapTab() {
  const [activeMotifs, setActiveMotifs] = useState(["blood", "prayer", "mathematics", "fire"]);
  const [hoveredCh, setHoveredCh] = useState(null);
  const [view, setView] = useState("timeline"); // timeline | heatmap | peaks | ai
  const [aiQuery, setAiQuery] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const toggleMotif = (id) => {
    setActiveMotifs(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const activeMotifData = MOTIFS.filter(m => activeMotifs.includes(m.id));

  // Combined density per chapter (sum of active motifs)
  const combinedDensity = useMemo(() =>
    CHAPTERS.map((ch, i) =>
      activeMotifData.reduce((sum, m) => sum + (m.density[i] || 0), 0)
    ), [activeMotifData]);

  // Peak chapters per motif
  const peaks = useMemo(() =>
    MOTIFS.map(m => {
      const maxVal = Math.max(...m.density);
      const peakChs = m.density.map((v, i) => ({ ch: i + 1, v })).filter(x => x.v >= maxVal - 1);
      return { ...m, peak: maxVal, peakChs };
    }), []);

  // Co-occurrence: chapters where 3+ active motifs peak together (≥6)
  const coOccurrence = useMemo(() =>
    CHAPTERS.map((ch, i) => {
      const highs = activeMotifData.filter(m => (m.density[i] || 0) >= 6);
      return { ch: ch.ch, title: ch.title, count: highs.length, motifs: highs };
    }).filter(x => x.count >= 2).sort((a, b) => b.count - a.count).slice(0, 8),
    [activeMotifData]);

  const runAiAnalysis = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    const motifSummary = activeMotifData.map(m => {
      const peaks = m.density.map((v, i) => ({ ch: i + 1, v })).filter(x => x.v >= 7).map(x => `Ch.${x.ch}(${x.v})`).join(", ");
      return `${m.label}: peaks at ${peaks || "none above 7"}`;
    }).join("\n");

    const prompt = `You are the LitCentral Editorial Intelligence Engine analyzing "SGT George Ramos: The Mathematics of Vietnam" — 44 chapters, Chicano Vietnam War narrative.

MOTIF DENSITY DATA (scale 0–10 per chapter):
${motifSummary}

ACTIVE MOTIFS: ${activeMotifData.map(m => m.label).join(", ")}

USER QUERY: ${aiQuery}

Provide specific, chapter-cited editorial intelligence about these motif patterns. Reference exact chapter numbers. Be forensic and actionable — the author needs editorial direction.`;

    const res = await base44.integrations.Core.InvokeLLM({ prompt, model: "claude_sonnet_4_6" });
    setAiResult(res);
    setAiLoading(false);
  };

  const hoveredChData = hoveredCh ? CHAPTERS.find(c => c.ch === hoveredCh) : null;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-orange/5 border border-orange/30 rounded-lg p-3 flex items-start gap-3">
        <div className="text-xl">🗺️</div>
        <div>
          <div className="text-sm font-black font-mono text-orange">MOTIF MAP — Thematic Thread Intelligence</div>
          <div className="text-[10px] text-muted-foreground font-sans">Track {MOTIFS.length} recurring motifs across 44 chapters · density peaks · co-occurrence · AI coherence analysis</div>
        </div>
      </div>

      {/* Motif toggles */}
      <div>
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Active Motifs — click to toggle</div>
        <div className="flex flex-wrap gap-2">
          {MOTIFS.map(m => {
            const active = activeMotifs.includes(m.id);
            const cfg = COLOR_MAP[m.color];
            return (
              <button key={m.id} onClick={() => toggleMotif(m.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold font-mono transition-all ${active ? `${cfg.badge} border` : "border-border text-muted-foreground bg-card hover:border-muted-foreground/40"}`}>
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View switcher */}
      <div className="flex gap-1.5">
        {[
          { id: "timeline", label: "📈 Timeline" },
          { id: "heatmap",  label: "🌡️ Heatmap" },
          { id: "peaks",    label: "⛰️ Peaks & Co-occurrence" },
          { id: "ai",       label: "🧠 AI Analysis" },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-mono border transition-all ${view === v.id ? "bg-orange text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ── TIMELINE VIEW ── */}
      {view === "timeline" && (
        <div className="space-y-4">
          {/* Act labels + chapter hover info */}
          {hoveredChData && (
            <div className="p-3 bg-card border border-border rounded-lg flex items-start gap-4 flex-wrap animate-slide-up">
              <div>
                <div className="text-[8px] font-bold text-muted-foreground font-mono mb-0.5">CHAPTER</div>
                <div className="text-xs font-black font-mono text-foreground">Ch.{hoveredChData.ch} — {hoveredChData.title}</div>
                <div className="text-[9px] text-muted-foreground font-mono">Act {hoveredChData.act} · Ω{hoveredChData.omega}</div>
              </div>
              <div className="flex flex-wrap gap-3">
                {activeMotifData.map(m => {
                  const val = m.density[hoveredChData.ch - 1] || 0;
                  const cfg = COLOR_MAP[m.color];
                  return (
                    <div key={m.id} className="text-center">
                      <div className={`text-base font-black font-mono ${cfg.text}`}>{val}</div>
                      <div className="text-[8px] text-muted-foreground font-mono">{m.icon} {m.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Per-motif spark rows */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Act header */}
                <div className="flex px-3 pt-3 pb-1 gap-0.5">
                  {/* Label column */}
                  <div className="w-28 flex-shrink-0" />
                  {CHAPTERS.map((ch, i) => {
                    const isActBreak = ACT_BREAKS.some(b => b.afterCh === ch.ch);
                    return (
                      <div key={ch.ch} className={`flex-1 text-center text-[7px] font-mono text-muted-foreground ${isActBreak ? "border-r border-border/60" : ""}`}>
                        {ch.ch % 5 === 0 || ch.ch === 1 || ch.ch === 44 ? ch.ch : ""}
                      </div>
                    );
                  })}
                </div>

                {/* Act band labels */}
                <div className="flex px-3 pb-2 gap-0.5">
                  <div className="w-28 flex-shrink-0" />
                  <div className="flex-1 text-[7px] font-bold font-mono text-gold border-r border-border/60 pr-1">ACT I · Ch.1–16</div>
                  <div className="flex-1 text-[7px] font-bold font-mono text-blue border-r border-border/60 pr-1">ACT II · Ch.17–31</div>
                  <div className="flex-1 text-[7px] font-bold font-mono text-teal pl-1">ACT III · Ch.32–44</div>
                </div>

                {/* Motif rows */}
                {activeMotifData.map(m => (
                  <div key={m.id} className="flex items-end px-3 pb-1 gap-0.5 group">
                    <div className={`w-28 flex-shrink-0 flex items-center gap-1.5 text-[9px] font-bold font-mono ${COLOR_MAP[m.color].text} pb-1`}>
                      <span>{m.icon}</span>
                      <span className="truncate">{m.label}</span>
                    </div>
                    {m.density.map((val, i) => {
                      const ch = CHAPTERS[i];
                      const isActBreak = ACT_BREAKS.some(b => b.afterCh === ch.ch);
                      return (
                        <div key={ch.ch}
                          className={`flex-1 ${isActBreak ? "border-r border-border/40 pr-0.5" : ""}`}
                          onMouseEnter={() => setHoveredCh(ch.ch)}
                          onMouseLeave={() => setHoveredCh(null)}>
                          <DensityBar value={val} color={m.color} highlight={hoveredCh === ch.ch} />
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Combined density row */}
                <div className="flex items-end px-3 pt-2 pb-3 gap-0.5 border-t border-border/40 mt-1">
                  <div className="w-28 flex-shrink-0 text-[9px] font-bold font-mono text-muted-foreground pb-1">COMBINED</div>
                  {combinedDensity.map((val, i) => {
                    const ch = CHAPTERS[i];
                    const max = Math.max(...combinedDensity);
                    const pct = (val / max) * 100;
                    return (
                      <div key={ch.ch} className="flex-1 flex flex-col items-center justify-end h-6"
                        onMouseEnter={() => setHoveredCh(ch.ch)}
                        onMouseLeave={() => setHoveredCh(null)}>
                        <div className="w-full rounded-sm bg-foreground/20 transition-all"
                          style={{ height: `${Math.max(pct, 4)}%` }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-[9px] font-mono">
            {activeMotifData.map(m => (
              <div key={m.id} className={`flex items-center gap-1.5 ${COLOR_MAP[m.color].text}`}>
                <span>{m.icon}</span>
                <span className="font-bold">{m.label}:</span>
                <span className="text-muted-foreground">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HEATMAP VIEW ── */}
      {view === "heatmap" && (
        <div className="space-y-3">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            Each cell = motif intensity in that chapter (0–10). Darker = stronger presence. Hover a chapter column to inspect.
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[700px] p-3">
                {/* Chapter numbers */}
                <div className="flex gap-0.5 mb-1">
                  <div className="w-32 flex-shrink-0" />
                  {CHAPTERS.map(ch => (
                    <div key={ch.ch}
                      className={`flex-1 text-center text-[7px] font-mono cursor-pointer transition-colors ${hoveredCh === ch.ch ? "text-gold" : "text-muted-foreground"}`}
                      onMouseEnter={() => setHoveredCh(ch.ch)}
                      onMouseLeave={() => setHoveredCh(null)}>
                      {ch.ch % 5 === 0 || ch.ch === 1 || ch.ch === 44 ? ch.ch : "·"}
                    </div>
                  ))}
                </div>

                {/* Heatmap rows */}
                {activeMotifData.map(m => (
                  <div key={m.id} className="flex gap-0.5 mb-0.5">
                    <div className={`w-32 flex-shrink-0 flex items-center gap-1.5 text-[9px] font-bold font-mono ${COLOR_MAP[m.color].text} pr-2`}>
                      <span>{m.icon}</span>
                      <span className="truncate">{m.label}</span>
                    </div>
                    {m.density.map((val, i) => {
                      const ch = CHAPTERS[i];
                      return (
                        <div key={ch.ch} className="flex-1 h-7 rounded-sm overflow-hidden"
                          onMouseEnter={() => setHoveredCh(ch.ch)}
                          onMouseLeave={() => setHoveredCh(null)}>
                          <HeatCell value={val} color={m.color} />
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Act bands beneath */}
                <div className="flex gap-0.5 mt-3 pt-2 border-t border-border/40">
                  <div className="w-32 flex-shrink-0 text-[7px] font-mono text-muted-foreground">ACT</div>
                  {CHAPTERS.map(ch => (
                    <div key={ch.ch}
                      className={`flex-1 h-1.5 rounded-full ${ch.act === "I" ? "bg-gold/40" : ch.act === "II" ? "bg-blue/40" : "bg-teal/40"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hover tooltip */}
          {hoveredCh && (
            <div className="p-3 bg-card border border-border rounded-lg animate-slide-up">
              <div className="text-[9px] font-bold font-mono text-foreground mb-2">
                Ch.{hoveredCh} — {CHAPTERS.find(c => c.ch === hoveredCh)?.title}
              </div>
              <div className="flex flex-wrap gap-3">
                {activeMotifData.map(m => {
                  const val = m.density[hoveredCh - 1] || 0;
                  return (
                    <div key={m.id} className={`flex items-center gap-1 text-[9px] font-mono ${val >= 7 ? COLOR_MAP[m.color].text : "text-muted-foreground"}`}>
                      <span>{m.icon}</span>
                      <span className="font-bold">{val}</span>
                      <span>/10</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PEAKS & CO-OCCURRENCE ── */}
      {view === "peaks" && (
        <div className="space-y-4">
          {/* Peak chapters per active motif */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {peaks.filter(m => activeMotifs.includes(m.id)).map(m => {
              const cfg = COLOR_MAP[m.color];
              return (
                <div key={m.id} className={`bg-card border ${cfg.border} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{m.icon}</span>
                    <div>
                      <div className={`text-xs font-black font-mono ${cfg.text}`}>{m.label}</div>
                      <div className="text-[9px] text-muted-foreground font-sans">{m.desc}</div>
                    </div>
                    <div className="ml-auto text-center">
                      <div className={`text-xl font-black font-mono ${cfg.text}`}>{m.peak}</div>
                      <div className="text-[8px] text-muted-foreground font-mono">peak</div>
                    </div>
                  </div>

                  {/* Mini sparkline */}
                  <div className="flex items-end gap-px h-8 mb-2">
                    {m.density.map((val, i) => (
                      <div key={i} className="flex-1 rounded-sm transition-all"
                        style={{ height: `${(val / 10) * 100}%`, background: val >= m.peak - 1 ? COLOR_MAP[m.color].line : COLOR_MAP[m.color].line + "44" }} />
                    ))}
                  </div>

                  <div className="text-[9px] text-muted-foreground font-mono mb-1">Peak chapters:</div>
                  <div className="flex flex-wrap gap-1">
                    {m.peakChs.map(p => {
                      const ch = CHAPTERS.find(c => c.ch === p.ch);
                      return (
                        <span key={p.ch} className={`text-[8px] px-1.5 py-0.5 rounded font-mono border ${cfg.badge}`}>
                          Ch.{p.ch} · {ch?.title?.substring(0, 20) || ""}…
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Co-occurrence table */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-3">
              High Co-occurrence Chapters — 2+ active motifs at intensity ≥6
            </div>
            {coOccurrence.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-4">Select more motifs to reveal co-occurrence chapters.</div>
            ) : (
              <div className="space-y-2">
                {coOccurrence.map(item => (
                  <div key={item.ch} className="flex items-center gap-3 p-2.5 bg-background rounded-lg border border-border">
                    <div className="min-w-[48px] text-center">
                      <div className="text-sm font-black font-mono text-gold">{item.count}</div>
                      <div className="text-[8px] text-muted-foreground font-mono">motifs</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-foreground">Ch.{item.ch} — {item.title}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.motifs.map(m => (
                          <span key={m.id} className={`text-[8px] px-1.5 py-0.5 rounded border font-mono ${COLOR_MAP[m.color].badge}`}>
                            {m.icon} {m.label} ({m.density[item.ch - 1]})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Motif arc summary */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-3">Motif Arc Summary — Act trajectory</div>
            <div className="space-y-2">
              {peaks.filter(m => activeMotifs.includes(m.id)).map(m => {
                const act1avg = (m.density.slice(0,16).reduce((a,b)=>a+b,0)/16).toFixed(1);
                const act2avg = (m.density.slice(16,31).reduce((a,b)=>a+b,0)/15).toFixed(1);
                const act3avg = (m.density.slice(31,44).reduce((a,b)=>a+b,0)/13).toFixed(1);
                const trend = parseFloat(act3avg) > parseFloat(act1avg) ? "↑ Rising" : parseFloat(act3avg) < parseFloat(act1avg) ? "↓ Falling" : "→ Stable";
                const cfg = COLOR_MAP[m.color];
                return (
                  <div key={m.id} className="flex items-center gap-3 flex-wrap">
                    <div className={`flex items-center gap-1 w-28 flex-shrink-0 text-[9px] font-bold font-mono ${cfg.text}`}>
                      <span>{m.icon}</span><span>{m.label}</span>
                    </div>
                    {[["I", act1avg, "gold"], ["II", act2avg, "blue"], ["III", act3avg, "teal"]].map(([act, avg, col]) => (
                      <div key={act} className="text-center">
                        <div className={`text-xs font-black font-mono text-${col}`}>{avg}</div>
                        <div className="text-[8px] text-muted-foreground font-mono">Act {act}</div>
                      </div>
                    ))}
                    <span className={`text-[9px] font-bold font-mono ${parseFloat(act3avg) > parseFloat(act1avg) ? "text-teal" : parseFloat(act3avg) < parseFloat(act1avg) ? "text-red" : "text-muted-foreground"}`}>{trend}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── AI ANALYSIS ── */}
      {view === "ai" && (
        <div className="space-y-4">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            Ask the intelligence engine about your selected motif patterns — thematic coherence, chapter gaps, density imbalances, or structural recommendations.
          </div>

          {/* Quick prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Where does the Blood motif peak and does it align with the manuscript's emotional climaxes?",
              "Are the Prayer and Flower/Sewa motifs coherently distributed across all three acts?",
              "Which chapters show dangerous co-occurrence — too many motifs competing for the reader's attention?",
              "Where are the motif desert zones — chapters where all active motifs drop below 3? Are they intentional?",
              "Does the Mathematics motif have a satisfying arc from introduction in Act I to resolution in Act III?",
              "Where should Fire appear more to reinforce the 'Word was Fire' theological thread?",
            ].map((p, i) => (
              <button key={i} onClick={() => setAiQuery(p)}
                className={`text-left p-2.5 rounded-lg border text-[9px] font-sans transition-all ${aiQuery === p ? "border-orange/50 bg-orange/10 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"}`}>
                <span className="text-orange font-bold mr-1">#{i+1}</span>{p}
              </button>
            ))}
          </div>

          <textarea value={aiQuery} onChange={e => setAiQuery(e.target.value)}
            placeholder="Ask about motif patterns, coherence gaps, thematic density, or structural recommendations..."
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground resize-none h-20 focus:outline-none focus:border-orange/50" />

          <button onClick={runAiAnalysis} disabled={aiLoading || !aiQuery.trim()}
            className="px-5 py-2 bg-orange text-white rounded-lg text-xs font-bold font-mono disabled:opacity-40 hover:bg-orange/80 transition-all">
            {aiLoading ? "Analyzing motif patterns..." : "▶ RUN MOTIF ANALYSIS"}
          </button>

          {aiLoading && (
            <div className="bg-orange/5 border border-orange/20 rounded-lg p-6 text-center">
              <div className="text-orange font-mono text-sm font-bold mb-1">Scanning motif threads across 44 chapters...</div>
              <div className="flex justify-center gap-1 mt-3">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}

          {aiResult && !aiLoading && (
            <div className="bg-card border border-orange/20 rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b border-border bg-orange/5">
                <span className="text-[9px] font-bold font-mono text-orange">MOTIF ANALYSIS · Claude Sonnet</span>
              </div>
              <div className="p-4 text-xs font-sans text-foreground/80 leading-relaxed whitespace-pre-wrap">{aiResult}</div>
              <div className="px-4 py-2 border-t border-border">
                <button onClick={() => { setAiResult(null); setAiQuery(""); }} className="text-[9px] font-mono text-muted-foreground hover:text-foreground">Clear · New query</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}