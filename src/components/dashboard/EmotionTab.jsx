import { EMOTION_DATA } from "../../lib/data";

const EMOTIONS = [
  {key:"grief",    label:"Grief",    color:"bg-purple", text:"text-purple"},
  {key:"rage",     label:"Rage",     color:"bg-red",    text:"text-red"},
  {key:"love",     label:"Love",     color:"bg-pink",   text:"text-pink"},
  {key:"fear",     label:"Fear",     color:"bg-orange", text:"text-orange"},
  {key:"hope",     label:"Hope",     color:"bg-teal",   text:"text-teal"},
  {key:"spiritual",label:"Spiritual",color:"bg-gold",   text:"text-gold"},
];

export default function EmotionTab() {
  return (
    <div className="animate-slide-up">
      <div className="flex gap-4 mb-4 flex-wrap">
        {EMOTIONS.map(e => (
          <div key={e.key} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${e.color}`} />
            <span className={`text-[10px] font-bold font-mono ${e.text}`}>{e.label}</span>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-card">
              <th className="px-3 py-2.5 text-[10px] font-bold text-muted-foreground font-mono text-center border-b-2 border-secondary">Ch</th>
              {EMOTIONS.map(e => (
                <th key={e.key} className={`px-3 py-2.5 text-[10px] font-bold font-mono text-center border-b-2 border-secondary ${e.text}`}>{e.label}</th>
              ))}
              <th className="px-3 py-2.5 text-[10px] font-bold text-muted-foreground font-mono text-center border-b-2 border-secondary">Heatmap</th>
            </tr>
          </thead>
          <tbody>
            {EMOTION_DATA.map((row, idx) => (
              <tr key={row.ch} className={`transition-colors hover:bg-secondary/40 ${idx % 2 === 0 ? "bg-card" : "bg-background"}`}>
                <td className="px-3 py-2 text-center text-xs text-muted-foreground font-mono">{row.ch}</td>
                {EMOTIONS.map(e => (
                  <td key={e.key} className="px-3 py-2 text-center">
                    <span className={`text-xs font-bold font-mono ${row[e.key] >= 9 ? e.text : "text-muted-foreground"}`}>
                      {row[e.key]}
                    </span>
                  </td>
                ))}
                <td className="px-3 py-2">
                  <div className="flex gap-0.5 h-4">
                    {EMOTIONS.map(e => (
                      <div
                        key={e.key}
                        className={`${e.color} rounded-sm opacity-60 transition-all`}
                        style={{width: `${(row[e.key] / 10) * 14}px`, minWidth: "1px"}}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}