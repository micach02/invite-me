/** Formats that can carry transparency, which a JPEG re-encode would flatten onto black. */
const ALPHA_TYPES = ['image/png', 'image/webp', 'image/avif'];

/**
 * Downscale + re-encode an image client-side to keep uploads (and demo storage) small.
 * `keepAlpha` (logos) re-encodes transparent formats as WebP — or PNG where the browser can't write WebP — instead of JPEG.
 */
export function compressImage(file, maxDim = 1600, quality = 0.82, { keepAlpha = false } = {}) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file.'));
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') return resolve(file);
    const alpha = keepAlpha && ALPHA_TYPES.includes(file.type);
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(src);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image.'))), alpha ? 'image/webp' : 'image/jpeg', alpha ? 0.9 : quality);
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error('Could not read that image.'));
    };
    img.src = src;
  });
}

export const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Could not read file.'));
    r.readAsDataURL(blob);
  });
