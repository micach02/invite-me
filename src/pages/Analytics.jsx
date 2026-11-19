import { Link } from 'react-router-dom';
import { BarChart3, ChevronRight, Plus } from 'lucide-react';
import { useInvitations } from '../hooks/useInvitations';
import { EmptyState, PageLoader, StatusBadge } from '../components/ui/misc';
import { occasionById } from '../data/constants';
import { formatDate } from '../lib/utils';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

/** Cross-invitation overview that links into each invitation's RSVP manager. */
export default function Analytics() {
  const { items, rsvps, loading } = useInvitations();
  useDocumentMeta({ title: 'RSVPs & Analytics — InviteMe', description: 'Guest responses and invitation performance', noindex: true });

  if (loading) return <PageLoader />;

  const rows = items.map((i) => {
    const mine = rsvps.filter((r) => r.invitationId === i.id);
    return {
      ...i,
      yes: mine.filter((r) => r.attending === 'yes').length,
      no: mine.filter((r) => r.attending === 'no').length,
      maybe: mine.filter((r) => r.attending === 'maybe').length,
      guests: mine.filter((r) => r.attending === 'yes').reduce((n, r) => n + (Number(r.guestCount) || 0), 0),
    };
  });

  return (
    <div>
      <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">RSVPs & analytics</h1>
      <p className="mt-1 max-w-xl text-ink-soft">Open an invitation to see its guest list, attendance and daily views.</p>

      <div className="mt-8">
        {rows.length === 0 ? (
          <EmptyState icon={BarChart3} title="Nothing to analyse yet" text="Create and publish an invitation to start collecting RSVPs."
            action={<Link to="/templates?start=1" className="btn-primary"><Plus size={16} /> New invitation</Link>} />
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => {
              const occ = occasionById(r.occasion);
              return (
                <li key={r.id}>
                  <Link to={`/dashboard/invitations/${r.id}/analytics`} className="card flex flex-wrap items-center gap-x-8 gap-y-3 p-5 transition hover:shadow-lift">
                    <div className="min-w-0 flex-1 basis-56">
                      <div className="flex items-center gap-2"><h2 className="truncate font-display text-base font-bold">{r.title}</h2><StatusBadge status={r.status} /></div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-mute"><occ.icon size={13} />{occ.label}{r.eventDate ? ` · ${formatDate(r.eventDate)}` : ''}</p>
                    </div>
                    <dl className="grid grid-cols-5 gap-5 text-center text-sm">
                      {[['Views', r.viewCount || 0], ['Yes', r.yes], ['Maybe', r.maybe], ['No', r.no], ['Guests', r.guests]].map(([k, v]) => (
                        <div key={k}><dd className="font-display text-xl font-extrabold leading-none">{v}</dd><dt className="mt-1 text-[11px] uppercase tracking-wide text-ink-mute">{k}</dt></div>
                      ))}
                    </dl>
                    <ChevronRight className="text-ink-mute" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
