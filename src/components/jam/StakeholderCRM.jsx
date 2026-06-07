import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { FileSpreadsheet, ExternalLink, Loader2 } from "lucide-react";

const JAM_STAKEHOLDERS = [
  { id:"S001", name:"Héctor Barajas-Varela",    org:"Casa de Apoyo / Veterans for Peace",          role:"Founder, Advocacy Leader",          hub:"Tijuana",    tier:"T4", category:"Deported Veteran",     social:{twitter:"@hector_barajas",facebook:"CasaDeApoyoTJ"},        vectors:{CD:88,EV:82,AD:75,RL:91,CI:87}, reach:78, authenticity:95, engagement:82, networkDensity:88, credibility:92, contact:"Casa de Apoyo, Playas de Tijuana, MX",         notes:"Army veteran. Founded Casa de Apoyo serving ~400 vets across 50+ countries. Key DV-NET-001 anchor node." },
  { id:"S002", name:"Marco Chavez",              org:"Honorably Discharged, Dishonorably Deported", role:"Advocacy Symbol / Returned Veteran", hub:"San Diego",  tier:"T4", category:"Deported Veteran",     social:{twitter:"",facebook:""},                                    vectors:{CD:95,EV:91,AD:80,RL:96,CI:93}, reach:55, authenticity:99, engagement:70, networkDensity:65, credibility:97, contact:"Via ACLU SoCal / HDDD Coalition",              notes:"Marine Corps, honorably discharged. Deported due to criminal record. Gov. Brown pardon 2017. Returned via PedEast San Ysidro." },
  { id:"S003", name:"Nathan Fletcher",           org:"HDDD Coalition",                              role:"Chair, Community Organizer",        hub:"San Diego",  tier:"T3", category:"Ally / Political",      social:{twitter:"@nathanfletcher",facebook:"NathanFletcherSD"},     vectors:{CD:40,EV:55,AD:30,RL:60,CI:45}, reach:82, authenticity:78, engagement:75, networkDensity:90, credibility:85, contact:"HDDD Coalition, San Diego CA",                 notes:"Chair of Honorably Discharged, Dishonorably Deported Coalition. Organized Marco Chavez re-entry." },
  { id:"S004", name:"David Colker",              org:"ACLU SoCal",                                  role:"Media Contact / Communications",    hub:"Los Angeles",tier:"T3", category:"Legal / Media",         social:{twitter:"",facebook:""},                                    vectors:{CD:30,EV:45,AD:25,RL:40,CI:35}, reach:70, authenticity:82, engagement:55, networkDensity:72, credibility:88, contact:"dcolker@aclusocal.org · 626-755-4129",          notes:"ACLU SoCal media contact. Primary press contact for Marco Chavez re-entry story." },
  { id:"S005", name:"Heidi Martinez",            org:"HDDD / SD Partners",                          role:"Community Liaison",                 hub:"San Diego",  tier:"T3", category:"Community Org",          social:{twitter:"",facebook:""},                                    vectors:{CD:55,EV:62,AD:45,RL:58,CI:55}, reach:55, authenticity:88, engagement:72, networkDensity:78, credibility:80, contact:"heidi@sdpartners.org · 760-505-8067",           notes:"Key liaison for deported veteran re-entry coordination in San Diego / Tijuana corridor." },
  { id:"S006", name:"Casa del Migrante (TJ)",    org:"Casa del Migrante",                           role:"Shelter / Support Services",        hub:"Tijuana",    tier:"T2", category:"Border Shelter",         social:{twitter:"@CasaMigranteTJ",facebook:"CasaMigranteTijuana"}, vectors:{CD:70,EV:75,AD:65,RL:72,CI:71}, reach:60, authenticity:90, engagement:68, networkDensity:75, credibility:85, contact:"casadelmigrantetijuana.org",                   notes:"Primary migrant shelter in Tijuana. Houses some deported veterans. Critical DV-NET-001 mapping node." },
  { id:"S007", name:"ACNUR / UNHCR Tijuana",     org:"United Nations HCR",                          role:"Refugee Registration / Protection", hub:"Tijuana",    tier:"T2", category:"International Org",      social:{twitter:"@ACNURamericas",facebook:""},                      vectors:{CD:65,EV:80,AD:70,RL:68,CI:72}, reach:72, authenticity:85, engagement:60, networkDensity:80, credibility:90, contact:"Via ACNUR Mexico City regional office",          notes:"UNHCR Tijuana office tracks forced migration. Potential crossover with deported veteran population." },
  { id:"S008", name:"ImmDef",                    org:"Immigrant Defenders Law Center",              role:"Legal Advocacy",                    hub:"Los Angeles",tier:"T3", category:"Legal Advocacy",         social:{twitter:"@ImmDef",facebook:"ImmigrantDefenders"},           vectors:{CD:55,EV:68,AD:48,RL:62,CI:58}, reach:65, authenticity:88, engagement:70, networkDensity:80, credibility:92, contact:"info@immdef.org · 213-634-0999",                 notes:"Legal representation for deported veterans. TruthEngine360 DV-NET-001 primary legal partner." },
  { id:"S009", name:"Veterans for Peace — DVP",  org:"Veterans for Peace",                          role:"Advocacy / Policy",                 hub:"National",   tier:"T3", category:"Advocacy Org",           social:{twitter:"@VetsForPeace",facebook:"VeteransForPeace"},       vectors:{CD:72,EV:78,AD:58,RL:74,CI:71}, reach:75, authenticity:90, engagement:72, networkDensity:82, credibility:88, contact:"vfp@veteransforpeace.org · 314-725-6005",       notes:"Primary national advocacy org for deported veteran issue. Policy + media amplification node." },
  { id:"S010", name:"LULAC Veterans Commission", org:"LULAC",                                       role:"National Veterans Advocacy",        hub:"National",   tier:"T2", category:"Civil Rights / Veterans", social:{twitter:"@LULAC",facebook:"LULACnational"},                 vectors:{CD:48,EV:60,AD:40,RL:55,CI:51}, reach:80, authenticity:82, engagement:65, networkDensity:85, credibility:88, contact:"veteranscommission@lulac.org · 202-833-6130",   notes:"LULAC Veterans Commission. Congressional Hispanic Caucus connection. Policy amplification." },
];

const DV_REGISTRY = [
  { id:"DV-001", name:"Héctor Barajas-Varela",   branch:"Army",        location:"Tijuana, BC",         status:"Active Abroad",        tier:"T4", hub:"Tijuana",   year:2004, notes:"Casa de Apoyo founder. Deported twice. Still in MX by choice." },
  { id:"DV-002", name:"Marco Chavez",             branch:"Marine Corps",location:"San Diego, CA",        status:"Returned (Pardoned)",  tier:"T4", hub:"San Diego", year:2002, notes:"Honorably discharged. Gov. Brown pardon Dec 2017. PedEast crossing." },
  { id:"DV-003", name:"Erasmo Apodaca",           branch:"Army",        location:"Ciudad Juárez, CHIH", status:"Active Abroad",        tier:"T3", hub:"Juarez",    year:2015, notes:"Verified via FOIA. Vietnam-era. Record destruction risk." },
  { id:"DV-004", name:"Andrés Torres",            branch:"Navy",        location:"Nogales, SON",        status:"Active Abroad",        tier:"T3", hub:"Nogales",   year:2010, notes:"Honorably discharged. Purple Heart recipient. Shelter network documented." },
  { id:"DV-005", name:"José Medina-Cruz",         branch:"Marine Corps",location:"Tijuana, BC",         status:"Pending Pardon",       tier:"T3", hub:"Tijuana",   year:2008, notes:"In HDDD Coalition petition. Legal team ImmDef." },
  { id:"DV-006", name:"Carlos Hernandez-Rios",    branch:"Army",        location:"Ciudad Juárez, CHIH", status:"Active Abroad",        tier:"T2", hub:"Juarez",    year:2019, notes:"Recent deportation. Corroborated via advocacy org network." },
  { id:"DV-007", name:"Manuel Sánchez-Villa",     branch:"Air Force",   location:"Nogales, SON",        status:"Active Abroad",        tier:"T2", hub:"Nogales",   year:2017, notes:"Service verified via DD-214. FOIA pending for deportation order." },
  { id:"DV-008", name:"Raúl González-Peralta",    branch:"Marine Corps",location:"Tijuana, BC",         status:"Unknown",              tier:"T1", hub:"Tijuana",   year:2022, notes:"Self-reported via Casa de Apoyo intake. Documentation pending." },
  { id:"DV-009", name:"[Redacted] — Female Vet",  branch:"Army",        location:"Tijuana, BC",         status:"Active Abroad",        tier:"T3", hub:"Tijuana",   year:2014, notes:"PII protected. T3 verified via service records. Unique: female veteran in DV-NET." },
  { id:"DV-010", name:"Emigdio Gaxiola-Ruiz",     branch:"Army",        location:"Nogales, SON",        status:"Returned (Court Order)",tier:"T4", hub:"Nogales",  year:2012, notes:"Federal court-ordered return. Full service record verified. Public case." },
];

const STATUS_COLORS = {
  "Active Abroad":        "text-orange border-orange/30 bg-orange/10",
  "Returned (Pardoned)":  "text-teal border-teal/30 bg-teal/10",
  "Returned (Court Order)":"text-teal border-teal/30 bg-teal/10",
  "Pending Pardon":       "text-gold border-gold/30 bg-gold/10",
  "Unknown":              "text-muted-foreground border-border bg-secondary/30",
};

const TIER_COLORS = { T4:"text-gold", T3:"text-blue", T2:"text-teal", T1:"text-muted-foreground" };
const CAT_COLORS  = { "Deported Veteran":"teal","Ally / Political":"purple","Legal / Media":"blue","Legal Advocacy":"blue","Community Org":"orange","Border Shelter":"orange","International Org":"purple","Advocacy Org":"gold","Civil Rights / Veterans":"red" };
const HUB_OPTIONS = ["All","Tijuana","San Diego","Los Angeles","Nogales","Juarez","National"];

function VectorBar({ label, value, color = "gold" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[7px] font-mono text-muted-foreground w-4 flex-shrink-0">{label}</div>
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-${color}`} style={{ width: `${value}%` }} />
      </div>
      <div className={`text-[8px] font-black font-mono text-${color} w-5 text-right`}>{value}</div>
    </div>
  );
}

export default function StakeholderCRM() {
  const [view, setView]           = useState("stakeholders");
  const [exporting, setExporting]  = useState(false);
  const [sheetUrl, setSheetUrl]    = useState(null);

  const handleExport = async () => {
    setExporting(true);
    setSheetUrl(null);
    const res = await base44.functions.invoke("exportStakeholdersToSheets", {});
    if (res.data?.url) setSheetUrl(res.data.url);
    setExporting(false);
  };
  const [hubFilter, setHubFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);

  const cats = ["All", ...Array.from(new Set(JAM_STAKEHOLDERS.map(s => s.category)))];

  const filtered = JAM_STAKEHOLDERS.filter(s => {
    const matchHub    = hubFilter === "All" || s.hub === hubFilter;
    const matchCat    = catFilter === "All" || s.category === catFilter;
    const matchSearch = !search || [s.name, s.org, s.role, s.notes].some(f => f.toLowerCase().includes(search.toLowerCase()));
    return matchHub && matchCat && matchSearch;
  });

  const record    = JAM_STAKEHOLDERS.find(s => s.id === selected);
  const t4Count   = JAM_STAKEHOLDERS.filter(s => s.tier === "T4").length;
  const avgCred   = Math.round(JAM_STAKEHOLDERS.reduce((a, s) => a + s.credibility, 0) / JAM_STAKEHOLDERS.length);

  return (
    <div className="space-y-4 animate-slide-up">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-lg font-black font-mono text-foreground mb-0.5">STAKEHOLDER CRM — DV-NET-001</div>
          <div className="text-[9px] text-muted-foreground font-mono">Vectors: CD=Community Density · EV=Emotional Valence · AD=Activation Depth · RL=Relational Leverage · CI=Cultural Intelligence</div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-[9px] font-mono text-gold bg-gold/10 border border-gold/20 px-2 py-1 rounded-full">{t4Count} T4 Assets</div>
          <div className="text-[9px] font-mono text-teal bg-teal/10 border border-teal/20 px-2 py-1 rounded-full">Avg Cred {avgCred}</div>
          <div className="text-[9px] font-mono text-blue bg-blue/10 border border-blue/20 px-2 py-1 rounded-full">{DV_REGISTRY.length} Registry Cases</div>
          {sheetUrl ? (
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal/10 border border-teal/40 text-teal rounded-lg text-[10px] font-bold font-mono hover:bg-teal/20 transition-all">
              <ExternalLink className="w-3 h-3" />Open Sheet
            </a>
          ) : (
            <button onClick={handleExport} disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-900/30 border border-green-500/40 text-green-400 rounded-lg text-[10px] font-bold font-mono hover:bg-green-900/50 transition-all disabled:opacity-60">
              {exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileSpreadsheet className="w-3 h-3" />}
              {exporting ? "Exporting..." : "Export to Sheets"}
            </button>
          )}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 border-b border-border pb-2">
        {[{id:"stakeholders",label:"Stakeholder Network"},{id:"registry",label:"DV-NET Registry"}].map(v => (
          <button key={v.id} onClick={() => { setView(v.id); setSelected(null); }}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-mono transition-all ${
              view === v.id ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
            }`}>{v.label}</button>
        ))}
      </div>

      {/* ── STAKEHOLDERS VIEW ── */}
      {view === "stakeholders" && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap items-center">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="px-3 py-1.5 text-[10px] bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50 w-36 font-mono" />
            <div className="flex gap-1 flex-wrap">
              {HUB_OPTIONS.map(h => (
                <button key={h} onClick={() => setHubFilter(h)}
                  className={`px-2 py-1 rounded text-[8px] font-bold font-mono border transition-all ${
                    hubFilter === h ? "bg-orange/20 text-orange border-orange/40" : "border-border text-muted-foreground hover:text-foreground"
                  }`}>{h}</button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {cats.map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-2 py-1 rounded text-[8px] font-bold font-mono border transition-all ${
                    catFilter === c ? "bg-teal/20 text-teal border-teal/40" : "border-border text-muted-foreground hover:text-foreground"
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                    <th className="text-left px-3 py-2">NAME</th>
                    <th className="text-left px-3 py-2 hidden md:table-cell">ORG</th>
                    <th className="text-left px-3 py-2">HUB</th>
                    <th className="text-left px-3 py-2">CATEGORY</th>
                    <th className="text-center px-2 py-2">TIER</th>
                    <th className="text-center px-2 py-2">CRED</th>
                    <th className="text-center px-2 py-2">REACH</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const cc = CAT_COLORS[s.category] || "blue";
                    return (
                      <tr key={s.id} onClick={() => setSelected(selected === s.id ? null : s.id)}
                        className={`border-b border-border/30 hover:bg-secondary/10 cursor-pointer transition-colors ${selected === s.id ? "bg-gold/5" : ""}`}>
                        <td className="px-3 py-2.5 font-bold text-gold whitespace-nowrap">{s.name}</td>
                        <td className="px-3 py-2.5 text-foreground/60 text-[8px] hidden md:table-cell">{s.org}</td>
                        <td className="px-3 py-2.5 font-mono text-[8px] text-muted-foreground whitespace-nowrap">{s.hub}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border text-${cc} border-${cc}/30 bg-${cc}/5`}>{s.category}</span>
                        </td>
                        <td className={`px-2 py-2.5 text-center font-black font-mono ${TIER_COLORS[s.tier]}`}>{s.tier}</td>
                        <td className={`px-2 py-2.5 text-center font-black font-mono ${s.credibility >= 90 ? "text-gold" : s.credibility >= 80 ? "text-teal" : "text-muted-foreground"}`}>{s.credibility}</td>
                        <td className={`px-2 py-2.5 text-center font-mono ${s.reach >= 75 ? "text-blue" : "text-muted-foreground"}`}>{s.reach}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              {record ? (
                <div className="bg-card border border-gold/30 rounded-xl p-5 space-y-4 sticky top-24">
                  <div>
                    <div className="text-[8px] font-mono text-muted-foreground mb-0.5">{record.id} · {record.tier} · {record.hub}</div>
                    <div className="text-sm font-black text-gold">{record.name}</div>
                    <div className="text-[10px] text-foreground/70 mt-0.5">{record.role}</div>
                    <div className="text-[9px] text-muted-foreground">{record.org}</div>
                  </div>

                  <div className="bg-background border border-border rounded-lg p-3 space-y-1.5">
                    <div className="text-[7px] font-bold font-mono text-muted-foreground mb-2">BEHAVIORAL VECTORS</div>
                    <VectorBar label="CD" value={record.vectors.CD} color="gold" />
                    <VectorBar label="EV" value={record.vectors.EV} color="teal" />
                    <VectorBar label="AD" value={record.vectors.AD} color="blue" />
                    <VectorBar label="RL" value={record.vectors.RL} color="purple" />
                    <VectorBar label="CI" value={record.vectors.CI} color="orange" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {label:"Authenticity", val:record.authenticity,  color:"text-gold"},
                      {label:"Credibility",  val:record.credibility,   color:"text-teal"},
                      {label:"Engagement",   val:record.engagement,    color:"text-blue"},
                      {label:"Network",      val:record.networkDensity,color:"text-purple"},
                    ].map(m => (
                      <div key={m.label} className="bg-secondary/20 rounded-lg p-2 text-center">
                        <div className={`text-lg font-black font-mono ${m.color}`}>{m.val}</div>
                        <div className="text-[7px] text-muted-foreground font-mono">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {(record.social.twitter || record.social.facebook) && (
                    <div className="space-y-1">
                      <div className="text-[7px] font-mono text-muted-foreground">SOCIAL</div>
                      {record.social.twitter  && <div className="text-[9px] font-mono text-blue">{record.social.twitter}</div>}
                      {record.social.facebook && <div className="text-[9px] font-mono text-blue">fb/{record.social.facebook}</div>}
                    </div>
                  )}

                  <div className="text-[9px] font-mono text-teal">{record.contact}</div>

                  <div className="bg-gold/5 border border-gold/20 rounded-lg p-3">
                    <div className="text-[8px] font-mono text-muted-foreground mb-0.5">NOTES</div>
                    <div className="text-[9px] text-foreground/80">{record.notes}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-dashed border-border rounded-xl p-8 flex items-center justify-center text-muted-foreground text-[10px] font-mono h-64">
                  Click a stakeholder to view vectors + details
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── REGISTRY VIEW ── */}
      {view === "registry" && (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3">
            {["Tijuana","San Diego","Juarez","Nogales"].map(hub => {
              const count = DV_REGISTRY.filter(d => d.hub === hub).length;
              return (
                <div key={hub} className="bg-card border border-border rounded-xl p-3 text-center">
                  <div className="text-2xl font-black font-mono text-orange">{count}</div>
                  <div className="text-[9px] font-bold text-foreground mt-0.5">{hub}</div>
                  <div className="text-[8px] text-muted-foreground">documented cases</div>
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-secondary/20">
              <div className="text-[10px] font-bold font-mono">DV-NET-001 REGISTRY — {DV_REGISTRY.length} documented cases</div>
            </div>
            <table className="w-full text-[9px]">
              <thead>
                <tr className="border-b border-border bg-secondary/10 text-[7px] font-mono text-muted-foreground">
                  <th className="text-left px-4 py-2">ID</th>
                  <th className="text-left px-4 py-2">NAME</th>
                  <th className="text-left px-4 py-2">BRANCH</th>
                  <th className="text-left px-4 py-2">LOCATION</th>
                  <th className="text-left px-4 py-2">STATUS</th>
                  <th className="text-center px-3 py-2">TIER</th>
                  <th className="text-center px-3 py-2">YEAR</th>
                  <th className="text-left px-4 py-2">NOTES</th>
                </tr>
              </thead>
              <tbody>
                {DV_REGISTRY.map((d, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className="px-4 py-2.5 font-mono text-muted-foreground text-[8px]">{d.id}</td>
                    <td className="px-4 py-2.5 font-bold text-gold whitespace-nowrap">{d.name}</td>
                    <td className="px-4 py-2.5 text-foreground/80 whitespace-nowrap">{d.branch}</td>
                    <td className="px-4 py-2.5 text-foreground/70 whitespace-nowrap">{d.location}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[7px] font-bold font-mono px-1.5 py-0.5 rounded border ${STATUS_COLORS[d.status] || "text-muted-foreground border-border"}`}>{d.status}</span>
                    </td>
                    <td className={`px-3 py-2.5 text-center font-black font-mono ${TIER_COLORS[d.tier]}`}>{d.tier}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">{d.year}</td>
                    <td className="px-4 py-2.5 text-foreground/60 text-[8px] max-w-xs">{d.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}