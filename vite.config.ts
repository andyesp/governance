import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['react-dom/client', 'gatsby', 'numeral.js'],
  },
  define: {
    'process.env': {},
    ...(process.env.NODE_ENV === 'development' ? { global: 'window' } : {}),
  },
})
