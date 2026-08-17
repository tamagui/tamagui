import { defineConfig } from '@playwright/test'

// Two integrations, two servers, one fixture. Each project asserts the same
// island contract against its own build output.
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  projects: [
    {
      name: 'vite',
      testMatch: /vite-.*\.test\.ts/,
      use: { baseURL: 'http://localhost:7878' },
    },
    {
      name: 'next',
      testMatch: /next-.*\.test\.ts/,
      use: { baseURL: 'http://localhost:7879' },
    },
  ],
  webServer: [
    {
      command: 'npx vite preview --port 7878 --strictPort',
      url: 'http://localhost:7878',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
    {
      command: 'npx next start --port 7879',
      url: 'http://localhost:7879',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
  ],
})
