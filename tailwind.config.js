/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Manrope, sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
