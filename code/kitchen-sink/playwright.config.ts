import { defineConfig } from '@playwright/test'

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',
  reporter: [['list']],

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://localhost:9000',
    // Larger viewport to prevent popover positioning issues
    viewport: { width: 1920, height: 1080 },
  },
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'npm run start:web',
    url: 'http://localhost:9000',
    reuseExistingServer: !process.env.CI,
  },

  fullyParallel: true,
  retries: 2,

  timeout: 50_000,
})
