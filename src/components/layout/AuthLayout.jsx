import Logo from '../ui/Logo';
import TemplateThumb from '../invitation/TemplateThumb';
import { isDemoMode } from '../../services';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-brand lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(216,201,178,.25),transparent_55%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo light />
          <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-5">
            <TemplateThumb templateId="evergreen-vows" className="translate-y-6 shadow-lift" />
            <TemplateThumb templateId="blush-garden" className="-translate-y-4 shadow-lift" />
          </div>
          <blockquote>
            <p className="font-serif text-3xl font-medium leading-snug">“Our guests thought we hired a designer. It took us twenty minutes.”</p>
            <footer className="mt-3 text-sm text-white/70">— Camille & Rafael, married in March</footer>
          </blockquote>
        </div>
      </aside>

      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="lg:hidden"><Logo /></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl font-extrabold">{title}</h1>
          {subtitle && <p className="mt-2 text-[15px] text-ink-soft">{subtitle}</p>}
          {isDemoMode && (
            <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
              <b>Demo mode</b> — no Supabase keys found, so accounts and invitations are saved in this browser only.
            </p>
          )}
          <div className="mt-7">{children}</div>
          {footer && <p className="mt-6 text-center text-sm text-ink-soft">{footer}</p>}
        </div>
      </main>
    </div>
  );
}

export function FieldError({ error }) {
  return error ? <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">{error.message}</p> : null;
}
