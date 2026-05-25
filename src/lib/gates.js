/**
 * LitCentral v13 - Three-Gate Program
 * Enforces quality progression: Gate Zero (normalization) → Gate One (audit) → Gate Two (revision)
 */

export const GATES = {
  GATE_ZERO: {
    id: "gate_zero",
    name: "Gate Zero: Normalization",
    description: "Canonical 45-chapter inventory; schema integrity check; version freeze",
    status: "active",
    requirements: [
      "Manuscript has exactly 45 canonical chapters",
      "No chapter schema drift detected",
      "ManuscriptVersion created and frozen",
      "Version hash verified (SHA-256)",
      "Version_id linked to AuditRun"
    ],
    passes_when: {
      canonical_chapter_count: 45,
      schema_valid: true,
      version_frozen: true,
      gate_zero_passed: true
    },
    blocks_next: ["gate_one"],
    enforcement: "strict",
    owner: "platform"
  },

  GATE_ONE: {
    id: "gate_one",
    name: "Gate One: Audit & Evidence Rigor",
    description: "LLM audit with verbatim evidence_quotes[]; known-defect ledger; Ω recomputation",
    status: "active",
    requires_gates: ["gate_zero"],
    requirements: [
      "Audit LLM run with fresh prompt (v13)",
      "Every finding includes evidence_quote[] with verbatim text",
      "Severity rubric applied consistently (1-10 scale)",
      "Known defects pre-computed (server-side)",
      "Ω (audit quality score) recalculated",
      "No shortfalls in evidence completeness"
    ],
    audit_prompt_version: "13.0",
    severity_rubric: {
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
    },
    passes_when: {
      audit_complete: true,
      all_findings_have_quotes: true,
      severity_valid: true,
      omega_score: { min: 5.0 }
    },
    blocks_next: ["gate_two"],
    enforcement: "strict",
    owner: "audit_engine"
  },

  GATE_TWO: {
    id: "gate_two",
    name: "Gate Two: Revision & Acceptance Testing",
    description: "Structured chapter revision; blinded reviewer test; Ω improvement verified",
    status: "active",
    requires_gates: ["gate_zero", "gate_one"],
    requirements: [
      "Chapter revision prompt (task-driven, not vague)",
      "Remediation task assigned and completed",
      "Post-revision test executed and passed",
      "Blinded reviewer evaluation completed",
      "Ω improvement meets target delta",
      "No regressions in other chapters"
    ],
    revision_prompt_structure: {
      task_name: "specific chapter/issue",
      current_state: "current_omega_score",
      target_state: "target_omega_score",
      acceptance_criteria: "list[]",
      test_procedure: "post_revision_test",
      forecast_delta: "delta_omega_target"
    },
    passes_when: {
      revision_complete: true,
      post_revision_test_passed: true,
      omega_improved: true,
      omega_delta: { min: 0.3 },
      blinded_review_passed: true
    },
    blocks_next: [],
    enforcement: "graduated",
    owner: "revision_engine"
  }
};

export const GATE_TRANSITIONS = [
  {
    from: "gate_zero",
    to: "gate_one",
    condition: "gate_zero_passed === true",
    auto_advance: true
  },
  {
    from: "gate_one",
    to: "gate_two",
    condition: "all_findings_have_quotes && omega_score >= 5.0",
    auto_advance: true
  },
  {
    from: "gate_two",
    to: "publication_ready",
    condition: "omega_final >= 8.0 && no_regressions",
    auto_advance: false,
    requires_approval: "lead_reviewer"
  }
];

export const GOVERNANCE = {
  approval_chain: [
    { role: "methods_expert", gate: "gate_one" },
    { role: "domain_expert", gate: "gate_one" },
    { role: "lead_reviewer", gate: "gate_two" },
    { role: "publishing_committee", gate: "publication_ready" }
  ],
  escalation_rules: [
    {
      severity: "critical",
      assignee: "lead_reviewer",
      sla_hours: 4
    },
    {
      severity: "high",
      assignee: "domain_expert",
      sla_hours: 24
    },
    {
      severity: "moderate",
      assignee: "chapter_owner",
      sla_hours: 72
    }
  ],
  audit_interval_days: 7,
  revision_attempt_limit: 3,
  max_concurrent_revisions: 5
};

export const canAdvanceToGate = (currentGate, allPreviousGatesPassed) => {
  const gateOrder = ["gate_zero", "gate_one", "gate_two"];
  const currentIndex = gateOrder.indexOf(currentGate);
  
  if (currentIndex === 0) return true; // Gate Zero always first
  
  for (let i = 0; i < currentIndex; i++) {
    if (!allPreviousGatesPassed[gateOrder[i]]) {
      return false;
    }
  }
  return true;
};

export default {
  GATES,
  GATE_TRANSITIONS,
  GOVERNANCE,
  canAdvanceToGate
};
