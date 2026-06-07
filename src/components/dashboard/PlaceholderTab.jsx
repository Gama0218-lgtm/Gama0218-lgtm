import { Lock } from "lucide-react";

export default function PlaceholderTab({ name }) {
  return (
    <div className="animate-slide-up flex flex-col items-center justify-center py-20">
      <div className="w-14 h-14 rounded-xl bg-secondary/60 flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-muted-foreground/50" />
      </div>
      <div className="text-sm font-bold text-foreground/60 font-mono">{name}</div>
      <div className="text-xs text-muted-foreground font-sans mt-1">Module pending — data pipeline in progress</div>
    </div>
  );
}