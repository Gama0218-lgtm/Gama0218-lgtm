# /insert-anchor — Propose a Verified Sensory Insert for a Specific Chapter

One insert. One chapter. Maximum 250 words. Verified source required.

## USAGE

```
/insert-anchor [chapter] [constant]
```

Examples:
- `/insert-anchor ch01 jasmine-napalm`
- `/insert-anchor ch39 jasmine-napalm`
- `/insert-anchor ch01 yerba-buena`
- `/insert-anchor ch01 diesel`

---

## WHAT THIS SKILL DOES

Proposes a single verified sensory insert — a sentence or short paragraph (max 250 words) that:
1. Anchors an existing sensory constant into a high-stakes narrative moment
2. Uses a verified real-world source (botanical, historical, veteran testimony)
3. Stays in the chapter's register (analytical, not mystical)
4. Fits into the surrounding prose without breaking rhythm
5. Does NOT add new characters, plot beats, or scenes

---

## INSTRUCTIONS TO CLAUDE

When this command is invoked:

**Step 1 — Identify the chapter and the target constant.**

If chapter text is pasted, read it first. If not, ask: "Paste the chapter text so I can find the right placement point."

**Step 2 — Identify the highest-value insertion point.**

The insert must go into an existing scene at a moment of maximum narrative attention:
- A confrontation beat
- A sensory transition (moving from one space to another)
- A memory surface (the body remembering something before the mind names it)
- A silence before contact (the jungle going quiet before incoming)

Do not insert at a neutral narrative moment. The constant must earn its weight.

**Step 3 — Apply the verified source requirement.**

Before writing the insert, state the verified source for the sensory detail:

**Verified sources on file (use these):**

| Constant | Verified Source | Key Fact |
|----------|----------------|----------|
| jasmine + napalm | Jasminum mesnyi (Wikipedia botanical); Napalm = benzene + polystyrene (Univ of Bristol) | Jasminum mesnyi: native to Vietnam, primrose-yellow, blooms through monsoon |
| diesel + laterite | Princeton Historical Review "The Saturated Jungle"; veteran accounts | Laterite: iron-red clay releases upward in heat; diesel compound in logistics zones |
| yerba buena | Mentha suaveolens / Hierba buena — Southwestern folk medicine; documented in Chicano household oral histories | Cool mint smell, pre-war domestic, grandmother/kitchen/healing |
| copal | Documented Yaqui ceremonial use — but GOVERNANCE GATE applies (see below) | Do not expand copal detail beyond what is already in the chapter |
| jungle rot / river-rot | Organic decomposition after monsoon: fallen vegetation + standing water + laterite | Filed under permanent storage in veteran nervous system |

If the constant is NOT in this table, state: "This constant requires Perplexity research first (use Prompt 05). Do not insert unverified sensory detail."

**Step 4 — Write the insert.**

Rules:
- Max 250 words (target: 50–150 words for a sentence-level anchor)
- Register: analytical — sensor metaphor, element style, social physics language
- Active voice — the smell/sound/temperature does something; it doesn't "seem" or "appear"
- No banned phrases
- One physical object as the anchor (the jasmine plant, the laterite clay, the yerba buena sprig)
- State the insert point: "INSERT AFTER: [quote the surrounding sentence]"

**Step 5 — Verify against the register.**

Before outputting, run this check:
- Does the insert contain any banned phrase? → Remove
- Does it use "seemed", "appeared", "felt" as filter words? → Replace
- Does it add a new scene beat not already present? → Cut back to anchor only
- Does it expand Yaqui ceremony detail? → Remove and flag governance gate

**Step 6 — Output format:**

```
═══════════════════════════════════════════
INSERT ANCHOR — Ch.[N] — [CONSTANT]
═══════════════════════════════════════════

PLACEMENT: Insert after:
"[exact quote of the sentence this follows]"

SOURCE: [verified source citation]

INSERT TEXT:
───────────────────────────────────────────
[The insert — 50–250 words]
───────────────────────────────────────────

REGISTER CHECK: ✅ No banned phrases · ✅ Active voice · ✅ Analytical register

PROJECTED IMPACT:
  SII: [current] → [projected] (+[delta])
  SPSS Ω: [current] → [projected]
  PBI R: [current] → [projected]

PERPLEXITY VERIFICATION (if needed):
  Use Prompt 05 with: "[specific query to verify this detail]"
═══════════════════════════════════════════
```

---

## VERIFIED INSERTS READY TO USE

These have been researched and verified. Use directly without additional Perplexity research:

### Ch.39 — jasmine-napalm (200-word anchor)

**Placement:** Insert at the moment of silence before contact in the Central Highlands scene.

**Source:** Jasminum mesnyi (Wikipedia); napalm compound (Univ of Bristol); laterite smell (Princeton Historical Review); insect silence (cherrieswriter.com veteran accounts)

```
The rainy season had opened the laterite all week — iron-red clay releasing 
upward in the heat, a compound smell the body filed under permanent storage 
alongside blood and copper and old stone. Two klicks south the napalm had 
gone in at 0600, benzene and polystyrene burning sweet and petroleum-sharp, 
and the prevailing wind had carried it north through the triple canopy until 
it mixed with the jasmine that grew along the tree line regardless of what 
the hill had seen. Jasminum mesnyi — primrose-yellow, native, indifferent — 
bloomed through the monsoon as it always bloomed. The insects ran at full 
frequency. Clicks and screeching, hour after hour, a baseline the body 
learned to read so that when the jungle went flat silent, the nervous system 
registered the change before the mind named it.

That silence arrived at 1347.

Four seconds before the contact.
```

### Ch.01 — yerba buena (60-word anchor)

**Placement:** Insert in the plaza scene when George sees the girl who reminds him of Phoenix (his granddaughter).

**Source:** Mentha suaveolens — documented Southwestern folk medicine; Chicano household oral history (Lea Ybarra, Vietnam Veteranos, UT Press)

```
The girl's rebozo carried a scent George had not encountered in forty years — 
yerba buena, cool and sharp, the smell of his mother's kitchen in San Antonio 
when he was seven and the world had not yet required him to carry anything. 
His sternum registered it before he identified it. His body knew home the 
way it knew terrain: before the mind, below language, in the specific cells 
that had stored both.
```

---

## GOVERNANCE NOTE

If the insert touches Yaqui ceremony content:
> "GOVERNANCE GATE P0: Yaqui Nation consultation required before publication. This insert cannot be added until tribal consultation is complete. Research ≠ permission."

Do not write new ceremony detail. Do not expand the pahko beyond what is already in the chapter. The only safe insert points for new sensory content are:
- The convoy arrival (pre-ceremony)
- The plaza daylight scenes (pre-ceremony)
- The fire scene (physical fire and its compound smells — not ceremony-specific)
- The flashback/Vietnam sequences
- The post-ceremony orientation moment
