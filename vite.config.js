import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: set base to '/your-repo-name/' before deploying
  // e.g. base: '/barbershop/'
  base: '/OneOff/',
  server: { port: 5173, open: true },
})
