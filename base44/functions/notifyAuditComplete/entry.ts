import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const run = body.data;

    if (!run || run.status !== 'complete') {
      return Response.json({ skipped: true });
    }

    const webhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (!webhookUrl) {
      return Response.json({ error: 'SLACK_WEBHOOK_URL not set' }, { status: 500 });
    }

    const criticalCount = run.critical_count ?? 0;
    const highCount     = run.high_count ?? 0;
    const totalBugs     = run.total_bugs ?? 0;
    const avgOmega      = run.avg_omega != null ? run.avg_omega.toFixed(2) : 'N/A';
    const chapters      = run.total_chapters ?? 0;
    const completedAt   = run.completed_at
      ? new Date(run.completed_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const severityLine = criticalCount > 0
      ? `:red_circle: *${criticalCount} CRITICAL* · ${highCount} HIGH · ${totalBugs} total flags`
      : highCount > 0
      ? `:large_yellow_circle: *${highCount} HIGH* · ${totalBugs} total flags`
      : `:large_green_circle: Clean run — ${totalBugs} total flags`;

    const message = {
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '📋 Manuscript Audit Complete', emoji: true },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Run ID*\n\`${run.run_id ?? 'unknown'}\`` },
            { type: 'mrkdwn', text: `*Completed*\n${completedAt}` },
            { type: 'mrkdwn', text: `*Chapters Processed*\n${run.processed_chapters ?? chapters} / ${chapters}` },
            { type: 'mrkdwn', text: `*Average Ω Score*\n${avgOmega}` },
          ],
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: severityLine },
        },
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: 'SGT George Ramos — LitCentral Audit Pipeline · Open the dashboard to review the full report.' },
          ],
        },
      ],
    };

    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!slackRes.ok) {
      const errText = await slackRes.text();
      return Response.json({ error: `Slack error: ${errText}` }, { status: 500 });
    }

    return Response.json({ sent: true, run_id: run.run_id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});