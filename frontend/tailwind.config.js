/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "inter": [
          "inter"
        ]
      },
      screens: {
        "mobile": { max: "767px" }
      }
    },
  },
  plugins: [require("daisyui")],
}