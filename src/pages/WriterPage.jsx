import { Link } from "react-router-dom";
import WriterTab from "../components/dashboard/WriterTab";

export default function WriterPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            ← Back to Dashboard
          </Link>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gold rounded flex items-center justify-center text-background text-[10px] font-black">Ω</div>
            <span className="text-sm font-black font-mono text-foreground">LITCENTRAL</span>
            <span className="text-muted-foreground text-xs font-mono">× Writer.com</span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-muted-foreground">
          WRITER.AI CONSOLE · PALMYRA X5
        </div>
      </div>

      {/* Full-width Writer console */}
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <WriterTab />
      </div>
    </div>
  );
}