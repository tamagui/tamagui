import { defineConfig } from '@playwright/test'

const port = 3838

export default defineConfig({
  testDir: 'tests',
  testMatch: '**/*.test.ts',
  reporter: [['list']],

  use: {
    baseURL: `http://localhost:${port}`,
  },

  webServer: {
    command: `bun run build:web && bunx serve dist -l ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 180_000,
  },

  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  maxFailures: 1,
  timeout: 30_000,
})
