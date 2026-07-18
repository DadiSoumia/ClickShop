/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAF6F1",
        cream: "#FDF9F4",
        surface: "#F0E4D8",
        border: "#DDCBB8",
        secondary: "#C98B6B",
        primary: "#B85C38",
        "primary-dark": "#9A4A2C",
        ink: "#3A2E28",
        "ink-soft": "#6B5B50",
        gold: "#C9A876",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        wide2: "0.04em",
        wide3: "0.08em",
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(58, 46, 40, 0.08)",
        card: "0 8px 24px -6px rgba(58, 46, 40, 0.12)",
        "card-hover": "0 20px 40px -12px rgba(58, 46, 40, 0.22)",
        premium: "0 25px 50px -12px rgba(58, 46, 40, 0.25)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};