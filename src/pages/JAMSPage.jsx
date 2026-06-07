import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Map, Users, Radio, BarChart2, Network, Tv, Brain, Shield } from "lucide-react";
import CommandDashboard from "../components/jam/CommandDashboard";
import BorderHubMap from "../components/jam/BorderHubMap";
import StakeholderCRM from "../components/jam/StakeholderCRM";
import SocialListeningGrid from "../components/jam/SocialListeningGrid";
import SPSSVectors from "../components/jam/SPSSVectors";
import CrossBorderNetwork from "../components/jam/CrossBorderNetwork";
import MediaPipeline from "../components/jam/MediaPipeline";
import TruthEngine360Intel from "../components/jam/TruthEngine360Intel";
import FieldOperations from "../components/jam/FieldOperations";

const TABS = [
  { id: "command", label: "Command Dashboard",       icon: Zap,       color: "gold"   },
  { id: "border",  label: "Border Hub Map",          icon: Map,       color: "orange" },
  { id: "crm",     label: "Stakeholder CRM",         icon: Users,     color: "teal"   },
  { id: "social",  label: "Social Listening Grid",   icon: Radio,     color: "purple" },
  { id: "spss",    label: "SPSS Behavioral Vectors", icon: BarChart2, color: "blue"   },
  { id: "network", label: "Cross-Border Network",    icon: Network,   color: "gold"   },
  { id: "media",   label: "Media + Podcast Pipeline",icon: Tv,        color: "orange" },
  { id: "te360",   label: "TruthEngine360 Intel",    icon: Brain,     color: "teal"   },
  { id: "field",   label: "Field Operations",        icon: Shield,    color: "red"    },
];

export default function JAMSPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("command");

  return (
    <div className="jam-app min-h-screen bg-background font-mono">
      <div className="h-1 w-full bg-gradient-to-r from-gold via-teal to-purple" />

      <div className="border-b border-border bg-card/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-mono">
            <ArrowLeft className="w-3.5 h-3.5" />LITCENTRAL
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gold font-mono tracking-widest">JAMNet</span>
              <span className="text-[8px] font-mono text-muted-foreground border border-gold/20 bg-gold/5 px-1.5 py-0.5 rounded">v3</span>
              <span className="text-[8px] font-mono text-teal border border-teal/20 bg-teal/5 px-1.5 py-0.5 rounded">TruthEngine360</span>
            </div>
            <div className="text-[9px] text-muted-foreground font-mono">Stakeholder Intelligence Platform — AUMER Foundation | Exile Patriot Project</div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-gold bg-gold/10 border border-gold/20 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />AI VIS 34.2
            </div>
            <div className="text-[9px] font-mono text-teal bg-teal/10 border border-teal/20 px-2 py-1 rounded-full">SENTIMENT 87/100</div>
            <div className="text-[9px] font-mono text-purple bg-purple/10 border border-purple/20 px-2 py-1 rounded-full">128K REACH</div>
          </div>
        </div>
      </div>

      <div className="bg-gold/10 border-b border-gold/20 px-4 md:px-6 py-2">
        <div className="max-w-[1440px] mx-auto text-[9px] font-mono text-gold flex items-center gap-3">
          <span className="font-black">⚡ REVERSE-STRATEGY ALERT:</span>
          <span>TruthEngine360 is the PRIMARY vehicle — not AlbaVoice. Deported veteran story → community first → credibility builds → gatekeepers follow. Start with highest Ψ(t) group: Chicano/Latino (I=0.94, T=0.90, λ=0.45)</span>
        </div>
      </div>

      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono whitespace-nowrap transition-all ${
                    active ? `bg-${t.color}/20 text-${t.color} border border-${t.color}/40` : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-6">
        {activeTab === "command" && <CommandDashboard />}
        {activeTab === "border"  && <BorderHubMap />}
        {activeTab === "crm"     && <StakeholderCRM />}
        {activeTab === "social"  && <SocialListeningGrid />}
        {activeTab === "spss"    && <SPSSVectors />}
        {activeTab === "network" && <CrossBorderNetwork />}
        {activeTab === "media"   && <MediaPipeline />}
        {activeTab === "te360"   && <TruthEngine360Intel />}
        {activeTab === "field"   && <FieldOperations />}
      </main>
    </div>
  );
}
