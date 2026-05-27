"""Post-index enrichment: NER, readability, and behavioral-vector scaffolding.

This stage runs AFTER bulk ingestion. It scans documents in the index,
computes additional analytical fields, and writes them back via partial
update. Every enrichment run is appended to the ``enrichment_runs`` nested
field so the provenance chain is preserved (which stage updated what, when,
with which model version).

Linguistic-integrity rule: enrichment NEVER modifies the ``text`` or
``text_hash`` fields. It only adds analytic metadata.

Usage:
    python -m elasticsearch.pipelines.enrich_metadata \
        --index ramos-manuscript \
        --config elasticsearch/config/config.yaml \
        --stages ner readability
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from typing import Any, Iterable

from elasticsearch.pipelines._common import (
    PIPELINE_VERSION,
    load_config,
    utc_now_iso,
)


MILITARY_UNIT_RE = re.compile(
    r"\b("
    r"(?:1st|2nd|3rd|[4-9]th|\d{2,3}(?:st|nd|rd|th))\s+(?:Infantry|Cavalry|Marine|Airborne|Artillery|Battalion|Brigade|Division|Regiment)"
    r"|"
    r"(?:Company|Co\.)\s+[A-Z]"
    r"|"
    r"MACV|USARV|MAAG|ARVN|NVA|VC"
    r")\b"
)

DATE_RE = re.compile(
    r"\b("
    r"(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s*\d{4}"
    r"|"
    r"\d{1,2}/\d{1,2}/\d{2,4}"
    r"|"
    r"\d{4}-\d{2}-\d{2}"
    r"|"
    r"19[4-9]\d|20[0-2]\d"
    r")\b"
)


def _build_client(es_config: dict[str, Any]):
    try:
        from elasticsearch import Elasticsearch
    except ImportError as exc:
        raise SystemExit("elasticsearch package not installed.") from exc
    kwargs: dict[str, Any] = {
        "hosts": [es_config["endpoint"]],
        "request_timeout": es_config.get("request_timeout", 60),
        "verify_certs": es_config.get("verify_certs", True),
    }
    api_key = es_config.get("api_key")
    if api_key and api_key != "REPLACE_WITH_ES_API_KEY":
        kwargs["api_key"] = api_key
    return Elasticsearch(**kwargs)


def _load_spacy(model_name: str):
    try:
        import spacy
    except ImportError as exc:
        raise SystemExit(
            "spacy not installed. Run: pip install spacy && python -m spacy download " + model_name
        ) from exc
    try:
        return spacy.load(model_name)
    except OSError as exc:
        raise SystemExit(
            f"spaCy model {model_name!r} not available. "
            f"Run: python -m spacy download {model_name}"
        ) from exc


def enrich_ner(text: str, nlp) -> dict[str, list[str]]:
    """Extract characters, places, military units, and date references."""
    doc = nlp(text)
    persons: list[str] = []
    places: list[str] = []
    dates_spacy: list[str] = []
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            persons.append(ent.text)
        elif ent.label_ in ("GPE", "LOC", "FAC"):
            places.append(ent.text)
        elif ent.label_ == "DATE":
            dates_spacy.append(ent.text)

    units = sorted({m.group(0) for m in MILITARY_UNIT_RE.finditer(text)})
    dates_regex = sorted({m.group(0) for m in DATE_RE.finditer(text)})
    return {
        "character_mentions": sorted(set(persons)),
        "place_mentions": sorted(set(places)),
        "military_unit_mentions": units,
        "date_mentions": sorted(set(dates_spacy) | set(dates_regex)),
    }


def enrich_readability(text: str) -> dict[str, float]:
    try:
        import textstat
    except ImportError as exc:
        raise SystemExit("textstat not installed. Run: pip install textstat") from exc
    return {
        "flesch_kincaid_grade": float(textstat.flesch_kincaid_grade(text)),
        "flesch_reading_ease": float(textstat.flesch_reading_ease(text)),
    }


def _iterate_docs(client, index: str, batch_size: int = 200) -> Iterable[dict[str, Any]]:
    from elasticsearch import helpers
    for hit in helpers.scan(
        client,
        index=index,
        query={"query": {"match_all": {}}},
        size=batch_size,
        scroll="2m",
    ):
        yield hit


def run_enrichment(index: str, config_path: str, stages: list[str]) -> None:
    cfg = load_config(config_path)
    client = _build_client(cfg["elasticsearch"])

    spacy_model = cfg.get("pipeline", {}).get("enrichment", {}).get("spacy_model", "en_core_web_lg")
    nlp = _load_spacy(spacy_model) if "ner" in stages else None

    updates_buffer: list[dict[str, Any]] = []
    total_processed = 0

    for hit in _iterate_docs(client, index):
        src = hit["_source"]
        text = src.get("text", "")
        if not text:
            continue

        patch: dict[str, Any] = {}
        if "ner" in stages and nlp is not None:
            patch.update(enrich_ner(text, nlp))
        if "readability" in stages:
            patch.update(enrich_readability(text))

        if not patch:
            continue

        patch["enrichment_runs"] = list(src.get("enrichment_runs") or [])
        patch["enrichment_runs"].append({
            "stage": "+".join(sorted(stages)),
            "version": PIPELINE_VERSION,
            "timestamp": utc_now_iso(),
        })

        updates_buffer.append({
            "_op_type": "update",
            "_index": index,
            "_id": hit["_id"],
            "doc": patch,
        })

        if len(updates_buffer) >= 200:
            _flush(client, updates_buffer)
            total_processed += len(updates_buffer)
            updates_buffer = []

    if updates_buffer:
        _flush(client, updates_buffer)
        total_processed += len(updates_buffer)

    client.indices.refresh(index=index)
    print(f"Enrichment complete. {total_processed} docs updated. Pipeline v{PIPELINE_VERSION}.")


def _flush(client, actions: list[dict[str, Any]]) -> None:
    from elasticsearch import helpers
    success, failed = helpers.bulk(client, actions, raise_on_error=False)
    if failed:
        print(f"  WARNING: {len(failed)} update failures in batch", file=sys.stderr)
    else:
        print(f"  ... flushed {success} updates")


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--index", required=True)
    parser.add_argument(
        "--config",
        default="elasticsearch/config/config.yaml",
    )
    parser.add_argument(
        "--stages",
        nargs="+",
        choices=["ner", "readability"],
        default=["ner", "readability"],
    )
    return parser


def main() -> None:
    args = _build_parser().parse_args()
    run_enrichment(args.index, args.config, args.stages)


if __name__ == "__main__":
    main()
