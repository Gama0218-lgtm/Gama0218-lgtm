/**
 * LitCentral v13 - Remediation Tasks
 * Per-chapter work orders drawn from audit findings and revision directives
 * Organized by Sprint (1-4) with priority levels and acceptance criteria
 */

export const REMEDIATION_TASKS = [
  // Sprint 1: Front Matter & Foundational Chapters
  {
    id: "REMED-001",
    chapter_id: 1,
    chapter_name: "Introduction",
    sprint: 1,
    priority: "high",
    owner: "lead_reviewer",
    title: "Clarify thesis statement and scope",
    description: "Strengthen opening paragraph; define key terms; set expectations for reader",
    delta_omega_target: 8.5,
    acceptance_criteria: [
      "Thesis explicitly stated in opening",
      "Key definitions provided",
      "Scope boundaries clear",
      "Reader expectations set"
    ],
    post_revision_test: "Peer review confirms clarity",
    created_at: "2026-05-20T10:00:00Z"
  },
  {
    id: "REMED-002",
    chapter_id: 2,
    chapter_name: "Background",
    sprint: 1,
    priority: "high",
    owner: "domain_expert",
    title: "Expand context; cite foundational works",
    description: "Add missing citations; deepen historical context; link to established frameworks",
    delta_omega_target: 7.8,
    acceptance_criteria: [
      "Minimum 5 new citations added",
      "Historical timeline clear",
      "Connection to frameworks explicit"
    ],
    post_revision_test: "Citation check; framework validation",
    created_at: "2026-05-20T10:15:00Z"
  },
  {
    id: "REMED-003",
    chapter_id: 3,
    chapter_name: "Methodology",
    sprint: 1,
    priority: "critical",
    owner: "methods_expert",
    title: "Detail research design and validity threats",
    description: "Specify sample size; justify design choice; identify and address validity threats",
    delta_omega_target: 9.2,
    acceptance_criteria: [
      "Sample size rationale provided",
      "Design justified vs. alternatives",
      "Threats to validity identified",
      "Mitigation strategies stated"
    ],
    post_revision_test: "Methodology peer review",
    created_at: "2026-05-20T10:30:00Z"
  },
  {
    id: "REMED-004",
    chapter_id: 4,
    chapter_name: "Theory Framework",
    sprint: 1,
    priority: "high",
    owner: "theory_lead",
    title: "Operationalize core constructs",
    description: "Define measurement; specify hypotheses; diagram relationships",
    delta_omega_target: 8.9,
    acceptance_criteria: [
      "Constructs operationalized",
      "Hypotheses stated formally",
      "Relationships diagrammed",
      "Connection to methodology clear"
    ],
    post_revision_test: "Theory validation workshop",
    created_at: "2026-05-20T10:45:00Z"
  },

  // Sprint 2: Literature & Analysis Chapters
  {
    id: "REMED-005",
    chapter_id: 5,
    chapter_name: "Literature Review",
    sprint: 2,
    priority: "high",
    owner: "literature_lead",
    title: "Synthesize findings; identify gaps",
    description: "Organize by theme; compare approaches; highlight novel contributions",
    delta_omega_target: 8.3,
    acceptance_criteria: [
      "Thematic organization clear",
      "Comparison matrix provided",
      "Research gaps identified",
      "Positioning statement explicit"
    ],
    post_revision_test: "Literature synthesis validation",
    created_at: "2026-05-21T09:00:00Z"
  },
  {
    id: "REMED-006",
    chapter_id: 7,
    chapter_name: "Analysis Part 1",
    sprint: 2,
    priority: "critical",
    owner: "analysis_lead",
    title: "Strengthen quantitative rigor",
    description: "Add effect sizes; report confidence intervals; explain findings",
    delta_omega_target: 9.0,
    acceptance_criteria: [
      "All statistics reported",
      "CIs or error bars included",
      "Effect sizes calculated",
      "Assumptions tested"
    ],
    post_revision_test: "Statistical review",
    created_at: "2026-05-21T09:30:00Z"
  },
  {
    id: "REMED-007",
    chapter_id: 10,
    chapter_name: "Case Study 1",
    sprint: 2,
    priority: "medium",
    owner: "case_analyst",
    title: "Deepen contextual detail and evidence",
    description: "Add primary source quotes; include archival references; extend narrative",
    delta_omega_target: 7.5,
    acceptance_criteria: [
      "Minimum 3 primary sources cited",
      "Contextual detail rich",
      "Narrative flow smooth"
    ],
    post_revision_test: "Case validation against primary sources",
    created_at: "2026-05-21T10:00:00Z"
  },

  // Sprint 3: Synthesis & Discussion
  {
    id: "REMED-008",
    chapter_id: 13,
    chapter_name: "Findings Part 1",
    sprint: 3,
    priority: "critical",
    owner: "findings_lead",
    title: "Clearly state findings with evidence",
    description: "Use BLINDED_QUOTE format; provide verbatim evidence; link to hypotheses",
    delta_omega_target: 9.1,
    acceptance_criteria: [
      "Each finding has evidence_quote[]",
      "Quotes verbatim and attributed",
      "Link to hypothesis clear",
      "Implications stated"
    ],
    post_revision_test: "Evidence-quote audit",
    created_at: "2026-05-22T09:00:00Z"
  },
  {
    id: "REMED-009",
    chapter_id: 16,
    chapter_name: "Discussion Part 1",
    sprint: 3,
    priority: "high",
    owner: "discussion_lead",
    title: "Interpret findings; compare to prior work",
    description: "Situate in literature; address contradictions; propose mechanisms",
    delta_omega_target: 8.4,
    acceptance_criteria: [
      "Findings interpreted vs. hypotheses",
      "Comparison to prior work explicit",
      "Contradictions addressed",
      "Mechanisms proposed"
    ],
    post_revision_test: "Discussion workshop",
    created_at: "2026-05-22T09:30:00Z"
  },
  {
    id: "REMED-010",
    chapter_id: 18,
    chapter_name: "Limitations",
    sprint: 3,
    priority: "high",
    owner: "methods_expert",
    title: "Explicitly state scope limits and biases",
    description: "Generalizability; sample bias; measurement error; future work needed",
    delta_omega_target: 8.0,
    acceptance_criteria: [
      "Generalizability limits stated",
      "Bias sources identified",
      "Impact on conclusions clear",
      "Future research directions given"
    ],
    post_revision_test: "Limitations peer review",
    created_at: "2026-05-22T10:00:00Z"
  },

  // Sprint 4: Conclusion & Dissemination
  {
    id: "REMED-011",
    chapter_id: 40,
    chapter_name: "Conclusion Part 1",
    sprint: 4,
    priority: "high",
    owner: "lead_reviewer",
    title: "Synthesize key findings; state impact",
    description: "Recap main results; articulate contribution; suggest next steps",
    delta_omega_target: 8.6,
    acceptance_criteria: [
      "Main findings recapped",
      "Contribution to field clear",
      "Practical implications stated",
      "Future directions suggested"
    ],
    post_revision_test: "Conclusion readthrough",
    created_at: "2026-05-23T09:00:00Z"
  },
  {
    id: "REMED-012",
    chapter_id: 42,
    chapter_name: "References",
    sprint: 4,
    priority: "medium",
    owner: "citation_manager",
    title: "Verify all references and citations",
    description: "Cross-check in-text citations; format consistency; completeness",
    delta_omega_target: 7.2,
    acceptance_criteria: [
      "All cited works in reference list",
      "Format consistent",
      "DOI links verified",
      "No orphaned citations"
    ],
    post_revision_test: "Reference audit",
    created_at: "2026-05-23T09:30:00Z"
  },
  {
    id: "REMED-013",
    chapter_id: 39,
    chapter_name: "Dissemination Strategy",
    sprint: 4,
    priority: "medium",
    owner: "communications",
    title: "Plan publication and outreach",
    description: "Target venues; lay summary; media strategy",
    delta_omega_target: 7.0,
    acceptance_criteria: [
      "Target journals identified",
      "Lay summary drafted",
      "Stakeholder list created",
      "Outreach timeline set"
    ],
    post_revision_test: "Dissemination plan review",
    created_at: "2026-05-23T10:00:00Z"
  },
  {
    id: "REMED-014",
    chapter_id: 41,
    chapter_name: "Conclusion Part 2",
    sprint: 4,
    priority: "medium",
    owner: "lead_reviewer",
    title: "Broaden implications; invite engagement",
    description: "Societal impact; cross-disciplinary relevance; call to action",
    delta_omega_target: 7.8,
    acceptance_criteria: [
      "Broader implications stated",
      "Interdisciplinary connections made",
      "Audience engagement invitation",
      "Call to action clear"
    ],
    post_revision_test: "Implications review",
    created_at: "2026-05-23T10:30:00Z"
  }
];

export const getRemediationTasksByChapter = (chapterId) => {
  return REMEDIATION_TASKS.filter(t => t.chapter_id === chapterId);
};

export const getRemediationTasksBySprint = (sprint) => {
  return REMEDIATION_TASKS.filter(t => t.sprint === sprint);
};

export const getHighPriorityTasks = () => {
  return REMEDIATION_TASKS.filter(t => t.priority === "critical" || t.priority === "high");
};

export default {
  REMEDIATION_TASKS,
  getRemediationTasksByChapter,
  getRemediationTasksBySprint,
  getHighPriorityTasks
};
