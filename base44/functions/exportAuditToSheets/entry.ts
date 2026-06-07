import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { accessToken } = await base44.asServiceRole.connectors.getConnection("googlesheets");

  // Fetch latest audit run
  const runs = await base44.asServiceRole.entities.AuditRun.list('-created_date', 1);
  if (!runs.length) return Response.json({ error: "No audit runs found" }, { status: 404 });
  const latestRun = runs[0];

  // Fetch all chapter results for this run
  const results = await base44.asServiceRole.entities.ManuscriptAuditResult.filter(
    { audit_run_id: latestRun.run_id },
    'chapter_number', 100
  );

  const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const runDate = latestRun.created_date ? new Date(latestRun.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : date;

  // Create spreadsheet
  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      properties: { title: `SGT Ramos Manuscript Audit — ${runDate}` },
      sheets: [
        { properties: { title: "Chapter Scores", sheetId: 0 } },
        { properties: { title: "Flags & Issues", sheetId: 1 } },
        { properties: { title: "Run Summary",    sheetId: 2 } },
      ],
    }),
  });
  const sheet = await createRes.json();
  if (!sheet.spreadsheetId) {
    return Response.json({ error: "Failed to create spreadsheet", detail: sheet }, { status: 500 });
  }
  const spreadsheetId = sheet.spreadsheetId;

  // Sheet 1: Chapter Scores
  const scoreHeaders = [
    "Ch #", "Title", "Act", "Tier / Severity", "Ω Omega", "CLS", "BIS", "SII", "MRF",
    "Word Count", "Dialogue %", "Sensory Density", "POV Violations", "Agency Score", "Priority Fix"
  ];
  const scoreRows = results.map(r => [
    r.chapter_number,
    r.chapter_title || "",
    r.act || "",
    r.overall_severity || "",
    r.omega_score != null ? r.omega_score : "",
    r.cls_score   != null ? r.cls_score   : "",
    r.bis_score   != null ? r.bis_score   : "",
    r.sii_score   != null ? r.sii_score   : "",
    r.mrf_score   != null ? r.mrf_score   : "",
    r.word_count  != null ? r.word_count  : "",
    r.dialogue_pct != null ? r.dialogue_pct : "",
    r.sensory_density != null ? r.sensory_density : "",
    r.pov_violations  != null ? r.pov_violations  : "",
    r.agency_score    != null ? r.agency_score    : "",
    r.priority_fix || "",
  ]);

  // Sheet 2: Flags & Issues (one row per flag)
  const flagHeaders = ["Ch #", "Title", "Act", "Flag Type", "Detail"];
  const flagRows = [];
  for (const r of results) {
    const ch = r.chapter_number;
    const title = r.chapter_title || "";
    const act = r.act || "";
    (r.continuity_issues || []).forEach(f => flagRows.push([ch, title, act, "CONTINUITY", f]));
    (r.anachronisms      || []).forEach(f => flagRows.push([ch, title, act, "ANACHRONISM", f]));
    (r.voice_drift_flags || []).forEach(f => flagRows.push([ch, title, act, "VOICE DRIFT", f]));
    (r.character_flags   || []).forEach(f => flagRows.push([ch, title, act, "CHARACTER", f]));
    (r.structural_flags  || []).forEach(f => flagRows.push([ch, title, act, "STRUCTURAL", f]));
  }

  // Sheet 3: Run Summary
  const summaryHeaders = ["Field", "Value"];
  const summaryRows = [
    ["Run ID",             latestRun.run_id || ""],
    ["Run Date",           runDate],
    ["Total Chapters",     latestRun.total_chapters || results.length],
    ["Processed Chapters", latestRun.processed_chapters || results.length],
    ["Total Words",        latestRun.total_words || ""],
    ["Avg Omega",          latestRun.avg_omega || ""],
    ["Total Bugs",         latestRun.total_bugs || ""],
    ["Critical Count",     latestRun.critical_count || ""],
    ["High Count",         latestRun.high_count || ""],
    ["Medium Count",       latestRun.medium_count || ""],
    ["Export Date",        date],
    ["Exported By",        user.email],
  ];

  // Batch write all three sheets
  const batchRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      valueInputOption: "USER_ENTERED",
      data: [
        { range: "Chapter Scores!A1", values: [scoreHeaders, ...scoreRows] },
        { range: "Flags & Issues!A1", values: [flagHeaders, ...flagRows] },
        { range: "Run Summary!A1",    values: [summaryHeaders, ...summaryRows] },
      ],
    }),
  });
  const batchData = await batchRes.json();
  if (batchData.error) {
    return Response.json({ error: "Failed to write data", detail: batchData.error }, { status: 500 });
  }

  // Bold header rows on all 3 sheets
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [0, 1, 2].map(sheetId => ({
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
          cell: {
            userEnteredFormat: {
              textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
              backgroundColor: { red: 0.08, green: 0.08, blue: 0.16 },
            },
          },
          fields: "userEnteredFormat(textFormat,backgroundColor)",
        },
      })),
    }),
  });

  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  return Response.json({ url, spreadsheetId, chapters: results.length, flags: flagRows.length });
});