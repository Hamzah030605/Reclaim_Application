/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary UI & Backgrounds
        'brand-blue': '#4A6FA7',
        'light-bg': '#F8F9FA',
        'subtle-gray': '#E9ECEF',
        
        // Accent & Progress Colors
        'success-green': '#2ECC71',
        'achievement-gold': '#F1C40F',
        'community-blue': '#3498DB',
        
        // Neutral Colors
        'primary-text': '#343A40',
        'secondary-text': '#6C757D',
        'border-gray': '#CED4DA',
        
        // Action & Alert Colors
        'panic-red': '#EC5766',
        'cta-orange': '#E67E22',
      },
      fontFamily: {
        'primary': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
