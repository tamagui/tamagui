import { defineConfig } from '@playwright/test'
import { ANIMATION_DRIVERS } from './tests/test-utils'

const port = process.env.PORT || '9000'

// Support both single-driver mode (via env var) and multi-driver parallel mode
const singleDriver = process.env.TAMAGUI_TEST_ANIMATION_DRIVER
const drivers = singleDriver ? [singleDriver] : [...ANIMATION_DRIVERS]

/**
 * Test organization:
 * - *.animated.test.ts - Animation-dependent tests, run with ALL animation drivers
 * - *.test.ts (non-animated) - Style/functional tests, run ONCE with default driver
 *
 * This significantly speeds up the test suite since most tests don't need
 * to run 4x across all animation drivers.
 */
export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',
  reporter: [['list']],

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: `http://localhost:${port}`,
    // Larger viewport to prevent popover positioning issues
    viewport: { width: 1920, height: 1080 },
  },

  projects: [
    // Non-animated tests run once with default driver (native)
    {
      name: 'default',
      testIgnore: '**/*.animated.test.{ts,tsx}',
      metadata: { animationDriver: 'native' },
    },
    // Animated tests run with all animation drivers
    ...drivers.map((driver) => ({
      name: `animated-${driver}`,
      testMatch: '**/*.animated.test.{ts,tsx}',
      // AnimationsWithMediaQueries only passes with css and motion drivers for now
      ...(driver !== 'motion' &&
        driver !== 'css' && {
          testIgnore: '**/AnimationsWithMediaQueries.animated.test.{ts,tsx}',
        }),
      metadata: { animationDriver: driver },
    })),
  ],

  // Run your local dev server before starting the tests.
  webServer: {
    command: `PORT=${port} bun run start:web`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 120_000, // give webpack more time to start
  },

  fullyParallel: true,
  workers: process.env.CI ? 4 : '75%',
  retries: 1,
  // Stop on first failure to show the error immediately
  maxFailures: 1,

  timeout: 50_000,
})
