import { useState } from "react";

const COMMUNITY_TYPES = [
  {
    type:"Border Community Organizations",
    color:"orange",
    icon:"🌵",
    desc:"Organizations that work directly with immigrant families, border crossings, and recently arrived/deported individuals. Primary location intelligence for reaching families of veterans who were deported.",
    locations:[
      {name:"Deported Veterans Support House (DVSH)",    city:"Tijuana, MX",            contact:"deported.veterans@gmail.com",  fb:"Deported Veterans Support House",      type:"Direct partner", notes:"Primary partner. Run by Hector Barajas (himself a deported veteran). THE direct channel to deported veterans and their families."},
      {name:"Border Angels (Angeles de la Frontera)",    city:"San Diego/Tijuana",      contact:"borderangels.org",             fb:"Border Angels",                         type:"Coalition",      notes:"Border crossing aid. Mexican families of veterans cross here."},
      {name:"Al Otro Lado",                              city:"San Diego/Tijuana",       contact:"alotrolado.org",               fb:"Al Otro Lado",                          type:"Legal Aid",      notes:"Immigration legal services. Many clients have veteran family members."},
      {name:"Corazon de Vida Foundation",                city:"Ensenada/San Diego",      contact:"corazondevida.org",            fb:"Corazón de Vida Foundation",            type:"Community",      notes:"Orphan/youth support in Baja California. Chicano community connection point."},
      {name:"Kino Border Initiative",                    city:"Nogales, AZ/Sonora MX",   contact:"kinoborderinitiative.org",     fb:"Kino Border Initiative",                type:"Service",        notes:"Migrant aid at AZ-Sonora border. Families passing through, veterans among them."},
      {name:"Florence Project (AFSC)",                  city:"Phoenix / Florence, AZ",  contact:"firrp.org",                   fb:"Florence Immigrant Refugee Rights Project",type:"Legal",       notes:"Immigration legal aid. Deported veteran cases."},
      {name:"Proyecto Dilley / CLINIC",                 city:"Dilley, TX / Nationwide", contact:"dilleyproject.org",           fb:"Dilley Pro Bono Project",               type:"Legal",          notes:"Family detention legal support."},
      {name:"Tijuana Refugee Shelter Network",           city:"Tijuana, BC",             contact:"Via Diocese of Tijuana",       fb:"Multiple Tijuana shelter pages",        type:"Shelter",        notes:"Church-based shelter network. First contact point for recently deported."},
    ],
    fbGroups:["Deported Veterans Support", "Veterans Deported Border Community", "Chicano Vietnam Veterans Mexico"],
    insight:"The deported veteran community is concentrated in Tijuana (largest), Mexicali, Nogales, and Ciudad Juárez. Reach them through DVSH first — that relationship IS the community.",
  },
  {
    type:"Chicano/Latino Community Centers",
    color:"gold",
    icon:"🏘️",
    desc:"Community centers in Chicano barrios where the manuscript's community lives. These are the reading groups, after-school programs, and town squares of the target audience.",
    locations:[
      {name:"Centro de Amistad / Eastside Los Angeles",  city:"East Los Angeles, CA",    contact:"Via LA County",                fb:"East LA Community Groups",              type:"Cultural Center", notes:"East LA = Boyle Heights adjacent. Manuscript geography. Ch.7 Boulevard Theorem community."},
      {name:"Plaza de la Raza Cultural Center",          city:"Lincoln Heights, CA",      contact:"plazadelaraza.org",            fb:"Plaza de la Raza",                      type:"Cultural",        notes:"Cultural arts hub. Reading events, youth programs. Chicano identity-first."},
      {name:"Self-Help Graphics & Art",                  city:"Boyle Heights, CA",        contact:"selfhelpgraphics.com",         fb:"Self Help Graphics",                    type:"Arts/Cultural",   notes:"Boyle Heights cultural institution. Day of the Dead anchor. High identity resonance."},
      {name:"Centro Cultural de la Raza",               city:"San Diego, CA",             contact:"centroraza.com",              fb:"Centro Cultural de la Raza",            type:"Cultural",        notes:"Chicano arts + cultural center. San Diego reading event venue."},
      {name:"MANA de San Diego",                        city:"San Diego, CA",             contact:"manasd.org",                  fb:"MANA de San Diego",                     type:"Advocacy",        notes:"Latina professional network. Book clubs. Bridge to educators."},
      {name:"Casa Familiar",                            city:"San Ysidro, CA",             contact:"casafamiliar.org",             fb:"Casa Familiar San Ysidro",              type:"Community",       notes:"DIRECTLY at US-Mexico border. Immigrant family services. Bridge community."},
      {name:"National City Libraries (Cesar Chavez)",   city:"National City / Chula Vista",contact:"ncpl.lib.ca.us",            fb:"National City Public Library",          type:"Library",         notes:"High Latino population. REFORMA library partnership venue."},
      {name:"Vecinos de Boyle Heights",                 city:"Boyle Heights, CA",          contact:"Via City Council 14th",      fb:"Boyle Heights Community Groups",        type:"Neighborhood",    notes:"Ground zero for manuscript geography. Ch.7, Ch.33 Sixty-Eight. High identity resonance."},
    ],
    fbGroups:["Chicano/Latino Readers Book Club", "East LA Community Network", "Boyle Heights Families", "Chicano Pride Official", "LA Chicano Movement"],
    insight:"East Los Angeles, Boyle Heights, and National City (Chula Vista border) are the manuscript's home geography. Community readings here land with maximum identity resonance.",
  },
  {
    type:"Veterans Service Organizations",
    color:"teal",
    icon:"🎖️",
    desc:"Veteran service organizations serving the Latino veteran community — both US-based and binational. These groups are the validators. Their endorsement creates the credibility floor.",
    locations:[
      {name:"American Latino Veterans Association (ALVA)", city:"Nationwide / Online",   contact:"alvavets.org",                fb:"American Latino Veterans Association", type:"Primary Partner", notes:"PRIMARY COALITION PARTNER for 349-record anomaly petition. Direct mission alignment."},
      {name:"National Alliance for Filipino Veterans Equity",city:"San Francisco",        contact:"nafve.org",                  fb:"NAFVE",                                 type:"Coalition",       notes:"Cross-coalition ally. Filipino veterans had similar erasure. Coalition broadening."},
      {name:"Hispanas Organized for Political Equality",  city:"Los Angeles",             contact:"hope-inc.org",               fb:"HOPE California",                       type:"Advocacy",        notes:"Latina political advocacy. Bridge to women veteran families."},
      {name:"Vietnam Veterans of America (VVA) Chapter 31",city:"San Diego",              contact:"vva.org",                    fb:"VVA Chapter 31 San Diego",              type:"Veterans Org",    notes:"San Diego chapter serves border region. High concentration of Latino veterans."},
      {name:"Pechanga Veterans Coalition",               city:"Inland Empire, CA",        contact:"Via tribal office",           fb:"Pechanga Veterans",                     type:"Tribal/Veterans", notes:"Native/Chicano veteran community intersection. Yaqui connection to Ch.1."},
      {name:"Voces Oral History Center (UT Austin)",     city:"Austin, TX",               contact:"voces.utexas.edu",            fb:"Voces Oral History Center",             type:"Academic",        notes:"Maggie Rivas-Rodriguez's archive. Scholarly partnership + media coverage access."},
    ],
    fbGroups:["Vietnam Veterans Community", "Latino Veterans Network", "Chicano Veterans USA", "Deported Veterans Support", "Veterans for Peace"],
    insight:"ALVA is the most direct institutional ally. Their 349-record research aligns exactly with the manuscript's forensic spine. An MOU with ALVA before launch creates the veteran validator endorsement.",
  },
  {
    type:"Academic + University Chicano Centers",
    color:"purple",
    icon:"🎓",
    desc:"Ethnic Studies and Chicano Studies centers at universities that drive course adoption and academic credibility. These institutions translate into syllabus placements and scholarly citations.",
    locations:[
      {name:"Cesar E. Chavez Department of Chicana/o Studies (CSUN)", city:"Northridge, CA",  contact:"csun.edu/chicana-o",        fb:"CSUN Chicano Studies",             type:"Dept",     notes:"Largest Chicana/o Studies program in US. LSTE adoption score 91. High course adoption priority."},
      {name:"UCLA Chicano Studies Research Center",                   city:"Los Angeles, CA", contact:"chicano.ucla.edu",          fb:"UCLA CSRC",                        type:"Research", notes:"Major research archive. Publications. High scholar network access."},
      {name:"MEChA (Movimiento Estudiantil Chicano de Aztlan)",       city:"Nationwide",       contact:"nacionmecha.com",          fb:"MEChA Nacional",                   type:"Student",  notes:"Student organization network at every CSU/UC. Reading events. Organic community activation."},
      {name:"UC Berkeley Chicana/o Studies (CSTMS)",                  city:"Berkeley, CA",    contact:"cstms.berkeley.edu",       fb:"UC Berkeley Ethnic Studies",       type:"Dept",     notes:"Dr. Laura Pérez contact. LSTE adoption score 93. Dr. Ramón Saldívar adjacency (Stanford)."},
      {name:"UT Austin Mexican American + Latina/o Studies",          city:"Austin, TX",       contact:"liberalarts.utexas.edu/mals",fb:"UT Austin MALS",                  type:"Dept",     notes:"Dr. José Limón and Dr. Norma Cantú. LSTE adoption score 90."},
      {name:"San Diego State University Chicana/o Studies",           city:"San Diego, CA",   contact:"sdsu.edu",                 fb:"SDSU Chicano Studies",             type:"Dept",     notes:"Border proximity. High community connection. Reading events draw community + scholars."},
      {name:"USC American Studies + Ethnicity",                       city:"Los Angeles, CA", contact:"dornsife.usc.edu",          fb:"USC Dornsife",                     type:"Home Inst.",notes:"YOUR institution. Dr. Viet Thanh Nguyen. Highest-priority internal champion."},
    ],
    fbGroups:["Chicano Studies Scholars Network", "NACCS Members", "MEChA Alumni Network", "Ethnic Studies Faculty Network"],
    insight:"USC is the home base. Viet Thanh Nguyen's single endorsement from your own institution carries more weight than 10 external ones. This is the institutional credibility lever — use it first.",
  },
];

export default function CommunityLocationIntel() {
  const [selected, setSelected] = useState(COMMUNITY_TYPES[0].type);
  const [searchTerm, setSearchTerm] = useState("");

  const comm = COMMUNITY_TYPES.find(c => c.type === selected);
  const filtered = comm ? comm.locations.filter(l =>
    !searchTerm || [l.name, l.city, l.type, l.notes].some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <div className="text-xl font-black text-foreground font-mono mb-1">COMMUNITY LOCATION INTELLIGENCE</div>
        <div className="text-xs text-muted-foreground">Where the target community lives, organizes, and can be reached — border communities, veteran organizations, Chicano centers, academic institutions.</div>
      </div>

      <div className="flex gap-2 flex-wrap mb-2">
        {COMMUNITY_TYPES.map(c => (
          <button key={c.type} onClick={() => { setSelected(c.type); setSearchTerm(""); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono border transition-all ${
              selected === c.type ? `border-${c.color}/50 bg-${c.color}/10 text-${c.color}` : "border-border text-muted-foreground hover:text-foreground"
            }`}>
            <span>{c.icon}</span>{c.type.split("/")[0].trim()}
          </button>
        ))}
      </div>

      {comm && (
        <div className="space-y-5">
          <div className={`bg-${comm.color}/5 border border-${comm.color}/20 rounded-xl p-5`}>
            <div className={`text-[10px] font-bold font-mono text-${comm.color} mb-1`}>{comm.type.toUpperCase()}</div>
            <div className="text-sm text-foreground/80 mb-3">{comm.desc}</div>
            <div className="bg-background/60 border border-border rounded-lg p-3 text-[10px]">
              <span className={`font-bold text-${comm.color}`}>STRATEGIC INSIGHT: </span>
              <span className="text-foreground/80">{comm.insight}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search locations..."
              className="flex-1 px-3 py-1.5 text-[10px] bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50" />
            <div className="text-[9px] font-mono text-muted-foreground">{filtered.length} locations</div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-[10px]">
              <thead><tr className="border-b border-border bg-secondary/20 text-[8px] font-mono text-muted-foreground">
                <th className="text-left px-3 py-2">ORGANIZATION</th>
                <th className="text-left px-3 py-2">LOCATION</th>
                <th className="text-left px-3 py-2">TYPE</th>
                <th className="text-left px-3 py-2">CONTACT / URL</th>
                <th className="text-left px-3 py-2">FACEBOOK PAGE</th>
                <th className="text-left px-3 py-2 max-w-xs">STRATEGIC NOTES</th>
              </tr></thead>
              <tbody>
                {filtered.map((l, i) => (
                  <tr key={i} className={`border-b border-border/30 hover:bg-secondary/10 ${l.type==="Direct partner"||l.type==="Primary Partner"||l.type==="Home Inst." ? `bg-${comm.color}/5` : ""}`}>
                    <td className="px-3 py-2.5 font-bold text-foreground">{l.name}</td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{l.city}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${l.type==="Direct partner"||l.type==="Primary Partner"||l.type==="Home Inst."?`text-${comm.color} border-${comm.color}/30 bg-${comm.color}/10`:"text-muted-foreground border-border"}`}>{l.type}</span>
                    </td>
                    <td className="px-3 py-2.5 text-blue font-mono text-[9px]">{l.contact}</td>
                    <td className="px-3 py-2.5 text-purple text-[9px]">{l.fb}</td>
                    <td className="px-3 py-2.5 text-foreground/70 text-[9px] max-w-xs">{l.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`bg-card border border-${comm.color}/20 rounded-xl p-5`}>
            <div className={`text-[9px] font-bold font-mono text-${comm.color} mb-3`}>FACEBOOK GROUPS — Where This Community Organizes Online</div>
            <div className="flex flex-wrap gap-2">
              {comm.fbGroups.map((g,i) => (
                <div key={i} className={`flex items-center gap-1.5 text-[9px] font-mono border border-${comm.color}/20 bg-${comm.color}/5 text-${comm.color} px-2 py-1 rounded-lg`}>
                  <span className="text-[10px]">f</span>{g}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}