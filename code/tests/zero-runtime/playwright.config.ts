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
      testMatch: /vite-island\.test\.ts/,
      use: { baseURL: 'http://localhost:7878' },
    },
    {
      name: 'vite-dev',
      testMatch: /vite-dev\.test\.ts/,
      use: { baseURL: 'http://localhost:7883' },
    },
    {
      name: 'vite-global-css',
      testMatch: /vite-global-css\.test\.ts/,
      use: { baseURL: 'http://localhost:7881' },
    },
    {
      name: 'vite-global-css-mutates',
      testMatch: /vite-global-css-mutates\.test\.ts/,
      use: { baseURL: 'http://localhost:7882' },
    },
    {
      name: 'next',
      testMatch: /next-.*\.test\.ts/,
      use: { baseURL: 'http://localhost:7879' },
    },
    {
      name: 'metro',
      testMatch: /metro-.*\.test\.ts/,
      use: { baseURL: 'http://localhost:7880' },
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
      command: 'npx vite dev --port 7883 --strictPort',
      url: 'http://localhost:7883',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
    {
      command: 'npx vite preview --outDir dist-global --port 7881 --strictPort',
      url: 'http://localhost:7881/global.html',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
    {
      command: 'npx vite preview --outDir dist-global-mutates --port 7882 --strictPort',
      url: 'http://localhost:7882/global.html',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
    {
      command: 'npx next start --port 7879',
      url: 'http://localhost:7879',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
    {
      command: 'node scripts/metro-serve.mjs',
      url: 'http://localhost:7880',
      reuseExistingServer: true,
      stdout: 'ignore',
    },
  ],
})
