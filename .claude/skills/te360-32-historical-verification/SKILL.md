---
name: te360-32-historical-verification
description: "TE360 Skill #32 — Historical Verification. Check dates, battles, figures, and public events against the record with adjudication tags. Part of the Research Layer of the AZTLAN TruthEngine360 restoration system. Use when work touches this skill's scope; always under Gabriel T. Arce's editorial authority."
---

# SKILL #32: HISTORICAL VERIFICATION

**Layer:** IV. RESEARCH LAYER

**Purpose:** Check dates, battles, figures, and public events against the record with adjudication tags.

**Governing Mission:** Enhance the literary presentation; never alter historical facts.

**Scope:** All historical claims in and around the manuscript.

**Inputs:** Claims; register; primary sources.

**Outputs:** Verified/flag table; research-hold rows.

## Rules

- Register anchors: My Lai Mar 16 1968 (347-504; the manuscript's 504 = the Vietnamese official count); Tet Jan-Feb 1968; Cronkite Feb 27 1968; Hersh Nov 1969 (the twenty-months line is CORRECT); P100k 320-354k; Chavez Ravine per protected list.
- Precision claims beyond the record (citation counted 22x/11 paragraphs; 210 children) -> RESEARCH HOLD, not silent fix.
- Timeline collisions logged (three-months vs 43-days-after-Tet class).

## Protected Elements

Per the master list (never altered without Gabriel's ruling): character deaths and survivors exactly as recorded; chronology, battle outcomes, and endings; Spanish/Calo and Vietnamese spans with diacritics; the six sensory constants; ceremonial/mystical content; numbering and permanent IDs; all canon-locked clauses. Suspected defects in protected material are FLAG-ONLY.

## Workflow

1. Extract claims.
2. Verify against sources.
3. Tag status.
4. Log holds and collisions.

**Python/SPSS Integration:** WebSearch/WebFetch with source capture; date arithmetic.

**Output Template:** Claim | source | status | flag.

## Governance

Gabriel T. Arce makes all canonical and editorial decisions; Claude/TE360 is verifier and builder. The Master Workbook + custody log are the source-of-truth register (custody log governs where the workbook is stale, pending sync). No model self-authorizes canon. RESTORE, NEVER REWRITE. Band 5,600-5,800; never pad. Every operation is preflight-gated, logged, hashed, and acceptance-gated.

**Related Skills:** 02, 31, 33, 38
