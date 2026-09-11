import { execSync, spawn } from 'node:child_process'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import waitPort from 'wait-port'

/**
 * Program blocks over a real streamed response, in a real browser.
 *
 * The other two halves of this proof live elsewhere and neither covers this
 * one: a node test checks the stream's chunks are whole, and a kitchen-sink
 * test checks a late code-split block resolves correctly once it lands. Nothing
 * drove an actually-chunked HTTP response into a browser and watched what it
 * resolved at each stage, which is what this does.
 *
 * The load-bearing assertion is that the shell is painted and styled while the
 * late content does not yet exist. If the server ever buffers — a proxy, a
 * runtime change, someone swapping onShellReady for onAllReady — the document
 * becomes byte-identical and every other assertion here still passes. That one
 * fails.
 */

const port = 5012

test.describe.configure({ mode: 'serial' })

let server

test.beforeAll(async () => {
  execSync('bun run build:prod', { stdio: 'pipe' })
  execSync('bun run build:ssr:streaming', { stdio: 'pipe' })
  const entry = path.resolve('dist-ssr-streaming/ssr-streaming.js')
  server = spawn(
    'node',
    [path.resolve('tests/streaming-server.mjs'), String(port), entry],
    {
      cwd: process.cwd(),
      stdio: 'pipe',
      detached: true,
    }
  )
  server.stderr.on('data', (d) => console.log(d.toString()))
  await waitPort({ port, host: 'localhost', timeout: 30000 })
})

test.afterAll(() => {
  if (server?.pid) {
    try {
      process.kill(-server.pid, 'SIGKILL')
    } catch {
      // already gone
    }
  }
})

const background = (locator) =>
  locator.evaluate((node) => getComputedStyle(node).backgroundColor)

test('the shell paints and resolves before the late content exists', async ({ page }) => {
  // commit, not load: waiting for load would wait out the whole stream and
  // there would be no gap left to observe
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'commit' })

  const shell = page.getByTestId('shell')
  await shell.waitFor({ state: 'attached' })

  // the shell's program arrived with the shell and already resolves
  expect(await background(shell)).toBe('rgb(10, 20, 30)')

  // and the suspended half has genuinely not arrived yet
  expect(await page.getByTestId('late-shared').count()).toBe(0)
})

test('the late content resolves and leaves the shell untouched', async ({ page }) => {
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'commit' })

  const shell = page.getByTestId('shell')
  await shell.waitFor({ state: 'attached' })
  const before = await background(shell)

  const late = page.getByTestId('late-shared')
  await late.waitFor({ state: 'attached', timeout: 15000 })

  // the late half shares the shell's program, so it must resolve identically
  expect(await background(late)).toBe('rgb(10, 20, 30)')
  // a program only the late half uses
  expect(
    await page.getByTestId('late-only').evaluate((n) => getComputedStyle(n).color)
  ).toBe('rgb(70, 80, 90)')
  // and nothing the late half brought moved the shell
  expect(await background(shell)).toBe(before)
})

test('hydration keeps what the stream resolved', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' })
  await page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true', {
    timeout: 15000,
  })

  expect(await background(page.getByTestId('shell'))).toBe('rgb(10, 20, 30)')
  expect(await background(page.getByTestId('late-shared'))).toBe('rgb(10, 20, 30)')
  expect(errors).toEqual([])
})
