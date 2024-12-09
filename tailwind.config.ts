import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E03F41",
        secondary: "#1982BA",
        tertiary: "#D89821",
      },
      fontFamily: {
        kaisei: ["var(--font-kaisei-tokumin)"],
      },
    },
  },
  plugins: [forms],
} satisfies Config;
