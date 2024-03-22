import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    cors: true,
    proxy: {
      '/api': {
        target: "http://3.87.189.32:3000",
        secure: false,
        ws: true,
        changeOrigin: true,
        rewrite: pathApi => pathApi.replace(/^\/api/, '/')
      },
    },
  }
})
