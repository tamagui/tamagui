import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    typecheck: {
      enabled: true,
      include: ['src/**/*.test-d.ts'],
    },
  },
})
