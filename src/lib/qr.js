/** Helpers for the share dialog's QR code: colour safety, the centre logo, and the printable card. */

import { contrast } from './color';

export { contrast };

/** QR modules must stay dark on white to scan reliably: only offer colours with enough contrast. */
export const QR_MIN_CONTRAST = 4.5;

/** A small envelope badge, as an SVG data URL, for the middle of the code (level H leaves room for it). */
export const logoDataUrl = (color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#fff"/><circle cx="32" cy="32" r="27" fill="${color}"/><g fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 29.5 32 19l14 10.5V43a2.5 2.5 0 0 1-2.5 2.5h-23A2.5 2.5 0 0 1 18 43z"/><path d="m18.5 30 13.5 9.5L45.5 30"/></g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/** Word-wraps text onto the canvas; returns the y after the last line. */
function wrap(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3, dry = false) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test;
  });
  if (line) lines.push(line);
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) shown[maxLines - 1] = `${shown[maxLines - 1].replace(/\s+\S*$/, '')}…`;
  if (!dry) shown.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return y + shown.length * lineHeight;
}

const rounded = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

/**
 * Draws a print-ready 1200×1600 card: the invitation's own colours, its title, the QR code and a scan prompt.
 * `qrCanvas` is a high-resolution QR already rendered by qrcode.react.
 */
export async function renderCard({ qrCanvas, title, url, bg, text, accent, branding }) {
  try { await Promise.all([document.fonts.load('600 80px "Cormorant Garamond"'), document.fonts.load('600 30px "Plus Jakarta Sans"')]); } catch { /* fall back to system fonts */ }
  const W = 1200; const H = 1600;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const accentText = contrast(accent, bg) >= 3 ? accent : text;

  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = accent; ctx.globalAlpha = 0.55; ctx.lineWidth = 3;
  rounded(ctx, 48, 48, W - 96, H - 96, 36); ctx.stroke();
  ctx.globalAlpha = 0.25; rounded(ctx, 66, 66, W - 132, H - 132, 24); ctx.stroke(); ctx.globalAlpha = 1;

  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';

  // Lay the content block out first so it can be centred between the frame and the footer, whatever the title length.
  const TILE = 640;
  ctx.font = '600 92px "Cormorant Garamond", Georgia, serif';
  const titleBottom = wrap(ctx, title, W / 2, 0, W - 300, 100, 3, true);       // height of the wrapped title
  const blockH = 40 + 70 + titleBottom + 60 + TILE + 110 + 52;                  // eyebrow → url baseline
  const top = Math.max(150, 120 + (H - 120 - 190 - blockH) / 2);
  const eyebrowY = top + 40;
  const titleY = eyebrowY + 120;
  const ty = titleY + titleBottom - 30 + 60;

  ctx.fillStyle = accentText; ctx.font = '600 30px "Plus Jakarta Sans", Inter, system-ui, sans-serif';
  if ('letterSpacing' in ctx) ctx.letterSpacing = '9px';
  ctx.fillText("YOU'RE INVITED", W / 2, eyebrowY);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

  ctx.fillStyle = text; ctx.font = '600 92px "Cormorant Garamond", Georgia, serif';
  wrap(ctx, title, W / 2, titleY, W - 300, 100, 3);

  // QR tile
  const tx = (W - TILE) / 2;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.14)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18;
  ctx.fillStyle = '#FFFFFF'; rounded(ctx, tx, ty, TILE, TILE, 44); ctx.fill();
  ctx.restore();
  ctx.drawImage(qrCanvas, tx + 28, ty + 28, TILE - 56, TILE - 56);

  ctx.fillStyle = text; ctx.font = '600 46px "Plus Jakarta Sans", Inter, system-ui, sans-serif';
  ctx.fillText('Scan to open the invitation', W / 2, ty + TILE + 95);
  ctx.globalAlpha = 0.65; ctx.font = '400 30px "Plus Jakarta Sans", Inter, system-ui, sans-serif';
  const short = url.replace(/^https?:\/\//, '');
  ctx.fillText(short.length > 56 ? `${short.slice(0, 55)}…` : short, W / 2, ty + TILE + 150);
  if (branding) { ctx.globalAlpha = 0.45; ctx.font = '500 26px "Plus Jakarta Sans", Inter, system-ui, sans-serif'; ctx.fillText('Made with InviteMe', W / 2, H - 100); }
  ctx.globalAlpha = 1;
  return c;
}

export const canvasToBlob = (canvas) => new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not create the image.'))), 'image/png'));

export function saveBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
