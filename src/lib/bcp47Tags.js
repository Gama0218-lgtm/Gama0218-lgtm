/**
 * src/lib/bcp47Tags.js
 * BCP47 language registry for the SGT Ramos manuscript.
 *
 * BCP47 (IETF Best Common Practice 47) is the canonical way to tag human
 * languages in computing systems. BIBFRAME v3.1 (LoC, March 2026) now emits
 * these tags into MARC's $7 data-provenance subfield — preserving the
 * manuscript's bilingual claim through cataloging round-trip.
 *
 * See docs/audit/BIBFRAME_v3.1_briefing.md for context.
 *
 * Private-use subtags (`-x-...`) are used for community dialects that lack
 * IANA registry entries (Chicano, Boricua). Switching to a registered subtag
 * later is a one-line change.
 */

export const MANUSCRIPT_LANGUAGES = {
  en_us: {
    tag: "en-US",
    label: "English (United States)",
    role: "primary narration",
  },
  en_us_nyc: {
    tag: "en-US-x-nyc",
    label: "New York urban English",
    role: "New York English dialect chapters",
    reference: "Paul Meier Dialect Services — New York English",
  },
  es_mx_chicano: {
    tag: "es-MX-x-chicano",
    label: "Chicano Spanish",
    role: "Chicano / Tex-Mex / Spanglish code-switching",
    reference: "Chicano Slang lexicon (Mexican Spanish + pragmatics)",
  },
  es_pr_boricua: {
    tag: "es-PR-x-boricua",
    label: "Puerto Rican Boricua Spanish",
    role: "Boricua code-switching, family scenes, NY-Puerto Rican voice",
    reference: "Speaking Boricua corpus",
  },
  es_419: {
    tag: "es-419",
    label: "Spanish, Latin America (UN M.49)",
    role: "general Latin American Spanish",
  },
  es_us: {
    tag: "es-US",
    label: "US Spanish",
    role: "US-domestic Spanish-language reception",
  },
};

export const MANUSCRIPT_LANGUAGE_LIST = Object.values(MANUSCRIPT_LANGUAGES);

/**
 * Returns the BCP47 tag for a known language key, or null if unknown.
 * Tolerant of arbitrary casing on the input key.
 */
export function tagFor(key) {
  if (!key) return null;
  const k = String(key).toLowerCase().replace(/-/g, "_");
  return MANUSCRIPT_LANGUAGES[k]?.tag || null;
}

/**
 * The minimum set of BCP47 tags a Gate-3 submission package must declare
 * for the SGT Ramos manuscript. Drop into MARC $7 verbatim.
 */
export const SUBMISSION_TAGS = [
  "en-US",
  "es-MX-x-chicano",
  "es-PR-x-boricua",
];

/**
 * BIBFRAME conversion target. Pinned to the v3.1 LoC release (March 2026)
 * so we don't drift against `main` of the converter repos.
 */
export const BIBFRAME_VERSION = "3.1";

export default {
  MANUSCRIPT_LANGUAGES,
  MANUSCRIPT_LANGUAGE_LIST,
  SUBMISSION_TAGS,
  BIBFRAME_VERSION,
  tagFor,
};
