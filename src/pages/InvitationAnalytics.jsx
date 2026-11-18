import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, Eye, Mail, Pencil, Phone, Plus, Search, Share2, Trash2, UserPlus, Users } from 'lucide-react';
import { invitations, rsvps as rsvpApi } from '../services';
import { useAuth } from '../context/AuthContext';
import { BarChart, SplitBar } from '../components/dashboard/charts';
import ShareModal from '../components/editor/ShareModal';
import Modal from '../components/ui/Modal';
import { ConfirmDialog, EmptyState, PageLoader, StatusBadge } from '../components/ui/misc';
import { ATTENDING_LABEL } from '../data/constants';
import { downloadFile, formatDate, toCsv } from '../lib/utils';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const TONE = { yes: 'bg-emerald-50 text-emerald-700', maybe: 'bg-amber-50 text-amber-700', no: 'bg-rose-50 text-rose-700' };

export default function InvitationAnalytics() {
  const { id } = useParams();
  const { user } = useAuth();
  const [inv, setInv] = useState(undefined);
  const [guests, setGuests] = useState([]);
  const [series, setSeries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [removeFor, setRemoveFor] = useState(null);

  const load = useCallback(async () => {
    try {
      const i = await invitations.get(id);
      if (!i || i.userId !== user.id) { setInv(null); return; }
      const [list, views] = await Promise.all([rsvpApi.list(id), invitations.viewsSeries(id, 14)]);
      setInv(i); setGuests(list); setSeries(views);
    } catch (e) { toast.error(e.message); setInv(null); }
  }, [id, user.id]);

  useEffect(() => { load(); }, [load]);
  useDocumentMeta({ title: `${inv?.title ?? 'Analytics'} — InviteMe`, description: 'Invitation analytics', noindex: true });

  const stats = useMemo(() => {
    const yes = guests.filter((g) => g.attending === 'yes');
    return {
      yes: yes.length, maybe: guests.filter((g) => g.attending === 'maybe').length, no: guests.filter((g) => g.attending === 'no').length,
      confirmed: yes.reduce((n, g) => n + (Number(g.guestCount) || 0), 0),
    };
  }, [guests]);

  const shown = useMemo(() => guests.filter((g) => (filter === 'all' || g.attending === filter)
    && (!query.trim() || `${g.guestName} ${g.email ?? ''} ${g.phone ?? ''}`.toLowerCase().includes(query.toLowerCase()))), [guests, filter, query]);

  const setAttending = async (g, attending) => {
    const patch = { attending, guestCount: attending === 'no' ? 0 : Math.max(1, g.guestCount || 1) };
    setGuests((l) => l.map((x) => (x.id === g.id ? { ...x, ...patch } : x)));
    try { await rsvpApi.update(g.id, patch); } catch (e) { toast.error(e.message); load(); }
  };
  const confirmRemove = async () => {
    try { await rsvpApi.remove(removeFor.id); setGuests((l) => l.filter((x) => x.id !== removeFor.id)); toast.success('Guest removed'); }
    catch (e) { toast.error(e.message); }
    setRemoveFor(null);
  };
  const exportCsv = () => {
    const rows = [['Name', 'Email', 'Phone', 'Attendance', 'Guests', 'Meal', 'Message', 'Responded']]
      .concat(guests.map((g) => [g.guestName, g.email, g.phone, ATTENDING_LABEL[g.attending], g.guestCount, g.mealPreference, g.message, dayjs(g.createdAt).format('YYYY-MM-DD HH:mm')]));
    downloadFile(`${inv.slug || 'guests'}-rsvps.csv`, toCsv(rows));
  };

  if (inv === undefined) return <PageLoader />;
  if (inv === null) return <EmptyState title="Invitation not found" action={<Link to="/dashboard/analytics" className="btn-primary">Back</Link>} />;

  const totalViews = inv.viewCount || 0;
  const conversion = totalViews ? Math.round((guests.length / totalViews) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link to="/dashboard/analytics" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"><ArrowLeft size={14} /> All invitations</Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3"><h1 className="font-serif text-4xl font-semibold">{inv.title}</h1><StatusBadge status={inv.status} /></div>
            <p className="mt-1 text-sm text-ink-soft">{inv.eventDate ? formatDate(inv.eventDate, 'dddd, MMMM D, YYYY') : 'No date set'}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/editor/${inv.id}`} className="btn-secondary btn-sm"><Pencil size={13} /> Edit</Link>
            <button className="btn-primary btn-sm" onClick={() => setShareOpen(true)}><Share2 size={13} /> Share</button>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-label="Summary">
        {[['Views', totalViews, 'text-sky-700'], ['Responses', guests.length, 'text-brand'], ['Confirmed guests', stats.confirmed, 'text-emerald-700'], ['Response rate', `${conversion}%`, 'text-amber-700']].map(([k, v, c]) => (
          <div key={k} className="card p-5"><p className={`font-serif text-4xl font-semibold ${c}`}>{v}</p><p className="mt-1 text-sm text-ink-soft">{k}</p></div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="card p-6">
          <h2 className="font-serif text-2xl font-semibold">Views · last 14 days</h2>
          <div className="mt-4"><BarChart data={series.map((s) => ({ date: s.date, value: s.views }))} /></div>
        </section>
        <section className="card p-6">
          <h2 className="font-serif text-2xl font-semibold">Attendance</h2>
          <div className="mt-6">
            <SplitBar parts={[
              { label: 'Attending', value: stats.yes, color: '#455C50' },
              { label: 'Maybe', value: stats.maybe, color: '#C49B72' },
              { label: 'Declined', value: stats.no, color: '#D8C9B2' },
            ]} />
          </div>
          <p className="mt-6 text-sm text-ink-soft">{stats.confirmed} confirmed guest{stats.confirmed === 1 ? '' : 's'} across {stats.yes} accepted response{stats.yes === 1 ? '' : 's'}.</p>
        </section>
      </div>

      <section className="card p-6" aria-label="Guest list">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold">Guest list <span className="text-base text-ink-mute">({shown.length})</span></h2>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input className="input !w-48 !pl-9" placeholder="Search guests" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search guests" />
            </div>
            <select className="input !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter attendance">
              <option value="all">All responses</option><option value="yes">Attending</option><option value="maybe">Maybe</option><option value="no">Declined</option>
            </select>
            <button className="btn-secondary btn-sm" onClick={() => setAddOpen(true)}><UserPlus size={14} /> Add guest</button>
            <button className="btn-secondary btn-sm" onClick={exportCsv} disabled={!guests.length}><Download size={14} /> Export CSV</button>
          </div>
        </div>

        {guests.length === 0 ? (
          <div className="mt-5"><EmptyState icon={Users} title="No responses yet" text={inv.status === 'published' ? 'Share your link — responses will show up here the moment guests reply.' : 'Publish and share your invitation to start collecting RSVPs.'}
            action={<button className="btn-primary" onClick={() => setShareOpen(true)}><Share2 size={15} /> Share invitation</button>} /></div>
        ) : shown.length === 0 ? (
          <p className="mt-6 text-center text-sm text-ink-soft">No guests match your filters.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead><tr className="border-b border-sand text-xs uppercase tracking-wide text-ink-mute">
                <th className="py-3 pr-4 font-medium">Guest</th><th className="py-3 pr-4 font-medium">Contact</th><th className="py-3 pr-4 font-medium">Attendance</th>
                <th className="py-3 pr-4 text-center font-medium">Guests</th><th className="py-3 pr-4 font-medium">Replied</th><th className="py-3" />
              </tr></thead>
              <tbody>
                {shown.map((g) => (
                  <tr key={g.id} className="border-b border-black/5 align-top last:border-0">
                    <td className="py-3.5 pr-4">
                      <p className="font-medium">{g.guestName}</p>
                      {g.mealPreference && <p className="text-xs text-ink-mute">Meal: {g.mealPreference}</p>}
                      {g.message && <p className="mt-1 max-w-xs text-xs italic text-ink-soft">“{g.message}”</p>}
                    </td>
                    <td className="py-3.5 pr-4 text-xs text-ink-soft">
                      {g.email && <p className="flex items-center gap-1.5"><Mail size={12} />{g.email}</p>}
                      {g.phone && <p className="mt-1 flex items-center gap-1.5"><Phone size={12} />{g.phone}</p>}
                      {!g.email && !g.phone && '—'}
                    </td>
                    <td className="py-3.5 pr-4">
                      <select value={g.attending} onChange={(e) => setAttending(g, e.target.value)} aria-label={`Attendance for ${g.guestName}`}
                        className={`cursor-pointer rounded-full border-0 py-1 pl-3 pr-7 text-xs font-medium ${TONE[g.attending]}`}>
                        <option value="yes">Attending</option><option value="maybe">Maybe</option><option value="no">Declined</option>
                      </select>
                    </td>
                    <td className="py-3.5 pr-4 text-center">{g.guestCount}</td>
                    <td className="py-3.5 pr-4 text-xs text-ink-mute">{dayjs(g.createdAt).format('MMM D, h:mm A')}</td>
                    <td className="py-3.5 text-right"><button className="rounded-full p-2 text-ink-mute hover:bg-red-50 hover:text-red-600" onClick={() => setRemoveFor(g)} aria-label={`Remove ${g.guestName}`}><Trash2 size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AddGuestModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={async (data) => { await rsvpApi.submit(inv.id, data); await load(); toast.success('Guest added'); setAddOpen(false); }} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} invitation={inv} />
      <ConfirmDialog open={Boolean(removeFor)} onClose={() => setRemoveFor(null)} onConfirm={confirmRemove} danger confirmLabel="Remove"
        title="Remove this guest?" text={removeFor ? `${removeFor.guestName}'s response will be deleted.` : ''} />
    </div>
  );
}

function AddGuestModal({ open, onClose, onAdd }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { attending: 'yes', guestCount: 1 } });
  useEffect(() => { if (open) reset({ attending: 'yes', guestCount: 1 }); }, [open, reset]);
  const submit = async (v) => {
    try { await onAdd({ guestName: v.guestName.trim(), email: v.email.trim(), phone: v.phone.trim(), attending: v.attending, guestCount: v.attending === 'no' ? 0 : Number(v.guestCount) || 1, message: '', mealPreference: '' }); }
    catch (e) { toast.error(e.message); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Add a guest" size="sm"
      footer={<><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" form="add-guest" disabled={isSubmitting}><Plus size={15} /> Add</button></>}>
      <form id="add-guest" onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <p className="-mt-1 text-sm text-ink-soft">Record a reply you received by phone or message.</p>
        <div>
          <label className="label" htmlFor="g-name">Full name</label>
          <input id="g-name" className="input" {...register('guestName', { required: 'Enter the guest’s name.' })} />
          {errors.guestName && <p className="mt-1 text-xs text-red-600">{errors.guestName.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="g-email">Email</label><input id="g-email" type="email" className="input" {...register('email')} /></div>
          <div><label className="label" htmlFor="g-phone">Phone</label><input id="g-phone" className="input" {...register('phone')} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="g-att">Attendance</label>
            <select id="g-att" className="input" {...register('attending')}><option value="yes">Attending</option><option value="maybe">Maybe</option><option value="no">Declined</option></select></div>
          <div><label className="label" htmlFor="g-count">Guests</label><input id="g-count" type="number" min={1} max={50} className="input" {...register('guestCount')} /></div>
        </div>
      </form>
    </Modal>
  );
}
