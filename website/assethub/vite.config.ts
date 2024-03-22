import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return {
    plugins: [react()],
    define: {
      'process.env': process.env,
    },
    server: {
      host: '0.0.0.0',
      cors: true,
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL,
          secure: false,
          ws: true,
          changeOrigin: true,
          rewrite: pathApi => pathApi.replace(/^\/api/, '/')
        },
      },
    }
  }
})
