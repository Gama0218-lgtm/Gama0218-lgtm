const SEVERITY_STYLES = {
  critical: { bg: "bg-red/5", border: "border-red/30", title: "text-red" },
  warning: { bg: "bg-orange/5", border: "border-orange/30", title: "text-orange" },
  caution: { bg: "bg-gold/5", border: "border-gold/30", title: "text-gold" },
};

export default function ActionItem({ title, desc, severity = "critical" }) {
  const s = SEVERITY_STYLES[severity] || SEVERITY_STYLES.critical;
  return (
    <div className={`p-3 rounded-lg border mb-2 ${s.bg} ${s.border}`}>
      <div className={`text-xs font-bold font-mono ${s.title}`}>{title}</div>
      <div className="text-[11px] text-muted-foreground mt-1 font-sans">{desc}</div>
    </div>
  );
}