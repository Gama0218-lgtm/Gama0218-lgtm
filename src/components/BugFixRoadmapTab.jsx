/**
 * src/components/BugFixRoadmapTab.jsx
 * Bug Fixes & Schema Corrections for v13
 */

import React from "react";

const BUG_FIXES = [
  {
    id: "BUGFIX-001",
    category: "Schema Normalization",
    title: "46-chapter drift eliminated (normalize to 45)",
    status: "✓ RESOLVED",
    impact: "CRITICAL",
    description: "v12 erroneously tracked 46 chapters; v13 canonical normalizes to 45 with epilogue tracked separately.",
    before: "46 mixed chapter states (inconsistent)",
    after: "45 canonical + 1 epilogue (enforced by Gate Zero)",
    relatedGate: "Gate Zero"
  },
  {
    id: "BUGFIX-002",
    category: "Audit Engine",
    title: "Evidence quotes requirement (was optional)",
    status: "✓ RESOLVED",
    impact: "HIGH",
    description: "v12 audits allowed findings without verbatim quotes; v13 requires evidence_quotes[] for every finding.",
    before: "Optional evidence (soft enforcement)",
    after: "Mandatory verbatim quotes (strict enforcement)",
    relatedGate: "Gate One"
  },
  {
    id: "BUGFIX-003",
    category: "Severity Rubric",
    title: "Ambiguous severity levels (now 1-10 rubric)",
    status: "✓ RESOLVED",
    impact: "HIGH",
    description: "v12 used vague levels (minor/major); v13 implements explicit 1-10 rubric with clear definitions.",
    before: "4 levels: negligible, minor, major, critical",
    after: "10 levels: 1 (negligible) through 10 (terminal)",
    relatedGate: "Gate One"
  },
  {
    id: "BUGFIX-004",
    category: "Version Control",
    title: "No version freezing (added ManuscriptVersion entity)",
    status: "✓ RESOLVED",
    impact: "MEDIUM",
    description: "v12 had no snapshot mechanism; v13 adds ManuscriptVersion with SHA-256 hashing and gate validation.",
    before: "No version tracking",
    after: "Frozen versions with hash verification and Gate Zero enforcement",
    relatedGate: "Gate Zero"
  },
  {
    id: "BUGFIX-005",
    category: "Revision Process",
    title: "Vague revision prompts (now task-driven)",
    status: "✓ RESOLVED",
    impact: "HIGH",
    description: "v12 prompts were generic ('strengthen prose'); v13 revision prompts name chapters, forecast Ω delta, and specify tests.",
    before: "Generic revision guidance",
    after: "Specific task-driven prompts with acceptance criteria",
    relatedGate: "Gate Two"
  }
];

export default function BugFixRoadmapTab({ manuscript }) {
  const resolvedCount = BUG_FIXES.filter(fix => fix.status.includes("RESOLVED")).length;

  return (
    <div className="bug-fix-roadmap-tab">
      <h2>🗺️ v13 Bug Fixes & Schema Corrections</h2>
      <p className="intro">
        LitCentral v13 resolves 5 critical schema drift issues and improves the audit/revision pipeline.
      </p>

      <div className="resolution-banner">
        <div className="banner-content">
          <h3>✓ v13 Improvement Status</h3>
          <p>
            All schema conflicts and platform inconsistencies from v12 have been resolved through Gate Zero normalization and
            the three-gate quality framework.
          </p>
          <div className="metrics">
            <div className="metric">
              <span className="label">Total Fixes</span>
              <span className="value">{BUG_FIXES.length}</span>
            </div>
            <div className="metric">
              <span className="label">Status</span>
              <span className="value">{resolvedCount}/{BUG_FIXES.length} RESOLVED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bug-fixes-grid">
        {BUG_FIXES.map((fix) => (
          <div key={fix.id} className={`bug-card status-resolved`}>
            <div className="bug-header">
              <div className="category-badge">{fix.category}</div>
              <span className={`impact-badge impact-${fix.impact.toLowerCase()}`}>{fix.impact}</span>
              <span className="status-badge">{fix.status}</span>
            </div>

            <h3>{fix.title}</h3>
            <p className="description">{fix.description}</p>

            <div className="comparison">
              <div className="before-after">
                <div className="section">
                  <label>❌ v12 (Before)</label>
                  <p>{fix.before}</p>
                </div>
                <div className="arrow">→</div>
                <div className="section">
                  <label>✓ v13 (After)</label>
                  <p>{fix.after}</p>
                </div>
              </div>
            </div>

            <div className="related-gate">
              <label>Related Gate:</label>
              <span className="gate-label">{fix.relatedGate}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="migration-info">
        <h3>📋 Migration Summary</h3>
        <ul>
          <li><strong>Gate Zero Enforcement:</strong> 45-chapter canonical normalization blocks all audits until schema is correct</li>
          <li><strong>Evidence Rigor:</strong> All audit findings now require verbatim quotes and severity classification</li>
          <li><strong>Version Control:</strong> Manual version freezing with SHA-256 hashes prevents audit drift</li>
          <li><strong>Task-Driven Revision:</strong> Revision prompts are specific, measurable, and include acceptance tests</li>
          <li><strong>API Integrations:</strong> Six external sources (Crossref, Open Library, Google Books, LoC, Semantic Scholar, TMDB)</li>
        </ul>
      </div>

      <div className="upgrade-notes">
        <h3>⚠️ Upgrade Notes</h3>
        <p>
          If upgrading from v12:
        </p>
        <ol>
          <li>Normalize all manuscripts to exactly 45 canonical chapters</li>
          <li>Re-run audits through Gate Zero to create frozen ManuscriptVersion records</li>
          <li>Audit findings will be re-generated with the v13 prompt requiring evidence_quotes[]</li>
          <li>Create new remediation tasks using the task-driven revision prompts</li>
          <li>Review manuscripts through all three gates before marking publication-ready</li>
        </ol>
      </div>
    </div>
  );
}
