import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Device chrome around a scrolling invitation. Children may be a function receiving the
 * inner viewport height (px) so the cover can fill exactly one "screen".
 */
export default function PreviewFrame({ device = 'mobile', scrollRef, overlay, children }) {
  const viewport = useRef(null);
  const [h, setH] = useState(680);

  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setH(Math.round(e.contentRect.height)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [device]);

  const body = (
    <div ref={viewport} className="relative min-h-0 flex-1 overflow-hidden bg-white">
      <div ref={scrollRef} className="scroll-thin h-full overflow-y-auto overscroll-contain">
        {typeof children === 'function' ? children(`${h}px`) : children}
      </div>
      {overlay}
    </div>
  );

  if (device === 'desktop') {
    return (
      <div className="mx-auto flex h-full w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-lift">
        <div className="flex items-center gap-1.5 border-b border-ink/5 bg-canvas px-4 py-2.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-red-300" /><i className="h-2.5 w-2.5 rounded-full bg-amber-300" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="mx-auto rounded-full bg-surface px-8 py-1 text-[11px] text-ink-mute">inviteme.com/invitation/your-event</span>
        </div>
        {body}
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-h-[840px] w-[390px] max-w-full flex-col rounded-[2.6rem] bg-night p-2.5 shadow-lift">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2.1rem] bg-white">{body}</div>
    </div>
  );
}
