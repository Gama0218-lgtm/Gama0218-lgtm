"""Bulk-ingest the enriched manuscript JSON into Elasticsearch.

Uses ``doc_id`` as the document ``_id`` so re-ingestion is idempotent and
re-runs update in place rather than duplicating records. The index mapping
must exist before running this (see ``elasticsearch/mappings/``).

Usage:
    python -m elasticsearch.pipelines.bulk_ingest \
        --input manuscript_with_embeddings.json \
        --index ramos-manuscript \
        --config elasticsearch/config/config.yaml
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Iterable

from elasticsearch.pipelines._common import PIPELINE_VERSION, load_config


def _build_client(es_config: dict[str, Any]):
    try:
        from elasticsearch import Elasticsearch
    except ImportError as exc:
        raise SystemExit("elasticsearch package not installed. Run: pip install elasticsearch") from exc

    kwargs: dict[str, Any] = {
        "hosts": [es_config["endpoint"]],
        "request_timeout": es_config.get("request_timeout", 60),
        "verify_certs": es_config.get("verify_certs", True),
    }
    api_key = es_config.get("api_key")
    if api_key and api_key != "REPLACE_WITH_ES_API_KEY":
        kwargs["api_key"] = api_key
    return Elasticsearch(**kwargs)


def _generate_actions(docs: Iterable[dict[str, Any]], index: str) -> Iterable[dict[str, Any]]:
    for doc in docs:
        action: dict[str, Any] = {"_index": index, "_source": doc}
        if doc.get("doc_id"):
            action["_id"] = doc["doc_id"]
        yield action


def bulk_ingest(input_json: str, index: str, config_path: str, chunk_size: int = 200) -> tuple[int, int]:
    try:
        from elasticsearch import helpers
    except ImportError as exc:
        raise SystemExit("elasticsearch package not installed. Run: pip install elasticsearch") from exc

    cfg = load_config(config_path)
    client = _build_client(cfg["elasticsearch"])

    if not client.indices.exists(index=index):
        raise SystemExit(
            f"Index {index!r} does not exist. Create it first by PUTting "
            f"elasticsearch/mappings/{index}.json"
        )

    with open(input_json, "r", encoding="utf-8") as f:
        docs: list[dict[str, Any]] = json.load(f)

    print(f"Bulk-ingesting {len(docs)} documents into {index} (chunk_size={chunk_size})")

    success = 0
    failed_items: list[Any] = []
    for ok, item in helpers.streaming_bulk(
        client,
        _generate_actions(docs, index),
        chunk_size=chunk_size,
        raise_on_error=False,
        raise_on_exception=False,
    ):
        if ok:
            success += 1
        else:
            failed_items.append(item)

    print(f"Indexed {success}/{len(docs)} documents into {index}. Pipeline v{PIPELINE_VERSION}.")
    if failed_items:
        sample = failed_items[:5]
        print(f"WARNING: {len(failed_items)} failures. Sample: {json.dumps(sample, indent=2)[:1000]}")

    client.indices.refresh(index=index)
    return success, len(failed_items)


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--input", required=True)
    parser.add_argument("--index", required=True)
    parser.add_argument(
        "--config",
        default="elasticsearch/config/config.yaml",
        help="Path to config.yaml",
    )
    parser.add_argument("--chunk-size", type=int, default=200)
    return parser


def main() -> None:
    args = _build_parser().parse_args()
    bulk_ingest(args.input, args.index, args.config, args.chunk_size)


if __name__ == "__main__":
    main()
