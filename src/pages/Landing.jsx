import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BarChart3, Check, ChevronDown, Clock, Heart, Palette, QrCode, Quote, Share2, Smartphone, Sparkles, Star, Users, Wand2,
} from 'lucide-react';
import PublicNav from '../components/layout/PublicNav';
import Footer from '../components/layout/Footer';
import TemplateThumb from '../components/invitation/TemplateThumb';
import { TEMPLATES } from '../data/templates';
import { LIBRARY_CATEGORIES } from '../data/constants';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useAuth } from '../context/AuthContext';
import { SHOW_PRICING } from '../config/site';

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } };

function Heading({ eyebrow, title, text, center = true }) {
  return (
    <motion.div {...fade} className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className="text-xs font-semibold uppercase tracking-[.28em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl font-semibold leading-[1.08] sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-ink-soft">{text}</p>}
    </motion.div>
  );
}

function Phone({ id, className = '', style }) {
  return (
    <div className={`rounded-[2.2rem] bg-night p-2 shadow-lift ${className}`} style={style}>
      <div className="overflow-hidden rounded-[1.7rem]"><TemplateThumb templateId={id} rounded="rounded-none" /></div>
    </div>
  );
}

const STEPS = [
  { icon: Palette, title: 'Pick a template', text: 'Start from a professionally designed layout for your occasion.' },
  { icon: Wand2, title: 'Make it yours', text: 'Edit words, photos, colours and fonts — see every change live.' },
  { icon: Share2, title: 'Publish & share', text: 'Get a unique link and QR code. Send it by Messenger, WhatsApp or Facebook.' },
  { icon: Users, title: 'Collect RSVPs', text: 'Guests reply in one tap. You see the guest list update in real time.' },
];

const FEATURES = [
  [Smartphone, 'Mobile-first by design', 'Opens beautifully inside Messenger, WhatsApp and every phone browser.'],
  [Sparkles, 'Animated envelope opening', 'A tasteful reveal that makes guests feel the occasion before they read a word.'],
  [Clock, 'Live countdown', 'Build anticipation with a countdown that ticks down to your big day.'],
  [Users, 'RSVP & guest list', 'Track attendance, meal choices, plus-ones and messages — export to CSV.'],
  [BarChart3, 'Views & analytics', 'See how many people opened your invitation and when.'],
  [QrCode, 'QR codes', 'Download a print-ready QR for save-the-dates, programs and table cards.'],
];

const QUOTES = [
  ['Camille R.', 'Bride', 'Our guests thought we hired a designer. It took us twenty minutes, and the RSVP list saved my sanity.'],
  ['Marco D.', 'Dad of a debutante', 'My 70-year-old aunt opened it from Messenger without a single question. That is the test.'],
  ['Priya S.', 'Event planner', 'I run six events a month. Duplicating an invitation and swapping the details is a game changer.'],
];

// NOTE: marketing copy only — review before setting SHOW_PRICING = true (nothing enforces these limits).
const PLANS = [
  { name: 'Free', price: '$0', note: 'forever', features: ['1 published invitation', 'All templates', 'RSVP collection', 'Shareable link'], cta: 'Start free' },
  { name: 'Celebrate', price: '$12', note: 'per event', features: ['Unlimited guests', 'QR code downloads', 'Remove InviteMe footer', 'Custom link', 'Priority support'], cta: 'Choose Celebrate', featured: true },
  { name: 'Studio', price: '$29', note: 'per month', features: ['Unlimited invitations', 'Team access', 'CSV exports', 'Analytics history', 'Email notifications'], cta: 'Choose Studio' },
];

const FAQ = [
  ['Is InviteMe really free?', 'Yes. During our launch every feature is free — unlimited invitations, guests and RSVPs, QR codes, CSV exports and removing the InviteMe footer. No card needed.'],
  ['Do my guests need an account or app?', 'No. Guests just tap your link — it opens in their browser and they can RSVP right there.'],
  ['Can I edit my invitation after publishing?', 'Yes. Changes save automatically and go live immediately at the same link.'],
  ['Can I share through Messenger and WhatsApp?', 'Yes. One tap sends your link to Facebook, Messenger or WhatsApp, and you can download a QR code too.'],
  ['How do I know who is coming?', 'Every RSVP lands in your dashboard with attendance, guest count, meal preference and messages. Export it any time.'],
  ['Which occasions are supported?', 'Weddings, birthdays, baptisms, debuts, anniversaries, engagements, baby showers, house blessings, graduations, corporate and holiday events — and anything else.'],
];

export default function Landing() {
  const { user } = useAuth();
  const [open, setOpen] = useState(0);
  useDocumentMeta({
    title: 'InviteMe — Beautiful Digital Invitations for Every Occasion',
    description: 'Design, publish and share digital invitations with RSVP tracking. Weddings, birthdays, baptisms, debuts and more.',
  });
  const FEATURED = ['aurora-nights', 'evergreen-vows', 'neon-glow', 'cherry-blossom', 'royal-shimmer', 'balloon-bash', 'vintage-postcard', 'sunset-soiree', 'main-character', 'admit-one', 'midnight-garden', 'floating-hearts'];
  const featured = FEATURED.map((id) => TEMPLATES.find((t) => t.id === id)).filter(Boolean);

  return (
    <div className="overflow-x-clip">
      <PublicNav />

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[780px] bg-[radial-gradient(60%_60%_at_80%_10%,rgba(216,201,178,.5),transparent),radial-gradient(40%_50%_at_0%_30%,rgba(69,92,80,.10),transparent)] dark:opacity-25" />
        <div className="container-x relative grid items-center gap-14 pb-20 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-1.5 text-xs font-medium text-ink-soft"><Heart size={13} className="text-accent" /> Digital invitations, made personal</p>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.4rem]">Every Special Moment Deserves a Beautiful Invitation.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Design a stunning invitation in minutes, share it with a single link, and watch the RSVPs roll in. No design skills, no printing, no stress.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to={user ? '/templates?start=1' : '/register'} className="btn-primary btn-lg w-full !rounded-full sm:w-auto">Create Your Invitation <ArrowRight size={18} /></Link>
              <Link to="/templates" className="btn-secondary btn-lg w-full !rounded-full sm:w-auto">Explore Templates</Link>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-sm text-ink-soft">
              {['Every feature free', 'No app for guests', 'RSVP tracking built in'].map((t) => <li key={t} className="flex items-center gap-2"><Check size={15} className="text-brand" />{t}</li>)}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.15 }} className="relative mx-auto h-[520px] w-full max-w-[520px] sm:h-[600px]" aria-hidden="true">
            {/* Static position/rotation lives on the wrapper; framer-motion owns the inner transform (float). */}
            <div className="absolute left-0 top-12 w-[44%] -rotate-[8deg]"><motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}><Phone id="blush-garden" /></motion.div></div>
            <div className="absolute right-0 top-20 w-[44%] rotate-[7deg]"><motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}><Phone id="aurora-nights" /></motion.div></div>
            <div className="absolute left-1/2 top-0 z-10 w-[50%] -translate-x-1/2"><motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}><Phone id="evergreen-vows" /></motion.div></div>
            <div className="absolute -right-2 bottom-16 z-20 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-lift">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check size={18} /></span>
              <div><p className="text-sm font-semibold">Anna Cruz is attending</p><p className="text-xs text-ink-mute">+2 guests · just now</p></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container-x py-20">
        <Heading eyebrow="How it works" title="From idea to invitation in four easy steps" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div key={s.title} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }} className="card relative p-7">
              <span className="absolute right-6 top-5 font-serif text-5xl text-sand">{i + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white"><s.icon size={22} strokeWidth={1.6} /></span>
              <h3 className="mt-6 font-serif text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-surface py-20">
        <div className="container-x">
          <Heading eyebrow="Categories" title="Whatever you are celebrating" text="Choose an occasion and jump straight to designs made for it." />
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {LIBRARY_CATEGORIES.map((c, i) => (
              <motion.div key={c.id} {...fade} transition={{ ...fade.transition, delay: i * 0.05 }} className="w-[calc(50%-.5rem)] sm:w-[calc(25%-.75rem)]">
                <Link to={`/templates?category=${c.id}`} className="group flex flex-col items-center gap-3 rounded-3xl border border-line-strong bg-canvas px-4 py-8 text-center transition hover:-translate-y-1 hover:border-brand hover:bg-brand-50 hover:shadow-card">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-brand shadow-card transition group-hover:bg-brand group-hover:text-white"><c.icon size={24} strokeWidth={1.5} /></span>
                  <span className="font-serif text-xl font-semibold">{c.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured templates: slow auto-scrolling gallery of live covers (pauses on hover, static for reduced motion) */}
      <section className="overflow-hidden py-20" aria-label="Featured templates">
        <div className="container-x flex flex-wrap items-end justify-between gap-4">
          <Heading center={false} eyebrow="Templates" title="Designs guests will remember" />
          <Link to="/templates" className="btn-secondary">Browse all {TEMPLATES.length} templates <ArrowRight size={16} /></Link>
        </div>
        <div className="relative mt-12 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
          <div className="flex w-max animate-marquee gap-5 px-2.5 hover:[animation-play-state:paused]">
            {[...featured, ...featured].map((t, i) => (
              <Link key={`${t.id}-${i}`} to={`/templates?q=${encodeURIComponent(t.name)}`} aria-hidden={i >= featured.length ? 'true' : undefined} tabIndex={i >= featured.length ? -1 : undefined} className="group block w-44 shrink-0 sm:w-52">
                <div className="overflow-hidden rounded-2xl shadow-card ring-1 ring-ink/5 transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lift"><TemplateThumb templateId={t.id} rounded="rounded-none" /></div>
                <p className="mt-3 font-display text-sm font-bold">{t.name}</p>
                <p className="text-xs text-ink-mute">{t.style}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why + features */}
      <section id="features" className="scroll-mt-20 bg-brand py-24 text-white">
        <div className="container-x">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#D8C9B2]">Why InviteMe</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-[1.08] sm:text-5xl">Everything a paper invitation can’t do</h2>
            <p className="mt-4 text-lg text-white/70">Beautiful on every screen, effortless to share, and it tells you who is coming.</p>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([Icon, title, text], i) => (
              <motion.div key={title} {...fade} transition={{ ...fade.transition, delay: i * 0.06 }} className="rounded-3xl border border-white/10 bg-surface/[.06] p-7 backdrop-blur">
                <Icon size={26} strokeWidth={1.4} className="text-[#D8C9B2]" />
                <h3 className="mt-5 font-serif text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x py-24">
        <Heading eyebrow="Loved by hosts" title="Stories from happy celebrations" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {QUOTES.map(([name, role, text], i) => (
            <motion.figure key={name} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }} className="card p-8">
              <Quote className="text-accent" size={28} strokeWidth={1.4} />
              <blockquote className="mt-4 font-serif text-xl leading-snug">{text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-semibold text-white">{name[0]}</span>
                <span><span className="block text-sm font-semibold">{name}</span><span className="text-xs text-ink-mute">{role}</span></span>
                <span className="ml-auto flex text-accent" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, k) => <Star key={k} size={13} fill="currentColor" />)}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* Pricing — hidden while every feature is free (see src/config/site.js) */}
      {SHOW_PRICING && (
      <section id="pricing" className="scroll-mt-20 bg-surface py-24">
        <div className="container-x">
          <Heading eyebrow="Pricing" title="Simple pricing for every celebration" text="Start free. Upgrade only when you need more." />
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <motion.div key={p.name} {...fade} className={`relative flex flex-col rounded-3xl p-8 ${p.featured ? 'bg-brand text-white shadow-lift md:-my-4 md:py-12' : 'border border-line-strong bg-canvas'}`}>
                {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white">Most popular</span>}
                <h3 className="font-serif text-2xl font-semibold">{p.name}</h3>
                <p className="mt-4"><span className="font-serif text-5xl font-semibold">{p.price}</span> <span className={p.featured ? 'text-white/70' : 'text-ink-mute'}>/ {p.note}</span></p>
                <ul className="mt-7 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => <li key={f} className="flex items-start gap-2.5"><Check size={16} className={`mt-0.5 shrink-0 ${p.featured ? 'text-[#D8C9B2]' : 'text-brand'}`} />{f}</li>)}
                </ul>
                <Link to="/register" className={`mt-8 ${p.featured ? 'btn bg-surface text-brand hover:bg-sand-light' : 'btn-primary'}`}>{p.cta}</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FAQ */}
      <section id="faq" className="container-x scroll-mt-20 py-24">
        <Heading eyebrow="FAQ" title="Questions, answered" />
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-sand rounded-3xl border border-line-strong bg-surface">
          {FAQ.map(([q, a], i) => (
            <div key={q}>
              <button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="font-serif text-xl font-semibold">{q}</span>
                <ChevronDown size={20} className={`shrink-0 text-accent transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="px-6 pb-6 text-ink-soft">{a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x">
        <motion.div {...fade} className="relative overflow-hidden rounded-[2rem] bg-night px-8 py-16 text-center text-white ring-1 ring-white/10 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(196,155,114,.35),transparent)]" />
          <h2 className="relative mx-auto max-w-2xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">Ready to invite the people who matter most?</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-white/70">Create your first invitation in minutes — every feature is free during our launch.</p>
          <Link to={user ? '/templates?start=1' : '/register'} className="btn-accent btn-lg relative mt-9 !rounded-full !px-8">Create Your Invitation <ArrowRight size={18} /></Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
