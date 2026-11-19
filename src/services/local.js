/**
 * Demo backend: everything lives in this browser's localStorage.
 * Mirrors the shape of services/remote.js so the rest of the app is backend-agnostic.
 */
import dayjs from 'dayjs';
import { uid, deepClone } from '../lib/utils';
import { compressImage, blobToDataUrl } from '../lib/image';

const K = {
  users: 'inviteme:users', session: 'inviteme:session', invitations: 'inviteme:invitations',
  rsvps: 'inviteme:rsvps', views: 'inviteme:views', resets: 'inviteme:resets',
  saved: 'inviteme:saved-templates', favs: 'inviteme:favorites',
};

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {
    throw new Error('Browser storage is full. Remove some photos, or connect Supabase for unlimited storage.');
  }
};

const sha = async (text) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

const listeners = new Set();
const emit = (user) => listeners.forEach((fn) => fn(user));
const publicUser = (u) => (u ? { id: u.id, email: u.email, fullName: u.fullName, phone: u.phone, avatarUrl: u.avatarUrl } : null);

export const auth = {
  async getSession() {
    const id = read(K.session, null);
    return publicUser(read(K.users, []).find((u) => u.id === id));
  },
  onChange(cb) { listeners.add(cb); return () => listeners.delete(cb); },
  async signUp({ email, password, fullName }) {
    const users = read(K.users, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw new Error('An account with that email already exists.');
    const user = { id: uid(), email, fullName, phone: '', avatarUrl: '', hash: await sha(password) };
    write(K.users, [...users, user]);
    write(K.session, user.id);
    emit(publicUser(user));
    return { user: publicUser(user), needsConfirmation: false };
  },
  async signIn({ email, password }) {
    const user = read(K.users, []).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.hash !== (await sha(password))) throw new Error('Incorrect email or password.');
    write(K.session, user.id);
    emit(publicUser(user));
    return publicUser(user);
  },
  async signOut() { localStorage.removeItem(K.session); emit(null); },
  async requestPasswordReset(email) {
    const user = read(K.users, []).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return {};
    const token = uid();
    write(K.resets, { ...read(K.resets, {}), [token]: user.id });
    return { demoToken: token };
  },
  async updatePassword(newPassword, token) {
    const resets = read(K.resets, {});
    const session = read(K.session, null);
    const userId = token ? resets[token] : session;
    if (!userId) throw new Error('This reset link is invalid or has expired.');
    const users = read(K.users, []);
    const hash = await sha(newPassword);
    write(K.users, users.map((u) => (u.id === userId ? { ...u, hash } : u)));
    if (token) { delete resets[token]; write(K.resets, resets); }
  },
  async updateProfile(userId, { fullName, phone, avatarUrl }) {
    const users = read(K.users, []).map((u) =>
      u.id === userId ? { ...u, fullName: fullName ?? u.fullName, phone: phone ?? u.phone, avatarUrl: avatarUrl ?? u.avatarUrl } : u);
    write(K.users, users);
    const updated = publicUser(users.find((u) => u.id === userId));
    emit(updated);
    return updated;
  },
};

const withCounts = (inv) => ({
  ...inv,
  rsvpCount: read(K.rsvps, []).filter((r) => r.invitationId === inv.id).length,
});

export const invitations = {
  async list(userId) {
    return read(K.invitations, [])
      .filter((i) => i.userId === userId)
      .map(withCounts)
      .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
  },
  async get(id) {
    const inv = read(K.invitations, []).find((i) => i.id === id);
    return inv ? withCounts(inv) : null;
  },
  async getBySlug(slug) {
    const inv = read(K.invitations, []).find((i) => i.slug === slug && i.status === 'published');
    return inv ? withCounts(inv) : null;
  },
  async create(userId, { title, occasion, templateId, config }) {
    const now = new Date().toISOString();
    const inv = {
      id: uid(), userId, slug: null, title, occasion, templateId, config, status: 'draft',
      eventDate: config.event?.date || null, viewCount: 0, createdAt: now, updatedAt: now, publishedAt: null,
    };
    write(K.invitations, [...read(K.invitations, []), inv]);
    return inv;
  },
  async update(id, patch) {
    const all = read(K.invitations, []);
    const idx = all.findIndex((i) => i.id === id);
    if (idx < 0) throw new Error('Invitation not found.');
    const next = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    if (patch.config) {
      next.eventDate = patch.config.event?.date || null;
      next.title = patch.config.event?.title || next.title;
    }
    all[idx] = next;
    write(K.invitations, all);
    return withCounts(next);
  },
  async remove(id) {
    write(K.invitations, read(K.invitations, []).filter((i) => i.id !== id));
    write(K.rsvps, read(K.rsvps, []).filter((r) => r.invitationId !== id));
    write(K.views, read(K.views, []).filter((v) => v.invitationId !== id));
  },
  async duplicate(id, userId) {
    const src = read(K.invitations, []).find((i) => i.id === id);
    if (!src) throw new Error('Invitation not found.');
    const config = deepClone(src.config);
    config.page = { ...config.page, slug: '' };
    return this.create(userId, { title: `${src.title} (copy)`, occasion: src.occasion, templateId: src.templateId, config });
  },
  async slugAvailable(slug, excludeId) {
    return !read(K.invitations, []).some((i) => i.slug === slug && i.id !== excludeId);
  },
  async publish(id, slug) {
    if (!(await this.slugAvailable(slug, id))) throw new Error('That link is already taken. Try another.');
    return this.update(id, { slug, status: 'published', publishedAt: new Date().toISOString() });
  },
  async unpublish(id) { return this.update(id, { status: 'draft' }); },
  async recordView(id) {
    write(K.views, [...read(K.views, []), { invitationId: id, ts: new Date().toISOString() }]);
    const all = read(K.invitations, []);
    write(K.invitations, all.map((i) => (i.id === id ? { ...i, viewCount: (i.viewCount || 0) + 1 } : i)));
  },
  async viewsSeries(id, days = 14) {
    const since = dayjs().subtract(days - 1, 'day').startOf('day');
    const buckets = Object.fromEntries(Array.from({ length: days }, (_, i) => [since.add(i, 'day').format('YYYY-MM-DD'), 0]));
    read(K.views, []).filter((v) => v.invitationId === id).forEach((v) => {
      const k = dayjs(v.ts).format('YYYY-MM-DD');
      if (k in buckets) buckets[k] += 1;
    });
    return Object.entries(buckets).map(([date, views]) => ({ date, views }));
  },
};

export const rsvps = {
  async submit(invitationId, data) {
    const row = { id: uid(), invitationId, createdAt: new Date().toISOString(), ...data };
    write(K.rsvps, [...read(K.rsvps, []), row]);
    return row;
  },
  async list(invitationId) {
    return read(K.rsvps, []).filter((r) => r.invitationId === invitationId).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  },
  async listForUser(userId) {
    const mine = new Set(read(K.invitations, []).filter((i) => i.userId === userId).map((i) => i.id));
    return read(K.rsvps, []).filter((r) => mine.has(r.invitationId));
  },
  async update(id, patch) {
    write(K.rsvps, read(K.rsvps, []).map((r) => (r.id === id ? { ...r, ...patch } : r)));
  },
  async remove(id) { write(K.rsvps, read(K.rsvps, []).filter((r) => r.id !== id)); },
};

/** "My templates" (saved designs) and favourites, per user. */
export const library = {
  async listSaved(userId) {
    return read(K.saved, []).filter((t) => t.userId === userId).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  },
  async save(userId, input) {
    const row = { id: `my-${uid()}`, userId, createdAt: new Date().toISOString(), ...input };
    write(K.saved, [...read(K.saved, []), row]);
    return row;
  },
  async rename(id, name) {
    write(K.saved, read(K.saved, []).map((t) => (t.id === id ? { ...t, name } : t)));
  },
  async remove(id) {
    write(K.saved, read(K.saved, []).filter((t) => t.id !== id));
    const favs = read(K.favs, {});
    Object.keys(favs).forEach((u) => { favs[u] = favs[u].filter((f) => f !== id); });
    write(K.favs, favs);
  },
  async listFavorites(userId) { return read(K.favs, {})[userId] ?? []; },
  async setFavorite(userId, templateId, on) {
    const favs = read(K.favs, {});
    const rest = (favs[userId] ?? []).filter((f) => f !== templateId);
    write(K.favs, { ...favs, [userId]: on ? [...rest, templateId] : rest });
  },
};

export const storage = {
  async uploadImage(file) {
    const blob = await compressImage(file, 1400, 0.78);
    return blobToDataUrl(blob);
  },
};
