import { spawn, execSync } from 'node:child_process'
import { expect, test } from '@playwright/test'
import waitPort from 'wait-port'

const port = 5008
const domain = `http://localhost:${port}`

function spawnServer(command, args) {
  const proc = spawn(command, args, {
    cwd: process.cwd(),
    stdio: 'pipe',
    shell: true,
  })
  proc.stderr.on('data', (d) => console.log(d.toString()))
  return proc
}

test(`loads dev mode no error or warning logs`, async ({ page }) => {
  const server = spawnServer('bun', ['run', 'dev'])
  try {
    await waitPort({
      port: port,
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

    await page.goto(domain, {
      waitUntil: 'domcontentloaded',
    })

    if (logs.error.length) {
      console.info(`Error logs: `, logs.error.join('\n'))
    }

    if (logs.warn.length) {
      console.info(`Warn logs: `, logs.warn.join('\n'))
    }

    expect(logs.error.length).toBe(0)
    expect(logs.warn.length).toBe(0)
    await expect(page.getByText('Hello world').first()).toBeVisible()
  } catch (err) {
    console.error(err)
  } finally {
    server.kill()
  }
})

test(`builds to prod same thing`, async ({ page }) => {
  execSync('bun run build:prod', { stdio: 'pipe' })
  const server = spawnServer('bun', ['run', 'vite', 'preview', '--port', String(port)])

  try {
    await waitPort({
      port: port,
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

    await page.goto(domain, {
      waitUntil: 'domcontentloaded',
    })

    if (logs.error.length) {
      console.info(`Error logs: `, logs.error.join('\n'))
    }

    if (logs.warn.length) {
      console.info(`Warn logs: `, logs.warn.join('\n'))
    }

    expect(logs.error.length).toBe(0)
    expect(logs.warn.length).toBe(0)
    await expect(page.getByText('Hello world').first()).toBeVisible()
  } finally {
    server.kill()
  }
})
