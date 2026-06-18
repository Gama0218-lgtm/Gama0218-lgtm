import { useState } from "react";
import { X, FileText, Download, Loader2, CheckCircle } from "lucide-react";
import {
  CHAPTERS, STATS, QUICK_ACTIONS, CHAPTER_BUGS,
  CHARACTER_BIBLE, CONVERGENCE_STREAMS, REGRESSION,
  EMOTION_DATA, NERO_DATA, NDR_DATA
} from "../../lib/data";

const GENERATED = new Date().toLocaleDateString("en-US", {
  year: "numeric", month: "long", day: "numeric"
});

// Sections the user can toggle
const EXPORT_SECTIONS = [
  { id: "summary",    label: "Executive Summary",         default: true  },
  { id: "scorecard",  label: "Full Chapter Scorecard",    default: true  },
  { id: "characters", label: "Character Profiles & CL-MoE", default: true },
  { id: "bugs",       label: "Editorial Bug Ledger",      default: true  },
  { id: "actions",    label: "Priority Action Queue",     default: true  },
  { id: "regression", label: "Omega Regression Model",    default: false },
  { id: "nero",       label: "NERO Analysis",             default: false },
  { id: "ndr",        label: "Narrative/Dialogue Ratios", default: false },
  { id: "convergence",label: "TruthEngine360 Convergence",default: false },
  { id: "emotion",    label: "Emotion Data Table",        default: false },
];

function usePDFExport(selected) {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError]   = useState(null);

  const run = async () => {
    setStatus("loading");
    setError(null);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const PW = 210, PH = 297;
      const ML = 15, MR = 15, MT = 15, MB = 15;
      const CW = PW - ML - MR;
      let y = MT;

      const pageCheck = (needed = 10) => {
        if (y + needed > PH - MB) { doc.addPage(); y = MT; }
      };

      // ── Colours ──────────────────────────────────────────────────
      const GOLD   = [245, 158, 11];
      const TEAL   = [20, 184, 166];
      const RED    = [239, 68, 68];
      const PURPLE = [168, 85, 247];
      const BLUE   = [96, 165, 250];
      const ORANGE = [251, 146, 60];
      const DARK   = [15, 23, 42];
      const MID    = [51, 65, 85];
      const LIGHT  = [148, 163, 184];
      const WHITE  = [255, 255, 255];
      const BGCARD = [22, 33, 55];

      // ── Helpers ───────────────────────────────────────────────────
      const setFont = (size, style = "normal", color = DARK) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", style);
        doc.setTextColor(...color);
      };

      const drawRect = (x, yw, w, h, color, rounded = false) => {
        doc.setFillColor(...color);
        if (rounded) doc.roundedRect(x, yw, w, h, 2, 2, "F");
        else doc.rect(x, yw, w, h, "F");
      };

      const sectionHeader = (title, accent = GOLD) => {
        pageCheck(14);
        drawRect(ML, y, CW, 8, [...accent.map(c => Math.min(c + 180, 255)), 0.08].slice(0, 3));
        doc.setDrawColor(...accent);
        doc.setLineWidth(0.5);
        doc.line(ML, y, ML + CW, y);
        setFont(10, "bold", accent);
        doc.text(title, ML + 3, y + 5.5);
        y += 11;
      };

      const subHeader = (title, color = MID) => {
        pageCheck(8);
        setFont(7, "bold", color);
        doc.text(title.toUpperCase(), ML, y);
        y += 5;
      };

      const bodyText = (txt, indent = 0, color = MID) => {
        pageCheck(6);
        setFont(7, "normal", color);
        const lines = doc.splitTextToSize(txt, CW - indent);
        doc.text(lines, ML + indent, y);
        y += lines.length * 4.2;
      };

      const hrule = (color = [203, 213, 225]) => {
        pageCheck(3);
        doc.setDrawColor(...color);
        doc.setLineWidth(0.2);
        doc.line(ML, y, ML + CW, y);
        y += 3;
      };

      const statBox = (label, value, color, x, bw) => {
        drawRect(x, y, bw - 2, 14, [30, 41, 59]);
        doc.setDrawColor(...color);
        doc.setLineWidth(0.4);
        doc.rect(x, y, bw - 2, 14);
        setFont(13, "bold", color);
        doc.text(String(value), x + (bw - 2) / 2, y + 7.5, { align: "center" });
        setFont(5.5, "normal", LIGHT);
        doc.text(label.toUpperCase(), x + (bw - 2) / 2, y + 12, { align: "center" });
      };

      const tableRow = (cells, widths, rowY, isHeader = false, bgColor = null) => {
        if (bgColor) {
          doc.setFillColor(...bgColor);
          doc.rect(ML, rowY, CW, 5.5, "F");
        }
        let cx = ML;
        cells.forEach((cell, i) => {
          const w = widths[i];
          setFont(isHeader ? 5.5 : 6, isHeader ? "bold" : "normal", isHeader ? LIGHT : MID);
          const txt = String(cell ?? "—").substring(0, Math.floor(w / 1.8));
          doc.text(txt, cx + 1.5, rowY + 3.8);
          cx += w;
        });
      };

      // ════════════════════════════════════════════════════════════
      // COVER PAGE
      // ════════════════════════════════════════════════════════════
      drawRect(0, 0, PW, PH, DARK);
      // Gold accent stripe
      drawRect(0, 0, 6, PH, GOLD);
      // Title block
      setFont(22, "bold", GOLD);
      doc.text("SGT George Ramos:", ML + 8, 50);
      setFont(22, "bold", WHITE);
      doc.text("The Mathematics of Vietnam", ML + 8, 64);
      setFont(10, "normal", LIGHT);
      doc.text("LITCENTRAL v7 — Full Manuscript Intelligence Report", ML + 8, 75);

      // Cover stats
      const coverStats = [
        ["CHAPTERS", "44"], ["WORDS", STATS.totalWords.toLocaleString()],
        ["AVG OMEGA", STATS.avgOmega], ["CL-MOE DRIFT", "0.048"],
      ];
      coverStats.forEach(([label, val], i) => {
        const bx = ML + 8 + i * 47;
        const by = 88;
        doc.setFillColor(30, 41, 59);
        doc.roundedRect(bx, by, 43, 18, 2, 2, "F");
        doc.setDrawColor(...GOLD);
        doc.setLineWidth(0.3);
        doc.roundedRect(bx, by, 43, 18, 2, 2, "S");
        setFont(13, "bold", GOLD);
        doc.text(String(val), bx + 21.5, by + 9, { align: "center" });
        setFont(5.5, "normal", LIGHT);
        doc.text(label, bx + 21.5, by + 15, { align: "center" });
      });

      // Cover metadata
      setFont(7, "normal", LIGHT);
      doc.text(`Generated: ${GENERATED}`, ML + 8, 115);
      doc.text("Manuscript Version 5 · AUMER Foundation · TruthEngine360", ML + 8, 120);
      doc.text("CHC Briefing: May 18, 2026", ML + 8, 125);

      // Cover section list
      setFont(7, "bold", GOLD);
      doc.text("REPORT CONTENTS", ML + 8, 145);
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.2);
      doc.line(ML + 8, 147, ML + 80, 147);
      setFont(6.5, "normal", LIGHT);
      EXPORT_SECTIONS.filter(s => selected[s.id]).forEach((s, i) => {
        doc.text(`§${i + 1}  ${s.label}`, ML + 8, 151 + i * 6);
      });

      // Start body pages
      doc.addPage();
      y = MT;

      let sectionNum = 1;

      // ════════════════════════════════════════════════════════════
      // §1 EXECUTIVE SUMMARY
      // ════════════════════════════════════════════════════════════
      if (selected.summary) {
        sectionHeader(`§${sectionNum++}  EXECUTIVE SUMMARY`, GOLD);

        // Stat row
        const bw = CW / 4;
        statBox("Avg Omega Score", STATS.avgOmega, GOLD, ML, bw);
        statBox("Total Words", STATS.totalWords.toLocaleString(), [...BLUE], ML + bw, bw);
        statBox("Chapters Scored", "44 / 44", TEAL, ML + bw * 2, bw);
        statBox("Open Bugs", CHAPTER_BUGS.filter(b => !b.fixed).length, RED, ML + bw * 3, bw);
        y += 17;

        y += 2;
        subHeader("Manuscript Status");
        bodyText(
          `Version 5 audit complete. All 44 chapters scored at Omega Elite tier (≥105). ` +
          `Average Omega of ${STATS.avgOmega} — the highest tier in the scoring framework. ` +
          `Two critical editorial issues remain: the Ch.9 Ramirez/Rodriguez name error and the ` +
          `missing Ch.40 bathroom prayer scene (~2,604 words).`
        );
        y += 2;
        subHeader("Omega Regression Formula  (R² = 0.947)");
        bodyText("Ω = 71.443 + 0.124(CLS) + 0.118(BIS) + 0.089(SII) + 0.067(MRF) + 0.041(RRP)");
        y += 2;
        subHeader("Key Deadlines");
        [
          [`CHC Briefing`, `May 18, 2026 — ${STATS.daysCHC} days`],
          [`Publication Target`, `${STATS.daysPub} days`],
          [`FOIA Overdue`, `3 agencies — VA BIRLS, DHS ENFORCE, INAI Mexico`],
          [`AUMER 2026 Audit`, `In progress — 7-stream convergence`],
        ].forEach(([k, v]) => {
          pageCheck(6);
          setFont(7, "bold", MID); doc.text(k + ":", ML + 2, y);
          setFont(7, "normal", LIGHT); doc.text(v, ML + 45, y);
          y += 5;
        });
        y += 3; hrule();
      }

      // ════════════════════════════════════════════════════════════
      // §2 CHAPTER SCORECARD
      // ════════════════════════════════════════════════════════════
      if (selected.scorecard) {
        sectionHeader(`§${sectionNum++}  FULL CHAPTER SCORECARD`, TEAL);

        const colW = [10, 58, 8, 9, 9, 9, 9, 9, 9, 18];
        const headers = ["Ch", "Title", "Act", "Ω", "RRP", "CLS", "SII", "BIS", "MRF", "Words"];

        tableRow(headers, colW, y, true, [20, 30, 50]);
        y += 6;

        CHAPTERS.filter(c => !c.isMissing).forEach((c, i) => {
          pageCheck(6);
          const bg = i % 2 === 0 ? [22, 33, 55] : [26, 38, 60];
          tableRow([
            c.ch, c.title, c.act, c.omega, c.rrp,
            c.cls, c.sii, c.bis, c.mrf, c.words?.toLocaleString()
          ], colW, y, false, bg);
          // Omega color indicator
          doc.setFillColor(...(c.omega >= 109 ? TEAL : c.omega >= 107 ? GOLD : BLUE));
          doc.roundedRect(ML + 68, y + 1, 7, 3.5, 0.5, 0.5, "F");
          setFont(5.5, "bold", WHITE);
          doc.text(String(c.omega), ML + 71.5, y + 3.4, { align: "center" });
          y += 5.5;
        });
        y += 3; hrule();
      }

      // ════════════════════════════════════════════════════════════
      // §3 CHARACTER PROFILES
      // ════════════════════════════════════════════════════════════
      if (selected.characters) {
        sectionHeader(`§${sectionNum++}  CHARACTER PROFILES & CL-MOE`, ORANGE);

        const colW = [52, 24, 24, 18, 62];
        tableRow(["Character", "Arc Status", "CL-MoE Drift", "Flag", "Notes"], colW, y, true, [20, 30, 50]);
        y += 6;

        CHARACTER_BIBLE.forEach((c, i) => {
          pageCheck(6);
          const bg = i % 2 === 0 ? [22, 33, 55] : [26, 38, 60];
          tableRow([c.name, c.arc, c.clmoe, c.flag ? "⚠ YES" : "—", c.note], colW, y, false, bg);
          y += 5.5;
        });
        y += 3; hrule();
      }

      // ════════════════════════════════════════════════════════════
      // §4 BUG LEDGER
      // ════════════════════════════════════════════════════════════
      if (selected.bugs) {
        sectionHeader(`§${sectionNum++}  EDITORIAL BUG LEDGER`, RED);

        const sevCounts = { CRIT: 0, HIGH: 0, MED: 0, LOW: 0 };
        CHAPTER_BUGS.forEach(b => { if (sevCounts[b.sev] !== undefined) sevCounts[b.sev]++; });

        // Mini stat row
        const bw2 = CW / 4;
        [["CRITICAL", sevCounts.CRIT, RED], ["HIGH", sevCounts.HIGH, ORANGE],
         ["MEDIUM",   sevCounts.MED,  GOLD], ["LOW",  sevCounts.LOW,  BLUE]
        ].forEach(([label, val, col], i) => statBox(label, val, col, ML + i * bw2, bw2));
        y += 17;

        const colW = [10, 26, 18, 126];
        tableRow(["Ch", "Type", "Severity", "Flag"], colW, y, true, [20, 30, 50]);
        y += 6;

        CHAPTER_BUGS.forEach((b, i) => {
          pageCheck(7);
          const sevColor = b.sev === "CRIT" ? RED : b.sev === "HIGH" ? ORANGE : b.sev === "MED" ? GOLD : BLUE;
          const bg = i % 2 === 0 ? [22, 33, 55] : [26, 38, 60];
          doc.setFillColor(...bg);
          doc.rect(ML, y, CW, 6, "F");
          // Severity badge
          doc.setFillColor(...sevColor.map(c => Math.min(c + 150, 255)));
          doc.roundedRect(ML + 35, y + 1, 15, 4, 0.5, 0.5, "F");
          setFont(5, "bold", sevColor);
          doc.text(b.sev, ML + 42.5, y + 3.6, { align: "center" });

          setFont(6, "normal", LIGHT);
          doc.text(String(b.ch), ML + 3, y + 4);
          setFont(6, "normal", MID);
          doc.text(b.type, ML + 12, y + 4);
          const flagText = b.flag.substring(0, 95);
          setFont(5.5, "normal", LIGHT);
          doc.text(flagText, ML + 53, y + 4);
          y += 6;
        });
        y += 3; hrule();
      }

      // ════════════════════════════════════════════════════════════
      // §5 PRIORITY ACTIONS
      // ════════════════════════════════════════════════════════════
      if (selected.actions) {
        sectionHeader(`§${sectionNum++}  PRIORITY ACTION QUEUE`, ORANGE);

        QUICK_ACTIONS.forEach((a, i) => {
          pageCheck(22);
          const priColor = a.priority <= 2 ? RED : a.priority <= 4 ? GOLD : BLUE;
          drawRect(ML, y, CW, 18, [22, 33, 55]);
          doc.setDrawColor(...priColor);
          doc.setLineWidth(0.6);
          doc.line(ML, y, ML, y + 18);
          // Priority badge
          doc.setFillColor(...priColor);
          doc.roundedRect(ML + 3, y + 3, 8, 8, 1, 1, "F");
          setFont(9, "bold", WHITE);
          doc.text(`#${a.priority}`, ML + 7, y + 8.5, { align: "center" });
          setFont(7.5, "bold", WHITE);
          doc.text(a.action, ML + 14, y + 6);
          setFont(6, "normal", LIGHT);
          const det = doc.splitTextToSize(a.detail, CW - 16);
          doc.text(det[0] || "", ML + 14, y + 11);
          setFont(6, "bold", TEAL);
          doc.text(`Impact: ${a.impact}`, ML + 14, y + 15.5);
          setFont(6, "normal", LIGHT);
          doc.text(`Time: ${a.time}`, ML + 60, y + 15.5);
          doc.text(`Domain: ${a.domain}`, ML + 100, y + 15.5);
          y += 21;
        });
        hrule();
      }

      // ════════════════════════════════════════════════════════════
      // §6 REGRESSION MODEL
      // ════════════════════════════════════════════════════════════
      if (selected.regression) {
        sectionHeader(`§${sectionNum++}  OMEGA REGRESSION MODEL  (R²=0.947)`, PURPLE);
        bodyText("OLS regression on 43 scored chapters. Dependent variable: Omega Score.");
        y += 2;
        const colW = [60, 30, 30, 60];
        tableRow(["Variable", "Coefficient", "p-Value", "Significance"], colW, y, true, [20, 30, 50]);
        y += 6;
        REGRESSION.forEach((r, i) => {
          pageCheck(6);
          tableRow([r.variable, r.coeff, r.pValue, r.sig + (r.sig === "***" ? "  (p<0.001)" : r.sig === "**" ? "  (p<0.01)" : "  (p<0.05)")],
            colW, y, false, i % 2 === 0 ? [22, 33, 55] : [26, 38, 60]);
          y += 5.5;
        });
        y += 3; hrule();
      }

      // ════════════════════════════════════════════════════════════
      // §7 NERO
      // ════════════════════════════════════════════════════════════
      if (selected.nero) {
        sectionHeader(`§${sectionNum++}  NERO ANALYSIS — Notification · Erasure · Restriction · Obscurity`, RED);
        bodyText("Counter-NERO chapters (0 mechanisms active) = narrative resistance to institutional silencing.");
        y += 2;
        const colW = [10, 8, 8, 8, 8, 138];
        tableRow(["Ch", "N", "E", "R", "O", "Detail"], colW, y, true, [20, 30, 50]);
        y += 6;
        NERO_DATA.forEach((d, i) => {
          pageCheck(6);
          const allFour = d.N && d.E && d.R && d.O;
          const counterNero = !d.N && !d.E && !d.R && !d.O;
          const bg = allFour ? [50, 20, 20] : counterNero ? [10, 40, 35] : (i % 2 === 0 ? [22, 33, 55] : [26, 38, 60]);
          tableRow([i + 1, d.N ? "✓" : "·", d.E ? "✓" : "·", d.R ? "✓" : "·", d.O ? "✓" : "·",
            d.detail?.substring(0, 80)], colW, y, false, bg);
          y += 5.5;
        });
        y += 3; hrule();
      }

      // ════════════════════════════════════════════════════════════
      // §8 NDR
      // ════════════════════════════════════════════════════════════
      if (selected.ndr) {
        sectionHeader(`§${sectionNum++}  NARRATIVE / DIALOGUE RATIO MAP`, BLUE);
        bodyText("Chapters above 65% dialogue carry reader fatigue risk. HIGH/CRIT rows require prose bridge insertion.");
        y += 2;
        const colW = [10, 20, 20, 22, 108];
        tableRow(["Ch", "Narr%", "Dial%", "Drop Risk", "Peak Moment"], colW, y, true, [20, 30, 50]);
        y += 6;
        NDR_DATA.forEach((d, i) => {
          pageCheck(6);
          const highRisk = d.dropRisk === "HIGH" || d.dropRisk === "CRIT";
          const bg = highRisk ? [50, 25, 10] : (i % 2 === 0 ? [22, 33, 55] : [26, 38, 60]);
          tableRow([i + 1, `${d.narr}%`, `${d.dial}%`, d.dropRisk, d.peakMoment?.substring(0, 65)],
            colW, y, false, bg);
          y += 5.5;
        });
        y += 3; hrule();
      }

      // ════════════════════════════════════════════════════════════
      // §9 TRUTHENGINE360
      // ════════════════════════════════════════════════════════════
      if (selected.convergence) {
        sectionHeader(`§${sectionNum++}  TRUTHENGINE360 — 7-STREAM CONVERGENCE`, TEAL);

        // Key numbers
        const bw3 = CW / 3;
        statBox("DCAS Coded Hispanic", "349", RED, ML, bw3);
        statBox("Estimated Actual (BISG)", "3,070–3,741", TEAL, ML + bw3, bw3);
        statBox("Classification Failure Rate", "84.9%", GOLD, ML + bw3 * 2, bw3);
        y += 17;

        y += 2;
        const colW = [8, 62, 22, 88];
        tableRow(["#", "Stream", "Strength", "Description"], colW, y, true, [20, 30, 50]);
        y += 6;
        CONVERGENCE_STREAMS.forEach((s, i) => {
          pageCheck(6);
          tableRow([s.n, s.label, `${s.strength}%`, s.desc], colW, y, false,
            i % 2 === 0 ? [22, 33, 55] : [26, 38, 60]);
          y += 5.5;
        });
        y += 3; hrule();
      }

      // ════════════════════════════════════════════════════════════
      // §10 EMOTION DATA
      // ════════════════════════════════════════════════════════════
      if (selected.emotion) {
        sectionHeader(`§${sectionNum++}  EMOTION DATA TABLE  (0–10 per chapter)`, PURPLE);
        const colW = [10, 20, 20, 20, 20, 20, 20, 50];
        tableRow(["Ch", "Grief", "Rage", "Love", "Fear", "Hope", "Spiritual", "Dominant"], colW, y, true, [20, 30, 50]);
        y += 6;
        EMOTION_DATA.forEach((e, i) => {
          pageCheck(6);
          const scores = { grief: e.grief, rage: e.rage, love: e.love, fear: e.fear, hope: e.hope, spiritual: e.spiritual };
          const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
          tableRow([i + 1, e.grief, e.rage, e.love, e.fear, e.hope, e.spiritual, dominant.toUpperCase()],
            colW, y, false, i % 2 === 0 ? [22, 33, 55] : [26, 38, 60]);
          y += 5.5;
        });
        y += 3; hrule();
      }

      // ════════════════════════════════════════════════════════════
      // BACK COVER / FOOTER on last page
      // ════════════════════════════════════════════════════════════
      doc.addPage();
      drawRect(0, 0, PW, PH, DARK);
      drawRect(0, 0, 6, PH, GOLD);
      setFont(14, "bold", GOLD);
      doc.text("LITCENTRAL v7", ML + 8, 80);
      setFont(10, "normal", WHITE);
      doc.text("SGT George Ramos: The Mathematics of Vietnam", ML + 8, 90);
      setFont(7, "normal", LIGHT);
      doc.text(`Generated: ${GENERATED}`, ML + 8, 100);
      doc.text("AUMER Foundation · TruthEngine360 · CHC Briefing May 18, 2026", ML + 8, 106);
      doc.text("Ω = 71.443 + 0.124(CLS) + 0.118(BIS) + 0.089(SII) + 0.067(MRF) + 0.041(RRP)", ML + 8, 112);

      // Page numbers on all body pages
      const totalPages = doc.getNumberOfPages();
      for (let p = 2; p <= totalPages - 1; p++) {
        doc.setPage(p);
        doc.setDrawColor(...GOLD.map(c => Math.min(c + 100, 255)));
        doc.setLineWidth(0.2);
        doc.line(ML, PH - MB + 2, ML + CW, PH - MB + 2);
        setFont(5.5, "normal", LIGHT);
        doc.text(`SGT George Ramos: The Mathematics of Vietnam · LITCENTRAL v7`, ML, PH - MB + 5);
        doc.text(`${p - 1}`, ML + CW, PH - MB + 5, { align: "right" });
      }

      doc.save(`LitCentral_Ramos_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStatus("error");
    }
  };

  return { status, error, run };
}

export default function PDFExportModal({ onClose }) {
  const [selected, setSelected] = useState(
    Object.fromEntries(EXPORT_SECTIONS.map(s => [s.id, s.default]))
  );

  const toggle = (id) => setSelected(p => ({ ...p, [id]: !p[id] }));
  const selectAll = () => setSelected(Object.fromEntries(EXPORT_SECTIONS.map(s => [s.id, true])));
  const selectNone = () => setSelected(Object.fromEntries(EXPORT_SECTIONS.map(s => [s.id, false])));

  const { status, error, run } = usePDFExport(selected);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-gold/30 rounded-xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gold" />
            <span className="text-sm font-black font-mono text-gold">EXPORT PDF REPORT</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <p className="text-[10px] text-muted-foreground font-sans">
            Select sections to include in your PDF. The report will be saved directly to your downloads folder.
          </p>

          {/* Section toggles */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] font-bold font-mono text-muted-foreground uppercase tracking-wide">Sections ({selectedCount} selected)</div>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-[8px] font-mono text-accent hover:underline">All</button>
                <button onClick={selectNone} className="text-[8px] font-mono text-muted-foreground hover:underline">None</button>
              </div>
            </div>
            <div className="space-y-1.5">
              {EXPORT_SECTIONS.map(s => (
                <label key={s.id} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggle(s.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                      selected[s.id]
                        ? "bg-gold border-gold"
                        : "border-border bg-secondary group-hover:border-muted-foreground"
                    }`}
                  >
                    {selected[s.id] && <span className="text-background text-[8px] font-black">✓</span>}
                  </div>
                  <span
                    onClick={() => toggle(s.id)}
                    className={`text-[10px] font-sans transition-colors ${selected[s.id] ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s.label}
                  </span>
                  {s.default && (
                    <span className="text-[7px] font-mono text-gold/60 ml-auto">recommended</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* File info */}
          <div className="p-3 bg-secondary/50 border border-border rounded-lg text-[9px] font-mono text-muted-foreground space-y-0.5">
            <div>Format: <span className="text-foreground">A4 PDF, Portrait</span></div>
            <div>Filename: <span className="text-foreground">LitCentral_Ramos_Report_{new Date().toISOString().slice(0, 10)}.pdf</span></div>
            <div>Engine: <span className="text-foreground">jsPDF (client-side, no data upload)</span></div>
          </div>

          {error && (
            <div className="p-2.5 bg-red/10 border border-red/30 rounded text-[9px] text-red font-sans">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 border border-border rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={run}
            disabled={status === "loading" || selectedCount === 0}
            className="flex-2 flex-grow-[2] py-2 bg-gold text-background rounded-lg text-xs font-black font-mono disabled:opacity-50 hover:bg-gold/80 transition-all flex items-center justify-center gap-2"
          >
            {status === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {status === "done"    && <CheckCircle className="w-3.5 h-3.5" />}
            {status === "idle"    && <Download className="w-3.5 h-3.5" />}
            {status === "loading" ? "Generating PDF…"
             : status === "done"  ? "Downloaded!"
             : `Export ${selectedCount} Section${selectedCount !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}