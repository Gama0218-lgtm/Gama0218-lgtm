import { useState } from "react";

const SECTIONS = [
  { id: "meta",      label: "§0 Metadata"          },
  { id: "demo",      label: "§1 Demographics"       },
  { id: "physical",  label: "§2 Physical"           },
  { id: "dialect",   label: "§3 Dialect"            },
  { id: "voice",     label: "§4 Voice"              },
  { id: "behavior",  label: "§5 Behavior Vectors"   },
  { id: "mr",        label: "§6 Magical Realism"    },
  { id: "battle",    label: "§7 Battle Mysticism"   },
  { id: "social",    label: "§8 Social Physics"     },
  { id: "sensory",   label: "§9 Sensory Signature"  },
  { id: "arc",       label: "§10 Character Arc"     },
  { id: "agency",    label: "§11 Agency Map"        },
  { id: "relations", label: "§12 Relationships"     },
  { id: "objects",   label: "§13 Key Objects"       },
  { id: "matrix",    label: "§16 Chapter Matrix"    },
  { id: "drift",     label: "§17 Drift Flags"       },
];

function Row({ label, value, valueColor = "text-foreground/80" }) {
  return (
    <div className="flex gap-3 border-b border-border/30 py-2 last:border-0">
      <span className="text-[8px] font-mono text-muted-foreground w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`text-[9px] font-mono leading-relaxed ${valueColor}`}>{value}</span>
    </div>
  );
}

function SectionBox({ title, children }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-[8px] font-bold font-mono text-muted-foreground mb-3 tracking-widest">{title}</div>
      {children}
    </div>
  );
}

export default function RamosProfileScreen() {
  const [section, setSection] = useState("meta");

  return (
    <div className="animate-slide-up space-y-4">
      <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="text-base font-black text-gold">SGT GEORGE RAMOS — CHARACTER PROFILE</div>
          <div className="text-[9px] font-mono text-muted-foreground">CKB v1.0 · LITCENTRAL v97 · Three Veils Architecture · May 23 2026</div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[8px] font-mono px-2 py-0.5 rounded border bg-gold/10 text-gold border-gold/30">PRIMARY · OPUS</span>
          <span className="text-[8px] font-mono text-muted-foreground">Ramos-Revision style</span>
        </div>
      </div>

      {/* Section nav */}
      <div className="flex gap-1 flex-wrap">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`text-[8px] font-mono px-2 py-1 rounded border transition-all whitespace-nowrap ${
              section === s.id ? "bg-gold/20 text-gold border-gold/40" : "border-border text-muted-foreground hover:text-foreground"
            }`}>{s.label}</button>
        ))}
      </div>

      {/* ── §0 METADATA ── */}
      {section === "meta" && (
        <SectionBox title="§0 · METADATA">
          <Row label="Character ID"     value="GEORGE_RAMOS" valueColor="text-gold font-bold" />
          <Row label="Tier"             value="☒ PRIMARY" valueColor="text-red font-bold" />
          <Row label="First appearance" value="Ch.1 — The Sacred Mountain Revelation" />
          <Row label="Last appearance"  value="Ch.43 — Unidos para Siempre" />
          <Row label="POV chapters"     value="Most of manuscript — primary POV" />
          <Row label="Model assignment" value="Opus — carries MR mode, code-switch, dialectic with Crawford" valueColor="text-purple" />
          <Row label="Style profile"    value="Ramos-Revision" valueColor="text-teal" />
          <Row label="Status"           value="Living. Survived to 2026 frame. 74 years old at restoration scene (Ch.42/43)." />
        </SectionBox>
      )}

      {/* ── §1 DEMOGRAPHICS ── */}
      {section === "demo" && (
        <SectionBox title="§1 · DEMOGRAPHICS">
          <Row label="Full name"           value="George Ramos (operational — see §6 re: Joshua Sagata layer)" />
          <Row label="Origin of name"      value="George anglicizes abuela's 'Jorge' (brother lost to Spanish flu 1918); Ramos from the matrilineal garment-factory grandmother." />
          <Row label="Nickname / Call sign" value='"Sargento" (squad) · "Señor Libro" (Gómez) · "El Sargento" (Mexican-national cohort)' />
          <Row label="Date of birth"       value="1948, Tucson AZ — 21 at Vietnam tour, 74 at Capitol restoration" />
          <Row label="Place of birth"      value="Tucson, AZ — Yaqui-Mexican household, three generations under one roof" />
          <Row label="Zip of origin"       value="85705 — south Tucson, draft-board pressure zone" valueColor="text-orange" />
          <Row label="Ethnicity"           value="Yaqui / Mexican-American (Chicano)" valueColor="text-teal" />
          <Row label="Class origin"        value="Working class — garment factory matriarchy, agricultural patriarchy" />
          <Row label="Religion"            value="Yaqui-Catholic syncretism — Deer Dance + rosary, no contradiction" valueColor="text-purple" />
          <Row label="Military"            value="USMC · Sergeant · Charlie Company, 1st Squad, 2nd Platoon · 0311 Rifleman / Squad Leader · 1968–1969" />
          <Row label="Awards"              value="Bronze Star (V), Purple Heart ×2. Medal of Honor recommendation withdrawn 1969, RESTORED 2022 — the 74-year arc." valueColor="text-gold" />
        </SectionBox>
      )}

      {/* ── §2 PHYSICAL ── */}
      {section === "physical" && (
        <div className="space-y-3">
          <SectionBox title="§2 · PHYSICAL APPEARANCE">
            <Row label="Build"         value="Wiry-compact. Sonoran physique — desert-built, not gym-built." />
            <Row label="Height/weight" value="5'8″ / 155 lb at induction. 161 lb on return." />
            <Row label="Skin"          value="Bronze-copper, sun-worked at temples and hands." />
            <Row label="Eyes"          value="Dark brown — held both calculation and prayer simultaneously." valueColor="text-gold" />
            <Row label="Hair"          value="Black, regulation-cropped. Off-duty: longer, slicked back." />
            <Row label="Hands"         value="Long-fingered, ink-stained at induction. Calloused by Ch.10. Grandfather's hand-on-shoulder reflex lives in right shoulder blade." valueColor="text-teal" />
            <Row label="Posture"       value="Compressed authority — doesn't fill space he doesn't need." />
            <Row label="Combat changes" value="Slight rightward lean (old bayonet wound, Ch.10 echo). Partial hearing loss right ear (post-mortar Ch.32)." valueColor="text-orange" />
            <Row label="Scars"         value="Bayonet ghost on right shoulder (Ch.10) · shrapnel constellation lower back (Ch.30) · knuckle scar from Pendleton." />
            <Row label="Distinguishing" value="Hand-up-before-decision-completes reflex. Body moves before mind ratifies." valueColor="text-gold font-bold" />
            <Row label="Tic"           value="Touches rosary at sternum when calculating. Right thumb works the third bead — the one with the nick." valueColor="text-teal" />
          </SectionBox>
        </div>
      )}

      {/* ── §3 DIALECT ── */}
      {section === "dialect" && (
        <div className="space-y-3">
          <SectionBox title="§3 · REGIONAL DIALECT & CODE-SWITCH">
            <Row label="Primary at home"   value="Spanish (Sonoran) + English bilingual from age 3" />
            <Row label="Languages"         value="English (educated register accessible) · Spanish (Sonoran, working-class) · functional Yaqui ceremonial phrases" />
            <Row label="Code-switch mode"  value="☒ SITUATIONAL — targeted, not promiscuous" valueColor="text-orange font-bold" />
            <Row label="Trigger contexts"  value="☒ Emotion ☒ Familia ☒ Danger ☒ Prayer ☒ Grief — rarely Anger (Anger compresses him into English)" />
            <Row label="Frequency target"  value="4–8% of lines per chapter · spikes to 15% in Tier-A MR scenes" valueColor="text-blue" />
          </SectionBox>
          <SectionBox title="AUTHENTIC PHRASEBOOK (CANON)">
            {[
              ["Menos es más, jefe.", "Less is more, boss."],
              ["Familia.", "(untranslated — do not gloss)"],
              ["Acuérdate.", "Remember. (the arc's throughline)"],
              ["Mijo / Mija.", "(address — do not gloss)"],
              ["No mames, vato.", "Used once, with care — high-pressure only."],
              ["Se te mantiene pensando...", "It keeps turning over in you..."],
              ["Un número es solo un mapa. El alma es el territorio.", "A number is only a map. The soul is the territory."],
            ].map(([phrase, note]) => (
              <div key={phrase} className="flex gap-3 border-b border-border/30 py-2 last:border-0">
                <span className="text-[9px] font-mono text-teal italic w-64 flex-shrink-0">{phrase}</span>
                <span className="text-[9px] font-mono text-foreground/60">{note}</span>
              </div>
            ))}
          </SectionBox>
          <SectionBox title="FORBIDDEN PATTERNS">
            {[
              "☒ No italicized translation in parens",
              "☒ No 'as we say in Spanish...' exposition",
              "☒ No mispronounced English rendering",
              "☒ Absolutely no 'ay caramba'",
            ].map(f => (
              <div key={f} className="text-[9px] font-mono text-red/80 py-1 border-b border-border/20 last:border-0">{f}</div>
            ))}
          </SectionBox>
        </div>
      )}

      {/* ── §4 VOICE ── */}
      {section === "voice" && (
        <SectionBox title="§4 · SPEECH & VOICE SIGNATURE">
          <Row label="Speech style"     value="Compressed authority. No wasted words. Sentences land like landing-zone markers." valueColor="text-gold" />
          <Row label="Voice frequency"  value="Tuning fork — carries without effort. Not loud. Resonant." />
          <Row label="Pacing"           value="Measured. Pauses load the next sentence." valueColor="text-teal" />
          <Row label="Key phrases"      value='"Menos es más, sir." · "Familia." · "Acuérdate." · "We refuse." (Ch.3 ancestral chorus refrain)' valueColor="text-teal" />
          <Row label="Silences"         value='Chooses NOT to speak when authority expects deference. Chooses NOT to speak when grief is the work. The silence after Ramirez is his loudest passage.' valueColor="text-purple" />
          <Row label="Internal freq."   value="Grandfather's tobacco-scented hand on his shoulder. Not metaphor — transmission." />
          <Row label="Curses"           value='"No mames" once. "Pendejo" twice. English curses almost never.' valueColor="text-orange" />
          <Row label="Dialogue ratio"   value="18–22% — thinker who speaks decisively; the rest is internal calculation" valueColor="text-blue" />
          <div className="mt-4 bg-gold/5 border border-gold/20 rounded-lg p-3">
            <div className="text-[8px] font-bold font-mono text-gold mb-2">OPENING SIGNATURE (Ch.6)</div>
            <div className="text-[9px] font-mono text-foreground/80 italic leading-relaxed">
              "I hit those books because I knew this day was coming, Sergeant. I earned every grade. Every recommendation. Every offer. Because I decided early that being smart wasn't something to apologize for. It was the only weapon I could carry that nobody could take at the border or the draft board."
            </div>
            <div className="text-[8px] font-mono text-muted-foreground mt-2">— Response to Gómez's "Did you earn your grades, or earn your way around them?" This is his arrival line. The book ratifies him as the Scribe-Warrior in this exchange.</div>
          </div>
        </SectionBox>
      )}

      {/* ── §5 BEHAVIOR VECTORS ── */}
      {section === "behavior" && (
        <SectionBox title="§5 · BEHAVIOR SCHEMA — 6-VECTOR BASELINE">
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                <th className="text-left px-3 py-2">VECTOR</th>
                <th className="text-center px-3 py-2">BASELINE</th>
                <th className="text-center px-3 py-2">DRIFT ±</th>
                <th className="text-left px-3 py-2">NOTES</th>
              </tr></thead>
              <tbody>
                {[
                  {v:"Agency",                   b:0.78, d:"±0.10", c:"text-gold",   n:"High — hand-up-before-decision. Peaks 0.92 in Ch.3 (genocide algorithm refusal), Ch.41 (legacy arc)."},
                  {v:"Risk Tolerance",            b:0.65, d:"±0.15", c:"text-blue",   n:"Calculated, not reckless. Refuses risks others take; takes risks others won't (Ch.30 corridor of fire)."},
                  {v:"Compassion",                b:0.82, d:"±0.08", c:"text-teal",   n:"Squad-directed; expanded to Major Duc by Ch.25 — mark of arc completion."},
                  {v:"Chain-of-Command Align.",   b:0.45, d:"±0.15", c:"text-orange", n:"Engagement, not deference, not defiance. Gives Crawford the answer to the question Crawford didn't know he was asking."},
                  {v:"Code-Switch Triggering",    b:0.55, d:"±0.10", c:"text-purple", n:"Situational, targeted. Not promiscuous."},
                  {v:"Ancestral / Spiritual",     b:0.78, d:"±0.12", c:"text-gold",   n:"High MR carrier. Primary Tier-A vehicle of the manuscript."},
                ].map(r => (
                  <tr key={r.v} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className={`px-3 py-2.5 font-bold font-mono ${r.c}`}>{r.v}</td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-foreground">{r.b}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">{r.d}</td>
                    <td className="px-3 py-2.5 text-foreground/70 max-w-xs">{r.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBox>
      )}

      {/* ── §6 MAGICAL REALISM ── */}
      {section === "mr" && (
        <div className="space-y-3">
          <SectionBox title="§6 · MAGICAL REALISM PROFILE">
            <Row label="MR Mode"         value="☒ YES — PRIMARY MR CARRIER" valueColor="text-purple font-bold" />
            <Row label="Three Veils"     value="Reality 40% · Memory 25% · Spirit 35%" valueColor="text-teal" />
            <Row label="MR Tier"         value="☒ Tier A (ontological presence carrier) — also operates Tier B and Tier C" valueColor="text-gold" />
            <Row label="Granted-status"  value="☒ ASSERTS spiritual events as FACT. Never hedges. The dead listened. They had been listening." valueColor="text-gold font-bold" />
            <Row label="Forbidden hedges" value="☒ ALL — strip every 'almost seemed' and 'as if' around his MR events" valueColor="text-red" />
            <Row label="Ancestor pattern" value="Grandfather's hand on right shoulder at threshold moments. Tobacco scent precedes the touch by half a second. Not hallucination — TRANSMISSION." valueColor="text-teal" />
            <Row label="Liberation fulcrum" value="Ch.41 Unidos para Siempre — rosary warmth granted in front of 18,000 witnesses. The Capitol becomes a Yaqui Deer Dance ground." valueColor="text-purple" />
          </SectionBox>
          <SectionBox title="SACRED OBJECTS">
            {[
              {tier:"A", obj:"Rosary (abuela's, 60 years)", fn:"Calculation, prayer, warmth-as-data. Warmth is granted physics, not metaphor."},
              {tier:"B", obj:"Photograph of María Dolores Ramos", fn:"Operational memory; reconstruction proof. Ch.6 onward."},
              {tier:"B", obj:"Pocket bible w/ Yaqui Deer Dance prayer", fn:"Job-Psalms-Yaqui layering pressed between pages."},
              {tier:"B", obj:"Field notebook", fn:"The ledger of the 13, expanded over tours. Ch.2 → Ch.41."},
              {tier:"C", obj:"Grandfather's pocket knife (carried, never drawn)", fn:"Refuses combat function — the thing he won't use as weapon."},
            ].map(o => (
              <div key={o.obj} className="flex gap-3 border-b border-border/30 py-2 last:border-0">
                <span className={`text-[8px] font-black font-mono w-5 flex-shrink-0 ${o.tier==="A"?"text-gold":o.tier==="B"?"text-blue":"text-muted-foreground"}`}>T{o.tier}</span>
                <span className="text-[9px] font-bold text-foreground w-48 flex-shrink-0">{o.obj}</span>
                <span className="text-[9px] font-mono text-foreground/70">{o.fn}</span>
              </div>
            ))}
          </SectionBox>
          <SectionBox title="BORDERLAND SCENES">
            {["Ch.1 Sacred Mountain","Ch.2 Deer Dance resurrection (Joshua layer)","Ch.5 Ghost Protocol (Roy/ancestors)","Ch.30 Corridor of Fire","Ch.41 Unidos para Siempre"].map(s => (
              <div key={s} className="text-[9px] font-mono text-purple py-1 border-b border-border/20 last:border-0">{s}</div>
            ))}
          </SectionBox>
        </div>
      )}

      {/* ── §7 BATTLE MYSTICISM ── */}
      {section === "battle" && (
        <SectionBox title="§7 · BATTLE MYSTICISM PROFILE">
          <Row label="Combat ritual"       value="Right thumb finds the third bead (nick). One inhale. Names the squad in order. Exhale." valueColor="text-teal" />
          <Row label="Code-switch under fire" value="Spanish surfaces in two contexts only: prayer to the dying; command to Mexican-national pair (Miguel, Jorge)." valueColor="text-orange" />
          <Row label="Hand-to-hand"        value="Body before mind. The decision completes AFTER the motion. Grandfather's hand grips during, not before." valueColor="text-gold" />
          <Row label="Sacred object in combat" value="Rosary stays at sternum under fatigues. Warmth INCREASES when squad is exposed. (Sensory data, not magic.)" valueColor="text-teal" />
          <Row label="Dying-words rehearsal" value="None. He has not rehearsed. He believes the body knows." />
          <Row label="Retrieval in extremis" value="Reconstructed mother's smell (Elena's exercise, Ch.6): Vicks VapoRub · pan dulce · real vanilla. These are now his." valueColor="text-purple" />
          <Row label="Combat sensory bleed" value="MR mode RISES under fire, does not recede. This is the manuscript's central inversion of standard war-novel grammar." valueColor="text-gold font-bold" />
          <div className="mt-4 bg-teal/5 border border-teal/20 rounded-lg p-3">
            <div className="text-[8px] font-mono text-teal/80 font-bold mb-1">REFLEX INVENTORY</div>
            {["Hand-up before mind ratifies","Right thumb to third bead","Spanish surfaces before English when grief or prayer","Body finds the rosary before the conscious mind acknowledges fear"].map(r => (
              <div key={r} className="text-[9px] font-mono text-foreground/70 py-0.5 border-b border-teal/10 last:border-0">→ {r}</div>
            ))}
          </div>
        </SectionBox>
      )}

      {/* ── §8 SOCIAL PHYSICS ── */}
      {section === "social" && (
        <div className="space-y-3">
          <SectionBox title="§8 · SOCIAL PHYSICS — VECTOR FORCES ON RAMOS">
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                  <th className="text-left px-3 py-2">FORCE</th><th className="text-center px-2 py-2">DIR</th>
                  <th className="text-center px-2 py-2">MAG</th><th className="text-left px-3 py-2">NOTES</th>
                </tr></thead>
                <tbody>
                  {[
                    {f:"Economic pressure",      dir:"↓",  mag:7, c:"text-orange", n:"Garment factory wages; brother in agricultural labor; college deferred."},
                    {f:"Prejudicial assumption", dir:"→",  mag:8, c:"text-red",    n:'"Señor Libro" mockery; assumption Chicanos couldn\'t have read what he\'d read.'},
                    {f:"Draft board geography",  dir:"↓",  mag:9, c:"text-red",    n:"South Tucson 85705 → high-induction lane."},
                    {f:"Family obligation",      dir:"↗",  mag:8, c:"text-teal",   n:"Abuela's prayer; the brother lost in 1918; the unspoken request to come back."},
                    {f:"Ancestral debt",         dir:"↑",  mag:9, c:"text-gold",   n:"The grandfather's hand. The Deer Dance lineage. The stars his ancestors tracked."},
                    {f:"Pentagon projection",    dir:"↓",  mag:9, c:"text-red",    n:"Crawford's IBM 360 has him filed. 94.7% confidence KIA."},
                    {f:"Casualty proximity",     dir:"↓",  mag:7, c:"text-orange", n:"Ramirez first. Then accumulating."},
                  ].map(r => (
                    <tr key={r.f} className="border-b border-border/30 hover:bg-secondary/10">
                      <td className={`px-3 py-2.5 font-bold font-mono ${r.c}`}>{r.f}</td>
                      <td className="px-2 py-2.5 text-center font-mono text-foreground text-sm">{r.dir}</td>
                      <td className={`px-2 py-2.5 text-center font-black font-mono ${r.mag>=9?"text-red":r.mag>=8?"text-orange":"text-gold"}`}>{r.mag}</td>
                      <td className="px-3 py-2.5 text-foreground/70">{r.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBox>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="text-2xl font-black font-mono text-gold">9.2</div>
              <div className="text-[8px] font-mono text-muted-foreground">Resultant Magnitude</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="text-2xl font-black font-mono text-teal">↑↑↗</div>
              <div className="text-[8px] font-mono text-muted-foreground">Bearing</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <div className="text-xs font-black font-mono text-purple">Ch.6</div>
              <div className="text-[8px] font-mono text-muted-foreground mt-0.5">Fulcrum — María Dolores reconstruction</div>
            </div>
          </div>
        </div>
      )}

      {/* ── §9 SENSORY SIGNATURE ── */}
      {section === "sensory" && (
        <SectionBox title="§9 · SENSORY SIGNATURE">
          {[
            {sense:"SMELL",          sig:"Grandfather's tobacco (Bull Durham, hand-rolled)",        trigger:"Threshold moments",                              color:"text-gold"},
            {sense:"SMELL (2°)",     sig:"Pan dulce + Vicks VapoRub + industrial dye",              trigger:"Mother-frame; reconstructed Ch.6",               color:"text-teal"},
            {sense:"SOUND",          sig:"60Hz fluorescent hum",                                    trigger:"Every institutional space — marks where the machine lives", color:"text-blue"},
            {sense:"TEXTURE",        sig:"Rosary bead warmth at sternum; nick at third bead",       trigger:"Calculation, prayer, decision moments",          color:"text-teal"},
            {sense:"TASTE",          sig:"Copper (inverted from Crawford's copper-of-lying)",       trigger:"Combat, betrayal-recognition",                   color:"text-orange"},
            {sense:"VISUAL",         sig:"Stars over Boyle Heights/Tucson — same astronomical knowledge ancestors tracked", trigger:"Night scenes, threshold moments", color:"text-purple"},
            {sense:"PROPRIOCEPTIVE", sig:"Right shoulder — grandfather's hand register",            trigger:"Decision moments",                               color:"text-gold"},
          ].map(r => (
            <div key={r.sense} className="flex gap-3 border-b border-border/30 py-2.5 last:border-0">
              <span className={`text-[8px] font-black font-mono w-28 flex-shrink-0 ${r.color}`}>{r.sense}</span>
              <div>
                <div className="text-[9px] font-mono text-foreground/80">{r.sig}</div>
                <div className="text-[8px] font-mono text-muted-foreground mt-0.5">↳ {r.trigger}</div>
              </div>
            </div>
          ))}
          <div className="mt-3 bg-gold/5 border border-gold/20 rounded-lg p-3">
            <div className="text-[8px] font-mono text-gold">SENSORY BLEED PATTERN: "Air becomes data. Depletion becomes warning." (Inherited from Joshua Sagata's tunnel-rewired nervous system after the layer-merge.)</div>
          </div>
        </SectionBox>
      )}

      {/* ── §10 ARC ── */}
      {section === "arc" && (
        <SectionBox title="§10 · CHARACTER ARC">
          <Row label="Archetype"       value="The Scribe-Warrior. Literate combatant. Knowledge as weapon. Calculation as prayer." valueColor="text-gold font-bold" />
          <Row label="Wound"           value="The lie that being smart was something to apologize for. (Resolved Ch.6 — Gómez confrontation.)" valueColor="text-orange" />
          <Row label="Lie at Ch.1"     value="That he was being sent to die for an algorithm that valued his survival." valueColor="text-red" />
          <Row label="Truth discovered" value="The algorithm valued his death. His survival is the variable they did not run. (Ch.3 genocide algorithm.)" valueColor="text-teal" />
          <Row label="Want vs Need"    value="Want: bring the squad home. Need: bring the dead's names home — across 74 years." />
          <Row label="Internal conflict" value="George vs Joshua — the dual occupancy. The thing the operational identity was supposed to bury, but the body kept both." valueColor="text-purple" />
          <Row label="External conflict" value="Crawford — the dialectic. Consciousness vs algorithm." valueColor="text-red" />
          <Row label="Arc type"        value="☒ MYTHIC — becomes legend AND remains person. Both/and, not either/or." valueColor="text-gold font-bold" />
          <div className="mt-4 bg-teal/5 border border-teal/20 rounded-lg p-3">
            <div className="text-[8px] font-bold font-mono text-teal mb-1">CLIMAX BEHAVIOR — Ch.41 UNIDOS PARA SIEMPRE</div>
            <div className="text-[9px] font-mono text-foreground/80">The rosary warm in his hand, abuela present, 18,000 breathing with him. He does not perform. He remembers. <span className="text-gold font-bold">Acuérdate.</span></div>
          </div>
        </SectionBox>
      )}

      {/* ── §11 AGENCY MAP ── */}
      {section === "agency" && (
        <div className="space-y-3">
          <SectionBox title="§11 · HIGH-MAGNITUDE AGENCY MOMENTS">
            {[
              {ch:"Ch.3",  omega:"Ω=111",   event:"Hand up before decision completes. 'We refuse. We refuse. We refuse.' Ancestral chorus joins.",       color:"text-red"},
              {ch:"Ch.6",  omega:"",         event:"Reconstruction of María Dolores' smell. The body filing it as memory rather than construction.",       color:"text-teal"},
              {ch:"Ch.30", omega:"",         event:"Corridor of fire. Refuses direct orders. Saves nine.",                                                color:"text-orange"},
              {ch:"Ch.32", omega:"",         event:"Sixty-Eight. Grandfather Maravilla compression. Three timelines, one bullet.",                        color:"text-purple"},
              {ch:"Ch.41", omega:"",         event:"Capitol restoration. The rosary warmth, granted. The 74-year arc closes.",                           color:"text-gold"},
            ].map(r => (
              <div key={r.ch} className="flex gap-3 border-b border-border/30 py-2.5 last:border-0">
                <span className={`text-[8px] font-black font-mono w-10 flex-shrink-0 ${r.color}`}>{r.ch}</span>
                {r.omega && <span className="text-[8px] font-mono text-red/80 w-14 flex-shrink-0">{r.omega}</span>}
                <span className="text-[9px] font-mono text-foreground/80">{r.event}</span>
              </div>
            ))}
          </SectionBox>
          <SectionBox title="REFLEX INVENTORY">
            {["Hand-up before mind ratifies","Right thumb to third bead (nick)","Spanish surfaces before English when grief or prayer","Body finds the rosary before the conscious mind acknowledges fear"].map((r,i) => (
              <div key={i} className="flex items-center gap-2 text-[9px] font-mono text-foreground/70 py-1 border-b border-border/20 last:border-0">
                <span className="text-gold">→</span>{r}
              </div>
            ))}
          </SectionBox>
        </div>
      )}

      {/* ── §12 RELATIONSHIPS ── */}
      {section === "relations" && (
        <SectionBox title="§12 · RELATIONSHIPS">
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                <th className="text-left px-3 py-2">RELATION</th><th className="text-left px-3 py-2">NAME</th>
                <th className="text-left px-3 py-2">FUNCTION</th><th className="text-left px-3 py-2">KEY SCENE</th>
              </tr></thead>
              <tbody>
                {[
                  {rel:"Mother (matriarch)",  name:"María Dolores Ramos",          fn:"Smell-anchor; worked hands; dawn-arrival",              key:"Ch.6 reconstruction",       c:"text-teal"},
                  {rel:"Ancestor",            name:"The grandfather (unnamed)",     fn:"Transmission, not hallucination",                      key:"Threshold scenes throughout",c:"text-gold"},
                  {rel:"Squad / familia",     name:"Charlie 1st Squad — 13 names", fn:"The thirteen Marines. Por cuántas lunas?",              key:"Ch.1, Ch.30, Ch.41",       c:"text-orange"},
                  {rel:"Adversary / foil",    name:"Captain William Crawford",      fn:"Consciousness vs algorithm",                           key:"Ch.3, Ch.4, Ch.18, Ch.35", c:"text-red"},
                  {rel:"Mentor",              name:"DI SGT Esteban Gómez",          fn:"Names what the machine erases. 'Take charge of your men.'", key:"Ch.6",              c:"text-blue"},
                  {rel:"Mentor (spiritual)",  name:"Roy Benavidez",                 fn:"'My jefita wasn't finished praying yet.'",             key:"Ch.5, throughout",          c:"text-teal"},
                  {rel:"Mentee / other self", name:"Joshua Sagata",                 fn:"Dual occupancy — the integrated self",                 key:"Ch.2, Ch.5, throughout",    c:"text-purple"},
                  {rel:"Brother-in-arms",    name:"Salvador Martinez",              fn:"Moral witness; eye-twitch communication",              key:"Ch.4, Ch.23, Ch.30",       c:"text-blue"},
                  {rel:"Sacred object",       name:"The rosary",                    fn:"Participant, not prop. Warmth register.",              key:"Every chapter",             c:"text-gold"},
                ].map(r => (
                  <tr key={r.rel} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className="px-3 py-2.5 text-muted-foreground">{r.rel}</td>
                    <td className={`px-3 py-2.5 font-bold ${r.c}`}>{r.name}</td>
                    <td className="px-3 py-2.5 text-foreground/70">{r.fn}</td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{r.key}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBox>
      )}

      {/* ── §13 OBJECTS ── */}
      {section === "objects" && (
        <SectionBox title="§13 · KEY OBJECTS">
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                <th className="text-left px-2 py-2">T</th><th className="text-left px-3 py-2">OBJECT</th>
                <th className="text-left px-3 py-2">ORIGIN</th><th className="text-left px-3 py-2">FUNCTION</th>
                <th className="text-left px-3 py-2">FIRST</th><th className="text-left px-3 py-2">LAST</th>
              </tr></thead>
              <tbody>
                {[
                  {t:"A",obj:"Rosary (abuela's, 60-year)",   orig:"Tucson household, three generations",         fn:"Calculation, prayer, warmth-as-data",                  first:"Ch.1", last:"Ch.43"},
                  {t:"B",obj:"Photograph of María Dolores",  orig:"Elena's office, Ch.6",                        fn:"Operational memory; reconstruction proof",             first:"Ch.6", last:"Ch.42"},
                  {t:"B",obj:"Pocket bible w/ Deer Dance prayer", orig:"Abuela's gift, pre-induction",           fn:"Job-Psalms-Yaqui layering",                           first:"Ch.1", last:"Ch.41"},
                  {t:"B",obj:"Field notebook",               orig:"Acquired Ch.2",                               fn:"The ledger of the 13, expanded over tours",            first:"Ch.2", last:"Ch.41"},
                  {t:"C",obj:"Grandfather's pocket knife",   orig:"Inheritance — carried, never drawn",          fn:"Refuses combat function — the thing he won't use",    first:"Ch.1", last:"Ch.43"},
                ].map(r => (
                  <tr key={r.obj} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className={`px-2 py-2.5 font-black font-mono ${r.t==="A"?"text-gold":r.t==="B"?"text-blue":"text-muted-foreground"}`}>{r.t}</td>
                    <td className="px-3 py-2.5 font-bold text-foreground">{r.obj}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{r.orig}</td>
                    <td className="px-3 py-2.5 text-foreground/70">{r.fn}</td>
                    <td className="px-3 py-2.5 font-mono text-teal whitespace-nowrap">{r.first}</td>
                    <td className="px-3 py-2.5 font-mono text-teal whitespace-nowrap">{r.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBox>
      )}

      {/* ── §16 CHAPTER MATRIX ── */}
      {section === "matrix" && (
        <SectionBox title="§16 · CHAPTER DEPLOYMENT MATRIX (ABBREVIATED)">
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead><tr className="border-b border-border bg-secondary/20 text-[7px] font-mono text-muted-foreground">
                <th className="text-left px-2 py-2">CH</th><th className="text-left px-3 py-2">SENSORY DEPLOYED</th>
                <th className="text-center px-2 py-2">CS</th><th className="text-center px-2 py-2">MR</th><th className="text-left px-3 py-2">NOTES</th>
              </tr></thead>
              <tbody>
                {[
                  {ch:1,  sensory:"Stars, rosary warmth, tobacco",                              cs:4,  mr:"A", notes:"Sacred Mountain"},
                  {ch:3,  sensory:"60Hz, copper, ancestral chorus",                             cs:6,  mr:"A", notes:"Genocide Algorithm — Ω peak"},
                  {ch:6,  sensory:"Copper (drain), 60Hz, jasmine-napalm, footlocker cold, cordite", cs:5,mr:"B", notes:"Crucible Theorem"},
                  {ch:30, sensory:"Smoking red earth, mortar CRUMP, rosary warm",               cs:3,  mr:"A", notes:"Corridor of Fire"},
                  {ch:41, sensory:"Capitol marble cold, rain-as-fists, rosary warm, abuela",    cs:8,  mr:"A", notes:"Unidos para Siempre — FULCRUM"},
                  {ch:43, sensory:"Rosary warm, 18,000 breathing",                              cs:6,  mr:"A", notes:"Final restoration"},
                ].map(r => (
                  <tr key={r.ch} className="border-b border-border/30 hover:bg-secondary/10">
                    <td className="px-2 py-2.5 font-black font-mono text-gold">Ch.{r.ch}</td>
                    <td className="px-3 py-2.5 text-foreground/70">{r.sensory}</td>
                    <td className="px-2 py-2.5 text-center font-mono text-teal">{r.cs}</td>
                    <td className={`px-2 py-2.5 text-center font-black font-mono ${r.mr==="A"?"text-gold":"text-blue"}`}>{r.mr}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{r.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBox>
      )}

      {/* ── §17 DRIFT FLAGS ── */}
      {section === "drift" && (
        <div className="space-y-3">
          <SectionBox title="§17 · CONTINUITY / DRIFT FLAGS">
            {[
              {flag:"☒ Spanish code-switching GAP — Ch.4 (memory-flagged)",                  color:"text-red"},
              {flag:"☒ Spanish code-switching GAP — Ch.14 (memory-flagged)",                 color:"text-red"},
              {flag:"☒ George/Joshua identity linkage timing — clarify Ch.2 vs Ch.6",        color:"text-orange"},
              {flag:"☒ Rosary continuity — must remain at sternum across combat (verify Ch.10, Ch.30)", color:"text-orange"},
            ].map((f,i) => (
              <div key={i} className={`text-[9px] font-mono py-2 border-b border-border/30 last:border-0 ${f.color}`}>{f.flag}</div>
            ))}
          </SectionBox>
          <SectionBox title="§15 · DRIFT RISKS (PER AUDIT HISTORY)">
            {[
              {r:"☒ Over-elaboration of social physics framing",      note:"Cut ×1 in Ch.6 v97 revision"},
              {r:"☒ Italicized internal monologue",                   note:"Straight prose lands harder"},
              {r:"☐ Spanish-with-translation",                        note:"Has not occurred — discipline holds"},
              {r:"☒ Forcing MR into combat scenes that already work", note:"Ch.10 contact, Ch.11 red truth do NOT need MR; earn Ω through execution density"},
            ].map((r,i) => (
              <div key={i} className="flex gap-3 border-b border-border/30 py-2 last:border-0">
                <span className={`text-[9px] font-mono flex-shrink-0 w-64 ${r.r.startsWith("☐")?"text-teal":"text-red"}`}>{r.r}</span>
                <span className="text-[9px] font-mono text-muted-foreground">{r.note}</span>
              </div>
            ))}
          </SectionBox>
        </div>
      )}
    </div>
  );
}