import { useState } from "react";
import DashCard from "./DashCard";

// ── SOURCE: SGTRamos_Master_Implementation_Workbook.xlsx ──────────────────────

const GATES = [
  {
    id: "G1",
    label: "GATE 1 — Internal Reconciliation",
    est: "2 Weeks · Zero Budget",
    color: "red",
    status: "IN_PROGRESS",
    items: [
      { id:"G1-1", task:"Freeze canonical manuscript version hash (SHA-256 of v12 DOCX)",                status:"OPEN" },
      { id:"G1-2", task:"Reconcile chapter count: 45 (authoritative) — resolve 45/46/44 drift in ALL code and schema", status:"OPEN" },
      { id:"G1-3", task:"Delete 4 critical artifacts: Ch.1 Line 1, Ch.34 Last Line, Ch.24 page#, Ch.38 artifact",      status:"OPEN" },
      { id:"G1-4", task:"Lock SPSS scoring schema as v12 — no further field definition changes without version bump",   status:"OPEN" },
      { id:"G1-5", task:"Add 'PROPRIETARY DIAGNOSTIC ANALYTICS — not externally validated' label to all dashboards",    status:"OPEN" },
      { id:"G1-6", task:"Normalize CL-MoE threshold documentation (0.979 across all references)",                      status:"OPEN" },
    ]
  },
  {
    id: "G2",
    label: "GATE 2 — Warehouse Build + API Ingestion",
    est: "6 Weeks · Engineering",
    color: "blue",
    status: "PENDING",
    items: [
      { id:"G2-1", task:"Stand up PostgreSQL + ElasticSearch + pgvector (MVP vector store)",              status:"OPEN" },
      { id:"G2-2", task:"Build Crossref ingestor: api.crossref.org/v1/works — DOI graph + citations",    status:"OPEN" },
      { id:"G2-3", task:"Build Google Books ingestor: googleapis.com/books/v1/volumes — metadata enrichment", status:"OPEN" },
      { id:"G2-4", task:"Build Open Library ingestor: openlibrary.org/search.json — 1 req/sec + monthly dumps", status:"OPEN" },
      { id:"G2-5", task:"Assemble comparative corpora: Pulitzer/NBA, Chicano canon, war lit, adapted works", status:"OPEN" },
      { id:"G2-6", task:"Build dbt transform pipeline with versioned ETL and provenance tracking",         status:"OPEN" },
      { id:"G2-7", task:"Stand up Neo4j graph: Manuscript→Chapter→Award→Author→Work→Theory cluster",     status:"OPEN" },
      { id:"G2-8", task:"Reserve licensed-data contingency budget (BookScan/Nielsen — quote required)",   status:"OPEN" },
    ]
  },
  {
    id: "G3",
    label: "GATE 3 — External Validation",
    est: "12 Weeks · Full Program",
    color: "teal",
    status: "PENDING",
    items: [
      { id:"G3-1", task:"Run pilot reader cohort (8 types, 30–40 per cohort) — excerpt-level A/B tests",  status:"OPEN" },
      { id:"G3-2", task:"Compute criterion validity: regress external outcomes on internal CLS/BIS/SII/MRF", status:"OPEN" },
      { id:"G3-3", task:"Build Pulitzer Vector model (z-scored vs finalist comp set)",                    status:"OPEN" },
      { id:"G3-4", task:"Build Scholarly Survival Index (citation forecast + holdings + teachability)",    status:"OPEN" },
      { id:"G3-5", task:"Build Market Pressure Engine (sigmoid composite, completion + purchase intent)",  status:"OPEN" },
      { id:"G3-6", task:"Bootstrap confidence intervals on all high-stakes indices",                      status:"OPEN" },
      { id:"G3-7", task:"IRB-grade consent language for reader cohorts — de-identify all participant data", status:"OPEN" },
      { id:"G3-8", task:"Final report: journal-grade methods appendix + executive brief + revision roadmap", status:"OPEN" },
    ]
  }
];

const FORMULAS = [
  {
    id:"omega", label:"Hybrid Omega Formula", type:"INTERNAL",
    formula:"Ω = 71.443 + 0.124(CLS) + 0.118(BIS) + 0.089(SII) + 0.067(MRF)",
    stats:"R²=0.947 · Cronbach α=0.938 · N=45 · Scale 0–100 per component",
    warning:"PROPRIETARY DIAGNOSTIC ANALYTICS — internal calibration only. Not externally validated.",
    color:"gold",
    components:[
      { var:"CLS", beta:"0.124 (highest)", desc:"Complexity/Linguistic Score — FK Grade proxy. Institutional prose quality." },
      { var:"BIS", beta:"0.118",           desc:"Behavioral Integrity Score — active-verb density, code-switch frequency, POV stability." },
      { var:"SII", beta:"0.089",           desc:"Sensory Immersion Index — sensory references/1k words, tactile + olfactory density." },
      { var:"MRF", beta:"0.067",           desc:"Multicultural Register Frequency — Spanish per 1k, cultural-symbol density." },
    ]
  },
  {
    id:"pv", label:"Pulitzer Vector", type:"EXTERNAL (PENDING Gate 3)",
    formula:"PV = 0.22·Z(StyleOriginality) + 0.20·Z(HistoricalResonance) + 0.18·Z(MoralAmbiguity) + 0.15·Z(EmotionalAfterlife) + 0.15·Z(StructuralControl) + 0.10·Z(CriticalDistinctiveness) − 0.12·Z(OverengineeringPenalty)",
    stats:"All inputs z-scored vs Pulitzer fiction finalists + adjacent prestige novels",
    warning:"Requires Gate 2 comparative corpus. Above 0 = above comp-set mean; above +1 = strong prestige territory.",
    color:"purple",
    components:[
      { var:"StyleOriginality",       beta:"0.22", desc:"Lexical distinctiveness + sentence rhythm novelty vs corpus" },
      { var:"HistoricalResonance",    beta:"0.20", desc:"Archival precision + period-specific sensory grounding" },
      { var:"MoralAmbiguity",         beta:"0.18", desc:"Protagonist moral complexity score (reader survey)" },
      { var:"EmotionalAfterlife",     beta:"0.15", desc:"1-week delayed emotional recall vs immediate" },
      { var:"StructuralControl",      beta:"0.15", desc:"Pacing variance + structural integrity (no duplication)" },
      { var:"CriticalDistinctiveness",beta:"0.10", desc:"MFA reader originality rating" },
      { var:"OverengineeringPenalty", beta:"-0.12","desc":"Overexplanation density + thematic statement count" },
    ]
  },
  {
    id:"ssi", label:"Scholarly Survival Index", type:"EXTERNAL (PENDING Gate 3)",
    formula:"SSI = 0.25·Z(TheoryElasticity) + 0.20·Z(CitationForecast) + 0.15·Z(LibraryPenetration) + 0.15·Z(TeachabilityScore) + 0.15·Z(ArchivalRichness) + 0.10·Z(ReprintPersistence)",
    stats:"Models probability the work remains teachable/discussable in 10–20 years",
    warning:"Requires Gate 2 Crossref ingestor + Gate 3 academic cohort study.",
    color:"blue",
    components:[
      { var:"TheoryElasticity",  beta:"0.25", desc:"Survives postcolonial + trauma + borderlands theory analysis" },
      { var:"CitationForecast",  beta:"0.20", desc:"Projected citations: Crossref + Semantic Scholar graph" },
      { var:"LibraryPenetration",beta:"0.15", desc:"WorldCat / OCLC holdings count at launch" },
      { var:"TeachabilityScore", beta:"0.15", desc:"Faculty cohort: syllabus fit + discussion yield" },
      { var:"ArchivalRichness",  beta:"0.15", desc:"NARA + Internet Archive + HathiTrust density for subjects" },
      { var:"ReprintPersistence",beta:"0.10", desc:"Open Library reprint/edition count for comp titles" },
    ]
  },
  {
    id:"mpe", label:"Market Pressure Engine", type:"EXTERNAL (PENDING Gate 3)",
    formula:"MPE = sigmoid(0.30·Z(Completion) + 0.20·Z(PurchaseIntent) + 0.15·Z(HispanicResonance) + 0.10·Z(AudioViability) + 0.10·Z(CompSalesFit) + 0.10·Z(AdaptationInterest) − 0.15·Z(FrictionLoad) − 0.10·Z(ControversyPenalty))",
    stats:"Output: bounded 0–1 commercial pressure score",
    warning:"Requires Gate 3 reader cohorts + Gate 2 BookScan/Nielsen data.",
    color:"teal",
    components:[
      { var:"Completion",         beta:"0.30",  desc:"Reader completion rate — pilot cohort" },
      { var:"PurchaseIntent",     beta:"0.20",  desc:"Post-read purchase intent (5-pt scale)" },
      { var:"HispanicResonance",  beta:"0.15",  desc:"Chicano/Latino cohort authenticity + symbolic charge score" },
      { var:"FrictionLoad",       beta:"-0.15", desc:"Dwell time × regression passes × self-reported confusion" },
      { var:"ControversyPenalty", beta:"-0.10", desc:"Content sensitivity flags from varied cohorts" },
    ]
  },
];

const COHORTS = [
  { cohort:"MFA / Literary Readers",         why:"Pulitzer committee proxy",              pilot:30, conf:75,  formulaInput:"PV: StyleOriginality, CriticalDistinctiveness, StructuralControl", color:"gold" },
  { cohort:"Chicano/Latino Lit Readers",      why:"Cultural legitimacy + primary market",  pilot:30, conf:75,  formulaInput:"MPE: HispanicResonance | PV: MoralAmbiguity | SSI: TheoryElasticity", color:"purple" },
  { cohort:"Veterans / Military Readers",     why:"BIS external validation",               pilot:25, conf:60,  formulaInput:"Internal BIS convergent validity | CM: RetentionLift, EmotionPersistence", color:"red" },
  { cohort:"Mainstream Commercial Readers",   why:"Crossover marketability",               pilot:40, conf:100, formulaInput:"MPE: Completion, PurchaseIntent, FrictionLoad", color:"blue" },
  { cohort:"Academic Faculty / Grad Readers", why:"Teachability + SSI",                   pilot:20, conf:50,  formulaInput:"SSI: TeachabilityScore, TheoryElasticity | PV: HistoricalResonance", color:"teal" },
  { cohort:"Bilingual Readers",               why:"Code-switch calibration — SII/MRF",    pilot:25, conf:60,  formulaInput:"Internal SII/MRF convergent validity | CM: FrictionLoad", color:"orange" },
  { cohort:"Audiobook-First Readers",         why:"Audio adaptation viability",            pilot:25, conf:60,  formulaInput:"MPE: AudioViability | Cognitive: dwell-time distribution", color:"cyan" },
  { cohort:"Screen Development Readers",      why:"Adaptation viability",                  pilot:10, conf:25,  formulaInput:"MPE: AdaptationInterest | Scene transferability ranking", color:"purple" },
];

const DATA_SOURCES = [
  { name:"Crossref",          tier:"PUBLIC FREE",    endpoint:"api.crossref.org/v1/works",                    auth:"No key (email in User-Agent)",  limit:"1,000/req · cursor pagination",  gate:"G2", color:"teal"   },
  { name:"Google Books",      tier:"PUBLIC FREE",    endpoint:"googleapis.com/books/v1/volumes",              auth:"API key (GCP project)",         limit:"GCP quota by project",           gate:"G2", color:"teal"   },
  { name:"Open Library",      tier:"PUBLIC FREE",    endpoint:"openlibrary.org/search.json",                  auth:"No key — User-Agent + email",   limit:"1 req/sec; 3 if identified",     gate:"G2", color:"teal"   },
  { name:"Library of Congress",tier:"PUBLIC FREE",   endpoint:"Official JSON catalog + search",               auth:"Public REST",                   limit:"Generous for identified",        gate:"G2", color:"teal"   },
  { name:"Internet Archive",  tier:"PUBLIC FREE",    endpoint:"archive.org search + metadata",                auth:"Public",                        limit:"Polite crawl",                   gate:"G2", color:"blue"   },
  { name:"Semantic Scholar",  tier:"PUBLIC FREE",    endpoint:"api.semanticscholar.org/graph/v1",             auth:"API key (free tier)",           limit:"100 req/5min (free)",            gate:"G2", color:"blue"   },
  { name:"TMDB",              tier:"PUBLIC FREE",    endpoint:"api.themoviedb.org/3",                         auth:"API key (free)",                limit:"40 req/10sec",                   gate:"G2", color:"blue"   },
  { name:"Pulitzer Archive",  tier:"CURATED SCRAPE", endpoint:"pulitzer.org winners/finalists pages",        auth:"None — curated web ingest",     limit:"Low volume — cache all",         gate:"G2", color:"gold"   },
  { name:"National Book Found.",tier:"CURATED SCRAPE","endpoint":"nationalbook.org awards archive",          auth:"None — curated web ingest",     limit:"Low volume — cache all",         gate:"G2", color:"gold"   },
  { name:"WorldCat / OCLC",   tier:"LICENSED",       endpoint:"worldcat.org search + holdings API",          auth:"OCLC API key (contracted)",     limit:"Per contract",                   gate:"G2", color:"orange" },
  { name:"BookScan / Circana", tier:"ENTERPRISE",    endpoint:"Enterprise contract — no public API",         auth:"Vendor contract required",      limit:"Per agreement",                  gate:"G3", color:"red"    },
  { name:"Nielsen",           tier:"ENTERPRISE",     endpoint:"Report/licensing model",                      auth:"Vendor contract required",      limit:"Per agreement",                  gate:"G3", color:"red"    },
];

const GOVERNANCE = [
  { area:"Version Control",        rule:"Freeze one canonical manuscript hash (SHA-256) before any analysis",                        status:"OPEN", by:"Gate 1 W1" },
  { area:"Schema Reconciliation",  rule:"Resolve 45/46/44 chapter count drift across workbook, Base44 code, and entity schema",       status:"OPEN", by:"Gate 1 W1" },
  { area:"Provenance",             rule:"Every metric must point back to source, version, and extraction time",                       status:"PARTIAL", by:"Gate 1-2" },
  { area:"Internal vs External",   rule:"Internal SPSS indices labeled PROPRIETARY DIAGNOSTIC — not empirical proof — until validated",status:"OPEN", by:"Gate 1"   },
  { area:"Rights",                 rule:"Do not mass-store copyrighted full text from restricted sources unless licensed",             status:"OPEN", by:"Gate 2"   },
  { area:"Human Subjects",         rule:"IRB-grade consent language for all reader cohorts; de-identify participant data",             status:"OPEN", by:"Gate 3"   },
  { area:"Vendor Compliance",      rule:"Respect all source terms, rate limits, and dump-vs-API guidance (especially Open Library)",   status:"OPEN", by:"Gate 2"   },
  { area:"Reproducibility",        rule:"Every derived table must be recomputable from raw + transform steps (dbt)",                   status:"OPEN", by:"Gate 2"   },
  { area:"Model Honesty",          rule:"Label ALL internal indices as proprietary diagnostics on EVERY dashboard page",               status:"OPEN", by:"Gate 1"   },
  { area:"Bootstrap Uncertainty",  rule:"Every high-stakes index (PV, SSI, MPE) must carry bootstrap confidence intervals",            status:"OPEN", by:"Gate 3"   },
];

const TIMELINE = [
  { gate:"G1", phase:"Internal Reconciliation",            wkStart:1,  wkEnd:2,  cost:"Zero budget",           lead:"Author + LitCentral" },
  { gate:"G1", phase:"Manuscript freeze + schema fix",     wkStart:1,  wkEnd:1,  cost:"Zero budget",           lead:"Author" },
  { gate:"G1", phase:"Artifact deletion (4 chapters)",     wkStart:1,  wkEnd:1,  cost:"Zero budget",           lead:"Author" },
  { gate:"G2", phase:"Warehouse build — Postgres + ES + vector", wkStart:3, wkEnd:5, cost:"Low cloud spend",   lead:"Data engineer" },
  { gate:"G2", phase:"Public API ingestors (Crossref, Books, OL)", wkStart:3, wkEnd:6, cost:"Free",            lead:"Data engineer" },
  { gate:"G2", phase:"Comparative corpus assembly",        wkStart:5,  wkEnd:8,  cost:"Low",                   lead:"Literary scholar" },
  { gate:"G2", phase:"Licensed data procurement (BookScan/Nielsen)", wkStart:6, wkEnd:8, cost:"$$$$ — quote required", lead:"Producer" },
  { gate:"G3", phase:"Pilot reader study (8 cohort types)", wkStart:9, wkEnd:12, cost:"Mid 4-figures",         lead:"Study ops lead" },
  { gate:"G3", phase:"External validation models (PV/SSI/MPE)", wkStart:11,wkEnd:15, cost:"Statistician time", lead:"Applied statistician" },
  { gate:"G3", phase:"Bootstrap + calibration + ROC/AUC",  wkStart:14, wkEnd:16, cost:"Low",                   lead:"Applied statistician" },
  { gate:"G3", phase:"Confirmatory cohort study",          wkStart:14, wkEnd:18, cost:"Mid 5-figures",          lead:"Study ops lead" },
  { gate:"G3", phase:"Final report — methods appendix + executive brief", wkStart:18, wkEnd:20, cost:"Low",    lead:"All" },
];

const GATE_COLORS = { G1:"red", G2:"blue", G3:"teal" };
const STATUS_STYLES = {
  OPEN:     "text-red/80 border-red/30 bg-red/5",
  PARTIAL:  "text-gold border-gold/30 bg-gold/5",
  DONE:     "text-teal border-teal/30 bg-teal/5",
};

export default function CommandCenterTab() {
  const [view, setView] = useState("gates");
  const [gateStatuses, setGateStatuses] = useState(() => {
    const s = {};
    GATES.forEach(g => g.items.forEach(i => { s[i.id] = i.status; }));
    return s;
  });
  const [govStatuses, setGovStatuses] = useState(() => {
    const s = {};
    GOVERNANCE.forEach((g, i) => { s[i] = g.status; });
    return s;
  });
  const [selFormula, setSelFormula] = useState("omega");

  const cycleGate = (id) => setGateStatuses(p => ({
    ...p, [id]: p[id]==="OPEN" ? "IN_PROG" : p[id]==="IN_PROG" ? "DONE" : "OPEN"
  }));
  const cycleGov = (i) => setGovStatuses(p => ({
    ...p, [i]: p[i]==="OPEN" ? "PARTIAL" : p[i]==="PARTIAL" ? "DONE" : "OPEN"
  }));

  const totalItems = Object.keys(gateStatuses).length;
  const doneItems  = Object.values(gateStatuses).filter(s => s === "DONE").length;
  const pct = Math.round((doneItems / totalItems) * 100);

  const selF = FORMULAS.find(f => f.id === selFormula);

  const VIEWS = [
    { id:"gates",   label:"3-Gate Tracker" },
    { id:"formulas",label:"Formula Registry" },
    { id:"cohorts", label:"Reader Cohorts" },
    { id:"sources", label:"Data Sources" },
    { id:"govern",  label:"Governance" },
    { id:"timeline",label:"Timeline" },
  ];

  return (
    <div className="animate-slide-up space-y-4">
      {/* Master header */}
      <div className="bg-card border border-gold/30 rounded-lg p-4">
        <div className="text-xs font-bold text-gold font-mono mb-0.5">
          SGT GEORGE RAMOS — PROJECT COMMAND CENTER · Three-Gate Implementation Program
        </div>
        <div className="text-[10px] text-foreground/50 font-sans mb-3">
          Integrating: Internal SPSS/LitCentral Stack + LSTE External Validation + Full Data Ingestion Architecture
        </div>
        <div className="bg-red/10 border border-red/40 rounded-md p-2.5 mb-3">
          <div className="text-[10px] font-bold text-red font-mono">🚨 CRITICAL BLOCKER — RESOLVE BEFORE ANY EXTERNAL ANALYSIS</div>
          <div className="text-[9px] text-foreground/70 font-sans mt-1">
            Chapter count discrepancy: SPSS Workbook = 45 · LitCentral Base44 audit functions = hard-coded 46 · Entity schema field = 1–44.<br/>
            <span className="text-red font-bold">Until reconciled: every Pulitzer probability, market crossover, and scholarly survival model is downstream noise dressed in a tuxedo.</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-xl font-black font-mono text-gold">{pct}%</div>
            <div className="text-[8px] text-muted-foreground font-mono">PROGRAM COMPLETE</div>
            <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all" style={{width:`${pct}%`}} />
            </div>
          </div>
          {GATES.map(g => {
            const done = g.items.filter(i => gateStatuses[i.id] === "DONE").length;
            return (
              <div key={g.id} className="text-center">
                <div className={`text-xl font-black font-mono text-${GATE_COLORS[g.id]}`}>{done}/{g.items.length}</div>
                <div className="text-[8px] text-muted-foreground font-mono">{g.id} COMPLETE</div>
                <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{width:`${(done/g.items.length)*100}%`,
                      backgroundColor: g.id==="G1" ? "#FF5C5C" : g.id==="G2" ? "#4A9EFF" : "#1CCFB4"}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View switcher */}
      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono border transition-all ${
              view === v.id ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"
            }`}>{v.label}</button>
        ))}
      </div>

      {/* ── THREE-GATE TRACKER ── */}
      {view === "gates" && (
        <div className="space-y-4">
          {GATES.map(gate => {
            const done = gate.items.filter(i => gateStatuses[i.id] === "DONE").length;
            const inProg = gate.items.filter(i => gateStatuses[i.id] === "IN_PROG").length;
            const color = GATE_COLORS[gate.id];
            return (
              <DashCard key={gate.id} title={`${gate.label} · ${gate.est}`} accent={color}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{width:`${(done/gate.items.length)*100}%`,
                        backgroundColor: color==="red"?"#FF5C5C":color==="blue"?"#4A9EFF":"#1CCFB4"}} />
                  </div>
                  <span className={`text-[10px] font-bold font-mono text-${color}`}>{done}/{gate.items.length} done</span>
                  {inProg > 0 && <span className="text-[10px] font-mono text-gold">{inProg} in prog</span>}
                </div>
                <div className="space-y-1.5">
                  {gate.items.map(item => {
                    const st = gateStatuses[item.id];
                    return (
                      <div key={item.id} onClick={() => cycleGate(item.id)}
                        className={`flex items-start gap-3 p-2.5 rounded-md border cursor-pointer hover:bg-secondary/20 transition-colors ${STATUS_STYLES[st] || STATUS_STYLES.OPEN}`}>
                        <div className="text-[9px] font-bold font-mono w-12 flex-shrink-0">{item.id}</div>
                        <div className="flex-1 text-[10px] font-sans">{item.task}</div>
                        <div className={`flex-shrink-0 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLES[st] || STATUS_STYLES.OPEN}`}>
                          {st === "IN_PROG" ? "IN PROG" : st}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </DashCard>
            );
          })}
        </div>
      )}

      {/* ── FORMULA REGISTRY ── */}
      {view === "formulas" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {FORMULAS.map(f => (
              <button key={f.id} onClick={() => setSelFormula(f.id)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold font-mono border transition-all ${
                  selFormula === f.id ? `bg-${f.color}/20 text-${f.color} border-${f.color}/50` : "border-border text-muted-foreground"
                }`}>{f.label}</button>
            ))}
          </div>
          {selF && (
            <div className="space-y-3">
              <div className={`p-4 rounded-lg border border-${selF.color}/30 bg-${selF.color}/5`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border text-${selF.color} border-${selF.color}/40`}>{selF.type}</span>
                  <span className="text-sm font-black text-foreground font-mono">{selF.label}</span>
                </div>
                <div className={`text-xs font-mono font-bold text-${selF.color} break-all leading-relaxed`}>{selF.formula}</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-2">{selF.stats}</div>
                <div className="mt-2 p-2 rounded bg-red/5 border border-red/20 text-[9px] font-mono text-red/90">⚠ {selF.warning}</div>
              </div>
              <DashCard title="Component Weights" accent={selF.color}>
                <div className="space-y-2">
                  {selF.components.map(c => {
                    const isNeg = c.beta.startsWith("-");
                    return (
                      <div key={c.var} className="flex items-start gap-3 p-2 rounded bg-background border border-border">
                        <div className={`w-28 text-[10px] font-bold font-mono flex-shrink-0 ${isNeg ? "text-red" : `text-${selF.color}`}`}>{c.var}</div>
                        <div className={`w-12 text-[10px] font-mono text-right flex-shrink-0 ${isNeg ? "text-red" : "text-teal"}`}>β {c.beta}</div>
                        <div className="text-[10px] font-sans text-muted-foreground">{c.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </DashCard>
            </div>
          )}
        </div>
      )}

      {/* ── READER COHORTS ── */}
      {view === "cohorts" && (
        <div className="space-y-4">
          <div className="bg-blue/5 border border-blue/30 rounded-lg p-3 text-[10px] font-sans text-foreground/70">
            <span className="text-blue font-bold">Protocol:</span> Excerpt-level A/B tests first — NOT whole-book. Matched chapter segments. Capture: reading time, immersion, 1-day recall, 1-week recall, purchase intent, open response. IRB-grade consent required.
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="border-b border-border text-[9px] text-muted-foreground">
                  <th className="text-left py-2 pr-3">Cohort</th>
                  <th className="text-left py-2 pr-3">Why It Matters</th>
                  <th className="text-center py-2 pr-2">Pilot N</th>
                  <th className="text-center py-2 pr-2">Conf. N</th>
                  <th className="text-left py-2">Formula Input</th>
                </tr>
              </thead>
              <tbody>
                {COHORTS.map((c, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/20">
                    <td className={`py-2 pr-3 font-bold text-${c.color}`}>{c.cohort}</td>
                    <td className="py-2 pr-3 text-muted-foreground font-sans">{c.why}</td>
                    <td className="py-2 pr-2 text-center text-teal font-bold">{c.pilot}</td>
                    <td className="py-2 pr-2 text-center text-gold font-bold">{c.conf}</td>
                    <td className="py-2 text-muted-foreground font-sans text-[9px]">{c.formulaInput}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <td className="py-2 font-bold text-foreground">TOTAL</td>
                  <td></td>
                  <td className="py-2 text-center font-black text-teal">{COHORTS.reduce((s,c) => s+c.pilot,0)}</td>
                  <td className="py-2 text-center font-black text-gold">{COHORTS.reduce((s,c) => s+c.conf,0)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── DATA SOURCES ── */}
      {view === "sources" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-[10px] font-mono">
            {["PUBLIC FREE","CURATED SCRAPE","ENTERPRISE"].map(tier => {
              const sources = DATA_SOURCES.filter(s => s.tier === tier);
              const tc = tier === "PUBLIC FREE" ? "teal" : tier === "CURATED SCRAPE" ? "gold" : "red";
              return (
                <div key={tier} className={`bg-card border border-${tc}/30 rounded-lg p-2`}>
                  <div className={`text-[9px] font-bold text-${tc} mb-1`}>{tier}</div>
                  <div className={`text-xl font-black text-${tc}`}>{sources.length}</div>
                  <div className="text-[8px] text-muted-foreground">sources</div>
                </div>
              );
            })}
          </div>
          <DashCard title="Data Source Registry — Gate 2 Implementation" accent="blue">
            <div className="overflow-x-auto">
              <table className="w-full text-[9px] font-mono">
                <thead>
                  <tr className="border-b border-border text-[8px] text-muted-foreground">
                    <th className="text-left py-2 pr-2">Source</th>
                    <th className="text-left py-2 pr-2">Tier</th>
                    <th className="text-left py-2 pr-2">Endpoint</th>
                    <th className="text-left py-2 pr-2">Auth</th>
                    <th className="text-left py-2 pr-2">Limit</th>
                    <th className="text-center py-2">Gate</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA_SOURCES.map((s, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-secondary/20">
                      <td className={`py-1.5 pr-2 font-bold text-${s.color}`}>{s.name}</td>
                      <td className="py-1.5 pr-2 text-muted-foreground">{s.tier}</td>
                      <td className="py-1.5 pr-2 text-muted-foreground max-w-[120px] truncate">{s.endpoint}</td>
                      <td className="py-1.5 pr-2 text-muted-foreground">{s.auth}</td>
                      <td className="py-1.5 pr-2 text-muted-foreground max-w-[120px] truncate">{s.limit}</td>
                      <td className={`py-1.5 text-center font-bold text-${GATE_COLORS[s.gate]}`}>{s.gate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashCard>
        </div>
      )}

      {/* ── GOVERNANCE ── */}
      {view === "govern" && (
        <div className="space-y-3">
          <div className="bg-red/5 border border-red/30 rounded-lg p-3 text-[10px] font-sans text-foreground/70">
            <span className="text-red font-bold">Academic Integrity Rule:</span> Internal SPSS indices must be labeled as PROPRIETARY DIAGNOSTIC ANALYTICS on every dashboard — not empirical proof — until Gate 3 external validation is complete.
          </div>
          <DashCard title="Governance Checklist — Required for Journal / Award / Agent Submission" accent="red">
            <div className="space-y-2">
              {GOVERNANCE.map((g, i) => {
                const st = govStatuses[i];
                return (
                  <div key={i} onClick={() => cycleGov(i)}
                    className={`flex items-start gap-3 p-2.5 rounded-md border cursor-pointer hover:bg-secondary/20 transition-colors ${STATUS_STYLES[st] || STATUS_STYLES.OPEN}`}>
                    <div className="w-32 text-[9px] font-bold font-mono flex-shrink-0">{g.area}</div>
                    <div className="flex-1 text-[10px] font-sans">{g.rule}</div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLES[st] || STATUS_STYLES.OPEN}`}>{st}</span>
                      <span className="text-[8px] text-muted-foreground font-mono">{g.by}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </DashCard>
        </div>
      )}

      {/* ── TIMELINE ── */}
      {view === "timeline" && (
        <div className="space-y-4">
          <div className="text-[10px] text-muted-foreground font-mono bg-card border border-border rounded-lg p-3">
            <span className="text-gold font-bold">~20 WEEKS TOTAL</span> · Gate 1: Wk 1-2 · Gate 2: Wk 3-8 · Gate 3: Wk 9-20
          </div>
          <DashCard title="Implementation Timeline — Three-Gate Program" accent="gold">
            <div className="space-y-2">
              {TIMELINE.map((row, i) => {
                const color = GATE_COLORS[row.gate];
                const leftPct  = ((row.wkStart - 1) / 20) * 100;
                const widthPct = ((row.wkEnd - row.wkStart + 1) / 20) * 100;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 text-[8px] font-bold font-mono text-center text-${color} flex-shrink-0`}>{row.gate}</div>
                    <div className="w-40 text-[9px] font-sans text-foreground/80 flex-shrink-0 truncate">{row.phase}</div>
                    <div className="flex-1 h-4 bg-secondary rounded-sm relative overflow-hidden">
                      <div className="absolute top-0 h-full rounded-sm opacity-80"
                        style={{
                          left:`${leftPct}%`, width:`${widthPct}%`,
                          backgroundColor: color==="red"?"#FF5C5C":color==="blue"?"#4A9EFF":"#1CCFB4"
                        }} />
                    </div>
                    <div className="w-20 text-[8px] font-mono text-muted-foreground text-right flex-shrink-0">
                      Wk {row.wkStart}–{row.wkEnd}
                    </div>
                    <div className={`w-24 text-[8px] font-mono text-right flex-shrink-0 ${row.cost.includes("$$$$") ? "text-red" : row.cost === "Zero budget" || row.cost === "Free" ? "text-teal" : "text-muted-foreground"}`}>
                      {row.cost}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Wk axis */}
            <div className="flex mt-2 pl-[258px] pr-[188px]">
              {Array.from({length:20}, (_,i) => i+1).map(w => (
                <div key={w} className={`flex-1 text-center text-[7px] font-mono ${w%5===0 ? "text-muted-foreground" : "text-muted-foreground/30"}`}>
                  {w%5===0 ? w : "·"}
                </div>
              ))}
            </div>
          </DashCard>

          {/* Resource table */}
          <DashCard title="Resource + Budget Plan" accent="teal">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-border text-[9px] text-muted-foreground">
                    <th className="text-left py-2 pr-3">Role</th>
                    <th className="text-right py-2 pr-3">FTE</th>
                    <th className="text-left py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role:"Data Engineer",              fte:"1.0 → 0.5",   note:"1.0 for MVP build; 0.5 ongoing" },
                    { role:"Full-Stack / Platform Eng",  fte:"0.75",         note:"LitCentral + warehouse API layer" },
                    { role:"Applied Statistician",       fte:"0.75",         note:"External validation models + bootstrap" },
                    { role:"Literary Scholar / Canon",   fte:"0.5–1.0",      note:"Comparative corpus curation" },
                    { role:"Research Librarian",         fte:"0.5",          note:"Metadata spine + source compliance" },
                    { role:"Study Operations Lead",      fte:"0.5",          note:"Reader cohort logistics" },
                    { role:"UX Researcher / Eye-track",  fte:"Fractional",   note:"Phase 3+ only (optional)" },
                  ].map(r => (
                    <tr key={r.role} className="border-b border-border/30 hover:bg-secondary/20">
                      <td className="py-2 pr-3 text-foreground">{r.role}</td>
                      <td className="py-2 pr-3 text-right text-gold font-bold">{r.fte}</td>
                      <td className="py-2 text-muted-foreground font-sans">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 p-2 rounded bg-red/5 border border-red/20 text-[9px] font-mono text-foreground/70">
                <span className="text-red font-bold">Budget rule:</span> Do NOT lock hard budget until licensing picture is confirmed. Licensed data (BookScan/Nielsen) = single most expensive line item. Public sources first → prove process value → then vendor spend.
              </div>
            </div>
          </DashCard>
        </div>
      )}
    </div>
  );
}