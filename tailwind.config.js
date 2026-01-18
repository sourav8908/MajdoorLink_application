
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        odisha: {
          terracotta: '#C04000',
          teal: '#004d40',
          saffron: '#FF9933',
          deep: '#1a1a1a',
          sands: '#f4f1ea',
          accent: '#4F6FB4'
        }
      }
    }
  },
  plugins: [],
}
