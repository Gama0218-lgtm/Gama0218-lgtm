import { Shield } from "lucide-react";

const OPS = [
  { id: 1, code: "FO-014", region: "Tijuana",        team: "Bravo", status: "in_field",  detail: "Intake interviews · 3 pending" },
  { id: 2, code: "FO-015", region: "Juárez",         team: "Alpha", status: "scheduled", detail: "Iglesia Frontera handoff"      },
  { id: 3, code: "FO-016", region: "Nogales",        team: "Charlie", status: "in_field",detail: "Veterans intake clinic"        },
  { id: 4, code: "FO-017", region: "Matamoros",      team: "Delta", status: "watch",     detail: "Cartel chatter — pause"        },
];

const STATUS_TONE = { in_field: "teal", scheduled: "blue", watch: "gold", standdown: "red" };

export default function FieldOperations() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-red" />
        <h2 className="text-sm font-black font-mono text-red tracking-widest">FIELD OPERATIONS</h2>
      </div>
      <div className="rounded-lg border border-border bg-card/40">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[9px] font-bold font-mono text-muted-foreground border-b border-border">
          <span className="col-span-2">CODE</span>
          <span className="col-span-2">REGION</span>
          <span className="col-span-2">TEAM</span>
          <span className="col-span-2">STATUS</span>
          <span className="col-span-4">DETAIL</span>
        </div>
        {OPS.map((o) => (
          <div key={o.id} className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-mono border-b border-border last:border-b-0">
            <span className="col-span-2 text-foreground">{o.code}</span>
            <span className="col-span-2 text-foreground">{o.region}</span>
            <span className="col-span-2 text-muted-foreground">{o.team}</span>
            <span className={`col-span-2 text-${STATUS_TONE[o.status]}`}>{o.status.replace("_", " ").toUpperCase()}</span>
            <span className="col-span-4 text-muted-foreground">{o.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
