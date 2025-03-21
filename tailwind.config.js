/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:{
        fancy : "Noto Serif Balinese, serif"
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg) translateX(0)' },
          '50%': { transform: 'rotate(2deg) translateX(2px)' },
        }
      },
      animation:{
        wiggle:"wiggle 100ms linear 3"
      },
      boxShadow:{
        chat:"rgba(0, 0, 0, 0.15) 1.5px 1.5px 2px",
        profilepage : "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        icon: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        even : "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
      },
      colors: {
        primary: {
          '50': 'hsl(197, 100%, 96%)',
          '100': 'hsl(197, 100%, 91%)',
          '200': 'hsl(197, 100%, 85%)',
          '300': 'hsl(197, 100%, 75%)',
          '400': 'hsl(197, 100%, 63%)',
          '500': 'hsl(197, 100%, 56%)',
          '600': 'hsl(205, 100%, 52%)',
          '700': 'hsl(210, 100%, 50%)',
          '800': 'hsl(210, 85%, 40%)',
          '900': 'hsl(210, 80%, 33%)',
          '950': 'hsl(210, 85%, 20%)',
          '999': 'hsl(210, 100%, 10%)',
          'dark': 'hsl(210, 100%, 3%)',
        },
      }
    },
  },

  plugins: [],
}