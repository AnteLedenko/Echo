/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        logo: ['"Jolly Lodger"'],
        funnel: ['"Funnel Display"', 'sans-serif'],
        lora: ['"Lora"', 'serif'],
      },
    },
  },
  plugins: [],
};