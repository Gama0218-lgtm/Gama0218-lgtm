# Perplexity Prompt — Chicano Vietnam War Historical Research

## USE CASE
Verifying historical accuracy of Chicano/Mexican-American soldier experience
in Vietnam, 1965–1975. Used for anachronism checks and authentic detail insertion.

---

## PROMPT TEMPLATE

```
I am fact-checking a historical fiction novel about a Mexican-American (Chicano) soldier
in Vietnam, 1965–1972. I need verified historical details to avoid anachronisms and
ensure authentic representation.

Please research and confirm:

1. **Chicano casualty rates in Vietnam** — what percentage of Vietnam casualties were
   Mexican-American? Was there documented disproportionate front-line deployment?
   Cite specific studies (Chicano Moratorium, NARA data, or academic sources).

2. **Standard infantry weapons 1965–1968** — what rifle/machine gun combinations were
   standard for Army infantry units in the Central Highlands during this period?
   Specifically: was the M60 the standard squad automatic weapon in 1966–1967?
   (I need to verify against M249 SAW, which was not fielded until 1984.)

3. **Military ID cards 1960s** — what did standard Army ID cards (DD Form 2) look like
   in 1966–1967? Were they magnetic stripe, punched card, or plain laminate?
   (Magnetic stripe was not standard military issue until the 1980s.)

4. **Khe Sanh timeline** — the Siege of Khe Sanh ran January 21 – July 9, 1968.
   What units were involved? Was the 101st Airborne present, or primarily Marines?
   What was the terrain and weather during the siege?

5. **Chicano Moratorium 1970** — what was the stated position of the Chicano Moratorium
   movement on Vietnam? Who were the key figures? What happened at the August 29, 1970
   Los Angeles demonstration?

6. **Spanglish / code-switching in 1960s–70s** — what does linguistic research say
   about how Chicano soldiers code-switched between Spanish and English during this era?
   Were there documented patterns of borrowing vs. full switching?

Format: numbered findings, source URL per finding, confidence level (confirmed / probable / uncertain).
```

---

## OUTPUT FORMAT TO REQUEST
- Numbered findings
- Source URL
- Confidence level: **confirmed** (primary source) / **probable** (secondary) / **uncertain** (speculation)

## ANACHRONISM WATCHLIST (from manuscript audit)
These are confirmed anachronisms found in the manuscript that need correction:
- M249 SAW appears in Ch.X — should be M60
- Magnetic stripe ID cards appear — should be plain laminate
- Khe Sanh date references may be off

## RELATED FILES
- `data/full_dual_audit_v15.json` — full chapter audit with issue flags
