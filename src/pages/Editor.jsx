import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, Globe, Keyboard, Monitor, PencilLine, Redo2, RotateCcw, Settings2, Share2, Smartphone, Tablet, Undo2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { invitations } from '../services';
import { useConfig } from '../hooks/useConfig';
import { useAutosave } from '../hooks/useAutosave';
import { createDefaultConfig, suggestSlug } from '../data/defaultConfig';
import { appPath, deepMerge, slugify } from '../lib/utils';
import InvitationRenderer from '../components/invitation/InvitationRenderer';
import OpeningOverlay from '../components/invitation/OpeningOverlay';
import PreviewFrame from '../components/invitation/PreviewFrame';
import EditorPanel from '../components/editor/EditorPanel';
import SettingsPanel, { SaveStatus } from '../components/editor/SettingsPanel';
import PublishModal from '../components/editor/PublishModal';
import ShareModal from '../components/editor/ShareModal';
import SaveTemplateModal from '../components/editor/SaveTemplateModal';
import HistoryMenu from '../components/editor/HistoryMenu';
import ShortcutsModal from '../components/editor/ShortcutsModal';
import { addVersion, listVersions, restoreFrom } from '../lib/versions';
import { ConfirmDialog, PageLoader, EmptyState } from '../components/ui/misc';
import Logo from '../components/ui/Logo';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Editor() {
  const { id } = useParams();
  const { user } = useAuth();
  const [inv, setInv] = useState(undefined);

  useEffect(() => {
    let live = true;
    invitations.get(id).then((i) => live && setInv(i && i.userId === user.id ? i : null)).catch((e) => { toast.error(e.message); live && setInv(null); });
    return () => { live = false; };
  }, [id, user.id]);

  if (inv === undefined) return <PageLoader label="Opening your invitation…" />;
  if (inv === null) {
    return <div className="grid min-h-screen place-items-center p-6"><EmptyState title="Invitation not found" text="It may have been deleted, or it belongs to another account." action={<Link to="/dashboard" className="btn-primary">Back to dashboard</Link>} /></div>;
  }
  return <EditorWorkspace initial={inv} />;
}

function EditorWorkspace({ initial }) {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [inv, setInv] = useState(initial);
  const initialConfig = useMemo(() => {
    const merged = deepMerge(createDefaultConfig(initial.occasion, initial.templateId), initial.config);
    merged.meta = { ...merged.meta, occasion: merged.meta?.occasion ?? initial.occasion };
    merged.theme = { ...merged.theme, templateId: merged.theme.templateId ?? initial.templateId };
    return merged;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { config, set, update, undo, redo, canUndo, canRedo } = useConfig(initialConfig);
  const [tab, setTab] = useState('edit'); // mobile only
  const [device, setDevice] = useState('mobile');
  const [showOpening, setShowOpening] = useState(false);
  const [openStarted, setOpenStarted] = useState(false);
  const [replayKey, setReplayKey] = useState(0); // remounting the preview restarts the cover's animations
  const [publishOpen, setPublishOpen] = useState(params.get('publish') === '1');
  const [shareOpen, setShareOpen] = useState(false);
  const [saveTplOpen, setSaveTplOpen] = useState(false);
  const [unpublishOpen, setUnpublishOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [focusReq, setFocusReq] = useState(null);
  const scrollRef = useRef(null);

  // Jump to the settings that own a part of the invitation (preview click, checklist "Fix").
  const requestFocus = useCallback((r) => { setTab('edit'); setFocusReq({ ...r, n: Date.now() }); }, []);
  const onPreviewClick = (e) => {
    if (e.target.closest('a, button, input, select, textarea, summary, label, iframe')) return;
    // Elements that own a settings panel of their own (the logo) win over the section they sit in.
    const panel = e.target.closest('[data-panel]')?.getAttribute('data-panel');
    if (panel) return requestFocus({ panel });
    const sec = e.target.closest('[data-sec]')?.getAttribute('data-sec');
    if (sec) requestFocus({ sec });
  };

  const save = useCallback(async (cfg) => {
    const updated = await invitations.update(initial.id, {
      config: cfg,
      title: cfg.event.title?.trim() || 'Untitled invitation',
      occasion: cfg.meta.occasion,
      templateId: cfg.theme.templateId,
    });
    setInv((prev) => ({ ...prev, ...updated, slug: prev.slug, status: prev.status }));
  }, [initial.id]);

  const autosave = useAutosave({ value: config, save });

  // Restore points: a starting point on first open, then every few minutes while changes keep coming.
  const latest = useRef(config);
  latest.current = config;
  useEffect(() => {
    if (!listVersions(initial.id).length) addVersion(initial.id, latest.current, 'Starting point', { auto: true });
    const t = setInterval(() => addVersion(initial.id, latest.current, 'Automatic snapshot', { auto: true }), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [initial.id]);

  const restoreVersion = (v) => {
    addVersion(initial.id, latest.current, `Before restoring “${v.label}”`, { auto: true });
    update((cfg) => {
      const merged = deepMerge(createDefaultConfig(cfg.meta?.occasion, cfg.theme?.templateId), restoreFrom(cfg, v));
      return merged;
    });
    toast.success('Version restored — press Ctrl+Z to undo');
  };

  useDocumentMeta({ title: `Editing: ${config.event.title || 'Untitled'} — InviteMe`, description: 'Invitation editor', noindex: true });

  useEffect(() => { if (params.get('publish')) { params.delete('publish'); setParams(params, { replace: true }); } }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts: Ctrl/Cmd+S save, Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z redo (outside text fields).
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      const inField = /input|textarea|select/i.test(e.target.tagName);
      if (k === 's') { e.preventDefault(); autosave.saveNow().then((ok) => ok && toast.success('Saved')); }
      else if (k === 'z' && !inField) { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (k === 'y' && !inField) { e.preventDefault(); redo(); }
    };
    const onHelp = (e) => { if (e.key === '?' && !/input|textarea|select/i.test(e.target.tagName) && !e.target.isContentEditable) { e.preventDefault(); setShortcutsOpen(true); } };
    window.addEventListener('keydown', onHelp);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('keydown', onHelp); };
  }, [autosave, undo, redo]);

  const focusSection = useCallback((secId) => {
    const root = scrollRef.current;
    const el = root?.querySelector(`[data-sec="${secId}"]`) ?? root?.querySelector('[data-sec="cover"]');
    if (!root || !el) return;
    const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
    root.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
  }, []);

  const applyTemplate = (tpl) => {
    addVersion(initial.id, config, `Before “${tpl.name}”`, { auto: true });
    update((cfg) => ({ ...cfg, theme: { ...cfg.theme, ...tpl.theme, fontScale: cfg.theme.fontScale, templateId: tpl.id } }));
    setShowOpening(false);
    toast.success(`Applied “${tpl.name}”`);
  };

  const doPublish = async (slug) => {
    try {
      await autosave.saveNow();
      const updated = await invitations.publish(inv.id, slug);
      setInv((p) => ({ ...p, slug: updated.slug, status: updated.status, publishedAt: updated.publishedAt }));
      addVersion(initial.id, latest.current, 'Published', { auto: true });
      setPublishOpen(false);
      toast.success('Your invitation is live!');
      setShareOpen(true);
    } catch (e) { toast.error(e.message); }
  };

  const doUnpublish = async () => {
    try {
      const updated = await invitations.unpublish(inv.id);
      setInv((p) => ({ ...p, status: updated.status }));
      toast.success('Invitation unpublished');
    } catch (e) { toast.error(e.message); }
    setUnpublishOpen(false);
  };

  const previewAsGuest = async () => {
    await autosave.saveNow();
    window.open(appPath(`/preview/${inv.id}`), '_blank', 'noopener');
  };

  const published = inv.status === 'published';
  const suggestion = slugify(suggestSlug(config));

  const iconBtn = 'grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition hover:bg-ink/[.05] hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent';

  return (
    <div className="flex h-[100dvh] flex-col bg-canvas">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-1.5 border-b border-line bg-surface px-2 sm:gap-2 sm:px-4">
        <button className={iconBtn} onClick={() => navigate('/dashboard')} aria-label="Back to dashboard"><ArrowLeft size={18} /></button>
        <div className="hidden lg:block"><Logo to="/dashboard" /></div>
        <div className="mx-1 hidden h-6 w-px bg-line lg:block" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            value={config.event.title} onChange={(e) => set('event.title', e.target.value)} aria-label="Invitation title" placeholder="Untitled invitation" maxLength={90}
            className="min-w-0 max-w-md flex-1 truncate rounded-lg border border-transparent bg-transparent px-2 py-1.5 font-display text-sm font-bold transition hover:border-line-strong hover:bg-canvas focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10"
          />
          {published && <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/15 sm:inline-flex"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />Live</span>}
        </div>
        <div className="hidden sm:block"><SaveStatus status={autosave.status} /></div>
        <div className="sm:hidden"><SaveStatus status={autosave.status} compact /></div>
        <div className="hidden items-center sm:flex">
          <button className={iconBtn} onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo (Ctrl+Z)"><Undo2 size={17} /></button>
          <button className={iconBtn} onClick={redo} disabled={!canRedo} aria-label="Redo" title="Redo (Ctrl+Shift+Z)"><Redo2 size={17} /></button>
        </div>
        <HistoryMenu className="hidden sm:block" invitationId={initial.id} config={config} onRestore={restoreVersion} />
        <button className={`${iconBtn} hidden lg:grid`} onClick={() => setShortcutsOpen(true)} aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)"><Keyboard size={17} /></button>
        <ThemeToggle className="hidden sm:grid" />
        <button className="btn-secondary btn-sm !h-9 hidden md:inline-flex" onClick={previewAsGuest}><Eye size={14} /> Preview as guest</button>
        {published ? (
          <button className="btn-primary btn-sm !h-9" onClick={() => setShareOpen(true)}><Share2 size={14} /> Share</button>
        ) : (
          <button className="btn-primary btn-sm !h-9" onClick={() => setPublishOpen(true)}><Globe size={14} /> Publish</button>
        )}
      </header>

      {/* Workspace */}
      <div className="grid min-h-0 flex-1 lg:grid-cols-[22rem_minmax(0,1fr)_20rem]">
        <aside className={`${tab === 'edit' ? 'block' : 'hidden'} scroll-thin min-h-0 overflow-y-auto border-r border-line bg-surface lg:block`} aria-label="Editing controls">
          <EditorPanel config={config} set={set} update={update} onFocusSection={(s) => { focusSection(s); }} focusRequest={focusReq} />
        </aside>

        <main className={`${tab === 'preview' ? 'flex' : 'hidden'} min-h-0 flex-col dot-grid lg:flex`} aria-label="Live preview">
          <div className="flex shrink-0 items-center justify-center gap-2 px-4 py-3">
            <div className="hidden rounded-full bg-surface p-1 shadow-card lg:flex" role="group" aria-label="Preview device">
              {[['mobile', Smartphone, 'Mobile'], ['tablet', Tablet, 'Tablet'], ['desktop', Monitor, 'Desktop']].map(([k, Icon, label]) => (
                <button key={k} onClick={() => setDevice(k)} aria-pressed={device === k}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${device === k ? 'bg-brand text-white' : 'text-ink-soft'}`}><Icon size={14} />{label}</button>
              ))}
            </div>
            {config.page.opening && (
              <button className="btn-secondary btn-sm !bg-surface" onClick={() => { scrollRef.current?.scrollTo({ top: 0 }); setOpenStarted(false); setReplayKey((k) => k + 1); setShowOpening(true); }}><RotateCcw size={13} /> Replay opening</button>
            )}
            <button className="btn-secondary btn-sm !bg-surface md:hidden" onClick={previewAsGuest}><Eye size={13} /> Guest view</button>
            <div className="flex sm:hidden">
              <button className={iconBtn} onClick={undo} disabled={!canUndo} aria-label="Undo"><Undo2 size={17} /></button>
              <button className={iconBtn} onClick={redo} disabled={!canRedo} aria-label="Redo"><Redo2 size={17} /></button>
            </div>
          </div>
          <div className="min-h-0 flex-1 px-3 pb-4 sm:px-6">
            <PreviewFrame
              device={device} scrollRef={scrollRef} onContentClick={onPreviewClick}
              overlay={showOpening && <OpeningOverlay embedded config={config} onStart={() => setOpenStarted(true)} onOpen={() => setShowOpening(false)} />}
            >
              {(h) => <InvitationRenderer key={replayKey} config={config} mode="editor" viewportHeight={h} editable hold={showOpening && !openStarted} />}
            </PreviewFrame>
          </div>
        </main>

        <aside className={`${tab === 'settings' ? 'block' : 'hidden'} scroll-thin min-h-0 overflow-y-auto border-l border-line bg-surface lg:block`} aria-label="Invitation settings">
          <SettingsPanel
            invitation={inv} config={config} set={set} onTemplate={applyTemplate} onSaveTemplate={() => setSaveTplOpen(true)} onFix={(panel) => requestFocus({ panel })} autosave={autosave}
            onPublish={() => setPublishOpen(true)} onUnpublish={() => setUnpublishOpen(true)} onShare={() => setShareOpen(true)} onEditSlug={() => setPublishOpen(true)}
          />
        </aside>
      </div>

      {/* Mobile tab bar */}
      <nav className="grid shrink-0 grid-cols-3 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Editor sections">
        {[['edit', PencilLine, 'Edit'], ['preview', Eye, 'Preview'], ['settings', Settings2, 'Settings']].map(([k, Icon, label]) => (
          <button key={k} onClick={() => setTab(k)} aria-current={tab === k} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${tab === k ? 'text-brand' : 'text-ink-mute'}`}>
            <Icon size={20} strokeWidth={1.7} />{label}
          </button>
        ))}
      </nav>

      <PublishModal open={publishOpen} onClose={() => setPublishOpen(false)} invitation={inv} suggestion={suggestion} onConfirm={doPublish} />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <SaveTemplateModal open={saveTplOpen} onClose={() => setSaveTplOpen(false)} config={config} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} invitation={inv} onPublish={() => { setShareOpen(false); setPublishOpen(true); }} />
      <ConfirmDialog open={unpublishOpen} onClose={() => setUnpublishOpen(false)} onConfirm={doUnpublish} confirmLabel="Unpublish"
        title="Unpublish this invitation?" text="The link will stop working for guests until you publish again. Your content and RSVPs are kept." />
    </div>
  );
}
