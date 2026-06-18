import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Circle, AlertCircle, Clock, Zap } from "lucide-react";

const SPRINTS = [
  {
    id: 1,
    name: "Sprint 1 — Artifact Removal",
    status: "complete",
    priority: "CRITICAL",
    color: "teal",
    objective: "Remove all draft annotation artifacts and residual LitCentral diagnostic signatures from manuscript prose.",
    hours: 8,
    tasks: [
      { id: "1a", text: "Ch.1 Line 1 artifact: Remove 'REVISED CHAPTER — FIRST PASS'", severity: "CRITICAL", done: true },
      { id: "1b", text: "Ch.34 Last line artifact: Remove 'PASS 2 COMPLETE — LITCENTRAL HYBRID DIAGNOSTIC'", severity: "CRITICAL", done: true },
      { id: "1c", text: "Full manuscript scan: grep for LITCENTRAL, PASS, REVISED, DIAGNOSTIC", severity: "HIGH", done: true },
      { id: "1d", text: "Verify no chapter heading contains version markers", severity: "HIGH", done: true },
      { id: "1e", text: "Final artifact-clean confirmation read (Ch.1 + Ch.34 + Ch.45)", severity: "MED", done: true },
    ],
  },
  {
    id: 2,
    name: "Sprint 2 — Structural Integrity",
    status: "in-progress",
    priority: "CRITICAL",
    color: "orange",
    objective: "Resolve duplication, character name errors, and chapter completion failures before any submission pass.",
    hours: 20,
    tasks: [
      { id: "2a", text: "Ch.9/10 — Resolve 700+ line near-identical duplication. Determine canonical version.", severity: "CRITICAL", done: true },
      { id: "2b", text: "Ch.10 — Fix Ramirez/Rodriguez name swap at ~60% through chapter", severity: "CRITICAL", done: true },
      { id: "2c", text: "Ch.40/45 — Resolve character death timeline conflict", severity: "CRITICAL", done: false },
      { id: "2d", text: "Ch.42 — Complete chapter (currently 2,604 words; target ~5,500)", severity: "CRITICAL", done: false },
      { id: "2e", text: "Ch.16 + Ch.17 — Resolve structural echo: both end on 'The dead spoke'", severity: "HIGH", done: false },
      { id: "2f", text: "Verify 45-chapter inventory: confirm Gate Zero normalization complete", severity: "HIGH", done: false },
      { id: "2g", text: "Full chapter-by-chapter word count audit against targets", severity: "MED", done: false },
    ],
  },
  {
    id: 3,
    name: "Sprint 3 — CL-MoE Crossover",
    status: "pending",
    priority: "HIGH",
    color: "blue",
    objective: "Close the CL-MoE gap from 0.847 to 0.979 crossover via SII expansion in Act III chapters.",
    hours: 16,
    tasks: [
      { id: "3a", text: "Act III SII audit: identify chapters below SII threshold (target: +77 pts vs war canon)", severity: "HIGH", done: false },
      { id: "3b", text: "Ch.35–45 sensory density pass: expand sensory immersion in low-SII chapters", severity: "HIGH", done: false },
      { id: "3c", text: "IBM 360 motif redistribution: ensure felt (not named) in Act III combat sequences", severity: "HIGH", done: false },
      { id: "3d", text: "BIS reinforcement pass: behavioral consistency in Act III character decisions", severity: "MED", done: false },
      { id: "3e", text: "Re-score CL-MoE after Act III expansion — confirm crossover at 0.979", severity: "MED", done: false },
      { id: "3f", text: "Projected advance impact: +$15K–$30K upon crossover confirmation", severity: "LOW", done: false },
    ],
  },
  {
    id: 4,
    name: "Sprint 4 — Voice & Continuity",
    status: "pending",
    priority: "HIGH",
    color: "purple",
    objective: "Eliminate POV violations, voice drift, and continuity failures across all 45 chapters.",
    hours: 24,
    tasks: [
      { id: "4a", text: "Full POV audit: flag all POV violations chapter by chapter", severity: "HIGH", done: false },
      { id: "4b", text: "Voice drift pass: confirm Ramos voice consistency Act I → Act III", severity: "HIGH", done: false },
      { id: "4c", text: "CL-MoE crossover verification post-Sprint 3", severity: "HIGH", done: false },
      { id: "4d", text: "Crawford/IBM arc: verify institutional critique lands consistently across all chapters", severity: "MED", done: false },
      { id: "4e", text: "Terminel-Sagasta genealogy: confirm family arc mathematical consistency", severity: "MED", done: false },
      { id: "4f", text: "Dialogue percentage audit: ensure BIS 88.9 maintained across acts", severity: "MED", done: false },
      { id: "4g", text: "Historical anachronism sweep: confirm all 1967–1975 references verified", severity: "HIGH", done: false },
    ],
  },
  {
    id: 5,
    name: "Sprint 5 — Restraint Pass (Pulitzer-Critical)",
    status: "locked",
    priority: "PULITZER",
    color: "gold",
    objective: "Remove overengineering. Protect spiritual violence, cultural memory, mathematical obsession, and grief architecture. Restraint 67 → 80+.",
    hours: 32,
    tasks: [
      { id: "5a", text: "Vocabulary audit: purge 'protocol,' 'algorithm,' 'vector,' 'framework' from prose", severity: "CRITICAL", done: false },
      { id: "5b", text: "Over-explained beats pass: cut every sentence that tells what the previous showed", severity: "CRITICAL", done: false },
      { id: "5c", text: "IBM 360 metaphor: ensure felt as invisible weight in combat — never named", severity: "HIGH", done: false },
      { id: "5d", text: "Spiritual violence protection: do not sanitize faith-cost in killing field scenes", severity: "HIGH", done: false },
      { id: "5e", text: "Grief architecture: preserve structural weight of absence — do not resolve it", severity: "HIGH", done: false },
      { id: "5f", text: "Cultural memory: protect irrational ancestral knowledge — do not explain it", severity: "HIGH", done: false },
      { id: "5g", text: "Controlled imperfection: insert one deliberate narrative irregularity per Act", severity: "MED", done: false },
      { id: "5h", text: "Final Restraint score re-assessment: confirm 80+ before award-circuit submission", severity: "CRITICAL", done: false },
    ],
  },
];

const STATUS_CONFIG = {
  complete: { label: "COMPLETE", color: "text-teal", bg: "bg-teal/10 border-teal/30", icon: CheckCircle2 },
  "in-progress": { label: "IN PROGRESS", color: "text-orange", bg: "bg-orange/10 border-orange/30", icon: Zap },
  pending: { label: "PENDING", color: "text-blue", bg: "bg-blue/10 border-blue/30", icon: Clock },
  locked: { label: "LOCKED — DO LAST", color: "text-gold", bg: "bg-gold/10 border-gold/30", icon: AlertCircle },
};

const SEV_COLORS = {
  CRITICAL: "text-red border-red/40 bg-red/10",
  HIGH: "text-orange border-orange/30 bg-orange/5",
  MED: "text-gold border-gold/20 bg-gold/5",
  LOW: "text-muted-foreground border-border bg-secondary/30",
};

export default function SprintTrackerPage() {
  const navigate = useNavigate();
  const [activeSprint, setActiveSprint] = useState(2);
  const [tasks, setTasks] = useState(() => {
    const map = {};
    SPRINTS.forEach(s => s.tasks.forEach(t => { map[t.id] = t.done; }));
    return map;
  });

  const toggle = (id) => setTasks(prev => ({ ...prev, [id]: !prev[id] }));

  const sprint = SPRINTS.find(s => s.id === activeSprint);
  const done = sprint.tasks.filter(t => tasks[t.id]).length;
  const pct = Math.round((done / sprint.tasks.length) * 100);

  const totalTasks = SPRINTS.reduce((a, s) => a + s.tasks.length, 0);
  const totalDone = SPRINTS.reduce((a, s) => a + s.tasks.filter(t => tasks[t.id]).length, 0);
  const totalHours = SPRINTS.reduce((a, s) => a + s.hours, 0);

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-red via-orange to-gold" />

      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-mono">
            <ArrowLeft className="w-3.5 h-3.5" />LITCENTRAL
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex-1">
            <div className="text-xs font-bold text-gold font-mono">SPRINT TRACKER — SUBMISSION READINESS</div>
            <div className="text-[9px] text-muted-foreground font-mono">SGT George Ramos: The Mathematics of Vietnam — 5 Sprints · {totalHours}h Total</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[9px] font-mono text-teal bg-teal/10 border border-teal/30 px-3 py-1 rounded-full">{totalDone}/{totalTasks} Tasks Done</div>
            <div className="text-[9px] font-mono text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full">{Math.round((totalDone/totalTasks)*100)}% Complete</div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6">

          {/* Sprint Nav */}
          <div className="w-64 flex-shrink-0 space-y-2">
            {SPRINTS.map(s => {
              const cfg = STATUS_CONFIG[s.status];
              const Icon = cfg.icon;
              const doneCount = s.tasks.filter(t => tasks[t.id]).length;
              const isActive = activeSprint === s.id;
              return (
                <button key={s.id} onClick={() => setActiveSprint(s.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${isActive ? `border-${s.color}/40 bg-${s.color}/5` : "border-border bg-card hover:border-border/80 hover:bg-secondary/10"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>{cfg.label}</div>
                    <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                  </div>
                  <div className={`text-[10px] font-black font-mono ${isActive ? `text-${s.color}` : "text-foreground"} leading-snug mb-2`}>Sprint {s.id}</div>
                  <div className="text-[9px] text-muted-foreground mb-2 leading-snug line-clamp-2">{s.name.split("—")[1]?.trim()}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-${s.color}`}
                        style={{width:`${s.tasks.length ? Math.round((s.tasks.filter(t=>tasks[t.id]).length/s.tasks.length)*100) : 0}%`}} />
                    </div>
                    <span className="text-[8px] font-mono text-muted-foreground">{doneCount}/{s.tasks.length}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sprint Detail */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Sprint Header */}
            <div className={`bg-card border border-${sprint.color}/30 rounded-xl p-5`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className={`text-[8px] font-bold font-mono text-${sprint.color} mb-1`}>
                    {sprint.priority === "PULITZER" ? "⚠ PULITZER-CRITICAL — DO LAST" : `PRIORITY: ${sprint.priority}`}
                  </div>
                  <div className={`text-lg font-black font-mono text-${sprint.color}`}>{sprint.name}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-3xl font-black font-mono text-${sprint.color}`}>{pct}%</div>
                  <div className="text-[8px] text-muted-foreground font-mono">{done}/{sprint.tasks.length} tasks</div>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full bg-${sprint.color} transition-all duration-300`} style={{width:`${pct}%`}} />
              </div>
              <p className="text-[10px] text-foreground/80">{sprint.objective}</p>
              <div className="mt-2 text-[9px] text-muted-foreground font-mono">Est. {sprint.hours}h total</div>
            </div>

            {/* Tasks */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/20">
                <div className="text-[10px] font-bold font-mono">TASKS — click to mark complete</div>
              </div>
              <div className="divide-y divide-border/40">
                {sprint.tasks.map(task => {
                  const isDone = tasks[task.id];
                  return (
                    <button key={task.id} onClick={() => toggle(task.id)}
                      className={`w-full text-left flex items-start gap-4 px-5 py-3.5 hover:bg-secondary/10 transition-all ${isDone ? "opacity-50" : ""}`}>
                      <div className="flex-shrink-0 mt-0.5">
                        {isDone
                          ? <CheckCircle2 className="w-4 h-4 text-teal" />
                          : <Circle className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-bold ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.text}
                        </div>
                      </div>
                      <span className={`flex-shrink-0 text-[7px] font-bold font-mono px-1.5 py-0.5 rounded border ${SEV_COLORS[task.severity]}`}>
                        {task.severity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sprint 5 warning */}
            {sprint.id === 5 && (
              <div className="bg-red/5 border border-red/30 rounded-xl p-5">
                <div className="text-[10px] font-bold font-mono text-red mb-2">⚠ SPRINT 5 WARNING — DO NOT RUSH</div>
                <p className="text-[10px] text-foreground/80">
                  Sprint 5 is not a polish pass. It is a <span className="text-gold font-bold">protection pass</span>.
                  The job is to remove what the system built and protect what the author bled.
                  Those are different kinds of work, and only one of them can be automated.
                  Restraint score must reach <span className="text-red font-bold">80+</span> before award-circuit submission.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}