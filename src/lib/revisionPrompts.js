/**
 * LitCentral v13 - Revision Prompts
 * Task-driven revision instructions with clear acceptance criteria and post-revision tests
 * Replaces vague "strengthen the prose" briefs with accountability-driven structure
 */

export const buildRevisionPrompt = (remediationTask, currentOmega, chapter) => {
  return `
LITCENTRAL v13 — CHAPTER REVISION TASK

════════════════════════════════════════════════════════════════

CHAPTER: ${chapter.id}. ${chapter.title}
CURRENT OMEGA SCORE: ${currentOmega}/10
TARGET OMEGA SCORE: ${remediationTask.delta_omega_target}/10
TARGET IMPROVEMENT: +${(remediationTask.delta_omega_target - currentOmega).toFixed(1)} points

════════════════════════════════════════════════════════════════

TASK NAME:
${remediationTask.title}

DESCRIPTION:
${remediationTask.description}

════════════════════════════════════════════════════════════════

PRIORITY: ${remediationTask.priority.toUpperCase()}
SPRINT: ${remediationTask.sprint}
OWNER: ${remediationTask.owner}
DEADLINE: ${new Date(remediationTask.created_at).toLocaleDateString()}

════════════════════════════════════════════════════════════════

ACCEPTANCE CRITERIA (all must be satisfied):

${remediationTask.acceptance_criteria.map((criterion, i) => 
  `  ${i + 1}. ☐ ${criterion}`
).join('\n')}

════════════════════════════════════════════════════════════════

POST-REVISION TEST:

${remediationTask.post_revision_test}

Your revision will be evaluated by a blinded reviewer using this test.
Success requires passing this specific test procedure.

════════════════════════════════════════════════════════════════

REVISION GUIDELINES:

• Make precise, evidence-backed changes addressing the gaps identified in the audit
• Quote verbatim text from audit findings if you revise them
• Track which acceptance criteria each change satisfies
• Avoid scope creep — focus only on the task-defined improvements
• Maintain voice and style consistency with the rest of the manuscript
• Do not introduce new unverified claims

════════════════════════════════════════════════════════════════

DELIVERABLE FORMAT:

Submit your revision with:
  1. Revised chapter text (full)
  2. Change log (line-by-line edits with rationale)
  3. Acceptance criteria checklist (mark each ✓ or ✗)
  4. Self-assessment against post-revision test

════════════════════════════════════════════════════════════════
`;
};

export const buildBlindedReviewerPrompt = (chapter, remediationTask, originalOmega, revisionText) => {
  return `
LITCENTRAL v13 — BLINDED POST-REVISION REVIEW

════════════════════════════════════════════════════════════════

CHAPTER: ${chapter.id}. ${chapter.title}
ORIGINAL OMEGA: ${originalOmega}/10
TARGET OMEGA: ${remediationTask.delta_omega_target}/10

YOU ARE: Independent blinded reviewer (do not see author identity, audit history, or revision prompt)

════════════════════════════════════════════════════════════════

TASK: Evaluate the revised chapter against this acceptance test:

${remediationTask.post_revision_test}

════════════════════════════════════════════════════════════════

REVISION TEXT:

[Chapter text provided separately to reviewer]

════════════════════════════════════════════════════════════════

EVALUATION QUESTIONS:

1. CLARITY & COMPREHENSION
   - Is the main argument or narrative clear?
   - Are key terms and concepts defined?
   - Does the reader understand the purpose of this chapter?
   Rating (1-10): ____
   Evidence: ________________

2. EVIDENCE & SUPPORT
   - Are claims backed by evidence or citation?
   - Do quotes and references support the text?
   - Are sources appropriate and credible?
   Rating (1-10): ____
   Evidence: ________________

3. RIGOR & ACCURACY
   - Are statistical claims correct and well-reported?
   - Are methodological steps justified?
   - Are limitations acknowledged?
   Rating (1-10): ____
   Evidence: ________________

4. COHERENCE & FLOW
   - Does the chapter follow a logical structure?
   - Are transitions smooth between ideas?
   - Does the ending reinforce the opening?
   Rating (1-10): ____
   Evidence: ________________

5. ALIGNMENT WITH TASK
   - Does the revision address the stated acceptance criteria?
   - Is the improvement measurable/visible?
   - Does it meet the post-revision test?
   Rating (1-10): ____
   Evidence: ________________

════════════════════════════════════════════════════════════════

FINAL VERDICT:

Overall Omega Score (1-10): ____

Pass Post-Revision Test? (Yes/No): ____

Recommendation:
  ☐ ACCEPT (revision passes test)
  ☐ CONDITIONAL (passes test but minor issues noted)
  ☐ REJECT (does not pass test; return for revision)

Comments: ________________

════════════════════════════════════════════════════════════════
`;
};

export const REVISION_PROMPT_LIBRARY = {
  introduction: {
    task: "Clarify thesis statement and scope",
    focus_areas: ["opening clarity", "key term definition", "scope boundaries"],
    common_gaps: [
      "Thesis buried or unclear",
      "Key terms used before definition",
      "Scope boundaries not explicit",
      "Reader expectations not set"
    ]
  },
  
  background: {
    task: "Expand context; cite foundational works",
    focus_areas: ["historical context", "foundational citations", "framework links"],
    common_gaps: [
      "Missing citations to seminal works",
      "Historical timeline unclear",
      "Connection to established frameworks weak"
    ]
  },
  
  methodology: {
    task: "Detail research design and validity threats",
    focus_areas: ["sample justification", "design rationale", "validity threats"],
    common_gaps: [
      "Sample size not justified",
      "Design choice not explained",
      "Threats to validity not identified",
      "Mitigation strategies missing"
    ]
  },
  
  theory_framework: {
    task: "Operationalize core constructs",
    focus_areas: ["construct definition", "hypothesis formalization", "variable relationships"],
    common_gaps: [
      "Constructs not operationalized",
      "Hypotheses not formally stated",
      "Relationships not diagrammed",
      "Link to methodology weak"
    ]
  },
  
  analysis: {
    task: "Strengthen quantitative rigor",
    focus_areas: ["statistics reporting", "effect sizes", "assumption testing"],
    common_gaps: [
      "p-values without effect sizes",
      "No confidence intervals",
      "Assumptions not tested",
      "Results not explained"
    ]
  },
  
  findings: {
    task: "Clearly state findings with evidence",
    focus_areas: ["evidence quotes", "finding clarity", "hypothesis links"],
    common_gaps: [
      "No verbatim evidence quotes",
      "Findings vague or generalized",
      "Link to hypotheses weak",
      "Implications not stated"
    ]
  },
  
  discussion: {
    task: "Interpret findings; compare to prior work",
    focus_areas: ["interpretation", "literature comparison", "contradiction handling"],
    common_gaps: [
      "Findings not interpreted",
      "No comparison to prior work",
      "Contradictions not addressed",
      "Mechanisms not proposed"
    ]
  },
  
  limitations: {
    task: "Explicitly state scope limits and biases",
    focus_areas: ["generalizability limits", "bias sources", "impact clarity"],
    common_gaps: [
      "Generalizability limits not stated",
      "Bias sources not identified",
      "Impact on conclusions unclear",
      "Future work not suggested"
    ]
  },
  
  conclusion: {
    task: "Synthesize key findings; state impact",
    focus_areas: ["finding synthesis", "contribution clarity", "practical impact"],
    common_gaps: [
      "Main findings not recapped",
      "Contribution to field unclear",
      "Practical implications absent",
      "Next steps not suggested"
    ]
  }
};

export const getRevisionPrompt = (taskId, chapter, currentOmega) => {
  const task = REVISION_PROMPT_LIBRARY[taskId];
  if (!task) return null;
  
  return {
    task_id: taskId,
    task: task.task,
    focus_areas: task.focus_areas,
    common_gaps: task.common_gaps,
    prompt: buildRevisionPrompt(
      { title: task.task, description: "", delta_omega_target: currentOmega + 1.5, 
        acceptance_criteria: [], post_revision_test: "", priority: "high", sprint: 1, 
        owner: "reviewer", created_at: new Date().toISOString() },
      currentOmega,
      chapter
    )
  };
};

export default {
  buildRevisionPrompt,
  buildBlindedReviewerPrompt,
  REVISION_PROMPT_LIBRARY,
  getRevisionPrompt
};
