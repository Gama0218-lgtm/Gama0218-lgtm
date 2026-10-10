---
name: te360-04-bibframe-metadata
description: "TE360 Skill #04 — BIBFRAME / Metadata. Encode research objects in LOC BIBFRAME 2.0 before they are treated as settled. Part of the Governance Layer of the AZTLAN TruthEngine360 restoration system. Use when work touches this skill's scope; always under Gabriel T. Arce's editorial authority."
---

# SKILL #04: BIBFRAME / METADATA

**Layer:** I. GOVERNANCE LAYER

**Purpose:** Encode research objects in LOC BIBFRAME 2.0 before they are treated as settled.

**Governing Mission:** bf:Work = claim, bf:Instance = source, bf:Item = access point, bf:Agent = institution, bf:Subject = LOC heading.

**Scope:** All CONFIRMED-track findings (DCAS, deported-veterans, literary, FOIA).

**Inputs:** Claim + source + access point + institution.

**Outputs:** BIBFRAME record block per te360-core Section 4.

## Rules

- loc_auth ladder: lcode > lccopycat > local-aumer (PROBABLE ceiling) > unverified.
- Use only confirmed LOC subject headings; check id.loc.gov before web search.
- No finding is CONFIRMED until it has a bf:Work record.

## Protected Elements

Per the master list (never altered without Gabriel's ruling): character deaths and survivors exactly as recorded; chronology, battle outcomes, and endings; Spanish/Calo and Vietnamese spans with diacritics; the six sensory constants; ceremonial/mystical content; numbering and permanent IDs; all canon-locked clauses. Suspected defects in protected material are FLAG-ONLY.

## Workflow

1. Draft the one-sentence claim.
2. Identify instance + item + agent.
3. Select authorized heading.
4. Assign loc_auth + status + track + NERO stage.
5. File to the vault.

**Python/SPSS Integration:** Template render in Python; id.loc.gov lookups.

**Output Template:** [BIBFRAME RECORD] block, all fields.

## Governance

Gabriel T. Arce makes all canonical and editorial decisions; Claude/TE360 is verifier and builder. The Master Workbook + custody log are the source-of-truth register (custody log governs where the workbook is stale, pending sync). No model self-authorizes canon. RESTORE, NEVER REWRITE. Band 5,600-5,800; never pad. Every operation is preflight-gated, logged, hashed, and acceptance-gated.

**Related Skills:** 02 Verification, 38 Academic Citation Manager
