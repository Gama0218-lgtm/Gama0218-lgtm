import DashCard from "./DashCard";

const VETERAN_CASES = [
  {
    name: "SGT Daniel Fernandez",
    unit: "101st Airborne Division",
    date: "Feb 18, 1966",
    state: "New Mexico",
    medal: "Medal of Honor (posthumous, 1966)",
    color: "gold",
    dcas_code: "Caucasian-Other",
    note: "Threw himself on grenade to save fellow soldiers. DCAS coded 'Caucasian-Other.' MOH citation does not specify Hispanic heritage.",
    verified: true,
  },
  {
    name: "SGT Candelario Garcia",
    unit: "USMC — 3rd Marine Division",
    date: "1967",
    state: "Texas",
    medal: "Silver Star",
    color: "teal",
    dcas_code: "Caucasian-Other",
    note: "Tunnel rat. Three confirmed kills inside Cu Chi network. DCAS classification: 'Caucasian-Other.' Family never notified of tunnel assignment risk.",
    verified: true,
  },
  {
    name: "SPC Jesus Duran",
    unit: "3rd Armored Division (Vietnam-era)",
    date: "Posthumous — 2014",
    state: "California",
    medal: "Medal of Honor (Valor 24 — upgrade 2014)",
    color: "gold",
    dcas_code: "Hispanic (corrected 2014)",
    note: "Valor 24 review — 24 MOH upgrades for Hispanic/Black veterans in 2014. 37-year gap between service and recognition. DCAS record corrected during review process.",
    verified: true,
  },
  {
    name: "Miguel Garcia + Jorge Ochoa (composite)",
    unit: "USMC — non-citizen draftees (50 USC §3802)",
    date: "1969–1971",
    state: "Sonora, Mexico / California",
    medal: "None — deportation after service",
    color: "orange",
    dcas_code: "NOT IN DCAS",
    note: "Represents estimated 5,000–10,000 Mexican nationals drafted via 50 USC §3802. DCAS records: near zero. Deported after service under IIRIRA (1996). Composite character in manuscript Ch.17–Ch.36.",
    verified: false,
  },
  {
    name: "Francisco Terminel (genealogical)",
    unit: "N/A — civilian (Terminel-Sagasta case)",
    date: "1900–1915",
    state: "Sonora, Mexico / Arizona",
    medal: "None",
    color: "purple",
    dcas_code: "N/A",
    note: "Historical bedrock of protagonist lineage. Wells Fargo cross-border asset extraction. ~2.75M pesos (~$37M USD contemporary value) extracted from Yaqui-identity wife Avina Sagasta during Mexican Revolution.",
    verified: true,
  },
  {
    name: "Joshua Sagasta / SGT George Ramos",
    unit: "USMC — 1st Marine Division (fictionalized)",
    date: "1969–1971",
    state: "Yaqui Homeland — San Javier / Vietnam",
    medal: "None (systemic erasure)",
    color: "teal",
    dcas_code: "NOT IN DCAS",
    note: "Manuscript protagonist. Composite vessel carrying 13 Marines lost under his command. Represents the 349-record anomaly made human. Arc from San Javier → Vietnam → Hearing Hall → citizenship.",
    verified: false,
  },
];

const DCAS_STATS = [
  { label: "Total DCAS Records", value: "58,220", color: "blue" },
  { label: "Coded Hispanic", value: "349 (0.60%)", color: "red" },
  { label: "Estimated Actual", value: "3,070–3,741 (6.4%)", color: "gold" },
  { label: "Classification Failure", value: "84.9%", color: "red" },
  { label: "Coded Catholic (proxy)", value: "16,817 (28.9%)", color: "purple" },
  { label: "SW States CA+TX+NM", value: "16.1% all KIA", color: "teal" },
];

export default function VeteransTab() {
  return (
    <div className="animate-slide-up space-y-4">

      <div className="bg-red/5 border border-red/30 rounded-lg p-4">
        <div className="text-sm font-black text-red font-mono mb-1">The 349-Record Anomaly — TruthEngine360 Core Thesis</div>
        <div className="text-xs text-muted-foreground font-sans leading-relaxed">
          Official DCAS records list only <span className="text-red font-bold">349 Hispanic fatalities</span> out of 58,220 Vietnam KIA — statistically impossible given 200,000+ Hispanic service members. Forensic audit confirms <span className="text-gold font-bold">3,070–3,741 actual Hispanic KIA</span>. The Pentagon's "Caucasian-Other" classification erased ethnic identity from the historical record.
        </div>
      </div>

      {/* DCAS Stats */}
      <DashCard title="DCAS Statistical Analysis" accent="red">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {DCAS_STATS.map((s, i) => (
            <div key={i} className="p-3 bg-background rounded border border-border text-center">
              <div className={`text-sm font-black font-mono text-${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5 font-sans">{s.label}</div>
            </div>
          ))}
        </div>
      </DashCard>

      {/* Veteran Cases */}
      <DashCard title="Verified Cases + Manuscript Composites" accent="gold">
        <div className="space-y-4">
          {VETERAN_CASES.map((v, i) => (
            <div key={i} className={`p-3 rounded-lg border border-${v.color}/25 bg-${v.color}/5`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className={`text-sm font-black font-mono text-${v.color}`}>{v.name}</div>
                  <div className="text-[10px] text-muted-foreground font-sans">{v.unit} · {v.state} · {v.date}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono text-${v.color} border border-${v.color}/40 bg-${v.color}/10`}>
                    {v.verified ? "VERIFIED" : "COMPOSITE"}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono">DCAS: {v.dcas_code}</span>
                </div>
              </div>
              <div className="text-[10px] text-foreground/70 font-sans mb-1.5 leading-relaxed">{v.note}</div>
              <div className={`text-[9px] font-bold font-mono text-${v.color}`}>{v.medal}</div>
            </div>
          ))}
        </div>
      </DashCard>

      {/* Convergence Streams Summary */}
      <DashCard title="7 Convergence Streams — Evidence Architecture" accent="teal">
        <div className="space-y-2 text-xs font-sans text-muted-foreground">
          {[
            ["1","DCAS Primary Records","58,220 records — 349 coded Hispanic (0.60%) — core anomaly","red"],
            ["2","Guzman Methodology","1969: 19% of casualties, 12% of population — documented disparity","orange"],
            ["3","LAE Database Cross-Ref","3,741 identified (6.43%) — highest estimate","purple"],
            ["4","NARA Revised Count","National Archives: 3,070 — independent institutional validation","teal"],
            ["5","Catholic Proxy Signal","28.9% of DCAS coded Catholic (16,817) — ethnicity surrogate","orange"],
            ["6","Geographic Clustering","CA+TX+NM: SW states = 16.1% of all casualties","blue"],
            ["7","Durazo Qualitative (NEW)","Semi-structured interviews — racial project mechanism confirmed. First qualitative stream.","gold"],
          ].map(([n, label, desc, color]) => (
            <div key={n} className="flex gap-3 p-2 bg-background rounded border border-border">
              <span className={`text-sm font-black font-mono text-${color} min-w-[20px]`}>{n}.</span>
              <div>
                <div className={`text-xs font-bold font-mono text-${color} mb-0.5`}>{label}</div>
                <div className="text-[10px] text-muted-foreground">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </DashCard>
    </div>
  );
}