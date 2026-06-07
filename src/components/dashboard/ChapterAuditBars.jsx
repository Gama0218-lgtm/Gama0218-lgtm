import { CHAPTERS, CHAPTER_BUGS } from "../../lib/data";

// ─── Motif density data (mirrors MotifMapTab — 8 motifs × 44 chapters) ─────────
const MOTIFS = [
  { id: "blood",       density: [7,4,2,1,3,2,3,9,8,9,6,5,4,3,8,5,4,3,3,3,4,3,6,3,4,7,3,3,5,7,6,5,3,3,8,7,5,5,10,4,3,4,5,6] },
  { id: "prayer",      density: [9,5,1,0,4,2,8,2,4,2,3,7,9,3,2,3,3,2,2,3,2,5,8,2,3,3,2,2,4,4,5,4,5,3,5,4,3,7,5,6,10,4,3,9] },
  { id: "mathematics", density: [2,1,9,8,2,2,1,2,1,3,7,5,2,1,1,3,2,7,5,2,4,3,2,2,3,2,3,2,3,2,2,2,3,2,10,3,2,2,3,2,2,2,2,3] },
  { id: "fire",        density: [3,2,4,2,2,2,3,6,5,7,4,3,3,3,6,4,3,3,3,3,3,3,5,5,4,6,3,5,5,8,8,5,4,3,6,8,5,6,10,4,3,4,4,5] },
  { id: "copper",      density: [2,3,5,7,3,4,2,7,6,8,4,3,3,3,5,4,3,5,4,3,5,4,3,4,4,6,4,5,4,6,5,4,3,3,5,4,4,4,6,3,2,3,3,4] },
  { id: "water",       density: [4,9,2,1,5,3,4,4,5,3,3,3,2,3,3,5,4,3,3,3,3,3,6,3,4,4,5,4,3,4,4,4,3,3,4,4,4,5,3,3,4,4,3,5] },
  { id: "skin",        density: [5,3,3,2,3,4,6,4,5,4,4,5,4,4,3,5,5,5,5,6,4,3,3,4,4,7,5,4,4,4,4,5,3,3,5,5,4,4,5,4,4,4,5,6] },
  { id: "flower",      density: [9,5,0,0,2,1,4,1,2,1,2,3,2,2,1,2,3,1,2,2,2,2,4,2,2,3,2,1,2,2,2,3,2,2,3,3,3,4,3,3,8,5,4,7] },
];

const TOTAL_MOTIFS = MOTIFS.length;

// Audit score derivation per chapter:
// - Base: has omega score (+40 pts)
// - Has all 5 sub-scores (rrp, cls, sii, bis, mrf) (+30 pts)
// - No CRIT bug (-25 pts), no HIGH bug (-15 pts)
// - Not missing (+30 pts completion bonus)
function auditScore(ch) {
  const bugs = CHAPTER_BUGS.filter(b => b.ch === ch.ch && !b.fixed);
  const critBug = bugs.some(b => b.sev === "CRIT");
  const highBug = bugs.some(b => b.sev === "HIGH");
  const isMissing = !!ch.isMissing;

  let score = 0;
  if (ch.omega) score += 40;
  if (ch.rrp && ch.cls && ch.sii && ch.bis && ch.mrf) score += 30;
  if (!isMissing) score += 30;
  if (critBug) score -= 25;
  if (highBug) score -= 15;
  return Math.max(0, Math.min(100, score));
}

// Motif mapping score per chapter:
// % of motifs that have a non-zero density value for this chapter
function motifScore(chIndex) {
  const mapped = MOTIFS.filter(m => (m.density[chIndex] || 0) > 0).length;
  return Math.round((mapped / TOTAL_MOTIFS) * 100);
}

const ACT_COLORS = { I: "#f59e0b", II: "#60a5fa", III: "#14b8a6" };

function DualBar({ audit, motif, actColor }) {
  return (
    <div className="space-y-0.5">
      {/* Audit bar */}
      <div className="flex items-center gap-1.5">
        <div className="w-8 text-[7px] font-mono text-muted-foreground text-right flex-shrink-0">AUD</div>
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${audit}%`,
              background: audit >= 90 ? "#14b8a6" : audit >= 70 ? actColor : audit >= 50 ? "#f59e0b" : "#ef4444",
            }}
          />
        </div>
        <div className="w-6 text-[7px] font-mono text-right flex-shrink-0"
          style={{ color: audit >= 90 ? "#14b8a6" : audit >= 70 ? actColor : "#ef4444" }}>
          {audit}%
        </div>
      </div>
      {/* Motif bar */}
      <div className="flex items-center gap-1.5">
        <div className="w-8 text-[7px] font-mono text-muted-foreground text-right flex-shrink-0">MOT</div>
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${motif}%`,
              background: motif >= 90 ? "#a855f7" : motif >= 70 ? "#a855f7cc" : motif >= 50 ? "#a855f777" : "#6b7280",
            }}
          />
        </div>
        <div className="w-6 text-[7px] font-mono text-right flex-shrink-0"
          style={{ color: motif >= 70 ? "#a855f7" : "#6b7280" }}>
          {motif}%
        </div>
      </div>
    </div>
  );
}

export default function ChapterAuditBars({ compact = false }) {
  const data = CHAPTERS.map((ch, i) => ({
    ch,
    audit: auditScore(ch),
    motif: motifScore(i),
    actColor: ACT_COLORS[ch.act],
  }));

  const avgAudit = Math.round(data.reduce((s, d) => s + d.audit, 0) / data.length);
  const avgMotif = Math.round(data.reduce((s, d) => s + d.motif, 0) / data.length);
  const fullyAudited = data.filter(d => d.audit >= 90).length;
  const fullyMapped  = data.filter(d => d.motif >= 90).length;

  // Group by act
  const acts = ["I", "II", "III"];

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-teal/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-black font-mono text-teal">{avgAudit}%</div>
          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">Avg Audit Completeness</div>
        </div>
        <div className="bg-card border border-purple/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-black font-mono text-purple">{avgMotif}%</div>
          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">Avg Motif Coverage</div>
        </div>
        <div className="bg-card border border-teal/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-black font-mono text-teal">{fullyAudited}<span className="text-sm">/44</span></div>
          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">Fully Audited (≥90%)</div>
        </div>
        <div className="bg-card border border-purple/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-black font-mono text-purple">{fullyMapped}<span className="text-sm">/44</span></div>
          <div className="text-[9px] text-muted-foreground font-mono mt-0.5">Fully Mapped (≥90%)</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[9px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-teal inline-block" /><span className="font-bold text-teal">AUD</span> = Audit completeness (omega scored, sub-metrics, no critical bugs)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-purple inline-block" /><span className="font-bold text-purple">MOT</span> = Motif mapping coverage ({TOTAL_MOTIFS} motifs tracked)</span>
      </div>

      {/* Per-act breakdowns */}
      {acts.map(act => {
        const actData = data.filter(d => d.ch.act === act);
        const actAvgAudit = Math.round(actData.reduce((s, d) => s + d.audit, 0) / actData.length);
        const actAvgMotif = Math.round(actData.reduce((s, d) => s + d.motif, 0) / actData.length);
        const actColor = ACT_COLORS[act];
        const actLabel = act === "I" ? "Ch.1–16" : act === "II" ? "Ch.17–31" : "Ch.32–44";

        return (
          <div key={act} className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Act header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border"
              style={{ borderLeftWidth: 3, borderLeftColor: actColor, borderLeftStyle: "solid" }}>
              <div>
                <span className="text-xs font-black font-mono" style={{ color: actColor }}>Act {act}</span>
                <span className="text-[10px] text-muted-foreground font-mono ml-2">{actLabel} · {actData.length} chapters</span>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-sm font-black font-mono text-teal">{actAvgAudit}%</div>
                  <div className="text-[8px] text-muted-foreground font-mono">Avg Audit</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-black font-mono text-purple">{actAvgMotif}%</div>
                  <div className="text-[8px] text-muted-foreground font-mono">Avg Motif</div>
                </div>
              </div>
            </div>

            {/* Chapter rows */}
            <div className="divide-y divide-border/40">
              {actData.map(({ ch, audit, motif, actColor: ac }) => {
                const bugs = CHAPTER_BUGS.filter(b => b.ch === ch.ch && !b.fixed);
                const critBug = bugs.some(b => b.sev === "CRIT");
                const highBug = bugs.some(b => b.sev === "HIGH");
                return (
                  <div key={ch.ch} className="grid grid-cols-[36px_1fr_200px] gap-3 items-center px-4 py-2 hover:bg-secondary/20 transition-colors">
                    {/* Chapter number */}
                    <div className="text-[10px] font-black font-mono text-muted-foreground text-right">
                      Ch.{ch.ch}
                    </div>
                    {/* Title + flags */}
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold font-sans text-foreground truncate">{ch.title}</div>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {critBug && <span className="text-[7px] px-1 py-px rounded font-mono font-bold text-red bg-red/10 border border-red/20">CRIT BUG</span>}
                        {highBug && !critBug && <span className="text-[7px] px-1 py-px rounded font-mono font-bold text-orange bg-orange/10 border border-orange/20">HIGH BUG</span>}
                        {ch.isMissing && <span className="text-[7px] px-1 py-px rounded font-mono font-bold text-red bg-red/10 border border-red/20">MISSING</span>}
                        <span className="text-[7px] px-1 py-px rounded font-mono text-gold bg-gold/10 border border-gold/20">Ω{ch.omega}</span>
                      </div>
                    </div>
                    {/* Dual bars */}
                    <div>
                      <DualBar audit={audit} motif={motif} actColor={ac} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}