import { useState } from "react";

const PLATFORMS = [
  {
    platform:"Facebook", icon:"f", color:"blue",
    groups:[
      { name:"Deported Veterans Support",     type:"Community",   size:"8.2K",   lang:"EN/ES", geo:"US/MX", monitoring:"Daily",  focus:"Primary veteran community channel. Hector Barajas connection."},
      { name:"Vietnam Veterans Community",    type:"Community",   size:"142K",   lang:"EN",    geo:"US",    monitoring:"Daily",  focus:"Vietnam era veterans. Validator cohort. 349-story seeding."},
      { name:"Chicano/Latino Readers Book",   type:"Book Club",   size:"14K",    lang:"EN/ES", geo:"US",    monitoring:"Weekly", focus:"Champion cohort. Community reading events."},
      { name:"East LA Community Network",     type:"Community",   size:"22K",    lang:"EN/ES", geo:"LA/CA", monitoring:"Weekly", focus:"Boyle Heights/East LA geography. Ch.7 community."},
      { name:"Boyle Heights Families",        type:"Community",   size:"9.4K",   lang:"EN/ES", geo:"LA/CA", monitoring:"Weekly", focus:"Manuscript geography. Maximum identity resonance."},
      { name:"Chicano Vietnam Veterans",      type:"Veterans",    size:"6.1K",   lang:"EN",    geo:"US/MX", monitoring:"Daily",  focus:"Direct target community for 349-record outreach."},
      { name:"LULAC Members Network",         type:"Advocacy",    size:"31K",    lang:"EN",    geo:"US",    monitoring:"Weekly", focus:"Civil rights + veterans commission alignment."},
    ],
    contentStrategy:"Long-form posts perform here. Documentary-style video. Events. Family-story framing. Veterans Day and HHM windows = peak engagement.",
  },
  {
    platform:"YouTube", icon:"▶", color:"red",
    groups:[
      { name:"Task & Purpose",         type:"Channel",   size:"1.2M",   lang:"EN", geo:"US",  monitoring:"Weekly",  focus:"Military journalism. P0 pitch target for 349-story documentary."},
      { name:"Latino USA",             type:"Channel",   size:"42K",    lang:"EN/ES",geo:"US",monitoring:"Weekly",  focus:"NPR Latino affairs. Cultural fit. Media partner target."},
      { name:"Radio Ambulante",        type:"Podcast/YT",size:"88K",    lang:"ES", geo:"LATAM",monitoring:"Monthly","focus":"Spanish-language storytelling podcast. Bilingual SII bridge."},
      { name:"Jocko Podcast",          type:"Podcast/YT",size:"1.8M",   lang:"EN", geo:"US",  monitoring:"Monthly", focus:"Military leadership. Phase 4 seeded advocate target."},
      { name:"Coffee with a Sergeant", type:"Channel",   size:"125K",   lang:"EN", geo:"US",  monitoring:"Monthly", focus:"Veteran community content. Peer-to-peer trust."},
    ],
    contentStrategy:"Reading clips + mini-documentary format. 5-10 minute segments outperform longer cuts. Bilingual subtitles required for Latino USA / Radio Ambulante.",
  },
  {
    platform:"Instagram", icon:"📸", color:"purple",
    groups:[
      { name:"@rgvet_vive (Miguel Cervantes)",   type:"Influencer", size:"41K", lang:"EN/ES", geo:"US/MX", monitoring:"Daily",  focus:"Primary organic driver. Fit 86. Daily cadence. $500-2K/post." },
      { name:"@latinovets",                      type:"Org",        size:"31.2K",lang:"EN",   geo:"US",    monitoring:"Daily",  focus:"Institutional veteran reach. Community validation."},
      { name:"@barriobooksclub",                 type:"Book",       size:"14K", lang:"EN/ES", geo:"LA/CA", monitoring:"Daily",  focus:"Gen Z Chicano readership. Community amplifier."},
      { name:"@latinxpub",                       type:"Publisher",  size:"18.5K",lang:"EN",   geo:"US",    monitoring:"Weekly", focus:"Publishing community. Every post = agent/editor sees book."},
      { name:"@ruizchicanolit",                  type:"Academic",   size:"18.5K",lang:"EN",   geo:"US",    monitoring:"Weekly", focus:"Academic credibility. Course adoption pipeline."},
      { name:"@selfhelpgraphics",                type:"Arts",       size:"12K", lang:"EN/ES", geo:"LA/CA", monitoring:"Monthly","focus":"Boyle Heights arts institution. Reading events venue."},
    ],
    contentStrategy:"Quote reels from Ch.1 (post-artifact removal). '¿Por cuántas lunas cargas tu dolor?' = viral hook. The 349 Rule as 30-second bilingual Reel. Saves > likes here.",
  },
  {
    platform:"TikTok / BookTok", icon:"♪", color:"teal",
    groups:[
      { name:"@berrybookpages",    type:"BookTok", size:"22K", lang:"EN", geo:"US",    monitoring:"Daily",  focus:"Cultural fiction specialist. Affiliate $150-400. Gen Z Latina."},
      { name:"@tomesandtextiles",  type:"BookTok", size:"19K", lang:"EN", geo:"US",    monitoring:"Daily",  focus:"Lifestyle + book crossover. Gen Z Latina audience."},
      { name:"BookTok Chicano Lit",type:"Niche",   size:"8.4K",lang:"EN", geo:"US",    monitoring:"Weekly", focus:"Direct target community. First Chapter clip strategy."},
      { name:"VietnamWarTok",      type:"History", size:"44K", lang:"EN", geo:"US",    monitoring:"Weekly", focus:"History-buff community. 349 Rule explainer format."},
    ],
    contentStrategy:"Hook in first 3 seconds: 'The US Army knew. They just didn't count.' 30-second 349 explainer. Reading clip POV. Trending audio usage required.",
  },
  {
    platform:"WhatsApp", icon:"💬", color:"teal",
    groups:[
      { name:"TJ Deported Vet Network",     type:"Community", size:"~200",  lang:"ES/EN", geo:"MX",  monitoring:"Manual",  focus:"Ground-level deported veteran community. Private. Trust-first."},
      { name:"Chicano Community Organizers",type:"Organizing",size:"~80",   lang:"EN/ES", geo:"LA",  monitoring:"Manual",  focus:"East LA community organizers. Events coordination."},
      { name:"Nogales Volunteer Network",   type:"Service",   size:"~150",  lang:"ES",    geo:"AZ/MX",monitoring:"Manual", focus:"Border crossing volunteer coordination. Shelter network."},
    ],
    contentStrategy:"NO broadcast marketing. WhatsApp = trust-based community only. Personal introduction required. Voice message over text. Spanish-first.",
  },
];

const KEYWORD_TIERS = [
  { tier:1, keywords:["#DeportedVeterans","#VeteranosDeportados","#349Rule","#ChicanoVietnam"], reach:"HIGH", trend:"↑", action:"Own these hashtags. Primary conversation nodes." },
  { tier:2, keywords:["#ExilePatriot","#HispanicVeterans","#TruthEngine360","#MathematicsOfVietnam"], reach:"MED", trend:"→", action:"Build reach. Seeding phase priority." },
  { tier:3, keywords:["#BookTok","#ChicanoLit","#VietnamVet","#ImmigrationJustice"], reach:"HIGH", trend:"↑", action:"Join existing conversation. Do not create from scratch." },
];

export default function SocialListeningGrid() {
  const [activePlatform, setActivePlatform] = useState("Facebook");
  const plat = PLATFORMS.find(p => p.platform === activePlatform);

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <div className="text-lg font-black font-mono text-foreground mb-1">SOCIAL LISTENING GRID — Platform Intelligence</div>
        <div className="text-xs text-muted-foreground font-mono">Platform-by-platform monitoring matrix tagged by geography (US/MX/LATAM) and language (EN/ES/bilingual)</div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {PLATFORMS.map(p => (
          <button key={p.platform} onClick={() => setActivePlatform(p.platform)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono border transition-all ${
              activePlatform === p.platform ? `border-${p.color}/50 bg-${p.color}/10 text-${p.color}` : "border-border text-muted-foreground hover:text-foreground"
            }`}>
            <span>{p.icon}</span>{p.platform}
          </button>
        ))}
      </div>

      {plat && (
        <div className="space-y-4 animate-slide-up">
          <div className={`bg-${plat.color}/5 border border-${plat.color}/20 rounded-xl p-4`}>
            <div className={`text-[9px] font-bold font-mono text-${plat.color} mb-1`}>CONTENT STRATEGY — {plat.platform.toUpperCase()}</div>
            <div className="text-[10px] text-foreground/80">{plat.contentStrategy}</div>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                <th className="text-left px-3 py-2">GROUP / CHANNEL</th><th className="text-left px-3 py-2">TYPE</th>
                <th className="text-left px-3 py-2">SIZE</th><th className="text-left px-3 py-2">LANG</th>
                <th className="text-left px-3 py-2">GEO</th><th className="text-left px-3 py-2">MONITOR</th>
                <th className="text-left px-3 py-2">STRATEGIC FOCUS</th>
              </tr></thead>
              <tbody>
                {plat.groups.map((g,i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/10 last:border-0">
                    <td className={`px-3 py-2.5 font-bold text-${plat.color} whitespace-nowrap`}>{g.name}</td>
                    <td className="px-3 py-2.5 text-muted-foreground text-[8px]">{g.type}</td>
                    <td className="px-3 py-2.5 font-mono text-foreground font-bold">{g.size}</td>
                    <td className="px-3 py-2.5"><span className="text-[7px] font-mono border border-border px-1 rounded">{g.lang}</span></td>
                    <td className="px-3 py-2.5 text-muted-foreground font-mono text-[8px]">{g.geo}</td>
                    <td className={`px-3 py-2.5 font-mono text-[8px] ${g.monitoring==="Daily"?"text-gold":g.monitoring==="Manual"?"text-red":"text-muted-foreground"}`}>{g.monitoring}</td>
                    <td className="px-3 py-2.5 text-foreground/70 text-[8px] max-w-xs">{g.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Keyword tiers */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-[10px] font-bold font-mono text-gold mb-3">HASHTAG + KEYWORD TIERS — Activation Priority</div>
        <div className="space-y-3">
          {KEYWORD_TIERS.map((t,i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`text-xs font-black font-mono w-6 ${t.tier===1?"text-gold":t.tier===2?"text-teal":"text-blue"}`}>T{t.tier}</div>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {t.keywords.map((k,j) => (
                  <span key={j} className={`text-[8px] font-mono px-2 py-0.5 rounded border ${t.tier===1?"text-gold border-gold/30 bg-gold/5":t.tier===2?"text-teal border-teal/30 bg-teal/5":"text-blue border-blue/30 bg-blue/5"}`}>{k}</span>
                ))}
              </div>
              <div className="text-[8px] font-mono text-foreground/80 max-w-xs flex-shrink-0">{t.action}</div>
              <span className={`text-[9px] font-mono font-bold flex-shrink-0 ${t.trend==="↑"?"text-teal":"text-muted-foreground"}`}>{t.trend} {t.reach}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}