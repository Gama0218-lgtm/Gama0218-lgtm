import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from "recharts";
import DashCard from "./DashCard";
import { CHAPTERS, SCORED_CHAPTERS } from "../../lib/data";

const ACT_COLORS = { I: "#F5C842", II: "#4A9EFF", III: "#1CCFB4" };
const RISK_COLOR = { LOW: "#1CCFB4", MED: "#F5C842", HIGH: "#FF8C42", CRITICAL: "#FF5C5C" };

const wordData = CHAPTERS.map((ch) => ({
  ch: ch.ch,
  label: `Ch${ch.ch}`,
  words: ch.words || 0,
  act: ch.act,
  title: ch.title,
  isMissing: ch.isMissing,
  omega: ch.omega,
}));

const omegaData = SCORED_CHAPTERS.map((ch) => ({
  ch: ch.ch,
  label: `Ch${ch.ch}`,
  omega: ch.omega,
  act: ch.act,
  title: ch.title,
}));

const CustomWordTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-sans shadow-lg">
      <div className="font-bold text-foreground mb-0.5">Ch{d.ch}: {d.title}</div>
      <div className="text-muted-foreground">Act {d.act}</div>
      <div className="text-gold font-mono font-bold mt-1">{d.words.toLocaleString()} words</div>
      {d.isMissing && <div className="text-red font-bold mt-1">MISSING</div>}
    </div>
  );
};

const CustomOmegaTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-sans shadow-lg">
      <div className="font-bold text-foreground mb-0.5">Ch{d.ch}: {d.title}</div>
      <div className="text-muted-foreground">Act {d.act}</div>
      <div className="text-gold font-mono font-bold mt-1">Ω{d.omega}</div>
    </div>
  );
};

export default function PacingTab() {
  const [activeAct, setActiveAct] = useState("all");

  const filteredWord = activeAct === "all" ? wordData : wordData.filter(c => c.act === activeAct);
  const filteredOmega = activeAct === "all" ? omegaData : omegaData.filter(c => c.act === activeAct);

  const avgWords = Math.round(wordData.filter(c => !c.isMissing).reduce((s, c) => s + c.words, 0) / 43);

  const pacingRisks = [
    { ch: "Ch4–6",  risk: "MED",  note: "Institutional chapters — sensory drop, early engagement risk" },
    { ch: "Ch18–20",risk: "MED",  note: "Three consecutive briefing/formation chapters — insert action beat" },
    { ch: "Ch20",   risk: "HIGH", note: "65% dialogue — prose bridges needed" },
    { ch: "Ch34",   risk: "HIGH", note: "62% dialogue — add 2 sensory paragraphs" },
    { ch: "Ch39",   risk: "CRITICAL", note: "MISSING chapter — only absent chapter in manuscript" },
    { ch: "Ch40",   risk: "CRITICAL", note: "INCOMPLETE — 2,604w vs 5,000w target. Prayer scene absent." },
  ];

  return (
    <div className="animate-slide-up space-y-4">
      {/* Act Filter */}
      <div className="flex gap-2 items-center">
        <span className="text-xs text-muted-foreground font-mono">Filter:</span>
        {["all", "I", "II", "III"].map((act) => (
          <button
            key={act}
            onClick={() => setActiveAct(act)}
            className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition-all border ${
              activeAct === act
                ? "bg-accent text-white border-transparent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {act === "all" ? "ALL ACTS" : `ACT ${act}`}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          Avg chapter: <span className="text-gold font-bold">{avgWords.toLocaleString()}w</span> · 
          Target: <span className="text-teal font-bold">5,000w</span>
        </span>
      </div>

      {/* Word Count Chart */}
      <DashCard title="Chapter Word Counts" accent="gold">
        <div className="text-[10px] text-muted-foreground font-sans mb-3">
          Bar color = Act I (gold) · Act II (blue) · Act III (teal) · Missing (red) · Dashed line = 5,000w target
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={filteredWord} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2640" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} tickLine={false} axisLine={false} interval={activeAct === "all" ? 3 : 0} />
            <YAxis tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomWordTooltip />} cursor={{ fill: "#1A264044" }} />
            <ReferenceLine y={5000} stroke="#1CCFB4" strokeDasharray="4 4" strokeWidth={1.5} />
            <Bar dataKey="words" radius={[2, 2, 0, 0]} maxBarSize={28}>
              {filteredWord.map((entry) => (
                <Cell
                  key={entry.ch}
                  fill={entry.isMissing ? "#FF5C5C" : ACT_COLORS[entry.act] || "#4A9EFF"}
                  fillOpacity={entry.isMissing ? 0.4 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </DashCard>

      {/* Omega Score Chart */}
      <DashCard title="Omega Score by Chapter" accent="blue">
        <div className="text-[10px] text-muted-foreground font-sans mb-3">
          Line = Ω score · Dashed reference at Ω107 (mean) · Peak: Ch38 Ω110
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={filteredOmega} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2640" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} tickLine={false} axisLine={false} interval={activeAct === "all" ? 3 : 0} />
            <YAxis domain={[103, 111]} tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomOmegaTooltip />} />
            <ReferenceLine y={107.3} stroke="#F5C84288" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Ω107.3", position: "right", fill: "#F5C842", fontSize: 9 }} />
            <Line type="monotone" dataKey="omega" stroke="#4A9EFF" strokeWidth={2} dot={(props) => {
              const { cx, cy, payload } = props;
              const color = ACT_COLORS[payload.act] || "#4A9EFF";
              return <circle key={payload.ch} cx={cx} cy={cy} r={payload.omega >= 109 ? 4 : 2.5} fill={color} stroke="none" />;
            }} />
          </LineChart>
        </ResponsiveContainer>
      </DashCard>

      {/* Pacing Risk Table */}
      <DashCard title="Pacing Risk Zones" accent="red">
        <div className="space-y-2">
          {pacingRisks.map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-md bg-background border border-border">
              <span
                className="text-xs font-black font-mono min-w-[70px]"
                style={{ color: RISK_COLOR[r.risk] }}
              >
                {r.ch}
              </span>
              <span
                className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border min-w-[60px] text-center"
                style={{ color: RISK_COLOR[r.risk], borderColor: RISK_COLOR[r.risk] + "55", background: RISK_COLOR[r.risk] + "15" }}
              >
                {r.risk}
              </span>
              <span className="text-xs text-muted-foreground font-sans">{r.note}</span>
            </div>
          ))}
        </div>
      </DashCard>
    </div>
  );
}