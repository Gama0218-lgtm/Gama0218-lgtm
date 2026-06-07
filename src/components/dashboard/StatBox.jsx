const COLOR_MAP = {
  gold: { bg: "bg-gold/10", border: "border-gold/25", text: "text-gold" },
  blue: { bg: "bg-blue/10", border: "border-blue/25", text: "text-blue" },
  cyan: { bg: "bg-cyan/10", border: "border-cyan/25", text: "text-cyan" },
  red: { bg: "bg-red/10", border: "border-red/25", text: "text-red" },
  orange: { bg: "bg-orange/10", border: "border-orange/25", text: "text-orange" },
  teal: { bg: "bg-teal/10", border: "border-teal/25", text: "text-teal" },
  purple: { bg: "bg-purple/10", border: "border-purple/25", text: "text-purple" },
};

export default function StatBox({ value, label, color = "gold" }) {
  const c = COLOR_MAP[color] || COLOR_MAP.gold;
  return (
    <div className={`text-center px-3 py-2 rounded-lg border ${c.bg} ${c.border} flex-shrink-0`}>
      <div className={`text-sm font-black font-mono ${c.text}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5 font-sans">{label}</div>
    </div>
  );
}