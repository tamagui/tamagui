import { defineConfig } from '@playwright/test'

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'screenshots',

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://localhost:9000',
  },
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'yarn start:web',
    url: 'http://localhost:9000',
    reuseExistingServer: !process.env.CI,
  },
})
