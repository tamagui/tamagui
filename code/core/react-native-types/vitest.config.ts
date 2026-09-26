import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // there is nothing to run: the whole package is types, so the parity
    // assertions below are the entire suite
    include: [],
    typecheck: {
      enabled: true,
      include: ['src/**/*.test-d.ts'],
      tsconfig: './tsconfig.test.json',
    },
  },
})
