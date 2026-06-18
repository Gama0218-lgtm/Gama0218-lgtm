const MEDIA_TIERS = [
  {
    tier:1, label:"Emotional / Human Layer", color:"gold",
    desc:"Human-centered stories with direct survivor/family testimony. Moves emotion before logic.",
    outlets:[
      { name:"The War Horse",          type:"Military journalism",  contact:"tips@thewarhorse.org",       phase:"Phase 1", fit:92, pitch:"349 DCAS anomaly as forensic civic story. Data + human face. INVESTIGATIVE HOOK." },
      { name:"Task & Purpose",         type:"Military digital",     contact:"tips@taskandpurpose.com",    phase:"Phase 1", fit:88, pitch:"'The Algorithm That Erased Chicano Veterans.' Data-driven + human faces." },
      { name:"NPR Code Switch",        type:"Culture + Race",       contact:"codeswitch@npr.org",         phase:"Phase 2", fit:90, pitch:"Bilingual code-switching as cultural survival. SII architecture explained simply." },
      { name:"Latino USA (NPR)",       type:"Latino affairs",       contact:"info@latinousa.org",         phase:"Phase 2", fit:85, pitch:"Family legacy, deported veterans, the 349 Rule — documented Chicano erasure." },
      { name:"Radio Ambulante",        type:"Spanish narrative",    contact:"info@radioambulante.org",    phase:"Phase 3", fit:83, pitch:"Spanish-language story. Bilingual code-switching as emotional architecture." },
      { name:"Univision / Noticias",   type:"Spanish-language TV",  contact:"Via Univision PR",           phase:"Phase 4", fit:78, pitch:"Deported veteran families. Latino primetime. Bilingual community reach." },
    ]
  },
  {
    tier:2, label:"Institutional Authority Layer", color:"teal",
    desc:"Credibility-building coverage from established institutions. Editors and award committees follow this.",
    outlets:[
      { name:"Military Times",         type:"Military print/digital",contact:"editor@militarytimes.com", phase:"Phase 1", fit:86, pitch:"Valor Review 2014: 17 of 24 delayed honors = Hispanic. Institutional record = news." },
      { name:"Poets & Writers",        type:"Literary trade",        contact:"pw.org/contact",           phase:"Phase 2", fit:80, pitch:"LSTE methodology as new standard. Author platform feature." },
      { name:"LA Times Books",         type:"Major press",           contact:"books@latimes.com",         phase:"Phase 3", fit:82, pitch:"Chicano Vietnam story + deported veterans = metro + books crossover." },
      { name:"Publishers Weekly",      type:"Publishing trade",      contact:"Via PW",                   phase:"Phase 3", fit:75, pitch:"Post-publication review. Kirkus connection. Agent awareness funnel." },
    ]
  },
  {
    tier:3, label:"Documentary / Long-Form Layer", color:"purple",
    desc:"In-depth coverage that builds the prestige archive. Award circuit prerequisite.",
    outlets:[
      { name:"ProPublica",             type:"Investigative journalism",contact:"tips@propublica.org",     phase:"Phase 2", fit:88, pitch:"DCAS 84.9% Hispanic classification failure. Congressional record trail." },
      { name:"Democracy Now!",         type:"News/Documentary",       contact:"Via site",                 phase:"Phase 2", fit:82, pitch:"Immigration + military service nexus. International reach." },
      { name:"Jocko Podcast",          type:"Military/Leadership",    contact:"Via podcast booking",      phase:"Phase 4", fit:67, pitch:"Military discipline + leadership angle. 500K+ veteran listeners. SEEDED ADVOCATE model." },
      { name:"Hardcore History (Dan Carlin)",type:"History podcast",  contact:"Via booking",              phase:"Phase 4", fit:65, pitch:"Vietnam historical dimension. 3M+ audience. Veteran + history buff demographic." },
      { name:"KPBS San Diego",         type:"Regional PBS",           contact:"kpbs.org/contact",         phase:"Phase 1", fit:84, pitch:"Local veteran + border story. Regional news hook. San Diego military community." },
      { name:"NYT Books",              type:"Prestige press",         contact:"books@nytimes.com",         phase:"Phase 4", fit:72, pitch:"Post-publication review. Requires agent + publisher coordination." },
    ]
  },
];

const PHASE_CONTENT = [
  { month:"Feb 2026", focus:"Foundation + Framing",    hero:"'What this project is' essay · Founder video · Landing page · DCAS brief teaser", kpi:"Baseline conversion · Time on site · Email signup",       color:"gold"   },
  { month:"Mar 2026", focus:"Proof + Credibility",     hero:"Source explainer video · Records + methods breakdown · FAQ thread · 349 anomaly intro", kpi:"Trust score · Dwell time · Creator interest",      color:"teal"   },
  { month:"Apr 2026", focus:"Identity + Relevance",    hero:"'Why this story matters NOW' creator brief · Bilingual explainer (SII bridge) · First partner posts", kpi:"Saves · Shares · Creator interest",  color:"blue"   },
  { month:"May 2026", focus:"Emotional Entry",         hero:"Reading clips · Family/service themes · First partner features · 'El número 349' Spanish reel", kpi:"Follower quality · Email growth",          color:"purple" },
  { month:"Jun 2026", focus:"Public Seeding",          hero:"Soft creator posts · Teaser trailer · Press kit release",               kpi:"Share of search · Earned mentions",                             color:"orange" },
  { month:"Jul 2026", focus:"Conversion Runway",       hero:"Events preview · Preorder/interest capture · Educator deck",           kpi:"RSVP rate · Signup conversion",                                 color:"gold"   },
];

export default function MediaPipeline() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <div className="text-lg font-black font-mono text-foreground mb-1">MEDIA + PODCAST PIPELINE — 3-Layer Outreach</div>
        <div className="text-xs text-muted-foreground font-mono">Layer 1: Emotional/Human · Layer 2: Institutional Authority · Layer 3: Documentary/Long-Form</div>
      </div>

      {MEDIA_TIERS.map((tier, ti) => (
        <div key={ti} className="space-y-2">
          <div className={`flex items-center gap-3 px-4 py-3 bg-${tier.color}/5 border border-${tier.color}/20 rounded-xl`}>
            <div className={`text-xl font-black font-mono text-${tier.color}`}>L{tier.tier}</div>
            <div>
              <div className={`text-[10px] font-black font-mono text-${tier.color}`}>{tier.label}</div>
              <div className="text-[9px] text-muted-foreground">{tier.desc}</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                <th className="text-left px-3 py-2">OUTLET</th><th className="text-left px-3 py-2">TYPE</th>
                <th className="text-left px-3 py-2">CONTACT</th><th className="text-center px-2 py-2">FIT</th>
                <th className="text-left px-2 py-2">PHASE</th><th className="text-left px-3 py-2">PITCH ANGLE</th>
              </tr></thead>
              <tbody>
                {tier.outlets.map((o,i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-secondary/10">
                    <td className={`px-3 py-2.5 font-bold text-${tier.color} whitespace-nowrap`}>{o.name}</td>
                    <td className="px-3 py-2.5 text-muted-foreground text-[8px]">{o.type}</td>
                    <td className="px-3 py-2.5 text-blue font-mono text-[8px]">{o.contact}</td>
                    <td className={`px-2 py-2.5 text-center font-black font-mono ${o.fit>=85?"text-gold":o.fit>=75?"text-teal":"text-muted-foreground"}`}>{o.fit}</td>
                    <td className="px-2 py-2.5 text-[8px] font-mono text-muted-foreground whitespace-nowrap">{o.phase}</td>
                    <td className="px-3 py-2.5 text-foreground/70 text-[8px] max-w-xs">{o.pitch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Editorial calendar */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-gold">6-MONTH EDITORIAL CALENDAR — Feb–Jul 2026</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {PHASE_CONTENT.map((m,i) => (
            <div key={i} className={`p-4 border-b border-r border-border/30 hover:bg-secondary/10`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`text-[9px] font-black font-mono text-${m.color}`}>{m.month}</div>
                <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border text-${m.color} border-${m.color}/20 bg-${m.color}/5`}>{m.focus}</span>
              </div>
              <div className="text-[8px] text-foreground/80 mb-2">{m.hero}</div>
              <div className="text-[7px] text-muted-foreground font-mono">KPI: {m.kpi}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}