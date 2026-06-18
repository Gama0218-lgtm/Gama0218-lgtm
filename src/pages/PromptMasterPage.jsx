import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Terminal, LayoutGrid } from "lucide-react";
import { CHAPTER_DATA, SPRINTS, PROJ_MEAN, BASELINE, AUDIT_V3_DATE, AUDIT_V3_CRITICAL_FINDING } from "../lib/promptData";
import RamosProfileScreen from "../components/promptmaster/RamosProfileScreen";
import SquadRosterScreen from "../components/promptmaster/SquadRosterScreen";
import MetricAuditScreen from "../components/promptmaster/MetricAuditScreen";

// ─── helpers ────────────────────────────────────────────────────────────────

function sprintFor(n) {
  for (const [k, s] of Object.entries(SPRINTS)) {
    if (s.chapters === "all") continue;
    if (s.chapters.includes(n)) return parseInt(k);
  }
  return 5;
}

const TIER_STYLE = {
  "OMEGA ELITE": "bg-teal/20 text-teal border-teal/40",
  "GOLD+":       "bg-gold/20 text-gold border-gold/40",
  "GOLD":        "bg-yellow-900/30 text-yellow-400 border-yellow-600/30",
};

function tierLabel(t) {
  if (!t) return "GOLD";
  if (t.includes("OMEGA ELITE")) return "OMEGA ELITE";
  if (t.includes("GOLD+")) return "GOLD+";
  return "GOLD";
}

// ─── Chapter Card ────────────────────────────────────────────────────────────

function ChapterCard({ ch }) {
  const [copied, setCopied] = useState(false);
  const delta = (ch.op - ch.oc).toFixed(2);
  const sprint = sprintFor(ch.n);
  const tgtOmega = ch.target && ch.target.includes("107") ? 107 : 106;
  const pct = Math.min(100, Math.max(0, ((ch.op - 100) / (110 - 100)) * 100));
  const tLabel = tierLabel(ch.tier);

  const handleCopy = () => {
    navigator.clipboard.writeText(ch.p).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-[9px] font-mono text-muted-foreground mb-0.5">
            Chapter {ch.n} · Act {ch.act}
          </div>
          <div className="text-base font-black text-gold">{ch.title}</div>
          <div className="text-[9px] text-muted-foreground mt-0.5">{ch.target}</div>
        </div>
        <span className={`text-[8px] font-bold font-mono px-2 py-1 rounded border whitespace-nowrap ${TIER_STYLE[tLabel] || TIER_STYLE["GOLD"]}`}>
          {tLabel}
        </span>
      </div>

      {/* Score grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {[
          { label: "CURRENT Ω", val: ch.oc.toFixed(2), color: "text-foreground" },
          { label: "PROJECTED Ω", val: ch.op.toFixed(2), color: ch.ok ? "text-teal" : "text-gold" },
          { label: "GAP TO TARGET", val: ch.gap <= 0 ? "ACHIEVED ✓" : `+${ch.gap.toFixed(2)}`, color: ch.gap <= 0 ? "text-teal" : ch.gap < 0.5 ? "text-gold" : "text-red" },
          { label: "SPRINT", val: `${sprint} of 5`, sub: SPRINTS[sprint].desc, color: "text-blue" },
        ].map((m) => (
          <div key={m.label} className="bg-secondary/30 border border-border rounded-lg p-3">
            <div className="text-[7px] font-mono text-muted-foreground mb-1">{m.label}</div>
            <div className={`text-sm font-black font-mono ${m.color}`}>{m.val}</div>
            {m.sub && <div className="text-[8px] text-muted-foreground mt-0.5">{m.sub}</div>}
            {m.label === "PROJECTED Ω" && (
              <div className={`text-[9px] font-mono ${parseFloat(delta) >= 0 ? "text-teal" : "text-red"}`}>
                {parseFloat(delta) >= 0 ? "+" : ""}{delta} Δ
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground mb-1">
          <span>Ω {ch.oc.toFixed(2)} → {ch.op.toFixed(2)} projected</span>
          <span>target {tgtOmega}.0</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden border border-border">
          <div
            className={`h-full rounded-full transition-all duration-500 ${ch.ok ? "bg-teal" : "bg-gold"}`}
            style={{ width: `${pct.toFixed(1)}%` }}
          />
        </div>
        <div className="text-[8px] text-muted-foreground mt-1">
          {ch.ok
            ? "✓ Projected to achieve target tier after all sprints"
            : `⚠ Gap of ${ch.gap.toFixed(2)} remains — additional component work needed`}
        </div>
      </div>

      {/* Bug/component grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Bug fix impact", val: ch.bug > 0 ? `+${ch.bug.toFixed(2)} Ω` : "—", color: ch.bug > 0 ? "text-orange" : "text-muted-foreground" },
          { label: "Component gain", val: ch.comp > 0 ? `+${ch.comp.toFixed(2)} Ω` : "—", color: ch.comp > 0 ? "text-blue" : "text-muted-foreground" },
          { label: "Sprint phase", val: `Sprint ${sprint}`, color: "text-purple" },
        ].map((m) => (
          <div key={m.label} className="bg-secondary/20 border border-border rounded-lg p-2.5">
            <div className="text-[7px] font-mono text-muted-foreground mb-1">{m.label}</div>
            <div className={`text-[11px] font-black font-mono ${m.color}`}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Prompt preview */}
      <div className="bg-secondary/20 border border-border rounded-xl p-4 mb-3">
        <div className="text-[7px] font-mono text-muted-foreground mb-2 tracking-widest">REVISION PROMPT</div>
        <pre className="text-[9px] font-mono text-foreground/80 whitespace-pre-wrap leading-relaxed max-h-64 overflow-auto">
          {ch.p}
        </pre>
      </div>

      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gold/10 border border-gold/30 text-gold rounded-lg text-[10px] font-bold font-mono hover:bg-gold/20 transition-all"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? "Copied ✓" : "Copy Full Prompt"}
      </button>
    </div>
  );
}

// ─── Overview Grid ───────────────────────────────────────────────────────────

function OverviewGrid({ onSelect }) {
  const acts = ["I", "II", "III"];
  return (
    <div className="animate-slide-up">
      <div className="text-[9px] font-mono text-muted-foreground mb-4 border-b border-border pb-2">
        All 45 chapters — click any to load prompt · Baseline Ω {BASELINE} → projected mean {PROJ_MEAN} after all sprints
      </div>
      {acts.map(act => (
        <div key={act} className="mb-6">
          <div className="text-[8px] font-bold font-mono text-muted-foreground mb-2 tracking-widest">ACT {act}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {CHAPTER_DATA.filter(ch => ch.act === act).map(ch => {
              const tLabel = tierLabel(ch.tier);
              return (
                <button
                  key={ch.n}
                  onClick={() => onSelect(ch.n)}
                  className="bg-card border border-border rounded-lg p-2.5 text-left hover:border-gold/40 hover:bg-gold/5 transition-all group"
                >
                  <div className="text-[7px] font-mono text-muted-foreground mb-0.5">Ch.{ch.n}</div>
                  <div className="text-[9px] font-bold text-foreground truncate mb-1 group-hover:text-gold transition-colors">{ch.title}</div>
                  <div className={`text-[8px] font-mono font-bold ${ch.ok ? "text-teal" : "text-gold"}`}>
                    Ω {ch.oc.toFixed(2)} → {ch.op.toFixed(2)} {ch.ok ? "✓" : "⚠"}
                  </div>
                  {ch.bug > 0 && (
                    <div className="text-[7px] font-mono text-orange mt-0.5">⚠ bug {ch.bug}Ω</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Stats Screen ───────────────────────────────────────────────────────────

function StatsScreen() {
  const achieved   = CHAPTER_DATA.filter(c => c.ok).length;
  const open       = CHAPTER_DATA.length - achieved;
  const critical   = CHAPTER_DATA.filter(c => c.bug >= 2.5).length;
  const bugChaps   = CHAPTER_DATA.filter(c => c.bug > 0);
  const totalBugΩ  = bugChaps.reduce((a,c) => a + c.bug, 0);
  const elite      = CHAPTER_DATA.filter(c => c.tier === "OMEGA ELITE");
  const byAct      = ["I","II","III"].map(act => {
    const chs = CHAPTER_DATA.filter(c => c.act === act);
    return { act, count: chs.length, achieved: chs.filter(c=>c.ok).length, meanΩ: (chs.reduce((a,c)=>a+c.oc,0)/chs.length).toFixed(2) };
  });
  const computedMean = (CHAPTER_DATA.reduce((a,c)=>a+c.op,0)/CHAPTER_DATA.length).toFixed(2);

  return (
    <div className="animate-slide-up space-y-5">
      <div className="text-[9px] font-mono text-muted-foreground border-b border-border pb-2">
        MANUSCRIPT STATISTICS — v2 audit · PROJ_MEAN computed from chapter op array
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {label:"Baseline Ω",       val:BASELINE,           color:"text-foreground"},
          {label:"Projected Mean Ω", val:computedMean,       color:"text-teal"},
          {label:"Chapters Achieved",val:`${achieved}/45`,   color:"text-teal"},
          {label:"Chapters Open",    val:`${open}/45`,       color:"text-orange"},
          {label:"Bug Chapters",     val:bugChaps.length,    color:"text-red"},
          {label:"Total Bug Ω Gain", val:`+${totalBugΩ.toFixed(2)}`,color:"text-gold"},
          {label:"Omega Elite",      val:elite.length,       color:"text-purple"},
          {label:"Total Words",      val:"241,117",           color:"text-blue"},
        ].map(m=>(
          <div key={m.label} className="bg-secondary/30 border border-border rounded-lg p-3 text-center">
            <div className={`text-xl font-black font-mono ${m.color}`}>{m.val}</div>
            <div className="text-[7px] font-mono text-muted-foreground mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {byAct.map(a=>(
          <div key={a.act} className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-mono text-muted-foreground mb-1">ACT {a.act}</div>
            <div className="text-xs font-bold text-foreground mb-2">{a.count} chapters</div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono">
                <span className="text-muted-foreground">Mean Ω</span>
                <span className="text-gold font-bold">{a.meanΩ}</span>
              </div>
              <div className="flex justify-between text-[9px] font-mono">
                <span className="text-muted-foreground">Achieved</span>
                <span className={a.achieved === a.count ? "text-teal font-bold" : "text-orange font-bold"}>{a.achieved}/{a.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-secondary/20 border border-border rounded-xl p-4">
        <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3">BUG FIX CHAPTERS — highest Ω impact first</div>
        <div className="space-y-1">
          {[...bugChaps].sort((a,b)=>b.bug-a.bug).map(c=>(
            <div key={c.n} className="flex items-center gap-3 text-[9px] font-mono py-1 border-b border-border/30 last:border-0">
              <span className="text-muted-foreground w-8">Ch.{c.n}</span>
              <span className="flex-1 text-foreground/80 truncate">{c.title}</span>
              <span className="text-orange font-bold">+{c.bug.toFixed(2)} Ω</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[8px] font-mono text-muted-foreground">
        v2.1: PROJ_MEAN corrected 106.50→{computedMean} · Achieved count →{achieved} · Ch.9 op corrected
      </div>
      <div className="text-[8px] font-mono text-red mt-1 bg-red/5 border border-red/20 rounded px-2 py-1">
        ⚠ v3 AUDIT {AUDIT_V3_DATE}: {AUDIT_V3_CRITICAL_FINDING}
      </div>
    </div>
  );
}

// ─── Character Agency Screen ──────────────────────────────────────────────────

function CharacterAgencyScreen() {
  const [section, setSection] = useState("engine");

  const SECTIONS = [
    { id: "engine",  label: "Character Engine"  },
    { id: "body",    label: "Body Under Fire"    },
    { id: "voice",   label: "Voice Map"          },
    { id: "slang",   label: "Slang Field Guide"  },
    { id: "workbook",label: "Scene Workbook"     },
    { id: "revision",label: "Revision Pass"      },
  ];

  return (
    <div className="animate-slide-up space-y-4">
      <div className="text-[9px] font-mono text-muted-foreground border-b border-border pb-2">
        BATTLE MYSTICISM — Character Agency + Voice + War Sensory System — SGT Ramos
      </div>

      {/* Section nav */}
      <div className="flex gap-1 flex-wrap">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`text-[9px] font-mono px-2.5 py-1 rounded border transition-all ${
              section === s.id ? "bg-teal/20 text-teal border-teal/40" : "border-border text-muted-foreground hover:text-foreground"
            }`}>{s.label}</button>
        ))}
      </div>

      {section === "engine" && (
        <div className="space-y-4">
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-gold mb-2 tracking-widest">THE CHARACTER ENGINE — BATTLE MYSTICISM FORMULA</div>
            <div className="text-[9px] text-foreground/80 leading-relaxed mb-3">
              Battle mysticism = collision of 3 systems inside one body: <span className="text-orange font-bold">acute stress physiology</span> + <span className="text-teal font-bold">inherited family ritual</span> + <span className="text-blue font-bold">identity pressure</span>.
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                {label:"Threat hits the body",    color:"text-orange"},
                {label:"Body triggers inherited ritual", color:"text-teal"},
                {label:"Ritual sharpens or DISTORTS the next choice", color:"text-gold"},
              ].map((s,i) => (
                <div key={i} className="bg-secondary/30 border border-border rounded-lg p-2.5 text-center">
                  <div className="text-[10px] font-black font-mono text-muted-foreground mb-1">{i+1}</div>
                  <div className={`text-[9px] font-bold ${s.color}`}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-red/5 border border-red/20 rounded-lg p-3">
              <div className="text-[9px] font-mono text-red/80">⚠ If the prayer/father wound/border wound do NOT alter the next action — you have atmosphere but not agency. Atmosphere alone is perfume on a battlefield.</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">IDENTITY IGNITION — FILL BEFORE EVERY BATTLE SCENE</div>
            <div className="space-y-2">
              {[
                "The prayer he hears under pressure",
                "The father-rule he cannot escape",
                "The family duty he feels in his bones",
                "The sentence that captures 'not Mexican enough / not American enough'",
                "The thing he overdoes to prove belonging",
                "The cost of that overperformance",
              ].map((q,i) => (
                <div key={i} className="flex items-start gap-3 border-b border-border/30 pb-2 last:border-0">
                  <span className="text-[8px] font-mono text-muted-foreground w-3 flex-shrink-0">{i+1}</span>
                  <span className="text-[9px] font-mono text-foreground/70">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "body" && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">THREE SIMULTANEOUS CHANNELS — NOT ALL FIVE</div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                {label:"EXTERNAL",  examples:"muzzle flash, dust, metal, boot skid",           color:"text-orange"},
                {label:"INTERNAL",  examples:"breath catching, heart hammering, sweat, stomach dropping", color:"text-red"},
                {label:"INHERITANCE",examples:"prayer fragment, family saying, father-standard", color:"text-teal"},
              ].map(c => (
                <div key={c.label} className="bg-secondary/30 border border-border rounded-lg p-3">
                  <div className={`text-[8px] font-black font-mono mb-1 ${c.color}`}>{c.label}</div>
                  <div className="text-[9px] text-foreground/70">{c.examples}</div>
                </div>
              ))}
            </div>
            <div className="text-[8px] font-mono text-muted-foreground border border-border rounded-lg p-3">
              <span className="text-foreground font-bold">KEY RULE:</span> Body speaks before intellect. If a round cracks past his ear — give them the body first. Neck tightens. Breath snags. Sweat spikes. Vision locks. Memory flashes in one phrase. THEN choice.
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">WAR SENSORY BASELINE — 4 STATES</div>
            <div className="space-y-2">
              {[
                {state:"CALM",      desc:"breath, heart, hands, hearing, thought speed, default prayer or self-talk",                                            color:"text-teal"},
                {state:"READY",     desc:"what tightens first, what he scans first, what memory rises",                                                          color:"text-blue"},
                {state:"REDLINE",   desc:"where sweat appears, how vision narrows, whether sound dims, whether language shortens",                                 color:"text-orange"},
                {state:"AFTERMATH", desc:"what shakes late, what smell lingers, what prayer returns, what he cannot say aloud",                                   color:"text-red"},
              ].map(s => (
                <div key={s.state} className="flex gap-3 border-b border-border/30 pb-2 last:border-0">
                  <span className={`text-[8px] font-black font-mono w-16 flex-shrink-0 ${s.color}`}>{s.state}</span>
                  <span className="text-[9px] text-foreground/70">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-lg p-3">
            <div className="text-[8px] font-mono text-gold">SPIRITUALITY RULE: The same prayer can sound like shelter in one scene and judgment in another. Both are valid. Neither is decorative. Same prayer. Different battlefield pressure.</div>
          </div>
        </div>
      )}

      {section === "voice" && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">5 VOICE SETTINGS — NOT ONE FAKE ACCENT</div>
            <div className="space-y-2">
              {[
                {v:"HOME VOICE",    desc:"words he uses with mother, abuela, cousins",                                    color:"text-gold"},
                {v:"PUBLIC VOICE",  desc:"how he sounds when he wants to pass or stay unreadable",                         color:"text-blue"},
                {v:"COMMAND VOICE", desc:"clipped or not, English-heavy or not, profanity threshold",                      color:"text-orange"},
                {v:"SHAME VOICE",   desc:"what language he falls into when he feels not enough",                           color:"text-red"},
                {v:"PRAYER VOICE",  desc:"does it come in Spanish, English, or a mix — steady or accusing?",               color:"text-teal"},
              ].map(s => (
                <div key={s.v} className="flex gap-3 border-b border-border/30 pb-2.5 last:border-0">
                  <span className={`text-[8px] font-black font-mono w-24 flex-shrink-0 ${s.color}`}>{s.v}</span>
                  <span className="text-[9px] text-foreground/70">{s.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[8px] font-mono text-muted-foreground border-t border-border pt-3">
              Each setting: 3 markers only — <span className="text-gold">1 rhythm trait</span> · <span className="text-teal">1 lexical habit</span> · <span className="text-blue">1 code-switch trigger</span>. Keeps dialogue human not costume-shop.
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">CHICANO VOICE — TECHNICAL RULES</div>
            <div className="space-y-2 text-[9px] font-mono">
              {[
                {rule:"NOT a Spanish accent", note:"Chicano English is a native ethnic variety. Do not write phonetic misspellings."},
                {rule:"Real signature",        note:"Rhythm, stance, discourse texture, and WHEN Spanish enters the line."},
                {rule:"Code-switch rule",      note:"Spanish surfaces under emotional load. The code-switch is diagnostic — when it appears, Ramos is at his limit."},
                {rule:"No translation tags",   note:"No 'he said in Spanish'. No glossary. Bilingual readers feel it; monolingual infer it."},
                {rule:"Tejano variant",         note:"Let some lines be Texan, not just Latino. He may sound more local-Texas than CA-Southwest."},
              ].map((r,i) => (
                <div key={i} className="flex gap-3 border-b border-border/30 pb-2 last:border-0">
                  <span className="text-gold font-bold flex-shrink-0">{r.rule}:</span>
                  <span className="text-foreground/70">{r.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "slang" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/20">
            <div className="text-[9px] font-bold font-mono">MEXICAN SLANG FIELD GUIDE — DEM/ASALE verified glosses</div>
            <div className="text-[8px] font-mono text-muted-foreground mt-0.5">Country of origin is non-negotiable. Same word, different battlefield.</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-border bg-secondary/10 text-[7px] font-mono text-muted-foreground">
                <th className="text-left px-3 py-2">TERM</th>
                <th className="text-left px-3 py-2">BEST WRITING GLOSS</th>
                <th className="text-left px-3 py-2">REGION / WARNING</th>
              </tr></thead>
              <tbody>
                {[
                  {t:"pendejo",       g:"idiot / dumbass / fool (not always full-strength asshole)",                         r:"Mexico + Central America · DEM/ASALE"},
                  {t:"pinche",        g:"damned / lousy / fucking — intensifier before noun",                                 r:"MX, GT, HN, SV, NI"},
                  {t:"chingar",       g:"bother, wreck, violate, break, beat up, grind down — most flexible profanity verb",  r:"Mexico-first · large semantic range"},
                  {t:"chingado/os",   g:"goddamn / what the hell / what the fuck — exclamation or intensifier",               r:"Mexico · violent/surprised tone"},
                  {t:"huevos",        g:"balls/testicles — carries macho force in dialogue",                                  r:"DLE colloquial"},
                  {t:"me vale madre", g:"I don't give a damn / I don't care at all",                                         r:"DEM: 'not matter to someone at all'"},
                  {t:"joto",          g:"derogatory anti-gay slur; also coward (Mexico)",                                    r:"⚠ Use ONLY to expose speaker's prejudice"},
                  {t:"puto",          g:"anti-gay slur OR coward/scaredy-cat — NOT just male whore",                         r:"⚠ Highly unstable across region"},
                  {t:"chingadera",    g:"this fucking thing / bullshit / dirty move (object vs action)",                     r:"MX, SV · DEM + DLE"},
                  {t:"culero",        g:"coward / asshole / shitty / lousy",                                                 r:"MX, GT, HN, SV"},
                  {t:"güey",          g:"dude — most common address, friends or sarcastic to strangers",                      r:"Mexico-dominant"},
                  {t:"neta",          g:"the truth / for real? (interrogative) / you rock (¡eres la neta!)",                 r:"Mexico"},
                  {t:"órale",         g:"amazement / approval / enthusiasm / complementing orders",                          r:"Chicano + Mexico"},
                  {t:"¡aguas!",       g:"watch out / be alert",                                                             r:"Mexico / Chicano"},
                ].map((row,i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className="px-3 py-2 font-bold text-gold font-mono whitespace-nowrap">{row.t}</td>
                    <td className="px-3 py-2 text-foreground/80">{row.g}</td>
                    <td className="px-3 py-2 text-muted-foreground text-[8px]">{row.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section === "workbook" && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">AGENCY CHAIN — EVERY ACTION BEAT</div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
              {["Trigger","Body flare","Inherited phrase","Decision","Immediate win","Hidden cost"].map((s,i) => (
                <div key={i} className="bg-secondary/30 border border-border rounded-lg p-2 text-center">
                  <div className="text-[8px] font-mono text-muted-foreground mb-0.5">{i+1}</div>
                  <div className={`text-[9px] font-bold ${
                    i===0?"text-orange":i===1?"text-red":i===2?"text-teal":i===3?"text-blue":i===4?"text-gold":"text-purple"
                  }`}>{s}</div>
                </div>
              ))}
            </div>
            <div className="bg-teal/5 border border-teal/20 rounded-lg p-3">
              <div className="text-[8px] font-mono text-teal/80 mb-1 font-bold">EXAMPLE SKELETON:</div>
              <div className="text-[9px] font-mono text-foreground/70 space-y-0.5">
                <div>He hears the crack.</div>
                <div>Chest locks. Palms go wet.</div>
                <div className="text-teal italic">Virgencita, cúbreme.</div>
                <div>He moves too early.</div>
                <div>He saves the man.</div>
                <div className="text-red">Now his position is exposed.</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">SCENE CARD — USE BEFORE DRAFTING COMBAT</div>
            <div className="space-y-2">
              {[
                {q:"Objective",       label:"What must he accomplish right now?",           color:"text-blue"},
                {q:"Obstacle",        label:"What makes that hard right now?",              color:"text-orange"},
                {q:"Body tell",       label:"What betrays his stress physically?",           color:"text-red"},
                {q:"Family echo",     label:"Whose voice enters his head?",                 color:"text-teal"},
                {q:"Identity wound",  label:"What 'not enough' belief gets activated?",    color:"text-purple"},
                {q:"Choice",          label:"What does he do BECAUSE of that wound?",      color:"text-gold"},
                {q:"Price",           label:"Who or what pays for the choice?",            color:"text-red"},
              ].map((r,i) => (
                <div key={i} className="flex gap-3 border-b border-border/30 pb-2 last:border-0">
                  <span className={`text-[8px] font-black font-mono w-24 flex-shrink-0 ${r.color}`}>{r.q}</span>
                  <span className="text-[9px] text-foreground/70">{r.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[8px] font-mono text-muted-foreground border-t border-border pt-3">
              If you cannot fill <span className="text-gold">Choice</span> and <span className="text-red">Price</span> — the scene is probably all pressure and no story.
            </div>
          </div>
        </div>
      )}

      {section === "revision" && (
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">REVISION PASS — 6 QUESTIONS IN ORDER</div>
            <div className="space-y-3">
              {[
                {n:1, q:"Did the body appear before the analysis?",                                         color:"text-orange"},
                {n:2, q:"Did one specific sensory channel dominate, instead of all shouting at once?",     color:"text-teal"},
                {n:3, q:"Did the prayer or family script CHANGE the action, not just decorate the prose?", color:"text-gold"},
                {n:4, q:"Did the line of dialogue fit the speaker's actual neighborhood and generation?",   color:"text-blue"},
                {n:5, q:"Did any slang term come from the right country and social setting?",              color:"text-purple"},
                {n:6, q:"Does the scene leave a bruise after the bullets stop?",                          color:"text-red"},
              ].map(r => (
                <div key={r.n} className="flex items-start gap-3">
                  <span className={`text-[8px] font-black font-mono w-5 flex-shrink-0 ${r.color}`}>{r.n}</span>
                  <span className="text-[9px] text-foreground/80">{r.q}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-red/5 border border-red/20 rounded-lg p-3">
              <div className="text-[9px] font-mono text-red/80">If the answer to Q6 is NO — the scene may be loud but not haunting. And haunting is what you want.</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">LITCENTRAL QUALITY GATES — ALL CHAPTERS</div>
            <div className="space-y-1.5">
              {[
                "No sentence explains what the reader should feel",
                "No LitCentral/SPSS terminology visible in prose",
                "At least 1 code-switch moment per 1,500 words (Act III: per 800 words)",
                "At least 1 behavioral vector moment for the weakest V: per chapter",
                "Dialogue at or above chapter's target %",
                "Sensory constants: minimum 3 of 6 present in chapter",
                "Chapter ends with: image, not statement",
                "Body appears before intellect in every high-stress scene",
                "Agency chain complete: Trigger → Body → Phrase → Decision → Win → Hidden cost",
              ].map((g,i) => (
                <div key={i} className="flex items-center gap-2 text-[9px] font-mono text-foreground/70">
                  <span className="text-muted-foreground">☐</span>{g}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Help Screen ─────────────────────────────────────────────────────────────

function HelpScreen() {
  return (
    <div className="text-[10px] font-mono text-muted-foreground leading-loose p-2">
      <div className="text-gold font-bold mb-3">SGT George Ramos — Hybrid LitCentral Revision Terminal</div>
      <div className="mb-1">45 chapters · Ω baseline <span className="text-foreground">{BASELINE}</span> · Projected post-sprint mean <span className="text-teal">{PROJ_MEAN}</span></div>
      <div className="mb-1">CL-MoE crossover target: <span className="text-blue">0.979</span> · LSTE target: <span className="text-blue">89.0</span></div>
      <div className="mb-3">Pulitzer probability: <span className="text-foreground">68%</span> → <span className="text-teal">80%+</span> post all sprints</div>
      <div className="space-y-1 text-muted-foreground">
        <div>Type <span className="text-gold font-bold bg-gold/10 px-1.5 py-0.5 rounded">prompt 11</span> to load Chapter 11</div>
        <div>Type <span className="text-gold font-bold bg-gold/10 px-1.5 py-0.5 rounded">11</span> as shorthand</div>
        <div>Type <span className="text-blue font-bold bg-blue/10 px-1.5 py-0.5 rounded">overview</span> for all 45 chapters grid</div>
        <div>Click any shortcut above, or chapter in the grid</div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

// v2 audit: risk-based shortcuts (highest bug/structural load chapters)
const SHORTCUTS = ["overview", "stats", "agency", "ramos", "squad", "audit", "prompt 1", "prompt 9", "prompt 10", "prompt 24", "prompt 34", "prompt 36", "prompt 38", "prompt 40", "prompt 42"];

export default function PromptMasterPage() {
  const navigate = useNavigate();
  const [output, setOutput] = useState("help");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  const process = (cmd) => {
    const c = cmd.trim().toLowerCase();
    if (!c) return;
    if (c === "audit" || c === "verify" || c === "sources" || c === "verification") {
      setOutput("audit");
      setSelectedChapter(null);
      setInputVal("");
      return;
    }
    if (c === "squad" || c === "roster" || c === "charlie" || c === "casualties") {
      setOutput("squad");
      setSelectedChapter(null);
      setInputVal("");
      return;
    }
    if (c === "ramos" || c === "sgt ramos" || c === "profile") {
      setOutput("ramos");
      setSelectedChapter(null);
      setInputVal("");
      return;
    }
    if (c === "agency" || c === "character" || c === "voice" || c === "mysticism") {
      setOutput("agency");
      setSelectedChapter(null);
      setInputVal("");
      return;
    }
    if (c === "stats") {
      setOutput("stats");
      setSelectedChapter(null);
      setInputVal("");
      return;
    }
    if (c === "overview" || c === "all" || c === "list") {
      setOutput("overview");
      setSelectedChapter(null);
      setInputVal("");
      return;
    }
    const numMatch = c.match(/^(?:prompt\s+)?(\d{1,2})$/);
    if (numMatch) {
      const n = parseInt(numMatch[1]);
      const ch = CHAPTER_DATA.find(c => c.n === n);
      if (ch) {
        setSelectedChapter(ch);
        setOutput("chapter");
        setInputVal("");
      } else {
        setOutput("notfound");
        setSelectedChapter(null);
      }
      return;
    }
    setOutput("help");
    setSelectedChapter(null);
  };

  const runShortcut = (s) => {
    setInputVal(s);
    process(s);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") process(inputVal);
  };

  // Stats
  const achieved = CHAPTER_DATA.filter(c => c.ok).length;
  const bugChapters = CHAPTER_DATA.filter(c => c.bug > 0).length;
  const eliteCount = CHAPTER_DATA.filter(c => c.tier === "OMEGA ELITE").length;

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="h-1 w-full bg-gradient-to-r from-gold via-teal to-purple" />

      {/* Header */}
      <div className="border-b border-border bg-card/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-mono">
            <ArrowLeft className="w-3.5 h-3.5" />LITCENTRAL
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs font-black text-gold font-mono tracking-widest">PROMPT MASTER</span>
              <span className="text-[8px] font-mono text-muted-foreground border border-border bg-secondary/50 px-1.5 py-0.5 rounded">45 CHAPTERS</span>
            </div>
            <div className="text-[9px] text-muted-foreground font-mono">SGT Ramos Revision Terminal — type prompt N to load any chapter</div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="text-[9px] font-mono text-gold bg-gold/10 border border-gold/20 px-2 py-1 rounded-full">
              Ω {BASELINE} → {PROJ_MEAN}
            </div>
            <div className="text-[9px] font-mono text-teal bg-teal/10 border border-teal/20 px-2 py-1 rounded-full">
              {achieved}/45 ACHIEVED
            </div>
            <div className="text-[9px] font-mono text-orange bg-orange/10 border border-orange/20 px-2 py-1 rounded-full">
              {bugChapters} BUG CHAPTERS
            </div>
            <div className="text-[9px] font-mono text-purple bg-purple/10 border border-purple/20 px-2 py-1 rounded-full">
              {eliteCount} OMEGA ELITE
            </div>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/20">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red" />
              <div className="w-2.5 h-2.5 rounded-full bg-gold" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal" />
            </div>
            <div className="flex-1 text-center text-[10px] font-mono text-muted-foreground tracking-widest">
              SGT RAMOS — LITCENTRAL REVISION TERMINAL
            </div>
          </div>

          {/* Input row */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <span className="text-muted-foreground text-sm font-mono">$</span>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder='type "prompt 11" or "overview" or just a chapter number...'
              className="flex-1 bg-transparent border-none outline-none text-[11px] font-mono text-foreground placeholder-muted-foreground"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={() => process(inputVal)}
              className="text-[9px] font-bold font-mono px-2.5 py-1 bg-gold/20 text-gold border border-gold/30 rounded hover:bg-gold/30 transition-all"
            >
              EXEC
            </button>
          </div>

          {/* Shortcuts */}
          <div className="flex gap-1.5 flex-wrap px-4 py-2.5 border-b border-border bg-secondary/10">
            {SHORTCUTS.map(s => (
              <button key={s} onClick={() => runShortcut(s)}
                className="text-[9px] font-mono px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
                {s}
              </button>
            ))}
          </div>

          {/* Output */}
          <div className="p-5">
            {output === "help"     && <HelpScreen />}
            {output === "stats"    && <StatsScreen />}
            {output === "agency"   && <CharacterAgencyScreen />}
            {output === "ramos"    && <RamosProfileScreen />}
            {output === "squad"    && <SquadRosterScreen />}
            {output === "audit"    && <MetricAuditScreen />}
            {output === "overview" && <OverviewGrid onSelect={(n) => { setInputVal(`prompt ${n}`); process(`prompt ${n}`); }} />}
            {output === "chapter"  && selectedChapter && <ChapterCard ch={selectedChapter} />}
            {output === "notfound" && (
              <div className="text-[10px] font-mono text-red py-4">
                Chapter not found. Try <span className="text-gold">prompt 1</span> through <span className="text-gold">prompt 45</span>, or <span className="text-blue">overview</span>.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}