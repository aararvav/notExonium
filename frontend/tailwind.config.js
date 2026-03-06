/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'system-ui',
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at top, rgba(94,234,212,0.18), transparent 60%), radial-gradient(circle at bottom, rgba(59,130,246,0.35), transparent 55%)',
      },
    },
  },
  plugins: [],
};


