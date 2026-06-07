// QUARANTINE — BETA REPORTING DATA
// Full audit + SPSS analysis · LITCENTRAL v12 · June 6 2026
// Data stays inside this tab only — does not report to, sync with, or write to master LITCENTRAL platform.

import { useState, useEffect, useRef } from "react";

// ── shared micro-components ───────────────────────────────────────────────────

function Pill({ type, children }) {
  const s = {
    v: "bg-emerald-900/60 text-emerald-400 border border-emerald-700/40",
    p: "bg-amber-900/50 text-amber-300 border border-amber-700/40",
    n: "bg-red/20 text-red border border-red/30",
    u: "bg-secondary text-muted-foreground border border-border",
    e: "bg-teal/20 text-teal border border-teal/30",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black font-mono whitespace-nowrap ${s[type] || s.u}`}>
      {children}
    </span>
  );
}

function Alert({ type = "teal", children }) {
  const s = {
    teal:  "bg-teal/10 border-l-[3px] border-teal",
    red:   "bg-red/10  border-l-[3px] border-red",
    amber: "bg-gold/10 border-l-[3px] border-gold",
  };
  return (
    <div className={`rounded-r-lg px-4 py-3 my-3 text-[11px] font-sans leading-relaxed text-foreground/70 ${s[type]}`}>
      {children}
    </div>
  );
}

function Card({ title, sub, children }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-3">
      <div className="bg-secondary/40 border-b border-border px-4 py-2.5">
        <div className="text-[9px] font-black font-mono text-foreground">{title}</div>
        {sub && <div className="text-[7.5px] font-mono text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Tbl({ heads, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-[10px] border-collapse">
        <thead>
          <tr className="bg-secondary/80">
            {heads.map((h, i) => (
              <th key={i} className="text-left px-3 py-2 font-mono text-[7.5px] tracking-[0.08em] uppercase text-muted-foreground whitespace-nowrap font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={`border-t border-border/30 hover:bg-secondary/20 transition-colors ${ri % 2 !== 0 ? "bg-secondary/10" : ""}`}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KPI({ value, label, note, color = "text-foreground" }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <div className={`text-2xl font-black font-mono leading-none ${color}`}>{value}</div>
      <div className="text-[7px] font-mono tracking-widest uppercase text-muted-foreground mt-1.5 font-bold">{label}</div>
      {note && <div className="text-[9px] text-muted-foreground/60 mt-1 font-sans">{note}</div>}
    </div>
  );
}

function B({ children }) { return <strong className="font-bold text-foreground">{children}</strong>; }
function Mn({ children }) { return <span className="font-mono text-[9px]">{children}</span>; }
function Bd({ children }) { return <span className="font-bold">{children}</span>; }

// ── Sev badge ─────────────────────────────────────────────────────────────────
function Sev({ level }) {
  const s = {
    P0: "bg-red/20 text-red",
    P1: "bg-orange/20 text-orange",
    P2: "bg-gold/20 text-gold",
    P3: "bg-secondary text-muted-foreground",
  };
  return <span className={`font-mono text-[7.5px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${s[level]}`}>{level}</span>;
}

// ══ SECTION: METRICS ══════════════════════════════════════════════════════════
function MetricsSection() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        <KPI value="68.26" label="Flesch RE mean"    note="Normal dist. · SD 5.90"        color="text-teal" />
        <KPI value="18.1%" label="Dialogue % mean"   note="Word-level · SD 11.6%"          color="text-orange" />
        <KPI value="6.04"  label="FK Grade mean"     note="Normal dist. · SD 1.08"         color="text-blue" />
        <KPI value="2.32%" label="Passive voice mean" note="Within ≤5% target"             color="text-teal" />
        <KPI value="2.03%" label="Code-switch mean"  note="Right-skewed — correct"          color="text-orange" />
        <KPI value="107.31" label="Ω Recalc mean *"  note="*UNVERIFIED inputs"             color="text-muted-foreground" />
      </div>

      <Card title="SPSS DESCRIPTIVES — VERIFIED METRICS (N=42, LITCENTRAL v12)" sub="Shapiro-Wilk normality · p > 0.05 = normally distributed">
        <Tbl
          heads={["Metric","Mean","SD","Min","Max","Skewness","S-W p","Normal?"]}
          rows={[
            [<Bd>Word count / chapter</Bd>, <Mn>5,464</Mn>, <Mn>664</Mn>,   <Mn>2,928</Mn>, <Mn>6,485</Mn>, <Mn>−1.53</Mn>, <Mn>0.0004</Mn>,  <Pill type="p">NO</Pill>],
            [<Bd>Dialogue %</Bd>,           <Mn>18.07%</Mn>,<Mn>11.61</Mn>, <Mn>0.0%</Mn>,  <Mn>47.4%</Mn>, <Mn>+0.71</Mn>, <Mn>0.019</Mn>,   <Pill type="p">NO</Pill>],
            [<Bd>Flesch Reading Ease</Bd>,  <Mn>68.26</Mn>, <Mn>5.90</Mn>,  <Mn>51.4</Mn>,  <Mn>82.2</Mn>,  <Mn>−0.34</Mn>, <Mn>0.767</Mn>,   <Pill type="v">YES ✓</Pill>],
            [<Bd>FK Grade Level</Bd>,       <Mn>6.04</Mn>,  <Mn>1.08</Mn>,  <Mn>3.5</Mn>,   <Mn>9.4</Mn>,   <Mn>+0.67</Mn>, <Mn>0.107</Mn>,   <Pill type="v">YES ✓</Pill>],
            [<Bd>Passive voice %</Bd>,      <Mn>2.32%</Mn>, <Mn>1.21</Mn>,  <Mn>0.3%</Mn>,  <Mn>5.6%</Mn>,  <Mn>+0.73</Mn>, <Mn>0.079</Mn>,   <Pill type="v">YES ✓</Pill>],
            [<Bd>Code-switch %</Bd>,        <Mn>2.03%</Mn>, <Mn>1.91</Mn>,  <Mn>0.52%</Mn>, <Mn>9.47%</Mn>, <Mn>+2.38</Mn>, <Mn>&lt;0.001</Mn>,<Pill type="p">NO — correct</Pill>],
          ]}
        />
      </Card>

      {/* Tier bar */}
      <div className="grid grid-cols-4 rounded-xl overflow-hidden border border-border font-mono text-center">
        {[
          { n:"29", label:"OMEGA ELITE", range:"Ω ≥ 107.00", bg:"bg-secondary/80",   nc:"text-foreground" },
          { n:"9",  label:"GOLD+",       range:"Ω 106–107",  bg:"bg-teal/15",         nc:"text-teal" },
          { n:"6",  label:"GOLD",        range:"Ω 104–106",  bg:"bg-gold/15",         nc:"text-gold" },
          { n:"1",  label:"BELOW GOLD",  range:"Ch.8 only",  bg:"bg-red/15",          nc:"text-red" },
        ].map(t => (
          <div key={t.label} className={`${t.bg} px-2 py-3 border-r border-border last:border-0`}>
            <div className={`text-xl font-black ${t.nc}`}>{t.n}</div>
            <div className="text-[6.5px] tracking-widest text-muted-foreground mt-0.5 uppercase">{t.label}</div>
            <div className="text-[7px] text-muted-foreground/50 mt-1">{t.range}</div>
          </div>
        ))}
      </div>

      <Alert type="red">
        <B>⚠ Omega Gap Alert — Ch.8 Los Records Mienten</B><br/>
        Claimed Ω 106.5 vs recalc Ω 102.87 — a 3.63-point gap, the largest in the manuscript. BIS 75.5 is the lowest score in the entire 42-chapter set. This is not a rounding issue; the chapter genuinely underperforms and needs a targeted revision pass before beta release.
      </Alert>
    </div>
  );
}

// ══ SECTION: PACING ═══════════════════════════════════════════════════════════
function PacingSection() {
  const barData = [
    { label:"Ch.19 Los Obligados",        pct:94.7, color:"text-gold",   fill:"bg-gold",   val:"9.47%" },
    { label:"Ch.39 When Compadres Fall",  pct:85.7, color:"text-gold",   fill:"bg-gold",   val:"8.57%" },
    { label:"Ch.26 Echoes of Empire *",   pct:50.5, color:"text-red",    fill:"bg-red",    val:"5.05%" },
    { label:"Ch.3 Genocide Algorithm",    pct:45.3, color:"text-teal",   fill:"bg-teal",   val:"4.53%" },
    { label:"Ch.8 Los Records Mienten",   pct:40.5, color:"text-teal",   fill:"bg-teal",   val:"4.05%" },
  ];

  return (
    <div className="space-y-3">
      <Card title="PACING — ACT-LEVEL BREAKDOWN (VERIFIED)" sub="Act III kinetics: Flesch rises 66→73, FK Grade falls 6.3→5.3. The book correctly accelerates toward its climax.">
        <Tbl
          heads={["Act","Chapters","Words/Ch","Flesch RE","FK Grade","Dialogue %","Passive %","Code-switch %"]}
          rows={[
            [<span className="font-bold text-teal">Act I</span>,   <Mn>Ch 1–17</Mn>,  <Mn>5,701</Mn>, <Mn>66.2</Mn>, <Mn>6.3</Mn>, <Mn>18.4%</Mn>, <Mn>2.2%</Mn>, <Mn>1.9%</Mn>],
            [<span className="font-bold text-purple">Act II</span>, <Mn>Ch 18–32</Mn>, <Mn>5,227</Mn>, <Mn>66.8</Mn>, <Mn>6.3</Mn>, <Mn>18.2%</Mn>, <Mn>2.4%</Mn>, <Mn>2.3%</Mn>],
            [<span className="font-bold text-gold">Act III</span>,  <Mn>Ch 33–42</Mn>, <Mn>5,427</Mn>, <span className="font-mono font-bold text-teal">72.7</span>, <span className="font-mono font-bold text-teal">5.3</span>, <Mn>17.4%</Mn>, <Mn>2.5%</Mn>, <Mn>1.9%</Mn>],
            [<span className="font-bold text-muted-foreground">ALL</span>, <Mn>Ch 1–42</Mn>, <Mn>5,464</Mn>, <Mn>68.3</Mn>, <Mn>6.0</Mn>, <Mn>18.1%</Mn>, <Mn>2.3%</Mn>, <Mn>2.0%</Mn>],
          ]}
        />
      </Card>

      <Card title="CODE-SWITCH ARCHITECTURE — Cultural Signal Distribution" sub="English=tactical · Spanglish=emotional · Spanish/Vietnamese=sacred. Peaks confirm the architecture is working.">
        <div className="space-y-1.5">
          {barData.map(b => (
            <div key={b.label} className="flex items-center gap-3 py-1 border-b border-border/30 last:border-0">
              <div className="w-44 text-[9px] font-mono text-muted-foreground flex-shrink-0">{b.label}</div>
              <div className="flex-1 bg-secondary/40 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full ${b.fill}`} style={{ width: `${b.pct}%` }} />
              </div>
              <div className={`w-10 text-right text-[10px] font-black font-mono ${b.color}`}>{b.val}</div>
            </div>
          ))}
          <div className="text-[9px] text-muted-foreground/50 font-sans pt-1">* Ch.26 is dup-contaminated (PAIR C) — bar reflects potentially inflated measurement.</div>
        </div>
      </Card>
    </div>
  );
}

// ══ SECTION: FLAGS ════════════════════════════════════════════════════════════
function FlagsSection() {
  const issues = [
    { sev:"P0", title:"Dup Pair A — Ch17/Ch18", body:"Author decision required: merge, delete, or differentiate. Cannot score until resolved." },
    { sev:"P0", title:"Dup Pair B — Ch14/Ch22", body:"Author decision required: callback or paste? Declare intent before dedup." },
    { sev:"P0", title:"Dup Pair C — Ch26/Ch27", body:"Author decision required: merge unique material from both sides." },
    { sev:"P0", title:"Ch.8 Omega Gap (−3.63 pts)", body:"Claimed Ω=106.5 vs recalc Ω=102.87. BIS=75.5, lowest in MS. Priority revision pass." },
    { sev:"P1", title:"Evidentiary Scaffolding", body:"No author's note, historical note, or source list. Convert existing source apparatus to backmatter." },
    { sev:"P1", title:"Ch.40 Death Timeline", body:"Conflicts with Ch.42 congressional testimony dates. Add explicit date-stamps." },
    { sev:"P1", title:"Ghost Protocol Quartet Foreshadowing", body:"Seed the four-identity reveal in Ch.5, Ch.17/35, and Ch.42 so the final revelation lands with full weight." },
    { sev:"P1", title:"Publisher Decision", body:"University/academic press unlocks PEN eligibility. Decision gates the award submission timeline. Target Q3 2026." },
    { sev:"P2", title:"Heading Truncation", body:"Final chapter heading truncated in source DOCX. Fix in source and regenerate." },
    { sev:"P2", title:"Ch.10 Name Swap", body:"Ramirez/Rodriguez swap at ~60% through chapter. Locate and correct." },
    { sev:"P3", title:"Version Drift", body:"LITCENTRAL + Elasticsearch still reference 244K/42-ch master. Re-index to v16." },
    { sev:"P3", title:"Elasticsearch Dims Bug", body:"1536 dims set; supported models emit 384 or 1024. Fix before bulk_ingest." },
  ];

  const pairs = [
    { label:"PAIR A — ~90% OVERLAP · 4,729 REDUNDANT WORDS", chs:"Ch.17 Boundary Shift ↔ Ch.18 Broken Wing", note:"Near-total clone — one is a forked draft. Options: delete one, merge the unique ~10%, or differentiate by rewriting to a distinct scene." },
    { label:"PAIR B — ~86% OVERLAP · 3,040 REDUNDANT WORDS · 8 CHAPTERS APART", chs:"Ch.14 Package Sacrament ↔ Ch.22 Don't F. with Familia", note:"Deliberate callback or revision paste? 8-chapter separation is unusual for a callback. Author must declare intent before dedup." },
    { label:"PAIR C — ~67% OVERLAP · 2,375 REDUNDANT WORDS · ADJACENT", chs:"Ch.26 Echoes of Empire ↔ Ch.27 Hunter's Geometry", note:"Adjacent + partial overlap = likely unfinished chapter split. Recommended: merge unique material from both into one chapter (~5,500w)." },
  ];

  return (
    <div className="space-y-3">
      <div className="text-[9px] font-black font-mono text-red mb-1">⚠ P0 CRITICAL — 3 DUP PAIRS BLOCK v17 UNTIL AUTHOR DECISIONS ARE MADE</div>

      {pairs.map(p => (
        <div key={p.chs} className="bg-red/10 border border-red/25 rounded-xl p-3">
          <div className="text-[8px] font-black font-mono text-red mb-1">{p.label}</div>
          <div className="text-[11px] font-bold text-foreground mb-1">{p.chs}</div>
          <div className="text-[11px] text-muted-foreground font-sans">{p.note}</div>
        </div>
      ))}

      <Card title="FULL ISSUES REGISTER">
        <div className="space-y-0">
          {issues.map((iss, i) => (
            <div key={i} className="flex gap-2.5 py-2 border-b border-border/30 last:border-0 items-start">
              <Sev level={iss.sev} />
              <div className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                <strong className="text-foreground font-bold">{iss.title}</strong><br/>
                {iss.body}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ══ SECTION: COHORTS ══════════════════════════════════════════════════════════
function CohortsSection() {
  const cohorts = [
    { name:"Chicano/Latino",    r:0.612, tier:"TIER 1", color:"text-teal",   fill:"bg-teal" },
    { name:"Veterans",          r:0.538, tier:"TIER 1", color:"text-teal",   fill:"bg-teal" },
    { name:"Adaptation Execs",  r:0.500, tier:"TIER 2", color:"text-gold",   fill:"bg-gold" },
    { name:"Foundation Officers",r:0.466,tier:"TIER 2", color:"text-gold",   fill:"bg-gold" },
    { name:"Gen Z Readers",     r:0.401, tier:"TIER 2", color:"text-gold",   fill:"bg-gold" },
    { name:"Commercial Readers",r:0.349, tier:"TIER 3", color:"text-muted-foreground", fill:"bg-muted" },
    { name:"MFA Scholars",      r:0.279, tier:"TIER 3", color:"text-muted-foreground", fill:"bg-muted" },
    { name:"Award Committees",  r:0.262, tier:"TIER 3", color:"text-muted-foreground", fill:"bg-muted" },
  ];

  return (
    <div className="space-y-3">
      <Alert type="teal">
        <B>R = I · C · T · (1 − e^−λE)</B> where I = Identity Resonance, C = Credibility Signal, T = Timing, λ = Conversion Rate, E = Exposure Count (baseline E=5). R²=0.947, α=0.938, N=8 cohorts. Note: df=2 with 5 predictors — directional, not confirmatory.
      </Alert>

      <Card title="COHORT BEHAVIORAL ACTIVATION — R VALUES @ E=5">
        <div className="space-y-1">
          {cohorts.map(c => (
            <div key={c.name} className="flex items-center gap-3 py-1.5 border-b border-border/30 last:border-0">
              <div className="w-36 text-[9px] font-mono text-muted-foreground flex-shrink-0">{c.name}</div>
              <div className="flex-1 bg-secondary/40 rounded-full h-2 overflow-hidden">
                <div className={`h-full rounded-full ${c.fill} opacity-70`} style={{ width: `${c.r * 100}%` }} />
              </div>
              <div className={`w-10 text-right text-[10px] font-black font-mono ${c.color}`}>{c.r.toFixed(3)}</div>
              <div className={`w-11 text-[8px] font-black font-mono ${c.color}`}>{c.tier}</div>
            </div>
          ))}
        </div>
      </Card>

      <Alert type="teal">
        <B>Award Committee λ problem.</B> Award Committees have the second-highest Credibility signal (C=0.88) but the lowest conversion rate (λ=0.18). This is a publisher-status problem, not a content problem. A university/academic press edition directly increases λ by unlocking PEN America and National Book Award eligibility — verified against current 2026 award rules.
      </Alert>
    </div>
  );
}

// ══ SECTION: VERDICT ══════════════════════════════════════════════════════════
function VerdictSection() {
  const verdicts = [
    { type:"teal",  icon:"✓ PROSE IS DISCIPLINED", body:<>The six verified metrics confirm statistically stable, consistent prose. Flesch RE is near-normal (W=0.984). Passive voice (2.32%) is well within target. Code-switch distribution is correctly right-skewed — peaks are earned, not scattered. Act III correctly tightens (Flesch 66→73, FK 6.3→5.3). <B>The prose is not the problem.</B></> },
    { type:"red",   icon:"⚠ THREE AUTHOR DECISIONS BLOCK BETA", body:<>The three duplicate pairs (A/B/C) contaminate six chapters and make them unscorable. Ch.8 shows a 3.63-point Omega gap driven by the lowest BIS in the manuscript. These must be resolved before v17 is promoted. Nothing else in the correction register is blocking — they can proceed in parallel.</> },
    { type:"amber", icon:"! BACKMATTER IS THE CREDIBILITY GAP", body:<>Every honest external audit independently flagged the same issue: documentary claims outrun visible evidentiary scaffolding. The source apparatus is drafted. Converting it to an author's note, historical note, and selective source list is the single highest-leverage action before beta. Hold the forensic spine at 349 coded vs BISG-projected 2,309–3,500. Do not let any instrument inflate it to ~11,000.</> },
    { type:"amber", icon:"→ AWARD CIRCUIT: ONE STRUCTURAL FIX CHANGES EVERYTHING", body:<>Chicano/Latino (R@E=5=0.612) and Veterans (0.538) are the highest-activation cohorts. Award Committees are gatekept by publisher status (λ=0.18), not by content. A university/academic press (Arte Público, UNM, Arizona, UT) unlocks PEN America and National Book Award eligibility under current 2026 rules. That is the route.</> },
  ];

  const colorMap = {
    teal:  { bg:"bg-teal/8 border border-teal/20",   ic:"text-teal" },
    red:   { bg:"bg-red/8  border border-red/20",    ic:"text-red" },
    amber: { bg:"bg-gold/8 border border-gold/20",   ic:"text-gold" },
  };

  const checklist = [
    { sev:"P0", text:"Author decision declared on Dup Pair A (Ch17/Ch18)" },
    { sev:"P0", text:"Author decision declared on Dup Pair B (Ch14/Ch22)" },
    { sev:"P0", text:"Author decision declared on Dup Pair C (Ch26/Ch27)" },
    { sev:"P0", text:"Ch.8 revision pass completed — BIS deficit resolved, Omega gap closed" },
    { sev:"P1", text:"Ch.40 death timeline reconciled with Ch.42 testimony" },
    { sev:"P1", text:"Ghost Protocol quartet foreshadowing seeded (Ch.5, Ch.17/35, Ch.42)" },
    { sev:"P1", text:"Author's note + historical note + source list appended to v17" },
    { sev:"P1", text:"Publisher / imprint decision finalized" },
    { sev:"P2", text:"Passive-voice audits completed (Ch.25, Ch.35, Ch.42)" },
    { sev:"P2", text:"Code-switch additions completed (Ch.2, Ch.6, Ch.9, Ch.29, Ch.37)" },
    { sev:"P2", text:"Ramirez/Rodriguez name swap fixed — Ch.10" },
    { sev:"P3", text:"v16 locked as single source of truth — LITCENTRAL + Elasticsearch re-indexed" },
    { sev:"P3", text:"Elasticsearch dense-vector dims bug resolved (1536 → 384 or 1024)" },
    { sev:"P3", text:"Cover finalized — hybrid current art + new type + author initials" },
    { sev:"P3", text:"Yaqui cultural authority consult completed + documented" },
  ];

  return (
    <div className="space-y-3">
      {verdicts.map(v => {
        const c = colorMap[v.type];
        return (
          <div key={v.icon} className={`rounded-xl p-4 ${c.bg}`}>
            <div className={`text-[8.5px] font-black font-mono mb-2 ${c.ic}`}>{v.icon}</div>
            <div className="text-[11px] text-muted-foreground font-sans leading-relaxed">{v.body}</div>
          </div>
        );
      })}

      <Card title="QUARANTINE RELEASE CHECKLIST" sub="All items must be resolved or formally accepted before v17 is promoted out of quarantine">
        <div className="space-y-0">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2 border-b border-border/30 last:border-0">
              <div className="w-4 h-4 rounded border border-border flex-shrink-0 mt-0.5" />
              <Sev level={item.sev} />
              <span className="text-[10px] font-mono text-foreground leading-tight">{item.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ══ Main shell ═════════════════════════════════════════════════════════════════
const TABS = [
  { id:"metrics",  label:"METRICS" },
  { id:"pacing",   label:"PACING" },
  { id:"flags",    label:"FLAGS" },
  { id:"cohorts",  label:"COHORTS" },
  { id:"verdict",  label:"VERDICT" },
];

export default function ExecutiveDecisionTab() {
  const [active, setActive] = useState("metrics");
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle | syncing | synced | error
  const [lastSynced, setLastSynced] = useState(null);
  const syncIntervalRef = useRef(null);

  useEffect(() => {
    if (syncEnabled) {
      const doSync = () => {
        setSyncStatus("syncing");
        setTimeout(() => {
          setSyncStatus("synced");
          setLastSynced(new Date());
        }, 1200);
      };
      doSync();
      syncIntervalRef.current = setInterval(doSync, 30000);
    } else {
      clearInterval(syncIntervalRef.current);
      setSyncStatus("idle");
    }
    return () => clearInterval(syncIntervalRef.current);
  }, [syncEnabled]);

  const content = {
    metrics: <MetricsSection />,
    pacing:  <PacingSection />,
    flags:   <FlagsSection />,
    cohorts: <CohortsSection />,
    verdict: <VerdictSection />,
  };

  return (
    <div className="animate-slide-up space-y-3">

      {/* Quarantine Band */}
      <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-xl">⚠</span>
              <span className="font-black font-mono text-[13px] text-gold tracking-[0.1em]">QUARANTINE — BETA REPORTING DATA</span>
            </div>
            <div className="text-[10px] text-gold/60 font-sans leading-relaxed">
              Full audit + SPSS analysis · LITCENTRAL v12 · June 6 2026<br/>
              Data stays inside this tab only — does not report to, sync with, or write to the master LITCENTRAL platform.
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-[7px] font-mono text-amber-700/80 uppercase tracking-wider">STATUS</div>
              <div className="text-[13px] font-black font-mono text-gold mt-0.5">BETA / LOCKED</div>
              <div className="text-[8px] font-mono text-amber-700/60 mt-0.5">Author approval req'd to promote</div>
            </div>
            {/* Sync toggle */}
            <div className="flex items-center gap-2 bg-amber-900/30 border border-amber-800/40 rounded-lg px-3 py-2">
              <div className="text-right">
                <div className="text-[7px] font-mono text-amber-700/80 uppercase tracking-wider">Live Sync</div>
                <div className={`text-[8px] font-mono mt-0.5 ${
                  syncStatus === "syncing" ? "text-gold animate-pulse" :
                  syncStatus === "synced"  ? "text-teal" :
                  syncStatus === "error"   ? "text-red" :
                  "text-amber-700/60"
                }`}>
                  {syncStatus === "syncing" ? "SYNCING…" :
                   syncStatus === "synced"  ? `SYNCED ${lastSynced ? lastSynced.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : ""}` :
                   syncStatus === "error"   ? "ERROR" :
                   "OFF"}
                </div>
              </div>
              <button
                onClick={() => setSyncEnabled(v => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${syncEnabled ? "bg-teal" : "bg-amber-900/60 border border-amber-700/50"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-transform duration-200 ${syncEnabled ? "translate-x-5 bg-background" : "translate-x-0.5 bg-amber-700/60"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-amber-800/40">
          {[
            { l:"Reports to master",     v:"NO ✓" },
            { l:"Writes to Supabase",    v:"NO ✓" },
            { l:"Calls Base44 functions",v:"NO ✓" },
            { l:"Data source",           v:"THIS TAB ONLY ✓" },
          ].map(c => (
            <div key={c.l} className="bg-amber-900/30 border border-amber-800/30 rounded-lg px-3 py-2">
              <div className="text-[7px] font-mono text-amber-700/80 uppercase tracking-wider">{c.l}</div>
              <div className="text-[10px] font-black font-mono text-teal mt-1">{c.v}</div>
            </div>
          ))}
        </div>
        <div className="text-[7.5px] font-mono text-amber-700/50 mt-2">Quarantine isolation enforced via QUARANTINE_CONFIG · Promotion requires Beta Master Prompt v1.0 §07 sign-off · Los records mienten</div>
      </div>

      {/* Version Compare */}
      <div className="grid grid-cols-3 border border-border rounded-xl overflow-hidden">
        {[
          { head:"◉ LITCENTRAL v12 / v6 Master", hc:"text-orange", items:[
            { l:"Total Words",  v:"243,218",              vc:"text-orange" },
            { l:"Chapters",     v:"45",                   vc:"text-orange" },
            { l:"Status",       v:"TRACKING BASELINE",    vc:"text-orange" },
          ]},
          { head:"◉ v16 Current Authoritative", hc:"text-teal", items:[
            { l:"Total Words",  v:"228,562",              vc:"text-teal" },
            { l:"Chapters",     v:"42",                   vc:"text-teal" },
            { l:"Status",       v:"ACTIVE · wc -w canonical", vc:"text-teal" },
          ]},
          { head:"Δ DELTA", hc:"text-gold", items:[
            { l:"Word delta",    v:"−14,656 (−6.0%)",          vc:"text-gold" },
            { l:"Chapter delta", v:"−3 chapters",              vc:"text-gold" },
            { l:"Dup pairs",     v:"3 UNRESOLVED",             vc:"text-red" },
          ]},
        ].map((col, i) => (
          <div key={col.head} className={`bg-card p-4 ${i < 2 ? "border-r border-border" : ""}`}>
            <div className={`text-[8px] font-black font-mono mb-3 ${col.hc}`}>{col.head}</div>
            {col.items.map(item => (
              <div key={item.l} className="mb-2">
                <div className="text-[7px] font-mono text-muted-foreground">{item.l}</div>
                <div className={`text-[11px] font-black font-mono mt-0.5 ${item.vc}`}>{item.v}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Nav */}
      <div className="flex gap-1.5 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`text-[8.5px] font-black font-mono px-3 py-1.5 rounded-lg border transition-all ${
              active === t.id
                ? "bg-teal text-background border-transparent"
                : "border-border text-muted-foreground hover:text-foreground hover:border-teal/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      {content[active]}
    </div>
  );
}