import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const COHORTS = [
  { id:"chicano",    label:"Chicano/Latino Community",     I:0.94, C:0.71, T:0.90, lambda:0.45, mode:"Champion",           color:"#f5a623", desc:"Fastest-activating. Identity-first. Organic amplification engine."},
  { id:"veterans",   label:"Veterans / Military",           I:0.82, C:0.75, T:0.78, lambda:0.38, mode:"Validator",          color:"#50e3c2", desc:"Endorses if behavioral realism confirmed. Vocal advocate if trauma is honored."},
  { id:"mfa",        label:"MFA / Literary Scholars",       I:0.58, C:0.62, T:0.74, lambda:0.22, mode:"Skeptic→Convert",   color:"#9b59b6", desc:"Resists optimized aesthetics. Converts on restraint and originality."},
  { id:"awards",     label:"Literary Award Committees",     I:0.55, C:0.88, T:0.85, lambda:0.18, mode:"Gatekeeper",        color:"#e74c3c", desc:"Politically conservative. Responds to peer endorsement first."},
  { id:"commercial", label:"Mainstream Commercial Readers", I:0.61, C:0.44, T:0.72, lambda:0.35, mode:"Follower",          color:"#3498db", desc:"Waits for social proof before purchase."},
  { id:"foundation", label:"Foundation Program Officers",   I:0.72, C:0.90, T:0.86, lambda:0.31, mode:"Rational Evaluator",color:"#f39c12", desc:"Narrative + data combined. Distrusts either alone."},
  { id:"adaptation", label:"Film/TV Adaptation Execs",      I:0.70, C:0.65, T:0.88, lambda:0.41, mode:"Opportunity Scanner",color:"#1abc9c", desc:"Triggered by market comp + social virality signals."},
  { id:"genz",       label:"Gen Z Readers",                 I:0.65, C:0.38, T:0.91, lambda:0.51, mode:"Viral Amplifier",   color:"#e056fd", desc:"High social media energy if identity relevance is clear."},
];

const MODE_COLORS = {
  "Champion":"text-gold bg-gold/10 border-gold/30",
  "Validator":"text-teal bg-teal/10 border-teal/30",
  "Skeptic→Convert":"text-purple bg-purple/10 border-purple/30",
  "Gatekeeper":"text-red bg-red/10 border-red/30",
  "Follower":"text-blue bg-blue/10 border-blue/30",
  "Rational Evaluator":"text-orange bg-orange/10 border-orange/30",
  "Opportunity Scanner":"text-teal bg-teal/10 border-teal/30",
  "Viral Amplifier":"text-purple bg-purple/10 border-purple/30",
};

function computeR(I, C, T, lambda, E) {
  return +(I * C * T * (1 - Math.exp(-lambda * E))).toFixed(4);
}

export default function SocialPhysicsEngine() {
  const [selected, setSelected] = useState(COHORTS[0].id);
  const [exposure, setExposure] = useState(5);

  const cohort = COHORTS.find(c => c.id === selected);
  const R = computeR(cohort.I, cohort.C, cohort.T, cohort.lambda, exposure);

  const exposureCurve = Array.from({length:20}, (_, i) => ({
    E: i + 1,
    R: computeR(cohort.I, cohort.C, cohort.T, cohort.lambda, i + 1),
  }));

  const allR = COHORTS.map(c => ({
    label: c.label.split(" ").slice(0,2).join(" "),
    R: computeR(c.I, c.C, c.T, c.lambda, exposure),
    color: c.color,
    mode: c.mode,
  })).sort((a,b) => b.R - a.R);

  const radarData = [
    {dim:"Identity (I)",  val: cohort.I * 100},
    {dim:"Credibility (C)",val:cohort.C * 100},
    {dim:"Timing (T)",    val: cohort.T * 100},
    {dim:"Lambda (λ×100)",val:cohort.lambda * 100},
    {dim:"Response (R)",  val: R * 100},
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Formula Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-purple/30 bg-gradient-to-br from-purple/5 via-card to-gold/5 p-8">
        <div className="text-[9px] font-mono text-purple tracking-widest mb-3">SOCIAL PHYSICS ACTIVATION FORMULA — Pentland / MIT Media Lab Framework</div>
        <div className="text-2xl md:text-3xl font-black font-mono text-foreground mb-6">
          R = I · C · T · (1 − e<sup className="text-purple">−λ·E</sup>)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-[10px]">
          {[
            {sym:"R",label:"Response Intensity",color:"purple",def:"Predicted behavioral activation (0–1)"},
            {sym:"I",label:"Identity Resonance",color:"gold",  def:"Does the work reflect group identity? (0–1)"},
            {sym:"C",label:"Credibility Signal",color:"teal",  def:"Messenger institutional legitimacy (0–1)"},
            {sym:"T",label:"Timing Coefficient",color:"blue",  def:"Social/political moment favorability (0–1)"},
            {sym:"λ",label:"Conversion Rate",   color:"orange",def:"Cohort-specific activation constant"},
          ].map(f => (
            <div key={f.sym} className={`bg-card border border-${f.color}/20 rounded-xl p-3`}>
              <div className={`text-2xl font-black font-mono text-${f.color} mb-1`}>{f.sym}</div>
              <div className="text-[9px] font-bold text-foreground">{f.label}</div>
              <div className="text-[8px] text-muted-foreground mt-0.5">{f.def}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Selector + Live Calculator */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[10px] font-bold font-mono text-purple mb-3">LIVE ACTIVATION CALCULATOR</div>
          <div className="space-y-2 mb-4">
            {COHORTS.map(c => (
              <button key={c.id} onClick={() => setSelected(c.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left ${
                  selected === c.id ? "border-purple/50 bg-purple/10" : "border-border hover:border-purple/20"
                }`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor:c.color}} />
                  <span className="text-[10px] font-bold text-foreground">{c.label}</span>
                </div>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${MODE_COLORS[c.mode] || "text-muted-foreground"}`}>{c.mode}</span>
              </button>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-muted-foreground">EXPOSURE COUNT (E): {exposure} touchpoints</span>
              <span className="text-[9px] font-mono text-purple font-bold">R = {R}</span>
            </div>
            <input type="range" min={1} max={20} value={exposure} onChange={e => setExposure(+e.target.value)}
              className="w-full accent-purple" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {[{k:"I",v:cohort.I,c:"gold"},{k:"C",v:cohort.C,c:"teal"},{k:"T",v:cohort.T,c:"blue"},{k:"λ",v:cohort.lambda,c:"orange"}].map(x => (
              <div key={x.k} className={`bg-${x.c}/10 border border-${x.c}/20 rounded-lg p-2`}>
                <div className={`text-lg font-black font-mono text-${x.c}`}>{x.v}</div>
                <div className="text-[8px] font-mono text-muted-foreground">{x.k}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-purple/5 border border-purple/20 rounded-xl p-3">
            <div className="text-[9px] font-bold text-purple mb-1">BEHAVIORAL PROFILE: {cohort.mode}</div>
            <div className="text-[10px] text-foreground/80">{cohort.desc}</div>
          </div>
        </div>

        {/* Radar */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[10px] font-bold font-mono text-purple mb-3">COHORT VECTOR PROFILE — {cohort.label.toUpperCase()}</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="dim" tick={{fontSize:9, fill:"hsl(var(--muted-foreground))", fontFamily:"monospace"}} />
              <Radar dataKey="val" stroke={cohort.color} fill={cohort.color} fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All Cohorts Ranking at current E */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-[10px] font-bold font-mono text-gold mb-4">ACTIVATION RANKING — All Cohorts at E={exposure} Touchpoints</div>
        <div className="space-y-2">
          {allR.map((r, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-[8px] font-mono text-muted-foreground w-4 text-right">{i+1}</div>
              <div className="text-[10px] text-foreground w-44 flex-shrink-0 truncate">{r.label}</div>
              <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{width:`${r.R * 100}%`, backgroundColor:r.color}} />
              </div>
              <div className="text-[11px] font-black font-mono w-14 text-right" style={{color:r.color}}>{(r.R * 100).toFixed(1)}%</div>
              <div className="text-[8px] font-mono text-muted-foreground w-28 flex-shrink-0">{r.mode}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Exposure Curve */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-[10px] font-bold font-mono text-purple mb-3">ACTIVATION CURVE — {cohort.label} (R vs Exposure Count)</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={exposureCurve} barSize={14}>
            <XAxis dataKey="E" tick={{fontSize:8, fill:"hsl(var(--muted-foreground))", fontFamily:"monospace"}} label={{value:"Touchpoints (E)", position:"insideBottom", offset:-4, fontSize:8, fill:"hsl(var(--muted-foreground))"}} />
            <YAxis tick={{fontSize:8, fill:"hsl(var(--muted-foreground))", fontFamily:"monospace"}} domain={[0,1]} />
            <Tooltip formatter={v => [(v*100).toFixed(1)+"%","R"]} contentStyle={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",fontSize:10,fontFamily:"monospace"}} />
            <Bar dataKey="R">
              {exposureCurve.map((e, i) => (
                <Cell key={i} fill={i < exposure ? cohort.color : "hsl(var(--secondary))"} opacity={i < exposure ? 1 : 0.3} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}