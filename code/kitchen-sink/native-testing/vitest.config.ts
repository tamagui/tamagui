/**
 * Vitest configuration for native tests
 *
 * Usage:
 *   NATIVE_TEST_PLATFORM=ios npx vitest run --config native-testing/vitest.config.ts
 *   NATIVE_TEST_PLATFORM=android npx vitest run --config native-testing/vitest.config.ts
 *
 * Test file patterns:
 *   - *.test.native.ts(x) - runs on both iOS and Android
 *   - *.test.ios.ts(x)    - runs only on iOS
 *   - *.test.android.ts(x) - runs only on Android
 */

import { defineConfig } from 'vitest/config'

// Determine platform from env var (defaults to 'ios')
const platform = process.env.NATIVE_TEST_PLATFORM === 'android' ? 'android' : 'ios'

// Build include patterns based on platform
const includePatterns =
  platform === 'android'
    ? ['**/*.{test.android,test.native,spec.android,spec.native}.?(c|m)[jt]s?(x)']
    : ['**/*.{test.ios,test.native,spec.ios,spec.native}.?(c|m)[jt]s?(x)']

export default defineConfig({
  test: {
    globalSetup: './native-testing/setup.ts',
    include: includePatterns,
    retry: 2,
    fileParallelism: false,
    // Longer timeouts for CI where driver setup can be slow
    testTimeout: 180_000,
    hookTimeout: 180_000,
  },
})
