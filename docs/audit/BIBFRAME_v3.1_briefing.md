# MARC-to-BIBFRAME v3.1 — Briefing for LitCentral / SGT Ramos

**Source:** Library of Congress, Network Development and MARC Standards Office
**Announcement:** https://www.loc.gov/bibframe/implementation/index.html
**Updated Modern MARC:** https://www.loc.gov/marc/ModernMARC-March2026.pdf
**Conversion code:**
- `marc2bibframe` — https://github.com/lcnetdev/marc2bibframe2
- `bibframe2marc` — https://github.com/lcnetdev/bibframe2marc

---

## Why this matters for SGT Ramos

LitCentral already lists Library of Congress as one of six canonical
external data sources (`src/lib/externalSources.js`, capability set
`["lccn_lookup", "control_numbers", "authority_records"]`). The v3.1
conversion update touches that integration directly in three ways:

1. **Catalog interoperability** — the conversion programs are the bridge
   between traditional MARC bibliographic records and BIBFRAME's linked-data
   graph. As LitCentral's manuscript pipeline matures past Gate 2, every
   record we round-trip through LoC (LCCN lookups, authority records,
   linked-data assertions) will pass through these converters.
2. **Language tagging now follows BCP47 end-to-end.** BIBFRAME has used
   BCP47 internally for a decade; v3.1 closes the loop by *emitting* BCP47
   into MARC's data-provenance subfield (typically `$7`). For a bilingual
   manuscript with Chicano Spanish, Boricua Spanish, and New York English
   code-switching, that is the difference between cataloguing accuracy and
   cataloguing erasure.
3. **Submission package readiness** — Gate 3 of the manuscript program
   includes academic / library submission. Any BIBFRAME-aware library
   ingest will now expect BCP47-coded language descriptions in the
   provenance subfield. The earlier we encode them in our pipeline, the
   less rework at submission.

---

## What's actually new in v3.1

The release notes ship *one* large semantic change wrapped in tooling work:

| Area | v3.0 behavior | v3.1 change |
| --- | --- | --- |
| BCP47 in BIBFRAME | Used in descriptions (≈ 10 yrs) | Same — confirmed canonical |
| BCP47 in MARC output | Inconsistent / absent | **Emitted in `$7` data-provenance subfield** |
| Round-trip fidelity | Language tags lost on MARC export | Tags preserved across bibframe2marc |
| Script codes | BIBFRAME only | Now reach MARC alongside language codes |
| `marc2bibframe2` repo | Bound to specific XSLT versions | Updated converter + specs in repo |
| `bibframe2marc` repo | Same | Updated converter + specs in repo |
| Specs site | Static page | New specs added on the Library's BIBFRAME site |

The Modern MARC March 2026 document explains how the codes will be
presented in MARC records going forward (where `$7` lands, how subfields
are stacked, what an example record looks like).

---

## BCP47 — what it is and why it's central

**BCP47** is a Best Common Practice document maintained by the IETF that
specifies how to tag human languages and scripts in computing systems. The
canonical Wikipedia entry is at https://en.wikipedia.org/wiki/IETF_language_tag.
The format is a hyphen-delimited stack of subtags drawn from registries:

```
language-Script-REGION-variant-extension-privateuse
```

Examples relevant to *SGT Ramos*:

| Tag | Meaning | Manuscript relevance |
| --- | --- | --- |
| `en`               | English (generic) | Default baseline |
| `en-US`            | English, United States | The bulk of narration |
| `en-NY`            | English, New York (region subtag) | New York English dialect chapters |
| `es`               | Spanish (generic) | Bilingual code-switch baseline |
| `es-MX`            | Mexican Spanish | Chicano Spanish reference dialect |
| `es-419`           | Latin American Spanish (UN M.49 region code) | Useful for cross-Latino cohort |
| `es-US`            | US Spanish | Chicano / Tex-Mex / Spanglish |
| `es-PR`            | Puerto Rican Spanish | Boricua chapters |
| `es-419-x-chicano` | Spanish, Latin America, private-use "chicano" | If we want to mark Chicano specifically |
| `es-419-x-boricua` | Spanish, Latin America, private-use "boricua" | Boricua |
| `Latn`             | Latin script | Standard |

The `-x-` extension subtag is BCP47's escape hatch for community-defined
variants that don't yet have IANA registry entries. For *SGT Ramos*, where
Chicano and Boricua aren't yet IANA-registered as dialects, `-x-chicano` and
`-x-boricua` are the cleanest way to encode them without abusing region
codes.

**Why the `$7` data-provenance subfield matters.** Putting BCP47 in `$7`
tells downstream catalogers *which authority decided this language tag was
correct*. For a manuscript whose sociolinguistic claim is part of its
literary identity, that provenance trail is itself a feature — it survives
catalog migrations and lets readers and librarians audit the call later.

---

## Concrete plan for LitCentral

### 1. Add a language registry to the data layer

```js
// src/lib/bcp47Tags.js
export const MANUSCRIPT_LANGUAGES = {
  en_us:        { tag: "en-US",            label: "English (United States)" },
  en_us_ny:     { tag: "en-US-x-nyc",      label: "English, New York urban" },
  es_mx_chic:   { tag: "es-MX-x-chicano",  label: "Chicano Spanish" },
  es_pr_boricua:{ tag: "es-PR-x-boricua",  label: "Puerto Rican Boricua" },
  es_419:       { tag: "es-419",           label: "Spanish, Latin America" },
};
```

Wired through:

- `ManuscriptVersion.languages: string[]` (BCP47 array)
- `Chapter.dominantLanguages: string[]` (top 1-3 tags per chapter)
- `Audit.codeSwitchEvents: { atWord: number, from: string, to: string }[]`

The Spanish-gap finding (Ch.2, 17, 26, 29, 41 — MED audit flag) is exactly
the kind of thing this schema makes machine-checkable.

### 2. Update the LoC data source entry

Mark the BIBFRAME v3.1 contract on the LoC connector so future readers of
the codebase know which version of the conversion spec the integration is
calibrated against. (Implemented in `src/lib/externalSources.js`.)

### 3. Emit BCP47 in any record we hand back to libraries

When the Gate 3 submission package generates MARC or BIBFRAME, every record
must carry BCP47 in `$7` for every distinct language present in the work.
For *SGT Ramos* that is at minimum: `en-US`, `es-MX-x-chicano`, `es-PR-x-boricua`.

### 4. Audit hook

Add to the metric verification audit: *"Language tagging — BCP47 in
provenance subfield"* as a `Verified` metric once the emit-path is in
place. This converts a previously implicit cataloging claim into an
explicit audit row.

---

## Suggested follow-up

- **Pin the converter version.** `marc2bibframe2` is in active development
  on GitHub; if we end up running it locally for record validation, vendor
  the v3.1 release tag (not `main`) into our build to avoid breakage.
- **Read the Modern MARC March 2026 PDF carefully** before we start
  emitting `$7` — there are MARC subfield ordering and repeatability rules
  that the document spells out and that linters will enforce.
- **Coordinate with the AUMER Foundation cataloging contact** (the
  Three-Gate program names a library-relations role). The cohort design's
  Academic Faculty / Grad cohort is the natural place to surface this work.

---

## TL;DR

> **MARC-to-BIBFRAME v3.1 now carries BCP47 language tags all the way out
> through MARC's `$7` provenance subfield.** For a manuscript whose
> sociolinguistic claim — Chicano Spanish, Puerto Rican Boricua, New York
> English — is part of its literary argument, that's the difference
> between accurate catalog representation and erasure on ingest. We should
> stand up a small BCP47 registry, tag chapters and code-switch events
> against it, and emit those tags in any record we send to libraries.
> Submission-readiness only.
