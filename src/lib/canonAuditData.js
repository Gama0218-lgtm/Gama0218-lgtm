// ─── Interim Audit Report Data (Phase 2–5) ───────────────────────────────────

export const EXEC_VERDICT = {
  score: 77.8,
  phaseStatus: "Phase 1: 1/44 complete · Phases 2–5: manuscript-level, extrapolative",
  summary: "A serious literary-forensic war novel at the upper edge of the Chicano-veteran sub-tradition with a credible — but not yet proven — claim to enter the broader American war canon. Its central wager: that a forensic civic-records architecture can be load-bearing inside a literary novel. Genuinely novel if sustained across 44 chapters.",
  gateWarnings: [
    { severity: "CRITICAL", text: "Yaqui cultural-authority consultation — Pascua Yaqui Tribe or Yaqui-studies academic. Gate Close Date precondition for submission. §3.10 Domain 4: ceremonial depiction without authority = potentially disqualifying." },
    { severity: "CRITICAL", text: "Benavidez family/estate consultation — via Dolph Briscoe Center, UT Austin. The manuscript's Mexican-Yaqui-Vietnam-veteran architecture is a structural parallel to Roy P. Benavidez's actual ancestry. Not optional." },
    { severity: "HIGH",     text: "Length strategy — 245,216 words is ~2.5× literary-fiction acquisition median. Requires cut-to-~180k plan OR two-volume publication proposal before submission." },
    { severity: "HIGH",     text: "Phase 1 audit completion — 43 remaining chapters. All canon verdicts below are provisional until complete." },
  ],
};

export const CANON_VERDICTS = [
  {
    id: "war",
    label: "Mainstream War Canon",
    verdict: "DEVELOPMENTAL",
    sublabel: "Strong potential for CANON-CANDIDATE",
    color: "gold",
    summary: "The serious editor at Grove Atlantic, Riverhead, FSG, Knopf, or Graywolf would recognize the architectural ambition as genuinely uncommon. Chapter 1 demonstrates capacity but not yet consistency. Verdict upgrades to CANON-CANDIDATE if Phase 1 audit produces Omega-band scores at expected distribution and the forensic apparatus passes the load-bearing test.",
    conditions: [
      "Phase 1 produces Omega-band scores at 3–8% of chapters",
      "Period E / Congressional Trilogy (Chs 41–43) apparatus passes load-bearing test",
      "Yaqui cultural-authority consultation completed",
      "No stretch of 3+ consecutive chapters fails forward-pull test",
      "Benavidez consultation completed",
    ],
    evidenceAnchors: [
      "Ch.1 line 207 — refusal compression; canon-quality sentence",
      "Ch.1 line 243 — temporal-bleed transition; engine activation strong",
      "Ch.1 line 15 — multi-modal sensory ground",
      "Ch.1 lines 81–86 — Mouth-as-Portal engine; names recitation",
      "Ch.1 line 117 — Chieftain's reframing; thematic compression",
    ],
  },
  {
    id: "chicano",
    label: "Chicano Literary Canon",
    verdict: "CANON-CANDIDATE",
    sublabel: "Conditional on consultation gates",
    color: "teal",
    summary: "MLA Chicano-literature syllabi, Arte Público, and UNM Press would recognize: extension of Cano-Trujillo Chicano-Vietnam-veteran subtradition into forensic-evidentiary architecture; Yaqui matrilineal cosmology at architectural scale comparable to Silko's Ceremony for Laguna Pueblo; contemporary policy-bearing apparatus (Exile Patriot Project, Chs 41–43).",
    conditions: [
      "Yaqui cultural-authority consultation — canon-disqualifying gate within Indigenous literary canon",
      "Phase 1 confirms code-switching architecture is sustained",
      "Phase 1 confirms female characters / matrilineal structure not subordinated to male-veteran narrative",
    ],
    evidenceAnchors: [
      "Ch.1 line 51 — untranslated Spanish; Chieftain's full monologue (gatekeeping-refusal mode)",
      "Ch.1 lines 81–86 — bilingual code-switching architecture",
      'Ch.1 line 207 — Chicano-veteran refusal register: "Thirteen dead. Thirteen."',
      "Ch.1 lines 189–195 — ceremonial-painting; female elders' sacred protocol transmission",
    ],
  },
  {
    id: "crossover",
    label: "Crossover / Market",
    verdict: "TARGETED LITERARY CROSSOVER",
    sublabel: "Major-market potential: 3 concrete moves required",
    color: "blue",
    summary: "U.S. Latino GDP $4.0 trillion (2023, LDC), purchasing power $4.1 trillion. Latino consumer spending $2.5 trillion growing 4.9%/yr — 2× non-Latino rate. Publishing has not aligned to this reality. No clean comp-title exists in current marketplace: gap = both marketing problem and differentiation strength.",
    conditions: [
      "Length reduction (~180k) OR two-volume publication proposal",
      "Yaqui cultural-authority consultation + acknowledgment",
      "Benavidez estate consultation",
    ],
    evidenceAnchors: [
      "Matterhorn comp: NYT bestseller 16 wks, 2011 Colby Award, marine-veteran authorship precedent",
      "Bless Me, Ultima comp: 360,000+ copies via word-of-mouth, no NY house original",
      "Ceremony (Silko) comp: 47+ years in print, MLA Native American Lit syllabus core",
      "Oscar Wao (Díaz) proof-of-concept: ethnic-specific → Pulitzer 2008",
    ],
  },
];

export const WEIGHTED_RUBRIC = [
  { category: "Originality and genre innovation",         weight: 20, score: 9.0, result: 18.0 },
  { category: "Cultural authenticity and symbolic world", weight: 15, score: 9.0, result: 13.5 },
  { category: "Historical seriousness",                   weight: 15, score: 7.0, result: 10.5 },
  { category: "Emotional force",                          weight: 15, score: 8.5, result: 12.8 },
  { category: "Structural control",                       weight: 15, score: 6.0, result: 9.0  },
  { category: "Canon dialogue with major comparators",    weight: 10, score: 8.0, result: 8.0  },
  { category: "Teachability and long-afterlife readiness",weight: 10, score: 6.0, result: 6.0  },
];

export const COMPARATORS = [
  {
    title: "The Things They Carried",
    author: "Tim O'Brien, 1990",
    domain: "Memory & Narrative Truth",
    scores: { formal: 10, witness: 8, cultural: 5, emotional: 9, control: 9 },
    ramosRelation: "Ramos likely exceeds it in Chicano specificity and bureaucratic-erasure critique, but not yet in formal control or proven afterlife. O'Brien blurs truth and story to honor a war that refused both; Ramos insists the institutional record is the prosecutorial document — different epistemology.",
  },
  {
    title: "For Whom the Bell Tolls",
    author: "Hemingway, 1940",
    domain: "Sacrificial Mission",
    scores: { formal: 8, witness: 8, cultural: 4, emotional: 9, control: 9 },
    ramosRelation: "Ramos likely exceeds it in ethnic/cultural granularity and archival argument, but trails in compression and locked architecture. Hemingway's Jordan volunteers for ideology; Ramos is drafted into a system that mathematically optimizes his demographic for death — inverted proposition.",
  },
  {
    title: "Matterhorn",
    author: "Karl Marlantes, 2010",
    domain: "Operational & Tactical Realism",
    scores: { formal: 8, witness: 9, cultural: 4, emotional: 8, control: 9 },
    ramosRelation: "Ramos foregrounds the Chicano NCO — the underrepresented majority of the actual fighting force — where Marlantes is white-officer-centric. Ramos adds Period D and E; Marlantes is essentially monoperiod. The Matterhorn bar: cumulative operational density, 30-year writing journey, 3 decades of NY rejection before Grove/Atlantic pickup.",
  },
  {
    title: "Bless Me, Ultima",
    author: "Rudolfo Anaya, 1972",
    domain: "Spiritual Identity & Folk Healing",
    scores: { formal: 8, witness: 6, cultural: 10, emotional: 9, control: 8 },
    ramosRelation: "Ramos may be the missing war-side counterpart to Anaya's spiritual realism. Critical distinction: Anaya's Ultima is permitted to be wrong, mortal, limited — she dies. Ramos's Chieftain (Ch.1) is omniscient-warm with no limit — the Magical-Elder risk Anaya's example shows can be avoided.",
  },
  {
    title: "Ceremony",
    author: "Leslie Marmon Silko, 1977",
    domain: "Indigenous Veteran / Ceremonial Healing",
    scores: { formal: 8, witness: 7, cultural: 10, emotional: 9, control: 8 },
    ramosRelation: "Silko did for Laguna Pueblo ceremonial structure in war fiction what Ramos attempts for Yaqui matrilineal cosmology. The methodological precedent: Silko consulted Laguna Pueblo elders and rendered ceremonial material with their authorization. This is the consultation standard the manuscript must match.",
  },
  {
    title: "The House on Mango Street",
    author: "Sandra Cisneros, 1984",
    domain: "Voice, Vignette & Cultural Specificity",
    scores: { formal: 9, witness: 6, cultural: 10, emotional: 9, control: 9 },
    ramosRelation: "Ramos may rival it in cultural authenticity but not yet in teachable compression or elegant economy. Cisneros became canonical by making a distinctive form feel necessary — Chicano works do not become canonical by being 'representative.' The test for Ramos is identical.",
  },
  {
    title: "SGT George Ramos (provisional)",
    author: "Gabriel T. Arce Jr.",
    domain: "Forensic-Literary War / Chicano-Yaqui Cosmology",
    scores: { formal: 9, witness: 8, cultural: 10, emotional: 9, control: 6 },
    ramosRelation: "Ceiling is canon-level. Floor currently lowered by version drift, continuity problems, and unresolved Phase 1. Structural control (6) is the critical gap — O'Brien and Hemingway endure because structures are disciplined; Cisneros and Anaya because formal signatures are unmistakable and teachable.",
    isSelf: true,
  },
];

export const PROVISIONAL_ACHIEVEMENTS = [
  {
    id: "A1",
    title: "Forensic civic-records architecture as load-bearing narrative structure",
    category: "Genre-fusion / Documentary-literary hybrid",
    status: "PENDING",
    verdict: "NO CLEAN PRECEDENT FOUND",
    summary: "Integrates working forensic civic-records apparatus (DCAS Hispanic-coding analysis, BISG surname-classifier, vector cosine analysis) as plot-functional machinery rather than endnote or appendix. War canon: no precedent. Chicano canon: no precedent. Outside both: closest analogues are Bolaño's 2666 Part IV and Sebald's Austerlitz — forensic-archival prose but not falsifiable data architecture.",
    loadBearingStatus: "PENDING — cannot be tested at Ch.1. Verification required at Period E chapters and Congressional Trilogy (Chs 41–43).",
    hostileReviewerNote: "Documentary apparatus belongs in journalism, not fiction. The manuscript's response must make the apparatus inseparable from the human story — the institutional erasure IS what kills recognition; the killing IS what George cannot live without correcting.",
  },
  {
    id: "A2",
    title: "Yaqui matrilineal cosmology as load-bearing structural principle in a U.S. war novel",
    category: "Cultural-cosmological / Voice",
    status: "CONDITIONALLY DEMONSTRATED",
    verdict: "NO PRECEDENT — pending cultural-authority verification",
    summary: "Uses Yaqui matrilineal ceremonial lineage (Avina Sagasta line, anchored to Sonoran exodus ~1912–1915) as architectural principle organizing time, witness, and ancestry across 44 chapters. Silko's Ceremony (1977) is the methodological precedent for Laguna Pueblo; Ramos's equivalent for Yaqui matrilineal cosmology would be the first in war fiction.",
    loadBearingStatus: "PARTIAL at Ch.1 — central mechanism load-bearing, surrounding apparatus decorative. Cultural-authority verification pending.",
    hostileReviewerNote: "The hostile Native Studies reviewer will scrutinize whether ceremonial material is rendered with permission and protocol or as appropriation. Required response: documented consultation — Anaya and Silko both rest on this.",
  },
  {
    id: "A3",
    title: "CR-3.0 five-period integration with Period E (Forensic/IBM) as fifth narrative voice in a war novel",
    category: "Formal-structural",
    status: "PENDING",
    verdict: "NO CLEAN PRECEDENT FOUND for Period E in a war novel",
    summary: "Sustains five distinct narrative registers — A (Training), B (Combat), C (Final Operations), D (Testimony), E (Contemporary Forensic / IBM / BISG / vector analysis) — with Period E deploying computational and statistical register inside literary fiction. Bolaño's 2666 and DFW's Pale King footnotes provide partial methodological precedent; neither is war-anchored.",
    loadBearingStatus: "CANNOT BE TESTED at Ch.1 (Period D only). Verification required at Period E chapters.",
    hostileReviewerNote: "Computational register breaks fictional immersion. Response: Period E IS the truth-finding mechanism — this is how the dead are recovered, not abstracted away.",
  },
];

export const READER_PANEL = [
  { persona: "Vietnam vet, Chicano, ground combat 1968–70", score: 8, flag: null, quote: '"Finally someone wrote this — but show me the bush before I trust the ceremony."' },
  { persona: "Vietnam vet, Anglo, infantry officer", score: 6, flag: null, quote: '"I followed the Marine in him. The Spanish, I\'d want more help with."' },
  { persona: "Yaqui community elder / cultural authority", score: null, flag: "CANNOT MODEL — consultation required", quote: '"Whose authority does this rest on?"' },
  { persona: "Chicano studies scholar (R1, tenured)", score: 7, flag: null, quote: '"Important — but does the apparatus do the work, or perform the gesture?"' },
  { persona: "Chicana literature scholar", score: 6, flag: null, quote: '"The matrilineal frame is real. Does the prose let the women speak as subjects, or only as carriers?"' },
  { persona: "General literary fiction reader, monolingual English", score: 6, flag: null, quote: '"Beautiful, demanding, occasionally lost me."' },
  { persona: "MFA-trained fiction reader / fellow novelist", score: 7, flag: null, quote: '"There\'s a great novel in here. The sentimentality has to go."' },
  { persona: "Military historian, Vietnam specialty", score: null, flag: "CANNOT MODEL — requires combat chapters", quote: '"Show me the squad lineage and I\'ll tell you if it holds."' },
  { persona: "Forensic / data-science reader (watsonx, BISG)", score: null, flag: "CANNOT MODEL — requires Period E chapters", quote: '"Does the math work, or is it decorative?"' },
  { persona: "Memoir / nonfiction war reader", score: 6, flag: null, quote: '"Get me to Vietnam."' },
  { persona: "Younger Latino reader (18–25)", score: 7, flag: null, quote: '"I have an uncle who is George."' },
  { persona: "Veteran in deportation proceedings", score: null, flag: "CANNOT MODEL — requires Chs 41–43", quote: '"Did the writer see me, or use me?"' },
  { persona: "Family member of Chicano Vietnam KIA", score: 8, flag: null, quote: '"He kept the names. He earned them."' },
  { persona: "Acquiring editor at FSG / Knopf / Riverhead", score: null, flag: "CONDITIONAL — acquisition gates not cleared", quote: '"Send me the synopsis and the length-strategy plan. Then we talk."' },
];

export const MARKET_DATA = {
  latinoGDP: "$4.0T",
  purchasingPower: "$4.1T",
  consumerSpending: "$2.5T",
  annualGrowth: "4.9%",
  populationShare: "19.5%",
  mexicanOriginGDP: "$781B",
  workforceShare2030: "22.4%",
  medianAge: 31,
  source: "Latino Donor Collaborative 2025 Report + ASU W.P. Carey School of Business",
  comps: [
    { title: "Matterhorn (Marlantes)", signal: "NYT bestseller 16 wks · Colby Award · Time #7 Fiction 2010 · 30yr writing journey → Grove/Atlantic" },
    { title: "Bless Me, Ultima (Anaya)", signal: "360,000+ copies via word-of-mouth · no original NY house edition · K–12/university curriculum" },
    { title: "The House on Mango Street (Cisneros)", signal: "Millions in print · National K-12 English standard · MacArthur Fellow" },
    { title: "Ceremony (Silko)", signal: "47+ years in print · MLA Native American Lit syllabus core · MacArthur Fellow 1981" },
    { title: "Oscar Wao (Díaz)", signal: "Pulitzer 2008 · NYT bestseller · proof-of-concept for ethnic-specific → mainstream prizes" },
  ],
  acquisitionNote: "Plausible advance $250K–$750K at major house IF three submission gates cleared (length-strategy, Yaqui consultation, Benavidez consultation). Above this range requires competitive auction or adaptation pre-attachment.",
  adaptationNote: "Optimal format: 8–10 episode limited series, ~$70–110M prestige drama. Five CR-3.0 periods map cleanly to 10-episode arc. Period E forensic register = procedural-thriller framing (True Detective × The Vietnam War). Apple TV+, Amazon, FX/Hulu are best-fit platforms.",
};

export const REVISION_PRIORITY = [
  { rank: 1, action: "Yaqui cultural-authority consultation", canon: "CRITICAL", crossover: "CRITICAL", ethics: "CRITICAL" },
  { rank: 2, action: "Benavidez family/estate consultation via Briscoe Center, UT Austin", canon: "HIGH", crossover: "HIGH", ethics: "CRITICAL" },
  { rank: 3, action: "Phase 1 audit completion (43 remaining chapters)", canon: "CRITICAL", crossover: "HIGH", ethics: "MEDIUM" },
  { rank: 4, action: "Length-strategy resolution (cut to ~180k OR two-volume plan)", canon: "MEDIUM", crossover: "CRITICAL", ethics: "LOW" },
  { rank: 5, action: "Ch.1 revisions: strip narrator-omniscience slippages (lines 5, 9, 27); compress reverence-stacking (line 217); introduce Chieftain friction/limit", canon: "MEDIUM", crossover: "LOW", ethics: "LOW" },
  { rank: 6, action: "Period E chapter audit + watsonx.data / BISG / DCAS accuracy verification", canon: "HIGH", crossover: "MEDIUM", ethics: "MEDIUM" },
  { rank: 7, action: "Congressional Trilogy (Chs 41–43) audit — verify policy mechanism rendered without polemic", canon: "MEDIUM", crossover: "MEDIUM", ethics: "HIGH" },
  { rank: 8, action: "Cross-chapter character-list reconciliation (name-set variance between Ch.1 and roster)", canon: "LOW", crossover: "LOW", ethics: "LOW" },
  { rank: 9, action: "Manuscript-version reconciliation (238,794 extract vs 245,216 author spec)", canon: "LOW", crossover: "LOW", ethics: "LOW" },
];