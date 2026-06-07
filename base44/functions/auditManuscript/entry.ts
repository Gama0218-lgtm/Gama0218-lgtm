import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const FILE_URL = "https://media.base44.com/files/public/69cc495ef72e0f794cb78a95/02352c2eb_SGTGEORGERAMOSTheMathematicsofVietnam6.docx";
const CH8_FILE_URL = "https://media.base44.com/files/public/69cc495ef72e0f794cb78a95/3a5fa281d_CHAPTER8_LosRecordsMienten1.docx";

const CHAPTER_LIST = [
  { num: 1,  title: "The Sacred Mountain Revelation",   act: "I"   },
  { num: 2,  title: "Descent Into Baptism",               act: "I"   },
  { num: 3,  title: "The Genocide Algorithm",            act: "I"   },
  { num: 4,  title: "Pentagon December 1969",            act: "I"   },
  { num: 5,  title: "The Ghost Protocol",                act: "I"   },
  { num: 6,  title: "Crucible Theorem",                  act: "I"   },
  { num: 7,  title: "The Boulevard Theorem",             act: "I"   },
  { num: 8,  title: "Los Records Mienten",               act: "I"   },
  { num: 9,  title: "First Blood",                       act: "I"   },
  { num: 10, title: "The Pendejo Squad",                 act: "I"   },
  { num: 11, title: "Contact Contact",                   act: "I"   },
  { num: 12, title: "Red Truth Revolution",              act: "I"   },
  { num: 13, title: "Proud Warriors",                    act: "I"   },
  { num: 14, title: "Package Sacrament",                 act: "I"   },
  { num: 15, title: "Move Like Water",                   act: "I"   },
  { num: 16, title: "My Lai Massacre",                   act: "I"   },
  { num: 17, title: "Boundary Shift Equation",           act: "I"   },
  { num: 18, title: "Broken Wing",                       act: "II"  },
  { num: 19, title: "Los Obligados",                     act: "II"  },
  { num: 20, title: "The Genesis Equation",              act: "II"  },
  { num: 21, title: "El Cazador y El Guardian",          act: "II"  },
  { num: 22, title: "Dont Fuck with Familia",            act: "II"  },
  { num: 23, title: "The Eagle and the Sparrow",         act: "II"  },
  { num: 24, title: "Sacred Heart Briefing",             act: "II"  },
  { num: 25, title: "Sacred Heart - The Battle",         act: "II"  },
  { num: 26, title: "Echoes of an Empire",               act: "II"  },
  { num: 27, title: "Hunters Geometry",                  act: "II"  },
  { num: 28, title: "Cruzan o Nadie Cruzan",             act: "II"  },
  { num: 29, title: "Mathematics of Revolution",         act: "II"  },
  { num: 30, title: "Orchestrating Necessary Evil",      act: "II"  },
  { num: 31, title: "Retreat Hell",                      act: "II"  },
  { num: 32, title: "Corridor of Fire",                  act: "II"  },
  { num: 33, title: "Angels from Above",                 act: "III" },
  { num: 34, title: "Sixty-Eight",                       act: "III" },
  { num: 35, title: "The Birthday Brief",                act: "III" },
  { num: 36, title: "Mission Execution",                 act: "III" },
  { num: 37, title: "The Mathematics of Revenge",        act: "III" },
  { num: 38, title: "Last Dance",                        act: "III" },
  { num: 39, title: "When Compadres Fall",               act: "III" },
  { num: 40, title: "Ares: Death of a God",              act: "III" },
  { num: 41, title: "Adios Muchachos",                   act: "III" },
  { num: 42, title: "Sacred Smoke",                      act: "III" },
  { num: 43, title: "Resurrection at the Capitol",       act: "III" },
  { num: 44, title: "The Exile Patriots",                act: "III" },
  { num: 45, title: "Unidos para Siempre",               act: "III" },
];

const AUDIT_PROMPT = (chapterNum, chapterTitle, act) => `
You are an elite developmental editor and literary forensics analyst. You are auditing Chapter ${chapterNum}: "${chapterTitle}" (Act ${act}) from the novel "SGT George Ramos: The Mathematics of Vietnam" by Gabriel Arce.

The full manuscript is attached. Focus your analysis EXCLUSIVELY on Chapter ${chapterNum}.

Perform a comprehensive forensic audit and return a JSON object with these EXACT fields:

{
  "chapter_number": ${chapterNum},
  "chapter_title": "exact title from manuscript",
  "act": "${act}",
  "word_count": <integer count of words in this chapter>,
  "omega_score": <float 100-110, literary quality composite>,
  "cls_score": <float 0-100, Cultural Language Score — Chicano authenticity, code-switching, cultural specificity>,
  "bis_score": <float 0-100, Behavioral Integrity Score — PTSD realism, character psychology, behavioral plausibility>,
  "sii_score": <float 0-100, Sensory Immersion Index — sensory density, synesthetic fusion, physical grounding>,
  "mrf_score": <float 0-100, Multi-Register Frequency — voice variation, military/civilian register shifts>,
  "dialogue_pct": <integer 0-100, percentage of chapter that is dialogue>,
  "sensory_density": <float, sensory references per 1000 words>,
  "pov_violations": <integer count of POV/head-hopping violations>,
  "continuity_issues": ["list of specific continuity errors with quote and location", ...],
  "anachronisms": ["list of historically inaccurate elements with correction", ...],
  "voice_drift_flags": ["character name: specific voice drift description", ...],
  "character_flags": ["specific character consistency issues", ...],
  "structural_flags": ["pacing issues, scene problems, structural weaknesses", ...],
  "agency_score": <float 1-5, protagonist agency — 5=fully drives plot, 1=completely passive>,
  "overall_severity": "<CLEAN|LOW|MEDIUM|HIGH|CRITICAL based on total issue count and severity>",
  "summary": "2-3 sentence editorial summary of this chapter's strengths and primary weaknesses",
  "priority_fix": "The single most urgent fix needed in this chapter"
}

CRITICAL RULES:
- Be precise and cite specific text evidence for every issue
- CLEAN = 0 issues, LOW = 1-2 minor, MEDIUM = 3-5 mixed, HIGH = 6-10 or 1 CRITICAL, CRITICAL = major continuity break or character resurrection
- Omega formula: 71.443 + 0.124(CLS) + 0.118(BIS) + 0.089(SII) + 0.067(MRF) — calculate accurately
- Return ONLY the JSON object, no other text
`;

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const chapterNum = body.chapter_number;
  const auditRunId = body.audit_run_id;

  if (!chapterNum || !auditRunId) {
    return Response.json({ error: "chapter_number and audit_run_id required" }, { status: 400 });
  }

  const ch = CHAPTER_LIST.find(c => c.num === chapterNum);
  if (!ch) return Response.json({ error: "Chapter not found" }, { status: 404 });

  // Mark as processing
  const existing = await base44.entities.ManuscriptAuditResult.filter({
    audit_run_id: auditRunId,
    chapter_number: chapterNum
  });
  
  let record;
  if (existing.length > 0) {
    record = existing[0];
    await base44.entities.ManuscriptAuditResult.update(record.id, { status: "processing" });
  } else {
    record = await base44.entities.ManuscriptAuditResult.create({
      audit_run_id: auditRunId,
      chapter_number: chapterNum,
      chapter_title: ch.title,
      act: ch.act,
      status: "processing"
    });
  }

  // Chapter 39 ("When Compadres Fall") is confirmed present in v12 manuscript — no special handling needed.

  // Call LLM with the manuscript file
  const prompt = AUDIT_PROMPT(chapterNum, ch.title, ch.act);
  
  const fileUrls = chapterNum === 8 ? [CH8_FILE_URL] : [FILE_URL];
  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    file_urls: fileUrls,
    response_json_schema: {
      type: "object",
      properties: {
        chapter_number: { type: "number" },
        chapter_title: { type: "string" },
        act: { type: "string" },
        word_count: { type: "number" },
        omega_score: { type: "number" },
        cls_score: { type: "number" },
        bis_score: { type: "number" },
        sii_score: { type: "number" },
        mrf_score: { type: "number" },
        dialogue_pct: { type: "number" },
        sensory_density: { type: "number" },
        pov_violations: { type: "number" },
        continuity_issues: { type: "array", items: { type: "string" } },
        anachronisms: { type: "array", items: { type: "string" } },
        voice_drift_flags: { type: "array", items: { type: "string" } },
        character_flags: { type: "array", items: { type: "string" } },
        structural_flags: { type: "array", items: { type: "string" } },
        agency_score: { type: "number" },
        overall_severity: { type: "string" },
        summary: { type: "string" },
        priority_fix: { type: "string" }
      }
    }
  });

  await base44.entities.ManuscriptAuditResult.update(record.id, {
    ...result,
    status: "complete"
  });

  // Update the AuditRun progress
  const runs = await base44.entities.AuditRun.filter({ run_id: auditRunId });
  if (runs.length > 0) {
    const run = runs[0];
    const allResults = await base44.entities.ManuscriptAuditResult.filter({ audit_run_id: auditRunId });
    const complete = allResults.filter(r => r.status === "complete");
    const totalBugs = allResults.reduce((sum, r) => sum + (r.continuity_issues?.length || 0) + (r.anachronisms?.length || 0) + (r.voice_drift_flags?.length || 0) + (r.structural_flags?.length || 0) + (r.character_flags?.length || 0), 0);
    const criticalCount = allResults.filter(r => r.overall_severity === "CRITICAL").length;
    const highCount = allResults.filter(r => r.overall_severity === "HIGH").length;
    const mediumCount = allResults.filter(r => r.overall_severity === "MEDIUM").length;
    const scored = allResults.filter(r => r.omega_score > 0);
    const avgOmega = scored.length > 0 ? scored.reduce((s, r) => s + r.omega_score, 0) / scored.length : 0;
    const totalWords = allResults.reduce((s, r) => s + (r.word_count || 0), 0);
    const isComplete = complete.length >= 45;

    await base44.entities.AuditRun.update(run.id, {
      processed_chapters: complete.length,
      total_bugs: totalBugs,
      critical_count: criticalCount,
      high_count: highCount,
      medium_count: mediumCount,
      avg_omega: Math.round(avgOmega * 10) / 10,
      total_words: totalWords,
      status: isComplete ? "complete" : "running",
      completed_at: isComplete ? new Date().toISOString() : undefined
    });
  }

  return Response.json({ success: true, chapter: chapterNum, result });
});