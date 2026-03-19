import { spawn, execSync } from 'node:child_process'
import { expect, test } from '@playwright/test'
import waitPort from 'wait-port'

const devPort = 5008
const prodPort = 5009

function spawnServer(command, args) {
  const proc = spawn(command, args, {
    cwd: process.cwd(),
    stdio: 'pipe',
    detached: true,
  })
  proc.stderr.on('data', (d) => console.log(d.toString()))
  return proc
}

function killServer(proc) {
  try {
    // kill the entire process group so child processes are cleaned up
    process.kill(-proc.pid, 'SIGTERM')
  } catch {
    // process may have already exited
  }
}

test(`loads dev mode no error or warning logs`, async ({ page }) => {
  const server = spawnServer('bun', ['run', 'dev', '--port', String(devPort)])
  try {
    await waitPort({
      port: devPort,
      host: 'localhost',
    })

    const logs = {
      error: [],
      warn: [],
      log: [],
      info: [],
    }

    page.on('console', (message) => {
      logs[message.type()] ||= []
      logs[message.type()].push(message.text())
    })

    await page.goto(`http://localhost:${devPort}`, {
      waitUntil: 'load',
    })

    if (logs.error.length) {
      console.info(`Error logs: `, logs.error.join('\n'))
    }

    if (logs.warn.length) {
      console.info(`Warn logs: `, logs.warn.join('\n'))
    }

    expect(logs.error.length).toBe(0)
    expect(logs.warn.length).toBe(0)
    await expect(page.getByText('Hello world').first()).toBeVisible({ timeout: 15000 })
  } finally {
    killServer(server)
  }
})

test(`builds to prod same thing`, async ({ page }) => {
  execSync('bun run build:prod', { stdio: 'pipe' })
  const server = spawnServer('bun', ['run', 'preview', '--port', String(prodPort)])

  try {
    await waitPort({
      port: prodPort,
      host: 'localhost',
    })

    const logs = {
      error: [],
      warn: [],
      log: [],
      info: [],
    }

    page.on('console', (message) => {
      logs[message.type()] ||= []
      logs[message.type()].push(message.text())
    })

    await page.goto(`http://localhost:${prodPort}`, {
      waitUntil: 'load',
    })

    if (logs.error.length) {
      console.info(`Error logs: `, logs.error.join('\n'))
    }

    if (logs.warn.length) {
      console.info(`Warn logs: `, logs.warn.join('\n'))
    }

    expect(logs.error.length).toBe(0)
    expect(logs.warn.length).toBe(0)
    await expect(page.getByText('Hello world').first()).toBeVisible({ timeout: 15000 })
  } finally {
    killServer(server)
  }
})
