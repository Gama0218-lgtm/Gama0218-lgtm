import { useState } from "react";

const CHECKLIST_SECTIONS = [
  {
    id:"pre", title:"PRE-VISIT PROTOCOL — Before Leaving",  color:"gold", icon:"📋",
    items:[
      { id:"p1", text:"Coordinate with shelter administration at least 48 hours in advance", critical:true  },
      { id:"p2", text:"Confirm Spanish-language materials are printed and ready",             critical:true  },
      { id:"p3", text:"Obtain signed photographer/videographer consent forms",               critical:true  },
      { id:"p4", text:"Brief all team members on DO/DO NOT protocol for this specific shelter", critical:true },
      { id:"p5", text:"Verify no military insignia/uniforms in any materials (legal review)", critical:true  },
      { id:"p6", text:"Charged phone with offline maps of Tijuana/Nogales/Juárez",           critical:false },
      { id:"p7", text:"Emergency contact list for US side (ImmDef, Al Otro Lado)",           critical:false },
      { id:"p8", text:"Local liaison confirmed (DVSH contact, KBI staff, etc.)",             critical:true  },
    ]
  },
  {
    id:"do", title:"DO — Approved Field Actions", color:"teal", icon:"✓",
    items:[
      { id:"d1", text:"Use bilingual introduction: 'Somos de AUMER Foundation / TruthEngine360'", critical:false },
      { id:"d2", text:"Ask permission before recording — verbal + written consent",           critical:true  },
      { id:"d3", text:"Verify veteran status by referencing DD-214 (don't request to see it)", critical:false },
      { id:"d4", text:"Prioritize listening over collecting — relationship first, story second", critical:false },
      { id:"d5", text:"Share resources: ALVA, ImmDef, Al Otro Lado contact cards",           critical:false },
      { id:"d6", text:"Use voice memos only with explicit consent — no hidden recording",    critical:true  },
      { id:"d7", text:"Offer to follow up via WhatsApp with written consent",                critical:false },
      { id:"d8", text:"Document geo-tag for the field log (shelter name, city, date only)",  critical:false },
    ]
  },
  {
    id:"donot", title:"DO NOT — Prohibited Actions", color:"red", icon:"✗",
    items:[
      { id:"n1", text:"DO NOT imply DoD/US Army/USMC official endorsement in ANY material", critical:true  },
      { id:"n2", text:"DO NOT use military insignia, uniforms, or seals without legal clearance", critical:true },
      { id:"n3", text:"DO NOT photograph identifiable faces without written consent form",   critical:true  },
      { id:"n4", text:"DO NOT discuss pending immigration cases or deportation orders",      critical:true  },
      { id:"n5", text:"DO NOT promise legal assistance — refer only (ImmDef, Al Otro Lado)",critical:true  },
      { id:"n6", text:"DO NOT visit Tijuana/Juárez without local guide in cartel-adjacent areas", critical:true },
      { id:"n7", text:"DO NOT publish names without written consent + source protection review", critical:true },
      { id:"n8", text:"DO NOT sensationalize trauma for engagement bait",                    critical:true  },
    ]
  },
  {
    id:"post", title:"POST-VISIT PROTOCOL — After Returning", color:"blue", icon:"📝",
    items:[
      { id:"q1", text:"Upload all consent forms to secure shared drive within 24 hours",     critical:true  },
      { id:"q2", text:"File field report: location, contacts, key observations, follow-ups", critical:true  },
      { id:"q3", text:"Add new contacts to HubSpot Hub 46948033 (Circle 1 classification)", critical:false },
      { id:"q4", text:"De-identify any personal information in field notes",                 critical:true  },
      { id:"q5", text:"Brief legal advisor if any legally sensitive information was shared", critical:false },
      { id:"q6", text:"Send follow-up to local liaison within 48 hours",                    critical:false },
      { id:"q7", text:"Update border hub map with new shelter contacts",                     critical:false },
    ]
  }
];

const GOVERNANCE = [
  { id:"NN-1", cat:"Military Marks",      rule:"Avoid military service names, insignia, uniforms unless rights + usage boundaries confirmed. No implied DoD/Army endorsement.", mitigation:"Legal review of ALL visual assets before publication." },
  { id:"NN-2", cat:"Creator Disclosure",  rule:"All paid/material creator relationships must be disclosed. FTC rules apply. Required in contract language.",                       mitigation:"Disclosure checklist + post-audit process." },
  { id:"NN-3", cat:"Claims Ledger",       rule:"Maintain claims ledger for every factual assertion that might become a press line or graphic. DCAS = 349 is a race-field output, not an ethnicity census.", mitigation:"Fact-check advisor reviews all press-facing claims." },
  { id:"NN-4", cat:"Human Subjects",      rule:"Written consent for all oral histories, personal photos, and family materials. IRB-equivalent consent language for cohort studies.", mitigation:"Consent form templates + de-identification protocol." },
  { id:"NN-5", cat:"Trauma Framing",      rule:"Do not sensationalize trauma or casualty narratives for engagement bait. Avoid triumphalist framing.",                             mitigation:"Community sensitivity review before publication." },
  { id:"NN-6", cat:"Corrections Protocol",rule:"Publish corrections quickly and visibly when errors are discovered. A history-centered brand that buries corrections loses everything.", mitigation:"72-hour correction policy + public notice protocol." },
];

export default function FieldOperations() {
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked(prev => ({...prev, [id]: !prev[id]}));
  const doneCount = (section) => section.items.filter(i => checked[i.id]).length;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <div className="text-lg font-black font-mono text-foreground mb-1">FIELD OPERATIONS PROTOCOL</div>
        <div className="text-xs text-muted-foreground font-mono">DO/DO NOT checklist for Mexico shelter visits · Consent form checklist · Source protection guidelines · Geo-tag protocol · Campaign governance non-negotiables</div>
      </div>

      {/* Field checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {CHECKLIST_SECTIONS.map(section => (
          <div key={section.id} className={`bg-card border border-${section.color}/20 rounded-xl overflow-hidden`}>
            <div className={`px-4 py-3 border-b border-${section.color}/20 bg-${section.color}/5 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span>{section.icon}</span>
                <div className={`text-[10px] font-black font-mono text-${section.color}`}>{section.title}</div>
              </div>
              <div className="text-[8px] font-mono text-muted-foreground">{doneCount(section)}/{section.items.length} done</div>
            </div>
            <div className="divide-y divide-border/30">
              {section.items.map(item => (
                <div key={item.id} onClick={() => toggle(item.id)}
                  className={`flex items-start gap-3 px-4 py-2.5 cursor-pointer hover:bg-secondary/10 transition-all ${checked[item.id]?"opacity-50":""}`}>
                  <div className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 ${
                    checked[item.id] ? `bg-${section.color} border-${section.color}` : `border-${section.color}/40`
                  }`}>
                    {checked[item.id] && <span className="text-background text-[8px] font-black">✓</span>}
                  </div>
                  <div className="flex-1">
                    <div className={`text-[9px] ${checked[item.id]?"line-through text-muted-foreground":"text-foreground/80"}`}>{item.text}</div>
                    {item.critical && !checked[item.id] && <span className="text-[6px] font-bold text-red font-mono">REQUIRED</span>}
                  </div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="px-4 pb-3 pt-2">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-${section.color} transition-all duration-300`}
                  style={{width:`${(doneCount(section)/section.items.length)*100}%`}} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign governance non-negotiables */}
      <div className="bg-card border border-red/20 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-red/20 bg-red/5 text-[9px] font-bold font-mono text-red">6 NON-NEGOTIABLES — Campaign Governance | Compliance = Design Input, Not Cleanup</div>
        <div className="divide-y divide-border/30">
          {GOVERNANCE.map((g, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-secondary/10">
              <div className="flex-shrink-0 w-14">
                <div className="text-[9px] font-black font-mono text-red">{g.id}</div>
                <div className="text-[7px] font-mono text-muted-foreground">{g.cat}</div>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-foreground mb-1">{g.rule}</div>
                <div className="text-[9px] text-teal font-mono">→ {g.mitigation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source protection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title:"SOURCE PROTECTION PROTOCOL",   color:"gold",   items:["Never identify sources by name in public-facing material without explicit consent","Store consent forms in encrypted shared drive — access restricted","De-identify all field notes within 24 hours","No WhatsApp messages with identifying info on personal phones","Use Signal for sensitive source communications"] },
          { title:"GEO-TAG PROTOCOL",             color:"teal",   items:["Log: shelter name, city, country, date only","No GPS coordinates in any public posts","No location tags on Instagram/TikTok during border visits","Field photos: strip EXIF metadata before upload","Border crossing: no social media posts until safely returned"] },
          { title:"FOLLOW-UP PIPELINE TRACKER",   color:"blue",   items:["48-hour thank-you to local liaison","Update HubSpot CRM record same day","File field report (Google Drive — secure folder)","Schedule 2-week follow-up call with key contacts","Flag any legally sensitive info for advisor review"] },
        ].map((s,i) => (
          <div key={i} className={`bg-card border border-${s.color}/20 rounded-xl p-4`}>
            <div className={`text-[9px] font-bold font-mono text-${s.color} mb-3`}>{s.title}</div>
            <ul className="space-y-1.5">
              {s.items.map((item,j) => (
                <li key={j} className={`flex items-start gap-1.5 text-[9px] text-foreground/80`}>
                  <span className={`text-${s.color} font-bold flex-shrink-0`}>·</span>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}