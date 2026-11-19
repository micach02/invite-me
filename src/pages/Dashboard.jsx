import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, CheckCheck, ChevronRight, Eye, FileText, Globe, LayoutGrid, List, MailPlus, Plus, Search, SearchX, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useInvitations } from '../hooks/useInvitations';
import InvitationCard from '../components/dashboard/InvitationCard';
import ShareModal from '../components/editor/ShareModal';
import { ConfirmDialog, DashboardSkeleton, EmptyState } from '../components/ui/misc';
import { OCCASIONS } from '../data/constants';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const SORTS = {
  updated: ['Recently edited', (a, b) => (b.updatedAt > a.updatedAt ? 1 : -1)],
  event: ['Event date', (a, b) => ((a.eventDate || '9') > (b.eventDate || '9') ? 1 : -1)],
  views: ['Most views', (a, b) => (b.viewCount || 0) - (a.viewCount || 0)],
  rsvps: ['Most RSVPs', (a, b) => (b.rsvpCount || 0) - (a.rsvpCount || 0)],
  title: ['Title A–Z', (a, b) => a.title.localeCompare(b.title)],
};

const store = {
  get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
};

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="card flex items-center gap-3.5 p-4">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}><Icon size={18} strokeWidth={1.9} /></span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-extrabold leading-none">{value.toLocaleString()}</p>
        <p className="mt-1 truncate text-xs font-medium text-ink-soft">{label}</p>
      </div>
    </div>
  );
}

/** First-run guidance: three concrete steps with real progress, dismissible. */
function GetStarted({ stats, onDismiss }) {
  const steps = [
    { done: stats.total > 0, title: 'Create an invitation', text: 'Pick a template and make it yours.', to: '/templates?start=1', cta: 'Browse templates' },
    { done: stats.published > 0, title: 'Publish it', text: 'Get a link and QR code you can share.', cta: null },
    { done: stats.responses > 0, title: 'Collect your first RSVP', text: 'Share the link — replies appear here.', cta: null },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) return null;
  const next = steps.findIndex((s) => !s.done);

  return (
    <section className="card relative overflow-hidden p-5 sm:p-6" aria-label="Getting started">
      <button onClick={onDismiss} className="btn-ghost btn-icon absolute right-3 top-3" aria-label="Dismiss getting started"><X size={16} /></button>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <h2 className="font-display text-base font-bold">Get started</h2>
        <span className="text-xs font-medium text-ink-mute">{doneCount} of {steps.length} done</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[.06]" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={doneCount}>
        <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
      </div>
      <ol className="mt-4 grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className={`flex items-start gap-3 rounded-xl border p-3.5 transition ${s.done ? 'border-emerald-200 bg-emerald-50/60' : i === next ? 'border-brand/30 bg-brand-50/60' : 'border-line bg-white'}`}>
            <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${s.done ? 'bg-emerald-500 text-white' : i === next ? 'bg-brand text-white' : 'bg-black/[.06] text-ink-mute'}`}>
              {s.done ? <Check size={14} strokeWidth={3} /> : i + 1}
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${s.done ? 'text-ink-soft line-through decoration-emerald-400' : ''}`}>{s.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{s.text}</p>
              {i === next && s.cta && <Link to={s.to} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">{s.cta} <ChevronRight size={13} /></Link>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, loading, stats, remove, duplicate } = useInvitations();
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('updated');
  const [occasion, setOccasion] = useState('all');
  const [layout, setLayout] = useState(() => store.get('inviteme:layout', 'grid'));
  const [hideGuide, setHideGuide] = useState(() => store.get('inviteme:hide-guide', '') === '1');
  const [shareFor, setShareFor] = useState(null);
  const [deleteFor, setDeleteFor] = useState(null);

  useDocumentMeta({ title: 'Invitations — InviteMe', description: 'Manage your invitations', noindex: true });
  useEffect(() => store.set('inviteme:layout', layout), [layout]);

  const counts = useMemo(() => ({ all: items.length, draft: items.filter((i) => i.status === 'draft').length, published: stats.published }), [items, stats.published]);

  const visible = useMemo(() => items
    .filter((i) => (tab === 'all' || i.status === tab) && (occasion === 'all' || i.occasion === occasion)
      && (!query.trim() || `${i.title} ${i.config?.event?.names ?? ''}`.toLowerCase().includes(query.toLowerCase())))
    .sort(SORTS[sort][1]), [items, tab, occasion, query, sort]);

  const first = (user?.fullName || '').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const filtersActive = query || occasion !== 'all' || tab !== 'all';

  const confirmDelete = async () => {
    try { await remove(deleteFor.id); } catch (e) { toast.error(e.message); }
    setDeleteFor(null);
  };
  const doDuplicate = async (inv) => {
    try { const c = await duplicate(inv.id); navigate(`/editor/${c.id}`); } catch (e) { toast.error(e.message); }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-7 animate-fade-in">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{greeting}{first ? `, ${first}` : ''}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {items.length === 0 ? 'Let’s create your first invitation.' : `You have ${items.length} invitation${items.length === 1 ? '' : 's'}${stats.responses ? ` and ${stats.responses} RSVP${stats.responses === 1 ? '' : 's'}` : ''}.`}
          </p>
        </div>
        <Link to="/templates?start=1" className="btn-primary hidden sm:inline-flex"><Plus size={16} strokeWidth={2.5} /> New invitation</Link>
      </header>

      {!hideGuide && <GetStarted stats={stats} onDismiss={() => { setHideGuide(true); store.set('inviteme:hide-guide', '1'); }} />}

      {items.length > 0 && (
        <section aria-label="Overview" className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon={Globe} label="Published" value={stats.published} tone="bg-emerald-50 text-emerald-700" />
          <Stat icon={Eye} label="Views" value={stats.views} tone="bg-sky-50 text-sky-700" />
          <Stat icon={MailPlus} label="RSVPs" value={stats.responses} tone="bg-amber-50 text-amber-700" />
          <Stat icon={CheckCheck} label="Guests going" value={stats.confirmed} tone="bg-rose-50 text-rose-700" />
        </section>
      )}

      {items.length === 0 ? (
        <EmptyState icon={FileText} title="No invitations yet" text="Pick a template, make it yours, and share it in minutes."
          action={<Link to="/templates?start=1" className="btn-primary btn-lg"><Plus size={18} /> Choose a template</Link>} />
      ) : (
        <section aria-label="Your invitations" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl bg-black/[.045] p-1" role="tablist" aria-label="Status">
              {[['all', 'All'], ['draft', 'Drafts'], ['published', 'Published']].map(([k, label]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                  className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${tab === k ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink'}`}>
                  {label} <span className={`ml-0.5 text-xs ${tab === k ? 'text-brand' : 'text-ink-mute'}`}>{counts[k]}</span>
                </button>
              ))}
            </div>

            <div className="relative min-w-[11rem] flex-1 sm:max-w-xs">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input type="search" className="input !h-10 !pl-9" placeholder="Search invitations" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search invitations" />
            </div>

            <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
              <select className="input !h-10 min-w-0 flex-1 sm:!w-auto sm:flex-none" value={occasion} onChange={(e) => setOccasion(e.target.value)} aria-label="Filter by occasion">
                <option value="all">All occasions</option>
                {OCCASIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <select className="input !h-10 min-w-0 flex-1 sm:!w-auto sm:flex-none" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
                {Object.entries(SORTS).map(([k, [label]]) => <option key={k} value={k}>{label}</option>)}
              </select>
              <div className="hidden rounded-xl bg-black/[.045] p-1 sm:flex" role="group" aria-label="Layout">
                {[['grid', LayoutGrid, 'Grid view'], ['list', List, 'List view']].map(([k, Icon, label]) => (
                  <button key={k} onClick={() => setLayout(k)} aria-pressed={layout === k} aria-label={label}
                    className={`grid h-8 w-8 place-items-center rounded-lg transition ${layout === k ? 'bg-white text-ink shadow-sm' : 'text-ink-mute hover:text-ink'}`}><Icon size={16} /></button>
                ))}
              </div>
            </div>
          </div>

          {visible.length === 0 ? (
            <EmptyState icon={SearchX} title="Nothing matches" text="Try a different search, status or occasion."
              action={filtersActive && <button className="btn-secondary" onClick={() => { setQuery(''); setOccasion('all'); setTab('all'); }}>Clear filters</button>} />
          ) : layout === 'list' ? (
            <div className="space-y-2.5">{visible.map((i) => <InvitationCard key={i.id} inv={i} layout="list" onShare={setShareFor} onDuplicate={doDuplicate} onDelete={setDeleteFor} />)}</div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visible.map((i) => <InvitationCard key={i.id} inv={i} onShare={setShareFor} onDuplicate={doDuplicate} onDelete={setDeleteFor} />)}</div>
          )}
        </section>
      )}

      <ShareModal open={Boolean(shareFor)} onClose={() => setShareFor(null)} invitation={shareFor && items.find((i) => i.id === shareFor.id)}
        onPublish={() => { const id = shareFor.id; setShareFor(null); navigate(`/editor/${id}?publish=1`); }} />
      <ConfirmDialog open={Boolean(deleteFor)} onClose={() => setDeleteFor(null)} onConfirm={confirmDelete} danger confirmLabel="Delete invitation"
        title="Delete this invitation?"
        text={deleteFor ? `“${deleteFor.title}” and all of its RSVPs will be permanently removed${deleteFor.status === 'published' ? ', and its public link will stop working' : ''}. This can’t be undone.` : ''} />
    </div>
  );
}
