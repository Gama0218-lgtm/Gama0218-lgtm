import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, ReferenceArea, Legend,
} from "recharts";
import { CHAPTER_DATA } from "../../lib/promptData";

// Compute means
const omegaMean = +(CHAPTER_DATA.reduce((a, c) => a + c.oc, 0) / CHAPTER_DATA.length).toFixed(2);
const clsMean   = +(CHAPTER_DATA.reduce((a, c) => a + (c.cls || 0), 0) / CHAPTER_DATA.length).toFixed(2);

// Act boundaries
const ACT_BOUNDS = [
  { act: "I",   start: 1,  end: 15, color: "hsl(var(--gold))" },
  { act: "II",  start: 16, end: 30, color: "hsl(var(--blue))" },
  { act: "III", start: 31, end: 45, color: "hsl(var(--teal))" },
];

const chartData = CHAPTER_DATA.map(c => ({
  ch:    c.n,
  title: c.title,
  act:   c.act,
  omega: c.oc,
  cls:   c.cls || null,
  omegaDip: c.oc < omegaMean,
  clsDip:   (c.cls || 0) < clsMean,
}));

const DIP_THRESHOLD = 1.5; // points below mean = notable dip

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-[10px] font-mono max-w-[200px]">
      <div className="font-black text-foreground mb-1">Ch.{d?.ch} · Act {d?.act}</div>
      <div className="text-muted-foreground truncate mb-2">{d?.title}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3">
          <span style={{ color: p.color }} className="font-bold">{p.name}</span>
          <span className="text-foreground font-black">{p.value?.toFixed(2)}</span>
          {p.dataKey === "omega" && d?.omegaDip && (
            <span className="text-red text-[8px]">▼ {(omegaMean - p.value).toFixed(2)} below mean</span>
          )}
          {p.dataKey === "cls" && d?.clsDip && (
            <span className="text-red text-[8px]">▼ {(clsMean - p.value).toFixed(2)} below mean</span>
          )}
        </div>
      ))}
    </div>
  );
}

function DipCard({ ch }) {
  const omegaGap = (omegaMean - ch.omega).toFixed(2);
  const clsGap   = ch.cls != null ? (clsMean - ch.cls).toFixed(2) : null;
  return (
    <div className="bg-card border border-red/20 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[8px] font-black font-mono text-red">Ch.{ch.ch} · Act {ch.act}</span>
        <span className="text-[7px] font-mono text-muted-foreground">{ch.title.slice(0, 20)}{ch.title.length > 20 ? "…" : ""}</span>
      </div>
      <div className="flex gap-3 text-[8px] font-mono">
        {ch.omegaDip && <span className="text-gold">Ω {ch.omega} <span className="text-red">(-{omegaGap})</span></span>}
        {ch.clsDip && clsGap && <span className="text-blue">CLS {ch.cls} <span className="text-red">(-{clsGap})</span></span>}
      </div>
    </div>
  );
}

export default function OmegaCLSTrendTab() {
  const [show, setShow] = useState({ omega: true, cls: true, acts: true });

  const omegaDips = chartData.filter(c => c.omegaDip && (omegaMean - c.omega) >= DIP_THRESHOLD);
  const clsDips   = chartData.filter(c => c.clsDip && c.cls != null && (clsMean - c.cls) >= DIP_THRESHOLD);

  return (
    <div className="animate-slide-up space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap border-b border-border pb-3">
        <div>
          <div className="text-base font-black text-gold">Ω / CLS SCORE TREND — ALL 45 CHAPTERS</div>
          <div className="text-[9px] font-mono text-muted-foreground">
            Omega (current) vs CLS — pacing dips flagged below mean · Act regions shaded
          </div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-[8px] font-mono px-2 py-0.5 rounded border bg-gold/10 text-gold border-gold/30">
            Ω mean {omegaMean}
          </span>
          <span className="text-[8px] font-mono px-2 py-0.5 rounded border bg-blue/10 text-blue border-blue/30">
            CLS mean {clsMean.toFixed(1)}
          </span>
          <span className="text-[8px] font-mono px-2 py-0.5 rounded border bg-red/10 text-red border-red/30">
            {omegaDips.length} Ω dips
          </span>
        </div>
      </div>

      {/* Toggle controls */}
      <div className="flex gap-1.5 flex-wrap">
        {[
          { key: "omega", label: "Ω Omega", color: "text-gold bg-gold/10 border-gold/40" },
          { key: "cls",   label: "CLS",     color: "text-blue bg-blue/10 border-blue/40" },
          { key: "acts",  label: "Act Bands",color: "text-purple bg-purple/10 border-purple/40" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setShow(s => ({ ...s, [t.key]: !s[t.key] }))}
            className={`text-[8px] font-bold font-mono px-2.5 py-1 rounded border transition-all ${
              show[t.key] ? t.color : "text-muted-foreground border-border"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main chart */}
      <div className="bg-card border border-border rounded-xl p-4">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />

            {/* Act bands */}
            {show.acts && ACT_BOUNDS.map(a => (
              <ReferenceArea
                key={a.act}
                x1={a.start} x2={a.end}
                fill={a.color}
                fillOpacity={0.04}
                label={{ value: `ACT ${a.act}`, position: "insideTopLeft", fontSize: 8, fill: a.color, opacity: 0.7 }}
              />
            ))}

            <XAxis
              dataKey="ch"
              type="number"
              domain={[1, 45]}
              ticks={[1, 5, 10, 15, 20, 25, 30, 35, 40, 45]}
              tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}
              tickFormatter={v => `Ch.${v}`}
              tickLine={false}
            />
            <YAxis
              domain={[85, 115]}
              tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 9, fontFamily: "monospace", paddingTop: 8 }}
            />

            {/* Reference lines */}
            {show.omega && (
              <ReferenceLine
                y={omegaMean}
                stroke="hsl(var(--gold))"
                strokeDasharray="4 3"
                strokeOpacity={0.5}
                label={{ value: `Ω mean ${omegaMean}`, position: "right", fontSize: 7, fill: "hsl(var(--gold))", opacity: 0.7 }}
              />
            )}
            {show.cls && (
              <ReferenceLine
                y={clsMean}
                stroke="hsl(var(--blue))"
                strokeDasharray="4 3"
                strokeOpacity={0.5}
                label={{ value: `CLS mean ${clsMean.toFixed(1)}`, position: "right", fontSize: 7, fill: "hsl(var(--blue))", opacity: 0.7 }}
              />
            )}

            {show.omega && (
              <Line
                type="monotone"
                dataKey="omega"
                name="Ω Omega"
                stroke="hsl(var(--gold))"
                strokeWidth={2}
                dot={(props) => {
                  const d = props.payload;
                  const isDip = d.omegaDip && (omegaMean - d.omega) >= DIP_THRESHOLD;
                  if (!isDip) return <circle key={props.key} cx={props.cx} cy={props.cy} r={2} fill="hsl(var(--gold))" opacity={0.5} />;
                  return <circle key={props.key} cx={props.cx} cy={props.cy} r={5} fill="hsl(var(--red))" stroke="hsl(var(--card))" strokeWidth={1.5} />;
                }}
                activeDot={{ r: 5, fill: "hsl(var(--gold))" }}
              />
            )}
            {show.cls && (
              <Line
                type="monotone"
                dataKey="cls"
                name="CLS"
                stroke="hsl(var(--blue))"
                strokeWidth={2}
                connectNulls
                dot={(props) => {
                  const d = props.payload;
                  const isDip = d.clsDip && d.cls != null && (clsMean - d.cls) >= DIP_THRESHOLD;
                  if (!isDip) return <circle key={props.key} cx={props.cx} cy={props.cy} r={2} fill="hsl(var(--blue))" opacity={0.5} />;
                  return <circle key={props.key} cx={props.cx} cy={props.cy} r={5} fill="hsl(var(--orange))" stroke="hsl(var(--card))" strokeWidth={1.5} />;
                }}
                activeDot={{ r: 5, fill: "hsl(var(--blue))" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        <div className="text-[8px] font-mono text-muted-foreground mt-2 flex gap-4 flex-wrap">
          <span><span className="text-red font-bold">●</span> Red dot = notable dip ({DIP_THRESHOLD}+ pts below mean)</span>
          <span>Hover any point for chapter detail</span>
        </div>
      </div>

      {/* Dip summary panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Omega dips */}
        <div>
          <div className="text-[8px] font-bold font-mono text-red mb-2 tracking-widest">
            Ω PACING DIPS — {omegaDips.length} chapters below mean by {DIP_THRESHOLD}+pts
          </div>
          {omegaDips.length === 0 ? (
            <div className="text-[9px] font-mono text-teal bg-teal/5 border border-teal/20 rounded-lg px-4 py-3">
              ✓ No significant Ω dips detected
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {omegaDips.map(c => <DipCard key={c.ch} ch={c} />)}
            </div>
          )}
        </div>

        {/* CLS dips */}
        <div>
          <div className="text-[8px] font-bold font-mono text-orange mb-2 tracking-widest">
            CLS PACING DIPS — {clsDips.length} chapters below mean by {DIP_THRESHOLD}+pts
          </div>
          {clsDips.length === 0 ? (
            <div className="text-[9px] font-mono text-teal bg-teal/5 border border-teal/20 rounded-lg px-4 py-3">
              ✓ No significant CLS dips detected
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {clsDips.map(c => <DipCard key={c.ch} ch={c} />)}
            </div>
          )}
        </div>
      </div>

      {/* Act summary */}
      <div className="grid grid-cols-3 gap-3">
        {ACT_BOUNDS.map(a => {
          const actChaps = chartData.filter(c => c.act === a.act);
          const avgO = (actChaps.reduce((s, c) => s + c.omega, 0) / actChaps.length).toFixed(2);
          const avgC = (actChaps.filter(c => c.cls != null).reduce((s, c) => s + c.cls, 0) / actChaps.filter(c => c.cls != null).length).toFixed(1);
          const dips = actChaps.filter(c => c.omegaDip && (omegaMean - c.omega) >= DIP_THRESHOLD).length;
          return (
            <div key={a.act} className="bg-card border border-border rounded-xl p-3">
              <div className="text-[8px] font-mono text-muted-foreground mb-1">ACT {a.act} · {actChaps.length} chapters</div>
              <div className="flex gap-4 text-[9px] font-mono">
                <span className="text-gold">Ω avg <span className="font-black">{avgO}</span></span>
                <span className="text-blue">CLS avg <span className="font-black">{avgC}</span></span>
                {dips > 0 && <span className="text-red">{dips} dips</span>}
                {dips === 0 && <span className="text-teal">✓ clean</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}