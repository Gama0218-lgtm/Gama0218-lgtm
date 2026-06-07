import { useState, useRef } from "react";
import {
  CHAPTERS, STATS, QUICK_ACTIONS, CHAPTER_BUGS,
  CONVERGENCE_STREAMS, GLOSSARY, CHARACTER_BIBLE,
  REGRESSION, ARC_DATA, EMOTION_DATA, NERO_DATA, NDR_DATA
} from "../../lib/data";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const GENERATED = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const ACT_CHAPTERS = {
  "I":   CHAPTERS.filter(c => c.act === "I"),
  "II":  CHAPTERS.filter(c => c.act === "II"),
  "III": CHAPTERS.filter(c => c.act === "III"),
};

const BUGS_BY_SEV = {
  CRIT: CHAPTER_BUGS.filter(b => b.sev === "CRIT"),
  HIGH: CHAPTER_BUGS.filter(b => b.sev === "HIGH"),
  MED:  CHAPTER_BUGS.filter(b => b.sev === "MED"),
  LOW:  CHAPTER_BUGS.filter(b => b.sev === "LOW"),
};

function actAvg(act, key) {
  const chs = ACT_CHAPTERS[act].filter(c => c[key]);
  return chs.length ? (chs.reduce((s, c) => s + c[key], 0) / chs.length).toFixed(1) : "—";
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, number, title, accent = "gold", children }) {
  const colors = {
    gold: "border-gold/40 text-gold",
    blue: "border-blue/40 text-blue",
    red: "border-red/40 text-red",
    teal: "border-teal/40 text-teal",
    purple: "border-purple/40 text-purple",
    orange: "border-orange/40 text-orange",
    cyan: "border-cyan/40 text-cyan",
  };
  return (
    <section id={id} className="mb-10">
      <div className={`flex items-center gap-3 mb-5 pb-2 border-b ${colors[accent]}`}>
        <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded border ${colors[accent]} bg-card`}>§{number}</span>
        <h2 className={`text-base font-black font-mono tracking-wide ${colors[accent]}`}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Table({ headers, rows, accent = "gold" }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 px-3 text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={`border-b border-border/40 ${ri % 2 === 0 ? "bg-card" : "bg-background"} hover:bg-secondary/20 transition-colors`}>
              {row.map((cell, ci) => (
                <td key={ci} className="py-2 px-3 text-foreground/80 font-sans">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ label, value, color = "gold", sub }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 text-center">
      <div className={`text-2xl font-black font-mono text-${color}`}>{value}</div>
      <div className="text-[9px] text-muted-foreground font-mono mt-0.5 uppercase tracking-wide">{label}</div>
      {sub && <div className={`text-[9px] font-bold text-${color} mt-0.5`}>{sub}</div>}
    </div>
  );
}

function Badge({ label, color = "gold" }) {
  return (
    <span className={`inline-block text-[8px] px-1.5 py-0.5 rounded border font-mono font-bold text-${color} border-${color}/30 bg-${color}/10 mr-1 mb-1`}>{label}</span>
  );
}

// ─── TOC ─────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "s1",  num: "1",  title: "Executive Summary",             accent: "gold"   },
  { id: "s2",  num: "2",  title: "Manuscript Statistics",          accent: "blue"   },
  { id: "s3",  num: "3",  title: "Act-by-Act Performance",         accent: "gold"   },
  { id: "s4",  num: "4",  title: "Full Chapter Scorecard",         accent: "teal"   },
  { id: "s5",  num: "5",  title: "Omega Regression Model",         accent: "purple" },
  { id: "s6",  num: "6",  title: "Character Profiles & CL-MoE",   accent: "orange" },
  { id: "s7",  num: "7",  title: "NERO Analysis",                  accent: "red"    },
  { id: "s8",  num: "8",  title: "Narrative/Dialogue Ratio Map",   accent: "cyan"   },
  { id: "s9",  num: "9",  title: "Editorial Bug Ledger",           accent: "red"    },
  { id: "s10", num: "10", title: "Priority Action Queue",          accent: "orange" },
  { id: "s11", num: "11", title: "TruthEngine360 Convergence",     accent: "teal"   },
  { id: "s12", num: "12", title: "Glossary of Key Terms",          accent: "blue"   },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FullReportTab() {
  const [activeToc, setActiveToc] = useState("s1");
  const reportRef = useRef(null);

  const scrollTo = (id) => {
    setActiveToc(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePrint = () => window.print();

  return (
    <div className="animate-slide-up">
      {/* Report header */}
      <div className="bg-card border border-gold/30 rounded-lg p-5 mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-widest mb-1">LITCENTRAL v7 · FULL MANUSCRIPT INTELLIGENCE REPORT</div>
          <h1 className="text-xl font-black font-mono text-gold leading-tight">SGT George Ramos:<br/><span className="text-foreground">The Mathematics of Vietnam</span></h1>
          <div className="text-[10px] text-muted-foreground font-sans mt-2">Generated: {GENERATED} · Manuscript Version 5 · 44 Chapters · {STATS.totalWords.toLocaleString()} Words</div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={handlePrint}
            className="px-4 py-2 bg-gold text-background rounded-lg text-xs font-black font-mono hover:bg-gold/80 transition-all">
            🖨 Print / Export PDF
          </button>
          <div className="text-[9px] text-muted-foreground font-mono text-center">Use browser print dialog</div>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sticky TOC sidebar */}
        <div className="w-52 flex-shrink-0 sticky top-4 hidden lg:block">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[8px] font-bold font-mono text-muted-foreground uppercase tracking-wider mb-2">Table of Contents</div>
            <div className="space-y-0.5">
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className={`w-full text-left px-2 py-1.5 rounded text-[9px] font-mono transition-all flex items-start gap-1.5 ${activeToc === s.id ? `text-${s.accent} bg-${s.accent}/10 font-bold` : "text-muted-foreground hover:text-foreground"}`}>
                  <span className="opacity-60 flex-shrink-0">§{s.num}</span>
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report body */}
        <div className="flex-1 min-w-0" ref={reportRef}>

          {/* §1 Executive Summary */}
          <Section id="s1" number="1" title="Executive Summary" accent="gold">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <Stat label="Avg Omega Score" value={STATS.avgOmega} color="gold" sub="Omega Elite tier" />
              <Stat label="Total Words" value={STATS.totalWords.toLocaleString()} color="blue" sub="44 chapters" />
              <Stat label="Chapters Scored" value="44 / 44" color="teal" sub="100% complete" />
              <Stat label="Open Bugs" value={CHAPTER_BUGS.filter(b => !b.fixed).length} color="red" sub={`${BUGS_BY_SEV.CRIT.length} critical`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              <div className="p-4 bg-teal/5 border border-teal/30 rounded-lg">
                <div className="text-[9px] font-bold font-mono text-teal uppercase mb-2">Manuscript Status</div>
                <p className="text-xs font-sans text-foreground/80 leading-relaxed">
                  Version 5 audit complete. All 44 chapters scored at Omega Elite tier (≥105). Average Omega score of <strong className="text-gold">{STATS.avgOmega}</strong> — the highest tier in the scoring framework. The manuscript achieves consistent sensory density, cultural linguistic specificity, behavioral integrity, and Marlowe Retention Force across all three acts. Two critical editorial issues remain unresolved: the Ch.9 Ramirez/Rodriguez name error and the missing Ch.40 bathroom prayer scene (2,604 words).
                </p>
              </div>
              <div className="p-4 bg-gold/5 border border-gold/30 rounded-lg">
                <div className="text-[9px] font-bold font-mono text-gold uppercase mb-2">Key Deadlines</div>
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between"><span className="text-muted-foreground">CHC Briefing</span><span className="font-bold text-gold">May 18, 2026 — {STATS.daysCHC} days</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Publication Target</span><span className="font-bold text-red">{STATS.daysPub} days</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">FOIA Overdue</span><span className="font-bold text-red">3 agencies</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">AUMER 2026 Audit</span><span className="font-bold text-teal">In progress</span></div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase mb-2">Omega Regression Formula (R²=0.947)</div>
              <code className="text-xs font-mono text-foreground/80">Ω = 71.443 + 0.124(CLS) + 0.118(BIS) + 0.089(SII) + 0.067(MRF) + 0.041(RRP)</code>
            </div>
          </Section>

          {/* §2 Manuscript Statistics */}
          <Section id="s2" number="2" title="Manuscript Statistics" accent="blue">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <Stat label="Avg CLS (Cultural)" value={STATS.avgCLS} color="purple" />
              <Stat label="Avg SII (Sensory)" value={STATS.avgSII} color="cyan" />
              <Stat label="Avg BIS (Behavioral)" value={STATS.avgBIS} color="orange" />
              <Stat label="CL-MoE Overall" value="0.048" color="blue" sub="Near-zero drift" />
            </div>
            <Table
              headers={["Metric", "Value", "Notes"]}
              rows={[
                ["Total Words", STATS.totalWords.toLocaleString(), "Across 44 chapters"],
                ["Avg Words/Chapter", Math.round(STATS.totalWords / 44).toLocaleString(), "Target: 5,000–6,500"],
                ["Omega Elite Chapters", `${STATS.elite} / 44`, "All chapters at Omega Elite tier"],
                ["Avg Omega Score", STATS.avgOmega, "Scale: <100 Standard · 105+ Elite"],
                ["Avg Cultural Ling. Score", STATS.avgCLS, "Code-switching density + authenticity"],
                ["Avg Sensory Immersion", STATS.avgSII, "Target: 20+ sensory hits / 1k words"],
                ["Avg Behavioral Integrity", STATS.avgBIS, "Character arc consistency"],
                ["CL-MoE Overall Drift", "0.048", "Near-zero; healthy range ≤0.08"],
                ["Missing Chapters", STATS.missing.length || 0, STATS.missing.length ? STATS.missing.join(", ") : "None"],
              ]}
            />
          </Section>

          {/* §3 Act-by-Act Performance */}
          <Section id="s3" number="3" title="Act-by-Act Performance" accent="gold">
            {["I", "II", "III"].map(act => {
              const chs = ACT_CHAPTERS[act];
              const avgOmega = actAvg(act, "omega");
              const avgWords = Math.round(chs.reduce((s, c) => s + (c.words || 0), 0) / chs.length);
              const highFP = chs.filter(c => c.fp === "HIGH").length;
              const colors = { I: "gold", II: "blue", III: "teal" };
              const col = colors[act];
              return (
                <div key={act} className={`mb-4 p-4 bg-card border border-${col}/30 rounded-lg`}>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <span className={`text-sm font-black font-mono text-${col}`}>Act {act}</span>
                      <span className="text-[10px] text-muted-foreground font-mono ml-2">
                        Ch.{chs[0].ch}–{chs[chs.length - 1].ch} · {chs.length} chapters · {chs.reduce((s, c) => s + (c.words || 0), 0).toLocaleString()} words
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center"><div className={`text-lg font-black font-mono text-${col}`}>{avgOmega}</div><div className="text-[8px] text-muted-foreground font-mono">Avg Ω</div></div>
                      <div className="text-center"><div className="text-lg font-black font-mono text-foreground">{avgWords.toLocaleString()}</div><div className="text-[8px] text-muted-foreground font-mono">Avg Words</div></div>
                      <div className="text-center"><div className={`text-lg font-black font-mono ${highFP > 0 ? "text-red" : "text-teal"}`}>{highFP}</div><div className="text-[8px] text-muted-foreground font-mono">High FP Risk</div></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {chs.map(c => (
                      <span key={c.ch} className={`text-[8px] px-1.5 py-0.5 rounded font-mono border ${c.fp === "HIGH" ? "text-red border-red/30 bg-red/10" : c.fp === "MED" ? "text-gold border-gold/30 bg-gold/10" : `text-${col} border-${col}/20 bg-${col}/5`}`}>
                        Ch.{c.ch} Ω{c.omega}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </Section>

          {/* §4 Full Chapter Scorecard */}
          <Section id="s4" number="4" title="Full Chapter Scorecard" accent="teal">
            <Table
              headers={["Ch", "Title", "Act", "Ω", "RRP", "CLS", "SII", "BIS", "MRF", "Words", "FP Risk", "Notes"]}
              rows={CHAPTERS.filter(c => !c.isMissing).map(c => [
                <span className="font-mono font-bold text-muted-foreground">{c.ch}</span>,
                <span className="font-sans">{c.title}</span>,
                <span className={`font-mono font-bold text-${c.act === "I" ? "gold" : c.act === "II" ? "blue" : "teal"}`}>{c.act}</span>,
                <span className="font-mono font-bold text-gold">{c.omega}</span>,
                <span className="font-mono text-foreground/70">{c.rrp}</span>,
                <span className="font-mono text-purple">{c.cls}</span>,
                <span className="font-mono text-cyan">{c.sii}</span>,
                <span className="font-mono text-orange">{c.bis}</span>,
                <span className="font-mono text-blue">{c.mrf}</span>,
                <span className="font-mono text-foreground/60">{c.words?.toLocaleString()}</span>,
                <span className={`font-mono font-bold text-[9px] ${c.fp === "HIGH" ? "text-red" : c.fp === "MED" ? "text-gold" : "text-teal"}`}>{c.fp}</span>,
                <span className="text-[9px] text-muted-foreground font-sans">{c.fix?.substring(0, 50)}{c.fix?.length > 50 ? "…" : ""}</span>,
              ])}
            />
          </Section>

          {/* §5 Omega Regression */}
          <Section id="s5" number="5" title="Omega Regression Model" accent="purple">
            <p className="text-xs font-sans text-foreground/70 leading-relaxed mb-4">
              OLS regression on 43 scored chapters. Dependent variable: Omega Score. R²=0.947 indicates the five predictors explain 94.7% of variance in chapter quality scores.
            </p>
            <Table
              headers={["Variable", "Coefficient", "p-Value", "Significance"]}
              rows={REGRESSION.map(r => [
                <span className={`font-bold font-mono text-${r.color}`}>{r.variable}</span>,
                <span className="font-mono text-foreground">{r.coeff}</span>,
                <span className="font-mono text-muted-foreground">{r.pValue}</span>,
                <span className={`font-mono font-bold ${r.sig === "***" ? "text-teal" : r.sig === "**" ? "text-gold" : "text-blue"}`}>{r.sig}</span>,
              ])}
            />
            <div className="mt-3 p-3 bg-card border border-border rounded-lg text-[9px] text-muted-foreground font-mono">
              *** p&lt;0.001 · ** p&lt;0.01 · * p&lt;0.05 | Intercept: 71.443 (p&lt;0.001) | R²=0.947 | n=43
            </div>
          </Section>

          {/* §6 Characters */}
          <Section id="s6" number="6" title="Character Profiles & CL-MoE" accent="orange">
            <Table
              headers={["Character", "Arc", "CL-MoE Drift", "Flag", "Status Notes"]}
              rows={CHARACTER_BIBLE.map(c => [
                <span className={`font-bold font-mono text-${c.color}`}>{c.name}</span>,
                <span className={`font-mono text-[9px] font-bold ${c.arc === "COMPLETE" ? "text-teal" : c.arc === "INCOMPLETE" ? "text-red" : "text-blue"}`}>{c.arc}</span>,
                <span className={`font-mono font-bold ${c.clmoe > 0.1 ? "text-red" : c.clmoe > 0.07 ? "text-gold" : "text-teal"}`}>{c.clmoe}</span>,
                <span className={`font-mono font-bold ${c.flag ? "text-red" : "text-muted-foreground"}`}>{c.flag ? "⚠ YES" : "—"}</span>,
                <span className="text-[9px] font-sans text-foreground/70">{c.note}</span>,
              ])}
            />
          </Section>

          {/* §7 NERO */}
          <Section id="s7" number="7" title="NERO Analysis" accent="red">
            <p className="text-xs font-sans text-foreground/70 leading-relaxed mb-4">
              NERO = Notification · Erasure · Restriction · Obscurity — the four mechanisms of institutional silencing tracked per chapter. Counter-NERO chapters are those where the narrative actively reverses one or more mechanisms.
            </p>
            {(() => {
              const all4    = NERO_DATA.filter(d => d.N && d.E && d.R && d.O).length;
              const counter = NERO_DATA.filter(d => !d.N && !d.E && !d.R && !d.O).length;
              const nOnly   = NERO_DATA.filter(d => d.N).length;
              const eOnly   = NERO_DATA.filter(d => d.E).length;
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <Stat label="All-4 NERO Chapters" value={all4} color="red" />
                  <Stat label="Counter-NERO" value={counter} color="teal" />
                  <Stat label="Notification (N)" value={nOnly} color="orange" />
                  <Stat label="Erasure (E)" value={eOnly} color="purple" />
                </div>
              );
            })()}
            <Table
              headers={["Ch", "Title", "N", "E", "R", "O", "Detail"]}
              rows={NERO_DATA.map((d, i) => {
                const ch = CHAPTERS.find(c => c.ch === i + 1);
                const mark = (v) => v
                  ? <span className="text-red font-bold font-mono">✓</span>
                  : <span className="text-muted-foreground font-mono">·</span>;
                return [
                  <span className="font-mono text-muted-foreground">{i + 1}</span>,
                  <span className="text-[9px] font-sans text-foreground/70">{ch?.title}</span>,
                  mark(d.N), mark(d.E), mark(d.R), mark(d.O),
                  <span className="text-[9px] font-sans text-muted-foreground">{d.detail?.substring(0, 60)}…</span>,
                ];
              })}
            />
          </Section>

          {/* §8 NDR Map */}
          <Section id="s8" number="8" title="Narrative / Dialogue Ratio Map" accent="cyan">
            <p className="text-xs font-sans text-foreground/70 leading-relaxed mb-4">
              NDR tracks the prose-to-dialogue balance per chapter. Chapters above 65% dialogue carry reader fatigue risk. HIGH drop-off risk chapters require prose bridge insertion.
            </p>
            {(() => {
              const high = NDR_DATA.filter(d => d.dropRisk === "HIGH" || d.dropRisk === "CRIT");
              return high.length > 0 && (
                <div className="mb-4 p-3 bg-red/5 border border-red/30 rounded-lg">
                  <div className="text-[9px] font-bold font-mono text-red mb-2">HIGH / CRITICAL DROP-OFF RISK CHAPTERS</div>
                  <div className="flex flex-wrap gap-2">
                    {high.map((d, i) => (
                      <span key={i} className="text-[9px] px-2 py-1 rounded border border-red/30 bg-red/10 text-red font-mono">
                        Ch.{i + 1} · {d.dropRisk} · {d.dial}% dialogue
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
            <Table
              headers={["Ch", "Narr%", "Dial%", "Drop Risk", "Peak Moment"]}
              rows={NDR_DATA.map((d, i) => [
                <span className="font-mono text-muted-foreground">{i + 1}</span>,
                <span className={`font-mono font-bold ${d.narr >= 70 ? "text-teal" : d.narr < 40 ? "text-red" : "text-foreground"}`}>{d.narr}%</span>,
                <span className={`font-mono font-bold ${d.dial >= 65 ? "text-red" : d.dial >= 50 ? "text-gold" : "text-foreground"}`}>{d.dial}%</span>,
                <span className={`font-mono text-[9px] font-bold ${d.dropRisk === "CRIT" || d.dropRisk === "HIGH" ? "text-red" : d.dropRisk === "MED" ? "text-gold" : "text-teal"}`}>{d.dropRisk}</span>,
                <span className="text-[9px] font-sans text-muted-foreground">{d.peakMoment?.substring(0, 55)}…</span>,
              ])}
            />
          </Section>

          {/* §9 Bug Ledger */}
          <Section id="s9" number="9" title="Editorial Bug Ledger" accent="red">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <Stat label="Critical" value={BUGS_BY_SEV.CRIT.length} color="red" />
              <Stat label="High" value={BUGS_BY_SEV.HIGH.length} color="orange" />
              <Stat label="Medium" value={BUGS_BY_SEV.MED.length} color="gold" />
              <Stat label="Low" value={BUGS_BY_SEV.LOW.length} color="blue" />
            </div>
            {["CRIT", "HIGH", "MED", "LOW"].map(sev => {
              const bugs = BUGS_BY_SEV[sev];
              if (!bugs.length) return null;
              const col = sev === "CRIT" ? "red" : sev === "HIGH" ? "orange" : sev === "MED" ? "gold" : "blue";
              return (
                <div key={sev} className="mb-4">
                  <div className={`text-[9px] font-bold font-mono text-${col} uppercase tracking-wide mb-2`}>{sev} SEVERITY ({bugs.length})</div>
                  <Table
                    headers={["Ch", "Type", "Flag"]}
                    rows={bugs.map(b => [
                      <span className="font-mono font-bold text-muted-foreground">{b.ch}</span>,
                      <span className={`text-[9px] font-mono text-${col}`}>{b.type}</span>,
                      <span className="text-[10px] font-sans text-foreground/75">{b.flag}</span>,
                    ])}
                  />
                </div>
              );
            })}
          </Section>

          {/* §10 Priority Actions */}
          <Section id="s10" number="10" title="Priority Action Queue" accent="orange">
            <Table
              headers={["#", "Action", "Impact", "Time", "Domain"]}
              rows={QUICK_ACTIONS.map(a => [
                <span className={`font-black font-mono text-${a.priority <= 2 ? "red" : a.priority <= 4 ? "gold" : "blue"}`}>{a.priority}</span>,
                <span className="font-sans font-bold text-foreground/85">{a.action}</span>,
                <span className="font-mono text-teal">{a.impact}</span>,
                <span className="font-mono text-muted-foreground">{a.time}</span>,
                <span className="font-mono text-muted-foreground">{a.domain}</span>,
              ])}
            />
            <div className="mt-3 space-y-2">
              {QUICK_ACTIONS.map(a => (
                <div key={a.priority} className="p-3 bg-card border border-border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black font-mono text-${a.priority <= 2 ? "red" : a.priority <= 4 ? "gold" : "blue"}`}>#{a.priority}</span>
                    <span className="text-xs font-bold text-foreground">{a.action}</span>
                  </div>
                  <p className="text-[10px] font-sans text-muted-foreground leading-relaxed">{a.detail}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* §11 TruthEngine360 */}
          <Section id="s11" number="11" title="TruthEngine360 Convergence" accent="teal">
            <p className="text-xs font-sans text-foreground/70 leading-relaxed mb-4">
              Seven independent evidence streams converging on the same finding: 84.9% Hispanic casualty classification failure in DCAS. The foundational forensic research underpinning the manuscript's historical claims.
            </p>
            <Table
              headers={["Stream", "Source", "Strength", "Description"]}
              rows={CONVERGENCE_STREAMS.map(s => [
                <span className={`font-black font-mono text-${s.color}`}>#{s.n}</span>,
                <span className="font-bold font-sans text-foreground/85">{s.label}</span>,
                <span className={`font-mono font-bold text-${s.strength >= 95 ? "teal" : s.strength >= 88 ? "gold" : "blue"}`}>{s.strength}%</span>,
                <span className="text-[10px] font-sans text-muted-foreground">{s.desc}</span>,
              ])}
            />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-red/5 border border-red/20 rounded-lg text-center">
                <div className="text-3xl font-black font-mono text-red">349</div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">DCAS Coded Hispanic</div>
              </div>
              <div className="flex items-center justify-center text-xl font-black text-muted-foreground">vs.</div>
              <div className="p-4 bg-teal/5 border border-teal/20 rounded-lg text-center">
                <div className="text-3xl font-black font-mono text-teal">3,070–3,741</div>
                <div className="text-[9px] text-muted-foreground font-mono mt-1">Estimated Actual (BISG)</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-gold/5 border border-gold/20 rounded-lg text-center">
              <div className="text-2xl font-black font-mono text-gold">84.9%</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Hispanic Casualty Classification Failure Rate · 7-Stream Convergence Confirmed</div>
            </div>
          </Section>

          {/* §12 Glossary */}
          <Section id="s12" number="12" title="Glossary of Key Terms" accent="blue">
            <Table
              headers={["Term", "Category", "Definition", "Frequency", "Chapters"]}
              rows={GLOSSARY.map(g => [
                <span className={`font-bold font-mono text-${g.cat === "yaqui" ? "cyan" : g.cat === "military" ? "red" : g.cat === "legal" ? "purple" : g.cat === "spanish" ? "gold" : "blue"}`}>{g.term}</span>,
                <Badge label={g.cat} color={g.cat === "yaqui" ? "cyan" : g.cat === "military" ? "red" : g.cat === "legal" ? "purple" : g.cat === "spanish" ? "gold" : "blue"} />,
                <span className="text-[10px] font-sans text-foreground/70">{g.def}</span>,
                <span className="font-mono text-muted-foreground">{g.freq}×</span>,
                <span className="font-mono text-[9px] text-muted-foreground">{g.chapters.map(c => `Ch.${c}`).join(", ")}</span>,
              ])}
            />
          </Section>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border text-center space-y-1">
            <div className="text-[9px] font-bold font-mono text-muted-foreground">LITCENTRAL v7 · FULL MANUSCRIPT INTELLIGENCE REPORT</div>
            <div className="text-[9px] font-mono text-muted-foreground">SGT George Ramos: The Mathematics of Vietnam · Generated {GENERATED}</div>
            <div className="text-[9px] font-mono text-muted-foreground">AUMER Foundation · TruthEngine360 · CHC Briefing May 18, 2026</div>
          </div>

        </div>
      </div>
    </div>
  );
}