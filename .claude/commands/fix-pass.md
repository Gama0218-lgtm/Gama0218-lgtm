# /fix-pass — One Editorial Pass: Banned Phrases + Passive Voice + Artifacts

One clean editorial pass. Fixes what can be fixed mechanically. Does not rewrite prose. Does not add content.

## USAGE

```
/fix-pass
```

Paste the chapter text. Receive a clean version with tracked changes listed.

---

## WHAT THIS SKILL DOES

Applies five mechanical fixes to the chapter text:
1. Delete banned phrases (or flag if embedded too deeply to delete cleanly)
2. Replace filter words with direct construction
3. Flag passive voice constructions above 3% density
4. Remove artifact lines (scoring notes, draft headers, editor annotations)
5. Replace "began to" / "started to" with the direct action verb

Does NOT:
- Rewrite sentences structurally
- Add new content
- Change the Ch.01 ending
- Alter dialogue
- Expand or compress scenes

---

## INSTRUCTIONS TO CLAUDE

When this command is invoked:

**Step 1 — Receive the chapter text.**

If no text is pasted: "Paste the chapter text and I'll run the editorial pass."

**Step 2 — Apply fixes in this exact order:**

### FIX 1: ARTIFACT LINES — DELETE
Remove any line that is:
- "REVISED CHAPTER" / "PASS 1" / "PASS 2" / "DRAFT [anything]"
- A scoring note: "Ω = [number]", "Score:", "LitCentral:", "PBI:"
- An editor annotation in brackets: "[INSERT HERE]", "[NEEDS REVISION]", "[CUT?]"
- A duplicate heading (same heading appears twice)

Action: Delete silently. List each deletion in the change log.

### FIX 2: BANNED PHRASES — DELETE OR FLAG
For each banned phrase found:

| Phrase | Action |
|--------|--------|
| "a language older than words" | Delete the clause containing it |
| "cosmic rhythm" | Delete |
| "burned in the soul/eyes/heart" | Delete — replace with the physical sensation if obvious, otherwise flag |
| "he felt a presence" | Replace with the physical signal: "The hair on his forearms lifted" or flag |
| "something he could not name" | Replace with the specific thing, or flag if unknown |
| "time seemed to stop" | Delete — replace with what actually happened in that second |
| "suddenly" (adverbial) | Delete "suddenly" — keep the rest of the sentence |
| "very " / "really " / "quite " / "somewhat " | Delete the adverb — keep the adjective |
| "began to [verb]" | Replace with [verb] past tense: "He began to walk" → "He walked" |
| "started to [verb]" | Same: "She started to speak" → "She spoke" |

### FIX 3: FILTER WORDS — REPLACE
Filter word patterns to fix:
- "He felt [emotion/state]" → rewrite as the physical signal of that state
  - "He felt grief" → "His sternum compressed" or flag
  - "He felt cold" → "The cold bit the back of his neck" — KEEP (physical, not emotional)
- "She seemed [adjective]" → find the evidence: "She seemed tired" → "Her eyes tracked slow"
- "It appeared that" → delete and state the fact directly
- "He appeared to be" → state what he was doing

**Rule:** Only fix filter words where the replacement is obvious from context. If uncertain, flag with: `[FILTER: "he felt X" — suggest physical equivalent]`

### FIX 4: PASSIVE VOICE — FLAG ONLY
Do not rewrite passive constructions. Flag them:
`[PASSIVE: "The file was lost" — consider "The VA lost the file"]`

Flag only if the passive removes agency from a character who should have agency. Institutional passives that serve the erasure theme are acceptable: "The file was stamped INCOMPLETE" — keep.

### FIX 5: ENDING LOCK — VERIFY
If this is Chapter 1, check the final paragraph.

The canonical ending is:
> George did not find peace that night. He found orientation. He found the ability to hold what he had carried for fifty years without going under.
>
> He found north.
>
> That was enough to stand on. That was the beginning of the next sentence. He stayed in the dark and breathed, and the dark did not ask him to be anything other than what he was: a man with a debt, still standing, still present, still accountable to the names.
>
> Still here.

If the ending is different or truncated:
- DO NOT change it
- Flag: `[ENDING: Missing canonical final paragraph — author must restore. Do not alter.]`

**Step 3 — Return the corrected text with a change log.**

Format:

```
═══════════════════════════════════════════
FIX-PASS COMPLETE — CH.[N]
[X] changes applied · [Y] flags for author review
═══════════════════════════════════════════

CHANGES APPLIED:
  1. Deleted artifact: "REVISED CHAPTER — PASS 2"
  2. Deleted "very ": "very quiet" → "quiet" (line ~[approx location])
  3. "began to walk" → "walked"
  [etc.]

FLAGS FOR AUTHOR (not auto-fixed):
  [FILTER: "he felt the weight" — suggest physical equivalent, line ~X]
  [ENDING: Missing "Still here." — restore canonical final paragraph]
  [PASSIVE: "the report was filed" — consider making the filer the subject]

───────────────────────────────────────────
[CORRECTED CHAPTER TEXT FOLLOWS]
═══════════════════════════════════════════
```

**Step 4 — After the corrected text, state the estimated Ω improvement.**

Example: "Removing 12 instances of 'very' and 2 artifact lines: estimated +0.4 Ω (CLS component)."

---

## WHAT THIS PASS DOES NOT DO

- Does not rewrite paragraphs
- Does not add sensory content
- Does not change character names or dialogue
- Does not alter the ceremony scenes
- Does not touch the Ch.01 ending (only flags if missing)
- Does not add or remove chapters
- Does not change Spanish/Yaqui language elements
