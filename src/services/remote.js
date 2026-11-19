/** Supabase backend (Auth + PostgreSQL + Storage). Same surface as services/local.js. */
import dayjs from 'dayjs';
import { supabase, MEDIA_BUCKET, DB_SCHEMA } from '../lib/supabase';
import { uid, siteUrl, deepClone } from '../lib/utils';
import { compressImage } from '../lib/image';

const fail = (error, fallback = 'Something went wrong.') => {
  if (!error) return;
  // The two setup mistakes people actually hit when sharing a project: schema not exposed / SQL not run.
  if (error.code === 'PGRST106' || /schema must be one of/i.test(error.message || '')) {
    throw new Error(`Supabase isn't exposing the "${DB_SCHEMA}" schema yet. Add it under Project Settings → API → Exposed schemas.`);
  }
  if (/invalid path specified in request url/i.test(error.message || '')) {
    throw new Error('Supabase rejected the request path. Check VITE_SUPABASE_URL is the project URL (https://<id>.supabase.co) with nothing after it.');
  }
  if (error.code === 'PGRST205' || error.code === '42P01' || /could not find the table|does not exist/i.test(error.message || '')) {
    throw new Error(`InviteMe tables were not found in the "${DB_SCHEMA}" schema. Run supabase/schema.sql in the SQL editor.`);
  }
  throw new Error(error.message || fallback);
};

const toUser = (u, profile) =>
  u && {
    id: u.id,
    email: u.email,
    fullName: profile?.full_name ?? u.user_metadata?.full_name ?? '',
    phone: profile?.phone ?? '',
    avatarUrl: profile?.avatar_url ?? '',
  };

async function loadUser(authUser) {
  if (!authUser) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
  // Don't throw here: this runs while restoring the session and must never block the app from loading.
  // Setup problems surface with a clear message on the first real data call (the dashboard list).
  if (error) { console.warn('[InviteMe] profile lookup failed:', error.message); return toUser(authUser); }
  // No trigger on auth.users (it would fire for the other apps sharing this project), so the
  // profile row is created lazily on first sign-in. Best-effort: the app works without it.
  if (!data) {
    const full_name = authUser.user_metadata?.full_name ?? null;
    await supabase.from('profiles').upsert({ id: authUser.id, full_name }).then(() => {}, () => {});
  }
  return toUser(authUser, data);
}

export const auth = {
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return loadUser(data.session?.user);
  },
  onChange(cb) {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Defer to avoid deadlocking the auth client when we query inside its callback.
      setTimeout(async () => cb(await loadUser(session?.user), event), 0);
    });
    return () => data.subscription.unsubscribe();
  },
  async signUp({ email, password, fullName }) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName }, emailRedirectTo: `${siteUrl()}/dashboard` },
    });
    fail(error);
    // With email confirmation enabled there is no session until the user confirms.
    return { user: toUser(data.user), needsConfirmation: !data.session };
  },
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    fail(error);
    return loadUser(data.user);
  },
  async signOut() { fail((await supabase.auth.signOut()).error); },
  async requestPasswordReset(email) {
    fail((await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl()}/reset-password` })).error);
    return {};
  },
  async updatePassword(newPassword) { fail((await supabase.auth.updateUser({ password: newPassword })).error); },
  async updateProfile(userId, { fullName, phone, avatarUrl }) {
    const patch = { id: userId };
    if (fullName !== undefined) patch.full_name = fullName;
    if (phone !== undefined) patch.phone = phone;
    if (avatarUrl !== undefined) patch.avatar_url = avatarUrl;
    fail((await supabase.from('profiles').upsert(patch)).error);
    const { data } = await supabase.auth.getUser();
    return loadUser(data.user);
  },
};

const toInv = (r) => r && ({
  id: r.id, userId: r.user_id, slug: r.slug, title: r.title, occasion: r.occasion, templateId: r.template_id,
  config: r.config, status: r.status, eventDate: r.event_date, thumbnailUrl: r.thumbnail_url,
  viewCount: r.view_count ?? 0, createdAt: r.created_at, updatedAt: r.updated_at, publishedAt: r.published_at,
  rsvpCount: r.rsvps?.[0]?.count ?? 0,
});

const toRow = (p) => {
  const row = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.occasion !== undefined) row.occasion = p.occasion;
  if (p.templateId !== undefined) row.template_id = p.templateId;
  if (p.config !== undefined) {
    row.config = p.config;
    row.event_date = p.config.event?.date || null;
    if (p.title === undefined && p.config.event?.title) row.title = p.config.event.title;
  }
  if (p.slug !== undefined) row.slug = p.slug;
  if (p.status !== undefined) row.status = p.status;
  if (p.publishedAt !== undefined) row.published_at = p.publishedAt;
  if (p.thumbnailUrl !== undefined) row.thumbnail_url = p.thumbnailUrl;
  row.updated_at = new Date().toISOString();
  return row;
};

export const invitations = {
  async list(userId) {
    const { data, error } = await supabase.from('invitations').select('*, rsvps(count)')
      .eq('user_id', userId).order('updated_at', { ascending: false });
    fail(error);
    return data.map(toInv);
  },
  async get(id) {
    const { data, error } = await supabase.from('invitations').select('*, rsvps(count)').eq('id', id).maybeSingle();
    fail(error);
    return toInv(data);
  },
  async getBySlug(slug) {
    const { data, error } = await supabase.from('invitations').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
    fail(error);
    return toInv(data);
  },
  async create(userId, { title, occasion, templateId, config }) {
    const { data, error } = await supabase.from('invitations').insert({
      user_id: userId, title, occasion, template_id: templateId, config, event_date: config.event?.date || null,
    }).select().single();
    fail(error);
    return toInv(data);
  },
  async update(id, patch) {
    const { data, error } = await supabase.from('invitations').update(toRow(patch)).eq('id', id).select('*, rsvps(count)').single();
    fail(error);
    return toInv(data);
  },
  async remove(id) { fail((await supabase.from('invitations').delete().eq('id', id)).error); },
  async duplicate(id, userId) {
    const src = await this.get(id);
    if (!src) throw new Error('Invitation not found.');
    const config = deepClone(src.config);
    config.page = { ...config.page, slug: '' };
    return this.create(userId, { title: `${src.title} (copy)`, occasion: src.occasion, templateId: src.templateId, config });
  },
  async slugAvailable(slug, excludeId) {
    const { data, error } = await supabase.from('invitations').select('id').eq('slug', slug).limit(1);
    fail(error);
    return !data.some((r) => r.id !== excludeId);
  },
  async publish(id, slug) {
    try {
      return await this.update(id, { slug, status: 'published', publishedAt: new Date().toISOString() });
    } catch (e) {
      if (/duplicate|unique/i.test(e.message)) throw new Error('That link is already taken. Try another.');
      throw e;
    }
  },
  async unpublish(id) { return this.update(id, { status: 'draft' }); },
  async recordView(id) { await supabase.rpc('record_view', { inv_id: id }); },
  async viewsSeries(id, days = 14) {
    const since = dayjs().subtract(days - 1, 'day').startOf('day');
    const { data, error } = await supabase.from('invitation_views').select('viewed_at')
      .eq('invitation_id', id).gte('viewed_at', since.toISOString()).limit(20000);
    fail(error);
    const buckets = Object.fromEntries(Array.from({ length: days }, (_, i) => [since.add(i, 'day').format('YYYY-MM-DD'), 0]));
    data.forEach((v) => { const k = dayjs(v.viewed_at).format('YYYY-MM-DD'); if (k in buckets) buckets[k] += 1; });
    return Object.entries(buckets).map(([date, views]) => ({ date, views }));
  },
};

const toRsvp = (r) => ({
  id: r.id, invitationId: r.invitation_id, guestName: r.guest_name, email: r.email, phone: r.phone,
  attending: r.attending, guestCount: r.guest_count, message: r.message, mealPreference: r.meal_preference,
  createdAt: r.created_at,
});

const MY = 'my-';
const toTemplate = (r) => ({
  id: `${MY}${r.id}`, userId: r.user_id, name: r.name, occasion: r.occasion, baseId: r.base_id,
  style: r.style, mood: r.mood, colorFamily: r.color_family, theme: r.theme, createdAt: r.created_at,
});
const rawId = (id) => id.replace(/^my-/, '');

/** "My templates" (saved designs) and favourites, per user. Needs the saved_templates / favorite_templates tables. */
export const library = {
  async listSaved(userId) {
    const { data, error } = await supabase.from('saved_templates').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    fail(error);
    return data.map(toTemplate);
  },
  async save(userId, t) {
    const { data, error } = await supabase.from('saved_templates').insert({
      user_id: userId, name: t.name, occasion: t.occasion, base_id: t.baseId ?? null, style: t.style ?? null,
      mood: t.mood ?? null, color_family: t.colorFamily ?? null, theme: t.theme,
    }).select().single();
    fail(error);
    return toTemplate(data);
  },
  async rename(id, name) { fail((await supabase.from('saved_templates').update({ name }).eq('id', rawId(id))).error); },
  async remove(id) {
    fail((await supabase.from('saved_templates').delete().eq('id', rawId(id))).error);
    fail((await supabase.from('favorite_templates').delete().eq('template_id', id)).error);
  },
  async listFavorites(userId) {
    const { data, error } = await supabase.from('favorite_templates').select('template_id').eq('user_id', userId).order('created_at');
    fail(error);
    return data.map((r) => r.template_id);
  },
  async setFavorite(userId, templateId, on) {
    const q = supabase.from('favorite_templates');
    fail((on
      ? await q.upsert({ user_id: userId, template_id: templateId }, { onConflict: 'user_id,template_id', ignoreDuplicates: true })
      : await q.delete().eq('user_id', userId).eq('template_id', templateId)).error);
  },
};

export const rsvps = {
  async submit(invitationId, d) {
    // Client-generated id: anonymous guests cannot SELECT, so we cannot read the row back.
    const row = {
      id: uid(), invitation_id: invitationId, guest_name: d.guestName, email: d.email || null, phone: d.phone || null,
      attending: d.attending, guest_count: d.guestCount, message: d.message || null, meal_preference: d.mealPreference || null,
    };
    fail((await supabase.from('rsvps').insert(row)).error);
    return toRsvp({ ...row, created_at: new Date().toISOString() });
  },
  async list(invitationId) {
    const { data, error } = await supabase.from('rsvps').select('*').eq('invitation_id', invitationId).order('created_at', { ascending: false });
    fail(error);
    return data.map(toRsvp);
  },
  async listForUser() {
    // RLS limits rows to invitations owned by the signed-in user.
    const { data, error } = await supabase.from('rsvps').select('id, invitation_id, attending, guest_count, created_at');
    fail(error);
    return data.map((r) => ({ id: r.id, invitationId: r.invitation_id, attending: r.attending, guestCount: r.guest_count, createdAt: r.created_at }));
  },
  async update(id, patch) {
    const row = {};
    if (patch.attending !== undefined) row.attending = patch.attending;
    if (patch.guestCount !== undefined) row.guest_count = patch.guestCount;
    fail((await supabase.from('rsvps').update(row).eq('id', id)).error);
  },
  async remove(id) { fail((await supabase.from('rsvps').delete().eq('id', id)).error); },
};

export const storage = {
  async uploadImage(file, userId) {
    const blob = await compressImage(file);
    const ext = blob.type === 'image/svg+xml' ? 'svg' : blob.type === 'image/gif' ? 'gif' : 'jpg';
    const path = `${userId}/${uid()}.${ext}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: '31536000' });
    fail(error);
    return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  },
};
