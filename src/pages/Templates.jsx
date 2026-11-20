import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Check, Eye, Heart, Pencil, Plus, Search, SearchX, SlidersHorizontal, Sparkles, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PublicNav from '../components/layout/PublicNav';
import Footer from '../components/layout/Footer';
import TemplateThumb from '../components/invitation/TemplateThumb';
import PreviewFrame from '../components/invitation/PreviewFrame';
import InvitationRenderer from '../components/invitation/InvitationRenderer';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { ConfirmDialog, EmptyState } from '../components/ui/misc';
import FavoriteButton from '../components/ui/FavoriteButton';
import { useLibrary } from '../context/LibraryContext';
import { TEMPLATES } from '../data/templates';
import { COLOR_FAMILIES, DESIGN_STYLES, LIBRARY_CATEGORIES, MOODS, occasionById } from '../data/constants';
import { templateConfig } from '../data/defaultConfig';
import { useStartInvitation } from '../hooks/useStartInvitation';
import { useAuth } from '../context/AuthContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const PER_PAGE_OPTIONS = [12, 24, 48];
const ANIMATED_DECOR = ['hearts', 'snow', 'bubbles', 'balloons', 'petals', 'autumn', 'lanterns', 'fireflies', 'fireworks', 'memphis'];
const ANIMATED_LAYOUT = ['neon', 'poster', 'ticket', 'polaroid', 'vintage', 'magazine', 'medallion'];
const isAnimated = (t) => t.theme.coverEffect !== 'none' || ANIMATED_DECOR.includes(t.theme.decor) || ANIMATED_LAYOUT.includes(t.theme.layout);

function useMediaQuery(query) {
  const [match, setMatch] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/** Style / theme / colour controls. Shared by the desktop inline panel and the phone bottom sheet. */
function FilterFields({ style, mood, color, counts, setFilter }) {
  return (
    <div className="grid gap-5 md:grid-cols-3 md:gap-6">
      <div>
        <label className="label" htmlFor="f-style">Design style</label>
        <select id="f-style" className="input" value={style} onChange={(e) => setFilter('style', e.target.value)}>
          <option value="all">All styles</option>
          {DESIGN_STYLES.map((s) => <option key={s} value={s}>{s} ({counts.style[s] || 0})</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="f-mood">Theme</label>
        <select id="f-mood" className="input" value={mood} onChange={(e) => setFilter('mood', e.target.value)}>
          <option value="all">All themes</option>
          {MOODS.map((s) => <option key={s} value={s}>{s} ({counts.mood[s] || 0})</option>)}
        </select>
      </div>
      <div>
        <span className="label">Colour</span>
        <div className="flex flex-wrap items-center gap-2 pt-0.5" role="group" aria-label="Colour">
          <button type="button" onClick={() => setFilter('color', 'all')} aria-pressed={color === 'all'}
            className={`h-8 rounded-full px-3.5 text-xs font-semibold transition ${color === 'all' ? 'bg-ink text-canvas' : 'bg-ink/[.05] text-ink-soft hover:bg-ink/[.08]'}`}>Any</button>
          {COLOR_FAMILIES.map((c) => (
            <button key={c.id} type="button" title={c.label} aria-label={c.label} aria-pressed={color === c.id} onClick={() => setFilter('color', color === c.id ? 'all' : c.id)}
              className={`grid h-8 w-8 place-items-center rounded-full ring-2 ring-offset-2 transition ${color === c.id ? 'ring-ink' : 'ring-transparent hover:ring-ink/15'}`} style={{ background: c.hex }}>
              {color === c.id && <Check size={14} strokeWidth={3} className={['black', 'green', 'red', 'purple', 'teal', 'blue'].includes(c.id) ? 'text-white' : 'text-ink'} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Templates() {
  const [params, setParams] = useSearchParams();
  const { user, loading } = useAuth();
  const { start, busyId } = useStartInvitation();
  const { saved, favoriteTemplates, favorites, renameTemplate, deleteTemplate } = useLibrary();
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [preview, setPreview] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const autoStarted = useRef(false);
  const gridTop = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useDocumentMeta({ title: 'Invitation Templates — InviteMe', description: 'Browse elegant invitation templates for weddings, birthdays, baptisms, debuts and more.' });

  const view = ['favorites', 'mine'].includes(params.get('view')) ? params.get('view') : 'all';
  const category = params.get('category') || 'all';
  const mood = params.get('mood') || 'all';
  const color = params.get('color') || 'all';
  const style = params.get('style') || 'all';
  const q = (params.get('q') || '').trim();
  const perPage = PER_PAGE_OPTIONS.includes(Number(params.get('perPage'))) ? Number(params.get('perPage')) : 12;

  // Any filter change returns to page 1.
  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === 'all' || value === '') next.delete(key); else next.set(key, value);
    if (key === 'category' && value !== 'all') next.delete('view'); // the Favorites / My templates tabs and the occasion tabs are one choice
    next.delete('page');
    setParams(next, { replace: true });
  };
  const clearAll = () => setParams(perPage === 12 ? {} : { perPage: String(perPage) }, { replace: true });

  // After sign-up redirect (?use=template-id) create the invitation straight away.
  useEffect(() => {
    const id = params.get('use');
    if (!id || loading || !user || autoStarted.current) return;
    const tpl = TEMPLATES.find((t) => t.id === id);
    if (tpl) { autoStarted.current = true; start(tpl); }
  }, [params, user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const setView = (v) => {
    const next = new URLSearchParams(params);
    next.delete('page'); next.delete('category');
    if (v === 'all') next.delete('view'); else next.set('view', v);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const needle = q.toLowerCase();
    const source = view === 'mine' ? saved : view === 'favorites' ? favoriteTemplates : TEMPLATES;
    return source.filter((t) => {
      const cat = occasionById(t.occasion).category;
      const haystack = `${t.name} ${t.style} ${t.mood} ${t.blurb} ${occasionById(t.occasion).label}`.toLowerCase();
      return (category === 'all' || cat === category) && (mood === 'all' || t.mood === mood)
        && (color === 'all' || t.colorFamily === color) && (style === 'all' || t.style === style)
        && (!needle || haystack.includes(needle));
    });
  }, [view, saved, favoriteTemplates, category, mood, color, style, q]);

  // Library-wide counts so people can see what each style / theme contains before choosing it.
  const counts = useMemo(() => {
    const tally = (key) => TEMPLATES.reduce((acc, t) => ({ ...acc, [t[key]]: (acc[t[key]] || 0) + 1 }), {});
    return { style: tally('style'), mood: tally('mood') };
  }, []);

  const activeChips = [
    view !== 'all' && { key: 'view', label: view === 'mine' ? 'My templates' : 'Favorites' },
    category !== 'all' && { key: 'category', label: LIBRARY_CATEGORIES.find((c) => c.id === category)?.label ?? category },
    style !== 'all' && { key: 'style', label: style },
    mood !== 'all' && { key: 'mood', label: mood },
    color !== 'all' && { key: 'color', label: COLOR_FAMILIES.find((c) => c.id === color)?.label ?? color, hex: COLOR_FAMILIES.find((c) => c.id === color)?.hex },
    q && { key: 'q', label: `“${q}”` },
  ].filter(Boolean);
  const hiddenFilterCount = [style, mood, color].filter((v) => v !== 'all').length;
  const filtered = activeChips.length > 0;

  const pageCount = Math.max(1, Math.ceil(list.length / perPage));
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), pageCount);
  const start0 = (page - 1) * perPage;
  const visible = list.slice(start0, start0 + perPage);

  const goToPage = (p) => {
    const next = new URLSearchParams(params);
    if (p <= 1) next.delete('page'); else next.set('page', String(p));
    setParams(next, { replace: true });
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const previewConfig = useMemo(() => (preview ? templateConfig(preview) : null), [preview]);
  const fieldProps = { style, mood, color, counts, setFilter };

  return (
    <div className="min-h-screen bg-canvas">
      <PublicNav />

      <header className="container-x pb-6 pt-8 sm:pt-12">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-accent"><Sparkles size={14} /> Template library</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-[1.05] sm:text-5xl">Find the design that feels like your day.</h1>
        <p className="mt-3 max-w-xl text-base text-ink-soft">{TEMPLATES.length} fully customisable templates. Change every word, colour, font and photo — and watch it update live.</p>
        <button className="btn-secondary mt-5" disabled={busyId === 'blank'} onClick={() => start(TEMPLATES.find((t) => t.blank))}><Plus size={16} /> {busyId === 'blank' ? 'Creating…' : 'Start from a blank canvas'}</button>
      </header>

      {/* Sticky toolbar */}
      <div className="sticky top-[72px] z-40 border-y border-line bg-canvas/90 backdrop-blur-md">
        <div className="container-x space-y-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 md:max-w-md">
              <label className="sr-only" htmlFor="f-q">Search</label>
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input id="f-q" type="search" className="input !pl-10" placeholder="Search by name, style or occasion" value={params.get('q') || ''} onChange={(e) => setFilter('q', e.target.value)} />
            </div>
            <button onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen} aria-controls="filters-panel"
              className={`btn-secondary !h-11 ${filtersOpen || hiddenFilterCount ? '!border-brand/40 !bg-brand-50 !text-brand' : ''}`}>
              <SlidersHorizontal size={16} /> Filters
              {hiddenFilterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">{hiddenFilterCount}</span>}
            </button>
          </div>

          <div className="scroll-none -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Occasion">
            {[{ id: 'all', label: 'All' }, ...(user ? [{ id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.size, view: true }, { id: 'mine', label: 'My templates', icon: Bookmark, count: saved.length, view: true }] : []), ...LIBRARY_CATEGORIES].map((c) => {
              const active = c.view ? view === c.id : (category === c.id && view === 'all');
              return (
                <button key={c.id} role="tab" aria-selected={active} onClick={() => (c.view ? setView(c.id) : (c.id === 'all' ? setParams(perPage === 12 ? {} : { perPage: String(perPage) }, { replace: true }) : setFilter('category', c.id)))}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${active ? 'bg-brand text-white shadow-sm' : 'bg-surface text-ink-soft ring-1 ring-inset ring-line-strong hover:bg-ink/[.03] hover:text-ink'}`}>
                  {c.icon && <c.icon size={14} />}{c.label}{c.view && <span className={`rounded-full px-1.5 text-[11px] ${active ? 'bg-white/20' : 'bg-ink/[.06] text-ink-mute'}`}>{c.count}</span>}
                </button>
              );
            })}
          </div>

          {/* Desktop: inline panel. Phones use the bottom sheet below. */}
          <AnimatePresence initial={false}>
            {filtersOpen && isDesktop && (
              <motion.div id="filters-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="rounded-2xl border border-line bg-surface p-5"><FilterFields {...fieldProps} /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <main className="container-x pt-5">
        <div ref={gridTop} className="flex scroll-mt-40 flex-wrap items-center justify-between gap-x-4 gap-y-2.5 text-sm text-ink-soft">
          <div className="flex flex-wrap items-center gap-2">
            <span aria-live="polite" className="mr-1">
              {list.length === 0 ? '0 templates' : <>Showing <b className="text-ink">{start0 + 1}–{start0 + visible.length}</b> of <b className="text-ink">{list.length}</b></>}
            </span>
            {activeChips.map((c) => (
              <span key={c.key} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-1.5 text-xs font-semibold text-brand">
                {c.hex && <i className="h-2.5 w-2.5 rounded-full ring-1 ring-ink/10" style={{ background: c.hex }} />}{c.label}
                <button onClick={() => setFilter(c.key, 'all')} aria-label={`Remove filter ${c.label}`} className="grid h-5 w-5 place-items-center rounded-full hover:bg-brand/15"><X size={12} strokeWidth={2.5} /></button>
              </span>
            ))}
            {filtered && <button className="text-xs font-semibold text-ink-soft underline-offset-2 hover:text-ink hover:underline" onClick={clearAll}>Clear filters</button>}
          </div>
          <label className="flex items-center gap-2">
            <span className="text-xs font-medium text-ink-mute">Per page</span>
            <select className="input !h-9 !w-auto !py-0 !text-[13px]" value={perPage} onChange={(e) => setFilter('perPage', e.target.value === '12' ? 'all' : e.target.value)} aria-label="Templates per page">
              {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>

        {list.length === 0 ? (
          <div className="mt-6">
            {view === 'mine' && !q && hiddenFilterCount === 0 ? (
              <EmptyState icon={Bookmark} title="No saved templates yet" text="Open any invitation in the editor, restyle it, then choose “Save current design as template” in the Settings panel. It will live here, ready for your next event."
                action={<Link to="/dashboard" className="btn-primary">Go to my invitations</Link>} />
            ) : view === 'favorites' && !q && hiddenFilterCount === 0 ? (
              <EmptyState icon={Heart} title="No favorites yet" text="Tap the heart on any template to keep it here for later."
                action={<button className="btn-primary" onClick={() => setView('all')}>Browse templates</button>} />
            ) : (
              <EmptyState icon={SearchX} title="No templates match" text="Try removing a filter to see more designs." action={<button className="btn-secondary" onClick={clearAll}>Clear filters</button>} />
            )}
          </div>
        ) : (
          <motion.div layout className="mt-5 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((t) => (
                <motion.article key={t.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}
                  className="group card card-hover overflow-hidden p-2.5">
                  <div className="relative overflow-hidden rounded-xl">
                    {t.blank ? (
                      <div className="grid place-items-center rounded-xl border-2 border-dashed border-line-strong bg-canvas text-center" style={{ aspectRatio: '390 / 640' }}>
                        <div className="px-6">
                          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand"><Plus size={22} strokeWidth={2} /></span>
                          <p className="mt-3 font-display text-sm font-bold">Start from scratch</p>
                          <p className="mt-1 text-xs leading-relaxed text-ink-mute">A plain white page with no sample text. You add everything.</p>
                        </div>
                      </div>
                    ) : <TemplateThumb template={t} rounded="rounded-xl" />}
                    <div className="absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-ink/50 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 md:flex">
                      <button className="btn-secondary btn-sm" onClick={() => setPreview(t)} aria-label={`Quick preview of ${t.name}`}><Eye size={14} /> Quick preview</button>
                    </div>
                    <FavoriteButton id={t.id} name={t.name} className="absolute right-2 top-2" />
                    {isAnimated(t) && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-[11px] font-semibold text-accent-dark shadow-sm backdrop-blur"><Sparkles size={11} /> Animated</span>}
                  </div>
                  <div className="px-1.5 pb-1 pt-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-[15px] font-bold leading-snug">{t.name}</h3>
                      <span className="mt-1 flex shrink-0 -space-x-1.5" aria-hidden="true">
                        {[t.theme.coverFrom, t.theme.accentColor, t.theme.bgColor].map((c, i) => <i key={i} className="h-3.5 w-3.5 rounded-full ring-2 ring-surface" style={{ background: c }} />)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-mute">{occasionById(t.occasion).label} · {t.custom ? 'Saved by you' : t.style}</p>
                    {t.custom && (
                      <div className="mt-2 flex gap-1.5">
                        <button className="btn-ghost btn-sm !h-8 flex-1" onClick={() => { setRenaming(t); setRenameValue(t.name); }}><Pencil size={13} /> Rename</button>
                        <button className="btn-ghost btn-sm !h-8 flex-1 !text-red-600 hover:!bg-red-50" onClick={() => setDeleting(t)}><Trash2 size={13} /> Delete</button>
                      </div>
                    )}
                    <div className="mt-3.5 grid grid-cols-[auto_1fr] gap-2">
                      <button className="btn-secondary btn-sm !h-9" onClick={() => setPreview(t)}><Eye size={14} /> Preview</button>
                      <button className="btn-primary btn-sm !h-9" disabled={busyId === t.id} onClick={() => start(t)}>{busyId === t.id ? 'Creating…' : 'Use this template'}</button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <Pagination page={page} pageCount={pageCount} onChange={goToPage} className="mt-10" />
      </main>
      <Footer />

      {/* Phone filters: bottom sheet */}
      <Modal open={filtersOpen && !isDesktop} onClose={() => setFiltersOpen(false)} title="Filters" size="sm"
        footer={<>
          <button className="btn-ghost" onClick={clearAll}>Clear all</button>
          <button className="btn-primary" onClick={() => setFiltersOpen(false)}>Show {list.length} template{list.length === 1 ? '' : 's'}</button>
        </>}>
        <FilterFields {...fieldProps} />
      </Modal>

      <Modal
        open={Boolean(preview)} onClose={() => setPreview(null)} size="lg" title={preview ? `${preview.name} · ${preview.custom ? 'Saved by you' : preview.style}` : ''}
        footer={preview && <>
          <button className="btn-secondary" onClick={() => setPreview(null)}>Close</button>
          <button className="btn-primary" onClick={() => start(preview)} disabled={busyId === preview.id}>Use this template</button>
        </>}
      >
        {preview && (
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start">
            <div className="h-[640px] max-h-[70vh] w-full md:w-[390px]">
              <PreviewFrame device="mobile">{(h) => <InvitationRenderer config={previewConfig} mode="editor" viewportHeight={h} />}</PreviewFrame>
            </div>
            <div>
              <p className="text-ink-soft">{preview.blurb}</p>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                {[['Occasion', occasionById(preview.occasion).label], ['Style', preview.style], ['Theme', preview.mood], ['Layout', preview.theme.layout]].map(([k, v]) => (
                  <div key={k}><dt className="text-xs font-semibold text-ink-mute">{k}</dt><dd className="mt-0.5 font-semibold capitalize">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-6 text-sm text-ink-mute">Sample content shown. You can replace every word, colour, font and photo after you pick it.</p>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={Boolean(renaming)} onClose={() => setRenaming(null)} title="Rename template" size="sm"
        footer={<>
          <button className="btn-secondary" onClick={() => setRenaming(null)}>Cancel</button>
          <button className="btn-primary" disabled={!renameValue.trim()} form="rename-form" type="submit">Save</button>
        </>}>
        <form id="rename-form" onSubmit={async (e) => {
          e.preventDefault();
          try { await renameTemplate(renaming.id, renameValue.trim().slice(0, 40)); setRenaming(null); toast.success('Renamed'); } catch (err) { toast.error(err.message); }
        }}>
          <label className="label" htmlFor="rename-tpl">Template name</label>
          <input id="rename-tpl" className="input" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} maxLength={40} autoFocus />
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} danger confirmLabel="Delete template" title="Delete this template?"
        text={deleting ? `“${deleting.name}” will be removed from My templates and your favorites. Invitations you already made with it are not affected.` : ''}
        onConfirm={async () => {
          try { await deleteTemplate(deleting.id); toast.success('Template deleted'); } catch (err) { toast.error(err.message); }
          setDeleting(null);
        }} />
    </div>
  );
}
