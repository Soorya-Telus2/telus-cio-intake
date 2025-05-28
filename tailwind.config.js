/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        telus: {
          purple: '#4B0082',
          green: '#66CC00',
          blue: '#0066CC',
          gray: '#666666',
        }
      }
    },
  },
  plugins: [],
}
