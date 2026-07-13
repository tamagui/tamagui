import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@tamagui/static': path.resolve(__dirname, '../static/src/index.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['code/compiler/vite-plugin/test/**/*.test.ts'],
  },
})
