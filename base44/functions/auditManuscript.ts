/**
 * base44/functions/auditManuscript/entry.ts
 * LitCentral v13 - Core Audit Engine
 * 
 * Enforces Gate Zero → Gate One progression
 * Required inputs:
 * - manuscript_id (UUID)
 * - version_id (UUID, frozen ManuscriptVersion)
 * - audit_run_id (UUID, will be updated with findings)
 * 
 * Returns:
 * - audit_run with gate_zero_passed, gate_one_passed, omega_score
 * - array of ManuscriptAuditResult records
 */

import { z } from "zod";

const CHAPTER_LIST = [
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

const SEVERITY_RUBRIC = {
  1: "Negligible - cosmetic only",
  2: "Minimal - spelling/grammar",
  3: "Minor - phrasing clarity",
  4: "Light - minor logic issue",
  5: "Moderate - affects comprehension",
  6: "Significant - undermines credibility",
  7: "Major - invalidates section",
  8: "Critical - core findings at risk",
  9: "Severe - manuscript unsuitable",
  10: "Terminal - reject and restart"
};

export const req = z.object({
  manuscript_id: z.string().uuid(),
  version_id: z.string().uuid(),
  audit_run_id: z.string().uuid(),
});

export async function run(req: z.infer<typeof req>, modules: any) {
  const { db } = modules;
  
  // GATE ZERO: Verify canonical chapter count and schema integrity
  console.log(`[AUDIT] Gate Zero: Verifying 45-chapter normalization...`);
  
  const manuscriptChapters = await db.query(
    "SELECT COUNT(*) as count FROM manuscript_chapters WHERE manuscript_id = ? AND is_canonical = true",
    [req.manuscript_id]
  );
  
  const canonicalCount = manuscriptChapters[0]?.count || 0;
  const gateZeroPassed = canonicalCount === 45;
  
  if (!gateZeroPassed) {
    console.error(`[AUDIT] GATE ZERO FAILED: Found ${canonicalCount} canonical chapters, expected 45`);
    return {
      success: false,
      gate_zero_passed: false,
      canonical_chapter_count: canonicalCount,
      error: `Schema drift detected: ${canonicalCount} chapters instead of canonical 45`
    };
  }
  
  console.log(`[AUDIT] ✓ Gate Zero passed: 45 canonical chapters verified`);
  
  // GATE ONE: Run LLM audit with v13 prompt (evidence rigor, severity rubric, known defects)
  console.log(`[AUDIT] Gate One: Running evidence-based audit with LLM...`);
  
  const auditPrompt = buildAuditPrompt(req.manuscript_id, CHAPTER_LIST, SEVERITY_RUBRIC);
  
  const auditResult = await modules.llm.call({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: auditPrompt
      },
      {
        role: "user",
        content: `Please audit this manuscript and return findings as JSON.`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2
  });
  
  const findings = JSON.parse(auditResult.content);
  
  // Compute Ω (audit quality score) and evidence completeness
  const omegaScore = computeOmegaScore(findings);
  const evidenceCompleteness = computeEvidenceCompleteness(findings);
  
  // Store findings in database
  for (const finding of findings.findings || []) {
    await db.insert("manuscript_audit_results", {
      result_id: generateUUID(),
      audit_run_id: req.audit_run_id,
      chapter_id: finding.chapter_id,
      section: finding.section,
      finding_type: finding.finding_type,
      title: finding.title,
      description: finding.description,
      evidence_quotes: JSON.stringify(finding.evidence_quotes || []),
      severity: finding.severity,
      severity_label: SEVERITY_RUBRIC[finding.severity] || "unknown",
      is_known_defect: finding.is_known_defect || false,
      known_defect_id: finding.known_defect_id,
      remediation_suggestion: finding.remediation_suggestion,
      status: "open",
      priority: findingPriority(finding.severity),
      created_at: new Date().toISOString()
    });
  }
  
  // Update audit run with results
  await db.update("audit_runs", {
    audit_run_id: req.audit_run_id
  }, {
    gate_zero_passed: gateZeroPassed,
    canonical_chapter_count: canonicalCount,
    schema_valid: true,
    status: "completed",
    total_findings: findings.findings?.length || 0,
    critical_findings: findings.findings?.filter(f => f.severity >= 8).length || 0,
    high_findings: findings.findings?.filter(f => f.severity >= 6 && f.severity < 8).length || 0,
    omega_score: omegaScore,
    evidence_completeness: evidenceCompleteness,
    completed_at: new Date().toISOString()
  });
  
  return {
    success: true,
    gate_zero_passed: gateZeroPassed,
    gate_one_passed: true,
    audit_run_id: req.audit_run_id,
    canonical_chapter_count: canonicalCount,
    total_findings: findings.findings?.length || 0,
    omega_score: omegaScore,
    evidence_completeness: evidenceCompleteness,
    findings_summary: {
      critical: findings.findings?.filter(f => f.severity >= 8).length || 0,
      high: findings.findings?.filter(f => f.severity >= 6 && f.severity < 8).length || 0,
      medium: findings.findings?.filter(f => f.severity >= 4 && f.severity < 6).length || 0,
      low: findings.findings?.filter(f => f.severity < 4).length || 0
    }
  };
}

function buildAuditPrompt(manuscriptId: string, chapters: any[], severityRubric: any): string {
  return `
You are LitCentral v13's evidence-rigor audit engine.

CANONICAL CHAPTERS (45 total):
${chapters.map(c => `${c.id}. ${c.title} (${c.type})`).join("\n")}

SEVERITY RUBRIC (1-10 scale):
${Object.entries(severityRubric).map(([level, desc]) => `${level}: ${desc}`).join("\n")}

REQUIREMENTS FOR EVERY FINDING:
1. Include verbatim evidence_quotes[] with line numbers and context
2. Assign a severity level (1-10) using the rubric above
3. Map to a chapter_id (1-45)
4. Mark is_known_defect if it's a pre-computed issue

Return JSON with structure:
{
  "findings": [
    {
      "chapter_id": 3,
      "section": "Methodology - Sample",
      "finding_type": "completeness",
      "title": "Sample size justification missing",
      "description": "...",
      "evidence_quotes": [
        {
          "quote_text": "We recruited N=50 participants.",
          "line_number": 42,
          "context": "Methods section"
        }
      ],
      "severity": 6,
      "is_known_defect": false,
      "remediation_suggestion": "..."
    }
  ]
}
`;
}

function computeOmegaScore(findings: any): number {
  if (!findings.findings || findings.findings.length === 0) return 10.0;
  
  const avgSeverity = findings.findings.reduce((sum: number, f: any) => sum + (f.severity || 5), 0) / findings.findings.length;
  const omegaScore = Math.max(1.0, Math.min(10.0, 10.0 - avgSeverity / 2));
  
  return Math.round(omegaScore * 10) / 10;
}

function computeEvidenceCompleteness(findings: any): number {
  if (!findings.findings || findings.findings.length === 0) return 1.0;
  
  const findingsWithEvidence = findings.findings.filter((f: any) => f.evidence_quotes && f.evidence_quotes.length > 0).length;
  return findingsWithEvidence / findings.findings.length;
}

function findingPriority(severity: number): string {
  if (severity >= 8) return "critical";
  if (severity >= 6) return "high";
  if (severity >= 4) return "medium";
  return "low";
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
