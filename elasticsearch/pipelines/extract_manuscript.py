"""Extract a .docx manuscript into a flattened paragraph-level JSON corpus.

Linguistic-integrity rule: this module never lowercases, stems, removes
stopwords, unicode-normalizes, or alters the text in any way. ``text`` is the
original .docx paragraph string. All counters and feature extractors operate
on copies.

Usage:
    python -m elasticsearch.pipelines.extract_manuscript \
        --input manuscript.docx \
        --output manuscript_structured.json \
        [--config elasticsearch/config/config.yaml]
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

try:
    import docx
except ImportError as exc:
    print("python-docx not installed. Run: pip install python-docx", file=sys.stderr)
    raise

from elasticsearch.pipelines._common import (
    ExtractionContext,
    PIPELINE_VERSION,
    count_dialogue_chars,
    detect_pov,
    doc_id,
    is_chapter_heading,
    is_scene_break,
    lexical_diversity,
    spanish_token_ratio,
    split_sentences,
    text_hash,
    utc_now_iso,
)


def _empty_behavioral_vectors() -> dict[str, Any]:
    return {
        "agency": None,
        "risk": None,
        "compassion": None,
        "alignment": None,
        "code_switch": None,
        "spiritual": None,
        "identity_resonance": None,
        "trauma_intensity": None,
        "moral_conflict": None,
        "sensory_density": None,
        "historical_density": None,
        "narrative_velocity": None,
    }


def _paragraph_doc(
    *,
    text: str,
    chapter_num: int,
    chapter_title: str,
    scene_num: int,
    paragraph_num: int,
    act: str | None,
    ctx: ExtractionContext,
) -> dict[str, Any]:
    char_count = len(text)
    word_count = len(text.split())
    sentences = split_sentences(text)
    sentence_count = len(sentences)
    avg_sent_len = (word_count / sentence_count) if sentence_count else 0.0

    dialogue_chars = count_dialogue_chars(text)
    dialogue_pct = (dialogue_chars / char_count) if char_count else 0.0

    es_ratio, es_hits = spanish_token_ratio(text)

    return {
        "doc_type": "paragraph",
        "doc_id": doc_id(ctx.source_file, chapter_num, paragraph_num),
        "chapter_num": chapter_num,
        "chapter_title": chapter_title,
        "scene_num": scene_num,
        "paragraph_num": paragraph_num,
        "passage_num": paragraph_num,
        "act": act,

        "text": text,
        "text_hash": text_hash(text),

        "word_count": word_count,
        "char_count": char_count,
        "sentence_count": sentence_count,
        "avg_sentence_length": round(avg_sent_len, 4),
        "dialogue_pct": round(dialogue_pct, 4),
        "spanish_token_pct": round(es_ratio, 4),
        "code_switch_count": es_hits,
        "lexical_diversity": round(lexical_diversity(text), 4),

        "character_mentions": [],
        "historical_refs": [],
        "place_mentions": [],
        "military_unit_mentions": [],
        "date_mentions": [],

        "pov": detect_pov(text),
        "tense": None,
        "register": None,

        "behavioral_vectors": _empty_behavioral_vectors(),
        "omega_score": None,
        "contradiction_flags": [],

        "chapter_metadata": {
            "chapter_title": chapter_title,
            "act": act,
            "chapter_word_count": 0,
            "chapter_paragraph_count": 0,
        },

        "source_file": ctx.source_file,
        "extraction_timestamp": ctx.extraction_timestamp,
        "pipeline_version": ctx.pipeline_version,
        "enrichment_runs": [],
    }


def extract_manuscript(docx_path: str, output_path: str) -> list[dict[str, Any]]:
    source_file = Path(docx_path).name
    ctx = ExtractionContext(source_file=source_file)

    doc = docx.Document(docx_path)

    flattened: list[dict[str, Any]] = []
    chapter_num = 0
    chapter_title = "Untitled"
    scene_num = 1
    paragraph_counter = 0
    current_act: str | None = None

    for para in doc.paragraphs:
        # NOTE: only outer whitespace is stripped. We do not collapse internal
        # whitespace, remove punctuation, or normalize unicode.
        text = para.text.strip()
        if not text:
            continue

        is_chap, parsed_num, heading_text = is_chapter_heading(text)
        if is_chap and parsed_num is not None:
            chapter_num = parsed_num
            chapter_title = heading_text
            scene_num = 1
            paragraph_counter = 0
            # Heuristic "act" inference (researcher can override later).
            if chapter_num <= 14:
                current_act = "Act I"
            elif chapter_num <= 29:
                current_act = "Act II"
            else:
                current_act = "Act III"
            continue

        if is_scene_break(text):
            scene_num += 1
            continue

        paragraph_counter += 1
        flattened.append(
            _paragraph_doc(
                text=text,
                chapter_num=chapter_num,
                chapter_title=chapter_title,
                scene_num=scene_num,
                paragraph_num=paragraph_counter,
                act=current_act,
                ctx=ctx,
            )
        )

    # Compute per-chapter totals and propagate to each paragraph.
    chapter_word_counts: dict[int, int] = {}
    chapter_para_counts: dict[int, int] = {}
    for d in flattened:
        ch = d["chapter_num"]
        chapter_word_counts[ch] = chapter_word_counts.get(ch, 0) + d["word_count"]
        chapter_para_counts[ch] = chapter_para_counts.get(ch, 0) + 1

    for d in flattened:
        ch = d["chapter_num"]
        d["chapter_metadata"]["chapter_word_count"] = chapter_word_counts[ch]
        d["chapter_metadata"]["chapter_paragraph_count"] = chapter_para_counts[ch]

    out_path = Path(output_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(flattened, f, indent=2, ensure_ascii=False)

    chapter_count = len({d["chapter_num"] for d in flattened if d["chapter_num"]})
    total_words = sum(d["word_count"] for d in flattened)
    print(
        f"Extracted {len(flattened)} paragraphs across {chapter_count} chapters "
        f"({total_words:,} words). Pipeline v{PIPELINE_VERSION}. "
        f"Timestamp {ctx.extraction_timestamp}."
    )
    print(f"Wrote {output_path}")
    return flattened


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--input", required=True, help="Path to manuscript.docx")
    parser.add_argument("--output", required=True, help="Output JSON path")
    return parser


def main() -> None:
    args = _build_parser().parse_args()
    extract_manuscript(args.input, args.output)


if __name__ == "__main__":
    main()
