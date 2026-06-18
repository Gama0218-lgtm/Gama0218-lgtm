import { useState } from "react";
import DashCard from "./DashCard";

const PUBLISHING_MODELS = [
  {
    id: "hybrid",
    label: "Hybrid Publishing",
    color: "teal",
    recommended: true,
    upfront: "$3,175",
    royalty: "50–85%",
    timeline: "6–12 months",
    advance: "None",
    control: "HIGH",
    netProfit: "$52,750",
    details: [
      "Palmetto Publishing full package: $7,175",
      "$4,000 author credit applied → out-of-pocket: $3,175",
      "Editing alone (130K words @ $0.036/word): $4,680",
      "50–85% net royalties retained",
      "Fast to market — capitalize on current cultural moment",
    ],
  },
  {
    id: "indie",
    label: "Self-Publishing (Indie)",
    color: "blue",
    recommended: false,
    upfront: "$2,500–$5,000",
    royalty: "60–70%",
    timeline: "1–3 months",
    advance: "None",
    control: "ABSOLUTE",
    netProfit: "~$48,000",
    details: [
      "Amazon KDP: 70% eBook royalty ($2.99–$9.99 price band)",
      "60% paperback royalty minus print cost",
      "Kindle Unlimited: $0.0042–$0.005 per page read",
      "80% of indie sales via KDP ecosystem",
      "Author bears all production + marketing burden",
    ],
  },
  {
    id: "traditional",
    label: "Traditional Publishing",
    color: "purple",
    recommended: false,
    upfront: "$0",
    royalty: "8–15% print / 25% eBook",
    timeline: "18–24 months",
    advance: "$10K–$57K median",
    control: "LOW",
    netProfit: "$30,400",
    details: [
      "Median debut advance: $10,000–$25,000",
      "Paid in thirds: signing / delivery / publication",
      "15% literary agent commission deducted",
      "No royalties until advance 'earned out'",
      "Bidding war outliers: $50K–$250K (statistical outliers)",
    ],
  },
];

const REVENUE_ROWS = [
  { stream: "eBook Sales", volume: "7,500 units", price: "$4.99", royalty: "70% (~$3.49/unit)", gross: "$26,175", color: "blue" },
  { stream: "Print Paperback", volume: "7,500 units", price: "$15.99", royalty: "~28% (~$4.50/unit)", gross: "$33,750", color: "gold" },
  { stream: "Kindle Unlimited", volume: "5M pages", price: "—", royalty: "$0.0042/page", gross: "$21,000", color: "teal" },
];

const PHASES = [
  {
    n: 1, title: "Forensic Release", color: "red",
    desc: "Distribute 'Missing Equation' white paper to military/history podcast influencers (Dan Carlin, Jocko Willink). Tiered influencer model: micro ($200–$500/deliverable) to macro.",
    kpi: "Awareness + credibility",
  },
  {
    n: 2, title: "Missing Equation Educational Tour", color: "gold",
    desc: "Physical pilgrimage: San Diego → Los Angeles → El Paso → San Antonio → Washington D.C. Target 40–100+ curriculum integrations in academic environments.",
    kpi: "40+ adoptions · 5 cities",
  },
  {
    n: 3, title: "Digital Siege", color: "blue",
    desc: "#WeAreNotCaucasian crowdsourced counter-archive. Veterans + families correct historical record. Social-first distributed campaign across Meta / TikTok / Amazon.",
    kpi: "Viral momentum · UGC scale",
  },
];

const DEMOGRAPHICS = [
  { name: "U.S. Hispanic Market", size: "$3.4–4.1T purchasing power", color: "gold", note: "Largest growing digital consumer segment. Intense brand loyalty to authentic cultural representation." },
  { name: "Vietnam-Era Veterans", size: "15.7M total / 200K+ Hispanic", color: "blue", note: "Dedicated base for military history + moral complexity narratives." },
  { name: "Chicano Studies Academia", size: "40–100+ adoptions targeted", color: "purple", note: "Institutional long-tail relevance. Curriculum integration = perennial sales." },
  { name: "Streaming Audiences", size: "55.8% Hispanic TV = streaming", color: "teal", note: "Hispanic audiences lead national streaming. SGT Ramos = turnkey 6–8 episode limited series." },
];

const STREAMING = [
  { platform: "Netflix", angle: "$300M invested in Mexican local-language originals (2025)", color: "red" },
  { platform: "HBO / Max", angle: "High-End Drama prestige — limited series format", color: "purple" },
  { platform: "ViX (TelevisaUnivision)", angle: "Spanish-language first release — cultural authenticity + fastest Hispanic penetration", color: "gold" },
  { platform: "Amazon Prime Video", angle: "English dub/subtitle simulcast — global reach multiplier", color: "blue" },
];

const BUDGET_TIERS = [
  { tier: "Lean", range: "$215K–$530K", color: "teal", note: "Grassroots + podcast + micro-influencer" },
  { tier: "Standard", range: "$850K–$1.95M", color: "gold", note: "National media + tour + digital advertising" },
  { tier: "Aggressive", range: "$2.4M–$4.95M", color: "red", note: "Full multimedia + streaming push + institutional" },
];

export default function MarketTab() {
  const [activeModel, setActiveModel] = useState("hybrid");
  const model = PUBLISHING_MODELS.find(m => m.id === activeModel);

  return (
    <div className="animate-slide-up space-y-4">

      {/* Header Banner */}
      <div className="bg-gold/5 border border-gold/30 rounded-lg p-4">
        <div className="text-sm font-black text-gold font-mono mb-1">Strategic Market Analysis — SGT George Ramos: The Mathematics of Vietnam</div>
        <div className="text-xs text-muted-foreground font-sans leading-relaxed">
          Category market size: <span className="text-gold font-bold">1.5M units / 18-month cycle</span> · Likely penetration: <span className="text-teal font-bold">1.0–1.5% (15,000–22,500 units)</span> · 18-month net profit (hybrid model): <span className="text-teal font-bold">$52,750</span>
        </div>
      </div>

      {/* Publishing Model Selector */}
      <div>
        <div className="flex gap-2 mb-3">
          {PUBLISHING_MODELS.map(m => (
            <button key={m.id} onClick={() => setActiveModel(m.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all border flex items-center gap-1.5 ${activeModel === m.id ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {m.recommended && <span className="text-teal">★</span>}
              {m.label}
            </button>
          ))}
        </div>

        {model && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashCard title={`${model.label} ${model.recommended ? "— RECOMMENDED" : ""}`} accent={model.color}>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[["Upfront Cost", model.upfront, "red"], ["Royalty Rate", model.royalty, model.color], ["Timeline", model.timeline, "blue"], ["Advance", model.advance, "gold"], ["Creative Control", model.control, "purple"], ["18mo Net Profit", model.netProfit, "teal"]].map(([label, val, col]) => (
                  <div key={label} className="p-2 bg-background rounded border border-border text-center">
                    <div className={`text-xs font-black font-mono text-${col}`}>{val}</div>
                    <div className="text-[8px] text-muted-foreground mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {model.details.map((d, i) => (
                  <div key={i} className="text-[10px] text-foreground/70 font-sans flex gap-2">
                    <span className={`text-${model.color}`}>→</span> {d}
                  </div>
                ))}
              </div>
            </DashCard>

            {/* Net Profit Comparison */}
            <DashCard title="Net Profit Comparison" accent="gold">
              <div className="space-y-3 mb-4">
                {[
                  { label: "Hybrid / Indie", value: 52750, color: "teal" },
                  { label: "Traditional Publishing", value: 30400, color: "purple" },
                ].map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-foreground/70 font-sans">{r.label}</span>
                      <span className={`font-black font-mono text-${r.color}`}>${r.value.toLocaleString()}</span>
                    </div>
                    <div className="bg-secondary rounded-full h-[6px] overflow-hidden">
                      <div className={`h-full bg-${r.color} rounded-full`} style={{ width: `${(r.value / 60000) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-teal/5 border border-teal/20 rounded-lg text-xs font-sans text-muted-foreground">
                <span className="text-teal font-bold">+$22,350 advantage</span> via hybrid/indie over traditional — based on 15,000 units sold, $4.99 eBook / $15.99 paperback, 50/50 split + KU.
              </div>
            </DashCard>
          </div>
        )}
      </div>

      {/* Revenue Model Table */}
      <DashCard title="Revenue Model — 15,000 Units (Likely Scenario)" accent="teal">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {["Revenue Stream", "Volume", "Price", "Royalty / Margin", "Gross Profit"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[9px] font-bold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REVENUE_ROWS.map((r, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-secondary/30">
                  <td className={`py-2 px-3 font-bold text-${r.color}`}>{r.stream}</td>
                  <td className="py-2 px-3 text-muted-foreground">{r.volume}</td>
                  <td className="py-2 px-3 text-muted-foreground">{r.price}</td>
                  <td className="py-2 px-3 text-muted-foreground">{r.royalty}</td>
                  <td className={`py-2 px-3 font-black font-mono text-${r.color}`}>{r.gross}</td>
                </tr>
              ))}
              <tr className="bg-teal/5">
                <td className="py-2 px-3 font-black text-teal" colSpan={4}>TOTAL GROSS REVENUE</td>
                <td className="py-2 px-3 font-black font-mono text-teal text-sm">$80,925</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-muted-foreground text-[10px]" colSpan={4}>Less Production (Palmetto − $4K credit)</td>
                <td className="py-2 px-3 font-mono text-red text-[10px]">−$3,175</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-muted-foreground text-[10px]" colSpan={4}>Less Marketing (Lean scenario)</td>
                <td className="py-2 px-3 font-mono text-red text-[10px]">−$25,000</td>
              </tr>
              <tr className="bg-gold/5">
                <td className="py-2 px-3 font-black text-gold" colSpan={4}>18-MONTH NET PROFIT</td>
                <td className="py-2 px-3 font-black font-mono text-gold text-sm">$52,750</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DashCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Demographics */}
        <DashCard title="Target Demographics" accent="gold">
          <div className="space-y-3">
            {DEMOGRAPHICS.map((d, i) => (
              <div key={i} className={`p-2.5 rounded border border-${d.color}/25 bg-${d.color}/5`}>
                <div className={`text-xs font-bold font-mono text-${d.color} mb-1`}>{d.name}</div>
                <div className={`text-[10px] font-bold text-${d.color}/70 mb-1`}>{d.size}</div>
                <div className="text-[9px] text-muted-foreground font-sans">{d.note}</div>
              </div>
            ))}
          </div>
        </DashCard>

        {/* Campaign Budget Tiers */}
        <div className="space-y-4">
          <DashCard title="Campaign Budget Tiers" accent="red">
            <div className="space-y-2">
              {BUDGET_TIERS.map((b, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-background rounded border border-border">
                  <div>
                    <div className={`text-xs font-bold font-mono text-${b.color}`}>{b.tier}</div>
                    <div className="text-[9px] text-muted-foreground font-sans">{b.note}</div>
                  </div>
                  <span className={`text-sm font-black font-mono text-${b.color}`}>{b.range}</span>
                </div>
              ))}
            </div>
          </DashCard>

          {/* Editorial Word Count */}
          <DashCard title="Editorial Transformation" accent="orange">
            <div className="space-y-2 text-xs font-sans">
              <div className="p-2 bg-red/5 border border-red/20 rounded">
                <div className="font-bold text-red mb-1">Word Count Imperative</div>
                <div className="text-muted-foreground">Current: <span className="text-gold font-bold">240,000w</span> → Target: <span className="text-teal font-bold">85,000w</span> — industry debut limit is 85K–100K. Must distill to kinetic core.</div>
              </div>
              <div className="p-2 bg-orange/5 border border-orange/20 rounded">
                <div className="font-bold text-orange mb-1">Three Veils Architecture</div>
                <div className="text-muted-foreground">Veil 1: Reality (tactical mineral grounding) · Veil 2: Memory (sensory temporal bleed) · Veil 3: Spirit (sacred ritual bridge)</div>
              </div>
              <div className="p-2 bg-blue/5 border border-blue/20 rounded">
                <div className="font-bold text-blue mb-1">Neural Cycling Rule</div>
                <div className="text-muted-foreground">Alternate rapidly: amygdala-trigger danger ↔ prefrontal moral dilemma. Target: 5 senses per scene. Ch37 current: 77.4% RRP → target: 93%+</div>
              </div>
            </div>
          </DashCard>
        </div>
      </div>

      {/* 3-Phase Campaign */}
      <DashCard title="18-Month Strategic Communication Campaign" accent="blue">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PHASES.map(p => (
            <div key={p.n} className={`p-3 rounded-lg border border-${p.color}/25 bg-${p.color}/5`}>
              <div className={`text-[9px] font-bold font-mono text-${p.color} mb-1`}>PHASE {p.n}</div>
              <div className={`text-sm font-black font-mono text-${p.color} mb-2`}>{p.title}</div>
              <div className="text-[10px] text-muted-foreground font-sans mb-3 leading-relaxed">{p.desc}</div>
              <div className={`text-[9px] font-bold text-${p.color} bg-${p.color}/10 px-2 py-1 rounded font-mono`}>KPI: {p.kpi}</div>
            </div>
          ))}
        </div>
      </DashCard>

      {/* Streaming */}
      <DashCard title="The Ultimate Multiplier — Streaming Adaptation" accent="purple">
        <div className="text-xs text-muted-foreground font-sans mb-4">
          SGT Ramos = <span className="text-gold font-bold">High-End Drama</span> · 6–8 episode limited series · turnkey cinematic blueprint (18-inch tunnels → Sacred Heart Orphanage) · option fees + backend royalties + exponential book sales catalyst
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STREAMING.map((s, i) => (
            <div key={i} className={`p-3 rounded-lg border border-${s.color}/25 bg-${s.color}/5`}>
              <div className={`text-xs font-black font-mono text-${s.color} mb-1`}>{s.platform}</div>
              <div className="text-[10px] text-muted-foreground font-sans">{s.angle}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-purple/5 border border-purple/20 rounded-lg text-xs font-sans text-muted-foreground">
          <span className="text-purple font-bold">Strategy: </span>Spanish-language first on ViX for cultural authenticity → simultaneous English dub/subtitle license to Amazon Prime or HBO for global reach. Transforms SGT Ramos from single revenue stream into <span className="text-gold font-bold">multi-million-dollar multimedia franchise</span>.
        </div>
      </DashCard>

    </div>
  );
}