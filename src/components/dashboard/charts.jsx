import dayjs from 'dayjs';

/** Compact, dependency-free daily bar chart. */
export function BarChart({ data, height = 180, label = 'Views per day' }) {
  const W = 640;
  const pad = { t: 12, r: 8, b: 26, l: 30 };
  const max = Math.max(4, ...data.map((d) => d.value));
  const niceMax = Math.ceil(max / 4) * 4;
  const innerW = W - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const bw = innerW / data.length;
  const total = data.reduce((n, d) => n + d.value, 0);

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full" role="img" aria-label={`${label}: ${total} total over ${data.length} days`}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.t + innerH - t * innerH;
        return (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} style={{ stroke: 'rgb(var(--c-ink))' }} strokeOpacity={t === 0 ? 0.25 : 0.1} />
            <text x={pad.l - 6} y={y + 3.5} textAnchor="end" fontSize="10" style={{ fill: 'rgb(var(--c-ink-mute))' }}>{Math.round(t * niceMax)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const h = (d.value / niceMax) * innerH;
        const x = pad.l + i * bw + bw * 0.18;
        return (
          <g key={d.date}>
            <rect x={x} y={pad.t + innerH - Math.max(h, d.value ? 2 : 0)} width={bw * 0.64} height={Math.max(h, d.value ? 2 : 0)} rx="3" style={{ fill: 'rgb(var(--c-brand-text))' }}>
              <title>{`${dayjs(d.date).format('MMM D')}: ${d.value}`}</title>
            </rect>
            {(i % Math.ceil(data.length / 7) === 0 || i === data.length - 1) && (
              <text x={x + bw * 0.32} y={height - 8} textAnchor="middle" fontSize="10" style={{ fill: 'rgb(var(--c-ink-mute))' }}>{dayjs(d.date).format('MMM D')}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Stacked horizontal bar for attendance split, with an accessible legend. */
export function SplitBar({ parts }) {
  const total = parts.reduce((n, p) => n + p.value, 0);
  return (
    <div>
      <div className="flex h-3.5 overflow-hidden rounded-full bg-sand-light" role="img" aria-label={parts.map((p) => `${p.label}: ${p.value}`).join(', ')}>
        {total > 0 && parts.map((p) => p.value > 0 && <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, background: p.color }} className="transition-all duration-700" />)}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} /><span className="text-ink-soft">{p.label}</span><b>{p.value}</b></li>
        ))}
      </ul>
    </div>
  );
}
