import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { Field } from './fields';
import { fontMeta } from '../invitation/theme';

/**
 * CSS for rendering `name` the way the invitation will. Headings get per-typeface case, tracking and weight;
 * body text is always set plainly, so `plain` skips that tuning.
 */
const fontStyle = (name, plain = false) => {
  const m = fontMeta(name);
  if (plain) return { fontFamily: `'${name}', ${m.family}`, fontWeight: 400 };
  return { fontFamily: `'${name}', ${m.family}`, fontWeight: m.weight, textTransform: m.transform, letterSpacing: m.spacing };
};
const split = (label = '') => { const [name, ...rest] = label.split(' — '); return [name, rest.join(' — ')]; };

/**
 * Font dropdown whose options are shown in their own typeface, using the host's real text as the sample.
 * A native <select> can't style options reliably across browsers, so this is a listbox: arrow keys, Home/End,
 * type-ahead, Enter/Space to choose, Esc to close. The list is portalled so scrolling panels can't clip it.
 */
export default function FontField({ label, hint, value, onChange, options, sample, plain = false, className }) {
  const id = useId();
  const btn = useRef(null);
  const menu = useRef(null);
  const typed = useRef({ text: '', at: 0 });
  const [pos, setPos] = useState(null);       // null = closed
  const [active, setActive] = useState(0);
  const open = pos !== null;
  const selected = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[selected] ?? options[0];

  const close = (refocus = false) => { setPos(null); if (refocus) btn.current?.focus(); };
  const openMenu = () => {
    const r = btn.current.getBoundingClientRect();
    const width = Math.max(r.width, 280);
    setActive(selected);
    setPos({ left: Math.min(Math.max(8, r.left), window.innerWidth - width - 8), top: r.bottom + 6, bottom: window.innerHeight - r.top + 6, width, up: false });
  };
  const choose = (i) => { onChange(options[i].value); close(true); };

  // Flip above the button when there isn't room below, and bring the current font into view.
  useLayoutEffect(() => {
    if (!open || !menu.current) return;
    if (!pos.up && pos.top + menu.current.offsetHeight > window.innerHeight - 8 && pos.bottom > pos.top) setPos((p) => ({ ...p, up: true }));
    menu.current.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [open, pos?.up]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!menu.current?.contains(e.target) && !btn.current?.contains(e.target)) close(); };
    const onScroll = (e) => { if (!menu.current?.contains(e.target)) close(); };
    document.addEventListener('mousedown', away);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', onScroll, true);
    return () => { document.removeEventListener('mousedown', away); window.removeEventListener('resize', close); window.removeEventListener('scroll', onScroll, true); };
  }, [open]);

  useEffect(() => { if (open) menu.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' }); }, [active, open]);

  const onKeyDown = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openMenu(); }
      return;
    }
    const last = options.length - 1;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(last, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(last); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
    else if (e.key === 'Tab') close();
    else if (e.key.length === 1) { // type-ahead
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : '') + e.key.toLowerCase(), at: now };
      const hit = options.findIndex((o) => split(o.label)[0].toLowerCase().startsWith(typed.current.text));
      if (hit >= 0) setActive(hit);
    }
  };

  const [curName] = split(current?.label);

  return (
    <Field label={label} hint={hint} className={className} htmlFor={id}>
      <button
        ref={btn} id={id} type="button" onClick={() => (open ? close() : openMenu())} onKeyDown={onKeyDown}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? `${id}-list` : undefined}
        className="input flex items-center justify-between gap-3 text-left"
      >
        <span className="truncate text-[17px] leading-none" style={fontStyle(current?.value, plain)}>{curName}</span>
        <ChevronDown size={16} className={`shrink-0 text-ink-mute transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && createPortal(
        <ul
          ref={menu} id={`${id}-list`} role="listbox" aria-label={label} tabIndex={-1} data-font-list
          style={{ position: 'fixed', left: pos.left, width: pos.width, ...(pos.up ? { bottom: pos.bottom } : { top: pos.top }), maxHeight: 'min(22rem, 60vh)' }}
          className="scroll-thin z-[90] animate-fade-in overflow-y-auto rounded-xl border border-line bg-surface p-1.5 shadow-pop"
        >
          {options.map((o, i) => {
            const [name, desc] = split(o.label);
            const on = o.value === value;
            return (
              <li
                key={o.value} role="option" aria-selected={on} data-index={i} data-font={o.value}
                onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(i)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${i === active ? 'bg-brand-50' : ''}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[19px] leading-snug text-ink" style={fontStyle(o.value, plain)}>{sample || 'The Wedding of Michael & Cha'}</span>
                  <span className="mt-0.5 block truncate text-[11px] text-ink-mute">{name}{desc ? ` · ${desc}` : ''}</span>
                </span>
                {on && <Check size={16} className="shrink-0 text-brand" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </Field>
  );
}
