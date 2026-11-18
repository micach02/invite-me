import { Link } from 'react-router-dom';
import { MailOpen } from 'lucide-react';

export default function Logo({ to = '/', light = false, className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${className}`} aria-label="InviteMe home">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${light ? 'bg-white/15 text-white' : 'bg-brand text-white'}`}>
        <MailOpen size={18} strokeWidth={1.8} />
      </span>
      <span className={`font-serif text-2xl font-semibold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        Invite<span className={light ? 'text-sand' : 'text-accent'}>Me</span>
      </span>
    </Link>
  );
}
