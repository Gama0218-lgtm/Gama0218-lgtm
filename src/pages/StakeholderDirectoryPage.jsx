import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Users, Building2, GraduationCap, Heart, Shield, Film, Radio, Star, Wrench, BookOpen } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const AGENTS = [
  { n:1,  name:"Ayesha Pande",    agency:"Ayesha Pande Literary",         site:"pandeliterary.com",         email:"queries@pandeliterary.com",                          phone:"212-283-5825", fit:95, status:"CHECK PORTAL",      priority:"P0", notes:"BIPOC voices, literary fiction, memoir. Anti-racist mission. Ayesha CLOSED — check Annie Hwang/Serene Hakim." },
  { n:2,  name:"Annie Hwang",     agency:"Ayesha Pande Literary",         site:"pandeliterary.com",         email:"Via pandeliterary.com/queries-pandeliterary",         phone:"212-283-5825", fit:92, status:"CONFIRM OPEN",      priority:"P0", notes:"'Literary fiction with teeth.' Multicultural, underrepresented voices. Multilingual experience." },
  { n:3,  name:"Victoria Sanders",agency:"Victoria Sanders & Associates", site:"victoriasanders.com",       email:"vsassoc@aol.com (verify)",                           phone:"212-633-8811", fit:90, status:"CLOSED — MONITOR",  priority:"P1", notes:"Multi-cultural roster, diverse voices, Zora Neale Hurston Trust. Currently closed to unsolicited." },
  { n:4,  name:"Joanna Pulcini",  agency:"Joanna Pulcini Literary Mgmt",  site:"joannaliterary.com",        email:"Via website contact form",                           phone:"N/A",          fit:88, status:"QUERY",             priority:"P1", notes:"Prestige literary fiction. Strong Knopf/FSG relationships. High-end literary market positioning." },
  { n:5,  name:"Erin Harris",     agency:"Folio Literary Management",     site:"foliolit.com",              email:"eharris@foliolit.com",                               phone:"212-400-1494", fit:87, status:"QUERY",             priority:"P1", notes:"Historical fiction / war literature. Marlantes-adjacent war lit positioning." },
  { n:6,  name:"Jim Rutman",      agency:"Sterling Lord Literistic",      site:"sll.com",                   email:"jrutman@sll.com",                                    phone:"212-780-6050", fit:85, status:"RESEARCH",           priority:"P2", notes:"Deep Norton/FSG/PRH relationships. Literary fiction specialist." },
  { n:7,  name:"Jin Auh",         agency:"The Wylie Agency",              site:"wylieagency.com",           email:"jauh@wylieagency.com",                               phone:"212-246-0069", fit:82, status:"RESEARCH",           priority:"P2", notes:"Prestige literary. Nobel/Booker-tier relationships. Approach via introduction only." },
];

const PUBLISHERS = [
  { n:1,  publisher:"Farrar, Straus & Giroux",  imprint:"FSG — Macmillan",    site:"us.macmillan.com/fsg",       phone:"212-741-6900", contact:"Mitzi Angel (Publisher); Ileene Smith (Editorial Dir)",                       fit:92, approach:"Via Tier 1 agent ONLY — no unsolicited. Most Nobel winners of any US publisher." },
  { n:2,  publisher:"W.W. Norton",              imprint:"W.W. Norton & Co",   site:"wwnorton.com",               phone:"212-354-5500", contact:"Alane Mason (Editorial Dir, literary fiction + nonfiction)",                   fit:89, approach:"Strong literary + academic crossover. War literature + ethnic studies. Agent preferred." },
  { n:3,  publisher:"Alfred A. Knopf",          imprint:"Knopf — PRH",        site:"knopfdoubleday.com",         phone:"212-751-2600", contact:"Sierra Fang-Horvath (marginalized voices); Brian Etling (inventive lit fiction)", fit:95, approach:"Via agent ONLY. Nobel + Pulitzer publisher. sierrafang-horvath@penguinrandomhouse.com (verify)." },
  { n:4,  publisher:"Riverhead Books",          imprint:"Riverhead — PRH",    site:"riverheadbooks.com",         phone:"212-366-2000", contact:"Laura Perciasepe (VP Editor); Courtney Young (Editor)",                       fit:90, approach:"Multicultural prestige literary fiction. Published Percival Everett (Pulitzer 2025). Via agent." },
  { n:5,  publisher:"Algonquin Books",          imprint:"Algonquin",          site:"algonquin.com",              phone:"919-967-0108", contact:"Chuck Adams; Kathy Pories",                                                    fit:85, approach:"Multicultural literary fiction specialist. Some direct submissions possible for nonfiction." },
  { n:6,  publisher:"Arte Público Press",       imprint:"Univ. of Houston",   site:"artepublicopress.com",       phone:"713-743-2841", contact:"Nicolás Kanellos (Founder/Director)",                                          fit:94, approach:"Chicano canon anchor. Direct inquiry OK. Academic distribution. Unassailable positioning." },
  { n:7,  publisher:"Graywolf Press",           imprint:"Graywolf",           site:"graywolfpress.org",          phone:"651-641-0077", contact:"Fiona McCrae (Publisher); Katie Dublinski (Editorial Dir)",                    fit:82, approach:"Independent literary. Strong diverse voices. Open to agented submissions." },
  { n:8,  publisher:"Restless Books",           imprint:"Restless Books",     site:"restlessbooks.org",          phone:"N/A",          contact:"Ilan Stavans (Publisher)",                                                     fit:80, approach:"Diaspora lit specialist. Editorial cultural alignment. Direct submission sometimes open." },
];

const ACADEMIC = [
  { n:1,  name:"Dr. José Limón",               title:"Professor Emeritus, Director",      inst:"UT Austin",      dept:"Mexican American & Latina/o Studies",         email:"Via MALS dept: liberalarts.utexas.edu/mals", site:"liberalarts.utexas.edu/mals",   fit:93, priority:"P0", notes:"Leading scholar of Chicano lit/culture. Author of 'American Encounters.' Primary academic target." },
  { n:2,  name:"Dr. Norma Cantú",              title:"Professor",                         inst:"UT Austin/UTSA", dept:"Chicana/o Studies, Creative Writing",          email:"ncant@trinity.edu (verify current inst.)",   site:"liberalarts.utexas.edu",        fit:90, priority:"P0", notes:"Author of 'Canícula.' Fiction + autobiography + cultural theory. Bridge between literary + academic." },
  { n:3,  name:"Dr. Laura E. Pérez",           title:"Professor",                         inst:"UC Berkeley",    dept:"Chicana/o Studies",                            email:"lauraep@berkeley.edu (verify)",              site:"chicanostudies.berkeley.edu",   fit:91, priority:"P0", notes:"Chicana/o visual + literary culture. Berkeley course adoption pipeline. LSTE adoption score 93." },
  { n:4,  name:"Dr. Viet Thanh Nguyen",        title:"Aerol Arnold Professor",            inst:"USC",            dept:"English + American Studies",                  email:"viet.nguyen@usc.edu",                        site:"dornsife.usc.edu",              fit:95, priority:"P0 — PRIORITY RELATIONSHIP", notes:"Author of 'The Sympathizer' (Pulitzer 2016). Direct comp. YOUR institution. Blurb + endorsement potential." },
  { n:5,  name:"Dr. Maggie Rivas-Rodriguez",   title:"Professor + Director",              inst:"UT Austin",      dept:"Journalism; Voces Oral History Center",       email:"mrivas@austin.utexas.edu",                   site:"voces.utexas.edu",              fit:88, priority:"P1", notes:"Latino veteran oral history archive. Scholarly + media platform access. Conference presenter." },
  { n:6,  name:"Prof. Matt Barreto",           title:"Professor + Co-Director",           inst:"UCLA",           dept:"Chicana/o Studies + Latino Policy",            email:"mbarreto@ucla.edu",                          site:"chicano.ucla.edu",              fit:85, priority:"P1", notes:"BISG methodology. Polling + demographic research. Direct data validation partner." },
  { n:7,  name:"Prof. Ramón Saldívar",         title:"Hoagland Family Professor",         inst:"Stanford",       dept:"English + Comparative Literature",             email:"rsaldivar@stanford.edu",                     site:"english.stanford.edu",          fit:89, priority:"P1", notes:"Chicano narrative theory. Author of 'Chicano Narrative.' Stanford + Berkeley adjacency." },
  { n:8,  name:"Prof. Marco Durazo",           title:"Faculty",                           inst:"USF",            dept:"Sociology",                                    email:"m.durazo@usfca.edu",                         site:"USF Faculty Directory",         fit:84, priority:"P1", notes:"Institutional partner for NEH application. Sociology + immigration studies." },
  { n:9,  name:"Dr. Deena J. González",        title:"Professor",                         inst:"Loyola Marymount",dept:"Chicana/o Studies",                           email:"Via LMU dept",                               site:"lmu.edu",                       fit:80, priority:"P2", notes:"Chair-level relationship. LMU Chicano Studies course adoption pipeline." },
  { n:10, name:"Prof. Frederick Luis Aldama", title:"Distinguished Humanities Chair",    inst:"Trinity University",dept:"English; LatinxPop",                        email:"faldama@trinity.edu",                        site:"latinxpop.com",                 fit:82, priority:"P2", notes:"'Your Brain on Latino Comics.' Cross-platform Chicano cultural scholar. Strong public platform." },
];

const MILITARY = [
  { n:1,  org:"American Latino Veterans Association (ALVA)", type:"Veterans Organization",      site:"alvavets.org",         email:"info@alvavets.org",                phone:"N/A",          priority:"P0", relevance:"PRIMARY PARTNER — 349-record anomaly petition. Direct mission alignment. StrComm Phase 1 coalition partner." },
  { n:2,  org:"Veterans for Peace — Deported Veterans Project", type:"Advocacy",              site:"veteransforpeace.org", email:"vfp@veteransforpeace.org",          phone:"314-725-6005", priority:"P0", relevance:"Deported veterans advocacy. Direct thematic alignment with manuscript immigration-service nexus." },
  { n:3,  org:"ImmDef (Immigrant Defenders Law Center)",      type:"Legal Advocacy",            site:"immdef.org",           email:"info@immdef.org",                  phone:"213-634-0999", priority:"P0", relevance:"Legal representation for deported veterans. TruthEngine360 DV-NET-001 case file connection." },
  { n:4,  org:"LULAC — Veterans Commission",                  type:"Veterans / Civil Rights",   site:"lulac.org",            email:"veteranscommission@lulac.org",     phone:"202-833-6130", priority:"P1", relevance:"League of United Latin American Citizens. Veterans commission = advocacy + media platform." },
  { n:5,  org:"Bob Woodruff Foundation",                       type:"Veterans Foundation",       site:"bobwoodrufffoundation.org",email:"Via site",                    phone:"N/A",          priority:"P1", relevance:"Grants $75K–$250K. Veterans-focused philanthropy. EIN on record. Co-applicant possibility." },
  { n:6,  org:"Paralyzed Veterans of America",                 type:"Veterans Foundation",       site:"pva.org/grants",       email:"Via site",                         phone:"N/A",          priority:"P1", relevance:"Research grants $50K–$200K. EIN 13-1946868. Veteran recognition and outreach." },
  { n:7,  org:"Repatriate Our Patriots",                       type:"Veterans Advocacy",         site:"repatriateourpatriots.org",email:"contact@repatriateourpatriots.org",phone:"N/A",      priority:"P1", relevance:"Co-applicant strategic partner. EIN 83-3991480. Deported veteran legislative advocacy." },
  { n:8,  org:"Veterans For Peace",                            type:"Fiscal Sponsor",            site:"veteransforpeace.org", email:"vfp@veteransforpeace.org",          phone:"314-725-6005", priority:"P1", relevance:"Fiscal sponsor pathway. Broad veteran peace network." },
  { n:9,  org:"Vietnam Veterans of America",                   type:"Veterans Organization",     site:"vva.org",              email:"Via vva.org/contact",              phone:"N/A",          priority:"P2", relevance:"Chapter programs. Endorsement + media platform. 349-record story distribution." },
  { n:10, org:"Deported Veterans Support House (DVSH)",        type:"Direct Service / Partner",  site:"N/A",                  email:"deported.veterans@gmail.com",      phone:"N/A",          priority:"P0", relevance:"Hector Barajas / Tijuana. THE primary deported veteran community channel. First relationship." },
  { n:11, org:"Al Otro Lado",                                  type:"Legal Aid",                 site:"alotrolado.org",       email:"Via site",                         phone:"N/A",          priority:"P1", relevance:"San Diego/Tijuana immigration legal services. Many clients have veteran family members." },
  { n:12, org:"Military Times",                                type:"Military Media",             site:"militarytimes.com",    email:"editor@militarytimes.com",         phone:"N/A",          priority:"P0", relevance:"Valor Review 2014: 17 of 24 delayed honors were Hispanic. Institutional record = news." },
];

const GRANTS = [
  { n:1,  grant:"USLDH Grants-in-Aid",                 foundation:"Mellon / Arte Público Press — UH",site:"artepublicopress.com/recovery-program/grantsinaid",email:"recovery@uh.edu",              amount:"Up to $7,500",    deadline:"ROLLING — APPLY NOW", eligibility:"Digital scholarship, US Latino humanities", applyAs:"AUMER Foundation (TruthEngine360)", priority:"P0 — APPLY NOW" },
  { n:2,  grant:"NEH Fellowships",                     foundation:"Nat'l Endowment for the Humanities",site:"neh.gov/grants/research/fellowships",           email:"neh.gov (Grants.gov)",          amount:"$60,000",         deadline:"Check NEH.gov 2026 NOFO", eligibility:"American history/culture; doctoral candidates", applyAs:"Gabriel as doctoral candidate", priority:"P0" },
  { n:3,  grant:"NEH Hispanic-Serving Institutions",   foundation:"NEH",                              site:"neh.gov/grants/research/awards-faculty-hispanic-serving-institutions",email:"neh.gov (Grants.gov)", amount:"$15K–$50K+",   deadline:"Annual — check 2026 NOFO", eligibility:"USC is HSI; doctoral candidates affiliated", applyAs:"AUMER Foundation + Gabriel as USC doctoral candidate", priority:"P0" },
  { n:4,  grant:"$50M Literary Arts Fund",             foundation:"Mellon + Ford + MacArthur + Lannan",site:"mellon.org",                                    email:"mellon.org/contact",            amount:"Various",         deadline:"Check Mellon.org for cycle", eligibility:"Literary arts orgs + writers", applyAs:"AUMER Foundation (nonprofit publisher entity)", priority:"P0 — AUMER ENTITY" },
  { n:5,  grant:"Ford Foundation — Creativity",        foundation:"Ford Foundation",                   site:"fordfoundation.org",                            email:"ford.connect2giving.org",       amount:"$100K–$500K",     deadline:"Rolling LOI",             eligibility:"Racial Justice + Creativity + Free Expression", applyAs:"AUMER Foundation", priority:"P0" },
  { n:6,  grant:"Mellon Foundation — Higher Learning", foundation:"Mellon Foundation",                 site:"mellon.org",                                    email:"mellon.org/inquiries",          amount:"$75K–$300K",      deadline:"Rolling inquiry",          eligibility:"Digital humanities; higher learning programs", applyAs:"AUMER Foundation", priority:"P0" },
  { n:7,  grant:"Open Society Foundations",            foundation:"Open Society Foundations",          site:"opensocietyfoundations.org",                    email:"opensocietyfoundations.org/grants",amount:"$50K–$250K",   deadline:"Rolling",                  eligibility:"Migration + Racial Justice programs", applyAs:"AUMER Foundation", priority:"P1" },
  { n:8,  grant:"Soros Justice Media Fellowship",      foundation:"Open Society Foundations",          site:"opensocietyfoundations.org/grants",             email:"info@sorosjustice.org",         amount:"$100K–$145K",     deadline:"Oct 2026",                 eligibility:"Individual fellow track", applyAs:"Gabriel (individual)", priority:"P1" },
  { n:9,  grant:"Guggenheim Fellowship",               foundation:"John Simon Guggenheim Mem. Found.",  site:"gf.org",                                        email:"gf.org/applicants",             amount:"$55K–$65K",       deadline:"Sept 2026",                eligibility:"Prior achievement track", applyAs:"Gabriel (individual)", priority:"P1" },
  { n:10, grant:"Lannan Foundation Literary Fellowship",foundation:"Lannan Foundation",                site:"lannan.org",                                    email:"lannan.org/fellowships",        amount:"$200,000",        deadline:"Check site",               eligibility:"Literary fellowship — unrestricted", applyAs:"Gabriel (individual)", priority:"P1" },
  { n:11, grant:"MacArthur Fellowship (Genius Grant)",  foundation:"MacArthur Foundation",             site:"macfound.org",                                  email:"macfound.org",                  amount:"$800K unrestricted",deadline:"Nomination only",          eligibility:"Long cultivation required — 3-5 years", applyAs:"Nomination (cultivation target)", priority:"P3" },
  { n:12, grant:"Kirkus Prize — Fiction",              foundation:"Kirkus Reviews",                    site:"kirkusreviews.com/prize",                       email:"kirkusreviews.com",             amount:"$50,000 award",   deadline:"Open on publication",      eligibility:"Any published fiction title", applyAs:"Submit on publication", priority:"P1" },
  { n:13, grant:"PEN America — Open Book Award",       foundation:"PEN America",                       site:"pen.org/awards",                                email:"pen@pen.org",                   amount:"$5K–$25K",        deadline:"Annual",                   eligibility:"Debut from underrepresented writer", applyAs:"Submit post-publication", priority:"P1" },
  { n:14, grant:"National Book Foundation — NBA",      foundation:"National Book Foundation",          site:"nationalbook.org/submit",                       email:"nationalbook.org",              amount:"Award submission", deadline:"Submit on pub",            eligibility:"Fiction track", applyAs:"Submit on publication (EIN 13-3347524)", priority:"P1" },
  { n:15, grant:"California Arts Council",             foundation:"California Arts Council",           site:"arts.ca.gov/grants",                            email:"arts.ca.gov",                   amount:"$25K–$100K",      deadline:"Mar 2027",                 eligibility:"California resident artist", applyAs:"Gabriel (individual — CA resident)", priority:"P1" },
  { n:16, grant:"Sundance Institute",                  foundation:"Sundance Institute",                site:"sundance.org/programs",                         email:"sundance.org",                  amount:"$10K–$25K",       deadline:"Rolling",                  eligibility:"Film/TV adaptation development", applyAs:"AUMER Foundation + adaptation treatment", priority:"P2" },
];

const CHICANO_ORGS = [
  { n:1,  org:"NACCS (Natl Assn for Chicana/Chicano Studies)", type:"Academic Society",     site:"naccs.org",               contact:"naccs@naccs.org",         phone:"N/A",          priority:"P0", role:"PRIMARY scholarly society. Conference presentations = canon legitimacy. Annual conference." },
  { n:2,  org:"Macondo Writers' Workshop",                     type:"Literary Community",   site:"macondoworkshop.org",      contact:"info@macondoworkshop.org",phone:"N/A",          priority:"P0", role:"Sandra Cisneros-founded. Chicano literary community gateway. Direct Cisneros connection." },
  { n:3,  org:"REFORMA — ALA Latino Librarians",               type:"Library Advocacy",     site:"reforma.org",              contact:"info@reforma.org",        phone:"N/A",          priority:"P0", role:"Library adoption = shelf visibility + course adoption pipeline. 35K+ librarians reached." },
  { n:4,  org:"PEN America — Latino Writers",                  type:"Awards + Advocacy",    site:"pen.org",                  contact:"pen@pen.org",             phone:"212-334-1660", priority:"P1", role:"Award eligibility (PEN/Faulkner) + Latino writers network. Advocacy = press coverage." },
  { n:5,  org:"NALIP (Latino Independent Producers)",          type:"Film/TV Pipeline",     site:"nalip.org",                contact:"nalip.org/contact",       phone:"N/A",          priority:"P1", role:"Film/TV adaptation pipeline. Latino media professionals network." },
  { n:6,  org:"MELUS (Multiethnic Literature US)",             type:"Academic Journal",     site:"melus.org",                contact:"melus.org",               phone:"N/A",          priority:"P1", role:"Academic credibility signal. Journal submission + course adoption pipeline." },
  { n:7,  org:"Recovering US Hispanic Literary Heritage",      type:"Archive + Canon",      site:"artepublicopress.com",     contact:"artepublicopress.com",    phone:"N/A",          priority:"P2", role:"Archive and canon placement. Scholarly citation network." },
  { n:8,  org:"LULAC — Veterans Commission",                   type:"Civil Rights",         site:"lulac.org",                contact:"veteranscommission@lulac.org",phone:"202-833-6130",priority:"P1", role:"Veterans commission = advocacy + media platform. 349 campaign partner." },
  { n:9,  org:"MEChA (Movimiento Estudiantil Chicano)",        type:"Student Organization", site:"nacionmecha.com",          contact:"Via chapter websites",    phone:"N/A",          priority:"P2", role:"Student org network at every CSU/UC. Reading events. Organic community activation." },
  { n:10, org:"Macondo Foundation (arts wing)",                type:"Arts + Culture",       site:"macondoworkshop.org",      contact:"Via Macondo Workshop",    phone:"N/A",          priority:"P2", role:"Cultural arts funding + community programming. Cisneros adjacency." },
];

const ENTERTAINMENT = [
  { n:1,  company:"Netflix",                         contact:"Francisco Ramos",          title:"VP Latin American Content",   email:"Press: press@netflix.com; IP via prod co",    site:"ir.netflix.net",        priority:"P0", pitch:"45-chapter arc = 2-season structure. Gentefied/Selena comp. Military + cultural identity. No competing property." },
  { n:2,  company:"Netflix Literary IP",             contact:"Via production co partner",title:"Content Acquisition",         email:"Via literary agent or established prod co",   site:"netflix.com",           priority:"P1", pitch:"Package with LSTE 82.2 data as proof of commercial viability. No existing Chicano Vietnam combat prestige drama." },
  { n:3,  company:"HBO / Max — Latin America",       contact:"Cesar (Content Exec)",     title:"VP Content Latin America",    email:"Via Warner Bros. Discovery: wbd.com",         site:"max.com",               priority:"P0", pitch:"Military drama + cultural identity + historical correction = HBO prestige formula. 2026 slate building now." },
  { n:4,  company:"Amazon Studios — Latino Content", contact:"Via literary agent/prod co",title:"Head of Content",            email:"Via agent or production company",             site:"amazon.com/primevideo", priority:"P1", pitch:"Prestige limited series: 8-10 episodes covering Acts I-III. Historical + contemporary relevance." },
  { n:5,  company:"Salma Hayek / Ventanarosa",       contact:"Via literary agent",        title:"Production Company",          email:"Via agent",                                   site:"N/A",                   priority:"P1", pitch:"Package with LSTE data. Latina-owned production. No existing Chicano Vietnam combat prestige drama." },
  { n:6,  company:"Sundance Institute",              contact:"Film Program",              title:"Narrative Feature Film Lab",  email:"sundance.org/programs",                       site:"sundance.org",          priority:"P1", pitch:"Literary adaptation + deported veterans civic dimension. Development grant ($10K–$25K)." },
  { n:7,  company:"NALIP (Prod. Pipeline)",          contact:"Program Director",          title:"Latino Producers Network",    email:"nalip.org/contact",                           site:"nalip.org",             priority:"P2", pitch:"Film/TV pipeline for Latino literary IP. Network access to Latino producers and streaming partners." },
  { n:8,  company:"PBS / American Experience",       contact:"Series Producer",           title:"Documentary Division",        email:"pbs.org/about",                               site:"pbs.org/americanexperience", priority:"P2", pitch:"DCAS forensic story = documentary-grade investigative narrative. PBS = prestige + military audience." },
];

const MEDIA = [
  { n:1,  outlet:"The War Horse",        type:"Military Journalism",    site:"thewarhorse.org",             email:"tips@thewarhorse.org",       phone:"N/A",          timing:"Phase 1 (pre-launch)", priority:"P0", pitch:"349-record anomaly as institutional data failure. DCAS forensic audit = investigative story." },
  { n:2,  outlet:"Task & Purpose",       type:"Military Digital",       site:"taskandpurpose.com",          email:"tips@taskandpurpose.com",    phone:"N/A",          timing:"Phase 1",              priority:"P0", pitch:"'The Algorithm That Erased Chicano Veterans.' Data-driven story + human faces." },
  { n:3,  outlet:"Military Times",       type:"Military Print/Digital", site:"militarytimes.com",           email:"editor@militarytimes.com",   phone:"N/A",          timing:"Phase 1",              priority:"P0", pitch:"Valor Review 2014: 17 of 24 delayed honors were Hispanic. Institutional record = news." },
  { n:4,  outlet:"NPR Code Switch",      type:"Culture + Race",         site:"npr.org/podcasts/510312",     email:"codeswitch@npr.org",         phone:"N/A",          timing:"Phase 2",              priority:"P0", pitch:"Bilingual code-switching as market strategy + cultural authenticity in literature." },
  { n:5,  outlet:"KPBS (San Diego PBS)", type:"Regional Public Media",  site:"kpbs.org",                   email:"kpbs.org/contact",           phone:"N/A",          timing:"Phase 1",              priority:"P0", pitch:"Local veteran story + DCAS data = regional news hook. San Diego military community." },
  { n:6,  outlet:"Latina Media (mitu)",  type:"Latino Digital",         site:"wearemitu.com",               email:"editorial@wearemitu.com",    phone:"N/A",          timing:"Phase 2",              priority:"P1", pitch:"Chicano veteran identity story. Native digital Latino platform. 5M+ reach." },
  { n:7,  outlet:"Poets & Writers",      type:"Literary Trade",         site:"pw.org",                      email:"pw.org/contact",             phone:"N/A",          timing:"Phase 2",              priority:"P1", pitch:"Author platform + LSTE methodology as new standard for literary analytics." },
  { n:8,  outlet:"LA Times Books",       type:"Major Press",            site:"latimes.com",                 email:"books@latimes.com",          phone:"N/A",          timing:"Phase 3",              priority:"P1", pitch:"Chicano Vietnam story + deported veterans = LA Times metro + books crossover." },
  { n:9,  outlet:"Univision / Noticias", type:"Spanish-Language TV",    site:"univision.com",               email:"Via Univision PR",           phone:"N/A",          timing:"Phase 3",              priority:"P1", pitch:"Deported veteran families story. Bilingual community reach. Latino primetime audience." },
  { n:10, outlet:"New York Times Books", type:"Prestige Press",         site:"nytimes.com/books",           email:"books@nytimes.com",          phone:"N/A",          timing:"Phase 3 (post-pub)",   priority:"P2", pitch:"Post-publication review + author interview. Requires agent and publisher to initiate." },
  { n:11, outlet:"Jocko Willink Podcast",type:"Military/Leadership",    site:"jockopodcast.com",            email:"Via podcast booking",        phone:"N/A",          timing:"Phase 4",              priority:"P2", pitch:"Military discipline + leadership audience. 500K+ listeners. Veteran community endorsement." },
  { n:12, outlet:"Hardcore History (Dan Carlin)",type:"History Podcast",site:"dancarlin.com",              email:"Via podcast booking",        phone:"N/A",          timing:"Phase 4",              priority:"P2", pitch:"Vietnam war historical dimension. 3M+ audience. Veteran + history buff demographic." },
];

const INFLUENCERS = [
  { n:1,  handle:"@rgvet_vive",        name:"Miguel Cervantes",        followers:"41,000",  fit:86, cadence:"Daily",        platform:"Instagram/TikTok",  comp:"Revenue share OR $500–$2,000/post",    activation:"DM direct. Veteran authenticity anchor. PRIMARY ORGANIC DRIVER." },
  { n:2,  handle:"@latinovets",         name:"Latino Vets Coalition",   followers:"31,200",  fit:80, cadence:"Alt. days",    platform:"Instagram",         comp:"Revenue share OR $500–$1,500/activation",activation:"Email via coalition page. MOU preferred. Community validation = door-opener." },
  { n:3,  handle:"@latinxpub",          name:"Latinx in Publishing",    followers:"18,500",  fit:80, cadence:"3x/week",      platform:"Twitter/Instagram", comp:"Flat fee + content partnership $200–$600",activation:"Partnership email. Use for pre-submission phase." },
  { n:4,  handle:"@ruizchicanolit",     name:"Dr. Elena Ruiz",          followers:"18,500",  fit:80, cadence:"Alt. days",    platform:"Academic Twitter",  comp:"Academic honorarium + rev share $200–$800",activation:"Academic email preferred. NACCS conference connection." },
  { n:5,  handle:"@barriobooksclub",    name:"Barrio Books Club",        followers:"14,000",  fit:77, cadence:"3x/week",      platform:"Instagram/TikTok", comp:"Affiliate link + flat fee $150–$400",      activation:"DM direct. Gen Z Chicano readership. Community amplifier." },
  { n:6,  handle:"@veteranstories",     name:"Veterans Stories Network", followers:"62,000",  fit:74, cadence:"Daily",        platform:"YouTube",           comp:"Revenue share OR $1K–$3K/video",           activation:"Email booking. Documentary tone alignment. Phase 3-4." },
  { n:7,  handle:"@viet.t.nguyen",      name:"Viet Thanh Nguyen",       followers:"112,000", fit:73, cadence:"Weekly",        platform:"Instagram/Twitter", comp:"Prestige seeded (no fee)",                 activation:"Institutional endorsement path. USC direct colleague. Phase 2 ask." },
  { n:8,  handle:"@sandracisneros",     name:"Sandra Cisneros",         followers:"143,000", fit:70, cadence:"Occasional",    platform:"Instagram/Twitter", comp:"Prestige seeded (no fee)",                 activation:"Via Macondo Workshop connection. Single post = national coverage." },
  { n:9,  handle:"@dancarlin",          name:"Dan Carlin",              followers:"390,000", fit:67, cadence:"Infrequent",    platform:"Twitter/Podcast",   comp:"Prestige seeded (no fee)",                 activation:"Via podcast booking. Hardcore History audience = veteran + history buffs." },
  { n:10, handle:"@jockowillink",       name:"Jocko Willink",           followers:"3.1M",    fit:65, cadence:"Daily",         platform:"Instagram/Podcast", comp:"Prestige seeded (no fee)",                 activation:"Phase 4 only. Via podcast booking. Military leadership audience." },
  { n:11, handle:"@berrybookpages",     name:"Berry Book Pages",        followers:"22,000",  fit:72, cadence:"Daily",         platform:"TikTok/Instagram",  comp:"Affiliate $150–$400 + flat fee",           activation:"DM direct. BookTok community. Cultural fiction specialist." },
  { n:12, handle:"@tomesandtextiles",   name:"Tomes and Textiles",      followers:"19,000",  fit:70, cadence:"3x/week",       platform:"TikTok/Instagram",  comp:"Affiliate $100–$300",                      activation:"DM direct. Lifestyle + book crossover. Gen Z Latina audience." },
];

const TOOLS = [
  { n:1,  tool:"LitCentral v7",             type:"Proprietary — Literary Intel",site:"github.com/gabearce1-oss/litcentral-v7",access:"Base44/Vite — internal",   cost:"FREE (owned)",        priority:"P0 — ACTIVE",    use:"PRIMARY: 12-pillar scoring, Hybrid Omega, SPSS hooks, chapter audit, dashboard, Drive export." },
  { n:2,  tool:"HubSpot (Hub 46948033)",    type:"CRM + Marketing",              site:"hubspot.com",                          access:"API: api.hubspot.com",    cost:"Free + paid tiers",   priority:"P0 — ACTIVE",    use:"2,065 contacts, 791 companies, 42 grant prospects. Reauthorize write access now." },
  { n:3,  tool:"Google Analytics 4 (GA4)",  type:"Web Analytics",                site:"analytics.google.com",                 access:"gtag.js integration",     cost:"FREE",                priority:"P0 — DEPLOY NOW",use:"albavoice.org + TruthEngine360 audience analytics. Deploy before any campaign launch." },
  { n:4,  tool:"Crossref API",              type:"Academic Citations",           site:"api.crossref.org",                     access:"REST: /v1/works — public",cost:"FREE (Metadata Plus opt)",priority:"P0",          use:"Scholarly citation graph, DOI metadata, Chicano/Vietnam literature citation network. Gate 2." },
  { n:5,  tool:"Semantic Scholar",          type:"Academic Paper Graph",         site:"semanticscholar.org",                  access:"API + S2AG dataset",      cost:"FREE (1 RPS w/ key)", priority:"P0",             use:"Citation adjacency, theory-cluster mapping, external scholarly survival modeling." },
  { n:6,  tool:"Library of Congress API",   type:"Controlled Metadata",          site:"loc.gov/apis",                         access:"Public — no key, 20 RPM", cost:"FREE",                priority:"P1",             use:"Controlled subject heads for war literature + Chicano literature. Historical collection metadata." },
  { n:7,  tool:"Google Books API",          type:"Book Record Enrichment",       site:"googleapis.com/books/v1",              access:"API key; public data",    cost:"FREE",                priority:"P1",             use:"Lightweight book record enrichment. Comp title metadata. /volumes endpoint." },
  { n:8,  tool:"TMDB API",                  type:"Adaptation Comps",             site:"themoviedb.org/documentation/api",     access:"api_key or Bearer",       cost:"FREE",                priority:"P1",             use:"Adaptation comp universe. Streaming comps (Gentefied, Selena). ~40 RPS practical ceiling." },
  { n:9,  tool:"Open Library API",          type:"Bibliographic Enrichment",     site:"openlibrary.org/developers",           access:"Public — 1 RPS default",  cost:"FREE",                priority:"P1",             use:"Open bibliographic enrichment. Monthly dumps for bulk. 3 RPS for identified traffic." },
  { n:10, tool:"n8n Workflows",             type:"Automation / Webhook",         site:"n8n.io",                               access:"Self-hosted instance",    cost:"Open source",         priority:"P1 — ACTIVE",    use:"3 workflows operational: FOIA Tracker, News Monitor, Research Database. Extend to Lit Monitor." },
  { n:11, tool:"Google Search Console",     type:"SEO / Search Analytics",       site:"search.google.com/search-console",     access:"Connected (gbearce1)",     cost:"FREE",                priority:"P1",             use:"TruthEngine360 + albavoice.org search performance. Share of search in niche tracking." },
  { n:12, tool:"WorldCat (OCLC)",           type:"Library Holdings",             site:"oclc.org/worldcat",                    access:"WSKey required + subscription",cost:"Licensed — procurement", priority:"P2",    use:"Holdings and institutional penetration at scale. Gate 2 procurement target." },
  { n:13, tool:"Internet Archive",          type:"Archival Enrichment",          site:"archive.org/developers",               access:"Mixed open/credentialed", cost:"FREE (read)",         priority:"P2",             use:"Archival enrichment. Historical press coverage. Vietnam-era records." },
  { n:14, tool:"Circana / BookScan",        type:"Sales Data",                   site:"circana.com",                          access:"Subscription + quote",    cost:"Licensed — quote req",priority:"P2",             use:"Real comp-title sell-through and market sizing. Highest-value paid source." },
  { n:15, tool:"Podcast Analytics (Spotify/Apple)",type:"Audio Analytics",       site:"podcasters.spotify.com",               access:"Dashboard — account req", cost:"FREE",                priority:"P2",             use:"Podcast performance tracking. Veteran + Chicano audio audience measurement." },
];

// ─── TABS ────────────────────────────────────────────────────────────────────

const TABS = [
  { id:"agents",      label:"Literary Agents",   icon:Users,         count:AGENTS.length },
  { id:"publishers",  label:"Publishers",         icon:Building2,     count:PUBLISHERS.length },
  { id:"academic",    label:"Academic",           icon:GraduationCap, count:ACADEMIC.length },
  { id:"grants",      label:"Grants + Found.",    icon:Heart,         count:GRANTS.length },
  { id:"chicano",     label:"Chicano/Latino Orgs",icon:BookOpen,      count:CHICANO_ORGS.length },
  { id:"military",    label:"Veterans + Military",icon:Shield,        count:MILITARY.length },
  { id:"media",       label:"Media + Press",      icon:Radio,         count:MEDIA.length },
  { id:"entertainment",label:"Adaptation",        icon:Film,          count:ENTERTAINMENT.length },
  { id:"influencers", label:"Influencers",         icon:Star,          count:INFLUENCERS.length },
  { id:"tools",       label:"Tools + Analytics",  icon:Wrench,        count:TOOLS.length },
];

const P_STYLE = (p="") => {
  if (p.startsWith("P0")) return "text-red bg-red/10 border-red/30";
  if (p.startsWith("P1")) return "text-gold bg-gold/10 border-gold/30";
  if (p.startsWith("P2")) return "text-blue bg-blue/10 border-blue/30";
  return "text-muted-foreground bg-secondary border-border";
};
const STATUS_STYLE = (s="") => {
  if (s.includes("CHECK") || s.includes("CONFIRM")) return "text-orange";
  if (s.includes("CLOSED")) return "text-red";
  if (s.includes("QUERY") || s.includes("ACTIVE")) return "text-teal";
  if (s.includes("APPLY") || s.includes("DEPLOY")) return "text-red font-black";
  return "text-muted-foreground";
};

function PBadge({ v }) {
  return <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border whitespace-nowrap ${P_STYLE(v)}`}>{v}</span>;
}

function filt(items, fields, q) {
  if (!q) return items;
  const lq = q.toLowerCase();
  return items.filter(i => fields.some(f => String(i[f] || "").toLowerCase().includes(lq)));
}

// ─── SECTION COMPONENTS ───────────────────────────────────────────────────────

function AgentsSection({ q }) {
  const rows = filt(AGENTS, ["name","agency","notes","status"], q);
  return (
    <div className="bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead><tr className="border-b border-border bg-secondary/20 text-[8px] font-mono text-muted-foreground">
          <th className="text-left px-3 py-2">#</th><th className="text-left px-3 py-2">NAME</th><th className="text-left px-3 py-2">AGENCY</th>
          <th className="text-left px-3 py-2">WEBSITE</th><th className="text-left px-3 py-2">EMAIL / PORTAL</th><th className="text-left px-3 py-2">PHONE</th>
          <th className="text-center px-3 py-2">FIT</th><th className="text-left px-3 py-2">STATUS</th><th className="text-left px-3 py-2">PRIORITY</th>
          <th className="text-left px-3 py-2 max-w-sm">NOTES</th>
        </tr></thead>
        <tbody>
          {rows.map((a,i) => (
            <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
              <td className="px-3 py-2.5 text-muted-foreground font-mono">{a.n}</td>
              <td className="px-3 py-2.5 font-black text-gold whitespace-nowrap">{a.name}</td>
              <td className="px-3 py-2.5 text-foreground/80 whitespace-nowrap">{a.agency}</td>
              <td className="px-3 py-2.5 text-blue font-mono text-[9px]">{a.site}</td>
              <td className="px-3 py-2.5 text-blue font-mono text-[9px]">{a.email}</td>
              <td className="px-3 py-2.5 text-muted-foreground font-mono whitespace-nowrap">{a.phone}</td>
              <td className="px-3 py-2.5 text-center font-black font-mono text-gold">{a.fit}</td>
              <td className={`px-3 py-2.5 font-bold font-mono text-[9px] whitespace-nowrap ${STATUS_STYLE(a.status)}`}>{a.status}</td>
              <td className="px-3 py-2.5"><PBadge v={a.priority} /></td>
              <td className="px-3 py-2.5 text-foreground/70 text-[9px] max-w-sm">{a.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PublishersSection({ q }) {
  const rows = filt(PUBLISHERS, ["publisher","contact","approach"], q);
  return (
    <div className="bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead><tr className="border-b border-border bg-secondary/20 text-[8px] font-mono text-muted-foreground">
          <th className="text-left px-3 py-2">#</th><th className="text-left px-3 py-2">PUBLISHER</th><th className="text-left px-3 py-2">IMPRINT</th>
          <th className="text-left px-3 py-2">WEBSITE</th><th className="text-left px-3 py-2">PHONE</th><th className="text-left px-3 py-2">ACQUISITION CONTACT</th>
          <th className="text-center px-3 py-2">FIT</th><th className="text-left px-3 py-2">APPROACH</th>
        </tr></thead>
        <tbody>
          {rows.map((p,i) => (
            <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
              <td className="px-3 py-2.5 text-muted-foreground font-mono">{p.n}</td>
              <td className="px-3 py-2.5 font-black text-gold whitespace-nowrap">{p.publisher}</td>
              <td className="px-3 py-2.5 text-foreground/80 whitespace-nowrap">{p.imprint}</td>
              <td className="px-3 py-2.5 text-blue font-mono text-[9px]">{p.site}</td>
              <td className="px-3 py-2.5 text-muted-foreground font-mono whitespace-nowrap">{p.phone}</td>
              <td className="px-3 py-2.5 text-teal text-[9px]">{p.contact}</td>
              <td className="px-3 py-2.5 text-center font-black font-mono text-gold">{p.fit}</td>
              <td className="px-3 py-2.5 text-foreground/70 text-[9px] max-w-sm">{p.approach}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AcademicSection({ q }) {
  const rows = filt(ACADEMIC, ["name","inst","dept","notes"], q);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {rows.map((a,i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-purple/20 transition-all">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="text-[11px] font-black text-purple">{a.name}</div>
            <PBadge v={a.priority} />
          </div>
          <div className="text-[9px] text-muted-foreground mb-0.5">{a.title}</div>
          <div className="text-[9px] font-bold text-gold mb-2">{a.inst} — {a.dept}</div>
          <div className="text-[9px] text-foreground/80 mb-2">{a.notes}</div>
          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div><span className="text-muted-foreground">Email: </span><span className="text-teal">{a.email}</span></div>
            <div><span className="text-muted-foreground">Fit: </span><span className="text-gold font-bold">{a.fit}</span></div>
          </div>
          <div className="mt-1 text-[9px] text-blue font-mono">{a.site}</div>
        </div>
      ))}
    </div>
  );
}

function GrantsSection({ q }) {
  const rows = filt(GRANTS, ["grant","foundation","notes","applyAs"], q);
  return (
    <div className="bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead><tr className="border-b border-border bg-secondary/20 text-[8px] font-mono text-muted-foreground">
          <th className="text-left px-3 py-2">GRANT / PROGRAM</th><th className="text-left px-3 py-2">FOUNDATION</th>
          <th className="text-left px-3 py-2">PORTAL / EMAIL</th><th className="text-left px-3 py-2">AMOUNT</th>
          <th className="text-left px-3 py-2">DEADLINE</th><th className="text-left px-3 py-2">APPLY AS</th>
          <th className="text-left px-3 py-2">ELIGIBILITY</th><th className="text-left px-3 py-2">PRIORITY</th>
        </tr></thead>
        <tbody>
          {rows.map((g,i) => (
            <tr key={i} className={`border-b border-border/30 hover:bg-secondary/10 ${g.priority.startsWith("P0") ? "bg-gold/5" : ""}`}>
              <td className="px-3 py-2.5 font-bold text-foreground whitespace-nowrap">{g.grant}</td>
              <td className="px-3 py-2.5 text-foreground/70 text-[9px]">{g.foundation}</td>
              <td className="px-3 py-2.5 text-blue font-mono text-[9px]">{g.email}</td>
              <td className="px-3 py-2.5 font-black text-teal font-mono whitespace-nowrap">{g.amount}</td>
              <td className={`px-3 py-2.5 font-mono text-[9px] whitespace-nowrap ${g.deadline.includes("NOW") ? "text-red font-black" : "text-gold"}`}>{g.deadline}</td>
              <td className="px-3 py-2.5 text-foreground/70 text-[9px]">{g.applyAs}</td>
              <td className="px-3 py-2.5 text-foreground/60 text-[9px] max-w-xs">{g.eligibility}</td>
              <td className="px-3 py-2.5"><PBadge v={g.priority} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GenericOrgSection({ items, fields, cols, q }) {
  const rows = filt(items, fields, q);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {rows.map((r, i) => (
        <div key={i} className={`flex items-start gap-4 px-5 py-4 border-b border-border/30 hover:bg-secondary/10 last:border-0 ${r.priority==="P0" ? "bg-gold/5" : ""}`}>
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-[8px] font-mono text-muted-foreground">{r.n}</span>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            {cols.map((c,ci) => (
              <div key={ci}>
                <div className="text-[7px] font-mono text-muted-foreground uppercase mb-0.5">{c.label}</div>
                <div className={`text-[10px] ${c.bold ? "font-bold text-gold" : c.mono ? "font-mono text-blue" : c.color ? `text-${c.color}` : "text-foreground/80"}`}>{r[c.key]}</div>
              </div>
            ))}
          </div>
          <PBadge v={r.priority} />
        </div>
      ))}
    </div>
  );
}

function InfluencersSection({ q }) {
  const rows = filt(INFLUENCERS, ["handle","name","platform","activation"], q);
  return (
    <div className="bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead><tr className="border-b border-border bg-secondary/20 text-[8px] font-mono text-muted-foreground">
          <th className="text-left px-3 py-2">#</th><th className="text-left px-3 py-2">HANDLE</th><th className="text-left px-3 py-2">NAME</th>
          <th className="text-left px-3 py-2">FOLLOWERS</th><th className="text-center px-3 py-2">FIT</th><th className="text-left px-3 py-2">CADENCE</th>
          <th className="text-left px-3 py-2">PLATFORM</th><th className="text-left px-3 py-2">COMPENSATION</th><th className="text-left px-3 py-2 max-w-xs">ACTIVATION</th>
        </tr></thead>
        <tbody>
          {rows.map((inf,i) => (
            <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
              <td className="px-3 py-2.5 text-muted-foreground font-mono">{inf.n}</td>
              <td className="px-3 py-2.5 font-bold text-teal font-mono">{inf.handle}</td>
              <td className="px-3 py-2.5 font-bold text-foreground whitespace-nowrap">{inf.name}</td>
              <td className="px-3 py-2.5 text-muted-foreground font-mono">{inf.followers}</td>
              <td className={`px-3 py-2.5 text-center font-black font-mono ${inf.fit>=80?"text-gold":inf.fit>=70?"text-blue":"text-muted-foreground"}`}>{inf.fit}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{inf.cadence}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{inf.platform}</td>
              <td className="px-3 py-2.5 text-teal text-[9px]">{inf.comp}</td>
              <td className="px-3 py-2.5 text-foreground/70 text-[9px] max-w-xs">{inf.activation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ToolsSection({ q }) {
  const rows = filt(TOOLS, ["tool","type","use"], q);
  return (
    <div className="bg-card border border-border rounded-xl overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead><tr className="border-b border-border bg-secondary/20 text-[8px] font-mono text-muted-foreground">
          <th className="text-left px-3 py-2">#</th><th className="text-left px-3 py-2">TOOL / PLATFORM</th><th className="text-left px-3 py-2">TYPE</th>
          <th className="text-left px-3 py-2">WEBSITE</th><th className="text-left px-3 py-2">ACCESS</th><th className="text-left px-3 py-2">COST</th>
          <th className="text-left px-3 py-2">PRIORITY</th><th className="text-left px-3 py-2 max-w-xs">USE IN LITCENTRAL</th>
        </tr></thead>
        <tbody>
          {rows.map((t,i) => (
            <tr key={i} className={`border-b border-border/30 hover:bg-secondary/10 ${t.priority.startsWith("P0") ? "bg-teal/5" : ""}`}>
              <td className="px-3 py-2.5 text-muted-foreground font-mono">{t.n}</td>
              <td className="px-3 py-2.5 font-bold text-teal whitespace-nowrap">{t.tool}</td>
              <td className="px-3 py-2.5 text-muted-foreground text-[9px]">{t.type}</td>
              <td className="px-3 py-2.5 text-blue font-mono text-[9px]">{t.site}</td>
              <td className="px-3 py-2.5 text-foreground/70 text-[9px]">{t.access}</td>
              <td className={`px-3 py-2.5 font-mono text-[9px] whitespace-nowrap ${t.cost.includes("FREE") || t.cost.includes("owned") ? "text-teal" : t.cost.includes("Licensed") || t.cost.includes("quote") ? "text-orange" : "text-muted-foreground"}`}>{t.cost}</td>
              <td className="px-3 py-2.5"><PBadge v={t.priority} /></td>
              <td className="px-3 py-2.5 text-foreground/70 text-[9px] max-w-xs">{t.use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function StakeholderDirectoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agents");
  const [search, setSearch] = useState("");

  const total = TABS.reduce((a,t) => a + t.count, 0);

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-gold via-orange to-teal" />

      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-mono">
            <ArrowLeft className="w-3.5 h-3.5" />LITCENTRAL
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gold font-mono">STAKEHOLDER INTELLIGENCE DIRECTORY</div>
            <div className="text-[9px] text-muted-foreground font-mono">{total} total contacts across {TABS.length} categories — SGT George Ramos: The Mathematics of Vietnam</div>
          </div>
          <div className="relative flex-shrink-0">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all..."
              className="pl-7 pr-3 py-1.5 text-[10px] bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50 w-44" />
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono whitespace-nowrap transition-all ${
                    activeTab === t.id ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}>
                  <Icon className="w-3 h-3" />{t.label}
                  <span className={`text-[7px] px-1 rounded-full ${activeTab === t.id ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"}`}>{t.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 space-y-4">
        {activeTab === "agents"        && <><div className="text-lg font-black font-mono text-foreground mb-3">LITERARY AGENTS — Priority Tier | Query Status | Submission Portals</div><AgentsSection q={search} /></>}
        {activeTab === "publishers"    && <><div className="text-lg font-black font-mono text-foreground mb-3">PUBLISHERS + IMPRINTS — Acquisition Contacts</div><PublishersSection q={search} /></>}
        {activeTab === "academic"      && <><div className="text-lg font-black font-mono text-foreground mb-3">ACADEMIC — Professors, Dept Chairs, Course Adoption Pipeline</div><AcademicSection q={search} /></>}
        {activeTab === "grants"        && <><div className="text-lg font-black font-mono text-foreground mb-3">GRANTS + FOUNDATIONS — Submission Portals | Deadlines | Amounts</div><GrantsSection q={search} /></>}
        {activeTab === "chicano"       && <><div className="text-lg font-black font-mono text-foreground mb-3">CHICANO/LATINO LITERARY ORGANIZATIONS — Canonization, Awards, Community</div><GenericOrgSection items={CHICANO_ORGS} fields={["org","type","role"]} cols={[{key:"org",label:"Organization",bold:true},{key:"type",label:"Type"},{key:"role",label:"Strategic Role"},{key:"site",label:"Website",mono:true},{key:"contact",label:"Contact",color:"teal"}]} q={search} /></>}
        {activeTab === "military"      && <><div className="text-lg font-black font-mono text-foreground mb-3">MILITARY + VETERAN ORGANIZATIONS — Advocacy, Media, 349 Campaign Partners</div><GenericOrgSection items={MILITARY} fields={["org","type","relevance"]} cols={[{key:"org",label:"Organization",bold:true},{key:"type",label:"Type"},{key:"relevance",label:"Relevance"},{key:"site",label:"Website",mono:true},{key:"email",label:"Contact Email",color:"teal"}]} q={search} /></>}
        {activeTab === "media"         && <><div className="text-lg font-black font-mono text-foreground mb-3">MEDIA, PRESS + PODCASTS — StrComm Phase Targets | Editorial Contacts</div><GenericOrgSection items={MEDIA} fields={["outlet","type","pitch"]} cols={[{key:"outlet",label:"Outlet",bold:true},{key:"type",label:"Type"},{key:"pitch",label:"Pitch Angle"},{key:"email",label:"Contact",mono:true},{key:"timing",label:"Timing",color:"orange"}]} q={search} /></>}
        {activeTab === "entertainment" && <><div className="text-lg font-black font-mono text-foreground mb-3">ENTERTAINMENT + ADAPTATION — Streaming Executives | Production Companies</div><GenericOrgSection items={ENTERTAINMENT} fields={["company","contact","pitch"]} cols={[{key:"company",label:"Company",bold:true},{key:"contact",label:"Contact"},{key:"title",label:"Title"},{key:"pitch",label:"Pitch Angle"},{key:"email",label:"Email / Portal",mono:true}]} q={search} /></>}
        {activeTab === "influencers"   && <><div className="text-lg font-black font-mono text-foreground mb-3">SOCIAL MEDIA INFLUENCERS — Fit Scores | Compensation | Activation Strategy</div><InfluencersSection q={search} /></>}
        {activeTab === "tools"         && <><div className="text-lg font-black font-mono text-foreground mb-3">MEASUREMENT + ANALYTICS TOOLS — Literary Intelligence Stack | APIs</div><ToolsSection q={search} /></>}
      </main>
    </div>
  );
}