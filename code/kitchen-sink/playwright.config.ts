import { defineConfig } from '@playwright/test'
import { ANIMATION_DRIVERS } from './tests/test-utils'

const port = process.env.PORT || '9000'

// Support both single-driver mode (via env var) and multi-driver parallel mode
const singleDriver = process.env.TAMAGUI_TEST_ANIMATION_DRIVER
const drivers = singleDriver ? [singleDriver] : [...ANIMATION_DRIVERS]

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

  // Define a project per animation driver for parallel execution
  projects: drivers.map((driver) => ({
    name: driver,
    use: {
      // Pass driver to tests via env-like mechanism
    },
    // Set env var for this project's tests
    metadata: { animationDriver: driver },
  })),

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
