import { defineConfig } from '@playwright/test'

// builds the app then serves the production build, so the smoke exercises the
// same bytes CI ships (not a dev server).
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:5200' },
  webServer: {
    command: 'NODE_ENV=production vite build && vite preview --host 127.0.0.1',
    port: 5200,
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
