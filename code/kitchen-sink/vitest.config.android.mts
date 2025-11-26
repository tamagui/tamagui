import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './testing-utils/global-setup.android.ts',
    include: ['**/*.{test.android,test.native,spec.android,spec.native}.?(c|m)[jt]s?(x)'],
    // Exclude SelectRemount until we fix Tamagui Button accessibility on Android
    exclude: ['**/SelectRemount.test.native.tsx'],
    retry: 2,
    fileParallelism: false,
    // Longer timeouts for CI where emulator boot can be slow
    testTimeout: 180_000,
    hookTimeout: 180_000,
  },
})
