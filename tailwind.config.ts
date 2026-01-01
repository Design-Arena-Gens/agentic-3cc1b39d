import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d9f0ff",
          200: "#b5e2ff",
          300: "#80cffe",
          400: "#3ab5fb",
          500: "#089aed",
          600: "#007cd2",
          700: "#0062a8",
          800: "#004d82",
          900: "#003c64"
        }
      }
    }
  },
  plugins: []
};

export default config;
