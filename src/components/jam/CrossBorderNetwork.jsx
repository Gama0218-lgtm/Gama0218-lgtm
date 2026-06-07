const CIRCLES_DATA = [
  {
    circle:1, label:"Direct Operators", color:"gold",
    desc:"Organizations with boots on the ground. Daily contact with deported veterans and families.",
    orgs:[
      { name:"Deported Veterans Support House (The Bunker)", site:"N/A", location:"Tijuana MX", contact:"deported.veterans@gmail.com", action:"MOU target — first partner call"},
      { name:"ImmDef — Immigrant Defenders Law Center",       site:"immdef.org",            location:"Los Angeles CA", contact:"info@immdef.org",                action:"DV-NET-001 case file link"},
      { name:"Al Otro Lado",                                  site:"alotrolado.org",         location:"San Diego / TJ", contact:"Via site",                     action:"Referral network connection"},
      { name:"Casa del Migrante — Tijuana",                   site:"migrante.org.mx",        location:"Tijuana MX",    contact:"Via Diocese",                   action:"Shelter field visit (protocol required)"},
    ]
  },
  {
    circle:2, label:"Institutional Allies", color:"teal",
    desc:"Established organizations with advocacy infrastructure and media reach.",
    orgs:[
      { name:"ALVA (American Latino Veterans Assn)",     site:"alvavets.org",            location:"Nationwide US",   contact:"info@alvavets.org",               action:"P0 coalition partner — 349 petition"},
      { name:"Veterans For Peace — Deported Vets",       site:"veteransforpeace.org",    location:"Nationwide US",   contact:"vfp@veteransforpeace.org",        action:"Fiscal sponsor pathway"},
      { name:"Repatriate Our Patriots",                  site:"repatriateourpatriots.org",location:"Nationwide",     contact:"contact@repatriateourpatriots.org",action:"Co-applicant for grants (EIN 83-3991480)"},
      { name:"LULAC Veterans Commission",                site:"lulac.org",               location:"Washington DC",   contact:"veteranscommission@lulac.org",    action:"Advocacy + media platform"},
    ]
  },
  {
    circle:3, label:"Media Multipliers", color:"orange",
    desc:"Journalists, podcasters, and social media operators with amplification capacity.",
    orgs:[
      { name:"The War Horse",            site:"thewarhorse.org",     location:"Online",          contact:"tips@thewarhorse.org",     action:"P0 pitch: 349-record investigative story"},
      { name:"Task & Purpose",           site:"taskandpurpose.com",  location:"Online",          contact:"tips@taskandpurpose.com",  action:"'Algorithm That Erased Chicano Veterans' pitch"},
      { name:"NPR Code Switch",          site:"npr.org",             location:"Nationwide",      contact:"codeswitch@npr.org",       action:"Bilingual code-switching story angle"},
      { name:"Radio Ambulante (NPR)",    site:"radioambulante.org",  location:"LATAM/US",        contact:"info@radioambulante.org",  action:"Spanish-language storytelling podcast"},
      { name:"ProPublica",               site:"propublica.org",      location:"Online",          contact:"tips@propublica.org",      action:"DCAS forensic data story — investigative angle"},
      { name:"Democracy Now!",           site:"democracynow.org",    location:"Online",          contact:"Via site",                 action:"Immigration + veteran rights coverage"},
    ]
  },
  {
    circle:4, label:"Policy / Political", color:"purple",
    desc:"Legislators, foundations, and policy organizations who create systemic change.",
    orgs:[
      { name:"Congressional Hispanic Caucus",    site:"Via CHC",          location:"Washington DC",  contact:"Via CHC website",              action:"May 18 2026 briefing follow-up pipeline"},
      { name:"Ford Foundation",                  site:"fordfoundation.org",location:"New York NY",   contact:"ford.connect2giving.org",      action:"Rolling LOI — Racial Justice + Creativity"},
      { name:"Mellon Foundation",                site:"mellon.org",        location:"New York NY",   contact:"mellon.org/inquiries",         action:"Digital humanities + literary arts inquiry"},
      { name:"ACLU SoCal",                       site:"aclusocal.org",     location:"Los Angeles CA",contact:"Via press office",             action:"Marco Chavez case — press release connection"},
    ]
  },
];

export default function CrossBorderNetwork() {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <div className="text-lg font-black font-mono text-foreground mb-1">CROSS-BORDER NETWORK MAP — 4 Concentric Circles</div>
        <div className="text-xs text-muted-foreground font-mono">Direct Operators → Institutional Allies → Media Multipliers → Policy/Political | Each node includes live contact links and next action</div>
      </div>

      {/* Visual concentric circles representation */}
      <div className="bg-card border border-gold/20 rounded-xl p-6 relative overflow-hidden">
        <div className="text-[9px] font-mono text-muted-foreground mb-4">ACTIVATION ORDER: Start with Circle 1. Build credibility. Let each ring amplify to the next.</div>
        <div className="flex items-center justify-center gap-0 flex-wrap">
          {CIRCLES_DATA.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`relative flex items-center justify-center rounded-full border-2 border-${c.color}/60 bg-${c.color}/10`}
                style={{width:`${80 + i*30}px`, height:`${80 + i*30}px`, minWidth:`${80+i*30}px`}}>
                <div className="text-center">
                  <div className={`text-[8px] font-black font-mono text-${c.color}`}>C{c.circle}</div>
                  <div className="text-[6px] text-muted-foreground leading-tight px-1">{c.label.split(" ").slice(-1)}</div>
                  <div className={`text-[8px] font-bold text-${c.color}`}>{c.orgs.length}</div>
                </div>
              </div>
              {i < CIRCLES_DATA.length - 1 && <div className="text-muted-foreground text-lg mx-1">→</div>}
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-[9px]">
          {CIRCLES_DATA.map((c,i) => (
            <div key={i} className={`border border-${c.color}/20 rounded-lg p-2`}>
              <div className={`font-black text-${c.color} font-mono mb-0.5`}>Circle {c.circle}</div>
              <div className="text-muted-foreground text-[8px]">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed cards per circle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {CIRCLES_DATA.map((c, i) => (
          <div key={i} className={`bg-card border border-${c.color}/20 rounded-xl overflow-hidden`}>
            <div className={`px-4 py-3 border-b border-${c.color}/20 bg-${c.color}/5`}>
              <div className={`text-[10px] font-black font-mono text-${c.color}`}>CIRCLE {c.circle} — {c.label.toUpperCase()}</div>
              <div className="text-[8px] text-muted-foreground mt-0.5">{c.desc}</div>
            </div>
            {c.orgs.map((org, j) => (
              <div key={j} className="px-4 py-3 border-b border-border/30 last:border-0 hover:bg-secondary/10">
                <div className={`text-[10px] font-bold text-${c.color} mb-1`}>{org.name}</div>
                <div className="grid grid-cols-2 gap-2 text-[8px]">
                  <div><span className="text-muted-foreground">Location: </span><span className="text-foreground">{org.location}</span></div>
                  <div><span className="text-muted-foreground">Website: </span><span className="text-blue font-mono">{org.site}</span></div>
                  <div><span className="text-muted-foreground">Contact: </span><span className="text-teal">{org.contact}</span></div>
                  <div><span className="text-muted-foreground">→ </span><span className={`font-bold text-${c.color}`}>{org.action}</span></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}