/**
 * LitCentral v13 - Core Data Definitions
 * Gate Zero: Canonical 45-chapter normalization
 * Eliminates the 46-chapter schema drift from earlier versions
 */

export const CANONICAL_CHAPTER_COUNT = 45;

export const CANONICAL_CHAPTERS = [
  { id: 1, title: "Introduction", type: "front", is_canonical: true },
  { id: 2, title: "Background", type: "front", is_canonical: true },
  { id: 3, title: "Methodology", type: "body", is_canonical: true },
  { id: 4, title: "Theory Framework", type: "body", is_canonical: true },
  { id: 5, title: "Literature Review", type: "body", is_canonical: true },
  { id: 6, title: "Prior Work", type: "body", is_canonical: true },
  { id: 7, title: "Analysis Part 1", type: "body", is_canonical: true },
  { id: 8, title: "Analysis Part 2", type: "body", is_canonical: true },
  { id: 9, title: "Analysis Part 3", type: "body", is_canonical: true },
  { id: 10, title: "Case Study 1", type: "body", is_canonical: true },
  { id: 11, title: "Case Study 2", type: "body", is_canonical: true },
  { id: 12, title: "Case Study 3", type: "body", is_canonical: true },
  { id: 13, title: "Findings Part 1", type: "body", is_canonical: true },
  { id: 14, title: "Findings Part 2", type: "body", is_canonical: true },
  { id: 15, title: "Implications", type: "body", is_canonical: true },
  { id: 16, title: "Discussion Part 1", type: "body", is_canonical: true },
  { id: 17, title: "Discussion Part 2", type: "body", is_canonical: true },
  { id: 18, title: "Limitations", type: "body", is_canonical: true },
  { id: 19, title: "Future Research", type: "body", is_canonical: true },
  { id: 20, title: "Recommendations", type: "body", is_canonical: true },
  { id: 21, title: "Part 1 Synthesis", type: "body", is_canonical: true },
  { id: 22, title: "Part 2 Synthesis", type: "body", is_canonical: true },
  { id: 23, title: "Comparative Analysis", type: "body", is_canonical: true },
  { id: 24, title: "Evidence Integration", type: "body", is_canonical: true },
  { id: 25, title: "Thematic Review", type: "body", is_canonical: true },
  { id: 26, title: "Contextual Analysis", type: "body", is_canonical: true },
  { id: 27, title: "Stakeholder Perspectives", type: "body", is_canonical: true },
  { id: 28, title: "Implementation Strategy", type: "body", is_canonical: true },
  { id: 29, title: "Risk Assessment", type: "body", is_canonical: true },
  { id: 30, title: "Resource Planning", type: "body", is_canonical: true },
  { id: 31, title: "Timeline & Milestones", type: "body", is_canonical: true },
  { id: 32, title: "Quality Metrics", type: "body", is_canonical: true },
  { id: 33, title: "Monitoring Framework", type: "body", is_canonical: true },
  { id: 34, title: "Adaptation Mechanisms", type: "body", is_canonical: true },
  { id: 35, title: "Scaling Considerations", type: "body", is_canonical: true },
  { id: 36, title: "Integration Points", type: "body", is_canonical: true },
  { id: 37, title: "Sustainability Plan", type: "body", is_canonical: true },
  { id: 38, title: "Knowledge Transfer", type: "body", is_canonical: true },
  { id: 39, title: "Dissemination Strategy", type: "body", is_canonical: true },
  { id: 40, title: "Conclusion Part 1", type: "back", is_canonical: true },
  { id: 41, title: "Conclusion Part 2", type: "back", is_canonical: true },
  { id: 42, title: "References", type: "back", is_canonical: true },
  { id: 43, title: "Appendix A", type: "back", is_canonical: true },
  { id: 44, title: "Appendix B", type: "back", is_canonical: true },
  { id: 45, title: "Appendix C", type: "back", is_canonical: true }
];

export const EPILOGUE_ADDENDA = [
  { id: 46, title: "Additional Materials", type: "supplemental", is_canonical: false }
];

export const STATS = {
  TOTAL_CANONICAL: CANONICAL_CHAPTER_COUNT,
  FRONT_MATTER: 2,
  MAIN_BODY: 40,
  BACK_MATTER: 3,
  EPILOGUE: 1,
  VERSION: "13.0.0",
  GATE_ZERO_ENFORCED: true,
  SCHEMA_DRIFT_RESOLVED: true
};

export default {
  CANONICAL_CHAPTER_COUNT,
  CANONICAL_CHAPTERS,
  EPILOGUE_ADDENDA,
  STATS
};
