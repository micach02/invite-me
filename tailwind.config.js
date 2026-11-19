/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Colours come from CSS variables (see :root / .dark in index.css) so the whole UI re-themes at once
      // and opacity modifiers like bg-ink/5 keep working.
      colors: {
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)', dark: 'rgb(var(--c-brand-dark) / <alpha-value>)',
          light: 'rgb(var(--c-brand-light) / <alpha-value>)', 50: 'rgb(var(--c-brand-50) / <alpha-value>)', 100: 'rgb(var(--c-brand-100) / <alpha-value>)',
        },
        sand: { DEFAULT: 'rgb(var(--c-sand) / <alpha-value>)', light: 'rgb(var(--c-sand-light) / <alpha-value>)' },
        accent: { DEFAULT: '#C49B72', dark: '#A97E55' },
        ink: { DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)', soft: 'rgb(var(--c-ink-soft) / <alpha-value>)', mute: 'rgb(var(--c-ink-mute) / <alpha-value>)' },
        line: { DEFAULT: 'rgb(var(--c-line) / <alpha-value>)', strong: 'rgb(var(--c-line-strong) / <alpha-value>)' },
        // Always-dark fills (phone bezels, scrims, the closing CTA) that must NOT flip with the theme.
        night: '#252923',
        deep: 'rgb(var(--c-deep) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // App UI headings. Serif stays reserved for marketing and the invitations themselves.
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(37,41,35,.04), 0 2px 8px -2px rgba(37,41,35,.06)',
        pop: '0 4px 6px -2px rgba(37,41,35,.05), 0 12px 24px -6px rgba(37,41,35,.12)',
        lift: '0 2px 4px rgba(37,41,35,.05), 0 20px 40px -12px rgba(37,41,35,.18)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'none' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        marquee: { to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-in': 'fade-in .35s cubic-bezier(.2,.8,.2,1) both',
        marquee: 'marquee 60s linear infinite',
      },
    },
  },
  plugins: [],
};
