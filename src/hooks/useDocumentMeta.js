import { useEffect } from 'react';

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  const prev = el.getAttribute('content');
  el.setAttribute('content', content ?? '');
  return () => (prev === null ? el.remove() : el.setAttribute('content', prev));
};

/**
 * Title, description, Open Graph / Twitter tags and robots for the current page.
 * NOTE: client-side only. Link-preview crawlers (Facebook, WhatsApp) don't run JS, so for rich
 * previews serve /invitation/:slug through a prerender/edge function — see README.
 */
export function useDocumentMeta({ title, description, image, url, noindex } = {}) {
  useEffect(() => {
    if (!title) return undefined;
    const prevTitle = document.title;
    document.title = title;
    const undo = [
      setMeta('name', 'description', description),
      setMeta('property', 'og:title', title),
      setMeta('property', 'og:description', description),
      setMeta('property', 'og:type', 'website'),
      setMeta('property', 'og:url', url || window.location.href),
      setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary'),
      setMeta('name', 'twitter:title', title),
      setMeta('name', 'twitter:description', description),
      setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow'),
    ];
    if (image) undo.push(setMeta('property', 'og:image', image), setMeta('name', 'twitter:image', image));
    return () => { document.title = prevTitle; undo.forEach((fn) => fn()); };
  }, [title, description, image, url, noindex]);
}
