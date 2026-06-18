import { useState, useMemo } from "react";
import DashCard from "./DashCard";
import { REVISION_MATRIX } from "../../lib/revisionData";

// ── REMEDIATION TAXONOMY ─────────────────────────────────────────────────────
const TASK_TYPES = {
  "artifact":    { label:"Artifact Cleanup",       color:"red",    desc:"Visible workflow residue, page numbers, truncations — deterministic Ω recovery" },
  "structural":  { label:"Structural Rewrite",     color:"orange", desc:"Duplication, continuity, scene identity — Ω lift plus cleaner human validation" },
  "name":        { label:"Name Consistency",       color:"gold",   desc:"Registry integrity and trust — continuity repair" },
  "timeline":    { label:"Timeline Fix",           color:"gold",   desc:"Chronology contradictions — continuity repair and reduced reviewer rejection" },
  "expansion":   { label:"Expansion",              color:"blue",   desc:"Underweight scene architecture — BIS, SII, MRF, and narrative payoff" },
  "codeswitch":  { label:"SII / Code-Switching",   color:"purple", desc:"Crossover pressure and interlingual authenticity — SII and often CLS" },
  "compassion":  { label:"Compassion / Humanize",  color:"teal",   desc:"Coldness, over-calculation, abstraction — BIS and reader attachment" },
  "restraint":   { label:"Restraint Pass",         color:"cyan",   desc:"Prize-reader irritation — MRF and qualitative prestige upside" },
  "sensory":     { label:"Sensory Bridge",         color:"blue",   desc:"Dialogue-heavy flatness — SII and reading-flow control" },
  "seeding":     { label:"Narrative Seeding",      color:"purple", desc:"Late reveal weakness — MRF and downstream payoff" },
  "protect":     { label:"Protect / Hold",         color:"teal",   desc:"Already strong — do not over-revise" },
  "anachronism": { label:"Anachronism Fix",        color:"orange", desc:"Historical accuracy — submission blocker" },
};

const CLUSTERS = {
  "S1-Artifact":   { label:"Sprint 1 — Artifact Elimination",      color:"red",    desc:"< 1hr total · DO TODAY" },
  "S2-Structural": { label:"Sprint 2 — Structural Repair",         color:"orange", desc:"8-12 hrs · This week" },
  "S3-Expansion":  { label:"Sprint 3 — Expansion & Seeding",       color:"blue",   desc:"15-20 hrs · Week 2-3" },
  "S4-LSTE":       { label:"Sprint 4 — LSTE Enhancement Pass",     color:"teal",   desc:"20-30 hrs · Week 4-6" },
  "Protect":       { label:"Protected Chapters — Maintain Quality", color:"gold",   desc:"OMEGA ELITE + near-ceiling chapters" },
};

// ── Per-chapter remediation data ─────────────────────────────────────────────
// Fields: taskType, sprint, primaryTask, secondaryTask, effort, priority,
//         deltaClsTarget, deltaBisTarget, deltaSiiTarget, deltaMrfTarget,
//         acceptanceCriteria, dependencies, postRevisionTest
const REMEDIATION = {
  1:  { taskType:"artifact",   sprint:"S1-Artifact",   priority:"P0", effort:"5 min",
        primaryTask:"DELETE line 1 artifact 'REVISED CHAPTER — FIRST PASS'",
        secondaryTask:"BIS: strengthen 2-3 physical pain/weight moments without explanation",
        deltaClsTarget:0, deltaBisTarget:2, deltaSiiTarget:1, deltaMrfTarget:2,
        acceptanceCriteria:"Ch.1 opens with story prose. Ω ≥ 105.17 post-fix.",
        dependencies:"None", postRevisionTest:"Ctrl+Home confirms line 1 = prose" },
  2:  { taskType:"codeswitch", sprint:"S4-LSTE",       priority:"P2", effort:"2-3 hrs",
        primaryTask:"Add 2 Spanish code-switch moments: tunnel entry + surfacing",
        secondaryTask:"MRF: add 1 cultural register shift — institutional English colliding with Yaqui Spanish",
        deltaClsTarget:1, deltaBisTarget:0, deltaSiiTarget:3, deltaMrfTarget:4,
        acceptanceCriteria:"SII ≥ 81. At least 2 Spanish insertions without glossary.",
        dependencies:"None", postRevisionTest:"Word search confirms 2 Spanish insertions" },
  3:  { taskType:"restraint",  sprint:"S4-LSTE",       priority:"P2", effort:"3-4 hrs",
        primaryTask:"BIS deficit: increase active-verb density. 1 active verb per 12 words.",
        secondaryTask:"Audit for overexplanation — sentences that tell vs show",
        deltaClsTarget:0, deltaBisTarget:6, deltaSiiTarget:2, deltaMrfTarget:1,
        acceptanceCriteria:"BIS ≥ 89. Zero sentences explaining what reader should feel.",
        dependencies:"None", postRevisionTest:"Manual verb-density spot check" },
  4:  { taskType:"codeswitch", sprint:"S4-LSTE",       priority:"P2", effort:"3-4 hrs",
        primaryTask:"SII deficit (-9.4): add 3-5 Spanish insertions under stress",
        secondaryTask:"CLS rhythm: 1 in 4 sentences ≤ 8 words",
        deltaClsTarget:0, deltaBisTarget:2, deltaSiiTarget:9, deltaMrfTarget:0,
        acceptanceCriteria:"SII ≥ 81. Spanish appears under stress without translation.",
        dependencies:"None", postRevisionTest:"Count Spanish insertions ≥ 3" },
  5:  { taskType:"seeding",    sprint:"S3-Expansion",  priority:"P3", effort:"2-3 hrs",
        primaryTask:"Seed Ghost Protocol: Roy notices name discrepancy on a form — dismisses it",
        secondaryTask:"BIS: Roy needs one tactile physical detail per appearance",
        deltaClsTarget:0, deltaBisTarget:2, deltaSiiTarget:0, deltaMrfTarget:2,
        acceptanceCriteria:"Ghost Protocol seed planted. Roy has ≥ 1 physical descriptor.",
        dependencies:"Ch.35 also seeds GP — coordinate language", postRevisionTest:"Ctrl+F 'Ramos' near Roy dialogue for discrepancy" },
  6:  { taskType:"anachronism",sprint:"S2-Structural",  priority:"P1", effort:"30 min",
        primaryTask:"Fix 'ID card swipe' → 'dog tag check' (USMC standard 1973)",
        secondaryTask:"V:Compassion: 1 soldier's face in formation, not the crowd",
        deltaClsTarget:0, deltaBisTarget:1, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"Zero anachronistic ID tech. Ch.6 passes historical review.",
        dependencies:"None", postRevisionTest:"Ctrl+F 'swipe' confirms removal" },
  7:  { taskType:"protect",    sprint:"Protect",        priority:"P4", effort:"30 min",
        primaryTask:"PROTECT — check Ocho Vasquez age consistency with Ch.45 (age 86, 1938)",
        secondaryTask:"Add 1 Tongva/Yaqui word with no English equivalent — unexplained",
        deltaClsTarget:1, deltaBisTarget:1, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"Ocho age consistent. No structural changes.",
        dependencies:"Verify Ch.45 Ocho description first", postRevisionTest:"Cross-check Ocho age calculation" },
  8:  { taskType:"sensory",    sprint:"S4-LSTE",        priority:"P2", effort:"2-3 hrs",
        primaryTask:"BIS: PTSD arc — add 1 paragraph where doubt surfaces physically before resolve",
        secondaryTask:"Remove anachronism: 'lit' → period-appropriate 1960s vernacular",
        deltaClsTarget:1, deltaBisTarget:3, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"Emotional trajectory stabilized. No modern slang.",
        dependencies:"None", postRevisionTest:"Ctrl+F 'lit' confirms removal" },
  9:  { taskType:"structural", sprint:"S2-Structural",  priority:"P0-CRIT", effort:"4-8 hrs",
        primaryTask:"CRITICAL: Differentiate opening from Ch.10. Ch.9 = first-contact kinetic. Zero overlapping lines.",
        secondaryTask:"Post-fix: add 1 code-switch in firefight — when tactical mind fails, cultural body takes over",
        deltaClsTarget:0, deltaBisTarget:0, deltaSiiTarget:2, deltaMrfTarget:0,
        acceptanceCriteria:"Zero overlapping lines with Ch.10. Ch.9 is kinetic/present-tense.",
        dependencies:"Ch.10 must be worked simultaneously", postRevisionTest:"Side-by-side diff confirms zero duplicate lines" },
  10: { taskType:"structural", sprint:"S2-Structural",  priority:"P0-CRIT", effort:"4-8 hrs",
        primaryTask:"CRITICAL: Differentiate opening from Ch.9. Ch.10 = aftermath/burial ceremonial.",
        secondaryTask:"Fix Ramirez/Rodriguez name swap ~60% through chapter — find/replace ALL instances",
        deltaClsTarget:3, deltaBisTarget:2, deltaSiiTarget:2, deltaMrfTarget:0,
        acceptanceCriteria:"Zero overlapping lines with Ch.9. 'Rodriguez' = only Ch.1 underage boy.",
        dependencies:"Ch.9 must be worked simultaneously", postRevisionTest:"Ctrl+F 'Rodriguez' — confirm Ch.10 usage is Ch.1 character only" },
  11: { taskType:"anachronism",sprint:"S2-Structural",  priority:"P1", effort:"1 hr",
        primaryTask:"Replace M249 SAW (1984) with M60 'the pig'",
        secondaryTask:"Grid standardization: 4-7 vs Ch.10's 4-9 — use 4-9",
        deltaClsTarget:0, deltaBisTarget:0, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"No post-1969 weapons. Grid reference consistent.",
        dependencies:"Check Ch.10 grid before fixing", postRevisionTest:"Ctrl+F 'M249' confirms removal" },
  12: { taskType:"restraint",  sprint:"S4-LSTE",        priority:"P3", effort:"2 hrs",
        primaryTask:"'dark'/'darkness' 22x — vary 8 instances with specific alternatives",
        secondaryTask:"The graffiti itself: confirm it is in Spanish",
        deltaClsTarget:1, deltaBisTarget:0, deltaSiiTarget:0, deltaMrfTarget:1,
        acceptanceCriteria:"'dark'/'darkness' ≤ 14x (3.8/1k → ≤ 2.4/1k).",
        dependencies:"None", postRevisionTest:"Word frequency count confirms reduction" },
  13: { taskType:"sensory",    sprint:"S4-LSTE",        priority:"P3", effort:"2-3 hrs",
        primaryTask:"Skeleton ceremony: document exact physical choreography — who moves first, what is said, in which language",
        secondaryTask:"V:Compassion: one soldier reaches out during ceremony — one hand, not explained",
        deltaClsTarget:2, deltaBisTarget:2, deltaSiiTarget:2, deltaMrfTarget:1,
        acceptanceCriteria:"Ceremony has full physical specificity. Compassion moment present.",
        dependencies:"None", postRevisionTest:"Scene has ≥ 3 sensory details" },
  14: { taskType:"codeswitch", sprint:"S4-LSTE",        priority:"P3", effort:"1-2 hrs",
        primaryTask:"Chamoy consistency: 'paste' not 'liquid'. Fix Ch.14 form.",
        secondaryTask:"O'Neil: one Spanish word in his mouth — wrong pronunciation, right meaning",
        deltaClsTarget:2, deltaBisTarget:1, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"Chamoy form consistent across manuscript. O'Neil Spanish moment present.",
        dependencies:"Check Ch.35 chamoy reference", postRevisionTest:"Ctrl+F 'chamoy' across all chapters" },
  15: { taskType:"protect",    sprint:"Protect",        priority:"P4", effort:"15 min",
        primaryTask:"OMEGA ELITE — ONE CHANGE ONLY: reel-to-reel → cassette dub (1969 field use)",
        secondaryTask:"Nothing else",
        deltaClsTarget:0, deltaBisTarget:0, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"Ω remains ≥ 107.04. One word change only.",
        dependencies:"None", postRevisionTest:"Ctrl+F 'reel-to-reel' confirms fix" },
  16: { taskType:"artifact",   sprint:"S1-Artifact",   priority:"P0", effort:"15 min",
        primaryTask:"Delete page number artifact in chapter body text (standalone number on own line)",
        secondaryTask:"Historical fix: '3km east of Son My' → 'near the Son My perimeter'",
        deltaClsTarget:0, deltaBisTarget:6, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"No standalone page number. Historical location accurate.",
        dependencies:"None", postRevisionTest:"Search for standalone digits on own lines" },
  17: { taskType:"artifact",   sprint:"S1-Artifact",   priority:"P0", effort:"15 min",
        primaryTask:"Verify and delete artifact (consistent with Ch.16 pattern)",
        secondaryTask:"Spanish gap 0.0/1k: 1 bilingual moment between Duc's Vietnamese and Ramos's Spanish",
        deltaClsTarget:0, deltaBisTarget:6, deltaSiiTarget:4, deltaMrfTarget:1,
        acceptanceCriteria:"Chapter clean of artifacts. One bilingual moment present.",
        dependencies:"None", postRevisionTest:"Search for standalone diagnostic text" },
  18: { taskType:"sensory",    sprint:"S4-LSTE",        priority:"P3", effort:"1-2 hrs",
        primaryTask:"I-5 bus: heat through vinyl seat + specific sound of highway vs their silence",
        secondaryTask:"Jorge's silence: one object, not one feeling",
        deltaClsTarget:2, deltaBisTarget:2, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"Bus scene has ≥ 2 tactile/auditory anchors.",
        dependencies:"None", postRevisionTest:"Scene passes sensory constant check (3 of 6)" },
  19: { taskType:"protect",    sprint:"Protect",        priority:"P4", effort:"15 min",
        primaryTask:"OMEGA ELITE — verify 50 USC §3802 citation is accurate and current",
        secondaryTask:"Nothing else",
        deltaClsTarget:0, deltaBisTarget:0, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"Ω remains ≥ 107.12. Legal citation verified.",
        dependencies:"None", postRevisionTest:"Legal citation cross-checked" },
  20: { taskType:"codeswitch", sprint:"S4-LSTE",        priority:"P2", effort:"1-2 hrs",
        primaryTask:"Add 1 code-switch: Ramos sees his own name on casualty projection — one Spanish word",
        secondaryTask:"Visual specificity: white chalk on green board vs computer printout",
        deltaClsTarget:0, deltaBisTarget:1, deltaSiiTarget:2, deltaMrfTarget:0,
        acceptanceCriteria:"Code-switch moment at name-recognition. Scene has tactile specificity.",
        dependencies:"None", postRevisionTest:"Ctrl+F confirms Spanish insertion at projection scene" },
  21: { taskType:"sensory",    sprint:"S4-LSTE",        priority:"P2", effort:"2-3 hrs",
        primaryTask:"Add 2 sensory prose bridges in 65%-dialogue chapter",
        secondaryTask:"V:Compassion: moment of mutual recognition before institution swallows both men",
        deltaClsTarget:0, deltaBisTarget:2, deltaSiiTarget:3, deltaMrfTarget:0,
        acceptanceCriteria:"Dialogue % ≤ 55%. Two new prose bridges present.",
        dependencies:"None", postRevisionTest:"Word-count dialogue ratio check" },
  22: { taskType:"artifact",   sprint:"S1-Artifact",   priority:"P0", effort:"15 min",
        primaryTask:"Verify and delete artifact at end of chapter",
        secondaryTask:"Toy soldiers: change Ch.22 'plastic' → 'lead' to match Ch.3",
        deltaClsTarget:2, deltaBisTarget:0, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"Artifact removed. 'lead' consistent across manuscript.",
        dependencies:"Verify Ch.3 uses 'lead'", postRevisionTest:"Ctrl+F 'plastic' in soldier context" },
  23: { taskType:"sensory",    sprint:"S4-LSTE",        priority:"P3", effort:"2-3 hrs",
        primaryTask:"Mitchell's scars: physical specificity — which arm, what pattern, what he says when noticed",
        secondaryTask:"'Faith' 11x: vary 2 instances",
        deltaClsTarget:2, deltaBisTarget:2, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"Mitchell has ≥ 1 physical descriptor. 'faith' ≤ 9x.",
        dependencies:"None", postRevisionTest:"Word count 'faith' confirms reduction" },
  24: { taskType:"artifact",   sprint:"S1-Artifact",   priority:"P0", effort:"15 min",
        primaryTask:"DELETE page number artifact in chapter body text. Omega impact: Ω +3.00",
        secondaryTask:"Post-fix: add 1 code-switch — what Ramos translates in his head when Mitchell gives the order",
        deltaClsTarget:1, deltaBisTarget:0, deltaSiiTarget:2, deltaMrfTarget:0,
        acceptanceCriteria:"No standalone page number. Ω raw 105.51 confirmed after fix.",
        dependencies:"None", postRevisionTest:"Search standalone digits on own lines" },
  25: { taskType:"protect",    sprint:"S4-LSTE",        priority:"P3", effort:"1-2 hrs",
        primaryTask:"Te Deum silence: audit for any word that moves when it should be frozen",
        secondaryTask:"Ramos hears Te Deum in Latin AND Spanish simultaneously — he knew both without knowing",
        deltaClsTarget:1, deltaBisTarget:1, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"Te Deum sequence has ≤ 1 unnecessary modifier. Bilingual moment present.",
        dependencies:"None", postRevisionTest:"Line-by-line stillness audit of ceasefire scene" },
  26: { taskType:"codeswitch", sprint:"S4-LSTE",        priority:"P3", effort:"2 hrs",
        primaryTask:"Spanish gap 0.3/1k: 3 words for 'empire' — Spanish, French, American — one moment",
        secondaryTask:"Expand artillery description: geological scale, not tactical",
        deltaClsTarget:2, deltaBisTarget:1, deltaSiiTarget:3, deltaMrfTarget:0,
        acceptanceCriteria:"At least 1 Spanish word. Artillery description has geological scope.",
        dependencies:"None", postRevisionTest:"Word frequency confirms Spanish insertion" },
  27: { taskType:"restraint",  sprint:"S4-LSTE",        priority:"P2", effort:"1-2 hrs",
        primaryTask:"'brown' 8x in 400-word section — distribute across chapter",
        secondaryTask:"V:Compassion: hunter sees hunted as person — one blink, geometry breaks",
        deltaClsTarget:0, deltaBisTarget:1, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"'brown' distributed evenly. Compassion flash present.",
        dependencies:"None", postRevisionTest:"Word frequency map confirms distribution" },
  28: { taskType:"name",       sprint:"S2-Structural",  priority:"P1", effort:"1 hr",
        primaryTask:"Standardize Duc's radio operator: 'Trong' throughout ALL 45 chapters",
        secondaryTask:"Jorge tests the border — walks across, looks back, walks back",
        deltaClsTarget:1, deltaBisTarget:1, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"'Trung' zero instances. Jorge test-walk scene present.",
        dependencies:"Global find/replace across manuscript", postRevisionTest:"Ctrl+F 'Trung' = 0 results" },
  29: { taskType:"codeswitch", sprint:"S4-LSTE",        priority:"P3", effort:"2-3 hrs",
        primaryTask:"Spanish gap 0.0/1k: Ramos reads same magazine as Duc — 1 Spanish word Duc wouldn't know",
        secondaryTask:"Crosshairs scene: add only the sound of Ramos's breath holding",
        deltaClsTarget:1, deltaBisTarget:2, deltaSiiTarget:2, deltaMrfTarget:1,
        acceptanceCriteria:"At least 1 Spanish insertion. Crosshairs scene has breath sound.",
        dependencies:"None", postRevisionTest:"Confirm Spanish insertion near magazine reference" },
  30: { taskType:"restraint",  sprint:"S4-LSTE",        priority:"P3", effort:"2-3 hrs",
        primaryTask:"CLS gap -2.9: Crawford's language starts failing — sentences fragment, wrong word choices",
        secondaryTask:"Mortar caliber: '81mm' → '82mm' (NVA standard) throughout",
        deltaClsTarget:3, deltaBisTarget:2, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"Crawford's institutional language shows cracks. '82mm' consistent.",
        dependencies:"Check all mortar references across manuscript", postRevisionTest:"Ctrl+F '81mm' confirms fix" },
  31: { taskType:"artifact",   sprint:"S1-Artifact",   priority:"P0", effort:"15 min",
        primaryTask:"Verify and delete artifact (consistent with Act III artifact pattern)",
        secondaryTask:"Expand 400w: the moment BEFORE the refusal — not the refusal itself",
        deltaClsTarget:0, deltaBisTarget:1, deltaSiiTarget:1, deltaMrfTarget:0,
        acceptanceCriteria:"Chapter clean. Pre-refusal expansion present.",
        dependencies:"None", postRevisionTest:"Chapter end confirmed clean" },
  32: { taskType:"name",       sprint:"S2-Structural",  priority:"P1", effort:"30 min",
        primaryTask:"FIX source DOCX heading: 'CORRIDOR OF FIRE: THE MASTERPIEC' → 'MASTERPIECE'",
        secondaryTask:"13 seconds: add specific smell of Senate chamber 2024 vs jungle 1968",
        deltaClsTarget:0, deltaBisTarget:0, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"DOCX heading reads 'MASTERPIECE'. Sensory contrast present.",
        dependencies:"None", postRevisionTest:"DOCX heading confirmed" },
  33: { taskType:"sensory",    sprint:"S4-LSTE",        priority:"P3", effort:"2-3 hrs",
        primaryTask:"Albahaca (holy basil): confirm both scents named explicitly — gunpowder AND albahaca",
        secondaryTask:"Add 1 Boyle Heights location marker existing in both 1968 and 2024",
        deltaClsTarget:2, deltaBisTarget:1, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"'albahaca' present. Boyle Heights anchor present.",
        dependencies:"None", postRevisionTest:"Ctrl+F 'albahaca' confirms presence" },
  34: { taskType:"artifact",   sprint:"S1-Artifact",   priority:"P0", effort:"5 min",
        primaryTask:"DELETE last line: 'PASS 2 COMPLETE — LITCENTRAL HYBRID DIAGNOSTIC'. Omega: Ω +3.00",
        secondaryTask:"Reynolds cross: most specific physical action in Act III — which arm, what pattern, for whom",
        deltaClsTarget:0, deltaBisTarget:1, deltaSiiTarget:0, deltaMrfTarget:1,
        acceptanceCriteria:"Ch.34 ends with story prose. Ω raw 105.69 confirmed.",
        dependencies:"None", postRevisionTest:"Ctrl+End confirms chapter ends with prose" },
  35: { taskType:"seeding",    sprint:"S3-Expansion",  priority:"P2", effort:"2-3 hrs",
        primaryTask:"DIALOGUE 62%: add 2 sensory prose paragraphs — yellow bulb warmth + mosquitoes between sentences",
        secondaryTask:"Seed Ghost Protocol: form with 'George Ramos' listed twice, different serial numbers — one soldier notices, no follow-up",
        deltaClsTarget:2, deltaBisTarget:1, deltaSiiTarget:2, deltaMrfTarget:1,
        acceptanceCriteria:"Dialogue ≤ 52%. GP seed planted. Two new prose bridges.",
        dependencies:"Coordinate GP seed language with Ch.5, Ch.42", postRevisionTest:"Dialogue ratio check + Ctrl+F 'serial'" },
  36: { taskType:"expansion",  sprint:"S3-Expansion",  priority:"P1", effort:"6-8 hrs",
        primaryTask:"EXPAND Ch.36 from 3,706w to 5,000w target — 628-day calculation in Ramos's voice, showing the math",
        secondaryTask:"Verify 628-day calculation from projected KIA date is mathematically precise",
        deltaClsTarget:3, deltaBisTarget:2, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"Word count ≥ 5,000. 628 days mathematically verifiable.",
        dependencies:"None", postRevisionTest:"Word count confirmed. Date math verified." },
  37: { taskType:"sensory",    sprint:"S4-LSTE",        priority:"P3", effort:"2-3 hrs",
        primaryTask:"'Word was Fire': sentence before = silence; sentence after = physical action only",
        secondaryTask:"Mexican national casualty absence: one bureaucratic gap made explicit",
        deltaClsTarget:2, deltaBisTarget:2, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"Sentence placement confirmed. Bureaucratic gap named.",
        dependencies:"None", postRevisionTest:"Check 3-sentence sequence around 'Word was Fire'" },
  38: { taskType:"artifact",   sprint:"S1-Artifact",   priority:"P0", effort:"15 min",
        primaryTask:"Locate and delete artifact. Omega impact: Ω +3.00",
        secondaryTask:"Ramos cradling O'Neil: the sentence he's been carrying since Ch.9 — one line, Spanish",
        deltaClsTarget:1, deltaBisTarget:1, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"Artifact removed. Ω raw 105.26 confirmed. O'Neil sentence present.",
        dependencies:"Cross-reference Ch.9 for callback language", postRevisionTest:"Search for artifact + confirm O'Neil scene" },
  39: { taskType:"protect",    sprint:"Protect",        priority:"P4", effort:"30 min",
        primaryTask:"OMEGA ELITE — verify Medal of Honor citation format is accurate per actual MOH language",
        secondaryTask:"Nothing structural",
        deltaClsTarget:0, deltaBisTarget:0, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"Ω remains ≥ 107.06. MOH citation verified.",
        dependencies:"None", postRevisionTest:"MOH citation format cross-checked" },
  40: { taskType:"timeline",   sprint:"S2-Structural",  priority:"P1", effort:"3-4 hrs",
        primaryTask:"Add explicit DATE/LOCATION stamp to each of 7 KIA deaths (O'Neil=Feb 1968, Williams=Mar, etc.)",
        secondaryTask:"WP wound: add specific sound of burning fabric BEFORE the pork-skin smell",
        deltaClsTarget:3, deltaBisTarget:2, deltaSiiTarget:2, deltaMrfTarget:1,
        acceptanceCriteria:"All 7 deaths have date+grid stamps. WP sequence: sound → smell → sight.",
        dependencies:"Must match Ch.45 testimony dates exactly", postRevisionTest:"Cross-reference all 7 death dates against Ch.45 testimony" },
  41: { taskType:"codeswitch", sprint:"S4-LSTE",        priority:"P2", effort:"2-3 hrs",
        primaryTask:"Wilkins covenant: after 'You speak' — Ramos responds 1 word in Spanish. Wilkins nods.",
        secondaryTask:"Rotor as pulse: add 1 Spanish word timed with the rotor beat",
        deltaClsTarget:2, deltaBisTarget:2, deltaSiiTarget:2, deltaMrfTarget:1,
        acceptanceCriteria:"Spanish response to Wilkins present. Rotor-Spanish sync present.",
        dependencies:"None", postRevisionTest:"Confirm Wilkins covenant sequence" },
  42: { taskType:"expansion",  sprint:"S3-Expansion",  priority:"P1", effort:"6-8 hrs",
        primaryTask:"Expand Ch.42 to 5,800w: seed Ghost Protocol — Joshua notices 'George Ramos' record anomaly from door",
        secondaryTask:"M60 vibration vs Ramos's palm: same warmth, different instruments",
        deltaClsTarget:1, deltaBisTarget:2, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"Word count ≥ 5,800. GP seed planted (anomaly noticed, unfiled).",
        dependencies:"Coordinate GP seed language with Ch.5, Ch.35", postRevisionTest:"Word count + Ctrl+F GP seed text" },
  43: { taskType:"sensory",    sprint:"S4-LSTE",        priority:"P3", effort:"2-3 hrs",
        primaryTask:"Senate chamber sensory void: temperature, microphone distance, carpet color",
        secondaryTask:"Lihn's physical tell: consistent gesture across all her appearances",
        deltaClsTarget:1, deltaBisTarget:3, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"3 sensory anchors in chamber. Lihn gesture established.",
        dependencies:"None", postRevisionTest:"Chamber scene has ≥ 3 physical details" },
  44: { taskType:"sensory",    sprint:"S4-LSTE",        priority:"P3", effort:"2-3 hrs",
        primaryTask:"Susan Acalin dossier: name 3 specific documents inside the red dossier",
        secondaryTask:"Ramos hears Lalo's name: physical reaction ONLY — no interiority, one small movement",
        deltaClsTarget:2, deltaBisTarget:1, deltaSiiTarget:1, deltaMrfTarget:1,
        acceptanceCriteria:"3 document names present. Ramos reaction is pure action.",
        dependencies:"Audit Chs 6-40 for zero Lalo references before completing", postRevisionTest:"Ctrl+F 'Lalo' in Chs 6-40 = 0 results" },
  45: { taskType:"name",       sprint:"S2-Structural",  priority:"P1", effort:"15 min",
        primaryTask:"FIX source DOCX heading: 'Unidos para Sempr' → 'Unidos para Siempre'",
        secondaryTask:"Crawford note: 'I cannot calculate forgiveness' must stand alone on its own line",
        deltaClsTarget:0, deltaBisTarget:0, deltaSiiTarget:0, deltaMrfTarget:0,
        acceptanceCriteria:"DOCX heading reads 'Siempre'. Crawford sentence stands alone.",
        dependencies:"None", postRevisionTest:"DOCX heading confirmed + Crawford line check" },
};

// ── Ω Delta Calculator formula ────────────────────────────────────────────────
function calcOmegaDelta(dCLS, dBIS, dSII, dMRF, artifactBonus, structBonus) {
  return +(0.124 * dCLS + 0.118 * dBIS + 0.089 * dSII + 0.067 * dMRF + (artifactBonus||0) + (structBonus||0)).toFixed(3);
}

const PRIORITY_STYLES = {
  "P0":      "text-red border-red/40 bg-red/10",
  "P0-CRIT": "text-red border-red/40 bg-red/10",
  "P1":      "text-gold border-gold/30 bg-gold/5",
  "P2":      "text-blue border-blue/30 bg-blue/5",
  "P3":      "text-muted-foreground border-border bg-card",
  "P4":      "text-teal border-teal/30 bg-teal/5",
};

const STATUS_CYCLE = ["OPEN","IN_PROG","DONE"];
const STATUS_STYLES = {
  OPEN:    "text-red/70 border-red/30 bg-red/5",
  IN_PROG: "text-gold border-gold/30 bg-gold/5",
  DONE:    "text-teal border-teal/30 bg-teal/5",
};

// ── Main component ─────────────────────────────────────────────────────────── 
export default function RemediationTab() {
  const [view, setView]       = useState("matrix");
  const [statuses, setStatuses] = useState(() => {
    const s = {};
    Object.keys(REMEDIATION).forEach(k => { s[k] = "OPEN"; });
    return s;
  });
  const [selCh, setSelCh]     = useState(null);
  const [filterSprint, setFilterSprint] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  // Ω calculator state
  const [calcCh, setCalcCh]   = useState(1);
  const [dCLS, setDcls]       = useState(0);
  const [dBIS, setDbis]       = useState(0);
  const [dSII, setDsii]       = useState(0);
  const [dMRF, setDmrf]       = useState(0);
  const [artBonus, setArtBonus] = useState(0);
  const [strBonus, setStrBonus] = useState(0);

  const cycleStatus = (ch) => setStatuses(p => {
    const cur = STATUS_CYCLE.indexOf(p[ch]);
    return { ...p, [ch]: STATUS_CYCLE[(cur + 1) % 3] };
  });

  const doneCount   = Object.values(statuses).filter(s => s === "DONE").length;
  const inProgCount = Object.values(statuses).filter(s => s === "IN_PROG").length;
  const pct         = Math.round((doneCount / 45) * 100);

  // Sprint bucket counts
  const sprintCounts = Object.values(REMEDIATION).reduce((acc, r) => {
    acc[r.sprint] = (acc[r.sprint] || 0) + 1; return acc;
  }, {});

  const filtered = useMemo(() => {
    return REVISION_MATRIX.filter(c => {
      const rem = REMEDIATION[c.ch];
      if (!rem) return false;
      if (filterSprint !== "all" && rem.sprint !== filterSprint) return false;
      if (filterPriority !== "all" && rem.priority !== filterPriority) return false;
      return true;
    });
  }, [filterSprint, filterPriority]);

  const selChData   = selCh ? REVISION_MATRIX.find(c => c.ch === selCh) : null;
  const selChRem    = selCh ? REMEDIATION[selCh] : null;

  // Omega delta for calculator
  const calcBase    = REVISION_MATRIX.find(c => c.ch === calcCh);
  const omegaDelta  = calcOmegaDelta(+dCLS, +dBIS, +dSII, +dMRF, +artBonus, +strBonus);
  const newOmega    = calcBase ? +(calcBase.omegaEff + omegaDelta).toFixed(3) : 0;

  const VIEWS = [
    { id:"matrix",    label:"45-Row Matrix" },
    { id:"clusters",  label:"Sprint Clusters" },
    { id:"calc",      label:"Ω Calculator" },
    { id:"tasklog",   label:"Task Register" },
  ];

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="bg-card border border-gold/30 rounded-lg p-4">
        <div className="text-xs font-bold text-gold font-mono mb-0.5">
          SGT GEORGE RAMOS — PER-CHAPTER REMEDIATION ROADMAP · 45 Chapters · v12 Authoritative
        </div>
        <div className="text-[10px] text-muted-foreground font-sans mb-3">
          Ω_new ≈ Ω_eff_old + 0.124·ΔCLS + 0.118·ΔBIS + 0.089·ΔSII + 0.067·ΔMRF + α_artifact + β_structure
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="text-center">
            <div className="text-xl font-black font-mono text-gold">{pct}%</div>
            <div className="text-[8px] text-muted-foreground font-mono">DONE</div>
            <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full" style={{width:`${pct}%`}} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black font-mono text-red">{Object.values(statuses).filter(s=>s==="OPEN").length}</div>
            <div className="text-[8px] text-muted-foreground font-mono">OPEN</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black font-mono text-gold">{inProgCount}</div>
            <div className="text-[8px] text-muted-foreground font-mono">IN PROG</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black font-mono text-teal">{doneCount}</div>
            <div className="text-[8px] text-muted-foreground font-mono">DONE</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black font-mono text-blue">
              {Object.values(statuses).filter((s,i) => {
                const ch = Object.keys(REMEDIATION)[i];
                return s === "DONE" && REMEDIATION[ch]?.priority === "P0";
              }).length}/{Object.values(REMEDIATION).filter(r => r.priority === "P0").length}
            </div>
            <div className="text-[8px] text-muted-foreground font-mono">P0 DONE</div>
          </div>
        </div>
      </div>

      {/* View switcher */}
      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono border transition-all ${
              view === v.id ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"
            }`}>{v.label}</button>
        ))}
      </div>

      {/* ── 45-ROW MATRIX ── */}
      {view === "matrix" && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilterSprint("all")}
              className={`px-2 py-1 text-[9px] font-mono font-bold rounded border transition-all ${filterSprint==="all" ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground"}`}>
              All Sprints
            </button>
            {Object.entries(CLUSTERS).map(([id, c]) => (
              <button key={id} onClick={() => setFilterSprint(id)}
                className={`px-2 py-1 text-[9px] font-mono font-bold rounded border transition-all border-${c.color}/40 ${filterSprint===id ? `bg-${c.color}/20 text-${c.color}` : "text-muted-foreground"}`}>
                {id}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Chapter list */}
            <div className="lg:col-span-1 max-h-[640px] overflow-y-auto space-y-1 pr-1">
              {filtered.map(c => {
                const rem  = REMEDIATION[c.ch];
                const st   = statuses[c.ch];
                const tc   = TASK_TYPES[rem.taskType];
                const isSelected = selCh === c.ch;
                const penalty = c.omegaRaw > c.omegaEff;
                return (
                  <div key={c.ch} onClick={() => setSelCh(isSelected ? null : c.ch)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${isSelected ? "bg-accent/10 border-accent" : "bg-card border-border hover:bg-secondary/20"}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-muted-foreground w-5 flex-shrink-0">{c.ch}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-bold truncate ${penalty ? "text-red" : "text-foreground"}`}>
                          {c.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[8px] font-mono font-bold text-${tc?.color}`}>{tc?.label}</span>
                          <span className="text-[8px] font-mono text-gold font-bold">{c.omegaEff.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`text-[7px] font-bold font-mono px-1 py-0.5 rounded border ${PRIORITY_STYLES[rem.priority] || PRIORITY_STYLES.P3}`}>{rem.priority}</span>
                        <button onClick={(e) => { e.stopPropagation(); cycleStatus(c.ch); }}
                          className={`text-[7px] font-bold font-mono px-1 py-0.5 rounded border ${STATUS_STYLES[st]}`}>{st === "IN_PROG" ? "IN P" : st}</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-2">
              {!selChData ? (
                <div className="h-64 flex items-center justify-center text-center border border-border rounded-lg bg-card/50">
                  <div>
                    <div className="text-2xl mb-2">📋</div>
                    <div className="text-xs font-bold text-foreground">Select a chapter</div>
                    <div className="text-[10px] text-muted-foreground mt-1">Full remediation brief with targets and acceptance criteria</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-slide-up">
                  {/* Chapter header */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-mono text-muted-foreground">Ch.{selChData.ch} · Act {selChData.act}</span>
                          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[selChRem.priority]}`}>{selChRem.priority}</span>
                          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLES[statuses[selCh]]}`}>{statuses[selCh]}</span>
                        </div>
                        <div className="text-sm font-black text-foreground font-mono">{selChData.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{selChData.words.toLocaleString()}w · {selChRem.effort} · {CLUSTERS[selChRem.sprint]?.label}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-black font-mono text-gold">{selChData.omegaEff.toFixed(2)}</div>
                        {selChData.omegaRaw > selChData.omegaEff && (
                          <div className="text-[9px] text-red font-mono">artifact −{(selChData.omegaRaw-selChData.omegaEff).toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tasks */}
                  <DashCard title="Remediation Tasks" accent={TASK_TYPES[selChRem.taskType]?.color || "gold"}>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-md bg-red/5 border border-red/20 text-[10px] font-sans">
                        <div className="text-[9px] font-bold text-red font-mono mb-1">PRIMARY TASK</div>
                        {selChRem.primaryTask}
                      </div>
                      {selChRem.secondaryTask && (
                        <div className="p-2.5 rounded-md bg-card border border-border text-[10px] font-sans text-foreground/80">
                          <div className="text-[9px] font-bold text-muted-foreground font-mono mb-1">SECONDARY TASK</div>
                          {selChRem.secondaryTask}
                        </div>
                      )}
                    </div>
                  </DashCard>

                  {/* Delta targets */}
                  <DashCard title="Target Score Deltas (Ω formula components)" accent="blue">
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[
                        { var:"ΔCLS", val:selChRem.deltaClsTarget, beta:"β 0.124", color:"purple" },
                        { var:"ΔBIS", val:selChRem.deltaBisTarget, beta:"β 0.118", color:"orange" },
                        { var:"ΔSII", val:selChRem.deltaSiiTarget, beta:"β 0.089", color:"cyan"   },
                        { var:"ΔMRF", val:selChRem.deltaMrfTarget, beta:"β 0.067", color:"blue"   },
                      ].map(d => {
                        const contrib = d.var === "ΔCLS" ? 0.124*d.val : d.var === "ΔBIS" ? 0.118*d.val : d.var === "ΔSII" ? 0.089*d.val : 0.067*d.val;
                        return (
                          <div key={d.var} className="text-center bg-background border border-border rounded-md p-2">
                            <div className={`text-lg font-black font-mono text-${d.color}`}>{d.val > 0 ? "+" : ""}{d.val}</div>
                            <div className={`text-[8px] font-mono text-${d.color}`}>{d.var}</div>
                            <div className="text-[8px] text-muted-foreground font-mono">{d.beta}</div>
                            <div className={`text-[8px] font-bold font-mono ${contrib > 0 ? "text-teal" : "text-muted-foreground"}`}>
                              {contrib > 0 ? `+${contrib.toFixed(3)} Ω` : "—"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-gold/5 border border-gold/20">
                      <span className="text-[10px] font-mono text-muted-foreground">Est. Ω gain from deltas:</span>
                      <span className="text-sm font-black text-gold font-mono">
                        +{calcOmegaDelta(selChRem.deltaClsTarget, selChRem.deltaBisTarget, selChRem.deltaSiiTarget, selChRem.deltaMrfTarget, 0, 0).toFixed(3)}
                      </span>
                    </div>
                  </DashCard>

                  {/* Acceptance + dependencies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-teal/5 border border-teal/20 rounded-lg p-3">
                      <div className="text-[9px] font-bold font-mono text-teal mb-2">ACCEPTANCE CRITERIA</div>
                      <div className="text-[10px] font-sans text-foreground/80">{selChRem.acceptanceCriteria}</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3">
                      <div className="text-[9px] font-bold font-mono text-muted-foreground mb-2">DEPENDENCIES</div>
                      <div className="text-[10px] font-sans text-foreground/80 mb-2">{selChRem.dependencies}</div>
                      <div className="text-[9px] font-bold font-mono text-muted-foreground mt-2 mb-1">POST-REVISION TEST</div>
                      <div className="text-[10px] font-sans text-foreground/80">{selChRem.postRevisionTest}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {STATUS_CYCLE.map(s => (
                      <button key={s} onClick={() => setStatuses(p => ({...p, [selCh]: s}))}
                        className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md border transition-all ${statuses[selCh]===s ? STATUS_STYLES[s] : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {s === "IN_PROG" ? "IN PROGRESS" : s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SPRINT CLUSTERS ── */}
      {view === "clusters" && (
        <div className="space-y-4">
          {Object.entries(CLUSTERS).map(([sprintId, cluster]) => {
            const chapters = REVISION_MATRIX.filter(c => REMEDIATION[c.ch]?.sprint === sprintId);
            const done = chapters.filter(c => statuses[c.ch] === "DONE").length;
            return (
              <DashCard key={sprintId} title={`${cluster.label} · ${cluster.desc}`} accent={cluster.color}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{width:`${chapters.length ? (done/chapters.length)*100 : 0}%`,
                        backgroundColor: cluster.color==="red"?"#FF5C5C":cluster.color==="orange"?"#F97316":cluster.color==="blue"?"#4A9EFF":cluster.color==="teal"?"#1CCFB4":"#F5C842"
                      }} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{done}/{chapters.length}</span>
                </div>
                <div className="space-y-1.5">
                  {chapters.map(c => {
                    const rem = REMEDIATION[c.ch];
                    const st  = statuses[c.ch];
                    return (
                      <div key={c.ch} onClick={() => cycleStatus(c.ch)}
                        className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer hover:bg-secondary/20 transition-colors ${STATUS_STYLES[st] || STATUS_STYLES.OPEN}`}>
                        <span className="text-[9px] font-mono w-5 flex-shrink-0 text-muted-foreground">{c.ch}</span>
                        <span className={`text-[8px] font-bold font-mono w-12 flex-shrink-0 ${PRIORITY_STYLES[rem.priority]?.split(" ")[0]}`}>{rem.priority}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-foreground truncate">{c.title}</div>
                          <div className="text-[9px] text-muted-foreground font-sans truncate">{rem.primaryTask}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[8px] font-mono text-muted-foreground">{rem.effort}</span>
                          <span className={`text-[7px] font-bold font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLES[st]}`}>{st === "IN_PROG" ? "IN P" : st}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DashCard>
            );
          })}
        </div>
      )}

      {/* ── Ω CALCULATOR ── */}
      {view === "calc" && (
        <div className="space-y-4">
          <DashCard title="Live Ω Delta Calculator — Hybrid Formula" accent="gold">
            <div className="text-[10px] text-muted-foreground font-mono bg-background border border-border rounded-md p-2 mb-4">
              Ω_new = Ω_eff_old + 0.124·ΔCLS + 0.118·ΔBIS + 0.089·ΔSII + 0.067·ΔMRF + α_artifact + β_structure
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-muted-foreground block mb-1">Select Chapter</label>
                  <select value={calcCh} onChange={e => setCalcCh(+e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-card border border-border rounded-md text-foreground focus:outline-none focus:border-gold/50">
                    {REVISION_MATRIX.map(c => (
                      <option key={c.ch} value={c.ch}>Ch.{c.ch} — {c.title} (Ω {c.omegaEff.toFixed(2)})</option>
                    ))}
                  </select>
                </div>
                {[
                  { label:"ΔCLS (β 0.124)", val:dCLS, set:setDcls, color:"purple" },
                  { label:"ΔBIS (β 0.118)", val:dBIS, set:setDbis, color:"orange" },
                  { label:"ΔSII (β 0.089)", val:dSII, set:setDsii, color:"cyan"   },
                  { label:"ΔMRF (β 0.067)", val:dMRF, set:setDmrf, color:"blue"   },
                  { label:"Artifact bonus (e.g. +3.00)", val:artBonus, set:setArtBonus, color:"red"   },
                  { label:"Structural bonus",             val:strBonus, set:setStrBonus, color:"gold"  },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <label className={`w-40 text-[10px] font-mono text-${f.color} flex-shrink-0`}>{f.label}</label>
                    <input type="number" step="0.5" value={f.val} onChange={e => f.set(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs font-mono bg-card border border-border rounded text-foreground focus:outline-none focus:border-gold/50" />
                    <span className="text-[10px] text-teal font-mono w-16 text-right">
                      {(f.label.includes("bonus") ? +f.val : (f.label.includes("CLS") ? 0.124 : f.label.includes("BIS") ? 0.118 : f.label.includes("SII") ? 0.089 : 0.067) * +f.val).toFixed(3)} Ω
                    </span>
                  </div>
                ))}
              </div>
              {/* Result */}
              <div className="flex flex-col gap-4">
                <div className="bg-gold/10 border border-gold/40 rounded-xl p-6 text-center">
                  <div className="text-[10px] text-muted-foreground font-mono mb-2">CURRENT Ω EFF</div>
                  <div className="text-4xl font-black font-mono text-foreground mb-2">{calcBase?.omegaEff.toFixed(2) || "—"}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mb-4">+ formula delta</div>
                  <div className={`text-2xl font-bold font-mono ${omegaDelta >= 0 ? "text-teal" : "text-red"}`}>
                    {omegaDelta >= 0 ? "+" : ""}{omegaDelta.toFixed(3)} Ω
                  </div>
                  <div className="mt-4 pt-4 border-t border-gold/30">
                    <div className="text-[10px] text-muted-foreground font-mono mb-1">PROJECTED Ω EFF</div>
                    <div className={`text-5xl font-black font-mono ${newOmega >= 107 ? "text-gold" : newOmega >= 106 ? "text-gold" : "text-foreground"}`}>
                      {newOmega.toFixed(3)}
                    </div>
                    <div className="text-[10px] font-mono mt-2">
                      {newOmega >= 107 ? "★ OMEGA ELITE" : newOmega >= 106 ? "GOLD+" : "GOLD"}
                    </div>
                  </div>
                </div>
                {/* CL-MoE estimate */}
                {calcBase && (
                  <div className="bg-card border border-border rounded-lg p-3 text-[10px] font-mono">
                    <div className="text-muted-foreground mb-2">CL-MoE Δ estimate (planning approximation):</div>
                    <div className="text-teal font-bold">
                      ΔCL-MoE ≈ {(0.0031*(+dCLS) + 0.0030*(+dBIS) + 0.0022*(+dSII) + 0.0017*(+dMRF)).toFixed(4)}
                    </div>
                    <div className="text-muted-foreground mt-1">
                      New CL-MoE est: {+(calcBase.clMoE + 0.0031*(+dCLS) + 0.0030*(+dBIS) + 0.0022*(+dSII) + 0.0017*(+dMRF)).toFixed(4)}
                    </div>
                    <div className="text-[8px] text-muted-foreground/60 mt-2">
                      ⚠ Planning approximation from chapter matrix — not external validation
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DashCard>
        </div>
      )}

      {/* ── TASK REGISTER ── */}
      {view === "tasklog" && (
        <DashCard title="Task Register — Sprint-Ordered Execution Log · 45 Chapters" accent="blue">
          <div className="flex gap-2 mb-3 flex-wrap">
            {["all","P0","P0-CRIT","P1","P2","P3","P4"].map(p => (
              <button key={p} onClick={() => setFilterPriority(p)}
                className={`px-2 py-1 text-[9px] font-mono font-bold rounded border transition-all ${
                  filterPriority === p ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground"
                }`}>{p}</button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px] font-mono">
              <thead>
                <tr className="border-b border-border text-[8px] text-muted-foreground">
                  <th className="text-left py-2 pr-2 w-6">#</th>
                  <th className="text-left py-2 pr-2">Title</th>
                  <th className="text-center py-2 pr-2">Pri</th>
                  <th className="text-left py-2 pr-2">Sprint</th>
                  <th className="text-left py-2 pr-2">Task Type</th>
                  <th className="text-right py-2 pr-2">Ω Eff</th>
                  <th className="text-right py-2 pr-2">Est. Gain</th>
                  <th className="text-center py-2 pr-2">Effort</th>
                  <th className="text-center py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {REVISION_MATRIX
                  .filter(c => {
                    const rem = REMEDIATION[c.ch];
                    if (!rem) return false;
                    if (filterPriority !== "all" && rem.priority !== filterPriority) return false;
                    return true;
                  })
                  .sort((a, b) => {
                    const order = ["P0","P0-CRIT","P1","P2","P3","P4"];
                    const pa = order.indexOf(REMEDIATION[a.ch]?.priority || "P4");
                    const pb = order.indexOf(REMEDIATION[b.ch]?.priority || "P4");
                    return pa - pb;
                  })
                  .map(c => {
                    const rem = REMEDIATION[c.ch];
                    const st  = statuses[c.ch];
                    const tc  = TASK_TYPES[rem.taskType];
                    const gain = calcOmegaDelta(rem.deltaClsTarget, rem.deltaBisTarget, rem.deltaSiiTarget, rem.deltaMrfTarget, 0, 0);
                    const artifactBonus = rem.primaryTask.includes("DELETE") || rem.primaryTask.includes("delete") || rem.primaryTask.includes("Verify and delete") ? 3.0 : 0;
                    const totalGain = +(gain + artifactBonus).toFixed(3);
                    return (
                      <tr key={c.ch} onClick={() => cycleStatus(c.ch)}
                        className={`border-b border-border/30 hover:bg-secondary/20 cursor-pointer ${st==="DONE" ? "opacity-50" : ""}`}>
                        <td className="py-1.5 pr-2 text-muted-foreground">{c.ch}</td>
                        <td className="py-1.5 pr-2 max-w-[140px] truncate text-foreground">{c.title}</td>
                        <td className={`py-1.5 pr-2 text-center font-bold ${PRIORITY_STYLES[rem.priority]?.split(" ")[0]}`}>{rem.priority}</td>
                        <td className="py-1.5 pr-2 text-muted-foreground">{rem.sprint.replace("S1-","S1 ").replace("S2-","S2 ").replace("S3-","S3 ").replace("S4-","S4 ")}</td>
                        <td className={`py-1.5 pr-2 text-${tc?.color}`}>{tc?.label}</td>
                        <td className="py-1.5 pr-2 text-right text-gold font-bold">{c.omegaEff.toFixed(2)}</td>
                        <td className={`py-1.5 pr-2 text-right font-bold ${totalGain >= 1 ? "text-teal" : totalGain >= 0.3 ? "text-gold" : "text-muted-foreground"}`}>
                          +{totalGain}
                        </td>
                        <td className="py-1.5 pr-2 text-center text-muted-foreground">{rem.effort}</td>
                        <td className="py-1.5 text-center">
                          <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded border ${STATUS_STYLES[st]}`}>
                            {st === "IN_PROG" ? "IN P" : st}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </DashCard>
      )}
    </div>
  );
}