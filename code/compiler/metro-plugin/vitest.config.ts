import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const packageRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@tamagui/compiler-core': resolve(packageRoot, '../compiler-core/src/index.ts'),
    },
  },
  test: {
    environment: 'node',
    include: [resolve(packageRoot, 'test/**/*.test.ts')],
  },
})
