import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CHAPTERS } from "../../lib/data";

const SYSTEM_MSG = `You are the LitCentral Editorial Intelligence Engine analyzing "SGT George Ramos: The Mathematics of Vietnam" — 44 chapters, 247,357 words. You speak with the authority of a developmental editor who has read every page. You know the manuscript's voice: kinetic, sensory-first, Spanglish code-switching, tactical realism, grounded magical realism, and testimonial force.`;

const TONE_OPTIONS = [
  { id: "tension",    label: "⚡ Tension Rise",   desc: "Ratchet stakes — the next chapter hits harder" },
  { id: "grief",      label: "🩸 Grief Landing",   desc: "Let the loss from the prior chapter settle in the body" },
  { id: "spiritual",  label: "🌵 Spiritual Shift", desc: "Yaqui cadence intrudes — ancestors move through the gap" },
  { id: "tactical",   label: "🎯 Tactical Reset",  desc: "Mission logic — geography, time, squad discipline" },
  { id: "breath",     label: "💨 Breath Space",    desc: "Earned respite — let the reader exhale before the next blow" },
  { id: "code-switch",label: "🌐 Code-Switch",     desc: "Spanglish bridge — cultural identity crosses the seam" },
];

const EMOTION_TAGS = ["grief", "rage", "love", "fear", "hope", "spiritual"];

function ChapterSelect({ label, value, onChange, exclude }) {
  const options = CHAPTERS.filter(c => !c.isMissing && c.ch !== exclude);
  return (
    <div>
      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
      <select value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-accent">
        {options.map(c => (
          <option key={c.ch} value={c.ch}>Ch.{c.ch} — {c.title}</option>
        ))}
      </select>
    </div>
  );
}

function BridgeParagraph({ index, text, tone, loading }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const accentColors = ["gold", "teal", "blue"];
  const color = accentColors[index] || "muted-foreground";

  return (
    <div className={`rounded-lg border border-${color}/25 bg-${color}/5 overflow-hidden`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b border-${color}/20 bg-${color}/10`}>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-black font-mono text-${color} px-1.5 py-0.5 rounded border border-${color}/40`}>
            BRIDGE {index + 1}
          </span>
          {tone && <span className="text-[9px] text-muted-foreground font-sans">{tone}</span>}
        </div>
        {text && (
          <button onClick={copy}
            className={`text-[9px] font-bold font-mono transition-all ${copied ? "text-teal" : "text-muted-foreground hover:text-foreground"}`}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        )}
      </div>
      <div className="p-4">
        {loading ? (
          <div className="flex gap-1 items-center py-2">
            {[0,1,2].map(i => (
              <div key={i} className={`w-1.5 h-1.5 bg-${color} rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
            <span className="text-[10px] text-muted-foreground font-mono ml-2">Generating bridge prose...</span>
          </div>
        ) : (
          <p className="text-xs font-sans text-foreground/85 leading-relaxed whitespace-pre-wrap italic">{text}</p>
        )}
      </div>
    </div>
  );
}

export default function BridgeBuilderTab() {
  const [chA, setChA] = useState(7);
  const [chB, setChB] = useState(8);
  const [tone, setTone] = useState("tension");
  const [excerptA, setExcerptA] = useState("");
  const [excerptB, setExcerptB] = useState("");
  const [bridges, setBridges] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const chDataA = CHAPTERS.find(c => c.ch === chA) || {};
  const chDataB = CHAPTERS.find(c => c.ch === chB) || {};
  const selectedTone = TONE_OPTIONS.find(t => t.id === tone);

  const generate = async () => {
    setLoading(true);
    setBridges([]);
    setAnalysis(null);

    const prompt = `${SYSTEM_MSG}

You are the Bridge Builder — a specialized prose engineer for transitional passages between manuscript chapters.

CHAPTER A (ending): Ch.${chA} — "${chDataA.title}"
Act: ${chDataA.act} | Omega: ${chDataA.omega} | Words: ${chDataA.words?.toLocaleString()} | Emotion fingerprint: ${chDataA.fp || "N/A"}
${excerptA ? `Closing excerpt from Ch.${chA}:\n"${excerptA}"` : `Known closing beat: ${chDataA.fix || "Standard chapter close."}`}

CHAPTER B (opening): Ch.${chB} — "${chDataB.title}"
Act: ${chDataB.act} | Omega: ${chDataB.omega} | Words: ${chDataB.words?.toLocaleString()}
${excerptB ? `Opening excerpt from Ch.${chB}:\n"${excerptB}"` : `Known opening beat: ${chDataB.fix || "Standard chapter open."}`}

REQUESTED BRIDGE TONE: ${selectedTone?.label} — ${selectedTone?.desc}

Your task: Generate exactly 3 distinct transitional prose paragraphs (BRIDGE 1, BRIDGE 2, BRIDGE 3) that could be placed at the seam between Ch.${chA} and Ch.${chB}.

Rules:
- Each bridge should be 80–140 words — compact, purposeful, no filler
- Voice must match the manuscript: sensory-first, kinetic, rooted in body and place
- Code-switching (Spanglish) is permitted and encouraged where emotionally appropriate
- Each bridge must serve the requested tone: ${selectedTone?.label}
- Bridge 1: focuses on PHYSICAL grounding — body, smell, sound, texture
- Bridge 2: focuses on EMOTIONAL continuity — carries the dominant emotion across the seam
- Bridge 3: focuses on NARRATIVE momentum — plant a seed or tension hook that pulls the reader into Ch.${chB}
- Do NOT summarize the chapters — these are live prose paragraphs, not analysis
- Write as if you are the author, in the manuscript's voice

After the 3 bridges, add a section called EDITORIAL NOTES with:
- Why the seam between these chapters is pacing-critical
- What emotional risk exists without a bridge
- Which of the 3 bridges you recommend and why

Format your response EXACTLY as:
BRIDGE 1
[prose paragraph]

BRIDGE 2
[prose paragraph]

BRIDGE 3
[prose paragraph]

EDITORIAL NOTES
[analysis]`;

    const res = await base44.integrations.Core.InvokeLLM({ prompt, model: "claude_sonnet_4_6" });

    // Parse the response
    const parts = res.split(/\n(?=BRIDGE [123]|EDITORIAL NOTES)/);
    const parsed = { bridges: [], notes: "" };
    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed.startsWith("BRIDGE 1")) parsed.bridges[0] = trimmed.replace(/^BRIDGE 1\n?/, "").trim();
      else if (trimmed.startsWith("BRIDGE 2")) parsed.bridges[1] = trimmed.replace(/^BRIDGE 2\n?/, "").trim();
      else if (trimmed.startsWith("BRIDGE 3")) parsed.bridges[2] = trimmed.replace(/^BRIDGE 3\n?/, "").trim();
      else if (trimmed.startsWith("EDITORIAL NOTES")) parsed.notes = trimmed.replace(/^EDITORIAL NOTES\n?/, "").trim();
    });

    // Fallback: if parsing failed, split differently
    if (parsed.bridges.filter(Boolean).length < 3) {
      const fallback = res;
      setBridges([{ text: fallback, tone: "Full response" }]);
      setAnalysis(null);
    } else {
      setBridges(parsed.bridges.map((text, i) => ({ text, tone: ["Physical Grounding", "Emotional Continuity", "Narrative Momentum"][i] })));
      setAnalysis(parsed.notes);
    }

    setLoading(false);
  };

  const emotionDiff = EMOTION_TAGS.map(tag => {
    // approximate - just use chapter index as proxy for emotion data lookup
    return { tag };
  });

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-gold/5 border border-gold/30 rounded-lg p-3 flex items-start gap-3">
        <div className="text-xl">🌉</div>
        <div>
          <div className="text-sm font-black font-mono text-gold">BRIDGE BUILDER — Transitional Prose Engine</div>
          <div className="text-[10px] text-muted-foreground font-sans">Select two adjacent chapters · Choose bridge tone · Generate 3 precision prose paragraphs to seal the seam</div>
        </div>
      </div>

      {/* Chapter selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <ChapterSelect label="Chapter A — Closing Chapter" value={chA} onChange={v => { setChA(v); setBridges([]); setAnalysis(null); }} exclude={chB} />
          {chDataA.title && (
            <div className="p-2.5 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[8px] font-bold font-mono text-gold bg-gold/10 border border-gold/30 px-1.5 py-0.5 rounded">Ch.{chA}</span>
                <span className="text-[9px] font-bold text-foreground">{chDataA.title}</span>
                <span className="text-[8px] text-muted-foreground font-mono">Ω{chDataA.omega}</span>
              </div>
              <div className="text-[9px] text-muted-foreground font-sans">{chDataA.words?.toLocaleString()}w · Act {chDataA.act} · FP: {chDataA.fp}</div>
            </div>
          )}
          <div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Closing Excerpt (optional)</div>
            <textarea value={excerptA} onChange={e => setExcerptA(e.target.value)}
              placeholder={`Paste the final lines of Ch.${chA} for more precise bridge generation...`}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground resize-none h-24 focus:outline-none focus:border-gold/50" />
          </div>
        </div>

        <div className="space-y-3">
          <ChapterSelect label="Chapter B — Opening Chapter" value={chB} onChange={v => { setChB(v); setBridges([]); setAnalysis(null); }} exclude={chA} />
          {chDataB.title && (
            <div className="p-2.5 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[8px] font-bold font-mono text-teal bg-teal/10 border border-teal/30 px-1.5 py-0.5 rounded">Ch.{chB}</span>
                <span className="text-[9px] font-bold text-foreground">{chDataB.title}</span>
                <span className="text-[8px] text-muted-foreground font-mono">Ω{chDataB.omega}</span>
              </div>
              <div className="text-[9px] text-muted-foreground font-sans">{chDataB.words?.toLocaleString()}w · Act {chDataB.act} · FP: {chDataB.fp}</div>
            </div>
          )}
          <div>
            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Opening Excerpt (optional)</div>
            <textarea value={excerptB} onChange={e => setExcerptB(e.target.value)}
              placeholder={`Paste the opening lines of Ch.${chB} for more precise bridge generation...`}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground resize-none h-24 focus:outline-none focus:border-teal/50" />
          </div>
        </div>
      </div>

      {/* Tone selector */}
      <div>
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Bridge Tone</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {TONE_OPTIONS.map(t => (
            <button key={t.id} onClick={() => setTone(t.id)}
              className={`p-2.5 rounded-lg border text-left transition-all ${tone === t.id ? "border-gold/50 bg-gold/10" : "border-border bg-card hover:border-muted-foreground/40"}`}>
              <div className={`text-[10px] font-bold font-mono mb-0.5 ${tone === t.id ? "text-gold" : "text-foreground"}`}>{t.label}</div>
              <div className="text-[9px] text-muted-foreground font-sans leading-snug">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button onClick={generate} disabled={loading || chA === chB}
        className="w-full py-2.5 bg-gold text-background rounded-lg text-sm font-black font-mono disabled:opacity-40 hover:bg-gold/80 transition-all">
        {loading ? "Generating Bridge Prose..." : `🌉 GENERATE 3 BRIDGES · Ch.${chA} → Ch.${chB}`}
      </button>

      {/* Bridge outputs */}
      {(loading || bridges.length > 0) && (
        <div className="space-y-3">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
            Generated Bridges — Ch.{chA} "{chDataA.title}" → Ch.{chB} "{chDataB.title}"
          </div>
          {[0, 1, 2].map(i => (
            <BridgeParagraph
              key={i}
              index={i}
              text={bridges[i]?.text || ""}
              tone={bridges[i]?.tone || ""}
              loading={loading && !bridges[i]}
            />
          ))}
        </div>
      )}

      {/* Editorial notes */}
      {analysis && (
        <div className="bg-card border border-purple/20 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-purple/5 flex items-center gap-2">
            <span className="text-[9px] font-bold font-mono text-purple">EDITORIAL NOTES</span>
            <span className="text-[8px] text-muted-foreground font-mono">Pacing analysis · Emotional risk · Recommendation</span>
          </div>
          <div className="p-4 text-xs font-sans text-foreground/80 leading-relaxed whitespace-pre-wrap">{analysis}</div>
        </div>
      )}
    </div>
  );
}