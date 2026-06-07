import { FLESH_CARDS } from "../../lib/data";

const PRESSURE_COLOR = {
  PEAK:"text-red border-red/40 bg-red/5",
  HIGH:"text-orange border-orange/40 bg-orange/5",
  MED:"text-gold border-gold/30 bg-gold/5",
  LOW:"text-teal border-teal/30 bg-teal/5",
  SACRED:"text-purple border-purple/40 bg-purple/5",
  INCOMPLETE:"text-muted-foreground border-border bg-secondary/30",
};

export default function FleshTab() {
  return (
    <div className="animate-slide-up">
      <div className="text-xs text-muted-foreground mb-4 font-sans">
        Flesh — reader somatic experience per chapter. Body/Mind/Soul scores + pressure classification.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {FLESH_CARDS.map(c => (
          <div key={c.ch} className={`rounded-lg border p-3 ${PRESSURE_COLOR[c.pressure]}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold font-mono text-muted-foreground">Ch{c.ch}</span>
              <span className={`text-[9px] font-black font-mono px-2 py-0.5 rounded-full border ${PRESSURE_COLOR[c.pressure]}`}>{c.pressure}</span>
            </div>
            <div className="text-[10px] text-foreground/80 font-sans leading-snug mb-2 italic">"{c.sensation}"</div>
            <div className="text-[9px] text-muted-foreground font-sans mb-2">{c.texture}</div>
            <div className="flex gap-2">
              <div className="text-center flex-1">
                <div className="text-xs font-black text-red font-mono">{c.bodyScore}</div>
                <div className="text-[8px] text-muted-foreground">Body</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xs font-black text-blue font-mono">{c.mindScore}</div>
                <div className="text-[8px] text-muted-foreground">Mind</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xs font-black text-gold font-mono">{c.soulScore}</div>
                <div className="text-[8px] text-muted-foreground">Soul</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}