/**
 * src/components/TabNav.jsx
 * Navigation between dashboard tabs
 */

import React from "react";

const TABS = [
  { id: "gates", label: "🚦 Gates", tooltip: "Three-gate quality program status" },
  { id: "sources", label: "🔗 Sources", tooltip: "External source integrations & API status" },
  { id: "tasks", label: "📋 Tasks", tooltip: "Remediation tasks across sprints" },
  { id: "roadmap", label: "🗺️ Roadmap", tooltip: "Bug fixes and schema resolutions" }
];

export default function TabNav({ activeTab, setActiveTab }) {
  return (
    <div className="tab-nav">
      {TABS.map((tab) => (
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
  );
}
