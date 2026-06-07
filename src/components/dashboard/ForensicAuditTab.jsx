import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const SEV_COLOR = {
  CLEAN:    { text: "text-teal",   bg: "bg-teal/10",   border: "border-teal/30"   },
  LOW:      { text: "text-blue",   bg: "bg-blue/10",   border: "border-blue/30"   },
  MEDIUM:   { text: "text-gold",   bg: "bg-gold/10",   border: "border-gold/30"   },
  HIGH:     { text: "text-orange", bg: "bg-orange/10", border: "border-orange/30" },
  CRITICAL: { text: "text-red",    bg: "bg-red/10",    border: "border-red/30"    },
};

const CHAPTERS = Array.from({ length: 45 }, (_, i) => i + 1);

function SeverityBadge({ severity }) {
  const cfg = SEV_COLOR[severity] || SEV_COLOR.MEDIUM;
  return (
    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${cfg.text} ${cfg.bg} ${cfg.border}`}>
      {severity || "—"}
    </span>
  );
}

function ProgressRing({ pct, color = "#F5C842" }) {
  const r = 36, circ = 2 * Math.PI * r;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="#1A2640" strokeWidth="6" />
      <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform="rotate(-90 45 45)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      <text x="45" y="49" textAnchor="middle" fill={color} fontSize="14" fontWeight="900" fontFamily="monospace">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

function ChapterRow({ result, onClick, isSelected }) {
  if (!result) return null;
  const cfg = SEV_COLOR[result.overall_severity] || SEV_COLOR.MEDIUM;
  const bugCount = (result.continuity_issues?.length || 0) +
    (result.anachronisms?.length || 0) +
    (result.voice_drift_flags?.length || 0) +
    (result.structural_flags?.length || 0) +
    (result.character_flags?.length || 0);

  return (
    <div
      onClick={() => onClick(result)}
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all border ${
        isSelected ? "bg-secondary border-accent/40" : "border-transparent hover:bg-secondary/50"
      }`}
    >
      <span className="text-[10px] font-black font-mono text-muted-foreground w-7 text-right">
        {result.chapter_number}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-foreground truncate">{result.chapter_title || "—"}</div>
        <div className="text-[9px] text-muted-foreground font-mono">
          Act {result.act} · {result.word_count?.toLocaleString() || "—"}w · Ω{result.omega_score?.toFixed(1) || "—"}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {bugCount > 0 && (
          <span className="text-[9px] font-bold font-mono text-orange">{bugCount} bugs</span>
        )}
        <SeverityBadge severity={result.overall_severity} />
      </div>
    </div>
  );
}

function ChapterDetail({ result }) {
  if (!result) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-xs font-mono">
      Select a chapter to view forensic report
    </div>
  );

  const sections = [
    { label: "Continuity Issues",  items: result.continuity_issues,  color: "red"    },
    { label: "Anachronisms",       items: result.anachronisms,        color: "orange" },
    { label: "Voice Drift",        items: result.voice_drift_flags,   color: "gold"   },
    { label: "Character Flags",    items: result.character_flags,     color: "purple" },
    { label: "Structural Flags",   items: result.structural_flags,    color: "blue"   },
  ];

  const scores = [
    { label: "Omega",   value: result.omega_score?.toFixed(1), color: "gold"   },
    { label: "CLS",     value: result.cls_score?.toFixed(0),   color: "purple" },
    { label: "BIS",     value: result.bis_score?.toFixed(0),   color: "orange" },
    { label: "SII",     value: result.sii_score?.toFixed(0),   color: "cyan"   },
    { label: "MRF",     value: result.mrf_score?.toFixed(0),   color: "blue"   },
    { label: "Agency",  value: result.agency_score?.toFixed(1),color: "teal"   },
  ];

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-xs font-black font-mono text-muted-foreground mb-0.5">CH.{result.chapter_number} · ACT {result.act}</div>
            <div className="text-base font-black text-foreground">{result.chapter_title}</div>
          </div>
          <SeverityBadge severity={result.overall_severity} />
        </div>
        <div className="flex gap-4 text-[10px] font-mono text-muted-foreground mt-2">
          <span>Words: <span className="text-foreground font-bold">{result.word_count?.toLocaleString()}</span></span>
          <span>Dialogue: <span className={`font-bold ${result.dialogue_pct > 55 ? "text-orange" : "text-foreground"}`}>{result.dialogue_pct}%</span></span>
          <span>Sensory: <span className={`font-bold ${result.sensory_density < 15 ? "text-red" : "text-teal"}`}>{result.sensory_density?.toFixed(1)}/1k</span></span>
          <span>POV violations: <span className={`font-bold ${result.pov_violations > 0 ? "text-red" : "text-teal"}`}>{result.pov_violations ?? "—"}</span></span>
        </div>
        {result.summary && (
          <div className="mt-3 text-xs text-foreground/70 font-sans leading-relaxed border-t border-border pt-3">
            {result.summary}
          </div>
        )}
        {result.priority_fix && (
          <div className="mt-2 p-2.5 bg-red/5 border border-red/20 rounded-md">
            <div className="text-[9px] font-bold font-mono text-red mb-0.5">PRIORITY FIX</div>
            <div className="text-[10px] text-foreground/80 font-sans">{result.priority_fix}</div>
          </div>
        )}
      </div>

      {/* Scores */}
      <div className="grid grid-cols-6 gap-2">
        {scores.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-lg font-black font-mono text-${s.color}`}>{s.value ?? "—"}</div>
            <div className="text-[9px] text-muted-foreground font-mono">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Issue Sections */}
      {sections.map(sec => (
        (sec.items?.length > 0) && (
          <div key={sec.label} className="bg-card border border-border rounded-lg p-4">
            <div className={`text-[10px] font-bold font-mono text-${sec.color} uppercase tracking-wide mb-2 flex items-center gap-2`}>
              {sec.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-${sec.color}/10 border border-${sec.color}/30`}>
                {sec.items.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {sec.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-background rounded border border-border">
                  <span className={`text-[10px] font-mono text-${sec.color} font-bold mt-0.5 flex-shrink-0`}>{i + 1}.</span>
                  <span className="text-[10px] text-foreground/80 font-sans leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {sections.every(s => !s.items?.length) && (
        <div className="bg-card border border-teal/30 rounded-lg p-4 text-center">
          <div className="text-teal font-bold font-mono text-sm">✓ CLEAN</div>
          <div className="text-xs text-muted-foreground font-sans mt-1">No issues detected in this chapter.</div>
        </div>
      )}
    </div>
  );
}

export default function ForensicAuditTab() {
  const [auditRun, setAuditRun] = useState(null);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [filterSev, setFilterSev] = useState("all");
  const [filterAct, setFilterAct] = useState("all");

  // Load latest audit run on mount
  useEffect(() => {
    loadLatestRun();
  }, []);

  const loadLatestRun = async () => {
    setLoading(true);
    const runs = await base44.entities.AuditRun.list("-created_date", 1);
    if (runs.length > 0) {
      setAuditRun(runs[0]);
      const res = await base44.entities.ManuscriptAuditResult.filter(
        { audit_run_id: runs[0].run_id },
        "chapter_number", 45
      );
      setResults(res);
      if (res.length > 0) setSelected(res[0]);
    }
    setLoading(false);
  };

  const startNewAudit = async () => {
    setProcessing(true);
    setResults([]);
    setSelected(null);

    // Create audit run
    const startRes = await base44.functions.invoke("startAuditRun", {});
    const runId = startRes.data.run_id;

    const runs = await base44.entities.AuditRun.list("-created_date", 1);
    setAuditRun(runs[0]);

    // Process chapters sequentially (to avoid rate limits)
    for (let ch = 1; ch <= 45; ch++) {
      setCurrentChapter(ch);
      await base44.functions.invoke("auditManuscript", {
        chapter_number: ch,
        audit_run_id: runId
      });
      // Refresh results after each chapter
      const res = await base44.entities.ManuscriptAuditResult.filter(
        { audit_run_id: runId },
        "chapter_number", 45
      );
      setResults([...res]);
      if (!selected && res.length > 0) setSelected(res[0]);
    }

    // Final refresh
    const runs2 = await base44.entities.AuditRun.list("-created_date", 1);
    setAuditRun(runs2[0]);
    setCurrentChapter(null);
    setProcessing(false);
  };

  const filteredResults = results.filter(r => {
    if (filterSev !== "all" && r.overall_severity !== filterSev) return false;
    if (filterAct !== "all" && r.act !== filterAct) return false;
    return true;
  });

  const totalBugs = results.reduce((sum, r) => sum + (r.continuity_issues?.length || 0) + (r.anachronisms?.length || 0) + (r.voice_drift_flags?.length || 0) + (r.structural_flags?.length || 0) + (r.character_flags?.length || 0), 0);
  const critCount = results.filter(r => r.overall_severity === "CRITICAL").length;
  const highCount = results.filter(r => r.overall_severity === "HIGH").length;
  const cleanCount = results.filter(r => r.overall_severity === "CLEAN").length;
  const scored = results.filter(r => r.omega_score > 0);
  const avgOmega = scored.length ? (scored.reduce((s, r) => s + r.omega_score, 0) / scored.length).toFixed(1) : "—";
  const totalWords = results.reduce((s, r) => s + (r.word_count || 0), 0);
  const pct = results.length / 45;

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-base font-black font-mono text-red">FORENSIC AUDIT ENGINE</span>
              <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-red/10 border border-red/30 text-red">
                {auditRun?.status === "running" ? "⚡ PROCESSING" : auditRun?.status === "complete" ? "✓ COMPLETE" : "READY"}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              SGT George Ramos: The Mathematics of Vietnam · v11 Manuscript · 45 Chapters
            </div>
          </div>
          <button
            onClick={startNewAudit}
            disabled={processing || loading}
            className="px-5 py-2.5 bg-red text-white rounded-lg text-xs font-black font-mono hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {processing ? `⚡ AUDITING CH.${currentChapter}/45...` : "▶ RUN FULL AUDIT"}
          </button>
        </div>

        {/* Progress */}
        {(processing || results.length > 0) && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-muted-foreground">
                {results.length}/45 chapters audited
              </span>
              <span className="text-[9px] font-mono text-gold">{Math.round(pct * 100)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${pct * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      {results.length > 0 && (
        <div className="grid grid-cols-7 gap-2">
          <div className="bg-card border border-border rounded-lg p-3 text-center col-span-1">
            <ProgressRing pct={pct} color="#F5C842" />
            <div className="text-[9px] text-muted-foreground font-mono mt-1">COMPLETE</div>
          </div>
          {[
            { label: "AVG OMEGA",    value: avgOmega,                  color: "gold"   },
            { label: "TOTAL WORDS",  value: totalWords.toLocaleString(), color: "blue"  },
            { label: "TOTAL BUGS",   value: totalBugs,                  color: "red"   },
            { label: "CRITICAL",     value: critCount,                  color: "red"   },
            { label: "HIGH",         value: highCount,                  color: "orange" },
            { label: "CLEAN",        value: cleanCount,                 color: "teal"  },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
              <div className={`text-2xl font-black font-mono text-${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Body */}
      {results.length > 0 ? (
        <div className="flex gap-4">
          {/* Chapter List */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Filters */}
              <div className="p-2 border-b border-border space-y-1.5">
                <div className="flex gap-1 flex-wrap">
                  {["all", "CRITICAL", "HIGH", "MEDIUM", "LOW", "CLEAN"].map(s => (
                    <button key={s} onClick={() => setFilterSev(s)}
                      className={`text-[8px] px-2 py-0.5 rounded font-mono font-bold transition-all ${filterSev === s ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground"}`}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  {["all", "I", "II", "III"].map(a => (
                    <button key={a} onClick={() => setFilterAct(a)}
                      className={`text-[8px] px-2 py-0.5 rounded font-mono font-bold transition-all ${filterAct === a ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground"}`}>
                      {a === "all" ? "ALL" : `ACT ${a}`}
                    </button>
                  ))}
                </div>
              </div>
              {/* Chapter list */}
              <div className="overflow-y-auto max-h-[600px] p-1">
                {filteredResults.sort((a, b) => a.chapter_number - b.chapter_number).map(r => (
                  <ChapterRow
                    key={r.id}
                    result={r}
                    onClick={setSelected}
                    isSelected={selected?.id === r.id}
                  />
                ))}
                {filteredResults.length === 0 && (
                  <div className="text-center py-8 text-[10px] text-muted-foreground font-mono">No chapters match filter</div>
                )}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="flex-1 min-w-0">
            <ChapterDetail result={selected} />
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="text-4xl mb-4">🔬</div>
          <div className="text-base font-black font-mono text-foreground mb-2">FORENSIC AUDIT READY</div>
          <div className="text-xs text-muted-foreground font-sans max-w-md mx-auto mb-6">
            Click "RUN FULL AUDIT" to perform a deep-dive forensic analysis of all 45 chapters.
            The engine will audit each chapter for Omega scores, continuity issues, anachronisms,
            voice drift, POV violations, structural flags, and character consistency.
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-[10px] font-mono text-muted-foreground">
            <div className="p-2 bg-background rounded border border-border">⚠ Continuity</div>
            <div className="p-2 bg-background rounded border border-border">📅 Anachronisms</div>
            <div className="p-2 bg-background rounded border border-border">🎭 Voice Drift</div>
            <div className="p-2 bg-background rounded border border-border">👁 POV Violations</div>
            <div className="p-2 bg-background rounded border border-border">📊 Omega Scores</div>
            <div className="p-2 bg-background rounded border border-border">⚡ Agency Score</div>
          </div>
        </div>
      )}
    </div>
  );
}