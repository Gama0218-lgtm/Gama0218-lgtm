import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { event, data, old_data } = payload;

    const changedFields = Object.keys(data || {}).filter(k => {
      if (k === 'updated_date') return false;
      return JSON.stringify(data[k]) !== JSON.stringify((old_data || {})[k]);
    });

    const characterName = data?.name || data?.character_id || 'Unknown Character';

    const emailBody = `
LITCENTRAL — CharacterOverride Updated

Character: ${characterName}
Character ID: ${data?.character_id || 'N/A'}
Event: ${event?.type}
Timestamp: ${new Date().toISOString()}

Changed Fields:
${changedFields.map(f => `  • ${f}: "${(old_data || {})[f] ?? '(empty)'}" → "${data[f]}"`).join('\n') || '  (no tracked fields changed)'}

Full Record:
  Arc: ${data?.arc || 'N/A'}
  Note: ${data?.note || 'N/A'}
  Voice Signature: ${data?.voice_signature || 'N/A'}
  CL-MoE Drift: ${data?.clmoe ?? 'N/A'}
  Flag: ${data?.flag ? 'YES ⚠' : 'No'}

— LitCentral Notification System
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'gbearce1@gmail.com',
      subject: `[LitCentral] CharacterOverride Updated — ${characterName}`,
      body: emailBody,
    });

    return Response.json({ ok: true, character: characterName, changedFields });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});