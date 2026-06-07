import { useState } from "react";
import { CHAPTERS } from "../../lib/data";
import TierBadge from "./TierBadge";

export default function ChaptersTab() {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sorted = [...CHAPTERS].sort((a, b) => {
    if (!sortField) return 0;
    const av = a[sortField] ?? -999;
    const bv = b[sortField] ?? -999;
    return sortDir === "desc" ? bv - av : av - bv;
  });

  const headers = [
    { key: "ch", label: "#", sortable: true },
    { key: "title", label: "Title", sortable: false },
    { key: "act", label: "Act", sortable: false },
    { key: null, label: "Tier", sortable: false },
    { key: "omega", label: "Omega", sortable: true },
    { key: "rrp", label: "RRP", sortable: true },
    { key: "cls", label: "CLS", sortable: true },
    { key: "sii", label: "SII", sortable: true },
    { key: "bis", label: "BIS", sortable: true },
    { key: "mrf", label: "MRF", sortable: true },
    { key: "words", label: "Words", sortable: true },
    { key: "clmoe", label: "CL-MoE", sortable: true },
    { key: null, label: "Fix", sortable: false },
  ];

  return (
    <div className="animate-slide-up">
      <div className="text-xs text-muted-foreground mb-3 font-sans">
        44 chapters — 240,278 words — LITCENTRAL v2 Hybrid formula — 43 scored — Ch39 missing from v5 upload
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-card">
              {headers.map((h, i) => (
                <th
                  key={i}
                  onClick={h.sortable && h.key ? () => handleSort(h.key) : undefined}
                  className={`px-3 py-2.5 text-[10px] font-bold text-muted-foreground font-mono uppercase tracking-wider border-b-2 border-secondary ${
                    h.key === "title" ? "text-left" : "text-center"
                  } ${h.sortable ? "cursor-pointer hover:text-foreground transition-colors" : ""}`}
                >
                  {h.label}
                  {sortField === h.key && (
                    <span className="ml-1 text-accent">{sortDir === "desc" ? "↓" : "↑"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((ch, idx) => (
              <tr
                key={ch.ch}
                className={`transition-colors hover:bg-secondary/40 ${
                  idx % 2 === 0 ? "bg-card" : "bg-background"
                } ${ch.isMissing ? "opacity-70" : ""}`}
              >
                <td className="px-3 py-2 text-center text-xs text-muted-foreground font-mono">{ch.ch}</td>
                <td className="px-3 py-2 text-left text-xs text-foreground font-sans">
                  {ch.title}
                  {ch.isNew && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0 rounded text-[8px] font-bold bg-teal/15 text-teal border border-teal/30">
                      NEW
                    </span>
                  )}
                  {ch.isMissing && (
                    <span className="ml-1 text-red text-[9px] font-bold font-mono">MISSING</span>
                  )}
                </td>
                <td className="px-3 py-2 text-center text-[11px] text-muted-foreground font-mono">{ch.act}</td>
                <td className="px-3 py-2 text-center">
                  {ch.isMissing ? (
                    <TierBadge isMissing />
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-gold/15 text-gold border border-gold/30">
                      Omega Elite
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  {ch.omega ? (
                    <span className="text-base font-black text-gold font-mono">Ω{ch.omega}</span>
                  ) : (
                    <span className="text-base font-black text-red font-mono">—</span>
                  )}
                </td>
                <ScoreCell value={ch.rrp} />
                <ScoreCell value={ch.cls} warnBelow={80} />
                <ScoreCell value={ch.sii} />
                <ScoreCell value={ch.bis} />
                <ScoreCell value={ch.mrf} />
                <td className="px-3 py-2 text-center text-xs text-muted-foreground font-mono">
                  {ch.words ? ch.words.toLocaleString() : "0"}
                </td>
                <td className="px-3 py-2 text-center text-xs text-cyan font-mono">
                  {ch.clmoe !== null ? ch.clmoe : "—"}
                </td>
                <td className="px-3 py-2 text-center">
                  <TierBadge fix={ch.fix} isMissing={ch.isMissing} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoreCell({ value, warnBelow = 80 }) {
  if (value === null) {
    return <td className="px-3 py-2 text-center text-xs text-muted-foreground font-mono">—</td>;
  }
  const isWarn = value < warnBelow;
  return (
    <td className={`px-3 py-2 text-center text-xs font-mono ${isWarn ? "text-orange font-bold" : "text-muted-foreground"}`}>
      {value}
    </td>
  );
}