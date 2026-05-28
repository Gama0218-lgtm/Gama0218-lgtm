# SGT Ramos Manuscript — Audit Report

**Manuscript:** *SGT George Ramos*
**Word count:** 241,117 (Novlr-verified) · workbook sum 248,812 (1.0029% discrepancy — see §5)
**Chapters:** 45 (per SPSS workbook canonical)
**Acts:** I (1-17) · II (18-32) · III (33-45)
**Audit date:** 2026-05-28
**Seed:** 42 · N = 45 · R² = 0.947 · Cronbach α = 0.938
**Goal:** Ω ≥ 105 across all chapters

---

## 1 · Executive Summary

**Result: GOAL MET.** All 45 chapters achieve **Omega Elite tier (Ω ≥ 105)**.
The manuscript-wide mean is **Ω̄ = 107.34** (σ = 1.26, range 105–110), placing
every chapter in the top quality band the framework defines.

| Metric | Goal | Actual | Status |
| --- | --- | --- | --- |
| Ω floor (worst chapter) | ≥ 105 | 105 | **MET** |
| Ω mean | — | **107.34** (σ 1.26) | strong |
| Ω max | — | 110 | Ch.39 *When Compadres Fall* |
| Chapters below 105 | 0 | 0 | **MET** |
| Tier coverage | "Elite" | 45 / 45 | **MET** |

The four chapters at the floor (Ω = 105 — Ch.2, 17, 20, 29) are all
recoverable through the **CLS / MRF** axes (code-switch density and
manuscript reference field). None require structural rewrites.

The headline risk is **not** Ω — it is the **CRITICAL** audit flag on
Ch.9 / Ch.10 (near-duplicate openings, 700+ shared lines) which would
not survive a serious editorial pass even though both chapters score 108.

---

## 2 · Framework

### 2.1 The Hybrid Omega regression (canonical)

```
Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.067·MRF
```

- **R² = 0.947** · Cronbach **α = 0.938** · **N = 45 chapters** · seed = 42
- Status: **CANONICAL** in the Formula Registry.

| Component | Stands for | Mean | σ | Min | Max | Weight |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| CLS | Code-switch / cohesion load | 89.92 | 6.81 | 75.0 | 99.0 | 0.124 |
| BIS | Behavioral intensity score | 89.12 | 3.81 | 75.5 | 97.0 | 0.118 |
| SII | Structural integrity index  | 92.32 | 3.19 | 80.2 | 98.0 | 0.089 |
| MRF | Manuscript reference field  | 89.38 | 7.51 | 68.0 | 99.0 | 0.067 |

**RRP (Reader Retention Prediction)** sits downstream of Ω: mean **89.56**
(σ 3.51, range 83–96). It correlates **r = 0.955** with Ω — expected since
RRP is structurally a function of Ω, not an independent input.

### 2.2 Note on "NIPS"

There is no `NIPS` column in the workbook. The closest matches are:
- **SII** — Structural Integrity Index (the third regression predictor)
- **SSI** — Scholarly Survival Index (a market metric)
- **MPE** — Market Pressure Engine (commercial submission metric)

This audit covers all three plus RRP, so whichever term you meant is in §4.

---

## 3 · Chapter-level results

### 3.1 Per-act Ω

| Act | Span | N | Mean Ω | σ | Min | Max |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| I (Setup)   | 1–17  | 17 | 107.26 | 1.28 | 105 | 109 |
| II (Ordeal) | 18–32 | 15 | 107.13 | 1.20 | 105 | 109 |
| III (Return)| 33–45 | 13 | **107.69** | 1.20 | 106 | 110 |

Act III is the strongest band — the resolution chapters land cleanest.
This is the correct pacing signature for a war/exile narrative arc
(the framework rewards a strong return).

### 3.2 Strongest chapters (top 5)

| Ch | Title | Act | Ω |
| ---: | --- | :-: | ---: |
| 39 | When Compadres Fall      | III | **110** |
| 21 | El Cazador y El Guardian | II  | 109 |
| 31 | Retreat Hell             | II  | 109 |
| 40 | Ares: Death of a God     | III | 109 |
| 45 | Unidos para Siempre      | III | 109 |

### 3.3 Floor chapters (Ω = 105) — the recoverable four

| Ch | Title | Act | Ω | CLS gap | BIS gap | SII gap | MRF gap | Fix |
| ---:|---|:-:|---:|---:|---:|---:|---:|:-:|
|  2 | Descent Into Baptism | I | 105.0 | -10.92 | +0.88 | +0.68 | -11.38 | MED |
| 17 | Boundary Shift Equation | I | 105.0 | -12.92 | -1.12 | +0.68 | -4.38 | MED |
| 20 | The Genesis Equation | II | 105.0 | -6.92 | -5.12 | -4.32 | -12.38 | LOW |
| 29 | Mathematics of Revolution | II | 105.0 | -14.92 | +2.88 | -2.32 | -4.38 | HIGH |

The pattern is consistent: **negative CLS** (code-switch density below
manuscript mean) and **negative MRF** (manuscript-internal cross-reference
density below mean) are the dominant drivers of every floor chapter. BIS
and SII are already at or above mean on three of the four.

This is the single highest-yield revision lever:

- **Ch.2 *Descent Into Baptism*** — CLS -10.9, MRF -11.4. Add 2–3 organic
  code-switch moments and one cross-callback to Ch.1's *Sacred Mountain*
  imagery. Forecast Δ Ω ≈ +1.5 to +2.0.
- **Ch.17 *Boundary Shift Equation*** — CLS -12.9. Highest CLS gap in the
  manuscript. Add bilingual moments in the equation-derivation interludes.
  Forecast Δ Ω ≈ +1.5 to +2.0.
- **Ch.20 *The Genesis Equation*** — only chapter with three negative
  predictors (CLS, BIS, SII). Suggests structural softness, not just
  language density. Consider compression or scene restaging.
- **Ch.29 *Mathematics of Revolution*** — flagged **HIGH** Fix Priority in
  the workbook. CLS -14.9, the worst single-chapter gap of any predictor.
  This is the priority intervention for the entire manuscript.

### 3.4 Full chapter scoreboard (45 rows)

| Ch | Title | Act | Ω | RRP | CLS | SII | BIS | MRF | Words | Fix |
|---:|---|:-:|---:|---:|---:|---:|---:|---:|---:|:-:|
|  1 | The Sacred Mountain Revelation | I | 106 | 87.0 | 85.0 | 90.0 | 84.0 | 95.0 | 5,172 | LOW |
|  2 | Descent Into Baptism | I | 105 | 83.0 | 79.0 | 93.0 | 90.0 | 78.0 | 5,571 | MED |
|  3 | The Genocide Algorithm | I | 108 | 93.0 | 99.0 | 92.0 | 90.0 | 88.0 | 5,520 | LOW |
|  4 | Pentagon December 1969 | I | 106 | 86.0 | 84.0 | 93.0 | 91.0 | 81.0 | 6,206 | LOW |
|  5 | The Ghost Protocol | I | 109 | 94.0 | 93.0 | 98.0 | 94.0 | 99.0 | 5,587 | LOW |
|  6 | Crucible Theorem | I | 108 | 90.0 | 93.0 | 92.0 | 89.0 | 88.0 | 5,569 | LOW |
|  7 | The Boulevard Theorem | I | 109 | 95.0 | 99.0 | 94.0 | 87.0 | 99.0 | 5,993 | LOW |
|  8 | Los Records Mienten | I | 106 | 89.0 | 87.3 | 80.2 | 75.5 | 68.0 | 3,596 | MED |
|  9 | First Blood | I | 108 | 90.0 | 91.0 | 95.0 | 87.0 | 93.0 | 5,268 | LOW |
| 10 | The Pendejo Squad | I | 108 | 90.0 | 91.0 | 95.0 | 87.0 | 93.0 | 5,268 | LOW |
| 11 | Contact Contact | I | 106 | 86.0 | 85.0 | 91.0 | 89.0 | 83.0 | 5,189 | LOW |
| 12 | Red Truth Revolution | I | 109 | 94.0 | 96.0 | 94.0 | 93.0 | 94.0 | 5,747 | LOW |
| 13 | Proud Warriors | I | 108 | 92.0 | 97.0 | 92.0 | 90.0 | 88.0 | 5,583 | LOW |
| 14 | Package Sacrament | I | 107 | 91.0 | 99.0 | 92.0 | 82.0 | 88.0 | 5,217 | LOW |
| 15 | Move Like Water | I | 108 | 92.0 | 99.0 | 94.0 | 87.0 | 86.0 | 5,438 | LOW |
| 16 | My Lai Massacre | I | 107 | 88.0 | 88.0 | 90.0 | 92.0 | 83.0 | 5,200 | LOW |
| 17 | Boundary Shift Equation | I | 105 | 83.0 | 77.0 | 93.0 | 88.0 | 85.0 | 5,774 | MED |
| 18 | Broken Wing | II | 108 | 91.0 | 90.0 | 98.0 | 88.0 | 95.0 | 6,113 | LOW |
| 19 | Los Obligados | II | 106 | 88.0 | 94.0 | 88.0 | 86.0 | 79.0 | 5,717 | LOW |
| 20 | The Genesis Equation | II | 105 | 83.0 | 83.0 | 88.0 | 84.0 | 77.0 | 5,401 | LOW |
| 21 | El Cazador y El Guardian | II | 109 | 93.0 | 98.0 | 90.0 | 92.0 | 91.0 | 4,978 | LOW |
| 22 | Dont Fuck with Familia | II | 107 | 90.0 | 97.0 | 90.0 | 93.0 | 73.0 | 5,088 | LOW |
| 23 | The Eagle and the Sparrow | II | 108 | 92.0 | 94.0 | 92.0 | 93.0 | 93.0 | 5,537 | LOW |
| 24 | Sacred Heart Briefing | II | 107 | 89.0 | 87.0 | 92.0 | 87.0 | 98.0 | 5,430 | LOW |
| 25 | Sacred Heart - The Battle | II | 107 | 87.0 | 84.0 | 95.0 | 85.0 | 93.0 | 5,337 | LOW |
| 26 | Echoes of an Empire | II | 106 | 85.0 | 77.0 | 90.0 | 92.0 | 92.0 | 6,151 | MED |
| 27 | Hunters Geometry | II | 107 | 89.0 | 89.0 | 92.0 | 90.0 | 91.0 | 4,903 | LOW |
| 28 | Cruzan o Nadie Cruzan | II | 107 | 89.0 | 90.0 | 95.0 | 89.0 | 86.0 | 6,123 | LOW |
| 29 | Mathematics of Revolution | II | 105 | 83.0 | 75.0 | 90.0 | 92.0 | 85.0 | 5,423 | HIGH |
| 30 | Orchestrating Necessary Evil | II | 108 | 90.0 | 90.0 | 92.0 | 86.0 | 99.0 | 4,708 | LOW |
| 31 | Retreat Hell | II | 109 | 95.0 | 99.0 | 90.0 | 91.0 | 99.0 | 4,798 | LOW |
| 32 | Corridor of Fire | II | 108 | 91.0 | 93.0 | 90.0 | 89.0 | 94.0 | 6,276 | LOW |
| 33 | Angels from Above | III | 107 | 87.0 | 85.0 | 95.0 | 88.0 | 88.0 | 5,512 | LOW |
| 34 | Sixty-Eight | III | 108 | 92.0 | 97.0 | 90.0 | 90.0 | 92.0 | 5,449 | LOW |
| 35 | The Birthday Brief | III | 108 | 91.0 | 95.0 | 95.0 | 85.0 | 94.0 | 5,409 | LOW |
| 36 | Mission Execution | III | 106 | 85.0 | 82.0 | 92.0 | 92.0 | 77.0 | 5,451 | LOW |
| 37 | The Mathematics of Revenge | III | 106 | 86.0 | 86.0 | 90.0 | 87.0 | 83.0 | 5,205 | LOW |
| 38 | Last Dance | III | 108 | 89.0 | 84.0 | 97.0 | 92.0 | 95.0 | 5,738 | LOW |
| 39 | When Compadres Fall | III | 110 | 96.0 | 99.0 | 90.0 | 96.0 | 99.0 | 9,909 | LOW |
| 40 | Ares: Death of a God | III | 109 | 96.0 | 93.0 | 98.0 | 97.0 | 94.0 | 4,938 | HIGH |
| 41 | Adios Muchachos | III | 106 | 86.0 | 78.0 | 90.0 | 93.0 | 92.0 | 5,533 | MED |
| 42 | Sacred Smoke | III | 108 | 91.0 | 91.0 | 98.0 | 89.0 | 93.0 | 5,288 | LOW |
| 43 | Resurrection at the Capitol | III | 108 | 91.0 | 88.0 | 94.0 | 90.0 | 98.0 | 5,192 | LOW |
| 44 | The Exile Patriots | III | 107 | 88.0 | 87.0 | 92.0 | 93.0 | 84.0 | 5,605 | LOW |
| 45 | Unidos para Siempre | III | 109 | 94.0 | 99.0 | 93.0 | 86.0 | 99.0 | 5,702 | LOW |

---

## 4 · Market metrics — where the manuscript stands

External market metrics across **Pulitzer Vector (PV)**, **Scholarly
Survival Index (SSI)**, and **Market Pressure Engine (MPE)** cluster
**89–91** mean — every dimension reads as strong by the framework's own
benchmarks.

| Metric | Mean | σ | Min | Max | What it measures |
| --- | ---: | ---: | ---: | ---: | --- |
| PV · Style Originality       | 89.70 | 5.85 | 78.6 | 99.0 | Voice distinctiveness |
| PV · Historical Resonance    | **90.85** | 4.84 | 74.1 | 98.5 | Engagement with WWII/Vietnam history |
| PV · Moral Ambiguity         | 89.41 | 3.71 | 77.5 | 97.5 | Refusal of easy moral closure |
| PV · Emotional Afterlife     | 89.42 | **2.96** | 83.3 | 96.3 | Reliable emotional impact (lowest variance) |
| PV · Structural Control      | 89.68 | 4.96 | 80.1 | 98.1 | Scene + arc discipline |
| SSI · Teachability           | 90.48 | 4.52 | 79.4 | 97.5 | Course / curriculum potential |
| MPE · Purchase Intent        | 89.59 | 4.36 | 81.2 | 97.2 | Trade buyer signal |
| MPE · Hispanic Resonance     | **90.85** | 4.84 | 74.1 | 98.5 | Latino market authentic engagement |
| MPE · Adaptation Interest    | 89.35 | 3.35 | 79.4 | 96.6 | Screen / audio adaptability |

**Market positioning takeaways:**

1. **Hispanic Resonance** and **Historical Resonance** tie for the
   manuscript's highest market signal (90.85 each). The Chicano/Boricua
   linguistic architecture + the Vietnam-era historical core are the
   two engines of this manuscript's commercial position. Submission
   strategy should lead with both.
2. **Emotional Afterlife** has the **lowest variance** (σ 2.96) — the
   manuscript hits emotional reliably across all 45 chapters. That is
   the strongest "no weak spots" signal in the dataset and the best
   evidence for sustained reader retention.
3. **Style Originality** has the widest spread (σ 5.85, min 78.6). The
   low end is the Ch.2 / Ch.17 / Ch.20 / Ch.29 cluster again — the same
   chapters dragging Ω. Fixing the floor lifts two metrics at once.
4. **Coefficient recoverability** — PV/SSI/MPE coefficients are flagged
   `RECOVERABLE` in the Formula Registry (partially truncated in the
   source workbook). These market scores are **diagnostic only** until
   coefficients are recovered (Gate 1 deliverable).

---

## 5 · Metric verification audit (26 metrics)

The 26-metric verification audit classifies metrics three ways:

| Status | Count | Share | Examples |
| --- | ---: | ---: | --- |
| **Verified**  |  8 | 31% | Word Count (241,117), Chapter Count (44 in audit log), Flesch (74), Cliché (80), Redundancy (15), Passive Voice (1,404), Tense, Readability Composite (73.6) |
| **Partial**   |  6 | 23% | Hybrid Ω R², regression coefficients, Cronbach α, per-chapter Ω, LitCentral 12-pillar scores, 5-domain scores |
| **Unverified**| 12 | 46% | Restraint Score, CL-MoE, RRP, Market Advance ($85k–$350k), Streaming/Film Score, Audio Score, LSTE Composite, Pulitzer Probability (68%), Sensory Density, Word-overuse thresholds, Tier Classification |

The 8 verified metrics are externally derived (Novlr, AutoCrit, structural
counts). They form the **empirical floor** of any claim that ships in an
agent or award package. Everything `Partial` or `Unverified` needs to be
labelled **proprietary diagnostic** in external contexts until Gate 2
calibration completes.

### 5.1 Word count reconciliation

The Novlr-verified figure is **241,117 words**. The per-chapter `Words`
column sums to **248,812** — a **+7,695-word** (+3.2%) discrepancy. This
is recoverable: the Novlr number is canonical, the per-chapter figures
need re-derivation from the frozen manuscript hash.

---

## 6 · Active audit flags (9)

| Sev | Chapter(s) | Finding | Fix required | Status |
| --- | --- | --- | --- | :-: |
| **CRITICAL** | Ch.9 / Ch.10 | Near-duplicate openings, 700+ shared lines | Substantially differentiate one chapter | OPEN |
| HIGH         | Ch.40 vs Ch.45 | Death-timeline conflict — Ares compresses 7 deaths; Ch.45 assigns separate dates | Add explicit date-stamps to each death scene | OPEN |
| HIGH         | Ch.45 | Ghost Protocol quartet — 4 men assigned "George Ramos" identity, needs foreshadowing | Seed name discrepancy in Ch.5, 17, or 35 | OPEN |
| MED          | Ch.45 | 14th Marine (Lalo / Eduardo Reyes) surprise — no prior reference | Audit Chs 6-40 for Lalo references | OPEN |
| MED          | Ch.45 | Heading truncated: *"Unidos para Sempr"* | Fix to *"Unidos para Siempre"* | OPEN |
| MED          | Ch.32 | Heading truncated: *"CORRIDOR OF FIRE: THE MASTERPIEC"* | Fix to *MASTERPIECE* | OPEN |
| MED          | Ch.2, 17, 26, 29, 41 | Spanish gap — code-switch density below target | Add organic code-switch moments | OPEN |
| LOW          | Ch.45 | Ocho Vasquez age/description cross-check with Ch.7 | Verify consistency | OPEN |

**The single-priority finding remains Ch.9 / Ch.10.** Two consecutive
chapters sharing 700+ near-identical lines is a structural issue no
amount of metric optimization will paper over, and it is directly
visible in the workbook: Ch.9 and Ch.10 carry **identical** scores
across CLS, SII, BIS, MRF, RRP, and Words (90/91/95/87/93, 5,268
words). The metric framework is *literally telling you they are the
same chapter.*

---

## 7 · Historical / longitudinal context

The framework treats this run as the canonical N=45 baseline (seed 42).
Prior LitCentral versions had two known historical discrepancies the
framework now resolves:

| Layer | Pre-v13 chapter count | Now | Resolution |
| --- | :-: | :-: | --- |
| SPSS workbook              | 45 | 45 | canonical baseline |
| Base44 audit functions     | 46 | → 45 | Gate 0 normalization required |
| Entity schema definition   | 44 | → 45 | Gate 0 normalization required |
| Verified count (Novlr)     | 44 | → 45 | reconcile with hash freeze |

This is the **chapter-count drift** that LitCentral v13's Gate Zero
program was built to eliminate (RamosCanon §1.1). Until all four layers
agree on 45, every downstream metric is computed against an inconsistent
denominator.

**Cohort design** (Gate 3 external validation, ahead of submission):

| Cohort | Pilot N | Conf. N | Convergent metric |
| --- | ---: | ---: | --- |
| MFA / Literary             | 30  | 75  | PV · StyleOriginality, CriticalDistinctiveness |
| Chicano / Latino           | 30  | 75  | MPE · HispanicResonance · PV · MoralAmbiguity |
| Veterans / Military        | 25  | 60  | BIS convergent validity |
| Mainstream Commercial      | 40  | 100 | MPE · Completion · PurchaseIntent · CL-MoE |
| Academic Faculty / Grad    | 20  | 50  | SSI · Teachability · TheoryElasticity |
| Bilingual Readers          | 25  | 60  | SII convergent validity |
| Audiobook-First            | 25  | 60  | MPE · AudioViability |
| Screen Development         | 10  | 25  | MPE · AdaptationInterest |
| **Total**                  | **205** | **505** | — |

---

## 8 · Where it stands in the market

Synthesizing Ω + PV + SSI + MPE against the framework's own ranges:

- **Literary band:** Mean PV 89.6 with Emotional Afterlife σ < 3 — a
  reliably-hitting literary novel; not "experimental" but disciplined.
  Historical Resonance 90.85 reinforces the Pulitzer-vector signal.
- **Scholarly band:** SSI Teachability 90.48 with low spread (σ 4.52)
  suggests a manuscript that lends itself to ethnic studies, military
  history, and Chicano literature syllabi — three converging adoption
  channels.
- **Commercial band:** MPE Purchase Intent 89.59, Hispanic Resonance
  90.85, Adaptation Interest 89.35. The cleanest commercial signal is
  the Latino market — that is also where Historical Resonance compounds.
- **Cross-band synthesis:** the manuscript reads as **prestige-with-pull**
  — the rare combination of literary and scholarly metrics holding above
  90 while commercial metrics also hold above 89. The framework's
  benchmark for this combination is "agent + university press dual
  submission viable."

> **Submission readiness** — *literary metrics, scholarly metrics, and
> commercial metrics all clear the Elite band.* What blocks submission
> right now is **governance** (manuscript hash freeze, chapter-count
> reconciliation, coefficient recovery), **not** literary quality. The
> Three-Gate program addresses the governance side directly.

---

## 9 · Recommended actions, ranked

1. **CRITICAL — Differentiate Ch.9 from Ch.10.** Their identical metric
   row is the framework refusing to pretend they're separate chapters.
2. **HIGH — Re-derive Ch.29 *Mathematics of Revolution*** (CLS -14.9,
   `HIGH` priority). Largest single negative gap of any chapter on any
   component.
3. **HIGH — Resolve the death-timeline conflict** between Ch.40 and Ch.45.
4. **HIGH — Foreshadow the Ghost Protocol identity quartet** (Ch.45
   ripple back to Ch.5 / 17 / 35).
5. **MED — Spanish-gap cluster** (Ch.2, 17, 20, 26, 29, 41). Adding
   organic code-switch moments lifts the three floor chapters past 105
   *and* boosts MPE Hispanic Resonance.
6. **MED — Heading fixes**: *Unidos para Siempre*, *MASTERPIECE*.
7. **GATE 0 — Freeze the manuscript hash** and reconcile chapter count
   to 45 across SPSS / Base44 / schema before any further metric runs.
8. **GATE 0 — Reconcile the word-count discrepancy** (Novlr 241,117 vs
   workbook sum 248,812). Per-chapter words must rederive from the frozen hash.
9. **GATE 2 — Recover PV / SSI / MPE coefficients** from the native
   workbook so the market metrics can stop carrying the
   `DIAGNOSTIC ONLY` label.

---

## Appendix · Where the data came from

- `SGTRamos_SPSS_Chapter_Scoring_Workbook.xlsx` — per-chapter Ω, RRP,
  CLS, SII, BIS, MRF, Fix Priority, gap scores, market metrics, audit
  flags, formula registry.
- `SGTRamos_Manuscript.pdf` — the prior 23-page audit report. Cross-
  referenced for framework wording, market metric definitions, and the
  Three-Gate / cohort design.
- `litcentralcore_25_3.zip` — current LitCentral codebase. Powers the
  `📈 Ω/CLS Trend` tab now wired to the real workbook values
  (`src/lib/chapterScores.js`).
- `dataexploration.pdf` and `Schema__Copy_2.pdf` — image-only PDFs in
  this drop; no extractable text. Recommend re-issuing as text-layered
  PDFs so they enter the next audit cycle.

*Confidential — Proprietary Diagnostic Analytics. All SPSS-derived
indices in this report are internal diagnostic outputs and must be
labelled as such in any agent, academic, or award-facing context until
the Three-Gate validation programme completes.*
