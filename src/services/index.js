import { isSupabaseConfigured } from '../lib/supabase';
import * as local from './local';
import * as remote from './remote';

const backend = isSupabaseConfigured ? remote : local;

export const { auth, invitations, rsvps, storage, library } = backend;
export const isDemoMode = !isSupabaseConfigured;
export { notifyHostOfRsvp } from './notifications';
