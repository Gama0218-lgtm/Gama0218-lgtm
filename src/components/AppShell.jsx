import Sidebar from "@/components/Sidebar";
import TitleBar from "@/components/TitleBar";
import StatusBar from "@/components/StatusBar";

export default function AppShell({ children }) {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TitleBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-1 scroll-smooth">
          {children}
        </main>
        <StatusBar />
      </div>
    </div>
  );
}
