import { Network } from "lucide-react";

const EDGES = [
  { from: "AUMER Foundation",       to: "Exile Patriot Project",   weight: 0.92 },
  { from: "Exile Patriot Project",  to: "TruthEngine360 Channel",  weight: 0.88 },
  { from: "AUMER Foundation",       to: "Border Hub: Tijuana",     weight: 0.81 },
  { from: "VFW Local 1042",         to: "TruthEngine360 Channel",  weight: 0.68 },
  { from: "Iglesia Frontera",       to: "Border Hub: Juárez",      weight: 0.74 },
  { from: "Podcast Network LATAM",  to: "TruthEngine360 Channel",  weight: 0.79 },
];

export default function CrossBorderNetwork() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Network className="w-4 h-4 text-gold" />
        <h2 className="text-sm font-black font-mono text-gold tracking-widest">CROSS-BORDER NETWORK</h2>
      </div>
      <div className="rounded-lg border border-border bg-card/40">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[9px] font-bold font-mono text-muted-foreground border-b border-border">
          <span className="col-span-5">FROM</span>
          <span className="col-span-5">TO</span>
          <span className="col-span-2">WEIGHT</span>
        </div>
        {EDGES.map((e, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-mono border-b border-border last:border-b-0">
            <span className="col-span-5 text-foreground">{e.from}</span>
            <span className="col-span-5 text-foreground">{e.to}</span>
            <span className="col-span-2 text-gold font-bold">{e.weight.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
