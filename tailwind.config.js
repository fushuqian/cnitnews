/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fde3e3',
          200: '#fbcbcb',
          300: '#f7a7a7',
          400: '#f07575',
          500: '#C41E3A',
          600: '#a81830',
          700: '#8c1328',
          800: '#751020',
          900: '#4a0a14',
        },
      },
    },
  },
  plugins: [],
}
