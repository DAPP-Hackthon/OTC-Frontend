/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = {
  darkMode:"class",
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      padding: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
      },
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
        gilroyMd:['Gilroy-Medium'],
        gilroy:['Gilroy-Regular'],
        gilroyB: ['Gilroy-Bold', 'sans-serif'],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}
