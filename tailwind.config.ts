/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}', // For App Router
      './src/**/*.{js,ts,jsx,tsx}', // For /src folder
    ],
    theme: {
      extend: {
        fontFamily: {
          f: ['Fredoka', 'sans-serif'], // <== now you can use 'font-f'
        },
      },
    },
    plugins: ['@tailwindcss/typography'],
  }
  