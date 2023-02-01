/** @type {import('tailwindcss').Config} */

module.exports = {
  important: true,
  content: ['./pages/**/*.{ts,tsx}', './src/**/components/*.{ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        h1: '38px',
        h2: '30px',
        h3: '24px',
        h4: '20px',
        h5: '16px',
        body: '14px',
        footnote: '12px',
      },
      colors: {
        primary: '#597ef7',
      },
    },
  },
  plugins: [],
};
