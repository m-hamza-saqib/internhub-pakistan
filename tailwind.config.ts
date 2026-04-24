import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '50':  '#E5ECFA',
          '100': '#A8C1EE',
          '200': '#6B93D8',
          '300': '#3D6CC4',
          '400': '#2452A4',
          '500': '#1C3B78',
          '600': '#152D5C',
          '700': '#0F2044',
          '800': '#0A1628',
          '900': '#060E1A',
          DEFAULT: '#2452A4',
        },
        accent: {
          '100': '#DCFCE7',
          '400': '#22C55E',
          '500': '#15803D',
          '600': '#0D6B35',
          DEFAULT: '#15803D',
        },
        gold: {
          '100': '#FEF9C3',
          '400': '#F0CA45',
          '500': '#D4AF37',
          DEFAULT: '#D4AF37',
        },
        background: '#FFFFFF',
        'bg-secondary': '#F8FAFF',
        'bg-dark': '#0A1628',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)',
        modal: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
