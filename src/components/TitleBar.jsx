import { useAppContext } from "@/lib/AppContext";
import { FileDown } from "lucide-react";
import { STATS } from "@/lib/data";
import StatBox from "@/components/dashboard/StatBox";

export default function TitleBar() {
  const { setShowExport } = useAppContext();

  return (
    <div className="h-11 flex items-center gap-3 px-4 border-b border-border bg-card shrink-0">
      {/* Project identity */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-px h-4 bg-border shrink-0" />
        <span className="text-[13px] font-semibold font-mono truncate">
          SGT GEORGE RAMOS
        </span>
        <span className="text-[11px] text-muted-foreground font-sans font-normal shrink-0">·</span>
        <span className="text-[11px] text-muted-foreground font-sans font-normal truncate">
          THE MATHEMATICS OF VIETNAM
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stat pills */}
      <div className="flex gap-1.5 items-center shrink-0">
        <StatBox value={STATS.avgOmega} label="Ω" color="gold" />
        <StatBox value={`${Math.round(STATS.totalWords / 1000)}K`} label="Words" color="blue" />
        <StatBox value={`${STATS.daysPub}d`} label="Pub" color="red" />
      </div>

      {/* Actions */}
      <div className="flex gap-1 items-center shrink-0">
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-1 px-2 py-1 bg-gold text-background rounded text-[9px] font-black font-mono hover:bg-gold/80 transition-colors duration-150"
        >
          <FileDown className="w-2.5 h-2.5" />
          PDF
        </button>
      </div>
    </div>
  );
}
