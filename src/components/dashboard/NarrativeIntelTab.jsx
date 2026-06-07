import { useState } from "react";
import DashCard from "./DashCard";
import { base44 } from "@/api/base44Client";
import { CHAPTERS, CHARACTER_BIBLE, CHAPTER_BUGS } from "../../lib/data";

// ===== STATIC INTELLIGENCE DATABASE =====
// Built from forensic audit of the 44-chapter manuscript

const VOICE_FLAGS = [
  {
    character: "SGT George Ramos",
    color: "gold",
    id: "ramos",
    flags: [
      { ch: 9, sev: "CRIT", type: "Name Error", desc: "Called 'Rodriguez' ~60% through chapter. Rodriguez is the Ch.1 underage boy. Ramos = Ch.9 KIA soldier. Fix: Find/replace all 'Rodriguez' in Ch.9 context.", anchor: "CPL Ramirez KIA scene" },
      { ch: 5, sev: "MED", type: "Voice Drift", desc: "Ramos speaks with unusual introspective detachment in hospital scene. His voice should be kinetic and observational, not philosophical. Check internal monologue balance.", anchor: "Hospital room dialogue" },
    ],
    voiceSignature: "Kinetic, sensory-first, code-switching Spanglish, refuses abstraction. Never self-pitying. Physical before emotional.",
    agencyPattern: "Refuses orders that conflict with moral core. Never passive. Acts before reflecting.",
    drift: "LOW",
    driftScore: 4,
  },
  {
    character: "Capt. James Crawford III",
    color: "red",
    id: "crawford",
    flags: [
      { ch: 4, sev: "MED", type: "Continuity", desc: "References 'Colonel Harmon briefing' with no prior setup. Introduce Harmon in Ch.3 or remove reference entirely.", anchor: "Pentagon meeting scene" },
      { ch: 21, sev: "MED", type: "Object Continuity", desc: "Toy soldiers described as 'plastic' — but established as 'lead' in Ch.3 when Crawford's father gave them. MUST be lead.", anchor: "Crawford mirror breakdown" },
    ],
    voiceSignature: "Clinical, mathematical, removes affect from language. Uses institutional euphemism. Never admits emotional stakes.",
    agencyPattern: "Operates through delegation and system. Acts via paperwork. Direct action = system failure.",
    drift: "MED",
    driftScore: 18,
  },
  {
    character: "Joshua Sagasta",
    color: "purple",
    id: "joshua",
    flags: [
      { ch: 18, sev: "HIGH", type: "Character Absence", desc: "Joshua disappears after Ch.5 hospital scene and doesn't reappear until Ch.40 (gap of 35 chapters). His tunnel baptism arc is UNRESOLVED. Reader will forget him.", anchor: "Act II-III gap" },
      { ch: 2, sev: "MED", type: "Arc Continuity", desc: "Deer Dance resurrection in Ch.2 sets up Joshua as spiritual counterpoint to Ramos. This thread is never paid off in Act II. One scene in Ch.18-20 range needed.", anchor: "Tunnel baptism" },
    ],
    voiceSignature: "Mystic, fragmented speech. Yaqui cadence intrudes on English. Does not argue — declares.",
    agencyPattern: "Acts through vision and ceremony, not military structure. His agency is spiritual, not tactical.",
    drift: "HIGH",
    driftScore: 8,
  },
  {
    character: "Major Pham Duc",
    color: "cyan",
    id: "duc",
    flags: [
      { ch: 16, sev: "MED", type: "Name Inconsistency", desc: "Radio operator alternates between 'Trong' and 'Trung' across Ch.16 and Ch.27. Standardize to TRONG throughout.", anchor: "Duc tactical planning scenes" },
      { ch: 39, sev: "HIGH", type: "Arc Gap", desc: "Duc's POV arc needs one paragraph at the Hearing Hall (Ch.40). Without it, the Vietnamese perspective ends at Ch.27 — nearly 13 chapters of absence.", anchor: "Hearing Hall testimony" },
    ],
    voiceSignature: "Formal, strategic, sees terrain as geometry. Uses poetic compression. Never sentimentalizes death.",
    agencyPattern: "Operates from complete tactical picture. His mistakes are strategic, not personal.",
    drift: "MED",
    driftScore: 10,
  },
  {
    character: "PFC O'Neil",
    color: "blue",
    id: "oneil",
    flags: [
      { ch: 20, sev: "LOW", type: "Dialect Drift", desc: "O'Neil's Kentucky drawl disappears in the cornbread scene — he speaks in neutral American English. One dialect marker needed ('ain't', 'y'all', Southern cadence).", anchor: "Cornbread / care package scene" },
    ],
    voiceSignature: "Kentucky/Boston hybrid. Drawl + city toughness. Expresses grief through food and loyalty rituals.",
    agencyPattern: "Acts through gesture and object — the care package IS his agency. Never articulates feelings directly.",
    drift: "LOW",
    driftScore: 11,
  },
  {
    character: "The Yaqui Chieftain",
    color: "teal",
    id: "chieftain",
    flags: [],
    voiceSignature: "Archaic, compressed, metaphor-as-statement. Each word costs. Never explains — reveals.",
    agencyPattern: "Appears only at inflection points of Ramos's soul. Never in tactical scenes.",
    drift: "NONE",
    driftScore: 3,
  },
];

const CONTINUITY_FLAGS = [
  { sev: "CRIT", ch_a: 9, ch_b: 9, item: "Ramirez / Rodriguez name swap", desc: "CPL Ramirez is called 'Rodriguez' ~60% through Ch.9. Rodriguez is a different character (underage boy from Ch.1). This is a critical reader-confusion error.", status: "OPEN" },
  { sev: "HIGH", ch_a: 3, ch_b: 21, item: "Toy soldiers: lead → plastic", desc: "Crawford's toy soldiers established as LEAD in Ch.3 (father's gift, WWII era). In Ch.21 they are 'plastic.' Inconsistent — must be LEAD to maintain period authenticity and emotional weight.", status: "OPEN" },
  { sev: "HIGH", ch_a: 13, ch_b: 34, item: "Chamoy: paste vs liquid", desc: "Ch.13 Package Sacrament: chamoy is 'sweet-sour paste.' Ch.34 Birthday Brief: chamoy is 'liquid.' Standardize to PASTE — paste is more visceral and period-accurate.", status: "OPEN" },
  { sev: "HIGH", ch_a: 9, ch_b: 10, item: "Grid position: 4-9 vs 4-7", desc: "Squad placed at 'grid 4-9' end of Ch.9. Pink mist event in Ch.10 references 'grid 4-7.' Two-grid drift in 5,000 words breaks tactical realism.", status: "OPEN" },
  { sev: "MED", ch_a: 29, ch_b: 30, item: "Mortar caliber: 81mm vs 82mm", desc: "Ch.29: US M29 mortar (81mm). Ch.30: same scene references '82mm.' NVA used 82mm Soviet mortar. US used 81mm. Standardize: US fire = 81mm, NVA = 82mm.", status: "OPEN" },
  { sev: "MED", ch_a: 6, ch_b: 6, item: "Anachronism: ID card swipe", desc: "Magnetic stripe IDs not standard USMC until 1973. In Ch.6 (1969), change to 'dog tag check' or 'ID card inspection'.", status: "OPEN" },
  { sev: "MED", ch_a: 14, ch_b: 14, item: "Motown on reel-to-reel", desc: "Reel-to-reel players uncommon in field 1969. More accurate: 'cassette dub' — cassette players entered military use 1968-69.", status: "OPEN" },
  { sev: "MED", ch_a: 3, ch_b: 4, item: "Colonel Harmon: introduced mid-scene", desc: "Crawford references 'Colonel Harmon briefing' in Ch.4 with no prior mention. Reader has no anchor. Introduce Harmon name in Ch.3 or remove reference.", status: "OPEN" },
  { sev: "LOW", ch_a: 35, ch_b: 35, item: "628-day calculation", desc: "Verify Martinez's 628 days mathematically against his deployment date established in Ch.8. The number MUST be exact — it's the manuscript's mathematical keystone.", status: "VERIFY" },
  { sev: "LOW", ch_a: 42, ch_b: 42, item: "TOC duplicate article: 'The THE'", desc: "Ch.41 title listed in TOC as 'The THE HEARING HALL'. Formatting error — remove duplicate article.", status: "OPEN" },
  { sev: "LOW", ch_a: 43, ch_b: 43, item: "Title truncation: 'Sempr'", desc: "Ch.43 title 'Unidos para Sempr' is truncated. Should be 'Unidos para Siempre'. Check TOC and chapter header.", status: "OPEN" },
];

const WORD_OVERUSE = [
  { ch: 3, word: "algorithm", count: 14, per1k: 2.96, threshold: 2.0, severity: "MED", suggestions: ["system", "calculus", "machine logic", "the equation", "the 360"] },
  { ch: 11, word: "dark / darkness", count: 22, per1k: 3.8, threshold: 2.0, severity: "HIGH", suggestions: ["shadow", "void", "the black", "night-weight", "ink of it"] },
  { ch: 22, word: "faith", count: 11, per1k: 2.0, threshold: 2.0, severity: "LOW", suggestions: ["conviction", "the thing beneath the prayer", "trust", "the rosary logic"] },
  { ch: 26, word: "brown", count: 8, per1k: 1.3, threshold: 1.5, severity: "MED", suggestions: ["Vary distribution across 400-word section — 8 hits in a 400-word cluster reads as affectation"] },
  { ch: 33, word: "map", count: 12, per1k: 2.24, threshold: 2.0, severity: "MED", suggestions: ["the cardboard", "the grid", "operational theater", "the lines", "topography"] },
  { ch: 9, word: "brother / brothers", count: 0, per1k: 0, threshold: 0, severity: "NOTE", suggestions: ["Use 'carnales' in climactic Ramirez scene — English 'brothers' weakens the cultural specificity of that death."] },
];

const ABSENCE_TRACKER = [
  { character: "Joshua Sagasta", lastCh: 5, nextCh: 40, gapChapters: 35, severity: "HIGH", note: "35-chapter gap. Reader will completely forget Joshua. One scene in Ch.18-20 (Act II opening) will resolve his arc thread and pay off the tunnel baptism." },
  { character: "Major Pham Duc", lastCh: 27, nextCh: 40, gapChapters: 13, severity: "MED", note: "13-chapter gap in Act III. Duc's strategic arc needs a closing beat. One paragraph at the Hearing Hall closes his Vietnamese POV thread." },
  { character: "The Yaqui Chieftain", lastCh: 39, nextCh: 41, gapChapters: 2, severity: "LOW", note: "Chieftain's sparse appearances are intentional and correct — appears only at soul-inflection points. No action needed." },
  { character: "CPL Ramirez", lastCh: 9, nextCh: null, gapChapters: null, severity: "NOTE", note: "Ramirez KIA Ch.9. He should echo in Ch.35 'Mathematics of Revenge' (628-day calculation references his death date). Verify this reference exists." },
];

const SEV_CONFIG = {
  CRIT:  { color: "red",    bg: "bg-red/5",    border: "border-red/30",    label: "CRITICAL" },
  HIGH:  { color: "orange", bg: "bg-orange/5", border: "border-orange/30", label: "HIGH" },
  MED:   { color: "gold",   bg: "bg-gold/5",   border: "border-gold/30",   label: "MED" },
  LOW:   { color: "blue",   bg: "bg-blue/5",   border: "border-blue/30",   label: "LOW" },
  NOTE:  { color: "purple", bg: "bg-purple/5", border: "border-purple/30", label: "NOTE" },
  VERIFY:{ color: "teal",   bg: "bg-teal/5",   border: "border-teal/20",   label: "VERIFY" },
};

const DRIFT_COLOR = { NONE: "teal", LOW: "blue", MED: "gold", HIGH: "orange", CRIT: "red" };

const AI_PROMPTS = [
  "Analyze Ramos's voice consistency across the first firefight (Ch.8) vs the WP wound scene (Ch.39). Does his interiority change in a way that feels earned or forced?",
  "Crawford's moral degradation arc: does his language shift plausibly from clinical to fractured? Check Ch.3 vs Ch.21 vs Ch.35.",
  "The Yaqui Chieftain appears in Ch.1, Ch.9, Ch.31, Ch.39. Does his register stay consistent? Flag any moment where he sounds like a modern narrator.",
  "Joshua Sagasta appears in Ch.2 and Ch.5 only. Does his Yaqui cadence feel distinct from Ramos? Where does his voice blur?",
  "Major Duc appears in Ch.16 and Ch.27. Does his strategic, geometric voice remain consistent? Compare his tactical observations.",
  "O'Neil's Kentucky drawl — does it appear in Ch.9 (Ramirez death), Ch.13 (Package Sacrament), and Ch.20 (cornbread scene)? Flag any scene where he sounds neutral.",
];

export default function NarrativeIntelTab() {
  const [activeSection, setActiveSection] = useState("voice");
  const [expandedChar, setExpandedChar] = useState(null);
  const [expandedCont, setExpandedCont] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [sevFilter, setSevFilter] = useState("ALL");

  const totalVoiceFlags = VOICE_FLAGS.reduce((sum, c) => sum + c.flags.length, 0);
  const critFlags = CONTINUITY_FLAGS.filter(f => f.sev === "CRIT").length + VOICE_FLAGS.flatMap(c => c.flags).filter(f => f.sev === "CRIT").length;
  const highFlags = CONTINUITY_FLAGS.filter(f => f.sev === "HIGH").length + VOICE_FLAGS.flatMap(c => c.flags).filter(f => f.sev === "HIGH").length;
  const absenceHigh = ABSENCE_TRACKER.filter(a => a.severity === "HIGH").length;

  const filteredContinuity = sevFilter === "ALL" ? CONTINUITY_FLAGS : CONTINUITY_FLAGS.filter(f => f.sev === sevFilter);

  const runAiScan = async (prompt) => {
    setAiLoading(true);
    setAiResponse(null);
    const fullPrompt = `You are analyzing the novel "SGT George Ramos: The Mathematics of Vietnam" — a 44-chapter Chicano Vietnam War narrative. 

Character profiles:
- George Ramos: kinetic, sensory-first, Spanglish code-switcher, never self-pitying, acts before reflecting
- Crawford: clinical, mathematical, removes affect, operates through institutional euphemism
- Joshua Sagasta: mystic, fragmented, Yaqui cadence, speaks in declarations not arguments
- Major Duc: formal, geometric, poetic compression, never sentimentalizes death
- The Chieftain: archaic, compressed, metaphor-as-statement, each word earned

Task: ${prompt}

Provide specific, actionable forensic notes. Flag exact chapter moments. Be precise — the author needs editorial direction, not encouragement.`;

    const res = await base44.integrations.Core.InvokeLLM({ prompt: fullPrompt });
    setAiResponse(res);
    setAiLoading(false);
  };

  const SECTIONS = [
    { id: "voice", label: "Voice Scanner" },
    { id: "continuity", label: "Continuity Tracker" },
    { id: "overuse", label: "Word Overuse" },
    { id: "absence", label: "Absence Alerts" },
    { id: "ai", label: "AI Deep Scan" },
  ];

  return (
    <div className="animate-slide-up space-y-4">

      {/* Header */}
      <div className="bg-purple/5 border border-purple/30 rounded-lg p-4">
        <div className="text-sm font-black text-purple font-mono mb-1">NARRATIVE INTELLIGENCE ANALYZER — AutoCrit Forensic Engine</div>
        <div className="text-xs text-muted-foreground font-sans leading-relaxed">
          Character voice consistency · Cross-chapter continuity · Word overuse · Absence tracking · AI deep scan. 
          <span className="text-red font-bold"> {critFlags} CRITICAL</span> · <span className="text-orange font-bold">{highFlags} HIGH</span> · {totalVoiceFlags} voice flags · {CONTINUITY_FLAGS.length} continuity flags
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Critical Flags", value: critFlags, color: "red" },
          { label: "High Priority", value: highFlags, color: "orange" },
          { label: "Continuity Breaks", value: CONTINUITY_FLAGS.length, color: "gold" },
          { label: "Absence Alerts", value: absenceHigh, color: "purple" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-2xl font-black font-mono text-${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section Nav */}
      <div className="flex gap-1.5 flex-wrap">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all border ${activeSection === s.id ? "bg-purple text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ===== VOICE SCANNER ===== */}
      {activeSection === "voice" && (
        <div className="space-y-3">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            <span className="text-purple font-bold">Voice Drift Score</span>: measures deviation from established character register. 
            0–5 = stable. 6–12 = monitor. 13–20 = intervention needed. 20+ = structural problem.
          </div>
          {VOICE_FLAGS.map((char) => {
            const isOpen = expandedChar === char.id;
            const hasCrit = char.flags.some(f => f.sev === "CRIT");
            return (
              <div key={char.id} className={`rounded-lg border overflow-hidden ${hasCrit ? "border-red/30 bg-red/5" : "border-border bg-card"}`}>
                <button onClick={() => setExpandedChar(isOpen ? null : char.id)} className="w-full p-4 text-left">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`w-2 h-2 rounded-full bg-${char.color} flex-shrink-0`} />
                    <span className={`text-sm font-black font-mono text-${char.color}`}>{char.character}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono border text-${DRIFT_COLOR[char.drift]} border-${DRIFT_COLOR[char.drift]}/40 bg-${DRIFT_COLOR[char.drift]}/10`}>
                      DRIFT: {char.drift}
                    </span>
                    <span className={`text-[9px] font-mono text-muted-foreground`}>Score: {char.driftScore}/100</span>
                    <span className={`text-[9px] font-bold font-mono ${char.flags.length === 0 ? "text-teal" : hasCrit ? "text-red" : "text-orange"}`}>
                      {char.flags.length === 0 ? "✓ CLEAN" : `${char.flags.length} flag${char.flags.length > 1 ? "s" : ""}`}
                    </span>
                    <span className="ml-auto text-muted-foreground text-xs">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-border/30 pt-3 space-y-3">
                    {/* Voice Signature */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-2.5 bg-background rounded border border-border">
                        <div className={`text-[8px] font-bold font-mono text-${char.color} uppercase tracking-wide mb-1`}>Voice Signature</div>
                        <div className="text-[10px] text-foreground/80 font-sans leading-relaxed">{char.voiceSignature}</div>
                      </div>
                      <div className="p-2.5 bg-background rounded border border-border">
                        <div className={`text-[8px] font-bold font-mono text-${char.color} uppercase tracking-wide mb-1`}>Agency Pattern</div>
                        <div className="text-[10px] text-foreground/80 font-sans leading-relaxed">{char.agencyPattern}</div>
                      </div>
                    </div>

                    {/* Drift bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-muted-foreground font-mono min-w-[80px]">Drift Score</span>
                      <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full bg-${DRIFT_COLOR[char.drift]} rounded-full`} style={{ width: `${char.driftScore}%` }} />
                      </div>
                      <span className={`text-[9px] font-bold font-mono text-${DRIFT_COLOR[char.drift]}`}>{char.driftScore}</span>
                    </div>

                    {/* Flags */}
                    {char.flags.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Detected Flags</div>
                        {char.flags.map((flag, i) => {
                          const cfg = SEV_CONFIG[flag.sev] || SEV_CONFIG["LOW"];
                          return (
                            <div key={i} className={`p-3 rounded border ${cfg.border} ${cfg.bg}`}>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`text-[9px] font-bold font-mono text-${cfg.color} border border-${cfg.color}/40 px-1.5 py-0.5 rounded-full`}>{cfg.label}</span>
                                <span className="text-[9px] font-mono text-muted-foreground">Ch.{flag.ch}</span>
                                <span className="text-[9px] text-foreground/60 font-sans">{flag.type}</span>
                              </div>
                              <div className="text-xs text-foreground/80 font-sans leading-relaxed mb-1">{flag.desc}</div>
                              <div className="text-[9px] text-muted-foreground font-mono">Anchor: "{flag.anchor}"</div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-teal text-center py-2 font-mono">✓ No voice flags detected — register stable</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== CONTINUITY TRACKER ===== */}
      {activeSection === "continuity" && (
        <div className="space-y-3">
          <div className="flex gap-1.5 flex-wrap">
            {["ALL", "CRIT", "HIGH", "MED", "LOW", "VERIFY"].map(f => {
              const count = f === "ALL" ? CONTINUITY_FLAGS.length : CONTINUITY_FLAGS.filter(x => x.sev === f).length;
              return (
                <button key={f} onClick={() => setSevFilter(f)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono border transition-all ${sevFilter === f ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
                  {f} ({count})
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            {filteredContinuity.map((flag, i) => {
              const cfg = SEV_CONFIG[flag.sev] || SEV_CONFIG["LOW"];
              const isOpen = expandedCont === i;
              return (
                <div key={i} className={`rounded-lg border overflow-hidden ${cfg.border} ${cfg.bg}`}>
                  <button onClick={() => setExpandedCont(isOpen ? null : i)} className="w-full p-3 text-left">
                    <div className="flex items-start gap-3">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono border text-${cfg.color} border-${cfg.color}/40 flex-shrink-0 mt-0.5`}>{cfg.label}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-foreground">{flag.item}</span>
                          {flag.ch_a !== flag.ch_b ? (
                            <span className="text-[9px] font-mono text-muted-foreground">Ch.{flag.ch_a} ↔ Ch.{flag.ch_b}</span>
                          ) : (
                            <span className="text-[9px] font-mono text-muted-foreground">Ch.{flag.ch_a}</span>
                          )}
                        </div>
                        {!isOpen && <div className="text-[10px] text-muted-foreground font-sans mt-0.5 truncate">{flag.desc}</div>}
                      </div>
                      <span className="text-muted-foreground text-xs flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 border-t border-border/30 pt-2">
                      <div className="text-xs text-foreground/80 font-sans leading-relaxed">{flag.desc}</div>
                      <div className={`mt-2 text-[9px] font-bold font-mono text-${cfg.color}`}>Status: {flag.status}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== WORD OVERUSE ===== */}
      {activeSection === "overuse" && (
        <div className="space-y-3">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            <span className="text-gold font-bold">AutoCrit Standard:</span> Flag any word appearing more than 2x per 1,000 words within a single chapter. 
            Below 1.5/1k = acceptable. 2.0–3.0/1k = reduce by 30–50%. Above 3.0/1k = critical overuse.
          </div>

          {WORD_OVERUSE.map((item, i) => {
            const isOver = item.per1k >= item.threshold;
            const cfg = item.severity === "HIGH" ? SEV_CONFIG["HIGH"] : item.severity === "MED" ? SEV_CONFIG["MED"] : item.severity === "NOTE" ? SEV_CONFIG["NOTE"] : SEV_CONFIG["LOW"];
            return (
              <div key={i} className={`p-4 rounded-lg border ${cfg.border} ${cfg.bg}`}>
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-bold font-mono text-${cfg.color} border border-${cfg.color}/40 px-1.5 py-0.5 rounded-full`}>{cfg.label}</span>
                      <span className="text-[9px] font-mono text-muted-foreground">Ch.{item.ch}</span>
                    </div>
                    <div className={`text-sm font-black font-mono text-${cfg.color} mb-1`}>"{item.word}"</div>
                    {item.count > 0 && (
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-bold font-mono text-${cfg.color}`}>{item.count}x</span>
                        <span className="text-[9px] text-muted-foreground font-mono">{item.per1k}/1k</span>
                        <div className="flex-1 bg-secondary rounded-full h-1 overflow-hidden max-w-[100px]">
                          <div className={`h-full bg-${cfg.color} rounded-full`} style={{ width: `${Math.min((item.per1k / 4) * 100, 100)}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="text-[10px] text-muted-foreground font-sans mb-2">
                      {item.severity === "NOTE" ? "Recommendation:" : "Alternatives:"}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.suggestions.map((s, si) => (
                        <span key={si} className="text-[9px] px-2 py-0.5 bg-background border border-border rounded-full font-sans text-foreground/70">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Universal word overuse guidance */}
          <DashCard title="AutoCrit Word Overuse Thresholds" accent="gold">
            <div className="space-y-2">
              {[
                { range: "< 1.5/1k", verdict: "Acceptable", color: "teal", note: "Natural usage — no action needed" },
                { range: "1.5–2.0/1k", verdict: "Monitor", color: "blue", note: "Watch pattern — replace 1–2 instances if noticeable" },
                { range: "2.0–3.0/1k", verdict: "Reduce", color: "gold", note: "Replace 30–50% of instances with contextual synonyms" },
                { range: "3.0+/1k", verdict: "Critical", color: "red", note: "Reader will notice. Replace to below 2.0/1k before submission" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-background rounded border border-border">
                  <span className={`text-xs font-black font-mono text-${t.color} min-w-[80px]`}>{t.range}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-mono text-${t.color} border-${t.color}/40`}>{t.verdict}</span>
                  <span className="text-[10px] text-muted-foreground font-sans">{t.note}</span>
                </div>
              ))}
            </div>
          </DashCard>
        </div>
      )}

      {/* ===== ABSENCE TRACKER ===== */}
      {activeSection === "absence" && (
        <div className="space-y-3">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            <span className="text-orange font-bold">AutoCrit Absence Rule:</span> A named character who appears in 2+ prior chapters 
            and then vanishes for 10+ chapters without explanation creates reader abandonment. The reader forgets them entirely.
          </div>

          {ABSENCE_TRACKER.map((a, i) => {
            const cfg = SEV_CONFIG[a.severity] || SEV_CONFIG["NOTE"];
            return (
              <div key={i} className={`p-4 rounded-lg border ${cfg.border} ${cfg.bg}`}>
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-black font-mono text-${cfg.color}`}>{a.character}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border font-mono text-${cfg.color} border-${cfg.color}/40`}>{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-2 flex-wrap">
                      <div className="text-center">
                        <div className={`text-sm font-black font-mono text-${cfg.color}`}>Ch.{a.lastCh}</div>
                        <div className="text-[8px] text-muted-foreground font-mono">Last Seen</div>
                      </div>
                      {a.nextCh && (
                        <>
                          <div className={`text-xs font-mono text-${cfg.color}`}>→ {a.gapChapters} ch gap →</div>
                          <div className="text-center">
                            <div className={`text-sm font-black font-mono text-${cfg.color}`}>Ch.{a.nextCh}</div>
                            <div className="text-[8px] text-muted-foreground font-mono">Next Appear</div>
                          </div>
                        </>
                      )}
                      {!a.nextCh && <div className={`text-xs font-mono text-${cfg.color}`}>→ KIA / no return</div>}
                    </div>
                    <div className="text-[10px] text-foreground/80 font-sans leading-relaxed">{a.note}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Character Presence Grid */}
          <DashCard title="Character Presence Map — Acts I–III" accent="purple">
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 px-2 text-muted-foreground font-mono">Character</th>
                    {["I (1–16)", "II (17–31)", "III (32–44)"].map(a => (
                      <th key={a} className="text-center py-1.5 px-2 text-muted-foreground font-mono">{a}</th>
                    ))}
                    <th className="text-left py-1.5 px-2 text-muted-foreground font-mono">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Ramos", act1: "FULL", act2: "FULL", act3: "FULL", status: "✓ Consistent", color: "gold" },
                    { name: "Crawford", act1: "FULL", act2: "ACTIVE", act3: "CLIMAX", status: "✓ Arc complete", color: "red" },
                    { name: "Joshua", act1: "STRONG", act2: "ABSENT", act3: "RETURN", status: "⚠ 35-ch gap", color: "purple" },
                    { name: "Miguel/Jorge", act1: "INTRO", act2: "FULL", act3: "COMPLETE", status: "✓ Arc complete", color: "orange" },
                    { name: "Major Duc", act1: "INTRO", act2: "ACTIVE", act3: "ABSENT", status: "⚠ No Act III close", color: "cyan" },
                    { name: "Chieftain", act1: "ANCHOR", act2: "SPARSE", act3: "SACRED", status: "✓ Intentional sparse", color: "teal" },
                    { name: "Ramirez", act1: "KIA Ch.9", act2: "ECHO", act3: "MEMORY", status: "✓ Echo presence OK", color: "red" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className={`py-1.5 px-2 font-bold text-${row.color}`}>{row.name}</td>
                      {[row.act1, row.act2, row.act3].map((act, ai) => (
                        <td key={ai} className="py-1.5 px-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] ${
                            act === "ABSENT" ? "bg-red/10 text-red" :
                            act === "FULL" || act === "ACTIVE" || act === "STRONG" ? "bg-teal/10 text-teal" :
                            act === "KIA Ch.9" ? "bg-red/10 text-red" :
                            "bg-secondary text-muted-foreground"
                          }`}>{act}</span>
                        </td>
                      ))}
                      <td className="py-1.5 px-2 text-muted-foreground font-sans">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashCard>
        </div>
      )}

      {/* ===== AI DEEP SCAN ===== */}
      {activeSection === "ai" && (
        <div className="space-y-4">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            <span className="text-purple font-bold">AI Deep Scan</span>: Ask the intelligence engine to analyze specific voice consistency, arc continuity, 
            or character behavior questions. Select a pre-loaded forensic prompt or write your own.
          </div>

          {/* Quick Prompts */}
          <DashCard title="Pre-Loaded Forensic Prompts" accent="purple">
            <div className="space-y-2">
              {AI_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => setAiPrompt(p)}
                  className={`w-full text-left p-2.5 rounded border text-[10px] font-sans transition-all ${aiPrompt === p ? "border-purple/50 bg-purple/10 text-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-muted-foreground"}`}>
                  <span className="text-purple font-bold mr-1">#{i + 1}</span> {p}
                </button>
              ))}
            </div>
          </DashCard>

          {/* Custom prompt */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Custom Forensic Query</div>
            <textarea
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="e.g. 'Does Crawford's voice drift toward sympathy too early in Act II? Check Ch.18–Ch.22.'"
              className="w-full bg-background border border-border rounded-lg p-3 text-xs font-sans text-foreground resize-none h-20 focus:outline-none focus:border-purple/50"
            />
            <button
              onClick={() => aiPrompt.trim() && runAiScan(aiPrompt)}
              disabled={aiLoading || !aiPrompt.trim()}
              className="mt-2 px-4 py-2 bg-purple text-white rounded-lg text-xs font-bold font-mono disabled:opacity-40 hover:bg-purple/80 transition-colors"
            >
              {aiLoading ? "Scanning..." : "Run Forensic Scan"}
            </button>
          </div>

          {/* Loading */}
          {aiLoading && (
            <div className="bg-purple/5 border border-purple/20 rounded-lg p-6 text-center">
              <div className="text-purple font-mono text-sm font-bold mb-1">Analyzing manuscript...</div>
              <div className="text-[10px] text-muted-foreground font-sans">Cross-referencing character voice signatures · Checking arc continuity · Flagging drift</div>
              <div className="mt-3 flex justify-center gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-purple rounded-full animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Response */}
          {aiResponse && !aiLoading && (
            <DashCard title="Forensic Analysis Result" accent="purple">
              <div className="text-xs text-foreground/80 font-sans leading-relaxed whitespace-pre-wrap">{aiResponse}</div>
              <div className="mt-3 pt-3 border-t border-border">
                <button onClick={() => { setAiResponse(null); setAiPrompt(""); }}
                  className="text-[9px] font-mono text-muted-foreground hover:text-foreground">
                  Clear · Run new scan
                </button>
              </div>
            </DashCard>
          )}
        </div>
      )}
    </div>
  );
}