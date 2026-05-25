/**
 * src/components/GateZeroTab.jsx
 * Gate Zero: Normalization & Schema Integrity
 * Displays the three-gate program status and chapter inventory
 */

import React, { useState, useEffect } from "react";

export default function GateZeroTab({ auditData }) {
  const [gateStatus, setGateStatus] = useState({
    gate_zero: { passed: false, status: "pending" },
    gate_one: { passed: false, status: "pending" },
    gate_two: { passed: false, status: "pending" }
  });

  useEffect(() => {
    if (auditData) {
      setGateStatus((prev) => ({
        ...prev,
        gate_zero: { 
          passed: auditData.gate_zero_passed, 
          status: auditData.gate_zero_passed ? "passed" : "failed" 
        }
      }));
    }
  }, [auditData]);

  const gates = [
    {
      id: "gate_zero",
      name: "Gate Zero: Normalization",
      description: "Canonical 45-chapter inventory; schema integrity check; version freeze",
      status: gateStatus.gate_zero.status,
      requirements: [
        "Manuscript has exactly 45 canonical chapters",
        "No chapter schema drift detected",
        "ManuscriptVersion created and frozen",
        "Version hash verified (SHA-256)",
        "Version_id linked to AuditRun"
      ]
    },
    {
      id: "gate_one",
      name: "Gate One: Evidence Audit",
      description: "LLM audit with verbatim evidence_quotes[]; known-defect ledger; Ω recomputation",
      status: gateStatus.gate_one.status,
      requirements: [
        "Audit LLM run with v13 prompt",
        "Every finding includes evidence_quote[] with verbatim text",
        "Severity rubric applied consistently (1-10 scale)",
        "Known defects pre-computed (server-side)",
        "Ω (audit quality score) recalculated"
      ]
    },
    {
      id: "gate_two",
      name: "Gate Two: Revision & Acceptance",
      description: "Structured chapter revision; blinded reviewer test; Ω improvement verified",
      status: gateStatus.gate_two.status,
      requirements: [
        "Chapter revision prompt (task-driven, not vague)",
        "Remediation task assigned and completed",
        "Post-revision test executed and passed",
        "Blinded reviewer evaluation completed",
        "Ω improvement meets target delta"
      ]
    }
  ];

  const chaptersInfo = {
    total_canonical: 45,
    front_matter: 2,
    main_body: 40,
    back_matter: 3,
    epilogue: 1
  };

  return (
    <div className="gate-zero-tab">
      <h2>🚦 Three-Gate Quality Program</h2>

      <div className="gates-container">
        {gates.map((gate) => (
          <div key={gate.id} className={`gate-card gate-${gate.status}`}>
            <div className="gate-header">
              <h3>{gate.name}</h3>
              <span className={`status-badge ${gate.status}`}>
                {gate.status === "passed" ? "✓ PASSED" : gate.status === "failed" ? "✗ FAILED" : "⏳ PENDING"}
              </span>
            </div>
            <p className="gate-description">{gate.description}</p>
            <div className="requirements">
              <h4>Requirements:</h4>
              <ul>
                {gate.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="chapter-inventory">
        <h3>📚 Canonical Chapter Inventory</h3>
        <div className="inventory-stats">
          <div className="stat">
            <label>Total Canonical</label>
            <span className="value">{chaptersInfo.total_canonical}</span>
          </div>
          <div className="stat">
            <label>Front Matter</label>
            <span className="value">{chaptersInfo.front_matter}</span>
          </div>
          <div className="stat">
            <label>Main Body</label>
            <span className="value">{chaptersInfo.main_body}</span>
          </div>
          <div className="stat">
            <label>Back Matter</label>
            <span className="value">{chaptersInfo.back_matter}</span>
          </div>
          <div className="stat">
            <label>Epilogue (Non-Canonical)</label>
            <span className="value">{chaptersInfo.epilogue}</span>
          </div>
        </div>
      </div>

      <div className="gate-info">
        <h3>ℹ️ About the Three-Gate Program</h3>
        <p>
          LitCentral v13 enforces a three-gate quality progression that ensures manuscript integrity at every stage:
        </p>
        <ul>
          <li><strong>Gate Zero</strong> normalizes the 45-chapter canonical inventory, eliminating schema drift from earlier versions.</li>
          <li><strong>Gate One</strong> runs evidence-rigor audit with required verbatim quotes, severity classification, and quality scoring (Ω).</li>
          <li><strong>Gate Two</strong> coordinates task-driven revision with acceptance testing and blinded review validation.</li>
        </ul>
        <p>
          Only manuscripts that pass all three gates are publication-ready. The gates cannot be bypassed or reordered.
        </p>
      </div>
    </div>
  );
}
