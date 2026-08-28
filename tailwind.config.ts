import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          950: "#0a0e17",
          900: "#0f1420",
          850: "#131a29",
          800: "#182131",
          700: "#212c40",
          600: "#2c3a54",
          500: "#3c4d6c",
          400: "#5b6d8c",
          300: "#8b9ab3",
          200: "#c1cadb",
          100: "#e4e9f2",
          50: "#f4f6fa",
        },
        gold: {
          50: "#fdf8ec",
          100: "#faedc7",
          200: "#f4da8f",
          300: "#ecc257",
          400: "#e4ad3a",
          500: "#c8912a",
          600: "#a4741f",
          700: "#7f591c",
          800: "#68481c",
          900: "#583d1c",
        },
        emerald: {
          50: "#eafbf3",
          400: "#34c48b",
          500: "#22a878",
          600: "#178a63",
        },
        rose: {
          50: "#fdf0f1",
          400: "#e8697a",
          500: "#d94c5f",
          600: "#b73a4b",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15,20,32,0.06), 0 1px 3px 0 rgba(15,20,32,0.08)",
        panel: "0 4px 24px -4px rgba(15,20,32,0.12)",
      },
      borderRadius: {
        xl2: "1.05rem",
      },
    },
  },
  plugins: [],
};
export default config;
