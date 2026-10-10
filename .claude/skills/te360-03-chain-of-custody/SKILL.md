---
name: te360-03-chain-of-custody
description: "TE360 Skill #03 — Chain of Custody. Track every restoration action with hashes, word counts, and edit logs so any text can be authenticated later. Part of the Governance Layer of the AZTLAN TruthEngine360 restoration system. Use when work touches this skill's scope; always under Gabriel T. Arce's editorial authority."
---

# SKILL #03: CHAIN OF CUSTODY

**Layer:** I. GOVERNANCE LAYER

**Purpose:** Track every restoration action with hashes, word counts, and edit logs so any text can be authenticated later.

**Governing Mission:** If it is not logged, it did not happen. If it is not hashed, it is not the text.

**Scope:** Every chapter operation; every deliverable; every adoption.

**Inputs:** Pre/post text, operation type, edit list.

**Outputs:** Custody row: op, pre/post SHA-256 (first 16, working plaintext), words before/after, edit count, deliverable name.

## Rules

- Compute SHA-256 over working plaintext; first-16 in custody table, full hash on adoption records.
- No placeholder hashes. No unlogged change. Counting convention named with every count.
- ARTIFACT-LOSS LESSON (F-23): at delivery, also archive the full text to durable custody (project doc with hash header).
- Deliverable filenames carry chapter + status (WORKING_COPY / CANON).

## Protected Elements

Per the master list (never altered without Gabriel's ruling): character deaths and survivors exactly as recorded; chronology, battle outcomes, and endings; Spanish/Calo and Vietnamese spans with diacritics; the six sensory constants; ceremonial/mystical content; numbering and permanent IDs; all canon-locked clauses. Suspected defects in protected material are FLAG-ONLY.

## Workflow

1. Hash and count pre-text.
2. Execute logged operation.
3. Hash and count post-text.
4. Write custody row.
5. Archive deliverable durably.

**Python/SPSS Integration:** hashlib SHA-256; word-count via regex.

**Output Template:** Ch | op | pre-hash | post-hash | words before -> after | edits | status.

## Governance

Gabriel T. Arce makes all canonical and editorial decisions; Claude/TE360 is verifier and builder. The Master Workbook + custody log are the source-of-truth register (custody log governs where the workbook is stale, pending sync). No model self-authorizes canon. RESTORE, NEVER REWRITE. Band 5,600-5,800; never pad. Every operation is preflight-gated, logged, hashed, and acceptance-gated.

**Related Skills:** 07 Version Control, 01 Canon Guardian, 47 Manuscript Metrics
