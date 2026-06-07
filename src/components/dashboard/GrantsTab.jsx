import DashCard from "./DashCard";

const GRANTS = [
  {
    id: 1,
    name: "NEH Public Scholars Program",
    agency: "National Endowment for the Humanities",
    amount: "$60,000",
    deadline: "2026-05-15",
    status: "DRAFTING",
    color: "gold",
    fit: 96,
    notes: "Perfect fit: public-facing humanities scholarship + Chicano Vietnam history. Requires 5-page narrative + CV + sample chapter. Dr. Durazo as academic co-applicant strongly recommended.",
    requirements: ["5-page project narrative", "2-page bio/CV", "Sample chapter (15 pages)", "2 letters of support", "Institutional endorsement"],
  },
  {
    id: 2,
    name: "Mellon Foundation — Humanities in Public Life",
    agency: "Andrew W. Mellon Foundation",
    amount: "$50,000–$150,000",
    deadline: "2026-06-01",
    status: "RESEARCH",
    color: "purple",
    fit: 88,
    notes: "Humanities + justice intersection. TruthEngine360 forensic angle (DCAS 349 anomaly) qualifies as public humanities research. Large award size — requires institutional host.",
    requirements: ["Letter of inquiry (3 pages)", "Institutional host required", "Public engagement plan", "Budget narrative"],
  },
  {
    id: 3,
    name: "California Arts Council — Literary Arts Fellowship",
    agency: "California Arts Council",
    amount: "$10,000",
    deadline: "2026-07-15",
    status: "ELIGIBLE",
    color: "teal",
    fit: 94,
    notes: "CA-based author priority. Chicano literary tradition emphasis. Fastest path to immediate cash flow. Apply independently — no institutional host required.",
    requirements: ["Writing sample (25 pages)", "Artist statement (2 pages)", "Project description", "CA residency proof"],
  },
  {
    id: 4,
    name: "Pen America Writers Emergency Fund",
    agency: "PEN America",
    amount: "$500–$4,000",
    deadline: "Rolling",
    status: "APPLY NOW",
    color: "orange",
    fit: 85,
    notes: "Rolling deadline — apply immediately. Emergency support for writers facing financial hardship. Fast processing (2–4 weeks). Complements larger grant applications in progress.",
    requirements: ["Short application (online)", "Writing sample", "Statement of need"],
  },
  {
    id: 5,
    name: "USC Center for Latino Studies — Research Grant",
    agency: "University of Southern California",
    amount: "$5,000–$25,000",
    deadline: "2026-08-01",
    status: "CONTACT PENDING",
    color: "blue",
    fit: 91,
    notes: "Directly tied to USC PhD pathway. Prof. Durazo's dissertation ('The Few, The Proud, The Deported') is 7th convergence stream. Co-research framing unlocks academic grant infrastructure.",
    requirements: ["Research proposal (10 pages)", "Academic collaborator (Prof. Durazo)", "IRB approval for interview data", "USC faculty sponsor"],
  },
];

const STATUS_COLOR = {
  "APPLY NOW": "text-red",
  "DRAFTING": "text-gold",
  "ELIGIBLE": "text-teal",
  "RESEARCH": "text-blue",
  "CONTACT PENDING": "text-purple",
};

export default function GrantsTab() {
  const totalMin = grants => grants.reduce((sum, g) => {
    const n = parseInt(g.amount.replace(/[^0-9]/g, "").slice(0, 6));
    return sum + (n || 0);
  }, 0);

  return (
    <div className="animate-slide-up space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Total Grants Tracked", value:"5",         color:"blue"   },
          { label:"Apply Now",            value:"1",         color:"red"    },
          { label:"Drafting",             value:"1",         color:"gold"   },
          { label:"Potential Total",      value:"$239K+",    color:"teal"   },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-2xl font-black font-mono text-${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {GRANTS.map((g, i) => (
          <DashCard key={i} title={`#${g.id} — ${g.name}`} accent={g.color}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-xs text-muted-foreground font-sans">{g.agency}</span>
                  <span className={`text-xs font-black font-mono text-${g.color}`}>{g.amount}</span>
                  <span className={`text-[9px] font-bold font-mono ${STATUS_COLOR[g.status]}`}>{g.status}</span>
                  <span className="text-[9px] text-muted-foreground font-mono">Deadline: {g.deadline}</span>
                </div>
                <p className="text-xs text-muted-foreground font-sans mb-3 leading-relaxed">{g.notes}</p>
                <div>
                  <div className="text-[9px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">Requirements</div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.requirements.map((r, ri) => (
                      <span key={ri} className="text-[9px] px-2 py-0.5 bg-secondary border border-border rounded-full text-foreground/70 font-sans">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">Fit Score</div>
                <div className={`text-4xl font-black font-mono text-${g.color} mb-1`}>{g.fit}%</div>
                <div className="bg-secondary rounded-full h-2 overflow-hidden">
                  <div className={`h-full bg-${g.color} rounded-full`} style={{ width: `${g.fit}%` }} />
                </div>
              </div>
            </div>
          </DashCard>
        ))}
      </div>
    </div>
  );
}