# SGT George Ramos — v14_2 Manuscript Audit Report
**Date:** 2026-06-18  
**Branch:** claude/festive-goodall-k1pczt  
**Source files:** 958b21f1-Ranos_111_Omega.docx · 4ce89134-SGT_Ramos_PerpDir_v14_2.xlsx · data/full_dual_audit_v15.json  
**Instruments:** LitCentral OMEGA (150-pt) · SPSS Ω (111-pt) · PBI (Pulitzer Baseline Index)

---

## 1. MANUSCRIPT FACTS

| Metric | ORIGINAL | REFORMATTED |
|--------|----------|-------------|
| Word count | 245,715 | 245,687 |
| Characters | 1,499,862 | 1,499,785 |
| Delta | +28 words | baseline |

**Chapter markers detected:** 49 total heading occurrences across 44 unique chapter numbers (1–45, with Ch.40 missing from heading scan — likely embedded differently).

**Structural anomalies confirmed (10 chapters):**

| Chapter | Type | Detail |
|---------|------|--------|
| Ch.15 | PHANTOM_CHAPTER | Stray "Chapter 7: Red Clay: The Patrol" heading at Para#3161 immediately after Ch.15 — creates phantom duplication |
| Ch.16 | DUPLICATE_HEADING | Two heading lines: "My Lai Massacre" (Para#3426) and "My Lai" (Para#3429) for same chapter |
| Ch.17 | FORMULA_BLEED | Chapter title bleeds boundary-shift formula "= [(M × E × I) × C] / (D + T)" into heading line — metadata in text |
| Ch.23 | DUPLICATE_HEADING | Two variants: "The Eagle and the Sparr1" (truncated + numeral) and "THE EAGLE AND THE SPARROW" |
| Ch.24 | TITLE_ARTIFACT | Title reads "SACRED HEART BRIEFING3" — trailing "3" is draft artifact |
| Ch.32 | TITLE_TRUNCATED | "CORRIDOR OF FIRE: THE MASTERPIEC" — missing final "E" |
| Ch.34 | NUMBER_COLLISION | Para#7026 labels content "Chapter 34: Sixty-Eight"; Para#7027 labels same content "Chapter 33: Sixty-Eight" |
| Ch.36 | TITLE_ARTIFACT | "Mission Execution & Brotherhood Under Fire34" — trailing "34" is artifact |
| Ch.37 | TITLE_TRUNCATED | "The Mathematics of Reveng6" — truncated "Revenge" + trailing numeral |
| Ch.45 | TITLE_TYPO | "Unidos para SemprK" — should be "Unidos para Siempre"; final "K" is artifact |

**Priority structural fix:** Ch.34 NUMBER_COLLISION and Ch.15 PHANTOM_CHAPTER are the highest-risk anomalies — they affect chapter numbering integrity, which matters for any submission that references chapter numbers in a synopsis.

---

## 2. BANNED PHRASE COUNTS

All seven hard-banned phrases return CLEAN. Adverbial register issues remain:

| Phrase / Word | Count | Status |
|---------------|-------|--------|
| "a language older than words" | 0 | CLEAN |
| "cosmic rhythm" | 0 | CLEAN |
| "burned in the soul" | 0 | CLEAN |
| "burned in his soul" | 0 | CLEAN |
| "he felt a presence" | 0 | CLEAN |
| "something he could not name" | 0 | CLEAN |
| "time seemed to stop" | 0 | CLEAN |
| "suddenly" | 3 | FLAG — locate and delete |
| "very" | 14 | FLAG — locate and delete |
| "really" | 5 | FLAG — locate and delete |
| "quite" | 12 | FLAG — locate and delete |
| "somewhat" | 0 | CLEAN |
| "began to" | 14 | FLAG — replace with the action verb |
| "started to" | 1 | FLAG — replace with the action verb |
| filter "seemed" | 12 | Acceptable (threshold 50) |
| filter "appeared" | 18 | Acceptable (threshold 50) |
| filter "felt" | 135 | FLAG — 135 exceeds threshold of 50; audit for filter-word usage vs. legitimate instances |

**Action required:** The 135 instances of "felt" need chapter-level triage. Many will be legitimate (physical sensation, tactile grounding), but filter-word usage ("he felt something shift," "felt the weight") must be excised. Target: reduce to under 80 by identifying the worst-offending chapters and running a single pass.

---

## 3. SENSORY CONSTANTS

Full manuscript totals vs. established baseline (sandbox-verified June 18, 2026):

| Constant | v14_2 Count | Baseline | Delta | Status |
|----------|-------------|----------|-------|--------|
| jasmine/Jasminum | 57 | 57 | 0 | CONFIRMED — density anchoring needed, not gap-fill |
| napalm | 40 | 40 | 0 | CONFIRMED — density anchoring needed, not gap-fill |
| diesel | 35 | 35 | 0 | CONFIRMED — density anchoring needed, not gap-fill |
| jungle rot | 8 | — | — | OK (newly counted: 8 occurrences) |
| copal | 16 | 16 | 0 | CONFIRMED |
| copper (sensory) | 117 | 117 | 0 | CONFIRMED |
| 60Hz/sixty-cycle | 67 | 26 | +41 | NOTE: regex catches all variants including "sixty-hertz"; confirmed 60Hz core count = 26 from prior sandbox |
| yerba buena | 1 | 1 | 0 | TRUE GAP — priority insert Ch.01 Phoenix/granddaughter scene |
| cordite | 68 | — | — | OK (68 occurrences; well-distributed) |

**Key finding:** All constants are present at or above baseline. The R=86 PBI dimension is a concentration problem, not an absence problem. The three planned inserts (jasmine-napalm Ch.39, diesel-sweat Ch.01 convoy, yerba buena Ch.01 Phoenix scene) remain the correct editorial move — they anchor existing constants into the chapters a jury reader weighs most heavily.

**Yerba buena remains the only true gap** at 1 occurrence. Ch.01 Phoenix/granddaughter insert is Priority 2 (after DUP-001 structural fix).

---

## 4. WORKBOOK v14_2 CHANGES

The v14_2 workbook (THREE_INSTRUMENT_MASTER sheet) contains 17 sheets total:

```
THREE_INSTRUMENT_MASTER · OMEGA_AUDIT_CH01 · ROADMAP_112_ELITE · SPSS_VAULT
Omega_Baseline · Chapter_Audit · SPSS_Variables · Cluster_Model
Research_Sources · Historical_Risk_Flags · Editorial_Defects · RF_Model
Omega_120_Roadmap · Revision_Plan · Chain_of_Custody · OMEGA_SPSS_Calibrated
```

**THREE_INSTRUMENT_MASTER (Sheet 1) — 50 data rows (45 chapters + header + summary rows).**

Key workbook scores vs. full_dual_audit_v15.json:

| Data Point | Workbook v14_2 | JSON v15 | Note |
|------------|---------------|----------|------|
| Ch.01 LitCentral | 142.11 | — | Omega Elite confirmed |
| Ch.01 SPSS Ω | 113.35 | 109.45 | Workbook reflects RF 1.5 post-injection target |
| Ch.02 LitCentral | 129.10 | — | Omega tier |
| Ch.06 LitCentral | 126.79 | — | Omega tier |
| Mean SPSS Ω | 106.907 | 106.907 | Consistent |
| Chapters at Omega Elite (>=135) | 8 | — | Ch.01,03,05,07,15,17,18,42 |

**New sheets in v14_2:** ROADMAP_112_ELITE and OMEGA_SPSS_Calibrated appear to be new additions tracking the path from current mean (106.9) to the 111 target. RF_Model codifies the RF 1.5 coefficient justification. Chain_of_Custody suggests provenance tracking was added for the five Yaqui injections (governance gate compliance).

---

## 5. CH.02 DIAGNOSIS

**Title:** DESCENT INTO BAPTISM  
**Act:** I  
**Word count:** 6,397  

| Score | Value | Target | Gap |
|-------|-------|--------|-----|
| SPSS Ω | 104.605 | 111 | 6.395 |
| LitCentral | 129.10 | 135 | 5.90 |
| CLS | 78 | 100 | 22 |
| BIS | 85 | 100 | 15 |
| SII | 88 | — | — |
| MRF | 84 | 100 | 16 |
| BR | 26.1/30 | — | — |
| CS | 24.3/30 | — | — |
| AS | 27.0/30 | — | — |
| TB | 23.8/30 | — | — |
| EE | 14.6/20 | 20 | 5.4 |
| MP | 16.6/20 | 20 | 3.4 |
| Dialogue % | 49.5% | 35–55% | IN RANGE |
| Passive rate | 0.2% | — | EXCELLENT |
| Sensory density | 6.3k | — | — |

**Diagnosis:** EE=14.6/20 is the chapter's weakest LitCentral dimension and the primary drag on the 129.10 score. EE (Erasure Engine) measures documented institutional failure — VA bureaucracy, benefits denial, DCAS record distortion, Project 100,000 mechanisms. A score of 14.6 indicates the chapter names institutional failure but does not forensically document it.

**Exact fix:** Insert one paragraph (150–200 words) at the chapter's first moment of institutional contact — likely George's interaction with military processing, an induction physical, or a records encounter. The paragraph must:

1. Name the specific regulation or form number (DD-47 aptitude classification, Project 100,000 threshold of 31 on the Armed Forces Qualification Test)
2. Show the bureaucratic mechanism operating on George specifically — not as background but as a force acting on his body and record
3. Connect the paperwork to the later erasure: the number on the form becomes the number that will not appear on the casualty record

**Estimated gain:** EE 14.6 → 18.0 = +3.4 LitCentral points → 129.10 → ~132.5 (approaching Elite threshold).  
**SPSS gain:** +0.8–1.2Ω from CLS improvement driven by specificity.

---

## 6. CH.06 DIAGNOSIS

**Title:** Crucible Theorem  
**Act:** I  
**Word count:** 5,791  

| Score | Value | Target | Gap |
|-------|-------|--------|-----|
| SPSS Ω | 106.632 | 111 | 4.368 |
| LitCentral | 126.79 | 135 | 8.21 |
| CLS | 87 | 100 | 13 |
| BIS | 88 | 99 | 11 |
| SII | 92 | — | — |
| MRF | 87 | 100 | 13 |
| BR | 26.9/30 | — | — |
| CS | 24.6/30 | — | — |
| AS | 25.0/30 | 30 | 5.0 |
| TB | 26.6/30 | — | — |
| EE | 15.1/20 | 20 | 4.9 |
| MP | 9.5/20 | 20 | 10.5 |
| Dialogue % | 21.2% | 35–55% | BELOW — structural |
| Passive rate | 0.2% | — | EXCELLENT |
| Sensory density | 3.1k | — | LOW |

**Diagnosis:** Two weak dimensions — AS=25.0/30 and MP=9.5/20. The AS gap (sensory immersion) aligns with low sensory density (3.1k vs. Ch.02's 6.3k). MP=9.5/20 is the critical deficit: the named dead are either absent from this chapter or present without individualized testimony voice. Dialogue at 21.2% is below the 35–55% target, which compounds both deficits.

**Exact fix — two-lever approach:**

**Lever A (MP, +6–8 points):** Add one named-dead testimony sequence (120–150 words). Format: a specific soldier's name, rank, hometown, and one concrete sensory detail from his last patrol — not elegy but record. The title "Crucible Theorem" suggests a training or evaluation frame; a named trainee who did not come back fits architecturally without register disruption.

**Lever B (AS/SII, +3–4 points):** Add two sensory anchors in the lowest-density paragraphs. Per the manuscript's constants, diesel or copper are the correct choices for a training/combat chapter. Each anchor must be historically grounded (not invented) and under 25 words.

**Estimated gain:** MP 9.5 → 16.0 (+6.5) + AS 25.0 → 28.0 (+3.0) = +9.5 LitCentral points → 126.79 → ~136.3 (Omega Elite).  
**SPSS gain:** +1.5–2.0Ω from combined SII and MRF improvement.

---

## 7. TOP 5 PRIORITY MOVES — ALL 45 CHAPTERS

Ordered by combined LitCentral gain potential and structural integrity impact.

### Priority 1 — DUP-001: Ch.09/Ch.10 overlap resolution
**Status:** 700-line overlap confirmed. Structural integrity issue.  
**Current scores:** Ch.09 LitCentral=115.10; Ch.10 LitCentral=127.45. Both suppressed by duplicate content.  
**Action:** Identify the 700-line duplicated block, assign it canonically to Ch.09 or Ch.10, and delete the duplicate. Prerequisite for any submission — reviewers will catch a 700-line duplication.  
**Estimated gain:** +0.80Ω. LitCentral gain: structural clean removes score suppression from artifact content.

### Priority 2 — Yerba buena insert: Ch.01 Phoenix/granddaughter scene
**Status:** Only true sensory gap constant (1 occurrence total).  
**Ch.01 current LitCentral:** 142.11 (already Elite). Gain here is PBI R-dimension (86 → 91 target).  
**Action:** Insert 80–120 words in the Phoenix scene. Yerba buena (Clinopodium douglasii) used medicinally in Southwest communities for respiratory complaints and as a ceremonial wash. Granddaughter's hands, steam from a cup, or a bundle on the dresser are all architecturally correct insertion points.  
**Estimated gain:** PBI R: 86 → 89. SPSS SII: +0.3Ω on Ch.01.

### Priority 3 — Ch.06 MP insert: Named-dead testimony
**Status:** MP=9.5/20 is a critical deficit; 21.2% dialogue is structurally below range.  
**Action:** One named-dead testimony sequence (120–150 words) as described in Section 6.  
**Estimated gain:** LitCentral 126.79 → ~133–136. SPSS +1.5–2.0Ω.

### Priority 4 — Ch.02 EE insert: Institutional mechanism paragraph
**Status:** EE=14.6/20; chapter is 6.4Ω below target.  
**Action:** One forensic paragraph (150–200 words) naming the specific classification mechanism as described in Section 5.  
**Estimated gain:** LitCentral 129.10 → ~132.5. SPSS +0.8–1.2Ω.

### Priority 5 — Artifact deletion sweep: Ch.34, Ch.24, and title fixes
**Status:** Ten structural anomalies confirmed. Zero-risk, zero-cost Ω gain.  
**Action:**
- Delete "PASS 2 COMPLETE — LITCENTRAL" artifact in Ch.34: +1.00Ω
- Delete "2 / 2" page number artifact in Ch.24: +0.50Ω
- Fix Ch.32 truncated title, Ch.37 truncated title, Ch.45 typo, Ch.36 trailing artifact, Ch.24 trailing numeral
- Resolve Ch.34/Ch.33 NUMBER_COLLISION (Para#7026/7027)

**Estimated gain:** +1.50Ω total from artifact deletion alone. No prose change required.

---

## 8. CHAPTERS WITHIN 3 OMEGA OF ELITE (LitCentral 132+)

Elite threshold: 135.00. Chapters already Elite or within striking range:

| Chapter | Title | LitCentral | SPSS Ω | Gap to Elite | Status |
|---------|-------|------------|--------|--------------|--------|
| Ch.01 | SGT George Ramos (ceremony) | 142.11 | 113.35* | — | OMEGA ELITE — locked |
| Ch.05 | (Act I) | 139.80 | 106.292 | — | OMEGA ELITE |
| Ch.17 | boundary shift | 138.80 | 104.194 | — | OMEGA ELITE |
| Ch.18 | (Act II) | 138.80 | 106.645 | — | OMEGA ELITE |
| Ch.03 | (Act I) | 137.80 | 107.726 | — | OMEGA ELITE |
| Ch.07 | (Act I) | 135.45 | 104.491 | — | OMEGA ELITE |
| Ch.15 | (Act I) | 135.12 | 104.021 | — | OMEGA ELITE |
| **Ch.42** | **(Act III)** | **132.77** | **104.231** | **2.23** | CLOSEST — one targeted insert reaches Elite |
| Ch.11 | (Act II) | 131.78 | 105.393 | 3.22 | Within range — one move |
| Ch.23 | The Eagle and the Sparrow | 130.44 | 104.199 | 4.56 | Two moves needed |
| Ch.28 | (Act III) | 130.44 | 105.798 | 4.56 | Two moves needed |
| Ch.43 | (Act III) | 130.46 | 103.468 | 4.54 | Two moves needed |

*Ch.01 SPSS Ω = 113.35 reflects RF 1.5 post-injection workbook score; pre-injection SPSS Ω = 109.45 (CR-1.0 DELTA audit).

**Ch.42 action plan:** At LitCentral 132.77, Ch.42 needs +2.23 points to cross Elite. Workbook subscores: BR=23, CS=30, AS=29, TB=30, EE=11/20, MP=20/20. The single weak dimension is EE=11/20 (×0.67 weight = 7.37 raw). Raising EE from 11 to 16 (+5 raw × 0.67 = +3.35 weighted) pushes the chapter to ~136.1 — Elite. One forensic paragraph documenting a specific VA claims denial or DCAS record discrepancy, grounded in Ch.42's narrative moment, accomplishes this.

**Ch.11 action plan:** LitCentral 131.78, gap = 3.22. Workbook subscores: BR=30, CS=26, AS=23, TB=30, EE=14/20, MP=20/20. AS=23 is the weak dimension — sensory density likely low. One sensory anchor paragraph raises AS toward 27–28, closing the gap.

---

## SUMMARY SCORECARD

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Mean SPSS Ω (45 chapters) | 106.907 | 111 | 4.09 |
| Ch.01 LitCentral | 142.11 | — | Already Elite |
| Ch.01 SPSS Ω (RF 1.5 post-injection) | 113.35 | 115 | 1.65 |
| PBI | 90.4 | 91.2 | 0.8 |
| Chapters at Omega Elite | 8/45 | — | — |
| Chapters within 3 pts of Elite | 2 (Ch.42, Ch.11) | — | — |
| Structural anomalies | 10 | 0 | 10 chapters need heading clean |
| True sensory gaps | 1 (yerba buena) | 0 | 1 insert needed |
| Adverbial flags | 49 (very+quite+suddenly+really) | 0 | Sweep required |
| "felt" filter overuse | 135 | <80 | Chapter-level triage |

**Recommended next session — one lever:** Ch.42 EE insert. Highest LitCentral gain per word written (2.23 points needed, one forensic paragraph), zero structural risk, pushes a ninth chapter to Omega Elite.
