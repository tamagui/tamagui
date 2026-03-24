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

async function waitForContent(page, port) {
  const pageErrors = []
  page.on('pageerror', (err) => pageErrors.push(err.message))

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

  await page.goto(`http://localhost:${port}`, {
    waitUntil: 'load',
    timeout: 30000,
  })

  // wait for react to render
  try {
    await expect(page.getByText('Hello world').first()).toBeVisible({ timeout: 15000 })
  } catch (err) {
    // capture diagnostics before re-throwing
    const html = await page.content()
    console.error(`Page content:\n${html.slice(0, 2000)}`)
    if (pageErrors.length) {
      console.error(`Page errors:\n${pageErrors.join('\n')}`)
    }
    if (logs.error.length) {
      console.error(`Console errors:\n${logs.error.join('\n')}`)
    }
    throw err
  }

  if (logs.error.length) {
    console.info(`Error logs: `, logs.error.join('\n'))
  }

  if (logs.warn.length) {
    console.info(`Warn logs: `, logs.warn.join('\n'))
  }

  expect(logs.error.length).toBe(0)
  expect(logs.warn.length).toBe(0)
}

test(`loads dev mode no error or warning logs`, async ({ page }) => {
  const server = spawnServer('bun', ['run', 'dev', '--port', String(devPort)])
  try {
    await waitPort({ port: devPort, host: 'localhost' })
    await waitForContent(page, devPort)
  } finally {
    killServer(server)
  }
})

test(`builds to prod same thing`, async ({ page }) => {
  execSync('bun run build:prod', { stdio: 'pipe' })
  const server = spawnServer('bun', ['run', 'preview', '--port', String(prodPort)])

  try {
    await waitPort({ port: prodPort, host: 'localhost' })
    await waitForContent(page, prodPort)
  } finally {
    killServer(server)
  }
})
