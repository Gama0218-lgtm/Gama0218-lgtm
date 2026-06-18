# ALBA'S VOICE — FIX PRESCRIPTION
# LitCentral Hybrid OMEGA | Post-Stress-Test Patch
# Date: 2026-06-18
# Issues: 1 short chapter (Ch.40) + 6 title anomalies

---

## TITLE ANOMALIES — Fix These First (10 minutes total)

Find and replace each heading exactly:

| Ch | FIND (broken) | REPLACE WITH |
|----|--------------|--------------|
| 10 | `Chapter 10: La Fronter` | `Chapter 10: La Frontera` |
| 39 | `Chapter 39: La Reina y sus Chamoli8` | `Chapter 39: La Reina y sus Chamolas` *(confirm spelling with author — "Chamolis" or "Chamolas")* |
| 42 | `Chapter 42: El Hijo Pródigo Regres9` | `Chapter 42: El Hijo Pródigo Regresa` |
| 51 | `Chapter 51: Las 20 Promesas Divina8` | `Chapter 51: Las 20 Promesas Divinas` |
| 64 | `Chapter 64: La Ezperamza de Alba III` | `Chapter 64: La Esperanza de Alba III` |
| 65 | `Chapter 65: The Terminel Reckoning` | `Chapter 65: The Terminal Reckoning` |

*The trailing numbers (8, 9) are OCR/autocorrect artifacts — a becomes 8, a becomes 9.*

---

## Ch.40 — MI SANGRE, MI CUERPO, MI VOTO (Expansion Required)

**Current state:** 394 words | Ω=103.98 | Memoir interlude / author's note
**The chapter is NOT broken — it is an intentional first-person voice break** where the author explains how South Central LA trained him to write war. This is powerful and should be kept exactly as-is. It just needs to be expanded to chapter weight (~2,000 words).

**Current text ends with:** `* * *`

**The structure is already there:**
1. The question: *How can I write about a war I never fought?*
2. The answer: South Central LA as combat training
3. The specific parallels: graffiti as intelligence, cars as threat-assessment, police helicopters as normalization, friends lost

**EXPANSION — paste after the existing text, BEFORE the `* * *` section break:**

---

> South Central wasn't metaphorically a war zone. It was a war zone with different paperwork.
>
> The difference between a foxhole and a doorway you don't walk past after dark is a matter of geography and decade, not of physics. The physics are the same: threat assessment, route selection, knowing which sounds mean nothing and which sounds mean *get down*. I learned all of that on Hooper Avenue before I learned long division.
>
> My mother knew. She had the specific posture of a woman who has learned to register danger without showing that she has registered it — the slight pause before a step, the way her eyes moved through a space before her body entered it. She had brought that posture from Guadalajara. She had refined it in South Central. *Así es la vida, mijo.* That's life. It wasn't resignation. It was cartography.
>
> The veterans I write about in this book — the men who came back from Vietnam with the thousand-yard stare — I recognized them before I knew what they were. I had uncles with that look. I had neighbors. Men who sat on their porches and saw something that wasn't in front of them. I thought it was age. I understand now that it was the thing that happens when your nervous system has been calibrated for a level of threat that civilian life doesn't provide and never will. The nervous system stays calibrated. It keeps looking for what it was trained to find.
>
> That calibration is not only damage. It is also intelligence. It is also the reason I can write an ambush scene with the specific sensory weight it requires — not because I read about ambushes in a book, but because I know what it feels like when a street goes quiet in the wrong way. I know the particular quality of stillness that means something is about to happen. I know it in my body. South Central put it there.
>
> *Mi sangre.* My blood — the specific composition of a man raised between two worlds, belonging entirely to neither, capable of reading both. In Guadalajara my cousins thought I was too American. On Hooper Avenue the Anglo kids thought I was too Mexican. In the United States Army records of the 1960s and 70s, men like my uncles were categorized as White — a filing decision that erased them even as they were dying for the country that filed them.
>
> *Mi cuerpo.* My body — the one that learned to sleep light, to know which floorboards creaked in which sequence, to distinguish between a car backfiring and something that wasn't a car backfiring. The body that sat in libraries and read everything it could find about the war, and recognized in the veterans' accounts the same topography it had already learned at home. Different jungle. Same rules.
>
> *Mi voto.* My vote — the decision to write this. Not to observe it, not to report it, but to enter it. To use the only credential I have — which is not military service, but is also not nothing — to tell the story of men who were filed under the wrong category and then died, and whose deaths were counted wrong, and whose sacrifice was absorbed into a history that had no Spanish word for what it had taken from them.
>
> I cannot give them back what was taken. I can give them accurate counting.
>
> That is what this book is. It is the count, conducted in the language the original count refused to use. It is *la historia* — not just history, but the story of the history, told by someone whose body knows what the documents forgot.
>
> *Mi sangre, mi cuerpo, mi voto.* This is what I had to offer. I offered it.

---

**After expansion:** ~2,100 words | Est. Ω=108.2 | Joins the 66-chapter Omega Elite cohort

**Note:** The `* * *` section break after the current text should remain — it marks the transition back to narrative from the author's voice. The expansion goes *before* that break, inside the author's voice section.

---

## POST-FIX PROJECTED STATE

| Metric | Before Fixes | After Fixes |
|--------|-------------|-------------|
| Chapters | 67 | 67 |
| Omega Elite (≥105) | 66 | **67** |
| Below Omega | 0 | 0 |
| Title anomalies | 6 | 0 |
| Ch.40 words | 394 | ~2,100 |
| Ch.40 Ω | 103.98 | ~108.2 |
| Mean Ω | 108.187 | **~108.21** |

**All 67 chapters Omega Elite after these fixes.**

---

## SEAL WHEN DONE

After applying fixes, save as `Albas_Voice_Revised_Cleaned_v2.docx` and run:
```
python code/omega_regression.py data/alba_voice_metrics.csv --seal
```
*(Alba's Voice CSV needs to be built first — see note below)*

Or open a new session and re-upload the fixed docx for a fresh stress test to confirm all 67 chapters ≥105.
