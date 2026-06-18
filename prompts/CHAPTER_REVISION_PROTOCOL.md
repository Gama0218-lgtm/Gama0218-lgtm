# Chapter Revision Protocol — SGT George Ramos: The Mathematics of Vietnam
## Author Instruction Template · v1.0

---

## BEFORE YOU OPEN THE CHAPTER

**Complete these four checks before writing a single word.**

- [ ] Pull the chapter's current Omega score from the dashboard
- [ ] Identify which component is weakest (CLS / BIS / SII / MRF)
- [ ] Read the chapter's issue flags from `data/full_dual_audit_v15.json`
- [ ] Run Perplexity Prompt 06 (`prompts/perplexity/06_omega_score_fast_research.md`) for any facts you need to verify

**Do not begin revising until you know your target gap.**

---

## STEP 1 — IDENTIFY YOUR ONE LEVER

The formula has four components. Only work the weakest one per session.

| If weakest is… | Your tool is… |
|----------------|---------------|
| **CLS** (Cognitive Load / Sentence complexity) | Sentence-level: vary length, add subordinate clauses, reduce passive voice |
| **BIS** (Behavioral Immersion) | Name unnamed characters, add physical gesture beats, deepen dialogue specificity |
| **SII** (Sensory Immersion) | Add one grounded sensory anchor (smell, sound, temperature, texture) — use verified detail from Perplexity Prompt 05 |
| **MRF** (Momentum / Resolution) | Check the arc: does the chapter end where it promised to end? Restore cut liberation/resolution beats |

**Work one lever. Do not touch the others in the same session.**

---

## STEP 2 — REGISTER CHECK (READ BEFORE WRITING)

Read the first paragraph of the chapter out loud.

The chapter's register must be:
- **Analytical** — sensor metaphor, "element style" framing
- **Active voice** — subject acts, objects receive
- **Specific** — named people, named places, named sensations

If the first paragraph uses any of the following, stop and fix it before continuing:

> ❌ "a language older than words"
> ❌ "cosmic rhythm"
> ❌ "burned in the soul"
> ❌ "something he could not name"
> ❌ "time seemed to stop"
> ❌ "he felt a presence"

These phrases collapse the register. One of them in a new section will cost ~1.3Ω.

**The rule:** If you cannot describe the sensation using a physical object, a measurement, or a named cultural fact — do not write it yet. Research it first.

---

## STEP 3 — THE INSERT RULE

**One insert per session. Maximum 250 words.**

Do not add a new section. Add a sentence or short paragraph into existing prose.

Before inserting, answer these three questions:

1. **What is the physical anchor?** (smell / sound / temperature / texture / weight)
2. **Is it verified?** (Perplexity source URL or citation)
3. **Does it stay in the chapter's register?** (read it next to the surrounding prose)

If you cannot answer all three: do not insert. Research first, revise next session.

---

## STEP 4 — THE ARC CHECK

Before saving, read the last paragraph of the chapter.

Answer:
- [ ] Does the chapter end where it began emotionally — or did it move?
- [ ] Is the final beat **active** (character does something) or **passive** (something happens to character)?
- [ ] Is the original ending intact? If you deleted it, restore it.

**Ch.01 specific:** The ending must be "He did not go. For the first time in fifty years. He did not go." — do not change this line.

---

## STEP 5 — STRUCTURAL ARTIFACT CHECK

Before submitting for scoring, scan for these exact strings and delete them:

- [ ] "REVISED CHAPTER" or "PASS 1" / "PASS 2" anywhere in the text
- [ ] Any line that reads like a scoring note or editor annotation
- [ ] Any duplicate section headings
- [ ] Any duplicate scene beats (re-tying what was already tied, re-crossing what was already crossed)

**Artifacts cost 3 Omega points (full penalty applied by the scoring engine).**

---

## STEP 6 — SUBMIT FOR SCORING

Paste the complete revised chapter and use this exact request:

```
Score this chapter using the LOCKED OMEGA formula:
Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.067·MRF

Return:
- Estimated Ω (central estimate + range)
- Component scores: CLS / BIS / SII / MRF
- What changed from prior version
- What the next single move is to gain 0.5Ω or more
```

---

## STEP 7 — LOG THE RESULT

After scoring, record:

| Field | Value |
|-------|-------|
| Chapter | |
| Prior Ω | |
| New Ω | |
| Component that moved | |
| What was inserted/changed | |
| Next session target | |

Paste the log into the dashboard or keep it in a session notes file.

---

## WHAT NOT TO DO

These actions reliably lower the score. Memorize them.

| Action | Why it hurts |
|--------|-------------|
| Add a new section in a different register | CLS fracture — costs ~1.3Ω |
| Delete the chapter's final liberation beat | MRF collapse |
| Repeat a scene beat already completed | SII confusion signal |
| Write a character's interiority as generic feeling | BIS drop |
| Use "something" / "somehow" / "seemed" | CLS penalty — vague hedge words |
| Submit with any artifact line still present | -3Ω artifact penalty |

---

## FASTEST PATH TO Ω = 111 (for reference)

| Chapter | Current Ω | Gap | Single Move |
|---------|-----------|-----|-------------|
| Ch.39 "When Compadres Fall" | ~107.06 | 3.94 | One 200w sensory anchor (SII=90 is the only weak component) |
| Ch.01 "The Mathematics of Vietnam" | ~107.07 (without Sacred Transformation) | 3.93 | Jasmine-napalm sentence + CLS/BIS push via dialogue |

**Ch.39 is the fastest first 111.** Use Prompt 06 for the sensory insert. One session.

---

## FORMULA REFERENCE

```
Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.067·MRF

Theoretical maximum: 111.243 (all components at 100)

Scoring bands:
  111.0+        → MANUSCRIPT TARGET (0 chapters currently)
  108.0–110.99  → Omega Elite High (5 chapters)
  105.0–107.99  → Omega Elite (37 chapters)
  103.0–104.99  → Gray Area (needs revision)
  < 103.0       → Below (priority fix)
```

---

*Protocol version 1.0 · Revision sessions only · Do not share outside this project*
