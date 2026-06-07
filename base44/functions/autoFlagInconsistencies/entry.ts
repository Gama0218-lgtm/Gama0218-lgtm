import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SEV_MAP = { CLEAN: "LOW", LOW: "LOW", MEDIUM: "MED", HIGH: "HIGH", CRITICAL: "CRITICAL" };

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  const { data } = body;
  if (!data || !data.chapter_number || data.status !== "complete") {
    return Response.json({ skipped: true, reason: "not complete" });
  }

  const sev = SEV_MAP[data.overall_severity] || "MED";
  const chNum = data.chapter_number;
  const versionId = data.audit_run_id || "unknown";

  const toCreate = [];

  for (const issue of (data.continuity_issues || [])) {
    toCreate.push({ chapter_number: chNum, category: "continuity", severity: sev === "LOW" ? "MED" : sev, flag: issue.substring(0, 100), detail: issue, status: "quarantined", version_found: versionId });
  }
  for (const issue of (data.anachronisms || [])) {
    toCreate.push({ chapter_number: chNum, category: "anachronism", severity: "HIGH", flag: issue.substring(0, 100), detail: issue, status: "quarantined", version_found: versionId });
  }
  for (const issue of (data.voice_drift_flags || [])) {
    toCreate.push({ chapter_number: chNum, category: "name-error", severity: "MED", flag: issue.substring(0, 100), detail: issue, status: "quarantined", version_found: versionId });
  }
  for (const issue of (data.character_flags || [])) {
    toCreate.push({ chapter_number: chNum, category: "continuity", severity: sev, flag: issue.substring(0, 100), detail: issue, status: "quarantined", version_found: versionId });
  }
  for (const issue of (data.structural_flags || [])) {
    toCreate.push({ chapter_number: chNum, category: "structural", severity: "MED", flag: issue.substring(0, 100), detail: issue, status: "quarantined", version_found: versionId });
  }

  if (toCreate.length === 0) {
    return Response.json({ created: 0, skipped: 0 });
  }

  const existing = await base44.asServiceRole.entities.QuarantineItem.filter({
    chapter_number: chNum,
    version_found: versionId
  });
  const existingFlags = new Set(existing.map(e => e.flag));
  const newItems = toCreate.filter(i => !existingFlags.has(i.flag));

  if (newItems.length > 0) {
    await base44.asServiceRole.entities.QuarantineItem.bulkCreate(newItems);
  }

  return Response.json({ created: newItems.length, skipped: toCreate.length - newItems.length, chapter: chNum });
});