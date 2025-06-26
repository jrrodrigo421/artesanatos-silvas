/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#f8f9fa',
          orange: '#ff6b47',
          navy: '#2d3748',
          gray: '#4a5568',
          dark: '#1a202c',
          charcoal: '#2d3748',
          green: '#48bb78',
          slate: '#718096',
          blue: '#4299e1',
          deepblue: '#3182ce',
        },
        status: {
          pending: {
            50: '#fed7cc',
            100: '#fec5b5',
            500: '#ff6b47',
            600: '#f56500',
            700: '#e53e3e',
          },
          progress: {
            50: '#bee3f8',
            100: '#90cdf4',
            500: '#4299e1',
            600: '#3182ce',
            700: '#2c5aa0',
          },
          success: {
            50: '#c6f6d5',
            100: '#9ae6b4',
            500: '#48bb78',
            600: '#38a169',
            700: '#2f855a',
          },
          error: {
            50: '#fed7cc',
            100: '#fec5b5',
            500: '#ff6b47',
            600: '#f56500',
            700: '#e53e3e',
          }
        },
        primary: {
          50: '#bee3f8',
          100: '#90cdf4',
          200: '#63b3ed',
          300: '#4299e1',
          400: '#3182ce',
          500: '#4299e1',
          600: '#3182ce',
          700: '#2c5aa0',
          800: '#2a4365',
          900: '#1a202c',
        },
        accent: {
          50: '#fed7cc',
          100: '#fec5b5',
          200: '#feb2a0',
          300: '#fd9e8a',
          400: '#fc8a75',
          500: '#ff6b47',
          600: '#f56500',
          700: '#e53e3e',
          800: '#c53030',
          900: '#9c2222',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#e2e8f0',
          200: '#cbd5e0',
          300: '#a0aec0',
          400: '#718096',
          500: '#4a5568',
          600: '#2d3748',
          700: '#2d3748',
          800: '#1a202c',
          900: '#171923',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-gentle': 'pulseGentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 107, 71, 0.4)',
        'glow-blue': '0 0 20px rgba(66, 153, 225, 0.4)',
        'glow-green': '0 0 20px rgba(72, 187, 120, 0.4)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #ff6b47, #4299e1)',
        'gradient-brand-subtle': 'linear-gradient(135deg, #2d3748, #1a202c)',
        'gradient-success': 'linear-gradient(135deg, #48bb78, #4299e1)',
        'grid-pattern': `
          linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.glass-effect': {
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(45, 55, 72, 0.95)',
          border: '1px solid rgba(113, 128, 150, 0.3)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #ff6b47, #4299e1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.text-gradient-subtle': {
          background: 'linear-gradient(135deg, #a0aec0, #cbd5e0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1a202c',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ff6b47',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#4299e1',
          },
        },
        // Utilitários responsivos
        '.container-responsive': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@screen sm': {
            maxWidth: '640px',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@screen md': {
            maxWidth: '768px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen lg': {
            maxWidth: '1024px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen xl': {
            maxWidth: '1280px',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
          '@screen 2xl': {
            maxWidth: '1536px',
          },
        },
        '.grid-responsive': {
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: '1fr',
          '@screen sm': {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
          },
          '@screen md': {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
          },
          '@screen lg': {
            gridTemplateColumns: 'repeat(3, 1fr)',
          },
          '@screen xl': {
            gridTemplateColumns: 'repeat(4, 1fr)',
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
} 