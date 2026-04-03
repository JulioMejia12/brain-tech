module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        text: "#111827",
        primary: {
          DEFAULT: "#16A34A",
          50: "#E6F8ED"
        },
        cards: "#F9FAFB"
      }
    }
  },
  plugins: []
};
