import ChapterAuditBars from "./ChapterAuditBars";

export default function AuditProgressTab() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-teal/5 border border-teal/30 rounded-lg p-3 flex items-start gap-3">
        <div className="text-xl">📊</div>
        <div>
          <div className="text-sm font-black font-mono text-teal">AUDIT & MOTIF PROGRESS — Per-Chapter Coverage</div>
          <div className="text-[10px] text-muted-foreground font-sans">
            <span className="text-teal font-bold">Audit %</span> = omega scored + sub-metrics present + no critical bugs ·{" "}
            <span className="text-purple font-bold">Motif %</span> = how many of 8 tracked motifs have non-zero density in that chapter
          </div>
        </div>
      </div>
      <ChapterAuditBars />
    </div>
  );
}