import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './testing-utils/global-setup.ts',
    include: ['**/*.{test.ios,spec.ios}.?(c|m)[jt]s?(x)'],
    retry: 1,
    // Ensure tests run sequentially
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    // Add reasonable timeouts
    testTimeout: 30000,
    hookTimeout: 30000,
  },
})
