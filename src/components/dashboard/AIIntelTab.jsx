import { useState } from "react";
import { base44 } from "@/api/base44Client";
import DashCard from "./DashCard";

const QUICK_QUERIES = [
  "What is the historical evidence for Chicano Vietnam casualty undercounting?",
  "Summarize the DCAS 58,220 records anomaly and what it means",
  "What is 50 USC §3802 and how does it relate to Mexican nationals in Vietnam?",
  "Who was Jesus Duran and what was the Valor 24 Medal of Honor review?",
  "What is the literary significance of the IBM System/360 in Vietnam-era military history?",
  "Compare Chicano Vietnam War literature to the existing American canon",
];

const INTEL_NOTES = [
  { category:"DCAS Anomaly",      color:"red",    note:"58,220 records — only 349 coded Hispanic (0.60%). Actual estimate: 3,070–3,741 (6.4%). Gap: ~3,300 uncounted Chicano deaths." },
  { category:"Catholic Proxy",    color:"purple", note:"28.9% of DCAS coded Catholic (16,817). Used as ethnicity surrogate where direct coding failed." },
  { category:"Geographic Cluster",color:"blue",   note:"CA+TX+NM account for 16.1% of all Vietnam casualties — highest SW state concentration." },
  { category:"Los Obligados",     color:"gold",   note:"Estimated 5,000–10,000 Mexican nationals served in Vietnam via 50 USC §3802 draft. DCAS records: near zero." },
  { category:"Valor 24",          color:"teal",   note:"2014 review resulted in 24 Medal of Honor upgrades for Hispanic/Black veterans — Jesus Duran among them." },
  { category:"Durazo Dissertation",color:"orange",note:"'The Few, The Proud, The Deported' — first qualitative validation via semi-structured interviews. 7th convergence stream." },
];

export default function AIIntelTab() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runQuery = async (q) => {
    const finalQ = q || query;
    if (!finalQ.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a research assistant for a literary forensic project about Chicano Vietnam veterans. The project is "SGT George Ramos: The Mathematics of Vietnam" by Gabriel Arce. Answer the following research query with precision, citing real historical sources where possible:\n\n${finalQ}`,
        add_context_from_internet: true,
      });
      setResult(res);
    } catch (e) {
      setResult("Error running query. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="animate-slide-up space-y-4">
      <DashCard title="AI Research Intelligence — TruthEngine360" accent="blue">
        <div className="text-xs text-muted-foreground font-sans mb-4">
          Live AI queries against historical, legal, and literary research for the SGT Ramos manuscript
        </div>
        <div className="flex gap-2 mb-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && runQuery()}
            placeholder="Ask a research question about Chicano Vietnam history..."
            className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
          />
          <button
            onClick={() => runQuery()}
            disabled={loading}
            className="px-4 py-2 bg-accent text-white rounded-md text-xs font-bold font-mono disabled:opacity-50"
          >
            {loading ? "..." : "QUERY"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_QUERIES.map((q, i) => (
            <button key={i} onClick={() => { setQuery(q); runQuery(q); }}
              className="text-[9px] px-2 py-1 bg-secondary border border-border rounded text-muted-foreground hover:text-foreground hover:border-accent transition-all font-sans">
              {q.slice(0, 50)}...
            </button>
          ))}
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-blue font-mono p-4 bg-blue/5 rounded border border-blue/20">
            <div className="w-3 h-3 border-2 border-blue border-t-transparent rounded-full animate-spin" />
            Querying TruthEngine360 + web sources...
          </div>
        )}
        {result && !loading && (
          <div className="p-4 bg-secondary rounded-lg border border-border text-xs text-foreground font-sans leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
        )}
      </DashCard>

      <DashCard title="TruthEngine360 — Standing Intelligence Notes" accent="teal">
        <div className="space-y-3">
          {INTEL_NOTES.map((n, i) => (
            <div key={i} className={`p-3 rounded-lg border border-${n.color}/25 bg-${n.color}/5`}>
              <div className={`text-xs font-bold font-mono text-${n.color} mb-1`}>{n.category}</div>
              <div className="text-[10px] text-muted-foreground font-sans">{n.note}</div>
            </div>
          ))}
        </div>
      </DashCard>
    </div>
  );
}