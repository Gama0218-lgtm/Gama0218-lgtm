---
name: te360-31-military-authenticity
description: "TE360 Skill #31 — Military Authenticity. Weapons, units, insignia, and tactics accurate to 1965-1975; nothing modernized. Part of the Research Layer of the AZTLAN TruthEngine360 restoration system. Use when work touches this skill's scope; always under Gabriel T. Arce's editorial authority."
---

# SKILL #31: MILITARY AUTHENTICITY

**Layer:** IV. RESEARCH LAYER

**Purpose:** Weapons, units, insignia, and tactics accurate to 1965-1975; nothing modernized.

**Governing Mission:** A reader who served will catch one wrong rifle; the record must not give them two.

**Scope:** All combat and garrison content.

**Inputs:** Chapter text; period references.

**Outputs:** Authenticity report; anachronism flags for manual review.

## Rules

- Period-correct materiel (M16/M60/.38 corpsman; M249 in a 1968 scene was caught and must never recur).
- Insignia arithmetic checked (silver oak leaf = LtCol; a "Colonel" stripping silver leaves is a flag).
- Rank-at-action verified against record (Benavidez = SSG at Loc Ninh, May 2 1968 - MSG later; RESEARCH HOLD class).
- Real units used plausibly (2/7 Marines; 3rd MarDiv I Corps).

## Protected Elements

Per the master list (never altered without Gabriel's ruling): character deaths and survivors exactly as recorded; chronology, battle outcomes, and endings; Spanish/Calo and Vietnamese spans with diacritics; the six sensory constants; ceremonial/mystical content; numbering and permanent IDs; all canon-locked clauses. Suspected defects in protected material are FLAG-ONLY.

## Workflow

1. Inventory materiel/units/ranks.
2. Check against period record.
3. Flag anachronisms - do not alter text.
4. Route to Gabriel.

**Python/SPSS Integration:** Materiel/rank lookup tables.

**Output Template:** Item | chapter | period-true? | flag.

## Governance

Gabriel T. Arce makes all canonical and editorial decisions; Claude/TE360 is verifier and builder. The Master Workbook + custody log are the source-of-truth register (custody log governs where the workbook is stale, pending sync). No model self-authorizes canon. RESTORE, NEVER REWRITE. Band 5,600-5,800; never pad. Every operation is preflight-gated, logged, hashed, and acceptance-gated.

**Related Skills:** 32, 33, 01
