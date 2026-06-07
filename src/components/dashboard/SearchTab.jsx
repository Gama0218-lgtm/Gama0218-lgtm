import { useState, useMemo } from "react";
import DashCard from "./DashCard";
import { CHAPTERS, GLOSSARY, CHAPTER_BUGS, CHARACTER_BIBLE, QUICK_ACTIONS } from "../../lib/data";

const ALL_ENTRIES = [
  ...CHAPTERS.filter(c => !c.isMissing).map(c => ({
    type: "Chapter",
    color: "gold",
    title: `Ch.${c.ch}: ${c.title}`,
    subtitle: `Act ${c.act} · Ω${c.omega} · ${c.words?.toLocaleString()}w · ${c.tier}`,
    tags: [c.title.toLowerCase(), `ch${c.ch}`, `act ${c.act.toLowerCase()}`, c.tier?.toLowerCase(), `omega${c.omega}`],
    detail: c.fix,
  })),
  ...GLOSSARY.map(g => ({
    type: "Glossary",
    color: "teal",
    title: g.term,
    subtitle: `[${g.cat}] — Ch.${g.chapters?.join(", ")}`,
    tags: [g.term.toLowerCase(), g.cat, g.def.toLowerCase()],
    detail: g.def,
  })),
  ...CHAPTER_BUGS.map(b => ({
    type: "Bug",
    color: b.sev === "CRITICAL" ? "red" : b.sev === "HIGH" ? "orange" : "gold",
    title: `Ch.${b.ch} Bug: ${b.type}`,
    subtitle: `Severity: ${b.sev}`,
    tags: [`ch${b.ch}`, b.type, b.sev.toLowerCase(), b.flag.toLowerCase()],
    detail: b.flag,
  })),
  ...CHARACTER_BIBLE.map(c => ({
    type: "Character",
    color: c.color,
    title: c.name,
    subtitle: `Arc: ${c.arc} · CL-MoE: ${c.clmoe}`,
    tags: [c.name.toLowerCase(), c.arc.toLowerCase(), c.id],
    detail: c.note,
  })),
  ...QUICK_ACTIONS.map(a => ({
    type: "Action",
    color: "red",
    title: `Priority ${a.priority}: ${a.action}`,
    subtitle: `Impact: ${a.impact} · ${a.time}`,
    tags: [a.action.toLowerCase(), a.domain?.toLowerCase(), a.impact],
    detail: a.detail,
  })),
];

const TYPE_OPTIONS = ["All", "Chapter", "Glossary", "Bug", "Character", "Action"];

export default function SearchTab() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  const results = useMemo(() => {
    if (!query.trim() && typeFilter === "All") return [];
    const q = query.toLowerCase().trim();
    return ALL_ENTRIES.filter(e => {
      const matchType = typeFilter === "All" || e.type === typeFilter;
      const matchQuery = !q || e.tags.some(t => t && t.includes(q)) || e.title.toLowerCase().includes(q) || e.detail?.toLowerCase().includes(q);
      return matchType && matchQuery;
    }).slice(0, 60);
  }, [query, typeFilter]);

  const showAll = !query.trim() && typeFilter !== "All";

  return (
    <div className="animate-slide-up space-y-4">
      <DashCard title="Live Search — All 44 Chapters, Glossary, Bugs, Characters" accent="blue">
        <div className="flex gap-2 mb-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search chapters, terms, bugs, characters... (e.g. 'omega109', 'NERO', 'Ramirez', 'tunnel')"
            className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap mb-4">
          {TYPE_OPTIONS.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition-all border ${typeFilter === t ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {results.length === 0 && query.trim() === "" && typeFilter === "All" && (
          <div className="text-center py-8 text-muted-foreground text-xs font-sans">
            Type to search across all 44 chapters, glossary, bugs, characters, and action items.
            <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
              {["omega109", "tunnel", "Crawford", "NERO", "chamoy", "Sacred Heart", "DCAS", "Ramirez"].map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  className="text-[9px] px-2 py-0.5 bg-secondary border border-border rounded text-muted-foreground hover:text-foreground hover:border-accent transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <div className="text-[9px] text-muted-foreground font-mono mb-2">{results.length} results</div>
            {results.map((r, i) => (
              <div key={i} onClick={() => setExpanded(expanded === i ? null : i)}
                className="p-2.5 bg-background rounded border border-border hover:border-accent/50 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono text-${r.color} border border-${r.color}/30 bg-${r.color}/10`}>{r.type}</span>
                  <span className="text-xs font-bold text-foreground flex-1">{r.title}</span>
                  <span className="text-[9px] text-muted-foreground font-sans">{r.subtitle}</span>
                </div>
                {expanded === i && r.detail && (
                  <div className="mt-2 pt-2 border-t border-border text-[10px] text-foreground/70 font-sans leading-relaxed">
                    {r.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DashCard>
    </div>
  );
}