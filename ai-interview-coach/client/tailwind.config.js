/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background:    "#0a0a0f",
        surface:       "#13131a",
        primary:       "#7c3aed",
        secondary:     "#3b82f6",
        accent:        "#10b981",
        warning:       "#f59e0b",
        error:         "#ef4444",
        textPrimary:   "#ffffff",
        textSecondary: "#94a3b8",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(124, 58, 237, 0.30)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-8px)" },
        },
        pulseSlow: {
          "0%, 100%": { transform: "scale(1)",    opacity: "0.6" },
          "50%":       { transform: "scale(1.08)", opacity: "1" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400% 0" },
          "100%": { backgroundPosition:  "400% 0" },
        },
        confetti: {
          "0%":   { transform: "translateY(0)     rotate(0deg)",   opacity: "1" },
          "100%": { transform: "translateY(140px) rotate(200deg)", opacity: "0" },
        },
      },
      animation: {
        float:     "float 4s ease-in-out infinite",
        pulseSlow: "pulseSlow 1.5s ease-in-out infinite",
        fadeInUp:  "fadeInUp 0.7s ease-out both",
        shimmer:   "shimmer 1.6s linear infinite",
        confetti:  "confetti 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
