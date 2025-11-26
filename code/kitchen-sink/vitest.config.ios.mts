import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './testing-utils/global-setup.ts',
    include: ['**/*.{test.ios,test.native,spec.ios,spec.native}.?(c|m)[jt]s?(x)'],
    retry: 1,
    fileParallelism: false,
    testTimeout: 60000,
    hookTimeout: 60000,
  },
})
