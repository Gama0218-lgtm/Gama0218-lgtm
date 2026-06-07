import { useState } from "react";
import DashCard from "./DashCard";
import CampaignCalendar from "./CampaignCalendar";

const MILESTONES = [
  { date:"Apr 15, 2026", task:"Complete Ch.40 Ramos prayer scene",          status:"PENDING",  priority:"CRITICAL", days:14 },
  { date:"Apr 20, 2026", task:"Joshua Sagasta Act II-III scene added",       status:"PENDING",  priority:"HIGH",     days:19 },
  { date:"Apr 25, 2026", task:"Sensory upgrades Ch.6, Ch.17, Ch.18",        status:"PENDING",  priority:"HIGH",     days:24 },
  { date:"May 1, 2026",  task:"Final manuscript lock — 44 chapters complete", status:"PENDING", priority:"CRITICAL", days:30 },
  { date:"May 10, 2026", task:"ARC copies to beta readers (final round)",    status:"PENDING",  priority:"HIGH",     days:39 },
  { date:"May 18, 2026", task:"CHC Briefing — Congressional Hispanic Caucus", status:"PENDING", priority:"CRITICAL", days:47 },
  { date:"May 25, 2026", task:"Press kit + media brief finalized",           status:"PENDING",  priority:"MED",      days:54 },
  { date:"May 31, 2026", task:"PUBLICATION DATE",                            status:"TARGET",   priority:"CRITICAL", days:60 },
];

const OUTREACH = [
  { target:"Congressional Hispanic Caucus",  status:"Scheduled May 18", color:"gold",   note:"CHC briefing confirmed — TruthEngine360 + manuscript" },
  { target:"Chicano studies departments",    status:"In Progress",      color:"teal",   note:"UCLA, UT Austin, Arizona State — dept chairs identified" },
  { target:"Vietnam Veterans of America",    status:"Pending",          color:"blue",   note:"Chapter 1 + Ch.23 Te Deum excerpts prepared" },
  { target:"NPR Latino USA",                 status:"Pending",          color:"purple", note:"Story angle: 43,000 missing veterans + IBM 360" },
  { target:"LA Times / NYT Book Review",     status:"Pending",          color:"orange", note:"ARC + press kit needed by May 15" },
  { target:"MALDEF / LULAC",                 status:"Pending",          color:"teal",   note:"Legal angle: 50 USC §3802 + deportation pipeline" },
];

const FOIA = [
  { agency:"VA BIRLS",      status:"OVERDUE",    color:"red",    note:"Call 1-877-750-3639 immediately" },
  { agency:"DHS ENFORCE",   status:"OVERDUE",    color:"red",    note:"Filed 90+ days ago — escalate" },
  { agency:"INAI Mexico",   status:"OVERDUE",    color:"red",    note:"International filing — contact embassy" },
  { agency:"NARA",          status:"RECEIVED",   color:"teal",   note:"3,070 records confirmed" },
  { agency:"DCAS",          status:"COMPLETE",   color:"teal",   note:"58,220 records analyzed" },
];

const PRI_COLOR = { CRITICAL:"text-red", HIGH:"text-orange", MED:"text-gold" };
const STATUS_COLOR = { PENDING:"text-muted-foreground", TARGET:"text-gold", OVERDUE:"text-red", RECEIVED:"text-teal", COMPLETE:"text-teal", "Scheduled May 18":"text-gold", "In Progress":"text-blue" };

export default function CampaignTab() {
  const [view, setView] = useState("list");
  return (
    <div className="animate-slide-up space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="bg-red/5 border border-red/30 rounded-lg px-3 py-2 text-xs font-sans flex-1">
          <span className="text-red font-bold">60 DAYS TO PUBLICATION · </span>
          <span className="text-foreground/70">May 31, 2026 — CHC Briefing May 18 — Manuscript must be locked by May 1</span>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setView("list")} className={`px-3 py-1.5 rounded text-xs font-bold font-mono border transition-all ${view === "list" ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>List</button>
          <button onClick={() => setView("calendar")} className={`px-3 py-1.5 rounded text-xs font-bold font-mono border transition-all ${view === "calendar" ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>📅 Calendar</button>
        </div>
      </div>

      {view === "calendar" && <CampaignCalendar />}

      {view === "list" && <DashCard title="Publication Timeline" accent="gold">
        <div className="space-y-2">
          {MILESTONES.map((m, i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded border ${m.priority === "CRITICAL" ? "border-red/30 bg-red/5" : "border-border bg-background"}`}>
              <span className="text-[9px] font-mono text-muted-foreground min-w-[80px]">{m.date}</span>
              <span className="text-xs text-foreground flex-1 font-sans">{m.task}</span>
              <span className={`text-[9px] font-bold font-mono ${PRI_COLOR[m.priority]}`}>{m.priority}</span>
              <span className="text-[9px] font-mono text-muted-foreground">+{m.days}d</span>
            </div>
          ))}
        </div>
      </DashCard>}

      {view === "list" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DashCard title="Outreach Targets" accent="teal">
        <div className="space-y-2">
          {OUTREACH.map((o, i) => (
            <div key={i} className="p-2.5 bg-background rounded border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold font-sans text-${o.color}`}>{o.target}</span>
                <span className={`text-[9px] font-mono ${STATUS_COLOR[o.status] || "text-muted-foreground"}`}>{o.status}</span>
              </div>
              <div className="text-[9px] text-muted-foreground font-sans">{o.note}</div>
            </div>
          ))}
        </div>
      </DashCard>

      <DashCard title="FOIA Status" accent="red">
        <div className="space-y-2">
          {FOIA.map((f, i) => (
            <div key={i} className={`p-2.5 rounded border ${f.status === "OVERDUE" ? "border-red/40 bg-red/5" : "border-border bg-background"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground">{f.agency}</span>
                <span className={`text-[9px] font-bold font-mono text-${f.color}`}>{f.status}</span>
              </div>
              <div className="text-[9px] text-muted-foreground font-sans">{f.note}</div>
            </div>
          ))}
        </div>
      </DashCard>
      </div>}
      </div>
      );
      }