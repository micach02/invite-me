/**
 * Restore points for an invitation, kept in this browser (localStorage).
 * Photos are left out of a snapshot — they can be megabytes each — so restoring brings back the words, dates, colours,
 * fonts and layout while the photos stay as they are now.
 */
const MAX = 25;
const key = (id) => `inviteme:versions:${id}`;

const read = (id) => { try { return JSON.parse(localStorage.getItem(key(id))) ?? []; } catch { return []; } };
const write = (id, list) => { try { localStorage.setItem(key(id), JSON.stringify(list)); return true; } catch { return false; } };

const strip = ({ images, ...rest }) => rest; // eslint-disable-line no-unused-vars

export const listVersions = (id) => read(id);

/** Adds a restore point unless nothing changed since the newest one. Returns the new entry, or null. */
export function addVersion(id, config, label, { auto = false } = {}) {
  const snap = strip(config);
  const list = read(id);
  const serial = JSON.stringify(snap);
  if (list[0] && JSON.stringify(list[0].config) === serial) return null;
  const entry = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), label, auto, config: snap };
  let next = [entry, ...list];
  // Over the cap: drop the oldest automatic points first, then the oldest of all.
  while (next.length > MAX) {
    const i = [...next].reverse().findIndex((v) => v.auto);
    next.splice(i === -1 ? next.length - 1 : next.length - 1 - i, 1);
  }
  while (!write(id, next) && next.length > 3) next = next.slice(0, -1); // storage full: keep fewer
  return entry;
}

export function removeVersion(id, versionId) {
  write(id, read(id).filter((v) => v.id !== versionId));
}

/** The snapshot's content with the invitation's current photos. */
export const restoreFrom = (current, version) => ({ ...version.config, images: current.images });
