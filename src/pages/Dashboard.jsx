import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, CheckCheck, Eye, FileText, Globe, MailPlus, Palette, Plus, Search, UserRound, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useInvitations } from '../hooks/useInvitations';
import InvitationCard from '../components/dashboard/InvitationCard';
import ShareModal from '../components/editor/ShareModal';
import { ConfirmDialog, EmptyState, PageLoader } from '../components/ui/misc';
import { OCCASIONS } from '../data/constants';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const SORTS = {
  updated: ['Recently updated', (a, b) => (b.updatedAt > a.updatedAt ? 1 : -1)],
  event: ['Event date (soonest)', (a, b) => (a.eventDate || '9') > (b.eventDate || '9') ? 1 : -1],
  views: ['Most views', (a, b) => (b.viewCount || 0) - (a.viewCount || 0)],
  rsvps: ['Most RSVPs', (a, b) => (b.rsvpCount || 0) - (a.rsvpCount || 0)],
  title: ['Title A–Z', (a, b) => a.title.localeCompare(b.title)],
};

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="card p-5">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon size={19} strokeWidth={1.7} /></span>
      <p className="mt-4 font-serif text-4xl font-semibold leading-none">{value.toLocaleString()}</p>
      <p className="mt-1.5 text-sm text-ink-soft">{label}</p>
    </div>
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
  const [shareFor, setShareFor] = useState(null);
  const [deleteFor, setDeleteFor] = useState(null);

  useDocumentMeta({ title: 'Dashboard — InviteMe', description: 'Manage your invitations', noindex: true });

  const counts = useMemo(() => ({
    all: items.length, draft: items.filter((i) => i.status === 'draft').length, published: stats.published,
  }), [items, stats.published]);

  const visible = useMemo(() => items
    .filter((i) => (tab === 'all' || i.status === tab) && (occasion === 'all' || i.occasion === occasion)
      && (!query.trim() || `${i.title} ${i.config?.event?.names ?? ''}`.toLowerCase().includes(query.toLowerCase())))
    .sort(SORTS[sort][1]), [items, tab, occasion, query, sort]);

  const topPerformers = useMemo(() => [...items].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5), [items]);
  const maxViews = Math.max(1, ...topPerformers.map((i) => i.viewCount || 0));
  const recent = items.slice(0, 3);
  const first = (user?.fullName || '').split(' ')[0];

  const confirmDelete = async () => {
    try { await remove(deleteFor.id); } catch (e) { toast.error(e.message); }
    setDeleteFor(null);
  };
  const doDuplicate = async (inv) => {
    try { const c = await duplicate(inv.id); navigate(`/editor/${c.id}`); } catch (e) { toast.error(e.message); }
  };

  if (loading) return <PageLoader label="Loading your invitations…" />;

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-accent">Dashboard</p>
          <h1 className="mt-1 font-serif text-4xl font-semibold sm:text-5xl">{first ? `Hello, ${first}.` : 'Hello.'}</h1>
          <p className="mt-1 text-ink-soft">Here is how your invitations are doing.</p>
        </div>
        <Link to="/templates?start=1" className="btn-primary"><Plus size={16} /> New invitation</Link>
      </header>

      <section aria-label="Overview" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <Stat icon={FileText} label="Invitations created" value={stats.total} tone="bg-brand-50 text-brand" />
        <Stat icon={Globe} label="Published" value={stats.published} tone="bg-emerald-50 text-emerald-700" />
        <Stat icon={Eye} label="Total views" value={stats.views} tone="bg-sky-50 text-sky-700" />
        <Stat icon={MailPlus} label="RSVP responses" value={stats.responses} tone="bg-amber-50 text-amber-700" />
        <Stat icon={CheckCheck} label="Confirmed guests" value={stats.confirmed} tone="bg-rose-50 text-rose-700" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-6" aria-label="Invitation performance">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Invitation performance</h2>
            <Link to="/dashboard/analytics" className="text-sm font-medium text-brand hover:underline">All analytics →</Link>
          </div>
          {topPerformers.length === 0 || stats.views + stats.responses === 0 ? (
            <p className="mt-6 rounded-xl bg-canvas p-6 text-center text-sm text-ink-soft">Publish an invitation and share it — views and RSVPs will appear here.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {topPerformers.map((i) => (
                <li key={i.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <Link to={`/dashboard/invitations/${i.id}/analytics`} className="truncate font-medium hover:text-brand">{i.title}</Link>
                    <span className="shrink-0 text-xs text-ink-mute">{i.viewCount || 0} views · {i.rsvpCount || 0} RSVPs</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-sand-light" role="img" aria-label={`${i.viewCount || 0} views`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-700" style={{ width: `${Math.max(3, ((i.viewCount || 0) / maxViews) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6" aria-label="Quick actions">
          <h2 className="font-serif text-2xl font-semibold">Quick actions</h2>
          <div className="mt-4 grid gap-2.5">
            {[
              [Plus, 'Create a new invitation', '/templates?start=1'],
              [Palette, 'Browse templates', '/templates'],
              [BarChart3, 'RSVPs & analytics', '/dashboard/analytics'],
              [UserRound, 'Edit your profile', '/dashboard/profile'],
            ].map(([Icon, label, to]) => (
              <Link key={label} to={to} className="flex items-center gap-3 rounded-xl border border-sand px-4 py-3 text-sm font-medium transition hover:border-brand hover:bg-brand-50">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-sand-light text-brand"><Icon size={16} /></span>{label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={MailPlus} title="Create your first invitation" text="Pick a template, make it yours, and share it in minutes."
          action={<Link to="/templates?start=1" className="btn-primary"><Plus size={16} /> Choose a template</Link>} />
      ) : (
        <>
          {tab === 'all' && !query && occasion === 'all' && items.length > 3 && (
            <section aria-label="Recent invitations">
              <h2 className="font-serif text-2xl font-semibold">Recent invitations</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {recent.map((i) => <InvitationCard key={i.id} inv={i} onShare={setShareFor} onDuplicate={doDuplicate} onDelete={setDeleteFor} />)}
              </div>
            </section>
          )}

          <section aria-label="All invitations">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex rounded-full bg-sand-light p-1" role="tablist">
                {[['all', 'All'], ['draft', 'Drafts'], ['published', 'Published']].map(([k, label]) => (
                  <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${tab === k ? 'bg-white text-brand shadow-sm' : 'text-ink-soft'}`}>
                    {label} <span className="ml-1 text-xs opacity-60">{counts[k]}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
                  <input className="input !w-52 !pl-9" placeholder="Search invitations" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search invitations" />
                </div>
                <select className="input !w-auto" value={occasion} onChange={(e) => setOccasion(e.target.value)} aria-label="Filter by occasion">
                  <option value="all">All occasions</option>
                  {OCCASIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
                <select className="input !w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
                  {Object.entries(SORTS).map(([k, [label]]) => <option key={k} value={k}>{label}</option>)}
                </select>
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="mt-5"><EmptyState icon={Users} title="Nothing matches" text="Try a different search, status or occasion." /></div>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((i) => <InvitationCard key={i.id} inv={i} onShare={setShareFor} onDuplicate={doDuplicate} onDelete={setDeleteFor} />)}
              </div>
            )}
          </section>
        </>
      )}

      <ShareModal open={Boolean(shareFor)} onClose={() => setShareFor(null)} invitation={shareFor && items.find((i) => i.id === shareFor.id)}
        onPublish={() => { const id = shareFor.id; setShareFor(null); navigate(`/editor/${id}?publish=1`); }} />
      <ConfirmDialog open={Boolean(deleteFor)} onClose={() => setDeleteFor(null)} onConfirm={confirmDelete} danger confirmLabel="Delete"
        title="Delete this invitation?" text={deleteFor ? `“${deleteFor.title}” and all of its RSVPs will be permanently removed. This cannot be undone.` : ''} />
    </div>
  );
}
