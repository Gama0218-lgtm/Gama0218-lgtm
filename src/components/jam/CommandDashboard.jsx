import { Zap, Target, Users, TrendingUp, AlertCircle } from "lucide-react";

const KPIS = [
  { tone: "gold",   label: "AI VISIBILITY",  value: "34.2",   hint: "rolling 7d index"      },
  { tone: "teal",   label: "SENTIMENT",      value: "87/100", hint: "weighted by reach"     },
  { tone: "purple", label: "REACH",          value: "128K",   hint: "unique accounts"       },
  { tone: "orange", label: "FIELD INTAKE",   value: "12",     hint: "border hub interviews" },
  { tone: "blue",   label: "STAKEHOLDERS",   value: "412",    hint: "active in CRM"         },
  { tone: "red",    label: "OPEN ALERTS",    value: "3",      hint: "TruthEngine360"        },
];

const OPS = [
  { tone: "purple", icon: TrendingUp, title: "Social Listening Grid",    detail: "Live multi-platform stream + auto-digest"            },
  { tone: "teal",   icon: Target,     title: "Reverse-Strategy Posture", detail: "Community first → credibility → gatekeepers follow" },
  { tone: "orange", icon: AlertCircle, title: "Deported veteran story",   detail: "Chicano/Latino Ψ(t) = 0.94 — push this cycle"        },
  { tone: "blue",   icon: Users,      title: "Stakeholder CRM sync",     detail: "412 contacts · 18 priority outreach today"          },
];

export default function CommandDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-gold" />
        <h2 className="text-sm font-black font-mono text-gold tracking-widest">COMMAND DASHBOARD</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {KPIS.map((k) => (
          <div key={k.label} className={`rounded-lg border border-${k.tone}/30 bg-${k.tone}/5 p-3`}>
            <div className={`text-[9px] font-mono text-${k.tone} tracking-wider`}>{k.label}</div>
            <div className="text-2xl font-black font-mono text-foreground mt-1">{k.value}</div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{k.hint}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {OPS.map((o) => {
          const Icon = o.icon;
          return (
            <div key={o.title} className={`rounded-lg border border-${o.tone}/30 bg-${o.tone}/5 p-4 flex items-start gap-3`}>
              <div className={`p-2 rounded bg-${o.tone}/15 border border-${o.tone}/30`}><Icon className={`w-4 h-4 text-${o.tone}`} /></div>
              <div>
                <div className={`text-[11px] font-bold font-mono text-${o.tone} tracking-widest`}>{o.title}</div>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{o.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
