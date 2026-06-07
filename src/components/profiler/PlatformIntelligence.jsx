import { useState } from "react";

const PLATFORMS = [
  {
    platform:"LinkedIn", priority:"PRIMARY", color:"blue",
    stake:["Literary agents", "Foundation program officers", "University professors", "Publisher acquisition editors", "NACCS scholars", "Veterans org directors"],
    behavior:"Professional validation. Content engagement. Warm-touch recognition effect (comment on their posts before connecting).",
    tactics:[
      "Follow + engage with 2–3 posts over 2 weeks BEFORE connecting",
      "Connect with personalized note referencing a specific post they made",
      "Wait for acceptance → single-paragraph message (NO attachment first)",
      "If they respond: send one-page query hook",
      "If no response in 14 days: move to email cold outreach",
    ],
    content:["AUMER Foundation founding story + deported veterans frame", "DCAS 349 Rule forensic brief (teaser)", "Congressional Hispanic Caucus briefing (May 18 2026) as credibility signal", "USC doctoral candidacy profile optimization"],
    redFlags:["Cold connection requests with no personalization", "Attaching documents before relationship exists", "Posting press release language"],
    postFreq:"3-4x/week for AUMER Foundation page. 2x/week for personal profile.",
    bestTime:"Tuesday–Thursday, 8–10am or 5–6pm Pacific",
  },
  {
    platform:"Instagram", priority:"HIGH", color:"purple",
    stake:["Gen Z Chicano/Latino readers", "Book community (BookTok crossover)", "Chicano arts community", "Cultural journalists", "Young educators"],
    behavior:"Identity resonance + visual storytelling. Saves and shares over likes. Reels dramatically outperform static posts for discovery.",
    tactics:[
      "Lead with identity: Chicano soldier → the mathematics → the erasure — in that emotional order",
      "Quote reels from Ch.1 (post-artifact-removal): '¿Por cuántas lunas cargas tu dolor?'",
      "Reading clips: author voice in Spanish + English",
      "Reel: 'El número 349' — 30-second explainer bilingual",
      "Story polls: 'Did you know your grandfather could have been erased from the Vietnam record?'",
    ],
    content:["Short reading clips (15–30 sec)", "Quote reels from manuscript", "Behind-the-scenes research process", "Community event coverage", "Bilingual explainer reels"],
    redFlags:["English-only content to Latino audience", "Static posts only", "No cultural specificity"],
    postFreq:"5–7 Reels/week + 3–5 Stories/day during campaign",
    bestTime:"6–9pm Pacific; Saturday 11am–1pm for highest reach",
  },
  {
    platform:"Facebook", priority:"MEDIUM-HIGH", color:"blue",
    stake:["Vietnam-era veterans (55–80)", "Older Chicano/Latino community", "Veterans family networks", "Community organizations", "Alumni networks", "Church-based community"],
    behavior:"Group-based loyalty. Shared memory narratives. High engagement in closed groups. Events perform well.",
    tactics:[
      "Join and post in veteran groups: 'Vietnam Veterans of America', 'Chicano Vietnam Veterans', 'Deported Veterans Support House'",
      "Create AUMER Foundation public page with documentary-style content",
      "Facebook Events for readings, community events, Veterans Day programming",
      "Long-form posts perform better here than on Instagram",
      "Hispanic Heritage Month (Sep 15–Oct 15) is peak engagement window",
    ],
    content:["Documentary-style videos about the 349 Rule", "Veteran family testimony shares", "Community event announcements", "Historical photos + manuscript connection", "Group discussions about erasure and recognition"],
    redFlags:["Marketing-speak in posts", "No community member engagement before posting", "Ignoring group moderator relationships"],
    postFreq:"1–2x/day on page. 3–4x/week in targeted groups.",
    bestTime:"12–2pm and 7–9pm Pacific. Peak: Sunday afternoons for veterans content.",
  },
  {
    platform:"TikTok / BookTok", priority:"MEDIUM", color:"purple",
    stake:["Gen Z Chicano/Latino readers", "College students", "Mainstream book community", "Young veterans", "First-generation college students"],
    behavior:"Viral discovery engine. Personality-driven recommendation. 15–60 second attention window. Identity + emotional hook required in first 3 seconds.",
    tactics:[
      "POV: 'The US Army knew. They just didn't count.' (349 Rule hook)",
      "BookTok duet with @barriobooksclub or similar",
      "Reading clip: author voice on Chapter 1 opening",
      "'What actually happens when a veteran is deported' — educational format",
      "Mathematics of the manuscript: show the Omega formula visually",
    ],
    content:["Hook-first 30-second explainers", "Reading clips with emotional moments", "Research reveals (the 349 anomaly)", "Duets with book creators", "Veterans Day countdown content"],
    redFlags:["Long-form content without hook in 3 seconds", "Formal register", "No trending audio usage"],
    postFreq:"1–2x/day for virality window. 4–5x/week for sustained presence.",
    bestTime:"7–10pm Pacific. Peak: 8pm for Chicano/Latino audience.",
  },
  {
    platform:"Twitter/X", priority:"HIGH", color:"teal",
    stake:["Literary critics", "MFA faculty", "NYRB/Paris Review orbit", "Award committee adjacent", "Military historians", "Investigative journalists"],
    behavior:"Cultural discourse. Real-time opinion. Award orbit conversations happen here. Literary credibility signals are built here.",
    tactics:[
      "Thread the 349 Rule as a forensic disclosure: one finding per tweet",
      "Engage with @VietThanhN (USC), @BranchWarrior (military history), literary critics",
      "Quote-tweet DCAS-adjacent news stories with your forensic data",
      "Live-tweet during Veterans Day Congressional proceedings",
      "Thread on 'Why the DCAS records lie' using your SPSS data",
    ],
    content:["Forensic data threads", "Quote-retweets with commentary", "Live engagement during news cycles", "Academic citation drops", "Award season positioning content"],
    redFlags:["Marketing tone", "Not engaging with replies", "Posting without engaging in literary discourse first"],
    postFreq:"3–5 tweets/day. 1 major thread/week.",
    bestTime:"8–10am and 5–7pm Pacific for literary audience.",
  },
  {
    platform:"Substack", priority:"MEDIUM", color:"gold",
    stake:["Literary critics (their home base)", "Independent press editors", "Academic readers", "Serious book community", "Educators"],
    behavior:"Long-form intellectual discourse. Paid subscriber model = serious audience self-selection. Cited in award orbit conversations.",
    tactics:[
      "Launch 'The Mathematics of Erasure' newsletter on AUMER Foundation",
      "Monthly long-form essays: 'What the DCAS records actually say'",
      "Excerpt chapters with editorial commentary",
      "Cross-post to Twitter/X with subscriber teaser",
      "Offer free chapters to educators as course material",
    ],
    content:["Monthly forensic intelligence essays", "Chapter excerpts with context", "Grant progress updates (builds credibility)", "Reader cohort findings (post-Sprint validation)", "Award circuit commentary"],
    redFlags:["Marketing-first content", "Paywall on the first 3 posts", "No editorial voice"],
    postFreq:"2x/month minimum. 1x/week during launch windows.",
    bestTime:"Tuesday morning delivery for highest open rate.",
  },
];

const PRIORITY_COLORS = {"PRIMARY":"text-gold bg-gold/10 border-gold/30","HIGH":"text-teal bg-teal/10 border-teal/30","MEDIUM-HIGH":"text-blue bg-blue/10 border-blue/30","MEDIUM":"text-muted-foreground bg-secondary border-border"};

export default function PlatformIntelligence() {
  const [selected, setSelected] = useState("LinkedIn");
  const plat = PLATFORMS.find(p => p.platform === selected);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-xl font-black text-foreground font-mono">PLATFORM INTELLIGENCE — Where Each Stakeholder Lives</div>
      <div className="flex gap-2 flex-wrap">
        {PLATFORMS.map(p => (
          <button key={p.platform} onClick={() => setSelected(p.platform)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono border transition-all ${
              selected === p.platform ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"
            }`}>
            {p.platform}
            <span className={`text-[7px] px-1 rounded border ${PRIORITY_COLORS[p.priority]}`}>{p.priority}</span>
          </button>
        ))}
      </div>

      {plat && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-slide-up">
          <div className="space-y-4">
            <div className={`bg-card border border-${plat.color}/30 rounded-xl p-5`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`text-xl font-black font-mono text-${plat.color}`}>{plat.platform}</div>
                <span className={`text-[8px] font-bold font-mono px-2 py-1 rounded border ${PRIORITY_COLORS[plat.priority]}`}>{plat.priority}</span>
              </div>
              <div className="text-[10px] text-foreground/80 mb-4">{plat.behavior}</div>
              <div className="grid grid-cols-2 gap-3 text-[9px]">
                <div className="bg-secondary/20 rounded-lg px-3 py-2">
                  <div className="text-[8px] font-mono text-muted-foreground mb-0.5">BEST POSTING TIME</div>
                  <div className="font-bold text-foreground">{plat.bestTime}</div>
                </div>
                <div className="bg-secondary/20 rounded-lg px-3 py-2">
                  <div className="text-[8px] font-mono text-muted-foreground mb-0.5">FREQUENCY</div>
                  <div className="font-bold text-foreground">{plat.postFreq}</div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[9px] font-bold font-mono text-gold mb-3">PRIMARY STAKEHOLDERS ON THIS PLATFORM</div>
              <div className="flex flex-wrap gap-1.5">
                {plat.stake.map((s,i) => (
                  <span key={i} className="text-[9px] font-mono border border-gold/20 bg-gold/5 text-gold px-2 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </div>

            <div className="bg-card border border-red/10 rounded-xl p-5">
              <div className="text-[9px] font-bold font-mono text-red mb-3">RED FLAGS — What Will Kill Your Credibility</div>
              <ul className="space-y-1">
                {plat.redFlags.map((r,i) => (
                  <li key={i} className="flex items-start gap-2 text-[10px] text-red">
                    <span className="mt-0.5 flex-shrink-0">✗</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[9px] font-bold font-mono text-teal mb-3">TACTICAL PLAYBOOK</div>
              <ol className="space-y-2">
                {plat.tactics.map((t,i) => (
                  <li key={i} className="flex items-start gap-2 text-[10px] text-foreground/80">
                    <span className="font-black font-mono text-teal flex-shrink-0">{i+1}.</span>{t}
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-[9px] font-bold font-mono text-purple mb-3">CONTENT FORMATS FOR THIS PLATFORM</div>
              <ul className="space-y-1">
                {plat.content.map((c,i) => (
                  <li key={i} className="flex items-center gap-2 text-[10px] text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple flex-shrink-0" />{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}