import DashCard from "./DashCard";
import { Activity, BookOpen, Database, Zap, Clock, CheckCircle, AlertCircle, Circle } from "lucide-react";

const STATUS_ICON = {
  LIVE:     <span className="flex h-2 w-2 rounded-full bg-teal animate-pulse" />,
  ACTIVE:   <span className="flex h-2 w-2 rounded-full bg-teal" />,
  PENDING:  <span className="flex h-2 w-2 rounded-full bg-gold" />,
  BLOCKED:  <span className="flex h-2 w-2 rounded-full bg-red" />,
  COMPLETE: <span className="flex h-2 w-2 rounded-full bg-blue" />,
};

function StatusRow({ label, status, detail, color = "foreground" }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0">
      <div className="mt-1">{STATUS_ICON[status] || STATUS_ICON.PENDING}</div>
      <div className="flex-1">
        <div className={`text-xs font-bold font-mono text-${color}`}>{label}</div>
        {detail && <div className="text-[10px] text-muted-foreground font-sans mt-0.5">{detail}</div>}
      </div>
      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${
        status === "LIVE"     ? "text-teal border-teal/40 bg-teal/10" :
        status === "ACTIVE"   ? "text-teal border-teal/40 bg-teal/10" :
        status === "COMPLETE" ? "text-blue border-blue/40 bg-blue/10" :
        status === "BLOCKED"  ? "text-red border-red/40 bg-red/10" :
                                "text-gold border-gold/40 bg-gold/10"
      }`}>{status}</span>
    </div>
  );
}

function PlatformCard({ title, subtitle, accent, icon: Icon, children }) {
  return (
    <DashCard title={title} accent={accent}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-md bg-${accent}/10 border border-${accent}/20`}>
          <Icon className={`h-4 w-4 text-${accent}`} />
        </div>
        <div className="text-[10px] text-muted-foreground font-sans">{subtitle}</div>
      </div>
      {children}
    </DashCard>
  );
}

export default function PlatformTab() {
  return (
    <div className="animate-slide-up space-y-4">

      {/* Banner */}
      <div className="bg-secondary/40 border border-border rounded-lg p-4 flex items-center gap-4">
        <div className="text-xs font-black font-mono text-foreground tracking-widest">DUAL PLATFORM OPERATIONS</div>
        <div className="flex-1 h-px bg-border" />
        <div className="flex items-center gap-2">
          {STATUS_ICON.LIVE}
          <span className="text-[10px] font-mono text-teal">BOTH PLATFORMS ACTIVE — 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* === PLATFORM 1: SGT GEORGE RAMOS === */}
        <PlatformCard
          title="SGT George Ramos Platform"
          subtitle="The Mathematics of Vietnam — Manuscript & Publication Pipeline"
          accent="gold"
          icon={BookOpen}
        >
          <div className="mb-3 p-3 rounded-md bg-gold/5 border border-gold/20">
            <div className="text-xs font-black font-mono text-gold">THE MATHEMATICS OF VIETNAM</div>
            <div className="text-[10px] text-muted-foreground font-sans mt-1">
              44 chapters · 240,278 words · 43/43 Omega Elite · LITCENTRAL v7
            </div>
          </div>

          <StatusRow label="Manuscript v5 Audit" status="COMPLETE" detail="All 44 chapters confirmed — Ch39 only absent chapter" color="foreground" />
          <StatusRow label="LITCENTRAL v7 Dashboard" status="LIVE" detail="Real-time scoring, pacing, emotion & arc tracking" color="gold" />
          <StatusRow label="CHC Congressional Briefing" status="PENDING" detail="May 18, 2026 — calendar confirmed — 47 days out" color="gold" />
          <StatusRow label="Ch40 Prayer Scene Completion" status="BLOCKED" detail="2,604w vs 5,000w target — Ramos bathroom prayer missing" color="red" />
          <StatusRow label="Joshua Sagasta Act II–III Arc" status="PENDING" detail="One scene needed in Ch.18–20 range" />
          <StatusRow label="Publication Pipeline" status="ACTIVE" detail="60 days to publication date" color="teal" />

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Omega Avg", value: "107.3", color: "gold" },
              { label: "Total Words", value: "240K", color: "teal" },
              { label: "Days to Pub", value: "60d", color: "red" },
            ].map((m) => (
              <div key={m.label} className={`p-2 rounded-md bg-${m.color}/5 border border-${m.color}/20 text-center`}>
                <div className={`text-sm font-black font-mono text-${m.color}`}>{m.value}</div>
                <div className="text-[9px] text-muted-foreground font-mono">{m.label}</div>
              </div>
            ))}
          </div>
        </PlatformCard>

        {/* === PLATFORM 2: TRUTHENGINE360 === */}
        <PlatformCard
          title="TruthEngine360 Platform"
          subtitle="Chicano Vietnam Casualty Undercounting — Forensic Research Engine"
          accent="purple"
          icon={Database}
        >
          <div className="mb-3 p-3 rounded-md bg-purple/5 border border-purple/20">
            <div className="text-xs font-black font-mono text-purple">TRUTHENGINE360 — FORENSIC DATA</div>
            <div className="text-[10px] text-muted-foreground font-sans mt-1">
              7 convergence streams · DCAS 58,220 records · R²=0.947 regression confirmed
            </div>
          </div>

          <StatusRow label="DCAS Primary Analysis" status="COMPLETE" detail="349 coded Hispanic of 58,220 (0.60%) — core anomaly documented" color="foreground" />
          <StatusRow label="7-Stream Convergence Model" status="ACTIVE" detail="Guzman · LAE · NARA · Catholic proxy · Geographic · Durazo" color="purple" />
          <StatusRow label="Durazo Dissertation Integration" status="COMPLETE" detail="Stream 7 — first qualitative validation via semi-structured interviews" color="blue" />
          <StatusRow label="FOIA Pipeline — 3 OVERDUE" status="BLOCKED" detail="VA BIRLS · DHS ENFORCE · INAI Mexico — all overdue" color="red" />
          <StatusRow label="n8n Workflow Automation" status="LIVE" detail="qt360.app.n8n.cloud — 3 workflows active — PID 6628" color="teal" />
          <StatusRow label="CHC Evidence Package" status="PENDING" detail="Briefing deck for May 18 — TruthEngine360 forensic summary" color="gold" />

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "DCAS Records", value: "58.2K", color: "purple" },
              { label: "Streams", value: "7", color: "blue" },
              { label: "FOIAs Due", value: "3", color: "red" },
            ].map((m) => (
              <div key={m.label} className={`p-2 rounded-md bg-${m.color}/5 border border-${m.color}/20 text-center`}>
                <div className={`text-sm font-black font-mono text-${m.color}`}>{m.value}</div>
                <div className="text-[9px] text-muted-foreground font-mono">{m.label}</div>
              </div>
            ))}
          </div>
        </PlatformCard>
      </div>

      {/* Shared Infrastructure */}
      <DashCard title="Shared Platform Infrastructure" accent="teal">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "n8n Automation", detail: "qt360.app.n8n.cloud · 3 active workflows", status: "LIVE", color: "teal" },
            { label: "LITCENTRAL v7", detail: "Both platforms data-linked via unified schema", status: "LIVE", color: "gold" },
            { label: "CHC May 18 Deadline", detail: "Joint deliverable — manuscript + forensic brief", status: "PENDING", color: "purple" },
          ].map((item, i) => (
            <div key={i} className={`p-3 rounded-lg border border-${item.color}/25 bg-${item.color}/5`}>
              <div className="flex items-center gap-2 mb-1">
                {STATUS_ICON[item.status]}
                <span className={`text-xs font-bold font-mono text-${item.color}`}>{item.label}</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-sans">{item.detail}</div>
            </div>
          ))}
        </div>
      </DashCard>
    </div>
  );
}