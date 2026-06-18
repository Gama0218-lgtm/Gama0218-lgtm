// ── LITCENTRAL v12 AUTHORITATIVE CHAPTER DATA ────────────────────────────────
// Source: SGTRamos_ChapterRevision_Workbook.xlsx + SPSS_LITCENTRAL_v12_UPDATED.xlsx
// Formula: Ω = 71.443 + 0.124(CLS) + 0.118(BIS) + 0.089(SII) + 0.067(MRF)
// R² = 0.947 · Cronbach α = 0.938 · LSTE Composite: 82.2/100
// Manuscript means: CLS 84.9 · BIS 88.9 · SII 81.4 · MRF 83.8
// 45 chapters · 247,181 words · Ω Eff Mean 104.94 · SD ±1.13

export const MANUSCRIPT_STATS = {
  totalWords: 247181,
  totalChapters: 45,
  meanWords: 5493,
  omegaEffMean: 104.94,
  omegaSD: 1.13,
  lsteComposite: 82.2,
  clMoE: 0.847,
  cronbachAlpha: 0.938,
  rSquared: 0.947,
  clsMean: 84.9,
  bisMean: 88.9,
  siiMean: 81.4,
  mrfMean: 83.8,
  omegaElite: 3,
  goldPlus: 17,
  gold: 25,
  criticalArtifacts: 4,
  shortestCh: { ch: 36, words: 3706 },
};

// Tier thresholds
export const TIER = {
  OMEGA_ELITE: 107.00,
  GOLD_PLUS:   106.00,
  GOLD:        104.00,
};

// Sensory constants (apply to ALL chapters)
export const SENSORY_CONSTANTS = [
  { label:"60hz hum",        desc:"IBM data centers, field radios, fluorescent lights" },
  { label:"Copper taste",    desc:"Blood, fear, adrenaline" },
  { label:"Jasmine-napalm",  desc:"The paradox of beauty and destruction" },
  { label:"Folder warmth",   desc:"The documents that outlive the men" },
  { label:"Dresden ash",     desc:"Moral weight of state violence" },
  { label:"IBM tape rhythm", desc:"The mathematics processing the dead" },
];

// Quality gates (apply to ALL chapters)
export const QUALITY_GATES = [
  "No sentence explains what the reader should feel",
  "No LitCentral/SPSS terminology visible in prose",
  "At least 1 code-switch moment per 1,500 words (Act III: per 800w)",
  "At least 1 behavioral vector moment for weakest vector",
  "Sensory constants: minimum 3 of 6 present in chapter",
  "Chapter ends with: image, not statement",
];

// ── CHAPTER REVISION MATRIX ──────────────────────────────────────────────────
// Fields: ch, title, act, words, omegaEff, omegaRaw, tier, targetTier,
//         lcScore, clMoE, cls, bis, sii, mrf, clsGap, bisGap, siiGap, mrfGap,
//         lowestVector, criticalError, structFlag, instructions
export const REVISION_MATRIX = [
  {
    ch:1, title:"The Sacred Mountain Revelation", act:"I", words:5792,
    omegaEff:102.17, omegaRaw:105.17, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:94.0, clMoE:0.843, cls:86, bis:87, sii:82, mrf:82,
    clsGap:"+1.1", bisGap:"-1.9", siiGap:"+0.6", mrfGap:"-1.8",
    lowestVector:"Compassion", criticalError:true, structFlag:false,
    instructions:[
      "[P0 — DO FIRST] ARTIFACT: DELETE line 1 ('REVISED CHAPTER — FIRST PASS') before any other revision. Omega impact: Ω +3.00 (102.17 → 105.17)",
      "BIS MINOR DEFICIT (-1.9 vs mean): Strengthen 2-3 moments where Ramos registers physical pain or emotional weight without explanation. Action → body → silence.",
      "MRF GAP (-1.8): Add 1 cultural register shift — a moment where Ramos's institutional voice (military English) collides with his inherited voice (Yaqui Spanish) in the same sentence.",
    ]
  },
  {
    ch:2, title:"Descent Into Baptism", act:"I", words:5684,
    omegaEff:104.66, omegaRaw:104.66, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:92.7, clMoE:0.830, cls:84, bis:89, sii:78, mrf:80,
    clsGap:"-0.9", bisGap:"+0.1", siiGap:"-3.4", mrfGap:"-3.8",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "SII DEFICIT (78.0 vs mean 81, gap -3.4): Tunnel sequence needs 2 additional sensory anchors — copper taste + 18-inch darkness + the specific smell of Vietnamese clay vs California clay.",
      "MRF GAP (-3.8 — LARGEST GAP): Code-switch is not surfacing under extreme stress. Add 2 Spanish moments: (a) when Ramos enters the tunnel — internal Spanish prayer, (b) when he surfaces — English returns with a physical stutter.",
      "LOWEST: V:CodeSwitch — the code-switch is diagnostic: when it appears, readers know Ramos is at his limit.",
    ]
  },
  {
    ch:3, title:"The Genocide Algorithm", act:"I", words:5925,
    omegaEff:104.99, omegaRaw:104.99, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.7, clMoE:0.839, cls:90, bis:83, sii:79, mrf:83,
    clsGap:"+5.1", bisGap:"-5.9", siiGap:"-2.4", mrfGap:"-0.8",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "BIS DEFICIT (83.0 vs mean 89, gap -5.9 — CRITICAL GAP): Increase active-verb density. Target: 1 active verb per 12 words. Replace 2-3 'was/were' constructions per page with direct action. Add 1 physical action per paragraph in static scenes.",
      "LOWEST: V:CodeSwitch — Add 2 organic code-switching moments. The IBM 360 is processing the dead; when Crawford reads the numbers, Ramos should name them in Spanish.",
      "PULITZER WATCH — RESTRAINT: Overexplanation risk. Audit for: (a) sentences that explain what the reader should feel, (b) thematic statements that tell rather than show, (c) political analysis that belongs in an essay not a novel.",
    ]
  },
  {
    ch:4, title:"Pentagon, December 1969", act:"I", words:6200,
    omegaEff:105.78, omegaRaw:105.78, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:96.3, clMoE:0.858, cls:96, bis:87, sii:72, mrf:86,
    clsGap:"+11.1", bisGap:"-1.9", siiGap:"-9.4", mrfGap:"+2.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "CLS HIGH (96.0): Strong — do not dilute. Risk: over-density. Check that 1 in every 4 sentences is short (≤8 words) to provide rhythm breaks.",
      "SII DEFICIT (72.0 vs mean 81, gap -9.4 — LARGEST GAP): Add 3-5 Spanish insertions: (a) Ramos under extreme stress → Spanish internal monologue, (b) addressing family → full Spanish with no translation, (c) naming the dead → Spanish honorifics. Do NOT add glossary.",
      "LOWEST: V:CodeSwitch — Pentagon's English-only environment is the structural reason Spanish is absent. Make the absence itself felt: Ramos notices he has stopped thinking in Spanish.",
    ]
  },
  {
    ch:5, title:"The Ghost Protocol", act:"I", words:5769,
    omegaEff:104.97, omegaRaw:104.97, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.7, clMoE:0.838, cls:84, bis:87, sii:82, mrf:84,
    clsGap:"-0.9", bisGap:"-1.9", siiGap:"+0.6", mrfGap:"-0.6",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "SEED GHOST PROTOCOL QUARTET: Plant a name discrepancy that Roy notices — a moment where the 'George Ramos' on a form does not match the man in front of him. Roy dismisses it. The reader should not.",
      "BIS MINOR DEFICIT: Strengthen Roy's physical presence — he should be a body, not a voice. One tactile detail per Roy appearance.",
      "LOWEST: V:Compassion — add one micro-moment where Ramos absorbs another person's pain without comment.",
    ]
  },
  {
    ch:6, title:"Crucible Theorem", act:"I", words:5646,
    omegaEff:105.62, omegaRaw:105.62, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:96.1, clMoE:0.854, cls:85, bis:89, sii:84, mrf:88,
    clsGap:"+0.1", bisGap:"+0.1", mrfGap:"+4.2", siiGap:"+2.6",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "FIX ANACHRONISM: 'ID card swipe' — magnetic stripe IDs not USMC standard until 1973. Replace with 'dog tag check' or 'sign-in roster.'",
      "Chapter is structurally strong (+1.5 Ω pts achievable). Primary target: V:Compassion moments in formation — one soldier's face, not the crowd.",
      "MRF is strong (+4.2). Protect. Do not dilute the multicultural register work already present.",
    ]
  },
  {
    ch:7, title:"The Boulevard Theorem", act:"I", words:5988,
    omegaEff:105.05, omegaRaw:105.05, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:94.3, clMoE:0.840, cls:83, bis:88, sii:83, mrf:86,
    clsGap:"-1.9", bisGap:"-0.9", siiGap:"+1.6", mrfGap:"+2.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "CLS MINOR GAP (-1.9): Add 1 additional Tongva/Yaqui linguistic moment — a word that has no English equivalent and is not explained.",
      "OCHO VASQUEZ cross-check: Ocho appears in Ch.45 gallery (age 86, East LA, 1938). Verify his age and description here are consistent.",
      "Strong chapter. Primary risk is drift during revision. Protect the archaeological excavation metaphor.",
    ]
  },
  {
    ch:8, title:"Los Records Mienten", act:"I", words:5800,
    omegaEff:105.61, omegaRaw:105.61, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:95.3, clMoE:0.854, cls:84, bis:86, sii:87, mrf:88,
    clsGap:"-0.9", bisGap:"-2.9", siiGap:"+5.6", mrfGap:"+4.2",
    lowestVector:"Compassion", criticalError:false, structFlag:true,
    instructions:[
      "BIS DEFICIT (86.0 vs mean 89, gap -2.9): PTSD arc inconsistency — Rodolfo's vulnerability suddenly shifts to confidence without transition. Add 1 paragraph where doubt surfaces physically before the resolve hardens.",
      "REMOVE ANACHRONISM: Modern slang 'lit' in late-1960s setting. Replace with period-appropriate vernacular.",
      "SII is strong (+5.6): The Rexall scene is working. Protect the newsprint-and-cold-archive sensory layer.",
      "LOWEST: V:Compassion — Doña Ortiz needs one more line. Not explanation. A gesture. Her hand on the counter.",
    ]
  },
  {
    ch:9, title:"First Blood", act:"I", words:5097,
    omegaEff:106.35, omegaRaw:106.35, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:98.7, clMoE:0.873, cls:87, bis:91, sii:86, mrf:90,
    clsGap:"+2.1", bisGap:"+2.1", siiGap:"+4.6", mrfGap:"+6.2",
    lowestVector:"Compassion", criticalError:true, structFlag:false,
    instructions:[
      "[CRITICAL] DUPLICATION: Ch.9 and Ch.10 share 700+ lines of near-identical opening. Ch.9 MUST become: first-contact (present-tense kinetic). Zero overlapping lines with Ch.10 allowed after fix.",
      "Post-differentiation: this chapter is Ω 106.35 — only 0.65 pts from OMEGA ELITE. After duplication fix, add 1 code-switch moment in the firefight itself.",
      "LOWEST: V:Compassion — the moment after first kill. Not described. Not explained. One physical sensation.",
    ]
  },
  {
    ch:10, title:"The Pendejo Squad", act:"I", words:5812,
    omegaEff:104.81, omegaRaw:104.81, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.7, clMoE:0.834, cls:82, bis:87, sii:83, mrf:85,
    clsGap:"-2.9", bisGap:"-1.9", siiGap:"+1.6", mrfGap:"+1.2",
    lowestVector:"CodeSwitch", criticalError:true, structFlag:false,
    instructions:[
      "[CRITICAL] DUPLICATION: Ch.10 MUST become: aftermath/burial (reflective, ceremonial). Zero overlapping lines with Ch.9 allowed after fix.",
      "[CRITICAL] NAME SWAP: 'Ramirez' called 'Rodriguez' ~60% through chapter. Find/replace ALL instances. Cross-verify character registry across ALL 45 chapters before completing fix.",
      "Post-fix CLS gap (-2.9): Add Ramirez's burial — what the squad says in Spanish when no officer is listening.",
      "LOWEST: V:CodeSwitch — the burial is the moment. Spanish only. No translation.",
    ]
  },
  {
    ch:11, title:"Contact Contact", act:"I", words:5909,
    omegaEff:106.18, omegaRaw:106.18, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:97.0, clMoE:0.868, cls:85, bis:91, sii:88, mrf:89,
    clsGap:"+0.1", bisGap:"+2.1", siiGap:"+6.6", mrfGap:"+5.2",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "FIX ANACHRONISM: M249 SAW referenced — not adopted until 1984. Replace with M60 machine gun ('the pig').",
      "GRID CONTINUITY: Grid '4-7' vs Ch.10's '4-9'. Standardize to match Ch.10.",
      "Only 0.82 pts from OMEGA ELITE. Post-anachronism fix: add 1 code-switch moment during the ambush — the moment the tactical mind stops working and the cultural body takes over.",
    ]
  },
  {
    ch:12, title:"Red Truth Revolution", act:"I", words:5735,
    omegaEff:105.23, omegaRaw:105.23, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:94.6, clMoE:0.845, cls:84, bis:88, sii:85, mrf:87,
    clsGap:"-0.9", bisGap:"-0.9", siiGap:"+3.6", mrfGap:"+3.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "WORD OVERUSE: 'dark'/'darkness' 22x in 5,747w (3.8/1k). Vary 8 instances with: 'the nothing between stars', 'the weight before dawn', 'absence of light vs absence of sound.'",
      "Martinez and Herrera painting algorithm on Firebase walls: this is the counter-NERO peak. Add their physical sensation — paint smell, height of the wall, which one holds the other's ankles.",
      "LOWEST: V:CodeSwitch — the graffiti itself. Is it in Spanish? It should be.",
    ]
  },
  {
    ch:13, title:"The Walls Speak in Red", act:"I", words:5580,
    omegaEff:104.82, omegaRaw:104.82, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.7, clMoE:0.834, cls:83, bis:87, sii:83, mrf:84,
    clsGap:"-1.9", bisGap:"-1.9", siiGap:"+1.6", mrfGap:"+0.2",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "BIS and CLS both at minor deficit. Primary fix: the skeleton ceremony is ritual — rituals have physical choreography. Document the exact sequence: who moves first, what is said, in which language, what the ground feels like.",
      "LOWEST: V:Compassion — one soldier reaches out during the ceremony. One hand. Not explained.",
      "MRF is near mean — protect the cultural ceremony language. Do not modernize.",
    ]
  },
  {
    ch:14, title:"Package Sacrament", act:"I", words:5571,
    omegaEff:105.39, omegaRaw:105.39, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:94.8, clMoE:0.849, cls:83, bis:88, sii:85, mrf:87,
    clsGap:"-1.9", bisGap:"-0.9", siiGap:"+3.6", mrfGap:"+3.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "CHAMOY CONSISTENCY: 'sweet-sour paste' here vs 'liquid' in Ch.35. Standardize form. 'Paste' is more culturally accurate for field ration use.",
      "CLS MINOR GAP: The foxhole prayer code-switch is working. Add one more Spanish word in O'Neil's mouth — wrong pronunciation, right meaning. The one sentence he has been practicing.",
      "LOWEST: V:CodeSwitch — the package itself. When Ramos opens it, what does he say? One line. Spanish. No translation.",
    ]
  },
  {
    ch:15, title:"Move Like Water", act:"I", words:5433,
    omegaEff:107.04, omegaRaw:107.04, tier:"OMEGA ELITE", targetTier:"MAINTAIN OMEGA ELITE — protect, do not over-revise",
    lcScore:100.5, clMoE:0.890, cls:87, bis:92, sii:88, mrf:90,
    clsGap:"+2.1", bisGap:"+3.1", siiGap:"+6.6", mrfGap:"+6.2",
    lowestVector:"Agency", criticalError:false, structFlag:false,
    instructions:[
      "OMEGA ELITE — MAINTENANCE MODE ONLY. This chapter is a benchmark. Any revision risks a score reduction.",
      "ONLY permitted fix: Motown on reel-to-reel (uncommon in field) → change to 'cassette dub' (cassettes available 1969). One word change.",
      "DO NOT ADD: new scenes, new dialogue, structural changes. The chapter's restraint is its strength.",
    ]
  },
  {
    ch:16, title:"My Lai Massacre", act:"I", words:5735,
    omegaEff:104.04, omegaRaw:105.04, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.9, clMoE:0.840, cls:90, bis:83, sii:80, mrf:83,
    clsGap:"+5.1", bisGap:"-5.9", siiGap:"-1.4", mrfGap:"-0.8",
    lowestVector:"CodeSwitch", criticalError:true, structFlag:false,
    instructions:[
      "[P0] ARTIFACT: Page number artifact in chapter body text. Search Ch.16 for any standalone number on its own line (e.g. '47' or '[47]'). Delete. Save. Omega impact: Ω +1.00.",
      "HISTORICAL: Squad placed '3km east of Son My' — adjust to 'near the Son My perimeter.' Eliminates geographic inconsistency with documented My Lai approach routes.",
      "BIS DEFICIT (83.0 vs mean 89, gap -5.9): Ramos's refusal must be physical, not rhetorical. One action, not one speech. The weapon lowered. The step back.",
      "CLS is strong (90.0). Do not dilute. The high CLS is doing the moral work.",
    ]
  },
  {
    ch:17, title:"Boundary Shift", act:"I", words:5633,
    omegaEff:103.91, omegaRaw:104.91, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.6, clMoE:0.837, cls:88, bis:83, sii:77, mrf:84,
    clsGap:"+3.1", bisGap:"-5.9", siiGap:"-4.4", mrfGap:"+0.2",
    lowestVector:"CodeSwitch", criticalError:true, structFlag:false,
    instructions:[
      "[P0] ARTIFACT: Check for artifact in chapter (consistent with Ch.16 artifact pattern). Omega impact: Ω +1.00.",
      "BIS AND SII both at significant deficit. Major Duc's perspective requires: (a) mud/ash sensory grounding — more precise, (b) his internal Vietnamese logic — not translated, experienced.",
      "SPANISH GAP (0.0/1k): Duc's Vietnamese and Ramos's Spanish should briefly share the same frame. One bilingual moment where neither man fully understands the other but both understand the war.",
    ]
  },
  {
    ch:18, title:"Broken Wing", act:"I", words:5592,
    omegaEff:104.50, omegaRaw:104.50, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:92.4, clMoE:0.826, cls:83, bis:87, sii:81, mrf:83,
    clsGap:"-1.9", bisGap:"-1.9", siiGap:"-0.4", mrfGap:"-0.8",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "LOWEST SCORING ACT I CHAPTER (after artifact chapters): All four components at minor deficit. This is a 'clean base' chapter — easy to elevate.",
      "PRIMARY FIX: The I-5 bus. Miguel and Jorge need one more sensory anchor: heat through vinyl seat, the specific sound of the highway vs their silence.",
      "LOWEST: V:Compassion — Jorge's silence in this chapter is carrying weight. Name it. One object. Not one feeling.",
    ]
  },
  {
    ch:19, title:"Los Obligados", act:"II", words:5380,
    omegaEff:107.12, omegaRaw:107.12, tier:"OMEGA ELITE", targetTier:"MAINTAIN OMEGA ELITE — protect, do not over-revise",
    lcScore:98.7, clMoE:0.892, cls:85, bis:93, sii:88, mrf:92,
    clsGap:"+0.1", bisGap:"+4.1", siiGap:"+6.6", mrfGap:"+8.2",
    lowestVector:"Agency", criticalError:false, structFlag:false,
    instructions:[
      "OMEGA ELITE — MAINTENANCE MODE ONLY. Highest Ω in manuscript. Touch nothing structural.",
      "ONLY permitted: verify 50 USC §3802 citation is accurate and current. One legal clause check.",
      "DO NOT ADD dialogue, scenes, or thematic reinforcement. The silence in this chapter is doing maximum work.",
    ]
  },
  {
    ch:20, title:"The Genesis Equation", act:"II", words:5256,
    omegaEff:105.91, omegaRaw:105.91, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:96.2, clMoE:0.862, cls:87, bis:90, sii:84, mrf:88,
    clsGap:"+2.1", bisGap:"+1.1", siiGap:"+2.6", mrfGap:"+4.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "STRONG CHAPTER — 1.09 pts from OMEGA ELITE. Minimal intervention needed.",
      "PRIMARY FIX: Add 1 code-switch moment in the equation briefing room — the moment Ramos sees his own name on the casualty projection. What does he say? Spanish. One word.",
      "Briefing room equations: strengthen the visual — white chalk on green board vs computer printout. Specificity drives BIS.",
    ]
  },
  {
    ch:21, title:"El Cazador y El Guardián", act:"II", words:6161,
    omegaEff:106.02, omegaRaw:106.02, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:96.7, clMoE:0.864, cls:85, bis:91, sii:84, mrf:89,
    clsGap:"+0.1", bisGap:"+2.1", siiGap:"+2.6", mrfGap:"+5.2",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "DIALOGUE AT RISK: 65% dialogue (NDR flag). Add 2 sensory prose bridges — one when Miguel and Jorge first meet, one when they accept the assignment.",
      "LOWEST: V:Compassion — the in-processing scene dehumanizes both men. Add one tiny moment of one recognizing the other as human before the institution swallows them.",
      "Strong CLS — the 'El Cazador y El Guardián' archetype is doing maximum narrative work. Protect.",
    ]
  },
  {
    ch:22, title:"Don't Fuck with Familia", act:"II", words:4779,
    omegaEff:105.48, omegaRaw:106.48, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:98.4, clMoE:0.876, cls:83, bis:90, sii:86, mrf:92,
    clsGap:"-1.9", bisGap:"+1.1", siiGap:"+4.6", mrfGap:"+8.2",
    lowestVector:"CodeSwitch", criticalError:true, structFlag:false,
    instructions:[
      "[P0] ARTIFACT: Resolve pending artifact (check end of chapter for any diagnostic text). Omega impact: Ω +1.00 (105.48 → 106.48 already factored in raw).",
      "TOY SOLDIERS: 'lead' in Ch.3 vs 'plastic' in Ch.22. Standardize to LEAD. Lead soldiers = the algorithm made physical.",
      "SHORT CHAPTER (4,779w): Consider expanding Crawford's fracture scene by 400-500w. The toy soldier burning is the inflection point — it should breathe.",
    ]
  },
  {
    ch:23, title:"The Eagle and the Sparrow", act:"II", words:5756,
    omegaEff:104.48, omegaRaw:104.48, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:92.1, clMoE:0.826, cls:83, bis:87, sii:81, mrf:83,
    clsGap:"-1.9", bisGap:"-1.9", siiGap:"-0.4", mrfGap:"-0.8",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "LOWEST LC SCORE IN ACT II (92.1): All components at minor deficit. Primary target: Mitchell's scars — physical description is currently abstract. Make it specific: which arm, what pattern, what Mitchell says when someone notices.",
      "WORD OVERUSE: 'Faith' 11x in 5,505w (2.0/1k). Vary 2 instances.",
      "LOWEST: V:Compassion — the three flags bleed together. One flag that doesn't bleed. One flag that stays clean. The contrast.",
    ]
  },
  {
    ch:24, title:"Sacred Heart Briefing", act:"II", words:5425,
    omegaEff:102.51, omegaRaw:105.51, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:95.3, clMoE:0.852, cls:84, bis:89, sii:84, mrf:88,
    clsGap:"-0.9", bisGap:"+0.1", siiGap:"+2.6", mrfGap:"+4.2",
    lowestVector:"Compassion", criticalError:true, structFlag:false,
    instructions:[
      "[P0] ARTIFACT: Page number artifact in chapter body text. Omega impact: Ω +3.00 (102.51 → 105.51). Search for standalone number on own line.",
      "TE DEUM PLAUSIBILITY: Add one line establishing French Catholic mission school history near the Sacred Heart compound. One sentence. One date.",
      "Post-fix: 105.51 raw — still needs +0.49 for GOLD+. Add 1 code-switch moment during the briefing — when Mitchell gives the order, what does Ramos translate in his head?",
    ]
  },
  {
    ch:25, title:"Sacred Heart — The Battle", act:"II", words:5812,
    omegaEff:104.65, omegaRaw:104.65, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:92.9, clMoE:0.830, cls:84, bis:88, sii:82, mrf:84,
    clsGap:"-0.9", bisGap:"-0.9", siiGap:"+0.6", mrfGap:"+0.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "TE DEUM: The children's voices stopping the war — this is the Ω ceiling moment. The prose around it must be absolutely still. Audit for any word that moves when it should be frozen.",
      "LOWEST: V:CodeSwitch — when the Te Deum starts, Ramos hears it in Latin and in Spanish simultaneously. He knows both. He didn't know he knew.",
      "Dien Bien Phu reference: ensure it is specific to French defeat, not generic. One date, one ridge name.",
    ]
  },
  {
    ch:26, title:"Echoes of an Empire", act:"II", words:4971,
    omegaEff:105.19, omegaRaw:105.19, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:94.5, clMoE:0.844, cls:83, bis:88, sii:83, mrf:87,
    clsGap:"-1.9", bisGap:"-0.9", siiGap:"+1.6", mrfGap:"+3.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "SPANISH GAP (0.3/1k): Dien Bien Phu is French colonial history. Add one Spanish word — the word Ramos uses internally for 'empire' vs the French word vs the American word. Three words, three meanings.",
      "SHORT CHAPTER (4,971w): Historical sweep chapter — consider expanding the artillery description. Geological scale. Not tactical, geological.",
      "LOWEST: V:CodeSwitch — one moment where Ramos realizes the French and the Americans made the same mistake. He thinks it in Spanish.",
    ]
  },
  {
    ch:27, title:"Hunter's Geometry", act:"II", words:4899,
    omegaEff:106.47, omegaRaw:106.47, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:97.1, clMoE:0.876, cls:92, bis:90, sii:86, mrf:90,
    clsGap:"+7.1", bisGap:"+1.1", siiGap:"+4.6", mrfGap:"+6.2",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "HIGHEST CLS IN ACT II (92.0). The predatory geometry is working at maximum. Risk: revision will reduce this score.",
      "WORD OVERUSE: 'Brown' 8x in a 400-word section. Distribute more evenly across the chapter.",
      "Only 0.53 pts from OMEGA ELITE. Primary fix: V:Compassion — one moment where the hunter sees the hunted as a person. One blink. The geometry breaks for one second.",
    ]
  },
  {
    ch:28, title:"Cruzan, o Nadie Cruzan", act:"II", words:5795,
    omegaEff:105.05, omegaRaw:105.05, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:93.4, clMoE:0.840, cls:84, bis:88, sii:82, mrf:85,
    clsGap:"-0.9", bisGap:"-0.9", siiGap:"+0.6", mrfGap:"+1.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "DUC/TRONG BILINGUAL: Radio operator alternates 'Trong'/'Trung' — standardize to 'TRONG' throughout entire manuscript.",
      "Miguel and Jorge: the border is in their minds. Add one moment where Jorge tests it — walks across a line that no one enforces. Looks back. Walks back.",
      "LOWEST: V:CodeSwitch — 'Borders only exist in the mind.' This needs to be felt, not said.",
    ]
  },
  {
    ch:29, title:"Mathematics of Revolution", act:"II", words:5846,
    omegaEff:104.75, omegaRaw:104.75, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:92.9, clMoE:0.833, cls:84, bis:87, sii:81, mrf:84,
    clsGap:"-0.9", bisGap:"-1.9", siiGap:"-0.4", mrfGap:"+0.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "SPANISH GAP (0.0/1k): Major Duc reads Time magazine. Ramos reads the same magazine in a different foxhole. One Spanish word that Duc wouldn't know. The gap between their readings.",
      "BIS MINOR DEFICIT: The crosshairs scene — total suspension is working. Protect it. Add only the sound of Ramos's breath holding. One sound.",
      "LOWEST: V:CodeSwitch — mathematics has no language. This is the chapter where the equation and the Spanish meet.",
    ]
  },
  {
    ch:30, title:"Orchestrating Necessary Evil", act:"II", words:5798,
    omegaEff:104.38, omegaRaw:104.38, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:92.4, clMoE:0.823, cls:82, bis:87, sii:81, mrf:83,
    clsGap:"-2.9", bisGap:"-1.9", siiGap:"-0.4", mrfGap:"-0.8",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "CLS GAP (-2.9) — LARGEST GAP IN CHAPTER: Crawford's spiral begins. His language is starting to fail. Make it fail linguistically — sentences fragment, wrong word choices, institutional language cracking.",
      "MORTAR CALIBER: '81mm' vs NVA standard 82mm. Standardize to 82mm throughout manuscript.",
      "LOWEST: V:CodeSwitch — the squad's refusal of the fall-back order. One man says it in Spanish. The order doesn't translate.",
    ]
  },
  {
    ch:31, title:"Retreat, Hell", act:"III", words:4794,
    omegaEff:104.59, omegaRaw:105.59, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:95.3, clMoE:0.854, cls:86, bis:88, sii:84, mrf:88,
    clsGap:"+1.1", bisGap:"-0.9", siiGap:"+2.6", mrfGap:"+4.2",
    lowestVector:"Compassion", criticalError:true, structFlag:false,
    instructions:[
      "[P0] ARTIFACT: Verify chapter is clean (artifact pattern consistent with Ch.16/17). Omega impact: +1.00.",
      "SHORT CHAPTER (4,794w): This is the hinge between Acts II and III. Consider 400w expansion — the moment before the refusal, not the refusal itself.",
      "EIGHT MINUTES: The infinity of the firefight sequence. It is working. Do not explain. Add only one sound that continues through all eight minutes. The same sound at the beginning and end.",
    ]
  },
  {
    ch:32, title:"Corridor of Fire", act:"III", words:5451,
    omegaEff:105.18, omegaRaw:105.18, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:93.9, clMoE:0.843, cls:85, bis:89, sii:83, mrf:87,
    clsGap:"+0.1", bisGap:"+0.1", siiGap:"+1.6", mrfGap:"+3.2",
    lowestVector:"Compassion", criticalError:false, structFlag:true,
    instructions:[
      "FIX ARTIFACT: Chapter heading reads 'CORRIDOR OF FIRE: THE MASTERPIEC' — final 'E' of 'MASTERPIECE' truncated. Fix in source DOCX before submission.",
      "13 SECONDS: Three timelines collapse into one body. The prose is near-perfect. Add only the specific smell of the Senate chamber in 2024 vs the jungle in 1968 — same nitrogen, different history.",
      "LOWEST: V:Compassion — one Marine's name who is not Ramos. One name. In the final second.",
    ]
  },
  {
    ch:33, title:"Angels from Above", act:"III", words:5343,
    omegaEff:104.79, omegaRaw:104.79, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.8, clMoE:0.834, cls:83, bis:88, sii:82, mrf:85,
    clsGap:"-1.9", bisGap:"-0.9", siiGap:"+0.6", mrfGap:"+1.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "SIXTY-EIGHT PALIMPSEST: 1968 and 2024 share a scent — gunpowder and albahaca. Ensure both scents are named explicitly in this chapter. Albahaca = holy basil = Chicano spiritual marker.",
      "CLS MINOR GAP: Add one Boyle Heights location marker — a street name, a store, a church — that exists in both 1968 and 2024.",
      "LOWEST: V:CodeSwitch — when 2024 Ramos hears the 1968 sound. He uses the word he used then. Not the word he would use now.",
    ]
  },
  {
    ch:34, title:"Sixty-Eight", act:"III", words:4996,
    omegaEff:102.69, omegaRaw:105.69, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:95.7, clMoE:0.856, cls:87, bis:90, sii:84, mrf:88,
    clsGap:"+2.1", bisGap:"+1.1", siiGap:"+2.6", mrfGap:"+4.2",
    lowestVector:"Compassion", criticalError:true, structFlag:false,
    instructions:[
      "[P0] ARTIFACT: Last line = 'PASS 2 COMPLETE — LITCENTRAL HYBRID DIAGNOSTIC'. DELETE last line of chapter. Omega impact: Ω +3.00 (102.69 → 105.69). DO FIRST.",
      "Post-fix: 105.69 raw — strong chapter. Tio Sancho: the birthday brief is culturally precise. Reynolds carves the cross: make this the most specific physical action in Act III.",
      "LOWEST: V:Compassion — the cross Reynolds carves is for someone. We should know who before the chapter ends.",
    ]
  },
  {
    ch:35, title:"The Birthday Brief", act:"III", words:5645,
    omegaEff:104.89, omegaRaw:104.89, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.1, clMoE:0.836, cls:83, bis:88, sii:82, mrf:84,
    clsGap:"-1.9", bisGap:"-0.9", siiGap:"+0.6", mrfGap:"+0.2",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "DIALOGUE AT RISK: 62% dialogue (NDR HIGH). Add 2 sensory prose paragraphs: (a) the yellow bulb warmth before any dialogue, (b) the mosquitoes during the pause between sentences.",
      "SEED GHOST PROTOCOL: A filing anomaly mentioned — a form where 'George Ramos' is listed twice, different serial numbers. One soldier notices. No one follows up.",
      "LOWEST: V:Compassion — nine Marines steal a birthday. The one who doesn't want to be there is the one who matters.",
    ]
  },
  {
    ch:36, title:"Mission Execution", act:"III", words:3706,
    omegaEff:104.00, omegaRaw:105.00, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.5, clMoE:0.839, cls:82, bis:87, sii:82, mrf:84,
    clsGap:"-2.9", bisGap:"-1.9", siiGap:"+0.6", mrfGap:"+0.2",
    lowestVector:"CodeSwitch", criticalError:true, structFlag:true,
    instructions:[
      "[CRITICAL] EXPANSION REQUIRED: Ch.36 is the shortest chapter (3,706w). Target: 5,000w. This is the Mathematics of Revenge climax — 628 days. It needs to breathe.",
      "[P0] ARTIFACT: Verify clean. Check for any diagnostic text.",
      "CLS GAP (-2.9): The 628-day calculation must be in Ramos's voice. He does the math. He shows the work. The equation is the chapter.",
      "WORD OVERUSE: 'Map' 12x in 5,366w (2.24/1k). Vary: 'the cardboard', 'the grid', 'the operational theater.'",
      "628 DAYS: Verify calculation from projected KIA date. Must be mathematically precise.",
    ]
  },
  {
    ch:37, title:"The Mathematics of Revenge", act:"III", words:5795,
    omegaEff:104.62, omegaRaw:104.62, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.0, clMoE:0.829, cls:83, bis:87, sii:81, mrf:83,
    clsGap:"-1.9", bisGap:"-1.9", siiGap:"-0.4", mrfGap:"-0.8",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "'IN THE BEGINNING WAS THE WORD, AND THE WORD WAS FIRE' — this sentence carries the entire chapter. It must earn its placement. The sentence before it should be silence. The sentence after should be a physical action.",
      "MEXICAN NATIONAL CASUALTY: Miguel and Jorge's deaths — Mexican national casualties not officially counted. Make this absence explicit. One bureaucratic gap.",
      "BIS AND CLS both at minor deficit. Post-Compadres Fall: add one moment where 'Word was Fire' resolves into a specific word. In Spanish.",
    ]
  },
  {
    ch:38, title:"Last Dance", act:"III", words:5569,
    omegaEff:102.26, omegaRaw:105.26, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:94.3, clMoE:0.845, cls:84, bis:88, sii:82, mrf:85,
    clsGap:"-0.9", bisGap:"-0.9", siiGap:"+0.6", mrfGap:"+1.2",
    lowestVector:"Compassion", criticalError:true, structFlag:false,
    instructions:[
      "[P0] ARTIFACT: Locate and delete artifact. Omega impact: Ω +3.00 (102.26 → 105.26). DO FIRST.",
      "POST-FIX: 105.26 raw — extraction narrative is strong. JP-4 smell means survival. This is correct. Protect.",
      "LOWEST: V:Compassion — Ramos is cradling O'Neil. What does he say? One sentence. It has to be the sentence he's been carrying since Ch.9.",
    ]
  },
  {
    ch:39, title:"When Compadres Fall", act:"III", words:5097,
    omegaEff:107.06, omegaRaw:107.06, tier:"OMEGA ELITE", targetTier:"MAINTAIN OMEGA ELITE — protect, do not over-revise",
    lcScore:99.5, clMoE:0.890, cls:85, bis:93, sii:89, mrf:91,
    clsGap:"+0.1", bisGap:"+4.1", siiGap:"+7.6", mrfGap:"+7.2",
    lowestVector:"Agency", criticalError:false, structFlag:false,
    instructions:[
      "OMEGA ELITE — MAINTENANCE MODE ONLY. Miguel and Jorge's deaths are at maximum impact. Do not touch the death scenes.",
      "ONLY permitted: verify Medal of Honor posthumous citation language is accurate per actual MOH format. One administrative check.",
      "The word 'Fire' in the final line — this is the chapter's one movable piece. Every word before it is locked.",
    ]
  },
  {
    ch:40, title:"Ares: Death of a God", act:"III", words:5612,
    omegaEff:104.47, omegaRaw:104.47, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:92.2, clMoE:0.826, cls:82, bis:87, sii:80, mrf:83,
    clsGap:"-2.9", bisGap:"-1.9", siiGap:"-1.4", mrfGap:"-0.8",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:true,
    instructions:[
      "[HIGH] TIMELINE CONFLICT: Ch.40 compresses Henderson/Wilson/Martinez/Watkins/Williams/Herrera/O'Neil into one battle. Ch.45 testimony assigns separate dates (Feb–Nov 1968). ADD EXPLICIT DATE/LOCATION STAMP to each death scene: 'March 4, 1968 — grid 7-2' etc.",
      "WP WOUND: White phosphorus burn on leg. Pork-skin smell is documented. Keep. But add the specific sound of burning fabric before the smell.",
      "CLS GAP (-2.9): The 'vessel' metaphor peaks here — Ramos carries all their deaths. The Spanish word for 'vessel' — vasija — should appear once.",
    ]
  },
  {
    ch:41, title:"Adios Muchachos", act:"III", words:5480,
    omegaEff:104.62, omegaRaw:104.62, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:92.7, clMoE:0.829, cls:83, bis:87, sii:82, mrf:84,
    clsGap:"-1.9", bisGap:"-1.9", siiGap:"+0.6", mrfGap:"+0.2",
    lowestVector:"CodeSwitch", criticalError:false, structFlag:false,
    instructions:[
      "WILKINS COVENANT: 'You live. You remember. You speak.' — three verbs, all imperative, all in English. After 'You speak' — Ramos responds in Spanish. One word. Wilkins doesn't understand it. He nods anyway.",
      "SPANISH GAP (0.9/1k — borderline): Helicopter extraction confirmed present. The rotor as pulse: add one Spanish word that times with the rotor beat.",
      "LOWEST: V:CodeSwitch — the pistol set down in the mud. Ramos's hands are still holding O'Neil. The pistol remains unclaimed. Name the mud.",
    ]
  },
  {
    ch:42, title:"Sacred Smoke", act:"III", words:5284,
    omegaEff:104.66, omegaRaw:104.66, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:92.5, clMoE:0.830, cls:84, bis:87, sii:82, mrf:84,
    clsGap:"-0.9", bisGap:"-1.9", siiGap:"+0.6", mrfGap:"+0.2",
    lowestVector:"Compassion", criticalError:false, structFlag:true,
    instructions:[
      "EXPANSION TARGET: Ch.42 should reach 5,800w. Seed the Ghost Protocol: a filing anomaly in the 'George Ramos' record that Joshua notices from the door gunner. He sees it. He says nothing. He files it.",
      "DOOR GUNNER WILKINS: The M60 vibration — his palm on the weapon vs Ramos's palm on his shoulder. Same warmth, different instruments.",
      "LOWEST: V:Compassion — the smoke is a prayer. Name the person it is for.",
    ]
  },
  {
    ch:43, title:"Resurrection at the Capitol", act:"III", words:5186,
    omegaEff:104.26, omegaRaw:104.26, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:91.7, clMoE:0.820, cls:84, bis:86, sii:81, mrf:83,
    clsGap:"-0.9", bisGap:"-2.9", siiGap:"-0.4", mrfGap:"-0.8",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "LOWEST LC SCORE IN ACT III (91.7): Day 1 congressional hearing. Lihn Reynolds testifies. The Senate chamber is a sensory void — make it specific: the temperature, the microphone distance, the color of the carpet.",
      "BIS DEFICIT (86.0 vs mean 89, gap -2.9): Lihn needs a physical tell — something she does with her hands when she talks about her father. One gesture. Consistent throughout.",
      "TOC TITLE: Check for 'The THE HEARING HALL' duplicate article artifact in Table of Contents.",
    ]
  },
  {
    ch:44, title:"The Exile Patriots", act:"III", words:5069,
    omegaEff:104.91, omegaRaw:104.91, tier:"GOLD", targetTier:"GOLD+ (≥106.00)",
    lcScore:93.7, clMoE:0.837, cls:83, bis:88, sii:82, mrf:84,
    clsGap:"-1.9", bisGap:"-0.9", siiGap:"+0.6", mrfGap:"+0.2",
    lowestVector:"Compassion", criticalError:false, structFlag:false,
    instructions:[
      "SUSAN ACALIN: Day 2 testimony. The red dossier covering 55 years of litigation — name three specific documents inside it. The specificity is the argument.",
      "RAMOS IN GALLERY: He hears Lalo's name for the first time. This is the revelation. His reaction must be physical ONLY — no interiority, no explanation. One small movement.",
      "LALO VERIFICATION: Verify Chs 6–40 contain ZERO references to Lalo (Eduardo Reyes, Boyle Heights) by Ramos to preserve this moment's impact.",
    ]
  },
  {
    ch:45, title:"Unidos para Siempre", act:"III", words:5375,
    omegaEff:106.25, omegaRaw:106.25, tier:"GOLD+", targetTier:"OMEGA ELITE (≥107.00)",
    lcScore:98.9, clMoE:0.870, cls:86, bis:92, sii:87, mrf:90,
    clsGap:"+1.1", bisGap:"+3.1", siiGap:"+5.6", mrfGap:"+6.2",
    lowestVector:"Compassion", criticalError:false, structFlag:true,
    instructions:[
      "FIX ARTIFACT: Chapter heading reads 'Unidos para Sempr' — final 'e' of 'Siempre' truncated in source DOCX. Fix before any submission.",
      "GHOST PROTOCOL QUARTET REVELATION: Four men used 'George Ramos' — three KIA, one survivor (Joshua Sagasta). This is the climax. Before the reveal: 3-second silence in the chamber. After: only Joshua's breathing.",
      "14TH MARINE (LALO): Ramos did not know. His reaction in the gallery must close Act III's emotional arc. What does he do with his hands? He has been waiting 55 years.",
      "CRAWFORD SUICIDE NOTE: 'I cannot calculate forgiveness.' This sentence must stand alone on its own line. No surrounding commentary.",
    ]
  },
];