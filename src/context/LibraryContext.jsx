import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { library } from '../services';
import { TEMPLATES } from '../data/templates';

const LibraryContext = createContext(null);

const toTemplate = (row) => ({
  ...row,
  custom: true,
  style: row.style || 'Custom',
  mood: row.mood || 'Custom',
  colorFamily: row.colorFamily || 'neutral',
  blurb: row.blurb || 'A design you saved from the editor.',
});

/**
 * Per-user template library: favourites (built-in or saved ids) and "My templates" (designs saved from the editor).
 * Everything is optional — if the tables aren't set up yet, the rest of the app keeps working and the actions
 * explain what is missing.
 */
export function LibraryProvider({ children }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);
  const [favorites, setFavorites] = useState(() => new Set());
  const [ready, setReady] = useState(false);
  const userId = user?.id;
  const alive = useRef(0);

  useEffect(() => {
    const run = ++alive.current;
    setSaved([]); setFavorites(new Set()); setReady(false);
    if (!userId) return undefined;
    Promise.all([library.listSaved(userId), library.listFavorites(userId)])
      .then(([s, f]) => { if (run === alive.current) { setSaved(s.map(toTemplate)); setFavorites(new Set(f)); } })
      .catch((e) => console.warn('[InviteMe] could not load templates library:', e.message))
      .finally(() => { if (run === alive.current) setReady(true); });
    return () => { alive.current += 1; };
  }, [userId]);

  const isFavorite = useCallback((id) => favorites.has(id), [favorites]);

  /** Optimistic: the heart flips at once and rolls back with a message if saving fails. */
  const toggleFavorite = useCallback(async (id) => {
    if (!userId) return false;
    const on = !favorites.has(id);
    const apply = (next) => setFavorites((prev) => { const s = new Set(prev); if (next) s.add(id); else s.delete(id); return s; });
    apply(on);
    try { await library.setFavorite(userId, id, on); return true; } catch (e) { apply(!on); toast.error(e.message); return false; }
  }, [userId, favorites]);

  const saveTemplate = useCallback(async (input) => {
    const row = toTemplate(await library.save(userId, input));
    setSaved((prev) => [row, ...prev]);
    return row;
  }, [userId]);

  const renameTemplate = useCallback(async (id, name) => {
    await library.rename(id, name);
    setSaved((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  }, []);

  const deleteTemplate = useCallback(async (id) => {
    await library.remove(id);
    setSaved((prev) => prev.filter((t) => t.id !== id));
    setFavorites((prev) => { const s = new Set(prev); s.delete(id); return s; });
  }, []);

  const value = useMemo(() => {
    const everything = [...saved, ...TEMPLATES];
    return {
      ready, saved, favorites, isFavorite, toggleFavorite, saveTemplate, renameTemplate, deleteTemplate,
      favoriteTemplates: everything.filter((t) => favorites.has(t.id)),
      /** Any template (built-in or saved) by id. */
      find: (id) => everything.find((t) => t.id === id),
    };
  }, [ready, saved, favorites, isFavorite, toggleFavorite, saveTemplate, renameTemplate, deleteTemplate]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside <LibraryProvider>');
  return ctx;
};
