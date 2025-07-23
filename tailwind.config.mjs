/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: "var(--font-montserrat)",
        "zen-dots": "var(--font-zen-dots)",
      },
      colors: {
        heroBackground: "#fffffe",
        headline: "#272343",
        subHeadline: "#2d334a",
        primary: {
          DEFAULT: "#E7C9A5",
        },
        secondary: {
          DEFAULT: "#e3f6f5",
        },
        tertiary: {
          DEFAULT: "#bae8e8",
        },
        accent: {
          DEFAULT: "#FDE082",
        },
        card: {
          DEFAULT: "#272343",
        },
        border: "#272343",
        green: {
          DEFAULT: "#027A48",
          100: "#ECFDF3",
          400: "#4C7B62",
          500: "#2CC171",
          800: "#027A48",
        },
        red: {
          DEFAULT: "#EF3A4B",
          400: "#F46F70",
          500: "#E27233",
          800: "#EF3A4B",
        },
        blue: {
          100: "#0089F1",
        },
        light: {
          100: "#D6E0FF",
          200: "#EED1AC",
          300: "#F8F8FF",
          400: "#EDF1F1",
          500: "#8D8D8D",
          600: "#F9FAFB",
          700: "#E2E8F0",
          800: "#F8FAFC",
        },
        dark: {
          100: "#16191E",
          200: "#3A354E",
          300: "#232839",
          400: "#1E293B",
          500: "#0F172A",
          600: "#333C5C",
          700: "#464F6F",
          800: "#1E2230",
        },
        gray: {
          100: "#CBD5E1",
        },
        card1: "#FFF3E0",
        card2: "#E8F5E9",
        card3: "#E8F5E9",
        card4: "#F3E5F5",
      },
    },
  },
  plugins: [],
};
