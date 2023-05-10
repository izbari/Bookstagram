module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: '#1fb6ff',
        purple: '#7e5bef',
        gray: '#8492a6',
      },
      spacing: {
        '2x': '20px',
        '3x': '30px',
      },
      borderRadius: {
        '4xl': '40px',
      },
    },
  },
  plugins: [],
};
