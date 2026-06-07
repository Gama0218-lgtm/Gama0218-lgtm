import { useState } from "react";
import { jsPDF } from "jspdf";
import { CHAPTERS } from "../../lib/data";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from "recharts";

// Battle chapters: tagged by type
const BATTLE_META = {
  9:  { type:"CONTACT",   intensity:"KINETIC",  sensoryNote:"Diesel/clay/animal rot — PEAK body score",  fryoutRisk:"Ramirez KIA",    openIssue:"CRITICAL: duplicate opening with Ch.10" },
  11: { type:"AMBUSH",    intensity:"KINETIC",  sensoryNote:"Cordite + static — clinical horror",          fryoutRisk:"Pink mist moment", openIssue:"M249 SAW anachronism — fix to M60" },
  16: { type:"ATROCITY",  intensity:"MORAL",    sensoryNote:"Papaya/fertilizer — nausea as moral response",fryoutRisk:"Moral fry-out risk: Ramos witness", openIssue:"Squad placement 3km east — fix to 'near Son My perimeter'" },
  24: { type:"SIEGE",     intensity:"CLIMAX",   sensoryNote:"Children's voices/mud — Te Deum stops breath", fryoutRisk:"None — peak brotherhood", openIssue:"Te Deum plausibility: add mission school context" },
  30: { type:"FIREFIGHT", intensity:"HIGH",     sensoryNote:"Mortar concussion — chosen ground",            fryoutRisk:"Squad defiance moment",  openIssue:"Mortar caliber: 81mm → 82mm (NVA standard)" },
  31: { type:"SIEGE",     intensity:"KINETIC",  sensoryNote:"CRUMP-CRUMP — narrative as orchestral score",  fryoutRisk:"Crawford breaks here",   openIssue:"None — OMEGA ELITE" },
  32: { type:"FIREFIGHT", intensity:"KINETIC",  sensoryNote:"Three-timeline collapse — pure prose",          fryoutRisk:"Multiple POVs",          openIssue:"Title truncated in DOCX: 'MASTERPIEC'" },
  36: { type:"REVENGE",   intensity:"CLIMAX",   sensoryNote:"Green numbers dying — algorithm breaks",        fryoutRisk:"Crawford hand trembles",  openIssue:"628 days: verify math" },
  39: { type:"CLIMAX",    intensity:"OMEGA",    sensoryNote:"M60 vibration + palm warmth + smoke",           fryoutRisk:"Miguel/Jorge KIA",        openIssue:"None — Ω110" },
  40: { type:"DECIMATION",intensity:"OMEGA",    sensoryNote:"WP smoke/charred leather — pork smell",         fryoutRisk:"7 KIA this chapter",      openIssue:"Death timeline conflicts with Ch.45 testimony" },
  41: { type:"EXTRACTION",intensity:"HIGH",     sensoryNote:"JP-4 + rotor + dead Marine's weight",           fryoutRisk:"Wilkins POV — post-trauma", openIssue:"Spanish gap (0.9/1k) — needs code-switch" },
};

const BATTLE_CHAPTERS = CHAPTERS.filter(c => BATTLE_META[c.ch]);

const TYPE_COLORS = {
  CONTACT:"text-red",    AMBUSH:"text-red",   ATROCITY:"text-orange", SIEGE:"text-gold",
  FIREFIGHT:"text-blue", REVENGE:"text-purple",CLIMAX:"text-teal",    DECIMATION:"text-red",
  EXTRACTION:"text-blue",
};
const TYPE_BG = {
  CONTACT:"bg-red/10 border-red/20",    AMBUSH:"bg-red/10 border-red/20",
  ATROCITY:"bg-orange/10 border-orange/20", SIEGE:"bg-gold/10 border-gold/20",
  FIREFIGHT:"bg-blue/10 border-blue/20",REVENGE:"bg-purple/10 border-purple/20",
  CLIMAX:"bg-teal/10 border-teal/20",   DECIMATION:"bg-red/20 border-red/30",
  EXTRACTION:"bg-blue/10 border-blue/20",
};

const MEANS = { omega: 107.2, bis: 91.5, sii: 93.4, cls: 88.3, mrf: 90.9 };

function GapBar({ value, mean, label, color }) {
  const gap = value - mean;
  const isLow = gap < 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[7px] font-mono text-muted-foreground w-6">{label}</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full ${isLow ? "bg-red" : color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className={`text-[8px] font-black font-mono w-8 text-right ${isLow ? "text-red" : "text-teal"}`}>{value}</span>
      <span className={`text-[7px] font-mono w-8 text-right ${isLow ? "text-red" : "text-muted-foreground"}`}>
        {gap >= 0 ? `+${gap.toFixed(0)}` : gap.toFixed(0)}
      </span>
    </div>
  );
}

function exportBattleReport(chapters, meta, means) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210; const margin = 14;
  let y = 18;

  // Header
  doc.setFillColor(10, 12, 20);
  doc.rect(0, 0, W, 28, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(230, 180, 60);
  doc.text('SGT GEORGE RAMOS: THE MATHEMATICS OF VIETNAM', margin, 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 170, 190);
  doc.text(`BATTLE SCENE AUDIT REPORT  ·  ${chapters.length} COMBAT CHAPTERS  ·  Generated ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}`, margin, 18);
  doc.text(`Battle means — Ω ${means.omega}  BIS ${means.bis}  SII ${means.sii}  CLS ${means.cls}  MRF ${means.mrf}  |  Organic Score = (BIS + SII) / 2`, margin, 23);
  y = 36;

  // Column widths
  const cols = [
    { label:'CH',      w:10, align:'center' },
    { label:'TITLE',   w:42, align:'left' },
    { label:'TYPE',    w:20, align:'left' },
    { label:'Ω',       w:12, align:'center' },
    { label:'BIS',     w:12, align:'center' },
    { label:'SII',     w:12, align:'center' },
    { label:'CLS',     w:12, align:'center' },
    { label:'MRF',     w:12, align:'center' },
    { label:'ORGANIC', w:16, align:'center' },
  ];

  // Table header
  doc.setFillColor(22, 28, 40);
  doc.rect(margin, y - 4, W - margin * 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 140, 170);
  let x = margin;
  cols.forEach(col => {
    doc.text(col.label, col.align === 'center' ? x + col.w / 2 : x + 1, y, { align: col.align === 'center' ? 'center' : 'left' });
    x += col.w;
  });
  y += 6;

  // Table rows
  chapters.forEach((c, i) => {
    const m = meta[c.ch];
    const organic = Math.round((c.bis + c.sii) / 2);
    const isEven = i % 2 === 0;
    if (isEven) { doc.setFillColor(14, 18, 28); doc.rect(margin, y - 4, W - margin * 2, 7, 'F'); }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(210, 60, 60);
    x = margin;
    doc.text(String(c.ch), x + cols[0].w / 2, y, { align: 'center' }); x += cols[0].w;

    doc.setTextColor(220, 225, 235);
    doc.text(c.title.length > 22 ? c.title.slice(0, 22) + '…' : c.title, x + 1, y); x += cols[1].w;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(180, 140, 60);
    doc.text(m.type, x + 1, y); x += cols[2].w;

    // Numeric cells
    const nums = [c.omega, c.bis, c.sii, c.cls, c.mrf, organic];
    const means_arr = [means.omega, means.bis, means.sii, means.cls, means.mrf, 88];
    nums.forEach((val, ni) => {
      const low = val < means_arr[ni];
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      if (ni === 0) doc.setTextColor(220, 175, 55);
      else if (low) doc.setTextColor(210, 60, 60);
      else doc.setTextColor(60, 190, 160);
      doc.text(String(val), x + cols[ni + 3].w / 2, y, { align: 'center' });
      x += cols[ni + 3].w;
    });
    y += 7;
    if (y > 260) { doc.addPage(); y = 20; }
  });

  y += 8;
  // Section: Open Issues
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(230, 180, 60);
  doc.text('OPEN ISSUES BY CHAPTER', margin, y); y += 6;
  doc.setLineWidth(0.3); doc.setDrawColor(60, 70, 90);
  doc.line(margin, y, W - margin, y); y += 5;

  chapters.forEach(c => {
    const m = meta[c.ch];
    if (!m.openIssue || m.openIssue === 'None — OMEGA ELITE' || m.openIssue.startsWith('None')) return;
    if (y > 268) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(210, 60, 60);
    doc.text(`Ch.${c.ch} — ${c.title}:`, margin, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(200, 200, 200);
    const lines = doc.splitTextToSize(m.openIssue, W - margin * 2 - 30);
    doc.text(lines, margin + 30, y);
    y += Math.max(6, lines.length * 4.5);
  });

  y += 6;
  // Section: Fry-out tracker
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(230, 130, 40);
  doc.text('FRAY-OUT RISK TRACKER — CHARACTER STRESS POINTS', margin, y); y += 6;
  doc.setLineWidth(0.3); doc.setDrawColor(60, 70, 90);
  doc.line(margin, y, W - margin, y); y += 5;

  const fryout = [
    { char:'Kowalski',   risk:'HIGH',      note:'Linda letters mechanism — may dissociate. M60 = emotional anchor.' },
    { char:'Reynolds',   risk:'BY DESIGN', note:'Musical dissociation in combat. Intentional device — protect, do not fix.' },
    { char:'Williamson', risk:'TBD',       note:'Scripture loop is control — watch for loop breaking under fire.' },
    { char:'Beckmann',   risk:'LOW',       note:'Youth + Iowa farmer practicality = grounded. Not a fry-out candidate.' },
    { char:'Segura',     risk:'HIGH',      note:'All 3 fry-out vectors active: (1) mechanical under fire, (2) PTSD dissociation, (3) moral collapse.' },
    { char:'Johnson',    risk:'LOW',       note:'Dice + Motown anchor. Watch Ch.40.' },
  ];
  fryout.forEach(f => {
    if (y > 270) { doc.addPage(); y = 20; }
    const riskColor = f.risk === 'HIGH' ? [210,60,60] : f.risk === 'BY DESIGN' ? [60,190,160] : f.risk === 'TBD' ? [220,175,55] : [120,140,170];
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...riskColor);
    doc.text(`${f.char} [${f.risk}]`, margin, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(190, 195, 205);
    const lines = doc.splitTextToSize(f.note, W - margin * 2 - 40);
    doc.text(lines, margin + 40, y);
    y += Math.max(6, lines.length * 4.5);
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(80, 95, 115);
    doc.text('LITCENTRAL · SGT GEORGE RAMOS MANUSCRIPT AUDIT · CONFIDENTIAL', margin, 290);
    doc.text(`Page ${i} of ${pageCount}`, W - margin, 290, { align: 'right' });
  }

  doc.save(`battle-scene-audit-${new Date().toISOString().slice(0,10)}.pdf`);
}

export default function BattleScenesTab() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("table");

  const record = selected ? BATTLE_CHAPTERS.find(c => c.ch === selected) : null;
  const meta   = selected ? BATTLE_META[selected] : null;

  // Organic score = (BIS + SII) / 2 — measures felt reality vs staged
  const withOrganic = BATTLE_CHAPTERS.map(c => ({
    ...c,
    organic: Math.round((c.bis + c.sii) / 2),
    gap: ((c.bis + c.sii) / 2) < 88,
  }));

  const radarData = record ? [
    { axis: "Ω Omega", val: record.omega,   mean: MEANS.omega   },
    { axis: "BIS",     val: record.bis,     mean: MEANS.bis     },
    { axis: "SII",     val: record.sii,     mean: MEANS.sii     },
    { axis: "CLS",     val: record.cls,     mean: MEANS.cls     },
    { axis: "MRF",     val: record.mrf,     mean: MEANS.mrf     },
  ] : [];

  const barData = withOrganic.map(c => ({
    name: `Ch.${c.ch}`,
    bis: c.bis,
    sii: c.sii,
    organic: c.organic,
  }));

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap border-b border-border pb-3">
        <div>
          <div className="text-base font-black text-red">BATTLE SCENE AUDIT — {BATTLE_CHAPTERS.length} COMBAT CHAPTERS</div>
          <div className="text-[9px] font-mono text-muted-foreground">
            Organic Score = (BIS + SII) / 2 · BIS mean {MEANS.bis} · SII mean {MEANS.sii} · Gaps flagged in red
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-[8px] font-mono px-2 py-0.5 rounded border bg-red/10 text-red border-red/30">KINETIC: Ch.9/11/31/32</span>
          <span className="text-[8px] font-mono px-2 py-0.5 rounded border bg-teal/10 text-teal border-teal/30">CLIMAX: Ch.39/40</span>
          <span className="text-[8px] font-mono px-2 py-0.5 rounded border bg-orange/10 text-orange border-orange/30">MORAL: Ch.16</span>
          <button
            onClick={() => exportBattleReport(withOrganic, BATTLE_META, MEANS)}
            className="flex items-center gap-1.5 text-[8px] font-bold font-mono px-3 py-1 rounded border bg-gold/20 text-gold border-gold/40 hover:bg-gold/30 transition-all"
          >
            ↓ EXPORT PDF REPORT
          </button>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-1">
        {["table","chart"].map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`text-[8px] font-mono px-2.5 py-1 rounded border transition-all capitalize ${
              view === v ? "bg-red/20 text-red border-red/40" : "border-border text-muted-foreground hover:text-foreground"
            }`}>{v === "table" ? "Score Table" : "BIS/SII Chart"}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT — main panel */}
        <div className="lg:col-span-2 space-y-3">

          {view === "table" && (
            <div className="bg-card border border-border rounded-xl overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                    <th className="text-left px-3 py-2">CH</th>
                    <th className="text-left px-3 py-2">TITLE</th>
                    <th className="text-left px-3 py-2">TYPE</th>
                    <th className="text-center px-2 py-2">Ω</th>
                    <th className="text-center px-2 py-2">BIS</th>
                    <th className="text-center px-2 py-2">SII</th>
                    <th className="text-center px-2 py-2">CLS</th>
                    <th className="text-center px-2 py-2">MRF</th>
                    <th className="text-center px-2 py-2">ORGANIC</th>
                    <th className="text-left px-2 py-2">ISSUE</th>
                  </tr>
                </thead>
                <tbody>
                  {withOrganic.map(c => {
                    const m = BATTLE_META[c.ch];
                    const bisLow = c.bis < MEANS.bis;
                    const siiLow = c.sii < MEANS.sii;
                    const isSelected = selected === c.ch;
                    return (
                      <tr key={c.ch}
                        onClick={() => setSelected(isSelected ? null : c.ch)}
                        className={`border-b border-border/30 hover:bg-secondary/10 cursor-pointer transition-colors ${isSelected ? "bg-red/5" : ""}`}
                      >
                        <td className="px-3 py-2.5 font-black font-mono text-red">{c.ch}</td>
                        <td className="px-3 py-2.5 font-bold text-foreground whitespace-nowrap max-w-[140px] truncate">{c.title}</td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[7px] font-bold font-mono px-1.5 py-0.5 rounded border ${TYPE_BG[m.type]}`}>
                            <span className={TYPE_COLORS[m.type]}>{m.type}</span>
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center font-black font-mono text-gold">{c.omega}</td>
                        <td className={`px-2 py-2.5 text-center font-black font-mono ${bisLow ? "text-red" : "text-teal"}`}>{c.bis}{bisLow && " ⬇"}</td>
                        <td className={`px-2 py-2.5 text-center font-black font-mono ${siiLow ? "text-red" : "text-blue"}`}>{c.sii}{siiLow && " ⬇"}</td>
                        <td className="px-2 py-2.5 text-center font-mono text-foreground/70">{c.cls}</td>
                        <td className="px-2 py-2.5 text-center font-mono text-foreground/70">{c.mrf}</td>
                        <td className={`px-2 py-2.5 text-center font-black font-mono ${c.organic >= 90 ? "text-teal" : c.organic >= 85 ? "text-gold" : "text-red"}`}>{c.organic}</td>
                        <td className="px-2 py-2.5 text-[8px] font-mono text-orange max-w-[120px] truncate">{m.openIssue || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-4 py-2 border-t border-border/30 text-[8px] font-mono text-muted-foreground">
                ⬇ = below battle-chapter mean · Organic Score &lt;85 = staged risk · Click row for detail
              </div>
            </div>
          )}

          {view === "chart" && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="text-[9px] font-bold font-mono text-muted-foreground mb-2">BIS vs SII vs ORGANIC SCORE — Battle Chapters</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 10 }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 700 }}
                  />
                  <ReferenceLine y={MEANS.bis} stroke="hsl(var(--red))" strokeDasharray="3 3" label={{ value: `BIS mean ${MEANS.bis}`, fontSize: 7, fill: "hsl(var(--red))" }} />
                  <Bar dataKey="bis"     fill="hsl(var(--red))"    name="BIS" opacity={0.8} radius={[3,3,0,0]} />
                  <Bar dataKey="sii"     fill="hsl(var(--blue))"   name="SII" opacity={0.8} radius={[3,3,0,0]} />
                  <Bar dataKey="organic" fill="hsl(var(--teal))"   name="Organic" opacity={0.6} radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center text-[8px] font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-red opacity-80"></span>BIS (behavioral)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-blue opacity-80"></span>SII (sensory)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-teal opacity-60"></span>Organic = avg</span>
              </div>
            </div>
          )}

          {/* Fry-out summary */}
          <div className="bg-card border border-orange/20 rounded-xl p-4">
            <div className="text-[8px] font-bold font-mono text-orange mb-3 tracking-widest">FRAY-OUT RISK TRACKER — CHARACTER STRESS POINTS</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { char:"Kowalski",   risk:"HIGH",   note:"Linda letters mechanism — may dissociate from beginning. M60 = emotional anchor." },
                { char:"Reynolds",   note:"Musical dissociation in combat. Intentional device — protect, do not fix.", risk:"BY DESIGN" },
                { char:"Williamson", risk:"TBD",    note:"Scripture loop is control — watch for loop breaking under fire." },
                { char:"Beckmann",   risk:"LOW",    note:"Youth + Iowa farmer practicality = grounded. Not a fry-out candidate." },
                { char:"Segura",     risk:"HIGH",   note:"All 3 fry-out vectors active: (1) goes mechanical under fire, (2) PTSD dissociation (chutz as tell), (3) moral collapse — may stop caring who gets hit. Norte/Sur TBD but MATTERS: affects his register with Ramos across all 3 appearances." },
                { char:"Johnson",    risk:"LOW",    note:"Dice + Motown anchor. Watch Ch.40." },
              ].map(f => (
                <div key={f.char} className={`rounded-lg border p-2.5 ${
                  f.risk === "HIGH" ? "bg-red/5 border-red/20" :
                  f.risk === "BY DESIGN" ? "bg-teal/5 border-teal/20" :
                  f.risk === "TBD" ? "bg-gold/5 border-gold/20" :
                  "bg-secondary/20 border-border"
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black text-foreground">{f.char}</span>
                    <span className={`text-[7px] font-bold font-mono ${
                      f.risk === "HIGH" ? "text-red" :
                      f.risk === "BY DESIGN" ? "text-teal" :
                      f.risk === "TBD" ? "text-gold" : "text-muted-foreground"
                    }`}>{f.risk}</span>
                  </div>
                  <div className="text-[8px] text-foreground/60 leading-relaxed">{f.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — detail panel */}
        <div>
          {record && meta ? (
            <div className="bg-card border border-red/20 rounded-xl p-4 space-y-3 sticky top-24">
              <div>
                <div className="text-[7px] font-mono text-muted-foreground">CH.{record.ch} · {record.act} · {meta.intensity}</div>
                <div className="text-sm font-black text-red leading-tight">{record.title}</div>
                <span className={`text-[7px] font-bold font-mono mt-1 inline-block px-1.5 py-0.5 rounded border ${TYPE_BG[meta.type]}`}>
                  <span className={TYPE_COLORS[meta.type]}>{meta.type}</span>
                </span>
              </div>

              {/* Radar */}
              <div className="bg-secondary/20 rounded-lg p-2">
                <div className="text-[7px] font-mono text-muted-foreground mb-1 text-center">METRIC PROFILE vs BATTLE MEAN</div>
                <ResponsiveContainer width="100%" height={180}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="axis" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }} />
                    <Radar name="Chapter" dataKey="val" stroke="hsl(var(--red))" fill="hsl(var(--red))" fillOpacity={0.25} />
                    <Radar name="Mean"    dataKey="mean" stroke="hsl(var(--border))" fill="transparent" strokeDasharray="3 3" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Gap bars */}
              <div className="space-y-1.5">
                <div className="text-[7px] font-mono text-muted-foreground mb-1">SCORES vs BATTLE MEAN</div>
                <GapBar label="BIS" value={record.bis}   mean={MEANS.bis}   color="bg-teal" />
                <GapBar label="SII" value={record.sii}   mean={MEANS.sii}   color="bg-blue" />
                <GapBar label="CLS" value={record.cls}   mean={MEANS.cls}   color="bg-purple" />
                <GapBar label="MRF" value={record.mrf}   mean={MEANS.mrf}   color="bg-gold" />
                <GapBar label="Ω"   value={record.omega} mean={MEANS.omega}  color="bg-gold" />
              </div>

              <div className="bg-teal/5 border border-teal/20 rounded-lg p-2.5">
                <div className="text-[7px] font-mono text-muted-foreground mb-0.5">SENSORY SIGNATURE</div>
                <div className="text-[9px] text-teal italic">{meta.sensoryNote}</div>
              </div>

              <div className="bg-orange/5 border border-orange/20 rounded-lg p-2.5">
                <div className="text-[7px] font-mono text-muted-foreground mb-0.5">FRAY-OUT / STRESS POINT</div>
                <div className="text-[9px] text-orange">{meta.fryoutRisk}</div>
              </div>

              {meta.openIssue && (
                <div className="bg-red/5 border border-red/30 rounded-lg p-2.5">
                  <div className="text-[7px] font-mono text-muted-foreground mb-0.5">OPEN ISSUE</div>
                  <div className="text-[9px] text-red font-mono">{meta.openIssue}</div>
                </div>
              )}

              <div className="text-[8px] font-mono">
                <span className="text-muted-foreground">Organic Score: </span>
                <span className={`font-black ${record.organic >= 90 ? "text-teal" : record.organic >= 85 ? "text-gold" : "text-red"}`}>
                  {Math.round((record.bis + record.sii) / 2)}
                </span>
                <span className="text-muted-foreground ml-2">Word count: </span>
                <span className="text-foreground">{record.words?.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border rounded-xl p-8 flex items-center justify-center text-muted-foreground text-[10px] font-mono h-64">
              Click a battle chapter for full profile
            </div>
          )}
        </div>
      </div>
    </div>
  );
}