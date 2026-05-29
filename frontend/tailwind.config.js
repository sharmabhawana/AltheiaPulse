/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080C16',
          card: '#0F172A',
          border: 'rgba(255, 255, 255, 0.08)',
          blue: '#00F0FF',
          purple: '#AD00FF',
          green: '#10B981',
          red: '#EF4444',
          orange: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 240, 255, 0.35)',
        'glow-purple': '0 0 20px rgba(173, 0, 255, 0.35)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
