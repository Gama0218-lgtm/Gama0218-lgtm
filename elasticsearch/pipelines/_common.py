"""Shared helpers for the forensic pipeline.

Linguistic-integrity rule: nothing here lowercases, stems, removes stopwords,
unicode-normalizes, or "cleans" the manuscript text. Counters and pattern
checks operate on copies so the canonical ``text`` field is never mutated.
"""

from __future__ import annotations

import hashlib
import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import yaml

PIPELINE_VERSION = "1.0.0"

# Matches a paragraph that opens a chapter. Roman numerals are allowed because
# the manuscript uses both Arabic and Roman numbering across drafts.
CHAPTER_PATTERN = re.compile(
    r"^(Chapter|CHAPTER|CAPÍTULO|CAPITULO)\s+([0-9IVXLCDM]+)",
    re.IGNORECASE,
)

# Scene/section dividers commonly used in literary manuscripts.
SCENE_SEPARATOR = re.compile(r"^\s*(\*{3,}|#{3,}|-{3,}|=+|·{3,}|◇{3,})\s*$")

# Dialogue detection: ASCII straight quotes, curly quotes, and Spanish dashes
# (— ... —) so bilingual code-switched dialogue isn't lost.
DIALOGUE_PATTERNS = [
    re.compile(r"[“”]([^“”]+)[“”]"),
    re.compile(r'"([^"]+)"'),
    re.compile(r"'([^']+)'"),
    re.compile(r"—\s*([^—\n]+?)\s*—"),
]

# A small, intentionally conservative Spanish lexical signature. This is used
# only to *flag* code-switching density. It is NOT used to translate, lower
# case, or otherwise rewrite the text.
SPANISH_SIGNAL_TOKENS = {
    "el", "la", "los", "las", "un", "una", "unos", "unas",
    "y", "o", "pero", "porque", "que", "si", "no", "sí",
    "es", "son", "está", "están", "soy", "eres", "fue", "fueron",
    "mi", "tu", "su", "mis", "tus", "sus",
    "para", "por", "con", "sin", "de", "del", "al",
    "más", "menos", "muy", "ya", "aquí", "allí", "allá",
    "mira", "oye", "ese", "esa", "este", "esta", "eso", "esto",
    "vato", "ese", "ese", "carnal", "compa", "primo", "mijo", "mija",
    "güey", "wey", "órale", "ándale", "chido", "padre", "neta",
    "abuela", "abuelo", "tío", "tía", "hermano", "hermana",
    "Dios", "Diosito", "Madre", "Padre", "Jesús", "Cristo",
    "barrio", "calle", "casa", "familia", "tierra",
    "nada", "todo", "alguien", "nadie",
    "qué", "quién", "cuándo", "dónde", "cómo", "cuánto",
    "soldado", "guerra", "patria", "honor",
}

ROMAN_MAP = {
    "I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000,
}


@dataclass
class ExtractionContext:
    """Tracks pipeline metadata that needs to propagate to every doc."""

    source_file: str
    pipeline_version: str = PIPELINE_VERSION
    extraction_timestamp: str = ""

    def __post_init__(self) -> None:
        if not self.extraction_timestamp:
            self.extraction_timestamp = utc_now_iso()


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def text_hash(text: str) -> str:
    """SHA-256 of the *original* text, used for tamper detection and dedup."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def load_config(path: str | os.PathLike[str]) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def parse_chapter_number(raw: str) -> int | None:
    raw = raw.strip().upper()
    if raw.isdigit():
        return int(raw)
    total = 0
    prev = 0
    for ch in reversed(raw):
        if ch not in ROMAN_MAP:
            return None
        val = ROMAN_MAP[ch]
        if val < prev:
            total -= val
        else:
            total += val
        prev = val
    return total or None


def is_chapter_heading(line: str) -> tuple[bool, int | None, str]:
    match = CHAPTER_PATTERN.match(line.strip())
    if not match:
        return False, None, ""
    num = parse_chapter_number(match.group(2))
    return True, num, line.strip()


def is_scene_break(line: str) -> bool:
    return bool(SCENE_SEPARATOR.match(line))


def split_sentences(text: str) -> list[str]:
    """Lightweight sentence splitter that respects ellipses and em dashes."""
    if not text:
        return []
    placeholder = " ELLIPSIS "
    safe = text.replace("...", placeholder).replace("…", placeholder)
    parts = re.split(r"(?<=[.!?])\s+", safe)
    return [p.replace(placeholder, "...").strip() for p in parts if p.strip()]


def count_dialogue_chars(text: str) -> int:
    total = 0
    for pattern in DIALOGUE_PATTERNS:
        for match in pattern.finditer(text):
            total += len(match.group(0))
    return total


def spanish_token_ratio(text: str) -> tuple[float, int]:
    """Return (ratio, hit_count). Operates on a casefolded copy only."""
    tokens = re.findall(r"\w+", text, flags=re.UNICODE)
    if not tokens:
        return 0.0, 0
    lowered = [t.lower() for t in tokens]
    hits = sum(1 for t in lowered if t in SPANISH_SIGNAL_TOKENS)
    return hits / len(tokens), hits


def lexical_diversity(text: str) -> float:
    tokens = re.findall(r"\w+", text, flags=re.UNICODE)
    if not tokens:
        return 0.0
    return len(set(t.lower() for t in tokens)) / len(tokens)


def detect_pov(text: str) -> str | None:
    """Heuristic POV detector — confirms-or-flags, doesn't decide."""
    first = sum(1 for _ in re.finditer(r"\b(I|me|my|mine|we|us|our)\b", text))
    third = sum(1 for _ in re.finditer(r"\b(he|she|him|her|his|hers|they|them|their)\b", text))
    second = sum(1 for _ in re.finditer(r"\byou(?:r|rs)?\b", text))
    counts = {"first_person": first, "second_person": second, "third_person": third}
    top = max(counts, key=counts.get)
    if counts[top] == 0:
        return None
    return top


def doc_id(source_file: str, chapter_num: int | None, paragraph_num: int | None) -> str:
    base = Path(source_file).stem
    return f"{base}::ch{chapter_num or 0:03d}::p{paragraph_num or 0:05d}"


def chunked(seq: Iterable[Any], size: int) -> Iterable[list[Any]]:
    batch: list[Any] = []
    for item in seq:
        batch.append(item)
        if len(batch) >= size:
            yield batch
            batch = []
    if batch:
        yield batch
