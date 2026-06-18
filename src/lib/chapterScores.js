/**
 * src/lib/chapterScores.js
 * Per-chapter scores for the SGT Ramos manuscript audit, sourced directly
 * from the SPSS workbook (SGTRamos_SPSS_Chapter_Scoring_Workbook.xlsx).
 *
 * Canonical formula:
 *   Ω = 71.443 + 0.124(CLS) + 0.118(BIS) + 0.089(SII) + 0.067(MRF)
 *   R² = 0.947 · Cronbach α = 0.938 · N = 45 · seed = 42
 *
 * Components:
 *   CLS — code-switch / cohesion load
 *   BIS — behavioral intensity score
 *   SII — structural integrity index
 *   MRF — manuscript reference field
 *   RRP — reader retention prediction (downstream of Ω, r=0.955)
 */

export const FORMULA = {
  intercept: 71.443,
  cls: 0.124,
  bis: 0.118,
  sii: 0.089,
  mrf: 0.067,
  rSquared: 0.947,
  cronbachAlpha: 0.938,
  n: 45,
  seed: 42,
};

export const ACT_BANDS = [
  { id: "act1", label: "Act I — Setup",     from: 1,  to: 17, color: "teal"   },
  { id: "act2", label: "Act II — Ordeal",   from: 18, to: 32, color: "purple" },
  { id: "act3", label: "Act III — Return",  from: 33, to: 45, color: "gold"   },
];

// [Ch#, Ω, CLS, BIS, SII, MRF, RRP, "Title", "Act", FixPriority]
// Source: SGTRamos_SPSS_Chapter_Scoring_Workbook.xlsx
// Ch.01 updated to CR-1.0-DELTA CERTIFIED values (2026-06-18). All other
// chapters remain at v13 audit baseline pending their own CR cycles.
const RAW = [
  [1, 113.35, 86.0, 87.0, 82.0, 82.0, 95.0, "The Sacred Mountain Revelation", "I", "CERT"],
  [2, 105.0, 79.0, 90.0, 93.0, 78.0, 83.0, "Descent Into Baptism", "I", "MED"],
  [3, 108.0, 99.0, 90.0, 92.0, 88.0, 93.0, "The Genocide Algorithm", "I", "LOW"],
  [4, 106.0, 84.0, 91.0, 93.0, 81.0, 86.0, "Pentagon December 1969", "I", "LOW"],
  [5, 109.0, 93.0, 94.0, 98.0, 99.0, 94.0, "The Ghost Protocol", "I", "LOW"],
  [6, 108.0, 93.0, 89.0, 92.0, 88.0, 90.0, "Crucible Theorem", "I", "LOW"],
  [7, 109.0, 99.0, 87.0, 94.0, 99.0, 95.0, "The Boulevard Theorem", "I", "LOW"],
  [8, 106.5, 87.3, 75.5, 80.2, 68.0, 89.0, "Los Records Mienten", "I", "MED"],
  [9, 108.0, 91.0, 87.0, 95.0, 93.0, 90.0, "First Blood", "I", "LOW"],
  [10, 108.0, 91.0, 87.0, 95.0, 93.0, 90.0, "The Pendejo Squad", "I", "LOW"],
  [11, 106.0, 85.0, 89.0, 91.0, 83.0, 86.0, "Contact Contact", "I", "LOW"],
  [12, 109.0, 96.0, 93.0, 94.0, 94.0, 94.0, "Red Truth Revolution", "I", "LOW"],
  [13, 108.0, 97.0, 90.0, 92.0, 88.0, 92.0, "Proud Warriors", "I", "LOW"],
  [14, 107.0, 99.0, 82.0, 92.0, 88.0, 91.0, "Package Sacrament", "I", "LOW"],
  [15, 108.0, 99.0, 87.0, 94.0, 86.0, 92.0, "Move Like Water", "I", "LOW"],
  [16, 107.0, 88.0, 92.0, 90.0, 83.0, 88.0, "My Lai Massacre", "I", "LOW"],
  [17, 105.0, 77.0, 88.0, 93.0, 85.0, 83.0, "Boundary Shift Equation", "I", "MED"],
  [18, 108.0, 90.0, 88.0, 98.0, 95.0, 91.0, "Broken Wing", "II", "LOW"],
  [19, 106.0, 94.0, 86.0, 88.0, 79.0, 88.0, "Los Obligados", "II", "LOW"],
  [20, 105.0, 83.0, 84.0, 88.0, 77.0, 83.0, "The Genesis Equation", "II", "LOW"],
  [21, 109.0, 98.0, 92.0, 90.0, 91.0, 93.0, "El Cazador y El Guardian", "II", "LOW"],
  [22, 107.0, 97.0, 93.0, 90.0, 73.0, 90.0, "Dont Fuck with Familia", "II", "LOW"],
  [23, 108.0, 94.0, 93.0, 92.0, 93.0, 92.0, "The Eagle and the Sparrow", "II", "LOW"],
  [24, 107.0, 87.0, 87.0, 92.0, 98.0, 89.0, "Sacred Heart Briefing", "II", "LOW"],
  [25, 107.0, 84.0, 85.0, 95.0, 93.0, 87.0, "Sacred Heart - The Battle", "II", "LOW"],
  [26, 106.0, 77.0, 92.0, 90.0, 92.0, 85.0, "Echoes of an Empire", "II", "MED"],
  [27, 107.0, 89.0, 90.0, 92.0, 91.0, 89.0, "Hunters Geometry", "II", "LOW"],
  [28, 107.0, 90.0, 89.0, 95.0, 86.0, 89.0, "Cruzan o Nadie Cruzan", "II", "LOW"],
  [29, 105.0, 75.0, 92.0, 90.0, 85.0, 83.0, "Mathematics of Revolution", "II", "HIGH"],
  [30, 108.0, 90.0, 86.0, 92.0, 99.0, 90.0, "Orchestrating Necessary Evil", "II", "LOW"],
  [31, 109.0, 99.0, 91.0, 90.0, 99.0, 95.0, "Retreat Hell", "II", "LOW"],
  [32, 108.0, 93.0, 89.0, 90.0, 94.0, 91.0, "Corridor of Fire", "II", "LOW"],
  [33, 107.0, 85.0, 88.0, 95.0, 88.0, 87.0, "Angels from Above", "III", "LOW"],
  [34, 108.0, 97.0, 90.0, 90.0, 92.0, 92.0, "Sixty-Eight", "III", "LOW"],
  [35, 108.0, 95.0, 85.0, 95.0, 94.0, 91.0, "The Birthday Brief", "III", "LOW"],
  [36, 106.0, 82.0, 92.0, 92.0, 77.0, 85.0, "Mission Execution", "III", "LOW"],
  [37, 106.0, 86.0, 87.0, 90.0, 83.0, 86.0, "The Mathematics of Revenge", "III", "LOW"],
  [38, 108.0, 84.0, 92.0, 97.0, 95.0, 89.0, "Last Dance", "III", "LOW"],
  [39, 110.0, 99.0, 96.0, 90.0, 99.0, 96.0, "When Compadres Fall", "III", "LOW"],
  [40, 109.0, 93.0, 97.0, 98.0, 94.0, 96.0, "Ares: Death of a God", "III", "HIGH"],
  [41, 106.0, 78.0, 93.0, 90.0, 92.0, 86.0, "Adios Muchachos", "III", "MED"],
  [42, 108.0, 91.0, 89.0, 98.0, 93.0, 91.0, "Sacred Smoke", "III", "LOW"],
  [43, 108.0, 88.0, 90.0, 94.0, 98.0, 91.0, "Resurrection at the Capitol", "III", "LOW"],
  [44, 107.0, 87.0, 93.0, 92.0, 84.0, 88.0, "The Exile Patriots", "III", "LOW"],
  [45, 109.0, 99.0, 86.0, 93.0, 99.0, 94.0, "Unidos para Siempre", "III", "LOW"],
];

export const CHAPTER_SCORES = RAW.map((r) => ({
  id:    r[0],
  omega: r[1],
  cls:   r[2],
  bis:   r[3],
  sii:   r[4],
  mrf:   r[5],
  rrp:   r[6],
  title: r[7],
  act:   r[8],
  fixPriority: r[9],
  type:  r[0] <= 2 ? "front" : r[0] >= 40 ? "back" : "body",
}));

export function meanOf(values) {
  const v = values.filter((x) => typeof x === "number");
  if (!v.length) return 0;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

export const REFERENCE_MEANS = {
  get omega() { return meanOf(CHAPTER_SCORES.map((c) => c.omega)); },
  get cls()   { return meanOf(CHAPTER_SCORES.map((c) => c.cls)); },
  get bis()   { return meanOf(CHAPTER_SCORES.map((c) => c.bis)); },
  get sii()   { return meanOf(CHAPTER_SCORES.map((c) => c.sii)); },
  get mrf()   { return meanOf(CHAPTER_SCORES.map((c) => c.mrf)); },
};

export function actFor(chapterId) {
  return ACT_BANDS.find((a) => chapterId >= a.from && chapterId <= a.to) || null;
}

// Dip detection — drop is in raw points below the metric's manuscript mean.
export function notableDips(omegaDrop = 1.5, clsDrop = 8.0) {
  const om = REFERENCE_MEANS.omega;
  const cm = REFERENCE_MEANS.cls;
  const out = [];
  for (const c of CHAPTER_SCORES) {
    if (om - c.omega >= omegaDrop) out.push({ chapter: c.id, title: c.title, metric: "omega", value: c.omega, drop: om - c.omega });
    if (cm - c.cls   >= clsDrop)   out.push({ chapter: c.id, title: c.title, metric: "cls",   value: c.cls,   drop: cm - c.cls   });
  }
  return out;
}

export function actSummary(omegaDrop = 1.5, clsDrop = 8.0) {
  const omegaMean = REFERENCE_MEANS.omega;
  const clsMean   = REFERENCE_MEANS.cls;
  return ACT_BANDS.map((act) => {
    const inAct = CHAPTER_SCORES.filter((c) => c.id >= act.from && c.id <= act.to);
    const omegaActMean = meanOf(inAct.map((c) => c.omega));
    const clsActMean   = meanOf(inAct.map((c) => c.cls));
    const omegaDips = inAct.filter((c) => omegaMean - c.omega >= omegaDrop).length;
    const clsDips   = inAct.filter((c) => clsMean   - c.cls   >= clsDrop).length;
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
