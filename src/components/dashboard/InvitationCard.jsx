import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BarChart3, CalendarDays, Copy, Eye, MoreHorizontal, Pencil, Share2, Trash2, Users } from 'lucide-react';
import TemplateThumb from '../invitation/TemplateThumb';
import { StatusBadge } from '../ui/misc';
import { occasionById } from '../../data/constants';
import { formatDate } from '../../lib/utils';

dayjs.extend(relativeTime);

const MENU_W = 208; // w-52

/**
 * The menu is portalled to <body> and positioned from the button's rect: cards use overflow-hidden (for their
 * rounded corners), which would otherwise clip an absolutely-positioned dropdown.
 */
function ActionMenu({ inv, onDuplicate, onDelete }) {
  const [pos, setPos] = useState(null); // null = closed
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const open = pos !== null;
  const close = () => setPos(null);

  const toggle = () => {
    if (open) { close(); return; }
    const r = btnRef.current.getBoundingClientRect();
    const left = Math.min(Math.max(8, r.right - MENU_W), window.innerWidth - MENU_W - 8);
    setPos({ left, top: r.bottom + 6, bottom: window.innerHeight - r.top + 6, up: false });
  };

  // Once rendered, flip above the button if the menu would run off the bottom of the viewport.
  useLayoutEffect(() => {
    if (!open || pos.up || !menuRef.current) return;
    if (pos.top + menuRef.current.offsetHeight > window.innerHeight - 8) setPos((p) => ({ ...p, up: true }));
  }, [open, pos]);

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!menuRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) close(); };
    const esc = (e) => { if (e.key === 'Escape') { close(); btnRef.current?.focus(); } };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc);
      window.removeEventListener('resize', close); window.removeEventListener('scroll', close, true);
    };
  }, [open]);

  const item = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink-soft hover:bg-canvas hover:text-ink';

  return (
    <>
      <button ref={btnRef} className="btn-ghost btn-icon" onClick={toggle} aria-label={`More actions for ${inv.title}`} aria-haspopup="menu" aria-expanded={open}><MoreHorizontal size={18} /></button>
      {open && createPortal(
        <div
          ref={menuRef} role="menu" data-action-menu
          style={{ position: 'fixed', left: pos.left, width: MENU_W, ...(pos.up ? { bottom: pos.bottom } : { top: pos.top }) }}
          className="z-[90] animate-fade-in rounded-xl border border-line bg-surface p-1.5 shadow-pop"
        >
          <Link className={item} to={`/preview/${inv.id}`} role="menuitem"><Eye size={15} /> Preview as guest</Link>
          <Link className={item} to={`/dashboard/invitations/${inv.id}/analytics`} role="menuitem"><BarChart3 size={15} /> Guests & analytics</Link>
          <button className={item} onClick={() => { close(); onDuplicate(inv); }} role="menuitem"><Copy size={15} /> Duplicate</button>
          <div className="my-1 h-px bg-line" />
          <button className={`${item} !text-red-600 hover:!bg-red-50`} onClick={() => { close(); onDelete(inv); }} role="menuitem"><Trash2 size={15} /> Delete…</button>
        </div>,
        document.body,
      )}
    </>
  );
}

/** Soft backdrop tinted with the invitation's own cover colour, so the grid reads as a gallery. */
const tint = (inv) => ({ background: `color-mix(in srgb, ${inv.config?.theme?.coverFrom || '#455C50'} 8%, rgb(var(--c-canvas)))` });

export default function InvitationCard({ inv, layout = 'grid', onShare, onDuplicate, onDelete }) {
  const occ = occasionById(inv.occasion);
  const published = inv.status === 'published';
  const edited = dayjs(inv.updatedAt).fromNow();
  const date = inv.eventDate ? formatDate(inv.eventDate, 'MMM D, YYYY') : 'No date set';

  const meta = (
    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-mute">
      <span className="inline-flex items-center gap-1"><occ.icon size={12} /> {occ.label}</span>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {date}</span>
    </p>
  );

  const stats = published ? (
    <p className="flex items-center gap-3 text-xs text-ink-soft">
      <span className="inline-flex items-center gap-1" title="Views"><Eye size={13} className="text-ink-mute" /><b className="font-semibold text-ink">{inv.viewCount || 0}</b> views</span>
      <span className="inline-flex items-center gap-1" title="RSVPs"><Users size={13} className="text-ink-mute" /><b className="font-semibold text-ink">{inv.rsvpCount || 0}</b> RSVPs</span>
    </p>
  ) : <p className="text-xs text-ink-mute">Edited {edited} · not published</p>;

  const actions = (
    <div className="flex items-center gap-1.5">
      <Link to={`/editor/${inv.id}`} className="btn-primary btn-sm flex-1 sm:flex-none"><Pencil size={13} /> {published ? 'Edit' : 'Continue editing'}</Link>
      <button className="btn-secondary btn-sm" onClick={() => onShare(inv)} aria-label={`Share ${inv.title}`}><Share2 size={13} /> <span className="hidden min-[420px]:inline">Share</span></button>
      <ActionMenu inv={inv} onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  );

  if (layout === 'list') {
    return (
      <article className="card card-hover flex items-center gap-4 p-3 pr-4">
        <Link to={`/editor/${inv.id}`} className="block w-14 shrink-0 overflow-hidden rounded-lg" style={tint(inv)} aria-label={`Edit ${inv.title}`}>
          <TemplateThumb config={inv.config} rounded="rounded-lg" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-display text-[15px] font-bold" title={inv.title}>{inv.title}</h3><StatusBadge status={inv.status} /></div>
          {meta}
        </div>
        <div className="hidden md:block">{stats}</div>
        <div className="shrink-0">{actions}</div>
      </article>
    );
  }

  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <Link to={`/editor/${inv.id}`} className="relative grid h-52 place-items-center overflow-hidden" style={tint(inv)} aria-label={`Edit ${inv.title}`}>
        <div className="w-[118px] translate-y-3 overflow-hidden rounded-xl shadow-pop transition duration-300 group-hover:translate-y-1 group-hover:scale-[1.03]">
          <TemplateThumb config={inv.config} rounded="rounded-xl" />
        </div>
        <div className="absolute left-3 top-3"><StatusBadge status={inv.status} /></div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-bold leading-snug" title={inv.title}>{inv.title}</h3>
          {meta}
        </div>
        {stats}
        <div className="mt-auto pt-1">{actions}</div>
      </div>
    </article>
  );
}
