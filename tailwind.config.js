/** @type {import('tailwindcss').Config} */
import { TAG_COLOURS } from "./src/lib/tagColours.js";
import { withUt } from "uploadthing/tw";

module.exports = withUt({
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx}"],
  safelist: TAG_COLOURS.map((colour) => `bg-[${colour}]`),
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        custom: {
          background: "#F4FFF8",
          text: "#000F08",
          accent: "#49392C",
          secondary: "#839073",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
});
