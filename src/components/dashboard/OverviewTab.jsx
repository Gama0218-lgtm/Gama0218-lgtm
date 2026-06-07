import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import DashCard from "./DashCard";
import ChapterListItem from "./ChapterListItem";
import ActionItem from "./ActionItem";
import ActProgress from "./ActProgress";
import ScoreBar from "./ScoreBar";
import { CHAPTERS, SCORED_CHAPTERS, QUICK_ACTIONS, STATS } from "../../lib/data";

const ACT_COLORS = { I: "#F5C842", II: "#4A9EFF", III: "#1CCFB4" };

const omegaData = CHAPTERS.filter(c => !c.isMissing && c.omega).map(c => ({
  label: `Ch${c.ch}`,
  omega: c.omega,
  act: c.act,
  title: c.title,
}));

const OmegaTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="font-bold text-foreground">{d.label}: {d.title}</div>
      <div className="text-gold font-black font-mono mt-1">Ω{d.omega}</div>
    </div>
  );
};

// Publication countdown rings
function Countdown({ days, label, color }) {
  const maxDays = 90;
  const pct = Math.max(0, Math.min(1, days / maxDays));
  const r = 28, circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#1A2640" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text x="36" y="38" textAnchor="middle" fill={color} fontSize="13" fontWeight="900" fontFamily="monospace">{days}d</text>
      </svg>
      <div className="text-[9px] text-muted-foreground font-mono text-center">{label}</div>
    </div>
  );
}

export default function OverviewTab() {
  return (
    <div className="animate-slide-up">
      {/* Audit Banner */}
      <div className="bg-teal/5 border border-teal/30 rounded-lg p-4 mb-2">
        <div className="text-sm font-bold text-teal font-mono mb-1">
          SGTRamos_SPSS_Tracking_HONEST_v1 · 2026-06-06 · 45 chapters · 243,218 words [VERIFIED wc -w]
        </div>
        <div className="text-xs text-foreground/60 font-sans leading-relaxed">
          Ω = 71.443 + 0.124·CLS + 0.118·BIS + 0.089·SII + 0.067·MRF — arithmetic correct, inputs unverified. R²=0.947 [PARTIAL — internal consistency of AI-scored inputs only].
        </div>
      </div>
      {/* SPSS Governance Banner */}
      <div className="bg-orange/5 border border-orange/30 rounded-lg px-4 py-2 mb-4 flex items-start gap-2">
        <span className="text-orange font-black text-[10px] font-mono flex-shrink-0 mt-0.5">⚠ SPSS</span>
        <div className="text-[9px] font-mono text-foreground/60 leading-relaxed">
          <span className="text-orange font-bold">[UNVERIFIED CONSTRUCT]</span> Omega, CLS, BIS, SII, MRF, tier labels, RRP — AI-assigned, not measured from text. &nbsp;
          <span className="text-teal font-bold">[VERIFIED]</span> Word count, dialogue %, readability, passive %, code-switch %. &nbsp;
          <span className="text-blue font-bold">[PARTIAL]</span> SPSS/Cronbach/R²/CL-MoE — consistency statistics on unverified inputs. Do not cite Omega as a quality verdict.
        </div>
      </div>

      {/* Countdown Row */}
      <div className="flex gap-4 items-center justify-center mb-4 p-4 bg-card border border-border rounded-lg">
        <Countdown days={STATS.daysPub} label="To Publication" color="#FF5C5C" />
        <div className="h-12 w-px bg-border" />
        <Countdown days={STATS.daysCHC} label="To CHC Briefing" color="#F5B942" />
        <div className="h-12 w-px bg-border ml-2 mr-4" />
        <div className="flex-1 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl font-black text-gold font-mono">{STATS.avgOmega}</div>
            <div className="text-[9px] text-muted-foreground font-mono">Avg Omega</div>
            <div className="text-[7px] text-orange/70 font-mono">[UNVERIFIED]</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-teal font-mono">{STATS.totalWords.toLocaleString()}</div>
            <div className="text-[9px] text-muted-foreground font-mono">Total Words</div>
            <div className="text-[7px] text-teal/70 font-mono">[VERIFIED wc -w]</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-blue font-mono">{STATS.elite}/{STATS.chapters}</div>
            <div className="text-[9px] text-muted-foreground font-mono">Omega Elite</div>
            <div className="text-[7px] text-orange/70 font-mono">[UNVERIFIED tier]</div>
          </div>
        </div>
      </div>

      {/* Omega Mini Chart */}
      <DashCard title="Omega Score Landscape — All 45 Chapters [UNVERIFIED CONSTRUCT — REPORT ONLY]" accent="gold">
        <div className="text-[10px] text-muted-foreground font-sans mb-2">Gold=Act I · Blue=Act II · Teal=Act III · Ω values are AI-assigned composites, not measured. Arithmetic correct; inputs unverified.</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={omegaData} margin={{ top: 2, right: 4, left: -20, bottom: 0 }} barCategoryGap="15%">
            <XAxis dataKey="label" tick={false} axisLine={false} tickLine={false} />
            <YAxis domain={[103, 111]} tick={{ fill: "#6B8BAA", fontSize: 7, fontFamily: "monospace" }} tickLine={false} axisLine={false} />
            <Tooltip content={<OmegaTooltip />} cursor={{ fill: "#1A264044" }} />
            <Bar dataKey="omega" radius={[2, 2, 0, 0]}>
              {omegaData.map((entry, i) => (
                <Cell key={i} fill={ACT_COLORS[entry.act] || "#4A9EFF"} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </DashCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Column 1 */}
        <div>
          <DashCard title={`All ${SCORED_CHAPTERS.length} Scored Chapters — ${STATS.elite} Omega Elite`} accent="gold">
            <div className="max-h-[440px] overflow-y-auto pr-1">
              {CHAPTERS.map((ch) => (
                <ChapterListItem key={ch.ch} {...ch} />
              ))}
            </div>
          </DashCard>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <DashCard title="Action Required" accent="red">
            {QUICK_ACTIONS.slice(0, 4).map((action, i) => (
              <ActionItem key={i} title={`${action.priority}. ${action.action}`} description={`${action.impact} · ${action.time}`} severity={i === 0 ? "critical" : i === 1 ? "warning" : "caution"} />
            ))}
          </DashCard>
          <DashCard title="Act Performance — Ω [UNVERIFIED CONSTRUCT]" accent="purple">
            <div className="text-[8px] font-mono text-orange/70 mb-2">Omega averages below are AI-assigned constructs, not measured quality verdicts.</div>
            {[
              { name:"Act I",  chapters:16, scored:16, avgOmega:107.2, color:"gold" },
              { name:"Act II", chapters:15, scored:15, avgOmega:107.3, color:"blue" },
              { name:"Act III",chapters:14, scored:14, avgOmega:107.4, color:"teal" },
            ].map((act) => (
              <ActProgress key={act.name} {...act} />
            ))}
          </DashCard>
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <DashCard title="Score Summary" accent="blue">
            <div className="text-[8px] font-mono text-orange/80 mb-2 bg-orange/5 rounded px-2 py-1">
              ⚠ Omega/CLS/SII/BIS = [UNVERIFIED CONSTRUCT] · CL-MoE = [PARTIAL] · Report only, never gate
            </div>
            <ScoreBar label="Avg Omega [UNVERIFIED]" value={STATS.avgOmega} color="gold" />
            <ScoreBar label="Avg CLS [UNVERIFIED INPUT]" value={STATS.avgCLS} color="purple" />
            <ScoreBar label="Avg SII [UNVERIFIED INPUT]" value={STATS.avgSII} color="cyan" />
            <ScoreBar label="Avg BIS [UNVERIFIED INPUT]" value={STATS.avgBIS} color="orange" />
            <ScoreBar label="CL-MoE [PARTIAL]" value={STATS.clmoeOverall} maxValue={0.25} color="blue" displayValue="0.048" />
          </DashCard>

          <DashCard title="Platform" accent="teal">
            <div className="space-y-2">
              <div className="p-2.5 bg-teal/5 rounded-md">
                <div className="text-xs font-bold text-teal font-mono">n8n LIVE — qt360.app.n8n.cloud</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-0.5">3 workflows active — PID 6628</div>
              </div>
              <div className="p-2.5 bg-gold/5 rounded-md">
                <div className="text-xs font-bold text-gold font-mono">CHC Briefing May 18 — {STATS.daysCHC} days</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-0.5">Calendar confirmed</div>
              </div>
              <div className="p-2.5 bg-red/5 rounded-md">
                <div className="text-xs font-bold text-red font-mono">3 FOIAs OVERDUE</div>
                <div className="text-[10px] text-muted-foreground font-sans mt-0.5">VA BIRLS, DHS ENFORCE, INAI Mexico</div>
              </div>
            </div>
          </DashCard>
        </div>
      </div>
    </div>
  );
}