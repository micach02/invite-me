import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Page numbers with ellipses: 1 … 4 5 [6] 7 8 … 20 */
export function pageWindow(page, count, siblings = 1) {
  if (count <= 5 + siblings * 2) return Array.from({ length: count }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, count - 1);
  const out = [1];
  if (left > 2) out.push('…');
  for (let i = left; i <= right; i += 1) out.push(i);
  if (right < count - 1) out.push('…');
  out.push(count);
  return out;
}

const base = 'grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-medium transition';

export default function Pagination({ page, pageCount, onChange, compact = false, className = '' }) {
  if (pageCount <= 1) return null;
  const go = (p) => p >= 1 && p <= pageCount && p !== page && onChange(p);

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button type="button" className={`${base} border border-sand bg-white text-ink-soft hover:bg-sand-light disabled:opacity-40 disabled:hover:bg-white`} onClick={() => go(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>

      {compact ? (
        <span className="px-3 text-xs text-ink-soft" aria-live="polite">Page <b className="text-ink">{page}</b> of {pageCount}</span>
      ) : (
        pageWindow(page, pageCount).map((p, i) => (p === '…' ? (
          <span key={`gap-${i}`} className="grid h-10 w-6 place-items-center text-ink-mute" aria-hidden="true">…</span>
        ) : (
          <button
            key={p} type="button" onClick={() => go(p)} aria-label={`Page ${p}`} aria-current={p === page ? 'page' : undefined}
            className={`${base} ${p === page ? 'bg-brand text-white shadow-sm' : 'text-ink-soft hover:bg-sand-light'} ${Math.abs(p - page) > 1 && p !== 1 && p !== pageCount ? 'hidden sm:grid' : ''}`}
          >{p}</button>
        )))
      )}

      <button type="button" className={`${base} border border-sand bg-white text-ink-soft hover:bg-sand-light disabled:opacity-40 disabled:hover:bg-white`} onClick={() => go(page + 1)} disabled={page === pageCount} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
