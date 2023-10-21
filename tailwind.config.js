/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Manrope, sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
