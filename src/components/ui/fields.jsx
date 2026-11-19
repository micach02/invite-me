import { useId, useRef, useState } from 'react';
import { ImagePlus, Loader2, Plus, Trash2, X, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { storage } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { cn, uid } from '../../lib/utils';

/** Controlled primitives used by the editor. They are deliberately value/onChange so undo/redo is trivial. */

export function Field({ label, hint, children, className, htmlFor }) {
  return (
    <div className={className}>
      {label && <label className="label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && <p className="mt-1 text-xs text-ink-mute">{hint}</p>}
    </div>
  );
}

export function TextField({ label, hint, value, onChange, className, ...rest }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} className={className} htmlFor={id}>
      <input id={id} className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
  );
}

export function TextArea({ label, hint, value, onChange, rows = 3, className, ...rest }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} className={className} htmlFor={id}>
      <textarea id={id} className="input resize-y" rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
  );
}

export function SelectField({ label, hint, value, onChange, options, className }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} className={className} htmlFor={id}>
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="block text-xs text-ink-mute">{description}</span>}
      </span>
      <button
        type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-brand' : 'bg-sand')}
      >
        <span className={cn('absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
      </button>
    </label>
  );
}

export function ColorField({ label, value, onChange }) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id}>
      <div className="flex items-center gap-2 rounded-xl border border-line-strong bg-white p-1.5">
        <input
          id={id} type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)}
          className="h-8 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
        />
        <input
          className="w-full bg-transparent text-sm uppercase text-ink outline-none" value={value || ''}
          onChange={(e) => /^#?[0-9a-f]{0,6}$/i.test(e.target.value) && onChange(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
          maxLength={7} aria-label={`${label} hex`}
        />
      </div>
    </Field>
  );
}

export function Segmented({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <div className="flex rounded-xl bg-sand-light p-1">
        {options.map((o) => (
          <button
            key={o.value} type="button" onClick={() => onChange(o.value)} aria-pressed={value === o.value}
            className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition',
              value === o.value ? 'bg-white text-brand shadow-sm' : 'text-ink-soft hover:text-ink')}
          >
            {o.icon}{o.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

export function Slider({ label, value, onChange, min, max, step = 0.05, format = (v) => v }) {
  const id = useId();
  return (
    <Field label={`${label} · ${format(value)}`} htmlFor={id}>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-brand" />
    </Field>
  );
}

function useUploader() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const upload = async (file) => {
    setBusy(true);
    try { return await storage.uploadImage(file, user.id); }
    catch (e) { toast.error(e.message || 'Upload failed.'); return null; }
    finally { setBusy(false); }
  };
  return { busy, upload };
}

export function ImageField({ label, value, onChange, hint }) {
  const ref = useRef();
  const { busy, upload } = useUploader();
  const pick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const url = await upload(f);
    if (url) onChange(url);
  };
  return (
    <Field label={label} hint={hint}>
      <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-line-strong">
          <img src={value} alt="" className="h-28 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/50 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <button type="button" className="btn-secondary btn-sm" onClick={() => ref.current.click()}>Replace</button>
            <button type="button" className="btn-secondary btn-sm" onClick={() => onChange('')} aria-label="Remove image"><X size={14} /></button>
          </div>
        </div>
      ) : (
        <button
          type="button" onClick={() => ref.current.click()} disabled={busy}
          className="flex h-24 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line-strong bg-white text-ink-soft transition hover:border-brand hover:text-brand"
        >
          {busy ? <Loader2 className="animate-spin" size={20} /> : <ImagePlus size={20} />}
          <span className="text-xs">{busy ? 'Uploading…' : 'Upload image'}</span>
        </button>
      )}
    </Field>
  );
}

export function GalleryField({ label, value = [], onChange }) {
  const ref = useRef();
  const { busy, upload } = useUploader();
  const add = async (e) => {
    const files = [...(e.target.files || [])].slice(0, 12);
    e.target.value = '';
    const urls = [];
    for (const f of files) { const u = await upload(f); if (u) urls.push(u); }
    if (urls.length) onChange([...value, ...urls]);
  };
  return (
    <Field label={label}>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={add} />
      <div className="grid grid-cols-3 gap-2">
        {value.map((src, i) => (
          <div key={src.slice(-40) + i} className="group relative aspect-square overflow-hidden rounded-lg border border-line-strong">
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} aria-label="Remove photo"
              className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
            ><X size={12} /></button>
          </div>
        ))}
        <button
          type="button" onClick={() => ref.current.click()} disabled={busy}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line-strong text-ink-soft hover:border-brand hover:text-brand"
        >
          {busy ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          <span className="text-[11px]">Add</span>
        </button>
      </div>
    </Field>
  );
}

/** Reorderable list editor for program items, FAQs, entourage groups. */
export function ListEditor({ items = [], onChange, makeItem, renderItem, addLabel = 'Add item', itemLabel }) {
  const move = (i, d) => {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="rounded-xl border border-line-strong bg-canvas p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-ink-mute">{itemLabel ? `${itemLabel} ${i + 1}` : `#${i + 1}`}</span>
            <div className="flex">
              <button type="button" className="rounded p-1 text-ink-mute hover:text-ink disabled:opacity-30" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp size={14} /></button>
              <button type="button" className="rounded p-1 text-ink-mute hover:text-ink disabled:opacity-30" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><ArrowDown size={14} /></button>
              <button type="button" className="rounded p-1 text-ink-mute hover:text-red-600" onClick={() => onChange(items.filter((_, idx) => idx !== i))} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="space-y-2">{renderItem(item, (patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it))))}</div>
        </div>
      ))}
      <button type="button" className="btn-secondary btn-sm w-full" onClick={() => onChange([...items, { id: uid(), ...makeItem() }])}>
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}
