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
        'aura-dark': '#0B3C5D',
        'aura-light': '#328CC1',
        'aura-orange': '#F4A261',
        'aura-bg': '#F8FAFC',
      },
    },
  },
  plugins: [],
}
