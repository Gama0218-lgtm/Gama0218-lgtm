import { useState, useMemo } from "react";
import DashCard from "./DashCard";
import { REVISION_MATRIX, MANUSCRIPT_STATS, QUALITY_GATES, SENSORY_CONSTANTS } from "../../lib/revisionData";

// ── Helpers ─────────────────────────────────────────────────────────────────

const TIER_CONFIG = {
  "OMEGA ELITE": { color:"text-gold", border:"border-gold/50", bg:"bg-gold/10",     dot:"#F5C842" },
  "GOLD+":        { color:"text-gold", border:"border-gold/30", bg:"bg-gold/5",      dot:"#F5C842" },
  "GOLD":         { color:"text-blue", border:"border-blue/30", bg:"bg-blue/5",      dot:"#4A9EFF" },
};

const ACT_COLOR = { I:"#F5C842", II:"#4A9EFF", III:"#1CCFB4" };

function GapBadge({ label, value }) {
  const num = parseFloat(value);
  const color = num > 3 ? "text-teal" : num < -3 ? "text-red" : num < 0 ? "text-gold" : "text-muted-foreground";
  return (
    <span className={`text-[9px] font-mono font-bold ${color}`}>
      {label}: {value}
    </span>
  );
}

function OmegaBar({ eff, raw }) {
  const pct = Math.max(0, Math.min(100, ((eff - 100) / 8) * 100));
  const isElite = eff >= 107;
  const isGoldPlus = eff >= 106;
  const penalty = raw > eff ? (raw - eff).toFixed(2) : null;
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full"
          style={{ width:`${pct}%`, backgroundColor: isElite ? "#F5C842" : isGoldPlus ? "#F5C842" : "#4A9EFF" }} />
      </div>
      <span className={`text-[10px] font-black font-mono ${isElite ? "text-gold" : isGoldPlus ? "text-gold" : "text-foreground"}`}>
        {eff.toFixed(2)}
      </span>
      {penalty && <span className="text-[8px] text-red font-mono">(-{penalty})</span>}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function ChapterRevisionTab() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [actFilter, setActFilter] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [sortBy, setSortBy] = useState("ch");

  const filtered = useMemo(() => {
    let list = [...REVISION_MATRIX];
    if (actFilter !== "all") list = list.filter(c => c.act === actFilter);
    if (filter === "elite")   list = list.filter(c => c.tier === "OMEGA ELITE");
    if (filter === "goldplus") list = list.filter(c => c.tier === "GOLD+");
    if (filter === "gold")    list = list.filter(c => c.tier === "GOLD");
    if (filter === "crit")    list = list.filter(c => c.criticalError);
    if (filter === "struct")  list = list.filter(c => c.structFlag);
    if (filter === "short")   list = list.filter(c => c.words < 5000);
    if (searchQ) list = list.filter(c => c.title.toLowerCase().includes(searchQ.toLowerCase()) || String(c.ch).includes(searchQ));
    if (sortBy === "omega") list.sort((a, b) => b.omegaEff - a.omegaEff);
    else if (sortBy === "words") list.sort((a, b) => b.words - a.words);
    else if (sortBy === "gap") list.sort((a, b) => (b.omegaRaw - b.omegaEff) - (a.omegaRaw - a.omegaEff));
    else list.sort((a, b) => a.ch - b.ch);
    return list;
  }, [filter, actFilter, searchQ, sortBy]);

  const selectedChapter = selected !== null ? REVISION_MATRIX.find(c => c.ch === selected) : null;

  const stats = {
    elite: REVISION_MATRIX.filter(c => c.tier === "OMEGA ELITE").length,
    goldPlus: REVISION_MATRIX.filter(c => c.tier === "GOLD+").length,
    gold: REVISION_MATRIX.filter(c => c.tier === "GOLD").length,
    crit: REVISION_MATRIX.filter(c => c.criticalError).length,
    struct: REVISION_MATRIX.filter(c => c.structFlag).length,
  };

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header stats */}
      <div className="bg-card border border-gold/30 rounded-lg p-4">
        <div className="text-xs font-bold text-gold font-mono mb-1">
          HYBRID LITCENTRAL REVISION COMMAND CENTER — v12 Authoritative · 45 Chapters
        </div>
        <div className="text-[10px] text-foreground/60 font-sans">
          Ω = 71.443 + 0.124(CLS) + 0.118(BIS) + 0.089(SII) + 0.067(MRF) · R²=0.947 · α=0.938 · LSTE 82.2/100
        </div>
        <div className="grid grid-cols-5 gap-2 mt-3">
          {[
            { label:"OMEGA ELITE", n:stats.elite,   color:"text-gold" },
            { label:"GOLD+",       n:stats.goldPlus, color:"text-gold" },
            { label:"GOLD",        n:stats.gold,     color:"text-blue" },
            { label:"CRITICAL",    n:stats.crit,     color:"text-red"  },
            { label:"STRUCT FLAG", n:stats.struct,   color:"text-orange" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-xl font-black font-mono ${s.color}`}>{s.n}</div>
              <div className="text-[8px] text-muted-foreground font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: chapter list */}
        <div className="lg:col-span-1 space-y-3">
          {/* Filters */}
          <div className="flex gap-1 flex-wrap">
            {[
              { id:"all",      label:"All" },
              { id:"crit",     label:"🔴 Critical" },
              { id:"struct",   label:"🟠 Struct" },
              { id:"elite",    label:"★ Elite" },
              { id:"goldplus", label:"GOLD+" },
              { id:"short",    label:"<5k" },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`px-2 py-1 rounded text-[9px] font-bold font-mono border transition-all ${
                  filter === f.id ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"
                }`}>{f.label}</button>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {["all","I","II","III"].map(a => (
              <button key={a} onClick={() => setActFilter(a)}
                className={`px-2 py-1 rounded text-[9px] font-bold font-mono border transition-all ${
                  actFilter === a ? "bg-secondary text-foreground border-border" : "border-border/50 text-muted-foreground"
                }`}>Act {a}</button>
            ))}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="ml-auto px-2 py-1 text-[9px] font-mono bg-card border border-border rounded text-muted-foreground">
              <option value="ch">Ch #</option>
              <option value="omega">Ω Eff</option>
              <option value="words">Words</option>
              <option value="gap">Penalty</option>
            </select>
          </div>
          <input
            value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder="Search chapters..."
            className="w-full px-3 py-1.5 rounded-md bg-card border border-border text-xs font-sans text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50"
          />

          {/* Chapter list */}
          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map(c => {
              const tc = TIER_CONFIG[c.tier] || TIER_CONFIG["GOLD"];
              const isSelected = selected === c.ch;
              const penalty = c.omegaRaw > c.omegaEff;
              return (
                <div key={c.ch}
                  onClick={() => setSelected(isSelected ? null : c.ch)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected ? "bg-accent/10 border-accent" : `${tc.bg} ${tc.border} hover:bg-secondary/20`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold font-mono text-muted-foreground w-6 flex-shrink-0">
                      {c.ch}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[10px] font-bold truncate ${penalty ? "text-red" : "text-foreground"}`}>
                        {c.title}
                        {c.criticalError && " 🔴"}
                        {c.structFlag && !c.criticalError && " 🟠"}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <OmegaBar eff={c.omegaEff} raw={c.omegaRaw} />
                        <span className="text-[8px] text-muted-foreground font-mono" style={{color: ACT_COLOR[c.act]}}>
                          Act {c.act}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[8px] font-bold font-mono flex-shrink-0 ${tc.color}`}>
                      {c.tier === "OMEGA ELITE" ? "★ ELITE" : c.tier}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: revision detail */}
        <div className="lg:col-span-2">
          {!selectedChapter ? (
            <div className="h-full flex items-center justify-center text-center p-8 border border-border rounded-lg bg-card/50">
              <div>
                <div className="text-3xl mb-3">📋</div>
                <div className="text-sm font-bold text-foreground">Select a chapter</div>
                <div className="text-xs text-muted-foreground mt-1">Click any chapter to view its full revision brief</div>
                <div className="mt-4 space-y-1 text-left max-w-xs mx-auto">
                  <div className="text-[9px] font-mono text-muted-foreground font-bold">SENSORY CONSTANTS — ALL CHAPTERS:</div>
                  {SENSORY_CONSTANTS.map(s => (
                    <div key={s.label} className="text-[9px] font-sans text-muted-foreground">
                      <span className="text-gold font-bold">{s.label}:</span> {s.desc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-slide-up">
              {/* Chapter header */}
              <div className={`rounded-lg border p-4 ${TIER_CONFIG[selectedChapter.tier]?.bg} ${TIER_CONFIG[selectedChapter.tier]?.border}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-muted-foreground">Ch.{selectedChapter.ch}</span>
                      <span className="text-[10px] font-mono" style={{color: ACT_COLOR[selectedChapter.act]}}>Act {selectedChapter.act}</span>
                      <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${TIER_CONFIG[selectedChapter.tier]?.color} ${TIER_CONFIG[selectedChapter.tier]?.border}`}>
                        {selectedChapter.tier}
                      </span>
                    </div>
                    <div className="text-base font-black text-foreground font-mono">{selectedChapter.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {selectedChapter.words.toLocaleString()} words · Target: {selectedChapter.targetTier}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black font-mono text-gold">{selectedChapter.omegaEff.toFixed(2)}</div>
                    {selectedChapter.omegaRaw > selectedChapter.omegaEff && (
                      <div className="text-[9px] font-mono text-red">
                        Raw: {selectedChapter.omegaRaw.toFixed(2)} · Penalty: -{(selectedChapter.omegaRaw - selectedChapter.omegaEff).toFixed(2)}
                      </div>
                    )}
                    <div className="text-[9px] text-muted-foreground font-mono mt-0.5">CL-MoE: {selectedChapter.clMoE}</div>
                  </div>
                </div>
              </div>

              {/* Component gaps */}
              <DashCard title="Component Analysis — vs. Manuscript Mean (CLS 84.9 · BIS 88.9 · SII 81.4 · MRF 83.8)" accent="blue">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label:"CLS (Complexity/Linguistic)", score:selectedChapter.cls, gap:selectedChapter.clsGap, color:"purple", beta:"β 0.124" },
                    { label:"BIS (Behavioral Immersion)",  score:selectedChapter.bis, gap:selectedChapter.bisGap, color:"orange", beta:"β 0.118" },
                    { label:"SII (Spanish/Interlingual)",  score:selectedChapter.sii, gap:selectedChapter.siiGap, color:"cyan",   beta:"β 0.089" },
                    { label:"MRF (Multicultural Register)", score:selectedChapter.mrf, gap:selectedChapter.mrfGap, color:"blue",  beta:"β 0.067" },
                  ].map(m => {
                    const gapNum = parseFloat(m.gap);
                    const gapColor = gapNum > 3 ? "text-teal" : gapNum < -3 ? "text-red" : gapNum < 0 ? "text-gold" : "text-teal";
                    const barPct = Math.max(0, Math.min(100, (m.score / 100) * 100));
                    return (
                      <div key={m.label} className="bg-background rounded-md p-2.5 border border-border">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-mono text-muted-foreground">{m.label}</span>
                          <span className="text-[8px] font-mono text-muted-foreground/60">{m.beta}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full rounded-full"
                              style={{ width:`${barPct}%`, backgroundColor: m.color === "purple" ? "#A855F7" : m.color === "orange" ? "#F97316" : m.color === "cyan" ? "#06B6D4" : "#4A9EFF" }} />
                          </div>
                          <span className="text-[10px] font-bold font-mono text-foreground w-6 text-right">{m.score}</span>
                          <span className={`text-[10px] font-bold font-mono w-8 text-right ${gapColor}`}>{m.gap}</span>
                        </div>
                        <div className={`text-[8px] font-mono mt-0.5 ${gapColor}`}>
                          {gapNum > 3 ? "ABOVE — protect" : gapNum < -3 ? "DEFICIT — priority target" : gapNum < 0 ? "minor gap" : "on target"}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 p-2 rounded bg-secondary/30 flex items-center gap-3">
                  <div className="text-[9px] font-mono text-muted-foreground">WEAKEST VECTOR:</div>
                  <div className="text-xs font-bold text-gold font-mono">V:{selectedChapter.lowestVector}</div>
                  <div className="text-[9px] text-muted-foreground font-sans">→ Target for enhancement in this chapter</div>
                  <div className="ml-auto text-[9px] font-mono">
                    <span className="text-muted-foreground">LC/105:</span>
                    <span className={`ml-1 font-bold ${selectedChapter.lcScore >= 98 ? "text-gold" : selectedChapter.lcScore >= 95 ? "text-teal" : "text-foreground"}`}>
                      {selectedChapter.lcScore}
                    </span>
                  </div>
                </div>
              </DashCard>

              {/* Revision instructions */}
              <DashCard title="Surgical Revision Instructions — Execute in Order" accent="gold">
                <div className="space-y-2">
                  {selectedChapter.instructions.map((inst, i) => {
                    const isP0 = inst.includes("[P0") || inst.includes("ARTIFACT") || inst.includes("CRITICAL]");
                    const isHigh = inst.includes("[HIGH]") || inst.includes("EXPANSION");
                    return (
                      <div key={i}
                        className={`flex gap-3 p-2.5 rounded-md border text-[10px] font-sans leading-relaxed ${
                          isP0 ? "bg-red/5 border-red/30 text-red" :
                          isHigh ? "bg-gold/5 border-gold/20 text-foreground" :
                          "bg-card border-border/50 text-foreground/80"
                        }`}
                      >
                        <div className={`flex-shrink-0 font-bold font-mono text-[9px] w-4 ${isP0 ? "text-red" : isHigh ? "text-gold" : "text-muted-foreground"}`}>
                          {i + 1}
                        </div>
                        <div>{inst}</div>
                      </div>
                    );
                  })}
                </div>
              </DashCard>

              {/* Quality gates */}
              <DashCard title="Quality Gates — Verify Before Completing Revision" accent="teal">
                <div className="grid grid-cols-1 gap-1">
                  {QUALITY_GATES.map((gate, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-sans text-muted-foreground py-1 border-b border-border/30 last:border-0">
                      <span className="text-muted-foreground/50 font-mono flex-shrink-0">☐</span>
                      {gate}
                    </div>
                  ))}
                </div>
              </DashCard>

              {/* Omega gap to target */}
              <div className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-mono text-muted-foreground">Ω PATH TO TARGET</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{selectedChapter.targetTier}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-black font-mono text-foreground">{selectedChapter.omegaEff.toFixed(2)}</div>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden relative">
                    <div className="h-full rounded-full bg-blue transition-all"
                      style={{ width:`${Math.max(0,Math.min(100,((selectedChapter.omegaEff - 102) / (108 - 102)) * 100))}%` }} />
                    {/* GOLD+ line */}
                    <div className="absolute top-0 h-full border-l border-gold/60" style={{ left:`${((106 - 102) / 6) * 100}%` }} />
                    {/* ELITE line */}
                    <div className="absolute top-0 h-full border-l border-gold" style={{ left:`${((107 - 102) / 6) * 100}%` }} />
                  </div>
                  <div className="text-lg font-black font-mono text-gold">
                    {selectedChapter.tier === "OMEGA ELITE" ? "★ ELITE" :
                     selectedChapter.targetTier.includes("ELITE") ? `+${(107 - selectedChapter.omegaEff).toFixed(2)}` :
                     `+${(106 - selectedChapter.omegaEff).toFixed(2)}`}
                  </div>
                </div>
                <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1">
                  <span>102</span>
                  <span className="text-gold">GOLD+ 106</span>
                  <span className="text-gold font-bold">ELITE 107</span>
                  <span>108</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}