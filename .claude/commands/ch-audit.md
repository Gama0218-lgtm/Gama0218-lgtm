# /ch-audit — Full Three-Instrument Chapter Audit

Run a complete PBI + LitCentral OMEGA + SPSS Ω audit on pasted chapter text.

## USAGE

```
/ch-audit
```

Then paste the full chapter text when prompted.

---

## WHAT THIS SKILL DOES

Scores the chapter on all three instruments. Returns:
- LitCentral OMEGA (150-pt) — primary submission instrument
- SPSS Ω (111-pt) — internal prose craft diagnostic
- PBI (100-pt) — external Pulitzer positioning

Plus: banned phrase scan, sensory constant status, ending lock verification, artifact check.

---

## INSTRUCTIONS TO CLAUDE

When this command is invoked:

**Step 1 — Read the chapter text provided.**

If no text is pasted yet, say: "Paste the chapter text and I'll run the full audit."

**Step 2 — Run these checks in order:**

### A. ARTIFACT SCAN (run first — these cost points)
Scan for:
- Any line reading "REVISED CHAPTER", "PASS 1", "PASS 2", "DRAFT", scoring notes, editor annotations
- Duplicate section headings
- The chapter heading — flag if it contains "(ACT I)" or "(ACT II)" annotation markers

### B. BANNED PHRASE SCAN
Count every occurrence of:
- "a language older than words"
- "cosmic rhythm"
- "burned in the soul / eyes / heart"
- "he felt a presence"
- "something he could not name"
- "time seemed to stop"
- "suddenly" (as standalone adverb, not in dialogue)
- "very " (with space after — catches adverbial use)
- "really " (adverbial)
- "began to" / "started to"
- "seemed", "appeared", "felt" used as filter words (e.g., "he felt sad" — flag; "felt her hand" — OK)

Report: count per phrase. Any nonzero count is a revision flag.

### C. SENSORY CONSTANTS CHECK
Count occurrences in this chapter of:
- jasmine (or Jasminum)
- napalm
- diesel
- copal
- copper (in sensory context — taste, smell, touch)
- 60Hz / 60-hertz / sixty hertz / sixty-cycle hum
- yerba buena
- jungle rot / river-rot / laterite

Report present/absent and count.

### D. ENDING LOCK CHECK (Ch.01 only)
If this is Chapter 1, verify the final word is exactly:

> Cumplido.

Author-confirmed canonical June 18, 2026. Register: archivist's grammar, transmission complete — not survivor's grammar.

If missing or different: flag as CRITICAL — do not alter the ending, flag it for the author.

### E. PASSIVE VOICE ESTIMATE
Sample the chapter. Estimate passive voice percentage. Flag if above 3%.

### F. NAMED CHARACTERS
List all named characters with count. Flag any chapter where no named character appears more than once (BIS risk).

### G. HAMMER SENTENCE COUNT
Count sentences of 5 words or fewer. Flag if fewer than 5 in the chapter (CLS rhythm risk).

**Step 3 — Score each instrument:**

### LitCentral OMEGA
```
OMEGA = BR + CS + AS + TB + (EE × 0.67) + (MP × 0.67)
Max: ~147
```

Assess each dimension 0–30 (EE and MP 0–20):
- **BR** — Geographic accuracy, unit designations, weapons, dates, no anachronisms
- **CS** — Yaqui/Chicano cultural authenticity, code-switching, ceremony accuracy
- **AS** — Sensory immersion: historically accurate, non-clichéd, compound anchors
- **TB** — Timeline clean: present-day vs Vietnam vs ceremony; no temporal slippage
- **EE** — Institutional failure documented: VA, DCAS, benefits, the record
- **MP** — Named dead individualized; testimony power; witnessed voices

State each dimension score with one sentence of evidence.

### SPSS Ω
**Select formula by chapter type:**
- Standard: `Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.067·MRF` (max 111.243)
- RF 1.5 (ceremony-as-plot): `Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.1005·MRF` (ceiling 114.593)

Use RF 1.5 when: ceremony IS the plot (not backdrop) + analytical POV maintained throughout + code-switching active. Current candidates: Ch.01, Ch.19.

Score each component 0–100:
- **CLS** — Sentence variety, active voice, subordinate clause density, register hold
- **BIS** — Named characters, physical gesture beats, dialogue specificity, interiority precision
- **SII** — Sensory constant count, compound anchors, historically verified details
- **MRF** — Arc completion, liberation beat present, final line active not passive

### PBI
```
PBI = 0.28·V + 0.28·S + 0.18·A + 0.15·R + 0.11·F
Max: 100
```

Score each dimension 0–100:
- **V** — Voice: distinctive register, hammer sentences, active construction, code-switching
- **S** — Stakes/Erasure: institutional failure named, historical record confronted
- **A** — Agency: erased characters act, speak, resist; not narrated as victims
- **R** — Rendering: sensory constants present, compound anchors, historically grounded
- **F** — Formal innovation: polyphony, register architecture, non-linear if present

**Step 4 — Output format:**

```
═══════════════════════════════════════════
CH.[N] AUDIT — [CHAPTER TITLE]
[Date]
═══════════════════════════════════════════

LITCENTRAL OMEGA: [score] / 147 — [tier]
  BR [score]/30 · CS [score]/30 · AS [score]/30 · TB [score]/30
  EE [score]/13.4 · MP [score]/13.4

SPSS Ω: [score] / 111.243 — [tier]
  CLS [score] · BIS [score] · SII [score] · MRF [score]

PBI: [score] / 100 — [position vs shelf]
  V [score] · S [score] · A [score] · R [score] · F [score]

───────────────────────────────────────────
ISSUES (ordered by severity):
  [CRITICAL] ...
  [HIGH] ...
  [FLAG] ...

SENSORY CONSTANTS:
  ✅ copal · ✅ copper · ✅ 60Hz
  ❌ jasmine · ❌ napalm · ❌ yerba buena

BANNED PHRASES: [CLEAN / X instances of "very" found]

NEXT SINGLE MOVE (highest Ω gain):
  [one specific action — 25 words max]
═══════════════════════════════════════════
```

**Step 5 — State both the current score and the projected score after the next single move.**

Do not suggest more than one move. One lever per session.

---

## GOVERNANCE NOTE

If the chapter contains Yaqui ceremony content not already in the canonical manuscript, flag:
> "GOVERNANCE GATE: New Yaqui ceremony content requires tribal consultation before publication."

Do not add ceremony content. Do not expand ceremony detail beyond what is already present.
