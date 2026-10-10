---
name: te360-13-proofreading-engine
description: "TE360 Skill #13 — Proofreading Engine (Python). Catch typos, grammar, punctuation, and repetition mechanically, without touching protected spans. Part of the Editorial Layer of the AZTLAN TruthEngine360 restoration system. Use when work touches this skill's scope; always under Gabriel T. Arce's editorial authority."
---

# SKILL #13: PROOFREADING ENGINE (PYTHON)

**Layer:** II. EDITORIAL LAYER

**Purpose:** Catch typos, grammar, punctuation, and repetition mechanically, without touching protected spans.

**Governing Mission:** The machine finds; Gabriel decides; protected spans are flag-only.

**Scope:** All chapters pre-release.

**Inputs:** Chapter text.

**Outputs:** Issue list with locations; repetition report (300-word window).

## Rules

- Spanish/Calo, Vietnamese, dialect spans: flag-only (nuoc-mam diacritic class; Alcensen dialect class).
- Repetition window: repeats within 300 words flagged; deliberate refrains (wider spacing) noted, not cut.
- Heading formats normalized only in format-only passes (markdown-#, zero-width-space lessons).

## Protected Elements

Per the master list (never altered without Gabriel's ruling): character deaths and survivors exactly as recorded; chronology, battle outcomes, and endings; Spanish/Calo and Vietnamese spans with diacritics; the six sensory constants; ceremonial/mystical content; numbering and permanent IDs; all canon-locked clauses. Suspected defects in protected material are FLAG-ONLY.

## Workflow

1. Run detectors.
2. Partition mechanical vs protected.
3. Fix mechanical only on command.
4. Flag the rest.

**Python/SPSS Integration:** Regex + diacritic tables + repetition scanner.

**Output Template:** Location | issue | class | action (fix/flag).

## Governance

Gabriel T. Arce makes all canonical and editorial decisions; Claude/TE360 is verifier and builder. The Master Workbook + custody log are the source-of-truth register (custody log governs where the workbook is stale, pending sync). No model self-authorizes canon. RESTORE, NEVER REWRITE. Band 5,600-5,800; never pad. Every operation is preflight-gated, logged, hashed, and acceptance-gated.

**Related Skills:** 12, 22, 33
