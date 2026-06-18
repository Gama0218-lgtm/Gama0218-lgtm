import { useState } from "react";

const HUBS = [
  {
    city:"Tijuana, BC", country:"MX", side:"MX", flag:"🇲🇽",
    color:"gold", priority:"PRIMARY HUB",
    desc:"Largest concentration of deported veterans. The Bunker (DVSH) = first contact point. ~200+ deported veterans in TJ metro.",
    shelters:[
      {name:"Deported Veterans Support House (The Bunker)",  contact:"deported.veterans@gmail.com",    type:"Veteran Service", notes:"Hector Barajas. PRIMARY. MOU target."},
      {name:"Casa del Migrante — Tijuana",                   contact:"migrante.org.mx",                 type:"Migrant Shelter", notes:"Church-run. 200-300 migrants/week capacity."},
      {name:"Contra Corriente (migrant shelter)",            contact:"Via Diocese of Tijuana",           type:"Shelter",         notes:"Bishops' migration network. New arrivals."},
      {name:"Ejército de Salvación (Salvation Army TJ)",     contact:"salvationarmy.org",               type:"Emergency Shelter",notes:"Food + emergency housing. High-traffic."},
    ],
    vetOrgs:[
      {name:"ALVA — Binational Veterans Outreach",   contact:"alvavets.org",            notes:"P0 coalition partner"},
      {name:"Veterans For Peace — Deported Vets",    contact:"veteransforpeace.org",    notes:"Fiscal sponsor pathway"},
    ],
    legalContacts:[
      {name:"Al Otro Lado",  contact:"alotrolado.org",   notes:"US immigration legal services; TJ office"},
      {name:"ImmDef TJ",     contact:"immdef.org",        notes:"DV-NET-001 case file connection"},
    ],
    socialNodes:["Facebook: Deported Veterans Support","Facebook: Exiled Veterans","WhatsApp: TJ Deported Vet Network","Instagram: @bunkerdeportedusvets"],
    fieldProtocol:"DO: Use bilingual intro. Ask permission before recording. Verify veteran status via DD-214 mention. DO NOT: Use military insignia in photos without consent. DO NOT imply DoD endorsement.",
  },
  {
    city:"Nogales, AZ / Sonora MX", country:"US/MX", side:"BOTH", flag:"🇺🇸🇲🇽",
    color:"orange", priority:"SECONDARY HUB",
    desc:"High-traffic border crossing. Kino Border Initiative = primary partner. AZ-Sonora corridor sees ~500 migrants/week.",
    shelters:[
      {name:"Kino Border Initiative",            contact:"kinoborderinitiative.org",   type:"Service",        notes:"Migrant aid. Binational. Jesuit-run."},
      {name:"Comedor (soup kitchen) Nogales MX", contact:"Via KBI",                   type:"Food Service",   notes:"Daily meals. Veteran family identification point."},
      {name:"Nazareth House Nogales AZ",         contact:"Via Diocese of Tucson",      type:"Shelter",        notes:"Catholic social services. Refugee processing."},
    ],
    vetOrgs:[
      {name:"Florence Project (AFSC)",     contact:"firrp.org",           notes:"Immigration legal. Veteran cases."},
      {name:"AZ Veterans Coalition",       contact:"Via VFW",             notes:"State chapter. Endorsement target."},
    ],
    legalContacts:[
      {name:"Kino Border Initiative Legal",contact:"kinoborderinitiative.org",notes:"On-site legal clinics"},
      {name:"CLINIC Nogales",              contact:"clinic.org",               notes:"Catholic legal immigration network"},
    ],
    socialNodes:["Facebook: Kino Border Initiative","Facebook: Nogales Community Groups","Instagram: @kinoborder","WhatsApp: Nogales Volunteer Network"],
    fieldProtocol:"DO: Coordinate with KBI staff before visiting shelter. Use Spanish-first approach. DO NOT: Photograph identifiable faces without written consent. DO NOT discuss pending immigration cases.",
  },
  {
    city:"Ciudad Juárez, Chihuahua", country:"MX", side:"MX", flag:"🇲🇽",
    color:"blue", priority:"TERTIARY HUB",
    desc:"Major crossing point. Casa del Migrante network. High concentration of deported long-term US residents.",
    shelters:[
      {name:"Casa del Migrante — Juárez",      contact:"casadelmigrante.org",        type:"Shelter",        notes:"200+ capacity. Catholic Scalabriniani."},
      {name:"Buen Pastor (Good Shepherd)",     contact:"Via Diocese of Juárez",      type:"Women's Shelter",notes:"Families only. High need."},
      {name:"Albergue CAME",                   contact:"came.org.mx",                type:"Rehab + Shelter", notes:"Drug recovery + migration intersection."},
    ],
    vetOrgs:[
      {name:"Repatriate Our Patriots — Juárez node",contact:"repatriateourpatriots.org",notes:"EIN 83-3991480. Advocacy partner."},
    ],
    legalContacts:[
      {name:"Consulado USA — Ciudad Juárez",  contact:"mx.usembassy.gov/ciudad-juarez",notes:"Citizen services. DD-214 replacement pathway."},
      {name:"INMUMI (immigration legal)",      contact:"Via Diocese",                  notes:"Catholic immigration legal aid"},
    ],
    socialNodes:["Facebook: Casa del Migrante Juárez","Facebook: Deported to Juárez","Facebook: Frontera es vida","WhatsApp: Juárez migrant network"],
    fieldProtocol:"DO: Coordinate advance with Casa del Migrante administration. Have Spanish-language materials ready. DO NOT: Visit cartel-adjacent areas without local guide. Security assessment required before field visit.",
  },
];

export default function BorderHubMap() {
  const [selected, setSelected] = useState("Tijuana, BC");
  const hub = HUBS.find(h => h.city === selected);

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <div className="text-lg font-black font-mono text-foreground mb-1">BORDER HUB MAP — Strategic Intelligence</div>
        <div className="text-xs text-muted-foreground font-mono">Tijuana · Nogales · Ciudad Juárez — 3 strategic hubs for the Exile Patriot Project. Each with shelter listings, veteran orgs, immigration legal contacts, and field protocol reminders.</div>
      </div>

      {/* Hub selector */}
      <div className="flex gap-3 flex-wrap">
        {HUBS.map(h => (
          <button key={h.city} onClick={() => setSelected(h.city)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              selected === h.city ? `border-${h.color}/50 bg-${h.color}/10` : "border-border bg-card hover:border-gold/20"
            }`}>
            <span className="text-lg">{h.flag}</span>
            <div className="text-left">
              <div className={`text-[10px] font-black font-mono text-${h.color}`}>{h.city}</div>
              <div className="text-[8px] text-muted-foreground">{h.priority}</div>
            </div>
          </button>
        ))}
      </div>

      {hub && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-slide-up">
          {/* Hub overview */}
          <div className={`bg-card border border-${hub.color}/30 rounded-xl p-5 col-span-full`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{hub.flag}</span>
              <div>
                <div className={`text-lg font-black font-mono text-${hub.color}`}>{hub.city}</div>
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded border text-${hub.color} border-${hub.color}/30 bg-${hub.color}/10`}>{hub.priority} · {hub.side} SIDE</span>
              </div>
            </div>
            <p className="text-sm text-foreground/80">{hub.desc}</p>
            <div className="mt-3 bg-red/5 border border-red/20 rounded-lg p-3">
              <div className="text-[8px] font-bold font-mono text-red mb-1">FIELD PROTOCOL</div>
              <div className="text-[9px] text-foreground/80">{hub.fieldProtocol}</div>
            </div>
          </div>

          {/* Shelters */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-orange">SHELTER NETWORK</div>
            {hub.shelters.map((s,i) => (
              <div key={i} className="px-4 py-3 border-b border-border/30 last:border-0 hover:bg-secondary/10">
                <div className="text-[10px] font-bold text-foreground mb-0.5">{s.name}</div>
                <div className="flex items-center gap-3 text-[9px]">
                  <span className="text-teal font-mono">{s.contact}</span>
                  <span className="text-muted-foreground border border-border px-1 rounded">{s.type}</span>
                </div>
                <div className="text-[8px] text-muted-foreground mt-0.5">{s.notes}</div>
              </div>
            ))}
          </div>

          {/* Vet orgs + Legal */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-teal">VETERAN ORGANIZATIONS</div>
              {hub.vetOrgs.map((v,i) => (
                <div key={i} className="px-4 py-2.5 border-b border-border/30 last:border-0">
                  <div className="text-[10px] font-bold text-gold">{v.name}</div>
                  <div className="text-[9px] text-blue font-mono">{v.contact}</div>
                  <div className="text-[8px] text-muted-foreground">{v.notes}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-purple">IMMIGRATION LEGAL CONTACTS</div>
              {hub.legalContacts.map((l,i) => (
                <div key={i} className="px-4 py-2.5 border-b border-border/30 last:border-0">
                  <div className="text-[10px] font-bold text-purple">{l.name}</div>
                  <div className="text-[9px] text-blue font-mono">{l.contact}</div>
                  <div className="text-[8px] text-muted-foreground">{l.notes}</div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-[9px] font-bold font-mono text-blue mb-2">SOCIAL LISTENING NODES</div>
              <div className="flex flex-wrap gap-1.5">
                {hub.socialNodes.map((n,i) => (
                  <span key={i} className="text-[8px] font-mono text-blue border border-blue/20 bg-blue/5 px-2 py-0.5 rounded">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}