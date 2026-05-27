import { Map, MapPin } from "lucide-react";

const HUBS = [
  { id: "tj",   name: "Tijuana / San Ysidro",   intake: 12, status: "active" },
  { id: "mxli", name: "Mexicali / Calexico",    intake: 6,  status: "active" },
  { id: "ngls", name: "Nogales",                intake: 4,  status: "active" },
  { id: "jrz",  name: "Ciudad Juárez / El Paso",intake: 9,  status: "active" },
  { id: "ph",   name: "Piedras Negras / Eagle", intake: 3,  status: "watch"  },
  { id: "mat",  name: "Matamoros / Brownsville",intake: 5,  status: "active" },
];

export default function BorderHubMap() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Map className="w-4 h-4 text-orange" />
        <h2 className="text-sm font-black font-mono text-orange tracking-widest">BORDER HUB MAP</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {HUBS.map((h) => {
          const tone = h.status === "active" ? "teal" : "gold";
          return (
            <div key={h.id} className={`rounded-lg border border-${tone}/30 bg-${tone}/5 p-3`}>
              <div className="flex items-center gap-2">
                <MapPin className={`w-3.5 h-3.5 text-${tone}`} />
                <span className="text-[11px] font-bold font-mono text-foreground">{h.name}</span>
              </div>
              <div className="text-[9px] font-mono text-muted-foreground mt-1">Status: <span className={`text-${tone}`}>{h.status.toUpperCase()}</span></div>
              <div className="text-[9px] font-mono text-muted-foreground">Intake (7d): <span className="text-foreground font-bold">{h.intake}</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
