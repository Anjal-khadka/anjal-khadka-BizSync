/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0d1a',
        card: '#0f1224',
      },
      boxShadow: {
        glass: '0 20px 70px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
