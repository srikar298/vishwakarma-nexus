/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        turmeric: '#FFC000',
        vermilion: '#D3372A', // Deepened from #E34234 to pass 4.5:1 contrast ratio against white
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Primary Saffron
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        ramaraja: ['Ramaraja', 'serif'],
        rozha: ['"Rozha One"', 'serif'],
        ntr: ['NTR', 'sans-serif'],
        sahitya: ['Sahitya', 'serif'],
        anek: ['"Anek Telugu"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
