import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const STAKEHOLDERS = [
  { id:"S001", name:"Héctor Barajas-Varela",    org:"Casa de Apoyo / Veterans for Peace",          role:"Founder, Advocacy Leader",          hub:"Tijuana",    tier:"T4", category:"Deported Veteran",     twitter:"@hector_barajas", contact:"Casa de Apoyo, Playas de Tijuana, MX",         credibility:92, reach:78, authenticity:95, engagement:82, networkDensity:88, CD:88,EV:82,AD:75,RL:91,CI:87, notes:"Army veteran. Founded Casa de Apoyo serving ~400 vets across 50+ countries. Key DV-NET-001 anchor node." },
  { id:"S002", name:"Marco Chavez",              org:"Honorably Discharged, Dishonorably Deported", role:"Advocacy Symbol / Returned Veteran", hub:"San Diego",  tier:"T4", category:"Deported Veteran",     twitter:"",                contact:"Via ACLU SoCal / HDDD Coalition",              credibility:97, reach:55, authenticity:99, engagement:70, networkDensity:65, CD:95,EV:91,AD:80,RL:96,CI:93, notes:"Marine Corps, honorably discharged. Gov. Brown pardon 2017. Returned via PedEast San Ysidro." },
  { id:"S003", name:"Nathan Fletcher",           org:"HDDD Coalition",                              role:"Chair, Community Organizer",        hub:"San Diego",  tier:"T3", category:"Ally / Political",      twitter:"@nathanfletcher", contact:"HDDD Coalition, San Diego CA",                credibility:85, reach:82, authenticity:78, engagement:75, networkDensity:90, CD:40,EV:55,AD:30,RL:60,CI:45, notes:"Chair of Honorably Discharged, Dishonorably Deported Coalition. Organized Marco Chavez re-entry." },
  { id:"S004", name:"David Colker",              org:"ACLU SoCal",                                  role:"Media Contact / Communications",    hub:"Los Angeles",tier:"T3", category:"Legal / Media",         twitter:"",                contact:"dcolker@aclusocal.org · 626-755-4129",         credibility:88, reach:70, authenticity:82, engagement:55, networkDensity:72, CD:30,EV:45,AD:25,RL:40,CI:35, notes:"ACLU SoCal media contact. Primary press contact for Marco Chavez re-entry story." },
  { id:"S005", name:"Heidi Martinez",            org:"HDDD / SD Partners",                          role:"Community Liaison",                 hub:"San Diego",  tier:"T3", category:"Community Org",          twitter:"",                contact:"heidi@sdpartners.org · 760-505-8067",          credibility:80, reach:55, authenticity:88, engagement:72, networkDensity:78, CD:55,EV:62,AD:45,RL:58,CI:55, notes:"Key liaison for deported veteran re-entry coordination in San Diego / Tijuana corridor." },
  { id:"S006", name:"Casa del Migrante (TJ)",    org:"Casa del Migrante",                           role:"Shelter / Support Services",        hub:"Tijuana",    tier:"T2", category:"Border Shelter",         twitter:"@CasaMigranteTJ", contact:"casadelmigrantetijuana.org",                  credibility:85, reach:60, authenticity:90, engagement:68, networkDensity:75, CD:70,EV:75,AD:65,RL:72,CI:71, notes:"Primary migrant shelter in Tijuana. Houses some deported veterans. Critical DV-NET-001 mapping node." },
  { id:"S007", name:"ACNUR / UNHCR Tijuana",     org:"United Nations HCR",                          role:"Refugee Registration / Protection", hub:"Tijuana",    tier:"T2", category:"International Org",      twitter:"@ACNURamericas",  contact:"Via ACNUR Mexico City regional office",        credibility:90, reach:72, authenticity:85, engagement:60, networkDensity:80, CD:65,EV:80,AD:70,RL:68,CI:72, notes:"UNHCR Tijuana office tracks forced migration. Potential crossover with deported veteran population." },
  { id:"S008", name:"ImmDef",                    org:"Immigrant Defenders Law Center",              role:"Legal Advocacy",                    hub:"Los Angeles",tier:"T3", category:"Legal Advocacy",         twitter:"@ImmDef",         contact:"info@immdef.org · 213-634-0999",               credibility:92, reach:65, authenticity:88, engagement:70, networkDensity:80, CD:55,EV:68,AD:48,RL:62,CI:58, notes:"Legal representation for deported veterans. TruthEngine360 DV-NET-001 primary legal partner." },
  { id:"S009", name:"Veterans for Peace — DVP",  org:"Veterans for Peace",                          role:"Advocacy / Policy",                 hub:"National",   tier:"T3", category:"Advocacy Org",           twitter:"@VetsForPeace",   contact:"vfp@veteransforpeace.org · 314-725-6005",     credibility:88, reach:75, authenticity:90, engagement:72, networkDensity:82, CD:72,EV:78,AD:58,RL:74,CI:71, notes:"Primary national advocacy org for deported veteran issue. Policy + media amplification node." },
  { id:"S010", name:"LULAC Veterans Commission", org:"LULAC",                                       role:"National Veterans Advocacy",        hub:"National",   tier:"T2", category:"Civil Rights / Veterans", twitter:"@LULAC",          contact:"veteranscommission@lulac.org · 202-833-6130", credibility:88, reach:80, authenticity:82, engagement:65, networkDensity:85, CD:48,EV:60,AD:40,RL:55,CI:51, notes:"LULAC Veterans Commission. Congressional Hispanic Caucus connection. Policy amplification." },
];

const DV_REGISTRY = [
  { id:"DV-001", name:"Héctor Barajas-Varela",   branch:"Army",        location:"Tijuana, BC",         status:"Active Abroad",         tier:"T4", hub:"Tijuana",   year:2004, notes:"Casa de Apoyo founder. Deported twice. Still in MX by choice." },
  { id:"DV-002", name:"Marco Chavez",             branch:"Marine Corps",location:"San Diego, CA",       status:"Returned (Pardoned)",   tier:"T4", hub:"San Diego", year:2002, notes:"Honorably discharged. Gov. Brown pardon Dec 2017. PedEast crossing." },
  { id:"DV-003", name:"Erasmo Apodaca",           branch:"Army",        location:"Ciudad Juárez, CHIH", status:"Active Abroad",         tier:"T3", hub:"Juarez",    year:2015, notes:"Verified via FOIA. Vietnam-era. Record destruction risk." },
  { id:"DV-004", name:"Andrés Torres",            branch:"Navy",        location:"Nogales, SON",        status:"Active Abroad",         tier:"T3", hub:"Nogales",   year:2010, notes:"Honorably discharged. Purple Heart recipient. Shelter network documented." },
  { id:"DV-005", name:"José Medina-Cruz",         branch:"Marine Corps",location:"Tijuana, BC",         status:"Pending Pardon",        tier:"T3", hub:"Tijuana",   year:2008, notes:"In HDDD Coalition petition. Legal team ImmDef." },
  { id:"DV-006", name:"Carlos Hernandez-Rios",    branch:"Army",        location:"Ciudad Juárez, CHIH", status:"Active Abroad",         tier:"T2", hub:"Juarez",    year:2019, notes:"Recent deportation. Corroborated via advocacy org network." },
  { id:"DV-007", name:"Manuel Sánchez-Villa",     branch:"Air Force",   location:"Nogales, SON",        status:"Active Abroad",         tier:"T2", hub:"Nogales",   year:2017, notes:"Service verified via DD-214. FOIA pending for deportation order." },
  { id:"DV-008", name:"Raúl González-Peralta",    branch:"Marine Corps",location:"Tijuana, BC",         status:"Unknown",               tier:"T1", hub:"Tijuana",   year:2022, notes:"Self-reported via Casa de Apoyo intake. Documentation pending." },
  { id:"DV-009", name:"[Redacted] — Female Vet",  branch:"Army",        location:"Tijuana, BC",         status:"Active Abroad",         tier:"T3", hub:"Tijuana",   year:2014, notes:"PII protected. T3 verified via service records. Unique: female veteran in DV-NET." },
  { id:"DV-010", name:"Emigdio Gaxiola-Ruiz",     branch:"Army",        location:"Nogales, SON",        status:"Returned (Court Order)",tier:"T4", hub:"Nogales",   year:2012, notes:"Federal court-ordered return. Full service record verified. Public case." },
];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { accessToken } = await base44.asServiceRole.connectors.getConnection("googlesheets");

  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // 1. Create spreadsheet
  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      properties: { title: `JAMNet Stakeholder Directory — ${date}` },
      sheets: [
        { properties: { title: "Stakeholder Network", sheetId: 0 } },
        { properties: { title: "DV-NET Registry",     sheetId: 1 } },
      ],
    }),
  });
  const sheet = await createRes.json();
  if (!sheet.spreadsheetId) {
    return Response.json({ error: "Failed to create spreadsheet", detail: sheet }, { status: 500 });
  }
  const spreadsheetId = sheet.spreadsheetId;

  // 2. Build value arrays
  const stakeholderHeaders = ["ID","Name","Org","Role","Hub","Tier","Category","Twitter","Contact","Credibility","Reach","Authenticity","Engagement","Network Density","CD","EV","AD","RL","CI","Notes"];
  const stakeholderRows = STAKEHOLDERS.map(s => [s.id,s.name,s.org,s.role,s.hub,s.tier,s.category,s.twitter,s.contact,s.credibility,s.reach,s.authenticity,s.engagement,s.networkDensity,s.CD,s.EV,s.AD,s.RL,s.CI,s.notes]);

  const registryHeaders = ["ID","Name","Branch","Location","Status","Tier","Hub","Year Deported","Notes"];
  const registryRows = DV_REGISTRY.map(d => [d.id,d.name,d.branch,d.location,d.status,d.tier,d.hub,d.year,d.notes]);

  // 3. Write both sheets in one batchUpdate
  const batchRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      valueInputOption: "USER_ENTERED",
      data: [
        { range: "Stakeholder Network!A1", values: [stakeholderHeaders, ...stakeholderRows] },
        { range: "DV-NET Registry!A1",     values: [registryHeaders, ...registryRows] },
      ],
    }),
  });
  const batchData = await batchRes.json();
  if (batchData.error) {
    return Response.json({ error: "Failed to write data", detail: batchData.error }, { status: 500 });
  }

  // 4. Bold the header rows
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [0, 1].map(sheetId => ({
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
          cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.15, green: 0.15, blue: 0.2 } } },
          fields: "userEnteredFormat(textFormat,backgroundColor)",
        },
      })),
    }),
  });

  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  return Response.json({ url, spreadsheetId });
});