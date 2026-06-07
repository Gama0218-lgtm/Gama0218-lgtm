import { ARC_DATA } from "../../lib/data";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function ArcsTab() {
  const chartData = ARC_DATA.map(r => ({
    ch: r.ch,
    Ramos: r.ramos,
    Miguel: r.miguel,
    Crawford: r.crawford,
    Squad: r.squad,
    Chieftain: r.chieftain,
  }));

  return (
    <div className="animate-slide-up space-y-5">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-[10px] font-bold text-gold font-mono uppercase tracking-wider mb-4">Character Arc Intensity — All 41 Chapters</div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{top:5,right:10,left:-20,bottom:5}}>
              <XAxis dataKey="ch" tick={{fontSize:9,fill:"#6B8BAA"}} />
              <YAxis domain={[0,10]} tick={{fontSize:9,fill:"#6B8BAA"}} />
              <Tooltip
                contentStyle={{background:"#0D1525",border:"1px solid #1A2640",borderRadius:8,fontSize:10}}
                labelStyle={{color:"#F0F6FF",fontWeight:700}}
              />
              <Legend wrapperStyle={{fontSize:10}} />
              <Line type="monotone" dataKey="Ramos"    stroke="#F5C842" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Miguel"   stroke="#FF8C42" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Crawford" stroke="#FF5C5C" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="Squad"    stroke="#4A9EFF" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="Chieftain"stroke="#1CCFB4" strokeWidth={1.5} dot={false} strokeDasharray="2 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-card">
              {["Ch","Ramos","Miguel","Crawford","Squad","Chieftain","Narrative","Behavioral","Summary"].map((h,i) => (
                <th key={i} className={`px-3 py-2.5 text-[10px] font-bold text-muted-foreground font-mono border-b-2 border-secondary ${i===8?"text-left":"text-center"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ARC_DATA.map((row, idx) => (
              <tr key={row.ch} className={`transition-colors hover:bg-secondary/40 ${idx%2===0?"bg-card":"bg-background"}`}>
                <td className="px-3 py-2 text-center text-xs text-muted-foreground font-mono">{row.ch}</td>
                <ArcCell value={row.ramos} color="text-gold" />
                <ArcCell value={row.miguel} color="text-orange" />
                <ArcCell value={row.crawford} color="text-red" />
                <ArcCell value={row.squad} color="text-blue" />
                <ArcCell value={row.chieftain} color="text-teal" />
                <ArcCell value={row.narrative} color="text-cyan" />
                <ArcCell value={row.behavioral} color="text-purple" />
                <td className="px-3 py-2 text-left text-[9px] text-muted-foreground font-sans max-w-[220px]">{row.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ArcCell({ value, color }) {
  return (
    <td className="px-3 py-2 text-center">
      <span className={`text-xs font-bold font-mono ${value >= 9 ? color : value >= 7 ? "text-foreground/60" : "text-muted-foreground/40"}`}>{value}</span>
    </td>
  );
}