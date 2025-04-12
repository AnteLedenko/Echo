/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        logo: ['"Jolly Lodger"', 'cursive'],
        funnel: ['"Funnel Display"', 'sans-serif'],
        lora: ['"Lora"', 'serif'],
      },
    },
  },
  plugins: [],
};