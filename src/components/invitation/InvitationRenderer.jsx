import { useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, CalendarPlus, ChevronDown, Clock, Gift, ImageIcon, MapPin, Navigation, Shirt, X } from 'lucide-react';
import './invitation.css';
import './invitation-fx.css';
import './invitation-fx2.css';
import { Decor, Divider } from './Decor';
import Countdown from './Countdown';
import RsvpForm from './RsvpForm';
import { initials, themeStyle } from './theme';
import { buildIcs, downloadFile, eventMoment, formatDate, mapsEmbedUrl, mapsLink, timeRange } from '../../lib/utils';
import dayjs from 'dayjs';

/* ------------------------------------------------------------------ helpers */

const REVEAL_FROM = {
  'fade-up': { opacity: 0, y: 28 },
  zoom: { opacity: 0, scale: 0.9 },
  slide: { opacity: 0, x: -48 },
  blur: { opacity: 0, filter: 'blur(14px)', y: 14 },
};

function Reveal({ children, mode, delay = 0, variant = 'fade-up' }) {
  const reduce = useReducedMotion();
  if (mode !== 'public' || reduce) return <div>{children}</div>;
  return (
    <motion.div
      initial={REVEAL_FROM[variant] ?? REVEAL_FROM['fade-up']} whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
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
const FIT_CAP = { magazine: 7, poster: 7, medallion: 7.5, ticket: 9.5, glass: 8, neon: 9.5, polaroid: 10, vintage: 11, split: 9, bold: 12, arch: 12 };

function CoverTitle({ text, theme }) {
  const longest = Math.max(1, ...text.split(/\s+/).map((w) => w.length));
  const fit = Math.max(0.5, Math.min(1, (FIT_CAP[theme.layout] ?? 14) / longest));
  const shimmer = theme.coverEffect === 'shimmer';
  let anim = theme.titleAnim || 'rise';
  if (shimmer && ['letters', 'rise', 'typewriter', 'flip'].includes(anim)) anim = 'blur';
  const cls = `inv-h inv-cover-title${shimmer ? ' shimmer' : ''}${anim === 'blur' && !shimmer ? ' t-blur' : ''}`;

  let body = text;
  if (['letters', 'typewriter', 'flip'].includes(anim)) {
    const variant = anim === 'typewriter' ? ' type' : anim === 'flip' ? ' flip' : '';
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
  }
  return (
    <h1 className={cls} aria-label={text} style={fit < 1 ? { '--inv-fit': fit } : undefined}>
      {typeof body === 'string' ? body : <span aria-hidden="true">{body}</span>}
    </h1>
  );
}

const WAVE = 'M0 60 Q300 0 600 60 T1200 60 T1800 60 T2400 60 V120 H0Z';

function CoverFx({ effect }) {
  if (effect === 'aurora') return <div className="inv-fx aurora" aria-hidden="true"><i /><i /><i /></div>;
  if (effect === 'shine') return <div className="inv-fx shine" aria-hidden="true"><i /><i /></div>;
  if (effect === 'spotlight') return <div className="inv-fx spot" aria-hidden="true"><i /><i /></div>;
  if (effect === 'waves') {
    return (
      <div className="inv-fx waves" aria-hidden="true">
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none"><path d={WAVE} /></svg>
        <svg viewBox="0 0 2400 120" preserveAspectRatio="none"><path d={WAVE} /></svg>
      </div>
    );
  }
  return null;
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

export function InvitationCover({ config }) {
  const { event, venue, images, theme } = config;
  const layout = theme.layout || 'classic';
  const effect = theme.coverEffect || 'none';
  const photo = images.cover;
  const date = event.date ? formatDate(event.date, 'dddd, MMMM D, YYYY') : '';
  const heading = event.names || event.title || '';
  const d = event.date ? dayjs(event.date) : null;

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

  if (layout === 'split') {
    return (
      <header data-sec="cover" className={`${cls} inv-split`} style={{ padding: 0 }}>
        {fx}
        <div className="inv-split-body">
          <Decor kind={theme.decor} corners={['br']} />
          <div style={{ position: 'relative' }}>{eyebrow}{title}{divider}{meta}</div>
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
          {eyebrow}{title}{divider}
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

  if (layout === 'glass') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-glass inv-in" style={{ '--d': '.1s' }}>{eyebrow}{title}{divider}{meta}</div>
        {cue}
      </header>
    );
  }

  if (layout === 'diagonal') {
    return (
      <header data-sec="cover" className={cls}>
        {bg}{fx}{decor}
        <div className="inv-diag-top">{eyebrow}{title}</div>
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
        <div className="inv-neon-ring">{eyebrow}{title}{divider}{meta}</div>
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
export default function InvitationRenderer({ config, mode = 'public', onRsvp, viewportHeight }) {
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
  const hasHosts = [host.parents, host.hosts, host.sponsors, host.acknowledgments].some((v) => v?.trim());
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

  return (
    <div className="inv" data-align={theme.align} style={style}>
      <InvitationCover config={config} />
      {blocks.map((b, i) => (
        <Section key={b.id} id={b.id} alt={i % 2 === 1} mode={mode} bg={images.background} reveal={theme.reveal} {...b.props}>{b.content}</Section>
      ))}
      <footer className="inv-footer">
        {event.names || event.title} · Made with <a href="/" target="_blank" rel="noopener noreferrer">InviteMe</a>
      </footer>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
