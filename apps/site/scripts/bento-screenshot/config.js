import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  testMatch: /screenshot.ts/,
  build: {
    external: ['**/*'],
  },
  use: {
    baseURL: 'http://localhost:5005',
  },
  timeout: 60 * 60 * 1000, // 1h
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5005',
    reuseExistingServer: !process.env.CI,
  },
})
