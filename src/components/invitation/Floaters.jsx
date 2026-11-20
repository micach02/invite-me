/** Animated decorations that live behind the cover: rising/falling particles, fireflies, fireworks, Memphis shapes. */

export const HEART = 'M12 21s-7.5-4.6-9.5-9.2C1 8 3.2 4.5 6.7 4.5c2 0 3.4 1 5.3 3 1.9-2 3.3-3 5.3-3 3.5 0 5.7 3.5 4.2 7.3C19.5 16.4 12 21 12 21z';
export const PETAL = 'M12 1C17 6 19 12 12 23C5 12 7 6 12 1z';
export const AUTUMN_LEAF = 'M12 1C13 5 17 6 21 6C20 11 17 12 17 15C17 18 14 19 12.7 19.2V23H11.3V19.2C10 19 7 18 7 15C7 12 4 11 3 6C7 6 11 5 12 1Z';

export const FALLING = ['snow', 'petals', 'autumn'];
export const FLOATER_KINDS = ['hearts', 'snow', 'bubbles', 'balloons', 'petals', 'autumn', 'lanterns', 'fireflies', 'fireworks', 'memphis', 'parols', 'ornaments'];

const BALLOON_COLORS = ['var(--inv-accent)', '#FF6B8B', '#6BCBFF', '#FFD36B', '#7AD7A1', '#B58CFF'];
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
  const count = { balloons: 9, lanterns: 10, hearts: 16, bubbles: 14, petals: 18, autumn: 16 }[kind];
  const items = kind === 'snow'
    ? [...ITEMS, ...ITEMS.map((it, i) => ({ ...it, x: (it.x + 31) % 94, delay: it.delay - 5 - (i % 3) }))]
    : ITEMS.slice(0, count);

  return (
    <div className="inv-decor" aria-hidden="true">
      {items.map((it, i) => {
        const speed = { balloons: 1.6, lanterns: 1.9, snow: 0.9, petals: 1.15, autumn: 1.1 }[kind] ?? 1;
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

export function Floaters({ kind }) {
  if (kind === 'parols' || kind === 'ornaments') return <Hangers kind={kind} />;
  if (kind === 'fireflies') return <Fireflies />;
  if (kind === 'fireworks') return <Fireworks />;
  if (kind === 'memphis') return <Memphis />;
  return <Particles kind={kind} />;
}
