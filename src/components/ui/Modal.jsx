import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Centered dialog on desktop, bottom sheet (with grab handle) on phones.
 * Rendered into <body>: a page wrapper with a transform/animation would otherwise become the containing block of this
 * `fixed` overlay and clip it to the page content instead of the whole window.
 */
export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  const width = { sm: 'sm:max-w-sm', md: 'sm:max-w-lg', lg: 'sm:max-w-3xl', xl: 'sm:max-w-5xl' }[size];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-night/55 backdrop-blur-[3px] sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label={title}
            className={`flex max-h-[92dvh] w-full ${width} flex-col overflow-hidden rounded-t-3xl bg-surface shadow-lift sm:rounded-2xl`}
            initial={{ y: 48, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 340 }}
          >
            <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-ink/10 sm:hidden" aria-hidden="true" />
            <div className="flex items-center justify-between gap-4 px-6 pb-3 pt-4 sm:pt-5">
              <h2 className="font-display text-lg font-bold">{title}</h2>
              <button onClick={onClose} className="btn-ghost btn-icon -mr-2" aria-label="Close"><X size={18} /></button>
            </div>
            <div className="scroll-thin overflow-y-auto px-6 pb-6 pt-1">{children}</div>
            {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-canvas/70 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
