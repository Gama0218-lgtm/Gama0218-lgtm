export default function ChapterListItem({ ch, title, omega, isNew, isMissing }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-border/20 group">
      <span className="text-[10px] text-muted-foreground min-w-[30px] font-mono">Ch{ch}</span>
      <span className="text-xs text-foreground/80 flex-1 font-sans truncate group-hover:text-foreground transition-colors">
        {title}
        {isNew && (
          <span className="ml-2 inline-flex items-center px-1.5 py-0 rounded text-[8px] font-bold bg-teal/15 text-teal border border-teal/30">
            NEW
          </span>
        )}
      </span>
      {isMissing ? (
        <span className="text-xs font-black text-red font-mono">—</span>
      ) : (
        <span className="text-sm font-black text-gold font-mono">Ω{omega}</span>
      )}
    </div>
  );
}