#!/usr/bin/env python3
"""
LitCentral Hybrid OMEGA — Layer 1 Deterministic Craft Auditor
Runs 8 operational modules + generates Priority Fix Matrix.
Usage:
  python code/omega_audit.py data/SGT_RAMOS_chapter_metrics_full.csv
  python code/omega_audit.py data/SGT_RAMOS_chapter_metrics_full.csv --seal
"""
import csv, json, sys, math
from omega_regression import run_seal, print_report, tier, COEFF, MEANS

# ── Marlowe craft check thresholds ───────────────────────────────────────────
ADVERB_TARGET      = 12    # per 1000 words
PASSIVE_TARGET     = 8     # per 1000 words (from metrics: passive_pct of dialogue)
DIALOGUE_MIN       = 10    # % — below this = dialogue-starved
DIALOGUE_MAX       = 60    # % — above this = HIGH drop risk
WORD_MIN           = 4500
WORD_MAX           = 7000  # Ch.7 at 9796 is a clear split candidate
CODE_SWITCH_MIN    = 1.0   # per 1000 — CLS floor; below this → floor chapter risk
FLESCH_MIN         = 55    # readability floor
FK_MAX             = 9.0   # FK grade ceiling

def craft_audit(chapters):
    """Layer 1 Module 4: Marlowe Technical Analysis — deterministic from CSV metrics."""
    flags = []
    for ch in chapters:
        n   = int(ch["Ch"])
        ttl = ch["Title"]
        w   = int(ch["Words"])
        d   = float(ch["Dialogue_pct"])
        p   = float(ch["Passive_pct"])
        f   = float(ch["Flesch"])
        fk  = float(ch["FK_Grade"])
        cs  = float(ch["CodeSwitch_pct"])
        om  = float(ch["Omega"])

        chapter_flags = []

        # Module 1 — Word Count
        if w > WORD_MAX:
            chapter_flags.append(f"WORD_COUNT: {w} words — SPLIT REQUIRED (>{WORD_MAX})")
        elif w < WORD_MIN:
            chapter_flags.append(f"WORD_COUNT: {w} words — SHORT ({WORD_MIN} min)")

        # Module 3 — Dialogue density (drop risk)
        if d < DIALOGUE_MIN:
            chapter_flags.append(f"DIALOGUE_LOW: {d}% — expand to ≥{DIALOGUE_MIN}% (BIS/RRP risk)")
        if d > DIALOGUE_MAX:
            chapter_flags.append(f"DIALOGUE_HIGH: {d}% — insert prose bridges (<{DIALOGUE_MAX}%)")

        # Module 4 Marlowe — Passive voice
        if p > PASSIVE_TARGET / 10:  # passive_pct is %, threshold is per 1k
            chapter_flags.append(f"PASSIVE: {p}% — target <{PASSIVE_TARGET/10}% (actor+verb)")

        # Module 4 Marlowe — Readability
        if f < FLESCH_MIN:
            chapter_flags.append(f"READABILITY: Flesch {f} — below {FLESCH_MIN} floor (simplify syntax)")
        if fk > FK_MAX:
            chapter_flags.append(f"GRADE_LEVEL: FK {fk} — above {FK_MAX} ceiling")

        # Module 5 — Cultural/code-switch density (CLS lever)
        if cs < CODE_SWITCH_MIN:
            chapter_flags.append(f"CLS_FLOOR: {cs}/1k code-switches — minimum {CODE_SWITCH_MIN}/1k (add bilingual density)")

        # Anomaly: Ω vs tier mismatch
        computed_tier = tier(om)
        reported_tier = ch.get("Tier", "")
        if computed_tier != reported_tier and reported_tier:
            chapter_flags.append(f"TIER_MISMATCH: reported={reported_tier}, computed={computed_tier}")

        if chapter_flags:
            flags.append({"ch": n, "title": ttl, "omega": om, "flags": chapter_flags})

    return flags

def surgical_cls_insertions(chapters):
    """
    Layer 1 Module 7 — Quick Action: surgical code-switch insertions for CLS-floor chapters.
    Returns per-chapter insertion prescriptions (bilingual density targets).
    """
    prescriptions = []
    for ch in chapters:
        cs = float(ch["CodeSwitch_pct"])
        if cs < CODE_SWITCH_MIN:
            n      = int(ch["Ch"])
            words  = int(ch["Words"])
            needed = math.ceil((CODE_SWITCH_MIN - cs) * words / 1000)
            # Ω gain estimate from CLS lever
            cls_delta  = (CODE_SWITCH_MIN - cs) * 5.8  # approx CLS improvement
            omega_gain = round(cls_delta * COEFF["CLS"], 2)
            prescriptions.append({
                "ch": n,
                "title": ch["Title"],
                "current_cs": cs,
                "words": words,
                "insertions_needed": max(3, needed),
                "estimated_omega_gain": omega_gain,
                "prescription": _cs_prescription(n, ch["Title"])
            })
    return sorted(prescriptions, key=lambda x: x["estimated_omega_gain"], reverse=True)

def _cs_prescription(ch, title):
    """Return targeted bilingual insertion prescriptions per chapter type."""
    prescriptions = {
        2:  "Insert Ramos's interior monologue in Spanish when counting casualties: 'Trescientos cuarenta y nueve — the number burned behind his eyes.'",
        8:  "Add Spanish prayer fragment during aerial insertion: 'Madre de Dios, dame fuerza' — Ramos mouthing the words as rotors hammered.",
        11: "Insert code-switch in officers' dialogue: Colonel's order lands clean in English; Ramos translates it in his gut to barrio logic.",
        12: "Add Pentagon scene contrast: bureaucratic English vs Ramos's interior Spanish — the empire's language vs the soldier's.",
        38: "Historical Appendix needs bilingual citations — AGIF documents, LULAC resolutions — Spanish alongside English as dual register.",
    }
    return prescriptions.get(ch, f"Insert 3–5 organic code-switch moments: Spanish interior monologue during high-stress, prayer, or familia memory. Target +{CODE_SWITCH_MIN:.1f}/1k density.")

def print_craft_audit(flags, prescriptions):
    print()
    print("  LAYER 1 — MARLOWE CRAFT AUDIT (Deterministic flags)")
    print("  " + "-" * 66)
    if not flags:
        print("  ✓ No craft flags raised.")
    for item in flags:
        print(f"\n  Ch.{item['ch']:02d} — {item['title'][:45]} (Ω {item['omega']:.2f})")
        for f in item["flags"]:
            print(f"    ⚑ {f}")

    print()
    print("  LAYER 1 — SURGICAL CLS INSERTIONS (Quick Action Suite)")
    print("  " + "-" * 66)
    if not prescriptions:
        print("  ✓ All chapters meet CLS density floor.")
    for p in prescriptions:
        print(f"\n  Ch.{p['ch']:02d} {p['title'][:40]}")
        print(f"    Code-switch: {p['current_cs']}/1k → target {CODE_SWITCH_MIN}/1k")
        print(f"    Insertions needed: {p['insertions_needed']} | Est. Ω gain: +{p['estimated_omega_gain']}")
        print(f"    Rx: {p['prescription'][:120]}")

def main():
    data_path = sys.argv[1] if len(sys.argv) > 1 else "data/SGT_RAMOS_chapter_metrics_full.csv"
    do_seal   = "--seal" in sys.argv
    out_path  = "data/omega_seal.json" if do_seal else None

    with open(data_path) as f:
        chapters = list(csv.DictReader(f))

    seal = run_seal(data_path, out_path)
    print_report(seal)

    craft_flags   = craft_audit(chapters)
    prescriptions = surgical_cls_insertions(chapters)
    print_craft_audit(craft_flags, prescriptions)

    print()
    print("  LAYER 2 — SCIENTIFIC SCORE SUMMARY (proxy-derived)")
    print("  " + "-" * 66)
    print(f"  {'Ch':>3}  {'CLS':>7}  {'BIS':>7}  {'SII':>7}  {'MRF':>7}  {'Ω_comp':>8}")
    for r in seal["chapters"]:
        print(f"  {r['ch']:>3}  {r['CLS_proxy']:>7.1f}  {r['BIS_proxy']:>7.1f}  {r['SII_proxy']:>7.1f}  {r['MRF_proxy']:>7.1f}  {r['omega_computed']:>8.2f}")

if __name__ == "__main__":
    main()
