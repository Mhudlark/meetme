/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      colors: {
        'rose-gray': {
          50: '#f0eef0',
        },
        background: {
          DEFAULT: '#fff1f2',
        },
      },
      gridTemplateColumns: {
        // Simple auto fill column grid
        'auto-fill': 'repeat(auto-fill, minmax(0, 1fr))',
        'auto-fill-32': 'repeat(auto-fill, minmax(32px, 1fr))',
        'auto-fill-64': 'repeat(auto-fill, minmax(64px, 1fr))',
      },
    },
  },
  plugins: [],
};
