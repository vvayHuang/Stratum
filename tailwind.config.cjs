module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '425px',
      },
      colors: {
        'background-hover-variable': '#00BB70',
      },
    },
  },
  plugins: [],
};
