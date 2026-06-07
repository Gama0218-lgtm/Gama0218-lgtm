import DashCard from "./DashCard";

const ACCURACY_SECTIONS = [
  {s:"Vietnam Era Military Protocol",   score:96, flag:false, color:"teal",  note:"Cu Chi tunnel dimensions accurate. Helicopter call signs period-correct. Firebase layout authentic."},
  {s:"IBM System/360 Representation",   score:94, flag:false, color:"blue",  note:"NIPS database reference accurate. Processing capacity correctly depicted. First digital war framing validated."},
  {s:"Yaqui Cultural Protocols",        score:97, flag:false, color:"gold",  note:"Ceremony of Liberation consistent with ethnographic research. Chieftain's language register accurate."},
  {s:"Chicano Barrio Authenticity",     score:95, flag:false, color:"gold",  note:"Boyle Heights 1968 details accurate. Tío Sancho concept culturally grounded. Corrido references appropriate."},
  {s:"Spanish Code-Switching Fidelity", score:91, flag:false, color:"teal",  note:"10/10 on prayer sequences. Some Act I chapters (Ch.4,14) have near-zero Spanish — monitor continuity."},
  {s:"Mexican National Draft (50USC§3802)", score:88, flag:true, color:"orange", note:"⚠ Historically accurate but underexplained. Recommend author's note for mainstream reader clarity."},
  {s:"My Lai Historical Accuracy",      score:93, flag:false, color:"blue",  note:"Events chronologically accurate. Ramos's witness role is fictional but historically plausible."},
  {s:"Valor 24 Review Accuracy",        score:98, flag:false, color:"teal",  note:"Jesus Duran's posthumous MOH (2014) accurately depicted. 37-year gap correctly stated."},
];

const ANACHRONISMS = [
  {ch:6,  sev:"HIGH",   flag:"'ID card swipe': magnetic stripe IDs not USMC standard until 1973. Change to 'dog tag check'."},
  {ch:14, sev:"MED",    flag:"Motown on reel-to-reel uncommon in field. Better: 'cassette dub' (cassettes available 1969)."},
  {ch:15, sev:"HIGH",   flag:"Squad placed '3km east of Son My' — adjust to 'near the Son My perimeter'."},
  {ch:24, sev:"HIGH",   flag:"'18 hours of bombardment': siege lasted 57 days. Clarify: 'final eighteen hours of fifty-seven days.'"},
  {ch:30, sev:"LOW",    flag:"Mortar caliber: Ch.29='81mm' / Ch.30='82mm'. NVA used 82mm. Standardize to 82mm."},
];

const SEV_COLOR = { HIGH:"text-red", MED:"text-orange", LOW:"text-gold" };

export default function HistoricalAccuracyTab() {
  return (
    <div className="animate-slide-up space-y-4">
      <DashCard title="M5 — Cultural & Military Authenticity Validator" accent="teal">
        <div className="text-xs text-muted-foreground font-sans mb-4">
          CL-MoE Mean: 0.048 · Verdict: MAINSTREAM READY · 39/41 chapters below 0.18 threshold
        </div>
        <div className="space-y-3">
          {ACCURACY_SECTIONS.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold font-mono text-${s.color}`}>{s.s}</span>
                  {s.flag && <span className="text-[9px] font-bold text-orange">⚠ FLAG</span>}
                </div>
                <div className="text-[10px] text-muted-foreground font-sans">{s.note}</div>
              </div>
              <div className="min-w-[60px] text-right">
                <span className={`text-lg font-black font-mono text-${s.color}`}>{s.score}</span>
                <div className="text-[8px] text-muted-foreground">/100</div>
              </div>
            </div>
          ))}
        </div>
      </DashCard>

      <DashCard title="Anachronism Flags" accent="red">
        <div className="space-y-2">
          {ANACHRONISMS.map((a, i) => (
            <div key={i} className={`p-2.5 rounded-md bg-background border border-border`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-muted-foreground font-mono">Ch.{a.ch}</span>
                <span className={`text-[9px] font-bold ${SEV_COLOR[a.sev]}`}>{a.sev}</span>
              </div>
              <div className="text-xs text-foreground/80 font-sans">{a.flag}</div>
            </div>
          ))}
        </div>
      </DashCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashCard title="Key Historical Sources" accent="blue">
          <div className="space-y-2 text-xs font-sans text-muted-foreground">
            <p className="p-2 bg-blue/5 rounded border border-blue/20"><span className="text-blue font-bold">DCAS Records:</span> 58,220 records — 349 coded Hispanic (0.60%) — core anomaly</p>
            <p className="p-2 bg-purple/5 rounded border border-purple/20"><span className="text-purple font-bold">Guzman Methodology:</span> 1969: 19% of casualties, 12% of population</p>
            <p className="p-2 bg-teal/5 rounded border border-teal/20"><span className="text-teal font-bold">NARA Revised:</span> 3,070 identified — independent institutional validation</p>
            <p className="p-2 bg-gold/5 rounded border border-gold/20"><span className="text-gold font-bold">50 USC §3802:</span> Selective Service requiring ALL residents to register</p>
          </div>
        </DashCard>
        <DashCard title="Validation Status" accent="gold">
          <div className="space-y-2">
            {[["Cu Chi Tunnel Dimensions","VERIFIED"],["IBM 360 NIPS Database","VERIFIED"],["My Lai Chronology","VERIFIED"],["Chicano Casualty Rate","VERIFIED"],["Non-Citizen Draft Law","VERIFIED"],["Valor 24 MOH Award","VERIFIED"]].map(([item, status]) => (
              <div key={item} className="flex justify-between items-center text-xs py-1 border-b border-border/30">
                <span className="text-foreground/70 font-sans">{item}</span>
                <span className="text-teal font-bold font-mono">{status}</span>
              </div>
            ))}
          </div>
        </DashCard>
      </div>
    </div>
  );
}