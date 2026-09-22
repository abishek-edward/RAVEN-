/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        raven: {
          navy: '#0f172a',
          slate: '#1e293b',
          muted: '#64748b',
          light: '#f8fafc',
          border: '#e2e8f0',
          teal: '#0d9488',
        },
        trust: {
          official: '#10b981',   // Green: Officially Verified
          citizen: '#2563eb',    // Blue: Citizen-Reported
          analysis: '#9333ea',   // Purple: Platform Analysis
          demo: '#f59e0b',       // Yellow: Demo Data
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Noto Sans Tamil', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
