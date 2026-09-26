import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': __dirname,
    },
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // tests/*.spec.ts belongs to playwright (see playwright.config.ts testMatch)
    exclude: ['**/node_modules/**', '**/dist/**'],
    root: __dirname,
  },
})
