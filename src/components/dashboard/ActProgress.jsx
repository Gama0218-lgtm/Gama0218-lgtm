const COLOR_MAP = {
  gold: { bar: "bg-gold", text: "text-gold" },
  blue: { bar: "bg-blue", text: "text-blue" },
  cyan: { bar: "bg-cyan", text: "text-cyan" },
};

export default function ActProgress({ name, chapters, scored, avgOmega, color }) {
  const c = COLOR_MAP[color] || COLOR_MAP.gold;
  const pct = (avgOmega / 115) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-foreground/70 font-sans">{name} ({chapters} ch)</span>
        <span className={`text-xs font-bold font-mono ${c.text}`}>
          Ω{avgOmega} — {scored}/{chapters} Elite
        </span>
      </div>
      <div className="bg-secondary rounded-full h-[5px] overflow-hidden">
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}