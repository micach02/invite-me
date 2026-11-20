import { contrastText } from '../../lib/utils';

const SCRIPT = ['Great Vibes', 'Dancing Script'];
const SANS_CAPS = ['Montserrat', 'Poppins'];
const SANS_EXTRA = ['Syne', 'Space Grotesk', 'Bebas Neue', 'Josefin Sans', 'Space Mono'];
const SANS = [...SANS_CAPS, ...SANS_EXTRA, 'Inter', 'Fredoka'];

/** Per-font typographic tuning so script/sans display faces still look balanced at heading sizes. */
export function fontMeta(name) {
  if (SCRIPT.includes(name)) return { scale: 1.3, weight: 400, transform: 'none', spacing: '0', family: 'cursive' };
  if (SANS_CAPS.includes(name)) return { scale: 0.7, weight: 600, transform: 'uppercase', spacing: '.09em', family: 'sans-serif' };
  if (name === 'Bebas Neue') return { scale: 1.25, weight: 400, transform: 'uppercase', spacing: '.02em', family: 'sans-serif' };
  if (name === 'Space Mono') return { scale: 0.74, weight: 700, transform: 'uppercase', spacing: '.03em', family: 'monospace' };
  if (name === 'Josefin Sans') return { scale: 0.84, weight: 600, transform: 'uppercase', spacing: '.14em', family: 'sans-serif' };
  if (name === 'Fraunces') return { scale: 0.96, weight: 600, transform: 'none', spacing: '-.01em', family: 'serif' };
  if (name === 'DM Serif Display') return { scale: 0.95, weight: 400, transform: 'none', spacing: '0', family: 'serif' };
  if (name === 'Cinzel') return { scale: 0.78, weight: 600, transform: 'uppercase', spacing: '.06em', family: 'serif' };
  if (name === 'Pacifico') return { scale: 0.85, weight: 400, transform: 'none', spacing: '0', family: 'cursive' };
  if (name === 'Syne') return { scale: 0.88, weight: 700, transform: 'none', spacing: '-.01em', family: 'sans-serif' };
  if (name === 'Abril Fatface') return { scale: 0.95, weight: 400, transform: 'none', spacing: '0', family: 'serif' };
  if (name === 'Fredoka') return { scale: 0.92, weight: 600, transform: 'none', spacing: '0', family: 'sans-serif' };
  if (name === 'Limelight') return { scale: 0.86, weight: 400, transform: 'none', spacing: '.01em', family: 'serif' };
  if (name === 'Italiana') return { scale: 0.84, weight: 400, transform: 'uppercase', spacing: '.08em', family: 'serif' };
  if (name === 'Shrikhand') return { scale: 0.8, weight: 400, transform: 'none', spacing: '0', family: 'serif' };
  if (name === 'Caveat') return { scale: 1.22, weight: 700, transform: 'none', spacing: '0', family: 'cursive' };
  if (name === 'Playfair Display') return { scale: 0.92, weight: 500, transform: 'none', spacing: '0', family: 'serif' };
  return { scale: 1, weight: 500, transform: 'none', spacing: '0', family: SANS.includes(name) ? 'sans-serif' : 'serif' };
}

const q = (name, fallback) => `'${name}', ${fallback}`;

/** CSS variables that drive every invitation component from the JSON config. */
export function themeStyle(config) {
  const th = config.theme || {};
  const hf = fontMeta(th.fontHeading);
  const bf = fontMeta(th.fontBody);
  return {
    '--inv-text': th.textColor,
    '--inv-bg': th.bgColor,
    '--inv-accent': th.accentColor,
    '--inv-on-accent': contrastText(th.accentColor),
    '--inv-cover-from': th.coverFrom,
    '--inv-cover-to': th.coverTo,
    '--inv-cover-text': th.coverText,
    '--inv-heading': q(th.fontHeading, hf.family),
    '--inv-body': q(th.fontBody, bf.family),
    '--inv-scale': th.fontScale ?? 1,
    '--inv-hscale': hf.scale,
    '--inv-hweight': hf.weight,
    '--inv-htransform': hf.transform,
    '--inv-hspacing': hf.spacing,
    '--inv-overlay': th.overlay ?? 0.3,
    '--inv-fx': th.fxColor || th.accentColor,
  };
}

// Filler words that shouldn't become monogram letters ("Cha turns 30" -> C, "Baby Michael" -> M).
const MONOGRAM_SKIP = /^(turns|is|are|baby|the|of|and|\d+)$/i;

export function initials(names = '') {
  const parts = names.split(/\s*(?:&|\band\b|\+)\s*/i).filter(Boolean);
  const words = (parts.length > 1 ? parts : names.split(/\s+/)).filter((w) => w && !MONOGRAM_SKIP.test(w));
  const letters = words.slice(0, 2).map((p) => p[0].toUpperCase());
  return letters.join(parts.length > 1 ? '&' : '');
}
