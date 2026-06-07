const ACCENT_MAP = {
  gold: "border-t-gold",
  blue: "border-t-blue",
  cyan: "border-t-cyan",
  purple: "border-t-purple",
  orange: "border-t-orange",
  teal: "border-t-teal",
  red: "border-t-red",
};

const LABEL_MAP = {
  gold: "text-gold",
  blue: "text-blue",
  cyan: "text-cyan",
  purple: "text-purple",
  orange: "text-orange",
  teal: "text-teal",
  red: "text-red",
};

export default function DashCard({ title, accent = "blue", children, className = "" }) {
  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 border-t-[3px] ${ACCENT_MAP[accent]} ${className}`}
    >
      {title && (
        <div className={`text-[10px] font-bold tracking-[0.1em] uppercase mb-3 font-mono ${LABEL_MAP[accent]}`}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}