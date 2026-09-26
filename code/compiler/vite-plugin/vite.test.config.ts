import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@tamagui/compiler-core': path.resolve(__dirname, '../compiler-core/src/index.ts'),
      '@tamagui/static': path.resolve(__dirname, '../static/src/index.ts'),
    },
  },
  test: {
    environment: 'node',
    include: [path.resolve(__dirname, 'test/**/*.test.ts')],
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
})
