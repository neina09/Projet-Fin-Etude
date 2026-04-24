/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1d4ed8',
        'brand-blue-hover': '#1e40af',
      }
    },
  },
  plugins: [],
}