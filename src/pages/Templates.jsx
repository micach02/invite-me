import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Search, SearchX, Sparkles } from 'lucide-react';
import PublicNav from '../components/layout/PublicNav';
import Footer from '../components/layout/Footer';
import TemplateThumb from '../components/invitation/TemplateThumb';
import PreviewFrame from '../components/invitation/PreviewFrame';
import InvitationRenderer from '../components/invitation/InvitationRenderer';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/misc';
import { TEMPLATES } from '../data/templates';
import { COLOR_FAMILIES, DESIGN_STYLES, LIBRARY_CATEGORIES, MOODS, occasionById } from '../data/constants';
import { createDefaultConfig } from '../data/defaultConfig';
import { useStartInvitation } from '../hooks/useStartInvitation';
import { useAuth } from '../context/AuthContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const PER_PAGE_OPTIONS = [12, 24, 48];

const pill = (active) =>
  `rounded-full px-4 py-2 text-sm font-medium transition whitespace-nowrap ${active ? 'bg-brand text-white shadow-sm' : 'bg-white text-ink-soft border border-sand hover:bg-sand-light'}`;

export default function Templates() {
  const [params, setParams] = useSearchParams();
  const { user, loading } = useAuth();
  const { start, busyId } = useStartInvitation();
  const [preview, setPreview] = useState(null);
  const autoStarted = useRef(false);
  const gridTop = useRef(null);

  useDocumentMeta({ title: 'Invitation Templates — InviteMe', description: 'Browse elegant invitation templates for weddings, birthdays, baptisms, debuts and more.' });

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
    next.delete('page');
    setParams(next, { replace: true });
  };

  // After sign-up redirect (?use=template-id) create the invitation straight away.
  useEffect(() => {
    const id = params.get('use');
    if (!id || loading || !user || autoStarted.current) return;
    const tpl = TEMPLATES.find((t) => t.id === id);
    if (tpl) { autoStarted.current = true; start(tpl); }
  }, [params, user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => {
    const needle = q.toLowerCase();
    return TEMPLATES.filter((t) => {
      const cat = occasionById(t.occasion).category;
      const haystack = `${t.name} ${t.style} ${t.mood} ${t.blurb} ${occasionById(t.occasion).label}`.toLowerCase();
      return (category === 'all' || cat === category) && (mood === 'all' || t.mood === mood)
        && (color === 'all' || t.colorFamily === color) && (style === 'all' || t.style === style)
        && (!needle || haystack.includes(needle));
    });
  }, [category, mood, color, style, q]);

  // Library-wide counts so people can see what each style / theme contains before choosing it.
  const counts = useMemo(() => {
    const tally = (key) => TEMPLATES.reduce((acc, t) => ({ ...acc, [t[key]]: (acc[t[key]] || 0) + 1 }), {});
    return { style: tally('style'), mood: tally('mood') };
  }, []);

  const filtered = [category, mood, color, style].some((v) => v !== 'all') || Boolean(q);

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
  const previewConfig = useMemo(() => (preview ? createDefaultConfig(preview.occasion, preview.id) : null), [preview]);

  return (
    <div className="min-h-screen bg-canvas">
      <PublicNav />
      <main className="container-x pt-8 sm:pt-14">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.25em] text-accent"><Sparkles size={14} /> Template library</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.05] sm:text-6xl">Find the design that feels like your day.</h1>
          <p className="mt-4 text-lg text-ink-soft">Every template is fully customisable — change the words, colours, fonts and photos and watch it update instantly.</p>
        </div>

        {/* Category pills */}
        <div className="scroll-thin -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Occasion">
          <button className={pill(category === 'all')} onClick={() => setFilter('category', 'all')} role="tab" aria-selected={category === 'all'}>All</button>
          {LIBRARY_CATEGORIES.map((c) => (
            <button key={c.id} className={`${pill(category === c.id)} inline-flex items-center gap-2`} onClick={() => setFilter('category', c.id)} role="tab" aria-selected={category === c.id}>
              <c.icon size={15} /> {c.label}
            </button>
          ))}
        </div>

        {/* Secondary filters */}
        <div className="mt-4 grid gap-3 rounded-2xl border border-black/5 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end">
          <div>
            <label className="label" htmlFor="f-q">Search</label>
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input id="f-q" type="search" className="input !pl-9" placeholder="Name, style, occasion…" value={params.get('q') || ''} onChange={(e) => setFilter('q', e.target.value)} />
            </div>
          </div>
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
            <span className="label">Color</span>
            <div className="flex items-center gap-2 py-1">
              <button onClick={() => setFilter('color', 'all')} className={`h-7 rounded-full px-3 text-xs font-medium ${color === 'all' ? 'bg-ink text-white' : 'bg-sand-light text-ink-soft'}`}>Any</button>
              {COLOR_FAMILIES.map((c) => (
                <button key={c.id} title={c.label} aria-label={c.label} aria-pressed={color === c.id} onClick={() => setFilter('color', color === c.id ? 'all' : c.id)}
                  className={`h-7 w-7 rounded-full border-2 transition ${color === c.id ? 'scale-110 border-ink' : 'border-white ring-1 ring-black/10'}`} style={{ background: c.hex }} />
              ))}
            </div>
          </div>
        </div>

        <div ref={gridTop} className="mt-6 flex scroll-mt-24 flex-wrap items-center justify-between gap-3 text-sm text-ink-soft">
          <span aria-live="polite">
            {list.length === 0 ? '0 templates' : <>Showing <b className="text-ink">{start0 + 1}–{start0 + visible.length}</b> of <b className="text-ink">{list.length}</b> templates</>}
          </span>
          <div className="flex items-center gap-4">
            {filtered && <button className="font-medium text-brand hover:underline" onClick={() => setParams(perPage === 12 ? {} : { perPage: String(perPage) }, { replace: true })}>Clear filters</button>}
            <label className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wide text-ink-mute">Per page</span>
              <select className="input !w-auto !py-1.5" value={perPage} onChange={(e) => setFilter('perPage', e.target.value === '12' ? 'all' : e.target.value)} aria-label="Templates per page">
                {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-6"><EmptyState icon={SearchX} title="No templates match" text="Try removing a filter to see more designs." action={<button className="btn-secondary" onClick={() => setParams({}, { replace: true })}>Clear filters</button>} /></div>
        ) : (
          <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((t) => (
                <motion.article key={t.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}
                  className="group card overflow-hidden p-3 transition-shadow hover:shadow-lift">
                  <div className="relative">
                    <TemplateThumb templateId={t.id} rounded="rounded-xl" />
                    <div className="absolute inset-0 flex items-end justify-center rounded-xl bg-gradient-to-t from-ink/55 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                      <button className="btn-secondary btn-sm" onClick={() => setPreview(t)}><Eye size={14} /> Quick preview</button>
                    </div>
                  </div>
                  <div className="px-1.5 pb-1.5 pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-2xl font-semibold leading-tight">{t.name}</h3>
                      <span className="mt-1.5 flex shrink-0 -space-x-1.5" aria-hidden="true">
                        {[t.theme.coverFrom, t.theme.accentColor, t.theme.bgColor].map((c, i) => <i key={i} className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: c }} />)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="chip bg-brand-50 text-brand">{occasionById(t.occasion).label}</span>
                      <span className="chip bg-sand-light text-ink-soft">{t.style}</span>
                      {(t.theme.coverEffect !== 'none' || ['hearts', 'snow', 'bubbles', 'balloons', 'petals', 'autumn', 'lanterns', 'fireflies', 'fireworks', 'memphis'].includes(t.theme.decor) || ['neon', 'poster', 'ticket', 'polaroid', 'vintage', 'magazine', 'medallion'].includes(t.theme.layout)) && (
                        <span className="chip bg-accent/15 text-accent-dark">✦ Animated</span>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button className="btn-secondary btn-sm" onClick={() => setPreview(t)}><Eye size={14} /> Preview</button>
                      <button className="btn-primary btn-sm" disabled={busyId === t.id} onClick={() => start(t)}>{busyId === t.id ? 'Creating…' : 'Use this template'}</button>
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

      <Modal
        open={Boolean(preview)} onClose={() => setPreview(null)} size="lg" title={preview ? `${preview.name} · ${preview.style}` : ''}
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
                  <div key={k}><dt className="label">{k}</dt><dd className="font-medium capitalize">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-6 text-sm text-ink-mute">Sample content shown. You can replace every word, colour, font and photo after you pick it.</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
