import { useLocation } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import { STATS } from "@/lib/data";

export default function StatusBar() {
  const location = useLocation();
  const { activeTab } = useAppContext();

  const isOnDashboard = location.pathname === "/";
  const tabLabel = isOnDashboard ? activeTab.toUpperCase() : location.pathname.replace("/", "").toUpperCase() || "DASHBOARD";

  return (
    <div className="h-6 flex items-center gap-4 px-4 border-t border-border bg-card shrink-0 overflow-hidden">
      <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest shrink-0">
        {tabLabel}
      </span>
      <div className="flex-1 border-l border-border/50 pl-4 flex items-center gap-4 overflow-hidden">
        <StatusItem label="Ω" value={`${STATS.avgOmega} avg`} color="text-yellow-400" />
        <StatusItem label="Words" value={`${STATS.totalWords.toLocaleString()}`} color="text-blue-400" />
        <StatusItem label="Chapters" value={STATS.chapters} color="text-teal-400" />
        <StatusItem label="Flags" value={STATS.criticalErrors} color="text-red-400" />
        <StatusItem label="Pub Readiness" value={`${STATS.pubReadinessScore}%`} color="text-green-400" />
        <StatusItem label="Canon" value={`${STATS.canonScore}`} color="text-purple-400" />
        <StatusItem label="War Lit" value={`p${STATS.warLitPercentile}`} color="text-orange-400" />
      </div>
      <span className="text-[9px] font-mono text-muted-foreground shrink-0">
        LITCENTRAL v7 · {STATS.versionNote.split("·")[0].trim()}
      </span>
    </div>
  );
}

function StatusItem({ label, value, color }) {
  return (
    <span className="flex items-center gap-1 shrink-0">
      <span className="text-[9px] font-mono text-muted-foreground">{label}:</span>
      <span className={`text-[9px] font-mono font-bold ${color}`}>{value}</span>
    </span>
  );
}
