
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: 'rgba(99, 102, 241, 0.1)',
        },
        secondary: {
          DEFAULT: '#10b981',
          hover: '#059669',
          light: 'rgba(16, 185, 129, 0.1)',
        },
        darkBg: '#0b0f17',
        panelBg: '#161c2d',
        cardBg: 'rgba(22, 28, 45, 0.4)',
        borderDark: 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
        glow: '0 0 30px rgba(99, 102, 241, 0.25)',
      }
    },
  },
  plugins: [],
};
