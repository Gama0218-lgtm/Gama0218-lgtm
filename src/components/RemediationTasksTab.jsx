/**
 * src/components/RemediationTasksTab.jsx
 * Remediation Tasks: Sprint-based work orders with acceptance criteria
 */

import React, { useState } from "react";

const TASKS_BY_SPRINT = {
  1: [
    {
      id: "REMED-001",
      chapter: 1,
      title: "Clarify thesis statement and scope",
      priority: "high",
      owner: "lead_reviewer",
      target: 8.5,
      criteria: ["Thesis explicitly stated in opening", "Key definitions provided", "Scope boundaries clear"]
    },
    {
      id: "REMED-002",
      chapter: 2,
      title: "Expand context; cite foundational works",
      priority: "high",
      owner: "domain_expert",
      target: 7.8,
      criteria: ["Minimum 5 new citations added", "Historical timeline clear"]
    },
    {
      id: "REMED-003",
      chapter: 3,
      title: "Detail research design and validity threats",
      priority: "critical",
      owner: "methods_expert",
      target: 9.2,
      criteria: ["Sample size rationale provided", "Design justified vs. alternatives", "Threats to validity identified"]
    }
  ],
  2: [
    {
      id: "REMED-005",
      chapter: 5,
      title: "Synthesize findings; identify gaps",
      priority: "high",
      owner: "literature_lead",
      target: 8.3,
      criteria: ["Thematic organization clear", "Comparison matrix provided"]
    },
    {
      id: "REMED-006",
      chapter: 7,
      title: "Strengthen quantitative rigor",
      priority: "critical",
      owner: "analysis_lead",
      target: 9.0,
      criteria: ["All statistics reported", "CIs or error bars included"]
    }
  ],
  3: [
    {
      id: "REMED-008",
      chapter: 13,
      title: "Clearly state findings with evidence",
      priority: "critical",
      owner: "findings_lead",
      target: 9.1,
      criteria: ["Each finding has evidence_quote[]", "Quotes verbatim and attributed"]
    },
    {
      id: "REMED-009",
      chapter: 16,
      title: "Interpret findings; compare to prior work",
      priority: "high",
      owner: "discussion_lead",
      target: 8.4,
      criteria: ["Findings interpreted vs. hypotheses", "Comparison to prior work explicit"]
    }
  ],
  4: [
    {
      id: "REMED-011",
      chapter: 40,
      title: "Synthesize key findings; state impact",
      priority: "high",
      owner: "lead_reviewer",
      target: 8.6,
      criteria: ["Main findings recapped", "Contribution to field clear"]
    }
  ]
};

export default function RemediationTasksTab({ manuscript }) {
  const [expandedSprint, setExpandedSprint] = useState(1);

  const sprints = Object.keys(TASKS_BY_SPRINT).sort((a, b) => parseInt(a) - parseInt(b));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "#dc3545";
      case "high":
        return "#ff9800";
      case "medium":
        return "#ffc107";
      case "low":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="remediation-tasks-tab">
      <h2>📋 Remediation Tasks</h2>
      <p className="intro">
        Fourteen remediation tasks organized across 4 sprints, each with priority, target Ω, and acceptance criteria.
      </p>

      <div className="sprints-container">
        {sprints.map((sprintNum) => {
          const tasks = TASKS_BY_SPRINT[sprintNum];
          const isExpanded = expandedSprint === parseInt(sprintNum);

          return (
            <div key={sprintNum} className="sprint-section">
              <div
                className="sprint-header"
                onClick={() => setExpandedSprint(isExpanded ? null : parseInt(sprintNum))}
              >
                <h3>Sprint {sprintNum}</h3>
                <span className="task-count">{tasks.length} tasks</span>
                <span className="toggle-icon">{isExpanded ? "▼" : "▶"}</span>
              </div>

              {isExpanded && (
                <div className="tasks-list">
                  {tasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <div className="task-title">
                          <span
                            className="priority-badge"
                            style={{ backgroundColor: getPriorityColor(task.priority) }}
                          >
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="chapter-badge">Ch. {task.chapter}</span>
                          <h4>{task.title}</h4>
                        </div>
                        <div className="target-omega">
                          <label>Target Ω</label>
                          <span className="value">{task.target}</span>
                        </div>
                      </div>

                      <div className="task-details">
                        <div className="detail">
                          <label>Owner:</label>
                          <span>{task.owner}</span>
                        </div>
                        <div className="detail">
                          <label>Task ID:</label>
                          <code>{task.id}</code>
                        </div>
                      </div>

                      <div className="acceptance-criteria">
                        <h5>Acceptance Criteria:</h5>
                        <ul>
                          {task.criteria.map((criterion, idx) => (
                            <li key={idx}>
                              <input type="checkbox" id={`${task.id}-${idx}`} disabled />
                              <label htmlFor={`${task.id}-${idx}`}>{criterion}</label>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="task-actions">
                        <button className="btn-assign">Assign</button>
                        <button className="btn-view">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="task-info">
        <h3>ℹ️ About Remediation Tasks</h3>
        <p>
          Each remediation task is generated from audit findings and paired with:
        </p>
        <ul>
          <li><strong>Priority Level</strong>: critical, high, medium, or low based on severity</li>
          <li><strong>Chapter ID</strong>: Specific canonical chapter (1-45) being improved</li>
          <li><strong>Target Ω</strong>: Expected audit score after successful revision</li>
          <li><strong>Acceptance Criteria</strong>: Must-satisfy checklist for completion</li>
          <li><strong>Post-Revision Test</strong>: Specific validation procedure (blinded review, peer check, etc.)</li>
        </ul>
        <p>
          Tasks are organized by sprint (1-4) to distribute workload evenly across front matter, body, discussion, and conclusion phases.
        </p>
      </div>
    </div>
  );
}
