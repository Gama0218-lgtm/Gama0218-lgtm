import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Watches Google Drive for changes to the SGT Ramos manuscript file.
// On change: downloads the file and triggers startAuditRun.
// Manuscript is identified by name containing any of the MANUSCRIPT_KEYWORDS,
// OR by the watched_file_id stored in SyncState (set after first detection).

const MANUSCRIPT_KEYWORDS = ['ramos', 'vietnam', 'sgt george', 'mathematics of vietnam'];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();

  // Acknowledge Drive sync ping — no action needed
  const state = body?.data?._provider_meta?.['x-goog-resource-state'];
  if (state === 'sync') {
    return Response.json({ status: 'sync_ack' });
  }

  const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
  const authHeader = { Authorization: `Bearer ${accessToken}` };

  // Load or initialize SyncState
  const existing = await base44.asServiceRole.entities.SyncState.list();
  let syncRecord = existing.length > 0 ? existing[0] : null;

  if (!syncRecord) {
    const tokenRes = await fetch(
      'https://www.googleapis.com/drive/v3/changes/startPageToken',
      { headers: authHeader }
    );
    const { startPageToken } = await tokenRes.json();
    await base44.asServiceRole.entities.SyncState.create({ page_token: startPageToken });
    return Response.json({ status: 'initialized' });
  }

  // Fetch incremental changes
  const baseUrl = 'https://www.googleapis.com/drive/v3/changes?fields=changes(file(id,name,mimeType,webContentLink)),newStartPageToken,nextPageToken&includeItemsFromAllDrives=false';
  let changesUrl = `${baseUrl}&pageToken=${syncRecord.page_token}`;
  const allChanges = [];
  let newPageToken = null;

  while (changesUrl) {
    const res = await fetch(changesUrl, { headers: authHeader });
    if (!res.ok) return Response.json({ status: 'api_error', code: res.status });
    const page = await res.json();
    allChanges.push(...(page.changes || []));
    if (page.newStartPageToken) newPageToken = page.newStartPageToken;
    changesUrl = page.nextPageToken ? `${baseUrl}&pageToken=${page.nextPageToken}` : null;
  }

  // Find manuscript file — match by stored file ID first, then by name keywords
  const manuscriptChange = allChanges.find(c => {
    if (!c.file) return false;
    if (syncRecord.watched_file_id && c.file.id === syncRecord.watched_file_id) return true;
    const nameLower = (c.file.name || '').toLowerCase();
    return MANUSCRIPT_KEYWORDS.some(kw => nameLower.includes(kw));
  });

  if (manuscriptChange) {
    const file = manuscriptChange.file;
    console.log(`Manuscript change detected: ${file.name} (${file.id})`);

    // Remember this file ID for future change detection
    if (!syncRecord.watched_file_id || syncRecord.watched_file_id !== file.id) {
      await base44.asServiceRole.entities.SyncState.update(syncRecord.id, {
        watched_file_id: file.id,
        watched_file_name: file.name,
        last_synced_at: new Date().toISOString(),
      });
    } else {
      await base44.asServiceRole.entities.SyncState.update(syncRecord.id, {
        last_synced_at: new Date().toISOString(),
      });
    }

    // Download the file (export as plain text for .docx, or direct download)
    let downloadUrl;
    if (file.mimeType === 'application/vnd.google-apps.document') {
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`;
    } else {
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
    }

    const fileRes = await fetch(downloadUrl, { headers: authHeader });
    if (!fileRes.ok) {
      console.error(`Failed to download manuscript: ${fileRes.status}`);
      return Response.json({ status: 'download_error' });
    }

    const content = await fileRes.text();

    // Upload to Base44 file storage and trigger audit
    const blob = new Blob([content], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', blob, file.name.replace(/\.[^.]+$/, '.txt'));

    const uploadRes = await fetch(
      `https://api.base44.com/api/apps/${Deno.env.get('BASE44_APP_ID')}/integrations/Core/UploadFile`,
      { method: 'POST', body: formData }
    );

    if (uploadRes.ok) {
      const { file_url } = await uploadRes.json();
      // Trigger the existing audit pipeline
      await base44.asServiceRole.functions.invoke('startAuditRun', { file_url });
      console.log(`Audit triggered for: ${file.name}`);
    } else {
      console.error('File upload failed:', await uploadRes.text());
    }
  }

  // Always save the new page token
  if (newPageToken && newPageToken !== syncRecord.page_token) {
    await base44.asServiceRole.entities.SyncState.update(syncRecord.id, {
      page_token: newPageToken,
    });
  }

  return Response.json({
    status: 'ok',
    changes_checked: allChanges.length,
    manuscript_triggered: !!manuscriptChange,
  });
});