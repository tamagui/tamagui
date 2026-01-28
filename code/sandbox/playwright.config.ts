import { defineConfig, devices } from '@playwright/test'
import { findAvailablePort } from './scripts/find-port'

const port = await findAvailablePort()
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  // skip in CI - sandbox tests are for local dev only
  testIgnore: process.env.CI ? ['**/*'] : [],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: `yarn dev --port ${port}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120000,
      },
})
