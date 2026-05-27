"""Tests for the linguistic-integrity guarantees of the pipeline.

These tests are deliberately strict — if any of them fail, embeddings and
analytics downstream will be measuring a sanitized abstraction instead of
the actual manuscript. Run with:

    python -m unittest discover -s elasticsearch/tests -t .
"""

import hashlib
import unittest

from elasticsearch.pipelines import _common as C


CHICANO_SAMPLE = (
    "Órale, carnal — mira, ese, the LT said we’re moving on Khe Sanh at 0500. "
    "Don’t forget your rosary. Mi abuela said, “Cuídate, mijo.”"
)

DIALOGUE_SAMPLE = '"You okay?" he asked. "Sí," she said. — Estoy bien — añadió.'

SCENE_BREAKS = ["***", "###", "----", "= = =", "·······"]


class LinguisticIntegrityTests(unittest.TestCase):

    def test_text_is_not_mutated_by_dialogue_count(self):
        before = CHICANO_SAMPLE
        C.count_dialogue_chars(CHICANO_SAMPLE)
        self.assertEqual(before, CHICANO_SAMPLE)

    def test_text_is_not_mutated_by_spanish_ratio(self):
        before = CHICANO_SAMPLE
        C.spanish_token_ratio(CHICANO_SAMPLE)
        self.assertEqual(before, CHICANO_SAMPLE)

    def test_text_is_not_mutated_by_lexical_diversity(self):
        before = CHICANO_SAMPLE
        C.lexical_diversity(CHICANO_SAMPLE)
        self.assertEqual(before, CHICANO_SAMPLE)

    def test_text_hash_is_stable_and_collision_resistant(self):
        h = C.text_hash(CHICANO_SAMPLE)
        self.assertEqual(h, hashlib.sha256(CHICANO_SAMPLE.encode("utf-8")).hexdigest())
        modified = CHICANO_SAMPLE.replace("ese", "ESE")
        self.assertNotEqual(h, C.text_hash(modified))

    def test_curly_quotes_are_preserved_in_dialogue_detection(self):
        # The detector must FIND “smart quotes” without rewriting them.
        chars = C.count_dialogue_chars('“Cuídate, mijo.”')
        self.assertGreater(chars, 0)

    def test_spanish_signal_does_not_strip_accents(self):
        text = "El mijo está aquí."
        ratio, hits = C.spanish_token_ratio(text)
        self.assertGreater(hits, 0)
        self.assertEqual(text, "El mijo está aquí.")

    def test_em_dash_dialogue_counted(self):
        chars = C.count_dialogue_chars("— Estoy bien — añadió.")
        self.assertGreater(chars, 0)


class StructuralTests(unittest.TestCase):

    def test_chapter_heading_detection_arabic(self):
        is_chap, num, _ = C.is_chapter_heading("Chapter 12: The Weight of Names")
        self.assertTrue(is_chap)
        self.assertEqual(num, 12)

    def test_chapter_heading_detection_roman(self):
        is_chap, num, _ = C.is_chapter_heading("CHAPTER XIV")
        self.assertTrue(is_chap)
        self.assertEqual(num, 14)

    def test_chapter_heading_detection_spanish(self):
        is_chap, num, _ = C.is_chapter_heading("CAPÍTULO 3")
        self.assertTrue(is_chap)
        self.assertEqual(num, 3)

    def test_non_heading_paragraph_is_not_misidentified(self):
        # "Chapter and verse" must NOT match because "and" isn't a number.
        is_chap, num, _ = C.is_chapter_heading("Chapter and verse, the priest read.")
        self.assertFalse(is_chap)
        self.assertIsNone(num)
        # Defense in depth: parse_chapter_number rejects "and".
        self.assertIsNone(C.parse_chapter_number("and"))

    def test_scene_break_detection(self):
        for marker in SCENE_BREAKS[:3]:
            self.assertTrue(C.is_scene_break(marker), f"failed: {marker!r}")

    def test_scene_break_space_separated_asterisks(self):
        # The Ramos manuscript uses "* * *" with spaces — must be detected.
        self.assertTrue(C.is_scene_break("* * *"))
        self.assertTrue(C.is_scene_break("*  *  *"))
        self.assertTrue(C.is_scene_break("  * * *  "))

    def test_act_parsing_from_heading(self):
        self.assertEqual(C.parse_act_from_heading("Chapter 1: The Sacred Mountain (ACT I)"), "Act I")
        self.assertEqual(C.parse_act_from_heading("Chapter 19 Los Obligados   (ACT II)"), "Act II")
        self.assertEqual(C.parse_act_from_heading("Chapter 35: The Birthday Brief (ACT III)"), "Act III")
        self.assertIsNone(C.parse_act_from_heading("Chapter 20: THE GENESIS EQUATION"))

    def test_sentence_splitter_respects_ellipses(self):
        # Ellipses must NOT be mistaken for sentence-ending periods.
        s = "He paused... then said something. She nodded."
        parts = C.split_sentences(s)
        # The "..." sentence and the "She nodded." sentence stay intact.
        self.assertTrue(any("paused..." in p for p in parts), parts)
        self.assertTrue(any(p.startswith("She nodded") for p in parts), parts)
        # And the ellipsis text is preserved verbatim in the rejoined output.
        self.assertIn("...", " ".join(parts))

    def test_doc_id_is_deterministic(self):
        a = C.doc_id("manuscript.docx", 12, 47)
        b = C.doc_id("manuscript.docx", 12, 47)
        self.assertEqual(a, b)
        self.assertIn("ch012", a)
        self.assertIn("p00047", a)

    def test_pov_detector_returns_first_person_when_dominant(self):
        self.assertEqual(C.detect_pov("I walked. My boots crunched. I felt cold."), "first_person")

    def test_pov_detector_returns_third_when_dominant(self):
        self.assertEqual(
            C.detect_pov("He walked. His boots crunched. She watched him."),
            "third_person",
        )


class RomanNumeralTests(unittest.TestCase):

    def test_simple_roman(self):
        self.assertEqual(C.parse_chapter_number("XIV"), 14)
        self.assertEqual(C.parse_chapter_number("MCMXCIX"), 1999)

    def test_arabic(self):
        self.assertEqual(C.parse_chapter_number("43"), 43)

    def test_invalid(self):
        self.assertIsNone(C.parse_chapter_number("Z"))


if __name__ == "__main__":
    unittest.main()
