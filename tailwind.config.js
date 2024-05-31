/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        primary: '20px',
      },
      colors: {
        primary: '#1677ff',
        black: '#212427',
      },
    },
  },
  plugins: ['prettier-plugin-tailwindcs'],
}
