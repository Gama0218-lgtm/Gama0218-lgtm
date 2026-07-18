---
name: te360-02-verification-claim-adjudication
description: "TE360 Skill #02 — Verification & Claim Adjudication. Adjudicate factual claims to CONFIRMED / PROBABLE / PARTIALLY VERIFIED / UNVERIFIED with evidence weights. Part of the Governance Layer of the AZTLAN TruthEngine360 restoration system. Use when work touches this skill's scope; always under Gabriel T. Arce's editorial authority."
---

# SKILL #02: VERIFICATION & CLAIM ADJUDICATION

**Layer:** I. GOVERNANCE LAYER

**Purpose:** Adjudicate factual claims to CONFIRMED / PROBABLE / PARTIALLY VERIFIED / UNVERIFIED with evidence weights.

**Governing Mission:** No number without a status tag. No settling without BIBFRAME.

**Scope:** All historical, statistical, and manuscript-record claims (DCAS, deported veterans, P100k, casualty figures).

**Inputs:** Claim text, source documents, register statuses (te360-core Section 1).

**Outputs:** Status-tagged claims; upgrade/downgrade log; research-hold rows.

## Rules

- Evidence weights: .gov/NARA +1.5, peer-reviewed DOI +2.0, legal citation +1.8, contradiction -0.5.
- The 349 is institutional tradecraft - never cite as a valid estimate; tag [UNDERCOUNTED / NARA PRIMARY OUTPUT].
- Asymmetric uncertainty: report ranges (BISG 2,309-3,741), never collapse to one number.
- Fiction stays labeled fiction (Ghost Protocol, 17.8% anomaly) - the bright line is the credibility strategy.

## Protected Elements

Per the master list (never altered without Gabriel's ruling): character deaths and survivors exactly as recorded; chronology, battle outcomes, and endings; Spanish/Calo and Vietnamese spans with diacritics; the six sensory constants; ceremonial/mystical content; numbering and permanent IDs; all canon-locked clauses. Suspected defects in protected material are FLAG-ONLY.

## Workflow

1. State the claim exactly.
2. Gather sources; weigh.
3. Assign status; record evidence line.
4. BIBFRAME-encode if CONFIRMED.
5. Log upgrades in the session record.

**Python/SPSS Integration:** Status ledger in workbook; weight arithmetic in Python.

**Output Template:** Claim | value | source | status | evidence.

## Governance

Gabriel T. Arce makes all canonical and editorial decisions; Claude/TE360 is verifier and builder. The Master Workbook + custody log are the source-of-truth register (custody log governs where the workbook is stale, pending sync). No model self-authorizes canon. RESTORE, NEVER REWRITE. Band 5,600-5,800; never pad. Every operation is preflight-gated, logged, hashed, and acceptance-gated.

**Related Skills:** 04 BIBFRAME, 32 Historical Verification, 39 Statistical Validation
