import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import {
  LayoutDashboard, PenLine, TrendingUp, FileText, Users, UserCircle,
  Zap, Target, BookOpen, Bot, ChevronRight, ChevronLeft,
  LayoutGrid, BarChart3, Layers, FlaskConical, Radio,
  ChevronDown,
} from "lucide-react";

const PAGES = [
  { path: "/",                  label: "Dashboard",     icon: LayoutDashboard },
  { path: "/writer",            label: "Writer",        icon: PenLine },
  { path: "/market-intelligence",label: "Market Intel", icon: TrendingUp },
  { path: "/lit-intel-report",  label: "Intel Report",  icon: FileText },
  { path: "/stakeholders",      label: "Directory",     icon: Users },
  { path: "/profiler",          label: "Profiler",      icon: UserCircle },
  { path: "/jams",              label: "JAMNet",        icon: Zap },
  { path: "/sprints",           label: "Sprints",       icon: Target },
  { path: "/prompt-master",     label: "Prompt Master", icon: BookOpen },
  { path: "/agent",             label: "Agent",         icon: Bot },
];

const TAB_GROUPS = [
  {
    id: "core",
    label: "Core",
    icon: LayoutGrid,
    color: "text-blue-400",
    tabs: [
      { id: "overview",  label: "Overview" },
      { id: "chapters",  label: "Chapters" },
      { id: "domains",   label: "Domains" },
      { id: "flags",     label: "Flags" },
      { id: "pacing",    label: "Pacing" },
      { id: "scores",    label: "Scores" },
    ],
  },
  {
    id: "analysis",
    label: "Analysis",
    icon: BarChart3,
    color: "text-purple-400",
    tabs: [
      { id: "arcs",      label: "Char Arcs" },
      { id: "emotion",   label: "Emotion" },
      { id: "nero",      label: "NERO" },
      { id: "ndr",       label: "NDR Map" },
      { id: "flesh",     label: "Flesh" },
      { id: "spss",      label: "SPSS" },
      { id: "clmoe",     label: "CL-MoE" },
      { id: "accuracy",  label: "Accuracy" },
      { id: "crossref",  label: "Archive XRef" },
      { id: "valence",   label: "Valence Map" },
      { id: "omegacls",  label: "Ω/CLS Trend" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    icon: Layers,
    color: "text-teal-400",
    tabs: [
      { id: "characters", label: "Characters" },
      { id: "glossary",   label: "Glossary" },
      { id: "bugs",       label: "Bugs" },
      { id: "modules",    label: "Modules" },
      { id: "market",     label: "Market" },
      { id: "canon",      label: "Canon" },
      { id: "timeline",   label: "Timeline" },
      { id: "grants",     label: "Grants" },
      { id: "campaign",   label: "Campaign" },
      { id: "phd",        label: "PhD" },
      { id: "chprogress", label: "Ch. Progress" },
      { id: "auditprog",  label: "Audit Progress" },
      { id: "foia",       label: "FOIA" },
      { id: "veterans",   label: "Veterans" },
    ],
  },
  {
    id: "research",
    label: "Research",
    icon: FlaskConical,
    color: "text-yellow-400",
    tabs: [
      { id: "beta",       label: "Beta" },
      { id: "research",   label: "Research" },
      { id: "research_db",label: "Research DB" },
      { id: "search",     label: "Search" },
      { id: "narintel",   label: "Nar. Intel" },
      { id: "writer",     label: "Writer AI" },
      { id: "motif",      label: "Motif Map" },
      { id: "charvoice",  label: "Voice Audit" },
      { id: "report",     label: "Full Report" },
      { id: "litaudit",   label: "Lit. Audit" },
      { id: "canonworth", label: "Canon-Worth" },
    ],
  },
  {
    id: "liveops",
    label: "Live Ops",
    icon: Radio,
    color: "text-red-400",
    tabs: [
      { id: "platform",   label: "Platform" },
      { id: "aiintel",    label: "AI Intel" },
      { id: "forensic",   label: "Forensic Audit" },
      { id: "novil",      label: "NOVIL" },
      { id: "submission", label: "Submission" },
      { id: "quarantine", label: "Quarantine" },
      { id: "comparison", label: "Compare" },
      { id: "dataintel",  label: "Data Intel" },
      { id: "bugfix",     label: "Bug Fix" },
      { id: "revision",   label: "Revision" },
      { id: "command",    label: "Command" },
      { id: "remediate",  label: "Remediate" },
      { id: "battle",     label: "Battle Scenes" },
      { id: "mktcal",     label: "Mkt Calendar" },
      { id: "claims",     label: "Claims Ledger" },
      { id: "dupmap",     label: "Dup Map" },
      { id: "execboard",  label: "Exec Decision" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed } = useAppContext();
  const [expandedGroups, setExpandedGroups] = useState({ core: true, analysis: false, platform: false, research: false, liveops: false });

  const isOnDashboard = location.pathname === "/";

  const toggleGroup = (id) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabClick = (tabId) => {
    if (tabId === "writer") { navigate("/writer"); return; }
    if (!isOnDashboard) navigate("/");
    setActiveTab(tabId);
  };

  return (
    <div
      className={`flex flex-col h-full bg-card border-r border-border transition-all duration-200 ${
        sidebarCollapsed ? "w-14" : "w-56"
      } shrink-0`}
    >
      {/* Logo area */}
      <div className={`flex items-center h-11 border-b border-border px-3 shrink-0 ${sidebarCollapsed ? "justify-center" : "gap-2"}`}>
        {!sidebarCollapsed && (
          <span className="text-[10px] font-black font-mono tracking-widest text-gold truncate">
            LITCENTRAL
          </span>
        )}
        {sidebarCollapsed && (
          <span className="text-[10px] font-black font-mono text-gold">LC</span>
        )}
      </div>

      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        {/* Pages */}
        {!sidebarCollapsed && (
          <div className="px-3 pt-1 pb-0.5">
            <span className="text-[9px] font-bold font-mono tracking-widest text-muted-foreground uppercase">
              Pages
            </span>
          </div>
        )}
        {PAGES.map((page) => {
          const Icon = page.icon;
          const active = location.pathname === page.path;
          return (
            <button
              key={page.path}
              onClick={() => navigate(page.path)}
              title={sidebarCollapsed ? page.label : undefined}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-mono transition-colors
                ${active
                  ? "bg-accent/15 text-accent font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }
                ${sidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{page.label}</span>}
            </button>
          );
        })}

        {/* Divider + tabs section */}
        <div className={`mt-2 mb-1 ${sidebarCollapsed ? "px-2" : "px-3"}`}>
          <div className="border-t border-border" />
        </div>

        {!sidebarCollapsed && (
          <div className="px-3 pt-1 pb-0.5">
            <span className="text-[9px] font-bold font-mono tracking-widest text-muted-foreground uppercase">
              Dashboard
            </span>
          </div>
        )}

        {TAB_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          const isExpanded = expandedGroups[group.id];
          const groupHasActive = group.tabs.some(t => t.id === activeTab) && isOnDashboard;

          if (sidebarCollapsed) {
            return (
              <button
                key={group.id}
                onClick={() => {
                  if (!isOnDashboard) navigate("/");
                  setExpandedGroups(prev => ({ ...prev, [group.id]: true }));
                  const first = group.tabs[0];
                  if (first) { handleTabClick(first.id); setSidebarCollapsed(false); }
                }}
                title={group.label}
                className={`w-full flex justify-center py-2 transition-colors ${
                  groupHasActive ? group.color : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GroupIcon className="w-3.5 h-3.5" />
              </button>
            );
          }

          return (
            <div key={group.id}>
              <button
                onClick={() => toggleGroup(group.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider transition-colors ${
                  groupHasActive ? group.color : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GroupIcon className="w-3 h-3 shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {isExpanded && group.tabs.map((tab) => {
                const isActive = activeTab === tab.id && isOnDashboard;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center gap-2 pl-8 pr-3 py-1 text-[11px] font-mono transition-colors ${
                      isActive
                        ? "text-foreground bg-secondary/60 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? "bg-accent" : "bg-border"}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2 shrink-0">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/50 text-[10px] font-mono transition-colors ${sidebarCollapsed ? "justify-center" : ""}`}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
}
