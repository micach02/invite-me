import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { SHOW_PRICING } from '../../config/site';

const COLS = [
  { title: 'Product', links: [['Templates', '/templates'], ['Features', '/#features'], ...(SHOW_PRICING ? [['Pricing', '/#pricing']] : []), ['FAQ', '/#faq']] },
  { title: 'Occasions', links: [['Weddings', '/templates?category=wedding'], ['Birthdays', '/templates?category=birthday'], ['Baptisms', '/templates?category=baptism'], ['Debuts', '/templates?category=debut']] },
  { title: 'Account', links: [['Login', '/login'], ['Create account', '/register'], ['Dashboard', '/dashboard']] },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-brand-dark text-white/80">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            Beautiful digital invitations for life’s most meaningful moments — designed in minutes, shared in one tap.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-sand">{c.title}</h4>
            <ul className="space-y-2.5 text-sm">
              {c.links.map(([label, to]) => <li key={label}><Link to={to} className="transition hover:text-white">{label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} InviteMe. Crafted with care for every celebration.
      </div>
    </footer>
  );
}
