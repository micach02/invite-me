import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/** Password field with a show/hide toggle. Works with react-hook-form's register() (forwards the ref). */
const PasswordInput = forwardRef(function PasswordInput({ className = '', ...props }, ref) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input ref={ref} type={shown ? 'text' : 'password'} className={`input pr-11 ${className}`} {...props} />
      <button
        type="button" onClick={() => setShown((s) => !s)} aria-label={shown ? 'Hide password' : 'Show password'} aria-pressed={shown}
        className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-ink-mute transition hover:bg-black/[.05] hover:text-ink"
      >
        {shown ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
});

export default PasswordInput;

/** 0–4 score from length + variety. Deliberately simple: a nudge, not a policy. */
export function passwordStrength(pw = '') {
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s += 1;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s += 1;
  return pw ? Math.max(1, s) : 0;
}

export function StrengthMeter({ value }) {
  const score = passwordStrength(value);
  const label = ['', 'Weak', 'Fair', 'Good', 'Strong'][score];
  const color = ['bg-black/10', 'bg-red-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500'][score];
  if (!value) return null;
  return (
    <div className="mt-2 flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? color : 'bg-black/10'}`} />)}
      </div>
      <span className="w-12 text-right text-xs font-medium text-ink-soft">{label}</span>
    </div>
  );
}
