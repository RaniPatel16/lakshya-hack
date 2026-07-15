/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F7F4', // Warm Ivory
        surface: '#EAE7E1', // Stone
        primary: '#275D4D', // Forest Green
        accent: '#D97745', // Burnt Orange
        highlight: '#D6B36A', // Soft Gold
        charcoal: '#1D1D1F', // Charcoal Text
        'surface-hover': '#E0DDD6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(29, 29, 31, 0.05)',
        'premium': '0 10px 40px -10px rgba(29, 29, 31, 0.08)',
        'float': '0 20px 40px -15px rgba(29, 29, 31, 0.12)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
