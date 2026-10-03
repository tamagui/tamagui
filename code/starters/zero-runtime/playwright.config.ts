import { defineConfig } from '@playwright/test'

// One app, three integrations, one spec. Each project points at its own build's
// server, so a failure names the integration that produced it and one
// integration's result never stands in for another's.
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  projects: [
    { name: 'vite', use: { baseURL: 'http://localhost:7890' } },
    { name: 'next', use: { baseURL: 'http://localhost:7891' } },
    { name: 'metro', use: { baseURL: 'http://localhost:7892' } },
  ],
  webServer: [
    {
      command: 'npx vite preview --outDir dist-vite --port 7890 --strictPort',
      url: 'http://localhost:7890',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
    {
      command: 'npx next start --port 7891',
      url: 'http://localhost:7891',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
    {
      command: 'node scripts/metro-serve.mjs',
      url: 'http://localhost:7892',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
  ],
})
