/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            maxWidth: '65ch',
            '[class~="lead"]': {
              color: theme('colors.gray.600'),
            },
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.gray.900'),
              fontWeight: theme('fontWeight.bold'),
            },
            hr: {
              borderColor: theme('colors.gray.200'),
            },
            strong: {
              color: theme('colors.gray.900'),
              fontWeight: theme('fontWeight.bold'),
            },
            code: {
              color: theme('colors.gray.900'),
              backgroundColor: theme('colors.gray.100'),
              padding: theme('spacing.1'),
              borderRadius: theme('borderRadius.md'),
              fontWeight: theme('fontWeight.normal'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            '[class~="lead"]': {
              color: theme('colors.gray.400'),
            },
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.gray.100'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            code: {
              color: theme('colors.gray.100'),
              backgroundColor: theme('colors.gray.800'),
            },
          },
        },
      }),
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'max-height': 'max-height',
        'transform': 'transform',
      },
      keyframes: {
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-slide-up': 'fade-slide-up 0.4s ease-out',
        'fade-slide-down': 'fade-slide-down 0.4s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 