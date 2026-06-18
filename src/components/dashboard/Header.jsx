import StatBox from "./StatBox";
import { Zap } from "lucide-react";
import { STATS } from "../../lib/data";
import { FileDown, TrendingUp, FileText, Users, Target, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ onExport }) {
  const navigate = useNavigate();
  return (
    <div className="bg-card border-b border-border px-4 md:px-6 py-3 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-bold tracking-[0.14em] text-gold font-mono uppercase">
            AUMER FOUNDATION · TRUTHENGINE360 · LITCENTRAL v7 · {STATS.chapters} CHAPTERS · v12 AUDIT · MAY 22 2026
          </div>
          <div className="text-base font-black font-mono mt-0.5 truncate">
            SGT GEORGE RAMOS{" "}
            <span className="text-muted-foreground font-normal text-xs font-sans">
              THE MATHEMATICS OF VIETNAM
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <StatBox value={STATS.avgOmega} label="Avg Omega" color="gold" />
          <StatBox value={`${STATS.elite} ★`} label="Omega Elite" color="gold" />
          <StatBox value={`${Math.round(STATS.totalWords/1000)}K`} label="Words" color="blue" />
          <StatBox value={`${STATS.chapters} Ch`} label="Total" color="teal" />
          <StatBox value={`${STATS.daysPub}d`} label="To Pub" color="red" />
          <StatBox value={STATS.daysCHC === 0 ? "LIVE" : `${STATS.daysCHC}d`} label="To CHC" color="orange" />
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-purple/40 text-purple rounded-lg text-[10px] font-black font-mono hover:bg-purple/10 transition-all"
            onClick={() => navigate("/lit-intel-report")}
          >
            <FileText className="w-3 h-3" />
            Intel Report
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-orange/40 text-orange rounded-lg text-[10px] font-black font-mono hover:bg-orange/10 transition-all"
            onClick={() => navigate("/stakeholders")}
          >
            <Users className="w-3 h-3" />
            Directory
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-red/40 text-red rounded-lg text-[10px] font-black font-mono hover:bg-red/10 transition-all"
            onClick={() => navigate("/sprints")}
          >
            <Target className="w-3 h-3" />
            Sprints
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-orange/40 text-orange rounded-lg text-[10px] font-black font-mono hover:bg-orange/10 transition-all"
            onClick={() => navigate("/jams")}
          >
            <Zap className="w-3 h-3" />
            JAMNet
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/40 text-gold rounded-lg text-[10px] font-black font-mono hover:bg-gold/10 transition-all"
            onClick={() => navigate("/prompt-master")}
          >
            <BookOpen className="w-3 h-3" />
            Prompt Master
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-teal/40 text-teal rounded-lg text-[10px] font-black font-mono hover:bg-teal/10 transition-all"
            onClick={() => navigate("/market-intelligence")}
          >
            <TrendingUp className="w-3 h-3" />
            Market Intel
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-background rounded-lg text-[10px] font-black font-mono hover:bg-gold/80 transition-all"
          >
            <FileDown className="w-3 h-3" />
            PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}