# Ramos Forensic Manuscript Analytics Engine

Elasticsearch-based forensic literary-historical validation engine for the Ramos manuscript (245,000 words, 43 chapters, hybrid literary-historical investigative corpus).

## Architecture

This is not a content-management system. It is a forensic literary historiography engine that supports:

- Multi-resolution hierarchical chunking (chapter → scene → paragraph → semantic passage)
- Hybrid retrieval (BM25 keyword + dense-vector semantic)
- Behavioral vector scoring per chapter
- Historical evidence cross-referencing (DCAS/NARA/FOIA)
- Stylometric comparison against literary canon
- Contradiction detection and claim-to-source traceability
- Hispanic/Latino military demographic analysis
- Archival citation tracking

## Critical Preprocessing Constraint

**Do not normalize, sanitize, or "clean" the text.**

Preserve:
- Original punctuation (em dashes, ellipses, unconventional spacing)
- Bilingual dialogue (Spanish/English code-switching)
- Slang and vernacular
- Military jargon (MOS codes, unit designations, radio protocol)
- Dialect markers (Chicano English, regional syntax)
- Orthographic choices (intentional misspellings, phonetic dialogue)

Standard NLP pipelines (lowercasing, stemming, stopword removal) will destroy the forensic signal. Embeddings must capture sociolinguistic texture, not a sanitized abstraction.

## Index Taxonomy

| Index | Purpose |
| ----- | ------- |
| `ramos-manuscript` | Chapters, scenes, paragraphs (primary corpus) |
| `ramos-behavioral-vectors` | Agency / Risk / Compassion / Alignment / Code-switch / Spiritual per chapter |
| `ramos-historical-evidence` | DCAS / NARA / FOIA / congressional testimony |
| `ramos-corpus-comparison` | Comp-title excerpts (O'Brien, Hemingway, Anaya, Cisneros) |
| `ramos-citation-network` | Claim-to-source provenance and traceability |
| `ramos-stylometry` | Function-word frequency, lexical diversity, sentence-length distributions |
| `ramos-identity-analysis` | Hispanic surname validation, demographic inference |

## Pipeline Flow

```
manuscript.docx
      │
      ▼  extract_manuscript.py  (preserve linguistic features)
manuscript_structured.json
      │
      ▼  generate_embeddings.py  (OpenAI text-embedding-3-small OR local model)
manuscript_with_embeddings.json
      │
      ▼  bulk_ingest.py
Elasticsearch (ramos-manuscript)
      │
      ▼  enrich_metadata.py  (NER, readability, behavioral vectors, post-index analytics)
Enriched corpus → forensic queries
```

## Quick Start

```bash
pip install -r requirements.txt
cp config/config.example.yaml config/config.yaml
# Edit config/config.yaml with your Elasticsearch endpoint and API keys

python pipelines/extract_manuscript.py --input manuscript.docx --output manuscript_structured.json
python pipelines/generate_embeddings.py --input manuscript_structured.json --output manuscript_with_embeddings.json
python pipelines/bulk_ingest.py --input manuscript_with_embeddings.json --index ramos-manuscript
python pipelines/enrich_metadata.py --index ramos-manuscript
```

Then load the index mappings via Elasticsearch Dev Tools:

```
PUT /ramos-manuscript            (mappings/ramos-manuscript.json)
PUT /ramos-behavioral-vectors    (mappings/ramos-behavioral-vectors.json)
PUT /ramos-historical-evidence   (mappings/ramos-historical-evidence.json)
PUT /ramos-corpus-comparison     (mappings/ramos-corpus-comparison.json)
PUT /ramos-citation-network      (mappings/ramos-citation-network.json)
PUT /ramos-stylometry            (mappings/ramos-stylometry.json)
PUT /ramos-identity-analysis     (mappings/ramos-identity-analysis.json)
```

## Provenance and Reproducibility

Every document carries:

- `source_file` — original file name
- `extraction_timestamp` — ISO 8601 UTC
- `embedding_model` — model identifier
- `embedding_timestamp` — when the embedding was generated
- `pipeline_version` — pipeline release that produced the record
- `text_hash` — SHA-256 of the original text for tamper detection

This means any record can be traced from its forensic claim back to the exact line of source material and the exact pipeline run that produced its analytics.

## Embedding Model

Primary: OpenAI `text-embedding-3-small` (1536 dims).
Secondary/experimental: `all-MiniLM-L6-v2` (384 dims), `bge-large-en` (1024 dims), `e5-large-v2` (1024 dims).

The architecture is model-agnostic — embeddings can be regenerated later without rebuilding the corpus. Each document records the embedding model used so heterogeneous embedding sets can coexist in the same index for comparison studies.

## Research Sources Cross-Referenced

- Library of Congress digital scholarship resources
- NARA AAD military databases (DCAS, Combat Area Casualties)
- Duke Combat Area Casualties Dataset
- Congressional Medal of Honor Society — Hispanic/Latino recipients
- The Virtual Wall
- Vietnam Veterans Memorial Fund database
- TAPoR, NYU Digital Humanities, Harvard DH text-analysis tools (stylometry methodology)
- Computational Stylistics Group resources
- `stylo` (R package) — for comparative stylometric validation against the literary canon

## Methodology Notes

This system does not conclude. It shows:

- methodology
- provenance
- confidence intervals
- source lineage
- uncertainty
- competing interpretations

Conclusions are produced by the researcher, not the engine. The engine produces the evidence that survives scrutiny.
