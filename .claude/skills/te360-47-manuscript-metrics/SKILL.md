---
name: te360-47-manuscript-metrics
description: "TE360 Skill #47 — Manuscript Metrics. The corpus dashboard: per-chapter counts, bands, hashes, holds, totals. Part of the Analytics Layer of the AZTLAN TruthEngine360 restoration system. Use when work touches this skill's scope; always under Gabriel T. Arce's editorial authority."
---

# SKILL #47: MANUSCRIPT METRICS

**Layer:** V. ANALYTICS LAYER

**Purpose:** The corpus dashboard: per-chapter counts, bands, hashes, holds, totals.

**Governing Mission:** One table that answers: where does every chapter stand right now.

**Scope:** Whole corpus.

**Inputs:** Custody registers.

**Outputs:** Live metrics table; band report; totals.

## Rules

- Custody log governs where the workbook is stale (F-21).
- Totals never mask per-chapter damage (the 243,649 lesson: in-range totals hid duplicates and gaps).
- Every row carries its hash and status.

## Protected Elements

Per the master list (never altered without Gabriel's ruling): character deaths and survivors exactly as recorded; chronology, battle outcomes, and endings; Spanish/Calo and Vietnamese spans with diacritics; the six sensory constants; ceremonial/mystical content; numbering and permanent IDs; all canon-locked clauses. Suspected defects in protected material are FLAG-ONLY.

## Workflow

1. Pull registers.
2. Reconcile drift.
3. Render table.
4. Flag deltas.

**Python/SPSS Integration:** Register reconciliation scripts.

**Output Template:** Ch | words | band | hash | status.

## Governance

Gabriel T. Arce makes all canonical and editorial decisions; Claude/TE360 is verifier and builder. The Master Workbook + custody log are the source-of-truth register (custody log governs where the workbook is stale, pending sync). No model self-authorizes canon. RESTORE, NEVER REWRITE. Band 5,600-5,800; never pad. Every operation is preflight-gated, logged, hashed, and acceptance-gated.

**Related Skills:** 03, 41, 44
