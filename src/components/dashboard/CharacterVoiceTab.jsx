import { useState } from "react";
import { base44 } from "@/api/base44Client";

// ─── Character Baseline Profiles ──────────────────────────────────────────────
const CHARACTERS = [
  {
    id: "ramos",
    name: "SGT George Ramos",
    color: "gold",
    icon: "🪖",
    baseline: {
      register: "Kinetic, sensory-first, Spanglish code-switcher",
      sentiment: "Controlled rage beneath duty. Never self-pitying.",
      syntax: "Short declarative sentences. Physical before emotional. Present-tense interiority.",
      forbidden: ["philosophical abstraction", "passive construction", "self-pity", "rhetorical questions"],
      markers: ["code-switch mid-sentence", "body anchoring before feeling", "refuses orders with action not words"],
      sampleDialogue: `"Thirteen. Trece. And every one of them looked like my cousin."\n"The coordinates don't lie. The men do."\n"Move. Just move. The jungle doesn't wait for grief."`,
    },
    dialogueSamples: [
      { ch: 1,  text: "You want me to count the dead? I've been counting them since I was nine.", note: "Controlled. Backstory through action." },
      { ch: 9,  text: "Ramirez was six feet of Michoacán and he didn't deserve a number. He deserved a name.", note: "Kinetic eulogy — Spanglish implied." },
      { ch: 13, text: "We pray in foxholes because God runs out of excuses in the open.", note: "Theological but grounded." },
      { ch: 23, text: "Tell those children to stop singing. No — wait. Don't tell them anything.", note: "Command reversed — rare moment of hesitation." },
      { ch: 35, text: "Six hundred twenty-eight days past their deadline. The machine was wrong.", note: "Mathematical register — unusual for Ramos." },
      { ch: 39, text: "I can smell my own leg. That's not something they teach you to process.", note: "Clinical detachment under extreme pain — potentially drifted." },
    ],
  },
  {
    id: "crawford",
    name: "Capt. James Crawford III",
    color: "red",
    icon: "📋",
    baseline: {
      register: "Clinical, institutional, removes affect from language",
      sentiment: "Bureaucratic certainty masking moral vertigo. Never admits stakes.",
      syntax: "Complex subordinate clauses. Passive voice as deflection. Euphemism as weapon.",
      forbidden: ["direct emotional admission", "Spanglish", "physical sensation descriptions", "present-tense vulnerability"],
      markers: ["institutional euphemism", "data as shield", "delegation without accountability"],
      sampleDialogue: `"The routing optimization reflects documented performance metrics, not editorial judgment."\n"Casualties within projected parameters are operationally acceptable."\n"I didn't design the system. I implement it."`,
    },
    dialogueSamples: [
      { ch: 3,  text: "The Diversity Project isn't discrimination — it's statistical optimization of resource deployment.", note: "Perfect register — euphemism as policy." },
      { ch: 4,  text: "Harmon wants the numbers by Thursday. Get me the numbers.", note: "Delegation without accountability — clean." },
      { ch: 8,  text: "Ramos is effective in high-attrition roles. That's documented.", note: "Clinical. No affect. Baseline." },
      { ch: 21, text: "I made them from lead. My father gave them to me and I — I don't know why I'm telling you this.", note: "⚠ DRIFT: Emotional vulnerability, first-person confession — off-register." },
      { ch: 29, text: "Those children are not a military variable. They never were.", note: "⚠ DRIFT: Direct moral statement — Crawford doesn't make these." },
      { ch: 35, text: "The algorithm was wrong. I know that. I have known that for some time.", note: "⚠ DRIFT: Direct admission. Possibly earned — check arc context." },
    ],
  },
  {
    id: "joshua",
    name: "Joshua Sagasta",
    color: "purple",
    icon: "🌵",
    baseline: {
      register: "Mystic, fragmented, Yaqui cadence intrudes on English",
      sentiment: "Vision without agenda. Grief without anger. Presence without explanation.",
      syntax: "Declarative revelation. No subordinate clauses. Noun-first. Present-tense always.",
      forbidden: ["argument or debate", "military vocabulary", "statistics or data", "past-tense regret"],
      markers: ["speaks in declarations not arguments", "Yaqui cadence (noun-first, minimal article)", "announces not responds"],
      sampleDialogue: `"The tunnel is not dark. The tunnel is the before-place."\n"You carry thirteen. I carry the river."\n"Flower world does not stop for the war."`,
    },
    dialogueSamples: [
      { ch: 2,  text: "This water knows your name before you do. That is the nature of baptism.", note: "Perfect — declarative, Yaqui cadence, mystical." },
      { ch: 5,  text: "The hospital does not heal the wound the tunnel made. Different wound.", note: "Fragmented. Noun-first. On-register." },
      { ch: 5,  text: "I think I'm getting better. The doctors say my vitals are improving.", note: "⚠ DRIFT: Medical vocabulary, hedged statement — no Yaqui cadence." },
    ],
  },
  {
    id: "duc",
    name: "Major Pham Duc",
    color: "cyan",
    icon: "🗺️",
    baseline: {
      register: "Formal, strategic, sees terrain as geometry",
      sentiment: "Poetic compression without sentimentality. Death as tactical fact.",
      syntax: "Longer periodic sentences. Strategic logic visible. Metaphor drawn from landscape.",
      forbidden: ["casual idiom", "American slang", "emotional confession", "short punchy sentences"],
      markers: ["terrain-as-metaphor", "historical reference", "poetic periodic sentence"],
      sampleDialogue: `"The Americans read the map. We are the map."\n"Dien Bien Phu was not a victory of arms. It was a victory of patience — a lesson they have not yet learned."\n"The jungle remembers every body. We do not forget what the jungle knows."`,
    },
    dialogueSamples: [
      { ch: 16, text: "They see the paddies as obstacles. We see them as the ground itself — ancient, patient, already won.", note: "Terrain metaphor. Periodic structure. Baseline." },
      { ch: 27, text: "Trong, mark the northern approach. The Americans will move at dawn — they always move at dawn.", note: "Strategic. Confident. Clean." },
      { ch: 27, text: "We've got about three clicks before they spot us. Let's move.", note: "⚠ DRIFT: American military slang ('clicks', 'Let's move') — Duc speaks formally." },
    ],
  },
  {
    id: "oneil",
    name: "PFC O'Neil",
    color: "blue",
    icon: "🏔️",
    baseline: {
      register: "Kentucky/Boston hybrid — drawl plus city toughness",
      sentiment: "Grief through food, loyalty, and gesture. Never articulates feeling directly.",
      syntax: "Contractions always. Southern idiom. Expresses care through action-nouns.",
      forbidden: ["emotional directness", "philosophical statements", "Spanglish", "neutral American English"],
      markers: ["'y'all', 'ain't', 'reckon'", "grief expressed through food or object", "Boston/Kentucky code-switch"],
      sampleDialogue: `"Y'all ain't never had cornbread like my mama makes. That's the problem with this whole damn war."\n"I ain't sayin' I love him. I'm sayin' I'd carry his ruck through hell."\n"Back in Southie we'd settle this with a Dunkin' and a fistfight. Simpler times."`,
    },
    dialogueSamples: [
      { ch: 9,  text: "Ramirez wasn't supposed to go like that. Nobody's supposed to go like that but especially not him.", note: "Grief without naming it. Southern syntax absent — MED flag." },
      { ch: 13, text: "I told my mama I'd bring back something from Vietnam. Didn't think it'd be this much quiet.", note: "Maternal anchor. Southern cadence implied." },
      { ch: 20, text: "I cannot adequately express the loss I feel when the cornbread does not arrive. It is deeply personal.", note: "⚠ DRIFT: Formal register, no dialect markers — completely off-voice." },
      { ch: 20, text: "Y'all don't understand. That cornbread is the only thing between me and losing my entire mind out here.", note: "On-register — dialect marker, hyperbole, food-as-grief." },
    ],
  },
];

const COLOR_CFG = {
  gold:   { text: "text-gold",   bg: "bg-gold/5",   border: "border-gold/30",   badge: "bg-gold/10 text-gold border-gold/30",   line: "#f59e0b" },
  red:    { text: "text-red",    bg: "bg-red/5",    border: "border-red/30",    badge: "bg-red/10 text-red border-red/30",       line: "#ef4444" },
  purple: { text: "text-purple", bg: "bg-purple/5", border: "border-purple/30", badge: "bg-purple/10 text-purple border-purple/30", line: "#a855f7" },
  cyan:   { text: "text-cyan",   bg: "bg-cyan/5",   border: "border-cyan/30",   badge: "bg-cyan/10 text-cyan border-cyan/30",    line: "#22d3ee" },
  blue:   { text: "text-blue",   bg: "bg-blue/5",   border: "border-blue/30",   badge: "bg-blue/10 text-blue border-blue/30",    line: "#60a5fa" },
};

const DRIFT_FLAGS = {
  "⚠ DRIFT": { color: "text-red",    bg: "bg-red/10",    border: "border-red/30" },
  "MED":      { color: "text-gold",   bg: "bg-gold/10",   border: "border-gold/30" },
  "CLEAN":    { color: "text-teal",   bg: "bg-teal/10",   border: "border-teal/30" },
};

// Detect drift keywords in the note
function getDriftLevel(note) {
  if (note.startsWith("⚠ DRIFT")) return "⚠ DRIFT";
  if (note.includes("MED flag") || note.includes("MED")) return "MED";
  return "CLEAN";
}

// ─── Paste-and-analyze panel ──────────────────────────────────────────────────
function LiveAnalyzer({ character }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const cfg = COLOR_CFG[character.color];

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    const prompt = `You are the LitCentral Editorial Intelligence Engine analyzing character voice consistency for "SGT George Ramos: The Mathematics of Vietnam."

CHARACTER: ${character.name}

ESTABLISHED BASELINE PROFILE:
- Register: ${character.baseline.register}
- Sentiment: ${character.baseline.sentiment}
- Syntax: ${character.baseline.syntax}
- Forbidden patterns: ${character.baseline.forbidden.join(", ")}
- Voice markers that MUST be present: ${character.baseline.markers.join(", ")}

SAMPLE CANONICAL DIALOGUE (known on-voice examples):
${character.baseline.sampleDialogue}

DIALOGUE BLOCK TO ANALYZE:
"""
${text}
"""

Perform a forensic voice audit. Structure your response EXACTLY as:

DRIFT VERDICT: [CLEAN / LOW DRIFT / MODERATE DRIFT / HIGH DRIFT / OFF-REGISTER]

SENTIMENT ANALYSIS:
[2-3 sentences on the emotional register — is it consistent with the baseline? What sentiment dominates?]

LINGUISTIC REGISTER:
[2-3 sentences on syntax, vocabulary, sentence structure — what's on-voice and what's off?]

DEVIATION FLAGS:
[Bullet list of specific phrases or patterns that deviate from baseline. Quote exact text.]

RESTORATION SUGGESTIONS:
[2-3 rewritten versions of the most drifted lines, in the character's correct voice. Format: ORIGINAL → RESTORED]

OVERALL SCORE: [X/10 voice consistency — 10 = perfect baseline match]`;

    const res = await base44.integrations.Core.InvokeLLM({ prompt, model: "claude_sonnet_4_6" });
    setResult(res);
    setLoading(false);
  };

  // Parse verdict from result
  const verdict = result ? result.match(/DRIFT VERDICT:\s*(.+)/)?.[1]?.trim() : null;
  const verdictColor = verdict?.includes("HIGH") || verdict?.includes("OFF") ? "red"
    : verdict?.includes("MODERATE") ? "orange"
    : verdict?.includes("LOW") ? "gold"
    : "teal";

  return (
    <div className="space-y-3">
      <div className={`text-[10px] text-muted-foreground font-sans p-3 rounded-lg border ${cfg.border} ${cfg.bg}`}>
        Paste any dialogue block from the manuscript. The engine compares it against <span className={`font-bold ${cfg.text}`}>{character.name}'s</span> baseline profile and flags deviations.
      </div>

      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder={`Paste ${character.name}'s dialogue here...\n\nExamples from baseline:\n${character.baseline.sampleDialogue}`}
        className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-xs font-sans text-foreground resize-none h-36 focus:outline-none focus:border-accent leading-relaxed" />

      <button onClick={analyze} disabled={loading || !text.trim()}
        className={`px-5 py-2 rounded-lg text-xs font-black font-mono disabled:opacity-40 transition-all text-background`}
        style={{ background: loading ? "#666" : COLOR_CFG[character.color].line }}>
        {loading ? "Analyzing voice..." : `▶ AUDIT ${character.name.split(" ").pop().toUpperCase()}'S VOICE`}
      </button>

      {loading && (
        <div className={`p-5 rounded-lg border ${cfg.border} ${cfg.bg} text-center`}>
          <div className={`text-xs font-bold font-mono ${cfg.text} mb-2`}>Running sentiment + register analysis...</div>
          <div className="flex justify-center gap-1">
            {[0,1,2].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full animate-pulse`} style={{ background: cfg.line, animationDelay: `${i * 0.15}s` }} />)}
          </div>
        </div>
      )}

      {result && !loading && (
        <div className={`rounded-lg border ${cfg.border} overflow-hidden`}>
          <div className={`px-4 py-2 border-b border-border ${cfg.bg} flex items-center justify-between`}>
            <span className={`text-[9px] font-bold font-mono ${cfg.text}`}>VOICE AUDIT RESULT</span>
            {verdict && (
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border font-mono text-${verdictColor} border-${verdictColor}/40 bg-${verdictColor}/10`}>
                {verdict}
              </span>
            )}
          </div>
          <div className="p-4 text-xs font-sans text-foreground/85 leading-relaxed whitespace-pre-wrap">{result}</div>
          <div className="px-4 py-2 border-t border-border">
            <button onClick={() => { setResult(null); setText(""); }} className="text-[9px] font-mono text-muted-foreground hover:text-foreground">Clear · New analysis</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dialogue sample card ─────────────────────────────────────────────────────
function DialogueCard({ sample, color }) {
  const cfg = COLOR_CFG[color];
  const drift = getDriftLevel(sample.note);
  const driftCfg = DRIFT_FLAGS[drift];
  return (
    <div className={`rounded-lg border p-3 ${drift === "CLEAN" ? "border-border bg-card" : `${driftCfg.border} ${driftCfg.bg}`}`}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[9px] font-bold font-mono text-muted-foreground">Ch.{sample.ch}</span>
        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border font-mono ${driftCfg.color} ${driftCfg.border} ${driftCfg.bg}`}>{drift}</span>
      </div>
      <p className="text-xs font-sans text-foreground italic leading-relaxed mb-2">"{sample.text}"</p>
      <p className="text-[9px] text-muted-foreground font-sans">{sample.note.replace("⚠ DRIFT: ", "")}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CharacterVoiceTab() {
  const [selectedChar, setSelectedChar] = useState("ramos");
  const [section, setSection] = useState("profile"); // profile | samples | analyze | compare

  const char = CHARACTERS.find(c => c.id === selectedChar);
  const cfg = COLOR_CFG[char.color];

  const driftCount = char.dialogueSamples.filter(s => getDriftLevel(s.note) === "⚠ DRIFT").length;
  const medCount   = char.dialogueSamples.filter(s => getDriftLevel(s.note) === "MED").length;
  const cleanCount = char.dialogueSamples.filter(s => getDriftLevel(s.note) === "CLEAN").length;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-purple/5 border border-purple/30 rounded-lg p-3 flex items-start gap-3">
        <div className="text-xl">🎭</div>
        <div>
          <div className="text-sm font-black font-mono text-purple">CHARACTER VOICE AUDIT — Linguistic Register Engine</div>
          <div className="text-[10px] text-muted-foreground font-sans">Baseline profiles · Dialogue sampling · Sentiment analysis · Drift detection · AI voice restoration</div>
        </div>
      </div>

      {/* Character selector */}
      <div className="flex flex-wrap gap-2">
        {CHARACTERS.map(c => {
          const ccfg = COLOR_CFG[c.color];
          const active = selectedChar === c.id;
          const drifts = c.dialogueSamples.filter(s => getDriftLevel(s.note) === "⚠ DRIFT").length;
          return (
            <button key={c.id} onClick={() => { setSelectedChar(c.id); setSection("profile"); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold font-mono transition-all ${active ? `${ccfg.bg} ${ccfg.border} ${ccfg.text}` : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"}`}>
              <span>{c.icon}</span>
              <span>{c.name.split(" ").slice(-1)[0]}</span>
              {drifts > 0 && <span className="text-[8px] bg-red/20 text-red border border-red/30 px-1 rounded font-mono">{drifts} drift</span>}
            </button>
          );
        })}
      </div>

      {/* Selected character header */}
      <div className={`p-4 rounded-lg border ${cfg.border} ${cfg.bg} flex items-center justify-between flex-wrap gap-3`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{char.icon}</span>
          <div>
            <div className={`text-sm font-black font-mono ${cfg.text}`}>{char.name}</div>
            <div className="text-[10px] text-muted-foreground font-sans">{char.baseline.register}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-lg font-black font-mono text-teal">{cleanCount}</div>
            <div className="text-[8px] text-muted-foreground font-mono">CLEAN</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black font-mono text-gold">{medCount}</div>
            <div className="text-[8px] text-muted-foreground font-mono">MED</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black font-mono text-red">{driftCount}</div>
            <div className="text-[8px] text-muted-foreground font-mono">DRIFT</div>
          </div>
        </div>
      </div>

      {/* Section nav */}
      <div className="flex gap-1.5 flex-wrap">
        {[
          { id: "profile",  label: "Baseline Profile" },
          { id: "samples",  label: `Dialogue Samples (${char.dialogueSamples.length})` },
          { id: "analyze",  label: "Live Analyzer" },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-mono border transition-all ${section === s.id ? `text-background border-transparent` : "border-border text-muted-foreground hover:text-foreground"}`}
            style={section === s.id ? { background: cfg.line } : {}}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE ── */}
      {section === "profile" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Register",          val: char.baseline.register,  color: char.color },
              { label: "Sentiment Profile", val: char.baseline.sentiment, color: "blue" },
              { label: "Syntax Signature",  val: char.baseline.syntax,    color: "purple" },
            ].map(item => (
              <div key={item.label} className="p-3 bg-card border border-border rounded-lg">
                <div className={`text-[8px] font-bold font-mono text-${item.color} uppercase tracking-wide mb-1`}>{item.label}</div>
                <div className="text-xs text-foreground/80 font-sans leading-relaxed">{item.val}</div>
              </div>
            ))}
            <div className="p-3 bg-card border border-red/20 rounded-lg">
              <div className="text-[8px] font-bold font-mono text-red uppercase tracking-wide mb-1">Forbidden Patterns</div>
              <div className="flex flex-wrap gap-1">
                {char.baseline.forbidden.map(f => (
                  <span key={f} className="text-[9px] px-1.5 py-0.5 rounded border border-red/30 bg-red/10 text-red font-sans">{f}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-card border border-border rounded-lg">
            <div className={`text-[8px] font-bold font-mono ${cfg.text} uppercase tracking-wide mb-2`}>Voice Markers (must be present)</div>
            <div className="space-y-1">
              {char.baseline.markers.map((m, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] font-sans text-foreground/70">
                  <span className={`${cfg.text} font-bold mt-px`}>✓</span>
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-card border border-border rounded-lg">
            <div className={`text-[8px] font-bold font-mono ${cfg.text} uppercase tracking-wide mb-2`}>Canonical Sample Dialogue</div>
            <div className="text-xs font-sans text-foreground/80 italic leading-relaxed whitespace-pre-line">{char.baseline.sampleDialogue}</div>
          </div>
        </div>
      )}

      {/* ── DIALOGUE SAMPLES ── */}
      {section === "samples" && (
        <div className="space-y-3">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            Pre-audited dialogue blocks from the manuscript. <span className="text-red font-bold">⚠ DRIFT</span> = confirmed register deviation · <span className="text-gold font-bold">MED</span> = partial drift · <span className="text-teal font-bold">CLEAN</span> = on-baseline.
          </div>

          {/* Drift summary bar */}
          <div className="flex h-2 rounded-full overflow-hidden gap-px">
            <div className="bg-teal/70 transition-all" style={{ width: `${(cleanCount / char.dialogueSamples.length) * 100}%` }} />
            <div className="bg-gold/70 transition-all" style={{ width: `${(medCount / char.dialogueSamples.length) * 100}%` }} />
            <div className="bg-red/70 transition-all" style={{ width: `${(driftCount / char.dialogueSamples.length) * 100}%` }} />
          </div>
          <div className="flex gap-4 text-[9px] font-mono">
            <span className="text-teal">{cleanCount} clean</span>
            <span className="text-gold">{medCount} medium</span>
            <span className="text-red">{driftCount} drifted</span>
          </div>

          <div className="space-y-2">
            {char.dialogueSamples.map((s, i) => (
              <DialogueCard key={i} sample={s} color={char.color} />
            ))}
          </div>
        </div>
      )}

      {/* ── LIVE ANALYZER ── */}
      {section === "analyze" && (
        <LiveAnalyzer character={char} />
      )}
    </div>
  );
}