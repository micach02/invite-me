import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, ChevronsUpDown, LayoutDashboard, LogOut, Palette, Plus, User } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { isDemoMode } from '../../services';

const NAV = [
  { to: '/dashboard', label: 'Invitations', short: 'Home', icon: LayoutDashboard, end: true },
  { to: '/templates', label: 'Templates', short: 'Templates', icon: Palette },
  { to: '/dashboard/analytics', label: 'Guests & insights', short: 'Insights', icon: BarChart3 },
  { to: '/dashboard/profile', label: 'Profile', short: 'Profile', icon: User },
];

function Avatar({ user, size = 36 }) {
  const initial = (user?.fullName || user?.email || '?')[0].toUpperCase();
  return (
    <span className="grid shrink-0 place-items-center overflow-hidden rounded-full bg-brand font-semibold text-white" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initial}
    </span>
  );
}

/** Account menu: profile + log out, opened from the sidebar card (desktop) or avatar (mobile). */
function AccountMenu({ user, onLogout, align = 'left', children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {children({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div role="menu" className={`absolute z-50 w-60 animate-fade-in rounded-xl border border-line bg-white p-1.5 shadow-pop ${align === 'left' ? 'bottom-[calc(100%+8px)] left-0' : 'right-0 top-[calc(100%+8px)]'}`}>
          <div className="px-3 py-2"><p className="truncate text-sm font-semibold">{user?.fullName || 'Your account'}</p><p className="truncate text-xs text-ink-mute">{user?.email}</p></div>
          <div className="my-1 h-px bg-line" />
          <Link role="menuitem" to="/dashboard/profile" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-canvas hover:text-ink"><User size={15} /> Profile & password</Link>
          <button role="menuitem" onClick={onLogout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink-soft hover:bg-canvas hover:text-ink"><LogOut size={15} /> Log out</button>
        </div>
      )}
    </div>
  );
}

export default function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const logout = async () => { await signOut(); navigate('/'); };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16.5rem_1fr]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-pop">Skip to content</a>

      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-white px-4 py-5 lg:flex">
        <Logo to="/dashboard" className="px-2" />
        <Link to="/templates?start=1" className="btn-primary mt-6 w-full"><Plus size={16} strokeWidth={2.5} /> New invitation</Link>

        <nav className="mt-6 flex flex-col gap-0.5" aria-label="Main">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-50 font-semibold text-brand' : 'text-ink-soft hover:bg-canvas hover:text-ink'}`}>
              {({ isActive }) => (<>
                {isActive && <span className="absolute -left-4 bottom-2 top-2 w-1 rounded-r-full bg-brand" />}
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} /> {label}
              </>)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          {isDemoMode && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
              <p className="font-semibold">Demo mode</p>
              <p className="mt-0.5 text-amber-800">Data stays in this browser. Add Supabase keys to share invitations with guests.</p>
            </div>
          )}
          <AccountMenu user={user} onLogout={logout} align="left">
            {({ open, toggle }) => (
              <button onClick={toggle} aria-haspopup="menu" aria-expanded={open} className="flex w-full items-center gap-3 rounded-xl border border-line p-2.5 text-left transition hover:bg-canvas">
                <Avatar user={user} />
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{user?.fullName || 'Welcome'}</span><span className="block truncate text-xs text-ink-mute">{user?.email}</span></span>
                <ChevronsUpDown size={15} className="shrink-0 text-ink-mute" />
              </button>
            )}
          </AccountMenu>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-canvas/85 px-5 py-2.5 backdrop-blur-md lg:hidden">
          <Logo to="/dashboard" />
          <AccountMenu user={user} onLogout={logout} align="right">
            {({ open, toggle }) => <button onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu" className="rounded-full ring-2 ring-transparent transition hover:ring-brand/20"><Avatar user={user} size={34} /></button>}
          </AccountMenu>
        </div>
        <main id="main" className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8 lg:py-10"><Outlet /></main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden" aria-label="Main">
        {NAV.slice(0, 2).map(({ to, short, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${isActive ? 'text-brand' : 'text-ink-mute'}`}>
            <Icon size={20} strokeWidth={1.9} />{short}
          </NavLink>
        ))}
        <Link to="/templates?start=1" className="-mt-5 flex flex-col items-center" aria-label="New invitation">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-lift ring-4 ring-canvas"><Plus size={22} strokeWidth={2.4} /></span>
        </Link>
        {NAV.slice(2).map(({ to, short, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${isActive ? 'text-brand' : 'text-ink-mute'}`}>
            <Icon size={20} strokeWidth={1.9} />{short}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
