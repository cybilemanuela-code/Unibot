/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff3ed',
          100: '#ffe4d1',
          200: '#ffc59e',
          300: '#ff9b64',
          400: '#ff6a28',
          500: '#e85d1a',  // primary orange
          600: '#c44a0e',
          700: '#9d3a0c',
          800: '#7d2e0f',
          900: '#682810',
          950: '#3a1206',
        },
        surface: {
          50:  '#f8f7f5',
          100: '#f0ede8',
          200: '#e3ddd5',
          300: '#d0c8bc',
        }
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':  '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)',
        'input': '0 1px 2px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      }
    },
  },
  plugins: [],
}