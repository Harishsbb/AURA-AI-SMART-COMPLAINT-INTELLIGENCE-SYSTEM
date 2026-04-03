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
        'aura-dark':   '#1e1b4b',   // Deep indigo
        'aura-dark-2': '#0f0d2e',   // Darkest indigo
        'aura-light':  '#6366f1',   // Indigo 500
        'aura-glow':   '#818cf8',   // Indigo 400
        'aura-orange': '#f59e0b',   // Amber 400 (warm accent)
        'aura-bg':     '#f5f3ff',   // Indigo 50 (lavender tint)
      },
      backgroundImage: {
        'gradient-aura':         'linear-gradient(135deg, #0f0d2e 0%, #1e1b4b 50%, #312e81 100%)',
        'gradient-card-indigo':  'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
        'gradient-card-amber':   'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        'gradient-card-green':   'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-card-pink':    'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
        'dot-grid':              'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
      animation: {
        'float':          'float 7s ease-in-out infinite',
        'float-slow':     'float 10s ease-in-out infinite',
        'float-delayed':  'float 7s ease-in-out 3.5s infinite',
        'glow-pulse':     'glow-pulse 2.5s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'slide-up':       'slide-up 0.4s ease-out',
        'fade-scale':     'fade-scale 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%':      { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        'fade-scale': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)'    },
        },
      },
      boxShadow: {
        'glow-indigo': '0 8px 32px rgba(99,102,241,0.35)',
        'glow-amber':  '0 8px 32px rgba(245,158,11,0.35)',
        'glow-green':  '0 8px 32px rgba(16,185,129,0.30)',
        'glow-pink':   '0 8px 32px rgba(236,72,153,0.35)',
        'card':        '0 4px 24px rgba(30,27,75,0.08)',
        'card-hover':  '0 12px 40px rgba(30,27,75,0.15)',
      },
    },
  },
  plugins: [],
}
