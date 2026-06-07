import { useState } from "react";
import { CHAPTER_BUGS } from "../../lib/data";

const SEV_STYLE = {
  CRIT:"bg-red/10 border-red/30 text-red",
  HIGH:"bg-orange/10 border-orange/25 text-orange",
  MED:"bg-gold/10 border-gold/25 text-gold",
  LOW:"bg-teal/10 border-teal/25 text-teal",
};

export default function BugsTab() {
  const [filter, setFilter] = useState("ALL");
  const [bugs, setBugs] = useState(CHAPTER_BUGS);

  const counts = {CRIT:bugs.filter(b=>b.sev==="CRIT").length,HIGH:bugs.filter(b=>b.sev==="HIGH").length,MED:bugs.filter(b=>b.sev==="MED").length,LOW:bugs.filter(b=>b.sev==="LOW").length};
  const open = bugs.filter(b=>!b.fixed);
  const shown = filter === "ALL" ? open : open.filter(b=>b.sev===filter);

  return (
    <div className="animate-slide-up">
      <div className="flex gap-2 mb-4 flex-wrap">
        {["ALL","CRIT","HIGH","MED","LOW"].map(s => (
          <button key={s} onClick={()=>setFilter(s)}
            className={`px-3 py-1 rounded-md text-[10px] font-bold font-mono transition-colors border ${
              filter===s ? "bg-accent text-white border-accent" : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}>
            {s} {s!=="ALL" && `(${counts[s]||0})`}
          </button>
        ))}
        <div className="ml-auto text-[10px] text-muted-foreground font-mono self-center">{open.length} open bugs</div>
      </div>

      <div className="space-y-2">
        {shown.map((bug, i) => (
          <div key={i} className={`rounded-lg border p-3 flex items-start gap-3 ${SEV_STYLE[bug.sev]}`}>
            <div className="flex-shrink-0 text-center min-w-[40px]">
              <div className="text-base font-black font-mono">Ch{bug.ch}</div>
              <div className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full border mt-1 inline-block ${SEV_STYLE[bug.sev]}`}>{bug.sev}</div>
            </div>
            <div className="flex-1">
              <div className={`text-[9px] font-bold uppercase tracking-wider mb-1 font-mono opacity-60`}>{bug.type}</div>
              <div className="text-xs font-sans leading-snug">{bug.flag}</div>
            </div>
            <button
              onClick={()=>setBugs(prev=>prev.map((b,idx)=>idx===CHAPTER_BUGS.indexOf(bug)?{...b,fixed:true}:b))}
              className="flex-shrink-0 text-[9px] font-bold font-mono px-2 py-1 rounded-md bg-secondary/60 hover:bg-teal/20 hover:text-teal border border-border transition-colors"
            >
              Mark Fixed
            </button>
          </div>
        ))}
        {shown.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm font-sans">No open bugs for this severity.</div>
        )}
      </div>
    </div>
  );
}