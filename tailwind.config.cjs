/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Primary: Deep Gold Shadow ─────────────────────────────────────
        primary: {
          DEFAULT:    '#A38043',   // Deep Gold Shadow
          hover:      '#D4AF37',   // Liquid Gold
          foreground: '#ffffff',
          subtle:     '#E5DAC9',   // Soft Beige Pattern
        },

        // ── Surfaces ─────────────────────────────────────────────────────
        surface: {
          DEFAULT: '#F9F6F0',   // Warm Alabaster
          muted:   '#F9F6F0',
          card:    '#ffffff',
          dark:    '#A38043',   // Deep Gold Shadow
        },

        // ── Borders ──────────────────────────────────────────────────────
        edge: {
          DEFAULT: '#E5DAC9',   // Soft Beige Pattern
          light:   '#F9F6F0',   // Warm Alabaster
          dark:    '#D4AF37',   // Liquid Gold
        },

        // ── Text ─────────────────────────────────────────────────────────
        ink: {
          DEFAULT: '#2C1A0E',   // deep warm brown for readability
          muted:   '#7C6A54',   // muted gold-brown
          light:   '#B8A88A',   // light gold-tan
          inverse: '#ffffff',
        },

        // ── Gold accents ──────────────────────────────────────────────────
        gold: {
          deep:   '#A38043',   // Deep Gold Shadow
          liquid: '#D4AF37',   // Liquid Gold
          beige:  '#E5DAC9',   // Soft Beige Pattern
          cream:  '#F9F6F0',   // Warm Alabaster
        },

        // ── Status ───────────────────────────────────────────────────────
        success: {
          DEFAULT:    '#16a34a',
          light:      '#dcfce7',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#d97706',
          light:   '#fef3c7',
        },
        danger: {
          DEFAULT:    '#dc2626',
          light:      '#fee2e2',
          foreground: '#ffffff',
        },
      },

      fontFamily: {
        sans:   ['var(--font-manrope)', 'Outfit', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },

      animation: {
        'marquee':  'marquee 30s linear infinite',
        'fade-in':  'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float':    'float 3s ease-in-out infinite',
      },

      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },

      boxShadow: {
        card: '0 0 70px 0 rgba(0,0,0,0.07)',
        sm:   '0 1px 3px 0 rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
