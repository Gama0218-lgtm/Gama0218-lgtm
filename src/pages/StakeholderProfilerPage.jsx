import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Network, BarChart2, MapPin, Target, Activity, Users, Zap } from "lucide-react";
import SocialPhysicsEngine from "../components/profiler/SocialPhysicsEngine";
import BehaviorMatrix from "../components/profiler/BehaviorMatrix";
import PlatformIntelligence from "../components/profiler/PlatformIntelligence";
import CommunityLocationIntel from "../components/profiler/CommunityLocationIntel";
import SPSSAnalysisView from "../components/profiler/SPSSAnalysisView";
import NetworkMapView from "../components/profiler/NetworkMapView";

const TABS = [
  { id:"engine",     label:"Social Physics Engine", icon: Zap       },
  { id:"matrix",     label:"Behavior Matrix",        icon: Brain     },
  { id:"network",    label:"Network Map",            icon: Network   },
  { id:"platforms",  label:"Platform Intel",         icon: Activity  },
  { id:"community",  label:"Community Locations",    icon: MapPin    },
  { id:"spss",       label:"SPSS Analysis",          icon: BarChart2 },
];

export default function StakeholderProfilerPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("engine");

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-purple via-gold to-teal" />

      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs font-mono">
            <ArrowLeft className="w-3.5 h-3.5" />LITCENTRAL
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-purple font-mono">STAKEHOLDER NETWORK PROFILER — SOCIAL PHYSICS INTELLIGENCE</div>
            <div className="text-[9px] text-muted-foreground font-mono">R = I·C·T·(1−e^(−λ·E)) | Behavioral Indicator Schema | SPSS Analysis | Community Intel</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono text-purple bg-purple/10 border border-purple/30 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse" />
              LIVE PROFILER
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full">
              <Users className="w-3 h-3" />
              42 Profiles
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono text-teal bg-teal/10 border border-teal/30 px-3 py-1 rounded-full">
              <Target className="w-3 h-3" />
              8 Cohorts
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-card/50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold font-mono whitespace-nowrap transition-all ${
                    activeTab === t.id ? "bg-purple text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}>
                  <Icon className="w-3 h-3" />{t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        {activeTab === "engine"    && <SocialPhysicsEngine />}
        {activeTab === "matrix"   && <BehaviorMatrix />}
        {activeTab === "network"  && <NetworkMapView />}
        {activeTab === "platforms"&& <PlatformIntelligence />}
        {activeTab === "community"&& <CommunityLocationIntel />}
        {activeTab === "spss"     && <SPSSAnalysisView />}
      </main>
    </div>
  );
}