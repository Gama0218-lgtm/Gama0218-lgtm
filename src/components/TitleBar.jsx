import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import { FileDown, FileText } from "lucide-react";
import { STATS } from "@/lib/data";
import StatBox from "@/components/dashboard/StatBox";

export default function TitleBar() {
  const navigate = useNavigate();
  const { setShowExport } = useAppContext();

  return (
    <div className="h-11 flex items-center gap-3 px-4 border-b border-border bg-card shrink-0">
      {/* Project identity */}
      <div className="min-w-0">
        <div className="text-[8px] font-bold tracking-[0.14em] text-gold font-mono uppercase leading-none">
          AUMER FOUNDATION · TRUTHENGINE360 · LITCENTRAL v7
        </div>
        <div className="text-[11px] font-black font-mono leading-none mt-0.5 truncate">
          SGT GEORGE RAMOS{" "}
          <span className="text-muted-foreground font-normal text-[9px] font-sans">
            THE MATHEMATICS OF VIETNAM
          </span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stat pills */}
      <div className="flex gap-1.5 items-center shrink-0">
        <StatBox value={STATS.avgOmega} label="Ω" color="gold" />
        <StatBox value={`${Math.round(STATS.totalWords / 1000)}K`} label="Words" color="blue" />
        <StatBox value={`${STATS.chapters} Ch`} label="Total" color="teal" />
        <StatBox value={`${STATS.daysPub}d`} label="Pub" color="red" />
        <StatBox value={STATS.daysCHC === 0 ? "LIVE" : `${STATS.daysCHC}d`} label="CHC" color="orange" />
      </div>

      {/* Actions */}
      <div className="flex gap-1 items-center shrink-0">
        <button
          onClick={() => navigate("/lit-intel-report")}
          className="flex items-center gap-1 px-2 py-1 border border-purple/40 text-purple rounded text-[9px] font-black font-mono hover:bg-purple/10 transition-all"
        >
          <FileText className="w-2.5 h-2.5" />
          Intel Report
        </button>
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-1 px-2 py-1 bg-gold text-background rounded text-[9px] font-black font-mono hover:bg-gold/80 transition-all"
        >
          <FileDown className="w-2.5 h-2.5" />
          PDF
        </button>
      </div>
    </div>
  );
}
