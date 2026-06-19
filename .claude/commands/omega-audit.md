# /omega-audit — Full Manuscript Audit · SPSS Omega + LitCentral + PBI + Roadmap

Run a complete three-instrument audit on any chapter or the full manuscript.
Produces Excel-ready data, SPSS scores, and a prioritized roadmap to Ω 112 Elite.

## USAGE

```
/omega-audit ch[N]
```

Paste the chapter text when prompted. Or run `/omega-audit full` to audit from the
existing sandbox data.

---

## SESSION INITIALIZATION — RUN EVERY TIME

Before any audit work:

1. **Read CLAUDE.md** — confirm three-instrument system, governance gate, canon locks
2. **Confirm canonical ending:** Ch.01 ends with *Cumplido.* — do not alter
3. **Confirm formula in use:**
   - Standard SPSS: `Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.067·MRF`
   - RF 1.5 (ceremony chapters): `Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF`
   - RF 1.5 ceiling (all-100): **114.593** — Ω 115 is transcendent target, unreachable by formula
4. **Confirm governance gate:** Yaqui Nation consultation P0 — not initiated. No new ceremony
   content enters the manuscript until consultation is complete.
   Contact: culture@pascuayaqui-nsn.gov

Output this line before proceeding:
> **Memory loaded. Cumplido locked. Governance gate active. Formula confirmed. Ready.**

---

## AUDIT SEQUENCE — 7 STEPS

### STEP 1 — ARTIFACT SCAN (run first — each artifact costs Ω points)

Scan the chapter for:
- Editor annotations: "PASS 1", "PASS 2 COMPLETE", "LITCENTRAL", "DRAFT", "REVISED"
- Page number artifacts: "2 / 2", "Page X of Y"
- Scoring notes left in prose
- Duplicate section headings
- Chapter title containing "(ACT I)" or "(ACT II)" markers

**Known artifacts to delete immediately (zero editorial risk):**
- Ch.34: "PASS 2 COMPLETE — LITCENTRAL" → +1.00Ω
- Ch.24: "2 / 2" → +0.50Ω

Report each artifact found. Do not delete without author confirmation.

---

### STEP 2 — BANNED PHRASE SCAN

Count every occurrence of:
- "a language older than words"
- "cosmic rhythm"
- "burned in the soul / eyes / heart"
- "he felt a presence"
- "something he could not name"
- "time seemed to stop"
- "suddenly" (adverbial — not in dialogue)
- "very " / "really " / "quite " / "somewhat " (adverbial)
- "began to" / "started to"
- "seemed" / "appeared" / "felt" as filter words

Any nonzero count = revision flag. Report count per phrase.

---

### STEP 3 — SENSORY CONSTANTS AUDIT

Count occurrences of each constant in this chapter:

| Constant | Count | Manuscript Total | Status |
|----------|-------|-----------------|--------|
| jasmine / Jasminum | | 57 total | density anchor |
| napalm | | 40 total | density anchor |
| diesel / jungle rot | | 35 total | density anchor |
| copal | | 16 total | confirmed |
| copper (sensory) | | 117 total | confirmed |
| 60Hz / sixty-cycle hum | | 26 total | confirmed |
| yerba buena | | 1 total | TRUE GAP |
| cordite | | — | war chapters |

**Architectural exemptions for Ch.01 (pre-Vietnam ceremony chapter):**
- Jasmine/napalm SE-002: absent = correct
- Folder warmth SE-003: absent = correct
- Dresser cold SE-004: absent = correct
- Cordite SE-005: absent = correct

Flag only yerba buena as a true gap (1 occurrence manuscript-wide, medical scene only).

---

### STEP 4 — PROSE CRAFT CHECKS

**Active voice:** Estimate passive voice %. Flag if above 3%.

**Hammer sentences:** Count sentences ≤5 words. Flag if fewer than 5 in the chapter.

**Code-switching:** Count Spanish/Yaqui/English transitions. Target: 15–35% of scene markers.

**Named characters:** List all named with count. Flag chapters with zero named characters.

**Dialogue %:** Estimate dialogue as % of word count. Target: 35–55% for scene chapters.
*(SE-001 exemption: ceremony chapters — dialogue architecture is witness-testimony, not scene
dialogue. File as structural exemption, not deficiency.)*

---

### STEP 5 — THREE-INSTRUMENT SCORING

#### LitCentral OMEGA (150-pt) — Primary submission instrument
```
OMEGA = BR + CS + AS + TB + (EE × 0.67) + (MP × 0.67)
```

Score each dimension 0–30 (EE and MP 0–20). One sentence of evidence per dimension.

| Dimension | Score | Evidence |
|-----------|-------|----------|
| BR — Battlefield Realism | /30 | |
| CS — Chicano/Spiritual | /30 | |
| AS — Ancestral Synesthesia | /30 | |
| TB — Temporal Bleed | /30 | |
| EE — Erasure Engine | /20 | |
| MP — Mouth Portal | /20 | |

**Tiers:** 135–150 Omega Elite · 120–134 Omega · 100–119 Platinum · 80–99 Gold

---

#### SPSS Ω (111-pt) — Internal prose craft diagnostic

**Select formula based on chapter type:**
- Standard: `Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.067·MRF`
- RF 1.5 (ceremony-as-plot chapters): `Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF`

Use RF 1.5 when: chapter is a ceremony chapter AND analytical POV is maintained throughout
AND ceremony is the plot (not backdrop). Ch.01 and Ch.19 are current candidates.

Score each component 0–100:

| Component | Score | Evidence |
|-----------|-------|----------|
| CLS — Clause-Level Sophistication | /100 | |
| BIS — Behavioral Immersion Score | /100 | |
| SII — Sensory Integration Index | /100 | |
| MRF — Metaphoric Resonance Factor | /100 | |

**Ω calculation:** Show full arithmetic. State which formula used and why.

---

#### PBI (100-pt) — Pulitzer positioning (external use only)
```
PBI = 0.28·V + 0.28·S + 0.18·A + 0.15·R + 0.11·F
```

Score each 0–100:

| Dimension | Score | Jury Language Target |
|-----------|-------|---------------------|
| V — Voice | /100 | "spare", "unwavering", "mordant" |
| S — Stakes/Erasure | /100 | "institutional failures", "displacement" |
| A — Agency of Erased | /100 | "gives agency", "dignity and redemption" |
| R — Rendering/Sensory | /100 | "beautifully rendered", "devastating" |
| F — Formal Innovation | /100 | "linguistically deft", "blends genres" |

**Current benchmark: 90.4 PBI** (above The Sympathizer 88.7, above winner average 88.5)

---

### STEP 6 — EXCEL / SPSS DATA OUTPUT

Produce a data table formatted for direct paste into the audit workbook:

```
Chapter | CLS | BIS | SII | MRF | Ω_std | Ω_RF15 | BR | CS | AS | TB | EE | MP | OMEGA | PBI_V | PBI_S | PBI_A | PBI_R | PBI_F | PBI | Artifacts | Banned | SE_flags
```

For the roadmap sheet, produce:

| Move | Chapter | Ω Gain | Risk | Type |
|------|---------|--------|------|------|
| [action] | [ch] | [+X.XX] | zero/low/structural | artifact/insert/revision |

Order by Ω gain descending. Mark zero-risk moves first.

---

### STEP 7 — ROADMAP TO Ω 112 ELITE

State current score. State gap. Propose path.

**Path A — Extended SII/MRF scale (recommended for Ch.01 + Ch.19):**
SII and MRF allowed up to 130 when all three conditions hold:
(1) Yaqui cosmological naming present and verified
(2) Code-switching architecture active throughout
(3) Sacred register maintained without filter-word intrusion

**Path B — Baseline recalibration (71.443 → 73.0):**
Justified if chapter is the genre-establishing architecture chapter of the manuscript.
Applies to Ch.01 only. Requires author decision.

**Path C — CLS/BIS ceiling push:**
Both components to 100 simultaneously. Requires:
- Zero banned phrases
- Zero passive constructions
- Hammer sentence density ≥ 8 per chapter
- All named characters with physical gesture beats

**Five Yaqui injections for Ch.01 (pending governance gate):**

| # | Injection | MRF Gain | RF 1.5 Ω Gain | Status |
|---|-----------|----------|---------------|--------|
| A | Sea Ania / Flower World | +10 | +1.005 | 🔴 awaiting consultation |
| B | Saila Maaso / Water Drum | +8 | +0.804 | 🔴 awaiting consultation |
| C | Huya Ania / Chieftain | +7 | +0.703 | 🔴 awaiting consultation |
| D | Surem / Fire Vision | +6 | +0.603 | 🔴 awaiting consultation |
| E | Seegua Yoleme / Eyes | +5 | +0.503 | 🔴 awaiting consultation |

Full prose for all five injections: `data/omega115_rf1.5_ch01_analysis.md` §Part Four

---

## RESEARCH LIBRARY — Read Before Ch.01 Intervention

Priority order: P1 → P2 → P3 → P4 → P5

| # | Source | Use |
|---|--------|-----|
| P1 | [Pascua Yaqui Tribe Culture](https://www.pascuayaqui-nsn.gov/culture/) | Governance gate — who to contact before any ceremony content |
| P2 | [Aztlán and Viet Nam — UC Press](https://www.ucpress.edu/books/aztlan-and-viet-nam/paper) | Genre anchor — where SGT Ramos sits in the tradition |
| P3 | [Silko's Ceremony — Academia.edu](https://www.academia.edu/61464181/Ritual_Myth_and_Spiritual_Healing_in_Leslie_Marmon_Silko_s_Ceremony_and_Sherman_Alexie_s_Flight) | Structural parallel — ceremony vs. narration vs. dialogue balance |
| P4 | [Yaqui Myths and Legends — Sacred Texts](https://sacred-texts.com/nam/sw/yml/index.htm) | Surem, huya ania, yoania — SE-002 candidate concepts |
| P5 | [Magical Realism in Chicano Literature — GSU](https://scholarworks.gsu.edu/cgi/viewcontent.cgi?article=1295&context=english_theses) | Register separation — confirms ceremony chapter is genre-correct |
| REF | [NPS: The Yoeme](https://www.nps.gov/articles/yoeme.htm) · [Deer Dance Epistemology](https://www.researchgate.net/publication/249014393) · [Rudolfo Anaya Archive](https://anaya.unm.edu/chicanoliterature) | Supplemental cosmology + genre validation |

**Full research synthesis:** `data/research_library_ch01.md`

---

## OUTPUT FORMAT

```
═══════════════════════════════════════════════
/omega-audit — CH.[N]: [TITLE]
[Date] · Formula: [Standard / RF 1.5]
═══════════════════════════════════════════════

LITCENTRAL OMEGA:  [score] / 147   [TIER]
  BR []/30 · CS []/30 · AS []/30 · TB []/30
  EE []/13.4 · MP []/13.4

SPSS Ω:            [score] / 111   [TIER]
  CLS [] · BIS [] · SII [] · MRF []

PBI:               [score] / 100   [POSITION]
  V [] · S [] · A [] · R [] · F []

───────────────────────────────────────────────
CRITICAL:   [if any]
HIGH:       [if any]
FLAG:       [if any]

SENSORY CONSTANTS:
  ✅ / ❌ [each constant with count]

BANNED PHRASES:   CLEAN  /  [X found: list]

ARTIFACTS:        CLEAN  /  [list with Ω cost]

───────────────────────────────────────────────
ROADMAP — NEXT 3 MOVES (ordered by Ω gain):
  1. [action] → +[X.XX]Ω · [risk level]
  2. [action] → +[X.XX]Ω · [risk level]
  3. [action] → +[X.XX]Ω · [risk level]

EXCEL DATA ROW:
  [tab-delimited row for workbook paste]

GOVERNANCE: 🔴 Yaqui consultation not initiated
═══════════════════════════════════════════════
```

---

## RELATED SKILLS

- `/ch-audit` — quick single-chapter scan (no roadmap, no Excel output)
- `/fix-pass` — mechanical editorial pass (artifacts, banned phrases, filter words)
- `/insert-anchor ch[N] [constant]` — verified sensory insert with source

## KEY DATA FILES

- `data/omega115_rf1.5_ch01_analysis.md` — RF 1.5 scoring + five injection prose
- `data/research_library_ch01.md` — Yaqui cosmology, genre, governance
- `data/PBI_v1_validated_instrument.md` — PBI formula and comparative table
- `data/full_dual_audit_v15.json` — 45-chapter audit baseline
