import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { CHAPTERS } from "../../lib/data";
import DashCard from "./DashCard";

// ── Canon-Worthiness score formula per chapter ────────────────────────────────
// Derives a 5-axis "Canon Worthiness" profile from existing LITCENTRAL metrics.
// All axes normalised to 0–10.
function canonScores(ch) {
  const omega     = ch.omega   ?? 105;
  const cls       = ch.cls     ?? 80;
  const bis       = ch.bis     ?? 80;
  const sii       = ch.sii     ?? 80;
  const mrf       = ch.mrf     ?? 80;
  const clmoe     = ch.clmoe   ?? 0.05;

  // Formal Innovation  — rewards high Omega above baseline 105
  const formal    = Math.min(10, Math.round(((omega - 104) / 6) * 10));
  // Cultural Depth     — driven by CLS (Cultural Legitimacy Score)
  const cultural  = Math.min(10, Math.round((cls / 100) * 10));
  // Sensory Force      — driven by SII
  const sensory   = Math.min(10, Math.round((sii / 100) * 10));
  // Behavioral Fidelity— driven by BIS
  const behavioral= Math.min(10, Math.round((bis / 100) * 10));
  // Voice Consistency  — inverse of CL-MoE drift (lower drift = higher score)
  const voice     = Math.min(10, Math.max(0, Math.round((1 - clmoe / 0.12) * 10)));

  const total = parseFloat(((formal + cultural + sensory + behavioral + voice) / 5).toFixed(1));
  return { formal, cultural, sensory, behavioral, voice, total };
}

const ACT_COLOR = { I: "#F5C842", II: "#4A9EFF", III: "#1CCFB4" };
const AXES = ["formal", "cultural", "sensory", "behavioral", "voice"];
const AXIS_LABELS = {
  formal:     "Formal Innovation",
  cultural:   "Cultural Depth",
  sensory:    "Sensory Force",
  behavioral: "Behavioral Fidelity",
  voice:      "Voice Consistency",
};

// Pre-compute all chapter scores
const ALL_SCORES = CHAPTERS
  .filter(c => !c.isMissing && c.omega)
  .map(c => ({ ...c, canon: canonScores(c) }));

// Weak-point threshold — flag chapters below this on any axis
const WEAK_THRESHOLD = 7;

// Build radar data for a single chapter
function radarDataForChapter(ch) {
  return AXES.map(key => ({
    axis: AXIS_LABELS[key],
    score: ch.canon[key],
    fullMark: 10,
  }));
}

// Build average radar data for a set of chapters
function avgRadarData(chapters) {
  return AXES.map(key => {
    const avg = chapters.reduce((s, c) => s + c.canon[key], 0) / chapters.length;
    return { axis: AXIS_LABELS[key], score: parseFloat(avg.toFixed(1)), fullMark: 10 };
  });
}

// Custom tooltip
const RadarTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="font-bold text-foreground mb-1">{payload[0]?.payload?.axis}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }} className="font-black font-mono">{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

// Weak-point badge
function WeakBadge({ count }) {
  if (count === 0) return <span className="text-[8px] font-bold font-mono text-teal px-1.5 py-0.5 rounded border border-teal/30 bg-teal/10">CLEAN</span>;
  return <span className="text-[8px] font-bold font-mono text-red px-1.5 py-0.5 rounded border border-red/30 bg-red/10">{count} WEAK AXIS{count > 1 ? "ES" : ""}</span>;
}

// Mini inline sparkline of 5 axis bars
function AxisBars({ scores, color }) {
  return (
    <div className="flex gap-px items-end h-5">
      {AXES.map(key => (
        <div key={key} className="flex flex-col items-center gap-px w-3">
          <div
            className="w-full rounded-sm opacity-80"
            style={{
              height: `${(scores[key] / 10) * 20}px`,
              background: scores[key] < WEAK_THRESHOLD ? "#FF5C5C" : color,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function CanonRadarWidget() {
  const [mode, setMode]         = useState("overview");   // overview | chapter | act
  const [selectedAct, setAct]   = useState("I");
  const [selectedCh, setCh]     = useState(1);
  const [compareAct, setCompAct]= useState(null);         // optional second act overlay

  const actChapters = (act) => ALL_SCORES.filter(c => c.act === act);

  // Identify chapters with ≥1 weak axis
  const weakChapters = ALL_SCORES.filter(c =>
    AXES.some(key => c.canon[key] < WEAK_THRESHOLD)
  );

  // Data for radar
  let radarSeries = [];
  if (mode === "overview") {
    radarSeries = [{ name: "All Chapters Avg", color: "#F5C842", data: avgRadarData(ALL_SCORES) }];
  } else if (mode === "act") {
    radarSeries = [{ name: `Act ${selectedAct}`, color: ACT_COLOR[selectedAct], data: avgRadarData(actChapters(selectedAct)) }];
    if (compareAct && compareAct !== selectedAct) {
      radarSeries.push({ name: `Act ${compareAct}`, color: ACT_COLOR[compareAct], data: avgRadarData(actChapters(compareAct)), dashed: true });
    }
  } else {
    const ch = ALL_SCORES.find(c => c.ch === selectedCh) || ALL_SCORES[0];
    radarSeries = [{ name: `Ch.${ch.ch} ${ch.title.slice(0, 20)}`, color: ACT_COLOR[ch.act], data: radarDataForChapter(ch) }];
    // also show act avg as reference
    radarSeries.push({ name: `Act ${ch.act} Avg`, color: ACT_COLOR[ch.act], data: avgRadarData(actChapters(ch.act)), dashed: true });
  }

  const selectedChObj = ALL_SCORES.find(c => c.ch === selectedCh) || ALL_SCORES[0];

  return (
    <DashCard title="Canon-Worthiness Radar — All 44 Chapters" accent="purple">
      {/* Mode toggle */}
      <div className="flex gap-1 mb-3 flex-wrap items-center justify-between">
        <div className="flex gap-1">
          {[
            { id: "overview", label: "Manuscript Avg" },
            { id: "act",      label: "By Act" },
            { id: "chapter",  label: "Chapter Drill" },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-2.5 py-1 rounded-md text-[9px] font-bold font-mono border transition-all ${
                mode === m.id ? "bg-purple/20 text-purple border-purple/40" : "border-border text-muted-foreground hover:text-foreground"
              }`}>{m.label}</button>
          ))}
        </div>
        <div className="text-[9px] font-mono text-muted-foreground">
          <span className="text-red font-bold">{weakChapters.length}</span> chapters with weak axis (&lt;{WEAK_THRESHOLD})
        </div>
      </div>

      {/* Act selector */}
      {mode === "act" && (
        <div className="flex gap-2 mb-3 items-center flex-wrap">
          <span className="text-[8px] font-mono text-muted-foreground">Primary:</span>
          {["I","II","III"].map(a => (
            <button key={a} onClick={() => setAct(a)}
              className={`px-2.5 py-1 rounded text-[9px] font-bold font-mono border transition-all ${
                selectedAct === a ? "border-transparent text-background" : "border-border text-muted-foreground"
              }`}
              style={selectedAct === a ? { background: ACT_COLOR[a] } : {}}>Act {a}</button>
          ))}
          <span className="text-[8px] font-mono text-muted-foreground ml-2">Compare:</span>
          {["I","II","III"].map(a => (
            <button key={a} onClick={() => setCompAct(compareAct === a ? null : a)}
              className={`px-2.5 py-1 rounded text-[9px] font-bold font-mono border transition-all opacity-70 ${
                compareAct === a ? "border-transparent text-background" : "border-border text-muted-foreground"
              }`}
              style={compareAct === a ? { background: ACT_COLOR[a] } : {}}>Act {a}</button>
          ))}
        </div>
      )}

      {/* Chapter selector */}
      {mode === "chapter" && (
        <div className="mb-3">
          <select
            value={selectedCh}
            onChange={e => setCh(Number(e.target.value))}
            className="bg-secondary border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground w-full focus:outline-none focus:border-purple/60"
          >
            {ALL_SCORES.map(c => (
              <option key={c.ch} value={c.ch}>
                Ch.{c.ch} — {c.title} (Ω{c.omega}) {AXES.some(k => c.canon[k] < WEAK_THRESHOLD) ? "⚠" : ""}
              </option>
            ))}
          </select>
          {/* Chapter weak axis callout */}
          {mode === "chapter" && AXES.some(k => selectedChObj.canon[k] < WEAK_THRESHOLD) && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {AXES.filter(k => selectedChObj.canon[k] < WEAK_THRESHOLD).map(k => (
                <span key={k} className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border border-red/30 bg-red/10 text-red">
                  ⚠ {AXIS_LABELS[k]}: {selectedChObj.canon[k]}/10
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Radar chart */}
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#1E3050" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "#6B8BAA", fontSize: 9, fontFamily: "monospace" }}
          />
          <PolarRadiusAxis
            angle={90} domain={[0, 10]}
            tick={{ fill: "#3A5070", fontSize: 7, fontFamily: "monospace" }}
            tickCount={6}
          />
          {radarSeries.map((s, i) => (
            <Radar
              key={s.name}
              name={s.name}
              dataKey="score"
              data={s.data}
              stroke={s.color}
              fill={s.color}
              fillOpacity={s.dashed ? 0.05 : 0.15}
              strokeWidth={s.dashed ? 1.5 : 2}
              strokeDasharray={s.dashed ? "4 3" : undefined}
            />
          ))}
          <Tooltip content={<RadarTip />} />
          <Legend wrapperStyle={{ fontSize: "9px", fontFamily: "monospace" }} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Axis legend */}
      <div className="grid grid-cols-5 gap-1 mt-2 mb-3">
        {AXES.map(k => (
          <div key={k} className="text-center">
            <div className="text-[7px] font-bold font-mono text-muted-foreground leading-tight">{AXIS_LABELS[k].split(" ")[0]}</div>
            <div className="text-[7px] font-mono text-muted-foreground leading-tight">{AXIS_LABELS[k].split(" ")[1] || ""}</div>
          </div>
        ))}
      </div>

      {/* Weak chapters table */}
      {weakChapters.length > 0 && (
        <div>
          <div className="text-[8px] font-bold font-mono text-muted-foreground uppercase tracking-wide mb-2">
            Weak-Point Chapters (any axis &lt; {WEAK_THRESHOLD})
          </div>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {weakChapters.map(c => {
              const weakAxes = AXES.filter(k => c.canon[k] < WEAK_THRESHOLD);
              return (
                <div key={c.ch}
                  onClick={() => { setMode("chapter"); setCh(c.ch); }}
                  className="flex items-center gap-2.5 p-2 rounded-lg border border-border bg-card hover:bg-secondary/40 cursor-pointer transition-all group">
                  <span className="text-[9px] font-black font-mono text-muted-foreground min-w-[28px]">Ch.{c.ch}</span>
                  <span className="text-[9px] font-sans text-foreground flex-1 truncate group-hover:text-foreground">{c.title}</span>
                  <AxisBars scores={c.canon} color={ACT_COLOR[c.act]} />
                  <div className="flex gap-1 flex-wrap justify-end min-w-[80px]">
                    {weakAxes.map(k => (
                      <span key={k} className="text-[7px] font-bold font-mono px-1 py-px rounded border border-red/30 bg-red/10 text-red">
                        {AXIS_LABELS[k].split(" ")[0]}: {c.canon[k]}
                      </span>
                    ))}
                  </div>
                  <WeakBadge count={weakAxes.length} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weakChapters.length === 0 && (
        <div className="text-center py-3 text-[10px] font-mono text-teal">
          ✓ All chapters clear all 5 canon axes at ≥{WEAK_THRESHOLD}
        </div>
      )}
    </DashCard>
  );
}