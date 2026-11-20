import {
  Floaters, FLOATER_KINDS, HEART, PETAL, AUTUMN_LEAF, BUTTERFLY, DOVE_BODY, DOVE_WING, DOVE_FAR_WING, STREAMER,
  CLOUD, PLANE_TOP, PLANE_BODY, NOTE_STEM, NOTE_BEAM, SEED_RAYS,
} from './Floaters';

/** Decorative SVG pieces. All colours inherit `currentColor` (set to the accent). */

const quad = (p0, p1, p2, t) => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
};
const quadTangent = (p0, p1, p2, t) => {
  const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

const Leaf = ({ x, y, rot, len }) => (
  <path
    transform={`translate(${x} ${y}) rotate(${rot})`}
    d={`M0 0 C ${len * 0.3} ${-len * 0.28}, ${len * 0.75} ${-len * 0.28}, ${len} 0 C ${len * 0.75} ${len * 0.28}, ${len * 0.3} ${len * 0.28}, 0 0 Z`}
    fill="currentColor"
  />
);

const Flower = ({ cx, cy, r }) => (
  <g>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx={cx} cy={cy - r * 0.62} rx={r * 0.38} ry={r * 0.62} transform={`rotate(${a} ${cx} ${cy})`} fill="currentColor" opacity=".55" stroke="currentColor" strokeWidth=".6" />
    ))}
    <circle cx={cx} cy={cy} r={r * 0.24} fill="currentColor" />
  </g>
);

const P0 = [-6, 150], P1 = [30, 40], P2 = [150, -6];

function stemLeaves(count, len, startT = 0.08) {
  return Array.from({ length: count }, (_, i) => {
    const t = startT + (i / (count - 1)) * (0.92 - startT);
    const [x, y] = quad(P0, P1, P2, t);
    const a = quadTangent(P0, P1, P2, t);
    const side = i % 2 === 0 ? -48 : 48;
    return { x, y, rot: a + side, len: len * (1 - t * 0.35), key: i };
  });
}

function LeavesCorner() {
  return (
    <svg viewBox="0 0 160 160" className="inv-corner-svg" aria-hidden="true">
      <path d={`M${P0} Q${P1} ${P2}`} fill="none" stroke="currentColor" strokeWidth="1.6" />
      {stemLeaves(9, 26).map(({ key, ...l }) => <Leaf key={key} {...l} />)}
      <path d="M-6 100 Q10 60 48 38" fill="none" stroke="currentColor" strokeWidth="1" opacity=".7" />
      {[0.35, 0.65].map((t, i) => { const [x, y] = quad([-6, 100], [10, 60], [48, 38], t); return <Leaf key={i} x={x} y={y} rot={-70 + i * 40} len={16} />; })}
    </svg>
  );
}

function FloralCorner() {
  const flowers = [[0.28, 17], [0.55, 12], [0.8, 9]].map(([t, r]) => ({ ...(() => { const [cx, cy] = quad(P0, P1, P2, t); return { cx, cy }; })(), r }));
  return (
    <svg viewBox="0 0 160 160" className="inv-corner-svg" aria-hidden="true">
      <path d={`M${P0} Q${P1} ${P2}`} fill="none" stroke="currentColor" strokeWidth="1.4" />
      {stemLeaves(7, 20, 0.15).map(({ key, ...l }) => <Leaf key={key} {...l} />)}
      {flowers.map((f, i) => <Flower key={i} {...f} />)}
      <Flower cx={22} cy={22} r={10} />
    </svg>
  );
}

function GeometricCorner() {
  return (
    <svg viewBox="0 0 160 160" className="inv-corner-svg" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      {[40, 70, 100, 130].map((r) => <path key={r} d={`M${r} 0 A${r} ${r} 0 0 1 0 ${r}`} opacity={1 - r / 190} />)}
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 6) * (Math.PI / 2);
        return <line key={i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * 130} y2={Math.sin(a) * 130} opacity=".55" />;
      })}
      <path d="M0 150 H12 V138 M150 0 V12 H138" strokeWidth="1.4" />
    </svg>
  );
}

const SPARKLE = 'M0 -10 Q0 0 10 0 Q0 0 0 10 Q0 0 -10 0 Q0 0 0 -10Z';
const STARS = [[8, 8, 1.1], [22, 20, .6], [38, 6, .8], [70, 12, 1], [90, 7, .7], [95, 24, 1.1], [12, 42, .7], [85, 46, .6], [6, 70, 1], [93, 68, .8], [18, 88, .7], [40, 94, 1], [66, 90, .6], [88, 92, 1.1], [52, 52, .0]];
function Stars() {
  return (
    <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
      {STARS.filter((s) => s[2] > 0).map(([x, y, s], i) => (
        <svg key={i} viewBox="-10 -10 20 20" className="inv-twinkle"
          style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${s * 1.1}rem`, height: `${s * 1.1}rem`, animationDelay: `${(i % 6) * 0.45}s` }}>
          <path d={SPARKLE} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

const CONFETTI = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 37 + 11) % 97, y: (i * 53 + 7) % 95, r: (i * 47) % 180, s: 6 + ((i * 13) % 9), t: i % 3, c: i % 4,
}));
function Confetti() {
  const colors = ['var(--inv-accent)', 'var(--inv-cover-text)', 'color-mix(in srgb, var(--inv-accent) 45%, white)', 'var(--inv-text)'];
  return (
    <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
      {CONFETTI.map((c, i) => (
        <i key={i} className="inv-float" style={{
          position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, width: c.s, height: c.t === 1 ? c.s : c.s * 0.45, opacity: 0.8,
          background: colors[c.c], borderRadius: c.t === 1 ? '50%' : 2, transform: `rotate(${c.r}deg)`, animationDelay: `${(i % 7) * 0.5}s`,
        }} />
      ))}
    </div>
  );
}

function OrnamentCorner() {
  return (
    <svg viewBox="0 0 160 160" className="inv-corner-svg" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M10 70 C10 30 30 10 70 10" />
      <path d="M22 70 C22 40 40 22 70 22" opacity=".6" />
      <path d="M10 70 C10 90 30 92 30 76 C30 66 20 66 20 74" />
      <path d="M70 10 C90 10 92 30 76 30 C66 30 66 20 74 20" />
      <circle cx="14" cy="14" r="3" fill="currentColor" />
    </svg>
  );
}


const CORNERS = { leaves: LeavesCorner, floral: FloralCorner, geometric: GeometricCorner, ornament: OrnamentCorner };

export function Decor({ kind, corners = ['tl', 'br'] }) {
  if (!kind || kind === 'none') return null;
  if (kind === 'stars') return <div className="inv-decor"><Stars /></div>;
  if (kind === 'confetti') return <div className="inv-decor"><Confetti /></div>;
  if (FLOATER_KINDS.includes(kind)) return <Floaters kind={kind} />;
  const Corner = CORNERS[kind];
  if (!Corner) return null;
  return (
    <div className="inv-decor" aria-hidden="true">
      {corners.map((c) => (
        <div key={c} className={`inv-corner ${c}`} style={{ width: 'min(42cqw, 18rem)', height: 'auto', aspectRatio: '1' }}>
          <Corner />
        </div>
      ))}
    </div>
  );
}

/** Small divider ornament that follows the chosen decoration style. */
export function Divider({ kind }) {
  const common = { className: 'inv-divider', viewBox: '0 0 160 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round' };
  switch (kind) {
    case 'floral':
    case 'leaves':
      return (
        <svg {...common}>
          <path d="M8 12 H64 M96 12 H152" opacity=".7" />
          <g fill="currentColor"><Leaf x={74} y={12} rot={-150} len={11} /><Leaf x={86} y={12} rot={-30} len={11} /><circle cx="80" cy="12" r="2.4" /></g>
        </svg>
      );
    case 'geometric':
      return (
        <svg {...common}>
          <path d="M8 12 H66 M94 12 H152" />
          <path d="M80 3 L89 12 L80 21 L71 12Z" />
          <path d="M80 8 L84 12 L80 16 L76 12Z" fill="currentColor" />
        </svg>
      );
    case 'stars':
      return (
        <svg {...common}>
          <path d="M8 12 H62 M98 12 H152" opacity=".6" />
          <path d={SPARKLE} fill="currentColor" stroke="none" transform="translate(80 12) scale(1.3)" />
          <circle cx="64" cy="12" r="1.5" fill="currentColor" /><circle cx="96" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'ornament':
      return (
        <svg {...common}>
          <path d="M6 12 C30 4 50 20 80 12 C110 4 130 20 154 12" />
          <circle cx="80" cy="12" r="3" fill="currentColor" />
        </svg>
      );
    case 'hearts':
      return (
        <svg {...common}>
          <path d="M8 12 H62 M98 12 H152" opacity=".6" />
          <path d={HEART} fill="currentColor" stroke="none" transform="translate(68 1) scale(.9)" />
        </svg>
      );
    case 'snow':
      return (
        <svg {...common}>
          <path d="M8 12 H60 M100 12 H152" opacity=".6" />
          <g transform="translate(80 12)"><path d="M0 -9V9M-8 -4.5L8 4.5M-8 4.5L8 -4.5" /><circle r="1.6" fill="currentColor" /></g>
        </svg>
      );
    case 'bubbles':
    case 'balloons':
      return (
        <svg {...common} strokeWidth="1.2">
          <circle cx="62" cy="14" r="3.5" /><circle cx="80" cy="9" r="6" /><circle cx="99" cy="15" r="3" />
          <path d="M8 12 H52 M108 12 H152" opacity=".5" />
        </svg>
      );
    case 'petals':
      return (
        <svg {...common}>
          <path d="M8 12 H56 M104 12 H152" opacity=".55" />
          <g fill="currentColor" stroke="none">
            <path d={PETAL} transform="translate(66 1) scale(.4) rotate(-30 12 12)" /><path d={PETAL} transform="translate(75 -2) scale(.5)" /><path d={PETAL} transform="translate(86 1) scale(.4) rotate(30 12 12)" />
          </g>
        </svg>
      );
    case 'autumn':
      return (
        <svg {...common}>
          <path d="M8 12 H62 M98 12 H152" opacity=".55" />
          <path d={AUTUMN_LEAF} fill="currentColor" stroke="none" transform="translate(71 0) scale(.9)" />
        </svg>
      );
    case 'lanterns':
      return (
        <svg {...common}>
          <path d="M8 12 H58 M102 12 H152" opacity=".55" />
          <g fill="currentColor" stroke="none"><rect x="70" y="3" width="6" height="18" rx="3" /><rect x="84" y="3" width="6" height="18" rx="3" opacity=".7" /></g>
          <path d="M73 3V0M87 3V0" />
        </svg>
      );
    case 'fireflies':
      return (
        <svg {...common} strokeWidth="0">
          {[64, 80, 96].map((x, i) => <circle key={x} cx={x} cy={12 + (i === 1 ? -3 : 3)} r={i === 1 ? 3.2 : 2.2} fill="currentColor" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />)}
        </svg>
      );
    case 'fireworks':
      return (
        <svg {...common}>
          <path d="M8 12 H58 M102 12 H152" opacity=".55" />
          <g transform="translate(80 12)">{Array.from({ length: 8 }, (_, k) => <line key={k} x1="3" y1="0" x2="10" y2="0" transform={`rotate(${k * 45})`} />)}</g>
        </svg>
      );
    case 'memphis':
      return (
        <svg {...common} strokeWidth="2.2">
          <path d="M44 14c5-9 9-9 14 0s9 9 14 0 9-9 14 0 9 9 14 0" />
        </svg>
      );
    case 'butterflies':
      return (
        <svg {...common}>
          <path d="M8 12 H62 M98 12 H152" opacity=".55" />
          <g transform="translate(66 0) scale(.7)" fill="currentColor" stroke="none"><path d={BUTTERFLY} opacity=".8" /><ellipse cx="20" cy="17" rx="1.3" ry="7.5" /></g>
        </svg>
      );
    case 'streamers':
      return (
        <svg {...common} strokeWidth="1.6">
          <path d="M8 12 H54 M106 12 H152" opacity=".55" />
          {[64, 80, 96].map((x, i) => <path key={x} d={STREAMER} transform={`translate(${x - 3} ${i === 1 ? 0 : 2}) scale(.5)`} />)}
        </svg>
      );
    case 'doves':
      return (
        <svg {...common}>
          <path d="M8 12 H60 M100 12 H152" opacity=".55" />
          <g transform="translate(66 1) scale(.6)" fill="currentColor" stroke="none"><path d={DOVE_FAR_WING} opacity=".6" /><path d={DOVE_BODY} /><path d={DOVE_WING} /></g>
        </svg>
      );
    case 'notes':
      return (
        <svg {...common}>
          <path d="M8 12 H62 M98 12 H152" opacity=".55" />
          <g transform="translate(68 0)" fill="currentColor" stroke="none"><ellipse cx="5.6" cy="19.2" rx="3.6" ry="2.7" transform="rotate(-22 5.6 19.2)" /><ellipse cx="17.2" cy="17" rx="3.6" ry="2.7" transform="rotate(-22 17.2 17)" /><path d={NOTE_BEAM} /></g>
        </svg>
      );
    case 'dandelions':
      return (
        <svg {...common} strokeWidth=".8">
          <path d="M8 14 H64 M96 14 H152" opacity=".55" strokeWidth="1.1" />
          <g transform="translate(70 -1) scale(.8)"><path d={`${SEED_RAYS}M12 12V29`} /></g>
        </svg>
      );
    case 'foil':
      return (
        <svg {...common}>
          <path d="M8 12 H64 M96 12 H152" opacity=".55" />
          <g fill="currentColor" stroke="none"><path d="M80 3L86 12L80 21L74 12Z" /><path d="M68 12l3-4 3 4-3 4z" opacity=".6" /><path d="M86 12l3-4 3 4-3 4z" opacity=".6" /></g>
        </svg>
      );
    case 'clouds':
      return (
        <svg {...common}>
          <path d="M8 14 H58 M102 14 H152" opacity=".55" />
          <path d={CLOUD} transform="translate(64 2) scale(.5)" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'planes':
      return (
        <svg {...common}>
          <path d="M8 16 H56 M104 16 H152" opacity=".55" />
          <g transform="translate(62 2) scale(.55)" fill="currentColor" stroke="none"><path d={PLANE_TOP} /><path d={PLANE_BODY} opacity=".7" /></g>
        </svg>
      );
    case 'shooting-stars':
      return (
        <svg {...common}>
          <path d="M8 12 H52 M108 12 H152" opacity=".55" />
          <path d="M58 18 L86 8" opacity=".5" strokeWidth="1.6" />
          <path d={SPARKLE} fill="currentColor" stroke="none" transform="translate(92 6) scale(1.1)" />
        </svg>
      );
    case 'bokeh':
      return (
        <svg {...common} strokeWidth="0">
          {[[62, 12, 3], [74, 9, 5], [88, 14, 4], [99, 10, 2.5]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="currentColor" opacity=".55" />)}
        </svg>
      );
    case 'fairy-lights':
      return (
        <svg {...common}>
          <path d="M8 6 Q80 26 152 6" opacity=".6" />
          {[30, 55, 80, 105, 130].map((x) => { const t = (x - 8) / 144; return <circle key={x} cx={x} cy={6 + 40 * t * (1 - t) + 2.5} r="2.6" fill="currentColor" stroke="none" />; })}
        </svg>
      );
    case 'confetti':
      return (
        <svg {...common} strokeWidth="0">
          {[18, 42, 62, 80, 98, 118, 142].map((x, i) => <circle key={x} cx={x} cy={12 + (i % 2 ? 4 : -4)} r={i === 3 ? 4 : 2.5} fill="currentColor" opacity={i === 3 ? 1 : 0.7} />)}
        </svg>
      );
    default:
      return <svg {...common}><path d="M50 12 H110" /></svg>;
  }
}
