/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        'mainColor': '#181818',
        'accentColor': '#631e8b',
        'onFail': 'red',
        'onSuccess': '#00ff19',
        'tertiaryColor': '#d4c4fb'
      }
    }
  },
  plugins: [],
}

