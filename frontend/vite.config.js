import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base configurado para GitHub Pages em: https://lucianaferre.github.io/FrotaPM/
  base: '/FrotaPM/',
  plugins: [react()],
  server: {
    port: 5173
  }
})
