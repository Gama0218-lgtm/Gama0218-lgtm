/**
 * src/lib/chapterScores.js
 * Per-chapter Ω (audit quality) and CLS (chapter-level coherence) scores.
 *
 * Ω  — Audit Quality Score (RamosCanon §1.1). 0-10 scale, evidence-rigor weighted.
 * CLS — Chapter-Level Coherence Score. 0-10 scale, measures the rolling cohesion
 *        of arguments and pacing within a chapter (think: narrative throughline +
 *        evidence density / chapter length, normalized).
 *
 * The seed values below are deterministic so the trend chart is stable across
 * renders; in production they should be sourced from `ManuscriptAuditResult`.
 */

import { CANONICAL_CHAPTERS } from "./data";

// 3-act structure mapped to chapter ranges (front=Act I, body=Act II, back=Act III).
export const ACT_BANDS = [
  { id: "act1", label: "Act I — Setup",      from: 1,  to: 6,  color: "teal"   },
  { id: "act2", label: "Act II — Confront",  from: 7,  to: 39, color: "purple" },
  { id: "act3", label: "Act III — Resolve",  from: 40, to: 45, color: "gold"   },
];

// Deterministic per-chapter scores. Hand-tuned so dips line up with the act
// transitions (chapters 6→7 and 21→22 sag a bit; the climax around 33-35 picks
// back up; the back-matter is uneven, which the trend should reveal).
const RAW_SCORES = [
  // [chapterId, Ω, CLS] — tuned so pacing dips actually register against
  // the ≥ 1.5 pts threshold the trend chart uses for red markers.
  [1,  8.2, 8.0], [2,  7.9, 7.7], [3,  7.6, 7.4], [4,  7.7, 7.5],
  [5,  7.4, 7.2], [6,  7.0, 6.8],
  [7,  7.1, 6.9], [8,  6.7, 6.4], [9,  6.4, 6.0], [10, 5.0, 4.6], // Ch.10 — early sag, Case Study 1
  [11, 6.9, 6.6], [12, 7.2, 7.0], [13, 7.4, 7.2], [14, 7.0, 6.7],
  [15, 6.8, 6.5], [16, 7.3, 7.1], [17, 7.6, 7.3], [18, 6.9, 6.6],
  [19, 6.6, 6.3], [20, 6.3, 5.9], [21, 5.6, 5.2], [22, 4.8, 4.3], // Ch.22 — deepest dip, Part 2 Synthesis
  [23, 5.5, 5.1], [24, 6.2, 5.9], [25, 6.7, 6.4], [26, 7.0, 6.7],
  [27, 7.2, 6.9], [28, 7.3, 7.0], [29, 6.9, 6.6], [30, 6.7, 6.4],
  [31, 7.2, 7.0], [32, 7.5, 7.3], [33, 7.8, 7.6], [34, 8.0, 7.8],
  [35, 7.7, 7.5], [36, 7.0, 6.8], [37, 6.4, 6.1], [38, 5.2, 4.8], // Ch.38 — late Act II sag, Knowledge Transfer
  [39, 6.1, 5.7],
  [40, 7.0, 6.8], [41, 7.6, 7.4], [42, 7.2, 6.9], [43, 6.4, 6.1],
  [44, 5.8, 5.4], [45, 5.0, 4.5], // Ch.45 — back-matter slide, Appendix C
];

export const CHAPTER_SCORES = CANONICAL_CHAPTERS.map((ch) => {
  const row = RAW_SCORES.find((r) => r[0] === ch.id);
  return {
    id: ch.id,
    title: ch.title,
    type: ch.type,
    omega: row ? row[1] : null,
    cls:   row ? row[2] : null,
  };
});

export function meanOf(values) {
  const v = values.filter((x) => typeof x === "number");
  if (v.length === 0) return 0;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

export function actFor(chapterId) {
  return ACT_BANDS.find((a) => chapterId >= a.from && chapterId <= a.to) || null;
}

/**
 * Compute per-act summary (mean Ω, mean CLS, dip count) for the chart footer.
 * `dipThreshold` is in score-points below the global mean for that metric.
 */
export function actSummary(dipThreshold = 1.5) {
  const omegaMean = meanOf(CHAPTER_SCORES.map((c) => c.omega));
  const clsMean   = meanOf(CHAPTER_SCORES.map((c) => c.cls));
  return ACT_BANDS.map((act) => {
    const inAct = CHAPTER_SCORES.filter((c) => c.id >= act.from && c.id <= act.to);
    const omegaInAct = inAct.map((c) => c.omega);
    const clsInAct   = inAct.map((c) => c.cls);
    const omegaActMean = meanOf(omegaInAct);
    const clsActMean   = meanOf(clsInAct);
    const omegaDips = inAct.filter((c) => omegaMean - c.omega >= dipThreshold).length;
    const clsDips   = inAct.filter((c) => clsMean   - c.cls   >= dipThreshold).length;
    return {
      ...act,
      chapters: inAct.length,
      omegaMean: omegaActMean,
      clsMean:   clsActMean,
      omegaDips,
      clsDips,
      deltaOmega: omegaActMean - omegaMean,
      deltaCls:   clsActMean   - clsMean,
    };
  });
}

export function notableDips(dipThreshold = 1.5) {
  const omegaMean = meanOf(CHAPTER_SCORES.map((c) => c.omega));
  const clsMean   = meanOf(CHAPTER_SCORES.map((c) => c.cls));
  const out = [];
  for (const c of CHAPTER_SCORES) {
    if (c.omega != null && omegaMean - c.omega >= dipThreshold) {
      out.push({ chapter: c.id, title: c.title, metric: "omega", value: c.omega, drop: omegaMean - c.omega });
    }
    if (c.cls != null && clsMean - c.cls >= dipThreshold) {
      out.push({ chapter: c.id, title: c.title, metric: "cls",   value: c.cls,   drop: clsMean - c.cls });
    }
  }
  return out;
}

export const REFERENCE_MEANS = {
  get omega() { return meanOf(CHAPTER_SCORES.map((c) => c.omega)); },
  get cls()   { return meanOf(CHAPTER_SCORES.map((c) => c.cls)); },
};
