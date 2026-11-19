/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F7F4',
        brand: { DEFAULT: '#455C50', dark: '#33463C', light: '#5C7568', 50: '#EEF2EF', 100: '#DDE6E0' },
        sand: { DEFAULT: '#D8C9B2', light: '#EFE8DA' },
        accent: { DEFAULT: '#C49B72', dark: '#A97E55' },
        ink: { DEFAULT: '#252923', soft: '#5A6058', mute: '#8A8F86' },
        line: { DEFAULT: '#E8E4DA', strong: '#D9D3C5' },
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
