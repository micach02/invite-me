import { Loader2 } from 'lucide-react';
import Modal from './Modal';

export const Spinner = ({ className = '' }) => <Loader2 className={`animate-spin text-brand ${className}`} size={20} />;

export const PageLoader = ({ label = 'Loading…' }) => (
  <div className="grid min-h-[50vh] place-items-center">
    <div className="flex flex-col items-center gap-3 text-ink-soft">
      <Spinner className="!h-7 !w-7" />
      <span className="text-sm">{label}</span>
    </div>
  </div>
);

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-sand bg-white/60 px-6 py-14 text-center">
      {Icon && <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand"><Icon size={26} strokeWidth={1.5} /></span>}
      <h3 className="font-serif text-2xl font-semibold">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-ink-soft">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export const StatusBadge = ({ status }) =>
  status === 'published'
    ? <span className="chip bg-emerald-50 text-emerald-700"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />Published</span>
    : <span className="chip bg-amber-50 text-amber-700"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />Draft</span>;

export function ConfirmDialog({ open, onClose, onConfirm, title, text, confirmLabel = 'Confirm', danger, busy }) {
  return (
    <Modal
      open={open} onClose={onClose} title={title} size="sm"
      footer={<>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} disabled={busy}>{confirmLabel}</button>
      </>}
    >
      <p className="text-sm text-ink-soft">{text}</p>
    </Modal>
  );
}
