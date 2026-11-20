import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // escucha en la red del EC2, para abrirlo desde el navegador del PC
    port: 5173,
    // Proxy: React llama a /api/... y Vite lo reenvía al backend Spring Boot del mismo EC2.
    // Así no hay problemas de CORS ni hay que escribir la IP pública en el código.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      include: [
        'src/utils/**',
        'src/components/**',
        'src/services/**',
        'src/context/**',
        'src/pages/**',
      ],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**'],
    },
  },
})