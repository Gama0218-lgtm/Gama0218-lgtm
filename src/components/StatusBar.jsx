import { useLocation } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext";
import { STATS } from "@/lib/data";

export default function StatusBar() {
  const location = useLocation();
  const { activeTab } = useAppContext();

  const isOnDashboard = location.pathname === "/";
  const tabLabel = isOnDashboard ? activeTab : location.pathname.replace("/", "") || "dashboard";

  return (
    <div className="h-5 flex items-center gap-4 px-4 border-t border-border bg-card shrink-0 overflow-hidden">
      <span className="text-[10px] font-medium text-muted-foreground shrink-0">
        {tabLabel}
      </span>
      <div className="flex-1 border-l border-border/50 pl-4 flex items-center gap-4 overflow-hidden">
        <StatusItem label="Ω" value={`${STATS.avgOmega}`} />
        <StatusItem label="Words" value={`${STATS.totalWords.toLocaleString()}`} />
        <StatusItem label="Pub" value={`${STATS.pubReadinessScore}%`} />
        <StatusItem label="War Lit" value={`p${STATS.warLitPercentile}`} />
      </div>
    </div>
  );
}

function StatusItem({ label, value }) {
  return (
    <span className="flex items-center gap-1 shrink-0 text-[9px] font-mono">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground/80">{value}</span>
    </span>
  );
}
