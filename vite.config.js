import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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