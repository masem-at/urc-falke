import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    // Exclude old monorepo structure tests (deprecated after restructure)
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/apps/api/**', // Old monorepo structure - deprecated
      '**/packages/**', // Old shared packages - deprecated
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
