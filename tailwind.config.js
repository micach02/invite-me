/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F7F4',
        brand: { DEFAULT: '#455C50', dark: '#33463C', light: '#5C7568', 50: '#EEF2EF' },
        sand: { DEFAULT: '#D8C9B2', light: '#EFE8DA' },
        accent: { DEFAULT: '#C49B72', dark: '#A97E55' },
        ink: { DEFAULT: '#252923', soft: '#5A6058', mute: '#8A8F86' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(37,41,35,.04), 0 8px 24px -8px rgba(37,41,35,.10)',
        lift: '0 2px 4px rgba(37,41,35,.05), 0 20px 40px -12px rgba(37,41,35,.18)',
      },
    },
  },
  plugins: [],
};
