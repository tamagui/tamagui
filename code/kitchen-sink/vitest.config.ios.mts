import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './testing-utils/global-setup.ts',
    include: ['**/*.{test.ios,test.native,spec.ios,spec.native}.?(c|m)[jt]s?(x)'],
    retry: 2,
    fileParallelism: false,
    // Longer timeouts for CI where XCUITest driver build can take 5+ mins
    testTimeout: 180_000,
    hookTimeout: 180_000,
  },
})
