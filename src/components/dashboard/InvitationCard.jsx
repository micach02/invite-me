import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CalendarDays, Copy, Eye, MoreHorizontal, Pencil, Share2, Trash2, Users } from 'lucide-react';
import TemplateThumb from '../invitation/TemplateThumb';
import { StatusBadge } from '../ui/misc';
import { occasionById } from '../../data/constants';
import { formatDate } from '../../lib/utils';

export default function InvitationCard({ inv, onShare, onDuplicate, onDelete }) {
  const [menu, setMenu] = useState(false);
  const ref = useRef(null);
  const occ = occasionById(inv.occasion);

  useEffect(() => {
    if (!menu) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setMenu(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menu]);

  const item = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink-soft hover:bg-sand-light hover:text-ink';

  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <Link to={`/editor/${inv.id}`} className="relative block bg-sand-light p-4 pb-0" aria-label={`Edit ${inv.title}`}>
        <div className="mx-auto w-[58%] max-w-[190px] overflow-hidden rounded-t-xl shadow-card">
          <TemplateThumb config={inv.config} rounded="rounded-t-xl" />
        </div>
        <div className="absolute left-4 top-4"><StatusBadge status={inv.status} /></div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-serif text-xl font-semibold leading-tight" title={inv.title}>{inv.title}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-mute"><occ.icon size={13} /> {occ.label}</p>
          </div>
          <div className="relative" ref={ref}>
            <button className="rounded-full p-1.5 text-ink-soft hover:bg-sand-light" onClick={() => setMenu((m) => !m)} aria-label="More actions" aria-expanded={menu}><MoreHorizontal size={18} /></button>
            {menu && (
              <div className="absolute right-0 top-9 z-20 w-48 rounded-xl border border-black/5 bg-white p-1.5 shadow-lift" role="menu">
                <Link className={item} to={`/preview/${inv.id}`} role="menuitem"><Eye size={15} /> Preview as guest</Link>
                <Link className={item} to={`/dashboard/invitations/${inv.id}/analytics`} role="menuitem"><BarChart3 size={15} /> View analytics</Link>
                <button className={item} onClick={() => { setMenu(false); onDuplicate(inv); }} role="menuitem"><Copy size={15} /> Duplicate</button>
                <button className={`${item} !text-red-600 hover:!bg-red-50`} onClick={() => { setMenu(false); onDelete(inv); }} role="menuitem"><Trash2 size={15} /> Delete</button>
              </div>
            )}
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl bg-canvas px-2 py-2.5"><dt className="sr-only">Event date</dt><CalendarDays size={14} className="mx-auto mb-1 text-accent" /><dd className="font-medium">{inv.eventDate ? formatDate(inv.eventDate, 'MMM D, YYYY') : 'No date'}</dd></div>
          <div className="rounded-xl bg-canvas px-2 py-2.5"><dt className="sr-only">Views</dt><Eye size={14} className="mx-auto mb-1 text-accent" /><dd className="font-medium">{inv.viewCount || 0} views</dd></div>
          <div className="rounded-xl bg-canvas px-2 py-2.5"><dt className="sr-only">RSVPs</dt><Users size={14} className="mx-auto mb-1 text-accent" /><dd className="font-medium">{inv.rsvpCount || 0} RSVPs</dd></div>
        </dl>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
          <Link to={`/editor/${inv.id}`} className="btn-primary btn-sm"><Pencil size={13} /> Edit</Link>
          <Link to={`/preview/${inv.id}`} className="btn-secondary btn-sm"><Eye size={13} /> Preview</Link>
          <button className="btn-secondary btn-sm" onClick={() => onShare(inv)}><Share2 size={13} /> Share</button>
        </div>
      </div>
    </article>
  );
}
