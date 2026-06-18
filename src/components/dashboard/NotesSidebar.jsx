import { useState, useEffect, useRef, useMemo } from "react";
import { CHAPTERS } from "../../lib/data";

const NOTES_KEY = "litcentral_chapter_notes";
const TAGS_KEY  = "litcentral_note_char_tags";

// ─── Character registry — matches names/aliases found in notes ────────────────
const CHAR_REGISTRY = [
  {
    id: "ramos",
    name: "SGT George Ramos",
    aliases: ["ramos", "george ramos", "george", "sgt ramos"],
    color: "gold",
    icon: "🪖",
    driftChapters: [9, 39],
    auditNote: "Near-zero drift. Voice perfectly maintained Ch.1–Ch.41.",
  },
  {
    id: "crawford",
    name: "Capt. Crawford",
    aliases: ["crawford", "james crawford", "capt crawford", "captain crawford"],
    color: "red",
    icon: "📋",
    driftChapters: [21, 29, 35],
    auditNote: "Controlled drift — intentional moral degradation arc.",
  },
  {
    id: "joshua",
    name: "Joshua Sagasta",
    aliases: ["joshua", "sagasta", "joshua sagasta"],
    color: "purple",
    icon: "🌵",
    driftChapters: [5],
    auditNote: "⚠ WHERE IS JOSHUA IN ACT II-III? Absence = 82.2%.",
  },
  {
    id: "duc",
    name: "Major Duc",
    aliases: ["duc", "major duc", "pham duc"],
    color: "cyan",
    icon: "🗺️",
    driftChapters: [27],
    auditNote: "⚠ Ch.39 presence still needed — Hearing Hall.",
  },
  {
    id: "oneil",
    name: "PFC O'Neil",
    aliases: ["o'neil", "oneil", "o neil"],
    color: "blue",
    icon: "🏔️",
    driftChapters: [20],
    auditNote: "Boston/Kentucky dialect + squad Spanglish.",
  },
  {
    id: "ramirez",
    name: "CPL Ramirez",
    aliases: ["ramirez", "cpl ramirez", "corporal ramirez"],
    color: "red",
    icon: "🎖️",
    driftChapters: [9],
    auditNote: "⚠ CRITICAL: Called 'Rodriguez' ~60% through Ch.9.",
  },
  {
    id: "martinez",
    name: "PFC Martinez",
    aliases: ["martinez", "pfc martinez", "corporal martinez"],
    color: "orange",
    icon: "🖌️",
    driftChapters: [],
    auditNote: "628 days must pay off in Ch.35.",
  },
  {
    id: "benavides",
    name: "Roy Benavides",
    aliases: ["benavides", "tango mike mike", "roy benavides"],
    color: "teal",
    icon: "🏅",
    driftChapters: [],
    auditNote: "Medal of Honor. Extraction sequence Ch.39.",
  },
];

const COLOR_CFG = {
  gold:   { text: "text-gold",   bg: "bg-gold/10",   border: "border-gold/30"   },
  red:    { text: "text-red",    bg: "bg-red/10",    border: "border-red/30"    },
  purple: { text: "text-purple", bg: "bg-purple/10", border: "border-purple/30" },
  cyan:   { text: "text-cyan",   bg: "bg-cyan/10",   border: "border-cyan/30"   },
  blue:   { text: "text-blue",   bg: "bg-blue/10",   border: "border-blue/30"   },
  orange: { text: "text-orange", bg: "bg-orange/10", border: "border-orange/30" },
  teal:   { text: "text-teal",   bg: "bg-teal/10",   border: "border-teal/30"   },
};

// Detect which characters are mentioned in a note text
function detectCharacters(text) {
  if (!text?.trim()) return [];
  const lower = text.toLowerCase();
  const found = new Set();
  for (const char of CHAR_REGISTRY) {
    for (const alias of char.aliases) {
      if (lower.includes(alias)) { found.add(char.id); break; }
    }
  }
  return [...found];
}

// Highlight character names in text with colored spans (returns segments)
function highlightText(text) {
  if (!text?.trim()) return [{ type: "text", value: text }];
  const segments = [];
  let remaining = text;
  let safety = 0;

  while (remaining.length > 0 && safety++ < 2000) {
    let earliest = { idx: Infinity, char: null, matchLen: 0 };
    const lower = remaining.toLowerCase();

    for (const char of CHAR_REGISTRY) {
      for (const alias of char.aliases) {
        const idx = lower.indexOf(alias);
        if (idx !== -1 && idx < earliest.idx) {
          earliest = { idx, char, matchLen: alias.length };
        }
      }
    }

    if (earliest.idx === Infinity) {
      segments.push({ type: "text", value: remaining });
      break;
    }

    if (earliest.idx > 0) {
      segments.push({ type: "text", value: remaining.slice(0, earliest.idx) });
    }
    segments.push({
      type: "char",
      value: remaining.slice(earliest.idx, earliest.idx + earliest.matchLen),
      char: earliest.char,
    });
    remaining = remaining.slice(earliest.idx + earliest.matchLen);
  }

  return segments;
}

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || "{}"); }
  catch { return {}; }
}
function saveNotes(n) { localStorage.setItem(NOTES_KEY, JSON.stringify(n)); }

// ─── Character Profile Card (shown in sidebar) ────────────────────────────────
function CharProfileCard({ char }) {
  const cfg = COLOR_CFG[char.color] || COLOR_CFG.gold;
  return (
    <div className={`rounded-lg border p-2.5 ${cfg.border} ${cfg.bg}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{char.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-[9px] font-black font-mono ${cfg.text} truncate`}>{char.name}</div>
          {char.driftChapters.length > 0 && (
            <div className="flex gap-0.5 mt-0.5 flex-wrap">
              {char.driftChapters.map(ch => (
                <span key={ch} className="text-[7px] font-bold font-mono px-1 py-px rounded border border-red/30 bg-red/10 text-red">
                  Ch.{ch} drift
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="text-[8px] text-muted-foreground font-sans leading-tight">{char.auditNote}</div>
    </div>
  );
}

// ─── Highlighted note preview ─────────────────────────────────────────────────
function NoteHighlight({ text }) {
  const segments = useMemo(() => highlightText(text), [text]);
  return (
    <div className="text-xs font-sans leading-relaxed text-foreground/85 whitespace-pre-wrap">
      {segments.map((seg, i) => {
        if (seg.type === "text") return <span key={i}>{seg.value}</span>;
        const cfg = COLOR_CFG[seg.char.color] || COLOR_CFG.gold;
        return (
          <span key={i} className={`font-bold ${cfg.text} underline decoration-dotted`} title={seg.char.name}>
            {seg.value}
          </span>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NotesSidebar() {
  const [open, setOpen]           = useState(false);
  const [notes, setNotes]         = useState(loadNotes);
  const [selectedCh, setSelectedCh] = useState(1);
  const [draft, setDraft]         = useState("");
  const [preview, setPreview]     = useState(false); // toggle between edit/highlight view
  const [charFilter, setCharFilter] = useState(null); // filter index by character id
  const textareaRef = useRef(null);

  useEffect(() => { setDraft(notes[selectedCh] || ""); setPreview(false); }, [selectedCh]);
  useEffect(() => {
    if (open) {
      setDraft(notes[selectedCh] || "");
      setTimeout(() => textareaRef.current?.focus(), 120);
    }
  }, [open]);

  const handleSave = () => {
    const updated = { ...notes, [selectedCh]: draft };
    setNotes(updated); saveNotes(updated);
  };
  const handleClear = () => {
    const updated = { ...notes }; delete updated[selectedCh];
    setNotes(updated); saveNotes(updated); setDraft("");
  };

  // Detect tagged characters for current draft
  const taggedCharIds = useMemo(() => detectCharacters(draft), [draft]);
  const taggedChars   = taggedCharIds.map(id => CHAR_REGISTRY.find(c => c.id === id)).filter(Boolean);

  // Build notes index — optionally filtered by character
  const chaptersWithNotes = Object.keys(notes).filter(k => notes[k]?.trim());
  const filteredIndex = charFilter
    ? chaptersWithNotes.filter(k => detectCharacters(notes[k]).includes(charFilter))
    : chaptersWithNotes;

  // Build per-character tag summary across ALL notes
  const allCharTags = useMemo(() => {
    const map = {};
    for (const chKey of chaptersWithNotes) {
      for (const id of detectCharacters(notes[chKey])) {
        map[id] = (map[id] || 0) + 1;
      }
    }
    return map;
  }, [notes]);

  const currentChapter = CHAPTERS.find(c => c.ch === selectedCh);
  const isSaved = draft === (notes[selectedCh] || "");

  return (
    <>
      {/* Toggle tab */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1 py-4 px-1.5 rounded-l-lg border border-border border-r-0 transition-all ${
          open ? "bg-gold text-background" : "bg-card text-gold hover:bg-secondary"
        }`}
        title="Chapter Notes"
      >
        <span className="text-[9px] font-black font-mono" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
          NOTES
        </span>
        {chaptersWithNotes.length > 0 && (
          <span className={`text-[8px] font-black font-mono px-1 rounded-full ${open ? "bg-background/30 text-background" : "bg-gold/20 text-gold"}`}>
            {chaptersWithNotes.length}
          </span>
        )}
        <span className="text-[10px]">{open ? "›" : "‹"}</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full z-30 flex flex-col bg-card border-l border-border shadow-2xl transition-all duration-300 ${
          open ? "w-80" : "w-0 overflow-hidden"
        }`}
      >
        {open && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background/60 flex-shrink-0">
              <span className="text-gold font-black font-mono text-xs">📝 CHAPTER NOTES</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
            </div>

            {/* Chapter selector */}
            <div className="px-3 py-2 border-b border-border flex-shrink-0">
              <select
                value={selectedCh}
                onChange={e => setSelectedCh(Number(e.target.value))}
                className="w-full bg-secondary border border-border rounded px-2 py-1.5 text-[10px] font-mono text-foreground focus:outline-none focus:border-gold"
              >
                {CHAPTERS.map(c => (
                  <option key={c.ch} value={c.ch}>
                    Ch.{c.ch} {c.title}{notes[c.ch]?.trim() ? " ✎" : ""}
                  </option>
                ))}
              </select>
              {currentChapter && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[8px] font-mono text-muted-foreground">Act {currentChapter.act}</span>
                  <span className="text-[8px] font-mono text-gold">Ω{currentChapter.omega}</span>
                  <span className="text-[8px] font-mono text-muted-foreground">{currentChapter.words?.toLocaleString()}w</span>
                </div>
              )}
            </div>

            {/* Note editor / preview area */}
            <div className="flex flex-col px-3 py-3 flex-shrink-0" style={{ minHeight: "160px", maxHeight: "260px" }}>
              {/* Edit / Preview toggle */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[8px] font-bold font-mono text-muted-foreground uppercase">Note</div>
                {draft && (
                  <button onClick={() => setPreview(p => !p)}
                    className="text-[8px] font-mono text-accent hover:underline">
                    {preview ? "✏ Edit" : "👁 Preview"}
                  </button>
                )}
              </div>

              {preview && draft ? (
                <div className="flex-1 overflow-y-auto bg-background border border-border rounded-lg px-3 py-2 min-h-[100px]">
                  <NoteHighlight text={draft} />
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder={`Research findings for Ch.${selectedCh}…\n\nMention characters by name — e.g. "Ramos", "Crawford", "Joshua", "O'Neil" — to auto-tag their profiles.`}
                  className="flex-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-sans text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-gold/60 leading-relaxed min-h-[100px]"
                />
              )}

              {/* Auto-detected character tags */}
              {taggedChars.length > 0 && (
                <div className="mt-2">
                  <div className="text-[7px] font-bold font-mono text-muted-foreground uppercase tracking-wide mb-1">Auto-tagged profiles</div>
                  <div className="flex flex-wrap gap-1">
                    {taggedChars.map(char => {
                      const cfg = COLOR_CFG[char.color] || COLOR_CFG.gold;
                      return (
                        <span key={char.id} className={`flex items-center gap-1 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border ${cfg.text} ${cfg.border} ${cfg.bg}`}>
                          {char.icon} {char.id === "ramos" ? "Ramos" : char.name.split(" ").pop()}
                          {char.driftChapters.includes(selectedCh) && (
                            <span className="text-red text-[7px]">⚠</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Save / Clear */}
              <div className="flex gap-2 mt-2">
                <button onClick={handleSave} disabled={isSaved}
                  className="flex-1 py-1.5 bg-gold text-background rounded text-[10px] font-black font-mono disabled:opacity-40 hover:bg-gold/80 transition-all">
                  SAVE
                </button>
                {notes[selectedCh]?.trim() && (
                  <button onClick={handleClear}
                    className="px-3 py-1.5 border border-border rounded text-[10px] font-mono text-muted-foreground hover:text-red hover:border-red/40 transition-all">
                    CLEAR
                  </button>
                )}
              </div>
              {!isSaved && <div className="text-[8px] text-gold/70 font-mono mt-1 text-center">Unsaved changes</div>}
            </div>

            {/* Tagged character profiles for CURRENT chapter's note */}
            {taggedChars.length > 0 && (
              <div className="px-3 pb-2 flex-shrink-0 border-t border-border pt-2">
                <div className="text-[7px] font-bold font-mono text-muted-foreground uppercase tracking-wide mb-1.5">
                  Profile Links — next audit review
                </div>
                <div className="space-y-1.5">
                  {taggedChars.map(char => (
                    <CharProfileCard key={char.id} char={char} />
                  ))}
                </div>
              </div>
            )}

            {/* Character filter bar (if notes exist across multiple chars) */}
            {Object.keys(allCharTags).length > 0 && (
              <div className="px-3 pt-2 border-t border-border flex-shrink-0">
                <div className="text-[7px] font-bold font-mono text-muted-foreground uppercase tracking-wide mb-1.5">Filter index by character</div>
                <div className="flex flex-wrap gap-1 mb-1">
                  <button onClick={() => setCharFilter(null)}
                    className={`text-[7px] font-bold font-mono px-1.5 py-0.5 rounded border transition-all ${!charFilter ? "bg-secondary text-foreground border-border" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    All
                  </button>
                  {Object.entries(allCharTags).map(([id, count]) => {
                    const char = CHAR_REGISTRY.find(c => c.id === id);
                    if (!char) return null;
                    const cfg = COLOR_CFG[char.color] || COLOR_CFG.gold;
                    return (
                      <button key={id} onClick={() => setCharFilter(charFilter === id ? null : id)}
                        className={`text-[7px] font-bold font-mono px-1.5 py-0.5 rounded border transition-all ${charFilter === id ? `${cfg.bg} ${cfg.border} ${cfg.text}` : "border-border text-muted-foreground hover:text-foreground"}`}>
                        {char.icon} {char.name.split(" ").pop()} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes index */}
            {filteredIndex.length > 0 && (
              <div className="flex-1 min-h-0 overflow-y-auto border-t border-border px-3 py-2">
                <div className="text-[7px] font-bold font-mono text-muted-foreground uppercase tracking-wide mb-1.5">
                  {charFilter
                    ? `Notes mentioning ${CHAR_REGISTRY.find(c => c.id === charFilter)?.name.split(" ").pop()} (${filteredIndex.length})`
                    : `Notes Index (${filteredIndex.length})`}
                </div>
                <div className="space-y-1">
                  {filteredIndex.sort((a, b) => Number(a) - Number(b)).map(chKey => {
                    const ch = CHAPTERS.find(c => c.ch === Number(chKey));
                    const charTags = detectCharacters(notes[chKey]);
                    return (
                      <button key={chKey} onClick={() => setSelectedCh(Number(chKey))}
                        className={`w-full text-left px-2 py-1.5 rounded text-[9px] font-mono transition-all ${
                          Number(chKey) === selectedCh ? "bg-gold/15 text-gold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">Ch.{chKey}</span>
                          {ch && <span className="opacity-60 truncate flex-1">{ch.title.slice(0, 18)}{ch.title.length > 18 ? "…" : ""}</span>}
                          {/* Character tag dots */}
                          <div className="flex gap-0.5 flex-shrink-0">
                            {charTags.map(id => {
                              const c = CHAR_REGISTRY.find(x => x.id === id);
                              return c ? <span key={id} title={c.name} className="text-[8px]">{c.icon}</span> : null;
                            })}
                          </div>
                        </div>
                        {/* Note snippet */}
                        <div className="text-[8px] text-muted-foreground/60 mt-0.5 font-sans truncate">
                          {notes[chKey].slice(0, 50)}{notes[chKey].length > 50 ? "…" : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {chaptersWithNotes.length === 0 && (
              <div className="flex-1 flex items-center justify-center px-4">
                <div className="text-center text-muted-foreground/50">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-[9px] font-mono">Start typing a note above.<br />Mention a character name and<br />their profile auto-tags.</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-20 bg-background/40 md:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}