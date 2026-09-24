/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0A0D14',
          card: '#101522',
          border: 'rgba(255,255,255,0.06)',
        },
        cyan: {
          electric: '#00F0FF',
        },
        indigo: {
          deep: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.25) 0%, transparent 60%)',
        'cyan-glow':
          'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,240,255,0.12) 0%, transparent 70%)',
        'gradient-brand':
          'linear-gradient(135deg, #6366F1 0%, #00F0FF 100%)',
        'gradient-card':
          'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(0,240,255,0.04) 100%)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0,240,255,0.15)',
        'glow-indigo': '0 0 25px rgba(99,102,241,0.2)',
        'glow-cyan-lg': '0 0 50px rgba(0,240,255,0.2)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'countdown': 'countdown 60s linear forwards',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0,240,255,0.1)' },
          '50%': { boxShadow: '0 0 35px rgba(0,240,255,0.35)' },
        },
        scanLine: {
          '0%': { top: '0%', opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
