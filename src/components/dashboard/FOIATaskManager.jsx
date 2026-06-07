import { useState } from "react";

const TODAY = new Date("2026-04-01");

function daysSince(dateStr) {
  const filed = new Date(dateStr);
  return Math.floor((TODAY - filed) / (1000 * 60 * 60 * 24));
}

function daysUntilDeadline(dateStr, legalDays = 20) {
  const filed = new Date(dateStr);
  const deadline = new Date(filed.getTime() + legalDays * 24 * 60 * 60 * 1000);
  return Math.floor((deadline - TODAY) / (1000 * 60 * 60 * 24));
}

// Countdown ring SVG
function CountdownRing({ daysOut, legalDays = 20, status }) {
  const r = 30, circ = 2 * Math.PI * r;
  let pct, color, label;
  if (status === "COMPLETE" || status === "RECEIVED") {
    pct = 1; color = "#1CCFB4"; label = status === "COMPLETE" ? "DONE" : "REC'D";
  } else {
    const remaining = daysUntilDeadline;
    pct = Math.max(0, Math.min(1, daysOut / 180)); // 180-day max visual scale
    color = daysOut > 120 ? "#FF5C5C" : daysOut > 60 ? "#FF8C42" : "#F5C842";
    label = `${daysOut}d`;
  }
  const dash = circ * (1 - pct);
  return (
    <div className="flex flex-col items-center">
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="none" stroke="#1A2640" strokeWidth="6" />
        <circle cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
          transform="rotate(-90 38 38)" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
        <text x="38" y="41" textAnchor="middle" fill={color} fontSize="11" fontWeight="900" fontFamily="monospace">{label}</text>
      </svg>
      <div className="text-[8px] text-muted-foreground font-mono text-center mt-0.5">Days Out</div>
    </div>
  );
}

const EMAIL_TEMPLATES = {
  OVERDUE_INITIAL: (agency, filed, daysOut, targetRecords) => `Subject: FOIA Request Follow-Up — [TRACKING NUMBER] — ${daysOut} Days Pending

Dear FOIA Officer,

I am writing to follow up on a Freedom of Information Act request submitted to ${agency} on ${filed}. My request has now been pending for ${daysOut} days, which exceeds the 20-business-day statutory response window under 5 U.S.C. § 552(a)(6)(A)(i).

RECORDS REQUESTED:
${targetRecords}

This request is related to ongoing historical research into the classification of Hispanic Vietnam-era veterans in the Defense Casualty Analysis System (DCAS). The information is sought in the public interest and for academic publication.

I respectfully request:
1. Confirmation that my request has been received and assigned a tracking number
2. An estimated date of completion
3. Notification of any fee assessment

If there are any issues with my request that require clarification, please contact me immediately at [YOUR EMAIL] or [YOUR PHONE].

Sincerely,
Gabriel T. Arce Jr.
AUMER Foundation / TruthEngine360 Project`,

  ESCALATION_CONGRESSIONAL: (agency, filed, daysOut, targetRecords) => `Subject: Congressional Inquiry — Overdue FOIA Request to ${agency} — ${daysOut} Days Pending

Dear [REPRESENTATIVE'S NAME],

I am a constituent writing to request congressional assistance with a significantly overdue Freedom of Information Act request submitted to ${agency} on ${filed}.

FOIA STATUS: ${daysOut} days pending — ${Math.round(daysOut / 20)}x the statutory 20-business-day limit.

RECORDS REQUESTED:
${targetRecords}

This research documents the systematic undercounting of Hispanic Vietnam War casualties — a matter of significant historical and public policy importance. I have exhausted administrative remedies and respectfully request your office's assistance in expediting this request.

This research will be presented at the Congressional Hispanic Caucus briefing on May 18, 2026.

I can be reached at [YOUR EMAIL] for any follow-up.

With respect,
Gabriel T. Arce Jr.
AUMER Foundation`,

  OIG_COMPLAINT: (agency, filed, daysOut) => `Subject: Complaint — Unreasonably Delayed FOIA Response — ${agency}

To the Office of Inspector General,

I am filing a formal complaint regarding an unreasonably delayed Freedom of Information Act response from ${agency}. My request was submitted on ${filed} and has now been pending ${daysOut} days — exceeding the statutory limit by ${daysOut - 20} business days.

I have received no tracking number, no acknowledgment of receipt, and no estimated completion date.

Under 5 U.S.C. § 552(a)(4)(B), I am prepared to seek judicial review if this matter is not resolved within 10 business days of this notice.

Respectfully,
Gabriel T. Arce Jr.`,
};

const FOIA_TASKS = {
  "VA BIRLS": [
    { id:"va1", label:"Call VA FOIA line: 1-877-750-3639", done:false, priority:"CRITICAL" },
    { id:"va2", label:"Send OVERDUE initial follow-up email", done:false, priority:"CRITICAL" },
    { id:"va3", label:"File congressional inquiry via CHC member", done:false, priority:"HIGH" },
    { id:"va4", label:"Escalate to VA Office of Inspector General", done:false, priority:"HIGH" },
    { id:"va5", label:"Prepare judicial review notice (10-day countdown)", done:false, priority:"MED" },
  ],
  "DHS ENFORCE": [
    { id:"dhs1", label:"Email DHS FOIA: foia@hq.dhs.gov", done:false, priority:"CRITICAL" },
    { id:"dhs2", label:"CC: Congressman Raul Ruiz (CA-25)", done:false, priority:"HIGH" },
    { id:"dhs3", label:"File with DHS Office of Civil Rights and Civil Liberties", done:false, priority:"HIGH" },
    { id:"dhs4", label:"Send escalation congressional letter", done:false, priority:"HIGH" },
    { id:"dhs5", label:"Cross-reference Ch.17 + Ch.39 source needs", done:false, priority:"MED" },
  ],
  "INAI Mexico": [
    { id:"inai1", label:"Access INAI portal: infomex.org.mx", done:false, priority:"CRITICAL" },
    { id:"inai2", label:"Contact Mexican Consulate General LA", done:false, priority:"HIGH" },
    { id:"inai3", label:"Consult Mexican FOIA attorney", done:false, priority:"HIGH" },
    { id:"inai4", label:"Contact Mexican Embassy Washington D.C.", done:false, priority:"MED" },
  ],
  "NARA": [
    { id:"nara1", label:"Request supplemental files under archival access protocol", done:false, priority:"MED" },
    { id:"nara2", label:"Request NIPS/IBM 360 supplemental database", done:false, priority:"HIGH" },
  ],
  "DCAS Pentagon": [
    { id:"dcas1", label:"Request NIPS database access (IBM 360 records)", done:false, priority:"HIGH" },
    { id:"dcas2", label:"Request supplemental ethnic classification methodology docs", done:false, priority:"MED" },
  ],
};

export default function FOIATaskManager({ foia }) {
  const [tasks, setTasks] = useState(FOIA_TASKS[foia.agency] || []);
  const [emailTemplate, setEmailTemplate] = useState(null);
  const [copied, setCopied] = useState(false);

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const done = tasks.filter(t => t.done).length;
  const PRI_COLOR = { CRITICAL:"text-red", HIGH:"text-orange", MED:"text-gold" };

  const templates = foia.status === "OVERDUE" ? [
    { label:"Initial Follow-Up", key:"initial", fn: EMAIL_TEMPLATES.OVERDUE_INITIAL },
    { label:"Congressional Escalation", key:"congress", fn: EMAIL_TEMPLATES.ESCALATION_CONGRESSIONAL },
    { label:"OIG Complaint", key:"oig", fn: EMAIL_TEMPLATES.OIG_COMPLAINT },
  ] : [
    { label:"Follow-Up Request", key:"initial", fn: EMAIL_TEMPLATES.OVERDUE_INITIAL },
  ];

  const genEmail = (fn) => {
    const text = fn(foia.agency, foia.filed, foia.daysOut, foia.targetRecords);
    setEmailTemplate(text);
    setCopied(false);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(emailTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 mt-3 pt-3 border-t border-border/40">
      {/* Task Checklist */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Follow-Up Tasks ({done}/{tasks.length})</div>
          <div className="h-1 w-24 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-teal rounded-full transition-all" style={{ width: tasks.length ? `${(done / tasks.length) * 100}%` : "0%" }} />
          </div>
        </div>
        <div className="space-y-1.5">
          {tasks.map(t => (
            <label key={t.id} className={`flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-background transition-colors ${t.done ? "opacity-50" : ""}`}>
              <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)}
                className="accent-teal w-3 h-3 rounded" />
              <span className={`text-[10px] font-sans flex-1 ${t.done ? "line-through text-muted-foreground" : "text-foreground/80"}`}>{t.label}</span>
              <span className={`text-[8px] font-bold font-mono ${PRI_COLOR[t.priority]}`}>{t.priority}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Email Templates */}
      <div>
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Email Templates</div>
        <div className="flex gap-1.5 flex-wrap mb-2">
          {templates.map(tmpl => (
            <button key={tmpl.key} onClick={() => genEmail(tmpl.fn)}
              className="px-2.5 py-1 text-[9px] font-bold font-mono rounded border border-blue/40 text-blue bg-blue/5 hover:bg-blue/15 transition-all">
              {tmpl.label}
            </button>
          ))}
        </div>
        {emailTemplate && (
          <div className="relative">
            <pre className="text-[9px] text-foreground/70 font-sans bg-background border border-border rounded p-3 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
              {emailTemplate}
            </pre>
            <button onClick={copyEmail}
              className={`absolute top-2 right-2 px-2 py-0.5 text-[8px] font-bold font-mono rounded border transition-all ${copied ? "border-teal text-teal bg-teal/10" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {copied ? "COPIED!" : "COPY"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { CountdownRing, daysSince };