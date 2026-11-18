// Supabase Edge Function: emails the invitation owner when a guest RSVPs.
// Deploy:  supabase functions deploy send-rsvp-email
// Secrets: supabase secrets set RESEND_API_KEY=... FROM_EMAIL="InviteMe <rsvp@yourdomain.com>"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type' };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { invitationId, rsvpId } = await req.json();
    // InviteMe lives in its own schema so it can share a project with other apps.
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { db: { schema: 'inviteme' } });

    const { data: rsvp } = await admin.from('rsvps').select('*').eq('id', rsvpId).eq('invitation_id', invitationId).single();
    const { data: inv } = await admin.from('invitations').select('title, user_id').eq('id', invitationId).single();
    if (!rsvp || !inv) return new Response('Not found', { status: 404, headers: cors });

    const { data: owner } = await admin.auth.admin.getUserById(inv.user_id);
    const to = owner.user?.email;
    if (!to) return new Response('No recipient', { status: 400, headers: cors });

    const esc = (s: string) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
    const html = `<h2>New RSVP for “${esc(inv.title)}”</h2>
      <p><b>${esc(rsvp.guest_name)}</b> responded <b>${esc(rsvp.attending)}</b> (${rsvp.guest_count} guest/s).</p>
      ${rsvp.message ? `<p>“${esc(rsvp.message)}”</p>` : ''}`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: Deno.env.get('FROM_EMAIL'), to, subject: `New RSVP: ${rsvp.guest_name}`, html }),
    });
    return new Response(JSON.stringify({ ok: res.ok }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(String(e), { status: 500, headers: cors });
  }
});
