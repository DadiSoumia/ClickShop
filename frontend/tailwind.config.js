/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
         background: "#FAF6F1",
        surface: "#F0E4D8",
        border: "#DDCBB8",
        secondary: "#C98B6B",
        primary: "#B85C38",
        ink: "#3A2E28",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};