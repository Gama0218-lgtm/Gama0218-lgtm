import DashCard from "./DashCard";

const MILESTONES = [
  { date:"2026-04-01", label:"v5 Audit Complete",                    status:"DONE",    color:"teal",   domain:"Manuscript", days:0   },
  { date:"2026-04-15", label:"Complete Ch.40 Ramos prayer scene",     status:"PENDING", color:"red",    domain:"Manuscript", days:14  },
  { date:"2026-04-20", label:"Joshua Sagasta Act II-III scene",        status:"PENDING", color:"orange", domain:"Manuscript", days:19  },
  { date:"2026-04-25", label:"Sensory upgrades Ch.6, Ch.17, Ch.18",   status:"PENDING", color:"orange", domain:"Manuscript", days:24  },
  { date:"2026-05-01", label:"Manuscript lock — 44 chapters complete", status:"PENDING", color:"red",    domain:"Manuscript", days:30  },
  { date:"2026-05-05", label:"Press kit + excerpt packet finalized",   status:"PENDING", color:"blue",   domain:"Campaign",   days:34  },
  { date:"2026-05-10", label:"ARC copies to final beta readers",       status:"PENDING", color:"gold",   domain:"Campaign",   days:39  },
  { date:"2026-05-15", label:"CHC briefing materials submitted",       status:"PENDING", color:"gold",   domain:"Campaign",   days:44  },
  { date:"2026-05-18", label:"Congressional Hispanic Caucus Briefing", status:"PENDING", color:"red",    domain:"Campaign",   days:47  },
  { date:"2026-05-25", label:"Literary agent submissions (10 targets)",status:"PENDING", color:"purple", domain:"Publishing", days:54  },
  { date:"2026-05-31", label:"PUBLICATION DATE",                       status:"TARGET",  color:"gold",   domain:"Publishing", days:60  },
  { date:"2026-06-15", label:"Phase 1 Forensic Release launch",        status:"PENDING", color:"teal",   domain:"Campaign",   days:75  },
  { date:"2026-07-01", label:"Educational Tour — San Diego / LA",      status:"PENDING", color:"blue",   domain:"Campaign",   days:91  },
  { date:"2026-08-01", label:"Digital Siege #WeAreNotCaucasian launch",status:"PENDING", color:"orange", domain:"Campaign",   days:122 },
  { date:"2026-09-01", label:"Academic curriculum integration push",   status:"PENDING", color:"purple", domain:"Campaign",   days:153 },
  { date:"2026-11-30", label:"18-month revenue review",                status:"PENDING", color:"teal",   domain:"Financial",  days:243 },
];

const DOMAIN_COLORS = { Manuscript:"gold", Campaign:"blue", Publishing:"purple", Financial:"teal" };
const domains = ["All", "Manuscript", "Campaign", "Publishing", "Financial"];

import { useState } from "react";

export default function TimelineTab() {
  const [activeDomain, setActiveDomain] = useState("All");

  const filtered = activeDomain === "All" ? MILESTONES : MILESTONES.filter(m => m.domain === activeDomain);
  const done = MILESTONES.filter(m => m.status === "DONE").length;
  const total = MILESTONES.length;

  return (
    <div className="animate-slide-up space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Days to Publication", value:"60d", color:"red"   },
          { label:"Days to CHC Briefing", value:"47d", color:"gold"  },
          { label:"Milestones Complete",  value:`${done}/${total}`, color:"teal"  },
          { label:"Manuscript Lock",      value:"May 1", color:"orange"},
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className={`text-2xl font-black font-mono text-${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {domains.map(d => (
          <button key={d} onClick={() => setActiveDomain(d)}
            className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition-all border ${activeDomain === d ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {d}
          </button>
        ))}
      </div>

      <DashCard title="Project Timeline" accent="blue">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-3">
            {filtered.map((m, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div className="text-[9px] text-muted-foreground font-mono min-w-[46px] text-right pt-0.5">
                  {m.status === "DONE" ? "✓ Done" : `+${m.days}d`}
                </div>
                {/* dot */}
                <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 z-10 ${
                  m.status === "DONE" ? "bg-teal border-teal" :
                  m.status === "TARGET" ? "bg-gold border-gold" :
                  `bg-background border-${m.color}`
                }`} />
                <div className={`flex-1 p-2.5 rounded-lg border ${
                  m.status === "TARGET" ? "bg-gold/5 border-gold/30" :
                  m.status === "DONE" ? "bg-teal/5 border-teal/20" :
                  "bg-background border-border"
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold font-sans ${m.status === "TARGET" ? "text-gold" : m.status === "DONE" ? "text-teal" : "text-foreground"}`}>
                      {m.label}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[8px] font-mono text-${DOMAIN_COLORS[m.domain] || "muted-foreground"}`}>{m.domain}</span>
                      <span className={`text-[9px] font-bold font-mono text-${m.color}`}>{m.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashCard>
    </div>
  );
}