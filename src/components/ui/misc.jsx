import { Loader2 } from 'lucide-react';
import Modal from './Modal';

export const Spinner = ({ className = '' }) => <Loader2 className={`animate-spin text-brand ${className}`} size={20} />;

export const Skeleton = ({ className = '' }) => <div className={`skeleton ${className}`} aria-hidden="true" />;

export const PageLoader = ({ label = 'Loading…' }) => (
  <div className="grid min-h-[50vh] place-items-center" role="status" aria-live="polite">
    <div className="flex flex-col items-center gap-3 text-ink-soft">
      <Spinner className="!h-6 !w-6" />
      <span className="text-sm">{label}</span>
    </div>
  </div>
);

/** Layout-shaped placeholders so the page doesn't jump when data arrives. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading your dashboard">
      <div className="flex items-end justify-between"><div className="space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-9 w-64" /></div><Skeleton className="h-10 w-40" /></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 !rounded-2xl" />)}</div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="card overflow-hidden"><Skeleton className="h-56 !rounded-none" /><div className="space-y-3 p-5"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-9 w-full" /></div></div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line-strong bg-white/60 px-6 py-14 text-center">
      {Icon && <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand ring-8 ring-brand-50/50"><Icon size={26} strokeWidth={1.5} /></span>}
      <h3 className="font-display text-xl font-bold">{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export const StatusBadge = ({ status }) =>
  status === 'published'
    ? <span className="chip bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Published</span>
    : <span className="chip bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/15"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Draft</span>;

export function ConfirmDialog({ open, onClose, onConfirm, title, text, confirmLabel = 'Confirm', danger, busy }) {
  return (
    <Modal
      open={open} onClose={onClose} title={title} size="sm"
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} disabled={busy}>{confirmLabel}</button>
      </>}
    >
      <p className="text-sm leading-relaxed text-ink-soft">{text}</p>
    </Modal>
  );
}
