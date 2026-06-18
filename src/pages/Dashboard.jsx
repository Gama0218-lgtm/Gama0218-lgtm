import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GradientStripe from "../components/dashboard/GradientStripe";
import Header from "../components/dashboard/Header";
import TabNav from "../components/dashboard/TabNav";
import OverviewTab from "../components/dashboard/OverviewTab";
import ChaptersTab from "../components/dashboard/ChaptersTab";
import ScoresTab from "../components/dashboard/ScoresTab";
import CLMoETab from "../components/dashboard/CLMoETab";
import NeroTab from "../components/dashboard/NeroTab";
import EmotionTab from "../components/dashboard/EmotionTab";
import NDRTab from "../components/dashboard/NDRTab";
import FleshTab from "../components/dashboard/FleshTab";
import BugsTab from "../components/dashboard/BugsTab";
import GlossaryTab from "../components/dashboard/GlossaryTab";
import CharactersTab from "../components/dashboard/CharactersTab";
import ArcsTab from "../components/dashboard/ArcsTab";
import ResearchTab from "../components/dashboard/ResearchTab";
import PacingTab from "../components/dashboard/PacingTab";
import PlatformTab from "../components/dashboard/PlatformTab";
import ResearchDatabaseTab from "../components/dashboard/ResearchDatabaseTab";
import HistoricalAccuracyTab from "../components/dashboard/HistoricalAccuracyTab";
import HistoricalCrossRefTab from "../components/dashboard/HistoricalCrossRefTab";
import ModulesTab from "../components/dashboard/ModulesTab";
import CanonTab from "../components/dashboard/CanonTab";
import CampaignTab from "../components/dashboard/CampaignTab";
import BetaTab from "../components/dashboard/BetaTab";
import AIIntelTab from "../components/dashboard/AIIntelTab";
import MarketTab from "../components/dashboard/MarketTab";
import FlagsTab from "../components/dashboard/FlagsTab";
import TimelineTab from "../components/dashboard/TimelineTab";
import GrantsTab from "../components/dashboard/GrantsTab";
import PhDTab from "../components/dashboard/PhDTab";
import FOIATab from "../components/dashboard/FOIATab";
import VeteransTab from "../components/dashboard/VeteransTab";
import SearchTab from "../components/dashboard/SearchTab";
import NarrativeIntelTab from "../components/dashboard/NarrativeIntelTab";
import WriterTab from "../components/dashboard/WriterTab";
import MotifMapTab from "../components/dashboard/MotifMapTab";
import CharacterVoiceTab from "../components/dashboard/CharacterVoiceTab";
import FullReportTab from "../components/dashboard/FullReportTab";
import EmotionValenceChart from "../components/dashboard/EmotionValenceChart";
import ChapterProgressTracker from "../components/dashboard/ChapterProgressTracker";
import PlaceholderTab from "../components/dashboard/PlaceholderTab";
import PDFExportModal from "../components/dashboard/PDFExportModal";
import AuditProgressTab from "../components/dashboard/AuditProgressTab";
import LitAuditReport from "../components/dashboard/LitAuditReport";
import CanonWorthinessTab from "../components/dashboard/CanonWorthinessTab";
import TabErrorBoundary from "../components/dashboard/TabErrorBoundary";
import NotesSidebar from "../components/dashboard/NotesSidebar";
import NOVILRoadmapTab from "../components/dashboard/NOVILRoadmapTab";
import ForensicAuditTab from "../components/dashboard/ForensicAuditTab";
import SubmissionReadinessTab from "../components/dashboard/SubmissionReadinessTab";
import QuarantineTab from "../components/dashboard/QuarantineTab";
import ChapterComparisonTab from "../components/dashboard/ChapterComparisonTab";
import DataIntelTab from "../components/dashboard/DataIntelTab";
import SPSSTab from "../components/dashboard/SPSSTab";
import BugFixRoadmapTab from "../components/dashboard/BugFixRoadmapTab";
import ChapterRevisionTab from "../components/dashboard/ChapterRevisionTab";
import CommandCenterTab from "../components/dashboard/CommandCenterTab";
import RemediationTab from "../components/dashboard/RemediationTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showExport, setShowExport] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    if (tab === "writer") { navigate("/writer"); return; }
    setActiveTab(tab);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":    return <OverviewTab />;
      case "chapters":    return <ChaptersTab />;
      case "scores":      return <ScoresTab />;
      case "clmoe":       return <CLMoETab />;
      case "nero":        return <NeroTab />;
      case "emotion":     return <EmotionTab />;
      case "ndr":         return <NDRTab />;
      case "flesh":       return <FleshTab />;
      case "bugs":        return <BugsTab />;
      case "glossary":    return <GlossaryTab />;
      case "characters":  return <CharactersTab />;
      case "arcs":        return <ArcsTab />;
      case "research":    return <ResearchTab />;
      case "pacing":      return <PacingTab />;
      case "platform":    return <PlatformTab />;
      case "research_db": return <ResearchDatabaseTab />;
      case "accuracy":    return <HistoricalAccuracyTab />;
      case "crossref":    return <HistoricalCrossRefTab />;
      case "modules":     return <ModulesTab />;
      case "canon":       return <CanonTab />;
      case "campaign":    return <CampaignTab />;
      case "beta":        return <BetaTab />;
      case "aiintel":     return <AIIntelTab />;
      case "market":      return <MarketTab />;
      case "flags":       return <FlagsTab />;
      case "timeline":    return <TimelineTab />;
      case "grants":      return <GrantsTab />;
      case "phd":         return <PhDTab />;
      case "foia":        return <FOIATab />;
      case "veterans":    return <VeteransTab />;
      case "search":      return <SearchTab />;
      case "narintel":    return <NarrativeIntelTab />;
      case "writer":      return <WriterTab />;
      case "motif":       return <MotifMapTab />;
      case "charvoice":   return <CharacterVoiceTab />;
      case "report":      return <FullReportTab />;
      case "valence":     return <EmotionValenceChart />;
      case "chprogress":  return <ChapterProgressTracker />;
      case "auditprog":   return <AuditProgressTab />;
      case "litaudit":    return <LitAuditReport />;
      case "canonworth":  return <CanonWorthinessTab />;
      case "novil":        return <NOVILRoadmapTab />;
      case "forensic":     return <ForensicAuditTab />;
      case "submission":   return <SubmissionReadinessTab />;
      case "quarantine":   return <QuarantineTab />;
      case "comparison":   return <ChapterComparisonTab />;
      case "dataintel":    return <DataIntelTab />;
      case "spss":         return <SPSSTab />;
      case "bugfix":        return <BugFixRoadmapTab />;
      case "revision":      return <ChapterRevisionTab />;
      case "command":       return <CommandCenterTab />;
      case "remediate":     return <RemediationTab />;
      default:            return <PlaceholderTab name={activeTab.toUpperCase()} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <GradientStripe />
      <Header onExport={() => setShowExport(true)} />
      <TabNav activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-5">
        <TabErrorBoundary key={activeTab}>
          {renderTab()}
        </TabErrorBoundary>
      </main>
      {showExport && <PDFExportModal onClose={() => setShowExport(false)} />}
      <NotesSidebar />
    </div>
  );
}