import DashCard from "./DashCard";

const PHD_MILESTONES = [
  { phase:"Pre-Application", task:"Contact Prof. Marco Antonio Durazo (USC)",       status:"PENDING", priority:"CRITICAL", note:"'The Few, The Proud, The Deported' = 7th convergence stream. Request academic co-research framing." },
  { phase:"Pre-Application", task:"Request Prof. Rose Carmen Goldberg letter",       status:"PENDING", priority:"HIGH",     note:"'Deported Veterans Health & Benefits Report' — legal research alignment. Letter of support." },
  { phase:"Pre-Application", task:"Prepare writing sample (Ch.1, Ch.23, Ch.35)",    status:"PENDING", priority:"HIGH",     note:"20–25 pages. Sacred Mountain + Te Deum + Mathematics of Revenge = strongest trio." },
  { phase:"Pre-Application", task:"Draft statement of purpose",                     status:"PENDING", priority:"HIGH",     note:"Frame TruthEngine360 as doctoral research program. DCAS forensic audit = dissertation core." },
  { phase:"Application",     task:"USC Chicano/Latino Studies PhD application",      status:"PENDING", priority:"CRITICAL", note:"Target: Fall 2027 enrollment. Application deadline typically December 2026." },
  { phase:"Application",     task:"UCSB Chicana/o Studies program inquiry",         status:"PENDING", priority:"HIGH",     note:"Strong Chicano cultural studies faculty. Alternative pathway to USC." },
  { phase:"Application",     task:"UT Austin Center for Mexican American Studies",  status:"PENDING", priority:"MED",      note:"Texas geographic relevance + Chicano Vietnam veteran community." },
  { phase:"Funding",         task:"USC Center for Latino Studies Research Grant",   status:"PENDING", priority:"HIGH",     note:"$5,000–$25,000. Requires USC faculty sponsor + IRB for interview data." },
  { phase:"Funding",         task:"Ford Foundation Predoctoral Fellowship",         status:"RESEARCH", priority:"HIGH",    note:"$27,000/year + $2,000 conference travel. Diversity focus = strong fit." },
  { phase:"Funding",         task:"SSRC Mellon Mays Graduate Initiatives",         status:"RESEARCH", priority:"MED",     note:"Social science research council. Minority scholars focus." },
  { phase:"Research",        task:"Formalize DCAS 349-record anomaly methodology",  status:"IN PROGRESS", priority:"CRITICAL", note:"Document full forensic audit as publishable methodology. TruthEngine360 = dissertation chapter 1." },
  { phase:"Research",        task:"IRB approval for Durazo interview data use",     status:"PENDING", priority:"HIGH",     note:"Semi-structured interview corpus. Must obtain IRB before academic publication." },
];

const DURAZO = {
  name: "Prof. Marco Antonio Durazo",
  institution: "USC — Department of American Studies & Ethnicity",
  dissertation: "'The Few, The Proud, The Deported'",
  relevance: 98,
  convergence: "7th convergence stream — first qualitative validation via semi-structured interviews. Confirms racial project mechanism of Chicano over-assignment to high-mortality MOS roles.",
  actionItem: "EMAIL IMMEDIATELY — request co-research meeting. Cite DCAS 349-record anomaly as primary overlap.",
};

const GOLDBERG = {
  name: "Prof. Rose Carmen Goldberg",
  institution: "Legal Research — Deported Veterans",
  work: "'Deported Veterans Health & Benefits Report'",
  relevance: 91,
  convergence: "IIRIRA (1996) + IMMVI (2021) legal pipeline. Ch.17 Los Obligados + Ch.39 Hearing Hall directly cite this framework.",
  actionItem: "Request letter of support for grant + PhD applications.",
};

const STATUS_COLOR = {
  "DONE":        "text-teal",
  "IN PROGRESS": "text-blue",
  "PENDING":     "text-muted-foreground",
  "RESEARCH":    "text-purple",
};
const PRI_COLOR = { CRITICAL:"text-red", HIGH:"text-orange", MED:"text-gold" };

const phases = ["Pre-Application", "Application", "Funding", "Research"];

export default function PhDTab() {
  return (
    <div className="animate-slide-up space-y-4">

      <div className="bg-purple/5 border border-purple/30 rounded-lg p-4">
        <div className="text-sm font-black text-purple font-mono mb-1">USC PhD Pathway — Chicano/Latino Studies or American Studies</div>
        <div className="text-xs text-muted-foreground font-sans leading-relaxed">
          TruthEngine360 forensic audit (DCAS 349-record anomaly) positioned as doctoral dissertation core. Prof. Durazo collaboration = academic legitimacy bridge. Target: Fall 2027 enrollment.
        </div>
      </div>

      {/* Key Academics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[DURAZO, GOLDBERG].map((p, i) => (
          <DashCard key={i} title={p.name} accent={i === 0 ? "purple" : "blue"}>
            <div className="text-[10px] text-muted-foreground font-sans mb-1">{p.institution}</div>
            <div className={`text-xs font-bold font-mono text-${i === 0 ? "purple" : "blue"} mb-2`}>{p.dissertation || p.work}</div>
            <div className="text-[10px] text-foreground/70 font-sans mb-3 leading-relaxed">{p.convergence}</div>
            <div className={`p-2 rounded border border-${i === 0 ? "red" : "blue"}/30 bg-${i === 0 ? "red" : "blue"}/5 text-[9px] font-bold font-mono text-${i === 0 ? "red" : "blue"}`}>
              ACTION: {p.actionItem}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[8px] text-muted-foreground">Relevance:</span>
              <div className="flex-1 bg-secondary rounded-full h-[3px] overflow-hidden">
                <div className={`h-full bg-${i === 0 ? "purple" : "blue"} rounded-full`} style={{ width: `${p.relevance}%` }} />
              </div>
              <span className={`text-[9px] font-bold font-mono text-${i === 0 ? "purple" : "blue"}`}>{p.relevance}%</span>
            </div>
          </DashCard>
        ))}
      </div>

      {/* Milestones by Phase */}
      {phases.map(phase => {
        const items = PHD_MILESTONES.filter(m => m.phase === phase);
        return (
          <DashCard key={phase} title={`Phase: ${phase}`} accent="purple">
            <div className="space-y-2">
              {items.map((m, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 bg-background rounded border border-border">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-foreground font-sans">{m.task}</div>
                    <div className="text-[9px] text-muted-foreground font-sans mt-0.5">{m.note}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-[9px] font-bold font-mono ${PRI_COLOR[m.priority]}`}>{m.priority}</span>
                    <span className={`text-[9px] font-mono ${STATUS_COLOR[m.status]}`}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </DashCard>
        );
      })}
    </div>
  );
}