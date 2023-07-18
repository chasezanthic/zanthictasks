/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        zanthic: {
          primary: "#07223D",
          secondary: "#FFFFFF",
          accent: "#B5D3E7",
          neutral: "#000000",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
