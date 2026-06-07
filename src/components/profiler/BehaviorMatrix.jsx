import { useState } from "react";

const PROFILES = [
  {
    type:"Champion", color:"gold", icon:"⚡",
    cohorts:["Chicano/Latino community", "Sandra Cisneros (Macondo)", "NACCS members", "Veteran families", "Barrio Books community"],
    triggers:["Community event or reading", "Social post from within community", "Peer-to-peer sharing", "Bilingual voice that sounds earned"],
    blockers:["Performative representation", "Press release as first exposure", "Extractive framing", "Empty symbolism"],
    outreach:"Launch with community event BEFORE any institutional pitch. First endorsement from within.",
    sequence:["Community event → organic share → scholar sees it → awards circuit"],
    linkedin:"NACCS members, Macondo alums, LULAC reps. Most active on LinkedIn. First outreach target.",
    platforms:["Instagram (identity)", "Facebook (groups)", "WhatsApp (peer chain)", "LinkedIn (scholars)"],
    urgency:"ACTIVATE FIRST — fastest conversion, highest I score",
    urgencyColor:"text-gold",
  },
  {
    type:"Validator", color:"teal", icon:"🎖️",
    cohorts:["Vietnam veteran networks", "Bob Woodruff Foundation contacts", "VFW/ALVA members", "Military history podcasters", "Task & Purpose editors"],
    triggers:["Behavioral realism confirmed (BIS=88.9)", "Trauma is honored not sensationalized", "Veteran endorsement of manuscript", "Documentary-style proof"],
    blockers:["Sensationalized trauma", "Implied DoD endorsement without clearance", "M249 SAW anachronism (not yet fixed)", "Press-release-first approach"],
    outreach:"Send behavioral accuracy audit results. Frame as a documentary-grade forensic project. Ask for endorsement letter.",
    sequence:["Fact sheet → reading excerpt → endorsement ask → media amplification"],
    linkedin:"Veterans For Peace, ALVA, VVA chapters. Active in LinkedIn groups. Look for 'Vietnam veteran' in title.",
    platforms:["Facebook (veteran groups)", "YouTube (veteran channels)", "Podcast (veterans stories)", "Email newsletters"],
    urgency:"ACTIVATE PHASE 2 — after Sprint 2 anachronism fixes",
    urgencyColor:"text-teal",
  },
  {
    type:"Skeptic→Convert", color:"purple", icon:"🎓",
    cohorts:["MFA faculty", "NYRB / Paris Review critics", "Iowa Writers Workshop", "Literary prize readers", "Substack literary critics"],
    triggers:["Voice unmistakably original in paragraph one", "Prose restraint — not maximalism", "Unexpected structural surprise", "Feeling the author is NOT trying to impress them"],
    blockers:["Systems-language in prose ('framework', 'protocol', 'algorithm')", "Visible optimization", "Ch.16/17 structural echo if unintentional", "Over-explained emotional beats"],
    outreach:"Send AFTER Sprint 5 (Restraint pass). Never pitch before. No query letter — let the prose speak first through a cold read excerpt.",
    sequence:["Substack comment → Twitter/X engagement → blinded excerpt read → critical mention"],
    linkedin:"Literary critics rarely post on LinkedIn. Their home is Twitter/X and Substack. Follow their syllabi.",
    platforms:["Twitter/X (discourse)", "Substack (long-form)", "Academic email (cold excerpt)", "Conference networking"],
    urgency:"DO NOT APPROACH UNTIL SPRINT 5 COMPLETE — Restraint = 67, must reach 80+",
    urgencyColor:"text-red",
  },
  {
    type:"Gatekeeper", color:"red", icon:"🏛️",
    cohorts:["Pulitzer Prize fiction jury", "National Book Award committee", "PEN/Faulkner board", "FSG acquisition editors", "Lannan Foundation directors"],
    triggers:["Peer endorsement from trusted literary voice", "Award nomination trajectory already active", "Agent representation at Big Five level", "External corpus validation (Gate 2)"],
    blockers:["Visible optimization / overengineering in prose", "Self-conscious architectural writing", "Missing external z-score baseline", "No prior awards or reviews"],
    outreach:"Never cold-approach. Path: Community → Critic → Agent → Publisher → Award. Gatekeepers follow the noise, they do not make it.",
    sequence:["Agent signs → Publisher acquires → First review (NYRB/Kirkus) → Prize submission"],
    linkedin:"FSG/Knopf editors are on LinkedIn but respond only to agent queries. Follow, do not cold message.",
    platforms:["Agent submission portal", "Publisher direct (agent only)", "Award submission (post-pub)"],
    urgency:"PHASE 3-4 ONLY — lowest λ=0.18, highest downstream value",
    urgencyColor:"text-orange",
  },
  {
    type:"Rational Evaluator", color:"orange", icon:"📊",
    cohorts:["Ford Foundation program officers", "Mellon Foundation staff", "NEH program officers", "California Arts Council", "HIP (Hispanics in Philanthropy)"],
    triggers:["Clear alignment with published program priority language", "Measurable civic impact claim (349 Rule = 84.9% classification failure)", "USC institutional partner named", "Prior validation — previous grants or Congressional record"],
    blockers:["Generic 'cultural importance' framing", "Same LOI text sent to multiple funders", "No data alongside narrative", "Requesting more than program maximum"],
    outreach:"Frame every application around their SPECIFIC language. NEH='American history.' Ford='Racial Justice + Free Expression.' Mellon='Digital Humanities.' Never reuse LOI text.",
    sequence:["LinkedIn warm touch (comment on their posts) → LOI 2-page → Full proposal → Site visit"],
    linkedin:"Ford/Mellon/OSF program officers engage with immigration justice, decolonial humanities, digital scholarship. Comment on their posts 2 weeks before submitting.",
    platforms:["Email (LOI)", "LinkedIn (warm touch)", "Grants.gov (federal)", "Foundation portal (private)"],
    urgency:"P0 — AUMER grants application ready now (USLDH $7.5K rolling deadline)",
    urgencyColor:"text-gold",
  },
  {
    type:"Opportunity Scanner", color:"teal", icon:"🎬",
    cohorts:["Netflix Latino content team", "HBO/Max Latin America", "Amazon Studios", "Salma Hayek / Ventanarosa", "Sundance Institute"],
    triggers:["Published + one award nomination OR major review", "Social virality signal already established", "Agent packaging the project", "Sundance Institute application active"],
    blockers:["Approaching before publication", "No market data in pitch", "Missing 2-season structural arc presentation", "No existing audience signal"],
    outreach:"One-page treatment + comp titles with streaming data. Lead with: Film=87, TV=89, Streaming=84 (LSTE). 45-chapter arc = 2-season structure. US Hispanic 68.1M market + $4.1T purchasing power.",
    sequence:["Publish → Award nomination → Sundance apply → Agent packages → Adaptation pitch"],
    linkedin:"Netflix/HBO Latino content VPs active on LinkedIn. Connect only through agent or production company intermediary.",
    platforms:["Agent packaging", "Sundance application", "NALIP network", "Industry events"],
    urgency:"PHASE 4 — Post-publication and post-award nomination only",
    urgencyColor:"text-blue",
  },
  {
    type:"Follower", color:"blue", icon:"📚",
    cohorts:["Mainstream commercial readers", "General literary fiction buyers", "Book club participants", "Airport bookstore browsers", "Audible subscribers"],
    triggers:["Social proof (reviews, awards, influencer endorsement)", "Booklist/Kirkus recommendation", "BookTok discovery", "Word-of-mouth from Champions"],
    blockers:["No reviews or social proof yet", "Academic framing in marketing copy", "Missing commercial comp positioning"],
    outreach:"Do not market directly to this cohort. Activate Champions and Validators → social proof accumulates → Followers discover organically.",
    sequence:["Champion shares → Influencer posts → Kirkus reviews → Followers discover"],
    linkedin:"Low LinkedIn presence. Primary discovery via Instagram, TikTok, Goodreads.",
    platforms:["Instagram (Reels)", "TikTok (BookTok)", "Goodreads", "Amazon reviews"],
    urgency:"PHASE 3-5 — Follows after Champion and Validator activation",
    urgencyColor:"text-muted-foreground",
  },
  {
    type:"Viral Amplifier", color:"purple", icon:"📱",
    cohorts:["Gen Z Chicano/Latino readers", "BookTok community", "Culture-first book discoverers", "College students", "Immigrant/border community youth"],
    triggers:["Identity resonance clear in first 15 seconds", "Authentic bilingual voice (not decorative)", "Quotable lines (the 349 Rule, the mathematics)", "Creator endorsement from within their network"],
    blockers:["Institutional framing", "Long-form only", "Academic or formal register"],
    outreach:"Short video content. Quote reels from the manuscript. Reading clips. The 349 Rule as a 30-second explainer. Organic only — never feel like an ad.",
    sequence:["First Chapter excerpt reel → BookTok response → Barrio Books feature → peer chain"],
    linkedin:"Gen Z not on LinkedIn. TikTok + Instagram + BeReal + Discord.",
    platforms:["TikTok (primary)", "Instagram Reels", "YouTube Shorts", "Discord servers"],
    urgency:"PHASE 3 — Activate with authentic community content (post-Sprint 2)",
    urgencyColor:"text-purple",
  },
];

const OUTREACH_SEQUENCE = [
  {step:1, who:"Chicano/Latino Community (Champion)", action:"Community reading event / NACCS conference", platform:"In-person + Instagram", result:"First endorsements + organic shares", color:"gold"},
  {step:2, who:"Veterans (Validator)",               action:"Behavioral accuracy fact sheet + excerpt", platform:"Email + Facebook veteran groups", result:"Endorsement letter + credibility floor", color:"teal"},
  {step:3, who:"Foundation Officers (Evaluator)",    action:"USLDH $7.5K LOI (rolling) → NEH → Ford", platform:"Email + LinkedIn warm touch", result:"Grant funding + institutional credibility", color:"orange"},
  {step:4, who:"Gen Z / BookTok (Amplifier)",        action:"Chapter excerpt reels + 349 Rule explainer", platform:"TikTok + Instagram Reels", result:"Viral signals + social proof baseline", color:"purple"},
  {step:5, who:"Literary Agent (Gatekeeper path)",   action:"Full query + LitCentral data package", platform:"Agent portal (post-Sprint 5)", result:"Agent representation", color:"red"},
  {step:6, who:"MFA Critics (Skeptic→Convert)",      action:"Cold excerpt (NO pitch language)", platform:"Substack + Twitter/X (post-Sprint 5)", result:"Critical endorsement", color:"blue"},
  {step:7, who:"Publisher / Award Committee",         action:"Agent submits + award eligibility opens", platform:"Agent pipeline", result:"Advance + award nominations", color:"gold"},
  {step:8, who:"Adaptation Execs (Scanner)",          action:"One-page treatment via agent", platform:"Sundance + NALIP", result:"Film/TV option", color:"teal"},
];

export default function BehaviorMatrix() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("profiles");

  const profile = PROFILES.find(p => p.type === selected);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="text-xl font-black text-foreground font-mono">BEHAVIORAL INDICATOR SCHEMA</div>
        <div className="flex gap-1">
          {["profiles","sequence"].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-mono transition-all ${view===v?"bg-purple text-white":"text-muted-foreground border border-border hover:text-foreground"}`}>
              {v === "profiles" ? "All Profiles" : "Outreach Sequence"}
            </button>
          ))}
        </div>
      </div>

      {view === "profiles" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2 lg:col-span-1">
            {PROFILES.map(p => (
              <button key={p.type} onClick={() => setSelected(selected === p.type ? null : p.type)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                  selected === p.type ? `border-${p.color}/50 bg-${p.color}/10` : "border-border bg-card hover:border-purple/20"
                }`}>
                <span className="text-xl">{p.icon}</span>
                <div className="flex-1">
                  <div className={`text-[10px] font-black font-mono text-${p.color}`}>{p.type}</div>
                  <div className="text-[9px] text-muted-foreground truncate">{p.cohorts[0]}</div>
                </div>
                <div className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${p.urgencyColor} border-current bg-current/5 flex-shrink-0`}>{
                  p.urgencyColor === "text-red" ? "BLOCKED" : p.urgencyColor === "text-gold" ? "P0 NOW" : "PHASE 2+"
                }</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {profile ? (
              <div className={`bg-card border border-${profile.color}/30 rounded-xl p-6 space-y-5 h-full`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{profile.icon}</span>
                  <div>
                    <div className={`text-lg font-black font-mono text-${profile.color}`}>{profile.type}</div>
                    <div className={`text-[9px] font-mono ${profile.urgencyColor} font-bold`}>{profile.urgency}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                  <div>
                    <div className="text-[8px] font-mono text-muted-foreground mb-1.5">WHO THEY ARE</div>
                    <ul className="space-y-0.5">
                      {profile.cohorts.map((c,i) => <li key={i} className={`flex items-center gap-1.5 text-${profile.color} font-bold`}><span className="w-1 h-1 rounded-full bg-current flex-shrink-0" />{c}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-muted-foreground mb-1.5">BEHAVIORAL TRIGGERS</div>
                    <ul className="space-y-0.5">
                      {profile.triggers.map((t,i) => <li key={i} className="flex items-start gap-1.5 text-teal"><span className="mt-0.5">✓</span>{t}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-muted-foreground mb-1.5">BLOCKERS</div>
                    <ul className="space-y-0.5">
                      {profile.blockers.map((b,i) => <li key={i} className="flex items-start gap-1.5 text-red"><span className="mt-0.5">✗</span>{b}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-muted-foreground mb-1.5">PRIMARY PLATFORMS</div>
                    <div className="flex flex-wrap gap-1">
                      {profile.platforms.map((pl,i) => <span key={i} className="text-[8px] font-mono border border-border px-1.5 py-0.5 rounded text-muted-foreground">{pl}</span>)}
                    </div>
                  </div>
                </div>
                <div className={`bg-${profile.color}/5 border border-${profile.color}/20 rounded-lg p-3`}>
                  <div className="text-[8px] font-mono text-muted-foreground mb-1">OUTREACH STRATEGY</div>
                  <div className="text-[10px] text-foreground/80">{profile.outreach}</div>
                </div>
                <div className="bg-secondary/20 border border-border rounded-lg p-3">
                  <div className="text-[8px] font-mono text-muted-foreground mb-1">LINKEDIN INTELLIGENCE</div>
                  <div className="text-[10px] text-foreground/80">{profile.linkedin}</div>
                </div>
                <div className={`border border-${profile.color}/20 rounded-lg p-3`}>
                  <div className="text-[8px] font-mono text-muted-foreground mb-1">ACTIVATION SEQUENCE</div>
                  {profile.sequence.map((s,i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <span className={`font-mono text-${profile.color} font-bold`}>{i+1}.</span>
                      <span className="text-foreground/80">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                Select a profile to view behavioral intelligence
              </div>
            )}
          </div>
        </div>
      )}

      {view === "sequence" && (
        <div className="space-y-3">
          <div className="bg-card border border-gold/20 rounded-xl p-4 text-[10px] text-foreground/80">
            <span className="text-gold font-bold">Strategic Principle: </span>
            Community → Credibility → Credentials → Gatekeepers. The award committees follow the noise. They do not make it. Start with the fastest-converting cohort (Champions, λ=0.45) and let social proof accumulate.
          </div>
          {OUTREACH_SEQUENCE.map((s, i) => (
            <div key={i} className={`flex items-start gap-4 bg-card border border-${s.color}/20 rounded-xl p-4`}>
              <div className={`flex-shrink-0 w-9 h-9 rounded-full bg-${s.color}/10 border border-${s.color}/30 flex items-center justify-center`}>
                <span className={`text-sm font-black font-mono text-${s.color}`}>{s.step}</span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">COHORT</div><div className={`text-[10px] font-bold text-${s.color}`}>{s.who}</div></div>
                <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">ACTION</div><div className="text-[10px] text-foreground/80">{s.action}</div></div>
                <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">PLATFORM</div><div className="text-[10px] text-foreground/80">{s.platform}</div></div>
                <div><div className="text-[8px] font-mono text-muted-foreground mb-0.5">RESULT</div><div className={`text-[10px] font-bold text-${s.color}`}>{s.result}</div></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}