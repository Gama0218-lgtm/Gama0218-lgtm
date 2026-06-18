import { useState } from "react";
import { CHAPTERS } from "../../lib/data";
import CanonIntelView from "./CanonIntelView";

const STORAGE_KEY = "litcentral_canon_worthiness";

// ─── Character voice contradiction data keyed by chapter ─────────────────────
// Derived from CharacterVoiceTab's audited drift samples
const VOICE_CONTRADICTIONS = {
  5:  [{ char: "Joshua Sagasta", severity: "HIGH",   note: "Medical vocabulary, hedged statement — no Yaqui cadence. 'I think I'm getting better. The doctors say my vitals are improving.'" }],
  20: [{ char: "PFC O'Neil",     severity: "HIGH",   note: "Formal register, zero dialect markers. 'I cannot adequately express the loss I feel…' — completely off-voice." }],
  21: [{ char: "Capt. Crawford",  severity: "HIGH",   note: "Emotional vulnerability, first-person confession. 'I don't know why I'm telling you this.' — off Crawford's clinical register." }],
  27: [{ char: "Major Duc",       severity: "HIGH",   note: "American military slang ('clicks', 'Let's move') — Duc speaks formally, never uses US idiom." }],
  29: [{ char: "Capt. Crawford",  severity: "MED",    note: "Direct moral statement: 'Those children are not a military variable.' Crawford deflects via data, never states morals." }],
  35: [{ char: "Capt. Crawford",  severity: "MED",    note: "Direct admission: 'The algorithm was wrong. I know that.' — possibly earned by arc but register breaks euphemistic shield." }],
  39: [{ char: "SGT Ramos",       severity: "MED",    note: "Clinical detachment under WP wound: 'I can smell my own leg.' — potentially drifted from kinetic-sensory baseline." }],
  9:  [{ char: "SGT Ramos",      severity: "LOW",    note: "Grief passage without physical anchoring — Ramos usually grounds feeling in body first." }],
};

// ─── LITCENTRAL Chapter Audit Data ───────────────────────────────────────────
const CHAPTER_AUDITS = {
  1: {
    total: 70, tier: "Gold (lower band)", period: "D (Testimony)",
    verdict: "Competent ACT I opener with one genuine moment of refusal-driven craft (line 207), strong sensory ground, and a working transition into the flashback architecture (line 243). Does not yet trust its imagery — thesis sentences restate what prose already delivered. Three historical-accuracy concerns require cultural-authority consultation before this chapter can stand as testimony.",
    revisionPriority: "MEDIUM",
    strongestSentence: '"They paid in blood. I pay in remembering." (line 207)',
    weakestSentence: '"the feathers stirred in the rising heat, trembling with each breath he took like wings preparing to lift something impossibly heavy into freedom" (line 217)',
    metrics: [
      { id: "M1", label: "Omega Score",                    score: 7,  note: "Sensory craft real but thesis sentences restate delivered images (line 13, 217)." },
      { id: "M2", label: "Reader Retention Probability",   score: 7,  note: "Drop-off risk in ceremonial block lines 133–175 for readers not pre-loaded on Yaqui ritual." },
      { id: "M3", label: "Engagement Forecast",            score: 7,  note: "Sustained. Pull to Ch.2 contingent on whether Ch.2 cashes the vision rather than re-stages it." },
      { id: "M4", label: "Cultural Legitimacy",            score: 6,  note: '3 flags: (a) 8,000-ft elevation exceeds Yaqui sierra history (~4,500 ft); (b) "Yom\'e Yaqui" departs from standard *Yoeme* orthography; (c) maaso dance outside Pahko/Waehma context — REQUIRES Yaqui cultural authority verification (§3.10).' },
      { id: "M5", label: "CL-MoE (accessibility gap)",     score: 6,  note: "~100-word untranslated Chieftain Spanish strategically defensible but unmediated — crossover-market risk flagged." },
      { id: "M6", label: "Sensory Immersion Index",        score: 8,  note: 'Multi-modal and specific: olfactory (line 3, 15), tactile (line 15, 193), auditory (line 135, 217). Strong.' },
      { id: "M7", label: "Behavioral Integrity",           score: 7,  note: "George reads as combat-veteran NCO. Chieftain lacks friction/limit — omniscient-warm throughout; chapter's chief character-architecture defect." },
      { id: "M8", label: "Magical Realism Fidelity",       score: 6,  note: "Four obsidian mirrors, four-color fire, four-directional elders — apparatus reads decorative rather than load-bearing." },
      { id: "M9", label: "Character Vector Drift",         score: 8,  note: "0 SD — baseline chapter. Establishes George as wound-bearing-warrior, Chieftain as omniscient cultural-authority." },
      { id: "M10",label: "Narrative Architecture Alignment",score: 8, note: "ACT I opener does architectural work: wound established, ceremony-truth mechanism introduced, threshold cliffhanger lands." },
    ],
    defects: [
      { sev: "HIGH",   text: "Yaqui cultural concerns: orthography 'Yom\'e' (line 5), 8,000-ft placement (line 5), maaso dance outside Waehma calendar (line 219) — §3.10 potentially disqualifying." },
      { sev: "MED",    text: "3 narrator-omniscience slippages from Period-D third-limited POV (lines 5, 9, 27) — cannot be George's knowledge." },
      { sev: "MED",    text: "Sentimentality overreach in chapter's final third (lines 139, 217) — transcendence-budget spent too freely." },
      { sev: "LOW",    text: "Chieftain has no friction, limit, or hesitation — archetypally flat; add one moment of character resistance." },
      { sev: "LOW",    text: 'Thesis sentence overnarration: "five centuries of refusal" (line 13) restates what image already delivered.' },
    ],
    engines: [
      { id: "E1", label: "Battlefield Realism",        status: "LATENT",  note: "Vietnam referenced via flashback only (line 243); no direct portrayal in chapter body." },
      { id: "E2", label: "Chicano Spiritual Cosmology", status: "ACTIVE",  note: "Heavily deployed but load-bearing only on ceremony→vision mechanism; surround is decorative." },
      { id: "E3", label: "Ancestral Synesthesia",       status: "ACTIVE",  note: '"Each breath held remnants of eruptions, seabed dust…" (line 15) — material time as present sensory data.' },
      { id: "E4", label: "Spiritual Temporal Bleed",    status: "ACTIVE",  note: '"The desert vanished. Smoke and starlight twisted into jungle heat…" (lines 237–247) — fifty-year collapse in one paragraph. STRONG.' },
      { id: "E5", label: "Erasure Engine",              status: "ABSENT",  note: "Appropriate to pastoral opener; absence not a defect." },
      { id: "E6", label: "Mouth as Portal",             status: "ACTIVE",  note: 'George naming 13 dead aloud after 50 years of silence (lines 81–86) IS the portal-open. Cleanest engine in chapter.' },
    ],
    historicalFlags: [
      { line: 5,   text: '"Yom\'e Yaqui" orthography — verify against *Yoeme*.' },
      { line: 5,   text: '8,000-ft elevation for Yaqui sierra village — geographically improbable (Sierra del Bacatete peaks ~4,500 ft); verify intent.' },
      { line: 219, text: 'Deer-antler with tenaboim ceremony outside Pahko/Waehma context — verify against Yaqui ceremonial calendar.' },
      { line: 69,  text: '"the chemicals we sprayed" — verify USMC unit tasking re Agent Orange in intended unit-history.' },
    ],
  },
};

const ENGINE_STATUS_CFG = {
  ACTIVE:  { color: "text-teal",   bg: "bg-teal/10",   border: "border-teal/30"   },
  LATENT:  { color: "text-gold",   bg: "bg-gold/10",   border: "border-gold/30"   },
  ABSENT:  { color: "text-muted-foreground", bg: "bg-secondary", border: "border-border" },
};

const SEV_CFG = {
  HIGH: { color: "text-red",    bg: "bg-red/10",    border: "border-red/30",    dot: "bg-red",    label: "HIGH DRIFT" },
  MED:  { color: "text-orange", bg: "bg-orange/10", border: "border-orange/30", dot: "bg-orange", label: "MED DRIFT" },
  LOW:  { color: "text-gold",   bg: "bg-gold/10",   border: "border-gold/30",   dot: "bg-gold",   label: "LOW DRIFT" },
};

const CANON_STATUS = {
  approved:  { label: "CANON ✓",    color: "text-teal",   bg: "bg-teal/10",   border: "border-teal/30"   },
  flagged:   { label: "FLAGGED ⚠",  color: "text-orange", bg: "bg-orange/10", border: "border-orange/30" },
  rejected:  { label: "NON-CANON ✗", color: "text-red",   bg: "bg-red/10",    border: "border-red/30"    },
  unreviewed:{ label: "UNREVIEWED", color: "text-muted-foreground", bg: "bg-secondary", border: "border-border" },
};

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
function saveState(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }

// ─── Chapter Row ──────────────────────────────────────────────────────────────
function ChapterRow({ ch, status, note, onStatusChange, onNoteChange, contradictions }) {
  const [expanded, setExpanded] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [auditSection, setAuditSection] = useState("metrics"); // metrics | engines | defects | history
  const [draft, setDraft] = useState(note || "");
  const statusCfg = CANON_STATUS[status];
  const hasContradictions = contradictions?.length > 0;
  const audit = CHAPTER_AUDITS[ch.ch];

  const saveNote = () => { onNoteChange(draft); setEditNote(false); };

  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${status === "rejected" ? "border-red/30" : status === "approved" ? "border-teal/20" : "border-border"}`}>
      {/* Row header */}
      <div className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-secondary/30 transition-colors ${status === "rejected" ? "bg-red/5" : status === "approved" ? "bg-teal/5" : "bg-card"}`}
        onClick={() => setExpanded(e => !e)}>
        
        {/* Ch number */}
        <span className="text-[10px] font-black font-mono text-muted-foreground min-w-[32px]">Ch.{ch.ch}</span>

        {/* Title */}
        <span className="text-xs font-bold font-sans text-foreground flex-1 truncate">{ch.title}</span>

        {/* Contradiction badge */}
        {hasContradictions && (
          <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border border-red/30 bg-red/10 text-red flex-shrink-0">
            {contradictions.length} contradiction{contradictions.length > 1 ? "s" : ""}
          </span>
        )}

        {/* Act */}
        <span className="text-[9px] font-mono text-muted-foreground flex-shrink-0">Act {ch.act}</span>

        {/* Omega */}
        <span className="text-[10px] font-black font-mono text-gold flex-shrink-0">Ω{ch.omega}</span>

        {/* Audit badge */}
        {audit && (
          <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border flex-shrink-0 ${
            audit.total >= 90 ? "text-teal border-teal/30 bg-teal/10" :
            audit.total >= 75 ? "text-gold border-gold/30 bg-gold/10" :
            "text-orange border-orange/30 bg-orange/10"
          }`}>{audit.total}/100</span>
        )}

        {/* Status toggle */}
        <div className="flex gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
          {["approved", "flagged", "rejected"].map(s => (
            <button key={s} onClick={() => onStatusChange(s === status ? "unreviewed" : s)}
              className={`text-[8px] font-bold font-mono px-2 py-1 rounded border transition-all ${
                status === s ? `${CANON_STATUS[s].color} ${CANON_STATUS[s].bg} ${CANON_STATUS[s].border}` 
                             : "border-border text-muted-foreground hover:border-muted-foreground/40"
              }`}>
              {s === "approved" ? "✓" : s === "flagged" ? "⚠" : "✗"}
            </button>
          ))}
        </div>

        {/* Status label */}
        <span className={`text-[8px] font-bold font-mono px-2 py-0.5 rounded border min-w-[80px] text-center flex-shrink-0 ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}>
          {statusCfg.label}
        </span>

        <span className="text-muted-foreground text-xs">{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 py-3 border-t border-border bg-background space-y-3">
          
          {/* Voice contradictions */}
          {hasContradictions && (
            <div>
              <div className="text-[9px] font-bold font-mono text-red uppercase tracking-wide mb-2">Voice Contradictions Detected</div>
              <div className="space-y-2">
                {contradictions.map((c, i) => {
                  const scfg = SEV_CFG[c.severity] || SEV_CFG.LOW;
                  return (
                    <div key={i} className={`rounded-lg border p-2.5 ${scfg.border} ${scfg.bg}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${scfg.dot}`} />
                        <span className={`text-[9px] font-black font-mono ${scfg.color}`}>{c.char}</span>
                        <span className={`text-[7px] font-bold font-mono px-1.5 py-px rounded border ${scfg.color} ${scfg.border} opacity-80`}>{scfg.label}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-sans leading-relaxed">{c.note}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!hasContradictions && (
            <div className="text-[10px] text-teal font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              No audited voice contradictions for this chapter.
            </div>
          )}

          {/* LITCENTRAL Audit Panel */}
          {audit && (
            <div className="border border-purple/20 rounded-lg overflow-hidden">
              {/* Audit header */}
              <div className="flex items-center justify-between px-3 py-2 bg-purple/5 border-b border-purple/20">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black font-mono text-purple">LITCENTRAL AUDIT</span>
                  <span className={`text-[8px] font-bold font-mono px-1.5 py-px rounded border ${
                    audit.total >= 90 ? "text-teal border-teal/30 bg-teal/10" :
                    audit.total >= 75 ? "text-gold border-gold/30 bg-gold/10" :
                    "text-orange border-orange/30 bg-orange/10"
                  }`}>{audit.total}/100 · {audit.tier}</span>
                  <span className="text-[8px] font-mono text-muted-foreground">Period {audit.period}</span>
                </div>
                <span className={`text-[7px] font-bold font-mono px-1.5 py-px rounded border ${
                  audit.revisionPriority === "HIGH" ? "text-red border-red/30 bg-red/10" :
                  audit.revisionPriority === "MEDIUM" ? "text-orange border-orange/30 bg-orange/10" :
                  "text-gold border-gold/30 bg-gold/10"
                }`}>REVISION: {audit.revisionPriority}</span>
              </div>

              {/* Audit sub-nav */}
              <div className="flex gap-px bg-secondary border-b border-border">
                {[
                  { id: "metrics",  label: "10 Metrics" },
                  { id: "engines",  label: "CME Engines" },
                  { id: "defects",  label: `Defects (${audit.defects.length})` },
                  { id: "history",  label: `Hist. Flags (${audit.historicalFlags.length})` },
                ].map(s => (
                  <button key={s.id} onClick={() => setAuditSection(s.id)}
                    className={`px-3 py-1.5 text-[8px] font-bold font-mono transition-all ${
                      auditSection === s.id ? "bg-card text-purple" : "text-muted-foreground hover:text-foreground"
                    }`}>{s.label}</button>
                ))}
              </div>

              <div className="p-3 bg-background">
                {/* Verdict always shown */}
                <div className="text-[9px] text-muted-foreground font-sans italic leading-relaxed mb-3 border-l-2 border-purple/30 pl-2">{audit.verdict}</div>

                {/* Metrics */}
                {auditSection === "metrics" && (
                  <div className="space-y-1.5">
                    {audit.metrics.map(m => (
                      <div key={m.id} className="flex gap-2 items-start">
                        <span className="text-[8px] font-bold font-mono text-muted-foreground min-w-[28px]">{m.id}</span>
                        <span className="text-[9px] font-bold font-sans text-foreground min-w-[180px] flex-shrink-0">{m.label}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${m.score >= 8 ? "bg-teal" : m.score >= 6 ? "bg-gold" : "bg-red"}`}
                              style={{ width: `${m.score * 10}%` }} />
                          </div>
                          <span className={`text-[9px] font-black font-mono min-w-[16px] ${m.score >= 8 ? "text-teal" : m.score >= 6 ? "text-gold" : "text-red"}`}>{m.score}</span>
                        </div>
                        <span className="text-[8px] text-muted-foreground font-sans leading-tight flex-1">{m.note}</span>
                      </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-border flex gap-4 text-[8px] font-mono">
                      <span className="text-purple font-bold">STRONGEST: <span className="text-foreground font-normal italic">{audit.strongestSentence}</span></span>
                    </div>
                    <div className="text-[8px] font-mono">
                      <span className="text-red font-bold">WEAKEST: <span className="text-muted-foreground font-normal italic">{audit.weakestSentence}</span></span>
                    </div>
                  </div>
                )}

                {/* CME Engines */}
                {auditSection === "engines" && (
                  <div className="space-y-1.5">
                    {audit.engines.map(e => {
                      const ecfg = ENGINE_STATUS_CFG[e.status] || ENGINE_STATUS_CFG.ABSENT;
                      return (
                        <div key={e.id} className={`rounded border p-2 flex gap-2 items-start ${ecfg.border} ${ecfg.bg}`}>
                          <span className="text-[8px] font-bold font-mono text-muted-foreground min-w-[20px]">{e.id}</span>
                          <span className={`text-[8px] font-black font-mono min-w-[180px] flex-shrink-0 ${ecfg.color}`}>{e.label}</span>
                          <span className={`text-[7px] font-bold font-mono px-1 py-px rounded border flex-shrink-0 ${ecfg.color} ${ecfg.border}`}>{e.status}</span>
                          <span className="text-[8px] text-muted-foreground font-sans leading-tight flex-1">{e.note}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Defects */}
                {auditSection === "defects" && (
                  <div className="space-y-1.5">
                    {audit.defects.map((d, i) => {
                      const scfg = SEV_CFG[d.sev] || SEV_CFG.LOW;
                      return (
                        <div key={i} className={`rounded border p-2 flex gap-2 items-start ${scfg.border} ${scfg.bg}`}>
                          <span className={`text-[7px] font-bold font-mono px-1.5 py-px rounded border flex-shrink-0 ${scfg.color} ${scfg.border}`}>{d.sev}</span>
                          <span className="text-[9px] text-foreground font-sans leading-tight">{d.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Historical Flags */}
                {auditSection === "history" && (
                  <div className="space-y-1.5">
                    {audit.historicalFlags.map((h, i) => (
                      <div key={i} className="rounded border border-orange/30 bg-orange/5 p-2 flex gap-2 items-start">
                        <span className="text-[8px] font-bold font-mono text-orange min-w-[40px] flex-shrink-0">L.{h.line}</span>
                        <span className="text-[9px] text-foreground font-sans leading-tight">{h.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviewer note */}
          <div>
            <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wide mb-1.5">Reviewer Note</div>
            {editNote ? (
              <div className="space-y-1.5">
                <textarea value={draft} onChange={e => setDraft(e.target.value)}
                  placeholder="Add canon review notes, exceptions, context…"
                  className="w-full bg-secondary border border-border rounded px-2.5 py-2 text-xs font-sans text-foreground resize-none h-20 focus:outline-none focus:border-gold/60" />
                <div className="flex gap-2">
                  <button onClick={saveNote} className="px-3 py-1 bg-gold text-background rounded text-[9px] font-black font-mono">SAVE</button>
                  <button onClick={() => { setEditNote(false); setDraft(note || ""); }} className="px-3 py-1 border border-border rounded text-[9px] font-mono text-muted-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="flex-1 text-[10px] text-muted-foreground font-sans italic">
                  {note || <span className="opacity-50">No reviewer note</span>}
                </div>
                <button onClick={() => setEditNote(true)} className="text-[9px] font-mono text-accent hover:underline flex-shrink-0">Edit</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CanonWorthinessTab() {
  const [state, setState] = useState(loadState);
  const [filter, setFilter] = useState("all"); // all | approved | flagged | rejected | unreviewed | contradictions
  const [view, setView] = useState("chapters"); // chapters | summary | intel

  const getStatus = (ch) => state[ch]?.status || "unreviewed";
  const getNote   = (ch) => state[ch]?.note   || "";

  const updateStatus = (ch, status) => {
    const next = { ...state, [ch]: { ...state[ch], status } };
    setState(next); saveState(next);
  };
  const updateNote = (ch, note) => {
    const next = { ...state, [ch]: { ...state[ch], note } };
    setState(next); saveState(next);
  };

  // Filter chapters
  const filtered = CHAPTERS.filter(ch => {
    if (ch.isMissing) return false;
    const status = getStatus(ch.ch);
    if (filter === "contradictions") return !!VOICE_CONTRADICTIONS[ch.ch];
    if (filter === "all") return true;
    return status === filter;
  });

  // Summary counts
  const counts = {
    approved:   CHAPTERS.filter(c => getStatus(c.ch) === "approved").length,
    flagged:    CHAPTERS.filter(c => getStatus(c.ch) === "flagged").length,
    rejected:   CHAPTERS.filter(c => getStatus(c.ch) === "rejected").length,
    unreviewed: CHAPTERS.filter(c => getStatus(c.ch) === "unreviewed" && !c.isMissing).length,
    contradictions: Object.keys(VOICE_CONTRADICTIONS).length,
  };

  const highDrift = CHAPTERS.filter(ch => {
    const c = VOICE_CONTRADICTIONS[ch.ch];
    return c && c.some(x => x.severity === "HIGH");
  });

  const reviewed = counts.approved + counts.flagged + counts.rejected;
  const total = CHAPTERS.filter(c => !c.isMissing).length;
  const pct = Math.round((reviewed / total) * 100);

  return (
    <div className="animate-slide-up space-y-4">

      {/* Header */}
      <div className="bg-purple/5 border border-purple/30 rounded-lg p-4 flex items-start gap-3">
        <span className="text-2xl">📜</span>
        <div>
          <div className="text-sm font-black font-mono text-purple">CANON-WORTHINESS AUDIT</div>
          <div className="text-[10px] text-muted-foreground font-sans">Per-chapter canon status · Voice contradiction flags · Reviewer notes · Summary dashboard</div>
        </div>
      </div>

      {/* Summary stat row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "CANON ✓",        val: counts.approved,        color: "teal"   },
          { label: "FLAGGED ⚠",      val: counts.flagged,         color: "orange" },
          { label: "NON-CANON ✗",    val: counts.rejected,        color: "red"    },
          { label: "UNREVIEWED",     val: counts.unreviewed,      color: "muted-foreground" },
          { label: "CONTRADICTIONS", val: counts.contradictions,  color: "purple" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-2xl font-black font-mono text-${s.color}`}>{s.val}</div>
            <div className="text-[8px] font-bold font-mono text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Review progress bar */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-bold font-mono text-muted-foreground uppercase">Review Progress</span>
          <span className="text-[10px] font-black font-mono text-foreground">{reviewed}/{total} chapters · {pct}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden flex gap-px">
          <div className="bg-teal transition-all" style={{ width: `${(counts.approved / total) * 100}%` }} />
          <div className="bg-orange transition-all" style={{ width: `${(counts.flagged / total) * 100}%` }} />
          <div className="bg-red transition-all" style={{ width: `${(counts.rejected / total) * 100}%` }} />
        </div>
        <div className="flex gap-4 mt-1.5 text-[8px] font-mono">
          <span className="text-teal">{counts.approved} canon</span>
          <span className="text-orange">{counts.flagged} flagged</span>
          <span className="text-red">{counts.rejected} non-canon</span>
          <span className="text-muted-foreground">{counts.unreviewed} pending</span>
        </div>
      </div>

      {/* HIGH-severity contradiction alert */}
      {highDrift.length > 0 && (
        <div className="bg-red/5 border border-red/30 rounded-lg p-3">
          <div className="text-[9px] font-bold font-mono text-red uppercase mb-2">⚠ HIGH-Severity Voice Contradictions Require Immediate Review</div>
          <div className="flex flex-wrap gap-1.5">
            {highDrift.map(ch => (
              <button key={ch.ch} onClick={() => { setFilter("contradictions"); setView("chapters"); }}
                className="text-[9px] font-bold font-mono px-2 py-1 rounded border border-red/30 bg-red/10 text-red hover:bg-red/20 transition-all">
                Ch.{ch.ch} {ch.title.slice(0, 20)}{ch.title.length > 20 ? "…" : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View / Filter controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: "all",           label: `All (${total})` },
            { id: "unreviewed",    label: `Unreviewed (${counts.unreviewed})` },
            { id: "contradictions",label: `Contradictions (${counts.contradictions})` },
            { id: "flagged",       label: `Flagged (${counts.flagged})` },
            { id: "approved",      label: `Canon (${counts.approved})` },
            { id: "rejected",      label: `Non-Canon (${counts.rejected})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-mono border transition-all ${
                filter === f.id ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 border border-border rounded-lg p-0.5">
          {[
            { id: "chapters", label: "Chapters" },
            { id: "summary",  label: "Summary"  },
            { id: "intel",    label: "📊 Intel"  },
          ].map(v => (
            <button key={v.id} onClick={() => setView(v.id)}
              className={`px-3 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
                view === v.id ? "bg-secondary text-foreground" : "text-muted-foreground"
              }`}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* ── CHAPTERS VIEW ── */}
      {view === "chapters" && (
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm font-mono">No chapters match this filter.</div>
          )}
          {filtered.map(ch => (
            <ChapterRow
              key={ch.ch}
              ch={ch}
              status={getStatus(ch.ch)}
              note={getNote(ch.ch)}
              contradictions={VOICE_CONTRADICTIONS[ch.ch] || []}
              onStatusChange={s => updateStatus(ch.ch, s)}
              onNoteChange={n => updateNote(ch.ch, n)}
            />
          ))}
        </div>
      )}

      {/* ── INTEL VIEW ── */}
      {view === "intel" && <CanonIntelView />}

      {/* ── SUMMARY VIEW ── */}
      {view === "summary" && (
        <div className="space-y-4">
          {/* Character contradiction breakdown */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wide mb-3">Voice Contradictions by Character</div>
            <div className="space-y-2">
              {[
                { name: "SGT George Ramos",   color: "gold",   chapters: [9, 39] },
                { name: "Capt. Crawford",     color: "red",    chapters: [21, 29, 35] },
                { name: "Joshua Sagasta",     color: "purple", chapters: [5] },
                { name: "Major Duc",          color: "cyan",   chapters: [27] },
                { name: "PFC O'Neil",         color: "blue",   chapters: [20] },
              ].map(char => {
                const drifts = char.chapters.map(n => ({ ch: n, contradictions: VOICE_CONTRADICTIONS[n] || [] }))
                  .filter(x => x.contradictions.some(c => c.char.includes(char.name.split(" ").pop()) || char.name.includes(c.char.split(" ").pop())));
                return (
                  <div key={char.name} className="flex items-center gap-3">
                    <div className={`text-xs font-bold font-mono text-${char.color} min-w-[180px]`}>{char.name}</div>
                    <div className="flex gap-1.5 flex-wrap flex-1">
                      {char.chapters.map(n => {
                        const conts = (VOICE_CONTRADICTIONS[n] || []);
                        const sev = conts.find(c => c.char.includes(char.name.split(" ").pop()) || char.name.includes(c.char.split(" ").pop()))?.severity;
                        const scfg = SEV_CFG[sev] || SEV_CFG.LOW;
                        return (
                          <span key={n} className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border ${scfg.color} ${scfg.border} ${scfg.bg}`}>
                            Ch.{n}
                          </span>
                        );
                      })}
                    </div>
                    <div className={`text-[10px] font-black font-mono text-${char.color}`}>{char.chapters.length}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Non-canon / flagged chapters list */}
          {(counts.rejected > 0 || counts.flagged > 0) && (
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wide mb-3">Flagged & Non-Canon Chapters</div>
              <div className="space-y-1.5">
                {CHAPTERS.filter(ch => ["flagged", "rejected"].includes(getStatus(ch.ch))).map(ch => {
                  const s = getStatus(ch.ch);
                  const scfg = CANON_STATUS[s];
                  return (
                    <div key={ch.ch} className={`flex items-center gap-3 p-2.5 rounded-lg border ${scfg.border} ${scfg.bg}`}>
                      <span className="text-[9px] font-black font-mono text-muted-foreground min-w-[32px]">Ch.{ch.ch}</span>
                      <span className="text-xs font-sans text-foreground flex-1">{ch.title}</span>
                      <span className={`text-[8px] font-bold font-mono ${scfg.color}`}>{scfg.label}</span>
                      {getNote(ch.ch) && (
                        <span className="text-[9px] text-muted-foreground font-sans italic truncate max-w-[180px]">"{getNote(ch.ch)}"</span>
                      )}
                    </div>
                  );
                })}
                {counts.rejected === 0 && counts.flagged === 0 && (
                  <div className="text-[10px] text-teal font-mono">No flagged or non-canon chapters yet.</div>
                )}
              </div>
            </div>
          )}

          {/* Full contradiction table */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wide mb-3">All Audited Contradictions</div>
            <div className="space-y-2">
              {Object.entries(VOICE_CONTRADICTIONS).sort((a, b) => Number(a[0]) - Number(b[0])).map(([chNum, conts]) => {
                const ch = CHAPTERS.find(c => c.ch === Number(chNum));
                return conts.map((c, i) => {
                  const scfg = SEV_CFG[c.severity] || SEV_CFG.LOW;
                  const chStatus = getStatus(Number(chNum));
                  const stCfg = CANON_STATUS[chStatus];
                  return (
                    <div key={`${chNum}-${i}`} className={`flex gap-3 p-3 rounded-lg border ${scfg.border} ${scfg.bg}`}>
                      <div className="flex-shrink-0">
                        <div className="text-[9px] font-black font-mono text-muted-foreground">Ch.{chNum}</div>
                        <div className={`text-[7px] font-bold font-mono px-1.5 py-px rounded border mt-0.5 ${stCfg.color} ${stCfg.border}`}>{stCfg.label}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[9px] font-black font-mono ${scfg.color} flex items-center gap-1.5 mb-0.5`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${scfg.dot}`} />
                          {c.char}
                          <span className={`text-[7px] font-bold px-1 py-px rounded border ml-1 ${scfg.color} ${scfg.border}`}>{scfg.label}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-sans leading-relaxed">{c.note}</div>
                        {ch && <div className="text-[8px] text-muted-foreground/60 font-mono mt-0.5">{ch.title} · Act {ch.act}</div>}
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}