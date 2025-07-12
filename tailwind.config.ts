/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}', // For App Router
      './src/**/*.{js,ts,jsx,tsx}', // For /src folder
    ],
    theme: {
      extend: {
        backgroundImage: {
          'product': "url('/product-bg.jpg')", // 👈 replace with your actual image path
        },
        fontFamily: {
          f: ['Fredoka', 'sans-serif'], // <== now you can use 'font-f'
        },
      },
    },
    plugins: ['@tailwindcss/typography'],
  }
  