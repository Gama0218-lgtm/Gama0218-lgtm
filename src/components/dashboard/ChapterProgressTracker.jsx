import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CHAPTERS, CHAPTER_BUGS } from "../../lib/data";

const STATUS_OPTIONS = [
  { value: "locked",      label: "Locked",       color: "muted-foreground", bg: "bg-secondary",   icon: "🔒" },
  { value: "draft",       label: "Draft",         color: "gold",             bg: "bg-gold/10",     icon: "✏️" },
  { value: "revised",     label: "Revised",       color: "blue",             bg: "bg-blue/10",     icon: "🔄" },
  { value: "polished",    label: "Polished",      color: "purple",           bg: "bg-purple/10",   icon: "✨" },
  { value: "final",       label: "Final",         color: "teal",             bg: "bg-teal/10",     icon: "✅" },
];

const PRIORITY_MAP = {
  HIGH: "border-l-red",
  MED:  "border-l-gold",
  LOW:  "border-l-blue",
  null: "border-l-border",
};

// Local storage key
const LS_KEY = "litcentral_chapter_progress";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

const ACT_COLORS = { I: "gold", II: "blue", III: "teal" };

export default function ChapterProgressTracker() {
  const [progress, setProgress] = useState(loadProgress);
  const [filter, setFilter] = useState("all"); // all | draft | revised | polished | final | locked
  const [actFilter, setActFilter] = useState("all");
  const [editingNote, setEditingNote] = useState(null); // ch number
  const [noteText, setNoteText] = useState("");

  const updateStatus = (ch, status) => {
    const next = { ...progress, [ch]: { ...(progress[ch] || {}), status } };
    setProgress(next);
    saveProgress(next);
  };

  const saveNote = (ch) => {
    const next = { ...progress, [ch]: { ...(progress[ch] || {}), note: noteText } };
    setProgress(next);
    saveProgress(next);
    setEditingNote(null);
    setNoteText("");
  };

  const openNote = (ch) => {
    setNoteText(progress[ch]?.note || "");
    setEditingNote(ch);
  };

  // Computed stats
  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = CHAPTERS.filter(c => (progress[c.ch]?.status || "locked") === s.value).length;
    return acc;
  }, {});
  const totalFinal = statusCounts["final"] || 0;
  const completionPct = Math.round((totalFinal / CHAPTERS.length) * 100);

  // Filter
  const visibleChapters = CHAPTERS.filter(c => {
    const st = progress[c.ch]?.status || "locked";
    const matchStatus = filter === "all" || st === filter;
    const matchAct = actFilter === "all" || c.act === actFilter;
    return matchStatus && matchAct;
  });

  // Bugs per chapter (quick lookup)
  const bugMap = CHAPTER_BUGS.reduce((acc, b) => {
    if (!acc[b.ch]) acc[b.ch] = [];
    acc[b.ch].push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-teal/5 border border-teal/30 rounded-lg p-3 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-sm font-black font-mono text-teal">CHAPTER PROGRESS TRACKER</div>
          <div className="text-[10px] text-muted-foreground font-sans">Track revision status, personal notes, and bug counts for all 44 chapters</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black font-mono text-teal">{completionPct}%</div>
          <div className="text-[9px] text-muted-foreground font-mono">Final ({totalFinal}/44)</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="text-[9px] font-bold text-muted-foreground font-mono uppercase">Revision Pipeline</div>
          <div className="flex gap-3">
            {STATUS_OPTIONS.map(s => (
              <div key={s.value} className="text-center">
                <div className={`text-sm font-black font-mono text-${s.color}`}>{statusCounts[s.value]}</div>
                <div className="text-[8px] text-muted-foreground font-mono">{s.icon}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Segmented progress bar */}
        <div className="flex gap-0.5 h-3 rounded-full overflow-hidden">
          {STATUS_OPTIONS.map(s => {
            const pct = (statusCounts[s.value] / 44) * 100;
            if (pct === 0) return null;
            const segColors = {
              locked: "bg-secondary", draft: "bg-gold/60",
              revised: "bg-blue/60", polished: "bg-purple/60", final: "bg-teal/70",
            };
            return <div key={s.value} className={`${segColors[s.value]} transition-all`} style={{ width: `${pct}%` }} title={`${s.label}: ${statusCounts[s.value]}`} />;
          })}
        </div>
        <div className="flex justify-between mt-1 text-[8px] font-mono text-muted-foreground">
          {STATUS_OPTIONS.map(s => <span key={s.value}>{s.icon} {s.label}</span>)}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-1">
          {["all", "I", "II", "III"].map(a => (
            <button key={a} onClick={() => setActFilter(a)}
              className={`px-2.5 py-1 rounded text-[9px] font-bold font-mono border transition-all ${actFilter === a ? `text-${ACT_COLORS[a] || "foreground"} border-${ACT_COLORS[a] || "foreground"}/40 bg-${ACT_COLORS[a] || "secondary"}/10` : "border-border text-muted-foreground hover:text-foreground"}`}>
              {a === "all" ? "All Acts" : `Act ${a}`}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-2">
          {["all", ...STATUS_OPTIONS.map(s => s.value)].map(f => {
            const s = STATUS_OPTIONS.find(x => x.value === f);
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded text-[9px] font-bold font-mono border transition-all ${filter === f ? `text-${s?.color || "foreground"} border-${s?.color || "foreground"}/40 bg-${s?.color || "secondary"}/10` : "border-border text-muted-foreground hover:text-foreground"}`}>
                {f === "all" ? "All Status" : `${s?.icon} ${s?.label}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapter grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {visibleChapters.map(ch => {
          const status = progress[ch.ch]?.status || "locked";
          const note = progress[ch.ch]?.note || "";
          const bugs = bugMap[ch.ch] || [];
          const critBugs = bugs.filter(b => b.sev === "CRIT" || b.sev === "HIGH");
          const statusCfg = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
          const actColor = ACT_COLORS[ch.act];

          return (
            <div key={ch.ch} className={`bg-card border border-border rounded-lg overflow-hidden border-l-2 ${PRIORITY_MAP[critBugs[0]?.sev] || "border-l-border"}`}>
              <div className="p-3">
                {/* Top row */}
                <div className="flex items-start gap-2 mb-2">
                  <div className={`text-[9px] font-black font-mono text-${actColor} min-w-[32px]`}>Ch.{ch.ch}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-foreground leading-snug truncate">{ch.title}</div>
                    <div className="text-[8px] text-muted-foreground font-mono">{ch.words?.toLocaleString()}w · Ω{ch.omega}</div>
                  </div>
                  {critBugs.length > 0 && (
                    <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-red/10 text-red border border-red/30 font-mono flex-shrink-0">
                      {critBugs.length} bug{critBugs.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Status selector */}
                <div className="flex gap-1 mb-2 flex-wrap">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s.value} onClick={() => updateStatus(ch.ch, s.value)}
                      title={s.label}
                      className={`text-[8px] px-1.5 py-0.5 rounded border font-mono font-bold transition-all ${status === s.value ? `text-${s.color} border-${s.color}/40 ${s.bg}` : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}>
                      {s.icon}
                    </button>
                  ))}
                  <span className={`ml-auto text-[8px] font-bold font-mono text-${statusCfg.color}`}>{statusCfg.label}</span>
                </div>

                {/* Note */}
                {editingNote === ch.ch ? (
                  <div className="space-y-1">
                    <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                      placeholder="Add revision note..."
                      className="w-full bg-background border border-border rounded px-2 py-1 text-[9px] font-sans text-foreground resize-none h-16 focus:outline-none focus:border-accent" />
                    <div className="flex gap-1">
                      <button onClick={() => saveNote(ch.ch)} className="px-2 py-0.5 bg-teal text-background rounded text-[8px] font-bold font-mono">Save</button>
                      <button onClick={() => setEditingNote(null)} className="px-2 py-0.5 border border-border rounded text-[8px] font-mono text-muted-foreground">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => openNote(ch.ch)}
                    className="w-full text-left text-[8px] font-sans italic text-muted-foreground hover:text-foreground transition-colors line-clamp-2 min-h-[16px]">
                    {note || <span className="opacity-50">+ Add note...</span>}
                  </button>
                )}
              </div>

              {/* Bug strip */}
              {bugs.length > 0 && (
                <div className="border-t border-border/40 px-3 py-1.5 flex gap-1 flex-wrap bg-background/50">
                  {bugs.map((b, i) => (
                    <span key={i} className={`text-[7px] px-1 py-0.5 rounded font-mono font-bold ${b.sev === "CRIT" ? "text-red bg-red/10 border border-red/20" : b.sev === "HIGH" ? "text-orange bg-orange/10 border border-orange/20" : "text-muted-foreground bg-secondary border border-border"}`}>
                      {b.sev}: {b.type}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {visibleChapters.length === 0 && (
        <div className="text-center py-8 text-xs text-muted-foreground font-mono">No chapters match current filters.</div>
      )}
    </div>
  );
}