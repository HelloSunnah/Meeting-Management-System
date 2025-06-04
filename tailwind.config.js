/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      keyframes: {
        sweep: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '0 0' },
        },
      },
      animation: {
        sweep: 'sweep 4s linear infinite',
      },
      backgroundSize: {
        '200': '200% 100%',
      },
    },},
  plugins: [],
}
