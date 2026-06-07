import { useState } from "react";

// SGT GEORGE RAMOS — MANUSCRIPT METRIC VERIFICATION AUDIT
// 100% Source Disclosure Protocol · AUMER Foundation · TruthEngine360 · May 2026
// "If we don't have the source, we flag it. That's what makes the difference." — G. Arce

const VERIFIED = [
  { n:1,  metric:"Word Count",            value:"241,117 words",                       source:"Novlr word counter + manual verification" },
  { n:2,  metric:"Chapter Count",         value:"44 chapters (43 scored)",              source:"Direct structural count from manuscript TOC" },
  { n:3,  metric:"Flesch Reading Ease",   value:"74 (genre benchmark: 55)",             source:"AutoCrit — autocrit.com/editor/871284 · 3/31/26 · Flesch-Kincaid formula (Kincaid et al. 1975)" },
  { n:4,  metric:"Cliché Count",          value:"80 (genre benchmark: 190)",            source:"AutoCrit — Biography & Memoir genre comparison" },
  { n:5,  metric:"Redundancy Count",      value:"15 (genre benchmark: 73)",             source:"AutoCrit — Biography & Memoir genre comparison" },
  { n:6,  metric:"Passive Voice",         value:"1,404 (genre benchmark: 2,279)",       source:"AutoCrit — Biography & Memoir genre comparison" },
  { n:7,  metric:"Tense Distribution",    value:"57% past / 39% present / 5% future",  source:"AutoCrit — automated tense analysis" },
  { n:8,  metric:"Readability Composite", value:"73.6",                                 source:"AutoCrit — composite readability score" },
];

const PARTIAL = [
  { n:9,  metric:"Hybrid Omega Formula R²",        value:"R² = 0.947",
    issue:"Real SPSS math. But DEPENDENT variable (Omega) and INDEPENDENT variables (CLS/BIS/SII/MRF) were scored by Claude/LITCENTRAL — not by human raters or external instrument.",
    plan:"Survey: 2,000 readers score 10 sample chapters on CLS/BIS/SII/MRF. Compare to Claude scores. If r > 0.70, inputs validated.", n_target:"N = 2,000" },
  { n:10, metric:"Regression Coefficients (β)",    value:"CLS β=.501, BIS β=.487, SII β=.312, MRF β=.278",
    issue:"Real SPSS output. Weights are real — but accuracy of INPUT scores is unverified.",
    plan:"Included in #9 survey design. If inputs validated, coefficients validated.", n_target:"In #9" },
  { n:11, metric:"Cronbach's α (Behavior Vectors)", value:"α = 0.938",
    issue:"SPSS output on N=11 pilot (seed=42). Below publication-grade minimum. High α may reflect Claude's internal consistency, not construct validity.",
    plan:"Expand pilot to N≥200. Phase 2: survey panel N=2,000 for full validation.", n_target:"N = 2,000" },
  { n:12, metric:"Per-Chapter Omega Scores",       value:"Range: 89–111 · Mean: 105.1",
    issue:"Derived from Hybrid Omega applied to Claude-scored LITCENTRAL pillar inputs. Formula verified (SPSS). Inputs not externally validated.",
    plan:"Included in #9. If pillar scores validated, Omega scores validated.", n_target:"In #9" },
  { n:13, metric:"LITCENTRAL 12 Pillar Scores",    value:"Hook & Stakes 91, Cultural Auth. 94, etc.",
    issue:"Pillar DEFINITIONS are sourced (literary craft frameworks). Pillar SCORES per chapter are Claude-generated.",
    plan:"Human rater panel scores same chapters on same 12 pillars. Establish convergent validity.", n_target:"N = 2,000" },
  { n:14, metric:"5-Domain Scores (Cog/Cul/Beh/Sen/Gov)", value:"Various per chapter",
    issue:"Aggregated from LITCENTRAL pillar scores. Aggregation math is real — inputs are Claude-scored.",
    plan:"Validated automatically if pillar scores (#13) are validated.", n_target:"In #9" },
];

const UNVERIFIED = [
  { n:15, metric:"Restraint Score",               value:"67 / 100",
    issue:"Claude editorial assessment. No benchmark corpus of award-winning novels scored for 'restraint.' Pulitzer jury criteria not published.",
    plan:"Build Chicano Literary Restraint Benchmark. Corpus: 200 award winners + 100 Chicano canon. Survey: 2,000 readers rate 'felt engineered' vs 'felt organic.'", n_target:"2,000 readers + 300 corpus" },
  { n:16, metric:"CL-MoE Crossover Threshold",    value:"Overall: 0.115 · Threshold: 0.18",
    issue:"Claude-generated. No external corpus of 'crossover' novels was analyzed. The CONCEPT is valid — the NUMBER has no traceable source.",
    plan:"Survey: 2,000 mainstream readers evaluate 20 Chicano novel excerpts. Correlate with BookScan actual sales data.", n_target:"2,000 readers + BookScan" },
  { n:17, metric:"RRP (Reader Retention Prob.)",  value:"Mean: 86.9%",
    issue:"Claude-estimated probability that a reader continues to next chapter. No A/B testing. No reader panel. No eye-tracking or behavioral data.",
    plan:"Survey panel: 2,000 readers given sample chapters — track where they stop. Or: Kindle Unlimited read-through data.", n_target:"N = 2,000" },
  { n:18, metric:"Per-Chapter Verification Score", value:"Range: 72–97",
    issue:"CHECKS are real (weapon types, dates, slang). SCORES (numeric) are Claude-assigned, not from military historian panel.",
    plan:"Panel: 10 Vietnam-era military historians + 20 Vietnam veterans. Score 10 sample chapters. Compare to Claude scores.", n_target:"30 expert reviewers" },
  { n:19, metric:"Market Advance Estimate",        value:"$85K–$350K",
    issue:"Claude estimate based on general publishing knowledge. Not sourced from Publishers Marketplace, specific agent data, or comp title advance disclosures.",
    plan:"Subscribe to Publishers Marketplace ($25/mo). Pull advances for: The Sympathizer, Matterhorn, Bless Me Ultima, recent Chicano debuts.", n_target:"Comp data from PM" },
  { n:20, metric:"Streaming/Film Score",           value:"88 / 100",
    issue:"Claude assessment. No industry adaptation scoring tool exists. No producer/showrunner evaluation.",
    plan:"Submit to 3–5 coverage services (The Black List, Coverfly). Get professional reader scores.", n_target:"3–5 reads" },
  { n:21, metric:"Audio Score / NI",               value:"94 / NI: 0.87",
    issue:"Claude assessment. NI (Narrative Immersion Index) is a Claude-created metric. No external audiobook quality scoring tool.",
    plan:"ACX/Audible producer review. Listener panel (200+) rates engagement with sample audio chapters.", n_target:"200 listeners" },
  { n:22, metric:"LSTE Composite",                 value:"82.2 / 100",
    issue:"Claude composite score. LSTE components are Claude-defined and Claude-scored. No external validation.",
    plan:"Validated automatically if pillar scores (#9) validated.", n_target:"In #9" },
  { n:23, metric:"Pulitzer Probability",           value:"68%",                 retire:true,
    issue:"⛔ RETIRE — No predictive model for Pulitzer outcomes exists in published literature. Jury deliberations are confidential. This number has ZERO external basis.",
    plan:"RETIRE. Replace with: 'Comp analysis — manuscripts with similar profiles (word count, genre, cultural lens) that won/were nominated.' No probability claim.", n_target:"N/A — RETIRE" },
  { n:24, metric:"Sensory Density Thresholds",     value:">20/1000w = Ω target",
    issue:"Claude-defined threshold. No corpus of published novels was analyzed to establish that 20 sensory instances per 1,000 words correlates with quality.",
    plan:"NLP pipeline on 300 novels (100 award-winners + 100 bestsellers + 100 Chicano canon). Measure sensory density distribution.", n_target:"300 novel corpus" },
  { n:25, metric:"Word Overuse Thresholds",        value:"'darkness' ≤60, etc.",
    issue:"Claude-defined thresholds for acceptable word frequency. No corpus analysis establishing these specific numbers.",
    plan:"Included in #24 corpus analysis.", n_target:"In #24" },
  { n:26, metric:"Tier Classification System",     value:"Diamond/Platinum/Ω/Ω Elite",
    issue:"Claude-created tier system. Tier BOUNDARIES (score ranges) are Claude-defined. No external literary scoring system uses these tiers.",
    plan:"If #9 survey validates pillar scores, re-derive tier boundaries from validated data distribution. Until then: flag as internal classification.", n_target:"Depends on #9" },
];

const SPSS_TABLE = [
  { level:"Minimum (Published)",           n:"N = 200",   source:"Rouquette & Falissard (2011), Int'l J. Methods in Psychiatric Research, 20(4), 235–249", note:"Widely cited minimum for factor analysis internal validation." },
  { level:"Adequate (Published)",          n:"N = 300+",  source:"Thompson (2004), APA. Comrey & Lee (1992).",                                              note:"300 = adequate · 500 = good · 1,000 = excellent" },
  { level:"CFA Rule of Thumb",             n:"10:1–20:1", source:"Schumacker & Lomax (2015); Kline (2016); Jackson (2003)",                                 note:"Cases to free parameters. Our model: ~4 predictors → floor 40–80" },
  { level:"USC Price Standard (G. Arce)",  n:"N = 500",   source:"USC Sol Price School of Public Policy — doctoral research standard",                       note:"Program-level expectation for survey-based validation." },
  { level:"AUMER / TE360 TARGET",          n:"N = 2,000", source:"Self-imposed · AUMER Foundation / TruthEngine360",                                        note:"Exceeds all published minimums by 4–10×. Chicano literary metrics have no existing benchmark → higher N establishes new field. Exceeds Comrey & Lee 'excellent' (1,000) by 2×. Defensible in any peer review context.", highlight:true },
];

function StatusBadge({ status, retire }) {
  if (retire)             return <span className="text-[7px] font-black font-mono px-2 py-0.5 rounded border bg-red/20 text-red border-red/40">⛔ RETIRE</span>;
  if (status==="verified") return <span className="text-[7px] font-black font-mono px-2 py-0.5 rounded border bg-teal/20 text-teal border-teal/40">✅ VERIFIED</span>;
  if (status==="partial")  return <span className="text-[7px] font-black font-mono px-2 py-0.5 rounded border bg-gold/20 text-gold border-gold/40">🟡 PARTIAL</span>;
  return                          <span className="text-[7px] font-black font-mono px-2 py-0.5 rounded border bg-red/20 text-red border-red/40">🔴 UNVERIFIED</span>;
}

export default function MetricAuditScreen() {
  const [view, setView] = useState("summary");

  return (
    <div className="animate-slide-up space-y-4">
      <div className="border-b border-border pb-3">
        <div className="text-base font-black text-gold">METRIC VERIFICATION AUDIT</div>
        <div className="text-[9px] font-mono text-muted-foreground">100% Source Disclosure Protocol · AUMER Foundation · TruthEngine360 · May 2026</div>
        <div className="text-[9px] font-mono text-teal/80 mt-1 italic">&quot;If we don&apos;t have the source, we flag it. That&apos;s what makes the difference.&quot; &mdash; G. Arce</div>
        <div className="text-[9px] font-mono text-teal mt-2 bg-teal/5 border border-teal/20 rounded px-2 py-1">✅ v2 (May 25 2026): Ch.1 artifact REMOVED (+3.0Ω) · Ch.9 LOG REMOVED (+2.5Ω) · Ch.40/41 DUPLICATION RESOLVED · Baseline 104.94→05.18 · 7 new KIA confirmed</div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {["summary","verified","partial","unverified","spss"].map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`text-[8px] font-mono px-2.5 py-1 rounded border transition-all capitalize ${
              view===v ? "bg-gold/20 text-gold border-gold/40" : "border-border text-muted-foreground hover:text-foreground"
            }`}>{v}</button>
        ))}
      </div>

      {/* ── SUMMARY ── */}
      {view==="summary" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label:"✅ Verified",   count:8,  sub:"Items #1–8 · AutoCrit + direct measurement · Publication-ready", color:"text-teal",   bg:"bg-teal/10",   border:"border-teal/20" },
              { label:"🟡 Partial",   count:6,  sub:"Items #9–14 · Real SPSS math · Inputs need human validation",     color:"text-gold",   bg:"bg-gold/10",   border:"border-gold/20" },
              { label:"🔴 Unverified",count:12, sub:"Items #15–26 · Claude-generated · Need external sourcing",         color:"text-red",    bg:"bg-red/10",    border:"border-red/20"  },
              { label:"⛔ Retire",    count:1,  sub:"Item #23: Pulitzer Probability (68%) · Cannot be validated",       color:"text-orange", bg:"bg-orange/10", border:"border-orange/20" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-black font-mono ${s.color}`}>{s.count}</div>
                <div className={`text-[9px] font-bold font-mono ${s.color} mt-0.5`}>{s.label}</div>
                <div className="text-[8px] text-muted-foreground mt-1 leading-relaxed">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="bg-red/5 border border-red/20 rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-red mb-2 tracking-widest">⛔ IMMEDIATE RETIREMENT — ITEM #23</div>
            <div className="flex items-start gap-3 flex-wrap">
              <div className="flex-1">
                <div className="text-[10px] font-black text-foreground">Pulitzer Probability: 68%</div>
                <div className="text-[9px] font-mono text-foreground/70 mt-1">No predictive model for Pulitzer outcomes exists in published literature. Jury deliberations are confidential. This number has ZERO external basis. An alarming number with no source is worse than no number at all.</div>
              </div>
              <div className="bg-red/20 border border-red/30 rounded-lg p-2 text-center flex-shrink-0">
                <div className="text-[8px] font-mono text-red">Replace with</div>
                <div className="text-[9px] font-bold text-foreground mt-0.5">Comp Analysis</div>
                <div className="text-[8px] text-muted-foreground">No probability claim</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">VALIDATION COST DRIVERS</div>
            <div className="space-y-1.5">
              {[
                { item:"Reader Survey (N=2,000)",    note:"Primary cost · validates #9–14, #15–17, #22 · Prolific/MTurk platform", cost:"$5,000–$15,000" },
                { item:"Novel Corpus Analysis (300)",note:"100 award-winners + 100 bestsellers + 100 Chicano canon · NLP pipeline · validates #24, #25", cost:"Computational" },
                { item:"Expert Panel (30 reviewers)",note:"10 Vietnam historians + 20 Vietnam veterans · validates item #18", cost:"Honoraria" },
                { item:"Publishers Marketplace",     note:"Pull actual advance data for comp titles · validates item #19", cost:"$25/mo" },
                { item:"Coverage Services",          note:"The Black List, Coverfly · professional reader scores · validates item #20", cost:"$300–$700" },
              ].map(c => (
                <div key={c.item} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                  <span className="text-[9px] font-bold font-mono w-52 flex-shrink-0 text-blue">{c.item}</span>
                  <span className="text-[9px] text-foreground/70 flex-1">{c.note}</span>
                  <span className="text-[8px] font-mono text-muted-foreground whitespace-nowrap">{c.cost}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal/5 border border-teal/20 rounded-lg p-3">
            <div className="text-[9px] font-bold font-mono text-teal mb-1">THE CHICANO MARGIN</div>
            <div className="text-[9px] text-foreground/80">Marlowe, AutoCrit, Quantifiction — all calibrated against mainstream Anglo-American literary canon. Chicano literature has no benchmark corpus. We built our own instruments with documented inputs and honest margins of error. The validation work ahead builds what nobody else has: a Chicano-calibrated literary analytics framework with documented provenance. That's what makes it marketable.</div>
          </div>
        </div>
      )}

      {/* ── VERIFIED ── */}
      {view==="verified" && (
        <div className="space-y-2">
          <div className="text-[9px] font-mono text-teal bg-teal/10 border border-teal/20 rounded-lg px-4 py-2">
            8 metrics · AutoCrit external SaaS + direct measurement · Fully traceable · Publication-ready
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                <th className="text-left px-3 py-2">#</th><th className="text-left px-3 py-2">METRIC</th>
                <th className="text-left px-3 py-2">VALUE</th><th className="text-left px-3 py-2 hidden md:table-cell">SOURCE</th>
              </tr></thead>
              <tbody>
                {VERIFIED.map(m => (
                  <tr key={m.n} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className="px-3 py-2.5 text-muted-foreground font-mono">{m.n}</td>
                    <td className="px-3 py-2.5 font-bold text-teal">{m.metric}</td>
                    <td className="px-3 py-2.5 font-mono text-foreground">{m.value}</td>
                    <td className="px-3 py-2.5 text-foreground/60 hidden md:table-cell text-[8px]">{m.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PARTIAL ── */}
      {view==="partial" && (
        <div className="space-y-3">
          <div className="text-[9px] font-mono text-gold bg-gold/10 border border-gold/20 rounded-lg px-4 py-2">
            6 metrics · Real SPSS math · Inputs were Claude-scored — ONE reader survey (N=2,000) validates ALL 6 at once
          </div>
          {PARTIAL.map(m => (
            <div key={m.n} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[8px] font-mono text-muted-foreground">#{m.n} · </span>
                  <span className="text-[10px] font-black text-gold">{m.metric}</span>
                  <span className="ml-2 font-mono text-[9px] text-foreground">{m.value}</span>
                </div>
                <StatusBadge status="partial" />
              </div>
              <div className="bg-gold/5 border border-gold/20 rounded-lg p-2.5 mb-2">
                <div className="text-[7px] font-mono text-muted-foreground mb-0.5">ISSUE</div>
                <div className="text-[9px] text-foreground/80">{m.issue}</div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-[9px] font-mono text-blue flex-1">{m.plan}</div>
                <span className="text-[8px] font-mono text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded whitespace-nowrap">{m.n_target}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── UNVERIFIED ── */}
      {view==="unverified" && (
        <div className="space-y-3">
          <div className="text-[9px] font-mono text-red bg-red/10 border border-red/20 rounded-lg px-4 py-2">
            12 metrics · Claude-generated · No external source dataset or benchmark corpus
          </div>
          {UNVERIFIED.map(m => (
            <div key={m.n} className={`bg-card border rounded-xl p-4 ${m.retire?"border-red/30":"border-border"}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <span className="text-[8px] font-mono text-muted-foreground">#{m.n} · </span>
                  <span className={`text-[10px] font-black ${m.retire?"text-red":"text-foreground"}`}>{m.metric}</span>
                  <span className="ml-2 font-mono text-[9px] text-foreground/70">{m.value}</span>
                </div>
                <StatusBadge status="unverified" retire={m.retire} />
              </div>
              <div className="bg-red/5 border border-red/20 rounded-lg p-2.5 mb-2">
                <div className="text-[7px] font-mono text-muted-foreground mb-0.5">ISSUE</div>
                <div className="text-[9px] text-foreground/80">{m.issue}</div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className={`text-[9px] font-mono flex-1 ${m.retire?"text-red font-bold":"text-blue"}`}>{m.plan}</div>
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded whitespace-nowrap ${m.retire?"text-red bg-red/10 border border-red/20":"text-orange bg-orange/10 border border-orange/20"}`}>{m.n_target}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SPSS ── */}
      {view==="spss" && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono">SPSS SAMPLE SIZE GUIDANCE — Published Literature</div>
            {SPSS_TABLE.map((r,i) => (
              <div key={i} className={`px-5 py-4 border-b border-border/30 last:border-0 ${r.highlight?"bg-gold/5":""}`}>
                <div className="flex items-start gap-4">
                  <div className={`font-black font-mono text-[13px] w-24 flex-shrink-0 ${r.highlight?"text-gold":"text-foreground"}`}>{r.n}</div>
                  <div>
                    <div className={`text-[9px] font-bold mb-0.5 ${r.highlight?"text-gold":"text-foreground/80"}`}>{r.level}</div>
                    <div className="text-[8px] font-mono text-muted-foreground mb-1">{r.source}</div>
                    <div className="text-[9px] text-foreground/70">{r.note}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-teal/5 border border-teal/20 rounded-lg p-4">
            <div className="text-[9px] font-bold font-mono text-teal mb-2">WHY N = 2,000</div>
            <div className="text-[9px] text-foreground/80 leading-relaxed">Your USC standard of 500 is solid. Our target of 2,000 exceeds every published threshold by 4–10×. When you're building a metric in a field with no existing benchmark — Chicano literary analytics — you need that margin. If the numbers go against you, at least you know where you stand. The source will be traceable. That's the standard.</div>
          </div>
        </div>
      )}
    </div>
  );
}