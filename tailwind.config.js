/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'w-img': "url('./assets/w.png')",
      },
    },
  },
  plugins: [],
}

