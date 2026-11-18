import { createClient } from '@supabase/supabase-js';

/**
 * The project URL is just the origin: https://<id>.supabase.co
 * People often paste the "REST URL" (…/rest/v1/) or another endpoint from the dashboard instead. supabase-js
 * appends /rest/v1, /auth/v1 … itself, so an extra path makes every request fail with the gateway's
 * "Invalid path specified in request URL". Keep only the origin.
 */
export function normalizeSupabaseUrl(raw) {
  const value = (raw || '').trim();
  if (!value) return '';
  try {
    const { origin, pathname } = new URL(value);
    if (pathname && pathname !== '/') {
      console.warn(`[InviteMe] VITE_SUPABASE_URL contained a path ("${pathname}") — using ${origin}. Use the project URL without a path.`);
    }
    return origin;
  } catch {
    return value;
  }
}

const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * InviteMe keeps ALL of its tables in its own Postgres schema so it can share a Supabase project
 * with other apps without touching their tables. Must match supabase/schema.sql.
 */
export const DB_SCHEMA = import.meta.env.VITE_SUPABASE_SCHEMA || 'inviteme';
export const MEDIA_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'inviteme-media';

/** When no Supabase credentials are configured the app falls back to a browser-storage demo backend. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
    db: { schema: DB_SCHEMA },
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
  : null;
