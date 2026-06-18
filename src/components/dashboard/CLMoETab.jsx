import DashCard from "./DashCard";
import { SCORED_CHAPTERS } from "../../lib/data";

export default function CLMoETab() {
  return (
    <div className="animate-slide-up">
      {/* Hero */}
      <div className="bg-purple/5 border border-purple/20 rounded-lg p-5 mb-5">
        <div className="text-lg font-black font-mono mb-1">CL-MoE = 1 − (Ω-adjusted / Ω-raw)</div>
        <div className="text-xs text-foreground/60 font-sans mb-4">
          Chicano Margin of Era — corrects Marlowe mainstream baseline for Chicano cultural context
        </div>
        <div className="flex gap-3 flex-wrap">
          <MetricPill value="0.048" label="v5 Overall" color="teal" large />
          <MetricPill value="MAINSTREAM READY" label="Verdict" color="teal" />
          <MetricPill value="0.18" label="Threshold" color="gold" />
          <MetricPill value="0" label="Above threshold" color="teal" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashCard title="CL-MoE by Chapter" accent="purple">
          <div className="max-h-[550px] overflow-y-auto pr-1 space-y-1.5">
            {SCORED_CHAPTERS.map((ch) => (
              <div key={ch.ch} className="flex items-center gap-2 group">
                <span className="text-[9px] text-muted-foreground/50 min-w-[30px] font-mono">Ch{ch.ch}</span>
                <span className="text-[10px] text-muted-foreground min-w-[90px] truncate font-sans">
                  {ch.title.substring(0, 14)}
                </span>
                <div className="bg-secondary rounded-full h-[4px] flex-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan transition-all duration-500"
                    style={{ width: `${(ch.clmoe / 0.18) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-cyan font-mono min-w-[36px] text-right">
                  {ch.clmoe}
                </span>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard title="CL-MoE Distribution" accent="blue">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background rounded-lg p-4 border border-border text-center">
                <div className="text-2xl font-black text-cyan font-mono">0.048</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-1">Mean CL-MoE</div>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border text-center">
                <div className="text-2xl font-black text-gold font-mono">0.079</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-1">Max (Ch34)</div>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border text-center">
                <div className="text-2xl font-black text-teal font-mono">0.040</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-1">Min (multiple)</div>
              </div>
              <div className="bg-background rounded-lg p-4 border border-border text-center">
                <div className="text-2xl font-black text-teal font-mono">0</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-1">Above 0.18</div>
              </div>
            </div>
            <div className="bg-teal/5 border border-teal/20 rounded-md p-3 text-xs text-teal font-sans">
              All 43 chapters are well below the 0.18 threshold. The manuscript carries authentic Chicano cultural DNA while remaining fully accessible to mainstream readership.
            </div>
          </div>
        </DashCard>
      </div>
    </div>
  );
}

function MetricPill({ value, label, color = "teal", large = false }) {
  const colorClasses = {
    teal: "bg-teal/10 border-teal/25",
    gold: "bg-gold/10 border-gold/25",
  };
  const textClasses = {
    teal: "text-teal",
    gold: "text-gold",
  };
  return (
    <div className={`rounded-lg border px-4 py-2 text-center ${colorClasses[color]}`}>
      <div className={`${large ? "text-2xl" : "text-base"} font-black font-mono ${textClasses[color]}`}>
        {value}
      </div>
      <div className="text-[9px] text-muted-foreground font-sans mt-0.5">{label}</div>
    </div>
  );
}