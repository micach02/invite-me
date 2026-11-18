import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages (and most static hosts) can't rewrite unknown URLs to index.html. Pages serves /404.html for
 * unknown paths, so emitting a copy of the app shell there makes deep links and refreshes work
 * (e.g. /invite-me/templates?page=2). Harmless on hosts that already rewrite.
 */
const spaFallback = () => ({
  name: 'spa-404-fallback',
  apply: 'build',
  closeBundle() {
    const out = path.resolve('dist');
    if (fs.existsSync(path.join(out, 'index.html'))) fs.copyFileSync(path.join(out, 'index.html'), path.join(out, '404.html'));
  },
});

// VITE_BASE=/invite-me/ for GitHub Pages project sites; defaults to '/' for local dev and root-domain hosting.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), spaFallback()],
});
