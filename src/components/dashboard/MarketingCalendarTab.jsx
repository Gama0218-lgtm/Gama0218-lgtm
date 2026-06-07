import { useState } from "react";

const PHASES = [
  {
    phase: "EDITORIAL HARDENING",
    color: "red",
    months: [
      {
        month: "July 2026",
        focus: "Editorial Triage",
        deliverable: "Duplication audit; structural compression pass",
        kpis: ["Ch.9/10 duplication resolved", "15–20% word reduction plan drafted", "Priority fix list finalized"],
        icon: "✂️",
        status: "upcoming",
      },
      {
        month: "Aug 2026",
        focus: "Platform Build",
        deliverable: "Website hub; Truth Engine source-note drafting",
        kpis: ["Landing page live", "Claims Ledger seeded with 50+ entries", "GitHub repo linked publicly"],
        icon: "🏗️",
        status: "upcoming",
      },
      {
        month: "Sept 2026",
        focus: "Soft Launch",
        deliverable: "Hispanic Heritage Month essay/excerpts",
        kpis: ["1 essay published (national outlet target)", "Excerpt shared to 3+ Chicano lit networks", "Email list: 500+"],
        icon: "📢",
        status: "upcoming",
      },
      {
        month: "Nov 2026",
        focus: "Credibility Build",
        deliverable: "Veterans Day archival/source-driven campaign",
        kpis: ["DCAS data campaign live", "2+ veteran org partnerships", "Press mention in veteran/military press"],
        icon: "🎖️",
        status: "upcoming",
      },
      {
        month: "Jan 2027",
        focus: "Final Package",
        deliverable: "Submission-ready manuscript; metadata/retailer packets",
        kpis: ["BISAC codes filed", "Agent query list (50+) finalized", "MARC cataloging strategy complete"],
        icon: "📦",
        status: "upcoming",
      },
    ],
  },
  {
    phase: "DISCOVERY & LAUNCH",
    color: "gold",
    months: [
      {
        month: "Feb 2027",
        focus: "Agent Queries",
        deliverable: "First wave submissions to literary agents",
        kpis: ["50 queries sent", "Response tracking live", "Elevator pitch tested"],
        icon: "📬",
        status: "upcoming",
      },
      {
        month: "Apr 2027",
        focus: "Discovery",
        deliverable: "Creator seeding; podcast/interview circuit",
        kpis: ["5+ podcast bookings", "ARC distribution to 20+ readers", "Email list: 5,000+"],
        icon: "🎙️",
        status: "upcoming",
      },
      {
        month: "May 2027",
        focus: "Launch",
        deliverable: "Event series; educator webinars; press burst",
        kpis: ["Launch event (LA/Chicago)", "Educator webinar (50+ attendees)", "Email list: 8,000–12,000"],
        icon: "🚀",
        status: "upcoming",
      },
    ],
  },
];

const ENGINES = [
  { label: "Veteran Memory", color: "blue", desc: "DCAS records, Hill 51 testimony, Ghost Protocol documentation" },
  { label: "Chicano Cultural Reclamation", color: "gold", desc: "Heritage Month campaigns, barrio networks, Chicano lit partnerships" },
  { label: "Public-History Credibility", color: "teal", desc: "Claims Ledger, MARC metadata, archival source notes" },
  { label: "Academic Adoption", color: "purple", desc: "Course packet, PhD track, educator webinars, BISAC library codes" },
];

const METADATA = [
  { label: "Primary BISAC", value: "FIC019000 — Fiction / Literary" },
  { label: "Secondary BISAC", value: "FIC014090 — Fiction / Historical / 20th Century / Post-WWII" },
  { label: "Target Email List", value: "8,000–12,000 by Month 12" },
  { label: "Partner Orgs Target", value: "25+ institutional/community partnerships" },
  { label: "Landing Page Conversion", value: "4%–5% target rate" },
];

const COLOR_MAP = {
  red:    { bg: "bg-red/10",    border: "border-red/40",    text: "text-red",    dot: "bg-red"    },
  gold:   { bg: "bg-gold/10",   border: "border-gold/40",   text: "text-gold",   dot: "bg-gold"   },
  blue:   { bg: "bg-blue/10",   border: "border-blue/40",   text: "text-blue",   dot: "bg-blue"   },
  teal:   { bg: "bg-teal/10",   border: "border-teal/40",   text: "text-teal",   dot: "bg-teal"   },
  purple: { bg: "bg-purple/10", border: "border-purple/40", text: "text-purple", dot: "bg-purple" },
};

export default function MarketingCalendarTab() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gold/5 border border-gold/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📅</div>
          <div>
            <div className="text-sm font-black font-mono text-gold">STRATEGIC MARKETING CALENDAR — July 2026 → May 2027</div>
            <div className="text-[11px] text-muted-foreground font-sans mt-1">
              Two-track prestige literary campaign: <span className="text-red font-bold">Editorial Hardening</span> (Jul 2026–Jan 2027) →{" "}
              <span className="text-gold font-bold">Discovery & Launch</span> (Feb–May 2027)
            </div>
          </div>
        </div>
      </div>

      {/* Four Engines */}
      <div>
        <div className="text-[10px] font-black font-mono text-muted-foreground mb-2 tracking-widest">FOUR CAMPAIGN ENGINES</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ENGINES.map((e) => {
            const c = COLOR_MAP[e.color];
            return (
              <div key={e.label} className={`rounded-lg border p-3 ${c.bg} ${c.border}`}>
                <div className={`text-[10px] font-black font-mono ${c.text} mb-1`}>{e.label}</div>
                <div className="text-[10px] text-muted-foreground font-sans leading-snug">{e.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Phases */}
      {PHASES.map((phase) => {
        const c = COLOR_MAP[phase.color];
        return (
          <div key={phase.phase}>
            <div className={`text-[10px] font-black font-mono ${c.text} mb-3 tracking-widest`}>
              ── {phase.phase}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {phase.months.map((m, i) => {
                const isOpen = expanded === `${phase.phase}-${i}`;
                return (
                  <div
                    key={m.month}
                    onClick={() => setExpanded(isOpen ? null : `${phase.phase}-${i}`)}
                    className={`rounded-lg border cursor-pointer transition-all ${c.border} ${isOpen ? c.bg : "bg-card hover:bg-secondary/30"}`}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black font-mono text-muted-foreground">{m.month}</span>
                        <span className="text-base">{m.icon}</span>
                      </div>
                      <div className={`text-[11px] font-bold font-mono ${c.text} mb-1`}>{m.focus}</div>
                      <div className="text-[10px] text-muted-foreground font-sans leading-snug">{m.deliverable}</div>

                      {isOpen && (
                        <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                          <div className="text-[9px] font-black font-mono text-muted-foreground tracking-widest mb-1">KPIs</div>
                          {m.kpis.map((k, ki) => (
                            <div key={ki} className="flex items-start gap-1.5">
                              <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
                              <span className="text-[10px] text-foreground font-sans">{k}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Metadata + Blurb */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metadata */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-[10px] font-black font-mono text-teal mb-3 tracking-widest">METADATA & CATALOGING</div>
          <div className="space-y-2">
            {METADATA.map((m) => (
              <div key={m.label} className="flex items-start gap-2">
                <div className="text-[9px] font-bold font-mono text-muted-foreground w-36 flex-shrink-0 pt-0.5">{m.label}</div>
                <div className="text-[10px] font-sans text-foreground">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Blurb + Headline */}
        <div className="bg-gold/5 border border-gold/30 rounded-lg p-4 space-y-3">
          <div className="text-[10px] font-black font-mono text-gold tracking-widest">SAMPLE ASSETS</div>
          <div>
            <div className="text-[9px] font-bold font-mono text-muted-foreground mb-1">PRESS HEADLINE</div>
            <div className="text-[11px] font-bold font-sans text-foreground italic leading-snug">
              "A Major Literary Vietnam Novel Reclaims Chicano Service, Memory, and the Cost of Being Miscounted."
            </div>
          </div>
          <div>
            <div className="text-[9px] font-bold font-mono text-muted-foreground mb-1">BLURB</div>
            <div className="text-[10px] font-sans text-muted-foreground leading-relaxed italic">
              "Fifty years after Vietnam, Sgt. George Ramos is still carrying the dead… A fierce literary war novel of memory, brotherhood, and historical reclamation—a book that recasts Vietnam through Chicano experience and the long struggle to be counted correctly by history."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}