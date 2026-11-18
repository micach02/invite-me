import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard, LogOut, Palette, Plus, User } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { isDemoMode } from '../../services';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/templates', label: 'Templates', icon: Palette },
  { to: '/dashboard/analytics', label: 'RSVPs & Analytics', icon: BarChart3 },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    await signOut();
    navigate('/');
  };

  const initial = (user?.fullName || user?.email || '?')[0].toUpperCase();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-black/5 bg-white px-5 py-6 lg:flex">
        <Logo to="/dashboard" />
        <Link to="/templates?start=1" className="btn-primary mt-8"><Plus size={16} /> New invitation</Link>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Dashboard">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand' : 'text-ink-soft hover:bg-sand-light hover:text-ink'}`}>
              <Icon size={18} strokeWidth={1.7} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          {isDemoMode && (
            <p className="rounded-xl bg-sand-light p-3 text-xs leading-relaxed text-ink-soft">
              <b className="text-ink">Demo mode.</b> Data is stored in this browser. Add Supabase keys in <code>.env</code> to go live.
            </p>
          )}
          <div className="flex items-center gap-3 rounded-xl border border-black/5 p-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-brand text-sm font-semibold text-white">
              {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.fullName || 'Welcome'}</p>
              <p className="truncate text-xs text-ink-mute">{user?.email}</p>
            </div>
            <button onClick={logout} disabled={busy} className="rounded-full p-2 text-ink-soft hover:bg-sand-light" aria-label="Log out"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">
        {/* Top bar (mobile) */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-canvas/90 px-5 py-3 backdrop-blur lg:hidden">
          <Logo to="/dashboard" />
          <button onClick={logout} className="btn-ghost btn-sm"><LogOut size={14} /> Log out</button>
        </div>
        <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10"><Outlet /></main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-black/5 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Dashboard">
        {NAV.slice(0, 2).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${isActive ? 'text-brand' : 'text-ink-mute'}`}>
            <Icon size={20} strokeWidth={1.7} />{label}
          </NavLink>
        ))}
        <Link to="/templates?start=1" className="-mt-5 flex flex-col items-center" aria-label="New invitation">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-white shadow-lift"><Plus /></span>
        </Link>
        {NAV.slice(2).map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${isActive ? 'text-brand' : 'text-ink-mute'}`}>
            <Icon size={20} strokeWidth={1.7} />{label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
