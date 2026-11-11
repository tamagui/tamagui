import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  projects: [
    { name: 'vite-global-css-hydration', testMatch: /vite-global-css-hydration\.test\.ts/, use: { baseURL: 'http://localhost:7889' } },
    { name: 'vite-hydration', testMatch: /vite-hydration\.test\.ts/, use: { baseURL: 'http://localhost:7886' } },
  ],
  webServer: [
    { command: 'npx vite preview --outDir dist-global-hydration --port 7889 --strictPort', url: 'http://localhost:7889/global-hydration.html', reuseExistingServer: true, stdout: 'ignore' },
    { command: 'npx vite preview --outDir dist-hydration --port 7886 --strictPort', url: 'http://localhost:7886/hydration.html', reuseExistingServer: true, stdout: 'ignore' },
  ],
})
