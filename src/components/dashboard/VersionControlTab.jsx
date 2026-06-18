import { useState } from "react";
import { base44 } from "@/api/base44Client";

// ─── Version Registry (simulates Writer.com Files API history) ───────────────
const VERSION_REGISTRY = [
  {
    id: "v5",
    label: "v5 — CURRENT",
    tag: "CURRENT",
    date: "2026-04-26",
    words: 247357,
    chapters: 44,
    omega: 107.4,
    narrativeFlow: 91,
    retention: 84,
    issues: 29,
    voiceDrift: { ramos: 4, crawford: 18, joshua: 8, duc: 10, oneil: 11 },
    changelog: "Ch.39 WP wound sequence complete. Ch.41 Unidos final arc sealed. CL-MoE audit v5. ResearchDB expanded. CharacterOverride entity live.",
    file: "manuscript_full_44ch_v5.txt",
    color: "teal",
    isCurrent: true,
  },
  {
    id: "v4",
    label: "v4 — Apr 10",
    tag: "PREV",
    date: "2026-04-10",
    words: 241882,
    chapters: 43,
    omega: 106.1,
    narrativeFlow: 88,
    retention: 81,
    issues: 34,
    voiceDrift: { ramos: 4, crawford: 21, joshua: 8, duc: 10, oneil: 13 },
    changelog: "Ch.38 Sacred Smoke added. Ch.37 Last Dance revised. Emotion heatmap v4. Character Bible v3 deployed.",
    file: "manuscript_full_43ch_v4.txt",
    color: "blue",
    isCurrent: false,
  },
  {
    id: "v3",
    label: "v3 — Mar 22",
    tag: "PREV",
    date: "2026-03-22",
    words: 229104,
    chapters: 41,
    omega: 104.8,
    narrativeFlow: 84,
    retention: 77,
    issues: 41,
    voiceDrift: { ramos: 6, crawford: 24, joshua: 11, duc: 14, oneil: 15 },
    changelog: "Acts I–II locked. NERO framework integrated. NDR mapping complete. FOIA database added.",
    file: "manuscript_41ch_v3.txt",
    color: "purple",
    isCurrent: false,
  },
  {
    id: "v2",
    label: "v2 — Feb 14",
    tag: "MILESTONE",
    date: "2026-02-14",
    words: 198450,
    chapters: 36,
    omega: 102.3,
    narrativeFlow: 79,
    retention: 71,
    issues: 58,
    voiceDrift: { ramos: 9, crawford: 28, joshua: 15, duc: 19, oneil: 18 },
    changelog: "Act I complete. TruthEngine360 v1 deployed. Beta reader round 1. CHC briefing first draft.",
    file: "manuscript_36ch_v2.txt",
    color: "gold",
    isCurrent: false,
  },
  {
    id: "v1",
    label: "v1 — Dec 01",
    tag: "ORIGIN",
    date: "2025-12-01",
    words: 142300,
    chapters: 26,
    omega: 98.6,
    narrativeFlow: 71,
    retention: 62,
    issues: 87,
    voiceDrift: { ramos: 14, crawford: 32, joshua: 22, duc: 26, oneil: 23 },
    changelog: "Initial draft. Acts I–II partial. Character Bible v1. No forensic integration.",
    file: "manuscript_26ch_v1.txt",
    color: "orange",
    isCurrent: false,
  },
];

const CHAR_COLORS = { ramos: "gold", crawford: "red", joshua: "purple", duc: "cyan", oneil: "blue" };
const CHAR_NAMES  = { ramos: "Ramos", crawford: "Crawford", joshua: "Joshua", duc: "Duc", oneil: "O'Neil" };

const SYSTEM_MSG = `You are the LitCentral Editorial Intelligence Engine analyzing "SGT George Ramos: The Mathematics of Vietnam." You are performing a manuscript version differential analysis. Speak with the authority of a developmental editor. All responses cite specific chapter numbers, metric changes, and voice register evidence.`;

// ─── Metric delta helpers ─────────────────────────────────────────────────────
function Delta({ val, unit = "", invert = false }) {
  const pos = invert ? val < 0 : val > 0;
  const neg = invert ? val > 0 : val < 0;
  const color = pos ? "text-teal" : neg ? "text-red" : "text-muted-foreground";
  const sign  = val > 0 ? "+" : "";
  return <span className={`font-black font-mono ${color}`}>{sign}{val}{unit}</span>;
}

function MetricRow({ label, vA, vB, unit = "", invert = false, color = "foreground" }) {
  const delta = parseFloat((vB - vA).toFixed(1));
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-border/30">
      <span className="text-[9px] text-muted-foreground font-mono min-w-[140px]">{label}</span>
      <span className={`text-xs font-bold font-mono text-${color} min-w-[60px]`}>{vA}{unit}</span>
      <span className="text-muted-foreground text-[9px]">→</span>
      <span className={`text-xs font-bold font-mono text-${color} min-w-[60px]`}>{vB}{unit}</span>
      <Delta val={delta} unit={unit} invert={invert} />
    </div>
  );
}

// ─── Inline word diff renderer ─────────────────────────────────────────────────
function renderLineDiff(lines) {
  return lines.map((line, i) => {
    const type = line.startsWith("+") ? "add" : line.startsWith("-") ? "remove" : "unchanged";
    return (
      <div key={i} className={`px-2 py-0.5 text-[10px] font-mono rounded ${
        type === "add"     ? "bg-teal/10 text-teal" :
        type === "remove"  ? "bg-red/10 text-red line-through opacity-70" :
        "text-foreground/60"
      }`}>
        {line}
      </div>
    );
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VersionControlTab() {
  const currentV = VERSION_REGISTRY[0]; // always v5
  const [compareId, setCompareId] = useState("v4");
  const [vTextA, setVTextA] = useState("");
  const [vTextB, setVTextB] = useState("");
  const [diffResult, setDiffResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("overview"); // overview | diff | voice | ai

  const compareV = VERSION_REGISTRY.find(v => v.id === compareId) || VERSION_REGISTRY[1];

  // Run AI-powered diff analysis
  const runDiffAnalysis = async () => {
    setLoading(true);
    setAiAnalysis(null);

    const prompt = `${SYSTEM_MSG}

You are comparing two manuscript versions:
- VERSION A (older): ${compareV.label} — ${compareV.words.toLocaleString()} words, ${compareV.chapters} chapters, Omega avg ${compareV.omega}, Retention ${compareV.retention}%, ${compareV.issues} open issues.
  Changelog: ${compareV.changelog}
  Voice Drift Scores: Ramos=${compareV.voiceDrift.ramos}, Crawford=${compareV.voiceDrift.crawford}, Joshua=${compareV.voiceDrift.joshua}, Duc=${compareV.voiceDrift.duc}, O'Neil=${compareV.voiceDrift.oneil}

- VERSION B (newer): ${currentV.label} — ${currentV.words.toLocaleString()} words, ${currentV.chapters} chapters, Omega avg ${currentV.omega}, Retention ${currentV.retention}%, ${currentV.issues} open issues.
  Changelog: ${currentV.changelog}
  Voice Drift Scores: Ramos=${currentV.voiceDrift.ramos}, Crawford=${currentV.voiceDrift.crawford}, Joshua=${currentV.voiceDrift.joshua}, Duc=${currentV.voiceDrift.duc}, O'Neil=${currentV.voiceDrift.oneil}

${vTextA && vTextB ? `\nUSER-PROVIDED EXCERPT DIFF:\nVERSION A EXCERPT:\n${vTextA}\n\nVERSION B EXCERPT:\n${vTextB}\n` : ""}

Perform a structured manuscript differential analysis covering:

1. OMEGA SCORE DELTA: What drove the +${(currentV.omega - compareV.omega).toFixed(1)} Omega point gain? Which specific chapters or rewrites contributed most? What still needs work?

2. NARRATIVE FLOW DELTA: The narrative flow score improved from ${compareV.narrativeFlow} to ${currentV.narrativeFlow}. Identify which structural changes caused this — arc completions, pacing adjustments, dialogue/prose rebalancing.

3. CHARACTER VOICE DRIFT ANALYSIS: For each character, explain what changed between versions:
   - Ramos: ${compareV.voiceDrift.ramos} → ${currentV.voiceDrift.ramos} (${currentV.voiceDrift.ramos < compareV.voiceDrift.ramos ? "IMPROVED" : "DEGRADED"})
   - Crawford: ${compareV.voiceDrift.crawford} → ${currentV.voiceDrift.crawford}
   - Joshua: ${compareV.voiceDrift.joshua} → ${currentV.voiceDrift.joshua}
   - Duc: ${compareV.voiceDrift.duc} → ${currentV.voiceDrift.duc}
   - O'Neil: ${compareV.voiceDrift.oneil} → ${currentV.voiceDrift.oneil}

4. ISSUE REDUCTION: ${compareV.issues - currentV.issues} issues resolved between versions. Which critical flags were closed? What remains?

5. REGRESSION RISK: Did anything get worse? Flag any voice drift increases, retention drops, or new continuity risks introduced.

6. NEXT VERSION TARGETS: Based on this diff, what are the top 3 priorities for v6?

Be specific, cite chapter numbers, and use editorial authority.`;

    const res = await base44.integrations.Core.InvokeLLM({ prompt, model: "claude_sonnet_4_6" });
    setAiAnalysis(res);
    setLoading(false);
  };

  // Simple line-based diff for user text snippets
  const computeTextDiff = () => {
    if (!vTextA.trim() || !vTextB.trim()) return;
    const linesA = vTextA.split("\n");
    const linesB = vTextB.split("\n");
    const result = [];
    const maxLen = Math.max(linesA.length, linesB.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= linesA.length) result.push("+ " + linesB[i]);
      else if (i >= linesB.length) result.push("- " + linesA[i]);
      else if (linesA[i] === linesB[i]) result.push("  " + linesA[i]);
      else { result.push("- " + linesA[i]); result.push("+ " + linesB[i]); }
    }
    setDiffResult(result);
  };

  const wordDelta    = currentV.words - compareV.words;
  const chapterDelta = currentV.chapters - compareV.chapters;
  const omegaDelta   = (currentV.omega - compareV.omega).toFixed(1);
  const issueDelta   = currentV.issues - compareV.issues;

  const SECTIONS = [
    { id: "overview", label: "Metric Overview" },
    { id: "diff",     label: "Text Diff" },
    { id: "voice",    label: "Voice Drift" },
    { id: "ai",       label: "AI Diff Analysis" },
  ];

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-blue/5 border border-blue/30 rounded-lg p-3 flex items-start gap-3">
        <div className="text-xl">🔀</div>
        <div>
          <div className="text-sm font-black font-mono text-blue">VERSION CONTROL — Manuscript Differential Engine</div>
          <div className="text-[10px] text-muted-foreground font-sans">Side-by-side version comparison · Omega delta · Narrative flow · Character voice drift · AI forensic diff</div>
        </div>
      </div>

      {/* Version selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 p-3 bg-teal/5 border border-teal/30 rounded-lg">
          <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 rounded bg-teal/20 text-teal border border-teal/30">CURRENT</span>
          <span className="text-xs font-black font-mono text-teal">{currentV.label}</span>
          <span className="text-[9px] text-muted-foreground font-mono">{currentV.words.toLocaleString()}w · {currentV.chapters}ch · Ω{currentV.omega}</span>
        </div>

        <span className="text-muted-foreground font-mono text-lg">↔</span>

        <div className="flex items-center gap-2">
          <span className="text-[9px] text-muted-foreground font-mono">Compare with:</span>
          <select value={compareId} onChange={e => { setCompareId(e.target.value); setAiAnalysis(null); setDiffResult(null); }}
            className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-accent">
            {VERSION_REGISTRY.filter(v => !v.isCurrent).map(v => (
              <option key={v.id} value={v.id}>{v.label} · Ω{v.omega}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Snapshot delta bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Ω Score Delta",     val: `+${omegaDelta}`, color: "teal",   sub: `${compareV.omega} → ${currentV.omega}` },
          { label: "Words Added",       val: `+${wordDelta.toLocaleString()}`, color: "blue",   sub: `${compareV.words.toLocaleString()} → ${currentV.words.toLocaleString()}` },
          { label: "Chapters Added",    val: `+${chapterDelta}`, color: "purple", sub: `${compareV.chapters} → ${currentV.chapters}` },
          { label: "Issues Resolved",   val: `${issueDelta < 0 ? issueDelta : "-" + issueDelta}`, color: "gold",   sub: `${compareV.issues} → ${currentV.issues} open` },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-xl font-black font-mono text-${s.color}`}>{s.val}</div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
            <div className="text-[9px] text-foreground/50 font-mono">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Section nav */}
      <div className="flex gap-1.5 flex-wrap">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-mono border transition-all ${activeSection === s.id ? "bg-blue text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeSection === "overview" && (
        <div className="space-y-4">
          {/* Side-by-side version cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[compareV, currentV].map((v, idx) => (
              <div key={v.id} className={`bg-card border rounded-lg p-4 space-y-3 border-${v.color}/30`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-black font-mono text-${v.color}`}>{v.label}</div>
                    <div className="text-[9px] text-muted-foreground font-mono">{v.date} · {v.file}</div>
                  </div>
                  <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border text-${v.color} border-${v.color}/40 bg-${v.color}/10`}>{v.tag}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Omega Avg",     val: `${v.omega}`, color: "gold" },
                    { label: "Retention",     val: `${v.retention}%`, color: "teal" },
                    { label: "Narrative Flow",val: `${v.narrativeFlow}`, color: "blue" },
                    { label: "Open Issues",   val: `${v.issues}`, color: v.issues > 30 ? "red" : "orange" },
                  ].map(m => (
                    <div key={m.label} className="p-2 bg-background rounded border border-border text-center">
                      <div className={`text-base font-black font-mono text-${m.color}`}>{m.val}</div>
                      <div className="text-[8px] text-muted-foreground font-mono">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="p-2 bg-background rounded border border-border">
                  <div className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Changelog</div>
                  <div className="text-[10px] text-foreground/70 font-sans leading-relaxed">{v.changelog}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Metric comparison table */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase mb-3">METRIC-BY-METRIC COMPARISON · {compareV.label} → {currentV.label}</div>
            <div className="space-y-0">
              <MetricRow label="Omega Score (avg)"      vA={compareV.omega}         vB={currentV.omega}         />
              <MetricRow label="Narrative Flow Score"   vA={compareV.narrativeFlow} vB={currentV.narrativeFlow} />
              <MetricRow label="Reader Retention %"     vA={compareV.retention}     vB={currentV.retention}     unit="%" />
              <MetricRow label="Total Words"            vA={compareV.words}         vB={currentV.words}         />
              <MetricRow label="Chapters"               vA={compareV.chapters}      vB={currentV.chapters}      />
              <MetricRow label="Open Issues"            vA={compareV.issues}        vB={currentV.issues}        invert={true} color="red" />
            </div>
          </div>

          {/* Version timeline */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase mb-3">VERSION TIMELINE</div>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-3">
                {VERSION_REGISTRY.map((v, i) => (
                  <div key={v.id} className={`relative pl-8 cursor-pointer`} onClick={() => !v.isCurrent && setCompareId(v.id)}>
                    <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 bg-background border-${v.color} ${v.isCurrent ? "ring-2 ring-" + v.color + "/30" : ""}`} />
                    <div className={`p-2.5 rounded-lg border transition-all ${compareId === v.id && !v.isCurrent ? `border-${v.color}/50 bg-${v.color}/5` : v.isCurrent ? `border-${v.color}/30 bg-${v.color}/5` : "border-border bg-background hover:border-muted-foreground/30"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold font-mono text-${v.color}`}>{v.label}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">{v.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground">
                        <span>Ω <span className="text-gold font-bold">{v.omega}</span></span>
                        <span>{v.words.toLocaleString()}w</span>
                        <span>{v.chapters}ch</span>
                        <span className={v.issues > 40 ? "text-red" : "text-orange"}>{v.issues} issues</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TEXT DIFF ── */}
      {activeSection === "diff" && (
        <div className="space-y-4">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            Paste chapter excerpts from both versions for a line-by-line diff. <span className="text-teal font-bold">Green lines</span> = added in current. <span className="text-red font-bold">Red lines</span> = removed from previous.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className={`text-[9px] font-bold font-mono text-${compareV.color} mb-1.5 flex items-center gap-2`}>
                <span className={`px-1.5 py-0.5 rounded border border-${compareV.color}/40 bg-${compareV.color}/10`}>{compareV.label}</span> — PREVIOUS
              </div>
              <textarea value={vTextA} onChange={e => setVTextA(e.target.value)}
                placeholder={`Paste excerpt from ${compareV.label}...\n\nExample:\nRamos pressed his back against the firebase wall.\nThe coordinates came through at 0300.\nHe did not look at the list.`}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground resize-none h-52 focus:outline-none focus:border-accent leading-relaxed" />
            </div>
            <div>
              <div className="text-[9px] font-bold font-mono text-teal mb-1.5 flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded border border-teal/40 bg-teal/10">{currentV.label}</span> — CURRENT
              </div>
              <textarea value={vTextB} onChange={e => setVTextB(e.target.value)}
                placeholder={`Paste excerpt from ${currentV.label}...\n\nExample:\nRamos pressed his back against the firebase wall, smelling diesel and rot.\nThe coordinates came through at 0300 — 47 coordinates, 47 names.\nHe did not look at the list. He already knew their faces.`}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground resize-none h-52 focus:outline-none focus:border-accent leading-relaxed" />
            </div>
          </div>
          <button onClick={computeTextDiff} disabled={!vTextA.trim() || !vTextB.trim()}
            className="px-5 py-2 bg-blue text-white rounded-lg text-xs font-bold font-mono disabled:opacity-40 hover:bg-blue/80 transition-all">
            ▶ COMPUTE DIFF
          </button>

          {diffResult && (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b border-border bg-secondary flex items-center justify-between">
                <div className="text-[9px] font-bold font-mono text-muted-foreground">DIFF OUTPUT</div>
                <div className="flex items-center gap-3 text-[9px] font-mono">
                  <span className="text-teal">+{diffResult.filter(l => l.startsWith("+")).length} added</span>
                  <span className="text-red">-{diffResult.filter(l => l.startsWith("-")).length} removed</span>
                  <span className="text-muted-foreground">{diffResult.filter(l => l.startsWith(" ")).length} unchanged</span>
                </div>
              </div>
              <div className="p-3 space-y-0.5 max-h-80 overflow-y-auto font-mono">
                {renderLineDiff(diffResult)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── VOICE DRIFT ── */}
      {activeSection === "voice" && (
        <div className="space-y-4">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            Voice Drift Score measures deviation from each character's established register. Lower = more stable. Score 0–5 = stable · 6–12 = monitor · 13–20 = intervention needed.
          </div>

          {/* Character drift comparison */}
          <div className="space-y-3">
            {Object.keys(CHAR_NAMES).map(charId => {
              const oldScore = compareV.voiceDrift[charId];
              const newScore = currentV.voiceDrift[charId];
              const delta = newScore - oldScore;
              const improved = delta < 0;
              const color = CHAR_COLORS[charId];
              const maxScore = 35;

              return (
                <div key={charId} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-${color}`} />
                      <span className={`text-xs font-black font-mono text-${color}`}>{CHAR_NAMES[charId]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-muted-foreground">{compareV.label}: <span className="text-foreground font-bold">{oldScore}</span></span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-[9px] font-mono text-muted-foreground">{currentV.label}: <span className="text-foreground font-bold">{newScore}</span></span>
                      <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${improved ? "text-teal border-teal/30 bg-teal/10" : delta === 0 ? "text-muted-foreground border-border" : "text-red border-red/30 bg-red/10"}`}>
                        {improved ? "↓" : delta === 0 ? "=" : "↑"} {Math.abs(delta)} pts {improved ? "IMPROVED" : delta === 0 ? "STABLE" : "DEGRADED"}
                      </span>
                    </div>
                  </div>

                  {/* Dual bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] text-muted-foreground font-mono min-w-[60px]">{compareV.tag}</span>
                      <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                        <div className={`h-full bg-${color} opacity-40 rounded-full`} style={{ width: `${(oldScore / maxScore) * 100}%` }} />
                      </div>
                      <span className={`text-[9px] font-bold font-mono text-${color} min-w-[20px] text-right`}>{oldScore}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] text-muted-foreground font-mono min-w-[60px]">CURRENT</span>
                      <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                        <div className={`h-full bg-${color} rounded-full`} style={{ width: `${(newScore / maxScore) * 100}%` }} />
                      </div>
                      <span className={`text-[9px] font-bold font-mono text-${color} min-w-[20px] text-right`}>{newScore}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drift summary table */}
          <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
            <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase mb-3">VOICE DRIFT ACROSS ALL VERSIONS</div>
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-1.5 px-2 font-mono text-muted-foreground">Version</th>
                  {Object.keys(CHAR_NAMES).map(c => (
                    <th key={c} className={`text-center py-1.5 px-2 font-mono text-${CHAR_COLORS[c]}`}>{CHAR_NAMES[c]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VERSION_REGISTRY.slice().reverse().map(v => (
                  <tr key={v.id} className={`border-b border-border/30 ${v.isCurrent ? "bg-teal/5" : ""}`}>
                    <td className={`py-1.5 px-2 font-bold font-mono text-${v.color}`}>{v.label}</td>
                    {Object.keys(CHAR_NAMES).map(c => (
                      <td key={c} className="py-1.5 px-2 text-center">
                        <span className={`font-black font-mono ${v.voiceDrift[c] <= 5 ? "text-teal" : v.voiceDrift[c] <= 12 ? "text-gold" : "text-red"}`}>
                          {v.voiceDrift[c]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── AI DIFF ANALYSIS ── */}
      {activeSection === "ai" && (
        <div className="space-y-4">
          <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
            AI forensic analysis of the version differential — Omega drivers, narrative flow changes, voice drift explanations, issue resolution, and regression risks. Uses <span className="text-gold font-bold">Claude Sonnet</span> for deeper analysis.
          </div>

          <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
            <div className="flex-1">
              <div className="text-xs font-bold text-foreground mb-0.5">Comparing: <span className="text-blue">{compareV.label}</span> → <span className="text-teal">{currentV.label}</span></div>
              <div className="text-[9px] text-muted-foreground font-mono">Ω{compareV.omega} → Ω{currentV.omega} · {compareV.issues}→{currentV.issues} issues · {compareV.words.toLocaleString()}→{currentV.words.toLocaleString()} words</div>
            </div>
            <button onClick={runDiffAnalysis} disabled={loading}
              className="px-5 py-2 bg-blue text-white rounded-lg text-xs font-bold font-mono disabled:opacity-40 hover:bg-blue/80 transition-all">
              {loading ? "Analyzing..." : "▶ RUN AI DIFF ANALYSIS"}
            </button>
          </div>

          {loading && (
            <div className="bg-blue/5 border border-blue/20 rounded-lg p-6 text-center">
              <div className="text-blue font-mono text-sm font-bold mb-1">Running forensic diff analysis...</div>
              <div className="text-[10px] text-muted-foreground">Comparing Omega drivers · Voice drift delta · Issue resolution · Regression risks</div>
              <div className="mt-3 flex justify-center gap-1">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-blue rounded-full animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}

          {aiAnalysis && !loading && (
            <div className="bg-card border border-blue/20 rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b border-border bg-blue/5 flex items-center gap-2">
                <span className="text-[9px] font-bold font-mono text-blue">AI DIFF REPORT</span>
                <span className="text-[8px] text-muted-foreground font-mono">{compareV.label} → {currentV.label} · Claude Sonnet</span>
              </div>
              <div className="p-4 text-xs font-sans text-foreground/80 leading-relaxed whitespace-pre-wrap">{aiAnalysis}</div>
              <div className="px-4 py-2 border-t border-border">
                <button onClick={() => { setAiAnalysis(null); }} className="text-[9px] font-mono text-muted-foreground hover:text-foreground">Clear · Run new analysis</button>
              </div>
            </div>
          )}

          {!aiAnalysis && !loading && (
            <div className="text-center py-12 text-muted-foreground text-xs font-mono">
              Select a comparison version and run the AI Diff Analysis to get a forensic editorial report.
            </div>
          )}
        </div>
      )}
    </div>
  );
}