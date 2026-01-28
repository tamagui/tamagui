import { defineConfig } from '@playwright/test'
import { execSync } from 'child_process'

// read port from .port file (written by start:web) or find one
const port = process.env.PORT || execSync('node scripts/get-port.js', { encoding: 'utf-8' }).trim()

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'screenshots',

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: `http://localhost:${port}`,
  },
  // Run your local dev server before starting the tests.
  webServer: {
    command: `PORT=${port} yarn start:web`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
})
