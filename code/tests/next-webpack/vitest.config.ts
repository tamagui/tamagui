import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    include: ['**/*.unit.test.ts'],
    testTimeout: 120000,
    hookTimeout: 30000,
  },
})
