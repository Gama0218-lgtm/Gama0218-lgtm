import DashCard from "./DashCard";
import { CONVERGENCE_STREAMS } from "../../lib/data";

const COLOR_TEXT = {
  red:"text-red",orange:"text-orange",purple:"text-purple",
  teal:"text-teal",blue:"text-blue",gold:"text-gold",
};
const COLOR_BG = {
  red:"bg-red",orange:"bg-orange",purple:"bg-purple",
  teal:"bg-teal",blue:"bg-blue",gold:"bg-gold",
};

export default function ResearchTab() {
  return (
    <div className="animate-slide-up space-y-4">
      <DashCard title="TruthEngine360 Convergence Streams" accent="purple">
        <div className="text-xs text-muted-foreground font-sans mb-4">
          7 independent data streams converging to document Chicano Vietnam casualty undercounting
        </div>
        <div className="space-y-3">
          {CONVERGENCE_STREAMS.map(s => (
            <div key={s.n} className="flex items-center gap-3">
              <span className={`text-sm font-black font-mono min-w-[20px] ${COLOR_TEXT[s.color]}`}>{s.n}.</span>
              <div className="flex-1">
                <div className={`text-xs font-bold font-mono ${COLOR_TEXT[s.color]} mb-0.5`}>{s.label}</div>
                <div className="text-[10px] text-muted-foreground font-sans">{s.desc}</div>
              </div>
              <div className="min-w-[80px]">
                <div className="flex items-center gap-2">
                  <div className="bg-secondary rounded-full h-[4px] flex-1 overflow-hidden">
                    <div className={`h-full rounded-full ${COLOR_BG[s.color]}`} style={{width:`${s.strength}%`}} />
                  </div>
                  <span className={`text-xs font-bold font-mono ${COLOR_TEXT[s.color]}`}>{s.strength}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashCard title="Key Sources" accent="blue">
          <div className="space-y-3">
            {[
              {title:"The Few, The Proud, The Deported",author:"Prof. Marco Antonio Durazo",type:"PhD Dissertation",color:"purple",relevance:98},
              {title:"Deported Veterans Health & Benefits Report",author:"Prof. Rose Carmen Goldberg",type:"Legal Research",color:"blue",relevance:95},
            ].map((s, i) => (
              <div key={i} className={`p-3 rounded-lg border border-${s.color}/25 bg-${s.color}/5`}>
                <div className={`text-xs font-bold font-mono text-${s.color} mb-1`}>{s.title}</div>
                <div className="text-[10px] text-muted-foreground font-sans">{s.author} — {s.type}</div>
                <div className="text-[9px] text-teal font-mono mt-1">Relevance: {s.relevance}%</div>
              </div>
            ))}
          </div>
        </DashCard>
        <DashCard title="Research Notes" accent="gold">
          <div className="space-y-2 text-xs text-muted-foreground font-sans">
            <p>• DCAS Primary: 58,220 records — 349 coded Hispanic (0.60%) — the core anomaly driving the TruthEngine360 forensic thesis</p>
            <p>• Durazo dissertation = 7th convergence stream — first qualitative validation via semi-structured interviews</p>
            <p>• Catholic proxy signal (28.9% of DCAS coded Catholic) provides ethnicity surrogate where direct coding failed</p>
            <p>• Geographic SW clustering: CA+TX+NM = 16.1% of all casualties</p>
          </div>
        </DashCard>
      </div>
    </div>
  );
}