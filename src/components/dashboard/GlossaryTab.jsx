import { useState } from "react";
import { GLOSSARY } from "../../lib/data";

const CAT_COLOR = {
  yaqui:"text-teal border-teal/25 bg-teal/5",
  military:"text-blue border-blue/25 bg-blue/5",
  legal:"text-red border-red/25 bg-red/5",
  spanish:"text-gold border-gold/25 bg-gold/5",
  manuscript:"text-purple border-purple/25 bg-purple/5",
};

export default function GlossaryTab() {
  const [cat, setCat] = useState("ALL");
  const [search, setSearch] = useState("");

  const cats = ["ALL","yaqui","military","legal","spanish","manuscript"];
  const filtered = GLOSSARY.filter(g =>
    (cat === "ALL" || g.cat === cat) &&
    (g.term.toLowerCase().includes(search.toLowerCase()) || g.def.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-slide-up">
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        {cats.map(c => (
          <button key={c} onClick={()=>setCat(c)}
            className={`px-3 py-1 rounded-md text-[10px] font-bold font-mono transition-colors border ${
              cat===c ? "bg-accent text-white border-accent" : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            }`}>
            {c.toUpperCase()}
          </button>
        ))}
        <input
          className="ml-auto bg-secondary border border-border rounded-md px-3 py-1 text-xs font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent w-48"
          placeholder="Search terms..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filtered.map((g, i) => (
          <div key={i} className={`rounded-lg border p-3 ${CAT_COLOR[g.cat]}`}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="text-xs font-black font-mono">{g.term}</div>
              <div className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full border flex-shrink-0 ${CAT_COLOR[g.cat]}`}>{g.cat}</div>
            </div>
            <div className="text-[10px] text-foreground/70 font-sans leading-snug mb-1">{g.def}</div>
            {g.chapters && (
              <div className="flex gap-1 flex-wrap mt-1">
                {g.chapters.map(c => (
                  <span key={c} className="text-[8px] bg-secondary/60 px-1.5 py-0.5 rounded font-mono text-muted-foreground">Ch{c}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}