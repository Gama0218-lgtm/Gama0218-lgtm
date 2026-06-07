import { Tv } from "lucide-react";

const PIPELINE = [
  { id: 1, title: "Deported Veteran Long-Form (Ramos)",    stage: "Edit",         tone: "gold"   },
  { id: 2, title: "Border Hub Field Cut #14",              stage: "Color",        tone: "orange" },
  { id: 3, title: "TruthEngine360 Brief: Reverse Strategy",stage: "Publish",      tone: "teal"   },
  { id: 4, title: "Podcast — Iglesia Frontera dialogue",   stage: "Mix",          tone: "purple" },
  { id: 5, title: "Short: Veterans Coalition SD interview",stage: "Captioning",   tone: "blue"   },
  { id: 6, title: "Series teaser — Exile Patriot",         stage: "Storyboard",   tone: "gold"   },
];

export default function MediaPipeline() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tv className="w-4 h-4 text-orange" />
        <h2 className="text-sm font-black font-mono text-orange tracking-widest">MEDIA + PODCAST PIPELINE</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PIPELINE.map((p) => (
          <div key={p.id} className={`rounded-lg border border-${p.tone}/30 bg-${p.tone}/5 p-3`}>
            <div className={`text-[10px] font-bold font-mono text-${p.tone}`}>{p.title}</div>
            <div className="text-[9px] font-mono text-muted-foreground mt-1">Stage: <span className="text-foreground">{p.stage}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
