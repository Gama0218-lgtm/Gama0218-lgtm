import { useState } from "react";
import DashCard from "./DashCard";
import FOIATaskManager, { CountdownRing, daysSince } from "./FOIATaskManager";

const FOIAS = [
  {
    id: 1,
    agency: "VA BIRLS",
    fullName: "Veterans Administration — Beneficiary Identification and Records Locator Subsystem",
    filed: "2025-11-01",
    status: "OVERDUE",
    color: "red",
    daysOut: 151,
    targetRecords: "Hispanic veteran KIA records 1964–1975 — cross-reference DCAS 349 anomaly",
    contact: "Call 1-877-750-3639 IMMEDIATELY",
    contactUrl: "https://www.va.gov/resources/how-to-request-your-military-service-records/",
    relevance: "Primary forensic database for verifying DCAS undercounting. BIRLS holds burial + benefits records that may contain ethnicity data absent from DCAS.",
    escalation: "File congressional inquiry via CHC member. Escalate to VA Office of Inspector General if no response by May 1.",
    legalDays: 20,
    chapters: ["Ch.1", "Ch.35", "Ch.39"],
  },
  {
    id: 2,
    agency: "DHS ENFORCE",
    fullName: "Department of Homeland Security — Enforcement Integrated Database",
    filed: "2025-10-15",
    status: "OVERDUE",
    color: "red",
    daysOut: 168,
    targetRecords: "Deported veterans data — cross-reference with Los Obligados non-citizen draftees",
    contact: "DHS FOIA Office: foia@hq.dhs.gov | 202-343-1743",
    contactUrl: "https://www.dhs.gov/foia",
    relevance: "IIRIRA (1996) deportation pipeline. Establishes link between military service and subsequent deportation of non-citizen veterans. Critical for Ch.17 + Ch.39 historical accuracy.",
    escalation: "File with DHS Office of Civil Rights and Civil Liberties. CC Congressman Raul Ruiz (CA-25).",
    legalDays: 20,
    chapters: ["Ch.17", "Ch.36", "Ch.39"],
  },
  {
    id: 3,
    agency: "INAI Mexico",
    fullName: "Instituto Nacional de Transparencia, Acceso a la Información — Mexico",
    filed: "2025-12-01",
    status: "OVERDUE",
    color: "red",
    daysOut: 121,
    targetRecords: "Mexican national military service records — Sonora/Yaqui region 1964–1975",
    contact: "INAI online portal: infomex.org.mx | Via Mexican Consulate General LA",
    contactUrl: "https://www.plataformadetransparencia.org.mx/",
    relevance: "Los Obligados historical documentation. Mexican nationals drafted via 50 USC §3802 — Mexican government records may contain service evidence absent from US DCAS.",
    escalation: "Contact Mexican Embassy Washington D.C. + consult Mexican FOIA attorney.",
    legalDays: 20,
    chapters: ["Ch.17", "Ch.36"],
  },
  {
    id: 4,
    agency: "NARA",
    fullName: "National Archives and Records Administration",
    filed: "2025-08-01",
    status: "RECEIVED",
    color: "teal",
    daysOut: 243,
    targetRecords: "Vietnam-era DCAS records — full casualty file cross-referenced by ethnicity",
    contact: "Archives II: College Park MD — already processed",
    contactUrl: "https://www.archives.gov/research/order/foia.html",
    relevance: "3,070 Hispanic KIA identified — highest institutional validation. Provides baseline for 349 vs. 3,070 anomaly. Critical for TruthEngine360 Stream #4.",
    escalation: "COMPLETE. Follow-up: request supplemental files under archival access protocol.",
    legalDays: 20,
    chapters: ["Research DB", "Scores"],
  },
  {
    id: 5,
    agency: "DCAS Pentagon",
    fullName: "Defense Casualty Analysis System — Department of Defense",
    filed: "2025-06-01",
    status: "COMPLETE",
    color: "teal",
    daysOut: 304,
    targetRecords: "58,220 full casualty records — ethnic classification analysis",
    contact: "DoD FOIA Requester Service Center: 571-372-0462",
    contactUrl: "https://open.defense.gov/Transparency/FOIA/",
    relevance: "CORE DATASET. 58,220 records — only 349 coded Hispanic (0.60%). 84.9% classification failure rate confirmed. Drives entire TruthEngine360 forensic thesis.",
    escalation: "COMPLETE. Request supplemental NIPS database access (IBM 360 records) as follow-up.",
    legalDays: 20,
    chapters: ["All Tabs"],
  },
];

const STATUS_CONFIG = {
  OVERDUE:  { color:"red",    label:"OVERDUE",  bg:"bg-red/5",   border:"border-red/30"   },
  RECEIVED: { color:"teal",   label:"RECEIVED", bg:"bg-teal/5",  border:"border-teal/20"  },
  COMPLETE: { color:"teal",   label:"COMPLETE", bg:"bg-teal/5",  border:"border-teal/20"  },
  PENDING:  { color:"gold",   label:"PENDING",  bg:"bg-gold/5",  border:"border-gold/20"  },
};

export default function FOIATab() {
  const [expanded, setExpanded] = useState(null);
  const overdue = FOIAS.filter(f => f.status === "OVERDUE").length;

  return (
    <div className="animate-slide-up space-y-4">

      {overdue > 0 && (
        <div className="bg-red/5 border border-red/40 rounded-lg p-3 flex items-center gap-3">
          <span className="text-2xl font-black text-red font-mono">{overdue}</span>
          <div>
            <div className="text-sm font-bold text-red font-mono">FOIAs OVERDUE — Action Required</div>
            <div className="text-xs text-muted-foreground font-sans">VA BIRLS · DHS ENFORCE · INAI Mexico — all filed 90+ days ago. Click each to expand task manager + email templates.</div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Total Filed",    value:"5",          color:"blue" },
          { label:"Overdue",        value:`${overdue}`, color:"red"  },
          { label:"Received",       value:"1",          color:"gold" },
          { label:"Complete",       value:"1",          color:"teal" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-2xl font-black font-mono text-${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Countdown Ring Row — overdue only */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-3">Overdue Countdown — Days Since Filing</div>
        <div className="flex gap-6 flex-wrap">
          {FOIAS.map(f => {
            const cfg = STATUS_CONFIG[f.status];
            return (
              <div key={f.id} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setExpanded(expanded === f.id ? null : f.id)}>
                <CountdownRing daysOut={f.daysOut} status={f.status} />
                <div className={`text-[9px] font-bold font-mono text-${cfg.color} text-center`}>{f.agency}</div>
                <div className={`text-[8px] font-mono text-${cfg.color} px-1.5 py-0.5 rounded border border-${cfg.color}/30 bg-${cfg.color}/10`}>{cfg.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOIA Cards */}
      <div className="space-y-3">
        {FOIAS.map((f) => {
          const cfg = STATUS_CONFIG[f.status];
          const isOpen = expanded === f.id;
          return (
            <div key={f.id} className={`rounded-lg border ${cfg.border} ${cfg.bg} overflow-hidden`}>
              {/* Header — always visible */}
              <button
                onClick={() => setExpanded(isOpen ? null : f.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start gap-4">
                  <CountdownRing daysOut={f.daysOut} status={f.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-sm font-black font-mono text-${f.color}`}>{f.agency}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono text-${cfg.color} border border-${cfg.color}/40 ${cfg.bg}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-mono">Filed {f.filed} · {f.daysOut}d ago</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-sans mb-1">{f.fullName}</div>
                    <div className="text-xs text-foreground/80 font-sans leading-relaxed">{f.relevance}</div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {f.chapters.map(c => (
                        <span key={c} className="text-[8px] px-1.5 py-0.5 bg-secondary border border-border rounded font-mono text-muted-foreground">{c}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-muted-foreground text-sm flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Expanded — task manager + email */}
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="p-2.5 bg-background rounded border border-border">
                      <div className="text-[8px] font-bold text-muted-foreground mb-1 uppercase">Target Records</div>
                      <div className="text-[10px] text-foreground/70 font-sans">{f.targetRecords}</div>
                    </div>
                    <div className={`p-2.5 rounded border ${f.status === "OVERDUE" ? "bg-red/5 border-red/30" : "bg-background border-border"}`}>
                      <div className={`text-[8px] font-bold mb-1 uppercase ${f.status === "OVERDUE" ? "text-red" : "text-muted-foreground"}`}>
                        {f.status === "OVERDUE" ? "ACTION REQUIRED" : "Contact"}
                      </div>
                      <div className="text-[10px] font-sans text-foreground/70">
                        {f.status === "OVERDUE" ? f.escalation : f.contact}
                      </div>
                      {f.contactUrl && (
                        <a href={f.contactUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[9px] text-blue underline mt-1 block">
                          → Open Agency FOIA Portal
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Task Manager + Emails */}
                  <FOIATaskManager foia={f} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}