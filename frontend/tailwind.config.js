/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        void:      '#07070D',
        bgDeep:    '#0B0B14',
        bgBase:    '#0F0F1A',
        bgSurface: '#141421',
        bgCard:    '#1A1A2E',
        gold:      '#C9A84C',
        goldLight: '#E8C76C',
        goldDark:  '#856718',
        crimson:   '#8B1A2D',
        crimson500:'#B02240',
        crimson400:'#D44060',
        emerald:   '#1B6B52',
        emerald400:'#2E9972',
        emerald300:'#4DB890',
        copper:    '#D4783A',
        copper400: '#E8924E',
        rose:      '#E8607A',
        rose400:   '#F07A90',
        text1:     '#F0F0FA',
        text2:     '#B8BCCC',
        text3:     '#6A6E84',
        text4:     '#3A3D52',
      },
      fontFamily: {
        sans:    ['Inter', 'Space Grotesk', 'sans-serif'],
        serif:   ['Playfair Display', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        gold:    '0 0 30px rgba(201,168,76,0.35)',
        crimson: '0 0 30px rgba(176,34,64,0.35)',
        card:    '0 4px 24px rgba(0,0,0,0.4)',
        glow:    '0 0 60px rgba(201,168,76,0.2)',
      },
      borderRadius: {
        xl:  '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
