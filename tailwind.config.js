/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:"class",
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
      fontSize:{
          sm: '0.75rem',
          base: '1rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.75rem',
          '4xl': '2.441rem',
          '5xl': '3.052rem',
          '6xl': '3.5rem',
          '7xl': '4rem',  
      },
      screens:{
        xs:'450px',
        sm:'680px',
        // md:'900px',
        // lg:'1500px',
        '3xl':'2400px',
        '4xl':'3500px'
      },
      fontFamily: {
        gilroy: ['Gilroy-Bold', 'sans-serif'],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
