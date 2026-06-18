import { TABS } from "../../lib/data";

const GROUP_BORDER = {
  analysis: "border-t-2 border-t-purple/40",
  platform: "border-t-2 border-t-teal/40",
  research: "border-t-2 border-t-gold/40",
  live:     "border-t-2 border-t-red/40",
};

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div className="bg-card border-b border-border overflow-x-auto">
      <div className="max-w-[1440px] mx-auto flex gap-0.5 px-4 md:px-6 pt-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-2 text-[11px] font-bold font-mono rounded-t-md transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-accent text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            } ${
              tab.group ? GROUP_BORDER[tab.group] : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}