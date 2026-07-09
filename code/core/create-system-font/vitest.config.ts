import { resolve } from 'node:path'
import type { ViteUserConfigExport } from 'vitest/config'
import { defineConfig } from 'vitest/config'

const config: ViteUserConfigExport = defineConfig({
  resolve: {
    alias: {
      '@tamagui/core': resolve(__dirname, './tests/coreMock.ts'),
    },
  },
})

export default config
