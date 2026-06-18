import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import DashCard from "./DashCard";
import { ShieldAlert, CheckCircle, Clock, Filter, RefreshCw, Loader2, AlertTriangle, XCircle } from "lucide-react";

const SEV = {
  CRITICAL: { color: "text-red",    border: "border-red/40",    bg: "bg-red/5",    icon: XCircle },
  HIGH:     { color: "text-orange", border: "border-orange/40", bg: "bg-orange/5", icon: AlertTriangle },
  MED:      { color: "text-gold",   border: "border-gold/40",   bg: "bg-gold/5",   icon: AlertTriangle },
  LOW:      { color: "text-teal",   border: "border-teal/40",   bg: "bg-teal/5",   icon: CheckCircle },
};

const CAT_LABELS = {
  "draft-annotation": "Draft Annotation",
  "title-format":     "Title Format",
  "heading-format":   "Heading Format",
  "name-error":       "Name Error",
  "anachronism":      "Anachronism",
  "continuity":       "Continuity",
  "structural":       "Structural",
  "word-overuse":     "Word Overuse",
  "historical":       "Historical",
  "punctuation":      "Punctuation",
  "formatting":       "Formatting",
};

const STATUS_STYLE = {
  "quarantined": { label: "🔴 QUARANTINED", cls: "text-red bg-red/10 border-red/30" },
  "in-progress": { label: "🟡 IN PROGRESS", cls: "text-gold bg-gold/10 border-gold/30" },
  "resolved":    { label: "✅ RESOLVED",    cls: "text-teal bg-teal/10 border-teal/30" },
};

const SEED_ITEMS = [
  // CRITICAL — submission-blocking
  { chapter_number:1,  category:"draft-annotation", severity:"CRITICAL", submission_blocker:true,  location:"Chapter heading section", flag:"'REVISED CHAPTER — FIRST PASS' label embedded in manuscript body", detail:"Draft annotation 'REVISED CHAPTER — FIRST PASS' appears in the manuscript body of Chapter 1. This is a working note that must be stripped before any submission, agent query, or print preparation. Its presence signals to an editor or agent that the document is not final.", recommended_fix:"Delete the line 'REVISED CHAPTER — FIRST PASS' entirely from the Chapter 1 body text.", version_found:"v12", status:"quarantined" },
  { chapter_number:1,  category:"formatting",        severity:"CRITICAL", submission_blocker:true,  location:"Line 7 of chapter body", flag:"Full manuscript title 'SGT George Ramos: The Mathematics of Vietnam' appears INSIDE chapter body", detail:"The line 'SGT George Ramos: The Mathematics of Vietnam' appears as a freestanding line within the body of Chapter 1 — it is a ghost header/running title that leaked into the narrative text. This is likely a copy-paste or section-break artifact from the DOCX structure. It will appear as a bizarre non-sequitur to any reader or agent.", recommended_fix:"Remove the orphaned title line from the Chapter 1 body. Running titles belong in DOCX headers/footers only, not in the narrative text flow.", version_found:"v12", status:"quarantined" },
  { chapter_number:9,  category:"name-error",        severity:"CRITICAL", submission_blocker:true,  location:"~60% through chapter", flag:"CPL Ramirez called 'Rodriguez' — wrong character entirely", detail:"Ramirez (KIA in Ch.10) is referred to as 'Rodriguez' approximately 60% through Chapter 9. Rodriguez is a completely different character — the underage boy from Chapter 1. This is a serious continuity error that will confuse any reader and immediately surface in agent review.", recommended_fix:"Find/replace all instances of 'Rodriguez' in Ch.9 that refer to Ramirez. Verify Rodriguez=underage boy (Ch.1) is never confused with Ramirez=CPL (Ch.9/10 KIA) anywhere in the manuscript.", version_found:"v12", status:"quarantined" },
  { chapter_number:10, category:"anachronism",       severity:"CRITICAL", submission_blocker:true,  location:"Firefight sequence", flag:"M249 SAW referenced — weapon not adopted until 1984 (action set in 1968)", detail:"The M249 Squad Automatic Weapon (Belgian FN Minimi) was not adopted by the US Army until 1984. Chapter 10 is set in 1968. This is a 16-year anachronism that any Vietnam-era military historian or veteran will immediately flag. It is submission-blocking.", recommended_fix:"Replace all instances of 'M249 SAW' with 'M60 machine gun' — add soldier nickname 'the pig' on first reference. The M60 was the standard GPMG throughout the Vietnam War.", version_found:"v12", status:"quarantined" },
  { chapter_number:24, category:"historical",        severity:"CRITICAL", submission_blocker:true,  location:"Khe Sanh passage", flag:"Siege of Khe Sanh described as lasting 'eighteen hours' — actual 77-day operation", detail:"The Siege of Khe Sanh ran from January 21 to April 9, 1968 — a 77-day operation. Describing it as 'eighteen hours' is an egregious historical error that will destroy credibility with any Vietnam history scholar, editor, or veteran reader.", recommended_fix:"Replace 'eighteen hours' with 'the final eighteen hours of fifty-seven days' — preserves dramatic immediacy while honoring historical fact.", version_found:"v12", status:"quarantined" },
  { chapter_number:31, category:"title-format",      severity:"CRITICAL", submission_blocker:true,  location:"Chapter heading", flag:"Chapter 31 heading truncated: 'THE MASTERPIEC' — final 'E' missing", detail:"The manuscript heading for Chapter 31 reads 'CORRIDOR OF FIRE: THE MASTERPIEC' — the final letter 'E' of 'MASTERPIECE' is truncated. This is a DOCX character-limit or copy artifact. It will appear in any TOC, print layout, or digital rendering.", recommended_fix:"Edit chapter heading to read 'CORRIDOR OF FIRE: THE MASTERPIECE' — verify in both the body heading and the Table of Contents entry.", version_found:"v12", status:"quarantined" },
  { chapter_number:44, category:"title-format",      severity:"CRITICAL", submission_blocker:true,  location:"Chapter heading", flag:"Chapter 44 heading truncated: 'Unidos para Sempr' — final 'e' of 'Siempre' missing", detail:"The manuscript heading reads 'Unidos para Sempr' — the final 'e' of 'Siempre' is cut off. This is the climactic chapter title and must be correct in both the body heading and Table of Contents.", recommended_fix:"Edit to read 'Unidos para Siempre'. Verify TOC entry matches.", version_found:"v12", status:"quarantined" },

  // HIGH
  { chapter_number:1,  category:"heading-format",    severity:"HIGH",     submission_blocker:false, location:"Chapter heading line", flag:"'(ACT I)' appended directly to chapter title — inconsistent format", detail:"Chapter headings append the act designation in parentheses directly to the title line: 'Chapter 1: The Sacred Mountain Revelation (ACT I)'. This format should be standardized across all 45 chapters. Some chapters may use different act label placement or omit it entirely — inconsistency will appear in the TOC.", recommended_fix:"Standardize all chapter headings: use a consistent format such as 'Chapter [N]: [Title]' with act designation on a separate sub-line or in the TOC only. Audit all 45 headings.", version_found:"v12", status:"quarantined" },
  { chapter_number:6,  category:"anachronism",       severity:"HIGH",     submission_blocker:false, location:"ID check scene", flag:"Magnetic card-swipe CAC validation referenced — not USMC standard until 1973 (scene set 1968)", detail:"The scene depicts a magnetic stripe ID card swipe for base access. Magnetic stripe Common Access Cards were not standard USMC issue until 1973. Chapter 6 is set in 1968.", recommended_fix:"Replace 'card swipe' with 'dog tag check' — the standard identity verification method for 1968 USMC installations.", version_found:"v12", status:"quarantined" },
  { chapter_number:8,  category:"structural",        severity:"HIGH",     submission_blocker:false, location:"Chapter opening — first 700+ lines", flag:"Ch.8 and Ch.9 share near-identical 700+ line opening sequence", detail:"Chapters 8 and 9 open with near-identical sequences: helicopter insertion, Crawford fall, Pendejo Moment, jungle patrol, ridge, stream. Chapter 9 appears to be a retained revised draft of Chapter 8's opening. This creates a reader-experience failure — Act I readers will feel stuck in a loop.", recommended_fix:"Option A: Ch.8 = first contact ONLY; Ch.9 = aftermath + Ramirez burial + squad forge. Option B: Merge into one 10,000w chapter. Either path must be chosen before submission.", version_found:"v12", status:"quarantined" },
  { chapter_number:15, category:"anachronism",       severity:"HIGH",     submission_blocker:false, location:"Squad positioning passage", flag:"Uher 4000 reel-to-reel audio device referenced as frontline infantry field gear", detail:"The Uher 4000 series was professional German broadcast equipment, not standard infantry field gear for 1968 draftees. Its presence in a frontline scene is historically implausible.", recommended_fix:"Replace with a period-appropriate cassette recorder (cassettes available from 1969) or remove the device reference entirely.", version_found:"v12", status:"quarantined" },
  { chapter_number:16, category:"name-error",        severity:"HIGH",     submission_blocker:false, location:"Radio operator dialogue", flag:"Major Duc's radio operator alternates 'Trong' / 'Trung' — same character, two names", detail:"The radio operator appears as 'Trong' in some dialogue tags and 'Trung' in others. These are treated as the same character, creating a reader continuity failure.", recommended_fix:"Standardize to 'Trong' throughout. Perform global find/replace for 'Trung' → 'Trong' in all chapters featuring Major Duc.", version_found:"v12", status:"quarantined" },
  { chapter_number:39, category:"continuity",        severity:"HIGH",     submission_blocker:false, location:"Battle sequence", flag:"Ch.39 compresses 7 Marine deaths into single battle; Ch.44 assigns them separate Feb–Nov 1968 dates", detail:"Chapter 39 (Ares) collapses the deaths of Henderson, Wilson, Martinez, Watkins, Williams, Herrera, and O'Neil into one battle. Chapter 44 congressional testimony assigns them explicit separate dates spanning February through November 1968. This is a direct structural contradiction.", recommended_fix:"Add explicit date/location stamps to each death in Ch.39 (O'Neil=Feb, Williams=Mar, Reynolds=May, Watkins=May, Henderson=Jun, Johnson=Jun, Herrera=Jul) — OR revise Ch.44 testimony dates to match the single-battle narrative.", version_found:"v12", status:"quarantined" },
  { chapter_number:42, category:"title-format",      severity:"HIGH",     submission_blocker:false, location:"Table of Contents", flag:"TOC entry for Ch.41 reads 'The THE HEARING HALL' — duplicate article", detail:"The Table of Contents entry for Chapter 41 contains a duplicate definite article: 'The THE HEARING HALL'. This is a copy artifact from renaming the chapter.", recommended_fix:"Edit TOC entry to read 'THE HEARING HALL'. Verify the Chapter 41 body heading matches.", version_found:"v12", status:"quarantined" },

  // MED
  { chapter_number:3,  category:"word-overuse",      severity:"MED",      submission_blocker:false, location:"Throughout chapter", flag:"'Algorithm' used 14× in 4,738 words (2.96/1k) — over-saturation", detail:"The word 'algorithm' appears 14 times in Chapter 3's 4,738 words — a density of 2.96 per 1,000 words. While the IBM 360 is central to the chapter's theme, lexical saturation signals weak vocabulary variety to editors.", recommended_fix:"Vary with: 'system', 'calculus', 'machine logic', 'the program', 'the formula', 'the mechanism'. Target ≤8 instances.", version_found:"v12", status:"quarantined" },
  { chapter_number:4,  category:"continuity",        severity:"MED",      submission_blocker:false, location:"Crawford's dialogue", flag:"Crawford references 'Colonel Harmon briefing' with no prior introduction", detail:"Crawford refers to a 'Colonel Harmon briefing' as if it is established context, but Colonel Harmon has not appeared or been mentioned before this point.", recommended_fix:"Either introduce Colonel Harmon briefly in Chapter 3, or change the reference to a generic briefing without the name.", version_found:"v12", status:"quarantined" },
  { chapter_number:11, category:"word-overuse",      severity:"MED",      submission_blocker:false, location:"Throughout chapter", flag:"'Dark'/'darkness' used 22× in 5,747 words (3.8/1k)", detail:"'Dark' and 'darkness' appear 22 times across Chapter 11 — a density of 3.8 per 1,000 words. This creates tonal monotony in what should be a varied atmospheric chapter.", recommended_fix:"Vary at least 8 instances: 'the black between stars', 'the hour before dawn', 'no moon', 'shadow', 'lightless', 'the jungle's particular blindness'.", version_found:"v12", status:"quarantined" },
  { chapter_number:13, category:"continuity",        severity:"MED",      submission_blocker:false, location:"Package description", flag:"Chamoy described as 'sweet-sour paste' here vs 'liquid' in Ch.34 — inconsistent form", detail:"Chapter 13 describes chamoy as a paste. Chapter 34 references it as a liquid. This is a small but notticeable continuity inconsistency that may draw questions from Chicano cultural reviewers.", recommended_fix:"Standardize to one form. Chamoy is most commonly encountered as a liquid condiment. Recommend: use 'liquid' in both chapters.", version_found:"v12", status:"quarantined" },
  { chapter_number:14, category:"anachronism",       severity:"MED",      submission_blocker:false, location:"Motown scene", flag:"Motown played on reel-to-reel uncommon in field — cassette dubs more accurate for 1969", detail:"Reel-to-reel players were too bulky for field use. Cassette tapes became available in 1969 and were common among troops. A 'cassette dub' is more historically plausible.", recommended_fix:"Replace reel-to-reel reference with 'cassette dub' or simply 'a tape'. Preserve the Motown content.", version_found:"v12", status:"quarantined" },
  { chapter_number:17, category:"historical",        severity:"MED",      submission_blocker:false, location:"Induction scene", flag:"Non-citizen recruits in 1969 would process at MCRD San Diego — not Camp Pendleton main gate", detail:"Non-citizen military recruits in 1969 processed at Marine Corps Recruit Depot San Diego, not through the Camp Pendleton main gate. The distinction matters for military readers.", recommended_fix:"Change 'Camp Pendleton main gate' to 'MCRD San Diego' for the induction/processing scene.", version_found:"v12", status:"quarantined" },
  { chapter_number:21, category:"continuity",        severity:"MED",      submission_blocker:false, location:"Toy soldiers reference", flag:"Toy soldiers described as 'lead' in Ch.3 vs 'plastic' in Ch.21 — material inconsistency", detail:"The toy soldiers referenced in George's memory are called 'lead' figures in Chapter 3 but 'plastic' in Chapter 21. These refer to the same objects.", recommended_fix:"Standardize to 'lead'. Lead toy soldiers were the norm in the 1950s–60s childhood timeline. Plastic soldiers became common later.", version_found:"v12", status:"quarantined" },
  { chapter_number:22, category:"word-overuse",      severity:"LOW",      submission_blocker:false, location:"Throughout chapter", flag:"'Faith' used 11× in 5,505 words (2.0/1k)", detail:"'Faith' appears 11 times in Chapter 22. Moderate saturation — the theme is intentional but 2–3 additional variations would improve the reading experience.", recommended_fix:"Vary 2 instances: 'belief', 'conviction', 'the thing you hold when evidence fails', 'trust in the unseen'.", version_found:"v12", status:"quarantined" },
  { chapter_number:26, category:"word-overuse",      severity:"MED",      submission_blocker:false, location:"400-word cluster, mid-chapter", flag:"'Brown' used 8× in 400-word cluster — identity flattening risk", detail:"'Brown' appears 8 times in a concentrated 400-word passage in Chapter 26. Beta readers flagged this as reducing Chicano cultural complexity to a single racial signifier.", recommended_fix:"Replace 5–6 instances with: earth-toned, copper-skinned, mestizo, moreno, tierra-colored, bronze. Retain 2 instances for intentional rhythmic echo.", version_found:"v12", status:"quarantined" },
  { chapter_number:29, category:"continuity",        severity:"LOW",      submission_blocker:false, location:"Mortar exchange scene", flag:"Mortar caliber listed as '81mm' — NVA standard was 82mm", detail:"The NVA used Soviet-supplied 82mm mortars as their standard. The US M29 was 81mm. Given the context (NVA fire), 82mm is more historically accurate.", recommended_fix:"Standardize to 82mm for NVA/VC-fired mortars. US mortars can remain 81mm.", version_found:"v12", status:"quarantined" },
  { chapter_number:33, category:"word-overuse",      severity:"MED",      submission_blocker:false, location:"Throughout chapter", flag:"'Map' used 12× in 5,366 words (2.24/1k)", detail:"'Map' appears 12 times across Chapter 33 with moderate clustering. The chapter's cartographic theme is intentional but variation would strengthen the prose.", recommended_fix:"Vary with: 'the cardboard', 'the grid', 'the operational theater', 'the overlay', 'the coordinates'.", version_found:"v12", status:"quarantined" },
  { chapter_number:35, category:"continuity",        severity:"LOW",      submission_blocker:false, location:"628 days calculation", flag:"628-day calculation requires mathematical verification against established KIA date", detail:"The '628 days' figure (Martinez surviving past his algorithmically assigned KIA date) is a central numeric symbol of the novel. This figure must be mathematically verified against the established dates.", recommended_fix:"Calculate: confirm the projected KIA date, the actual survival date, and that the difference is precisely 628 days. If off, adjust the number or the dates.", version_found:"v12", status:"quarantined" },
];

const CATEGORY_COLORS = {
  "draft-annotation": "text-red",
  "title-format":     "text-orange",
  "heading-format":   "text-gold",
  "name-error":       "text-purple",
  "anachronism":      "text-orange",
  "continuity":       "text-blue",
  "structural":       "text-red",
  "word-overuse":     "text-teal",
  "historical":       "text-cyan",
  "punctuation":      "text-muted-foreground",
  "formatting":       "text-orange",
};

export default function QuarantineTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [filterSev, setFilterSev] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterCat, setFilterCat] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.QuarantineItem.list("-severity", 200);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const seed = async () => {
    setSeeding(true);
    await base44.entities.QuarantineItem.bulkCreate(SEED_ITEMS);
    await load();
    setSeeding(false);
  };

  const setStatus = async (id, status) => {
    setUpdatingId(id);
    await base44.entities.QuarantineItem.update(id, { status });
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    setUpdatingId(null);
  };

  const filtered = items.filter(i => {
    if (filterSev !== "ALL" && i.severity !== filterSev) return false;
    if (filterStatus !== "ALL" && i.status !== filterStatus) return false;
    if (filterCat !== "ALL" && i.category !== filterCat) return false;
    return true;
  });

  const counts = {
    CRITICAL: items.filter(i => i.severity === "CRITICAL").length,
    HIGH:     items.filter(i => i.severity === "HIGH").length,
    MED:      items.filter(i => i.severity === "MED").length,
    LOW:      items.filter(i => i.severity === "LOW").length,
    quarantined: items.filter(i => i.status === "quarantined").length,
    resolved: items.filter(i => i.status === "resolved").length,
    blockers: items.filter(i => i.submission_blocker).length,
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="animate-slide-up space-y-4">

      {/* Header */}
      <div className="bg-red/5 border border-red/30 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-red shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-sm font-black text-red font-mono mb-1">MANUSCRIPT QUARANTINE — v12 INTEGRITY SCAN</div>
          <p className="text-xs text-foreground/70 font-sans leading-relaxed">
            Active quarantine bucket for all formatting, continuity, and anachronism bugs flagged in the v12 manuscript. 
            Resolve submission-blockers before any agent query or print preparation.
          </p>
        </div>
        <button onClick={load} className="text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        {[
          { label: "Submission Blockers", value: counts.blockers, color: "text-red" },
          { label: "CRITICAL", value: counts.CRITICAL, color: "text-red" },
          { label: "HIGH", value: counts.HIGH, color: "text-orange" },
          { label: "MED", value: counts.MED, color: "text-gold" },
          { label: "LOW", value: counts.LOW, color: "text-teal" },
          { label: "Still Open", value: counts.quarantined, color: "text-purple" },
          { label: "Resolved", value: counts.resolved, color: "text-teal" },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-2 text-center">
            <div className={`text-xl font-black font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[9px] text-muted-foreground font-mono leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Seed button if empty */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <ShieldAlert className="w-12 h-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground font-sans">No quarantine items yet.</p>
          <button
            onClick={seed}
            disabled={seeding}
            className="px-4 py-2 bg-red/10 border border-red/40 text-red text-sm font-bold font-mono rounded-md hover:bg-red/20 transition-all flex items-center gap-2"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            LOAD v12 QUARANTINE FINDINGS
          </button>
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-3 h-3 text-muted-foreground shrink-0" />
            {["ALL","CRITICAL","HIGH","MED","LOW"].map(s => (
              <button key={s} onClick={() => setFilterSev(s)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono border transition-all ${filterSev === s ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {s}
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
            {["ALL","quarantined","in-progress","resolved"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono border transition-all ${filterStatus === s ? "bg-accent text-white border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {s === "ALL" ? "ALL STATUS" : s.toUpperCase()}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-muted-foreground font-mono">{filtered.length} items</span>
          </div>

          {/* Item List */}
          <div className="space-y-2">
            {filtered.map(item => {
              const sev = SEV[item.severity] || SEV.LOW;
              const SevIcon = sev.icon;
              const isOpen = expanded === item.id;
              const statusStyle = STATUS_STYLE[item.status] || STATUS_STYLE["quarantined"];
              return (
                <div key={item.id} className={`border rounded-lg overflow-hidden ${sev.border} ${isOpen ? sev.bg : "bg-background"} transition-all`}>
                  <button className="w-full flex items-start gap-3 p-3 text-left" onClick={() => setExpanded(isOpen ? null : item.id)}>
                    <SevIcon className={`w-4 h-4 shrink-0 mt-0.5 ${sev.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-[9px] font-black font-mono px-1.5 py-0.5 rounded border ${sev.color} ${sev.border}`}>
                          {item.severity}
                        </span>
                        <span className={`text-[9px] font-mono ${CATEGORY_COLORS[item.category] || "text-muted-foreground"}`}>
                          {CAT_LABELS[item.category] || item.category}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-mono">Ch.{item.chapter_number}</span>
                        {item.submission_blocker && (
                          <span className="text-[9px] font-black font-mono px-1.5 py-0.5 rounded bg-red/10 text-red border border-red/30">⛔ BLOCKER</span>
                        )}
                        <span className={`ml-auto text-[9px] font-mono px-2 py-0.5 rounded border ${statusStyle.cls}`}>
                          {statusStyle.label}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-foreground font-sans">{item.flag}</div>
                      {item.location && <div className="text-[10px] text-muted-foreground font-mono mt-0.5">📍 {item.location}</div>}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
                      <p className="text-xs text-muted-foreground font-sans leading-relaxed">{item.detail}</p>
                      {item.recommended_fix && (
                        <div className="bg-secondary/40 rounded-md p-2.5 border border-border">
                          <div className="text-[10px] font-bold text-teal font-mono mb-1">✦ RECOMMENDED FIX</div>
                          <p className="text-xs text-foreground/80 font-sans leading-relaxed">{item.recommended_fix}</p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-1">
                        {["quarantined","in-progress","resolved"].map(s => (
                          <button
                            key={s}
                            disabled={item.status === s || updatingId === item.id}
                            onClick={() => setStatus(item.id, s)}
                            className={`px-3 py-1.5 text-[10px] font-bold font-mono rounded-md border transition-all ${
                              item.status === s
                                ? `${STATUS_STYLE[s].cls} cursor-default`
                                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                            }`}
                          >
                            {updatingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : STATUS_STYLE[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}