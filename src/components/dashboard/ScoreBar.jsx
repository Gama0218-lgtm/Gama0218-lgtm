const COLOR_MAP = {
  gold: "bg-gold",
  blue: "bg-blue",
  cyan: "bg-cyan",
  purple: "bg-purple",
  orange: "bg-orange",
  teal: "bg-teal",
  red: "bg-red",
};

const TEXT_MAP = {
  gold: "text-gold",
  blue: "text-blue",
  cyan: "text-cyan",
  purple: "text-purple",
  orange: "text-orange",
  teal: "text-teal",
  red: "text-red",
};

export default function ScoreBar({ label, value, maxValue = 115, color = "gold", displayValue }) {
  const pct = Math.min(100, (value / maxValue) * 100);
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <span className="text-[11px] text-muted-foreground min-w-[120px] font-sans">{label}</span>
      <div className="bg-secondary rounded-full h-[5px] flex-1 overflow-hidden">
        <div
          className={`h-full rounded-full ${COLOR_MAP[color]} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-bold font-mono min-w-[40px] text-right ${TEXT_MAP[color]}`}>
        {displayValue || value}
      </span>
    </div>
  );
}