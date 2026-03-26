import { defineConfig, devices } from '@playwright/test'

const mode = process.env.TEST_MODE || 'dev' // 'dev' | 'prod' | 'both'

// use fixed ports to avoid race conditions with playwright workers
const devPort = process.env.DEV_PORT || '8085'
const prodPort = process.env.PROD_PORT || '8086'

const devProject = {
  name: 'dev',
  use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${devPort}` },
}

const prodProject = {
  name: 'prod',
  use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${prodPort}` },
}

const projects =
  mode === 'both'
    ? [devProject, prodProject]
    : mode === 'prod'
      ? [prodProject]
      : [devProject]

const webServers: any[] = []

if (mode === 'dev' || mode === 'both') {
  webServers.push({
    command: `bun run dev --port ${devPort} --clean`,
    url: `http://localhost:${devPort}`,
    reuseExistingServer: true,
    timeout: 120000,
  })
}

if (mode === 'prod' || mode === 'both') {
  webServers.push({
    command: `bun run build:web && bun run serve --port ${prodPort} --clean`,
    url: `http://localhost:${prodPort}`,
    reuseExistingServer: true,
    timeout: 180000,
  })
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // One's dev SSR server can leak route state across concurrent requests in this app.
  // Keep sandbox browser tests single-worker so hydration assertions stay deterministic.
  workers: 1,
  reporter: [['html', { outputFolder: '.playwright-report' }]],
  outputDir: '.playwright-results',
  timeout: 30000, // 30s per test for debugging
  use: {
    trace: 'on-first-retry',
  },
  projects,
  webServer: webServers.length === 1 ? webServers[0] : webServers,
})
