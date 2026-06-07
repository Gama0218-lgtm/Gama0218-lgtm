import { useState } from "react";
import { ARC_DATA, CHARACTER_BIBLE } from "../../lib/data";

// Characters tracked in ARC_DATA with their field keys
const TRACKED = [
  { id: "ramos",    field: "ramos",    label: "SGT Ramos",    color: "gold"   },
  { id: "miguel",   field: "miguel",   label: "Miguel/Jorge", color: "orange" },
  { id: "squad",    field: "squad",    label: "Squad",        color: "blue"   },
  { id: "crawford", field: "crawford", label: "Crawford",     color: "red"    },
  { id: "chieftain",field: "chieftain",label: "Chieftain",    color: "teal"   },
];

const COLOR = {
  gold:   { bar: "bg-gold",   text: "text-gold",   border: "border-gold/40",   heat: "#f0b429" },
  orange: { bar: "bg-orange", text: "text-orange", border: "border-orange/40", heat: "#f97316" },
  blue:   { bar: "bg-blue",   text: "text-blue",   border: "border-blue/40",   heat: "#60a5fa" },
  red:    { bar: "bg-red",    text: "text-red",    border: "border-red/40",    heat: "#f87171" },
  teal:   { bar: "bg-teal",   text: "text-teal",   border: "border-teal/40",   heat: "#2dd4bf" },
};

// Compute volatility = average absolute change between consecutive chapter scores
function computeStats(field) {
  const scores = ARC_DATA.map(d => d[field] ?? 0);
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
  const max = Math.max(...scores);
  const min = Math.min(...scores);

  const deltas = [];
  for (let i = 1; i < scores.length; i++) {
    deltas.push(Math.abs(scores[i] - scores[i - 1]));
  }
  const volatility = deltas.reduce((s, v) => s + v, 0) / deltas.length;

  // Find most volatile chapters (delta > 1.5x average delta)
  const threshold = volatility * 1.5;
  const volatileChapters = deltas
    .map((d, i) => ({ ch: ARC_DATA[i + 1].ch, delta: d, score: scores[i + 1], prev: scores[i] }))
    .filter(x => x.delta >= threshold)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 5);

  return { scores, avg, max, min, volatility, volatileChapters };
}

function MiniSparkline({ scores, color }) {
  const w = 200, h = 32;
  const max = 10, min = 0;
  const pts = scores.map((v, i) => {
    const x = (i / (scores.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.8"
      />
      {scores.map((v, i) => {
        const x = (i / (scores.length - 1)) * w;
        const y = h - ((v - min) / (max - min)) * h;
        return v >= 8 ? (
          <circle key={i} cx={x} cy={y} r="2.5" fill={color} opacity="0.9" />
        ) : null;
      })}
    </svg>
  );
}

function HeatRow({ scores, color }) {
  return (
    <div className="flex gap-px flex-wrap">
      {scores.map((v, i) => {
        const opacity = v === 0 ? 0.05 : 0.1 + (v / 10) * 0.85;
        return (
          <div
            key={i}
            title={`Ch.${ARC_DATA[i]?.ch} → ${v}/10`}
            style={{ opacity, backgroundColor: COLOR[color]?.heat }}
            className="w-[14px] h-[14px] rounded-[2px] flex-shrink-0 cursor-default transition-opacity hover:opacity-100"
          />
        );
      })}
    </div>
  );
}

export default function CharacterArcConsistency() {
  const [selected, setSelected] = useState("ramos");
  const [view, setView] = useState("bars"); // bars | heat | volatile

  const allStats = TRACKED.map(t => ({ ...t, ...computeStats(t.field) }));
  const active = allStats.find(t => t.id === selected);
  const bible = CHARACTER_BIBLE.find(c => c.id === selected);

  return (
    <div className="space-y-4 animate-slide-up">

      {/* Header */}
      <div className="bg-purple/5 border border-purple/30 rounded-lg p-3">
        <div className="text-sm font-black font-mono text-purple">CHARACTER ARC CONSISTENCY — 45-Chapter Volatility Map</div>
        <div className="text-[10px] text-muted-foreground font-sans mt-0.5">
          Arc presence scores (0–10) per chapter · Volatility = mean absolute delta between consecutive chapters · High volatility = narrative risk
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {allStats.map(t => {
          const c = COLOR[t.color];
          const isActive = t.id === selected;
          return (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`rounded-lg border p-3 text-left transition-all ${
                isActive ? `${c.border} bg-card` : "border-border bg-card hover:bg-secondary/30"
              }`}
            >
              <div className={`text-[10px] font-black font-mono ${c.text} mb-1`}>{t.label}</div>
              <div className="flex items-end gap-2 mb-2">
                <div className="text-lg font-black font-mono text-foreground">{t.avg.toFixed(1)}</div>
                <div className="text-[9px] font-mono text-muted-foreground mb-0.5">avg/ch</div>
              </div>
              {/* Mini bar */}
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${(t.avg / 10) * 100}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] font-mono text-muted-foreground">vol: {t.volatility.toFixed(2)}</span>
                <span className={`text-[8px] font-bold font-mono ${t.volatility > 2 ? "text-red" : t.volatility > 1 ? "text-gold" : "text-teal"}`}>
                  {t.volatility > 2 ? "HIGH" : t.volatility > 1 ? "MED" : "LOW"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div className={`bg-card border ${COLOR[active.color].border} rounded-lg p-4 space-y-4`}>

          {/* Title row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className={`text-sm font-black font-mono ${COLOR[active.color].text}`}>{active.label}</div>
              {bible && <div className="text-[10px] text-muted-foreground font-sans mt-0.5 max-w-lg">{bible.note}</div>}
            </div>
            <div className="flex items-center gap-1.5">
              {["bars", "heat", "volatile"].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`text-[9px] font-bold font-mono px-2.5 py-1 rounded border transition-all ${view === v ? "bg-accent text-white border-accent" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {v === "bars" ? "BARS" : v === "heat" ? "HEAT MAP" : "VOLATILE CHS"}
                </button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "AVG SCORE", value: active.avg.toFixed(1), sub: "/ 10" },
              { label: "PEAK",      value: active.max,            sub: `Ch.${ARC_DATA[active.scores.indexOf(active.max)]?.ch}` },
              { label: "TROUGH",    value: active.min,            sub: `Ch.${ARC_DATA[active.scores.indexOf(active.min)]?.ch}` },
              { label: "VOLATILITY",value: active.volatility.toFixed(2), sub: active.volatility > 2 ? "HIGH RISK" : active.volatility > 1 ? "MODERATE" : "STABLE", color: active.volatility > 2 ? "text-red" : active.volatility > 1 ? "text-gold" : "text-teal" },
            ].map(s => (
              <div key={s.label} className="bg-background rounded-lg border border-border p-2 text-center">
                <div className={`text-xl font-black font-mono ${s.color || "text-foreground"}`}>{s.value}</div>
                <div className="text-[9px] font-mono text-muted-foreground">{s.label}</div>
                <div className={`text-[8px] font-mono ${s.color || "text-muted-foreground"}`}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Sparkline */}
          <div className="bg-background rounded-lg border border-border p-3">
            <div className="text-[9px] font-bold font-mono text-muted-foreground mb-2">ARC PRESENCE ACROSS 45 CHAPTERS</div>
            <div className="overflow-x-auto">
              <MiniSparkline scores={active.scores} color={COLOR[active.color].heat} />
            </div>
          </div>

          {/* BARS view */}
          {view === "bars" && (
            <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
              {ARC_DATA.map((d, i) => {
                const score = d[active.field] ?? 0;
                const prev = i > 0 ? (ARC_DATA[i - 1][active.field] ?? 0) : score;
                const delta = score - prev;
                const isVolatile = Math.abs(delta) >= active.volatility * 1.5;
                return (
                  <div key={d.ch} className={`flex items-center gap-2 rounded px-2 py-1 ${isVolatile ? "bg-red/5 border border-red/20" : ""}`}>
                    <div className="text-[9px] font-bold font-mono text-muted-foreground w-10 flex-shrink-0">Ch.{d.ch}</div>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${COLOR[active.color].bar} rounded-full transition-all`}
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                    <div className="text-[9px] font-mono text-foreground w-6 text-right flex-shrink-0">{score}</div>
                    {i > 0 && delta !== 0 && (
                      <div className={`text-[9px] font-bold font-mono w-8 text-right flex-shrink-0 ${delta > 0 ? "text-teal" : "text-red"}`}>
                        {delta > 0 ? `+${delta}` : delta}
                      </div>
                    )}
                    {isVolatile && <div className="text-[9px] text-red font-mono flex-shrink-0">⚡</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* HEAT MAP view */}
          {view === "heat" && (
            <div className="bg-background rounded-lg border border-border p-3 space-y-3">
              <div className="text-[9px] font-bold font-mono text-muted-foreground mb-1">SCORE DENSITY — darker = stronger presence</div>
              <HeatRow scores={active.scores} color={active.color} />
              <div className="flex items-center gap-2 mt-2">
                <div className="text-[8px] font-mono text-muted-foreground">0</div>
                <div className="flex gap-px">
                  {[0.05,0.2,0.35,0.5,0.65,0.8,0.95].map((op,i) => (
                    <div key={i} style={{ opacity: op, backgroundColor: COLOR[active.color].heat }} className="w-4 h-3 rounded-sm" />
                  ))}
                </div>
                <div className="text-[8px] font-mono text-muted-foreground">10</div>
              </div>

              {/* Act breakdown */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { act: "I", chs: ARC_DATA.filter(d => d.ch <= 17) },
                  { act: "II", chs: ARC_DATA.filter(d => d.ch >= 18 && d.ch <= 32) },
                  { act: "III", chs: ARC_DATA.filter(d => d.ch >= 33) },
                ].map(({ act, chs }) => {
                  const scores = chs.map(d => d[active.field] ?? 0);
                  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
                  return (
                    <div key={act} className="bg-card border border-border rounded p-2 text-center">
                      <div className="text-[9px] font-black font-mono text-muted-foreground">ACT {act}</div>
                      <div className={`text-lg font-black font-mono ${COLOR[active.color].text}`}>{avg.toFixed(1)}</div>
                      <div className="text-[8px] font-mono text-muted-foreground">avg presence</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VOLATILE CHS view */}
          {view === "volatile" && (
            <div className="space-y-2">
              <div className="text-[9px] font-bold font-mono text-muted-foreground mb-2">
                MOST VOLATILE CHAPTERS — delta ≥ {(active.volatility * 1.5).toFixed(1)} pts from previous chapter
              </div>
              {active.volatileChapters.length === 0 ? (
                <div className="text-[10px] font-mono text-teal bg-teal/5 border border-teal/20 rounded p-3">
                  ✓ No high-volatility transitions detected — arc is stable throughout.
                </div>
              ) : (
                active.volatileChapters.map(v => {
                  const chData = ARC_DATA.find(d => d.ch === v.ch);
                  const drop = v.score < v.prev;
                  return (
                    <div key={v.ch} className={`bg-card border rounded-lg p-3 ${drop ? "border-red/40" : "border-teal/40"}`}>
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`text-[10px] font-black font-mono ${COLOR[active.color].text}`}>Ch.{v.ch}</div>
                        <div className={`text-[11px] font-bold font-mono ${drop ? "text-red" : "text-teal"}`}>
                          {drop ? "▼" : "▲"} {drop ? "-" : "+"}{Math.abs(v.delta).toFixed(0)} pts
                        </div>
                        <div className="text-[9px] font-mono text-muted-foreground">
                          {v.prev} → {v.score}
                        </div>
                        <div className={`ml-auto text-[8px] font-bold font-mono px-2 py-0.5 rounded border ${drop ? "text-red border-red/30 bg-red/10" : "text-teal border-teal/30 bg-teal/10"}`}>
                          {drop ? "DROP" : "SURGE"}
                        </div>
                      </div>
                      {chData?.summary && (
                        <div className="text-[10px] font-sans text-muted-foreground leading-snug">{chData.summary}</div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Cross-character volatility comparison */}
              <div className="mt-4 bg-background border border-border rounded-lg p-3">
                <div className="text-[9px] font-bold font-mono text-muted-foreground mb-3">VOLATILITY RANKING — ALL CHARACTERS</div>
                {allStats.sort((a, b) => b.volatility - a.volatility).map(t => (
                  <div key={t.id} className="flex items-center gap-2 mb-1.5">
                    <div className={`text-[9px] font-bold font-mono ${COLOR[t.color].text} w-24 flex-shrink-0`}>{t.label}</div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${COLOR[t.color].bar} rounded-full`}
                        style={{ width: `${(t.volatility / 3) * 100}%` }}
                      />
                    </div>
                    <div className="text-[9px] font-mono text-foreground w-8 text-right">{t.volatility.toFixed(2)}</div>
                    <div className={`text-[8px] font-bold font-mono w-10 text-right ${t.volatility > 2 ? "text-red" : t.volatility > 1 ? "text-gold" : "text-teal"}`}>
                      {t.volatility > 2 ? "HIGH" : t.volatility > 1 ? "MED" : "LOW"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}