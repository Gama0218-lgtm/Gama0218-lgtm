import DashCard from "./DashCard";

const CANON_COMPARISONS = [
  { title:"The Things They Carried",    author:"Tim O'Brien",          year:1990, omega_eq:92, strength:"Fragmented memory, moral ambiguity", gap:"No Chicano/Indigenous voice. Vietnam only from white American lens.", verdict:"SGT Ramos expands the canon O'Brien opened." },
  { title:"Matterhorn",                 author:"Karl Marlantes",       year:2010, omega_eq:89, strength:"Tactical precision, unit cohesion", gap:"No racial/ethnic power analysis. Institutional racism invisible.", verdict:"SGT Ramos adds the DCAS algorithm O'Brien never knew existed." },
  { title:"Bless Me, Ultima",           author:"Rudolfo Anaya",        year:1972, omega_eq:94, strength:"Yaqui/Chicano spirituality, magical realism", gap:"Peace-time. No war trauma intersection.", verdict:"SGT Ramos is the war novel Anaya's tradition needed." },
  { title:"The Sympathizer",            author:"Viet Thanh Nguyen",    year:2015, omega_eq:91, strength:"Vietnamese POV, colonial critique", gap:"No Chicano intersectional frame.", verdict:"Together these two books complete the Vietnam War story." },
  { title:"Hunger of Memory",           author:"Richard Rodriguez",    year:1982, omega_eq:85, strength:"Chicano identity, assimilation cost", gap:"No combat. No institutional violence.", verdict:"SGT Ramos shows what assimilation extracted in blood." },
  { title:"Catch-22",                   author:"Joseph Heller",        year:1961, omega_eq:90, strength:"Institutional absurdity, anti-war satire", gap:"IBM 360 as villain is more original than Catch-22's bureaucracy.", verdict:"Unique: SGT Ramos uses data, not satire, as weapon." },
];

const MARKET_POSITION = [
  { category:"War Fiction", position:"TOP 5%",     color:"gold",   note:"Omega 107.3 exceeds Matterhorn benchmark" },
  { category:"Chicano Lit", position:"TOP 1%",     color:"teal",   note:"CLS 90/100 — highest authenticated in genre" },
  { category:"Literary Fiction", position:"TOP 10%", color:"blue", note:"12-Pillar composite 88.8/105" },
  { category:"Social Justice", position:"TOP 3%",  color:"purple", note:"NERO framework — original critical apparatus" },
];

export default function CanonTab() {
  return (
    <div className="animate-slide-up space-y-4">
      <DashCard title="Literary Canon Position" accent="gold">
        <div className="text-xs text-muted-foreground font-sans mb-4">
          Where <em>SGT George Ramos: The Mathematics of Vietnam</em> sits in American literary tradition
        </div>
        <div className="space-y-4">
          {CANON_COMPARISONS.map((c, i) => (
            <div key={i} className="p-3 bg-background rounded-lg border border-border">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="text-sm font-bold text-foreground font-sans">{c.title}</div>
                  <div className="text-[10px] text-muted-foreground">{c.author} · {c.year}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-black text-gold">Ω{c.omega_eq}</div>
                  <div className="text-[8px] text-muted-foreground">equiv.</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div><span className="text-teal font-bold">Strength: </span><span className="text-foreground/70 font-sans">{c.strength}</span></div>
                <div><span className="text-red font-bold">Gap: </span><span className="text-foreground/70 font-sans">{c.gap}</span></div>
              </div>
              <div className="mt-2 text-[10px] text-gold font-bold font-sans">→ {c.verdict}</div>
            </div>
          ))}
        </div>
      </DashCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashCard title="Market Position" accent="blue">
          <div className="space-y-3">
            {MARKET_POSITION.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-background rounded border border-border">
                <div>
                  <div className="text-xs font-bold text-foreground">{m.category}</div>
                  <div className="text-[9px] text-muted-foreground font-sans">{m.note}</div>
                </div>
                <span className={`text-xs font-black font-mono text-${m.color}`}>{m.position}</span>
              </div>
            ))}
          </div>
        </DashCard>
        <DashCard title="The SGT Ramos Thesis" accent="teal">
          <div className="space-y-3 text-xs font-sans text-muted-foreground">
            <div className="p-3 bg-gold/5 border border-gold/20 rounded-lg">
              <div className="font-bold text-gold mb-1">The Claim</div>
              The first novel to use statistical forensics (DCAS analysis) as a narrative weapon — IBM 360 as the actual villain of the Vietnam War.
            </div>
            <div className="p-3 bg-teal/5 border border-teal/20 rounded-lg">
              <div className="font-bold text-teal mb-1">The Gap Filled</div>
              43,000+ Chicano Vietnam veterans. Zero major American novels told their story — until now.
            </div>
            <div className="p-3 bg-blue/5 border border-blue/20 rounded-lg">
              <div className="font-bold text-blue mb-1">The Innovation</div>
              Post-Anaya transnational framework: Chicano + Mexican national + Vietnamese POV in one manuscript.
            </div>
          </div>
        </DashCard>
      </div>
    </div>
  );
}