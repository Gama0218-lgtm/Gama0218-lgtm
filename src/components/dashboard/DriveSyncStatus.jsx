import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CloudIcon, RefreshCw, AlertCircle } from "lucide-react";

export default function DriveSyncStatus() {
  const { data: syncStates = [], isLoading } = useQuery({
    queryKey: ["sync-state"],
    queryFn: () => base44.entities.SyncState.list(),
    refetchInterval: 30_000,
  });

  const { data: runs = [] } = useQuery({
    queryKey: ["audit-runs-latest"],
    queryFn: () => base44.entities.AuditRun.list("-created_date", 1),
    refetchInterval: 30_000,
  });

  const sync = syncStates[0];
  const latestRun = runs[0];

  if (isLoading || !sync) return null;

  const lastSynced = sync.last_synced_at
    ? new Date(sync.last_synced_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  const isRunning = latestRun?.status === "running";
  const hasFile = !!sync.watched_file_id;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] font-mono transition-all ${
      isRunning
        ? "bg-blue/10 border-blue/30 text-blue"
        : hasFile
        ? "bg-teal/10 border-teal/20 text-teal"
        : "bg-secondary border-border text-muted-foreground"
    }`}>
      {isRunning ? (
        <RefreshCw className="h-3 w-3 animate-spin" />
      ) : hasFile ? (
        <CloudIcon className="h-3 w-3" />
      ) : (
        <AlertCircle className="h-3 w-3" />
      )}
      <span>
        {isRunning
          ? "AUDIT RUNNING..."
          : hasFile
          ? `DRIVE SYNC${lastSynced ? ` · ${lastSynced}` : " · WATCHING"}`
          : "WAITING FOR FIRST SAVE"}
      </span>
      {hasFile && sync.watched_file_name && (
        <span className="opacity-60 truncate max-w-[140px]">· {sync.watched_file_name}</span>
      )}
    </div>
  );
}