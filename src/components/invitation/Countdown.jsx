import { useEffect, useState } from 'react';

export default function Countdown({ target }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!target) return null;
  const diff = target.valueOf() - now;
  if (diff <= 0) {
    return <p className="inv-h" style={{ fontSize: '1.8em', marginTop: '1.5rem' }}>The celebration is here — thank you for being part of it.</p>;
  }
  const s = Math.floor(diff / 1000);
  const parts = [
    ['Days', Math.floor(s / 86400)],
    ['Hours', Math.floor((s % 86400) / 3600)],
    ['Minutes', Math.floor((s % 3600) / 60)],
    ['Seconds', s % 60],
  ];
  return (
    <div className="inv-count" role="timer" aria-label="Countdown to the event">
      {parts.map(([label, value]) => (
        <div key={label}>
          <b>{String(value).padStart(2, '0')}</b>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}
