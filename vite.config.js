import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Proxy: React llama a /api/... y Vite lo reenvía al backend Spring Boot del mismo EC2.
// Se quita el encabezado Origin para que el backend no aplique CORS a peticiones que,
// en realidad, vienen del mismo servidor (así no hay que cambiar la IP en el .env cada día).
const proxy = {
  '/api': {
    target: 'http://localhost:8080',
    configure: (servidorProxy) => {
      servidorProxy.on('proxyReq', (peticion) => peticion.removeHeader('origin'))
    },
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // npm run dev → desarrollo (recarga al guardar)
  server: { host: true, port: 5173, proxy },
  // npm run build && npm run preview → versión compilada, la que se presenta
  preview: { host: true, port: 5173, proxy },
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