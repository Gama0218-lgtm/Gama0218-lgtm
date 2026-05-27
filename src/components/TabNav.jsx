/**
 * src/components/TabNav.jsx
 * Navigation between dashboard tabs, grouped by intent.
 */

import React from "react";

const GROUPS = [
  {
    id: "quality",
    label: "Quality",
    tabs: [
      { id: "gates",   label: "🚦 Gates",   tooltip: "Three-gate quality program status" },
      { id: "sources", label: "🔗 Sources", tooltip: "External source integrations & API status" },
      { id: "tasks",   label: "📋 Tasks",   tooltip: "Remediation tasks across sprints" },
      { id: "roadmap", label: "🗺️ Roadmap", tooltip: "Bug fixes and schema resolutions" },
    ],
  },
  {
    id: "analysis",
    label: "Analysis",
    tabs: [
      { id: "omegacls", label: "📈 Ω/CLS Trend", tooltip: "Per-chapter Ω + CLS scores with act bands and dip markers" },
    ],
  },
];

export default function TabNav({ activeTab, setActiveTab }) {
  return (
    <div className="tab-nav" style={{ flexDirection: "column", gap: 6, alignItems: "stretch" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {GROUPS.map((group) => (
          <div key={group.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{
              fontSize: 10, letterSpacing: "0.18em", color: "#7f8c8d",
              fontWeight: 700, textTransform: "uppercase", paddingLeft: 4,
            }}>{group.label}</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {group.tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.tooltip}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
