import { useState } from "react";
import DashCard from "./DashCard";
import { CHAPTERS, CHAPTER_BUGS } from "../../lib/data";

const SEV_CONFIG = {
  CRITICAL: { color: "red",    bg: "bg-red/5",    border: "border-red/30"    },
  CRIT:     { color: "red",    bg: "bg-red/5",    border: "border-red/30"    },
  HIGH:     { color: "orange", bg: "bg-orange/5", border: "border-orange/30" },
  MED:      { color: "gold",   bg: "bg-gold/5",   border: "border-gold/30"   },
  LOW:      { color: "blue",   bg: "bg-blue/5",   border: "border-blue/30"   },
};

const SHORT_CHAPTERS = CHAPTERS.filter(c => !c.isMissing && c.words > 0 && c.words < 5000);
const MISSING_CHAPTERS = CHAPTERS.filter(c => c.isMissing);

export default function FlagsTab() {
  const [filter, setFilter] = useState("ALL");

  const sevOrder = ["CRITICAL","HIGH","MED","LOW"];
  const bugs = filter === "ALL" ? CHAPTER_BUGS : CHAPTER_BUGS.filter(b => b.sev === filter);

  const counts = sevOrder.reduce((acc, s) => {
    acc[s] = CHAPTER_BUGS.filter(b => b.sev === s).length;
    return acc;
  }, {});

  return (
    <div className="animate-slide-up space-y-4">

      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sevOrder.map(s => {
          const cfg = SEV_CONFIG[s];
          return (
            <button key={s} onClick={() => setFilter(filter === s ? "ALL" : s)}
              className={`p-3 rounded-lg border text-center transition-all ${filter === s ? `${cfg.bg} ${cfg.border}` : "bg-card border-border hover:border-muted-foreground"}`}>
              <div className={`text-2xl font-black font-mono text-${cfg.color}`}>{counts[s]}</div>
              <div className={`text-[9px] font-bold font-mono text-${cfg.color} mt-0.5`}>{s}</div>
            </button>
          );
        })}
      </div>

      {/* Bug Flags */}
      <DashCard title={`Chapter Bugs — ${filter === "ALL" ? "All" : filter} (${bugs.length})`} accent="red">
        <div className="space-y-2">
          {bugs.map((b, i) => {
            const cfg = SEV_CONFIG[b.sev];
            return (
              <div key={i} className={`p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-muted-foreground font-mono min-w-[40px]">Ch.{b.ch}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border font-mono text-${cfg.color} border-${cfg.color}/40 bg-${cfg.color}/10`}>{b.sev}</span>
                  <span className="text-[9px] text-muted-foreground font-mono">{b.type}</span>
                  {b.fixed && <span className="text-[9px] text-teal font-bold ml-auto">FIXED</span>}
                </div>
                <div className="text-xs text-foreground/80 font-sans">{b.flag}</div>
              </div>
            );
          })}
          {bugs.length === 0 && <div className="text-xs text-teal text-center py-4">No bugs at this severity level.</div>}
        </div>
      </DashCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Missing Chapter */}
        <DashCard title="Missing Chapter" accent="red">
          {MISSING_CHAPTERS.map(ch => (
            <div key={ch.ch} className="p-3 bg-red/5 border border-red/30 rounded-lg">
              <div className="text-sm font-black text-red font-mono mb-1">Ch.{ch.ch} — {ch.title}</div>
              <div className="text-xs text-muted-foreground font-sans">{ch.fix}</div>
            </div>
          ))}
        </DashCard>

        {/* Short Chapters */}
        <DashCard title="Short Chapters (below 5,000w)" accent="gold">
          <div className="space-y-2">
            {SHORT_CHAPTERS.map(ch => (
              <div key={ch.ch} className="flex items-center gap-3 p-2 bg-background rounded border border-border">
                <span className="text-xs font-bold text-muted-foreground font-mono min-w-[40px]">Ch.{ch.ch}</span>
                <span className="text-xs text-foreground/80 flex-1 font-sans">{ch.title}</span>
                <span className="text-sm font-black font-mono text-gold">{ch.words.toLocaleString()}w</span>
                <span className="text-[9px] text-orange font-bold">{(5000 - ch.words).toLocaleString()} short</span>
              </div>
            ))}
            {SHORT_CHAPTERS.length === 0 && <div className="text-xs text-teal text-center py-3">All scored chapters above 5,000 words.</div>}
          </div>
        </DashCard>
      </div>
    </div>
  );
}