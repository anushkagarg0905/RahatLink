/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D1117",
        panel: "#161B22",
        primary: "#FF6B00",
        critical: "#EF4444",
        high: "#F97316",
        medium: "#EAB308",
        low: "#22C55E",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
