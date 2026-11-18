import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Debounced autosave. `value` is serialised to detect real changes.
 * status: 'saved' | 'unsaved' | 'saving' | 'error'
 */
export function useAutosave({ value, save, delay = 1500, enabled = true }) {
  const [status, setStatus] = useState('saved');
  const [savedAt, setSavedAt] = useState(null);
  const latest = useRef(value);
  const lastSaved = useRef(JSON.stringify(value));
  const inflight = useRef(null);
  const saveRef = useRef(save);
  latest.current = value;
  saveRef.current = save;

  const markSaved = useCallback((v) => { lastSaved.current = JSON.stringify(v); setStatus('saved'); }, []);

  const flush = useCallback(async () => {
    if (inflight.current) await inflight.current;
    const snapshot = latest.current;
    const serialised = JSON.stringify(snapshot);
    if (serialised === lastSaved.current) { setStatus('saved'); return true; }
    setStatus('saving');
    inflight.current = saveRef.current(snapshot)
      .then(() => { lastSaved.current = serialised; setSavedAt(new Date()); return true; })
      .catch(() => false)
      .finally(() => { inflight.current = null; });
    const ok = await inflight.current;
    setStatus(JSON.stringify(latest.current) === lastSaved.current ? (ok ? 'saved' : 'error') : ok ? 'unsaved' : 'error');
    return ok;
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    if (JSON.stringify(value) === lastSaved.current) return undefined;
    setStatus((s) => (s === 'saving' ? s : 'unsaved'));
    const t = setTimeout(flush, delay);
    return () => clearTimeout(t);
  }, [value, delay, enabled, flush]);

  useEffect(() => {
    const warn = (e) => {
      if (JSON.stringify(latest.current) !== lastSaved.current) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  return { status, savedAt, saveNow: flush, markSaved };
}
