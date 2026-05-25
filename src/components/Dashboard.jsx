/**
 * src/components/Dashboard.jsx
 * LitCentral v13 - Main Dashboard
 * Displays manuscript audit progress, gate status, and remediation tasks
 */

import React, { useState, useEffect } from "react";
import TabNav from "./TabNav";
import GateZeroTab from "./GateZeroTab";
import ExternalSourcesTab from "./ExternalSourcesTab";
import RemediationTasksTab from "./RemediationTasksTab";
import BugFixRoadmapTab from "./BugFixRoadmapTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("gates");
  const [manuscript, setManuscript] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // In real app, fetch from backend
      const mockData = {
        manuscript_id: "550e8400-e29b-41d4-a716-446655440000",
        title: "Sample Manuscript",
        chapter_count: 45,
        status: "audit_in_progress"
      };
      setManuscript(mockData);
      
      const mockAudit = {
        audit_run_id: "660e8400-e29b-41d4-a716-446655440000",
        gate_zero_passed: true,
        omega_score: 6.8,
        total_findings: 24,
        critical_findings: 3,
        high_findings: 8
      };
      setAuditData(mockAudit);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard loading">Loading LitCentral v13...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📚 LitCentral v13</h1>
        <p className="subtitle">Manuscript Audit & Revision Platform</p>
        <p className="version-note">Gate Zero Normalization | Evidence-Rigor Audit | Task-Driven Revision</p>
      </header>

      {manuscript && auditData && (
        <div className="manuscript-summary">
          <div className="info-card">
            <h3>{manuscript.title}</h3>
            <p>Manuscript ID: {manuscript.manuscript_id}</p>
            <p>Chapters: <strong>{manuscript.chapter_count}</strong> (canonical)</p>
            <p>Status: <strong>{manuscript.status}</strong></p>
          </div>

          <div className="audit-summary">
            <div className="metric">
              <label>Gate Zero</label>
              <span className={auditData.gate_zero_passed ? "pass" : "fail"}>
                {auditData.gate_zero_passed ? "✓ PASSED" : "✗ FAILED"}
              </span>
            </div>
            <div className="metric">
              <label>Ω (Audit Score)</label>
              <span className="score">{auditData.omega_score}/10</span>
            </div>
            <div className="metric">
              <label>Total Findings</label>
              <span>{auditData.total_findings}</span>
            </div>
            <div className="metric">
              <label>Critical Issues</label>
              <span className="critical">{auditData.critical_findings}</span>
            </div>
            <div className="metric">
              <label>High Priority</label>
              <span className="high">{auditData.high_findings}</span>
            </div>
          </div>
        </div>
      )}

      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="tab-content">
        {activeTab === "gates" && <GateZeroTab auditData={auditData} />}
        {activeTab === "sources" && <ExternalSourcesTab manuscript={manuscript} />}
        {activeTab === "tasks" && <RemediationTasksTab manuscript={manuscript} />}
        {activeTab === "roadmap" && <BugFixRoadmapTab manuscript={manuscript} />}
      </div>

      <footer className="dashboard-footer">
        <p>LitCentral v13.0 | Gate-Based Manuscript Quality Framework</p>
        <p>Gate Zero: Normalization | Gate One: Evidence Audit | Gate Two: Revision & Acceptance</p>
      </footer>
    </div>
  );
}
