import {
  EXEC_VERDICT, CANON_VERDICTS, WEIGHTED_RUBRIC, COMPARATORS,
  PROVISIONAL_ACHIEVEMENTS, READER_PANEL, MARKET_DATA, REVISION_PRIORITY,
} from "../../lib/canonAuditData";

const VERDICT_COLORS = {
  gold: { text: "text-gold", bg: "bg-gold/10", border: "border-gold/30" },
  teal: { text: "text-teal", bg: "bg-teal/10", border: "border-teal/30" },
  blue: { text: "text-blue", bg: "bg-blue/10", border: "border-blue/30" },
  red:  { text: "text-red",  bg: "bg-red/10",  border: "border-red/30"  },
  orange: { text: "text-orange", bg: "bg-orange/10", border: "border-orange/30" },
  purple: { text: "text-purple", bg: "bg-purple/10", border: "border-purple/30" },
};

const PRIORITY_COLOR = { CRITICAL: "text-red border-red/30 bg-red/10", HIGH: "text-orange border-orange/30 bg-orange/10", MEDIUM: "text-gold border-gold/30 bg-gold/10", LOW: "text-muted-foreground border-border bg-secondary" };
const SCORE_AXES = ["formal", "witness", "cultural", "emotional", "control"];
const AXIS_LABELS = { formal: "Formal Innovation", witness: "Historical Witness", cultural: "Cultural Specificity", emotional: "Emotional Force", control: "Structural Control" };

function Section({ title, color = "gold", children }) {
  const cfg = VERDICT_COLORS[color] || VERDICT_COLORS.gold;
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className={`px-4 py-2.5 border-b border-border ${cfg.bg}`}>
        <span className={`text-[10px] font-black font-mono ${cfg.text} uppercase tracking-wide`}>{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Executive Verdict ────────────────────────────────────────────────────────
function ExecVerdictSection() {
  const totalResult = WEIGHTED_RUBRIC.reduce((s, r) => s + r.result, 0);
  return (
    <Section title="Executive Verdict — Interim Audit" color="purple">
      <div className="flex items-center gap-4 mb-3">
        <div className="text-center flex-shrink-0">
          <div className="text-4xl font-black font-mono text-purple">{totalResult.toFixed(1)}</div>
          <div className="text-[8px] font-bold font-mono text-muted-foreground">/ 100 WEIGHTED</div>
        </div>
        <div>
          <div className="text-[9px] font-bold font-mono text-muted-foreground mb-1">{EXEC_VERDICT.phaseStatus}</div>
          <div className="text-[10px] text-foreground font-sans leading-relaxed">{EXEC_VERDICT.summary}</div>
        </div>
      </div>
      <div className="space-y-1.5">
        {EXEC_VERDICT.gateWarnings.map((g, i) => {
          const cfg = g.severity === "CRITICAL" ? "text-red border-red/30 bg-red/5" : g.severity === "HIGH" ? "text-orange border-orange/30 bg-orange/5" : "text-gold border-gold/30 bg-gold/5";
          return (
            <div key={i} className={`flex gap-2 p-2.5 rounded border text-[9px] font-sans leading-snug ${cfg}`}>
              <span className="font-black font-mono flex-shrink-0">{g.severity}</span>
              <span>{g.text}</span>
            </div>
          );
        })}
      </div>

      {/* Weighted rubric */}
      <div className="mt-4">
        <div className="text-[8px] font-bold font-mono text-muted-foreground uppercase mb-2">Weighted Rubric Breakdown</div>
        <div className="space-y-1">
          {WEIGHTED_RUBRIC.map(r => (
            <div key={r.category} className="flex items-center gap-2">
              <span className="text-[8px] font-sans text-muted-foreground flex-1 truncate">{r.category}</span>
              <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden flex-shrink-0">
                <div className="h-full bg-purple/60 rounded-full" style={{ width: `${(r.result / 20) * 100}%` }} />
              </div>
              <span className="text-[8px] font-black font-mono text-purple min-w-[28px] text-right">{r.result}</span>
              <span className="text-[7px] font-mono text-muted-foreground min-w-[48px]">({r.weight}% × {r.score})</span>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1 border-t border-border">
            <span className="text-[9px] font-black font-mono text-foreground flex-1">TOTAL</span>
            <span className="text-[9px] font-black font-mono text-purple">{totalResult.toFixed(1)} / 100</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Canon Verdicts ───────────────────────────────────────────────────────────
function CanonVerdictsSection() {
  return (
    <Section title="Three Canon Verdicts" color="gold">
      <div className="space-y-3">
        {CANON_VERDICTS.map(v => {
          const cfg = VERDICT_COLORS[v.color] || VERDICT_COLORS.gold;
          return (
            <div key={v.id} className={`rounded-lg border p-3 ${cfg.border} ${cfg.bg}`}>
              <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                <div>
                  <div className={`text-[9px] font-bold font-mono text-muted-foreground`}>{v.label}</div>
                  <div className={`text-sm font-black font-mono ${cfg.text}`}>{v.verdict}</div>
                  <div className="text-[8px] font-mono text-muted-foreground">{v.sublabel}</div>
                </div>
              </div>
              <div className="text-[9px] text-foreground font-sans leading-relaxed mb-2">{v.summary}</div>
              <div>
                <div className="text-[7px] font-bold font-mono text-muted-foreground uppercase mb-1">Conditions</div>
                <div className="space-y-0.5">
                  {v.conditions.map((c, i) => (
                    <div key={i} className="flex gap-1.5 text-[8px] font-sans text-muted-foreground">
                      <span className={`font-bold ${cfg.text} flex-shrink-0`}>→</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─── Comparative Matrix ───────────────────────────────────────────────────────
function ComparativeSection() {
  return (
    <Section title="Comparative Canon Matrix" color="blue">
      <div className="text-[8px] font-mono text-muted-foreground mb-3">Scored 1–10 against canon median. Provisional — based on Ch.1 + ToC evidence.</div>
      <div className="overflow-x-auto">
        <table className="w-full text-[8px] font-mono">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left pb-2 text-muted-foreground font-bold pr-4">Work</th>
              {SCORE_AXES.map(a => (
                <th key={a} className="text-center pb-2 text-muted-foreground font-bold px-2" title={AXIS_LABELS[a]}>
                  {a.slice(0, 4).toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARATORS.map((c, i) => (
              <tr key={c.title} className={`border-b border-border/50 ${c.isSelf ? "bg-gold/5" : ""}`}>
                <td className="py-1.5 pr-4">
                  <div className={`font-bold ${c.isSelf ? "text-gold" : "text-foreground"}`}>{c.title}</div>
                  <div className="text-muted-foreground opacity-70">{c.author}</div>
                </td>
                {SCORE_AXES.map(a => {
                  const val = c.scores[a];
                  return (
                    <td key={a} className="text-center py-1.5 px-2">
                      <span className={`font-black ${val >= 9 ? "text-teal" : val >= 7 ? "text-gold" : val >= 5 ? "text-muted-foreground" : "text-red"}`}>
                        {val}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 space-y-2">
        {COMPARATORS.filter(c => !c.isSelf).slice(0, 3).map(c => (
          <div key={c.title} className="text-[8px] font-sans text-muted-foreground border-l-2 border-border pl-2 leading-snug">
            <span className="text-foreground font-bold">{c.title}:</span> {c.ramosRelation}
          </div>
        ))}
        {COMPARATORS.find(c => c.isSelf) && (
          <div className="text-[8px] font-sans border-l-2 border-gold/40 pl-2 leading-snug bg-gold/5 py-1">
            <span className="text-gold font-bold">SGT George Ramos:</span>{" "}
            <span className="text-muted-foreground">{COMPARATORS.find(c => c.isSelf).ramosRelation}</span>
          </div>
        )}
      </div>
    </Section>
  );
}

// ─── Provisional Achievements ─────────────────────────────────────────────────
function AchievementsSection() {
  return (
    <Section title="Provisional Achievements Catalog (Phase 3.5)" color="teal">
      <div className="text-[8px] font-mono text-muted-foreground mb-3">Entries appear only after clearing precedent + load-bearing tests. Distribution discipline: 1–3 typical, 5+ exceptional. All three below are provisional pending Phase 1 completion.</div>
      <div className="space-y-3">
        {PROVISIONAL_ACHIEVEMENTS.map(a => (
          <div key={a.id} className="rounded-lg border border-teal/20 bg-teal/5 p-3">
            <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black font-mono text-teal">{a.id}</span>
                <span className={`text-[7px] font-bold font-mono px-1.5 py-px rounded border ${
                  a.status === "CONDITIONALLY DEMONSTRATED" ? "text-gold border-gold/30 bg-gold/10" :
                  "text-muted-foreground border-border bg-secondary"
                }`}>{a.status}</span>
              </div>
              <span className="text-[7px] font-mono text-muted-foreground">{a.category}</span>
            </div>
            <div className="text-[9px] font-bold text-foreground mb-1">{a.title}</div>
            <div className="text-[8px] text-muted-foreground font-sans leading-snug mb-1">{a.summary}</div>
            <div className="text-[7px] font-mono text-orange border-l border-orange/40 pl-1.5">{a.loadBearingStatus}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── Reader Panel ─────────────────────────────────────────────────────────────
function ReaderPanelSection() {
  return (
    <Section title="14-Persona Synthetic Beta-Reader Panel" color="orange">
      <div className="text-[8px] font-mono text-muted-foreground mb-3">Provisional at Ch.1 evidence. Personas marked CANNOT MODEL require additional chapter evidence before projection.</div>
      <div className="space-y-1.5">
        {READER_PANEL.map((r, i) => (
          <div key={i} className={`rounded border p-2 flex gap-3 items-start ${
            r.flag ? "border-border bg-secondary/50" : r.score >= 8 ? "border-teal/30 bg-teal/5" : "border-border bg-card"
          }`}>
            <div className="flex-shrink-0 min-w-[24px] text-center">
              {r.score !== null
                ? <span className={`text-[9px] font-black font-mono ${r.score >= 8 ? "text-teal" : r.score >= 7 ? "text-gold" : "text-muted-foreground"}`}>{r.score}</span>
                : <span className="text-[8px] font-mono text-muted-foreground">—</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[8px] font-bold font-sans text-foreground">{r.persona}</div>
              {r.flag
                ? <span className="text-[7px] font-bold font-mono text-red">{r.flag}</span>
                : <div className="text-[8px] text-muted-foreground font-sans italic mt-0.5">{r.quote}</div>
              }
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── Market Intelligence ──────────────────────────────────────────────────────
function MarketSection() {
  const m = MARKET_DATA;
  return (
    <Section title="Market Intelligence (Phase 4.5)" color="blue">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {[
          { label: "Latino GDP 2023",       val: m.latinoGDP },
          { label: "Purchasing Power",       val: m.purchasingPower },
          { label: "Consumer Spending",      val: m.consumerSpending },
          { label: "Annual Growth Rate",     val: m.annualGrowth },
        ].map(s => (
          <div key={s.label} className="bg-blue/5 border border-blue/20 rounded-lg p-2.5 text-center">
            <div className="text-base font-black font-mono text-blue">{s.val}</div>
            <div className="text-[7px] font-mono text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="text-[7px] font-mono text-muted-foreground mb-3">Source: {m.source}</div>

      <div className="mb-3">
        <div className="text-[8px] font-bold font-mono text-muted-foreground uppercase mb-2">Comp-Title Revenue Signals</div>
        <div className="space-y-1">
          {m.comps.map(c => (
            <div key={c.title} className="flex gap-2 text-[8px]">
              <span className="font-bold text-foreground flex-shrink-0 min-w-[180px]">{c.title}</span>
              <span className="text-muted-foreground font-sans">{c.signal}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="p-2.5 bg-gold/5 border border-gold/20 rounded text-[8px] font-sans text-foreground">
          <span className="font-black text-gold">Acquisition: </span>{m.acquisitionNote}
        </div>
        <div className="p-2.5 bg-blue/5 border border-blue/20 rounded text-[8px] font-sans text-foreground">
          <span className="font-black text-blue">Adaptation: </span>{m.adaptationNote}
        </div>
      </div>
    </Section>
  );
}

// ─── Revision Priority ────────────────────────────────────────────────────────
function RevisionPrioritySection() {
  return (
    <Section title="Revision Priority List (Phase 5 / §7.13)" color="red">
      <div className="text-[8px] font-mono text-muted-foreground mb-3">Ranked by impact on canon-candidacy AND crossover-candidacy AND public-impact integrity.</div>
      <div className="overflow-x-auto">
        <table className="w-full text-[8px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left pb-1.5 font-mono text-muted-foreground">#</th>
              <th className="text-left pb-1.5 font-mono text-muted-foreground pl-2 flex-1">Action</th>
              <th className="text-center pb-1.5 font-mono text-muted-foreground px-2">Canon</th>
              <th className="text-center pb-1.5 font-mono text-muted-foreground px-2">Crossover</th>
              <th className="text-center pb-1.5 font-mono text-muted-foreground px-2">Ethics</th>
            </tr>
          </thead>
          <tbody>
            {REVISION_PRIORITY.map(r => (
              <tr key={r.rank} className="border-b border-border/50">
                <td className="py-1.5 font-black font-mono text-muted-foreground">{r.rank}</td>
                <td className="py-1.5 pl-2 font-sans text-foreground pr-3">{r.action}</td>
                {[r.canon, r.crossover, r.ethics].map((val, i) => (
                  <td key={i} className="py-1.5 text-center px-2">
                    <span className={`text-[7px] font-bold font-mono px-1 py-px rounded border ${PRIORITY_COLOR[val] || PRIORITY_COLOR.LOW}`}>{val}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function CanonIntelView() {
  return (
    <div className="space-y-4">
      <div className="bg-purple/5 border border-purple/30 rounded-lg p-3 text-[9px] font-sans text-muted-foreground">
        <span className="font-black text-purple">INTERIM AUDIT INTEL</span> · Phases 2–5 manuscript-level extrapolative · Phase 1: 1/44 chapters complete · All verdicts provisional until Phase 1 complete
      </div>
      <ExecVerdictSection />
      <CanonVerdictsSection />
      <ComparativeSection />
      <AchievementsSection />
      <ReaderPanelSection />
      <MarketSection />
      <RevisionPrioritySection />
    </div>
  );
}