import { useState } from "react";
import DashCard from "./DashCard";

const MODULES = [
  { id:"M1", name:"Smart Word-Count Foundation", icon:"📐", color:"teal",
    metrics:[["Total Words","217,571","220,000 target"],["Mean Ch. Words","5,306","5,000 target"],["Dialogue %","38%","30-45% target"],["Act I Words","64,278","—"],["Act II Words","89,126","—"],["Act III Words","64,167","—"]],
    note:"Ch.35 (10,943w) double-length justified as climax. Ch.40 INCOMPLETE at 2,604w — critical gap.",
    verdict:"98.9% complete. Add ~2,400 words to Ch.40.",
  },
  { id:"M2", name:"12-Pillar Diagnostic Engine", icon:"🏛️", color:"blue",
    pillars:[
      {name:"Hook & Stakes",         score:91, benchmark:85},
      {name:"Scene Goal & Conflict",  score:89, benchmark:80},
      {name:"POV Consistency",        score:88, benchmark:85},
      {name:"Sensory Immersion",      score:84, benchmark:80},
      {name:"Pacing & Cadence",       score:87, benchmark:80},
      {name:"Emotional Resonance",    score:92, benchmark:85},
      {name:"Conflict Architecture",  score:90, benchmark:82},
      {name:"Dialogue Authenticity",  score:88, benchmark:80},
      {name:"Voice & Thematic Echo",  score:93, benchmark:85},
      {name:"Cultural Authenticity",  score:94, benchmark:80},
      {name:"Interlingual Fidelity",  score:91, benchmark:75},
      {name:"Reader Fatigue Control", score:84, benchmark:80},
    ],
    composite:88.8,
    note:"Composite 88.8/105. Cultural Authenticity and Voice at PEAK status.",
  },
  { id:"M3", name:"Character Algorithm Matrix", icon:"🧬", color:"purple",
    characters:[
      {name:"SGT George Ramos",    voice:97, drift:0.02, complete:true,  flag:false},
      {name:"Capt. Crawford",      voice:94, drift:0.08, complete:true,  flag:false},
      {name:"The Squad",           voice:91, drift:0.06, complete:true,  flag:false},
      {name:"Joshua Sagasta",      voice:88, drift:0.12, complete:false, flag:true},
      {name:"Miguel/Jorge",        voice:92, drift:0.05, complete:true,  flag:false},
      {name:"Major Duc",           voice:89, drift:0.09, complete:false, flag:true},
      {name:"Yaqui Chieftain",     voice:98, drift:0.01, complete:true,  flag:false},
    ],
    note:"Top issue: Joshua Sagasta arc incomplete after Ch.5. Major Duc needs Ch.39 presence.",
  },
  { id:"M4", name:"Marlowe Technical Analysis", icon:"⚙️", color:"orange",
    metrics:[["Passive Voice","8.2%","<12% ✓"],["Cliché Density","0.8/1k","<2/1k ✓"],["Readability (Flesch)","61.4","55-70 ✓"],["Sentence Rhythm","87/100",">75 ✓"],["Show vs Tell","78/22",">70/30 ✓"],["Synesthesia Density","4.2/1k",">2/1k PEAK"],["Dialogue Tag Variety","94/100",">80 ✓"],["Paragraph Length Var.","89/100",">75 ✓"]],
    note:"All 8 metrics PASS. Synesthesia density at PEAK — manuscript specialty.",
  },
  { id:"M7", name:"Quick Action Suite", icon:"⚡", color:"red",
    actions:[
      {p:1, action:"COMPLETE Chapter 40",           impact:"+4–5 Ω", time:"2-3d"},
      {p:2, action:"Joshua Sagasta Act II-III scene",impact:"+2 Ω",   time:"1-2d"},
      {p:3, action:"Ch.6 sensory upgrade",           impact:"+1.5 Ω", time:"1d"},
      {p:4, action:"Ch.17 Los Obligados sensory",    impact:"+1 Ω",   time:"4h"},
      {p:5, action:"Ch.18 Genesis atmosphere",       impact:"+1 Ω",   time:"4h"},
      {p:6, action:"Major Duc Ch.39 presence",       impact:"+0.5 Ω", time:"2h"},
      {p:7, action:"Ch.34 prose bridge",             impact:"+0.5 Ω", time:"3h"},
      {p:8, action:"Rotor/heartbeat motif Ch.38-39", impact:"+0.5 Ω", time:"2h"},
    ],
    note:"Total potential gain: ~11 Omega points across 8 targeted actions.",
  },
  { id:"M8", name:"Reader Neuro-Map (Omega-Level)", icon:"🧠", color:"pink",
    zones:[
      {zone:"Opening Hook (Ch.1-3)",     eng:94, risk:"LOW"},
      {zone:"Act I Plateau (Ch.4-7)",    eng:82, risk:"MED"},
      {zone:"Act I Combat Peak (Ch.8-12)",eng:93,risk:"LOW"},
      {zone:"Sacred Sacrament (Ch.13-14)",eng:90,risk:"LOW"},
      {zone:"Act II Complexity (Ch.15-20)",eng:85,risk:"MED"},
      {zone:"Eagle/Sparrow Arc (Ch.21-26)",eng:91,risk:"LOW"},
      {zone:"Act III Build (Ch.27-32)",  eng:90, risk:"LOW"},
      {zone:"Climax Sequence (Ch.33-36)",eng:96, risk:"LOW"},
      {zone:"Resolution (Ch.37-41)",     eng:89, risk:"LOW"},
    ],
    note:"RRP mean 86.9%. High-risk: Ch.5,6,18,20,34,40. Peak: Ch.1,9,13,23,35,39,41.",
  },
];

const RISK_COLOR = { LOW:"text-teal", MED:"text-gold", HIGH:"text-red" };

export default function ModulesTab() {
  const [active, setActive] = useState("M1");
  const mod = MODULES.find(m => m.id === active);

  return (
    <div className="animate-slide-up">
      <div className="flex gap-1 flex-wrap mb-4">
        {MODULES.map(m => (
          <button key={m.id} onClick={() => setActive(m.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all border ${active === m.id ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {m.icon} {m.id}: {m.name.split(" ").slice(0,2).join(" ")}
          </button>
        ))}
      </div>

      {mod && (
        <DashCard title={`${mod.icon} ${mod.id} — ${mod.name}`} accent={mod.color}>
          <div className="text-[10px] text-muted-foreground font-sans mb-4">{mod.note}</div>

          {mod.metrics && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {mod.metrics.map(([label, val, target]) => (
                <div key={label} className="p-2 bg-background rounded border border-border">
                  <div className="text-[8px] text-muted-foreground font-mono mb-1">{label}</div>
                  <div className={`text-sm font-black font-mono text-${mod.color}`}>{val}</div>
                  <div className="text-[8px] text-muted-foreground">{target}</div>
                </div>
              ))}
            </div>
          )}

          {mod.pillars && (
            <div className="space-y-2">
              {mod.pillars.map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-[10px] text-foreground/70 font-sans min-w-[160px]">{p.name}</span>
                  <div className="flex-1 bg-secondary rounded-full h-[4px] overflow-hidden">
                    <div className="h-full bg-blue rounded-full" style={{width:`${p.score}%`}} />
                  </div>
                  <span className="text-xs font-bold font-mono text-blue min-w-[30px]">{p.score}</span>
                  <span className="text-[9px] text-teal font-mono">{p.score >= p.benchmark ? "✓" : "!"}</span>
                </div>
              ))}
              <div className="mt-3 text-sm font-black font-mono text-blue">Composite: {mod.composite}/105 — Omega Tier</div>
            </div>
          )}

          {mod.characters && (
            <div className="space-y-2">
              {mod.characters.map(c => (
                <div key={c.name} className={`p-2.5 rounded border ${c.flag ? "border-orange/40 bg-orange/5" : "border-border bg-background"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{c.name}{c.flag && " ⚠"}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-muted-foreground font-mono">Voice: <span className="text-teal">{c.voice}</span></span>
                      <span className="text-[9px] text-muted-foreground font-mono">Drift: <span className={c.drift > 0.10 ? "text-orange" : "text-teal"}>{c.drift}</span></span>
                      <span className={`text-[9px] font-bold ${c.complete ? "text-teal" : "text-red"}`}>{c.complete ? "COMPLETE" : "INCOMPLETE"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mod.actions && (
            <div className="space-y-2">
              {mod.actions.map(a => (
                <div key={a.p} className="flex items-center gap-3 p-2 bg-background rounded border border-border">
                  <span className="text-[9px] font-black text-red font-mono min-w-[18px]">{a.p}.</span>
                  <span className="text-xs text-foreground flex-1 font-sans">{a.action}</span>
                  <span className="text-[9px] font-bold text-gold font-mono">{a.impact}</span>
                  <span className="text-[9px] text-muted-foreground font-mono">{a.time}</span>
                </div>
              ))}
            </div>
          )}

          {mod.zones && (
            <div className="space-y-2">
              {mod.zones.map(z => (
                <div key={z.zone} className="flex items-center gap-3">
                  <span className="text-[10px] text-foreground/70 font-sans min-w-[200px]">{z.zone}</span>
                  <div className="flex-1 bg-secondary rounded-full h-[4px] overflow-hidden">
                    <div className="h-full bg-blue rounded-full" style={{width:`${z.eng}%`}} />
                  </div>
                  <span className="text-xs font-bold font-mono text-blue min-w-[30px]">{z.eng}%</span>
                  <span className={`text-[9px] font-bold ${RISK_COLOR[z.risk]}`}>{z.risk}</span>
                </div>
              ))}
            </div>
          )}
        </DashCard>
      )}
    </div>
  );
}