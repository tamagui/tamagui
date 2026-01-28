import { defineConfig } from '@playwright/test'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { ANIMATION_DRIVERS } from './tests/test-utils'

// read port from .port file (written by start:web) or use default
// this ensures playwright and webpack use the same port
const portFile = join(__dirname, '.port')
let port = process.env.PORT || '9100'
if (existsSync(portFile)) {
  try {
    port = readFileSync(portFile, 'utf-8').trim()
  } catch {
    // fallback to default
  }
}
console.log('[playwright.config] Using port:', port)

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
      use: { baseURL: `http://localhost:${port}` },
    },
    // Animated tests run with all animation drivers
    ...drivers.map((driver) => ({
      name: `animated-${driver}`,
      testMatch: '**/*.animated.test.{ts,tsx}',
      metadata: { animationDriver: driver },
      use: { baseURL: `http://localhost:${port}` },
    })),
  ],

  // Run your local dev server before starting the tests.
  webServer: {
    command: `PORT=${port} npm run start:web`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },

  fullyParallel: true,
  retries: 1,
  // Stop on first failure to show the error immediately
  maxFailures: 1,

  timeout: 50_000,
})
