import DashCard from "./DashCard";
import { NERO_DATA } from "../../lib/data";

const DOT = ({ active, label }) => (
  <div className={`flex items-center gap-1`}>
    <div className={`w-2.5 h-2.5 rounded-sm border ${active ? "bg-red/80 border-red/60" : "bg-secondary border-border"}`} />
    <span className={`text-[9px] font-mono ${active ? "text-red" : "text-muted-foreground/40"}`}>{label}</span>
  </div>
);

export default function NeroTab() {
  const neroCount = NERO_DATA.filter(r => r.N || r.E || r.R || r.O).length;
  const counterCount = NERO_DATA.filter(r => !r.N && !r.E && !r.R && !r.O).length;

  return (
    <div className="animate-slide-up">
      <div className="bg-red/5 border border-red/20 rounded-lg p-4 mb-5">
        <div className="text-sm font-black font-mono mb-1">NERO Framework — Notification · Erasure · Restriction · Obscurity</div>
        <div className="text-xs text-muted-foreground font-sans mb-3">Systematic mechanisms by which the state renders marginalized service populations invisible</div>
        <div className="flex gap-4 flex-wrap">
          <div className="text-center"><div className="text-xl font-black text-red font-mono">{neroCount}</div><div className="text-[10px] text-muted-foreground">NERO present</div></div>
          <div className="text-center"><div className="text-xl font-black text-teal font-mono">{counterCount}</div><div className="text-[10px] text-muted-foreground">Counter-NERO</div></div>
          <div className="text-center"><div className="text-xl font-black text-gold font-mono">4</div><div className="text-[10px] text-muted-foreground">ALL FOUR chapters</div></div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-card">
              <th className="px-3 py-2.5 text-[10px] font-bold text-muted-foreground font-mono text-center border-b-2 border-secondary">Ch</th>
              <th className="px-3 py-2.5 text-[10px] font-bold text-red font-mono text-center border-b-2 border-secondary">N</th>
              <th className="px-3 py-2.5 text-[10px] font-bold text-red font-mono text-center border-b-2 border-secondary">E</th>
              <th className="px-3 py-2.5 text-[10px] font-bold text-red font-mono text-center border-b-2 border-secondary">R</th>
              <th className="px-3 py-2.5 text-[10px] font-bold text-red font-mono text-center border-b-2 border-secondary">O</th>
              <th className="px-3 py-2.5 text-[10px] font-bold text-muted-foreground font-mono text-left border-b-2 border-secondary">Analysis</th>
            </tr>
          </thead>
          <tbody>
            {NERO_DATA.map((row, idx) => {
              const isCounter = !row.N && !row.E && !row.R && !row.O;
              const isAll = row.N && row.E && row.R && row.O;
              return (
                <tr key={row.ch} className={`transition-colors hover:bg-secondary/40 ${idx % 2 === 0 ? "bg-card" : "bg-background"}`}>
                  <td className="px-3 py-2 text-center text-xs text-muted-foreground font-mono">{row.ch}</td>
                  <td className="px-3 py-2 text-center"><div className={`w-4 h-4 rounded mx-auto ${row.N ? "bg-red/70" : "bg-secondary/40"}`} /></td>
                  <td className="px-3 py-2 text-center"><div className={`w-4 h-4 rounded mx-auto ${row.E ? "bg-red/70" : "bg-secondary/40"}`} /></td>
                  <td className="px-3 py-2 text-center"><div className={`w-4 h-4 rounded mx-auto ${row.R ? "bg-red/70" : "bg-secondary/40"}`} /></td>
                  <td className="px-3 py-2 text-center"><div className={`w-4 h-4 rounded mx-auto ${row.O ? "bg-red/70" : "bg-secondary/40"}`} /></td>
                  <td className={`px-3 py-2 text-left text-[10px] font-sans leading-snug ${isCounter ? "text-teal" : isAll ? "text-orange font-bold" : "text-muted-foreground"}`}>
                    {row.detail}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}