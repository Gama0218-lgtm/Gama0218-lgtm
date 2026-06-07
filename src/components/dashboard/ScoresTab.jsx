import DashCard from "./DashCard";
import ScoreBar from "./ScoreBar";
import { STATS, REGRESSION, SCORED_CHAPTERS } from "../../lib/data";

export default function ScoresTab() {
  const top12 = [...SCORED_CHAPTERS].sort((a, b) => b.omega - a.omega).slice(0, 12);

  return (
    <div className="animate-slide-up grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        <DashCard title="LITCENTRAL v2 Hybrid Formula" accent="gold">
          <div className="bg-background border border-border rounded-md p-3 mb-4 font-mono text-xs text-cyan leading-relaxed">
            Ω = 71.443 + 0.124(CLS) + 0.118(BIS) + 0.089(SII) + 0.067(MRF) &nbsp; R²=0.947
          </div>
          <ScoreBar label="Avg Omega" value={STATS.avgOmega} color="gold" />
          <ScoreBar label="Avg CLS (Cultural)" value={STATS.avgCLS} color="purple" />
          <ScoreBar label="Avg SII (Sensory)" value={STATS.avgSII} color="cyan" />
          <ScoreBar label="Avg BIS (Behavioral)" value={STATS.avgBIS} color="orange" />
          <ScoreBar label="CL-MoE Overall" value={STATS.clmoeOverall} maxValue={0.25} color="blue" displayValue="0.048" />
          <div className="mt-3 p-2.5 bg-teal/5 rounded-md text-xs text-teal font-sans">
            43 of 44 chapters scored Omega Elite — Avg Omega 107.3 — Peak: Ch38 Ω110
          </div>
        </DashCard>

        <DashCard title="SPSS Regression Coefficients" accent="purple">
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-background">
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-muted-foreground font-mono uppercase border-b-2 border-secondary">Variable</th>
                  <th className="px-3 py-2 text-center text-[10px] font-bold text-muted-foreground font-mono uppercase border-b-2 border-secondary">Coefficient</th>
                  <th className="px-3 py-2 text-center text-[10px] font-bold text-muted-foreground font-mono uppercase border-b-2 border-secondary">p-value</th>
                  <th className="px-3 py-2 text-center text-[10px] font-bold text-muted-foreground font-mono uppercase border-b-2 border-secondary">Sig</th>
                </tr>
              </thead>
              <tbody>
                {REGRESSION.map((r, i) => (
                  <tr key={i} className={`${i % 2 === 0 ? "bg-card" : "bg-background"}`}>
                    <td className="px-3 py-2 text-xs text-foreground/80 font-sans">{r.variable}</td>
                    <td className={`px-3 py-2 text-center text-xs font-bold font-mono text-${r.color}`}>{r.coeff}</td>
                    <td className="px-3 py-2 text-center text-xs text-cyan font-mono">{r.pValue}</td>
                    <td className="px-3 py-2 text-center text-xs text-gold font-mono">{r.sig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground font-sans">
            R²=0.947 | Adjusted R²=0.941 | RMSE=1.84 | F=183.2 p&lt;0.001
          </div>
        </DashCard>
      </div>

      <div>
        <DashCard title="Top 12 Chapters by Omega" accent="blue">
          <div className="space-y-0">
            {top12.map((ch, i) => (
              <div key={ch.ch} className="flex items-center gap-3 py-2 border-b border-border/20 group">
                <span className="text-[10px] text-muted-foreground/60 min-w-[20px] font-mono">{i + 1}.</span>
                <span className="text-xs text-foreground flex-1 font-sans group-hover:text-gold transition-colors">
                  Ch{ch.ch} {ch.title}
                </span>
                <span className="text-sm font-black text-gold font-mono">Ω{ch.omega}</span>
              </div>
            ))}
          </div>
        </DashCard>
      </div>
    </div>
  );
}