import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

import { SHOW_PRICING } from '../../config/site';

const ALL_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/templates', label: 'Templates' },
  { to: '/#features', label: 'Features', hash: true },
  { to: '/#pricing', label: 'Pricing', hash: true },
];

const LINKS = ALL_LINKS.filter((l) => SHOW_PRICING || l.to !== '/#pricing');

export default function PublicNav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const linkCls = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand' : 'text-ink-soft hover:text-ink'}`;

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'bg-canvas/85 shadow-[0_1px_0_rgba(0,0,0,.06)] backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container-x flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => l.hash
            ? <Link key={l.to} to={l.to} className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition hover:text-ink">{l.label}</Link>
            : <NavLink key={l.to} to={l.to} end={l.end} className={linkCls}>{l.label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <Link to="/dashboard" className="btn-primary">My dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 md:hidden">
        <ThemeToggle />
        <button className="rounded-full p-2" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-line bg-canvas md:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-4">
              {LINKS.map((l) => <Link key={l.to} to={l.to} className="rounded-xl px-3 py-3 text-base font-medium hover:bg-sand-light">{l.label}</Link>)}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {user ? <Link to="/dashboard" className="btn-primary col-span-2">My dashboard</Link> : (
                  <>
                    <Link to="/login" className="btn-secondary">Login</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
