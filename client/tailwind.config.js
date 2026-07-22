/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F6F2', // Warm Ivory
        surface: '#FFFFFF', // White cards
        primary: '#1F4E46', // Deep Forest Green
        secondary: '#6B7280', // Secondary Text
        accent: '#D88C4A', // Burnt Orange
        highlight: '#E8C547', // Soft Gold
        charcoal: '#222222', // Primary Text
        'surface-hover': '#F3F0EA',
        border: '#E5E0D8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
        'float': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '18px',
        '3xl': '20px',
      }
    },
  },
  plugins: [],
}
