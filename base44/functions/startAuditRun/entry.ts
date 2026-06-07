import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const runId = `audit_${Date.now()}`;

  const run = await base44.entities.AuditRun.create({
    run_id: runId,
    file_url: "https://media.base44.com/files/public/69cc495ef72e0f794cb78a95/02352c2eb_SGTGEORGERAMOSTheMathematicsofVietnam6.docx",
    status: "running",
    total_chapters: 45,
    processed_chapters: 0,
    total_bugs: 0,
    critical_count: 0,
    high_count: 0,
    medium_count: 0
  });

  return Response.json({ run_id: runId, run_entity_id: run.id });
});