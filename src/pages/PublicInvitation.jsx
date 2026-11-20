import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, EyeOff, Frown } from 'lucide-react';
import { invitations, rsvps, notifyHostOfRsvp, isDemoMode } from '../services';
import { useAuth } from '../context/AuthContext';
import { createDefaultConfig } from '../data/defaultConfig';
import { deepMerge, publicUrl } from '../lib/utils';
import InvitationRenderer from '../components/invitation/InvitationRenderer';
import OpeningOverlay from '../components/invitation/OpeningOverlay';
import { PageLoader, EmptyState } from '../components/ui/misc';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

/** Public guest page (/invitation/:slug) and the owner's draft preview (/preview/:id). */
export default function PublicInvitation({ preview = false }) {
  const { slug, id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [inv, setInv] = useState(undefined);
  const [error, setError] = useState(null);
  const [opened, setOpened] = useState(false);
  const [started, setStarted] = useState(false); // the guest has tapped the envelope

  useEffect(() => {
    if (preview && authLoading) return undefined;
    let live = true;
    const load = preview ? invitations.get(id) : invitations.getBySlug(slug);
    load
      .then((i) => { if (live) setInv(preview && i && i.userId !== user?.id ? null : i); })
      .catch((e) => { if (live) { setError(e.message); setInv(null); } });
    return () => { live = false; };
  }, [slug, id, preview, authLoading, user?.id]);

  const config = useMemo(
    () => (inv ? deepMerge(createDefaultConfig(inv.occasion, inv.templateId), inv.config) : null),
    [inv],
  );

  // Count one view per browser session — never for the owner, never in preview.
  useEffect(() => {
    if (!inv || preview || inv.userId === user?.id) return;
    const key = `inviteme:viewed:${inv.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch { /* storage blocked — count anyway */ }
    invitations.recordView(inv.id).catch(() => {});
  }, [inv, preview, user?.id]);

  const showOverlay = Boolean(config?.page.opening) && !opened;
  useEffect(() => {
    if (!showOverlay) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [showOverlay]);

  const title = config ? (config.page.seoTitle || config.event.title) : 'Invitation';
  const description = config ? (config.page.seoDescription || config.event.description?.slice(0, 160) || `You are invited to ${config.event.title}`) : '';
  useDocumentMeta({
    title: config ? `${title}` : 'InviteMe', description,
    image: config?.page.ogImage || config?.images.cover || '',
    url: inv?.slug ? publicUrl(inv.slug) : undefined,
    noindex: preview || Boolean(config?.page.noindex),
  });

  if (inv === undefined || (preview && authLoading)) return <PageLoader label="Opening invitation…" />;

  if (!inv) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas p-6">
        <EmptyState icon={preview ? EyeOff : Frown} title="Invitation not found"
          text={error || (isDemoMode
            ? 'This site is running in demo mode, where invitations are saved only in the browser that created them — so a link or QR code can only be opened on that same device. The host needs to connect Supabase to share invitations with guests.'
            : 'This link may be mistyped, or the host has unpublished the invitation.')}
          action={<Link to="/" className="btn-primary">Visit InviteMe</Link>} />
      </div>
    );
  }

  const onRsvp = preview ? undefined : async (data) => {
    const row = await rsvps.submit(inv.id, data);
    notifyHostOfRsvp({ invitationId: inv.id, rsvpId: row.id });
  };

  return (
    <div style={{ background: config.theme.bgColor }}>
      {preview && (
        <div className="sticky top-0 z-[150] flex items-center justify-between gap-3 bg-night px-4 py-2.5 text-xs text-white">
          <span><b>Guest preview</b> — this is exactly what guests see{inv.status !== 'published' ? ' (draft: not public yet)' : ''}.</span>
          <Link to={`/editor/${inv.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-medium hover:bg-white/25"><ArrowLeft size={12} /> Back to editor</Link>
        </div>
      )}
      {showOverlay && <OpeningOverlay config={config} onStart={() => setStarted(true)} onOpen={() => setOpened(true)} />}
      <InvitationRenderer config={config} mode="public" onRsvp={onRsvp} hold={showOverlay && !started} />
    </div>
  );
}
