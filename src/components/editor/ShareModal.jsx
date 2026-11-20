import { useMemo, useRef, useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { Copy, Download, ExternalLink, FileImage, ImageDown, MessageCircle, Printer, Send, Share2 } from 'lucide-react';
import Modal from '../ui/Modal';
import DemoNotice from '../ui/DemoNotice';
import { Toggle } from '../ui/fields';
import { isDemoMode } from '../../services';
import { publicUrl } from '../../lib/utils';
import { QR_MIN_CONTRAST, canvasToBlob, contrast, logoDataUrl, renderCard, saveBlob } from '../../lib/qr';

// lucide-react no longer ships brand icons.
const Facebook = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3z" />
  </svg>
);

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const HEX = /^#[0-9a-f]{6}$/i;

export default function ShareModal({ open, onClose, invitation, onPublish }) {
  const hiRes = useRef(null);   // 1024px canvas used for PNG exports
  const vector = useRef(null);  // standalone SVG used for the vector export
  const [fg, setFg] = useState('#252923');
  const [logo, setLogo] = useState(true);
  const [busy, setBusy] = useState('');

  const theme = invitation?.config?.theme ?? {};
  const swatches = useMemo(() => {
    const seen = new Set();
    return [['Ink', '#252923'], ['Forest', '#455C50'], ['Accent', theme.accentColor], ['Cover', theme.coverFrom], ['Text', theme.textColor]]
      .filter(([, h]) => HEX.test(h || '') && contrast(h) >= QR_MIN_CONTRAST && !seen.has(h.toLowerCase()) && seen.add(h.toLowerCase()));
  }, [theme.accentColor, theme.coverFrom, theme.textColor]);

  if (!invitation) return null;
  const published = invitation.status === 'published' && invitation.slug;
  const url = published ? publicUrl(invitation.slug) : '';
  const title = invitation.title;
  const text = `You're invited! ${title}`;
  const paper = { bg: theme.bgColor || '#FFFFFF', text: theme.textColor || '#252923', accent: theme.accentColor || '#455C50' };
  const accentText = contrast(paper.accent, paper.bg) >= 3 ? paper.accent : paper.text;
  const imageSettings = logo ? { src: logoDataUrl(fg), width: 0, height: 0, excavate: true } : undefined;
  const img = (size) => (imageSettings ? { ...imageSettings, width: size, height: size } : undefined);

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

  const task = (name, fn) => async () => {
    setBusy(name);
    try { await fn(); } catch (e) { toast.error(e.message || 'Something went wrong.'); } finally { setBusy(''); }
  };

  const downloadPng = task('png', async () => saveBlob(await canvasToBlob(hiRes.current.querySelector('canvas')), `${invitation.slug}-qr.png`));
  const downloadCard = task('card', async () => {
    const card = await renderCard({ qrCanvas: hiRes.current.querySelector('canvas'), title, url, ...paper, branding: !invitation.config?.page?.hideBranding });
    saveBlob(await canvasToBlob(card), `${invitation.slug}-qr-card.png`);
    toast.success('Card saved — ready to print');
  });
  const downloadSvg = task('svg', async () => {
    const svg = new XMLSerializer().serializeToString(vector.current.querySelector('svg'));
    saveBlob(new Blob([svg.includes('xmlns=') ? svg : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')], { type: 'image/svg+xml' }), `${invitation.slug}-qr.svg`);
  });
  const copyImage = task('copy', async () => {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': canvasToBlob(hiRes.current.querySelector('canvas')) })]);
    toast.success('QR code copied');
  });

  return (
    <Modal open={open} onClose={onClose} title="Share invitation" size="lg">
      {!published ? (
        <div className="py-4 text-center">
          <Share2 className="mx-auto text-brand" size={36} strokeWidth={1.3} />
          <h3 className="mt-3 font-display text-lg font-bold">Publish to get a link</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">Your invitation is still a draft. Publish it to create a shareable URL and QR code.</p>
          {onPublish && <button className="btn-primary mt-5" onClick={onPublish}>Publish invitation</button>}
        </div>
      ) : (
        <div className="space-y-6">
          {isDemoMode && <DemoNotice />}
          <div>
            <label className="label" htmlFor="share-link">Invitation link</label>
            <div className="flex gap-2">
              <input id="share-link" readOnly className="input" value={url} onFocus={(e) => e.target.select()} />
              <button className="btn-primary shrink-0" onClick={() => copy()}><Copy size={15} /> Copy</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {channels.map(({ label, icon: Icon, color, run }) => (
              <button key={label} onClick={run} className="flex flex-col items-center gap-2 rounded-2xl border border-line-strong p-4 transition hover:-translate-y-0.5 hover:shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-full text-white" style={{ background: color }}><Icon size={20} /></span>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
          {typeof navigator.share === 'function' && (
            <button className="btn-secondary w-full" onClick={() => navigator.share({ title, text, url }).catch(() => {})}><Share2 size={15} /> More sharing options</button>
          )}

          {/* ------------------------------------------------------------- QR code */}
          <section className="rounded-2xl bg-canvas p-4 sm:p-5" aria-labelledby="qr-heading">
            <div className="grid gap-5 sm:grid-cols-[15.5rem_1fr] sm:items-center">
              {/* What gets printed: the invitation's own colours, its title, the code and a scan prompt */}
              <div className="mx-auto w-full max-w-[15.5rem] rounded-2xl p-3 shadow-lift ring-1 ring-ink/10" style={{ background: paper.bg, color: paper.text }} data-qr-card>
                <div className="rounded-xl border p-4 text-center" style={{ borderColor: `${paper.accent}73` }}>
                  <p className="text-[9px] font-semibold uppercase tracking-[.3em]" style={{ color: accentText }}>You’re invited</p>
                  <p className="mt-1.5 line-clamp-3 font-serif text-[22px] font-semibold leading-[1.1]">{title}</p>
                  <div className="mx-auto mt-3.5 w-fit rounded-xl bg-white p-2 shadow-card">
                    <QRCodeSVG value={url} size={150} level="H" marginSize={0} fgColor={fg} bgColor="#FFFFFF" imageSettings={img(34)} />
                  </div>
                  <p className="mt-3.5 text-[11px] font-semibold">Scan to open the invitation</p>
                </div>
              </div>

              <div>
                <h4 id="qr-heading" className="font-display text-base font-bold">QR code</h4>
                <p className="mt-1 text-sm text-ink-soft">Print it on tables, programs or save-the-dates. Guests scan it and your invitation opens instantly.</p>

                <div className="mt-4">
                  <span className="label">Code colour</span>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Code colour">
                    {swatches.map(([name, hex]) => (
                      <button key={hex} type="button" onClick={() => setFg(hex)} aria-pressed={fg.toLowerCase() === hex.toLowerCase()} title={name} aria-label={`${name} ${hex}`}
                        className={`h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-canvas transition ${fg.toLowerCase() === hex.toLowerCase() ? 'ring-ink' : 'ring-transparent hover:ring-ink/20'}`} style={{ background: hex }} />
                    ))}
                  </div>
                </div>
                <div className="mt-2"><Toggle label="Logo in the centre" checked={logo} onChange={setLogo} /></div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button className="btn-primary sm:col-span-2" onClick={downloadCard} disabled={Boolean(busy)}><Printer size={15} /> {busy === 'card' ? 'Preparing…' : 'Download printable card'}</button>
                  <button className="btn-secondary btn-sm" onClick={downloadPng} disabled={Boolean(busy)}><Download size={14} /> QR only (PNG)</button>
                  <button className="btn-secondary btn-sm" onClick={downloadSvg} disabled={Boolean(busy)}><FileImage size={14} /> Vector (SVG)</button>
                  {typeof ClipboardItem !== 'undefined' && <button className="btn-secondary btn-sm" onClick={copyImage} disabled={Boolean(busy)}><ImageDown size={14} /> Copy image</button>}
                  <a className="btn-ghost btn-sm" href={url} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Open link</a>
                </div>
                <p className="mt-3 text-xs text-ink-mute">Print it at least 3 cm wide and test-scan with your phone first. Dark code on a light background scans best.</p>
              </div>
            </div>

            {/* Off-screen, full-resolution renders used for the downloads */}
            <div className="hidden" aria-hidden="true">
              <div ref={hiRes}><QRCodeCanvas value={url} size={1024} level="H" marginSize={2} fgColor={fg} bgColor="#FFFFFF" imageSettings={img(220)} /></div>
              <div ref={vector}><QRCodeSVG value={url} size={512} level="H" marginSize={2} fgColor={fg} bgColor="#FFFFFF" imageSettings={img(110)} /></div>
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
}
