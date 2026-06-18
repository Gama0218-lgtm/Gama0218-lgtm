# Perplexity Prompt — Insert Anchor Research
## Paired with: `/insert-anchor` Claude skill

**Use this BEFORE running `/insert-anchor` if the sensory constant is not in the verified sources list.**

---

## USE CASE

You need to insert a sensory anchor into a specific chapter but the detail is not yet verified. This prompt produces:
1. A verified physical fact (botanical, chemical, historical, veteran account)
2. A source URL to cite
3. A register-correct example sentence (analytical style, not mystical)

---

## PROMPT TEMPLATE

```
I am writing a sensory insert for a Vietnam War literary fiction novel. 
I need to verify one specific physical detail before I can write it.

NOVEL CONTEXT: Chicano soldier, Vietnam 1965–1972, Central Highlands and 
Mekong Delta regions. Register: analytical — sensor metaphor, active voice, 
historically grounded specificity. No generic mysticism.

WHAT I NEED VERIFIED:

[FILL IN ONE OF THESE:]

--- OPTION A: Plant/smell ---
"[plant name or smell]" in [location, e.g. "Central Highlands Vietnam"]:
- Does this plant/smell actually exist in this region?
- Scientific name?
- What specific compound produces the smell?
- Any veteran accounts that mention this smell in combat context?
- Does it appear during [season/condition]?

--- OPTION B: Sound ---
"[sound]" in [context]:
- What produces this sound physically?
- At what frequency / decibel range?
- What conditions change or stop this sound?
- Veteran accounts mentioning this sound specifically?

--- OPTION C: Chemical/environmental ---
"[substance]" in [context, e.g. "napalm MK-77 in Central Highlands"]:
- What are the actual chemical components?
- What does it smell like specifically (what compounds)?
- How far does the smell travel under prevailing wind?
- Veteran accounts?

--- OPTION D: Tactile/temperature ---
"[sensation]" in [context]:
- What produces this sensation physically?
- Is it accurate to [location/era]?
- How is it described in primary sources (veteran memoirs, field reports)?

FOR EACH FINDING, GIVE ME:
1. The verified fact (one sentence, precise)
2. Source URL
3. One example sentence in analytical literary register:
   - Third-person limited
   - Active voice
   - Sensor metaphor (the body registers it before the mind names it)
   - No filter words (no "seemed", "felt", "appeared")
   - No banned phrases ("a language older than words", "cosmic rhythm", etc.)
   - The physical object does something — it doesn't just exist

Keep tight: one fact, one source, one sentence. No summaries.
```

---

## FILLED EXAMPLE — Ch.39 jasmine-napalm

```
I am writing a sensory insert for a Vietnam War literary fiction novel.
I need to verify one specific physical detail before I can write it.

NOVEL CONTEXT: Chicano soldier, Vietnam 1968, Central Highlands. Register: 
analytical — sensor metaphor, active voice, historically grounded specificity.

WHAT I NEED VERIFIED:

Does jasmine actually grow in the Central Highlands of Vietnam?
- Scientific name of the dominant jasmine species in South Vietnam?
- Does it bloom during the monsoon season (May–September)?
- Any veteran accounts specifically mentioning jasmine smell during combat operations?
- How does the smell interact with napalm (MK-77 incendiary) — are these documented together?

What does napalm (MK-77) actually smell like?
- Specific chemical compounds: benzene, polystyrene — how far does the smell carry?
- Is "sweet and petroleum-sharp" an accurate description from veteran accounts?

What does laterite (Central Highlands clay soil) smell like in the rainy season?
- What makes it smell that way (chemical/mineral composition)?
- Veteran accounts mentioning the smell of wet laterite specifically?

FOR EACH: verified fact, source URL, one example sentence in analytical register.
```

---

## FILLED EXAMPLE — Ch.01 yerba buena

```
I am writing a sensory insert for a Vietnam War literary fiction novel 
(present-day scene, Sonoran Desert / San Antonio Chicano household flashback).

NOVEL CONTEXT: An elderly Chicano veteran in his 70s experiences a smell 
that triggers pre-war memory. Register: analytical, active voice, no mysticism.

WHAT I NEED VERIFIED:

Yerba buena (Mentha suaveolens or related species) in Chicano Southwest households:
- Is yerba buena documented in Chicano folk medicine / household use in 
  Texas/Arizona/New Mexico in the 1940s–1950s?
- What does it smell like specifically (compounds, how it differs from 
  standard peppermint)?
- Any Chicano oral history sources documenting its household presence 
  (kitchen, medicine, grandmother associations)?
- Lea Ybarra's "Vietnam Veteranos" (UT Press) — does it mention household 
  smells or pre-war domestic memory?

FOR EACH: verified fact, source URL, one example sentence in analytical 
register where the smell registers in the body before the mind names it.
```

---

## OUTPUT FORMAT TO REQUEST

Ask Perplexity to return:
- **Fact:** [one precise sentence]
- **Source:** [URL]
- **Example sentence:** [analytical register, active voice, sensor metaphor]

---

## AFTER RESEARCH

Take the verified fact and source URL into Claude and run:
```
/insert-anchor ch[N] [constant]
```

Paste the verified source when prompted. Claude will write the insert using confirmed detail.

---

## RELATED FILES
- `.claude/commands/insert-anchor.md` — the Claude skill this feeds
- `data/PBI_v1.1_sandbox_analysis.md` — sensory constant occurrence data
- `prompts/perplexity/05_sensory_detail_verification.md` — broader sensory verification
