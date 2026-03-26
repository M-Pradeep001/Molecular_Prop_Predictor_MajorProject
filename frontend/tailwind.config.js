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
        // Brand — single primary color
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        // Neutral surface scale (replaces heavy navy)
        surface: {
          0:   '#ffffff',
          1:   '#fafafa',
          2:   '#f4f4f5',
          3:   '#e4e4e7',
        },
        'surface-dark': {
          0:   '#09090b',
          1:   '#0f0f11',
          2:   '#18181b',
          3:   '#27272a',
        },
        // Property colors — muted, not neon
        homo:   { DEFAULT: '#7c3aed', light: '#a78bfa', muted: '#ede9fe' },
        lumo:   { DEFAULT: '#2563eb', light: '#60a5fa', muted: '#dbeafe' },
        gap:    { DEFAULT: '#059669', light: '#34d399', muted: '#d1fae5' },
        dipole: { DEFAULT: '#d97706', light: '#fbbf24', muted: '#fef3c7' },
        polar:  { DEFAULT: '#db2777', light: '#f472b6', muted: '#fce7f3' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        'card':  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
