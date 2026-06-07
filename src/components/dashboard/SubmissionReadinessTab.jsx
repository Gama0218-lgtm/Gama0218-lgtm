import { useState } from "react";
import DashCard from "./DashCard";
import { AlertTriangle, CheckCircle, XCircle, Clock, BookOpen, Target, TrendingUp, Award } from "lucide-react";

const SEVERITY = {
  CRITICAL: { label: "CRITICAL", color: "text-red", border: "border-red/40", bg: "bg-red/5", icon: XCircle },
  HIGH:     { label: "HIGH",     color: "text-orange", border: "border-orange/40", bg: "bg-orange/5", icon: AlertTriangle },
  MEDIUM:   { label: "MED",      color: "text-gold", border: "border-gold/40", bg: "bg-gold/5", icon: AlertTriangle },
  LOW:      { label: "LOW",      color: "text-teal", border: "border-teal/40", bg: "bg-teal/5", icon: CheckCircle },
};

const DIAGNOSTICS = [
  {
    id: "pacing",
    severity: "HIGH",
    category: "Pacing & Abstraction Drift",
    icon: "📉",
    chapters: ["Ch.9", "Ch.32"],
    title: "Gold Drag Zones — NI Drop to ~0.51",
    description: "Chapters 9 and 32 suffer Abstraction Drift where philosophical/mathematical motifs temporarily decouple from visceral character action.",
    details: [
      { label: "Ch.9 Dialogue Density", value: "2.97% — critically low. Dense prose blocks elevate Reader Fatigue." },
      { label: "Ch.32 Abstraction Drift", value: "NI score collapses. Mathematical metaphors lose grounding in physical action." },
    ],
    fix: "Convert passive exposition into active dialogue collision. Each philosophical motif must be anchored to a sensory or physical moment.",
    time: "2–3 days",
    impact: "Unlocks Omega Elite tier for both chapters",
  },
  {
    id: "sagasta",
    severity: "HIGH",
    category: "Character Arc Decay",
    icon: "👤",
    chapters: ["Ch.17–Ch.31"],
    title: "Joshua Sagasta — 15-Chapter Absence Gap (Act II)",
    description: "The foundational 'Joshua Sagasta' identity suffers a complete 15-chapter blackout through Act II, risking severe reader memory decay before the climactic Ch.44 reveal.",
    details: [
      { label: "Gap span", value: "Ch.17 → Ch.31 — 15 consecutive chapters with zero Sagasta presence" },
      { label: "Vextor profile risk", value: "Internal narrative ledger inconsistency flagged by Canon Guard" },
      { label: "Ch.44 impact", value: "Senate resolution restoration loses full emotional weight without mid-act seeding" },
    ],
    fix: "Seed 3–5 brief Sagasta mentions into Act II mid-scenes: a name discrepancy noticed by Roy (Ch.20), a second 'Ramos' casualty rumor (Ch.25–26), a filing anomaly in Ch.28. Each seed ≤1 paragraph.",
    time: "2 days",
    impact: "+2.1 Canon Authority Score",
  },
  {
    id: "m249",
    severity: "CRITICAL",
    category: "Historical Anachronism",
    icon: "⚔️",
    chapters: ["Ch.10"],
    title: "M249 SAW — Weapon Not Adopted Until 1984",
    description: "Chapter 10 references the M249 Squad Automatic Weapon, a Belgian FN Minimi variant not adopted by the US Army until 1984 — 16 years after the depicted 1968 action.",
    details: [
      { label: "Current text", value: "M249 SAW referenced in firefight sequence" },
      { label: "Historical reality", value: "The M60 machine gun ('the pig') was the standard GPMG in Vietnam 1965–1975" },
      { label: "Accuracy score risk", value: "Drops global accuracy score below 97.8% threshold" },
    ],
    fix: "Systematic find/replace: M249 SAW → M60 machine gun. Add soldier nickname 'the pig' on first reference for authenticity.",
    time: "1 hour",
    impact: "Restores 97.8% historical accuracy score — submission-blocking",
  },
  {
    id: "khesanh",
    severity: "CRITICAL",
    category: "Historical Anachronism",
    icon: "📅",
    chapters: ["Ch.24"],
    title: "Siege of Khe Sanh Duration — '18 Hours' vs 77 Days",
    description: "Chapter 24 summarizes the Siege of Khe Sanh as lasting 'eighteen hours.' The actual containment operation ran 77 days (January 21 – April 9, 1968).",
    details: [
      { label: "Current text", value: "'The siege lasted eighteen hours'" },
      { label: "Historical fact", value: "77-day operation — one of the most analyzed engagements of the entire war" },
      { label: "Correct phrasing", value: "'the final eighteen hours of fifty-seven days' — preserves the scene while restoring accuracy" },
    ],
    fix: "Replace 'eighteen hours' with 'the final eighteen hours of fifty-seven days' — the phrasing preserves dramatic immediacy while honoring the historical record.",
    time: "30 minutes",
    impact: "Submission-blocking — egregious factual error for editorial gatekeepers",
  },
  {
    id: "hardware",
    severity: "HIGH",
    category: "Historical Anachronism",
    icon: "🔧",
    chapters: ["Ch.6", "Ch.15"],
    title: "Hardware Variants — CAC Cards & Uher Reel-to-Reel",
    description: "Two equipment references are historically inaccurate for infantry draftees in 1968.",
    details: [
      { label: "Ch.6 — CAC card swipe", value: "Magnetic stripe CAC validation not USMC standard until 1973. Correct to: 'dog tag check'" },
      { label: "Ch.15 — Uher 4000 reel-to-reel", value: "German Uher 4000 series reel-to-reel was professional broadcast equipment, not frontline infantry field gear. Correct to: standard military field recorder or remove reference" },
    ],
    fix: "Ch.6: Replace 'card swipe' with 'dog tag check'. Ch.15: Replace Uher reel-to-reel with period-appropriate cassette recorder (available 1969) or remove device reference.",
    time: "2 hours",
    impact: "Maintains 97.8% historical accuracy benchmark",
  },
  {
    id: "brown",
    severity: "MEDIUM",
    category: "Lexical Saturation",
    icon: "🎨",
    chapters: ["Ch.26"],
    title: "Identity Flattening — 'Brown' × 8 in 400-Word Cluster",
    description: "The word 'brown' appears 8 times in a concentrated 400-word section of Chapter 26, risking the flattening of complex Chicano identity into a restrictive racial signifier.",
    details: [
      { label: "Density", value: "8 occurrences / 400 words = 20/1k — 10× acceptable threshold" },
      { label: "Cultural risk", value: "Over-repetition reduces a layered cultural identity to a single visual marker" },
      { label: "Beta reader flag", value: "Confirmed by reader panel — third read fatigue reported at this passage" },
    ],
    fix: "Distribute appearances. Replace 5–6 instances with culturally elastic synonyms: earth-toned, copper-skinned, mestizo, moreno, tierra-colored, bronze. Preserve 2 instances for intentional rhythmic echo.",
    time: "1 hour",
    impact: "+CLS score, removes beta reader flag",
  },
  {
    id: "ch40void",
    severity: "CRITICAL",
    category: "Structural Void",
    icon: "⬜",
    chapters: ["Ch.40"],
    title: "Chapter 40 — 2,604-Word Bathroom Prayer Scene MISSING",
    description: "The forensic scanner flagged a massive structural hole in Chapter 40. A critical bathroom prayer scene is completely absent from the drafted text, leaving an approximately 2,604-word gap against the 5,000-word chapter target.",
    details: [
      { label: "Current word count", value: "~2,396w (per scanner) vs 5,000w target — 52% below target" },
      { label: "Missing content", value: "Ramos bathroom prayer scene — a pivotal spiritual/psychological beat before the final Congressional testimony" },
      { label: "Structural impact", value: "Without this scene, Ch.40 'Adios Muchachos' extraction lacks its interior anchor. Reader has no transition into Ch.41 testimony mode." },
    ],
    fix: "Draft the bathroom prayer scene: Ramos alone, pre-testimony morning. Structure: (1) physical grounding — tile, fluorescent hum, hands on sink, (2) names spoken aloud — the 13 carnales, (3) prayer in Spanish then English, (4) resolve — 'not for me. For Trece.' Approx. 2,600 words. HIGH OMEGA potential.",
    time: "4–6 hours (full draft)",
    impact: "Closes the most critical structural hole in the manuscript",
  },
];

const STATUS_ITEMS = [
  { label: "Omega Elite Chapters", value: "43/44", color: "text-gold", note: "Pending Ch.9 + Ch.32 pacing fix" },
  { label: "Historical Accuracy", value: "97.8%", color: "text-teal", note: "M249 + Khe Sanh fixes required to maintain" },
  { label: "Project-wide Ω Score", value: "91.92", color: "text-blue", note: "Current aggregate — Elite tier" },
  { label: "Submission Blockers", value: "3", color: "text-red", note: "M249, Khe Sanh, Ch.40 void" },
  { label: "High-Priority Fixes", value: "4", color: "text-orange", note: "Pacing, Sagasta arc, hardware, Brown cluster" },
  { label: "Est. Completion Time", value: "~3 days", color: "text-purple", note: "All 7 diagnostics resolved" },
];

const STRATEGIC_COMPS = [
  { title: "Tim O'Brien", work: "The Things They Carried", role: "Vietnam literary benchmark", gap: "No Chicano POV, no mathematical/systems critique" },
  { title: "Rudolfo Anaya", work: "Bless Me, Ultima", role: "Chicano literature anchor", gap: "No military/combat narrative" },
  { title: "Karl Marlantes", work: "Matterhorn", role: "High-velocity military tactical fiction", gap: "No minority erasure thesis" },
  { title: "Viet Thanh Nguyen", work: "The Sympathizer", role: "Anti-imperialist dual-perspective", gap: "Vietnamese POV, no Chicano/Latino lens" },
];

function DiagCard({ d, expanded, onToggle }) {
  const sev = SEVERITY[d.severity];
  const SevIcon = sev.icon;
  return (
    <div className={`border rounded-lg overflow-hidden ${sev.border} ${expanded ? sev.bg : "bg-background"} transition-all`}>
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 p-3 text-left"
      >
        <span className="text-lg mt-0.5 shrink-0">{d.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`text-[10px] font-black font-mono px-1.5 py-0.5 rounded border ${sev.color} ${sev.border} ${sev.bg}`}>
              {sev.label}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{d.category}</span>
            <div className="flex gap-1 ml-auto">
              {d.chapters.map(ch => (
                <span key={ch} className="text-[9px] font-mono bg-secondary px-1.5 py-0.5 rounded text-foreground/70">{ch}</span>
              ))}
            </div>
          </div>
          <div className="text-xs font-bold text-foreground font-sans">{d.title}</div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">{d.description}</p>

          <div className="space-y-1.5">
            {d.details.map((det, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span className="text-muted-foreground font-mono shrink-0 min-w-[120px]">{det.label}:</span>
                <span className="text-foreground/80 font-sans">{det.value}</span>
              </div>
            ))}
          </div>

          <div className="bg-secondary/40 rounded-md p-2.5 border border-border">
            <div className="text-[10px] font-bold text-teal font-mono mb-1">✦ RECOMMENDED FIX</div>
            <p className="text-xs text-foreground/80 font-sans leading-relaxed">{d.fix}</p>
          </div>

          <div className="flex gap-4 text-[10px] font-mono">
            <span className="text-muted-foreground">⏱ Est: <span className="text-gold font-bold">{d.time}</span></span>
            <span className="text-muted-foreground">↑ Impact: <span className="text-teal font-bold">{d.impact}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubmissionReadinessTab() {
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  const criticalCount = DIAGNOSTICS.filter(d => d.severity === "CRITICAL").length;
  const highCount = DIAGNOSTICS.filter(d => d.severity === "HIGH").length;

  return (
    <div className="animate-slide-up space-y-4">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gold/10 via-teal/5 to-blue/10 border border-gold/30 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-5 h-5 text-gold shrink-0" />
          <div className="text-sm font-black text-gold font-mono tracking-wide">SUBMISSION READINESS DIAGNOSTIC — v11</div>
        </div>
        <p className="text-xs text-foreground/70 font-sans leading-relaxed">
          SGT George Ramos: The Mathematics of Vietnam operates at an elite project-wide Ω score of <strong className="text-gold">91.92</strong>. 
          To unlock definitive Omega Tier authorization across all 44 core chapters, the following {DIAGNOSTICS.length} diagnostics must be resolved. 
          Three are submission-blocking. Estimated total remediation: <strong className="text-teal">~3 days.</strong>
        </p>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {STATUS_ITEMS.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-2.5 text-center">
            <div className={`text-xl font-black font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
            <div className="text-[8px] text-foreground/40 font-sans mt-0.5 leading-tight">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Diagnostic Items */}
      <DashCard title={`Diagnostic Deficits — ${criticalCount} CRITICAL · ${highCount} HIGH`} accent="red">
        <div className="space-y-2">
          {DIAGNOSTICS.map(d => (
            <DiagCard
              key={d.id}
              d={d}
              expanded={expanded === d.id}
              onToggle={() => toggle(d.id)}
            />
          ))}
        </div>
      </DashCard>

      {/* Strategic Position */}
      <DashCard title="Strategic Market Position — The O'Brien/Anaya Gap" accent="blue">
        <p className="text-xs text-muted-foreground font-sans leading-relaxed mb-3">
          This manuscript successfully bridges the literary void between Tim O'Brien's definitive Vietnam narrative and Rudolfo Anaya's foundational Chicano literature. 
          The <strong className="text-gold">Trojan Horse</strong> marketing strategy avoids ethnic-fiction pigeonholing: high-velocity military pacing enables direct competition with canonical tactical texts.
        </p>
        <div className="space-y-2">
          {STRATEGIC_COMPS.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 bg-background rounded-md border border-border">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-foreground font-sans">{c.title}</span>
                  <span className="text-[10px] text-gold font-mono italic">"{c.work}"</span>
                </div>
                <div className="text-[10px] text-teal font-mono mt-0.5">Role: {c.role}</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-0.5">Gap filled: {c.gap}</div>
              </div>
            </div>
          ))}
        </div>
      </DashCard>

      {/* Conclusion */}
      <DashCard title="Conclusion — Path to Publication Readiness" accent="teal">
        <div className="space-y-2 text-xs font-sans text-muted-foreground leading-relaxed">
          <p>
            Once the author resolves the identified <strong className="text-red">pacing drag zones (Ch.9 and Ch.32)</strong>, 
            repairs the <strong className="text-orange">15-chapter Sagasta arc decay</strong>, 
            restores the <strong className="text-red">missing Ch.40 bathroom prayer scene</strong>, 
            and corrects the isolated historical anachronisms (specifically the <strong className="text-orange">M249 SAW</strong> and the <strong className="text-orange">Khe Sanh duration</strong>), 
            the manuscript will achieve definitive publication readiness.
          </p>
          <p>
            The text achieves transcendent moments of <strong className="text-gold">Combat Mysticism</strong> — particularly in the Omega Elite-tier sequences: 
            the chapel defense (Ch.29), the orphanage evacuation (Ch.31), and the climactic Congressional reckoning (Ch.43–44). 
            The 349-Record Anomaly is transformed from a statistical footnote into a profound narrative of resistance.
          </p>
          <div className="bg-gold/5 border border-gold/30 rounded-md p-3 mt-2">
            <div className="text-xs font-black text-gold font-mono mb-1">FINAL ASSESSMENT</div>
            <p className="text-foreground/80">
              This manuscript stands poised to permanently alter the landscape of the American War Canon — securing its place as an 
              award-worthy testament to the unbroken spirit of the Chicano warrior, and ensuring the names erased by institutional calculus are resurrected.
            </p>
          </div>
        </div>
      </DashCard>

    </div>
  );
}