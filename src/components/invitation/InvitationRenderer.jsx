import { useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, CalendarPlus, ChevronDown, Clock, Gift, ImageIcon, MapPin, Navigation, Shirt, X } from 'lucide-react';
import './invitation.css';
import './invitation-fx.css';
import './invitation-fx2.css';
import './invitation-fx3.css';
import './invitation-fx4.css';
import './invitation-fx5.css';
import './invitation-fx6.css';
import './invitation-fx7.css';
import { Decor, Divider } from './Decor';
import Countdown from './Countdown';
import RsvpForm from './RsvpForm';
import { fontMeta, initials, themeStyle } from './theme';
import { appPath, buildIcs, downloadFile, eventMoment, formatDate, mapsEmbedUrl, mapsLink, timeRange } from '../../lib/utils';
import dayjs from 'dayjs';
import { SECTION_ORDER } from '../../data/constants';

/* ------------------------------------------------------------------ helpers */

const REVEAL_FROM = {
  'fade-up': { opacity: 0, y: 28 },
  zoom: { opacity: 0, scale: 0.9 },
  slide: { opacity: 0, x: -48 },
  blur: { opacity: 0, filter: 'blur(14px)', y: 14 },
  flip: { opacity: 0, rotateX: 65, y: 30, transformPerspective: 900 },
  tilt: { opacity: 0, rotate: -4, y: 40 },
  wipe: { clipPath: 'inset(100% 0% 0% 0%)' },
  drop: { opacity: 0, y: -40 },
  'slide-right': { opacity: 0, x: 48 },
  settle: { opacity: 0, scale: 1.12 },
};
/** Where each animated property ends up. Only the properties a variant starts from are animated. */
const REVEAL_TO = { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, rotateX: 0, filter: 'blur(0px)', clipPath: 'inset(0% 0% 0% 0%)' };

function Reveal({ children, mode, delay = 0, variant = 'fade-up' }) {
  const reduce = useReducedMotion();
  if (mode !== 'public' || reduce) return <div>{children}</div>;
  const from = REVEAL_FROM[variant] ?? REVEAL_FROM['fade-up'];
  const to = Object.fromEntries(Object.keys(from).filter((k) => k in REVEAL_TO).map((k) => [k, REVEAL_TO[k]]));
  // A finished wipe drops its clip so shadows and overhanging glyphs aren't cut off.
  if (from.clipPath) to.transitionEnd = { clipPath: 'none' };
  return (
    <motion.div
      initial={from} whileInView={to}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }} transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, alt, title, eyebrow, mode, bg, children, divider, reveal }) {
  return (
    <section data-sec={id} className={`inv-section${alt ? ' alt' : ''}`}>
      {bg && <div className="inv-bgimg" style={{ backgroundImage: `url("${bg}")` }} />}
      <div className="inv-inner">
        <Reveal mode={mode} variant={reveal}>
          {eyebrow && <p className="inv-eyebrow">{eyebrow}</p>}
          {title && <h2 className="inv-h inv-h2">{title}</h2>}
          {divider}
        </Reveal>
        <Reveal mode={mode} delay={0.12} variant={reveal}>{children}</Reveal>
      </div>
    </section>
  );
}

const lines = (text = '') => text.split('\n').map((l) => l.trim()).filter(Boolean);

/* -------------------------------------------------------------------- cover */

/** Heading with optional entrance animation. Gradient (shimmer) text can't contain transformed children. */
/** How many characters of the longest word fit comfortably across each layout's title box. */
const FIT_CAP = { doorway: 9, brutal: 8, magazine: 7, poster: 7, medallion: 7.5, ticket: 9.5, glass: 8, neon: 9.5, polaroid: 10, vintage: 11, split: 9, bold: 12, arch: 12, envelope: 8.5, marquee: 10, curtain: 8.5, wreath: 7.5, letterboard: 9 };

/** Title animations split into per-letter spans (value = extra class on each letter) … */
const PER_LETTER = { letters: '', typewriter: ' type', flip: ' flip', drop: ' drop', wave: ' wave' };
/** … and ones that animate the whole heading with a single class. */
const WHOLE_TITLE = { blur: 't-blur', wipe: 't-wipe', tracking: 't-tracking', glow: 't-glow', glitch: 't-glitch' };

function CoverTitle({ text, theme }) {
  const longest = Math.max(1, ...text.split(/\s+/).map((w) => w.length));
  // Uppercase and letter-spaced faces (Josefin Sans, Cinzel, Space Mono…) are much wider than their character count suggests.
  const meta = fontMeta(theme.fontHeading);
  const effLen = longest * (meta.transform === 'uppercase' ? 1.2 : 1) * (1 + (parseFloat(meta.spacing) || 0));
  const fit = Math.max(0.5, Math.min(1, (FIT_CAP[theme.layout] ?? 11) / effLen));
  const shimmer = theme.coverEffect === 'shimmer';
  let anim = theme.titleAnim || 'rise';
  // Gradient (shimmer) text can't hold transformed children, and its own animation overrides whole-title ones.
  if (shimmer && anim !== 'none') anim = 'blur';
  const cls = `inv-h inv-cover-title${shimmer ? ' shimmer' : ''}${!shimmer && WHOLE_TITLE[anim] ? ` ${WHOLE_TITLE[anim]}` : ''}`;

  let body = text;
  if (PER_LETTER[anim] !== undefined) {
    const variant = PER_LETTER[anim];
    let i = 0;
    body = text.split(' ').map((word, wi) => (
      <span key={wi}>
        <span className="inv-w">{[...word].map((ch, ci) => <span key={ci} className={`inv-letter${variant}`} style={{ '--i': i++ }}>{ch}</span>)}</span>{' '}
      </span>
    ));
    if (anim === 'typewriter') body.push(<span key="caret" className="inv-caret" />);
  } else if (anim === 'rise') {
    body = text.split(' ').map((word, wi) => (
      <span key={wi}><span className="inv-wordmask"><span style={{ '--i': wi }}>{word}</span></span>{' '}</span>
    ));
  } else if (anim === 'pop') {
    body = text.split(' ').map((word, wi) => <span key={wi}><span className="inv-pop" style={{ '--i': wi }}>{word}</span>{' '}</span>);
  }
  return (
    <h1 className={cls} aria-label={text} data-text={text} style={fit < 1 ? { '--inv-fit': fit } : undefined}>
      {typeof body === 'string' ? body : <span aria-hidden="true">{body}</span>}
    </h1>
  );
}

const WAVE = 'M0 60 Q300 0 600 60 T1200 60 T1800 60 T2400 60 V120 H0Z';

function CoverFx({ effect }) {
  if (effect === 'aurora') return <div className="inv-fx aurora" aria-hidden="true"><i /><i /><i /></div>;
  if (effect === 'shine') return <div className="inv-fx shine" aria-hidden="true"><i /><i /></div>;
  if (effect === 'watercolor') return <div className="inv-fx wash" aria-hidden="true"><i /><i /><i /><i /></div>;
  if (effect === 'spotlight') return <div className="inv-fx spot" aria-hidden="true"><i /><i /></div>;
  if (effect === 'waves') {
    return (
      <div className="inv-fx waves" aria-hidden="true">
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none"><path d={WAVE} /></svg>
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none"><path d={WAVE} /></svg>
      </div>
    );
  }
  if (effect === 'ripple') return <div className="inv-fx ripple" aria-hidden="true"><i /><i /><i /><i /></div>;
  if (effect === 'rays') return <div className="inv-fx rays" aria-hidden="true"><i /><i /></div>;
  if (effect === 'leaks') return <div className="inv-fx leaks" aria-hidden="true"><i /><i /><i /></div>;
  if (effect === 'holo') return <div className="inv-fx holo" aria-hidden="true"><i /><i /></div>;
  if (effect === 'blobs') return <div className="inv-fx blobs" aria-hidden="true"><i /><i /><i /></div>;
  if (effect === 'warp') {
    return (
      <div className="inv-fx warp" aria-hidden="true">
        {WARP.map((s, i) => <i key={i} style={{ rotate: `${s.a}deg`, animationDuration: `${s.t}s`, animationDelay: `${s.d}s` }} />)}
      </div>
    );
  }
  if (effect === 'rain') {
    return (
      <div className="inv-fx rain" aria-hidden="true">
        {RAIN.map((r, i) => <i key={i} style={{ left: `${r.x}%`, height: `${r.h}em`, animationDuration: `${r.t}s`, animationDelay: `${r.d}s` }} />)}
      </div>
    );
  }
  if (effect === 'burst') {
    return (
      <div className="inv-fx burst" aria-hidden="true">
        {BURST_BITS.map((b, i) => (
          <span key={i} style={{ '--dx': `${b.dx}em`, '--dl': `${b.dl}s` }}>
            <i style={{ '--dy': `${b.dy}em`, '--c': b.c, width: `${b.w}em`, borderRadius: b.round ? '50%' : '1px', height: b.round ? `${b.w}em` : undefined }} />
          </span>
        ))}
      </div>
    );
  }
  return null;
}

/* Deterministic particle layouts for the warp, rain and confetti-burst effects (identical in thumbnails, editor and guest view). */
const WARP = Array.from({ length: 42 }, (_, i) => ({ a: +((i * 137.508) % 360).toFixed(1), t: +(1.6 + ((i * 7) % 9) * 0.18).toFixed(2), d: -+((i * 0.61) % 3.2).toFixed(2) }));
const RAIN = Array.from({ length: 46 }, (_, i) => ({ x: (i * 53 + 7) % 104 - 4, h: 2.2 + (i % 4) * 0.7, t: +(0.75 + (i % 5) * 0.12).toFixed(2), d: -+((i * 0.37) % 2).toFixed(2) }));
const BURST_COLORS = ['var(--inv-accent)', 'var(--inv-fx)', 'var(--inv-cover-text)', '#FF6B8B', '#FFD36B', '#6BCBFF'];
const BURST_BITS = Array.from({ length: 44 }, (_, i) => {
  const a = ((-172 + ((i * 47) % 164)) * Math.PI) / 180; // a fan aimed upward
  const r = 7 + ((i * 13) % 11);
  return {
    dx: +(Math.cos(a) * r * 1.25).toFixed(2), dy: +(Math.sin(a) * r).toFixed(2), dl: +(0.6 + (i % 5) * 0.03).toFixed(2),
    c: BURST_COLORS[i % 6], w: +(0.4 + (i % 3) * 0.14).toFixed(2), round: i % 4 === 0,
  };
});

/** Line-drawn little house for the `house` layout. Strokes draw in, the windows light up, the heart beats. */
function HouseArt() {
  const draw = (delay) => ({ pathLength: 1, className: 'draw', style: { '--dl': `${delay}s` } });
  return (
    <svg className="inv-house" viewBox="0 0 200 176" aria-hidden="true">
      <g className="rays"><path d="M100 3v9M78 8l4 8M122 8l-4 8" /></g>
      <path d="M12 158H188" {...draw(0)} />
      <path d="M38 84v74M162 84v74" {...draw(0.3)} />
      <path className="roof draw" pathLength="1" style={{ '--dl': '0.55s' }} d="M16 92L100 26l84 66" />
      <path d="M140 58V32h18v42" {...draw(0.9)} />
      <path d="M88 158v-34a12 12 0 0 1 24 0v34" {...draw(1.1)} />
      <circle className="knob" cx="106" cy="144" r="2" />
      <rect className="glow" x="52" y="106" width="24" height="24" rx="2" />
      <rect className="glow" x="124" y="106" width="24" height="24" rx="2" />
      <path d="M52 118h24M64 106v24M124 118h24M136 106v24" {...draw(1.3)} />
      <path className="heart" d="M100 72C90 65 86 60 86 55a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 5-4 10-14 17z" />
    </svg>
  );
}

/** A wreath of leaves and berries that hangs on the `doorway` layout's door. */
function Wreath({ mono }) {
  return (
    <div className="inv-wreath" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        {Array.from({ length: 18 }, (_, i) => (
          <ellipse key={i} cx="50" cy="11" rx="9" ry="3.6" className={i % 3 === 0 ? 'alt' : ''} transform={`rotate(${i * 20} 50 50) rotate(24 50 11)`} />
        ))}
        {[0, 3, 6, 9, 12, 15].map((i) => <circle key={i} className="berry" cx="50" cy="11" r="2.4" transform={`rotate(${i * 20 + 10} 50 50)`} />)}
      </svg>
      <span>{mono}</span>
    </div>
  );
}

/** Circular text ring for the medallion layout. Drops items rather than clipping text mid-word. */
function MedalRing({ items }) {
  const id = useId().replace(/:/g, '');
  const MAX = 62;
  const clean = items.filter(Boolean).map((t) => t.toUpperCase());
  let use = clean;
  while (use.length > 1 && use.join('  ✦  ').length > MAX) use = use.slice(1);
  let unit = use.join('  ✦  ') || 'YOU ARE INVITED';
  if (unit.length > MAX) unit = unit.slice(0, unit.lastIndexOf(' ', MAX) > 20 ? unit.lastIndexOf(' ', MAX) : MAX);
  const reps = Math.max(1, Math.floor(MAX / unit.length));
  const text = `${Array(reps).fill(unit).join('  ✦  ')}  ✦  `;
  return (
    <svg className="inv-medal-ring" viewBox="0 0 200 200" aria-hidden="true">
      <defs><path id={id} d="M100,100 m-87,0 a87,87 0 1,1 174,0 a87,87 0 1,1 -174,0" /></defs>
      <text fontSize="8.4"><textPath href={`#${id}`} textLength="540" lengthAdjust="spacing">{text}</textPath></text>
    </svg>
  );
}

/** Pennant flags along a drooping string. Each flag sits on the curve and tilts to its slope (atan2 of drop vs. width). */
const FLAG_COLORS = ['var(--inv-accent)', 'var(--inv-fx)', 'color-mix(in srgb, var(--inv-cover-text) 82%, transparent)'];
function Bunting() {
  const n = 11;
  return (
    <div className="inv-bunting" aria-hidden="true">
      <svg viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 0Q50 20 100 0" /></svg>
      {Array.from({ length: n }, (_, i) => {
        const u = (i + 0.5) / n;
        return (
          <i key={i} className={`inv-flag${i % 2 ? ' dots' : ''}`} style={{
            left: `${(u * 100).toFixed(2)}%`, top: `calc(.4em + ${(4 * u * (1 - u)).toFixed(3)} * 3.2em)`,
            '--r': `atan2(${(12.8 * (1 - 2 * u)).toFixed(2)}em, 100cqw)`, '--c': FLAG_COLORS[i % 3], animationDelay: `${-i * 0.45}s`,
          }} />
        );
      })}
    </div>
  );
}

/** Stained-glass lancet window: a rose of eight petals over a grid of panes, leaded and framed. */
const ARCH = 'M14 296V138A150 150 0 0 1 100 8A150 150 0 0 1 186 138V296Z';
const ROSE = { cx: 100, cy: 96, r: 44, r0: 14 };
const rosePt = (deg, r) => {
  const a = (deg * Math.PI) / 180;
  return `${(ROSE.cx + r * Math.cos(a)).toFixed(1)} ${(ROSE.cy + r * Math.sin(a)).toFixed(1)}`;
};
const ROSE_PETALS = Array.from({ length: 8 }, (_, k) => {
  const a = k * 45 - 112.5;
  return `M${ROSE.cx} ${ROSE.cy}L${rosePt(a, ROSE.r)}A${ROSE.r} ${ROSE.r} 0 0 1 ${rosePt(a + 45, ROSE.r)}Z`;
});
const ROSE_SPOKES = Array.from({ length: 8 }, (_, k) => `M${rosePt(k * 45 - 112.5, ROSE.r0)}L${rosePt(k * 45 - 112.5, ROSE.r)}`).join('');
const LOWER_PANES = [150, 200, 250].flatMap((y, row) => [14, 71.3, 128.7].map((x, col) => ({ x, y, k: (row + col) % 4 })));

function ChapelWindow() {
  const id = `chapel${useId().replace(/:/g, '')}`;
  return (
    <div className="inv-chapel inv-in" style={{ '--d': '.1s' }} aria-hidden="true">
      <svg viewBox="0 0 200 312">
        <defs><clipPath id={id}><path d={ARCH} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          <rect className="backlight" x="0" y="0" width="200" height="300" />
          <rect className="pane g4" x="0" y="0" width="200" height="150" style={{ '--i': 0 }} />
          {LOWER_PANES.map((p, i) => <rect key={i} className={`pane g${p.k + 1}`} x={p.x} y={p.y} width="57.3" height="50" style={{ '--i': i + 1 }} />)}
          {ROSE_PETALS.map((d, k) => <path key={k} className={`pane g${(k % 2) + 1}`} d={d} style={{ '--i': k + 3 }} />)}
          <circle className="pane g3" cx={ROSE.cx} cy={ROSE.cy} r={ROSE.r0} style={{ '--i': 2 }} />
          <g className="lead">
            <circle cx={ROSE.cx} cy={ROSE.cy} r={ROSE.r} /><circle cx={ROSE.cx} cy={ROSE.cy} r={ROSE.r0} />
            <path d={`${ROSE_SPOKES}M14 150H186M14 200H186M14 250H186M71.3 150V296M128.7 150V296`} />
          </g>
        </g>
        <path className="frame" d={ARCH} />
        <rect className="sill" x="4" y="296" width="192" height="12" rx="3" />
      </svg>
    </div>
  );
}

/** Tilted orbit rings (dashes flow as each ring turns) with planets placed on the same ellipses. */
const ORBIT_TILT = (-14 * Math.PI) / 180;
const PLANETS = [
  { r: 0.5, a: 200, s: 1.1, c: 'var(--inv-accent)' },
  { r: 0.37, a: 330, s: 0.8, c: 'var(--inv-fx)' },
  { r: 0.24, a: 115, s: 0.55, c: 'var(--inv-cover-text)' },
  { r: 0.5, a: 25, s: 0.6, c: 'var(--inv-cover-text)' },
].map((p) => {
  const t = (p.a * Math.PI) / 180;
  const x = p.r * Math.cos(t);
  const y = p.r * Math.sin(t) * 0.34;
  return { ...p, left: 50 + (x * Math.cos(ORBIT_TILT) - y * Math.sin(ORBIT_TILT)) * 100, top: 50 + (x * Math.sin(ORBIT_TILT) + y * Math.cos(ORBIT_TILT)) * 100 };
});

function Orbits() {
  return (
    <div className="inv-orbits" aria-hidden="true">
      <div className="rings"><i /><i /><i /></div>
      {PLANETS.map((p, i) => (
        <i key={i} className="inv-planet" style={{ left: `${p.left.toFixed(2)}%`, top: `${p.top.toFixed(2)}%`, '--s': `${p.s}em`, '--c': p.c, animationDelay: `${-i * 1.3}s` }} />
      ))}
    </div>
  );
}

const CRESCENT = 'M50 5A45 45 0 1 0 50 95A52 52 0 0 1 50 5Z';

/**
 * A ring of leaves that grows up both sides from a bow at the bottom. Each leaf is drawn at the origin inside a
 * positioned group, so its CSS scale grows it from its base. `--i` is the step up from the bottom, so both sides grow together.
 */
const WREATH_LEAVES = (() => {
  const out = [];
  const n = 40;
  for (let k = 0; k < n; k++) {
    const a = -90 + k * (360 / n);
    const fromBottom = Math.abs((((a - 90) % 360) + 540) % 360 - 180); // 0 at the bottom, 180 at the top
    if (fromBottom < 16) continue; // room for the bow
    const right = Math.cos((a * Math.PI) / 180) >= 0;
    const t = (a * Math.PI) / 180;
    const r = 84 + (k % 2 ? 3 : -3);
    out.push({
      k, x: 100 + r * Math.cos(t), y: 100 + r * Math.sin(t),
      rot: (right ? a - 90 : a + 90) + (k % 2 ? 36 : -36), len: 14 + (k % 3) * 3, i: Math.round(fromBottom / 9), alt: k % 3 === 0,
      berry: k % 4 === 2 ? { x: 100 + (84 + (k % 8 === 2 ? 9 : -9)) * Math.cos(t), y: 100 + (84 + (k % 8 === 2 ? 9 : -9)) * Math.sin(t) } : null,
    });
  }
  return out;
})();
const LEAF = (len) => `M0 0C${len * 0.3} ${-len * 0.3} ${len * 0.75} ${-len * 0.3} ${len} 0C${len * 0.75} ${len * 0.3} ${len * 0.3} ${len * 0.3} 0 0Z`;

function WreathRing() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <circle className="vine" cx="100" cy="100" r="84" />
      {WREATH_LEAVES.map((l) => (
        <g key={l.k} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)})`}>
          <path className={`lf${l.alt ? ' alt' : ''}`} d={LEAF(l.len)} style={{ '--i': l.i }} />
        </g>
      ))}
      {WREATH_LEAVES.filter((l) => l.berry).map((l) => (
        <g key={`b${l.k}`} transform={`translate(${l.berry.x.toFixed(1)} ${l.berry.y.toFixed(1)})`}><circle className="berry" r="2.8" style={{ '--i': l.i }} /></g>
      ))}
      <g className="bow">
        <path d="M100 184C88 171 74 175 77 186C80 195 92 192 100 184ZM100 184C112 171 126 175 123 186C120 195 108 192 100 184Z" />
        <path d="M100 185L89 205L95 203L97 208L100 187ZM100 185L111 205L105 203L103 208L100 187Z" />
        <circle cx="100" cy="184.5" r="4.2" />
      </g>
    </svg>
  );
}

/** 24-point starburst outline for the sunburst layout's date badge. */
const BURST = `polygon(${Array.from({ length: 48 }, (_, k) => {
  const a = (k * 7.5 * Math.PI) / 180;
  const r = k % 2 ? 42 : 50;
  return `${(50 + r * Math.cos(a)).toFixed(1)}% ${(50 + r * Math.sin(a)).toFixed(1)}%`;
}).join(', ')})`;

/** Three tiers drop onto a plate, then three candles light and flicker. */
const drips = (x, y, w, n) => {
  const s = w / n;
  return `M${x} ${y}H${x + w}V${y + 5}${Array.from({ length: n }, () => `q${-s / 2} 10 ${-s} 0`).join('')}Z`;
};
const TIERS = [
  { x: 36, y: 132, w: 128, h: 46, n: 8, dl: '.25s' },
  { x: 54, y: 96, w: 92, h: 36, n: 6, dl: '.55s' },
  { x: 72, y: 66, w: 56, h: 30, n: 4, dl: '.85s' },
];
const SPRINKLES = [[50, 160, 30, 0], [70, 168, -40, 1], [96, 158, 70, 0], [122, 166, 10, 1], [148, 158, -60, 0], [74, 118, 50, 1], [104, 122, -20, 0], [128, 116, 80, 1]];

function CakeArt() {
  return (
    <svg className="inv-cake" viewBox="0 0 200 196" aria-hidden="true">
      <ellipse className="plate" cx="100" cy="182" rx="80" ry="8" />
      {TIERS.map((t, i) => (
        <g key={i} className="tier" style={{ '--dl': t.dl }}>
          <rect x={t.x} y={t.y} width={t.w} height={t.h} rx="4" />
          <path className="drip" d={drips(t.x, t.y, t.w, t.n)} />
          {i < 2 && SPRINKLES.filter((s) => (i === 0 ? s[1] > 140 : s[1] < 140)).map(([sx, sy, r, c]) => (
            <path key={`${sx}-${sy}`} className="sprinkle" d={`M${sx - 3} ${sy}h6`} transform={`rotate(${r} ${sx} ${sy})`} stroke={c ? 'var(--inv-fx)' : 'var(--inv-accent)'} />
          ))}
        </g>
      ))}
      {[86, 100, 114].map((cx, i) => (
        <g key={cx}>
          <rect className="candle" x={cx - 3} y="46" width="6" height="20" rx="1.5" />
          <path className="flame" d={`M${cx} 30C${cx + 5} 37 ${cx + 5.5} 41 ${cx} 45C${cx - 5.5} 41 ${cx - 5} 37 ${cx} 30Z`} fill="#FFB03B" style={{ animationDelay: `1.7s, ${-i * 0.37}s` }} />
          <path d={`M${cx} 36C${cx + 2.4} 39.5 ${cx + 2.4} 42 ${cx} 44C${cx - 2.4} 42 ${cx - 2.4} 39.5 ${cx} 36Z`} fill="#FFF1C4" className="flame" style={{ animationDelay: `1.7s, ${-i * 0.37}s` }} />
        </g>
      ))}
    </svg>
  );
}

/** The host's uploaded logo. `data-panel` lets a click in the editor preview open the Logo settings. */
function InvLogo({ config, className = '', style }) {
  const { event, images, theme } = config;
  const name = event.names || event.title;
  return (
    <div className={`inv-logo ${className}`} data-panel="logo" style={{ '--inv-logo': theme.logoSize ?? 1, ...style }}>
      <img src={images.logo} alt={name ? `${name} logo` : 'Logo'} />
    </div>
  );
}

const showLogo = (config, where) => {
  if (!config.images?.logo) return false;
  const place = config.theme.logoPlacement || 'cover';
  return place === 'both' || place === where;
};

export function InvitationCover({ config }) {
  const { event, venue, images, theme } = config;
  const layout = theme.layout || 'classic';
  const effect = theme.coverEffect || 'none';
  const photo = images.cover;
  const date = event.date ? formatDate(event.date, 'dddd, MMMM D, YYYY') : '';
  const heading = event.names || event.title || '';
  const d = event.date ? dayjs(event.date) : null;
  const logo = showLogo(config, 'cover') ? <InvLogo config={config} className="inv-in" style={{ '--d': '0s' }} /> : null;

  const eyebrow = event.tagline ? <p className="inv-eyebrow inv-in" style={{ '--d': '.1s' }}>{event.tagline}</p> : null;
  const title = <CoverTitle text={heading} theme={theme} />;
  const divider = layout === 'minimal'
    ? <div className="inv-minimal-line inv-in" style={{ '--d': '.7s' }} />
    : <div className="inv-in" style={{ '--d': '.7s' }}><Divider kind={theme.decor} /></div>;
  const meta = (
    <div className="inv-cover-meta inv-in" style={{ '--d': '1s' }}>
      {date && <span>{date}</span>}
      {venue.name && <span>{venue.name}</span>}
    </div>
  );
  const bg = photo && (
    <>
      <div className="inv-cover-photo" style={{ backgroundImage: `url("${photo}")` }} />
      <div className="inv-cover-shade" />
    </>
  );
  const fx = <CoverFx effect={effect} />;
  const decor = <Decor kind={theme.decor} corners={['tl', 'br']} />;
  const cue = <ChevronDown className="inv-scroll-cue" size={26} aria-hidden="true" />;
  const cls = `inv-cover ${layout} fx-${effect}`;
  const portrait = images.primary || photo;

  if (layout === 'curtain') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}<div className="inv-stage" />{decor}
        <div className="inv-cover-content">{logo}{eyebrow}{title}{divider}{meta}</div>
        <div className="inv-drape l" aria-hidden="true" />
        <div className="inv-drape r" aria-hidden="true" />
        <div className="inv-valance" aria-hidden="true" />
        {cue}
      </header>
    );
  }

  if (layout === 'wreath') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-cover-content">
          {logo}{eyebrow}
          <div className="inv-wreath-ring inv-in" style={{ '--d': '.1s' }}>
            <WreathRing />
            <div className="inv-wreath-in">
              {title}{divider}
              {d && <p className="inv-cover-meta inv-in" style={{ '--d': '1s' }}><span>{d.format('MMMM D, YYYY')}</span></p>}
            </div>
          </div>
          {venue.name && <p className="inv-cover-meta inv-in" style={{ '--d': '1.1s', marginTop: '.3em' }}><span>{venue.name}</span></p>}
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'sunburst') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}<div className="inv-rays-glow" /><div className="inv-rays" />{decor}
        <div className="inv-cover-content">
          {logo}{eyebrow}{title}{divider}{meta}
          {d && (
            <div className="inv-burst-badge inv-in" style={{ '--d': '1.1s', '--burst': BURST }} aria-hidden="true">
              <span><b>{d.format('D')}</b>{d.format('MMM')}</span>
            </div>
          )}
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'vinyl') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-cover-content">
          {logo}{eyebrow}
          <div className="inv-vinyl inv-in" style={{ '--d': '.15s' }} aria-hidden="true">
            <div className="inv-record">
              <div className="inv-label"><b>{initials(heading) || '♪'}</b><small>{d ? d.format('MMM D') : 'Side A'}</small></div>
            </div>
            <svg className="inv-tonearm" viewBox="0 0 100 140">
              <path className="arm" d="M80 16L72 70L44 116" />
              <rect className="head" x="34" y="110" width="18" height="12" rx="2" transform="rotate(32 43 116)" />
              <circle className="pivot" cx="80" cy="16" r="11" />
            </svg>
          </div>
          {title}{divider}{meta}
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'letterboard') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        {logo}
        <div className="inv-board inv-in" style={{ '--d': '.1s' }}>{eyebrow}{title}{divider}{meta}</div>
        <div className="inv-board-ledge inv-in" style={{ '--d': '.1s' }} aria-hidden="true" />
        {cue}
      </header>
    );
  }

  if (layout === 'cake') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-cover-content">{logo}<CakeArt />{eyebrow}{title}{divider}{meta}</div>
        {cue}
      </header>
    );
  }

  if (layout === 'bunting') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <Bunting />
        <div className="inv-cover-content">{logo}{eyebrow}{title}{divider}{meta}</div>
        {cue}
      </header>
    );
  }

  if (layout === 'marquee') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        {logo}
        <div className="inv-marquee-sign inv-in" style={{ '--d': '.1s' }}>{eyebrow}{title}{divider}{meta}</div>
        <div className="inv-marquee-posts" aria-hidden="true"><i /><i /></div>
        {cue}
      </header>
    );
  }

  if (layout === 'chapel') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-cover-content">{logo}<ChapelWindow />{eyebrow}{title}{divider}{meta}</div>
        {cue}
      </header>
    );
  }

  if (layout === 'celestial') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}<Orbits />{decor}
        <div className="inv-cover-content">
          {logo}
          <div className="inv-moon inv-in" style={{ '--d': '.05s' }} aria-hidden="true"><svg viewBox="0 0 100 100"><path d={CRESCENT} fill="currentColor" /></svg></div>
          {eyebrow}{title}{divider}{meta}
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'envelope') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-env inv-in" style={{ '--d': '.05s' }}>
          <div className="inv-env-inner">
            <div className="inv-env-back" />
            <div className="inv-env-card">{logo}{eyebrow}{title}{divider}</div>
            <div className="inv-env-front">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path className="side" d="M0 0L50 52L0 100Z" />
                <path className="side" d="M100 0L50 52L100 100Z" />
                <path className="bottom" d="M0 100L50 42L100 100Z" />
                <path className="fold" d="M0 0L50 52L100 0M0 100L50 42L100 100" />
              </svg>
              <span className="inv-env-seal" aria-hidden="true">{initials(heading) || '♥'}</span>
              {(date || venue.name) && <p className="inv-env-meta">{date && <span>{date}</span>}{venue.name && <span>{venue.name}</span>}</p>}
            </div>
          </div>
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'split') {
    return (
      <header data-sec="cover" className={`${cls} inv-split`} style={{ padding: 0 }}>
        {fx}
        <div className="inv-split-body">
          <Decor kind={theme.decor} corners={['br']} />
          <div style={{ position: 'relative' }}>{logo}{eyebrow}{title}{divider}{meta}</div>
        </div>
        <div className="inv-split-img" style={photo ? { backgroundImage: `url("${photo}")` } : undefined}>
          {!photo && <span className="inv-mono">{initials(heading)}</span>}
        </div>
      </header>
    );
  }

  if (layout === 'vintage') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-postcard">
          <div className="inv-stamp" aria-hidden="true">{initials(heading) || '♥'}</div>
          {d && (
            <svg className="inv-postmark" viewBox="0 0 150 60" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="32" cy="30" r="26" /><circle cx="32" cy="30" r="21" strokeWidth=".8" />
              <text x="32" y="29" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" fontWeight="700">{d.format('MMM D').toUpperCase()}</text>
              <text x="32" y="40" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none">{d.format('YYYY')}</text>
              <path d="M64 14c8-5 14 5 22 0s14 5 22 0 14 5 22 0M64 26c8-5 14 5 22 0s14 5 22 0 14 5 22 0M64 38c8-5 14 5 22 0s14 5 22 0 14 5 22 0" />
            </svg>
          )}
          {logo}{eyebrow}{title}{divider}
          <div className="inv-cover-meta inv-in" style={{ '--d': '1s' }}>
            {date && <span>{date}</span>}
            {venue.name && <span>{venue.name}</span>}
          </div>
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'magazine') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-cover-content">
          <div className="inv-mag-top inv-in" style={{ '--d': '.05s' }}>
            <span>{event.tagline || 'Special issue'}</span>
            <span>{d ? d.format('MMM YYYY') : 'Vol. 1'}</span>
          </div>
          {logo}
          {title}
          <div className="inv-mag-photo inv-in" style={{ '--d': '.5s', ...(portrait ? { backgroundImage: `url("${portrait}")` } : {}) }}>
            {!portrait && <span className="inv-mono" style={{ opacity: 0.9 }}>{initials(heading)}</span>}
          </div>
          <div className="inv-mag-lines inv-in" style={{ '--d': '.9s' }}>
            <p><b>{d ? d.format('D MMMM') : 'Save the date'}</b>{d ? d.format('dddd') : ''}</p>
            <p><b>{venue.name || 'The venue'}</b>{timeRange(event) || 'Be there'}</p>
          </div>
        </div>
      </header>
    );
  }

  if (layout === 'medallion') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        {logo}
        <div className="inv-medal inv-in" style={{ '--d': '.1s' }}>
          <MedalRing items={[date, venue.name, event.tagline]} />
          <div className="inv-medal-disc">
            <div>
              {title}
              {divider}
              {d && <p className="inv-cover-meta inv-in" style={{ '--d': '1s', marginTop: 0 }}><span>{d.format('MMMM D, YYYY')}</span></p>}
            </div>
          </div>
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'house') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-cover-content">
          {logo}
          <HouseArt />
          {eyebrow}{title}{divider}{meta}
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'doorway') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        {logo}
        <div className="inv-doorway inv-in" style={{ '--d': '.1s' }}>
          <div className="inv-door">
            <Wreath mono={initials(heading) || '♥'} />
            <div className="inv-door-sign">{eyebrow}{title}{divider}</div>
            <i className="inv-knob" aria-hidden="true" />
          </div>
          <div className="inv-mat">
            {d && <b>{d.format('MMM D, YYYY')}</b>}
            {venue.name && <span>{venue.name}</span>}
          </div>
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'brutal') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        {logo}
        <div className="inv-brutal-card">
          {event.tagline && <span className="inv-brutal-tag">{event.tagline}</span>}
          {title}
          <div className="inv-brutal-row">
            {d && <div className="inv-brutal-date"><b>{d.format('D')}</b><span>{d.format('MMM')}<br />{d.format('YYYY')}</span></div>}
            <div className="inv-brutal-where">{venue.name && <b>{venue.name}</b>}{timeRange(event) && <span>{timeRange(event)}</span>}</div>
          </div>
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'glass') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-glass inv-in" style={{ '--d': '.1s' }}>{logo}{eyebrow}{title}{divider}{meta}</div>
        {cue}
      </header>
    );
  }

  if (layout === 'diagonal') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-diag-top">{logo}{eyebrow}{title}</div>
        <div className="inv-diag-panel">
          <div className="inv-in" style={{ '--d': '.8s' }}>
            <Divider kind={theme.decor} />
            {date && <p className="inv-diag-date">{date}</p>}
            {venue.name && <p className="inv-diag-venue">{venue.name}</p>}
          </div>
        </div>
      </header>
    );
  }

  if (layout === 'neon') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-neon-ring">{logo}{eyebrow}{title}{divider}{meta}</div>
        {cue}
      </header>
    );
  }

  if (layout === 'poster') {
    const marquee = [event.tagline || "You're invited", date, venue.name].filter(Boolean).join('  ✦  ');
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-poster-band" />
        <div className="inv-cover-content">
          {logo}
          {eyebrow}
          {title}
          {d && <div className="inv-poster-date inv-in" style={{ '--d': '.8s' }}><b>{d.format('D')}</b><span>{d.format('MMMM')}<br />{d.format('YYYY')}</span></div>}
          {venue.name && <p className="inv-cover-meta inv-in" style={{ '--d': '1s', marginTop: '1em' }}>{venue.name}</p>}
        </div>
        <div className="inv-marquee" aria-hidden="true"><div>{Array.from({ length: 10 }, (_, i) => <span key={i}>{marquee}</span>)}</div></div>
      </header>
    );
  }

  if (layout === 'ticket') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        {logo}
        <div className="inv-ticket inv-ticket-perf">
          <div className="inv-ticket-main">
            <p className="inv-eyebrow">{event.tagline || 'Admit one'}</p>
            {title}
            <ul className="inv-ticket-rows">
              {d && <li><b>Date</b><span>{d.format('ddd, MMM D, YYYY')}</span></li>}
              {timeRange(event) && <li><b>Time</b><span>{timeRange(event)}</span></li>}
              {venue.name && <li><b>Venue</b><span>{venue.name}</span></li>}
            </ul>
            <div className="inv-barcode" aria-hidden="true" />
          </div>
          <div className="inv-ticket-stub" aria-hidden="true">
            {d ? (<><span>{d.format('MMM')}</span><b>{d.format('D')}</b><span>{d.format('YYYY')}</span></>) : <b>★</b>}
            <small>Admit one</small>
          </div>
        </div>
        {cue}
      </header>
    );
  }

  if (layout === 'polaroid') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-cover-content">
          {logo}
          <div className="inv-pol-stack">
            <span className="inv-pol back b1" />
            <span className="inv-pol back b2" />
            <figure className="inv-pol front">
              <div className="inv-pol-photo" style={portrait ? { backgroundImage: `url("${portrait}")` } : undefined}>
                {!portrait && <span className="inv-mono" style={{ opacity: 0.8 }}>{initials(heading)}</span>}
              </div>
              <figcaption>{title}</figcaption>
            </figure>
            <span className="inv-tape" />
          </div>
          {eyebrow}
          {meta}
        </div>
        {cue}
      </header>
    );
  }

  return (
    <header data-sec="cover" className={cls}>
      {layout !== 'arch' && bg}
      {fx}
      {layout === 'bold' && (
        <>
          <span className="inv-blob" style={{ width: '16em', height: '16em', top: '-5em', right: '-5em' }} />
          <span className="inv-blob" style={{ width: '11em', height: '11em', bottom: '-3em', left: '-3em', opacity: 0.15 }} />
        </>
      )}
      {layout === 'frame' && <div className="inv-frame" />}
      {decor}
      <div className="inv-cover-content">
        {logo}
        {layout === 'arch' && (
          <div className="inv-arch" style={portrait ? { backgroundImage: `url("${portrait}")` } : undefined} role="img" aria-label="Featured photo">
            {!portrait && <span className="inv-mono">{initials(heading)}</span>}
          </div>
        )}
        {eyebrow}{title}{divider}{meta}
        {layout === 'bold' && d && <div className="inv-badge inv-in" style={{ '--d': '1.1s' }}><div><b>{d.format('D')}</b>{d.format('MMM')}</div></div>}
      </div>
      {cue}
    </header>
  );
}

/* ----------------------------------------------------------------- sections */

function Lightbox({ src, onClose }) {
  if (!src) return null;
  return createPortal(
    <div className="inv-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Photo">
      <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 16, right: 16, color: '#fff', background: 'rgba(255,255,255,.15)', border: 0, borderRadius: 99, padding: 10, cursor: 'pointer' }}><X size={22} /></button>
      <img src={src} alt="" />
    </div>,
    document.body,
  );
}

/**
 * Renders a full invitation from its JSON config. `mode`:
 *  - 'public'  : guest view (scroll-reveal animations, live RSVP via `onRsvp`)
 *  - 'editor'  : live preview inside the builder (no animation delays, RSVP inert, empty sections show hints)
 *  - 'thumb'   : cover only, used for template cards
 */
/**
 * `editable` (editor preview only) outlines sections on hover so a click can jump to their settings.
 * `hold` keeps every animation on its first frame — used while the opening envelope still covers the page.
 */
export default function InvitationRenderer({ config, mode = 'public', onRsvp, viewportHeight, editable = false, hold = false }) {
  const [lightbox, setLightbox] = useState(null);
  const { event, host, venue, images, theme, sections: s } = config;
  const editing = mode === 'editor';
  const target = eventMoment(event);
  const style = { ...themeStyle(config), '--inv-vh': mode === 'thumb' ? '40em' : viewportHeight || '100svh' };

  if (mode === 'thumb') {
    return (
      <div className="inv" data-align={theme.align} data-static="" style={style}>
        <InvitationCover config={config} />
      </div>
    );
  }

  const downloadIcs = () => {
    const ics = buildIcs(config);
    if (ics) downloadFile(`${(event.title || 'event').replace(/\W+/g, '-')}.ics`, ics, 'text/calendar;charset=utf-8');
  };

  const link = mapsLink(venue);
  const embed = mapsEmbedUrl(venue);
  // Parents' names belong to the welcome message, so they don't count towards the hosts section.
  const hasHosts = s.hosts?.enabled !== false && [host.hosts, host.sponsors, host.acknowledgments].some((v) => v?.trim());
  const gallery = images.gallery || [];
  const dividerEl = <Divider kind={theme.decor} />;

  const blocks = [];
  const add = (id, props, content) => blocks.push({ id, props, content });

  if (event.description?.trim() || host.parents?.trim()) {
    add('welcome', { eyebrow: 'You are invited' }, (
      <>
        {event.description && <p className="inv-lead inv-pre" style={{ fontSize: '1.25em', fontFamily: 'var(--inv-heading)' }}>{event.description}</p>}
        {host.parents?.trim() && (
          <>
            <div className="inv-rule" />
            <div className="inv-pre inv-soft" style={{ fontFamily: 'var(--inv-heading)', fontSize: '1.2em' }}>{lines(host.parents).join('\n')}</div>
          </>
        )}
      </>
    ));
  }

  if (s.countdown?.enabled && target) {
    add('countdown', { title: s.countdown.title }, <Countdown target={target} />);
  }

  if (s.story?.enabled && (s.story.text || images.primary || images.secondary)) {
    add('story', { title: s.story.title, divider: dividerEl }, (
      <>
        {(images.primary || images.secondary) && (
          <div className="inv-portraits">
            {[images.primary, images.secondary].filter(Boolean).map((src, i) => <div key={i} className="inv-portrait" style={{ backgroundImage: `url("${src}")` }} role="img" aria-label="Portrait" />)}
          </div>
        )}
        {s.story.text && <p className="inv-lead inv-pre inv-soft">{s.story.text}</p>}
      </>
    ));
  }

  if (target || venue.name || venue.address) {
    add('details', { title: 'The Details' }, (
      <>
        <div className="inv-details">
          {target && (
            <div className="inv-detail card-ish">
              <CalendarDays size={26} strokeWidth={1.4} />
              <h3>When</h3>
              <p>{formatDate(event.date, 'dddd')}<br />{formatDate(event.date, 'MMMM D, YYYY')}</p>
            </div>
          )}
          {timeRange(event) && (
            <div className="inv-detail">
              <Clock size={26} strokeWidth={1.4} />
              <h3>Time</h3>
              <p>{timeRange(event)}</p>
            </div>
          )}
          {(venue.name || venue.address) && (
            <div className="inv-detail">
              <MapPin size={26} strokeWidth={1.4} />
              <h3>Where</h3>
              <p>{venue.name}</p>
              {venue.address && <small>{venue.address}</small>}
            </div>
          )}
        </div>
        <div className="inv-btns">
          {target && <button className="inv-btn ghost" onClick={downloadIcs}><CalendarPlus size={16} /> Add to calendar</button>}
          {link && <a className="inv-btn" href={link} target="_blank" rel="noopener noreferrer"><Navigation size={16} /> Get directions</a>}
        </div>
      </>
    ));
  }

  if (hasHosts) {
    add('hosts', { eyebrow: 'With love & gratitude', divider: dividerEl }, (
      <div className="inv-groups" style={{ marginTop: 0 }}>
        {host.hosts?.trim() && <div className="inv-group"><h3>Hosted by</h3><p>{host.hosts}</p></div>}
        {host.sponsors?.trim() && <div className="inv-group"><h3>Sponsors</h3><p>{host.sponsors}</p></div>}
        {host.acknowledgments?.trim() && <div className="inv-group" style={{ gridColumn: '1 / -1' }}><p className="inv-soft" style={{ fontStyle: 'italic' }}>{host.acknowledgments}</p></div>}
      </div>
    ));
  }

  if (s.program?.enabled && (s.program.items?.length || editing)) {
    add('program', { title: s.program.title, divider: dividerEl }, (
      <div className="inv-timeline">
        {s.program.items.map((it) => (
          <div key={it.id} className="inv-tl-item">
            <div className="inv-tl-time">{it.time}</div>
            <div><div className="inv-tl-title">{it.title}</div>{it.description && <div className="inv-tl-desc">{it.description}</div>}</div>
          </div>
        ))}
        {!s.program.items.length && <p className="inv-soft">Add program items in the editor.</p>}
      </div>
    ));
  }

  if (s.entourage?.enabled && (s.entourage.groups?.some((g) => g.members?.trim()) || editing)) {
    add('entourage', { title: s.entourage.title, divider: dividerEl }, (
      <div className="inv-groups">
        {s.entourage.groups.filter((g) => g.members?.trim() || editing).map((g) => (
          <div key={g.id} className="inv-group"><h3>{g.title}</h3><p>{g.members}</p></div>
        ))}
      </div>
    ));
  }

  if (s.gallery?.enabled && (gallery.length || editing)) {
    add('gallery', { title: s.gallery.title, divider: dividerEl }, (
      <div className="inv-gallery">
        {gallery.map((src, i) => (
          <button key={src.slice(-30) + i} className={gallery.length > 2 && i % 5 === 0 ? 'wide' : ''} onClick={() => setLightbox(src)} aria-label={`Open photo ${i + 1}`}>
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
        {!gallery.length && [0, 1, 2].map((i) => <button key={i} disabled style={{ cursor: 'default' }}><ImageIcon size={28} strokeWidth={1.2} /></button>)}
      </div>
    ));
  }

  if (s.dressCode?.enabled && (s.dressCode.text || s.dressCode.colors?.length)) {
    add('dressCode', { title: s.dressCode.title, divider: dividerEl }, (
      <>
        <Shirt className="inv-accent" size={28} strokeWidth={1.3} style={{ margin: '0 auto 1rem', display: 'block' }} />
        {s.dressCode.text && <p className="inv-lead inv-pre inv-soft">{s.dressCode.text}</p>}
        {s.dressCode.colors?.length > 0 && <div className="inv-swatches">{s.dressCode.colors.map((c, i) => <i key={c + i} style={{ background: c }} title={c} />)}</div>}
      </>
    ));
  }

  if (s.gifts?.enabled && s.gifts.text?.trim()) {
    add('gifts', { title: s.gifts.title, divider: dividerEl }, (
      <>
        <Gift className="inv-accent" size={28} strokeWidth={1.3} style={{ margin: '0 auto 1rem', display: 'block' }} />
        <p className="inv-lead inv-pre inv-soft">{s.gifts.text}</p>
      </>
    ));
  }

  if (s.location?.enabled && (venue.name || venue.address)) {
    add('location', { title: s.location.title, divider: dividerEl }, (
      <>
        <p className="inv-lead"><b style={{ fontFamily: 'var(--inv-heading)', fontSize: '1.3em', fontWeight: 600 }}>{venue.name}</b><br /><span className="inv-soft">{venue.address}</span></p>
        {s.location.showMap && embed && <div className="inv-map"><iframe title="Venue map" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>}
        {link && <div className="inv-btns"><a className="inv-btn" href={link} target="_blank" rel="noopener noreferrer"><MapPin size={16} /> Open in Google Maps</a></div>}
      </>
    ));
  }

  if (s.faq?.enabled && s.faq.items?.some((f) => f.q?.trim())) {
    add('faq', { title: s.faq.title, divider: dividerEl }, (
      <div className="inv-faq">
        {s.faq.items.filter((f) => f.q?.trim()).map((f) => (
          <details key={f.id}><summary>{f.q}</summary><p className="inv-pre">{f.a}</p></details>
        ))}
      </div>
    ));
  }

  if (s.rsvp?.enabled) {
    add('rsvp', { title: s.rsvp.title, divider: dividerEl }, (
      <>
        {s.rsvp.message && <p className="inv-lead inv-soft">{s.rsvp.message}</p>}
        {s.rsvp.deadline && <p className="inv-eyebrow" style={{ marginTop: '1rem' }}>Please reply by {formatDate(s.rsvp.deadline)}</p>}
        <RsvpForm config={config} onSubmit={mode === 'public' ? onRsvp : undefined} />
      </>
    ));
  }

  // Honour the host's page order; anything missing from it keeps its natural position at the end.
  const order = Array.isArray(s.order) ? s.order : [];
  const rank = (id) => { const i = order.indexOf(id); return i === -1 ? order.length + SECTION_ORDER.indexOf(id) : i; };
  blocks.sort((a, b) => rank(a.id) - rank(b.id));

  return (
    <div className="inv" data-align={theme.align} data-editable={editable ? '' : undefined} data-hold={hold ? '' : undefined} style={style}>
      <InvitationCover config={config} />
      {blocks.map((b, i) => (
        <Section key={b.id} id={b.id} alt={i % 2 === 1} mode={mode} bg={images.background} reveal={theme.reveal} {...b.props}>{b.content}</Section>
      ))}
      <footer className="inv-footer">
        {showLogo(config, 'footer') && <InvLogo config={config} />}
        <p className="inv-footer-text">
          {event.names || event.title}{!config.page?.hideBranding && <> · Made with <a href={appPath('/')} target="_blank" rel="noopener noreferrer">InviteMe</a></>}
        </p>
      </footer>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
