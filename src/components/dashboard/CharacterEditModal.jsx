import { useState } from "react";
import { base44 } from "@/api/base44Client";

const ARC_OPTIONS = ["COMPLETE", "INCOMPLETE", "UPDATED"];
const COLOR_OPTIONS = ["gold", "red", "purple", "orange", "cyan", "teal", "pink", "blue"];

export default function CharacterEditModal({ char, override, onClose, onSaved }) {
  const [form, setForm] = useState({
    name:            override?.name            ?? char.name,
    arc:             override?.arc             ?? char.arc,
    note:            override?.note            ?? char.note,
    voice_signature: override?.voice_signature ?? char.voice_signature ?? "",
    agency_pattern:  override?.agency_pattern  ?? char.agency_pattern  ?? "",
    flag:            override?.flag            ?? char.flag,
    clmoe:           override?.clmoe           ?? char.clmoe,
    color:           override?.color           ?? char.color,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false); };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, character_id: char.id, clmoe: parseFloat(form.clmoe) || 0 };
    if (override?.id) {
      await base44.entities.CharacterOverride.update(override.id, payload);
    } else {
      await base44.entities.CharacterOverride.create(payload);
    }
    setSaving(false);
    setSaved(true);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <div className={`text-sm font-black font-mono text-${form.color}`}>{form.name}</div>
            <div className="text-[9px] text-muted-foreground font-mono">Edit Character Profile</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
        </div>

        <div className="p-4 space-y-4">

          {/* Name */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Character Name</label>
            <input
              value={form.name}
              onChange={e => set("name", e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          {/* Arc Status */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Arc Status</label>
            <div className="flex gap-2 flex-wrap">
              {ARC_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => set("arc", opt)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold font-mono border transition-all ${
                    form.arc === opt
                      ? opt === "COMPLETE" ? "bg-teal/20 border-teal/50 text-teal"
                        : opt === "INCOMPLETE" ? "bg-red/20 border-red/50 text-red"
                        : "bg-blue/20 border-blue/50 text-blue"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Display Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => set("color", c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all bg-${c}/60 ${form.color === c ? `border-${c}` : "border-transparent opacity-50 hover:opacity-80"}`}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Voice Signature */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Voice Signature</label>
            <textarea
              value={form.voice_signature}
              onChange={e => set("voice_signature", e.target.value)}
              placeholder="How this character speaks and thinks..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground resize-none h-20 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Agency Pattern */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Agency Pattern</label>
            <textarea
              value={form.agency_pattern}
              onChange={e => set("agency_pattern", e.target.value)}
              placeholder="How this character takes action in the story..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground resize-none h-16 focus:outline-none focus:border-accent"
            />
          </div>

          {/* Key Note */}
          <div>
            <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Key Attributes / Status Note</label>
            <textarea
              value={form.note}
              onChange={e => set("note", e.target.value)}
              placeholder="Current status, flags, editorial notes..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground resize-none h-16 focus:outline-none focus:border-accent"
            />
          </div>

          {/* CL-MoE + Flag row */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">CL-MoE Drift Score</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={form.clmoe}
                onChange={e => set("clmoe", e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide block mb-1">Warning Flag</label>
              <button
                onClick={() => set("flag", !form.flag)}
                className={`px-4 py-2 rounded-lg text-xs font-bold font-mono border transition-all ${
                  form.flag ? "bg-red/20 border-red/50 text-red" : "bg-background border-border text-muted-foreground"
                }`}
              >
                {form.flag ? "⚠ FLAGGED" : "CLEAR"}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold font-mono border border-border text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
              saved ? "bg-teal/20 border border-teal/50 text-teal" : "bg-accent text-white hover:bg-accent/80"
            } disabled:opacity-50`}
          >
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}