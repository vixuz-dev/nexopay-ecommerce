/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '365px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Colores principales del proyecto
        primary: {
          50: '#f0f9fc',
          100: '#d1f0f7',
          200: '#a3e1ef',
          300: '#75d2e7',
          400: '#47c3df',
          500: '#208eaa', // Color principal
          600: '#1a7288',
          700: '#145666',
          800: '#0e3a44',
          900: '#081e22',
        },
        secondary: {
          50: '#f0fbfd',
          100: '#d1f2f8',
          200: '#a3e5f1',
          300: '#75d8ea',
          400: '#47cbe3',
          500: '#5ec4e3', // Color secundario
          600: '#4b9db6',
          700: '#387689',
          800: '#254f5c',
          900: '#12282e',
        },
        highlight: {
          50: '#f9faf4',
          100: '#f2f5e8',
          200: '#e5ebd1',
          300: '#d8e1ba',
          400: '#cbd7a3',
          500: '#c1d224', // Color de highlights
          600: '#9ba81d',
          700: '#757e16',
          800: '#4f540f',
          900: '#292a08',
        },
        neutral: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fbfbfb',
          300: '#f9f9f9',
          400: '#f5f5f5',
          500: '#f1f1f0', // Color neutro
          600: '#c1c1c0',
          700: '#919190',
          800: '#616160',
          900: '#313130',
        },
      },
    },
  },
  plugins: [],
}
