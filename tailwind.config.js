const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      colors: {
        primary: {
          default: '#DE3F82',
          100: '#F3B7D0',
          200: '#EF9FC0',
          300: '#EB87B1',
          400: '#E76FA1',
          500: '#E35791',
          600: '#DE3F82',
          700: '#D6246E'
        }
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans]
      }
    },
    fontFamily: {
      'display': ['Quicksand', 'sans-serif'],
      'body': ['Inter', 'sans-serif']
    },
  },
  variants: {},
  plugins: [],
}
