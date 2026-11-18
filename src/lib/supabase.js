import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
