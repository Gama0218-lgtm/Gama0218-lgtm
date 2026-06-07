import { Users } from "lucide-react";

const ROWS = [
  { id: 1, name: "Hector R.",      org: "Veterans Coalition SD",   group: "Chicano/Latino", priority: "high",   last: "2d" },
  { id: 2, name: "Maria L.",       org: "Border Caucus",           group: "Chicano/Latino", priority: "high",   last: "4d" },
  { id: 3, name: "Cmdr. Daniels",  org: "VFW Local 1042",          group: "Veterans",       priority: "medium", last: "1w" },
  { id: 4, name: "Rev. Aguilar",   org: "Iglesia Frontera",        group: "Faith",          priority: "medium", last: "5d" },
  { id: 5, name: "Sen. Aide K.",   org: "State Capitol",           group: "Political",      priority: "low",    last: "3w" },
  { id: 6, name: "Jorge T.",       org: "Podcast Network LATAM",   group: "Media",          priority: "high",   last: "1d" },
];

const PRIORITY_TONE = { high: "red", medium: "gold", low: "blue" };

export default function StakeholderCRM() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-teal" />
        <h2 className="text-sm font-black font-mono text-teal tracking-widest">STAKEHOLDER CRM</h2>
      </div>
      <div className="rounded-lg border border-border bg-card/40 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[9px] font-bold font-mono text-muted-foreground border-b border-border">
          <span className="col-span-3">CONTACT</span>
          <span className="col-span-3">ORG</span>
          <span className="col-span-2">GROUP</span>
          <span className="col-span-2">PRIORITY</span>
          <span className="col-span-2">LAST TOUCH</span>
        </div>
        {ROWS.map((r) => (
          <div key={r.id} className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-mono border-b border-border last:border-b-0">
            <span className="col-span-3 text-foreground">{r.name}</span>
            <span className="col-span-3 text-muted-foreground">{r.org}</span>
            <span className="col-span-2 text-teal">{r.group}</span>
            <span className={`col-span-2 text-${PRIORITY_TONE[r.priority]}`}>{r.priority.toUpperCase()}</span>
            <span className="col-span-2 text-muted-foreground">{r.last}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
