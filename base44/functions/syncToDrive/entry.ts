import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { accessToken } = await base44.asServiceRole.connectors.getConnection("googledrive");

  const auditRuns = await base44.entities.AuditRun.list('-created_date', 1);
  const latestRun = auditRuns[0] || null;

  const chapters = latestRun
    ? await base44.entities.ManuscriptAuditResult.filter({ audit_run_id: latestRun.run_id })
    : [];

  const quarantine = await base44.entities.QuarantineItem.list('-created_date', 500);

  const report = {
    generated: new Date().toISOString(),
    manuscript: "SGT George Ramos: The Mathematics of Vietnam",
    version: "v12",
    total_chapters: 46,
    audit_run: latestRun?.run_id || "none",
    avg_omega: latestRun?.avg_omega || null,
    total_words: latestRun?.total_words || null,
    chapters: chapters.sort((a, b) => a.chapter_number - b.chapter_number).map(c => ({
      number: c.chapter_number,
      title: c.chapter_title,
      act: c.act,
      omega: c.omega_score,
      cls: c.cls_score,
      bis: c.bis_score,
      sii: c.sii_score,
      mrf: c.mrf_score,
      words: c.word_count,
      dialogue_pct: c.dialogue_pct,
      severity: c.overall_severity,
      summary: c.summary,
      priority_fix: c.priority_fix,
    })),
    quarantine_summary: {
      total: quarantine.length,
      critical: quarantine.filter(q => q.severity === "CRITICAL").length,
      high: quarantine.filter(q => q.severity === "HIGH").length,
      med: quarantine.filter(q => q.severity === "MED").length,
      low: quarantine.filter(q => q.severity === "LOW").length,
      open: quarantine.filter(q => q.status === "quarantined").length,
      resolved: quarantine.filter(q => q.status === "resolved").length,
    },
    quarantine_items: quarantine.map(q => ({
      chapter: q.chapter_number,
      category: q.category,
      severity: q.severity,
      flag: q.flag,
      detail: q.detail,
      status: q.status,
      submission_blocker: q.submission_blocker || false,
    })),
  };

  const content = JSON.stringify(report, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `LITCENTRAL_v12_Report_${dateStr}.json`;

  const metadata = JSON.stringify({ name: fileName, mimeType: "application/json" });
  const boundary = "litcentral_boundary";
  const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${content}\r\n--${boundary}--`;

  const uploadRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    return Response.json({ error: "Drive upload failed", detail: err }, { status: 500 });
  }

  const file = await uploadRes.json();
  return Response.json({
    success: true,
    file_id: file.id,
    file_name: fileName,
    chapters_exported: chapters.length,
    quarantine_exported: quarantine.length,
  });
});