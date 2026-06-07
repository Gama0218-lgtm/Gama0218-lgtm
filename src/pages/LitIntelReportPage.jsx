import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Shield, TrendingUp, Award, AlertTriangle, Users, Database, BarChart2, BookOpen, Star } from "lucide-react";

const SECTIONS = [
  { id:"status",       label:"I. Operational Status",    icon: BarChart2    },
  { id:"lste",         label:"II. LSTE Assessment",       icon: Star         },
  { id:"canon",        label:"III. Canonical Position",   icon: BookOpen     },
  { id:"market",       label:"IV. Market Intelligence",   icon: TrendingUp   },
  { id:"pulitzer",     label:"V. Pulitzer Vector",        icon: Award        },
  { id:"theory",       label:"VI. Critical Theory",       icon: Shield       },
  { id:"threat",       label:"VII. Overengineering Risk", icon: AlertTriangle},
  { id:"stakeholders", label:"VIII. Stakeholder Intel",   icon: Users        },
  { id:"pipeline",     label:"IX. Data Pipeline",         icon: Database     },
  { id:"final",        label:"X. Final Assessment",       icon: FileText     },
];

const LSTE_DOMAINS = [
  { n:"I",   domain:"Canonical Literary",       score:79.6, key:"Exceeds war canon CLS +4.1, BIS +1.3; Chicano canon CLS +10.6; SII outperforms war canon +77 pts",   color:"blue"   },
  { n:"II",  domain:"Pulitzer / Awards Vector", score:80.7, key:"Historical Relevance 91, Political Timing 90 -- highest sub-scores; Restraint 67 is gating variable", color:"gold"   },
  { n:"III", domain:"Marketability Engine",     score:81.6, key:"Film 87, TV 89, Streaming 84; Hispanic Reader Index 94; Berkeley 91, UT Austin 90",                  color:"orange" },
  { n:"IV",  domain:"Critical Theory Survival", score:87.4, key:"Ethnic Studies 93, Borderlands Theory 91, Collapse-Proof Index 92 -- deepens under scrutiny",         color:"teal"   },
  { n:"V",   domain:"Reader Cognitive Stress",  score:81.7, key:"Scene Retention 87, Adaptation Visualization 88; Reader Fatigue Risk 69 (key vulnerability)",        color:"purple" },
];

const CANON_COMPS = [
  { title:"The Things They Carried", author:"Tim O'Brien",    overlap:"Shares memory and truth mechanics",          differentiator:"Adds Chicano/Indigenous perspective entirely absent in O'Brien",   color:"blue"   },
  { title:"Matterhorn",              author:"Karl Marlantes", overlap:"Shares tactical realism",                    differentiator:"Adds spiritual/magical realism layer Marlantes does not attempt",  color:"orange" },
  { title:"Pedro Paramo",            author:"Juan Rulfo",     overlap:"Shares voices-of-dead, non-linear structure",differentiator:"Grounds it in a documented 20th-century historical conflict",       color:"gold"   },
];

const REVENUE_TABLE = [
  { stream:"Publisher Advance",    conservative:"$25K-$50K",  base:"$75K-$150K",    optimistic:"$150K-$300K" },
  { stream:"Film Option Rights",   conservative:"$0",          base:"$25K-$75K/yr",  optimistic:"$75K-$150K/yr" },
  { stream:"TV Series Option",     conservative:"$0",          base:"$50K-$100K/yr", optimistic:"$100K-$250K/yr" },
  { stream:"Academic Adoption",    conservative:"$10K-$25K",  base:"$40K-$80K",     optimistic:"$100K-$200K" },
  { stream:"Grants + Fellowships", conservative:"$7.5K-$60K", base:"$60K-$200K",    optimistic:"$200K-$800K" },
  { stream:"5-Year TOTAL",         conservative:"$63K-$142K", base:"$385K-$940K",   optimistic:"$1.54M-$4.85M", isTotal:true },
];

const PULITZER_SCORES = [
  { label:"Historical Relevance", score:91, note:"349 Rule: DCAS 84.9% classification failure -- forensic civic intelligence spine no prior war novel possesses",          color:"gold"  },
  { label:"Political Timing",     score:90, note:"Deported veteran crisis, border politics, Chicano reclamation discourse at peak cultural salience in 2026",              color:"gold"  },
  { label:"Moral Weight",         score:82, note:"Interrogates power (Crawford/IBM/Pentagon) rather than merely dramatizing combat",                                        color:"teal"  },
  { label:"Restraint",            score:67, note:"GATING VARIABLE. Elite literary institutions distrust visible optimization. Target: 80+. Sprint 5 is Pulitzer-critical.", color:"red"   },
];

const CRITICAL_THEORY = [
  { framework:"Postcolonial",         score:88 },
  { framework:"Decolonial",           score:86 },
  { framework:"Trauma Theory",        score:90 },
  { framework:"Borderlands Theory",   score:91 },
  { framework:"Ethnic Studies",       score:93 },
  { framework:"Memory Studies",       score:89 },
  { framework:"Collapse-Proof Index", score:92 },
];

const OVERENGINEERING_RISKS = [
  { risk:"Systems-language in prose",               severity:"HIGH", detail:"IBM 360 motif is intentional and strong. Any unintentional spillover from LitCentral process into manuscript voice would be fatal to prestige positioning." },
  { risk:"Ch.16 + Ch.17 structural echo",           severity:"HIGH", detail:"Both chapters end on 'The dead spoke.' If unintentional, signals architecturally templated writing process to any MFA reader." },
  { risk:"Over-explained emotional beats",          severity:"MED",  detail:"Identified across Chapter Revision Workbook. Sentences that tell vs. show. Anti-overengineering pass is not optional." },
  { risk:"IBM 360 metaphor distribution imbalance", severity:"MED",  detail:"Strong in Pentagon chapters but underweighted in 1968 combat sequences -- where it should be felt as invisible weight, not named." },
  { risk:"OverengineeringPenalty in Pulitzer Vector",severity:"CRIT", detail:"Carries negative weight of -0.12. Every sentence using 'protocol,' 'algorithm,' 'vector,' 'framework' in prose directly damages award probability." },
];

const AGENTS = [
  { agent:"Ayesha Pande (Ayesha Pande Literary)",       focus:"Multicultural literary fiction",  why:"Represents Sandra Cisneros legacy; Chicano canon alignment" },
  { agent:"Victoria Sanders (Victoria Sanders + Assoc.)",focus:"Latino/diverse literary fiction", why:"Consistent Big Five placements in ethnic literary fiction" },
  { agent:"Joanna Pulcini (Joanna Pulcini Literary)",    focus:"Prestige literary fiction",       why:"Strong Knopf/FSG relationships" },
  { agent:"Erin Harris (Folio Literary Management)",     focus:"Historical fiction / war lit",    why:"Marlantes-adjacent war lit positioning" },
  { agent:"Jim Rutman (Sterling Lord Literistic)",       focus:"Literary fiction",                why:"Deep Norton/FSG/PRH relationships" },
];

const PUBLISHERS = [
  { name:"Farrar, Straus + Giroux (FSG)", fit:"Highest prestige imprint; awards-circuit specialist; Diaz, O'Brien precedents" },
  { name:"W.W. Norton",                  fit:"War literature + ethnic studies crossover; academic adoption strength" },
  { name:"Knopf (Penguin Random House)", fit:"Latino literary fiction (Cisneros, Diaz); prestige hardcover" },
  { name:"Algonquin Books",              fit:"Multicultural literary fiction; regional/ethnic specialist" },
  { name:"Arte Publico Press (U of H)",  fit:"Chicano canon anchor; academic distribution; groundbreaking positioning" },
];

const ACADEMIC = [
  { institution:"UC Berkeley (Ethnic Studies)", score:"93/91", contact:"Dr. Laura Perez -- Chicana/o Studies; Ramon Saldivar -- Stanford adjacency" },
  { institution:"UT Austin",                    score:"90",    contact:"Dr. Jose Limon -- Mexican American Studies; Dr. Norma Cantu" },
  { institution:"Iowa Writers' Workshop",       score:"81",    contact:"Adjunct war literature faculty; MFA thesis comparison corpus" },
  { institution:"USC (your institution)",       score:"--",    contact:"Dr. Viet Thanh Nguyen (English/American Studies) -- The Sympathizer author; direct comp author" },
];

const FOUNDATIONS = [
  { name:"National Endowment for the Humanities", program:"Creative Writing Fellowship",             amount:"$60,000" },
  { name:"Ford Foundation",                       program:"Creativity + Free Expression",            amount:"$200K-$500K" },
  { name:"Mellon Foundation",                     program:"Higher Education + Culture (Literary Arts)", amount:"$100K-$300K" },
  { name:"MacArthur Foundation",                  program:"Genius Grant (long cultivation required)", amount:"$800,000 unrestricted" },
  { name:"PEN America",                           program:"Literary Awards + Emergency Fund",         amount:"$15K-$50K" },
  { name:"Kirkus Prize",                          program:"Fiction",                                  amount:"$50,000" },
  { name:"Lannan Foundation",                     program:"Literary Fellowship",                      amount:"$200,000" },
  { name:"Sundance Institute",                    program:"Film/TV adaptation development",           amount:"$10K-$25K" },
];

const CHICANO_ORGS = [
  { org:"NACCS (Natl Assoc. for Chicana and Chicano Studies)", relevance:"Primary scholarly society; conference presentations = canon legitimacy" },
  { org:"Macondo Writers' Workshop (Sandra Cisneros)",          relevance:"Chicano literary community gateway; direct Cisneros connection" },
  { org:"PEN America Latino Writers",                           relevance:"Award eligibility + network access" },
  { org:"REFORMA (ALA Latino Librarians)",                      relevance:"Library adoption = shelf visibility + course adoption pipeline" },
  { org:"Recovering the US Hispanic Literary Heritage (Arte Publico)", relevance:"Archive and canon placement; scholarly citation network" },
];

const FINAL_ASSESSMENT = [
  { dimension:"Literary Prestige Potential",     current:"Extremely High (91%)", target:"Stable",                            currentColor:"text-gold",   targetColor:"text-gold"  },
  { dimension:"Mainstream Commercial Potential", current:"Moderate-High (74%)",  target:"High (82%) after CL-MoE crossover", currentColor:"text-blue",   targetColor:"text-teal"  },
  { dimension:"Academic Adoption",               current:"Very High (90%)",       target:"Very High (93%)",                   currentColor:"text-teal",   targetColor:"text-teal"  },
  { dimension:"Pulitzer Probability",            current:"Plausible (68%)",       target:"Strong (80%+) after Restraint pass",currentColor:"text-gold",   targetColor:"text-gold"  },
  { dimension:"Chicano Canon Potential",         current:"Very High (88%)",       target:"Canonical (92%+)",                  currentColor:"text-teal",   targetColor:"text-teal"  },
  { dimension:"Adaptation Potential",            current:"Extremely High (88%)",  target:"Extremely High",                    currentColor:"text-gold",   targetColor:"text-gold"  },
  { dimension:"Long-Term Scholarly Relevance",   current:"High",                  target:"Very High after Gate 2",            currentColor:"text-blue",   targetColor:"text-teal"  },
  { dimension:"Risk of Collapse Under Revision", current:"High",                  target:"Mitigated by Sprint 5",             currentColor:"text-red",    targetColor:"text-teal"  },
];

const SEV_STYLES = {
  CRIT:"text-red border-red/40 bg-red/10",
  HIGH:"text-orange border-orange/40 bg-orange/10",
  MED:"text-gold border-gold/30 bg-gold/5",
};

export default function LitIntelReportPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("status");

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-gold via-purple to-teal" />

      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-mono">
            <ArrowLeft className="w-3.5 h-3.5" />
            LITCENTRAL
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gold font-mono truncate">HIGH-LEVEL LITERARY INTELLIGENCE REPORT</div>
            <div className="text-[9px] text-muted-foreground font-mono">SGT George Ramos: The Mathematics of Vietnam -- May 22, 2026</div>
          </div>
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="text-[9px] font-mono text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full">Omega 104.94</div>
            <div className="text-[9px] font-mono text-teal bg-teal/10 border border-teal/30 px-3 py-1 rounded-full">LSTE 82.2</div>
            <div className="text-[9px] font-mono text-purple bg-purple/10 border border-purple/30 px-3 py-1 rounded-full">Pulitzer 68%</div>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono whitespace-nowrap transition-all ${
                    activeSection === s.id ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}>
                  <Icon className="w-3 h-3" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-8">

        {activeSection === "status" && (
          <div className="space-y-6 animate-slide-up">
            <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 via-card to-purple/5 p-8">
              <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"radial-gradient(circle at 15% 50%, hsla(43,90%,61%,0.07) 0%, transparent 50%), radial-gradient(circle at 85% 30%, hsla(263,100%,74%,0.07) 0%, transparent 50%)"}} />
              <div className="relative">
                <div className="text-[9px] font-mono text-gold tracking-widest mb-2">OPERATIONAL STATUS SUMMARY -- MAY 22, 2026</div>
                <div className="text-3xl md:text-4xl font-black text-foreground font-mono mb-1">SGT GEORGE RAMOS</div>
                <div className="text-base text-muted-foreground mb-6">The Mathematics of Vietnam</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    {val:"247,181",label:"Words",sub:"45 chapters",color:"text-foreground"},
                    {val:"104.94",label:"Omega Eff. Mean",sub:"SD +/-1.13",color:"text-gold"},
                    {val:"82.2/100",label:"LSTE Composite",sub:"Threshold: 75",color:"text-teal"},
                    {val:"R2 0.947",label:"Model Fit",sub:"alpha = 0.938",color:"text-blue"},
                  ].map(s => (
                    <div key={s.label} className="bg-background/60 border border-border rounded-xl p-4 text-center">
                      <div className={`text-2xl font-black font-mono ${s.color}`}>{s.val}</div>
                      <div className="text-[9px] font-bold text-foreground mt-0.5">{s.label}</div>
                      <div className="text-[8px] text-muted-foreground">{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="font-mono text-sm text-foreground/80 bg-background/60 rounded-xl p-5 border border-border mb-6 leading-loose">
                  <span className="text-gold font-bold">Omega</span> = 71.443 + 0.124(<span className="text-purple font-bold">CLS</span>) + 0.118(<span className="text-orange font-bold">BIS</span>) + 0.089(<span className="text-cyan font-bold">SII</span>) + 0.067(<span className="text-blue font-bold">MRF</span>)
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="text-[10px] font-bold font-mono text-muted-foreground mb-2">TIER DISTRIBUTION -- ZERO SILVER. ZERO BRONZE.</div>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      {label:"OMEGA ELITE",n:3, color:"text-gold",  bg:"bg-gold/10 border-gold/30"},
                      {label:"GOLD+",      n:16,color:"text-gold",  bg:"bg-gold/5 border-gold/20"},
                      {label:"GOLD",       n:26,color:"text-blue",  bg:"bg-blue/5 border-blue/20"},
                      {label:"SILVER",     n:0, color:"text-muted-foreground",bg:"bg-secondary/30 border-border"},
                      {label:"BRONZE",     n:0, color:"text-muted-foreground",bg:"bg-secondary/30 border-border"},
                    ].map(t => (
                      <div key={t.label} className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${t.bg}`}>
                        <span className={`text-xl font-black font-mono ${t.color}`}>{t.n}</span>
                        <span className={`text-[9px] font-bold font-mono ${t.color}`}>{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-orange/30 rounded-xl p-5">
              <div className="text-[10px] font-bold font-mono text-orange mb-3">CL-MoE CRITICAL GAP</div>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-black font-mono text-orange">0.847</div>
                  <div className="text-[8px] text-muted-foreground font-mono">CURRENT</div>
                </div>
                <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-orange rounded-full" style={{width:`${(0.847/0.979)*100}%`}} />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black font-mono text-teal">0.979</div>
                  <div className="text-[8px] text-muted-foreground font-mono">CROSSOVER</div>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground">Gap of <span className="text-orange font-bold">0.132</span> -- driven primarily by lower SII scores in Act III. Sprint 4 SII expansion closes this. Projected advance impact: +$15K-$30K.</div>
            </div>
            <div className="bg-card border border-red/20 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-red/20 bg-red/5">
                <div className="text-[10px] font-bold font-mono text-red">CRITICAL BLOCKERS AS OF TODAY -- Solvable in 60-80 hrs across 5 sprints</div>
              </div>
              <div className="divide-y divide-border/50">
                {[
                  {ch:"Ch.1",    blocker:"Line 1 artifact: 'REVISED CHAPTER -- FIRST PASS'",                impact:"Kills first agent impression"},
                  {ch:"Ch.34",   blocker:"Last line artifact: 'PASS 2 COMPLETE -- LITCENTRAL HYBRID DIAGNOSTIC'", impact:"Submission-killing draft residue"},
                  {ch:"Ch.9/10", blocker:"700+ line near-identical duplication",                            impact:"Structural integrity failure"},
                  {ch:"Ch.10",   blocker:"Ramirez/Rodriguez name swap at ~60% through",                     impact:"Character registry corruption"},
                  {ch:"Ch.40/45",blocker:"Character death timeline conflict",                               impact:"Continuity failure visible to copy editor"},
                  {ch:"Ch.42",   blocker:"Incomplete at 2,604 words (target: ~5,500)",                      impact:"Arc truncation -- word count flag"},
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-4 px-5 py-3 hover:bg-secondary/10">
                    <span className="text-[9px] font-bold font-mono text-red w-12 flex-shrink-0">{b.ch}</span>
                    <div className="flex-1 text-[10px] text-foreground">{b.blocker}</div>
                    <div className="text-[9px] text-red font-mono flex-shrink-0 text-right">{b.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "lste" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">II. LSTE FIVE-DOMAIN ASSESSMENT</div>
            <div className="space-y-3">
              {LSTE_DOMAINS.map((d, i) => {
                const barPct = ((d.score - 70) / 20) * 100;
                return (
                  <div key={i} className={`bg-card border border-${d.color}/20 rounded-xl p-5`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className={`text-[9px] font-bold font-mono text-${d.color} border border-${d.color}/30 px-1.5 py-0.5 rounded inline-block mb-1`}>Domain {d.n}</div>
                        <div className="text-sm font-black text-foreground">{d.domain}</div>
                      </div>
                      <div className={`text-3xl font-black font-mono text-${d.color} flex-shrink-0`}>{d.score}</div>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full bg-${d.color}`} style={{width:`${barPct}%`}} />
                    </div>
                    <div className="text-[10px] text-foreground/80">{d.key}</div>
                    {d.n === "II" && (
                      <div className="mt-3 bg-red/10 border border-red/30 rounded-lg px-3 py-2 text-[10px] text-red font-bold">
                        GATING VARIABLE: Restraint 67/100 -- must reach 80+ before award-circuit submission. Sprint 5 is Pulitzer-critical.
                      </div>
                    )}
                    {d.n === "IV" && (
                      <div className="mt-3 bg-teal/10 border border-teal/30 rounded-lg px-3 py-2 text-[10px] text-teal font-bold">
                        STRONGEST DOMAIN: Critical Theory Survival 87.4 -- the manuscript deepens under scholarly scrutiny.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[10px] font-bold font-mono text-gold mb-3">SINGLE MOST IMPORTANT NUMBER IN THE ENTIRE FRAMEWORK</div>
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-5xl font-black font-mono text-red">67</div>
                  <div className="text-[9px] font-bold text-red font-mono mt-1">RESTRAINT SCORE</div>
                </div>
                <p className="flex-1 text-sm text-foreground font-sans leading-relaxed">
                  Pulitzer committees penalize visible optimization. This manuscript shows signs of being too architecturally aware of itself in places.
                  This score must reach <span className="text-gold font-bold">80+ before award-circuit submission.</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "canon" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">III. CANONICAL POSITION + COMPARATIVE CORPUS</div>
            <div className="bg-gradient-to-br from-gold/5 via-card to-blue/5 border border-gold/20 rounded-xl p-6">
              <div className="text-[10px] font-bold font-mono text-gold mb-3">BLUE OCEAN POSITIONING</div>
              <p className="text-sm text-foreground font-sans leading-relaxed">
                No novel currently in print combines <span className="text-gold font-bold">Chicano identity, Vietnam combat realism, magical realism, and Pentagon-level institutional critique</span> in a single work at literary fiction quality.
                This is the first novel to create Chicano combat literature as a genre -- not participate in it, but <span className="text-teal font-bold">create it</span>.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  {label:"vs. War Canon",metric:"CLS +10.6",sub:"above Chicano canon mean",color:"gold"},
                  {label:"SII Advantage",metric:"+77 pts",sub:"above war canon (O'Brien/Marlantes/Heller)",color:"teal"},
                  {label:"Genre Creation",metric:"FIRST",sub:"Chicano combat lit as genre",color:"purple"},
                ].map(m => (
                  <div key={m.label} className={`bg-background/60 border border-${m.color}/20 rounded-lg p-3 text-center`}>
                    <div className={`text-xl font-black font-mono text-${m.color}`}>{m.metric}</div>
                    <div className="text-[9px] font-bold text-foreground mt-0.5">{m.label}</div>
                    <div className="text-[8px] text-muted-foreground">{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {CANON_COMPS.map((c, i) => (
                <div key={i} className={`bg-card border border-${c.color}/20 rounded-xl p-5`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-2 self-stretch rounded-full bg-${c.color}/60`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`text-xs font-black font-mono text-${c.color}`}>{c.title}</div>
                        <div className="text-[9px] text-muted-foreground">-- {c.author}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                        <div>
                          <div className="text-[8px] font-mono text-muted-foreground mb-0.5">SHARED TERRITORY</div>
                          <div className="text-foreground/80">{c.overlap}</div>
                        </div>
                        <div>
                          <div className="text-[8px] font-mono text-muted-foreground mb-0.5">SGT RAMOS DIFFERENTIATOR</div>
                          <div className={`text-${c.color} font-bold`}>{c.differentiator}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "market" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">IV. MARKET INTELLIGENCE + REVENUE SCENARIOS</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {label:"Global Fiction Market 2030",val:"$67.72B",sub:"From $54.34B (2025) CAGR 4.5%",color:"gold"},
                {label:"Audiobook CAGR",val:"8.49%",sub:"Fastest-growing format. BIS 88.9 = native audio",color:"teal"},
                {label:"US Hispanic Market",val:"$4.1T",sub:"68.1M people. Median age 31",color:"orange"},
              ].map(m => (
                <div key={m.label} className={`bg-card border border-${m.color}/30 rounded-xl p-5`}>
                  <div className={`text-3xl font-black font-mono text-${m.color}`}>{m.val}</div>
                  <div className="text-xs font-bold text-foreground mt-1">{m.label}</div>
                  <div className="text-[9px] text-muted-foreground mt-1">{m.sub}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">5-YEAR REVENUE PROJECTIONS -- THREE SCENARIOS</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border text-[8px] text-muted-foreground font-mono">
                      <th className="text-left px-4 py-2">REVENUE STREAM</th>
                      <th className="text-right px-4 py-2 text-blue">CONSERVATIVE</th>
                      <th className="text-right px-4 py-2 text-gold">BASE CASE</th>
                      <th className="text-right px-4 py-2 text-teal">OPTIMISTIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REVENUE_TABLE.map((r, i) => (
                      <tr key={i} className={`border-b border-border/30 hover:bg-secondary/10 ${r.isTotal ? "bg-gold/5" : ""}`}>
                        <td className={`px-4 py-3 ${r.isTotal ? "font-black text-gold font-mono" : "font-bold text-foreground"}`}>{r.stream}</td>
                        <td className={`px-4 py-3 text-right font-mono ${r.isTotal ? "font-black text-blue" : "text-muted-foreground"}`}>{r.conservative}</td>
                        <td className={`px-4 py-3 text-right font-mono ${r.isTotal ? "font-black text-gold" : "text-foreground font-bold"}`}>{r.base}</td>
                        <td className={`px-4 py-3 text-right font-mono ${r.isTotal ? "font-black text-teal" : "text-teal"}`}>{r.optimistic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-card border border-teal/20 rounded-xl p-5">
              <div className="text-[10px] font-bold font-mono text-teal mb-3">HIGHEST-VALUE IMMEDIATE VECTOR -- ADAPTATION</div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[{label:"Film",score:87},{label:"TV Series",score:89},{label:"Streaming",score:84}].map(a => (
                  <div key={a.label} className="text-center bg-teal/5 border border-teal/20 rounded-lg p-3">
                    <div className="text-2xl font-black font-mono text-teal">{a.score}</div>
                    <div className="text-[9px] text-muted-foreground font-bold">{a.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-foreground/80">45-chapter arc maps cleanly to a 2-season prestige television structure. Streaming comps: Gentefied, Selena, Never Have I Ever -- positions perfectly for HBO/Netflix Latino content mandates.</p>
            </div>
          </div>
        )}

        {activeSection === "pulitzer" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">V. PULITZER VECTOR ANALYSIS</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-gold/30 rounded-xl p-6 text-center">
                <div className="text-[9px] font-mono text-muted-foreground mb-2">CURRENT ESTIMATE</div>
                <div className="text-6xl font-black font-mono text-gold">68%</div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">Pulitzer Probability</div>
              </div>
              <div className="bg-card border border-teal/30 rounded-xl p-6 text-center">
                <div className="text-[9px] font-mono text-muted-foreground mb-2">POST-SPRINT 5 ESTIMATE</div>
                <div className="text-6xl font-black font-mono text-teal">80%+</div>
                <div className="text-[9px] text-teal font-mono font-bold mt-1">After Restraint pass</div>
              </div>
            </div>
            <div className="space-y-3">
              {PULITZER_SCORES.map((p, i) => (
                <div key={i} className={`bg-card rounded-xl p-5 border ${p.color === "red" ? "border-red/30 bg-red/5" : "border-border"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-foreground">{p.label}</div>
                    <div className={`text-2xl font-black font-mono text-${p.color}`}>{p.score}</div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full bg-${p.color}`} style={{width:`${p.score}%`}} />
                  </div>
                  <div className={`text-[10px] ${p.color === "red" ? "text-red font-bold" : "text-muted-foreground"}`}>{p.note}</div>
                </div>
              ))}
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-red/10 via-card to-background border-2 border-red/50 rounded-2xl p-7">
              <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"radial-gradient(circle at 10% 50%, rgba(255,60,60,0.08) 0%, transparent 60%)"}} />
              <div className="relative">
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div>
                    <div className="text-[9px] font-mono text-red tracking-[0.18em] uppercase mb-2">PULITZER VECTOR — CRITICAL NEGATIVE WEIGHT</div>
                    <div className="text-2xl font-black font-mono text-foreground">OverengineeringPenalty</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-5xl font-black font-mono text-red">−0.12</div>
                    <div className="text-[9px] font-mono text-red/80 mt-1">β weight in Pulitzer formula</div>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 font-sans leading-relaxed mb-5">
                  This penalty carries a <span className="text-red font-black">negative weight of −0.12</span> in the Pulitzer Vector formula.
                  It operates silently: a committee member cannot articulate why a manuscript feels
                  <span className="text-red font-bold"> constructed</span> rather than <span className="text-gold font-bold">alive</span> —
                  but they feel it in every sentence that knows it is being scored.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {["protocol","algorithm","vector","framework"].map(word => (
                    <div key={word} className="bg-red/10 border border-red/30 rounded-xl p-3 text-center">
                      <div className="text-[10px] font-black font-mono text-red line-through mb-1">&quot;{word}&quot;</div>
                      <div className="text-[8px] text-muted-foreground">Damages award probability</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-red/5 border border-red/20 rounded-xl p-4">
                    <div className="text-[9px] font-bold font-mono text-red mb-2">WHAT IT DETECTS</div>
                    <ul className="space-y-1.5 text-[10px] text-foreground/80">
                      {[
                        "Systems-language that leaked from LitCentral into prose voice",
                        "Ch.16 + Ch.17 structural echo — both ending on 'The dead spoke'",
                        "Over-explained emotional beats (tell vs. show failures)",
                        "IBM 360 metaphor named instead of felt in combat sequences",
                        "Visible architectural symmetry in three-part lists",
                      ].map((item,i) => (
                        <li key={i} className="flex items-start gap-1.5"><span className="text-red flex-shrink-0 mt-0.5">✗</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                    <div className="text-[9px] font-bold font-mono text-gold mb-2">WHAT SPRINT 5 PROTECTS</div>
                    <ul className="space-y-1.5 text-[10px] text-foreground/80">
                      {[
                        "Spiritual violence — what faith costs in a killing field",
                        "Cultural memory — what the ancestors carry without being asked",
                        "Mathematical obsession — the IBM 360 logic felt, not named",
                        "Grief architecture — the structural weight of who does not come home",
                        "One moment of controlled narrative imperfection per Act",
                      ].map((item,i) => (
                        <li key={i} className="flex items-start gap-1.5"><span className="text-gold flex-shrink-0 mt-0.5">✓</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-5 border-t border-red/20 pt-5">
                  <div className="text-[9px] font-mono text-muted-foreground mb-3">PULITZER PROBABILITY IMPACT</div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-black font-mono text-gold">68%</div>
                      <div className="text-[8px] font-mono text-muted-foreground">CURRENT</div>
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gold to-teal rounded-full" style={{width:"68%"}} />
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2" style={{left:"80%"}}>
                        <div className="w-px h-5 bg-teal/60" />
                      </div>
                      <div className="text-[7px] font-mono text-teal mt-1" style={{marginLeft:"72%"}}>TARGET 80%+</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black font-mono text-teal">80%+</div>
                      <div className="text-[8px] font-mono text-teal">POST-SPRINT 5</div>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-foreground/70 font-sans italic border-l-2 border-gold/40 pl-3">
                    "Sprint 5 is not a polish pass. It is a protection pass. The job is to remove what the system built and protect what the author bled. Those are different kinds of work, and only one of them can be automated."
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "theory" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">VI. CRITICAL THEORY SURVIVAL</div>
            <div className="bg-teal/5 border border-teal/30 rounded-xl p-5">
              <p className="text-sm text-foreground font-sans leading-relaxed">
                This is where the manuscript is most defensible. The manuscript does not collapse under ideological scrutiny -- <span className="text-teal font-bold">it deepens.</span>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CRITICAL_THEORY.map((t, i) => {
                const pct = ((t.score - 80) / 15) * 100;
                const color = t.score >= 91 ? "teal" : t.score >= 88 ? "gold" : "blue";
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[11px] font-bold text-foreground">{t.framework}</div>
                      <div className={`text-2xl font-black font-mono text-${color}`}>{t.score}</div>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-${color}`} style={{width:`${pct}%`}} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-card border border-gold/20 rounded-xl p-5">
              <div className="text-[10px] font-bold font-mono text-gold mb-3">GENEALOGICAL SPINE -- SCHOLARLY VALIDATION LAYER</div>
              <p className="text-sm text-foreground font-sans leading-relaxed">
                The Terminel-Sagasta family history adds a second layer of scholarly validation: the novel's genealogical spine is not invented --
                it derives from a documented case of generational displacement using verified exponential modeling.
              </p>
              <div className="mt-3 font-mono text-sm text-foreground/80 bg-background border border-border rounded-lg p-4">
                <span className="text-teal font-bold">N_t = N0 x e^(rt)</span>{" "}
                {" "}R0 = 3.12{" "}
                <span className="text-muted-foreground text-xs">Sangalang + Vang 2017 intergenerational trauma framework</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === "threat" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">VII. THE REAL THREAT -- OVERENGINEERING</div>
            <div className="bg-red/5 border border-red/30 rounded-xl p-6">
              <p className="text-sm text-foreground font-sans leading-relaxed">
                The manuscript's greatest enemy is not quality -- it is <span className="text-red font-black">self-consciousness.</span>
                The living nerve of this manuscript is <span className="text-gold font-bold">spiritual violence, cultural memory, mathematical obsession, and grief architecture.</span>
                Sprint 5 exists to protect those four things from being sanded away in revision.
              </p>
            </div>
            <div className="space-y-2">
              {OVERENGINEERING_RISKS.map((r, i) => (
                <div key={i} className={`border rounded-xl p-4 ${SEV_STYLES[r.severity]}`}>
                  <div className="flex items-start gap-3">
                    <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border flex-shrink-0 mt-0.5 ${SEV_STYLES[r.severity]}`}>{r.severity}</span>
                    <div>
                      <div className="text-[11px] font-bold text-foreground mb-1">{r.risk}</div>
                      <div className="text-[10px] text-foreground/70">{r.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-gold/10 via-card to-purple/10 border border-gold/30 rounded-xl p-6">
              <div className="text-[10px] font-bold font-mono text-gold mb-4">THE FOUR THINGS TO PROTECT</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Spiritual Violence","Cultural Memory","Mathematical Obsession","Grief Architecture"].map((t, i) => (
                  <div key={i} className="text-center bg-background/60 border border-gold/20 rounded-xl p-4">
                    <div className="text-xs font-black text-gold font-mono leading-snug">{t}</div>
                    <div className="text-[8px] text-muted-foreground mt-1">Let these be irrational</div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-foreground font-sans leading-relaxed text-center italic">
                "Everything else can be engineered. These four cannot."
              </p>
            </div>
          </div>
        )}

        {activeSection === "stakeholders" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">VIII. EXTERNAL STAKEHOLDER INTELLIGENCE</div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">LITERARY AGENTS -- PRIORITY TIER</div>
              </div>
              {AGENTS.map((a, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3 border-b border-border/30 hover:bg-secondary/10 last:border-0">
                  <div className="flex-1">
                    <div className="text-[11px] font-bold text-gold">{a.agent}</div>
                    <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{a.focus}</div>
                  </div>
                  <div className="text-[10px] text-foreground/80 max-w-xs text-right">{a.why}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">BIG FIVE TARGET IMPRINTS (by LSTE fit)</div>
              </div>
              {PUBLISHERS.map((p, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3 border-b border-border/30 hover:bg-secondary/10 last:border-0">
                  <div className="text-[11px] font-bold text-foreground w-56 flex-shrink-0">{p.name}</div>
                  <div className="text-[10px] text-foreground/80">{p.fit}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">ACADEMIC + INSTITUTIONAL PARTNERS</div>
              </div>
              {ACADEMIC.map((a, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3 border-b border-border/30 hover:bg-secondary/10 last:border-0">
                  <div className="w-48 flex-shrink-0">
                    <div className="text-[11px] font-bold text-foreground">{a.institution}</div>
                    <div className="text-[9px] font-mono text-blue mt-0.5">Score: {a.score}</div>
                  </div>
                  <div className="text-[10px] text-foreground/80">{a.contact}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">FOUNDATIONS + GRANT TARGETS</div>
              </div>
              {FOUNDATIONS.map((f, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3 border-b border-border/30 hover:bg-secondary/10 last:border-0">
                  <div className="flex-1">
                    <div className="text-[11px] font-bold text-gold">{f.name}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">{f.program}</div>
                  </div>
                  <div className="text-[11px] font-black text-teal font-mono flex-shrink-0">{f.amount}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">CHICANO/LATINO LITERARY ORGANIZATIONS</div>
              </div>
              {CHICANO_ORGS.map((c, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3 border-b border-border/30 hover:bg-secondary/10 last:border-0">
                  <div className="text-[10px] font-bold text-purple w-64 flex-shrink-0">{c.org}</div>
                  <div className="text-[10px] text-foreground/80">{c.relevance}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "pipeline" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">IX. LIVE DATA PIPELINE RECOMMENDATIONS</div>
            <div className="space-y-3">
              {[
                {priority:"P0 -- IMMEDIATE",title:"HubSpot Hub 46948033",color:"red",action:"Reauthorize write access",detail:"2,065 contacts, 791 companies, 42 grant prospects already tracked. Reauthorize write access immediately so the CRM can auto-sync from outreach crawlers. This is your live contact database."},
                {priority:"P0 -- IMMEDIATE",title:"GA4 on albavoice.org + qtruthengine360.org",color:"red",action:"Deploy before campaign launch",detail:"Without audience analytics, every outreach campaign is flying blind. Deploy this before any public-facing campaign launch."},
                {priority:"P1 -- THIS WEEK",title:"n8n Workflows -- Extend to Literary News Monitor",color:"gold",action:"Extend webhook -- 3 feeds",detail:"Three n8n workflows already operational (FOIA Tracker, News Monitor, Research Database). Extend webhook to include: Chicano literary awards, Big Five acquisition announcements in Latino fiction, MFA program syllabi updates."},
                {priority:"P2 -- GATE 2",title:"Crossref + Google Books API Ingestion",color:"blue",action:"Gate 2 warehouse build",detail:"This is how you externally anchor the internal SPSS scores. Once Pulitzer finalist novels and Chicano canon works are ingested into the warehouse, the LSTE z-scores become defensible to external audiences -- publishers, awards committees, and scholars."},
              ].map((item, i) => (
                <div key={i} className={`bg-card border border-${item.color}/20 rounded-xl p-5`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className={`text-[8px] font-bold font-mono text-${item.color} mb-1`}>{item.priority}</div>
                      <div className="text-sm font-black text-foreground">{item.title}</div>
                    </div>
                    <div className={`text-[8px] font-bold font-mono px-2 py-1 rounded-full border border-${item.color}/30 bg-${item.color}/10 text-${item.color} flex-shrink-0`}>{item.action}</div>
                  </div>
                  <div className="text-[10px] text-foreground/80">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "final" && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-xl font-black text-foreground font-mono">X. FINAL INTELLIGENCE ASSESSMENT</div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-border text-[8px] text-muted-foreground font-mono">
                      <th className="text-left px-5 py-3">DIMENSION</th>
                      <th className="text-left px-4 py-3">CURRENT ESTIMATE</th>
                      <th className="text-left px-4 py-3">POST-SPRINT TARGET</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FINAL_ASSESSMENT.map((r, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                        <td className="px-5 py-3 font-bold text-foreground">{r.dimension}</td>
                        <td className={`px-4 py-3 font-bold font-mono ${r.currentColor}`}>{r.current}</td>
                        <td className={`px-4 py-3 font-bold font-mono ${r.targetColor}`}>{r.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gold/10 via-card to-purple/10 border border-gold/30 rounded-2xl p-8">
              <div className="text-[10px] font-mono text-gold tracking-widest mb-4">FINAL INTELLIGENCE VERDICT</div>
              <p className="text-sm text-foreground font-sans leading-relaxed mb-6">
                The data makes the case before a single reader opens the book. What the system cannot do is write the restraint.
                That is the one variable that remains entirely human -- and it is the one that Pulitzer committees will feel in their bones before they read a single metric.
              </p>
              <div className="border-t border-gold/20 pt-5 space-y-3">
                {[
                  {line:"Protect the spiritual violence.",     color:"text-gold"},
                  {line:"Protect the grief architecture.",     color:"text-gold"},
                  {line:"Protect the mathematical obsession.", color:"text-gold"},
                  {line:"Let those three things be irrational.",color:"text-teal"},
                  {line:"Everything else can be engineered.",  color:"text-muted-foreground"},
                ].map((l, i) => (
                  <div key={i} className={`text-sm font-mono font-bold ${l.color}`}>{l.line}</div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}