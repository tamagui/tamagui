import { defineConfig, devices } from '@playwright/test'
import { findAvailablePort } from './scripts/find-port'

const devPort = await findAvailablePort()
const prodPort = await findAvailablePort(devPort + 1)

const mode = process.env.TEST_MODE || 'dev' // 'dev' | 'prod' | 'both'

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
    command: `bun run dev --port ${devPort}`,
    url: `http://localhost:${devPort}`,
    reuseExistingServer: true,
    timeout: 120000,
  })
}

if (mode === 'prod' || mode === 'both') {
  webServers.push({
    command: `bun run build:web && bun run serve --port ${prodPort}`,
    url: `http://localhost:${prodPort}`,
    reuseExistingServer: true,
    timeout: 180000,
  })
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: '.playwright-report' }]],
  outputDir: '.playwright-results',
  timeout: 30000, // 30s per test for debugging
  use: {
    trace: 'on-first-retry',
  },
  projects,
  webServer: process.env.CI
    ? undefined
    : webServers.length === 1
      ? webServers[0]
      : webServers,
})
