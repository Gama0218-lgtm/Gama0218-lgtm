import { useState, useEffect } from "react";
import { CHARACTER_BIBLE } from "../../lib/data";
import { base44 } from "@/api/base44Client";
import CharacterEditModal from "./CharacterEditModal";

const COLOR_RING = {
  gold:"border-gold/40", red:"border-red/40", purple:"border-purple/40",
  orange:"border-orange/40", cyan:"border-cyan/40", teal:"border-teal/40",
  pink:"border-pink/40", blue:"border-blue/40",
};
const COLOR_TEXT = {
  gold:"text-gold", red:"text-red", purple:"text-purple",
  orange:"text-orange", cyan:"text-cyan", teal:"text-teal",
  pink:"text-pink", blue:"text-blue",
};
const ARC_STATUS = {
  COMPLETE:  { label:"COMPLETE",  cls:"bg-teal/10 text-teal border-teal/30" },
  INCOMPLETE:{ label:"INCOMPLETE",cls:"bg-red/10 text-red border-red/30" },
  UPDATED:   { label:"UPDATED",   cls:"bg-blue/10 text-blue border-blue/30" },
};

export default function CharactersTab() {
  const [overrides, setOverrides] = useState([]);
  const [editing, setEditing] = useState(null); // { char, override }

  const loadOverrides = async () => {
    const data = await base44.entities.CharacterOverride.list();
    setOverrides(data);
  };

  useEffect(() => { loadOverrides(); }, []);

  // Merge static CHARACTER_BIBLE with any saved overrides
  const mergedChars = CHARACTER_BIBLE.map(char => {
    const ov = overrides.find(o => o.character_id === char.id);
    return ov ? { ...char, ...ov } : char;
  });

  const handleCardClick = (char) => {
    const ov = overrides.find(o => o.character_id === char.id) || null;
    setEditing({ char, override: ov });
  };

  return (
    <div className="animate-slide-up space-y-4">

      <div className="text-[10px] text-muted-foreground font-sans bg-card border border-border rounded-lg px-3 py-2">
        Click any character card to edit their profile — voice signature, arc status, agency pattern, and attributes are saved in real-time.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mergedChars.map(char => {
          const arcStyle = ARC_STATUS[char.arc] || ARC_STATUS.COMPLETE;
          const hasOverride = overrides.some(o => o.character_id === char.id);
          return (
            <button
              key={char.id}
              onClick={() => handleCardClick(char)}
              className={`bg-card border border-border rounded-lg p-4 border-l-[3px] ${COLOR_RING[char.color]} text-left transition-all hover:bg-secondary/30 hover:border-accent/40 group`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className={`text-sm font-black font-mono ${COLOR_TEXT[char.color]}`}>{char.name}</div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {hasOverride && (
                    <span className="text-[8px] font-bold font-mono px-1 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">EDITED</span>
                  )}
                  <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-full border ${arcStyle.cls}`}>{arcStyle.label}</span>
                </div>
              </div>
              <div className="text-[10px] text-foreground/60 font-sans leading-snug mb-2">{char.note}</div>
              {char.voice_signature && (
                <div className="text-[9px] text-muted-foreground font-sans italic mb-2 leading-snug line-clamp-2">"{char.voice_signature}"</div>
              )}
              <div className="flex items-center justify-between">
                <div className="text-[9px] text-muted-foreground font-mono">CL-MoE: <span className="text-cyan">{char.clmoe}</span></div>
                <div className="flex items-center gap-2">
                  {char.flag && <span className="text-[9px] text-red font-bold font-mono">⚠ FLAG</span>}
                  <span className="text-[9px] text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">✎ edit</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {editing && (
        <CharacterEditModal
          char={editing.char}
          override={editing.override}
          onClose={() => setEditing(null)}
          onSaved={() => { loadOverrides(); setEditing(null); }}
        />
      )}
    </div>
  );
}