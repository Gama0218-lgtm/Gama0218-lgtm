# /perplexity-recover — Recover and Export Perplexity Work into Claude

Use this command to retrieve, organize, and validate any work product Perplexity generated for SGT George Ramos. Paste Perplexity's output or identify the chapter. Claude organizes it, checks it, and returns it as a clean file you own.

## MANDATORY HANDOFF PROTOCOL — RUNS ON EVERY OUTPUT

A task is not complete until the work product is returned to Gabriel.

1. Display the complete deliverable in the conversation.
2. Generate a downloadable file when output is longer than 1,500 words.
3. Preserve all tables, calculations, citations, and OLD → NEW interventions.
4. Never retain completed work solely inside temporary analysis or scratch space.
5. Never replace delivery with "not in command," "not authorized," or "outside scope."
6. If export fails, return full plain-text and explain only the technical limitation.
7. Never edit the canonical manuscript without separate written authorization from Gabriel.

---

## USAGE

```
/perplexity-recover ch[N]
```

Paste the Perplexity session output when prompted. Or name the chapter and Claude will check the repo for existing Perplexity work on it.

---

## WHAT THIS COMMAND DOES

1. **Identifies** what Perplexity produced (audit, insertion, scoring, revision)
2. **Extracts** every distinct work product (scores, prose proposals, source citations)
3. **Organizes** by chapter and type
4. **Runs /perplexity-digest** on all prose proposals before flagging anything as usable
5. **Returns** a clean organized file with everything categorized

---

## RECOVERY SEQUENCE

### Step 1 — Inventory
List everything Perplexity produced:
- Chapter audits (Ω scores, LitCentral, PBI)
- Prose insertions (Tier 1 / Tier 2 / Tier 3)
- Source citations
- Formula calculations
- Governance flags it raised or missed

### Step 2 — Score Verification
For every Ω score Perplexity reported:
- Re-run arithmetic (show full calculation)
- Identify formula version used
- Flag any ceiling violations (>114.593)
- Flag any standard formula (0.067 MRF) used where RF 1.5 (0.1005) is required

### Step 3 — Prose Extraction
Pull every OLD → NEW diff Perplexity produced.
Preserve exact text — no paraphrase.
Label each as:
- `STYLE_ONLY` — no new fact, no canon change
- `CANON_REUSE` — uses detail already in manuscript
- `HISTORICAL_VERIFIED` — has a source citation
- `NEW_CANON` — requires Gabriel authorization
- `PROHIBITED` — changes plot, dialogue, identity, timeline

### Step 4 — Chicano Lens Pass
Run Filter 3 from /perplexity-digest on all prose extractions.
Any banned phrase = immediate PROHIBITED label.
Any tier misassignment = FLAG for Gabriel decision.

### Step 5 — Deliver

Return:
1. Inventory table (what Perplexity produced per chapter)
2. Score verification table (corrected arithmetic)
3. Clean prose proposals (STYLE_ONLY and CANON_REUSE) — ready for Gabriel review
4. Flagged proposals — need author decision
5. Rejected content — list with reason

---

## EXISTING PERPLEXITY WORK IN REPO

| File | Content | Status |
|------|---------|--------|
| `data/tier1_critical_insertions.md` | Tier 1 prose proposals | Run /perplexity-digest |
| `data/tier2_high_priority_insertions.md` | Tier 2 prose proposals | Run /perplexity-digest |
| `data/tier3_standard_insertions.md` | Tier 3 prose proposals | Run /perplexity-digest |
| `data/surgical_CLS_insertions_v1.md` | CLS surgical insertions | Run /perplexity-digest |
| `data/surgical_CLS_insertions_v2_missing3.md` | CLS v2 | Run /perplexity-digest |
| `data/week3_bis_pass.md` | BIS pass proposals | Run /perplexity-digest |
| `data/ch01_omega_elite_v3.md` | Ch.01 upgraded | Ends "Still here." — Cumplido. required |
| `data/ch01_omega_111_canonical.md` | Full 45-chapter manuscript | 5x SAGATA misspelling — fix pending |
| `data/full_dual_audit_v15.json` | All 45 chapters scored | Verify formula version |
| `data/SGT_Ramos_OMEGA_Audit_v15_SEALED.xlsx` | Sealed workbook | Reference only |

---

## OUTPUT FORMAT

```
═══════════════════════════════════════════════
/perplexity-recover — CH.[N]: [TITLE]
[Date] · Recovery source: [paste / repo file]
═══════════════════════════════════════════════

INVENTORY:
  [table of what was recovered]

SCORE VERIFICATION:
  Perplexity claimed: Ω [X]
  Corrected arithmetic: [full calculation]
  Verdict: ACCURATE / INCORRECT ([corrected value])

CLEAN PROPOSALS — READY FOR GABRIEL REVIEW:
  [numbered list with OLD → NEW]

FLAGGED PROPOSALS — GABRIEL DECISION REQUIRED:
  [numbered list with reason]

REJECTED:
  [list with reason]

DELIVERABLE FILE: [filename] · [word count]

GOVERNANCE: 🔴 Yaqui consultation not initiated
═══════════════════════════════════════════════
```

---

## AUTHORITY

This command does not write to the manuscript. It recovers and organizes. Gabriel authorizes every change. Claude executes only what is approved.
