import { useState } from "react";

const NODES = [
  // Champions (inner ring)
  {id:"gabe",   label:"Gabriel Arce",          type:"core",       color:"gold",   x:50,  y:50,  desc:"Author / AUMER Foundation. USC doctoral candidate. Campaign director."},
  {id:"viet",   label:"Viet Thanh Nguyen",     type:"champion",   color:"gold",   x:35,  y:28,  desc:"USC / Pulitzer 2016. Direct institutional colleague. Primary blurb target."},
  {id:"dvsh",   label:"Deported Vets Support", type:"partner",    color:"teal",   x:65,  y:30,  desc:"Hector Barajas / Tijuana. Primary deported veteran community channel."},
  {id:"alva",   label:"ALVA",                  type:"partner",    color:"teal",   x:72,  y:48,  desc:"American Latino Veterans Assn. P0 coalition partner — 349 anomaly petition."},
  {id:"macondo",label:"Macondo Workshop",       type:"champion",   color:"gold",   x:30,  y:68,  desc:"Sandra Cisneros-founded. Chicano literary gateway. Endorsement path."},
  {id:"naccs",  label:"NACCS",                 type:"champion",   color:"gold",   x:22,  y:45,  desc:"Nat'l Assoc. Chicana/Chicano Studies. Canon legitimacy. Conference presentations."},
  // Validators
  {id:"vva",    label:"VVA Chapter 31",         type:"validator",  color:"teal",   x:78,  y:65,  desc:"Vietnam Veterans of America — San Diego. Border veteran endorsement."},
  {id:"voces",  label:"Voces Oral History",     type:"validator",  color:"teal",   x:60,  y:70,  desc:"UT Austin / Maggie Rivas-Rodriguez. Scholarly + media platform access."},
  // Foundations
  {id:"ford",   label:"Ford Foundation",        type:"evaluator",  color:"orange", x:18,  y:22,  desc:"Creativity + Racial Justice program. $100K-$500K. Rolling LOI."},
  {id:"mellon", label:"Mellon Foundation",      type:"evaluator",  color:"orange", x:28,  y:14,  desc:"Digital Humanities + Literary Arts. $75K-$300K. Rolling inquiry."},
  {id:"neh",    label:"NEH",                    type:"evaluator",  color:"orange", x:40,  y:10,  desc:"Public Scholars $60K + HSI grants. Dec 2026. USC HSI eligible."},
  {id:"usldh",  label:"USLDH (Arte Publico)",   type:"evaluator",  color:"orange", x:52,  y:10,  desc:"Up to $7.5K ROLLING — APPLY NOW. First available grant funding."},
  // Academic
  {id:"limon",  label:"Dr. José Limón (UT)",   type:"academic",   color:"purple", x:15,  y:58,  desc:"UT Austin. Mexican American Studies. Foremost Chicano lit scholar."},
  {id:"cantu",  label:"Dr. Norma Cantú",        type:"academic",   color:"purple", x:12,  y:73,  desc:"Borderlands theory. Chicana lit. Bridge between literary + academic."},
  {id:"laura",  label:"Dr. Laura Pérez (UCB)", type:"academic",   color:"purple", x:22,  y:82,  desc:"UC Berkeley Chicana/o Studies. LSTE adoption score 93. Course adoption pipeline."},
  // Agents
  {id:"pande",  label:"Ayesha Pande",          type:"agent",      color:"blue",   x:78,  y:18,  desc:"Ayesha Pande Literary. Multicultural fiction. Sandra Cisneros legacy rep."},
  {id:"harris", label:"Erin Harris (Folio)",   type:"agent",      color:"blue",   x:85,  y:32,  desc:"Folio Literary Management. Historical fiction / war lit."},
  {id:"sanders",label:"Victoria Sanders",      type:"agent",      color:"blue",   x:88,  y:52,  desc:"Victoria Sanders + Associates. Big Five Latino fiction placement."},
  // Media
  {id:"warhorse",label:"The War Horse",         type:"media",      color:"red",    x:72,  y:82,  desc:"Military journalism. 349 Rule = P0 pitch. Investigative story hook."},
  {id:"kpbs",   label:"KPBS San Diego",         type:"media",      color:"red",    x:82,  y:72,  desc:"Regional PBS. Local veteran story + DCAS data = news hook."},
  {id:"npr",    label:"NPR Code Switch",        type:"media",      color:"red",    x:60,  y:88,  desc:"Culture + Race. Bilingual code-switching as market strategy."},
];

const EDGES = [
  {from:"gabe",from_x:50,from_y:50,to:"viet",to_x:35,to_y:28,strength:"high"},
  {from:"gabe",from_x:50,from_y:50,to:"dvsh",to_x:65,to_y:30,strength:"high"},
  {from:"gabe",from_x:50,from_y:50,to:"alva",to_x:72,to_y:48,strength:"high"},
  {from:"gabe",from_x:50,from_y:50,to:"macondo",to_x:30,to_y:68,strength:"high"},
  {from:"gabe",from_x:50,from_y:50,to:"naccs",to_x:22,to_y:45,strength:"high"},
  {from:"gabe",from_x:50,from_y:50,to:"ford",to_x:18,to_y:22,strength:"med"},
  {from:"gabe",from_x:50,from_y:50,to:"neh",to_x:40,to_y:10,strength:"med"},
  {from:"gabe",from_x:50,from_y:50,to:"usldh",to_x:52,to_y:10,strength:"high"},
  {from:"gabe",from_x:50,from_y:50,to:"pande",to_x:78,to_y:18,strength:"low"},
  {from:"viet",from_x:35,from_y:28,to:"naccs",to_x:22,to_y:45,strength:"med"},
  {from:"viet",from_x:35,from_y:28,to:"pande",to_x:78,to_y:18,strength:"med"},
  {from:"dvsh",from_x:65,from_y:30,to:"alva",to_x:72,to_y:48,strength:"high"},
  {from:"alva",from_x:72,from_y:48,to:"vva",to_x:78,to_y:65,strength:"med"},
  {from:"macondo",from_x:30,from_y:68,to:"naccs",to_x:22,to_y:45,strength:"high"},
  {from:"macondo",from_x:30,from_y:68,to:"laura",to_x:22,to_y:82,strength:"med"},
  {from:"naccs",from_x:22,from_y:45,to:"limon",to_x:15,to_y:58,strength:"high"},
  {from:"naccs",from_x:22,from_y:45,to:"cantu",to_x:12,to_y:73,strength:"med"},
  {from:"alva",from_x:72,from_y:48,to:"warhorse",to_x:72,to_y:82,strength:"med"},
  {from:"dvsh",from_x:65,from_y:30,to:"kpbs",to_x:82,to_y:72,strength:"low"},
  {from:"gabe",from_x:50,from_y:50,to:"npr",to_x:60,to_y:88,strength:"low"},
];

const TYPE_CONFIG = {
  core:{"bg":"bg-gold","border":"border-gold","text":"text-gold","label":"Core"},
  champion:{"bg":"bg-gold/80","border":"border-gold/60","text":"text-gold","label":"Champion"},
  partner:{"bg":"bg-teal/80","border":"border-teal/60","text":"text-teal","label":"Partner"},
  validator:{"bg":"bg-teal/60","border":"border-teal/40","text":"text-teal","label":"Validator"},
  evaluator:{"bg":"bg-orange/70","border":"border-orange/50","text":"text-orange","label":"Evaluator"},
  academic:{"bg":"bg-purple/70","border":"border-purple/50","text":"text-purple","label":"Academic"},
  agent:{"bg":"bg-blue/70","border":"border-blue/50","text":"text-blue","label":"Agent"},
  media:{"bg":"bg-red/60","border":"border-red/40","text":"text-red","label":"Media"},
};

const EDGE_STRENGTH = {high:"stroke-gold/60",med:"stroke-teal/30",low:"stroke-border"};

export default function NetworkMapView() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const node = NODES.find(n => n.id === hoveredNode);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <div className="text-xl font-black text-foreground font-mono mb-1">STAKEHOLDER NETWORK MAP</div>
        <div className="text-xs text-muted-foreground">Hover any node to view profile. Edge thickness = relationship strength. Activation order: Core → Champions → Partners → Gatekeepers.</div>
      </div>

      <div className="flex gap-3 flex-wrap mb-2">
        {Object.entries(TYPE_CONFIG).map(([k,v]) => (
          <div key={k} className={`flex items-center gap-1.5 text-[8px] font-mono ${v.text}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${v.bg}`} />
            {v.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden relative" style={{height:"520px"}}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {EDGES.map((e, i) => (
              <line key={i}
                x1={e.from_x} y1={e.from_y} x2={e.to_x} y2={e.to_y}
                strokeWidth={e.strength === "high" ? 0.4 : e.strength === "med" ? 0.25 : 0.15}
                className={EDGE_STRENGTH[e.strength]}
                strokeDasharray={e.strength === "low" ? "0.5 0.5" : undefined}
              />
            ))}
            {/* Nodes */}
            {NODES.map(n => {
              const cfg = TYPE_CONFIG[n.type];
              const isHovered = hoveredNode === n.id;
              const r = n.type === "core" ? 4 : n.type === "champion" || n.type === "partner" ? 3 : 2;
              return (
                <g key={n.id} onMouseEnter={() => setHoveredNode(n.id)} onMouseLeave={() => setHoveredNode(null)}
                  style={{cursor:"pointer"}}>
                  <circle cx={n.x} cy={n.y} r={r + (isHovered ? 1 : 0)}
                    fill={`hsl(var(--card))`} stroke={`hsl(var(--${n.color}))` } strokeWidth={isHovered ? 0.6 : 0.3}
                    className="transition-all duration-200" />
                  {isHovered && <circle cx={n.x} cy={n.y} r={r + 2} fill={`hsl(var(--${n.color}))`} opacity={0.15} />}
                  <text x={n.x} y={n.y - r - 0.8} textAnchor="middle" fontSize={1.8}
                    fill={`hsl(var(--${n.color}))`} fontFamily="monospace" fontWeight="bold" className="pointer-events-none">
                    {n.label.split(" ").slice(0,2).join(" ")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-3">
          {node ? (
            <div className={`bg-card border border-${node.color}/30 rounded-xl p-5 animate-slide-up`}>
              <div className={`text-[8px] font-mono text-${node.color} mb-1`}>{TYPE_CONFIG[node.type]?.label.toUpperCase()}</div>
              <div className={`text-sm font-black text-${node.color} font-mono mb-2`}>{node.label}</div>
              <div className="text-[10px] text-foreground/80">{node.desc}</div>
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border rounded-xl p-5 flex items-center justify-center text-[10px] text-muted-foreground" style={{minHeight:"100px"}}>
              Hover a node to view details
            </div>
          )}

          {/* Priority queue */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[9px] font-bold font-mono text-gold mb-3">P0 ACTIVATION QUEUE</div>
            <div className="space-y-2">
              {[
                {n:"USLDH Grant",         due:"NOW — Rolling",      color:"red"},
                {n:"USC / Viet T. Nguyen",due:"Week 1 — warm touch",color:"gold"},
                {n:"DVSH / Hector Barajas",due:"Week 1 — contact",  color:"teal"},
                {n:"ALVA Coalition MOU",  due:"Week 2",             color:"teal"},
                {n:"NACCS Conference",    due:"Month 2",            color:"gold"},
                {n:"NEH HSI Grant",       due:"Annual — 2026",      color:"orange"},
              ].map((a,i) => (
                <div key={i} className="flex items-center justify-between text-[9px]">
                  <div className={`font-bold text-${a.color}`}>{a.n}</div>
                  <div className="text-muted-foreground font-mono">{a.due}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-[9px] font-bold font-mono text-purple mb-3">HUBSPOT STAKEHOLDER FIELDS</div>
            <div className="space-y-1 text-[9px] text-muted-foreground">
              {["Stakeholder Type","Behavioral Profile Type","Identity Resonance (I)","Current Status","Trigger Type","Last Touch Date","Next Action","Platform"].map((f,i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
              <div className="mt-2 text-[8px] bg-purple/5 border border-purple/20 rounded px-2 py-1">
                Reauthorize HubSpot Hub 46948033 write access to auto-sync from n8n webhooks
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}