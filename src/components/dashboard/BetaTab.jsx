import { useState } from "react";
import DashCard from "./DashCard";

const BETA_GROUPS = {
  veteran: {
    label:"Group 1 — Veterans",
    color:"gold",
    profile:"Vietnam-era and post-9/11 veterans, military family members. N=47 synthetic readers.",
    composite:88.3,
    strengths:["Tunnel rat tactical accuracy (Ch.2)","Helicopter insertion protocol (Ch.9)","Crawford chain-of-command realism","PTSD symptom authenticity across all chapters","My Lai witness moral injury (Ch.15)"],
    concerns:["Ch.5 hospital scene: VA portrayal slightly idealized","Ch.6 Naval Base: boot camp dialogue slightly anachronistic","Ch.17 Los Obligados: non-citizen service context unfamiliar to some"],
    standout:[1,9,15,23,35,39],
    scores:{military_auth:98, ptsd_acc:95, chain_cmd:91, moral_inj:97, tactical:96, emotional:82, cultural:74, pacing:86},
    quote:"This is the book that tells what actually happened to us — not the glory version, not the antiwar version. The version where you're twenty years old and it makes no sense and you do it anyway.",
    reactions:{ch2:"Visceral. My hands were sweating at the 18-inch tunnel description.",ch9:"The Ramirez carry is the most accurate combat grief scene I've read.",ch35:"Crawford broke in exactly the right way. That's how the system breaks — slowly, internally."},
  },
  hispanic: {
    label:"Group 2 — Hispanic/Chicano Readers",
    color:"orange",
    profile:"Mexican American, Chicano/a, broader Latino community readers. N=52 synthetic readers.",
    composite:89.7,
    strengths:["Ch.17 Los Obligados — highest cultural resonance in manuscript","Chamoy+cornbread cross-cultural synthesis (Ch.13)","Tío Sancho concept authenticity (Ch.33)","Spanish prayer sequences felt 'exactly right'","Yaqui Chieftain's 'cuántas lunas' — transcendent"],
    concerns:["Ch.6-7: Spanish accent too low for Act I cultural immersion","Ch.4: Crawford-only chapter feels culturally distant","Ch.40 INCOMPLETE: absence of Ramos prayer felt as loss"],
    standout:[1,13,17,23,26,35,41],
    scores:{cultural_leg:97, code_switch:96, family_dyn:94, barrio_auth:91, spiritual:98, corrido:88, mainstream:85, pacing:89},
    quote:"This is the first novel where I didn't have to translate myself. The chamoy was already there. The prayer was already bilingual. They didn't explain it for white readers — they just wrote it.",
    reactions:{ch1:"The Chieftain asking 'cuántas lunas' — I've never seen that question in American literature.",ch17:"The I-5 bus is every cousin's story. Miguel and Jorge are my tíos.",ch41:"The rosary warm in his palm. That's the whole manuscript in one image."},
  },
  mainstream: {
    label:"Group 3 — Mainstream Literary Readers",
    color:"blue",
    profile:"General literary fiction readers, book club members, Vietnam War genre enthusiasts. N=63 synthetic readers.",
    composite:85.3,
    strengths:["Pacing compared favorably to Matterhorn and The Things They Carried","Te Deum ceasefire cited as 'most powerful scene in recent war fiction'","Crawford arc comparable to best literary antagonists","Three-timeline structure (Ch.31) technically innovative","IBM 360 as villain concept original and compelling"],
    concerns:["Ch.17: Some unfamiliar with non-citizen draft history — recommend author's note","Spanish phrases: 12% wanted translation footnotes","Ch.16 boundary equation title: confused 67% of mainstream readers"],
    standout:[1,9,22,23,30,35,39],
    scores:{pacing:94, narrative_arc:91, accessibility:82, canon_fit:89, emotional_res:92, structural:90, cultural_acc:76, market:88},
    quote:"I came for a Vietnam War novel and found something that made me reconsider what a war novel can do. The IBM 360 as the actual villain is the most original concept in American war literature since Catch-22.",
    reactions:{ch23:"The Te Deum scene is going to be in every literature class for the next thirty years.",ch35:"The Mathematics of Revenge is the best chapter title and payoff in recent memory.",ch1:"'Cuántas lunas' is the most beautiful opening question since 'Call me Ishmael.'"},
  },
};

export default function BetaTab() {
  const [active, setActive] = useState("veteran");
  const g = BETA_GROUPS[active];

  return (
    <div className="animate-slide-up">
      <div className="flex gap-2 mb-4">
        {Object.entries(BETA_GROUPS).map(([key, grp]) => (
          <button key={key} onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-md text-xs font-bold font-mono transition-all border ${active === key ? `bg-accent text-white border-transparent` : "border-border text-muted-foreground hover:text-foreground"}`}>
            {grp.label.split(" — ")[1]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <DashCard title={g.label} accent={g.color}>
            <div className="text-xs text-muted-foreground font-sans mb-3">{g.profile}</div>
            <div className={`text-3xl font-black font-mono text-${g.color} mb-1`}>{g.composite}</div>
            <div className="text-[10px] text-muted-foreground mb-4">Composite Reader Score / 100</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[9px] font-bold text-teal mb-2">STRENGTHS</div>
                <div className="space-y-1">
                  {g.strengths.map((s, i) => (
                    <div key={i} className="text-[10px] text-foreground/80 font-sans flex gap-1">
                      <span className="text-teal">+</span> {s}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-orange mb-2">CONCERNS</div>
                <div className="space-y-1">
                  {g.concerns.map((c, i) => (
                    <div key={i} className="text-[10px] text-foreground/80 font-sans flex gap-1">
                      <span className="text-orange">!</span> {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DashCard>

          <DashCard title="Notable Reactions" accent="purple">
            <div className="space-y-3">
              {Object.entries(g.reactions).map(([ch, reaction]) => (
                <div key={ch} className="p-3 bg-background rounded border border-border">
                  <div className="text-[9px] font-bold font-mono text-purple mb-1">Ch.{ch.replace("ch","")}</div>
                  <div className="text-xs text-foreground/80 font-sans italic">"{reaction}"</div>
                </div>
              ))}
            </div>
          </DashCard>
        </div>

        <div className="space-y-4">
          <DashCard title="Score Breakdown" accent={g.color}>
            <div className="space-y-2">
              {Object.entries(g.scores).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-[9px] mb-1">
                    <span className="text-muted-foreground capitalize">{key.replace(/_/g," ")}</span>
                    <span className={`font-bold font-mono text-${g.color}`}>{val}</span>
                  </div>
                  <div className="bg-secondary rounded-full h-[3px] overflow-hidden">
                    <div className={`h-full bg-${g.color} rounded-full`} style={{width:`${val}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </DashCard>

          <DashCard title="Standout Chapters" accent="teal">
            <div className="flex flex-wrap gap-2">
              {g.standout.map(ch => (
                <span key={ch} className="px-2 py-1 bg-teal/10 border border-teal/30 rounded text-xs font-bold text-teal font-mono">Ch.{ch}</span>
              ))}
            </div>
          </DashCard>

          <DashCard title="Reader Quote" accent={g.color}>
            <div className={`text-xs text-${g.color} font-sans italic leading-relaxed`}>
              "{g.quote}"
            </div>
          </DashCard>
        </div>
      </div>
    </div>
  );
}