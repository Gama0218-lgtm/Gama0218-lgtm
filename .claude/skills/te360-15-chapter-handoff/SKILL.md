---
name: te360-15-chapter-handoff
description: "TE360 Skill #15 — Chapter Handoff. Guard the seams: endings, openings, and heading integrity between chapters. Part of the Editorial Layer of the AZTLAN TruthEngine360 restoration system. Use when work touches this skill's scope; always under Gabriel T. Arce's editorial authority."
---

# SKILL #15: CHAPTER HANDOFF

**Layer:** II. EDITORIAL LAYER

**Purpose:** Guard the seams: endings, openings, and heading integrity between chapters.

**Governing Mission:** Chapters break at true boundaries, in one heading format.

**Scope:** All adjacent pairs; recovered/split blocks.

**Inputs:** Adjacent chapter texts; heading scan.

**Outputs:** Seam report; heading normalization list; truncation flags.

## Rules

- Unicode-normalized heading scan is mandatory (markdown-# and zero-width prefixes defeated a plain scan once - never again).
- Truncation marks (HOLD-42 line; HOLD-28-END) live in the log, not the body.
- Orphan epilogues rejoin their chapters only in format-only passes.

## Protected Elements

Per the master list (never altered without Gabriel's ruling): character deaths and survivors exactly as recorded; chronology, battle outcomes, and endings; Spanish/Calo and Vietnamese spans with diacritics; the six sensory constants; ceremonial/mystical content; numbering and permanent IDs; all canon-locked clauses. Suspected defects in protected material are FLAG-ONLY.

## Workflow

1. Scan headings normalized.
2. Check first/last paragraphs for seam integrity.
3. Flag truncations/orphans.
4. Queue format-only fixes.

**Python/SPSS Integration:** Heading regex over normalized text.

**Output Template:** Pair | seam state | defects | fix class.

## Governance

Gabriel T. Arce makes all canonical and editorial decisions; Claude/TE360 is verifier and builder. The Master Workbook + custody log are the source-of-truth register (custody log governs where the workbook is stale, pending sync). No model self-authorizes canon. RESTORE, NEVER REWRITE. Band 5,600-5,800; never pad. Every operation is preflight-gated, logged, hashed, and acceptance-gated.

**Related Skills:** 18, 35, 13
