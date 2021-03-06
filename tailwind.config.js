module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}
