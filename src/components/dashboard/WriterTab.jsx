import { useState } from "react";
import { base44 } from "@/api/base44Client";
import VersionControlTab from "./VersionControlTab";
import BridgeBuilderTab from "./BridgeBuilderTab";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILLS = [
  { icon: "👤", name: "Character KB Retrieval",        status: "deployed", version: "v2.1", desc: "Retrieves character profile, voice register, trauma anchors, relationship graph, and behavioral integrity score for any named character. Uses Knowledge Graph RAG against character_bible_v3.json.", tags: ["KG RAG", "Character", "Continuity"], input: "character_name", output: "full profile JSON" },
  { icon: "🌵", name: "Chicano Genre Rule",             status: "deployed", version: "v1.4", desc: "Validates a chapter excerpt against the Chicano Genre policy bundle: grounded magical realism, code-switching as emotional/sacred marker, tactical/historical realism, testimonial force, communal/ancestral presence.", tags: ["Genre", "Validation", "Code-Switch"], input: "chapter_text", output: "compliance score + flags" },
  { icon: "🧠", name: "Sensory Rewrite (NIP)",          status: "deployed", version: "v3.0", desc: "Scores and rewrites a chapter excerpt to hit NIP targets: sensory density 20+/1k, synesthetic fusion, physical grounding, emotional load, neural cycling. Returns original + rewritten + delta metrics.", tags: ["NIP", "Sensory", "Rewrite"], input: "chapter_text", output: "rewrite + sensory score" },
  { icon: "📊", name: "NIP Audit",                      status: "staging",  version: "v1.1", desc: "Full neuro-immersion protocol audit across all 44 chapters in batch mode. Outputs per-chapter sensory density heatmap, reader fatigue diagnosis, and priority rewrite queue.", tags: ["Batch", "Audit", "Heatmap"], input: "all_chapters", output: "audit JSON + heatmap" },
  { icon: "📈", name: "SPSS Forecast",                  status: "deployed", version: "v2.3", desc: "Logistic-regression reader retention engine. Computes drop-off probability, engagement trajectory, front-page conversion likelihood, and witness activation score per chapter.", tags: ["Forecast", "Retention", "SPSS"], input: "chapter_metrics", output: "retention forecast" },
  { icon: "⚖️", name: "Forensic Witness Builder",       status: "deployed", version: "v1.7", desc: "TruthEngine360-style public witness pages weaving excerpt, proof, and call to action. Generates HTML landing page with front-page Omega-107 optimizer and conversion tracking.", tags: ["Witness", "Landing Page", "Conversion"], input: "excerpt + proof", output: "HTML witness page" },
  { icon: "🔍", name: "Manuscript Differential",        status: "deployed", version: "v1.0", desc: "Compares two versions of a chapter and outputs a structured diff: added/removed/changed passages, Omega delta, voice drift score, and continuity impact assessment.", tags: ["Diff", "Version Control", "Continuity"], input: "v1_text, v2_text", output: "diff report" },
  { icon: "🗺️", name: "Case-Vault Evidence Synth",      status: "staging",  version: "v0.9", desc: "Synthesizes evidence from the Case Vault Evidence Graph to support narrative claims. Cross-references historical records, military reports, and testimonial documents.", tags: ["Evidence", "Synthesis", "KG RAG"], input: "claim_text", output: "evidence citations" },
  { icon: "🏆", name: "Front-Page Ω-107 Optimizer",     status: "deployed", version: "v2.0", desc: "Optimizes chapter openings and closings for front-page Omega-107 performance. Targets active voice ≥80%, agency score ≥4.5, behavioral plausibility ≥0.85.", tags: ["Omega", "Optimization", "Front-Page"], input: "chapter_opening", output: "optimized text + score" },
];

const AGENTS = [
  { icon: "🔬", name: "Diagnostics Agent",   statusLabel: "LIVE",    session: "Session Active", desc: "Identifies and triages all narrative, continuity, and structural issues. Maintains a live issue ledger with severity ranking, chapter citations, and resolution status tracking.", stats: [{ label: "Issues Open", val: "29" }, { label: "CRIT", val: "2" }, { label: "Sessions", val: "147" }], actionLabel: "DIAGNOSE", color: "red" },
  { icon: "🏛️", name: "Authenticity Agent",  statusLabel: "LIVE",    session: "Session Active", desc: "Validates historical accuracy, Chicano cultural authenticity, military tactical realism, and sensory/cultural specificity. Cross-references Case Vault Evidence Graph.", stats: [{ label: "Anachronisms", val: "5" }, { label: "Validated", val: "39" }, { label: "Sessions", val: "89" }], actionLabel: "VALIDATE", color: "gold" },
  { icon: "📈", name: "Predictive Agent",     statusLabel: "LIVE",    session: "Session Active", desc: "Runs SPSS logistic-regression forecasts for reader retention, drop-off probability, engagement trajectory, and front-page conversion likelihood. Updates after each revision.", stats: [{ label: "Avg Retention", val: "84%" }, { label: "Drop-Off Risk", val: "Ch.17" }, { label: "Sessions", val: "203" }], actionLabel: "FORECAST", color: "blue" },
  { icon: "🗺️", name: "Mapping Agent",        statusLabel: "STANDBY", session: "Ready",          desc: "Maps character relationships, narrative arcs, motif threads (blood, prayer, mathematics, fire, copper, smoke, rosary, ghosts, equations), and thematic coherence across all 44 chapters.", stats: [{ label: "Characters", val: "15" }, { label: "Motifs", val: "9" }, { label: "Sessions", val: "56" }], actionLabel: "MAP", color: "purple" },
  { icon: "⚖️", name: "Witness Architect",    statusLabel: "LIVE",    session: "Session Active", desc: "Builds TruthEngine360-style forensic witness pages. Weaves excerpt, proof, and call-to-action into publishable HTML. Tracks witness conversion rate and front-page Omega performance.", stats: [{ label: "Pages Built", val: "12" }, { label: "Conversion", val: "6.2%" }, { label: "Sessions", val: "78" }], actionLabel: "BUILD", color: "teal" },
];

const FILES = [
  { icon: "📘", name: "manuscript_full_44ch.txt",     detail: "247,357 words · Manuscript Canon Graph", status: "completed",    graph: "Manuscript Canon" },
  { icon: "👤", name: "character_bible_v3.json",      detail: "15 characters · Character KB Graph",     status: "completed",    graph: "Character KB" },
  { icon: "⚖️", name: "case_vault_evidence.pdf",       detail: "Case Vault Graph",                       status: "in_progress",  graph: "Case Vault" },
  { icon: "📋", name: "revision_report_v2.md",         detail: "29 flagged issues · Manuscript Canon",   status: "completed",    graph: "Manuscript Canon" },
  { icon: "🌵", name: "chicano_genre_rules.txt",       detail: "Chicano Genre Graph",                    status: "completed",    graph: "Chicano Genre" },
];

const BATCHES = [
  { icon: "📊", name: "Omega Full Audit — 44 chapters",            status: "completed", skill: "NIP Audit v1.1",          progress: "44/44",  duration: "4m 32s",     tokens: "1.2M" },
  { icon: "👤", name: "Character Continuity Scan — Ch.1–44",       status: "running",   skill: "Character KB Retrieval v2.1", progress: "31/44", duration: "ETA: 1m 18s", tokens: "847K" },
  { icon: "📈", name: "SPSS Retention Forecast — Act III",         status: "queued",    skill: "SPSS Forecast v2.3",      progress: "0/13",   duration: "queued",     tokens: "est. 320K" },
];

const QUICK_ACTIONS = [
  { label: "🔴 Fix CRIT Issues", prompt: "List all CRITICAL issues in the manuscript with exact chapter citations and specific fix instructions." },
  { label: "🎯 Rewrite Ch.6 Sensory", prompt: "Rewrite the opening 300 words of Chapter 6 (Crucible Theorem) to hit NIP sensory density targets of 20+/1k. Add San Diego Naval Base: salt air, chain-link rust, concrete smell." },
  { label: "👤 Sagasta Arc", prompt: "Joshua Sagasta disappears for 35 chapters after Ch.5. Draft a single Act II scene (Ch.18–20 range) that pays off the Ch.2 tunnel baptism and maintains his Yaqui mystic voice register." },
  { label: "📊 Ch.34 Omega Audit", prompt: "Run a full Omega audit on Chapter 34 (The Birthday Brief). Flag the 62% dialogue ratio, identify where prose bridges are needed, and suggest 2 specific sensory paragraphs." },
  { label: "🏛 Anachronism Check", prompt: "List all confirmed anachronisms in the manuscript with chapter citations, the anachronistic element, the correct period-accurate replacement, and supporting historical evidence." },
];

const ACT_RETENTION = [
  { act: "Act I",   chapters: "Ch.1–16",  omega: "108.7", retention: "91%", dropOff: "Ch.6 (sensory gap)",  conv: "7.1%", status: "strong"  },
  { act: "Act II",  chapters: "Ch.17–31", omega: "106.2", retention: "79%", dropOff: "Ch.17 (sensory drop)", conv: "5.8%", status: "review"  },
  { act: "Act III", chapters: "Ch.32–44", omega: "107.1", retention: "88%", dropOff: "Ch.34 (dialogue risk)", conv: "6.9%", status: "strong"  },
];

const SYSTEM_MSG = `You are the LitCentral Editorial Intelligence Engine, operating on the manuscript "SGT George Ramos: The Mathematics of Vietnam" — 44 chapters, 247,357 words. Your knowledge base includes: Character KB (George Ramos, Joshua Sagasta, CPL Ramirez, Major Pham Duc, and 12 supporting characters), the Chicano Genre Rule bundle (grounded magical realism, code-switching protocol, tactical realism), the NIP Sensory Protocol (density targets: 20+/1k), and the complete manuscript canon. You speak with the authority of a developmental editor who has read every page. All responses cite chapter and line evidence.`;

const STATUS_STYLE = {
  completed:   { color: "teal", label: "completed" },
  in_progress: { color: "gold", label: "in_progress" },
  running:     { color: "blue", label: "running" },
  queued:      { color: "muted-foreground", label: "queued" },
};

const NAV_ITEMS = [
  { id: "chat",       label: "Default Chat",    icon: "💬", group: "CONSOLE" },
  { id: "workbench",  label: "Workbench",       icon: "🔧", group: "CONSOLE" },
  { id: "files",      label: "Files",            icon: "📁", group: "CONSOLE" },
  { id: "skills",     label: "Skills",           icon: "⚡", group: "CONSOLE" },
  { id: "batches",    label: "Batches",          icon: "⚙️", group: "CONSOLE" },
  { id: "agents",     label: "Managed Agents",  icon: "🤖", group: "CONSOLE" },
  { id: "analytics",  label: "Analytics",        icon: "📊", group: "CONSOLE" },
  { id: "versions",   label: "Version Control",  icon: "🔀", group: "CONSOLE" },
  { id: "bridge",     label: "Bridge Builder",   icon: "🌉", group: "CONSOLE" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }) {
  const c = status === "LIVE" ? "bg-teal" : status === "STANDBY" ? "bg-gold" : "bg-muted-foreground";
  return <span className={`inline-block w-2 h-2 rounded-full ${c} mr-1.5`} />;
}

function Tag({ label }) {
  return <span className="text-[8px] px-1.5 py-0.5 bg-secondary border border-border rounded font-mono text-muted-foreground">{label}</span>;
}

// ─── Console Chat ─────────────────────────────────────────────────────────────
function ConsoleChat() {
  const [messages, setMessages] = useState([
    { role: "system",    content: "SYSTEM · Writer.com Palmyra X5" },
    { role: "assistant", content: "Console initialized. I have full context on all 44 chapters. The manuscript's average Omega score is 107.4 — Omega Elite tier across the board. I'm tracking 29 flagged issues: 11 continuity, 5 anachronisms, 5 word overuse, 3 character gaps, and 5 structural flags. Two critical items require immediate attention: the Ramirez/Rodriguez name error in Ch.9, and the missing 2,604-word bathroom prayer scene in Ch.40. What would you like to work on first?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("palmyra-x5");

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput("");
    setMessages(m => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    const fullPrompt = `${SYSTEM_MSG}\n\nConversation so far:\n${messages.filter(m => m.role !== "system").map(m => `${m.role === "user" ? "User" : "LitCentral Editor"}: ${m.content}`).join("\n")}\nUser: ${userMsg}\nLitCentral Editor:`;
    const res = await base44.integrations.Core.InvokeLLM({ prompt: fullPrompt });
    setMessages(m => [...m, { role: "assistant", content: res }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Context tags */}
      <div className="flex gap-2 flex-wrap mb-3">
        {["Character KB", "Chicano Rules", "Sensory Protocol", "Manuscript Canon"].map(t => (
          <span key={t} className="text-[10px] px-2.5 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />{t}
          </span>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-0 max-h-[420px]">
        {messages.map((m, i) => (
          <div key={i} className={`rounded-lg p-3 text-xs font-sans leading-relaxed ${
            m.role === "system" ? "bg-secondary border border-border text-muted-foreground" :
            m.role === "user"   ? "bg-accent/10 border border-accent/20 ml-8" :
            "bg-card border border-border"
          }`}>
            {m.role === "system" && <div className="text-[9px] font-bold font-mono text-muted-foreground mb-1">⚙ {m.content}</div>}
            {m.role === "assistant" && <div className="text-[9px] font-bold font-mono text-gold mb-1">Ω LITCENTRAL EDITOR · {model}</div>}
            {m.role === "user"      && <div className="text-[9px] font-bold font-mono text-accent mb-1">YOU</div>}
            <div className="whitespace-pre-wrap text-foreground/80">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-[9px] font-bold font-mono text-gold mb-1">Ω LITCENTRAL EDITOR · {model}</div>
            <div className="flex gap-1 items-center">
              {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-2">
        <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">QUICK ACTIONS</div>
        <div className="flex gap-1.5 flex-wrap">
          {QUICK_ACTIONS.map((a, i) => (
            <button key={i} onClick={() => send(a.prompt)}
              className="text-[9px] px-2 py-1 rounded border border-border bg-background hover:border-accent/40 hover:text-foreground text-muted-foreground font-mono transition-all">
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask about any chapter, character, continuity issue, or request a rewrite..."
          className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
        />
        <select value={model} onChange={e => setModel(e.target.value)}
          className="bg-secondary border border-border rounded-lg px-2 py-2 text-[10px] font-mono text-muted-foreground focus:outline-none">
          <option value="palmyra-x5">palmyra-x5</option>
          <option value="palmyra-x4">palmyra-x4</option>
        </select>
        <button onClick={() => send()} disabled={loading || !input.trim()}
          className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold font-mono disabled:opacity-40 hover:bg-accent/80">
          SEND
        </button>
      </div>
    </div>
  );
}

// ─── Workbench ────────────────────────────────────────────────────────────────
function Workbench() {
  const [promptA, setPromptA] = useState("");
  const [promptB, setPromptB] = useState("");
  const [outputA, setOutputA] = useState("");
  const [outputB, setOutputB] = useState("");
  const [running, setRunning] = useState(false);
  const [skillA, setSkillA] = useState("Character KB");
  const [skillB, setSkillB] = useState("Chicano Genre");

  const run = async () => {
    if (!promptA.trim() || !promptB.trim()) return;
    setRunning(true);
    const [resA, resB] = await Promise.all([
      base44.integrations.Core.InvokeLLM({ prompt: `${SYSTEM_MSG}\n\nSkill: ${skillA}\n\n${promptA}` }),
      base44.integrations.Core.InvokeLLM({ prompt: `${SYSTEM_MSG}\n\nSkill: ${skillB}\n\n${promptB}` }),
    ]);
    setOutputA(resA); setOutputB(resB);
    setRunning(false);
  };

  const SKILL_OPTIONS = ["Character KB", "Chicano Genre", "NIP Protocol", "Manuscript Canon"];

  const Variant = ({ label, prompt, setPrompt, skill, setSkill, output }) => (
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-[9px] font-bold font-mono text-muted-foreground">{label}</div>
        <select value={skill} onChange={e => setSkill(e.target.value)}
          className="bg-secondary border border-border rounded px-2 py-1 text-[9px] font-mono text-muted-foreground focus:outline-none">
          {SKILL_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
        placeholder={`${label} prompt...`}
        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground resize-none h-24 focus:outline-none focus:border-accent" />
      {output && (
        <div className="bg-card border border-border rounded-lg p-3 text-xs font-sans text-foreground/80 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">{output}</div>
      )}
      {!output && <div className="h-16 bg-card border border-border/30 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground font-mono">{label} output will appear here...</div>}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
        Experiment with prompts, compare models, and measure deltas in Ω score, RF, code-switch density, agency, and sensory density. Side-by-side diff view for chapter rewrites.
      </div>
      <div className="flex gap-4 flex-col md:flex-row">
        <Variant label="VARIANT A" prompt={promptA} setPrompt={setPromptA} skill={skillA} setSkill={setSkillA} output={outputA} />
        <Variant label="VARIANT B" prompt={promptB} setPrompt={setPromptB} skill={skillB} setSkill={setSkillB} output={outputB} />
      </div>
      <button onClick={run} disabled={running || !promptA.trim() || !promptB.trim()}
        className="w-full py-2 bg-accent text-white rounded-lg text-xs font-bold font-mono disabled:opacity-40 hover:bg-accent/80">
        {running ? "Running comparison..." : "▶ RUN COMPARISON · POST /v1/chat"}
      </button>
      {(outputA || outputB) && (
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="text-[9px] font-bold font-mono text-muted-foreground mb-2">DIFF OUTPUT — Delta Metrics</div>
          <div className="grid grid-cols-4 gap-3 text-center">
            {["ΔΩ", "ΔRF", "ΔSensory", "ΔCode-Switch"].map(m => (
              <div key={m} className="p-2 bg-background rounded border border-border">
                <div className="text-sm font-black font-mono text-gold">—</div>
                <div className="text-[9px] text-muted-foreground font-mono">{m}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Files ────────────────────────────────────────────────────────────────────
function FilesSection() {
  return (
    <div className="space-y-4">
      <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
        Ingest manuscript chapters, case ledgers, evidence packets, and landing-page copy via the Writer.com Files API. Files are parsed into structured objects linked to domain stores and Knowledge Graphs.
      </div>
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <div className="text-2xl mb-2">📄</div>
        <div className="text-xs font-mono text-muted-foreground mb-1">DROP MANUSCRIPT FILES HERE</div>
        <div className="text-[9px] text-muted-foreground mb-3">Supports: .txt .doc .docx .pdf .html .csv</div>
        <button className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold font-mono">SELECT FILES</button>
      </div>
      <div>
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-2">FILE LIBRARY · Writer.com Files API</div>
        <div className="space-y-2">
          {FILES.map((f, i) => {
            const cfg = STATUS_STYLE[f.status] || STATUS_STYLE.completed;
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                <span className="text-lg">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-foreground">{f.name}</div>
                  <div className="text-[9px] text-muted-foreground font-sans">{f.detail}</div>
                </div>
                <span className={`text-[9px] font-bold font-mono text-${cfg.color}`}>{cfg.label}</span>
                <button className="text-[9px] font-bold font-mono text-accent hover:underline">↗ query</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function SkillsSection() {
  const [invoking, setInvoking] = useState(null);
  const [results, setResults] = useState({});
  const [inputs, setInputs] = useState({});

  const invoke = async (skill) => {
    const userInput = inputs[skill.name] || `Test ${skill.input}`;
    setInvoking(skill.name);
    const prompt = `${SYSTEM_MSG}\n\nSkill: ${skill.name}\nInput: ${userInput}\nProvide the output as described: ${skill.output}`;
    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setResults(r => ({ ...r, [skill.name]: res }));
    setInvoking(null);
  };

  return (
    <div className="space-y-3">
      <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
        Reusable, versioned rule bundles deployed as Writer.com no-code agents. Each skill is a Blueprint with defined inputs, processing logic, and structured output.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SKILLS.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <div className="text-xs font-bold text-foreground">{s.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${s.status === "deployed" ? "text-teal border-teal/30 bg-teal/10" : "text-gold border-gold/30 bg-gold/10"}`}>{s.status}</span>
                    <span className="text-[8px] text-muted-foreground font-mono">{s.version}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground font-sans leading-relaxed">{s.desc}</div>
            <div className="flex flex-wrap gap-1">{s.tags.map(t => <Tag key={t} label={t} />)}</div>
            <div className="text-[9px] text-muted-foreground font-mono">Input: <span className="text-foreground/60">{s.input}</span> → Output: <span className="text-foreground/60">{s.output}</span></div>
            <input value={inputs[s.name] || ""} onChange={e => setInputs(inp => ({ ...inp, [s.name]: e.target.value }))}
              placeholder={`Enter ${s.input}...`}
              className="w-full bg-background border border-border rounded px-2 py-1 text-[10px] font-sans text-foreground focus:outline-none focus:border-accent" />
            <button onClick={() => invoke(s)} disabled={invoking === s.name}
              className={`w-full py-1.5 rounded text-[10px] font-bold font-mono border transition-all ${s.status === "staging" ? "border-gold/40 text-gold hover:bg-gold/10" : "border-accent/40 text-accent hover:bg-accent/10"} disabled:opacity-40`}>
              {invoking === s.name ? "Invoking..." : s.status === "staging" ? `▶ INVOKE (STAGING)` : "▶ INVOKE"}
            </button>
            {results[s.name] && (
              <div className="bg-background border border-border rounded p-2 text-[9px] font-sans text-foreground/70 max-h-32 overflow-y-auto whitespace-pre-wrap">{results[s.name]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Batches ──────────────────────────────────────────────────────────────────
function BatchesSection() {
  const [skill, setSkill] = useState("NIP Audit v1.1");
  const [range, setRange] = useState("All 44 Chapters");
  const [priority, setPriority] = useState("Normal");

  return (
    <div className="space-y-4">
      <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
        Industrialize chapter processing — run Omega audits across all 44 chapters, score landing-page variants, compute retention predictions, re-evaluate characters after canon update.
      </div>
      <div>
        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center justify-between">
          ACTIVE BATCH JOBS
          <button className="text-accent font-mono">+ NEW BATCH</button>
        </div>
        <div className="space-y-2">
          {BATCHES.map((b, i) => {
            const cfg = STATUS_STYLE[b.status] || { color: "muted-foreground", label: b.status };
            return (
              <div key={i} className="p-3 bg-card border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-base">{b.icon}</span>
                  <span className="text-xs font-bold text-foreground flex-1">{b.name}</span>
                  <span className={`text-[9px] font-bold font-mono text-${cfg.color}`}>{cfg.label}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9px] text-muted-foreground font-mono">
                  <span>Skill: {b.skill}</span>
                  <span>Chapters: {b.progress}</span>
                  <span>Duration: {b.duration}</span>
                  <span>Tokens: {b.tokens}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase">CREATE BATCH JOB · POST /v1/applications/{"{id}"}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "SKILL / AGENT", val: skill, set: setSkill, opts: ["NIP Audit v1.1", "Omega Full Audit", "Character KB Retrieval", "SPSS Forecast", "Chicano Genre Rule"] },
            { label: "CHAPTER RANGE", val: range, set: setRange, opts: ["All 44 Chapters", "Act I (Ch.1–16)", "Act II (Ch.17–31)", "Act III (Ch.32–44)", "Custom Range"] },
            { label: "PRIORITY",      val: priority, set: setPriority, opts: ["Normal", "High", "Critical"] },
          ].map(({ label, val, set, opts }) => (
            <div key={label}>
              <div className="text-[8px] font-bold text-muted-foreground uppercase mb-1">{label}</div>
              <select value={val} onChange={e => set(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-[10px] font-mono text-foreground focus:outline-none">
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button className="w-full py-2 bg-accent text-white rounded-lg text-xs font-bold font-mono hover:bg-accent/80">⚙ QUEUE BATCH JOB</button>
      </div>
    </div>
  );
}

// ─── Managed Agents ───────────────────────────────────────────────────────────
function AgentsSection() {
  const [running, setRunning] = useState(null);
  const [agentResults, setAgentResults] = useState({});

  const invoke = async (agent) => {
    setRunning(agent.name);
    const prompt = `${SYSTEM_MSG}\n\nYou are the ${agent.name}. ${agent.desc}\n\nProvide a current status report with specific findings from the manuscript.`;
    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setAgentResults(r => ({ ...r, [agent.name]: res }));
    setRunning(null);
  };

  return (
    <div className="space-y-3">
      <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg p-3">
        Five specialized editorial agents deployed on Writer.com, each with persistent sessions, sandboxed execution environments, vault-authenticated tool access, and memory stores for canon carryover.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {AGENTS.map((a, i) => (
          <div key={i} className={`bg-card border rounded-lg p-4 space-y-3 border-${a.color}/20`}>
            <div className="flex items-start gap-3">
              <span className="text-xl">{a.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-black text-foreground">{a.name}</span>
                  <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border text-${a.color} border-${a.color}/30 bg-${a.color}/10 flex items-center gap-1`}>
                    <StatusDot status={a.statusLabel} />{a.statusLabel} · {a.session}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground font-sans leading-relaxed">{a.desc}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {a.stats.map(s => (
                <div key={s.label} className="text-center p-2 bg-background rounded border border-border">
                  <div className={`text-sm font-black font-mono text-${a.color}`}>{s.val}</div>
                  <div className="text-[8px] text-muted-foreground font-mono">{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => invoke(a)} disabled={running === a.name}
              className={`w-full py-1.5 rounded text-[10px] font-bold font-mono border transition-all border-${a.color}/40 text-${a.color} hover:bg-${a.color}/10 disabled:opacity-40`}>
              {running === a.name ? "Running..." : `▶ ${a.actionLabel}`}
            </button>
            {agentResults[a.name] && (
              <div className="bg-background border border-border rounded p-2 text-[9px] font-sans text-foreground/70 max-h-36 overflow-y-auto whitespace-pre-wrap">{agentResults[a.name]}</div>
            )}
          </div>
        ))}
      </div>
      {/* Architecture */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase mb-3">5-LAYER ARCHITECTURE</div>
        <div className="space-y-1.5">
          {[
            { l: "L1", label: "Console UI", detail: "LitCentral × Writer", color: "blue" },
            { l: "L2", label: "Writer.com Execution Layer", detail: "Palmyra X5 · API", color: "purple" },
            { l: "L3", label: "LitCentral Intelligence", detail: "9 Skills · 5 Agents", color: "gold" },
            { l: "L4", label: "Knowledge / Memory", detail: "KG RAG · Vector", color: "teal" },
            { l: "L5", label: "Analytics / Governance", detail: "Omega · SPSS · Cost", color: "orange" },
          ].map(row => (
            <div key={row.l} className="flex items-center gap-3 p-2 bg-background rounded border border-border">
              <span className={`text-[9px] font-black font-mono text-${row.color} min-w-[20px]`}>{row.l}</span>
              <span className="text-[10px] font-bold text-foreground flex-1">{row.label}</span>
              <span className="text-[9px] text-muted-foreground font-mono">{row.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function Analytics() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "AVG OMEGA SCORE",      value: "107.4", sub: "↑ +2.3 this sprint",  color: "gold"   },
          { label: "TOTAL WORDS",           value: "247,357", sub: "44 chapters",       color: "blue"   },
          { label: "ISSUES OPEN",           value: "29",    sub: "2 CRIT · 5 HIGH",     color: "red"    },
          { label: "RETENTION FORECAST",    value: "84%",   sub: "↑ +3% post-rewrite",  color: "teal"   },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 text-center">
            <div className={`text-3xl font-black font-mono text-${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
            <div className={`text-[9px] font-bold text-${s.color} mt-0.5`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Issues by type */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase mb-3">ISSUES BY TYPE (29 TOTAL)</div>
        <div className="space-y-2">
          {[
            { type: "Continuity",        count: 11, total: 29, color: "red"    },
            { type: "Word Overuse",      count: 5,  total: 29, color: "gold"   },
            { type: "Anachronisms",      count: 5,  total: 29, color: "orange" },
            { type: "Character Gaps",    count: 3,  total: 29, color: "purple" },
            { type: "Structural Flags",  count: 5,  total: 29, color: "blue"   },
          ].map(row => (
            <div key={row.type} className="flex items-center gap-3">
              <span className="text-[10px] text-foreground/80 min-w-[120px]">{row.type}</span>
              <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                <div className={`h-full bg-${row.color} rounded-full`} style={{ width: `${(row.count / row.total) * 100}%` }} />
              </div>
              <span className={`text-[10px] font-bold font-mono text-${row.color} min-w-[20px] text-right`}>{row.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Retention table */}
      <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
        <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase mb-3">READER RETENTION FORECAST BY ACT</div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Act", "Chapters", "Avg Ω", "Retention", "Drop-Off Risk", "Witness Conv.", "Status"].map(h => (
                <th key={h} className="text-left py-2 px-2 text-[9px] font-bold text-muted-foreground uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACT_RETENTION.map((row, i) => (
              <tr key={i} className="border-b border-border/30 hover:bg-secondary/30">
                <td className="py-2 px-2 font-bold text-foreground">{row.act}</td>
                <td className="py-2 px-2 text-muted-foreground font-mono">{row.chapters}</td>
                <td className="py-2 px-2 font-black font-mono text-gold">{row.omega}</td>
                <td className="py-2 px-2 font-black font-mono text-teal">{row.retention}</td>
                <td className="py-2 px-2 text-orange text-[10px]">{row.dropOff}</td>
                <td className="py-2 px-2 font-mono text-blue">{row.conv}</td>
                <td className="py-2 px-2">
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${row.status === "strong" ? "text-teal bg-teal/10" : "text-gold bg-gold/10"}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WriterTab() {
  const [activeNav, setActiveNav] = useState("chat");

  const renderContent = () => {
    switch (activeNav) {
      case "chat":       return <ConsoleChat />;
      case "workbench":  return <Workbench />;
      case "files":      return <FilesSection />;
      case "skills":     return <SkillsSection />;
      case "batches":    return <BatchesSection />;
      case "agents":     return <AgentsSection />;
      case "analytics":  return <Analytics />;
      case "versions":   return <VersionControlTab />;
      case "bridge":     return <BridgeBuilderTab />;
      default:           return <ConsoleChat />;
    }
  };

  return (
    <div className="animate-slide-up">
      {/* Top Header bar */}
      <div className="flex items-center justify-between mb-4 bg-card border border-border rounded-lg px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gold rounded flex items-center justify-center text-background text-[10px] font-black">Ω</div>
          <span className="text-sm font-black font-mono text-foreground">LITCENTRAL</span>
          <span className="text-muted-foreground text-xs font-mono">× Writer.com</span>
          <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-teal/20 text-teal border border-teal/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-teal rounded-full animate-pulse" />PALMYRA X5 · LIVE
          </span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground">
          <span>Ω AVG <span className="text-gold font-black">107.4</span></span>
          <span>CHAPTERS <span className="text-foreground font-black">44</span></span>
          <span>WORDS <span className="text-foreground font-black">247,357</span></span>
          <span className="px-2 py-1 bg-secondary border border-border rounded font-bold text-foreground">API KEY ████████</span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="w-44 flex-shrink-0 space-y-4">
          {/* Console nav */}
          <div>
            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">CONSOLE</div>
            <div className="space-y-0.5">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-sans transition-all text-left ${activeNav === item.id ? "bg-secondary text-foreground font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Intelligence links */}
          <div>
            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">INTELLIGENCE</div>
            <div className="space-y-0.5">
              {[
                { id: "charKB",  icon: "👤", label: "Character KB" },
                { id: "chicano", icon: "🌵", label: "Chicano Genre" },
                { id: "nip",     icon: "🧠", label: "NIP Audit" },
                { id: "spss",    icon: "📈", label: "SPSS Forecast" },
                { id: "witness", icon: "⚖️", label: "Witness Builder" },
              ].map(item => (
                <button key={item.id} onClick={() => setActiveNav("skills")}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all text-left">
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Writer.com API info */}
          <div className="p-2.5 bg-card border border-border rounded-lg">
            <div className="text-[8px] font-bold font-mono text-muted-foreground uppercase mb-2">WRITER.COM API</div>
            <div className="space-y-1 text-[9px] font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="text-gold">palmyra-x5</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Context</span><span className="text-foreground">1M tokens</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">KG RAG</span><span className="text-teal">Active</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Agents</span><span className="text-foreground">5 / 5</span></div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Section title */}
          <div className="mb-4 pb-2 border-b border-border">
            <div className="text-base font-black text-foreground capitalize">{NAV_ITEMS.find(n => n.id === activeNav)?.label || "Default Chat"}</div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}