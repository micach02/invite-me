import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Bookmark, BookmarkPlus, Check, ChevronDown, CloudOff, ExternalLink, Eye, EyeOff, Globe, Heart, Loader2, Palette, Save, Search, Share2, Link2 } from 'lucide-react';
import { ImageField, TextArea, TextField, Toggle } from '../ui/fields';
import { StatusBadge } from '../ui/misc';
import TemplateThumb from '../invitation/TemplateThumb';
import Pagination from '../ui/Pagination';
import FavoriteButton from '../ui/FavoriteButton';
import { useLibrary } from '../../context/LibraryContext';
import { TEMPLATES } from '../../data/templates';
import { occasionById } from '../../data/constants';
import { appPath, getPath, publicUrl } from '../../lib/utils';

function Block({ icon: Icon, title, children, collapsible = false }) {
  if (collapsible) {
    return (
      <details className="group border-b border-line">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-sm font-bold [&::-webkit-details-marker]:hidden">
          <Icon size={15} className="text-brand" /> {title}
          <ChevronDown size={16} className="ml-auto text-ink-mute transition group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="space-y-4 px-5 pb-5">{children}</div>
      </details>
    );
  }
  return (
    <section className="border-b border-line px-5 py-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold"><Icon size={15} className="text-brand" /> {title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const STATUS = {
  saved: { icon: Check, text: 'All changes saved', cls: 'text-emerald-700 bg-emerald-50' },
  saving: { icon: Loader2, text: 'Saving…', cls: 'text-ink-soft bg-sand-light', spin: true },
  unsaved: { icon: Save, text: 'Unsaved changes', cls: 'text-amber-700 bg-amber-50' },
  error: { icon: CloudOff, text: 'Save failed — retrying', cls: 'text-red-700 bg-red-50' },
};

export function SaveStatus({ status, compact }) {
  const s = STATUS[status] ?? STATUS.saved;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${s.cls}`} role="status" aria-live="polite">
      <s.icon size={13} className={s.spin ? 'animate-spin' : ''} />{!compact && s.text}
      {compact && <span className="sr-only">{s.text}</span>}
    </span>
  );
}

export default function SettingsPanel({ invitation, config, set, onTemplate, onSaveTemplate, autosave, onPublish, onUnpublish, onShare, onEditSlug }) {
  const { saved, favoriteTemplates } = useLibrary();
  const published = invitation.status === 'published';
  const b = (path, fallback = '') => ({ value: getPath(config, path, fallback), onChange: (v) => set(path, v) });
  const current = config.theme.templateId;

  // Template picker: paged so we never mount 100+ live thumbnails at once.
  const PAGE = 6;
  const [scope, setScope] = useState('occasion');
  const [tplPage, setTplPage] = useState(1);
  const category = occasionById(config.meta?.occasion).category;
  const pool = useMemo(() => {
    if (scope === 'mine') return saved;
    if (scope === 'favorites') return favoriteTemplates;
    return TEMPLATES.filter((t) => scope === 'all' || occasionById(t.occasion).category === category || t.id === current);
  }, [scope, category, current, saved, favoriteTemplates]);
  const tplPages = Math.max(1, Math.ceil(pool.length / PAGE));
  const safePage = Math.min(tplPage, tplPages);
  const shown = pool.slice((safePage - 1) * PAGE, safePage * PAGE);

  return (
    <div>
      <Block icon={Globe} title="Publishing">
        <div className="flex items-center justify-between"><StatusBadge status={invitation.status} />
          {published
            ? <button className="btn-secondary btn-sm" onClick={onUnpublish}><EyeOff size={13} /> Unpublish</button>
            : <button className="btn-primary btn-sm" onClick={onPublish}><Eye size={13} /> Publish</button>}
        </div>
        <p className="text-xs text-ink-mute">
          {published ? 'Anyone with the link can view this invitation. Edits go live as they save.' : 'Only you can see this draft. Publish to get a shareable link.'}
        </p>
        <Toggle label="Hide from search engines" description="Adds a noindex tag. Guests with the link can still open it." checked={Boolean(config.page.noindex)} onChange={(v) => set('page.noindex', v)} />
      </Block>

      <Block icon={Share2} title="Sharing">
        {published ? (
          <>
            <div className="flex items-center gap-2 rounded-xl bg-canvas px-3 py-2.5 text-xs"><Link2 size={14} className="shrink-0 text-brand" /><span className="truncate">{publicUrl(invitation.slug)}</span></div>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-primary btn-sm" onClick={onShare}><Share2 size={13} /> Share & QR</button>
              <a className="btn-secondary btn-sm" href={appPath(`/invitation/${invitation.slug}`)} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Open</a>
            </div>
          </>
        ) : <p className="text-xs text-ink-mute">Publish to unlock the link, QR code and Facebook, Messenger and WhatsApp sharing.</p>}
      </Block>

      <Block icon={Palette} title="Template">
        <p className="-mt-1 text-xs text-ink-mute">Switching keeps all your content and photos — only colours, fonts and layout change.</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex rounded-full bg-sand-light p-1 text-xs font-medium" role="group" aria-label="Template scope">
            {[['occasion', 'Occasion', null], ['all', 'All', null], ['favorites', 'Favorites', Heart], ['mine', 'My templates', Bookmark]].map(([k, label, Icon]) => (
              <button key={k} type="button" aria-pressed={scope === k} onClick={() => { setScope(k); setTplPage(1); }} aria-label={Icon ? label : undefined} title={Icon ? label : undefined}
                className={`rounded-full px-3 py-1 transition ${scope === k ? 'bg-surface text-brand shadow-sm' : 'text-ink-soft'}`}>{Icon ? <Icon size={13} className="my-0.5" /> : label}</button>
            ))}
          </div>
          <span className="shrink-0 whitespace-nowrap text-xs text-ink-mute">{pool.length} design{pool.length === 1 ? '' : 's'}</span>
        </div>
        {pool.length === 0 && (
          <p className="rounded-xl bg-canvas px-3 py-4 text-center text-xs leading-relaxed text-ink-mute">
            {scope === 'mine' ? 'Nothing saved yet. Style this invitation, then use “Save current design” below.' : 'No favorites yet. Tap the heart on any template to keep it here.'}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {shown.map((t) => (
            <div key={t.id} className="relative">
              <button type="button" onClick={() => onTemplate(t)} aria-pressed={current === t.id} aria-label={t.name}
                className={`group block w-full rounded-xl p-1.5 text-left transition ${current === t.id ? 'bg-brand-50 ring-2 ring-brand' : 'hover:bg-sand-light'}`}>
                <TemplateThumb template={t} rounded="rounded-lg" />
                <span className="mt-1.5 block truncate px-0.5 text-xs font-medium">{t.name}</span>
              </button>
              <FavoriteButton id={t.id} name={t.name} className="absolute right-3 top-3 !h-7 !w-7" />
            </div>
          ))}
        </div>
        <Pagination compact page={safePage} pageCount={tplPages} onChange={setTplPage} />
        <button type="button" className="btn-secondary btn-sm w-full" onClick={onSaveTemplate}><BookmarkPlus size={14} /> Save current design as template</button>
      </Block>

      <Block icon={Search} title="Page & SEO settings" collapsible>
        <div>
          <span className="label">Page address</span>
          <div className="flex items-center justify-between gap-2 rounded-xl border border-line-strong bg-surface px-3 py-2 text-sm">
            <span className="truncate text-ink-soft">/invitation/<b className="text-ink">{invitation.slug || 'your-link'}</b></span>
            <button className="shrink-0 text-xs font-medium text-brand hover:underline" onClick={onEditSlug}>{published ? 'Change' : 'Set'}</button>
          </div>
        </div>
        <TextField label="Search & share title" {...b('page.seoTitle')} placeholder={config.event.title} maxLength={70} />
        <TextArea label="Search & share description" rows={3} {...b('page.seoDescription')} placeholder={config.event.description?.slice(0, 120)} maxLength={200} />
        <ImageField label="Share preview image" {...b('page.ogImage')} hint="Shown on Facebook, Messenger & WhatsApp. Defaults to the cover photo." />
        <Toggle label="Show “Made with InviteMe” footer" description="Turn off for a fully white-labelled invitation." checked={!config.page.hideBranding} onChange={(v) => set('page.hideBranding', !v)} />
        <Toggle label="Animated opening" description="Guests tap an envelope to reveal the invitation." checked={config.page.opening} onChange={(v) => set('page.opening', v)} />
        {config.page.opening && <TextField label="Opening prompt" {...b('page.openingText')} maxLength={30} />}
      </Block>
    </div>
  );
}
