import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { Copy, Download, ExternalLink, MessageCircle, Send, Share2 } from 'lucide-react';
import Modal from '../ui/Modal';
import DemoNotice from '../ui/DemoNotice';
import { isDemoMode } from '../../services';
import { publicUrl } from '../../lib/utils';

// lucide-react no longer ships brand icons.
const Facebook = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3z" />
  </svg>
);

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function ShareModal({ open, onClose, invitation, onPublish }) {
  const qrRef = useRef(null);
  if (!invitation) return null;
  const published = invitation.status === 'published' && invitation.slug;
  const url = published ? publicUrl(invitation.slug) : '';
  const title = invitation.title;
  const text = `You're invited! ${title}`;

  const copy = async (value = url, msg = 'Link copied') => {
    try { await navigator.clipboard.writeText(value); toast.success(msg); }
    catch { toast.error('Could not copy — select the link and copy it manually.'); }
  };
  const open_ = (href) => window.open(href, '_blank', 'noopener,noreferrer,width=640,height=640');

  const channels = [
    { label: 'Facebook', icon: Facebook, color: '#1877F2', run: () => open_(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`) },
    {
      label: 'Messenger', icon: MessageCircle, color: '#0A7CFF',
      run: () => {
        const appId = import.meta.env.VITE_FB_APP_ID;
        if (isMobile()) window.location.href = `fb-messenger://share/?link=${encodeURIComponent(url)}`;
        else if (appId) open_(`https://www.facebook.com/dialog/send?app_id=${appId}&link=${encodeURIComponent(url)}&redirect_uri=${encodeURIComponent(window.location.origin)}`);
        else copy(url, 'Link copied — paste it into Messenger');
      },
    },
    { label: 'WhatsApp', icon: Send, color: '#25D366', run: () => open_(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`) },
  ];

  const downloadQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${invitation.slug}-qr.png`;
    a.click();
  };

  return (
    <Modal open={open} onClose={onClose} title="Share invitation" size="md">
      {!published ? (
        <div className="py-4 text-center">
          <Share2 className="mx-auto text-brand" size={36} strokeWidth={1.3} />
          <h3 className="mt-3 font-serif text-2xl font-semibold">Publish to get a link</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">Your invitation is still a draft. Publish it to create a shareable URL and QR code.</p>
          {onPublish && <button className="btn-primary mt-5" onClick={onPublish}>Publish invitation</button>}
        </div>
      ) : (
        <div className="space-y-6">
          {isDemoMode && <DemoNotice />}
          <div>
            <label className="label">Invitation link</label>
            <div className="flex gap-2">
              <input readOnly className="input" value={url} onFocus={(e) => e.target.select()} />
              <button className="btn-primary shrink-0" onClick={() => copy()}><Copy size={15} /> Copy</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {channels.map(({ label, icon: Icon, color, run }) => (
              <button key={label} onClick={run} className="flex flex-col items-center gap-2 rounded-2xl border border-sand p-4 transition hover:-translate-y-0.5 hover:shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: color }}><Icon size={20} /></span>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
          {typeof navigator.share === 'function' && (
            <button className="btn-secondary w-full" onClick={() => navigator.share({ title, text, url }).catch(() => {})}><Share2 size={15} /> More sharing options</button>
          )}

          <div className="flex flex-col items-center gap-4 rounded-2xl bg-canvas p-5 sm:flex-row">
            <div ref={qrRef} className="rounded-xl bg-white p-3 shadow-card"><QRCodeCanvas value={url} size={132} level="M" marginSize={0} fgColor="#252923" /></div>
            <div className="text-center sm:text-left">
              <h4 className="font-serif text-xl font-semibold">QR code</h4>
              <p className="mt-1 text-sm text-ink-soft">Print it on tables, programs or save-the-dates. Guests scan and open your invitation instantly.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <button className="btn-secondary btn-sm" onClick={downloadQr}><Download size={14} /> Download PNG</button>
                <a className="btn-ghost btn-sm" href={url} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Open</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
