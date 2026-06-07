import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import DashCard from "./DashCard";

// ── BUG FIX ROADMAP — v12 Authoritative (from SGTRamos_BugFix_Roadmap.xlsx) ───

const SPRINTS = [
  {
    id: "S1",
    label: "Sprint 1 — Artifact Elimination",
    est: "1–2 hours · DO TODAY",
    color: "#FF5C5C",
    tasks: [
      { id:"1A", ch:"Ch.1",       task:"Delete Line 1 artifact — 'REVISED CHAPTER — FIRST PASS'",           time:"5 min",   impact:"Ω +3.00 (102.17 → 105.17)",  status:"OPEN" },
      { id:"1B", ch:"Ch.34",      task:"Delete last line — 'PASS 2 COMPLETE — LITCENTRAL HYBRID DIAGNOSTIC'", time:"5 min",   impact:"Ω +3.00 (102.69 → 105.69)",  status:"OPEN" },
      { id:"1C", ch:"Ch.24",      task:"Locate and delete page number artifact in chapter body text",          time:"15 min",  impact:"Ω +~1.50",                   status:"OPEN" },
      { id:"1D", ch:"Ch.38",      task:"Locate and delete artifact (TBD per manuscript review)",              time:"15 min",  impact:"Ω +~1.50",                   status:"OPEN" },
    ]
  },
  {
    id: "S2",
    label: "Sprint 2 — Structural Repair",
    est: "8–12 hours · This Week",
    color: "#F5C842",
    tasks: [
      { id:"2A", ch:"Ch.9+10",    task:"Differentiate 700+ line duplicate opening. Ch.9 = first-contact kinetic. Ch.10 = aftermath/burial ceremonial. Zero overlapping lines.", time:"4–8 hrs", impact:"CRIT resolved · structural integrity restored", status:"OPEN" },
      { id:"2B", ch:"Ch.10",      task:"Fix Ramirez/Rodriguez name swap ~60% through chapter. Cross-verify all 45 chapters.",                                                   time:"2–3 hrs", impact:"CRIT resolved · character registry clean",      status:"OPEN" },
      { id:"2C", ch:"Ch.40+45",   task:"Reconcile death timeline: Ch.40 compresses 7 KIA into one battle; Ch.45 assigns them separate Feb–Nov 1968 dates. Add date-stamps.",   time:"2–3 hrs", impact:"HIGH continuity error resolved",              status:"OPEN" },
    ]
  },
  {
    id: "S3",
    label: "Sprint 3 — Expansion & Seeding",
    est: "15–20 hours · Week 2–3",
    color: "#4A9EFF",
    tasks: [
      { id:"3A", ch:"Ch.36",      task:"Expand Ch.36 'Mission Execution' from 3,706w to 5,000w+ target. Currently shortest chapter.",                                           time:"6–8 hrs", impact:"GOLD+ unlock · Ω ≈ +0.8",                    status:"OPEN" },
      { id:"3B", ch:"Ch.42",      task:"Expand Ch.42 'Sacred Smoke' to reach GOLD+ threshold.",                                                                                time:"6–8 hrs", impact:"GOLD+ unlock · Ω ≈ +0.8",                    status:"OPEN" },
      { id:"3C", ch:"Ch.5+17+35", task:"Seed Ghost Protocol Quartet foreshadowing. A name discrepancy noticed by Roy (Ch.5), a 'Ramos' casualty rumor (Ch.36), filing anomaly (Ch.42).", time:"3–4 hrs", impact:"+canon weight · Ch.45 revelation lands harder", status:"OPEN" },
    ]
  },
  {
    id: "S4",
    label: "Sprint 4 — LSTE Enhancement Pass",
    est: "20–30 hours · Week 4–6",
    color: "#1CCFB4",
    tasks: [
      { id:"4A", ch:"Ch.21+35",   task:"Add sensory prose bridges to dialogue-heavy chapters (65% and 62% dialogue). Two paragraphs each.",                                       time:"3–4 hrs", impact:"NDR risk resolved · BIS +est. +2pts",          status:"OPEN" },
      { id:"4B", ch:"Ch.17+25+29", task:"Spanish gap chapters: inject 1–2 authentic code-switch moments per chapter (currently 0.0–0.3/1k).",                                    time:"4–6 hrs", impact:"CLS +est. +3pts · CL-MoE uplift",             status:"OPEN" },
      { id:"4C", ch:"Ch.32+45",   task:"Fix truncated DOCX headings: Ch.32 'THE MASTERPIEC→E' · Ch.45 'Unidos para Sempr→e'",                                                   time:"15 min",  impact:"Submission artifact resolved",                status:"OPEN" },
      { id:"4D", ch:"Ch.6",       task:"Fix 'ID card swipe' anachronism → 'dog tag check' (magnetic stripe IDs not USMC standard until 1973).",                                 time:"30 min",  impact:"Historical accuracy · M249 SAW Ch.11 also",   status:"OPEN" },
      { id:"4E", ch:"All",        task:"Restraint pass: 'algorithm' (Ch.3 2.96/1k), 'dark/darkness' (Ch.12 3.8/1k), 'map' (Ch.34 2.24/1k) — vary overused words.",             time:"4–6 hrs", impact:"Voice register clarity · MRF +est. +1–2pts",  status:"OPEN" },
    ]
  }
];

const OMEGA_PROJECTIONS = [
  { phase:"BASELINE",      omega:104.94, elite:3,  goldPlus:16, critErrs:5, desc:"Current v12 state with all artifacts" },
  { phase:"POST S1",       omega:105.80, elite:3,  goldPlus:16, critErrs:1, desc:"4 artifacts deleted · Critical errors: 5 → 1" },
  { phase:"POST S2",       omega:105.90, elite:3,  goldPlus:16, critErrs:0, desc:"Duplication resolved · timeline clean · name swap fixed" },
  { phase:"POST S3",       omega:106.20, elite:3,  goldPlus:18, critErrs:0, desc:"Ch.36/42 expanded · Ghost Protocol seeded · GOLD+ 16→18" },
  { phase:"POST S4",       omega:106.50, elite:5,  goldPlus:20, critErrs:0, desc:"LSTE pass complete · Spanish gaps closed · OMEGA ELITE 3→5" },
  { phase:"TARGET",        omega:107.40, elite:8,  goldPlus:24, critErrs:0, desc:"Full post-fix projected peak (all sprints + refinement)" },
];

const SCHEMA_CONFLICTS = [
  { location:"auditManuscript function", field:"chapter count",    current:"46",    authoritative:"45", action:"Update CHAPTER_LIST to 45 entries" },
  { location:"AuditRun entity",          field:"total_chapters",   current:"no default", authoritative:"45", action:"Set default/validation to 45" },
  { location:"ManuscriptAuditResult",    field:"chapter_number range", current:"1-44", authoritative:"1-45", action:"Update schema description" },
  { location:"STATS in data.js",         field:"chapters",         current:"46",    authoritative:"45",  action:"Set chapters: 45 (Epilogue = Ch.46 addendum)" },
  { location:"CHAPTERS array",           field:"array length",     current:"46",    authoritative:"45",  action:"Mark Ch.46 as epilogue addendum, not core count" },
];

const STATUS_STYLES = {
  OPEN:     "text-red border-red/40 bg-red/5",
  IN_PROG:  "text-gold border-gold/40 bg-gold/5",
  DONE:     "text-teal border-teal/40 bg-teal/5",
};

export default function BugFixRoadmapTab() {
  const [statuses, setStatuses] = useState(() => {
    const s = {};
    SPRINTS.forEach(sp => sp.tasks.forEach(t => { s[t.id] = t.status; }));
    return s;
  });
  const [view, setView] = useState("roadmap");

  const cycle = (id) => {
    setStatuses(prev => {
      const next = { ...prev };
      next[id] = prev[id] === "OPEN" ? "IN_PROG" : prev[id] === "IN_PROG" ? "DONE" : "OPEN";
      return next;
    });
  };

  const doneCount = Object.values(statuses).filter(s => s === "DONE").length;
  const totalCount = Object.values(statuses).length;
  const pct = Math.round((doneCount / totalCount) * 100);

  const chartColor = (p) => {
    if (p === "BASELINE") return "#6B8BAA";
    if (p === "TARGET") return "#F5C842";
    if (p.includes("S1")) return "#FF5C5C";
    if (p.includes("S2")) return "#F5C842";
    if (p.includes("S3")) return "#4A9EFF";
    return "#1CCFB4";
  };

  return (
    <div className="animate-slide-up space-y-4">
      {/* View toggle */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id:"roadmap",  label:"Sprint Roadmap" },
          { id:"omega",    label:"Ω Projections" },
          { id:"schema",   label:"Schema Conflicts" },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono border transition-all ${
              view === v.id ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"
            }`}>{v.label}</button>
        ))}
      </div>

      {/* Header stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-black text-gold font-mono">{pct}%</div>
          <div className="text-[9px] text-muted-foreground font-mono">Fixes Complete</div>
          <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all" style={{ width:`${pct}%` }} />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-black text-red font-mono">
            {Object.values(statuses).filter(s => s === "OPEN").length}
          </div>
          <div className="text-[9px] text-muted-foreground font-mono">Open Issues</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-black text-teal font-mono">104.94</div>
          <div className="text-[9px] text-muted-foreground font-mono">Current Ω Mean</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-black text-blue font-mono">106.50</div>
          <div className="text-[9px] text-muted-foreground font-mono">Post-Fix Target</div>
        </div>
      </div>

      {/* ── SPRINT ROADMAP ── */}
      {view === "roadmap" && (
        <div className="space-y-3">
          <div className="text-[10px] text-muted-foreground font-mono bg-card border border-border rounded-lg p-3">
            <span className="text-gold font-bold">RESOLVE IN ORDER:</span> Artifact fixes first (&lt;1hr total) → Structural (Ch.9/10, Ch.40/45) → Expansion (Ch.36, Ch.42) → LSTE enhancements → Restraint pass
          </div>

          {SPRINTS.map(sprint => {
            const sprintDone = sprint.tasks.filter(t => statuses[t.id] === "DONE").length;
            const sprintTotal = sprint.tasks.length;
            return (
              <DashCard key={sprint.id} title={`${sprint.label} · ${sprint.est}`} accent={sprint.id === "S1" ? "red" : sprint.id === "S2" ? "gold" : sprint.id === "S3" ? "blue" : "teal"}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width:`${(sprintDone/sprintTotal)*100}%`, backgroundColor: sprint.color }} />
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: sprint.color }}>{sprintDone}/{sprintTotal}</span>
                </div>
                <div className="space-y-2">
                  {sprint.tasks.map(task => {
                    const st = statuses[task.id];
                    return (
                      <div key={task.id}
                        className={`flex items-start gap-3 p-2.5 rounded-md border cursor-pointer hover:bg-secondary/20 transition-colors ${STATUS_STYLES[st]}`}
                        onClick={() => cycle(task.id)}
                      >
                        <div className="flex-shrink-0 mt-0.5 text-[9px] font-bold font-mono w-6 text-center">{task.id}</div>
                        <div className="flex-shrink-0 text-[9px] font-bold font-mono w-10">{task.ch}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-sans text-foreground leading-snug">{task.task}</div>
                          <div className="text-[9px] font-mono mt-0.5 opacity-70">{task.impact}</div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-end gap-1">
                          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLES[st]}`}>{st}</span>
                          <span className="text-[8px] text-muted-foreground font-mono">{task.time}</span>
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

      {/* ── OMEGA PROJECTIONS ── */}
      {view === "omega" && (
        <div className="space-y-4">
          <DashCard title="Omega Mean Trajectory — Baseline to Full Post-Fix Target" accent="gold">
            <div className="text-[10px] text-muted-foreground mb-3 font-sans">
              Each sprint compounds. Sprint 1 alone recovers +0.86 Ω from 4 artifact deletions (total fix time: ~30 min).
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={OMEGA_PROJECTIONS} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="phase" tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis domain={[104, 108]} tick={{ fill: "#6B8BAA", fontSize: 8, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                <ReferenceLine y={106} stroke="#F5C842" strokeDasharray="3 3" label={{ value: "GOLD+ floor", fill: "#F5C842", fontSize: 8, position: "right" }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
                        <div className="font-bold text-foreground">{d.phase}</div>
                        <div className="text-gold font-black font-mono">Ω Mean: {d.omega}</div>
                        <div className="text-teal text-[10px]">OMEGA ELITE: {d.elite} · GOLD+: {d.goldPlus}</div>
                        <div className={`text-[10px] font-mono ${d.critErrs > 0 ? "text-red" : "text-teal"}`}>
                          Critical Errors: {d.critErrs}
                        </div>
                        <div className="text-muted-foreground text-[10px] mt-1">{d.desc}</div>
                      </div>
                    );
                  }}
                  cursor={{ fill: "#1A264044" }}
                />
                <Bar dataKey="omega" radius={[3, 3, 0, 0]}>
                  {OMEGA_PROJECTIONS.map((entry, i) => (
                    <Cell key={i} fill={chartColor(entry.phase)} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </DashCard>

          <div className="space-y-2">
            {OMEGA_PROJECTIONS.map(p => (
              <div key={p.phase} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border">
                <div className="w-20 text-[10px] font-bold font-mono" style={{ color: chartColor(p.phase) }}>{p.phase}</div>
                <div className="text-lg font-black font-mono text-foreground">{p.omega}</div>
                <div className="flex gap-4 text-[10px] font-mono text-muted-foreground">
                  <span className="text-gold">ELITE: {p.elite}</span>
                  <span className="text-teal">GOLD+: {p.goldPlus}</span>
                  <span className={p.critErrs > 0 ? "text-red" : "text-teal"}>CRIT: {p.critErrs}</span>
                </div>
                <div className="flex-1 text-[10px] text-muted-foreground font-sans">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SCHEMA CONFLICTS ── */}
      {view === "schema" && (
        <div className="space-y-4">
          <div className="bg-red/5 border border-red/30 rounded-lg p-4">
            <div className="text-sm font-bold text-red font-mono mb-1">SCHEMA / VERSION INCONSISTENCY — Warehouse Corruption Risk</div>
            <div className="text-xs text-foreground/70 font-sans leading-relaxed">
              The codebase currently references 46 chapters in multiple locations while the authoritative SPSS v12 data defines 45 chapters (Ch.46 = Epilogue addendum, not counted in core manuscript). This is not cosmetic — it will corrupt any automated audit run, chapter-count verification, or word-count aggregation. Fix before running any new audit.
            </div>
          </div>

          <DashCard title="Schema Conflict Registry — Resolve Before Next Audit Run" accent="red">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-[9px]">
                    <th className="text-left py-2 pr-3">Location</th>
                    <th className="text-left py-2 pr-3">Field</th>
                    <th className="text-center py-2 pr-3">Current</th>
                    <th className="text-center py-2 pr-3">Authoritative</th>
                    <th className="text-left py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {SCHEMA_CONFLICTS.map((c, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-secondary/20">
                      <td className="py-2 pr-3 text-foreground">{c.location}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{c.field}</td>
                      <td className="py-2 pr-3 text-center text-red font-bold">{c.current}</td>
                      <td className="py-2 pr-3 text-center text-teal font-bold">{c.authoritative}</td>
                      <td className="py-2 text-foreground/70">{c.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashCard>

          <DashCard title="Three-Gate Program — Execution Order" accent="teal">
            <div className="space-y-3">
              {[
                {
                  gate:"GATE 1 — Internal Reconciliation",
                  color:"red",
                  items:["Freeze canonical manuscript version and hash","Reconcile chapter count (45 core + 1 epilogue addendum)","Resolve all schema field definition conflicts","Delete 4 manuscript artifacts (Ch.1, Ch.34, Ch.24, Ch.38)","No prestige or market model output until this gate is closed"]
                },
                {
                  gate:"GATE 2 — Warehouse Build + API Ingestion",
                  color:"blue",
                  items:["Stand up PostgreSQL + ElasticSearch + pgvector","Ingest public sources first: Crossref, Google Books, Open Library","Build ETL pipeline with versioned transforms (dbt)","Comparative corpus assembly: Pulitzer/NBA, Chicano canon, war lit, adapted works","Licensed market data (BookScan/Nielsen) as phase-2 accelerant"]
                },
                {
                  gate:"GATE 3 — External Validation",
                  color:"teal",
                  items:["Reader cohort pilot studies (MFA, veteran, Chicano/Latino, academic, commercial)","Criterion validity: regress external outcomes on internal CLS/BIS/SII/MRF features","Pulitzer Vector, Scholarly Survival Index, Market Pressure Engine","Bootstrap confidence intervals on all high-stakes indices","IRB-grade consent for cohort participants; de-identified data"]
                }
              ].map(g => (
                <div key={g.gate} className={`p-3 rounded-lg bg-${g.color}/5 border border-${g.color}/30`}>
                  <div className={`text-xs font-bold font-mono text-${g.color} mb-2`}>{g.gate}</div>
                  <ul className="space-y-1">
                    {g.items.map((item, i) => (
                      <li key={i} className="text-[10px] font-sans text-foreground/70 flex gap-2">
                        <span className={`text-${g.color} flex-shrink-0`}>→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </DashCard>
        </div>
      )}
    </div>
  );
}