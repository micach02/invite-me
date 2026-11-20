import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import toast from 'react-hot-toast';
import { History, RotateCcw, Trash2 } from 'lucide-react';
import { addVersion, listVersions, removeVersion } from '../../lib/versions';

dayjs.extend(relativeTime);

/**
 * Version history: named restore points kept in this browser. Restoring goes through the editor's normal change
 * path, so it can be undone with Ctrl+Z like any other edit.
 */
export default function HistoryMenu({ invitationId, config, onRestore, className = '' }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const ref = useRef(null);

  const refresh = () => setList(listVersions(invitationId));

  useEffect(() => {
    if (!open) return undefined;
    refresh();
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = (e) => {
    e.preventDefault();
    const entry = addVersion(invitationId, config, name.trim() || `Version ${dayjs().format('MMM D, h:mm A')}`);
    toast[entry ? 'success' : 'error'](entry ? 'Version saved' : 'Nothing has changed since your last version.');
    setName(''); refresh();
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open} aria-label="Version history" title="Version history"
        className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition hover:bg-ink/[.05] hover:text-ink"
      ><History size={17} /></button>
      {open && (
        <div role="dialog" aria-label="Version history" className="absolute right-0 top-11 z-50 w-[22rem] max-w-[calc(100vw-1.5rem)] animate-fade-in rounded-2xl border border-line bg-surface p-4 shadow-pop">
          <h3 className="font-display text-sm font-bold">Version history</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-mute">Restore points live in this browser. Restoring brings back your words, dates, colours and layout — photos stay as they are now.</p>
          <form onSubmit={save} className="mt-3 flex gap-2">
            <input className="input !h-9 !text-[13px]" placeholder="Name this version (optional)" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} aria-label="Version name" />
            <button className="btn-primary btn-sm !h-9 shrink-0" type="submit">Save</button>
          </form>
          <ul className="scroll-thin mt-3 max-h-72 space-y-1 overflow-y-auto pr-0.5" aria-label="Saved versions">
            {list.length === 0 && <li className="rounded-xl bg-canvas px-3 py-4 text-center text-xs text-ink-mute">No versions yet. Save one before a big change.</li>}
            {list.map((v) => (
              <li key={v.id} data-version className="group flex items-center gap-2 rounded-xl px-2.5 py-2 hover:bg-canvas">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">{v.label}</p>
                  <p className="text-[11px] text-ink-mute">{dayjs(v.at).fromNow()}{v.auto ? ' · automatic' : ''}</p>
                </div>
                <button type="button" className="btn-secondary btn-sm !h-8" onClick={() => { setOpen(false); onRestore(v); }} aria-label={`Restore ${v.label}`}><RotateCcw size={13} /> Restore</button>
                <button type="button" className="rounded-lg p-1.5 text-ink-mute hover:bg-red-50 hover:text-red-600" onClick={() => { removeVersion(invitationId, v.id); refresh(); }} aria-label={`Delete ${v.label}`}><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
