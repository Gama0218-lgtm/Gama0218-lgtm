# Historical / Identity Data Sources

These are the external archives the `ramos-historical-evidence` and
`ramos-identity-analysis` indices will be populated from. They are
documented here (rather than buried in a script) so the provenance of
every claim-to-source link traces back to a citable, named source.

Linguistic-integrity note: the same rules apply to ingested archival
text — no normalization, lowercasing, or stripping of accents. Spanish
surnames must keep their accents (`Peña`, `Núñez`, `Martínez`); ranks
keep their abbreviations; unit designations keep their punctuation.

## Vietnam Casualty Databases

| Source | URL | Use |
| ------ | --- | --- |
| The Wall — USA (interactive search) | https://www.thewall-usa.com/index.asp#search | Name → service number → unit → date validation |
| Coffelt Database | https://www.coffeltdatabase.org/search.php | Combat-area casualty cross-reference |
| NARA AAD Military Databases | https://www.archives.gov/research/military/veterans/aad.html | DCAS, Combat Area Casualties, POW/MIA, awards |
| Duke Combat Area Casualties Dataset | https://library.duke.edu/data/sources/cac-vietnam | Research-oriented mirror of NARA data |
| Vietnam Veterans Memorial Fund | https://www.vvmf.org/wof-search/ | Memorial wall validation |
| The Virtual Wall | https://www.virtualwall.org/iAlpha.htm | Alphabetical casualty index |

## Hispanic / Latino Military Recognition

| Source | URL | Use |
| ------ | --- | --- |
| CMOHS — Hispanic/Latino Recipients | https://www.cmohs.org/recipients/lists/hispanic-latino-recipients/page/4 | Medal of Honor recipient cross-reference for surname-validation studies |

## Genealogy / Surname Origin

| Source | URL | Use |
| ------ | --- | --- |
| Geneanet | https://en.geneanet.org/create-your-family-tree/ | Supplemental Hispanic-lineage signal; non-definitive on its own |

## Methodology

Each ingested record carries:

- `source` — keyword identifier (e.g. `coffelt`, `nara_aad`, `vvmf`)
- `source_url` — original record URL
- `source_record_id` — the source's native ID, kept verbatim
- `text_hash` — SHA-256 of the original cited text
- `ingestion_timestamp` — when the record entered our pipeline
- `pipeline_version` — pipeline release identifier

Cross-reference links live in `ramos-citation-network`, where each
claim is connected to the manuscript paragraph (`manuscript_doc_id`)
AND the supporting evidence document (`source_doc_id`). A claim that
contradicts evidence carries `support_relation: "contradicts"` and
the conflicting `source_doc_id` is recorded in `contradiction_with`.

Conclusions are produced by the researcher. The engine produces the
evidence that survives scrutiny.
