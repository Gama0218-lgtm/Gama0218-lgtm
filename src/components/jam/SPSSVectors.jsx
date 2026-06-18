import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter } from "recharts";

const GROUPS = [
  { group:"Chicano/Latino",        I:0.94, C:0.71, T:0.90, lambda:0.45, mode:"Champion",          R_10:0.829, color:"#f5a623", rho:0.87, wi:0.82, psi:0.89 },
  { group:"Veterans/Military",     I:0.82, C:0.75, T:0.78, lambda:0.38, mode:"Validator",         R_10:0.738, color:"#50e3c2", rho:0.82, wi:0.75, psi:0.79 },
  { group:"Immigration/Policy",    I:0.78, C:0.80, T:0.88, lambda:0.34, mode:"Evaluator",         R_10:0.704, color:"#3498db", rho:0.79, wi:0.78, psi:0.81 },
  { group:"Nonprofits/Foundations",I:0.72, C:0.90, T:0.86, lambda:0.31, mode:"Evaluator",         R_10:0.669, color:"#f39c12", rho:0.68, wi:0.84, psi:0.74 },
  { group:"Journalists/Media",     I:0.76, C:0.78, T:0.92, lambda:0.42, mode:"Amplifier",         R_10:0.706, color:"#e74c3c", rho:0.71, wi:0.79, psi:0.80 },
  { group:"Documentary Producers", I:0.81, C:0.74, T:0.85, lambda:0.39, mode:"Converter",         R_10:0.726, color:"#1abc9c", rho:0.74, wi:0.77, psi:0.78 },
  { group:"Gen Z Readers",         I:0.65, C:0.38, T:0.91, lambda:0.51, mode:"Amplifier",         R_10:0.621, color:"#e056fd", rho:0.65, wi:0.42, psi:0.70 },
  { group:"MFA/Literary Scholars", I:0.58, C:0.62, T:0.74, lambda:0.22, mode:"Skeptic→Convert",  R_10:0.439, color:"#9b59b6", rho:0.60, wi:0.67, psi:0.49 },
  { group:"Literary Agents/Editors",I:0.60, C:0.85, T:0.80, lambda:0.28, mode:"Gatekeeper",      R_10:0.490, color:"#e74c3c", rho:0.63, wi:0.84, psi:0.55 },
  { group:"Academic Historians",   I:0.69, C:0.83, T:0.77, lambda:0.25, mode:"Validator",        R_10:0.474, color:"#27ae60", rho:0.66, wi:0.80, psi:0.54 },
];

const REGRESSION = [
  { var:"I — Identity Resonance", beta:"0.512", se:"0.068", t:"7.53", p:"<0.001", sig:"***" },
  { var:"T — Timing Coefficient", beta:"0.391", se:"0.057", t:"6.86", p:"<0.001", sig:"***" },
  { var:"C — Credibility Signal", beta:"0.287", se:"0.044", t:"6.52", p:"<0.001", sig:"***" },
  { var:"λ — Conversion Rate",    beta:"0.234", se:"0.039", t:"6.00", p:"<0.001", sig:"***" },
  { var:"ρ — Group Coherence",    beta:"0.198", se:"0.036", t:"5.50", p:"<0.001", sig:"***" },
];

const PC_TABLE = [
  {range:"0.00–0.29",meaning:"Cold field",         action:"Do not push yet",           color:"red"},
  {range:"0.30–0.49",meaning:"Early interest",     action:"Seed validators",           color:"orange"},
  {range:"0.50–0.69",meaning:"Warming field",      action:"Activate champions",        color:"gold"},
  {range:"0.70–0.84",meaning:"Cascade-ready",      action:"Launch targeted push",      color:"teal"},
  {range:"0.85+",    meaning:"Viral/institutional",action:"Expand media + partners",   color:"purple"},
];

const sortedByPsi = [...GROUPS].sort((a,b) => b.psi - a.psi);

export default function SPSSVectors() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <div className="text-lg font-black font-mono text-foreground mb-1">SPSS — SPBI Behavioral Vector System</div>
        <div className="text-xs text-muted-foreground font-mono">Master formula: Ψ(t) = Σ[wᵢ·Rᵢ(t)]·G(ρ)·M(t)·Pc | "Who feels it? Who trusts it? Who can move it? Who will act now?"</div>
      </div>

      {/* Master formula */}
      <div className="bg-gradient-to-br from-gold/5 via-card to-purple/5 border border-gold/20 rounded-xl p-6">
        <div className="text-[8px] font-mono text-gold mb-2">SPBI MASTER BEHAVIORAL PRESSURE SCORE</div>
        <div className="text-xl font-black font-mono text-foreground mb-4">
          Ψ(t) = Σ[wᵢ·Rᵢ(t)] · G(ρ) · M(t) · Pc
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-[9px]">
          {[
            {f:"Rᵢ(t) = I·C·T·(1−e^(−λE))",label:"Individual Response",color:"gold"},
            {f:"G(ρ) = 1 + αρ/(1+ρ)",        label:"Group Coherence",    color:"teal"},
            {f:"M(t) = e^β(t−t₀) · δ(event)",label:"Temporal Momentum",  color:"blue"},
            {f:"Pc = 1 − e^(−k·n·R̄)",       label:"Cascade Probability", color:"purple"},
            {f:"wᵢ = followers·centrality·authority·trust", label:"Influence Weight",color:"orange"},
          ].map((x,i) => (
            <div key={i} className={`bg-${x.color}/5 border border-${x.color}/20 rounded-lg p-2`}>
              <div className={`text-[8px] font-black font-mono text-${x.color} mb-1`}>{x.f}</div>
              <div className="text-[7px] text-muted-foreground">{x.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gold/10 border border-gold/20 rounded-lg p-3 text-[9px] text-gold font-bold">
          PRACTICAL RULE: Do NOT start with the highest-status group. Start with the highest Ψ(t) group. → Chicano/Latino (Ψ=0.89), Journalists (Ψ=0.80), Immigration/Policy (Ψ=0.81)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Ψ(t) Ranking Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold font-mono text-gold mb-3">Ψ(t) PRESSURE SCORE RANKING — Activation Priority Order</div>
          <div className="space-y-2">
            {sortedByPsi.map((g,i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-[8px] font-mono text-muted-foreground w-3">{i+1}</div>
                <div className="text-[8px] text-foreground w-40 flex-shrink-0 truncate">{g.group}</div>
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${g.psi*100}%`, backgroundColor:g.color}} />
                </div>
                <div className="text-[9px] font-black font-mono w-12 text-right" style={{color:g.color}}>{(g.psi*100).toFixed(0)}%</div>
                <span className="text-[7px] font-mono text-muted-foreground w-24 flex-shrink-0 truncate">{g.mode}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regression Output */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-purple">LOGISTIC REGRESSION OUTPUT — Nagelkerke R²=0.687, χ²(6)=24.88, p&lt;.001</div>
          <table className="w-full text-[9px]">
            <thead><tr className="border-b border-border text-[7px] font-mono text-muted-foreground">
              <th className="text-left px-3 py-2">VARIABLE</th><th className="text-right px-3 py-2">β</th>
              <th className="text-right px-3 py-2">SE</th><th className="text-right px-3 py-2">t</th>
              <th className="text-right px-3 py-2">p</th><th className="text-center px-3 py-2">SIG</th>
            </tr></thead>
            <tbody>
              {REGRESSION.map((r,i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                  <td className="px-3 py-2 font-bold text-gold">{r.var}</td>
                  <td className="px-3 py-2 text-right font-black text-teal font-mono">{r.beta}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground font-mono">{r.se}</td>
                  <td className="px-3 py-2 text-right text-foreground font-mono">{r.t}</td>
                  <td className="px-3 py-2 text-right text-blue font-mono">{r.p}</td>
                  <td className="px-3 py-2 text-center font-black text-gold">{r.sig}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-border text-[8px] font-mono text-muted-foreground">
            Influence is not popularity. Influence is movement capacity. wᵢ = followers × centrality × domain_authority × trust_score
          </div>
        </div>
      </div>

      {/* Cascade Probability Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-teal">CASCADE PROBABILITY (Pc) — When Pc ≥ 0.70 the group is ready for a trigger</div>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {PC_TABLE.map((p,i) => (
            <div key={i} className={`p-4 border-r border-border/30 last:border-0 text-center border-t-2 border-${p.color}/50`}>
              <div className={`text-sm font-black font-mono text-${p.color} mb-1`}>{p.range}</div>
              <div className="text-[9px] font-bold text-foreground mb-2">{p.meaning}</div>
              <div className={`text-[8px] text-${p.color} bg-${p.color}/5 border border-${p.color}/20 rounded px-2 py-1`}>{p.action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Group scores table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono">EXPANDED BASELINE GROUP SCORES — BISG Geocoding by Corridor</div>
        <div className="overflow-x-auto">
          <table className="w-full text-[9px]">
            <thead><tr className="border-b border-border text-[7px] font-mono text-muted-foreground">
              <th className="text-left px-3 py-2">GROUP</th>
              <th className="text-center px-2 py-2">I</th><th className="text-center px-2 py-2">C</th>
              <th className="text-center px-2 py-2">T</th><th className="text-center px-2 py-2">λ</th>
              <th className="text-center px-2 py-2">ρ</th><th className="text-center px-2 py-2">wᵢ</th>
              <th className="text-center px-2 py-2">R(E=10)</th><th className="text-center px-2 py-2">Ψ(t)</th>
              <th className="text-left px-3 py-2">MODE</th>
            </tr></thead>
            <tbody>
              {GROUPS.map((g,i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                  <td className="px-3 py-2 font-bold whitespace-nowrap" style={{color:g.color}}>{g.group}</td>
                  <td className="px-2 py-2 text-center font-mono">{g.I}</td>
                  <td className="px-2 py-2 text-center font-mono">{g.C}</td>
                  <td className="px-2 py-2 text-center font-mono">{g.T}</td>
                  <td className="px-2 py-2 text-center font-mono">{g.lambda}</td>
                  <td className="px-2 py-2 text-center font-mono">{g.rho}</td>
                  <td className="px-2 py-2 text-center font-mono">{g.wi}</td>
                  <td className="px-2 py-2 text-center font-black font-mono" style={{color:g.color}}>{(g.R_10*100).toFixed(1)}%</td>
                  <td className="px-2 py-2 text-center font-black font-mono text-gold">{(g.psi*100).toFixed(0)}%</td>
                  <td className="px-3 py-2 text-muted-foreground text-[8px]">{g.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}