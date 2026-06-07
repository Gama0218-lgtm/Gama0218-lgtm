import { useState } from "react";
import ChapterAuditBars from "./ChapterAuditBars";
import { base44 } from "@/api/base44Client";

export default function AuditProgressTab() {
  const [exporting, setExporting] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(null);
  const [exportError, setExportError] = useState(null);

  const handleExportToSheets = async () => {
    setExporting(true);
    setExportError(null);
    const res = await base44.functions.invoke("exportAuditToSheets", {});
    setExporting(false);
    if (res.data?.url) {
      setSheetUrl(res.data.url);
      window.open(res.data.url, "_blank");
    } else {
      setExportError("Export failed — check Google Sheets connector is authorized.");
    }
  };
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-teal/5 border border-teal/30 rounded-lg p-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="text-xl">📊</div>
          <div>
            <div className="text-sm font-black font-mono text-teal">AUDIT & MOTIF PROGRESS — Per-Chapter Coverage</div>
            <div className="text-[10px] text-muted-foreground font-sans">
              <span className="text-teal font-bold">Audit %</span> = omega scored + sub-metrics present + no critical bugs ·{" "}
              <span className="text-purple font-bold">Motif %</span> = how many of 8 tracked motifs have non-zero density in that chapter
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={handleExportToSheets}
            disabled={exporting}
            className="flex items-center gap-1.5 text-[8px] font-bold font-mono px-3 py-1.5 rounded border bg-teal/20 text-teal border-teal/40 hover:bg-teal/30 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {exporting ? "⏳ Exporting…" : "📤 Export to Google Sheets"}
          </button>
          {sheetUrl && (
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer"
              className="text-[7px] font-mono text-teal underline underline-offset-2 hover:text-teal/80">
              ↗ Open Sheet
            </a>
          )}
          {exportError && <div className="text-[7px] font-mono text-red max-w-[180px] text-right">{exportError}</div>}
        </div>
      </div>
      <ChapterAuditBars />
    </div>
  );
}