/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6750A4",
        "on-primary": "#FFFFFF",
        "primary-container": "#EADDFF",
        "on-primary-container": "#21005D",
        surface: "#FEF7FF",
        "surface-variant": "#E7E0EC",
        outline: "#79747E",
      },
    },
  },
  plugins: [],
}
