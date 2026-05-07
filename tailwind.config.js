/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          50: "#f5f7ff",
          100: "#ebf0fe",
          200: "#ced9fd",
          300: "#a2b6fa",
          400: "#708af5",
          500: "#4b61ef", // Cor principal: Azul suave e confiável
          600: "#3441e4",
          700: "#2a32d1",
          800: "#272bad",
          900: "#252a8a",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e5ece6",
          200: "#ceddcf",
          300: "#a9c3ab",
          400: "#7da281",
          500: "#5d8461", // Verde menta/sálvia para calma
        },
        rose: {
          50: "#fff5f6",
          100: "#ffebee",
          200: "#ffd6db",
          300: "#ffb3bc",
          400: "#ff8091",
          500: "#f7516a", // Rose suave para empatia
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-gentle": "pulse-gentle 3s infinite ease-in-out",
      },
      keyframes: {
        "pulse-gentle": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
