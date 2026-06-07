import { BarChart2 } from "lucide-react";

const COHORTS = [
  { id: "lat",  name: "Chicano/Latino", I: 0.94, T: 0.90, lambda: 0.45, psi: 0.91 },
  { id: "vet",  name: "Veterans",       I: 0.86, T: 0.82, lambda: 0.50, psi: 0.83 },
  { id: "fait", name: "Faith",          I: 0.72, T: 0.78, lambda: 0.40, psi: 0.71 },
  { id: "med",  name: "Media (Latino)", I: 0.81, T: 0.74, lambda: 0.55, psi: 0.76 },
  { id: "pol",  name: "Political Aides",I: 0.55, T: 0.61, lambda: 0.30, psi: 0.52 },
];

export default function SPSSVectors() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-blue" />
        <h2 className="text-sm font-black font-mono text-blue tracking-widest">SPSS BEHAVIORAL VECTORS</h2>
      </div>
      <div className="rounded-lg border border-border bg-card/40">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[9px] font-bold font-mono text-muted-foreground border-b border-border">
          <span className="col-span-4">COHORT</span>
          <span className="col-span-2">I (identity)</span>
          <span className="col-span-2">T (trust)</span>
          <span className="col-span-2">λ (latency)</span>
          <span className="col-span-2">Ψ(t)</span>
        </div>
        {COHORTS.map((c) => (
          <div key={c.id} className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-mono border-b border-border last:border-b-0">
            <span className="col-span-4 text-foreground">{c.name}</span>
            <span className="col-span-2 text-teal">{c.I.toFixed(2)}</span>
            <span className="col-span-2 text-purple">{c.T.toFixed(2)}</span>
            <span className="col-span-2 text-gold">{c.lambda.toFixed(2)}</span>
            <span className="col-span-2 text-blue font-bold">{c.psi.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
