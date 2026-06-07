import { useState } from "react";

// ROSTER BIBLE v2.0 — May 25 2026 — SINGLE SOURCE OF TRUTH
// v2 AUDIT: Ch.40 is now the CLIMACTIC BATTLE where most of squad is killed.
// KIA UPDATES: Ramirez Ch.9→Ch.11, O'Neil Ch.37→Ch.40, Herrera/Watkins/Williams/Wilson/Henderson/Martinez now KIA Ch.40, Reynolds KIA Ch.44.
// 7 new KIA characters introduced in Ch.41. THIS ROSTER OVERRIDES ALL EARLIER VERSIONS.
// This file overrides all earlier rosters where conflicts exist.

const SQUAD = [
  {
    id:"RAMOS",      rank:"Sgt",  surname:"Ramos",      first:'George Tomás',           origin:"Tucson AZ / East LA op-frame",         role:"Squad Leader",               mos:"0311",  fireteam:"HQ",  weapon:"M-16",                status:"Lives → 2026",      statusColor:"text-teal",   kia:false,
    notes:"Primary POV. 74-year arc. Medal of Honor restored 2022.",
    address:"'Sergeant' (officers) · 'Sarge' (in-squad) · 'Ramos' (peers)",
    colorClass:"text-gold",
  },
  {
    id:"MARTINEZ",   rank:"Cpl",  surname:"Martinez",   first:'Salvador "Sal"',          origin:"East LA — Boyle Heights",              role:"Fire Team 1 Leader · Tunnel Volunteer", mos:"0311", fireteam:"FT1", weapon:"M-16", status:"Lives",          statusColor:"text-teal",   kia:false,
    notes:"Moral witness to Ramos. Eye-twitch communication. Surname unaccented — U.S.-born anglicized form. NEVER 'Martinez' alone in prose — ambiguous with Miguel.",
    address:"'Martinez' · 'Sal' · 'Cpl Martinez'",
    colorClass:"text-teal",
  },
  {
    id:"HERRERA",    rank:"Cpl",  surname:"Herrera",    first:"Hector Ramón",            origin:"Bronx NY — Puerto Rican (Espiritismo)",role:"Fire Team 2 Leader · Tunnel Volunteer", mos:"0311", fireteam:"FT2", weapon:"M-16", status:"Lives (wounded Ch.25)", statusColor:"text-teal", kia:false,
    notes:"NOT the medic — that is Doc. Tunnel volunteer. Bronx graffiti/tunnel-rat character. Knife wound Ch.25, limps rest of tour. Bible v1.0 correction: origin is Bronx PR, NOT Albuquerque NM.",
    address:"'Herrera' · 'oye' (he uses) · 'papi'/'papá' for friends",
    colorClass:"text-blue",
  },
  {
    id:"ONEIL",      rank:"Cpl",  surname:"O'Neil",     first:"Brendan Patrick",         origin:"Eastern Kentucky — Appalachian Irish-American", role:"Fire Team 3 Leader", mos:"0311", fireteam:"FT3", weapon:"M-16 + harmonica", status:"KIA Ch.37 — Compadres Fall", statusColor:"text-red", kia:true,
    notes:"Bible v1.0 correction: Eastern Kentucky Appalachian (NOT Boston) — resolves cornbread continuity. Harmonica + Danny Boy STAY. Outsider → carnal → KIA arc. CANONICAL SPELLING: O'Neil — never O'Neill, Oneil, Oniel.",
    address:"'O'Neil' · rare 'Brendan' · adopted 'carnal' late tour",
    colorClass:"text-orange",
  },
  {
    id:"RAMIREZ",    rank:"LCpl", surname:"Ramirez",    first:'Esteban "Steve"',         origin:"San Antonio TX — Tejano",              role:"Senior Rifleman · Point",    mos:"0311",  fireteam:"FT1", weapon:"M-16",            status:"KIA Ch.9 — helicopter insertion contact", statusColor:"text-red", kia:true,
    notes:"The defining squad loss. WHOP-WHOP-WHOP opening. Ω 108. CRITICAL BUG: called 'Rodriguez' ~60% through Ch.9 — must be fixed. RAMIREZ always. Unaccented — Tejano anglicized form.",
    address:"'Ramirez' · 'Steve' (only by Ramos and Salvador)",
    colorClass:"text-red",
  },
  {
    id:"WILSON",     rank:"LCpl", surname:"Wilson",     first:"James",                   origin:"Cleveland OH",                         role:"M-60 Gunner",                mos:"0311",  fireteam:"FT2", weapon:"M-60 GPMG",       status:"Lives",             statusColor:"text-teal",   kia:false,
    notes:"Bible v1.0 correction: first name is James (NOT Marcus — freed to avoid three-Marcus collision with Watkins and Johnson). M-60 is his identity. 'Hear Wilson's M60? Thump-thump-thump. That's your base. Your anchor.' — Ch.38.",
    address:"'Wilson'",
    colorClass:"text-orange",
  },
  {
    id:"BECKMANN",   rank:"PFC",  surname:"Beckmann",   first:'Daniel "Danny"',          origin:"Iowa — Cedar Rapids area (Iowa-German-Lutheran)", role:"Rifleman — youngest in squad, 19yo, 6'6\"", mos:"0311", fireteam:"FT3", weapon:"M-16", status:"Lives — changed", statusColor:"text-teal", kia:false,
    notes:"Bible v1.0 correction: formerly 'PFC Henderson (Iowa)' — renamed Beckmann to avoid collision with SGT Henderson (Alabama, gave the order — a separate character). Squad nickname: 'Iowa'. Drafted from John Deere apprenticeship.",
    address:"'Beckmann' · 'Iowa' (squad nickname) · uses 'you bet' / 'fellas'",
    colorClass:"text-blue",
  },
  {
    id:"JOHNSON",    rank:"PFC",  surname:"Johnson",    first:"Anthony",                 origin:"North Philadelphia PA — Black American",role:"Rifleman · RTO",             mos:"0311",  fireteam:"FT1", weapon:"M-16 + PRC-25",  status:"Lives",             statusColor:"text-teal",   kia:false,
    notes:"Bible v1.0 correction: North Philadelphia (NOT Detroit). Full name Marcus Anthony Johnson — 'Marcus Anthony' is what only his mother calls him; in squad it's 'Johnson' or 'Anthony'. Detroit frame moved to Kowalski. Dice + Motown + 'jawn' (Philly AAE).",
    address:"'Johnson' · 'Anthony' (some) · uses 'y'all' / 'jawn' / 'son'",
    colorClass:"text-purple",
  },
  {
    id:"REYNOLDS",   rank:"PFC",  surname:"Reynolds",   first:"Caleb",                   origin:"Wilmington NC area — Black American (root-worker grandmother)", role:"Rifleman · Marksman", mos:"0311", fireteam:"FT2", weapon:"M-16 + scope", status:"Lives (music dissociation)", statusColor:"text-teal", kia:false,
    notes:"Bible v1.0 correction: first name changed to Caleb (frees 'Joshua' for Sagata layer). Black, coastal/eastern NC. Root-worker grandmother — MR profile anchor. Musical dissociation in combat is a major device. 'First to leave the county' detail stays.",
    address:"'Reynolds' · squad often doesn't speak to him — the music is on",
    colorClass:"text-blue",
  },
  {
    id:"KOWALSKI",   rank:"PFC",  surname:"Kowalski",   first:'Thomas "Tommy"',          origin:"Detroit MI — Polish-American, 3rd-gen auto worker", role:"Asst M-60 Gunner",  mos:"0311",  fireteam:"FT2", weapon:"M-60 Asst",       status:"Lives → Linda's letters", statusColor:"text-teal", kia:false,
    notes:"Bible v1.0 CRITICAL: weapon is M-60 NOT SAW/M249 (M249 didn't exist until 1980s). Detroit auto-industry context required for Linda Letters mechanism. Rosary detail stays (carries it despite not being Catholic). CANONICAL SPELLING: KOWALSKI — never Kowaski, Kpowaski, Kopowski.",
    address:"'Kowalski' · 'Tommy' (Linda only) · uses 'buddy' / 'pal'",
    colorClass:"text-gold",
  },
  {
    id:"WILLIAMSON", rank:"PFC",  surname:"Williamson", first:'Ezekiel "Zeke"',          origin:"Mississippi Delta — Black American",   role:"Rifleman (scripture loop)",  mos:"0311",  fireteam:"FT3", weapon:"M-16",            status:"Author TBD — possibly KIA", statusColor:"text-orange", kia:null,
    notes:"Scripture loop is his voice marker — the squad teases him 'Preacher' but they listen. Survival decision is author's call.",
    address:"'Williamson' · 'Zeke' · 'Preacher' (squad teasing) · uses 'brother' / scripture address",
    colorClass:"text-purple",
  },
  {
    id:"SEGURA",     rank:"PFC",  surname:"Segura",      first:'[First TBD]',              origin:"California — Norteño or Sureño (TBD) — not a choro, but nobody takes his shit", role:"Heavy Gunner — M-60 operator", mos:"0311", fireteam:"FT2", weapon:"M-60 GPMG (sleeps with it)", status:"KIA — scene written (3 appearances: Birthday Heist · Ch.41 extraction · death scene)", statusColor:"text-red", kia:true,
    notes:"REPLACES: PFC Thompson (WV). Heavy gunner. Sleeps with his weapon. Asshole but respected — nobody messes with him. Keeps to himself. Likes chutz. NOT a choro. Final death scene is anchor-quality. 3 planned appearances only: Birthday Heist, helicopter extraction (Ch.41), KIA scene. NORTE/SUR = AUTHOR TBD — but MATTERS: Norte register = lateral respect, tests authority sideways; Sureño register = harder deference or harder challenge, rarely middle ground. Either way his address to Ramos ('Sergeant') is controlled, not warm — until it isn't. FRY-OUT PROFILE: all three vectors active — (1) goes mechanical under sustained fire, (2) PTSD dissociation possible (trauma pre-war, chutz as tell), (3) moral collapse risk in his death scene — does he stop caring who gets hit? Author's call on which vector surfaces in the KIA chapter.",
    address:"'Segura' (always — surname only in combat)",
    colorClass:"text-red",
  },
  {
    id:"BARRON",     rank:"PFC",  surname:"Barrón",     first:'Jorge "El Guardian"',     origin:"Tijuana BC, MX — coyote / smuggler pre-war", role:"Rifleman · Scout (terrain reading)", mos:"0311", fireteam:"FT3", weapon:"M-16", status:"KIA Hill 51 · Nov 2 1971 (Día de los Muertos)", statusColor:"text-red", kia:true,
    notes:"CANONICAL SPELLING: Barrón (authorial). 'Baron' appears ONLY on in-narrative MOH paperwork — the institutional erasure. Single father of Carolina (age 3). Grandmother Lucía + uncle Samuel (coyote who trained him). Pre-war: shootout with Tijuana police. MOH posthumous. Citizenship posthumous. Record categorizes him Caucasian.",
    address:"'Barrón' · 'Jorge' · 'Guardian' (El Guardian — Tijuana street name) · uses 'hermano' / 'papa' / 'carnal'",
    colorClass:"text-teal",
  },
  {
    id:"WATKINS",    rank:"HM3",  surname:"Watkins",    first:"Marcus",                  origin:"Tuscaloosa AL — Black American (AME Zion)", role:"Navy Corpsman — 'Doc'", mos:"HM3",  fireteam:"Attached", weapon:"M-16 + medical kit", status:"Lives — keeps three notebooks", statusColor:"text-teal", kia:false,
    notes:"NAVY — not Marine. HM3 = Hospital Corpsman 3rd Class. IN-SQUAD ADDRESS: 'Doc' (primary). 'Watkins' (rare). NEVER 'Medic.' NEVER 'Corpsman' in dialogue. Wears Marine utilities in field but is Navy by rate.",
    address:"'Doc' (always) · 'Watkins' (rare) · NEVER 'Medic' or 'Corpsman'",
    colorClass:"text-blue",
  },
];

const EXTENDED = [
  {
    id:"MIGUEL",     rank:"PFC",  surname:"Martínez",   first:"Miguel Ángel",            origin:"Guadalajara, Jalisco MX — wife Antoinette Medina, 3 children, San Fernando Valley", role:"Rifleman · Scout — 'El Cazador'", mos:"0311", weapon:"M-16 + claymores", status:"Author TBD: survives (recommended) or KIA Hill 51",
    notes:"DISTINCT from Cpl Salvador Martinez — ALWAYS 'Miguel' or 'Miguel Martínez' — NEVER 'Martinez' alone. Accent on Martínez — Mexican national. Speaks Spanish ONLY. Hunter lineage — 4-day coyote-hunted initiation at 14. Tamale family business. MOH action Nov 2 1971 — set 4 claymores in VC camp. 'El Cazador' codename earned.",
    address:"'Miguel' · 'Cazador' (squad) · 'Miguel Ángel' (Jorge only) · speaks Spanish ONLY",
    colorClass:"text-teal",
  },
  {
    id:"GUZMAN",     rank:"Dr.",  surname:"Guzmán",     first:"[First TBD]",              origin:"East LA / academic — professor, 2+ years counting Brown faces on TV news (finds zero)", role:"Civilian — The Counter · Academic witness — the one who was measuring all along", mos:"N/A", weapon:"Yellow legal pad (never filled out — until the day Ramos appears on TV)", status:"Alive — East LA, Wednesday class, chalk breaks, grad student bursts in",
    notes:"ANCHOR SCENE: Wednesday class. Glasses falling off. Chalk breaks. Grad student runs in: 'PUT ON THE TV.' 80 students follow him. He sees Ramos on the news — gets 3 inches from the screen. Says one word: 'Mío.' Then opens the yellow pad he never filled out and writes: 'Fuente. Fuente Parada.' That is his entire filing system. He has been waiting for this man for 2 years. This is the chapter where the manuscript finds its civilian mirror. NOT written in yet — author developing. Scene = home frame counterpoint to the combat arc.",
    address:"'Dr. Guzmán' (students) · 'Profe' (inner circle)",
    colorClass:"text-gold",
  },
];

const COMMAND = [
  { rank:"SSgt→GySgt", name:"Gómez, Esteban", origin:"Sonora MX → San Diego (crossed border twice before enlisting)", role:"DI at Pendleton (Ch.6) → Platoon Sergeant in-country", notes:"'Top' informal after promotion. 'Recruits' → 'Marines' in address." },
  { rank:"Maj (rec.)", name:"Crawford, William", origin:"Three-generation military, Virginia (Old South father's voice)", role:"Pentagon analyst — appears in-country for kill audits / briefings", notes:"Rank: Maj or LtCol — author TBD. High enough to access IBM 360 / casualty data." },
  { rank:"Col",        name:"Mitchell, [TBD]", origin:"VMI graduate, Virginia", role:"Tactical command — moral threshold figure", notes:"First name TBD. Service: Marine (recommended for consistency)." },
  { rank:"MSgt (posth.)", name:"Benavidez, Roy P.", origin:"El Campo TX — Chicano", role:"Historical figure — Medal of Honor 1981 (action May 2 1968) — manuscript mentor figure", notes:"Canonical spelling: Benavidez (not Benevidez, Benavides)." },
];

const KIA_LOG = [
  { ch:"Ch.11",        date:"1968",         rank:"LCpl", name:"Esteban 'Steve' Ramirez", cause:"Command-detonated mine, Contact Contact — pink mist. Transmitted coordinates before death.", notes:"✅ v2: KIA ch updated from Ch.9 → Ch.11" },
  { ch:"Ch.?? (TBD)", date:"1969–70",       rank:"PFC",  name:"Caleb Reynolds",          cause:"Round through throat, 0719 — Firebase Lonesome patrol (Ch.44 flashback)",                notes:"✅ v2: confirmed KIA in Ch.44 flashback" },
  { ch:"Ch.40",        date:"1971",         rank:"Cpl",  name:"Hector Ramón Herrera",      cause:"Two AK rounds gut + RPG at river bend — died with Watkins and Williams",                  notes:"❗ v2 structural change: Herrera was previously 'Lives (wounded Ch.25)'" },
  { ch:"Ch.40",        date:"1971",         rank:"HM3",  name:"Marcus Watkins (Doc)",       cause:"RPG — shielded Williams with his body at river bend. Last words: 'Victory is on hand.'",     notes:"❗ v2 structural change: Watkins was previously 'Lives'" },
  { ch:"Ch.40",        date:"1971",         rank:"PFC",  name:"Roy Williams",               cause:"RPG at river bend (Watkins shielded him; both died)",                                       notes:"❗ v2 structural change: Williams was previously 'Lives'" },
  { ch:"Ch.40",        date:"1971",         rank:"PFC",  name:"James Wilson",               cause:"Mortar — last belt expended, hands locked with Henderson and Martinez",                     notes:"❗ v2 structural change: Wilson was previously 'Lives'" },
  { ch:"Ch.40",        date:"1971",         rank:"PFC",  name:"Daniel 'Danny' Beckmann",    cause:"Mortar — hands locked with Martinez and Wilson at the bend",                               notes:"❗ v2 structural change: Henderson/Beckmann was previously 'Lives'" },
  { ch:"Ch.40",        date:"1971",         rank:"Cpl",  name:"Salvador 'Sal' Martinez",    cause:"Mortar — last words: 'Mamá, te amo. Encontré hermanos aquí.'",                              notes:"❗ v2 structural change: Sal Martinez was previously 'Lives'" },
  { ch:"Ch.40",        date:"1971",         rank:"Cpl",  name:"Brendan O'Neil",             cause:"Sniper round through throat after running 50m under fire to reach Ramos",                   notes:"✅ v2: KIA ch updated from Ch.37 → Ch.40" },
  { ch:"Hill 51",      date:"Nov 2 1971",   rank:"PFC",  name:"Jorge 'El Guardian' Barrón",  cause:"KIA protecting RTO on ARVN extraction run",                                                notes:"MOH posth. · Citizenship posth. · Record misspells 'Baron'" },
  { ch:"Hill 51",      date:"Nov 2 1971",   rank:"PFC",  name:"Miguel Ángel Martínez",       cause:"Author TBD: survives recommended",                                                          notes:"MOH same action — Cazador + Guardian" },
  { ch:"Ch.?? TBD",   date:"1971",         rank:"PFC",  name:"Segura [First TBD]",       cause:"KIA — death scene written. Heavy gunner. 3 appearances total: Birthday Heist, Ch.41 extraction, KIA scene.",                                            notes:"🆕 REPLACES PFC Thompson WV · Norteño/Sureño TBD" },
  { ch:"Ch.41",        date:"1971",         rank:"PFC",  name:"Esteban Castillo",            cause:"KIA — Mexican national, McAllen TX, drafted before naturalization cleared",                   notes:"🆕 v2 new character — not previously in roster" },
  { ch:"Ch.41",        date:"1971",         rank:"PFC",  name:"[Brown] Mississippi",         cause:"KIA — sharecropper's grandson. Spiritual from grandmother still under helmet liner",            notes:"🆕 v2 new character — not previously in roster" },
  { ch:"Ch.41",        date:"1971",         rank:"PFC",  name:"[Diaz] Ponce, Puerto Rico",   cause:"KIA — wrote letters home in Spanish; censor stamped without reading",                        notes:"🆕 v2 new character — not previously in roster" },
  { ch:"Ch.41",        date:"1971",         rank:"PFC",  name:"[Wojcik] Hamtramck, Michigan", cause:"KIA — auto plant kid; father taught him to clean a rifle at nine",                           notes:"🆕 v2 new character — not previously in roster" },
  { ch:"Ch.41",        date:"1971",         rank:"PFC",  name:"[Begay] Window Rock, Diné",    cause:"KIA — corn pollen pouch sealed with electrical tape, still dry inside",                      notes:"🆕 v2 new character — not previously in roster" },
  { ch:"Ch.41",        date:"1971",         rank:"PFC",  name:"[Thompson] Oakland, 18",      cause:"KIA — lied to recruiter at 17 to enlist",                                                    notes:"🆕 v2 new character (distinct from old PFC Thompson WV)" },
  { ch:"Ch.41",        date:"1971",         rank:"PFC",  name:"[Hernandez] East L.A.",       cause:"KIA — undocumented mother wrote immigration office seeking papers so he could bring her home",   notes:"🆕 v2 new character — not previously in roster" },
];

const NAME_COLLISIONS = [
  { risk:"Ramirez vs Rodriguez",          fix:"Always RAMIREZ. Ch.9 mid-section bug 'Rodriguez' must be fixed everywhere." },
  { risk:"Martinez (Sal) vs Martínez (Miguel)", fix:"'Sal'/'Salvador'/'Cpl Martinez' for East LA. 'Miguel'/'Miguel Martínez' for Guadalajara. NEVER 'Martinez' alone." },
  { risk:"Three 'Marcus' — Wilson / Watkins / Johnson", fix:"Wilson → James Wilson. Johnson → Anthony (dialogue). Watkins → keep Marcus (Doc is most first-named)." },
  { risk:"Joshua Reynolds vs Joshua Sagata", fix:"Reynolds renamed Caleb Reynolds. Joshua stays with the Sagata operational-identity layer." },
  { risk:"Henderson (SGT Alabama) vs Henderson (PFC Iowa)", fix:"These are TWO DIFFERENT CHARACTERS. Iowa farm boy is now PFC BECKMANN. SGT Henderson (Alabama) is a separate platoon figure." },
  { risk:"Barrón / Barron / Barrone",     fix:"BARRÓN in author prose always. 'Baron' ONLY on in-narrative MOH paperwork (institutional erasure). 'Barrone' is drift — strike everywhere." },
];

const FORBIDDEN = [
  { cat:"Army terminology",    items:["'Medic, medic!' → NEVER (Marines yell 'DOC!' or 'CORPSMAN UP!')", "'Specialist' rank → doesn't exist in Marines", "'Tunnel Rats' as formal designation → Marines improvised, not institutionalized"] },
  { cat:"Rank drift",          items:["'Corp Medic William' → 3 errors: no medics; 'Corp' invalid; first names not in combat", "'PFC William Watkins' → wrong (HM3 Marcus Watkins, Navy)", "'Sergeant Martinez' → wrong rank (Cpl or PFC, both lower than Sgt)"] },
  { cat:"Anachronistic gear",  items:["SAW / M249 → not until 1980s — use M-60 or M-14 A1", "M4 carbine → 1990s — use M-16 (mid/late) or M-14 (early)", "MRAP / IED → wrong era — use booby trap / mine / mortar", "PRC-152 radio → wrong era — use PRC-25 ('Prick-25')"] },
  { cat:"First-name rules",    items:["Routine combat dialogue with first names → Marines call SURNAMES in combat", "First names ONLY: (a) family scenes · (b) dying words · (c) one human-recognition moment (rare, weight-bearing)"] },
];

const CHECKLIST = [
  "Every named Marine matches canonical spelling (§5)",
  "Every rank matches canonical rank or explicit promotion",
  "No 'medic' terminology — Doc Watkins is HM3 Navy Corpsman",
  "No 'Specialist' — Marines use E-1 to E-9",
  "No SAW / M4 / MRAP / IED / PRC-152 — period-correct equipment",
  "'Martinez' alone in prose? — must specify Salvador or Miguel",
  "'Rodriguez' in Ch.9 mid-section? — replace with Ramirez",
  "Marcus collision? — Wilson is James; Watkins is Marcus; Johnson is Anthony",
  "Joshua collision? — Reynolds is now Caleb; Sagata layer keeps Joshua",
  "Henderson rank? — SGT Alabama is DIFFERENT from PFC Beckmann Iowa",
  "Barrón spelling? — Barrón (authorial) · 'Baron' only on MOH paperwork",
  "Squad addressing each other by surname in combat (not first names)",
  "Doc called 'Doc' — never 'Medic'",
  "Fire team leaders are Cpl (not PFC, not Sgt)",
];

const RANK_TABLE = [
  { grade:"E-1", abbr:"Pvt",   title:"Private",                  role:"Rifleman (new)" },
  { grade:"E-2", abbr:"PFC",   title:"Private First Class",      role:"Rifleman" },
  { grade:"E-3", abbr:"LCpl",  title:"Lance Corporal",           role:"Senior rifleman" },
  { grade:"E-4", abbr:"Cpl",   title:"Corporal",                 role:"Fire team leader" },
  { grade:"E-5", abbr:"Sgt",   title:"Sergeant",                 role:"Squad leader" },
  { grade:"E-6", abbr:"SSgt",  title:"Staff Sergeant",           role:"Platoon Sergeant" },
  { grade:"E-7", abbr:"GySgt", title:"Gunnery Sergeant",         role:"Company NCO" },
  { grade:"E-8", abbr:"1stSgt",title:"First Sergeant",           role:"Senior NCO" },
  { grade:"E-4", abbr:"HM3",   title:"Hospital Corpsman 3rd Class (NAVY)", role:"Corpsman — 'Doc'" },
];

export default function SquadRosterScreen() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("roster");
  const record = [...SQUAD, ...EXTENDED].find(s => s.id === selected);

  return (
    <div className="animate-slide-up space-y-4">
      <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="text-base font-black text-orange">CHARLIE 1ST SQUAD — ROSTER BIBLE v2.0</div>
          <div className="text-[9px] font-mono text-muted-foreground">2nd Platoon · USMC · Vietnam 1968–1971 · Single source of truth · May 25 2026 · v2 audit applied</div>
        </div>
        <div className="flex gap-1.5">
          <span className="text-[8px] font-mono px-2 py-0.5 rounded border bg-gold/10 text-gold border-gold/30">13 Marines</span>
          <span className="text-[8px] font-mono px-2 py-0.5 rounded border bg-red/10 text-red border-red/30">4+ KIA</span>
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {["roster","command","casualties","deconflict","rules","checklist"].map(v => (
          <button key={v} onClick={() => { setView(v); setSelected(null); }}
            className={`text-[8px] font-mono px-2.5 py-1 rounded border transition-all capitalize ${
              view === v ? "bg-orange/20 text-orange border-orange/40" : "border-border text-muted-foreground hover:text-foreground"
            }`}>{v}</button>
        ))}
      </div>

      {/* ── ROSTER ── */}
      {view === "roster" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <div className="bg-card border border-border rounded-xl overflow-x-auto">
              <div className="px-4 py-2 border-b border-border bg-secondary/20 text-[8px] font-bold font-mono">SQUAD — 13 MARINES + DOC</div>
              <table className="w-full text-[9px]">
                <thead><tr className="border-b border-border bg-secondary/10 text-[7px] font-mono text-muted-foreground">
                  <th className="text-left px-3 py-1.5">RANK</th><th className="text-left px-3 py-1.5">NAME</th>
                  <th className="text-left px-3 py-1.5 hidden md:table-cell">ORIGIN</th>
                  <th className="text-left px-3 py-1.5">WEAPON</th><th className="text-left px-3 py-1.5">STATUS</th>
                </tr></thead>
                <tbody>
                  {SQUAD.map(s => (
                    <tr key={s.id} onClick={() => setSelected(selected===s.id?null:s.id)}
                      className={`border-b border-border/30 hover:bg-secondary/10 cursor-pointer transition-colors ${selected===s.id?"bg-orange/5":""}`}>
                      <td className="px-3 py-2 font-mono text-muted-foreground text-[8px] whitespace-nowrap">{s.rank}</td>
                      <td className={`px-3 py-2 font-bold whitespace-nowrap ${s.colorClass}`}>{s.surname}, {s.first}</td>
                      <td className="px-3 py-2 text-foreground/60 text-[8px] hidden md:table-cell">{s.origin}</td>
                      <td className="px-3 py-2 font-mono text-foreground/60 text-[8px] whitespace-nowrap">{s.weapon}</td>
                      <td className={`px-3 py-2 text-[8px] font-bold font-mono whitespace-nowrap ${s.statusColor}`}>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-card border border-teal/20 rounded-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-teal/20 bg-teal/5 text-[8px] font-bold font-mono text-teal">EXTENDED ENSEMBLE</div>
              {EXTENDED.map(s => (
                <div key={s.id} onClick={() => setSelected(selected===s.id?null:s.id)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/10 transition-colors ${selected===s.id?"bg-teal/5":""}`}>
                  <span className="text-[8px] font-mono text-muted-foreground">{s.rank}</span>
                  <span className={`font-bold text-[9px] ${s.colorClass}`}>{s.surname}, {s.first}</span>
                  <span className="text-[8px] text-muted-foreground">{s.role}</span>
                  <span className="ml-auto text-[8px] font-mono text-orange">{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {record ? (
              <div className="bg-card border border-orange/20 rounded-xl p-4 space-y-3 sticky top-24">
                <div>
                  <div className="text-[8px] font-mono text-muted-foreground">{record.rank} · {record.fireteam || "Extended"}</div>
                  <div className={`text-sm font-black ${record.colorClass}`}>{record.surname}</div>
                  <div className="text-[9px] text-foreground/70 font-bold">{record.first}</div>
                  <div className="text-[9px] text-muted-foreground">{record.role}</div>
                </div>
                <div className={`text-[9px] font-bold font-mono ${record.statusColor || "text-teal"}`}>{record.status}</div>
                <div className="bg-secondary/20 border border-border rounded-lg p-3">
                  <div className="text-[7px] font-mono text-muted-foreground mb-1">ORIGIN</div>
                  <div className="text-[9px] text-foreground/80">{record.origin}</div>
                </div>
                <div className="bg-teal/5 border border-teal/20 rounded-lg p-3">
                  <div className="text-[7px] font-mono text-muted-foreground mb-1">IN-SQUAD ADDRESS</div>
                  <div className="text-[9px] font-mono text-teal">{record.address}</div>
                </div>
                <div className="bg-secondary/10 border border-border rounded-lg p-3">
                  <div className="text-[7px] font-mono text-muted-foreground mb-1">NOTES</div>
                  <div className="text-[9px] text-foreground/70 leading-relaxed">{record.notes}</div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-dashed border-border rounded-xl p-8 flex items-center justify-center text-muted-foreground text-[10px] font-mono h-48">
                Click a squad member for full profile
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── COMMAND ── */}
      {view === "command" && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono">COMMAND STRUCTURE — ABOVE SQUAD</div>
            {COMMAND.map((c, i) => (
              <div key={i} className="flex gap-4 px-5 py-4 border-b border-border/30 last:border-0 hover:bg-secondary/10">
                <div className="w-32 flex-shrink-0">
                  <div className="text-[8px] font-black font-mono text-gold">{c.rank}</div>
                  <div className="text-[10px] font-bold text-foreground mt-0.5">{c.name}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[9px] font-bold text-blue mb-0.5">{c.role}</div>
                  <div className="text-[9px] text-foreground/60">{c.origin}</div>
                  <div className="text-[8px] font-mono text-muted-foreground mt-1">{c.notes}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">RANK STRUCTURE — USMC ENLISTED (Vietnam-era)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                  <th className="text-left px-3 py-1.5">GRADE</th><th className="text-left px-3 py-1.5">ABBR</th>
                  <th className="text-left px-3 py-1.5">TITLE</th><th className="text-left px-3 py-1.5">SQUAD ROLE</th>
                </tr></thead>
                <tbody>
                  {RANK_TABLE.map((r,i) => (
                    <tr key={i} className={`border-b border-border/30 ${r.abbr==="HM3"?"bg-blue/5":""}`}>
                      <td className="px-3 py-2 text-muted-foreground font-mono">{r.grade}</td>
                      <td className="px-3 py-2 font-black font-mono text-gold">{r.abbr}</td>
                      <td className="px-3 py-2 text-foreground/80">{r.title}</td>
                      <td className="px-3 py-2 text-foreground/60">{r.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── CASUALTIES ── */}
      {view === "casualties" && (
        <div className="space-y-3">
          <div className="bg-gold/5 border border-gold/20 rounded-lg px-4 py-2 text-[9px] font-mono text-gold">
            Minimum 4 KIA by Hill 51 (Nov 2 1971) · Possibly 5 if Miguel KIA same action · Survivors: 8-10 of original 14
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                <th className="text-left px-3 py-2">CH</th><th className="text-left px-3 py-2">DATE</th>
                <th className="text-left px-3 py-2">NAME</th><th className="text-left px-3 py-2">CAUSE</th>
                <th className="text-left px-3 py-2">NOTES</th>
              </tr></thead>
              <tbody>
                {KIA_LOG.map((k,i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className="px-3 py-2.5 font-mono text-red font-bold whitespace-nowrap">{k.ch}</td>
                    <td className="px-3 py-2.5 font-mono text-muted-foreground whitespace-nowrap">{k.date}</td>
                    <td className="px-3 py-2.5 font-bold text-foreground whitespace-nowrap">{k.rank} {k.name}</td>
                    <td className="px-3 py-2.5 text-foreground/70">{k.cause}</td>
                    <td className="px-3 py-2.5 text-orange text-[8px] font-mono">{k.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-3">
              <div className="text-[8px] font-mono text-muted-foreground mb-2">CALL-OUTS (not 'Medic')</div>
              {['"CORPSMAN UP!" — wounded (never MEDIC)','"DOC!" — informal call','"CONTACT!" — enemy','"FIRE IN THE HOLE!" — explosive','"DUSTOFF" — MEDEVAC helo'].map(c => (
                <div key={c} className="text-[9px] font-mono text-teal py-0.5 border-b border-border/20 last:border-0">{c}</div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-3">
              <div className="text-[8px] font-mono text-muted-foreground mb-2">PERIOD-CORRECT EQUIPMENT</div>
              {["M-16 (mid/late tour riflemen)","M-14 A1 (early tour, auto config)","M-60 GPMG (squad auto — NOT M249 SAW)","PRC-25 'Prick-25' (backpack radio)","KA-BAR (combat knife)","Claymore (M18A1)"].map(e => (
                <div key={e} className="text-[9px] font-mono text-gold py-0.5 border-b border-border/20 last:border-0">{e}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DECONFLICT ── */}
      {view === "deconflict" && (
        <div className="space-y-3">
          <div className="bg-red/5 border border-red/20 rounded-lg px-4 py-2 text-[9px] font-mono text-red">
            6 name-collision risks documented · All resolved in Bible v1.0
          </div>
          {NAME_COLLISIONS.map((n,i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="text-[9px] font-black text-orange mb-2">⚠ {n.risk}</div>
              <div className="text-[9px] text-foreground/80 font-mono">→ {n.fix}</div>
            </div>
          ))}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">TWO MARTINEZES — KEEP THEM STRAIGHT</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {label:"Cpl Martinez",   items:["Salvador / 'Sal'","Martinez (no accent — US-born)","East LA / Boyle Heights","Bilingual Chicano English","Prose: 'Sal' / 'Cpl Martinez'","NEVER 'Martinez' alone"]},
                {label:"PFC Martínez",   items:["Miguel Ángel","Martínez (accent — MX national)","Guadalajara, Jalisco","Spanish ONLY — no English","Prose: 'Miguel' / 'Miguel Martínez'","NEVER 'Martinez' alone"]},
              ].map(col => (
                <div key={col.label} className="bg-secondary/20 rounded-lg p-3">
                  <div className="text-[9px] font-black text-gold mb-2">{col.label}</div>
                  {col.items.map((item,j) => (
                    <div key={j} className={`text-[9px] font-mono py-0.5 ${item.startsWith("NEVER")?"text-red font-bold":"text-foreground/70"}`}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RULES ── */}
      {view === "rules" && (
        <div className="space-y-3">
          {FORBIDDEN.map(f => (
            <div key={f.cat} className="bg-card border border-border rounded-xl p-4">
              <div className="text-[8px] font-bold font-mono text-red mb-2 tracking-widest">FORBIDDEN — {f.cat.toUpperCase()}</div>
              {f.items.map((item,i) => (
                <div key={i} className="flex items-start gap-2 py-1 border-b border-border/20 last:border-0">
                  <span className="text-red text-[9px] font-mono flex-shrink-0">❌</span>
                  <span className="text-[9px] font-mono text-foreground/70">{item}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-2 tracking-widest">§0 USAGE RULES</div>
            {[
              "One canonical spelling per name — deviations are bugs",
              "One canonical rank per character per chapter range",
              "No 'medic' — the corpsman is Navy 'Doc'",
              "No 'Specialist' rank — that is Army",
              "No 'Squad Leader' without rank — use 'Sgt Ramos'",
              "Tunnel clearance NOT institutionalized in Marines — volunteers improvised",
              "In-squad address: surname only — first names at enlistment, family scenes, dying word only",
            ].map((r,i) => (
              <div key={i} className="flex gap-2 py-1 border-b border-border/20 last:border-0">
                <span className="text-teal text-[9px] font-mono">{i+1}.</span>
                <span className="text-[9px] font-mono text-foreground/70">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHECKLIST ── */}
      {view === "checklist" && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-[8px] font-bold font-mono text-muted-foreground mb-4 tracking-widest">OPERATIONAL CHECKLIST — RUN BEFORE LOCKING ANY CHAPTER</div>
          <div className="space-y-2">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-1.5 border-b border-border/20 last:border-0">
                <span className="text-muted-foreground text-[10px] font-mono flex-shrink-0 mt-0.5">☐</span>
                <span className="text-[9px] font-mono text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}