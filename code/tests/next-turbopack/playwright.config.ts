import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: /\.integration\.test\.ts$/,
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3456',
    headless: true,
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'bun run dev',
        port: 3456,
        reuseExistingServer: true,
        timeout: 120000,
      },
})
