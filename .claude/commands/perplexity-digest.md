# /perplexity-digest — Ingest and Validate Perplexity Output

Paste Perplexity's output. This skill strips it down, checks it against Gabriel's canonical rules, and returns only what is clean, sourced, and author-approved in register.

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

## WHAT THIS SKILL DOES

Takes raw Perplexity output (chapter revision, audit, insertion, scoring) and runs it through Gabriel's three canonical filters before anything touches the manuscript.

---

## FILTER 1 — FORMULA COMPLIANCE

Check every Ω score in the Perplexity output:

| Check | Rule | Action if Failed |
|-------|------|-----------------|
| Formula version | RF 1.5 = 0.1005·MRF, not 0.067 | FLAG and correct |
| Ceiling | 114.593 absolute maximum — non-negotiable | REJECT any score above |
| No N/A components | All four components must have numeric values | FLAG — rescore required |
| No back-solving | Components cannot be derived from a desired Ω | REJECT and note |
| Arithmetic check | Verify: 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF = stated Ω | Show full arithmetic |

---

## FILTER 2 — CANON AND GOVERNANCE CHECK

| Check | Rule | Action if Failed |
|-------|------|-----------------|
| Ch.01 ending | Must end with *Cumplido.* — not "Still here." | FLAG immediately |
| Chapter count | 45 chapters total — never 50 | CORRECT |
| Yaqui ceremony content | No new ceremony content without tribal consultation | REJECT — note governance gate 🔴 |
| Huya ania | Canonical — already in manuscript | PASS |
| Seataka | NOT canonical — governance gate applies | REJECT |
| Sagasta spelling | SAGASTA — never SAGATA | FLAG all instances |
| Ghost Protocol | Joshua Sagasta = George Ramos program designation | Verify architecture preserved |

---

## FILTER 3 — CHICANO LENS / REGISTER CHECK

Scan every proposed insertion or revision for:

**Banned phrases — instant reject, no exception:**
- "a language older than words"
- "cosmic rhythm"
- "burned in the soul / eyes / heart"
- "he felt a presence"
- "something he could not name"
- "time seemed to stop"
- "suddenly", "very", "really", "quite", "somewhat"
- "began to" / "started to"
- "seemed", "appeared", "felt" as filter words

**Five-tier code-switching — verify tier is correct:**
- Tier 1: Prayer/Peak Fear — "Dios mío... Virgencita de Guadalupe" — internal monologue at maximum vulnerability
- Tier 2: Liminal/Death — "hermano" = terminal word in every death scene
- Tier 3: Command urgency — "¡Dáles fuego!" / "¡TODOS CRUZAN O NADIE CRUZA!"
- Tier 4: Barrio solidarity — carnal > hermano > brother (intimacy hierarchy)
- Tier 5: Forensic consciousness — "Esto no es casualidad, hermanos. Alguien nos está juntando como ganado."

**SAF ratio check:**
- If Perplexity added sensory content: is it concentrated in the right chapter or diffused?
- Sensory anchor chapters: target 5/5. Non-anchor chapters: keep lean.

**CL-MoE check:**
- CL-MoE = 1 − (Ω-adjusted / Ω-raw)
- Acceptable band: 0.040–0.079
- Floor alert: 0.020 (no Chicano voice active)
- Ceiling alert: 0.079+ (voice overwhelming mainstream access)

---

## OUTPUT FORMAT

```
═══════════════════════════════════════════════
/perplexity-digest — CH.[N]: [TITLE]
[Date] · Perplexity source: [identified / unknown]
═══════════════════════════════════════════════

FORMULA COMPLIANCE:   PASS / [FLAGS]
CANON COMPLIANCE:     PASS / [FLAGS]
CHICANO LENS:         PASS / [FLAGS]

CLEAN CONTENT (safe to consider):
  [list what passed all three filters]

FLAGGED CONTENT (requires Gabriel decision):
  [list what failed with specific reason]

REJECTED CONTENT (do not enter manuscript):
  [list what violates governance — governance gate, banned phrases, ceiling violations]

GABRIEL DECISION REQUIRED:
  [numbered list — yes/no per item]

═══════════════════════════════════════════════
HANDOFF: [file generated / displayed in full]
GOVERNANCE: 🔴 Yaqui consultation not initiated
═══════════════════════════════════════════════
```

---

## AUTHORITY

Gabriel approves all changes. Every item marked FLAGGED or CLEAN is a proposal until Gabriel says yes. Nothing enters the canonical manuscript without explicit author authorization.
