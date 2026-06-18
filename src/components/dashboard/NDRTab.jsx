import { NDR_DATA } from "../../lib/data";

const RISK_COLOR = {
  LOW:"text-teal", MED:"text-gold", HIGH:"text-orange", CRIT:"text-red",
};

export default function NDRTab() {
  const highRisk = NDR_DATA.filter(r => r.dropRisk === "HIGH" || r.dropRisk === "CRIT").length;
  return (
    <div className="animate-slide-up">
      <div className="bg-blue/5 border border-blue/20 rounded-lg p-4 mb-5">
        <div className="text-sm font-black font-mono mb-1">Narrative/Dialogue Ratio Map — NDR Analysis</div>
        <div className="text-xs text-muted-foreground font-sans mb-3">Per-chapter narrative vs dialogue split with reader retention predictions and drop risk</div>
        <div className="flex gap-6 flex-wrap">
          <div className="text-center"><div className="text-xl font-black text-blue font-mono">41</div><div className="text-[10px] text-muted-foreground">Chapters scored</div></div>
          <div className="text-center"><div className="text-xl font-black text-orange font-mono">{highRisk}</div><div className="text-[10px] text-muted-foreground">High/Crit risk</div></div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-card">
              {["Ch","Narr %","Dial %","RR-Narr","RR-Dial","Drop Risk","Split","Peak Moment"].map((h, i) => (
                <th key={i} className={`px-3 py-2.5 text-[10px] font-bold text-muted-foreground font-mono border-b-2 border-secondary ${i > 1 ? "text-center" : i === 0 ? "text-center" : "text-center"} ${i === 7 ? "text-left" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NDR_DATA.map((row, idx) => (
              <tr key={row.ch} className={`transition-colors hover:bg-secondary/40 ${idx % 2 === 0 ? "bg-card" : "bg-background"}`}>
                <td className="px-3 py-2 text-center text-xs text-muted-foreground font-mono">{row.ch}</td>
                <td className="px-3 py-2 text-center text-xs text-foreground/80 font-mono">{row.narr}%</td>
                <td className="px-3 py-2 text-center text-xs text-foreground/80 font-mono">{row.dial}%</td>
                <td className="px-3 py-2 text-center text-xs font-bold font-mono text-blue">{row.rrNarr}</td>
                <td className="px-3 py-2 text-center text-xs font-bold font-mono text-cyan">{row.rrDial}</td>
                <td className={`px-3 py-2 text-center text-xs font-bold font-mono ${RISK_COLOR[row.dropRisk] || "text-muted-foreground"}`}>{row.dropRisk}</td>
                <td className="px-3 py-2 text-center">
                  <div className="flex gap-0.5 h-3 w-24 mx-auto">
                    <div className="bg-blue/60 rounded-l-sm" style={{width:`${row.narr}%`}} />
                    <div className="bg-purple/60 rounded-r-sm" style={{width:`${row.dial}%`}} />
                  </div>
                </td>
                <td className="px-3 py-2 text-left text-[10px] text-muted-foreground font-sans max-w-[200px]">{row.peakMoment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}