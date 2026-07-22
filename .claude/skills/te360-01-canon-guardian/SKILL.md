---
name: te360-01-canon-guardian
description: "TE360 Skill #01 — Canon Guardian. Enforce plot integrity: no change to events, fates, deaths, dates, outcomes, or locked clauses without Gabriel's ruling. Highest priority. Part of the Governance Layer of the AZTLAN TruthEngine360 restoration system. Use when work touches this skill's scope; always under Gabriel T. Arce's editorial authority."
---

# SKILL #01: CANON GUARDIAN

**Layer:** I. GOVERNANCE LAYER

**Purpose:** Enforce plot integrity: no change to events, fates, deaths, dates, outcomes, or locked clauses without Gabriel's ruling. Highest priority.

**Governing Mission:** Protect the story exactly as written. The manuscript's facts outrank every editor, model, and tool.

**Scope:** Every chapter operation, every layer. Runs before and after any edit.

**Inputs:** Chapter text (pre/post), protected-elements master list, Canon Guardian flag matrix (#1-26 + A1-A21).

**Outputs:** Pass/fail canon check; new flag rows; HALT order when a mismatch persists.

## Rules

- Never alter deaths, survivors, chronology, battle outcomes, endings, or thematic resolution.
- Mismatch found -> restore the original plot point immediately; if it persists -> HALT and report to Gabriel Review.
- Multiplicity is not error by default: read every conflict against the Ch45 four-name record (flag #6) before proposing a fix.
- Flags are logged, never silently resolved.

## Protected Elements

Per the master list (never altered without Gabriel's ruling): character deaths and survivors exactly as recorded; chronology, battle outcomes, and endings; Spanish/Calo and Vietnamese spans with diacritics; the six sensory constants; ceremonial/mystical content; numbering and permanent IDs; all canon-locked clauses. Suspected defects in protected material are FLAG-ONLY.

## Workflow

1. Extract canonical facts (events, fates, dates, places, counts).
2. Run the edit or audit.
3. Re-extract and diff the fact set.
4. Log variances to the flag matrix with chapter touch-list.
5. Route anything unresolved to Gabriel.

**Python/SPSS Integration:** Python fact-diff over pre/post text; probe-line identity checks for recovered chapters.

**Output Template:** Flag row: # | category | description | chapters touched | session opened.

## Governance

Gabriel T. Arce makes all canonical and editorial decisions; Claude/TE360 is verifier and builder. The Master Workbook + custody log are the source-of-truth register (custody log governs where the workbook is stale, pending sync). No model self-authorizes canon. RESTORE, NEVER REWRITE. Band 5,600-5,800; never pad. Every operation is preflight-gated, logged, hashed, and acceptance-gated.

**Related Skills:** 02 Verification, 03 Chain of Custody, 14 Continuity Tracker, 10 Montezuma Oversight
