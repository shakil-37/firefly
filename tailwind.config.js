/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      primary: ["Roboto", " sans-serif"],
    },
    colors: {
      first: "#1877F2",
      second: "#FE5252",
      third: "#F6F6F6",
      white: "#FFFFFF",
      black: "#00224D",
    },
  },
  plugins: [require("daisyui")],
};
