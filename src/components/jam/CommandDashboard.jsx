import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from "recharts";

const KPI_SNAPSHOT = [
  { kpi:"Brand Equity Index (BEI)",       baseline:"0",     m3:"8",    m6:"18",   m12:"30",   m18:"46",    scenario:"LIKELY",  color:"gold"   },
  { kpi:"Niche Category Market Share",    baseline:"0%",    m3:"0.02%",m6:"0.08%",m12:"0.22%",m18:"0.42%", scenario:"LIKELY",  color:"teal"   },
  { kpi:"Share of Voice (SOV)",           baseline:"0%",    m3:"0.5%", m6:"1.5%", m12:"3%",   m18:"5%",    scenario:"LIKELY",  color:"blue"   },
  { kpi:"Aided Brand Awareness",          baseline:"~0%",   m3:"5%",   m6:"15%",  m12:"22%",  m18:"30%",   scenario:"LIKELY",  color:"purple" },
  { kpi:"Active Influencer Partners",     baseline:"0",     m3:"5",    m6:"15",   m12:"25",   m18:"35",    scenario:"LIKELY",  color:"orange" },
  { kpi:"New-to-File Audience",           baseline:"0",     m3:"2K",   m6:"7K",   m12:"14K",  m18:"20K",   scenario:"LIKELY",  color:"gold"   },
];

const BRAND_RADAR = [
  { dim:"Community Trust", v:3.6 },
  { dim:"Loyalty Reach",   v:3.58 },
  { dim:"Value Engagement",v:3.24 },
  { dim:"Ch. Effectiveness",v:2.39 },
  { dim:"Msg Authenticity",v:2.25 },
];

const BEI_CURVE = [
  {m:0,worst:0,likely:0,best:0},
  {m:3,worst:4,likely:8,best:14},
  {m:6,worst:10,likely:18,best:30},
  {m:9,worst:15,likely:25,best:40},
  {m:12,worst:18,likely:30,best:49},
  {m:15,worst:22,likely:38,best:54},
  {m:18,worst:28,likely:46,best:60},
];

const RECENT_CASES = [
  { date:"May 18 2026",   event:"Congressional Hispanic Caucus Briefing",     impact:"HIGH",   color:"gold"   },
  { date:"May 22 2026",   event:"Marco Chavez / ACLU SoCal press release",    impact:"HIGH",   color:"teal"   },
  { date:"Ongoing",       event:"Exile Patriot Project framework active",      impact:"MED",    color:"blue"   },
  { date:"TBD",           event:"USLDH Grant application (rolling deadline)",  impact:"P0",     color:"red"    },
  { date:"Sep–Nov 2026",  event:"HHM + Veterans Day launch corridor",          impact:"PEAK",   color:"gold"   },
];

const PHASE_MILESTONES = [
  { phase:"Phase 1 — Foundation",   months:"Feb–Apr 2026",  status:"ACTIVE",   color:"gold",  items:["Source audit + rights inventory","Canonical title lock","Proof ledger + fact-risk register","AUMER Foundation LinkedIn launch"] },
  { phase:"Phase 2 — Brand Build",  months:"Apr–Jun 2026",  status:"UPCOMING", color:"teal",  items:["Website hub v1 live","Press kit + partner deck","Message testing (paid social panels)","CRM stack + GA4 deploy"] },
  { phase:"Phase 3 — Seeding",      months:"Jun–Aug 2026",  status:"PLANNED",  color:"blue",  items:["Creator cohort activated (15-20)","Soft PR wave — origin story","Institutional mapping complete","Community events (Boyle Heights, East LA)"] },
  { phase:"Phase 4 — Launch",       months:"Sep–Nov 2026",  status:"PLANNED",  color:"purple",items:["Hispanic Heritage Month activation","Veterans Day peak moment","Launch media burst","Educator + library outreach"] },
  { phase:"Phase 5 — Expansion",    months:"Dec 2026+",     status:"PLANNED",  color:"orange",items:["Curriculum + library push","Awards circuit engagement","Adaptation pitch (Sundance)","Long-tail earned media waves"] },
];

export default function CommandDashboard() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 via-card to-teal/5 p-6">
        <div className="text-[8px] font-mono text-gold tracking-widest mb-2">SGT GEORGE RAMOS: THE MATHEMATICS OF VIETNAM — STRATEGIC COMMUNICATION COMMAND CENTER | GCD: FEB 15 2026</div>
        <div className="text-2xl font-black text-foreground mb-1">JAMNet Command Dashboard</div>
        <div className="text-xs text-muted-foreground mb-4">5-Phase Campaign · HHM + Veterans Day Launch Corridor (Sep–Nov 2026) · BEI Target 46/100 by Month 18 · SOV ~5% · Niche Share 0.42%</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {label:"Campaign Phase",   val:"Phase 1",    sub:"Foundation",     color:"gold"},
            {label:"Days to HHM Launch",val:"~120",      sub:"Sep 15 2026",    color:"orange"},
            {label:"P0 Actions Due",   val:"4",          sub:"This week",      color:"red"},
            {label:"Stakeholders Mapped",val:"47",       sub:"128K est. reach",color:"teal"},
          ].map((s,i) => (
            <div key={i} className={`bg-background/60 border border-${s.color}/20 rounded-xl p-3 text-center`}>
              <div className={`text-2xl font-black font-mono text-${s.color}`}>{s.val}</div>
              <div className="text-[8px] font-bold text-foreground mt-0.5">{s.label}</div>
              <div className="text-[8px] text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* KPI Scorecard */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-gold">KPI SNAPSHOT — Month 18 LIKELY Scenario Targets</div>
          <table className="w-full text-[9px]">
            <thead><tr className="border-b border-border/50 text-[7px] font-mono text-muted-foreground">
              <th className="text-left px-3 py-1.5">KPI</th>
              <th className="text-center px-2 py-1.5">NOW</th>
              <th className="text-center px-2 py-1.5">M3</th>
              <th className="text-center px-2 py-1.5">M6</th>
              <th className="text-center px-2 py-1.5">M12</th>
              <th className="text-center px-2 py-1.5">M18</th>
              <th className="text-center px-2 py-1.5">SCENARIO</th>
            </tr></thead>
            <tbody>
              {KPI_SNAPSHOT.map((k,i) => (
                <tr key={i} className="border-b border-border/20 hover:bg-secondary/10">
                  <td className={`px-3 py-2 font-bold text-${k.color}`}>{k.kpi}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground font-mono">{k.baseline}</td>
                  <td className="px-2 py-2 text-center text-foreground font-mono">{k.m3}</td>
                  <td className="px-2 py-2 text-center text-foreground font-mono">{k.m6}</td>
                  <td className="px-2 py-2 text-center text-foreground font-mono">{k.m12}</td>
                  <td className={`px-2 py-2 text-center font-black font-mono text-${k.color}`}>{k.m18}</td>
                  <td className="px-2 py-2 text-center text-[7px] font-mono text-teal">{k.scenario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Brand Radar */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-[9px] font-bold font-mono text-gold mb-2">VETERAN BRAND RADAR — Discovery Phase</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={BRAND_RADAR}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="dim" tick={{fontSize:7,fill:"hsl(var(--muted-foreground))",fontFamily:"monospace"}} />
              <Radar dataKey="v" stroke="hsl(var(--gold))" fill="hsl(var(--gold))" fillOpacity={0.25} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="text-[8px] text-muted-foreground text-center mt-1">Community Trust peaks at 3.6 · Channel Effectiveness gap = priority fix</div>
        </div>
      </div>

      {/* BEI Projection Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-[9px] font-bold font-mono text-teal mb-3">BRAND EQUITY INDEX — 18-Month Projection (3 Scenarios)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={BEI_CURVE}>
            <XAxis dataKey="m" tick={{fontSize:8,fill:"hsl(var(--muted-foreground))",fontFamily:"monospace"}} label={{value:"Month",position:"insideBottom",offset:-2,fontSize:8,fill:"hsl(var(--muted-foreground))"}} />
            <YAxis tick={{fontSize:8,fill:"hsl(var(--muted-foreground))",fontFamily:"monospace"}} domain={[0,70]} />
            <Tooltip contentStyle={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",fontSize:9,fontFamily:"monospace"}} />
            <Line type="monotone" dataKey="best"   stroke="hsl(var(--teal))"   strokeWidth={2} dot={false} name="Best (BEI 60)"   />
            <Line type="monotone" dataKey="likely" stroke="hsl(var(--gold))"   strokeWidth={2.5} dot={false} name="Likely (BEI 46)"  />
            <Line type="monotone" dataKey="worst"  stroke="hsl(var(--red))"    strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="Worst (BEI 28)"  />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Case Feed */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-purple">LIVE CASE REFERENCES + EVENTS</div>
          {RECENT_CASES.map((c,i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-border/30 last:border-0 hover:bg-secondary/10">
              <div className="text-[8px] font-mono text-muted-foreground w-24 flex-shrink-0">{c.date}</div>
              <div className="flex-1 text-[9px] text-foreground">{c.event}</div>
              <span className={`text-[7px] font-bold font-mono px-1.5 py-0.5 rounded border text-${c.color} border-${c.color}/30 bg-${c.color}/5 flex-shrink-0`}>{c.impact}</span>
            </div>
          ))}
        </div>

        {/* Phase milestones */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/20 text-[9px] font-bold font-mono text-orange">18-MONTH PHASE MILESTONES</div>
          <div className="divide-y divide-border/30">
            {PHASE_MILESTONES.map((p,i) => (
              <div key={i} className={`px-4 py-3 hover:bg-secondary/10 ${p.status==="ACTIVE"?`bg-${p.color}/5`:""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`text-[9px] font-black text-${p.color}`}>{p.phase}</div>
                  <span className={`text-[7px] font-mono px-1 rounded text-${p.color} bg-${p.color}/10 border border-${p.color}/20`}>{p.status}</span>
                  <span className="text-[7px] text-muted-foreground font-mono ml-auto">{p.months}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.items.map((item,j) => (
                    <span key={j} className="text-[7px] text-muted-foreground">{j > 0 ? "·" : ""} {item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}