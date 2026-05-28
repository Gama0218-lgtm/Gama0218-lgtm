/**
 * src/components/OmegaCLSTrendTab.jsx
 * 📈 Ω/CLS Trend — dual score lines across all 45 chapters with act bands,
 * reference means, red dip markers (≥ 1.5 pts below mean), and a per-act
 * summary footer so pacing dips are visible at a glance.
 */

import React, { useMemo, useState } from "react";
import {
  CHAPTER_SCORES, ACT_BANDS, REFERENCE_MEANS, actSummary, notableDips,
} from "../lib/chapterScores";

const OMEGA_DIP = 1.5;   // Ω points below manuscript Ω mean
const CLS_DIP   = 8.0;   // CLS points below manuscript CLS mean

// SVG layout
const W = 960;
const H = 380;
const PAD = { top: 24, right: 28, bottom: 56, left: 52 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

// Real workbook range — Ω lives 105-110, CLS lives 75-99
const Y_MIN = 70;
const Y_MAX = 112;

const ACT_TINT = {
  teal:   "rgba(46, 196, 182, 0.10)",
  purple: "rgba(168, 123, 219, 0.10)",
  gold:   "rgba(239, 179, 68, 0.10)",
};
const ACT_BORDER = {
  teal:   "rgba(46, 196, 182, 0.55)",
  purple: "rgba(168, 123, 219, 0.55)",
  gold:   "rgba(239, 179, 68, 0.55)",
};
const ACT_TEXT = {
  teal:   "#1ec9b0",
  purple: "#a87bdb",
  gold:   "#efb344",
};

function xFor(chapterId) {
  return PAD.left + ((chapterId - 1) / (CHAPTER_SCORES.length - 1)) * PLOT_W;
}
function yFor(score) {
  const clamped = Math.max(Y_MIN, Math.min(Y_MAX, score));
  return PAD.top + (1 - (clamped - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;
}

function pathFor(key) {
  return CHAPTER_SCORES
    .filter((c) => c[key] != null)
    .map((c, i) => `${i === 0 ? "M" : "L"}${xFor(c.id).toFixed(2)},${yFor(c[key]).toFixed(2)}`)
    .join(" ");
}

export default function OmegaCLSTrendTab() {
  const [hover, setHover] = useState(null);
  const omegaMean = REFERENCE_MEANS.omega;
  const clsMean   = REFERENCE_MEANS.cls;
  const acts = useMemo(() => actSummary(OMEGA_DIP, CLS_DIP), []);
  const dips = useMemo(() => notableDips(OMEGA_DIP, CLS_DIP), []);

  const omegaPath = pathFor("omega");
  const clsPath   = pathFor("cls");

  // Y ticks every 10 — covers both Ω band (105-110) and CLS band (75-99)
  const yTicks = [];
  for (let v = 70; v <= 110; v += 10) yTicks.push(v);
  // Add Ω-band callouts at 105 and 110 since they're the meaningful thresholds
  const omegaTicks = [105, 110];

  // X axis ticks: chapters in 5s + act boundaries
  const xTicks = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45];

  const omegaDips = CHAPTER_SCORES.filter((c) => omegaMean - c.omega >= OMEGA_DIP);
  const clsDips   = CHAPTER_SCORES.filter((c) => clsMean   - c.cls   >= CLS_DIP);

  return (
    <div className="omega-cls-trend">
      <h2 style={{ margin: "0 0 6px", fontSize: "1.4rem" }}>📈 Ω / CLS Trend</h2>
      <p className="intro" style={{ marginTop: 0 }}>
        Audit Quality (<strong style={{ color: "#1ec9b0" }}>Ω</strong>, 105-110 band) and
        code-switch / cohesion load (<strong style={{ color: "#a87bdb" }}>CLS</strong>, 75-99 band)
        plotted across all 45 canonical chapters of <em>SGT George Ramos</em>. Act bands group
        the structure; dashed lines show the manuscript mean for each metric; red dots flag
        chapters that fall ≥ {OMEGA_DIP} pts below Ω mean or ≥ {CLS_DIP} pts below CLS mean —
        those are the priority remediation candidates.
      </p>

      {/* HEADER METRICS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12, margin: "16px 0 18px",
      }}>
        <div style={metricCardStyle("#1ec9b0")}>
          <div style={metricLabel}>Ω MEAN</div>
          <div style={metricValue("#1ec9b0")}>{omegaMean.toFixed(2)}</div>
          <div style={metricHint}>across 45 chapters</div>
        </div>
        <div style={metricCardStyle("#a87bdb")}>
          <div style={metricLabel}>CLS MEAN</div>
          <div style={metricValue("#a87bdb")}>{clsMean.toFixed(2)}</div>
          <div style={metricHint}>chapter-level coherence</div>
        </div>
        <div style={metricCardStyle("#e0524e")}>
          <div style={metricLabel}>NOTABLE DIPS</div>
          <div style={metricValue("#e0524e")}>{dips.length}</div>
          <div style={metricHint}>Ω ≥ {OMEGA_DIP} or CLS ≥ {CLS_DIP} below mean</div>
        </div>
        <div style={metricCardStyle("#efb344")}>
          <div style={metricLabel}>WEAKEST CHAPTER</div>
          <div style={metricValue("#efb344")}>
            {dips.length ? `Ch. ${dips.slice().sort((a, b) => b.drop - a.drop)[0].chapter}` : "—"}
          </div>
          <div style={metricHint}>{dips.length ? dips.slice().sort((a, b) => b.drop - a.drop)[0].title : "no dips found"}</div>
        </div>
      </div>

      {/* CHART */}
      <div style={{
        background: "linear-gradient(180deg, #11141c 0%, #0e1118 100%)",
        border: "1px solid #232a36",
        borderRadius: 12,
        padding: 12,
        position: "relative",
        overflow: "hidden",
      }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {/* ACT BANDS */}
          {ACT_BANDS.map((act) => {
            const x1 = xFor(act.from) - (act.from === 1 ? 0 : (xFor(act.from) - xFor(act.from - 1)) / 2);
            const x2 = xFor(act.to)   + (act.to === 45 ? 0 : (xFor(act.to + 1) - xFor(act.to)) / 2);
            return (
              <g key={act.id}>
                <rect
                  x={x1} y={PAD.top}
                  width={Math.max(1, x2 - x1)} height={PLOT_H}
                  fill={ACT_TINT[act.color]}
                  stroke={ACT_BORDER[act.color]}
                  strokeDasharray="3 4"
                  strokeOpacity="0.6"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={PAD.top + 14}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                  fill={ACT_TEXT[act.color]}
                  fontWeight="700"
                  letterSpacing="0.15em"
                >
                  {act.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* GRID + Y AXIS */}
          {yTicks.map((v) => (
            <g key={v}>
              <line
                x1={PAD.left} x2={W - PAD.right}
                y1={yFor(v)} y2={yFor(v)}
                stroke="#232a36" strokeWidth="1"
                strokeDasharray={v === Math.round(omegaMean) || v === Math.round(clsMean) ? "none" : "2 3"}
                opacity="0.45"
              />
              <text x={PAD.left - 8} y={yFor(v) + 3} textAnchor="end" fontSize="10" fill="#8a93a3" fontFamily="ui-monospace, monospace">
                {v.toFixed(0)}
              </text>
            </g>
          ))}

          {/* X AXIS */}
          {xTicks.map((c) => (
            <g key={c}>
              <line x1={xFor(c)} x2={xFor(c)} y1={PAD.top + PLOT_H} y2={PAD.top + PLOT_H + 4} stroke="#475264" />
              <text x={xFor(c)} y={PAD.top + PLOT_H + 16} textAnchor="middle" fontSize="10" fill="#8a93a3" fontFamily="ui-monospace, monospace">
                {c}
              </text>
            </g>
          ))}
          <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#8a93a3" fontFamily="ui-monospace, monospace" letterSpacing="0.18em">
            CHAPTER NUMBER
          </text>

          {/* REFERENCE MEAN LINES */}
          <line
            x1={PAD.left} x2={W - PAD.right}
            y1={yFor(omegaMean)} y2={yFor(omegaMean)}
            stroke="#1ec9b0" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.7"
          />
          <text x={W - PAD.right - 4} y={yFor(omegaMean) - 4} textAnchor="end" fontSize="10" fill="#1ec9b0" fontFamily="ui-monospace, monospace">
            Ω mean {omegaMean.toFixed(2)}
          </text>
          <line
            x1={PAD.left} x2={W - PAD.right}
            y1={yFor(clsMean)} y2={yFor(clsMean)}
            stroke="#a87bdb" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.7"
          />
          <text x={W - PAD.right - 4} y={yFor(clsMean) + 12} textAnchor="end" fontSize="10" fill="#a87bdb" fontFamily="ui-monospace, monospace">
            CLS mean {clsMean.toFixed(2)}
          </text>

          {/* LINES */}
          <path d={omegaPath} fill="none" stroke="#1ec9b0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d={clsPath}   fill="none" stroke="#a87bdb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0" opacity="0.95" />

          {/* CHAPTER DOTS — all chapters (subtle) */}
          {CHAPTER_SCORES.map((c) => (
            <g key={`pt-${c.id}`} onMouseEnter={() => setHover(c)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <circle cx={xFor(c.id)} cy={yFor(c.omega)} r="2.5" fill="#1ec9b0" />
              <circle cx={xFor(c.id)} cy={yFor(c.cls)}   r="2.5" fill="#a87bdb" />
            </g>
          ))}

          {/* RED DIP MARKERS */}
          {omegaDips.map((c) => (
            <g key={`omd-${c.id}`}>
              <circle cx={xFor(c.id)} cy={yFor(c.omega)} r="5.5" fill="none" stroke="#e0524e" strokeWidth="2" />
              <circle cx={xFor(c.id)} cy={yFor(c.omega)} r="3"   fill="#e0524e" />
            </g>
          ))}
          {clsDips.map((c) => (
            <g key={`cld-${c.id}`}>
              <circle cx={xFor(c.id)} cy={yFor(c.cls)} r="5.5" fill="none" stroke="#e0524e" strokeWidth="2" />
              <circle cx={xFor(c.id)} cy={yFor(c.cls)} r="3"   fill="#e0524e" />
            </g>
          ))}

          {/* HOVER GUIDE */}
          {hover && (
            <g>
              <line
                x1={xFor(hover.id)} x2={xFor(hover.id)}
                y1={PAD.top} y2={PAD.top + PLOT_H}
                stroke="#eef4ff" strokeOpacity="0.4" strokeDasharray="2 3"
              />
              <rect
                x={Math.min(W - PAD.right - 180, Math.max(PAD.left, xFor(hover.id) + 8))}
                y={PAD.top + 6}
                width="170" height="56" rx="6"
                fill="#0b0d12" stroke="#232a36"
              />
              <text x={Math.min(W - PAD.right - 180, Math.max(PAD.left, xFor(hover.id) + 8)) + 8} y={PAD.top + 22} fontSize="11" fontFamily="ui-monospace, monospace" fill="#eef4ff" fontWeight="700">
                Ch. {hover.id} · {hover.title.slice(0, 18)}{hover.title.length > 18 ? "…" : ""}
              </text>
              <text x={Math.min(W - PAD.right - 180, Math.max(PAD.left, xFor(hover.id) + 8)) + 8} y={PAD.top + 38} fontSize="10" fontFamily="ui-monospace, monospace" fill="#1ec9b0">
                Ω {hover.omega.toFixed(2)}  (Δ {(hover.omega - omegaMean).toFixed(2)})
              </text>
              <text x={Math.min(W - PAD.right - 180, Math.max(PAD.left, xFor(hover.id) + 8)) + 8} y={PAD.top + 52} fontSize="10" fontFamily="ui-monospace, monospace" fill="#a87bdb">
                CLS {hover.cls.toFixed(2)}  (Δ {(hover.cls - clsMean).toFixed(2)})
              </text>
            </g>
          )}
        </svg>

        {/* LEGEND */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: "8px 12px 4px", color: "#8a93a3", fontFamily: "ui-monospace, monospace", fontSize: 11 }}>
          <span><span style={swatch("#1ec9b0")} />Ω (audit quality)</span>
          <span><span style={swatch("#a87bdb")} />CLS (chapter coherence)</span>
          <span><span style={{ ...swatch("transparent"), border: "2px solid #e0524e", width: 8, height: 8 }} />red dot · Ω dip ≥ {OMEGA_DIP} or CLS dip ≥ {CLS_DIP} below mean</span>
          <span><span style={{ ...swatch("transparent"), borderTop: "2px dashed #1ec9b0", width: 14, height: 0, marginRight: 6 }} />reference mean</span>
        </div>
      </div>

      {/* PER-ACT SUMMARY */}
      <h3 style={{ margin: "22px 0 10px", fontSize: "1rem", letterSpacing: "0.04em" }}>Per-act summary</h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}>
        {acts.map((a) => (
          <div key={a.id} style={{
            background: "#fff",
            border: `1px solid ${ACT_BORDER[a.color]}`,
            borderLeft: `4px solid ${ACT_TEXT[a.color]}`,
            borderRadius: 8,
            padding: 14,
            boxShadow: "0 1px 3px rgba(0,0,0,.05)",
          }}>
            <div style={{ fontSize: 11, color: ACT_TEXT[a.color], fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {a.label}
            </div>
            <div style={{ fontSize: 12, color: "#555", margin: "4px 0 12px" }}>
              Chapters {a.from}–{a.to}  ·  {a.chapters} total
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: "#7f8c8d", letterSpacing: "0.1em" }}>Ω MEAN</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1ec9b0" }}>{a.omegaMean.toFixed(2)}</div>
                <div style={{ fontSize: 10, color: a.deltaOmega >= 0 ? "#21924f" : "#b5302c" }}>
                  Δ {a.deltaOmega >= 0 ? "+" : ""}{a.deltaOmega.toFixed(2)} vs. all
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#7f8c8d", letterSpacing: "0.1em" }}>CLS MEAN</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#a87bdb" }}>{a.clsMean.toFixed(2)}</div>
                <div style={{ fontSize: 10, color: a.deltaCls >= 0 ? "#21924f" : "#b5302c" }}>
                  Δ {a.deltaCls >= 0 ? "+" : ""}{a.deltaCls.toFixed(2)} vs. all
                </div>
              </div>
            </div>
            <div style={{
              marginTop: 12, padding: "8px 10px", borderRadius: 6,
              background: a.omegaDips + a.clsDips > 0 ? "#fdecea" : "#eaf7ef",
              fontSize: 11, color: "#444",
            }}>
              <strong style={{ color: a.omegaDips + a.clsDips > 0 ? "#b5302c" : "#21924f" }}>
                {a.omegaDips + a.clsDips} dip{a.omegaDips + a.clsDips === 1 ? "" : "s"}
              </strong>
              {" · "}
              Ω {a.omegaDips} · CLS {a.clsDips}
            </div>
          </div>
        ))}
      </div>

      {/* NOTABLE DIPS LIST */}
      {dips.length > 0 && (
        <>
          <h3 style={{ margin: "22px 0 10px", fontSize: "1rem", letterSpacing: "0.04em" }}>Notable dips · Ω ≥ {OMEGA_DIP} or CLS ≥ {CLS_DIP} pts below manuscript mean</h3>
          <div style={{ background: "#fff", border: "1px solid #e3e7ee", borderRadius: 8, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8f9fa", color: "#7f8c8d", textAlign: "left" }}>
                  <th style={cellHead}>Chapter</th>
                  <th style={cellHead}>Title</th>
                  <th style={cellHead}>Metric</th>
                  <th style={cellHead}>Value</th>
                  <th style={cellHead}>Drop vs. mean</th>
                </tr>
              </thead>
              <tbody>
                {dips.slice().sort((a, b) => b.drop - a.drop).map((d, i) => (
                  <tr key={`${d.metric}-${d.chapter}-${i}`} style={{ borderTop: "1px solid #f0f2f5" }}>
                    <td style={cell}>Ch. {d.chapter}</td>
                    <td style={cell}>{d.title}</td>
                    <td style={{ ...cell, color: d.metric === "omega" ? "#1ec9b0" : "#a87bdb", fontWeight: 700 }}>
                      {d.metric === "omega" ? "Ω" : "CLS"}
                    </td>
                    <td style={cell}>{d.value.toFixed(2)}</td>
                    <td style={{ ...cell, color: "#b5302c", fontWeight: 700 }}>−{d.drop.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- inline style helpers ----------
const metricLabel = { fontSize: 10, letterSpacing: "0.18em", color: "#7f8c8d", fontWeight: 700 };
const metricHint  = { fontSize: 11, color: "#7f8c8d", marginTop: 4 };
const cellHead    = { padding: "10px 12px", fontSize: 11, letterSpacing: "0.1em" };
const cell        = { padding: "10px 12px" };

function metricValue(color) {
  return { fontSize: 26, fontWeight: 800, color, margin: "6px 0 0" };
}
function metricCardStyle(accent) {
  return {
    padding: 14,
    borderRadius: 10,
    background: "#fff",
    border: "1px solid #e3e7ee",
    borderLeft: `4px solid ${accent}`,
    boxShadow: "0 1px 3px rgba(0,0,0,.04)",
  };
}
function swatch(color) {
  return {
    display: "inline-block",
    width: 10, height: 10, borderRadius: 2,
    background: color,
    marginRight: 6, verticalAlign: "middle",
  };
}
