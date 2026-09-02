import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E8E8F2",
          100: "#C6C6DE",
          200: "#A4A4CA",
          250: "#9393BE",
          300: "#8282B6",
          400: "#5555A0",
          500: "#2D2D7E",
          600: "#000047",
          700: "#00003D",
          800: "#000033",
          900: "#000024",
        },
        navy: {
          900: "#0B192C",
          800: "#0F1D33",
          700: "#132744",
          600: "#1A3A5C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
