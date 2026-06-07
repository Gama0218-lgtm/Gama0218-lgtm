import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";

const AI_VISIBILITY = {
  score: 34.2,
  maxScore: 100,
  components: [
    { label:"Search Discoverability",  score:42, color:"gold"  },
    { label:"Content Authority",       score:38, color:"teal"  },
    { label:"Social Signal Strength",  score:29, color:"blue"  },
    { label:"Institutional Citations", score:31, color:"purple"},
    { label:"Earned Media Coverage",   score:22, color:"orange"},
  ],
  target: 65,
  notes:"Current score of 34.2 is in 'emerging' tier. Target 65+ by Month 18 launch. Primary lever: Earned media coverage (lowest sub-score).",
};

const HASHTAG_PERFORMANCE = [
  { tag:"#DeportedVeterans",   reach:"41K",  sentiment:78, trend:"↑ +14%", platform:"FB+IG",  priority:"P0" },
  { tag:"#VeteranosDeportados",reach:"18K",  sentiment:82, trend:"↑ +22%", platform:"FB+IG",  priority:"P0" },
  { tag:"#ExilePatriot",       reach:"3.2K", sentiment:88, trend:"↑ NEW",  platform:"TW+IG",  priority:"P0 — BUILD" },
  { tag:"#HispanicVeterans",   reach:"92K",  sentiment:74, trend:"→ 0%",   platform:"FB+TW",  priority:"P1" },
  { tag:"#TruthEngine360",     reach:"1.4K", sentiment:91, trend:"↑ NEW",  platform:"TW",     priority:"P0 — OWN" },
  { tag:"#MathematicsOfVietnam",reach:"280", sentiment:94, trend:"↑ NEW",  platform:"TW+IG",  priority:"P0 — BUILD" },
  { tag:"#349Rule",            reach:"640",  sentiment:87, trend:"↑ NEW",  platform:"TW",     priority:"P0 — SEED" },
  { tag:"#ChicanoLit",         reach:"88K",  sentiment:86, trend:"↑ +8%",  platform:"TW+IG",  priority:"P1 — JOIN" },
  { tag:"#BookTok",            reach:"12.4M",sentiment:72, trend:"↑ +31%", platform:"TK+IG",  priority:"P2 — JOIN" },
];

const REVERSE_STRATEGY = [
  { point:1, action:"TruthEngine360 is the FORWARD-FACING BRAND",         why:"AlbaVoice = author brand. TruthEngine360 = civic intelligence brand. The book exists inside TE360, not the other way around.",   urgency:"CRITICAL DISTINCTION" },
  { point:2, action:"Community first → Credibility builds → Gatekeepers follow", why:"Highest Ψ(t) group (Chicano/Latino, I=0.94) activates organically. That social pressure makes agents, publishers, and award committees take notice.",urgency:"START HERE" },
  { point:3, action:"Evidence-first content before marketing content",     why:"One factual stumble contaminates the entire brand. The 349 Rule must be bulletproof in every public format before any media pitch.", urgency:"NON-NEGOTIABLE" },
  { point:4, action:"English-first with HIGH-VALUE Spanish adaptation",    why:"Pew: 54% Latino adults mostly get news in English. Bilingual duplication is clumsy. Spanish only when it earns its place (code-switch, ritual, urgency).", urgency:"LANGUAGE PROTOCOL" },
  { point:5, action:"Credibility before scale",                            why:"Do not pay the highest price for the lowest trust. Build mid-tier validator network (ALVA, NACCS, DVSH) before going wide.", urgency:"OPERATOR RULE" },
];

const SGT_RAMOS_METRICS = [
  { label:"LSTE Composite",          val:"82.2/100",  sub:"Threshold 75",           color:"gold"   },
  { label:"Omega Effective Mean",    val:"104.94",    sub:"SD ±1.13",               color:"gold"   },
  { label:"Pulitzer Probability",    val:"68%",       sub:"→ 80%+ post-Sprint 5",   color:"teal"   },
  { label:"Chicano Canon Potential", val:"88%",       sub:"→ 92%+ canonical",       color:"purple" },
  { label:"Film/TV Adaptation",      val:"89/87/84",  sub:"TV/Film/Streaming LSTE", color:"orange" },
  { label:"CL-MoE Current",          val:"0.847",     sub:"Target: 0.979 (Sprint 4)",color:"red"   },
];

export default function TruthEngine360Intel() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <div className="text-lg font-black font-mono text-foreground mb-1">TruthEngine360 Intelligence Dashboard</div>
        <div className="text-xs text-muted-foreground font-mono">AI visibility score · sentiment tracking · hashtag performance · reverse-strategy framework · SGT Ramos campaign metrics</div>
      </div>

      {/* AI Visibility Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-gold/30 rounded-xl p-5">
          <div className="text-[9px] font-bold font-mono text-gold mb-3">AI VISIBILITY SCORE — TruthEngine360</div>
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-5xl font-black font-mono text-gold">{AI_VISIBILITY.score}</div>
              <div className="text-[8px] text-muted-foreground font-mono">CURRENT / 100</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[8px] font-mono mb-1">
                <span className="text-muted-foreground">Progress to target ({AI_VISIBILITY.target})</span>
                <span className="text-teal font-bold">{AI_VISIBILITY.score}/{AI_VISIBILITY.target}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gold rounded-full" style={{width:`${(AI_VISIBILITY.score/AI_VISIBILITY.target)*100}%`}} />
              </div>
              <div className="text-[8px] text-muted-foreground">{AI_VISIBILITY.notes}</div>
            </div>
          </div>
          <div className="space-y-2">
            {AI_VISIBILITY.components.map((c,i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[8px] text-foreground/80 w-40 flex-shrink-0">{c.label}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-${c.color}`} style={{width:`${c.score}%`}} />
                </div>
                <span className={`text-[9px] font-black font-mono text-${c.color} w-6 text-right`}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SGT Ramos Campaign Metrics */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[9px] font-bold font-mono text-teal mb-3">SGT RAMOS CAMPAIGN METRICS — LitCentral v12</div>
          <div className="grid grid-cols-2 gap-3">
            {SGT_RAMOS_METRICS.map((m,i) => (
              <div key={i} className={`bg-${m.color}/5 border border-${m.color}/20 rounded-lg p-3`}>
                <div className={`text-sm font-black font-mono text-${m.color}`}>{m.val}</div>
                <div className="text-[8px] font-bold text-foreground mt-0.5">{m.label}</div>
                <div className="text-[7px] text-muted-foreground">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hashtag Performance */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-purple">HASHTAG PERFORMANCE MATRIX — #DeportedVeterans · #ExilePatriot · #TruthEngine360</div>
        <div className="overflow-x-auto">
          <table className="w-full text-[9px]">
            <thead><tr className="border-b border-border text-[7px] font-mono text-muted-foreground">
              <th className="text-left px-3 py-2">HASHTAG</th><th className="text-right px-3 py-2">REACH</th>
              <th className="text-center px-3 py-2">SENTIMENT</th><th className="text-left px-3 py-2">TREND</th>
              <th className="text-left px-3 py-2">PLATFORM</th><th className="text-left px-3 py-2">PRIORITY</th>
            </tr></thead>
            <tbody>
              {HASHTAG_PERFORMANCE.map((h,i) => (
                <tr key={i} className={`border-b border-border/30 hover:bg-secondary/10 ${h.priority.includes("OWN")||h.priority==="P0"?"bg-gold/5":""}`}>
                  <td className="px-3 py-2.5 font-bold text-gold font-mono">{h.tag}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-foreground">{h.reach}</td>
                  <td className="px-3 py-2.5 text-center font-black font-mono text-teal">{h.sentiment}</td>
                  <td className={`px-3 py-2.5 font-bold font-mono text-[9px] ${h.trend.includes("↑")?"text-teal":"text-muted-foreground"}`}>{h.trend}</td>
                  <td className="px-3 py-2.5 text-[8px] font-mono text-muted-foreground">{h.platform}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[7px] font-bold font-mono px-1.5 py-0.5 rounded border ${h.priority.startsWith("P0")?"text-red border-red/30 bg-red/5":h.priority.startsWith("P1")?"text-gold border-gold/30 bg-gold/5":"text-muted-foreground border-border"}`}>{h.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reverse Strategy */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-gold/5 text-[9px] font-bold font-mono text-gold">REVERSE-STRATEGY FRAMEWORK — TruthEngine360 Operating Rules</div>
        {REVERSE_STRATEGY.map((r,i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-4 border-b border-border/30 last:border-0 hover:bg-secondary/10">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
              <span className="text-[9px] font-black font-mono text-gold">{r.point}</span>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-foreground mb-1">{r.action}</div>
              <div className="text-[9px] text-foreground/70">{r.why}</div>
            </div>
            <span className="text-[7px] font-bold font-mono px-2 py-1 rounded border text-gold border-gold/30 bg-gold/5 flex-shrink-0">{r.urgency}</span>
          </div>
        ))}
      </div>
    </div>
  );
}