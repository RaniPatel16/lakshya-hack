/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC', // Slate 50 (Very light gray-white for contrast)
        surface: '#FFFFFF', // Pure white
        primary: '#059669', // Emerald 600 (Rich Green for branding, headings, buttons)
        secondary: '#64748B', // Slate 500 (Muted text)
        accent: '#047857', // Emerald 700
        highlight: '#34D399', // Emerald 400
        charcoal: '#0F172A', // Slate 900 (Dark text)
        'surface-hover': '#F1F5F9', // Slate 100
        border: '#E2E8F0', // Slate 200
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
        'float': '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
