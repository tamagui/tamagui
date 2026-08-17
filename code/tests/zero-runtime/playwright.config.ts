import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:7878' },
  webServer: {
    command: 'npx vite preview --port 7878 --strictPort',
    url: 'http://localhost:7878',
    reuseExistingServer: true,
    stdout: 'ignore',
  },
})
