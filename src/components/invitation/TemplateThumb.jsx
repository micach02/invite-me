import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import InvitationRenderer from './InvitationRenderer';
import { createDefaultConfig } from '../../data/defaultConfig';
import { templateById } from '../../data/templates';

const W = 390;
const H = 640;

/** Scales a real, rendered invitation cover down into a card thumbnail (so thumbnails never go stale). */
function Thumb({ config, templateId, className = '', rounded = 'rounded-2xl' }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(0.5);

  const cfg = useMemo(() => {
    if (config) return config;
    const tpl = templateById(templateId);
    return createDefaultConfig(tpl.occasion, tpl.id);
  }, [config, templateId]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`inv-thumb relative w-full overflow-hidden ${rounded} ${className}`} style={{ aspectRatio: `${W} / ${H}` }}>
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left', pointerEvents: 'none', position: 'absolute', top: 0, left: 0 }} aria-hidden="true">
        <InvitationRenderer config={cfg} mode="thumb" />
      </div>
    </div>
  );
}

export default memo(Thumb);
