export const colors = {
  // Brand Colors
  primary: {
    400: '#818CF8', // blue-400
    500: '#6366F1', // indigo-500
    600: '#4F46E5', // indigo-600
    700: '#4338CA', // indigo-700
  },
  // Background Colors
  background: {
    950: '#030712', // gray-950
    900: '#111827', // gray-900
    800: '#1F2937', // gray-800
    700: '#374151', // gray-700
  },
  // Text Colors
  text: {
    white: '#FFFFFF',
    gray: {
      400: '#9CA3AF',
      300: '#D1D5DB',
    }
  }
}

export const typography = {
  heading: {
    h1: {
      size: '4.5rem', // text-7xl
      weight: '800', // font-extrabold
      lineHeight: '1.15', // leading-tight
      tracking: '-0.02em', // tracking-tight
    },
    h2: {
      size: '2.25rem', // text-4xl
      weight: '700', // font-bold
      lineHeight: '1.2',
    }
  },
  body: {
    large: {
      size: '1.25rem', // text-xl
      weight: '400',
      lineHeight: '1.75',
    },
    base: {
      size: '1rem',
      weight: '400',
      lineHeight: '1.5',
    }
  }
}

export const spacing = {
  section: {
    padding: '6rem', // py-24
  },
  container: {
    maxWidth: '80rem', // max-w-6xl
    padding: '1rem', // px-4
  }
}

export const effects = {
  glassmorphism: {
    background: 'rgba(31, 41, 55, 0.5)', // bg-gray-800/50
    backdrop: 'blur(8px)',
    border: 'rgba(55, 65, 81, 0.5)', // border-gray-700/50
  },
  gradients: {
    background: 'linear-gradient(to bottom, #030712, #000000)', // from-gray-950 to-black
    text: 'linear-gradient(to right, #818CF8, #6366F1)', // from-blue-400 to-indigo-500
    cta: 'linear-gradient(to bottom, rgba(31, 41, 55, 0.5), rgba(79, 70, 229, 0.2))', // from-gray-900/50 to-indigo-900/20
  }
}

export const animations = {
  transition: {
    default: 'all 0.3s ease',
    transform: 'transform 0.3s ease',
    opacity: 'opacity 0.3s ease',
  },
  hover: {
    scale: 'scale(1.05)',
    translateX: 'translateX(0.25rem)',
  }
}

// Component-specific tokens
export const components = {
  button: {
    primary: {
      background: colors.primary[600],
      hoverBackground: colors.primary[700],
      text: colors.text.white,
      padding: '1rem 2rem', // px-8 py-4
      borderRadius: '0.5rem', // rounded-lg
    },
    secondary: {
      border: '1px solid ' + colors.background[700],
      hoverBorder: '1px solid ' + colors.primary[500],
      text: colors.text.white,
      padding: '1rem 2rem',
      borderRadius: '0.5rem',
    }
  },
  card: {
    feature: {
      background: effects.glassmorphism.background,
      border: '1px solid ' + effects.glassmorphism.border,
      padding: '1.5rem', // p-6
      borderRadius: '0.5rem',
    },
    screenshot: {
      width: {
        mobile: '300px',
        desktop: '500px',
      },
      shadow: '0 25px 50px -12px rgba(79, 70, 229, 0.25)', // shadow-indigo-500/20
    }
  }
} 