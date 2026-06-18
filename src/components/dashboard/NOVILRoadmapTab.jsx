import { useState } from "react";

const PHASES = [
  {
    phase: "I", label: "FOUNDATION", timeline: "0–3 Months", color: "#F5C842", status: "MVP",
    goal: "Build the Narrative Operating System core.",
    items: [
      "Elite distraction-free writing editor (Monaco)",
      "Chapter cards + drag-and-drop scene organization",
      "AI side panel + focus mode",
      "Research vault with vector search",
      "Manuscript AI chat",
      "Dark military aesthetic UI",
      "Electron desktop wrapper",
    ],
    stack: ["Next.js", "React", "Tailwind", "Node.js", "PostgreSQL", "Redis", "OpenAI"],
  },
  {
    phase: "II", label: "INTELLIGENCE", timeline: "4–8 Months", color: "#4A9EFF", status: "CORE",
    goal: "Build the narrative intelligence and memory layer.",
    items: [
      "Canon Guard — contradiction detection across all chapters",
      "Voice Lock — dialogue drift detector per character",
      "POV Patrol — head-hopping + perspective violations",
      "Arc Watch — emotional/character arc consistency",
      "Agency Monitor — passive protagonist warnings",
      "Literary scoring (Omega, RF, NIPS)",
      "Narrative graph engine (Neo4j)",
      "Emotional mapping + symbolism detection",
      "Canon comparison engine (Hemingway, O'Brien, Anaya)",
    ],
    stack: ["Neo4j", "Python", "Claude AI", "Qdrant", "LlamaIndex", "LangChain"],
  },
  {
    phase: "III", label: "CINEMATIC", timeline: "8–14 Months", color: "#1CCFB4", status: "ELITE",
    goal: "Add visual intelligence and collaborative war room.",
    items: [
      "Storyboard AI + mood board generation",
      "Visual scene generation",
      "Sound design + soundscape engine",
      "Screenplay conversion",
      "Live writers room (real-time collaboration)",
      "Voice + audio intelligence (cadence analysis)",
      "Story DNA Map visualizations",
      "Figma / Blender export",
    ],
    stack: ["Stable Diffusion", "WebRTC", "Framer Motion", "Blender API", "ElevenLabs"],
  },
  {
    phase: "IV", label: "ENTERPRISE", timeline: "14–24 Months", color: "#A855F7", status: "SCALE",
    goal: "Universities, publishers, studios, historical institutes.",
    items: [
      "University licensing (MFA programs, history depts)",
      "Publisher submission pipeline (EPUB, packets, scoring reports)",
      "Studio transmedia integration",
      "Documentary research teams",
      "Legacy Mode — manuscript evolution + draft genealogy",
      "FOIA + National Archives deep integration",
      "Enterprise SSO + compliance",
    ],
    stack: ["Kubernetes", "AWS/GCP", "SAML SSO", "SPSS API", "Jupyter", "Enterprise Neo4j"],
  },
];

const AGENTS = [
  { name: "Story Architect",        purpose: "Plot structure, act breaks, narrative velocity",  color: "#F5C842" },
  { name: "Literary Critic",        purpose: "Canon comparison, prose quality, literary force",   color: "#4A9EFF" },
  { name: "Behavioral Analyst",     purpose: "Character realism, PTSD patterns, motivation drift",color: "#FF8C42" },
  { name: "Dialogue Coach",         purpose: "Speech authenticity, voice drift, code-switching",  color: "#1CCFB4" },
  { name: "Symbolism Engine",       purpose: "Theme detection, motif recurrence, imagery clusters",color: "#A855F7" },
  { name: "Historical Researcher",  purpose: "Fact verification, archive search, anachronism flags",color: "#FF5C5C" },
  { name: "Pacing Analyst",         purpose: "Momentum tracking, tension curves, drag zones",     color: "#F5C842" },
  { name: "Emotional Mapper",       purpose: "Grief/rage/love arcs, emotional topography",        color: "#FF8C42" },
  { name: "Military Advisor",       purpose: "Tactical realism, unit accuracy, weapons/dates",    color: "#4A9EFF" },
  { name: "Cultural Analyst",       purpose: "Chicano/Indigenous authenticity, consultation flags",color: "#1CCFB4" },
  { name: "Beta Reader",            purpose: "Audience simulation, abandonment risk, retention",  color: "#A855F7" },
  { name: "Canon Guard",            purpose: "Cross-chapter continuity, contradiction detection",  color: "#FF5C5C" },
];

const AI_STACK = [
  { model: "Claude AI",         strength: "Long-form reasoning, literary analysis, 200K context", role: "Primary Literary Engine", color: "#FF8C42" },
  { model: "OpenAI GPT",        strength: "Structured workflows, tool orchestration, JSON",        role: "Orchestration + Workflow",color: "#4A9EFF" },
  { model: "Google Gemini",     strength: "Multimodal, live search, long documents",              role: "Research + Vision",       color: "#1CCFB4" },
  { model: "Ollama / Mistral",  strength: "Local inference, privacy, offline mode",               role: "Secure Local Mode",       color: "#A855F7" },
  { model: "Perplexity",        strength: "Live research, citation, fact verification",            role: "Research Engine",         color: "#F5C842" },
  { model: "LangChain",         strength: "Agent orchestration, routing, tool chains",             role: "Agent Backbone",          color: "#FF5C5C" },
  { model: "LlamaIndex",        strength: "Document intelligence, RAG, manuscript memory",        role: "Knowledge Retrieval",     color: "#4A9EFF" },
];

const ENGINES = [
  {
    name: "Canon Guard",
    icon: "⚠",
    color: "#FF5C5C",
    description: "Remembers every character fact, timeline event, object, location, and relationship across all chapters. Flags contradictions even from 80 chapters ago.",
    features: ["Timeline contradiction detection", "Dead character resurrection flags", "Object continuity tracking", "Location impossibility alerts"],
  },
  {
    name: "Voice Lock",
    icon: "🎙",
    color: "#F5C842",
    description: "Builds a speech fingerprint for every character: vocabulary, rhythm, code-switching triggers, emotional register, command style.",
    features: ["Dialogue drift detection", "Vocabulary consistency", "Code-switching pressure", "Military/cultural register drift"],
  },
  {
    name: "POV Patrol",
    icon: "👁",
    color: "#4A9EFF",
    description: "Governs point-of-view integrity. Catches head-hopping, omniscient intrusions, tense violations, and camera perspective shifts.",
    features: ["Head-hopping detection", "Inner thought violations", "Tense inconsistency", "Narrator distance drift"],
  },
  {
    name: "Arc Watch",
    icon: "📈",
    color: "#1CCFB4",
    description: "Tracks character emotional development, trauma progression, moral choices, and turning points. Flags unexplained regressions.",
    features: ["Emotional development tracking", "Trauma progression mapping", "Unexplained regression alerts", "Unresolved wound detection"],
  },
  {
    name: "Agency Monitor",
    icon: "⚡",
    color: "#A855F7",
    description: "Detects when characters become passive — plot happens TO them instead of BECAUSE of them. Tracks decision density and causal agency.",
    features: ["Passive protagonist warnings", "Decision density scoring", "Plot agency tracking", "Consecutive passive scene alerts"],
  },
  {
    name: "NIPS Engine",
    icon: "🧠",
    color: "#FF8C42",
    description: "Narrative Intelligence Processing System. Measures emotional transmission, sensory density, psychological realism, and narrative velocity.",
    features: ["NIPS-V: Vector analysis", "NIPS-E: Emotional scoring", "NIPS-S: Symbolism", "NIPS-B: Behavioral realism"],
  },
];

const TIERS = [
  { name: "Free",              price: "$0",         color: "#6B8BAA", features: ["Limited AI (100 queries/mo)", "1 manuscript", "Basic editor", "Chapter organization"] },
  { name: "Pro Writer",        price: "$25/mo",     color: "#F5C842", features: ["Unlimited AI", "10 manuscripts", "Canon Guard", "Voice Lock", "Research vault", "POV Patrol"] },
  { name: "Research Elite",    price: "$99/mo",     color: "#4A9EFF", features: ["All Pro features", "Archive integrations", "FOIA pipeline", "Literary scoring", "Full agent suite", "Neo4j graph"] },
  { name: "Studio",            price: "$299/mo",    color: "#1CCFB4", features: ["All Elite features", "Live writers room", "Cinematic AI", "Screenplay export", "Publisher packets", "Priority models"] },
  { name: "Enterprise",        price: "$5K–50K/yr", color: "#A855F7", features: ["University licensing", "Custom models", "SSO", "SPSS integration", "On-prem option", "Dedicated support"] },
];

const STACK_LAYERS = [
  { layer: "Frontend",  items: ["Next.js", "React", "Tailwind", "Electron", "Monaco Editor", "Framer Motion"] },
  { layer: "Backend",   items: ["FastAPI", "Node.js", "PostgreSQL", "Redis", "Neo4j", "Elasticsearch"] },
  { layer: "AI",        items: ["Claude", "OpenAI", "Gemini", "Ollama", "Mistral", "LangChain", "LlamaIndex"] },
  { layer: "Vector",    items: ["Qdrant", "Pinecone", "Weaviate", "Chroma"] },
  { layer: "Research",  items: ["National Archives", "Library of Congress", "Google Scholar", "JSTOR", "Perplexity"] },
  { layer: "Infra",     items: ["Docker", "Kubernetes", "AWS/GCP", "CI/CD", "Secure Local Mode"] },
];

export default function NOVILRoadmapTab() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview",     label: "Overview" },
    { id: "phases",       label: "Phases" },
    { id: "engines",      label: "Canon Guard" },
    { id: "agents",       label: "AI Agents" },
    { id: "aistack",      label: "AI Stack" },
    { id: "tech",         label: "Tech Stack" },
    { id: "monetization", label: "Monetization" },
  ];

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-black font-mono text-gold tracking-widest">NOVIL</span>
              <span className="text-xs font-bold font-mono px-2 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold">ROADMAP v1.0</span>
            </div>
            <div className="text-sm text-foreground font-sans mb-1">Computational Literary Intelligence Platform</div>
            <div className="text-xs text-muted-foreground font-mono">
              "CIA analyst workstation meets Hemingway's typewriter." — Narrative Intelligence for Serious Writers.
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-muted-foreground">Category</div>
            <div className="text-xs font-bold text-teal font-mono mt-1">Narrative Cognition Infrastructure</div>
          </div>
        </div>

        {/* Positioning pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {["Scrivener × Notion × Obsidian × AI Analyst", "Multi-Model Orchestration", "Cross-Chapter Memory", "Literary Scoring Engine", "Canon Guard System"].map(p => (
            <span key={p} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{p}</span>
          ))}
        </div>
      </div>

      {/* Section Nav */}
      <div className="flex gap-2 flex-wrap">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all border ${
              activeSection === s.id
                ? "bg-accent text-white border-transparent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeSection === "overview" && (
        <div className="space-y-4">
          {/* Big Differentiator */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-gold font-mono uppercase tracking-wider mb-3">The Big Differentiator</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-md bg-background border border-red/30">
                <div className="text-[10px] font-mono text-red font-bold mb-2">WHAT OTHERS DO</div>
                <div className="text-xs text-muted-foreground font-sans">Store text. Format documents. Suggest synonyms. Count words.</div>
              </div>
              <div className="p-3 rounded-md bg-background border border-gold/30">
                <div className="text-[10px] font-mono text-gold font-bold mb-2">WHAT NOVIL DOES</div>
                <div className="text-xs text-muted-foreground font-sans">Understands narrative. Tracks emotional vectors. Detects continuity errors. Scores realism. Compares against literary canon. Flags contradictions from 80 chapters ago.</div>
              </div>
            </div>
          </div>

          {/* Core Pillars */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-teal font-mono uppercase tracking-wider mb-3">9 Core Intelligence Pillars</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Narrative Coherence",   color: "#F5C842" },
                { label: "Emotional Resonance",   color: "#FF8C42" },
                { label: "Canon Tracking",         color: "#FF5C5C" },
                { label: "Behavioral Realism",     color: "#4A9EFF" },
                { label: "Literary Scoring",       color: "#1CCFB4" },
                { label: "Research Integration",   color: "#A855F7" },
                { label: "Production Pipeline",    color: "#F5C842" },
                { label: "Cinematic Visualization",color: "#FF8C42" },
                { label: "AI Orchestration",       color: "#4A9EFF" },
              ].map(p => (
                <div key={p.label} className="p-2.5 rounded-md bg-background border border-border flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="text-[10px] font-sans text-muted-foreground">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Engines preview */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-blue font-mono uppercase tracking-wider mb-3">Analytics Engine Suite</div>
            <div className="space-y-2">
              {[
                { name: "RF (Readability Fracture)", desc: "Narrative Friction Analysis — tracks cognitive load, emotional drag, symbolic density per section" },
                { name: "NIPS Engine",               desc: "Narrative Intelligence Processing System — emotional transmission, sensory density, psychological realism" },
                { name: "Vector Analysis Engine",    desc: "Tracks tension direction, emotional polarity, violence escalation, hope decay per chapter" },
                { name: "Sensory Balance Engine",    desc: "Scores visual/auditory/olfactory/tactile density — detects sterile prose and sensory imbalance" },
                { name: "Social Physics Engine",     desc: "Group cohesion, loyalty breakdown, command influence, betrayal pressure in squad/ensemble dynamics" },
                { name: "Behavioral Realism Engine", desc: "PTSD realism, dissociation markers, masculine suppression, guilt displacement, avoidance speech" },
              ].map(e => (
                <div key={e.name} className="flex items-start gap-3 p-2.5 rounded-md bg-background border border-border">
                  <div className="text-xs font-bold font-mono text-teal min-w-[180px]">{e.name}</div>
                  <div className="text-[10px] text-muted-foreground font-sans">{e.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Taglines */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-purple font-mono uppercase tracking-wider mb-3">Positioning</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Narrative Intelligence for Serious Writers.",
                "The Operating System for Story.",
                "Where Literature Meets Intelligence.",
                "Built for Writers Who Mean It.",
                "Notebooks Die Here.",
                "Moneyball for Literature.",
              ].map(t => (
                <div key={t} className="p-2.5 rounded-md bg-background border border-border text-xs font-sans text-muted-foreground italic">"{t}"</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHASES */}
      {activeSection === "phases" && (
        <div className="space-y-4">
          {PHASES.map(p => (
            <div key={p.phase} className="bg-card border border-border rounded-lg p-4" style={{ borderLeftColor: p.color, borderLeftWidth: 3 }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-black font-mono" style={{ color: p.color }}>PHASE {p.phase}</span>
                    <span className="text-sm font-bold font-mono text-foreground">{p.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color: p.color, borderColor: p.color + "55", background: p.color + "15" }}>{p.status}</span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">{p.timeline} · {p.goal}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold font-mono text-muted-foreground mb-2">DELIVERABLES</div>
                  <div className="space-y-1">
                    {p.items.map(item => (
                      <div key={item} className="flex items-start gap-2">
                        <span className="text-[10px] mt-0.5" style={{ color: p.color }}>▸</span>
                        <span className="text-[10px] font-sans text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold font-mono text-muted-foreground mb-2">TECH STACK</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.map(s => (
                      <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CANON GUARD ENGINES */}
      {activeSection === "engines" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-red font-mono uppercase tracking-wider mb-1">Canon Guard System</div>
            <div className="text-xs text-muted-foreground font-sans mb-3">
              Air traffic control for the novel. Flags contradictions from 8, 18, or 80 chapters ago. Memory architecture: PostgreSQL + Neo4j + Qdrant + Redis.
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
              {[
                { level: "CRITICAL", color: "#FF5C5C", examples: ["Timeline contradiction", "Dead character appears alive", "Object continuity error", "Impossible location shift"] },
                { level: "SERIOUS",  color: "#FF8C42", examples: ["POV violation", "Motivation contradiction", "Unexplained emotional regression", "Dialogue voice drift"] },
                { level: "MODERATE", color: "#F5C842", examples: ["Pacing drag", "Overused symbol", "Agency drop", "Code-switching imbalance"] },
              ].map(r => (
                <div key={r.level} className="p-2.5 rounded-md bg-background border border-border">
                  <div className="font-bold mb-2" style={{ color: r.color }}>{r.level}</div>
                  {r.examples.map(e => (
                    <div key={e} className="text-muted-foreground mb-0.5">· {e}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ENGINES.map(e => (
              <div key={e.name} className="bg-card border border-border rounded-lg p-4" style={{ borderTopColor: e.color, borderTopWidth: 2 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{e.icon}</span>
                  <span className="text-sm font-bold font-mono" style={{ color: e.color }}>{e.name}</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-sans mb-3">{e.description}</div>
                <div className="space-y-1">
                  {e.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                      <span className="text-[9px] font-mono text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Memory Architecture */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-teal font-mono uppercase tracking-wider mb-3">Memory Architecture</div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { db: "PostgreSQL",   role: "Chapters, scenes, structured canon facts",         color: "#4A9EFF" },
                { db: "Neo4j",        role: "Characters, relationships, timeline graph",          color: "#F5C842" },
                { db: "Qdrant",       role: "Semantic memory, manuscript embeddings",            color: "#1CCFB4" },
                { db: "Redis",        role: "Active session memory, hot cache",                  color: "#FF5C5C" },
              ].map(d => (
                <div key={d.db} className="p-3 rounded-md bg-background border border-border text-center">
                  <div className="text-sm font-black font-mono mb-1" style={{ color: d.color }}>{d.db}</div>
                  <div className="text-[9px] text-muted-foreground font-sans">{d.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI AGENTS */}
      {activeSection === "agents" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-gold font-mono uppercase tracking-wider mb-1">Multi-Agent AI Orchestration</div>
            <div className="text-xs text-muted-foreground font-sans mb-4">
              One conductor. Multiple orchestras. The Narrative Intelligence Orchestrator (NIO) routes each task to the best-fit agent.
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AGENTS.map(a => (
                <div key={a.name} className="flex items-start gap-3 p-2.5 rounded-md bg-background border border-border">
                  <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: a.color }} />
                  <div>
                    <div className="text-[10px] font-bold font-mono mb-0.5" style={{ color: a.color }}>{a.name}</div>
                    <div className="text-[9px] text-muted-foreground font-sans">{a.purpose}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NIO Flow */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-blue font-mono uppercase tracking-wider mb-3">Governed AI Architecture (No Raw Prompting)</div>
            <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
              {["User Prompt", "Governance Layer", "Context Injection", "Manuscript Memory", "Research Vault", "Character State", "Best-Fit Model", "Validation Layer", "Response"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="px-2.5 py-1.5 rounded-md bg-secondary border border-border text-muted-foreground">{step}</div>
                  {i < 8 && <span className="text-muted-foreground">→</span>}
                </div>
              ))}
            </div>
            <div className="mt-3 text-[9px] text-muted-foreground font-sans">
              No hallucinations. Every generation references manuscript memory, research vault, emotional continuity, and character state before outputting.
            </div>
          </div>
        </div>
      )}

      {/* AI STACK */}
      {activeSection === "aistack" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-orange font-mono uppercase tracking-wider mb-3">Multi-Model AI Stack</div>
            <div className="space-y-2">
              {AI_STACK.map(m => (
                <div key={m.model} className="flex items-start gap-4 p-3 rounded-md bg-background border border-border">
                  <div className="min-w-[140px]">
                    <div className="text-xs font-bold font-mono" style={{ color: m.color }}>{m.model}</div>
                    <div className="text-[9px] font-mono text-muted-foreground mt-0.5">{m.role}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-sans">{m.strength}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Task routing table */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-teal font-mono uppercase tracking-wider mb-3">Task → Model Routing</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 text-left text-muted-foreground font-bold">Task</th>
                    <th className="py-2 text-left text-muted-foreground font-bold">Best Model</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Literary critique + symbolism", "Claude AI (200K context)"],
                    ["Story generation + structured output", "OpenAI GPT-4o"],
                    ["Live research + fact verification", "Perplexity"],
                    ["Multimodal scene visualization", "Google Gemini"],
                    ["Private / offline manuscript analysis", "Ollama + Mistral (local)"],
                    ["Agent orchestration + workflows", "LangChain"],
                    ["Document intelligence + RAG", "LlamaIndex"],
                    ["Code-switching detection", "Custom NLP (HuggingFace)"],
                    ["Image / storyboard generation", "Stable Diffusion"],
                    ["SPSS analytics", "Python microservice"],
                  ].map(([task, model]) => (
                    <tr key={task} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-2 pr-4 text-muted-foreground">{task}</td>
                      <td className="py-2 text-gold font-bold">{model}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-purple font-mono uppercase tracking-wider mb-3">Platform Integrations</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { cat: "Writing",   items: ["Scrivener", "Final Draft", "Notion", "Obsidian"] },
                { cat: "Cloud",     items: ["Google Drive", "Dropbox", "GitHub", "OneDrive"] },
                { cat: "Research",  items: ["Zotero", "Mendeley", "JSTOR", "Semantic Scholar"] },
                { cat: "Archives",  items: ["National Archives", "Library of Congress", "data.gov", "FOIA API"] },
                { cat: "Analytics", items: ["SPSS", "Jupyter", "Python", "Neo4j"] },
                { cat: "Cinematic", items: ["Figma", "Blender", "Unreal Engine", "ElevenLabs"] },
              ].map(g => (
                <div key={g.cat} className="p-2.5 rounded-md bg-background border border-border">
                  <div className="text-[9px] font-bold font-mono text-purple mb-1.5">{g.cat}</div>
                  {g.items.map(i => (
                    <div key={i} className="text-[9px] text-muted-foreground font-sans">· {i}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TECH STACK */}
      {activeSection === "tech" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-gold font-mono uppercase tracking-wider mb-3">Full Technical Stack</div>
            <div className="grid grid-cols-3 gap-3">
              {STACK_LAYERS.map(layer => (
                <div key={layer.layer} className="p-3 rounded-md bg-background border border-border">
                  <div className="text-[10px] font-bold font-mono text-teal mb-2">{layer.layer.toUpperCase()}</div>
                  <div className="flex flex-wrap gap-1">
                    {layer.items.map(item => (
                      <span key={item} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-blue font-mono uppercase tracking-wider mb-3">Microservices Architecture</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { service: "AI Gateway",           purpose: "Routes model calls to best-fit AI based on task type" },
                { service: "Manuscript Engine",     purpose: "Core document logic, chapter management, versioning" },
                { service: "Knowledge Vault",       purpose: "Research storage, OCR, PDF/DOCX ingestion" },
                { service: "Vector Engine",         purpose: "Semantic memory, embedding generation, retrieval" },
                { service: "Analytics Engine",      purpose: "Scoring, RF, NIPS, sensory, emotional mapping" },
                { service: "Canon Guard Service",   purpose: "Contradiction detection, memory queries, continuity" },
                { service: "Code-Switching Engine", purpose: "Bilingual analysis, cultural realism scoring" },
                { service: "Story Intelligence",    purpose: "Narrative logic, arc tracking, pacing analysis" },
              ].map(s => (
                <div key={s.service} className="flex items-start gap-3 p-2.5 rounded-md bg-background border border-border">
                  <div className="text-[10px] font-bold font-mono text-blue min-w-[160px]">{s.service}</div>
                  <div className="text-[9px] text-muted-foreground font-sans">{s.purpose}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Target audience */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-orange font-mono uppercase tracking-wider mb-3">Go-To-Market: Own the Niche First</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                "Military fiction writers",
                "Literary fiction MFA programs",
                "Historians + archivists",
                "Investigative journalists",
                "Chicano / Indigenous scholars",
                "Documentary researchers",
                "Independent film studios",
                "Publishing houses",
              ].map(a => (
                <div key={a} className="p-2.5 rounded-md bg-background border border-border text-[10px] font-sans text-muted-foreground text-center">{a}</div>
              ))}
            </div>
            <div className="mt-3 text-[10px] text-orange font-mono">
              DO NOT target casual writers first. Own the serious writer niche. Then expand.
            </div>
          </div>
        </div>
      )}

      {/* MONETIZATION */}
      {activeSection === "monetization" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-gold font-mono uppercase tracking-wider mb-3">Pricing Tiers</div>
            <div className="grid grid-cols-5 gap-3">
              {TIERS.map(t => (
                <div key={t.name} className="rounded-lg border border-border bg-background p-3 flex flex-col" style={{ borderTopColor: t.color, borderTopWidth: 3 }}>
                  <div className="text-xs font-black font-mono mb-0.5" style={{ color: t.color }}>{t.name}</div>
                  <div className="text-lg font-black font-mono text-foreground mb-3">{t.price}</div>
                  <div className="space-y-1 flex-1">
                    {t.features.map(f => (
                      <div key={f} className="flex items-start gap-1.5">
                        <span className="text-[10px] mt-0.5" style={{ color: t.color }}>✓</span>
                        <span className="text-[9px] font-sans text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-[10px] font-bold text-teal font-mono uppercase tracking-wider mb-3">The Real Moat</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { moat: "Narrative Datasets",          desc: "Proprietary literary corpora, scored manuscripts, emotional annotation layers" },
                { moat: "Literary Scoring Systems",     desc: "RF, NIPS, Omega scores — proprietary IP no competitor has" },
                { moat: "Behavioral Analysis Models",   desc: "PTSD realism, dissociation, guilt displacement scoring trained on war literature" },
                { moat: "Historical Corpora",           desc: "Vietnam records, deportation archives, FOIA pulls, census data — searchable" },
                { moat: "Author Memory Architecture",   desc: "The platform learns style, metaphors, cadence, worldview over time" },
                { moat: "Manuscript Intelligence Engine",desc: "Governed AI that references memory before generating — not raw prompting" },
              ].map(m => (
                <div key={m.moat} className="flex items-start gap-3 p-3 rounded-md bg-background border border-teal/20">
                  <div className="w-2 h-2 rounded-full bg-teal mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold font-mono text-teal mb-0.5">{m.moat}</div>
                    <div className="text-[9px] text-muted-foreground font-sans">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-gold/30 rounded-lg p-4">
            <div className="text-[10px] font-bold text-gold font-mono uppercase tracking-wider mb-2">What You're Actually Building</div>
            <div className="text-xs font-sans text-muted-foreground leading-relaxed">
              Not Grammarly. Not Sudowrite. Not an AutoCrit clone.<br/>
              <span className="text-foreground font-bold">Narrative Cognition Infrastructure.</span> A system capable of analyzing literary psychology, modeling audience response, governing narrative consistency, preserving cultural authenticity, and measuring emotional transmission.<br/><br/>
              That's a completely different category. Universities, studios, military historians, investigative journalists, and publishing houses would all take this seriously.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}