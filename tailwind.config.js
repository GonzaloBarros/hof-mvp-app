/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          'brand-blue': '#007AFF',
          'brand-green': '#34C759',
        },
      },
    },
    plugins: [],
  }
  