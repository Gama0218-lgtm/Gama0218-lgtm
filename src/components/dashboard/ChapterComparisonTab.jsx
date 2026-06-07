import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import DashCard from "./DashCard";
import { CHAPTERS } from "../../lib/data";

const SEV_COLOR = {
  CLEAN:    "text-teal",
  LOW:      "text-teal",
  MEDIUM:   "text-gold",
  HIGH:     "text-orange",
  CRITICAL: "text-red",
};

const DELTA_COLOR = (delta) => {
  if (delta === null) return "text-muted-foreground";
  if (delta > 0.5) return "text-teal";
  if (delta < -0.5) return "text-red";
  return "text-muted-foreground";
};

export default function ChapterComparisonTab() {
  const [auditResults, setAuditResults] = useState([]);
  const [auditRuns, setAuditRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterAct, setFilterAct] = useState("all");
  const [filterDelta, setFilterDelta] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const runs = await base44.entities.AuditRun.list('-created_date', 10);
      setAuditRuns(runs);
      if (runs.length > 0) {
        const run = runs[0];
        setSelectedRun(run);
        const results = await base44.entities.ManuscriptAuditResult.filter({ audit_run_id: run.run_id });
        setAuditResults(results);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleRunChange = async (runId) => {
    setLoading(true);
    const run = auditRuns.find(r => r.run_id === runId);
    setSelectedRun(run);
    const results = await base44.entities.ManuscriptAuditResult.filter({ audit_run_id: runId });
    setAuditResults(results);
    setLoading(false);
  };

  const merged = CHAPTERS.map(ch => {
    const audited = auditResults.find(r => r.chapter_number === ch.ch);
    const omegaDelta = audited?.omega_score && ch.omega ? (audited.omega_score - ch.omega) : null;
    const wordDelta = audited?.word_count && ch.words ? (audited.word_count - ch.words) : null;
    return { ...ch, audited, omegaDelta, wordDelta };
  });

  const filtered = merged.filter(ch => {
    if (filterAct !== "all" && ch.act !== filterAct) return false;
    if (filterDelta === "drift" && ch.omegaDelta !== null && Math.abs(ch.omegaDelta) < 0.5) return false;
    if (filterDelta === "issues" && ch.audited?.overall_severity === "CLEAN") return false;
    return true;
  });

  const totalDrift = merged.filter(c => c.omegaDelta !== null && Math.abs(c.omegaDelta) >= 0.5).length;
  const totalIssues = merged.filter(c => c.audited && c.audited.overall_severity !== "CLEAN").length;
  const noData = merged.filter(c => !c.audited).length;

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          {["all", "I", "II", "III"].map(act => (
            <button
              key={act}
              onClick={() => setFilterAct(act)}
              className={`px-3 py-1 rounded-md text-xs font-bold font-mono border transition-all ${
                filterAct === act ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {act === "all" ? "ALL" : `ACT ${act}`}
            </button>
          ))}
          <div className="w-px bg-border mx-1" />
          {[
            {id:"all", label:"All Chapters"},
            {id:"drift", label:"Omega Drift"},
            {id:"issues", label:"Has Issues"},
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterDelta(f.id)}
              className={`px-3 py-1 rounded-md text-xs font-bold font-mono border transition-all ${
                filterDelta === f.id ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {auditRuns.length > 0 && (
          <select
            value={selectedRun?.run_id || ""}
            onChange={e => handleRunChange(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-1.5 text-xs font-mono text-foreground"
          >
            {auditRuns.map(r => (
              <option key={r.run_id} value={r.run_id}>
                {r.run_id} · {r.processed_chapters}/{r.total_chapters} chs
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Chapters Compared", value: merged.filter(c => c.audited).length, color: "text-teal" },
          { label: "No Audit Data", value: noData, color: "text-muted-foreground" },
          { label: "Omega Drift ≥0.5", value: totalDrift, color: "text-gold" },
          { label: "Chapters w/ Issues", value: totalIssues, color: "text-red" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <DashCard title={`Chapter-by-Chapter Comparison — Static Data vs AI Audit (${selectedRun?.run_id || "no run selected"})`} accent="blue">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm font-mono">Loading audit data…</div>
        ) : auditResults.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="text-muted-foreground text-sm font-mono">No audit results found.</div>
            <div className="text-xs text-muted-foreground">Run a forensic audit from the 🔬 Forensic Audit tab first.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-3 text-muted-foreground font-bold w-8">#</th>
                  <th className="text-left py-2 pr-3 text-muted-foreground font-bold">Title (Static)</th>
                  <th className="text-left py-2 pr-3 text-muted-foreground font-bold">Title (Audited)</th>
                  <th className="text-right py-2 pr-3 text-muted-foreground font-bold">Ω Static</th>
                  <th className="text-right py-2 pr-3 text-muted-foreground font-bold">Ω Audited</th>
                  <th className="text-right py-2 pr-3 text-muted-foreground font-bold">Δ Omega</th>
                  <th className="text-right py-2 pr-3 text-muted-foreground font-bold">Words Static</th>
                  <th className="text-right py-2 pr-3 text-muted-foreground font-bold">Words Audited</th>
                  <th className="text-right py-2 pr-3 text-muted-foreground font-bold">Δ Words</th>
                  <th className="text-center py-2 text-muted-foreground font-bold">Severity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ch => (
                  <tr
                    key={ch.ch}
                    className={`border-b border-border/40 hover:bg-secondary/30 transition-colors ${
                      ch.audited?.overall_severity === "CRITICAL" ? "bg-red/5" :
                      ch.audited?.overall_severity === "HIGH" ? "bg-orange/5" : ""
                    }`}
                  >
                    <td className="py-2 pr-3 text-muted-foreground">{ch.ch}</td>
                    <td className="py-2 pr-3 text-foreground max-w-[180px] truncate">{ch.title}</td>
                    <td className={`py-2 pr-3 max-w-[180px] truncate ${
                      ch.audited?.chapter_title && ch.audited.chapter_title !== ch.title
                        ? "text-gold"
                        : "text-muted-foreground"
                    }`}>
                      {ch.audited?.chapter_title || "—"}
                    </td>
                    <td className="py-2 pr-3 text-right text-gold">{ch.omega ?? "—"}</td>
                    <td className="py-2 pr-3 text-right text-blue">{ch.audited?.omega_score?.toFixed(1) ?? "—"}</td>
                    <td className={`py-2 pr-3 text-right font-bold ${DELTA_COLOR(ch.omegaDelta)}`}>
                      {ch.omegaDelta !== null ? (ch.omegaDelta > 0 ? "+" : "") + ch.omegaDelta.toFixed(1) : "—"}
                    </td>
                    <td className="py-2 pr-3 text-right text-muted-foreground">{ch.words?.toLocaleString() ?? "—"}</td>
                    <td className="py-2 pr-3 text-right text-muted-foreground">{ch.audited?.word_count?.toLocaleString() ?? "—"}</td>
                    <td className={`py-2 pr-3 text-right font-bold ${DELTA_COLOR(ch.wordDelta ? ch.wordDelta / 100 : null)}`}>
                      {ch.wordDelta !== null ? (ch.wordDelta > 0 ? "+" : "") + ch.wordDelta.toLocaleString() : "—"}
                    </td>
                    <td className="py-2 text-center">
                      <span className={`font-bold text-[9px] ${SEV_COLOR[ch.audited?.overall_severity] || "text-muted-foreground"}`}>
                        {ch.audited?.overall_severity ?? "NO DATA"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashCard>

      {/* Issues Spotlight */}
      {auditResults.length > 0 && (
        <DashCard title="Issues Spotlight — Chapters Requiring Attention" accent="red">
          <div className="space-y-2">
            {merged
              .filter(c => c.audited && ["CRITICAL","HIGH","MEDIUM"].includes(c.audited.overall_severity))
              .sort((a, b) => {
                const order = { CRITICAL:0, HIGH:1, MEDIUM:2 };
                return order[a.audited.overall_severity] - order[b.audited.overall_severity];
              })
              .map(ch => (
                <div key={ch.ch} className="flex items-start gap-3 p-2.5 rounded-md bg-background border border-border">
                  <span className="text-xs font-black font-mono text-muted-foreground min-w-[30px]">Ch{ch.ch}</span>
                  <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border min-w-[60px] text-center ${SEV_COLOR[ch.audited.overall_severity]}`}
                    style={{ borderColor: "currentColor", opacity: 0.9 }}>
                    {ch.audited.overall_severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground font-bold truncate">{ch.title}</div>
                    <div className="text-[10px] text-muted-foreground font-sans mt-0.5 line-clamp-2">{ch.audited.priority_fix}</div>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground whitespace-nowrap">Ω{ch.audited.omega_score?.toFixed(1)}</span>
                </div>
              ))}
            {merged.filter(c => c.audited && ["CRITICAL","HIGH","MEDIUM"].includes(c.audited.overall_severity)).length === 0 && (
              <div className="text-center py-4 text-teal text-sm font-mono font-bold">✓ No issues detected in audited chapters</div>
            )}
          </div>
        </DashCard>
      )}
    </div>
  );
}