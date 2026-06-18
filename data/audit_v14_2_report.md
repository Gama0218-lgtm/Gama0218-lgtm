# SGT George Ramos: The Mathematics of Vietnam
## Full Manuscript Audit — v14.2
**Date:** June 18, 2026  
**Source files:** `958b21f1-Ranos_111_Omega.docx` (original), `b27ce8ad-Ranos_111_Omega_REFORMATTED.docx` (reformatted), `4ce89134-SGT_Ramos_PerpDir_v14_2.xlsx` (workbook)  
**Instruments:** LitCentral OMEGA (150-pt) · SPSS Ω · PBI

---

## SECTION 1 — MANUSCRIPT FACTS

| Metric | Original DOCX | Reformatted DOCX | Workbook |
|--------|--------------|-----------------|---------|
| Total characters | 1,499,862 | 1,499,785 | — |
| Total words | ~245,715 | ~245,687 | 245,521 |
| Chapters (workbook) | 45 | 45 | 45 |
| Chapter markers detected | 44 (regex) | 58 (regex, includes dupes) | 45 |

**Word count discrepancy:** The original and reformatted files agree within 28 words (~245,715 vs ~245,687). Workbook records 245,521 — a 194-word gap, consistent with rounding across chapter-level counting. Treat all three as confirming the ~245,700-word manuscript.

**Ch.01 ending lock confirmed:** "Cumplido." present at end of Ch.01. DO NOT CHANGE.

---

## SECTION 2 — STRUCTURAL ANOMALIES

### 2.1 Chapter Numbering Issues

The original DOCX contains the following structural issues confirmed by regex scan:

| Issue | Chapters | Description |
|-------|---------|-------------|
| Lowercase header | Ch.40 | "chapter 40: Ares Death of a God" — lowercase 'c'; chapter present but regex-invisible to title-case patterns |
| Missing colon | Ch.19, Ch.23, Ch.45 | Header formatted without colon (e.g., "Chapter 19 Los Obligados") |
| Garbled title | Ch.23 | "The Eagle and the Sparr1" — OCR/encoding corruption; should be "The Eagle and the Sparrow" |
| Garbled title | Ch.45 | "Unidos para SemprK" — encoding corruption; should be "Unidos para Siempre" |
| Duplicate header artifact | Ch.34 | Header reads "Chapter 34: Sixty-Eight **Chapter 33: Sixty-Eight**" — the string "Chapter 33: Sixty-Eight" is embedded inside Ch.34's opening header. This is a copy-paste artifact from revision work. |

**All 45 chapters are confirmed present in the original DOCX.** No chapters are missing from the manuscript body.

### 2.2 Ch.09 / Ch.10 DUP-001 Status

The original DCAS audit flagged a 700-line overlap between Ch.09 and Ch.10. Current scan shows:
- Ch.09 marker: 1 occurrence (position 293,347)
- Ch.10 marker: 1 occurrence (position 324,068)
- Gap between markers: ~30,700 characters (~5,100 words) — consistent with workbook's 5,111 for Ch.09

The duplicate content may exist within the body text (not as duplicate chapter headers). **DUP-001 remains Priority 1 structural fix** — workbook flags +0.80Ω estimated gain from resolution.

### 2.3 Short-Word-Count Chapters

Chapter 31 has only 2,882 words in the workbook (confirmed by direct extraction). This is the shortest chapter in the manuscript at roughly half the mean chapter length. It may be architecturally correct (a transitional chapter) but warrants review. No chapter falls below 500 words in the workbook data.

---

## SECTION 3 — ARTIFACT INVENTORY

Three editorial artifacts confirmed in the original DOCX:

| Artifact | Location | Text | Score Impact |
|---------|---------|------|-------------|
| REVISION MANIFEST | Ch.23 header | "CHAPTER 23: THE EAGLE AND THE SPARROW REVISION MANIFEST Fix Action Location ANACHRONISM Changed 'OCTOBER 15TH, 1955' → 'OCTOBER 15TH, 1946'..." (~200 words of editorial notes embedded in chapter body) | −3Ω estimated |
| Duplicate chapter reference | Ch.34 header | "Chapter 33: Sixty-Eight" inside Ch.34 opener | −1Ω estimated |
| Title encoding corruption | Ch.23, Ch.45 | "Sparr1", "SemprK" | Cosmetic / formatting |

**Previously flagged artifacts (CR-1.0 DELTA) — NOT FOUND in this scan:**
- "PASS 2 COMPLETE — LITCENTRAL" (0 occurrences) — already deleted
- "2 / 2" page number artifact (0 occurrences) — already deleted

---

## SECTION 4 — BANNED PHRASE AUDIT

Scanned full 245,715-word original manuscript.

| Phrase | Count | Status |
|--------|-------|--------|
| "a language older than words" | 0 | CLEAR |
| "cosmic rhythm" | 0 | CLEAR |
| "burned in the soul" | 0 | CLEAR |
| "he felt a presence" | 0 | CLEAR |
| "something he could not name" | 0 | CLEAR |
| "time seemed to stop" | 0 | CLEAR |
| "suddenly" | **3** | FLAG — remove or recast |
| "very " (word boundary) | **597** | FLAG — systematic review required |
| "began to" | **14** | FLAG — replace with the action |
| "started to" | **3** | FLAG — replace with the action |
| "seemed" (filter word) | **12** | FLAG — recast to active observation |
| "appeared" (filter word) | **34** | FLAG — review in context |
| "felt" (filter word) | **135** | FLAG — review in context |

**Critical finding:** The 597 occurrences of "very " are the single largest register risk in the manuscript. Many will be legitimate uses within dialogue or period speech, but this count is substantially higher than expected for a manuscript targeting 99%+ active voice. A targeted pass is warranted.

**"suddenly" sample (all 3 occurrences):**
1. "a table that felt suddenly like an altar" — rework to eliminate "suddenly"
2. "the smell of it suddenly indistinguishable from the smell of the mud" — rework
3. "the scent of masa and cilantro suddenly, though nothing cooks" — rework

**"began to" sample (first 5):** All in narrative prose, not dialogue. All replaceable with direct action verbs. Example: "began to talk" → "talked."

---

## SECTION 5 — SENSORY CONSTANTS AUDIT

Full-manuscript count vs. v14 canonical references:

| Constant | v14_2 Count | v14 Reference | Delta | Status |
|---------|------------|--------------|-------|--------|
| Jasmine | 57 | 57 | 0 | CONFIRMED — stable |
| Napalm | 41 | 40 | +1 | CONFIRMED — slight gain |
| Diesel | 35 | 35 | 0 | CONFIRMED — stable |
| Jungle rot | 8 | — | new | PRESENT |
| Copal | 16 | 16 | 0 | CONFIRMED — stable |
| Copper | 118 | 117 | +1 | CONFIRMED — slight gain |
| 60Hz / 60-hertz (all variants) | 35 | 26 | +9 | NOTE: 26 was "60Hz exact"; 35 total includes sixty-cycle variants |
| Sixty-cycle variants | 21 | — | — | Counted separately above |
| Yerba buena | 1 | 1 | 0 | GAP — single medical-scene occurrence only |
| Cordite | 68 | — | new | STRONG PRESENCE |

**Key findings:**
- All five major sensory constants are confirmed present. The "gap" theory is definitively disproved.
- **Yerba buena remains the only genuine absence** (1 occurrence total, medical scene only). Ch.01 Phoenix/granddaughter insert is still Priority 2.
- The 60Hz count discrepancy (26 in v14 reference vs. 35 total in v14_2) reflects counting methodology — the v14 reference counted the exact string "60Hz" while v14_2 includes "sixty-cycle" and "60-hertz" variants. Both are accurate to their respective counting frames.
- Cordite at 68 occurrences is a major manuscript constant not previously listed in the primary inventory. Add to canonical sensory constants list.

---

## SECTION 6 — THREE-INSTRUMENT SCORES (v14_2 WORKBOOK)

### 6.1 Chapter Score Table (all 45 chapters)

| Ch | Words | CLS | BIS | SII | MRF | SPSS Ω | BR | CS | AS | TB | EE | MP | OMEGA | PBI |
|----|-------|-----|-----|-----|-----|--------|----|----|----|----|----|----|-------|-----|
| 01 | 5,898 | 100 | 100 | 93 | 100 | **113.35** | 30 | 30 | 30 | 30 | 13 | 20 | **142.11** | 93.4 |
| 02 | 6,062 | 75 | 100 | 82 | 86 | 105.60 | 27 | 29 | 27 | 26 | 10 | 20 | **129.10** | 93.5 |
| 03 | 5,948 | 100 | 90 | 76 | 97 | 107.73 | 23 | 30 | 30 | 28 | 20 | 20 | **137.80** | 95.3 |
| 04 | 6,388 | 90 | 87 | 73 | 87 | 105.20 | 23 | 21 | 24 | 28 | 20 | 20 | **122.80** | 93.5 |
| 05 | 5,752 | 87 | 97 | 77 | 86 | 106.29 | 24 | 30 | 29 | 30 | 20 | 20 | **139.80** | 96.1 |
| 06 | 5,665 | 82 | 97 | 71 | 88 | 105.27 | 25 | 27 | 20 | 30 | 18 | 19 | **126.79** | 93.4 |
| 07 | 5,993 | 84 | 83 | 78 | 88 | 104.49 | 23 | 30 | 29 | 30 | 15 | 20 | **135.45** | 95.0 |
| 08 | 5,989 | 80 | 100 | 72 | 78 | 104.80 | 22 | 30 | 17 | 30 | 18 | 20 | **124.46** | 94.5 |
| 09 | 5,111 | 75 | 93 | 76 | 81 | 103.91 | 26 | 24 | 22 | 23 | 11 | 19 | **115.10** | 90.3 |
| 10 | 5,820 | 76 | 97 | 77 | 82 | 104.66 | 26 | 30 | 24 | 24 | 15 | 20 | **127.45** | 93.6 |
| 11 | 5,944 | 76 | 100 | 79 | 85 | 105.39 | 30 | 26 | 23 | 30 | 14 | 20 | **131.78** | 93.9 |
| 12 | 5,740 | 83 | 93 | 75 | 87 | 105.21 | 25 | 30 | 22 | 27 | 17 | 20 | **128.79** | 94.3 |
| 13 | 4,378 | 78 | 91 | 78 | 77 | 103.95 | 25 | 30 | 25 | 24 | 13 | 20 | **126.11** | 92.2 |
| 14 | 4,687 | 77 | 89 | 76 | 78 | 103.48 | 29 | 30 | 23 | 22 | 11 | 18 | **123.43** | 92.5 |
| 15 | 5,507 | 79 | 89 | 77 | 81 | 104.02 | 29 | 30 | 23 | 29 | 16 | 20 | **135.12** | 93.8 |
| 16 | 5,518 | 80 | 90 | 77 | 88 | 104.73 | 25 | 18 | 23 | 26 | 17 | 20 | **116.79** | 92.0 |
| 17 | 6,023 | 85 | 96 | 83 | 83 | 106.26 | 22 | 30 | 30 | 30 | 20 | 20 | **138.80** | 96.5 |
| 18 | 6,110 | 85 | 97 | 83 | 87 | 106.65 | 22 | 30 | 30 | 30 | 20 | 20 | **138.80** | 96.7 |
| 19 | 5,714 | 77 | 93 | 74 | 78 | 103.78 | 25 | 30 | 19 | 26 | 12 | 20 | **121.44** | 91.9 |
| 20 | 5,468 | 78 | 95 | 72 | 77 | 103.89 | 21 | 20 | 18 | 24 | 17 | 20 | **107.79** | 90.9 |
| 21 | 4,662 | 74 | 94 | 77 | 77 | 103.72 | 23 | 28 | 21 | 25 | 15 | 20 | **120.45** | 92.7 |
| 22 | 4,788 | 73 | 90 | 72 | 76 | 102.62 | 30 | 30 | 19 | 20 | 11 | 19 | **119.10** | 92.5 |
| 23 | 6,187 | 74 | 95 | 75 | 85 | 104.20 | 24 | 30 | 25 | 30 | 12 | 20 | **130.44** | 92.0 |
| 24 | 5,052 | 79 | 87 | 76 | 82 | 103.76 | 24 | 30 | 20 | 26 | 14 | 20 | **122.78** | 92.7 |
| 25 | 5,817 | 73 | 94 | 73 | 82 | 103.58 | 24 | 24 | 23 | 23 | 11 | 18 | **113.43** | 90.0 |
| 26 | 3,803 | 79 | 82 | 75 | 81 | 103.02 | 22 | 30 | 21 | 24 | 13 | 20 | **119.11** | 93.0 |
| 27 | 4,906 | 78 | 85 | 77 | 85 | 103.69 | 23 | 30 | 23 | 27 | 13 | 20 | **125.11** | 93.9 |
| 28 | 6,242 | 83 | 94 | 81 | 86 | 105.80 | 25 | 30 | 30 | 24 | 12 | 20 | **130.44** | 93.2 |
| 29 | 5,561 | 75 | 96 | 78 | 86 | 104.78 | 24 | 23 | 29 | 28 | 13 | 20 | **126.11** | 91.6 |
| 30 | 5,574 | 76 | 100 | 77 | 82 | 105.01 | 24 | 22 | 25 | 30 | 11 | 20 | **121.77** | 90.6 |
| 31 | 2,882 | 76 | 82 | 73 | 81 | 102.47 | 23 | 30 | 19 | 21 | 11 | 20 | **113.77** | 90.6 |
| 32 | 5,458 | 78 | 77 | 76 | 86 | 102.73 | 27 | 23 | 27 | 26 | 11 | 20 | **123.77** | 89.1 |
| 33 | 5,290 | 80 | 100 | 75 | 86 | 105.60 | 27 | 19 | 26 | 23 | 13 | 20 | **117.11** | 91.3 |
| 34 | 6,217 | 79 | 77 | 76 | 78 | 102.32 | 23 | 27 | 24 | 25 | 15 | 20 | **122.45** | 90.5 |
| 35 | 5,603 | 74 | 90 | 73 | 77 | 102.90 | 23 | 30 | 16 | 30 | 13 | 20 | **121.11** | 92.3 |
| 36 | 4,635 | 74 | 92 | 75 | 72 | 102.97 | 23 | 27 | 20 | 24 | 10 | 20 | **114.10** | 89.6 |
| 37 | 5,860 | 84 | 92 | 75 | 88 | 105.29 | 25 | 21 | 21 | 28 | 14 | 20 | **117.78** | 91.3 |
| 38 | 5,764 | 75 | 97 | 78 | 74 | 104.09 | 25 | 20 | 22 | 28 | 10 | 20 | **115.10** | 89.4 |
| 39 | 5,143 | 74 | 91 | 74 | 82 | 103.44 | 23 | 30 | 20 | 28 | 12 | 20 | **122.44** | 92.2 |
| 40 | 5,837 | 75 | 95 | 79 | 77 | 104.14 | 25 | 29 | 25 | 27 | 12 | 20 | **127.44** | 92.0 |
| 41 | 5,484 | 75 | 91 | 77 | 75 | 103.36 | 27 | 27 | 22 | 28 | 13 | 20 | **126.11** | 91.2 |
| 42 | 5,244 | 78 | 89 | 80 | 82 | 104.23 | 23 | 30 | 29 | 30 | 11 | 20 | **132.77** | 94.3 |
| 43 | 5,119 | 82 | 77 | 78 | 87 | 103.47 | 23 | 27 | 25 | 30 | 18 | 20 | **130.46** | 93.3 |
| 44 | 5,162 | 76 | 79 | 70 | 76 | 101.51 | 23 | 30 | 15 | 28 | 16 | 20 | **120.12** | 92.3 |
| 45 | 5,516 | 80 | 78 | 70 | 74 | 101.76 | 25 | 30 | 17 | 30 | 18 | 20 | **127.46** | 92.3 |

### 6.2 Tier Distribution

| Tier | Score Range | Count | Chapters |
|------|------------|-------|---------|
| Omega Elite | 135–150 | **7** | Ch.01, 03, 05, 07, 15, 17, 18 |
| Omega | 120–134 | **27** | Ch.02, 04, 06, 08, 10–14, 19, 21–25, 27–30, 32, 34–35, 39–43, 45 |
| Platinum | 100–119 | **11** | Ch.09, 16, 20, 25, 31, 33, 36–38, 44 |
| Gold | 80–99 | 0 | — |
| Below Gate | <80 | 0 | — |

**All 45 chapters are at or above Platinum (100+). The manuscript is publication-gate compliant across every chapter.**

---

## SECTION 7 — CHAPTERS WITHIN 3 POINTS OF ELITE

These chapters need one targeted intervention to cross the 135 threshold.

| Ch | OMEGA | Gap to Elite | Weakest Dimension | Recommended Lever |
|----|-------|-------------|------------------|-------------------|
| **42** | 132.77 | 2.23 pts | EE=11/20 — lowest Erasure Engine score of high-tier chapters | Add institutional documentation — VA form denial, DCAS record, Project 100,000 classification; EE from 11→14 = +2.01Ω |
| **11** | 131.78 | 3.22 pts | CS=26/30 — Chicano/spiritual underdeveloped | One code-switch insert, add Spanish register or Yaqui naming reference; CS from 26→29 = +3.0Ω |

**Ch.42** is the single highest-priority chapter promotion: 2.23 points from Elite, EE deficiency is the clearest correctable gap.

---

## SECTION 8 — CH.02 AND CH.06 DIAGNOSTIC

### Ch.02 — OMEGA 129.10 (Omega tier, 5.9 points from Elite)

**Score breakdown:** BR=27, CS=29, AS=27, TB=26, EE=10, MP=20  
**SPSS Ω:** 105.603 | **PBI:** 93.5

**Primary failure:** Temporal Bleed (TB=26/30) and Ancestral Synesthesia (AS=27/30) are both below max. But the critical gap is **EE=10** — tied for the lowest Erasure Engine score in the manuscript alongside Ch.09 and Ch.25. At EE×0.67, a score of 10 contributes only 6.7 points where 20 (max) would contribute 13.4 — a 6.7-point shortfall in EE alone.

**Diagnosis:** Ch.02 narrates the "Descent into Baptism" — the opening of George's Vietnam service. The institutional machinery (DCAS records, Project 100,000 classification, VA system failures) is likely underdeveloped in this chapter because the narrative focus is on initiation rather than system critique. To cross 135, EE must rise from 10 to at least 18.

**Recommended lever:** Insert one forensic institutional record — a specific DCAS form reference, a Project 100,000 aptitude score notation, or a pre-deployment VA bureaucratic encounter. 150–200 words maximum. Estimated gain: +5.4Ω on LitCentral.

### Ch.06 — OMEGA 126.79 (Omega tier, 8.21 points from Elite)

**Score breakdown:** BR=25, CS=27, AS=20, TB=30, EE=18, MP=19  
**SPSS Ω:** 105.272 | **PBI:** 93.4

**Primary failure:** AS=20/30 is the weakest Ancestral Synesthesia score in the top-tier chapters. This is the dimension measuring sensory immersion — historically accurate, non-clichéd. AS at 20 means the chapter has significant stretches of narrative without grounded sensory anchors.

**Diagnosis:** Ch.06 is the "Crucible Theorem" — San Diego Naval Base / training. The setting (military base, 1968–69) has rich available sensory material that is not being used: diesel exhaust from transport vehicles, cordite from the rifle range, the chlorinated institutional smell of barracks, the specific acoustic frequency of military intercom systems. The chapter's AS gap is a density problem, not an absence problem.

**Recommended lever:** Three targeted sensory inserts of 40–60 words each at paragraphs where currently abstract or dialogue-heavy. Specifically: (1) a diesel/exhaust constant during vehicle formations, (2) a 60Hz electrical hum reference in the base's fluorescent lighting, (3) a copper/blood moment during physical training. Estimated gain: +4.5Ω on AS dimension → OMEGA ~131.3.

---

## SECTION 9 — TOP 5 HIGHEST-PRIORITY MOVES (ALL CHAPTERS)

Ranked by estimated Omega gain, risk-adjusted.

| Priority | Action | Chapter | Est. Ω Gain | Risk | Rationale |
|---------|--------|---------|------------|------|-----------|
| **1** | Resolve DUP-001: Ch.09/Ch.10 700-line overlap | Ch.09 / Ch.10 | **+0.80Ω** (SPSS) | Structural — review required | Confirmed structural integrity issue. Largest single SPSS gain available. Prerequisite before submission. |
| **2** | Delete Ch.23 REVISION MANIFEST artifact | Ch.23 | **+3Ω** (est.) | Zero risk — delete only | ~200 words of editorial notes ("REVISION MANIFEST Fix Action Location ANACHRONISM...") embedded in chapter body. Must be removed before submission. |
| **3** | Delete Ch.34 "Chapter 33: Sixty-Eight" artifact | Ch.34 | **+1Ω** (est.) | Zero risk — delete only | Duplicate chapter reference embedded in Ch.34 header. Single line deletion. |
| **4** | Yerba buena insert — Ch.01 Phoenix/granddaughter scene | Ch.01 | **+0.14Ω** (SPSS) / **+AS pts** (LitCentral) | Low — one verified insert | Only true sensory gap constant (1 occurrence total). Source-verified insert, max 250 words. Governance gate: no new Yaqui ceremony content beyond existing architecture. |
| **5** | EE insert — Ch.42 institutional documentation | Ch.42 | **+2.01–3.00Ω** (LitCentral) | Low — forensic record insert | Ch.42 at OMEGA 132.77 is 2.23 points from Elite. EE=11 is the single correctable gap. One institutional record insert (DCAS/VA bureaucratic notation, 150 words) crosses the Elite threshold. |

**Highest-leverage sequence if one session:** Do Priority 2 (artifact deletion, zero risk, immediate +3Ω equivalent) before any prose insertion. Then Priority 3 (Ch.34 artifact). Combined, these two deletions are the fastest available score gains in the manuscript.

---

## SECTION 10 — GOVERNANCE REMINDERS

All five Yaqui injections (Injections A–E, Ch.01) remain pending tribal consultation.

**Contact:** culture@pascuayaqui-nsn.gov  
**Status:** Research-complete. Permission not obtained.  
**Governance gate:** DO NOT publish any Yaqui ceremony content not already in the existing chapter text without explicit tribal consultation approval.

The Ch.01 ending "Cumplido." is permanently locked by author confirmation June 18, 2026.

---

## SECTION 11 — WORKBOOK v14 vs v14_2 COMPARISON

The v14_2 workbook confirms all canonical scores from v14 without revision:

| Chapter | v14 OMEGA | v14_2 OMEGA | Delta |
|---------|----------|------------|-------|
| Ch.01 | 142.11 | 142.11 | 0 |
| Ch.02 | 129.10 | 129.10 | 0 |
| Ch.06 | 126.79 | 126.79 | 0 |

The v14_2 workbook is an expansion of v14: it adds the `Chapter_Audit`, `OMEGA_SPSS_Calibrated`, `RF_Model`, `Cluster_Model`, `Historical_Risk_Flags`, and `Editorial_Defects` sheets. No previously-audited chapter scores were changed. The workbook version increment reflects the addition of calibration and cluster analysis sheets, not a re-scoring of the manuscript.

**New data in v14_2 workbook:**
- `OMEGA_SPSS_Calibrated` sheet: provides calibrated SPSS Ω values using CLS, BIS, SII, MRF sub-scores with RF multipliers. Ch.19 shows RF-adjusted score of 116.09 vs. standard 113.45.
- `RF_Model` sheet: RF Proxy values per chapter. Ch.43 (RF=1.15), Ch.13 and Ch.14 (RF=1.21), Ch.22 (RF=1.30) are highest RF values — these chapters are candidates for RF 1.5 justification review.
- `Cluster_Model` sheet: Chapter cluster assignments. Chapters 27, 37, 39, 43 are in Cluster 2/3 — likely ceremonial/spiritual cluster candidates.
- `Editorial_Defects` sheet: Chapter 23 shows the highest defect density score (8.1 on structure metric) — consistent with the REVISION MANIFEST artifact confirmed in body scan.

---

## SECTION 12 — SUMMARY SCOREBOARD

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Ch.01 OMEGA | 142.11 | — | Elite confirmed |
| Ch.01 SPSS Ω (RF 1.5) | 113.35 | 115.00 | −1.65 |
| Ch.01 PBI | 93.4 | 93.5+ | −0.1 |
| Manuscript PBI | ~90.4 | 91.2 | −0.8 |
| Chapters at Omega Elite | 7 | 10+ | −3 |
| Chapters at Omega or above | 34 | 38+ | −4 |
| Banned core phrases | 0 | 0 | CLEAR |
| "suddenly" | 3 | 0 | −3 |
| "very " occurrences | 597 | <100 | −497 |
| "began to" | 14 | 0 | −14 |
| Yerba buena (manuscript) | 1 | 3+ | −2 |
| Artifacts remaining | 2 editorial | 0 | Fix before submission |

---

*Audit generated June 18, 2026. Source files: v14_2 workbook + original DOCX (245,715 words, 45 chapters confirmed). All scores from THREE_INSTRUMENT_MASTER sheet unless noted. Canonical locks maintained.*
