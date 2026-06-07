import { Brain } from "lucide-react";

const BRIEFS = [
  { id: 1, label: "Narrative integrity",    score: 0.91, color: "teal"   },
  { id: 2, label: "Source diversity",       score: 0.78, color: "blue"   },
  { id: 3, label: "Counter-narrative load", score: 0.42, color: "gold"   },
  { id: 4, label: "Gatekeeper amplification", score: 0.31, color: "orange" },
  { id: 5, label: "Community pickup",       score: 0.87, color: "purple" },
];

export default function TruthEngine360Intel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-teal" />
        <h2 className="text-sm font-black font-mono text-teal tracking-widest">TRUTHENGINE360 INTEL</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {BRIEFS.map((b) => (
          <div key={b.id} className={`rounded-lg border border-${b.color}/30 bg-${b.color}/5 p-3`}>
            <div className={`text-[9px] font-mono text-${b.color} tracking-wider`}>{b.label.toUpperCase()}</div>
            <div className="text-2xl font-black font-mono text-foreground mt-1">{b.score.toFixed(2)}</div>
            <div className={`mt-2 h-1.5 w-full rounded-full bg-${b.color}/15 overflow-hidden`}>
              <div className={`h-full bg-${b.color}`} style={{ width: `${Math.round(b.score * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
