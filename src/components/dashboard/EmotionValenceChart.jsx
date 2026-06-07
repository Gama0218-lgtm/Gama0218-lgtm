import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, Area, AreaChart, CartesianGrid, Legend
} from "recharts";
import { CHAPTERS, EMOTION_DATA } from "../../lib/data";

// Compute valence per chapter: positive signals minus negative signals (normalized –10 to +10)
const VALENCE_DATA = EMOTION_DATA.map((e, i) => {
  const ch = CHAPTERS[i];
  const positive = (e.love * 1.2) + (e.hope * 1.0) + (e.spiritual * 0.8);
  const negative  = (e.grief * 1.1) + (e.rage * 1.0) + (e.fear * 0.9);
  const rawValence = positive - negative;
  // Normalize roughly to –10 / +10 range
  const valence = parseFloat((rawValence / 3.6).toFixed(2));
  return {
    ch: ch?.ch ?? i + 1,
    title: ch?.title ?? `Chapter ${i + 1}`,
    act: ch?.act ?? "I",
    valence,
    love: e.love,
    hope: e.hope,
    grief: e.grief,
    rage: e.rage,
    fear: e.fear,
    spiritual: e.spiritual,
    positive: parseFloat((positive / 3.6).toFixed(2)),
    negative: parseFloat((-negative / 3.6).toFixed(2)),
  };
});

const ACT_COLORS = { I: "#f59e0b", II: "#60a5fa", III: "#14b8a6" };

const BEAT_LABELS = [
  { ch: 1,  label: "Opening Witness",     side: "top"    },
  { ch: 9,  label: "Ramirez KIA",         side: "bottom" },
  { ch: 13, label: "Package Sacrament",   side: "top"    },
  { ch: 15, label: "My Lai",              side: "bottom" },
  { ch: 23, label: "Te Deum",             side: "top"    },
  { ch: 30, label: "Corridor of Fire",    side: "bottom" },
  { ch: 35, label: "628 Days",            side: "top"    },
  { ch: 38, label: "Compadres Fall",      side: "bottom" },
  { ch: 39, label: "WP Wound",           side: "bottom" },
  { ch: 41, label: "Unidos",             side: "top"    },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const isPos = d.valence >= 0;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-xl text-xs max-w-[220px]">
      <div className="font-black font-mono text-foreground mb-1">Ch.{d.ch} — {d.title}</div>
      <div className="font-bold font-mono text-[9px] mb-2" style={{ color: ACT_COLORS[d.act] }}>Act {d.act}</div>
      <div className={`text-lg font-black font-mono mb-2 ${isPos ? "text-teal" : "text-red"}`}>
        {isPos ? "+" : ""}{d.valence} <span className="text-[9px] font-normal text-muted-foreground">valence</span>
      </div>
      <div className="space-y-0.5 text-[9px] font-mono">
        <div className="flex justify-between gap-4"><span className="text-teal">Love</span><span>{d.love}/10</span></div>
        <div className="flex justify-between gap-4"><span className="text-blue">Hope</span><span>{d.hope}/10</span></div>
        <div className="flex justify-between gap-4"><span className="text-purple">Spiritual</span><span>{d.spiritual}/10</span></div>
        <div className="border-t border-border/40 my-1" />
        <div className="flex justify-between gap-4"><span className="text-red">Grief</span><span>{d.grief}/10</span></div>
        <div className="flex justify-between gap-4"><span className="text-orange">Rage</span><span>{d.rage}/10</span></div>
        <div className="flex justify-between gap-4"><span className="text-gold">Fear</span><span>{d.fear}/10</span></div>
      </div>
    </div>
  );
}

function CustomDot({ cx, cy, payload }) {
  if (!payload) return null;
  const isPos = payload.valence >= 0;
  const isExtreme = Math.abs(payload.valence) >= 2.5;
  const beat = BEAT_LABELS.find(b => b.ch === payload.ch);
  if (!isExtreme && !beat) return null;
  return (
    <circle
      cx={cx} cy={cy} r={isExtreme ? 4 : 3}
      fill={isPos ? "#14b8a6" : "#ef4444"}
      stroke={isExtreme ? "#fff" : "transparent"}
      strokeWidth={1.5}
      opacity={0.9}
    />
  );
}

export default function EmotionValenceChart() {
  const [mode, setMode] = useState("valence"); // valence | stacked | both
  const [hoveredBeat, setHoveredBeat] = useState(null);

  const positiveCount = VALENCE_DATA.filter(d => d.valence >= 0).length;
  const negativeCount = VALENCE_DATA.filter(d => d.valence < 0).length;
  const lowest  = [...VALENCE_DATA].sort((a, b) => a.valence - b.valence)[0];
  const highest = [...VALENCE_DATA].sort((a, b) => b.valence - a.valence)[0];
  const avgValence = (VALENCE_DATA.reduce((s, d) => s + d.valence, 0) / VALENCE_DATA.length).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-purple/5 border border-purple/30 rounded-lg p-3 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-sm font-black font-mono text-purple">EMOTIONAL VALENCE MAP — 44 Chapters</div>
          <div className="text-[10px] text-muted-foreground font-sans">Positive = love + hope + spiritual · Negative = grief + rage + fear · Scale: –10 to +10</div>
        </div>
        <div className="flex gap-1.5">
          {[
            { id: "valence", label: "Valence Line" },
            { id: "stacked", label: "Pos / Neg Bands" },
            { id: "both",    label: "All Emotions" },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-2.5 py-1 rounded text-[9px] font-bold font-mono border transition-all ${mode === m.id ? "bg-purple text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className={`text-xl font-black font-mono ${parseFloat(avgValence) >= 0 ? "text-teal" : "text-red"}`}>{avgValence > 0 ? "+" : ""}{avgValence}</div>
          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">Manuscript Avg Valence</div>
        </div>
        <div className="bg-card border border-teal/20 rounded-lg p-3 text-center">
          <div className="text-xl font-black font-mono text-teal">Ch.{highest.ch}</div>
          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">Peak Positive (+{highest.valence})</div>
          <div className="text-[8px] text-teal font-sans mt-0.5 truncate">{highest.title}</div>
        </div>
        <div className="bg-card border border-red/20 rounded-lg p-3 text-center">
          <div className="text-xl font-black font-mono text-red">Ch.{lowest.ch}</div>
          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">Peak Negative ({lowest.valence})</div>
          <div className="text-[8px] text-red font-sans mt-0.5 truncate">{lowest.title}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-xl font-black font-mono text-foreground">{positiveCount} / {negativeCount}</div>
          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">Positive / Negative Chapters</div>
        </div>
      </div>

      {/* Main chart */}
      <div className="bg-card border border-border rounded-lg p-4">
        {/* Act band indicators */}
        <div className="flex gap-3 mb-3 text-[9px] font-mono">
          {Object.entries(ACT_COLORS).map(([act, color]) => (
            <span key={act} className="flex items-center gap-1">
              <span className="w-3 h-0.5 inline-block rounded" style={{ background: color }} />
              <span className="text-muted-foreground">Act {act}</span>
            </span>
          ))}
          <span className="flex items-center gap-1 ml-2">
            <span className="w-2 h-2 rounded-full bg-teal inline-block" />
            <span className="text-muted-foreground">Positive peak</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red inline-block" />
            <span className="text-muted-foreground">Negative dip</span>
          </span>
        </div>

        {mode === "valence" && (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={VALENCE_DATA} margin={{ top: 16, right: 12, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="negGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" vertical={false} />
              <XAxis dataKey="ch" tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }}
                tickLine={false} axisLine={false} label={{ value: "Chapter →", position: "insideBottomRight", fill: "#6B8BAA", fontSize: 8, dy: 10 }} />
              <YAxis domain={[-6, 6]} tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }}
                tickLine={false} axisLine={false}
                tickFormatter={v => v > 0 ? `+${v}` : v} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#2a3f55" strokeWidth={1.5} strokeDasharray="4 2" />
              {/* Act boundary lines */}
              <ReferenceLine x={16} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} label={{ value: "I→II", position: "top", fill: "#f59e0b", fontSize: 7 }} />
              <ReferenceLine x={31} stroke="#60a5fa" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} label={{ value: "II→III", position: "top", fill: "#60a5fa", fontSize: 7 }} />
              <Area type="monotone" dataKey="valence"
                stroke="#a855f7" strokeWidth={2}
                fill="url(#posGrad)"
                dot={<CustomDot />}
                activeDot={{ r: 5, fill: "#a855f7", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {mode === "stacked" && (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={VALENCE_DATA} margin={{ top: 16, right: 12, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="posG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="negG" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" vertical={false} />
              <XAxis dataKey="ch" tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#2a3f55" strokeWidth={1.5} />
              <ReferenceLine x={16} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
              <ReferenceLine x={31} stroke="#60a5fa" strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
              <Area type="monotone" dataKey="positive" stroke="#14b8a6" fill="url(#posG)" strokeWidth={1.5} name="Positive" activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="negative" stroke="#ef4444" fill="url(#negG)" strokeWidth={1.5} name="Negative" activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {mode === "both" && (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={VALENCE_DATA} margin={{ top: 16, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" vertical={false} />
              <XAxis dataKey="ch" tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={16} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
              <ReferenceLine x={31} stroke="#60a5fa" strokeWidth={1} strokeDasharray="3 3" opacity={0.4} />
              <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace", paddingTop: 8 }} />
              <Line type="monotone" dataKey="love"     stroke="#ec4899" strokeWidth={1.5} dot={false} name="Love"     />
              <Line type="monotone" dataKey="hope"     stroke="#60a5fa" strokeWidth={1.5} dot={false} name="Hope"     />
              <Line type="monotone" dataKey="spiritual" stroke="#a855f7" strokeWidth={1.5} dot={false} name="Spiritual"/>
              <Line type="monotone" dataKey="grief"    stroke="#9ca3af" strokeWidth={1.5} dot={false} name="Grief"    strokeDasharray="4 2" />
              <Line type="monotone" dataKey="rage"     stroke="#ef4444" strokeWidth={1.5} dot={false} name="Rage"     strokeDasharray="4 2" />
              <Line type="monotone" dataKey="fear"     stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Fear"     strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Emotional beat callouts */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-3">Key Emotional Beats</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {BEAT_LABELS.map(beat => {
            const d = VALENCE_DATA.find(v => v.ch === beat.ch);
            if (!d) return null;
            const isPos = d.valence >= 0;
            return (
              <div key={beat.ch} className={`flex items-center gap-3 p-2.5 rounded-lg border ${isPos ? "border-teal/20 bg-teal/5" : "border-red/20 bg-red/5"}`}>
                <div className="text-center min-w-[40px]">
                  <div className={`text-sm font-black font-mono ${isPos ? "text-teal" : "text-red"}`}>{isPos ? "+" : ""}{d.valence}</div>
                  <div className="text-[8px] text-muted-foreground font-mono">Ch.{beat.ch}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold font-mono text-foreground">{beat.label}</div>
                  <div className="text-[9px] text-muted-foreground font-sans truncate">{d.title}</div>
                </div>
                <div className={`ml-auto text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${isPos ? "text-teal border-teal/30 bg-teal/10" : "text-red border-red/30 bg-red/10"}`}>
                  {isPos ? "↑ HIGH" : "↓ LOW"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}