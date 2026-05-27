"""Generate dense vector embeddings for the structured manuscript JSON.

The architecture is model-agnostic — embeddings can be regenerated later
without rebuilding the corpus. Each doc records the model and timestamp used
so heterogeneous embedding sets can coexist in the same index.

Linguistic-integrity rule: the embedded text is the original ``text`` field
verbatim. No casefolding, stemming, stopword removal, or unicode
normalization is performed before embedding.

Usage:
    python -m elasticsearch.pipelines.generate_embeddings \
        --input manuscript_structured.json \
        --output manuscript_with_embeddings.json \
        --provider openai --model text-embedding-3-small
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Iterable

from elasticsearch.pipelines._common import (
    PIPELINE_VERSION,
    chunked,
    utc_now_iso,
)


class EmbeddingBackend:
    name = "abstract"
    dims = 0

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        raise NotImplementedError


class OpenAIBackend(EmbeddingBackend):
    def __init__(self, model: str, api_key: str | None = None, rate_sleep: float = 0.02):
        try:
            from openai import OpenAI
        except ImportError as exc:
            raise SystemExit("openai package not installed. Run: pip install openai") from exc

        self.client = OpenAI(api_key=api_key or os.environ.get("OPENAI_API_KEY"))
        self.name = model
        self.rate_sleep = rate_sleep
        self.dims = {
            "text-embedding-3-small": 1536,
            "text-embedding-3-large": 3072,
            "text-embedding-ada-002": 1536,
        }.get(model, 1536)

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        response = self.client.embeddings.create(model=self.name, input=texts)
        if self.rate_sleep > 0:
            time.sleep(self.rate_sleep)
        return [item.embedding for item in response.data]


class SentenceTransformersBackend(EmbeddingBackend):
    def __init__(self, model: str):
        try:
            from sentence_transformers import SentenceTransformer
        except ImportError as exc:
            raise SystemExit(
                "sentence-transformers not installed. Run: pip install sentence-transformers"
            ) from exc
        self.model = SentenceTransformer(model)
        self.name = model
        # The encode call returns ndarray; dims read from a single warm-up encode.
        warm = self.model.encode(["warm"], show_progress_bar=False)
        self.dims = int(warm.shape[1])

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        vecs = self.model.encode(texts, show_progress_bar=False)
        return [v.tolist() for v in vecs]


def build_backend(provider: str, model: str, api_key: str | None) -> EmbeddingBackend:
    if provider == "openai":
        return OpenAIBackend(model=model, api_key=api_key)
    if provider == "sentence-transformers":
        return SentenceTransformersBackend(model=model)
    raise ValueError(f"Unknown embedding provider: {provider!r}")


def generate_embeddings(
    input_json: str,
    output_json: str,
    backend: EmbeddingBackend,
    batch_size: int = 16,
    skip_existing: bool = False,
) -> None:
    with open(input_json, "r", encoding="utf-8") as f:
        docs: list[dict[str, Any]] = json.load(f)

    pending: list[dict[str, Any]] = [
        d for d in docs
        if not (skip_existing and d.get("embedding") and d.get("embedding_model") == backend.name)
    ]

    print(
        f"Embedding {len(pending)}/{len(docs)} documents "
        f"via {backend.name} ({backend.dims} dims), batch={batch_size}"
    )

    completed = 0
    for batch in chunked(pending, batch_size):
        texts = [d["text"] for d in batch]
        vectors = backend.embed_batch(texts)
        if len(vectors) != len(batch):
            raise RuntimeError(
                f"Embedding backend returned {len(vectors)} vectors for batch of {len(batch)}"
            )
        ts = utc_now_iso()
        for doc, vec in zip(batch, vectors):
            doc["embedding"] = vec
            doc["embedding_model"] = backend.name
            doc["embedding_dims"] = backend.dims
            doc["embedding_timestamp"] = ts
        completed += len(batch)
        print(f"  ... {completed}/{len(pending)}")

    out_path = Path(output_json)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(docs, f, indent=2, ensure_ascii=False)

    print(f"Wrote {output_json}. Pipeline v{PIPELINE_VERSION}.")


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument(
        "--provider",
        choices=["openai", "sentence-transformers"],
        default="openai",
    )
    parser.add_argument("--model", default="text-embedding-3-small")
    parser.add_argument("--api-key", default=None, help="Override OPENAI_API_KEY env")
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip docs already embedded by the same model",
    )
    return parser


def main() -> None:
    args = _build_parser().parse_args()
    backend = build_backend(args.provider, args.model, args.api_key)
    generate_embeddings(
        input_json=args.input,
        output_json=args.output,
        backend=backend,
        batch_size=args.batch_size,
        skip_existing=args.skip_existing,
    )


if __name__ == "__main__":
    main()
