import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Email architecture for RSVP notifications.
 *
 * The browser never sends email itself (that would expose provider keys). Instead it asks a
 * Supabase Edge Function — `send-rsvp-email`, see supabase/functions/send-rsvp-email — to do it.
 * The function loads the RSVP + invitation with the service role, looks up the owner's address
 * and calls the email provider (Resend by default). Failures never block the guest's RSVP.
 */
export async function notifyHostOfRsvp({ invitationId, rsvpId }) {
  if (!isSupabaseConfigured) return { skipped: 'demo-mode' };
  try {
    await supabase.functions.invoke('send-rsvp-email', { body: { invitationId, rsvpId } });
    return { sent: true };
  } catch {
    return { sent: false };
  }
}
