import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { initials, themeStyle, fontMeta } from './theme';

/**
 * Animated "envelope" opening. Rendered OUTSIDE the `.inv` container because container
 * queries create a containing block for fixed-position descendants.
 */
export default function OpeningOverlay({ config, onOpen, embedded = false }) {
  const [opening, setOpening] = useState(false);
  const reduce = useReducedMotion();
  const { event, page, theme } = config;
  const hf = fontMeta(theme.fontHeading);
  const vars = themeStyle(config);
  const dur = reduce ? 0.01 : 1.1;

  const half = {
    position: 'absolute', left: 0, right: 0, height: '50%',
    background: `linear-gradient(160deg, ${theme.coverFrom}, ${theme.coverTo})`,
  };

  return (
    <motion.div
      style={{ ...vars, position: embedded ? 'absolute' : 'fixed', inset: 0, zIndex: embedded ? 40 : 200, overflow: 'hidden', color: theme.coverText }}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ duration: 0.5, delay: opening ? dur * 0.8 : 0 }}
      onAnimationComplete={() => opening && onOpen?.()}
      aria-label="Invitation envelope"
    >
      <motion.div style={{ ...half, top: 0, borderBottom: `1px solid ${theme.accentColor}55` }} animate={{ y: opening ? '-101%' : 0 }} transition={{ duration: dur, ease: [0.76, 0, 0.24, 1] }} />
      <motion.div style={{ ...half, bottom: 0 }} animate={{ y: opening ? '101%' : 0 }} transition={{ duration: dur, ease: [0.76, 0, 0.24, 1] }} />

      <motion.div
        animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.9 : 1 }} transition={{ duration: 0.35 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.4rem', padding: '1.5rem', textAlign: 'center' }}
      >
        {event.tagline && <p style={{ fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', opacity: 0.85, margin: 0, fontFamily: 'var(--inv-body)' }}>{event.tagline}</p>}
        <h1 style={{ fontFamily: 'var(--inv-heading)', fontWeight: hf.weight, textTransform: hf.transform, letterSpacing: hf.spacing, fontSize: `calc(clamp(2.2rem, 9vw, 4rem) * ${hf.scale})`, lineHeight: 1.1, margin: 0 }}>
          {event.names || event.title}
        </h1>
        <motion.button
          type="button" onClick={() => setOpening(true)} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
          aria-label={page.openingText || 'Open invitation'}
          style={{
            width: 96, height: 96, borderRadius: '50%', border: `2px solid ${theme.accentColor}`, background: theme.accentColor,
            color: 'var(--inv-on-accent)', fontFamily: 'var(--inv-heading)', fontSize: 28, fontWeight: 600, cursor: 'pointer',
            boxShadow: `0 0 0 8px ${theme.accentColor}33, 0 18px 40px -12px rgba(0,0,0,.5)`,
          }}
        >
          {initials(event.names || event.title) || '♥'}
        </motion.button>
        <p style={{ fontSize: 12, letterSpacing: '.3em', textTransform: 'uppercase', margin: 0, opacity: 0.9, fontFamily: 'var(--inv-body)' }}>
          {page.openingText || 'Tap to open'}
        </p>
      </motion.div>
    </motion.div>
  );
}
