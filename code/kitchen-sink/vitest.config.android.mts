import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './testing-utils/global-setup.android.ts',
    include: ['**/*.{test.android,test.native,spec.android,spec.native}.?(c|m)[jt]s?(x)'],
    retry: 1,
    fileParallelism: false,
    testTimeout: 60000,
    hookTimeout: 60000,
  },
})
