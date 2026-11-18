import dayjs from 'dayjs';

export const cn = (...parts) => parts.filter(Boolean).join(' ');

export const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);

export const slugify = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export const randomSuffix = () => Math.random().toString(36).slice(2, 6);

/** Immutable deep set by dot path, e.g. setPath(cfg, 'sections.program.items.0.title', 'x') */
export function setPath(obj, path, value) {
  const keys = Array.isArray(path) ? path : path.split('.');
  const [head, ...rest] = keys;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  clone[head] = rest.length ? setPath(obj?.[head] ?? (/^\d+$/.test(rest[0]) ? [] : {}), rest, value) : value;
  return clone;
}

export const getPath = (obj, path, fallback) => {
  const v = path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
  return v === undefined ? fallback : v;
};

export const deepClone = (v) => JSON.parse(JSON.stringify(v));

/** Merge saved config onto defaults so older invitations never miss new fields. */
export function deepMerge(base, extra) {
  if (Array.isArray(extra) || typeof extra !== 'object' || extra === null) return extra === undefined ? base : extra;
  const out = { ...base };
  for (const k of Object.keys(extra)) out[k] = deepMerge(base?.[k], extra[k]);
  return out;
}

export const siteUrl = () => (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
export const publicUrl = (slug) => `${siteUrl()}/invitation/${slug}`;

export function eventMoment(event = {}) {
  if (!event.date) return null;
  const d = dayjs(`${event.date}T${event.startTime || '00:00'}`);
  return d.isValid() ? d : null;
}

export const formatDate = (date, fmt = 'MMMM D, YYYY') => (date && dayjs(date).isValid() ? dayjs(date).format(fmt) : '');

export function formatTime(time) {
  if (!time) return '';
  const d = dayjs(`2000-01-01T${time}`);
  return d.isValid() ? d.format('h:mm A') : time;
}

export const timeRange = (event = {}) =>
  [formatTime(event.startTime), formatTime(event.endTime)].filter(Boolean).join(' – ');

export const mapsEmbedUrl = (venue = {}) => {
  const q = [venue.name, venue.address].filter(Boolean).join(', ');
  return q ? `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed` : '';
};

export const mapsLink = (venue = {}) =>
  venue.mapUrl ||
  (venue.address || venue.name
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([venue.name, venue.address].filter(Boolean).join(', '))}`
    : '');

export function downloadFile(filename, content, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const toCsv = (rows) =>
  rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');

export const debounce = (fn, ms) => {
  let t;
  const wrapped = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
  wrapped.cancel = () => clearTimeout(t);
  return wrapped;
};

/** Black or white, whichever reads better on the given hex background. */
export function contrastText(hex = '#000000') {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5 ? '#1c1c1c' : '#ffffff';
}

/** Build an .ics calendar file for the event. */
export function buildIcs(config) {
  const { event = {}, venue = {} } = config;
  const start = eventMoment(event);
  if (!start) return null;
  const end = event.endTime ? dayjs(`${event.date}T${event.endTime}`) : start.add(3, 'hour');
  const fmt = (d) => d.format('YYYYMMDDTHHmmss');
  const esc = (s = '') => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//InviteMe//EN', 'BEGIN:VEVENT',
    `UID:${uid()}@inviteme`, `DTSTAMP:${dayjs().format('YYYYMMDDTHHmmss')}`,
    `DTSTART:${fmt(start)}`, `DTEND:${fmt(end.isBefore(start) ? start.add(3, 'hour') : end)}`,
    `SUMMARY:${esc(event.title)}`, `LOCATION:${esc([venue.name, venue.address].filter(Boolean).join(', '))}`,
    `DESCRIPTION:${esc(event.description)}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
