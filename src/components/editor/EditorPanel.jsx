import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle, ArrowDown, ArrowUp, GripVertical, Shuffle,
  AlignCenter, AlignLeft, AlignRight, CalendarClock, ChevronDown, Image as ImageIcon, LayoutList, MailCheck, MapPin, PartyPopper, Palette, Plus, Stamp, Type, Users, X, Layers, Wand2,
} from 'lucide-react';
import {
  ColorField, GalleryField, ImageField, ListEditor, SelectField, Segmented, Slider, TextArea, TextField, Toggle,
} from '../ui/fields';
import { BODY_FONTS, COVER_EFFECTS, COVER_LAYOUTS, DECOR_OPTIONS, HEADING_FONTS, OCCASIONS, REVEALS, SECTION_LABELS, SECTION_ORDER, TITLE_ANIMS, occasionById } from '../../data/constants';
import { PALETTE_GROUPS, PALETTES, paletteToTheme } from '../../data/palettes';
import { contrast } from '../../lib/color';
import FontField from '../ui/FontField';
import { getPath } from '../../lib/utils';

/** Maps a panel to the preview section that should scroll into view when it opens. */
const FOCUS = {
  event: 'cover', host: 'hosts', datetime: 'details', venue: 'location', images: 'story', background: 'cover',
  typography: 'cover', colors: 'cover', animation: 'cover', rsvp: 'rsvp', sections: 'program', logo: 'cover',
};

/** Panels are grouped into three tabs so nobody has to scroll past ten accordions. */
const TABS = [
  { id: 'details', label: 'Details', first: 'event' },
  { id: 'sections', label: 'Sections', first: 'sections' },
  { id: 'design', label: 'Design', first: 'images' },
];
const TAB_OF = {
  event: 'details', host: 'details', datetime: 'details', venue: 'details',
  sections: 'sections', rsvp: 'sections',
  images: 'design', logo: 'design', typography: 'design', colors: 'design', animation: 'design', background: 'design',
};
/** Which settings panel owns each part of the invitation (for click-to-edit from the preview). */
const SEC_PANEL = {
  cover: 'event', welcome: 'event', countdown: 'sections', story: 'sections', details: 'datetime', hosts: 'host', program: 'sections',
  entourage: 'sections', gallery: 'images', dressCode: 'sections', gifts: 'sections', location: 'venue', faq: 'sections', rsvp: 'rsvp',
};
const TabContext = createContext('details');

/** Briefly highlights an element so people see where the click took them. */
function flash(el) {
  if (!el) return;
  el.classList.remove('flash-edit'); void el.offsetWidth; el.classList.add('flash-edit');
  setTimeout(() => el.classList.remove('flash-edit'), 1600);
}

const isHidden = (c, id) => {
  const s = c.sections;
  if (id === 'welcome') return !(c.event.description?.trim() || c.host.parents?.trim());
  if (id === 'details') return !(c.event.date || c.venue.name || c.venue.address);
  if (id === 'hosts') return s.hosts?.enabled === false || ![c.host.hosts, c.host.sponsors, c.host.acknowledgments].some((v) => v?.trim());
  return s[id] ? !s[id].enabled : false;
};

/** Rearrange the sections guests scroll through. Drag a row, or use the arrows (keyboard friendly). */
function PageOrder({ config, onChange, onFocus }) {
  const stored = Array.isArray(config.sections.order) ? config.sections.order : [];
  const list = [...stored.filter((id) => SECTION_ORDER.includes(id)), ...SECTION_ORDER.filter((id) => !stored.includes(id))];
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const moveTo = (from, to) => {
    if (from === to || to < 0 || to >= list.length) return;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
    onFocus?.(item);
  };
  const isDefault = list.every((id, i) => id === SECTION_ORDER[i]);

  return (
    <div className="rounded-xl border border-line-strong bg-surface" id="addon-order">
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <span className="text-sm font-medium">Page order</span>
        {!isDefault && <button type="button" className="text-xs font-semibold text-brand hover:underline" onClick={() => onChange([...SECTION_ORDER])}>Reset</button>}
      </div>
      <ol className="space-y-1 border-t border-line p-2" aria-label="Section order">
        <li className="rounded-lg px-2.5 py-1.5 text-xs text-ink-mute">Cover — always first</li>
        {list.map((id, i) => (
          <li
            key={id} draggable data-order-item={id}
            onDragStart={(e) => { setDrag(i); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', id); }}
            onDragOver={(e) => { e.preventDefault(); if (drag !== null) setOver(i); }}
            onDrop={(e) => { e.preventDefault(); if (drag !== null) moveTo(drag, i); setDrag(null); setOver(null); }}
            onDragEnd={() => { setDrag(null); setOver(null); }}
            className={`flex items-center gap-1.5 rounded-lg border px-1.5 py-1.5 text-sm transition ${over === i && drag !== i ? 'border-brand bg-brand-50' : 'border-transparent hover:bg-canvas'} ${drag === i ? 'opacity-40' : ''}`}
          >
            <GripVertical size={15} className="shrink-0 cursor-grab text-ink-mute" aria-hidden="true" />
            <span className={`min-w-0 flex-1 truncate ${isHidden(config, id) ? 'text-ink-mute' : 'font-medium'}`}>{SECTION_LABELS[id]}</span>
            {isHidden(config, id) && <span className="rounded-full bg-ink/[.06] px-2 py-0.5 text-[10px] font-semibold text-ink-mute">Hidden</span>}
            <button type="button" className="rounded p-1 text-ink-mute hover:text-ink disabled:opacity-25" onClick={() => moveTo(i, i - 1)} disabled={i === 0} aria-label={`Move ${SECTION_LABELS[id]} up`}><ArrowUp size={14} /></button>
            <button type="button" className="rounded p-1 text-ink-mute hover:text-ink disabled:opacity-25" onClick={() => moveTo(i, i + 1)} disabled={i === list.length - 1} aria-label={`Move ${SECTION_LABELS[id]} down`}><ArrowDown size={14} /></button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** One-click colour schemes (filterable by group), a shuffle within the group, and plain-language readability warnings. */
function Palettes({ theme, apply }) {
  const [group, setGroup] = useState('All');
  const list = group === 'All' ? PALETTES : PALETTES.filter((p) => p.group === group);
  const same = (p) => Object.entries(paletteToTheme(p)).every(([k, v]) => (theme[k] || '').toLowerCase() === v.toLowerCase());
  const shuffle = () => {
    const pool = list.filter((p) => !same(p));
    if (pool.length) apply(pool[Math.floor(Math.random() * pool.length)]);
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="label !mb-0">Palettes</span>
        <button type="button" className="btn-ghost btn-sm !h-7" onClick={shuffle}><Shuffle size={13} /> Shuffle</button>
      </div>
      <div className="mb-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Palette groups">
        {['All', ...PALETTE_GROUPS].map((g) => (
          <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)}
            className={`rounded-full px-2 py-1 text-[11px] font-semibold transition ${group === g ? 'bg-brand text-white' : 'bg-ink/[.05] text-ink-soft hover:text-ink'}`}>{g}</button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-2" role="group" aria-label="Colour palettes">
        {list.map((p) => (
          <button key={p.name} type="button" title={p.name} aria-label={`Apply ${p.name} palette`} aria-pressed={same(p)} onClick={() => apply(p)}
            className={`flex h-9 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-surface transition hover:scale-105 ${same(p) ? 'ring-brand' : 'ring-ink/10'}`}>
            <i className="flex-1" style={{ background: p.from }} /><i className="flex-1" style={{ background: p.bg }} /><i className="flex-1" style={{ background: p.accent }} />
          </button>
        ))}
      </div>
    </div>
  );
}

const readability = (t) => {
  const out = [];
  const page = contrast(t.textColor, t.bgColor);
  if (page < 4.5) out.push(`Page text is hard to read on the background (${page.toFixed(1)}:1 — aim for 4.5 or more).`);
  const cover = Math.min(contrast(t.coverText, t.coverFrom), contrast(t.coverText, t.coverTo));
  if (cover < 3) out.push(`Cover text is hard to read on the cover colours (${cover.toFixed(1)}:1 — aim for 3 or more).`);
  return out;
};

function Accordion({ id, title, icon: Icon, open, onToggle, children }) {
  const activeTab = useContext(TabContext);
  if (TAB_OF[id] !== activeTab) return null;
  return (
    <section className="border-b border-line">
      <h3>
        <button
          type="button" onClick={() => onToggle(id)} aria-expanded={open} aria-controls={`panel-${id}`}
          className={`flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-sand-light/60 ${open ? 'bg-sand-light/40' : ''}`}
        >
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${open ? 'bg-brand text-white' : 'bg-brand-50 text-brand'}`}><Icon size={16} strokeWidth={1.8} /></span>
          <span className="flex-1 text-sm font-semibold">{title}</span>
          <ChevronDown size={16} className={`text-ink-mute transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`panel-${id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden"
          >
            <div className="space-y-4 px-5 pb-6 pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Addon({ id, label, enabled, onToggle, children }) {
  return (
    <div id={id ? `addon-${id}` : undefined} className="rounded-xl border border-line-strong bg-surface">
      <div className="px-3.5 py-2.5"><Toggle checked={enabled} onChange={onToggle} label={label} /></div>
      {enabled && children && <div className="space-y-3 border-t border-line px-3.5 pb-4 pt-3">{children}</div>}
    </div>
  );
}

function ColorList({ value = [], onChange }) {
  return (
    <div>
      <span className="label">Suggested colours</span>
      <div className="flex flex-wrap items-center gap-2">
        {value.map((c, i) => (
          <span key={i} className="relative">
            <input type="color" value={c} onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))} className="h-9 w-9 cursor-pointer rounded-full border-0 p-0" aria-label={`Colour ${i + 1}`} />
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove colour" className="absolute -right-1 -top-1 rounded-full bg-night p-0.5 text-white"><X size={10} /></button>
          </span>
        ))}
        {value.length < 6 && (
          <button type="button" onClick={() => onChange([...value, '#C49B72'])} className="grid h-9 w-9 place-items-center rounded-full border border-dashed border-line-strong text-ink-mute hover:border-brand hover:text-brand" aria-label="Add colour"><Plus size={14} /></button>
        )}
      </div>
    </div>
  );
}

export default function EditorPanel({ config, set, update, onFocusSection, focusRequest }) {
  const [open, setOpen] = useState('event');
  const [tab, setTab] = useState('details');

  // Click-to-edit from the preview (or a checklist item): open the owning panel and scroll to it.
  useEffect(() => {
    if (!focusRequest) return undefined;
    const panel = focusRequest.panel ?? SEC_PANEL[focusRequest.sec];
    if (!panel) return undefined;
    setTab(TAB_OF[panel]);
    setOpen(panel);
    const t = setTimeout(() => {
      const el = (focusRequest.sec && panel === 'sections' && document.getElementById(`addon-${focusRequest.sec}`)) || document.getElementById(`panel-${panel}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flash(el);
    }, 320);
    return () => clearTimeout(t);
  }, [focusRequest?.n]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchTab = (next) => {
    setTab(next.id);
    setOpen(next.first);
    onFocusSection?.(FOCUS[next.first] ?? 'cover');
  };
  const b = (path, fallback = '') => ({ value: getPath(config, path, fallback), onChange: (v) => set(path, v) });
  const occ = occasionById(config.meta?.occasion);
  const s = config.sections;

  const toggle = (id) => {
    const next = open === id ? null : id;
    setOpen(next);
    if (next && FOCUS[next]) onFocusSection?.(FOCUS[next]);
  };
  const toggleSection = (key, v) => { set(`sections.${key}.enabled`, v); if (v) onFocusSection?.(key); };

  return (
    <TabContext.Provider value={tab}>
    <div>
      <div className="sticky top-0 z-10 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur" role="tablist" aria-label="Editor sections">
        <div className="flex rounded-xl bg-ink/[.045] p-1">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => switchTab(t)}
              className={`flex-1 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition ${tab === t.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft hover:text-ink'}`}>{t.label}</button>
          ))}
        </div>
      </div>
      <Accordion id="event" title="Event details" icon={PartyPopper} open={open === 'event'} onToggle={toggle}>
        <SelectField label="Occasion" value={config.meta?.occasion ?? 'wedding'} onChange={(v) => set('meta.occasion', v)} options={OCCASIONS.map((o) => ({ value: o.id, label: o.label }))} />
        <TextField label="Event title" {...b('event.title')} placeholder="The Wedding of Michael & Cha" hint="Used for the page title, search and link previews." />
        <TextField label={occ.namesLabel} {...b('event.names')} placeholder={occ.namesPlaceholder} hint="Shown large on the cover." />
        <TextField label="Tagline" {...b('event.tagline')} placeholder="Together with their families" />
        <TextArea label="Description / invitation message" rows={4} {...b('event.description')} />
      </Accordion>

      <Accordion id="host" title="Host information" icon={Users} open={open === 'host'} onToggle={toggle}>
        <TextArea label="Parents' names" rows={3} {...b('host.parents')} placeholder={'Michael’s parents\nCha’s parents'} hint="One line per family. Shown with the invitation message." />
        <Addon label="Show hosts & sponsors" enabled={s.hosts?.enabled !== false} onToggle={(v) => toggleSection('hosts', v)}>
          <TextArea label="Hosts" rows={2} {...b('host.hosts')} />
          <TextArea label="Sponsors" rows={3} {...b('host.sponsors')} hint="One name per line." />
          <TextArea label="Special acknowledgments" rows={3} {...b('host.acknowledgments')} />
        </Addon>
        {s.hosts?.enabled === false && <p className="-mt-2 text-xs text-ink-mute">Hidden from guests. Your names are kept — switch it back on any time.</p>}
      </Accordion>

      <Accordion id="datetime" title="Date & time" icon={CalendarClock} open={open === 'datetime'} onToggle={toggle}>
        <TextField label="Event date" type="date" {...b('event.date')} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Starts" type="time" {...b('event.startTime')} />
          <TextField label="Ends" type="time" {...b('event.endTime')} />
        </div>
      </Accordion>

      <Accordion id="venue" title="Venue & location" icon={MapPin} open={open === 'venue'} onToggle={toggle}>
        <TextField label="Venue name" {...b('venue.name')} />
        <TextArea label="Complete address" rows={2} {...b('venue.address')} />
        <TextField label="Google Maps link" type="url" {...b('venue.mapUrl')} placeholder="https://maps.app.goo.gl/…" hint="Optional. If empty we link to a search for the address." />
      </Accordion>

      <Accordion id="images" title="Images & gallery" icon={ImageIcon} open={open === 'images'} onToggle={toggle}>
        <div className="grid grid-cols-2 gap-3">
          <ImageField label="Couple / celebrant photo" {...b('images.primary')} />
          <ImageField label="Second photo" {...b('images.secondary')} />
        </div>
        <GalleryField label="Photo gallery" {...b('images.gallery', [])} />
      </Accordion>

      <Accordion id="logo" title="Logo" icon={Stamp} open={open === 'logo'} onToggle={toggle}>
        <ImageField label="Logo" {...b('images.logo')} contain uploadOptions={{ maxDim: 800, keepAlpha: true }}
          hint="A company logo, crest or monogram. PNG or SVG with a transparent background looks best." />
        {config.images.logo && (
          <>
            <Slider label="Logo size" min={0.5} max={2} step={0.05} {...b('theme.logoSize', 1)} format={(v) => `${Math.round(v * 100)}%`} />
            <Segmented label="Show logo on" {...b('theme.logoPlacement', 'cover')} options={[
              { value: 'cover', label: 'Cover' },
              { value: 'footer', label: 'Footer' },
              { value: 'both', label: 'Both' },
            ]} />
          </>
        )}
      </Accordion>

      <Accordion id="typography" title="Typography" icon={Type} open={open === 'typography'} onToggle={toggle}>
        <FontField label="Heading font" {...b('theme.fontHeading')} options={HEADING_FONTS} sample={(config.event.names || config.event.title || '').trim().slice(0, 40) || undefined} hint="Each font is previewed with your own names." />
        <FontField label="Body font" plain {...b('theme.fontBody')} options={BODY_FONTS} sample={((config.event.description || '').trim().replace(/\s+/g, ' ').slice(0, 58)) || 'We would love to celebrate with you'} />
        <Slider label="Font size" min={0.85} max={1.3} step={0.05} {...b('theme.fontScale', 1)} format={(v) => `${Math.round(v * 100)}%`} />
        <Segmented label="Text alignment" {...b('theme.align', 'center')} options={[
          { value: 'left', label: 'Left', icon: <AlignLeft size={14} /> },
          { value: 'center', label: 'Center', icon: <AlignCenter size={14} /> },
          { value: 'right', label: 'Right', icon: <AlignRight size={14} /> },
        ]} />
      </Accordion>

      <Accordion id="colors" title="Colors & theme" icon={Palette} open={open === 'colors'} onToggle={toggle}>
        <Palettes theme={config.theme} apply={(p) => update((cfg) => ({ ...cfg, theme: { ...cfg.theme, ...paletteToTheme(p) } }))} />
        <div className="grid grid-cols-2 gap-3">
          <ColorField label="Text colour" {...b('theme.textColor')} />
          <ColorField label="Background" {...b('theme.bgColor')} />
          <ColorField label="Accent" {...b('theme.accentColor')} />
          <ColorField label="Cover text" {...b('theme.coverText')} />
          <ColorField label="Cover from" {...b('theme.coverFrom')} />
          <ColorField label="Cover to" {...b('theme.coverTo')} />
        </div>
        {readability(config.theme).map((w) => (
          <p key={w} role="status" className="flex gap-2 rounded-xl bg-amber-50 p-2.5 text-xs leading-relaxed text-amber-800"><AlertTriangle size={14} className="mt-px shrink-0" /> {w}</p>
        ))}
        <SelectField label="Decorative elements" {...b('theme.decor', 'none')} options={DECOR_OPTIONS} />
        <SelectField label="Cover layout" {...b('theme.layout', 'classic')} options={COVER_LAYOUTS} />
      </Accordion>

      <Accordion id="animation" title="Animation & effects" icon={Wand2} open={open === 'animation'} onToggle={toggle}>
        <SelectField label="Cover effect" {...b('theme.coverEffect', 'none')} options={COVER_EFFECTS} />
        {COVER_EFFECTS.find((e) => e.value === config.theme.coverEffect)?.fx && (
          <ColorField label="Effect colour" value={config.theme.fxColor || config.theme.accentColor} onChange={(v) => set('theme.fxColor', v)} />
        )}
        <SelectField label="Title animation" {...b('theme.titleAnim', 'rise')} options={TITLE_ANIMS}
          hint={config.theme.coverEffect === 'shimmer' ? 'Shimmering titles use blur-in.' : 'Plays when the cover appears.'} />
        <SelectField label="Section reveal" {...b('theme.reveal', 'fade-up')} options={REVEALS} hint="How each section appears as guests scroll." />
        <p className="rounded-xl bg-brand-50 p-3 text-xs text-ink-soft">Floating hearts, snow, bubbles and balloons are under <b>Colors &amp; theme → Decorative elements</b>. Use “Replay opening” above the preview to see the intro again.</p>
      </Accordion>

      <Accordion id="background" title="Background" icon={Layers} open={open === 'background'} onToggle={toggle}>
        <ImageField label="Cover background image" {...b('images.cover')} hint="Full-bleed photo behind the cover title." />
        <Slider label="Cover tint" min={0} max={0.9} step={0.05} {...b('theme.overlay', 0.3)} format={(v) => `${Math.round(v * 100)}%`} />
        <ImageField label="Page texture / pattern" {...b('images.background')} hint="Shown faintly behind every section." />
      </Accordion>

      <Accordion id="rsvp" title="RSVP settings" icon={MailCheck} open={open === 'rsvp'} onToggle={toggle}>
        <Toggle label="Collect RSVPs" checked={s.rsvp.enabled} onChange={(v) => set('sections.rsvp.enabled', v)} />
        {s.rsvp.enabled && (
          <>
            <TextField label="Section title" {...b('sections.rsvp.title')} />
            <TextArea label="Message to guests" rows={2} {...b('sections.rsvp.message')} />
            <TextField label="Reply by" type="date" {...b('sections.rsvp.deadline')} hint="The form closes after this date." />
            <Toggle label="Allow additional guests" checked={s.rsvp.allowPlusOnes} onChange={(v) => set('sections.rsvp.allowPlusOnes', v)} />
            {s.rsvp.allowPlusOnes && <TextField label="Max guests per response" type="number" min={1} max={20} value={s.rsvp.maxGuests} onChange={(v) => set('sections.rsvp.maxGuests', Math.max(1, Math.min(20, Number(v) || 1)))} />}
            <TextField label="Meal options" {...b('sections.rsvp.mealOptions')} placeholder="Chicken, Fish, Vegetarian" hint="Comma-separated. Leave blank to hide." />
            <Toggle label="Allow a message to the host" checked={s.rsvp.collectNote !== false} onChange={(v) => set('sections.rsvp.collectNote', v)} />
          </>
        )}
      </Accordion>

      <Accordion id="sections" title="Additional sections" icon={LayoutList} open={open === 'sections'} onToggle={toggle}>
        <p className="-mt-1 text-xs text-ink-mute">Turn sections on or off, and drag to change the order — the preview updates instantly.</p>

        <PageOrder config={config} onChange={(order) => set('sections.order', order)} onFocus={onFocusSection} />

        <Addon label="Countdown timer" id="countdown" enabled={s.countdown.enabled} onToggle={(v) => toggleSection('countdown', v)}>
          <TextField label="Title" {...b('sections.countdown.title')} />
        </Addon>

        <Addon label="Our story / about" id="story" enabled={s.story.enabled} onToggle={(v) => toggleSection('story', v)}>
          <TextField label="Title" {...b('sections.story.title')} />
          <TextArea label="Story" rows={5} {...b('sections.story.text')} />
        </Addon>

        <Addon label="Hosts & sponsors" id="hosts" enabled={s.hosts?.enabled !== false} onToggle={(v) => toggleSection('hosts', v)}>
          <p className="text-xs text-ink-mute">Edit hosts, sponsors and acknowledgments under “Host information” in the Details tab.</p>
        </Addon>

        <Addon label="Event program" id="program" enabled={s.program.enabled} onToggle={(v) => toggleSection('program', v)}>
          <TextField label="Title" {...b('sections.program.title')} />
          <ListEditor itemLabel="Item" items={s.program.items} addLabel="Add program item" makeItem={() => ({ time: '', title: '', description: '' })}
            onChange={(items) => set('sections.program.items', items)}
            renderItem={(it, patch) => (
              <>
                <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                  <input className="input" placeholder="3:00 PM" value={it.time} onChange={(e) => patch({ time: e.target.value })} aria-label="Time" />
                  <input className="input" placeholder="Ceremony" value={it.title} onChange={(e) => patch({ title: e.target.value })} aria-label="Title" />
                </div>
                <input className="input" placeholder="Optional details" value={it.description} onChange={(e) => patch({ description: e.target.value })} aria-label="Details" />
              </>
            )} />
        </Addon>

        <Addon label="Entourage" id="entourage" enabled={s.entourage.enabled} onToggle={(v) => toggleSection('entourage', v)}>
          <TextField label="Title" {...b('sections.entourage.title')} />
          <ListEditor itemLabel="Group" items={s.entourage.groups} addLabel="Add group" makeItem={() => ({ title: '', members: '' })}
            onChange={(groups) => set('sections.entourage.groups', groups)}
            renderItem={(g, patch) => (
              <>
                <input className="input" placeholder="Group (e.g. Bridesmaids)" value={g.title} onChange={(e) => patch({ title: e.target.value })} aria-label="Group title" />
                <textarea className="input" rows={3} placeholder="One name per line" value={g.members} onChange={(e) => patch({ members: e.target.value })} aria-label="Members" />
              </>
            )} />
        </Addon>

        <Addon label="Photo gallery" id="gallery" enabled={s.gallery.enabled} onToggle={(v) => toggleSection('gallery', v)}>
          <TextField label="Title" {...b('sections.gallery.title')} />
          <p className="text-xs text-ink-mute">Add photos under “Images &amp; gallery”.</p>
        </Addon>

        <Addon label="Dress code" id="dressCode" enabled={s.dressCode.enabled} onToggle={(v) => toggleSection('dressCode', v)}>
          <TextField label="Title" {...b('sections.dressCode.title')} />
          <TextArea label="Details" rows={3} {...b('sections.dressCode.text')} />
          <ColorList value={s.dressCode.colors} onChange={(v) => set('sections.dressCode.colors', v)} />
        </Addon>

        <Addon label="Gift preferences" id="gifts" enabled={s.gifts.enabled} onToggle={(v) => toggleSection('gifts', v)}>
          <TextField label="Title" {...b('sections.gifts.title')} />
          <TextArea label="Message" rows={4} {...b('sections.gifts.text')} />
        </Addon>

        <Addon label="Frequently asked questions" id="faq" enabled={s.faq.enabled} onToggle={(v) => toggleSection('faq', v)}>
          <TextField label="Title" {...b('sections.faq.title')} />
          <ListEditor itemLabel="Question" items={s.faq.items} addLabel="Add question" makeItem={() => ({ q: '', a: '' })}
            onChange={(items) => set('sections.faq.items', items)}
            renderItem={(f, patch) => (
              <>
                <input className="input" placeholder="Question" value={f.q} onChange={(e) => patch({ q: e.target.value })} aria-label="Question" />
                <textarea className="input" rows={2} placeholder="Answer" value={f.a} onChange={(e) => patch({ a: e.target.value })} aria-label="Answer" />
              </>
            )} />
        </Addon>

        <Addon label="Location & map" id="location" enabled={s.location.enabled} onToggle={(v) => toggleSection('location', v)}>
          <TextField label="Title" {...b('sections.location.title')} />
          <Toggle label="Show embedded map" checked={s.location.showMap} onChange={(v) => set('sections.location.showMap', v)} />
        </Addon>
      </Accordion>
    </div>
    </TabContext.Provider>
  );
}
