/** Animated decorations that live behind the cover: rising/falling particles, fireflies, fireworks, Memphis shapes. */

export const HEART = 'M12 21s-7.5-4.6-9.5-9.2C1 8 3.2 4.5 6.7 4.5c2 0 3.4 1 5.3 3 1.9-2 3.3-3 5.3-3 3.5 0 5.7 3.5 4.2 7.3C19.5 16.4 12 21 12 21z';
export const PETAL = 'M12 1C17 6 19 12 12 23C5 12 7 6 12 1z';
export const AUTUMN_LEAF = 'M12 1C13 5 17 6 21 6C20 11 17 12 17 15C17 18 14 19 12.7 19.2V23H11.3V19.2C10 19 7 18 7 15C7 12 4 11 3 6C7 6 11 5 12 1Z';

/** Four wings drawn around a body at x=20 (viewBox 0 0 40 32), so a scaleX about the centre reads as a flap. */
export const BUTTERFLY = 'M20 15C16 4 6 1 3 5C0 10 8 16 20 16ZM20 15C24 4 34 1 37 5C40 10 32 16 20 16ZM20 17C12 17 5 22 7 27C9 31 17 26 20 18ZM20 17C28 17 35 22 33 27C31 31 23 26 20 18Z';
/** Dove in flight facing right, viewBox 0 0 48 32: a fanned tail, raised near wing and a smaller far wing (each beats on its own). */
export const DOVE_BODY = 'M4 20L12 21C16 19 22 18 28 18.5C31 16 35 14.5 39 15C41.5 15.3 43 16.5 44.5 17.5L41 18.5C40 21 37.5 23 33 24C26 27 15 26.5 11 24L3 26L6 22.5Z';
export const DOVE_WING = 'M20 20C17 13 13 6 6 1C13 3 19 6 23 9C22 5 23 3 24 1C27 7 28 13 27 19Z';
export const DOVE_FAR_WING = 'M27 18C28 11 31 6 36 2C35 8 34 13 31 19Z';
/** A curled paper streamer, viewBox 0 0 12 48. */
export const STREAMER = 'M6 1C12 6 0 11 6 16S0 26 6 31 12 41 6 46';

/** A cloud, viewBox 0 -4 64 36. */
export const CLOUD = 'M14 30a10 10 0 0 1 1.5-19.9A14 14 0 0 1 42 6.5a11 11 0 0 1 17.5 9A9 9 0 0 1 58 30Z';
/** Paper plane pointing right, viewBox 0 0 64 32: top wing, lower body, and the dashed swoosh behind it. */
export const PLANE_TOP = 'M62 10L22 4L34 14Z';
export const PLANE_BODY = 'M62 10L34 14L30 26Z';
/** Eighth note (stem + flag; the head is an ellipse) and a beamed pair, viewBox 0 0 24 24. */
export const NOTE_STEM = 'M11.4 17.5V3h1.9c.4 3.1 5.4 4.4 4.5 9.4-1-2.7-2.8-3.7-4.5-3.9v9z';
export const NOTE_BEAM = 'M7.9 18.6V6.2L21 3.4v13h-1.7V7.5L9.6 9.6v9z';
/** Dandelion seed: a fan of fine rays on a stalk, viewBox 0 0 24 32. */
const SEED_TIPS = Array.from({ length: 9 }, (_, k) => {
  const a = ((-165 + k * (150 / 8)) * Math.PI) / 180;
  return [12 + 9 * Math.cos(a), 12 + 9 * Math.sin(a)].map((v) => +v.toFixed(2));
});
export const SEED_RAYS = SEED_TIPS.map(([x, y]) => `M12 12L${x} ${y}`).join('');

export const FALLING = ['snow', 'petals', 'autumn', 'streamers', 'foil'];
export const FLOATER_KINDS = [
  'hearts', 'snow', 'bubbles', 'balloons', 'petals', 'autumn', 'lanterns', 'fireflies', 'fireworks', 'memphis', 'parols', 'ornaments',
  'butterflies', 'streamers', 'doves', 'notes', 'dandelions', 'foil', 'clouds', 'planes', 'shooting-stars', 'bokeh', 'fairy-lights',
];
const NOTE_COLORS = ['var(--inv-accent)', 'var(--inv-fx)', 'var(--inv-cover-text)'];

const BALLOON_COLORS = ['var(--inv-accent)', '#FF6B8B', '#6BCBFF', '#FFD36B', '#7AD7A1', '#B58CFF'];
const BUTTERFLY_COLORS = ['var(--inv-accent)', 'var(--inv-fx)', 'color-mix(in srgb, var(--inv-cover-text) 80%, transparent)'];
const STREAMER_COLORS = ['var(--inv-accent)', 'var(--inv-fx)', '#FF6B8B', '#FFD36B', '#6BCBFF'];
const AUTUMN_COLORS = ['#C8561E', '#E0922A', '#A63A1B', '#D9B13B', '#8C3B17'];
const LANTERN_COLORS = ['#FF9F43', '#FF7A59', '#FFC15E', '#FF8C42'];
const PETAL_TINTS = [0, 1, 2, 3];

// Deterministic pseudo-random layout so server/client/thumbnails always agree.
const ITEMS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 53 + 7) % 94,
  y: (i * 37 + 11) % 90,
  size: 0.7 + (((i * 7) % 10) / 10) * 1.5,
  dur: 10 + ((i * 5) % 11),
  delay: -((i * 3.7) % 16),
  sway: 3 + (i % 4),
  color: i % 6,
}));

function Particles({ kind }) {
  const falling = FALLING.includes(kind);
  const count = { balloons: 9, lanterns: 10, hearts: 16, bubbles: 14, petals: 18, autumn: 16, butterflies: 9, streamers: 16, doves: 7, notes: 12, dandelions: 11 }[kind];
  const items = kind === 'snow' || kind === 'foil'
    ? [...ITEMS, ...ITEMS.map((it, i) => ({ ...it, x: (it.x + 31) % 94, delay: it.delay - 5 - (i % 3) }))].slice(0, kind === 'foil' ? 30 : undefined)
    : ITEMS.slice(0, count);

  return (
    <div className="inv-decor" aria-hidden="true">
      {items.map((it, i) => {
        const speed = { balloons: 1.6, lanterns: 1.9, snow: 0.9, petals: 1.15, autumn: 1.1, butterflies: 1.5, doves: 1.9, notes: 1.3, dandelions: 2.1, foil: 1.05 }[kind] ?? 1;
        const wrap = { left: `${it.x}%`, animationDuration: `${it.dur * speed}s`, animationDelay: `${it.delay}s` };
        const sway = { animationDuration: `${it.sway}s`, animationDelay: `${-i * 0.7}s` };
        let node;

        if (kind === 'hearts') {
          node = <svg viewBox="0 0 24 24" width={`${it.size * 1.5}rem`} height={`${it.size * 1.5}rem`} fill="currentColor" style={{ opacity: 0.35 + (i % 4) * 0.15, ...sway }}><path d={HEART} /></svg>;
        } else if (kind === 'bubbles') {
          node = <i className="inv-bubble" style={{ width: `${it.size * 2.2}rem`, height: `${it.size * 2.2}rem`, ...sway }} />;
        } else if (kind === 'snow') {
          const sz = 0.25 + it.size * 0.32;
          node = <i className="inv-flake" style={{ width: `${sz}rem`, height: `${sz}rem`, opacity: 0.4 + (i % 5) * 0.12, ...sway }} />;
        } else if (kind === 'petals') {
          const t = PETAL_TINTS[i % 4];
          node = (
            <svg viewBox="0 0 24 24" width={`${it.size * 1.15}rem`} height={`${it.size * 1.15}rem`} style={{ ...sway, color: `color-mix(in srgb, var(--inv-accent) ${55 + t * 15}%, #fff)`, opacity: 0.8 }}>
              <path d={PETAL} fill="currentColor" />
              <path d="M12 4C12 10 12 16 12 21" stroke="#fff" strokeOpacity=".4" strokeWidth=".7" fill="none" />
            </svg>
          );
        } else if (kind === 'autumn') {
          node = (
            <svg viewBox="0 0 24 24" width={`${it.size * 1.5}rem`} height={`${it.size * 1.5}rem`} style={{ ...sway, color: AUTUMN_COLORS[i % 5], opacity: 0.88 }}>
              <path d={AUTUMN_LEAF} fill="currentColor" />
            </svg>
          );
        } else if (kind === 'butterflies') {
          const w = 1.9 + it.size * 0.9;
          node = (
            <svg viewBox="0 0 40 32" width={`${w}rem`} height={`${w * 0.8}rem`} style={{ ...sway, color: BUTTERFLY_COLORS[i % 3] }}>
              <g className="inv-flap" style={{ animationDuration: `${0.24 + (i % 4) * 0.05}s`, animationDelay: `${-i * 0.13}s` }}>
                <path d={BUTTERFLY} fill="currentColor" opacity=".82" />
                <ellipse cx="20" cy="17" rx="1.3" ry="7.5" fill="currentColor" />
              </g>
            </svg>
          );
        } else if (kind === 'streamers') {
          const h = 1.8 + it.size * 1.2;
          node = (
            <svg viewBox="0 0 12 48" width={`${h / 4}rem`} height={`${h}rem`} style={{ ...sway, color: STREAMER_COLORS[i % 5] }}>
              <path d={STREAMER} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          );
        } else if (kind === 'doves') {
          // White doves with a soft shadow, so they read on light and dark covers alike.
          const w = 2.4 + it.size * 1.1;
          const wing = { animationDuration: `${0.5 + (i % 3) * 0.08}s`, animationDelay: `${-i * 0.21}s` };
          node = (
            <svg viewBox="0 0 48 32" width={`${w}rem`} height={`${w * 0.67}rem`} className="inv-dove" style={{ ...sway, opacity: 0.6 + (i % 3) * 0.1 }}>
              <g transform={i % 2 ? 'translate(48 0) scale(-1 1)' : undefined} fill="#fff">
                <path d={DOVE_FAR_WING} className="inv-dove-wing" opacity=".75" style={wing} />
                <path d={DOVE_BODY} />
                <path d={DOVE_WING} className="inv-dove-wing" style={wing} />
              </g>
            </svg>
          );
        } else if (kind === 'notes') {
          const w = 1.2 + it.size * 0.8;
          node = (
            <svg viewBox="0 0 24 24" width={`${w}rem`} height={`${w}rem`} style={{ ...sway, color: NOTE_COLORS[i % 3], opacity: 0.55 + (i % 3) * 0.15 }} fill="currentColor">
              {i % 3 === 1 ? (
                <><ellipse cx="5.6" cy="19.2" rx="3.6" ry="2.7" transform="rotate(-22 5.6 19.2)" /><ellipse cx="17.2" cy="17" rx="3.6" ry="2.7" transform="rotate(-22 17.2 17)" /><path d={NOTE_BEAM} /></>
              ) : (
                <><ellipse cx="8.6" cy="18" rx="4.2" ry="3.1" transform="rotate(-22 8.6 18)" /><path d={NOTE_STEM} /></>
              )}
            </svg>
          );
        } else if (kind === 'dandelions') {
          const w = 1.5 + it.size * 0.9;
          node = (
            <svg viewBox="0 0 24 32" width={`${w}rem`} height={`${w * 1.33}rem`} style={{ ...sway, color: 'var(--inv-cover-text)', opacity: 0.45 + (i % 4) * 0.12 }}>
              <path d={`${SEED_RAYS}M12 12V29`} fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" />
              <g fill="currentColor">{SEED_TIPS.map(([x, y], k) => <circle key={k} cx={x} cy={y} r=".9" />)}<ellipse cx="12" cy="29.5" rx="1.2" ry="2" /></g>
            </svg>
          );
        } else if (kind === 'foil') {
          const sz = 0.32 + it.size * 0.28;
          node = (
            <span style={sway}>
              <i className="inv-foil" style={{ width: `${sz}rem`, height: `${sz * 1.5}rem`, animationDuration: `${1.2 + (i % 5) * 0.35}s`, animationDelay: `${-i * 0.3}s` }} />
            </span>
          );
        } else if (kind === 'lanterns') {
          const c = LANTERN_COLORS[i % 4];
          const w = 1.6 + it.size * 1.1;
          node = (
            <svg viewBox="0 0 30 44" width={`${w}rem`} height={`${w * 1.47}rem`} style={{ ...sway, filter: `drop-shadow(0 0 .7rem ${c})` }}>
              <rect x="3" y="0" width="24" height="3" rx="1.5" fill="#6b3a1a" />
              <path d="M5 3h20c3 6 3 24 0 31H5C2 27 2 9 5 3z" fill={c} opacity=".92" />
              <path d="M15 3V34M10 3C8 12 8 26 10 34M20 3c2 9 2 23 0 31" stroke="#fff" strokeOpacity=".35" strokeWidth=".8" fill="none" />
              <rect x="6" y="34" width="18" height="3" rx="1.5" fill="#6b3a1a" />
              <path d="M12 37v5M15 37v7M18 37v5" stroke="#6b3a1a" strokeWidth="1.2" />
            </svg>
          );
        } else {
          const c = BALLOON_COLORS[it.color];
          const w = it.size * 2.6;
          node = (
            <svg viewBox="0 0 40 70" width={`${w}rem`} height={`${w * 1.75}rem`} style={sway}>
              <ellipse cx="20" cy="22" rx="16" ry="20" fill={c} />
              <ellipse cx="14" cy="14" rx="4" ry="7" fill="#fff" opacity=".35" transform="rotate(20 14 14)" />
              <path d="M20 42l-3 5h6z" fill={c} />
              <path d="M20 47c-5 6 5 10 0 22" stroke="currentColor" strokeWidth=".8" fill="none" opacity=".6" />
            </svg>
          );
        }
        return <span key={i} className={`inv-floater${falling ? ' fall' : ''}`} style={wrap}>{node}</span>;
      })}
    </div>
  );
}

function Fireflies() {
  return (
    <div className="inv-decor" aria-hidden="true">
      {ITEMS.map((it, i) => (
        <i key={i} className="inv-firefly" style={{ left: `${it.x}%`, top: `${it.y}%`, animationDuration: `${6 + (i % 7) * 1.3}s`, animationDelay: `${-i * 0.9}s`, width: `${0.25 + (i % 3) * 0.12}rem`, height: `${0.25 + (i % 3) * 0.12}rem` }} />
      ))}
    </div>
  );
}

const BURSTS = [
  { x: 22, y: 20, s: 9, d: 0, c: 'var(--inv-accent)' },
  { x: 76, y: 14, s: 11, d: -1.1, c: 'var(--inv-fx)' },
  { x: 60, y: 46, s: 8, d: -2.2, c: '#fff' },
  { x: 14, y: 58, s: 7, d: -0.6, c: 'var(--inv-fx)' },
  { x: 86, y: 66, s: 8.5, d: -1.7, c: 'var(--inv-accent)' },
  { x: 40, y: 78, s: 6.5, d: -2.7, c: '#fff' },
];

function Fireworks() {
  return (
    <div className="inv-decor" aria-hidden="true">
      {BURSTS.map((b, i) => (
        <svg key={i} viewBox="-50 -50 100 100" className="inv-burst" style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.s}rem`, height: `${b.s}rem`, color: b.c, animationDelay: `${b.d}s`, animationDuration: `${3.2 + (i % 3) * 0.5}s` }}>
          {Array.from({ length: 16 }, (_, k) => (
            <g key={k} transform={`rotate(${k * 22.5})`}>
              <line x1="10" y1="0" x2={k % 2 ? 30 : 40} y2="0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx={k % 2 ? 38 : 47} cy="0" r="2.3" fill="currentColor" />
            </g>
          ))}
        </svg>
      ))}
    </div>
  );
}

const SHAPES = [
  { x: 6, y: 9, k: 'tri', s: 3.2, r: 14, c: 0 }, { x: 80, y: 7, k: 'circle', s: 2.4, r: 0, c: 1 }, { x: 88, y: 30, k: 'squiggle', s: 4.4, r: -10, c: 2 },
  { x: 4, y: 36, k: 'plus', s: 2.4, r: 20, c: 1 }, { x: 70, y: 52, k: 'half', s: 3.6, r: -25, c: 0 }, { x: 12, y: 64, k: 'squiggle', s: 4, r: 12, c: 1 },
  { x: 90, y: 76, k: 'tri', s: 2.6, r: -30, c: 2 }, { x: 28, y: 88, k: 'circle', s: 3, r: 0, c: 0 }, { x: 58, y: 90, k: 'plus', s: 2.2, r: -12, c: 2 },
  { x: 44, y: 5, k: 'half', s: 2.4, r: 160, c: 2 },
];
const MEMPHIS_COLORS = ['var(--inv-accent)', 'var(--inv-fx)', 'var(--inv-cover-text)'];

function Memphis() {
  return (
    <div className="inv-decor" aria-hidden="true">
      {SHAPES.map((sh, i) => {
        const c = MEMPHIS_COLORS[sh.c];
        const common = { width: `${sh.s}rem`, height: `${sh.s}rem`, style: { position: 'absolute', left: `${sh.x}%`, top: `${sh.y}%`, transform: `rotate(${sh.r}deg)`, color: c, animationDelay: `${-i * 0.8}s`, animationDuration: `${6 + (i % 4)}s` }, className: 'inv-float' };
        if (sh.k === 'tri') return <svg key={i} viewBox="0 0 24 24" {...common}><path d="M12 3L22 21H2z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" /></svg>;
        if (sh.k === 'circle') return <svg key={i} viewBox="0 0 24 24" {...common}><circle cx="12" cy="12" r="9" fill="currentColor" /></svg>;
        if (sh.k === 'plus') return <svg key={i} viewBox="0 0 24 24" {...common}><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" /></svg>;
        if (sh.k === 'half') return <svg key={i} viewBox="0 0 24 24" {...common}><path d="M2 16a10 10 0 0 1 20 0z" fill="currentColor" /></svg>;
        return <svg key={i} viewBox="0 0 48 16" {...common} height={`${sh.s / 3}rem`}><path d="M2 8c4-8 8-8 12 0s8 8 12 0 8-8 12 0 4 4 6 3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>;
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- Christmas: hanging parols and ornaments */

const starPoints = (cx, cy, R, r, n = 5) => Array.from({ length: n * 2 }, (_, k) => {
  const a = ((-90 + k * (180 / n)) * Math.PI) / 180;
  const rad = k % 2 ? r : R;
  return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
}).join(' ');
const OUTER_STAR = starPoints(30, 34, 28, 12.5);
const INNER_STAR = starPoints(30, 34, 15, 6.5);

const PAROL_COLORS = ['#FFC83D', '#E63946', '#35B56C', '#FFF1C9'];
const ORNAMENT_COLORS = ['#D62839', '#E9B949', '#2E9A5B', 'var(--inv-accent)'];
const HANGERS = [6, 19, 32, 46, 60, 74, 88].map((x, i) => ({
  x, len: 1.6 + ((i * 7) % 5) * 1.5, size: 2.3 + ((i * 3) % 4) * 0.6, dur: 4.2 + (i % 4) * 0.8, delay: -i * 0.9, c: i % 4,
}));

/** A Filipino parol: a lit five-point star lantern with a tassel, swinging gently from the top edge. */
const Parol = ({ color }) => (
  <svg viewBox="0 0 60 82" style={{ filter: `drop-shadow(0 0 .8rem ${color})` }}>
    <polygon points={OUTER_STAR} fill={color} stroke="#fff" strokeOpacity=".5" strokeWidth="1" strokeLinejoin="round" />
    <polygon className="inv-parol-glow" points={INNER_STAR} fill="#fff" opacity=".7" />
    <circle cx="30" cy="34" r="3" fill={color} />
    <path d="M30 58V80M26 58l-3 20M34 58l3 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** A glass bauble with a gold cap, hanging from a thread. */
const Ornament = ({ color }) => (
  <svg viewBox="0 0 40 54">
    <rect x="15" y="0" width="10" height="7" rx="1.8" fill="#D8B04A" />
    <circle cx="20" cy="31" r="19" fill={color} />
    <path d="M2.5 33C10 40 30 40 37.5 33" stroke="#fff" strokeOpacity=".3" strokeWidth="2.2" fill="none" />
    <ellipse cx="13" cy="21" rx="4" ry="7" fill="#fff" opacity=".35" transform="rotate(25 13 21)" />
  </svg>
);

function Hangers({ kind }) {
  return (
    <div className="inv-decor" aria-hidden="true">
      {HANGERS.map((h, i) => (
        <span key={i} className="inv-hang" style={{ left: `${h.x}%`, width: `${h.size}rem`, animationDuration: `${h.dur}s`, animationDelay: `${h.delay}s` }}>
          <i className="inv-string" style={{ height: `${h.len}rem` }} />
          {kind === 'parols' ? <Parol color={PAROL_COLORS[h.c]} /> : <Ornament color={ORNAMENT_COLORS[h.c]} />}
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- clouds, paper planes, shooting stars, bokeh, fairy lights */

const CLOUDS = [
  { y: 5, s: 7, d: 70, delay: -10, o: 0.9 }, { y: 17, s: 4.5, d: 55, delay: -40, o: 0.7 }, { y: 33, s: 9, d: 92, delay: -25, o: 0.55 },
  { y: 57, s: 5.5, d: 64, delay: -5, o: 0.75 }, { y: 73, s: 8, d: 86, delay: -60, o: 0.6 }, { y: 87, s: 4, d: 50, delay: -30, o: 0.8 },
];
function Clouds() {
  return (
    <div className="inv-decor" aria-hidden="true">
      {CLOUDS.map((c, i) => (
        <svg key={i} className="inv-cloud" viewBox="0 -4 64 36" style={{ top: `${c.y}%`, width: `${c.s}rem`, opacity: c.o, animationDuration: `${c.d}s`, animationDelay: `${c.delay}s` }}>
          <path d={CLOUD} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

const PLANES = [
  { y0: 80, y1: 16, d: 15, delay: -2, s: 2.3 }, { y0: 56, y1: 4, d: 19, delay: -10, s: 1.6 },
  { y0: 96, y1: 46, d: 17, delay: -13, s: 1.9 }, { y0: 38, y1: 0, d: 23, delay: -6, s: 1.3 },
];
function Planes() {
  return (
    <div className="inv-decor" aria-hidden="true">
      {PLANES.map((p, i) => (
        <span key={i} className="inv-plane" style={{ '--y0': `${p.y0}%`, '--y1': `${p.y1}%`, animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }}>
          <svg viewBox="0 0 64 32" style={{ width: `${p.s * 2}rem`, animationDelay: `${-i * 0.8}s` }}>
            <path d="M2 27C10 31 18 18 28 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2.5 3" opacity=".55" />
            <path d={PLANE_TOP} fill="currentColor" />
            <path d={PLANE_BODY} fill="currentColor" opacity=".7" />
          </svg>
        </span>
      ))}
    </div>
  );
}

const SHOOTERS = [
  { x: 6, y: 6, a: 32, d: 7, delay: -1 }, { x: 62, y: 3, a: 148, d: 9, delay: -4.5 },
  { x: 18, y: 32, a: 26, d: 11, delay: -7 }, { x: 90, y: 20, a: 152, d: 8, delay: -2.6 },
];
function ShootingStars() {
  return (
    <div className="inv-decor" aria-hidden="true">
      {ITEMS.slice(0, 16).map((it, i) => <i key={`t${i}`} className="inv-tw" style={{ left: `${it.x}%`, top: `${it.y}%`, animationDelay: `${-i * 0.7}s`, scale: `${0.6 + (i % 3) * 0.4}` }} />)}
      {SHOOTERS.map((s, i) => (
        <span key={i} className="inv-shoot" style={{ left: `${s.x}%`, top: `${s.y}%`, rotate: `${s.a}deg` }}>
          <i style={{ animationDuration: `${s.d}s`, animationDelay: `${s.delay}s` }} />
        </span>
      ))}
    </div>
  );
}

const BOKEH_COLORS = ['var(--inv-accent)', 'var(--inv-fx)', 'var(--inv-cover-text)'];
function Bokeh() {
  return (
    <div className="inv-decor" aria-hidden="true">
      {ITEMS.slice(0, 15).map((it, i) => {
        const s = 2 + ((i * 7) % 6) * 0.9;
        return <i key={i} className="inv-bokeh" style={{ left: `${it.x}%`, top: `${it.y}%`, width: `${s}rem`, height: `${s}rem`, '--c': BOKEH_COLORS[i % 3], animationDuration: `${8 + (i % 5) * 2}s`, animationDelay: `${-i * 1.3}s` }} />;
      })}
    </div>
  );
}

/** Two drooping strands of glowing bulbs across the top; each bulb sits on its strand's parabola and twinkles on its own beat. */
const STRANDS = [{ top: 0.1, sag: 3.4, n: 14, shift: 0 }, { top: -0.5, sag: 6.2, n: 17, shift: 0.5 }];
const BULB_COLORS = ['#FFE7A6', '#FFF3D1', 'var(--inv-accent)', '#FFE7A6', 'var(--inv-fx)'];
function FairyLights() {
  return (
    <div className="inv-decor" aria-hidden="true">
      {STRANDS.map((st, k) => (
        <div key={k} className="inv-strand" style={{ top: `${st.top}em`, height: `${st.sag}em` }}>
          <svg viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 0Q50 20 100 0" /></svg>
          {Array.from({ length: st.n }, (_, i) => {
            const u = (i + 0.5 + st.shift * 0.5) / (st.n + st.shift * 0.5);
            return <i key={i} className="inv-bulb" style={{ left: `${(u * 100).toFixed(2)}%`, top: `${(400 * u * (1 - u)).toFixed(2)}%`, '--c': BULB_COLORS[(i + k * 2) % 5], animationDuration: `${1.8 + ((i * 7 + k) % 5) * 0.45}s`, animationDelay: `${-((i * 7 + k * 3) % 10) * 0.37}s` }} />;
          })}
        </div>
      ))}
    </div>
  );
}

export function Floaters({ kind }) {
  if (kind === 'clouds') return <Clouds />;
  if (kind === 'planes') return <Planes />;
  if (kind === 'shooting-stars') return <ShootingStars />;
  if (kind === 'bokeh') return <Bokeh />;
  if (kind === 'fairy-lights') return <FairyLights />;
  if (kind === 'parols' || kind === 'ornaments') return <Hangers kind={kind} />;
  if (kind === 'fireflies') return <Fireflies />;
  if (kind === 'fireworks') return <Fireworks />;
  if (kind === 'memphis') return <Memphis />;
  return <Particles kind={kind} />;
}
