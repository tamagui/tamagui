import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@tamagui/core': resolve(__dirname, './tests/coreMock.ts'),
    },
  },
})
