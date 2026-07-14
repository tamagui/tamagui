import { expect, test, type Page } from '@playwright/test'
import { execFileSync, spawn, type ChildProcess } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const hmrValuePath = join(root, 'src/imported/hmrValue.ts')
const diagnosticLimit = 8_000
const childLogs = new WeakMap<ChildProcess, { stderr: string; stdout: string }>()

function appendBounded(current: string, chunk: unknown) {
  return `${current}${String(chunk)}`.slice(-diagnosticLimit)
}

function formatChildLogs(child: ChildProcess | undefined) {
  const logs = child ? childLogs.get(child) : undefined
  if (!logs) return 'child stdout: <unavailable>\nchild stderr: <unavailable>'

  return `child stdout:\n${logs.stdout || '<empty>'}\nchild stderr:\n${logs.stderr || '<empty>'}`
}

async function waitForURL(url: string, child?: ChildProcess) {
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  throw new Error(`Timed out waiting for ${url}\n${formatChildLogs(child)}`)
}

function start(script: 'web:dev' | 'web:preview') {
  const child = spawn('bun', ['run', script], {
    cwd: root,
    detached: true,
    env: { ...process.env, CI: '1' },
    stdio: 'pipe',
  })
  const logs = { stderr: '', stdout: '' }
  childLogs.set(child, logs)
  child.stdout?.on('data', (chunk) => {
    logs.stdout = appendBounded(logs.stdout, chunk)
  })
  child.stderr?.on('data', (chunk) => {
    logs.stderr = appendBounded(logs.stderr, chunk)
  })
  return child
}

async function stop(child: ChildProcess | undefined) {
  if (!child?.pid || child.exitCode !== null) return

  process.kill(-child.pid, 'SIGTERM')
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, 5_000)
    child.once('exit', () => {
      clearTimeout(timeout)
      resolve()
    })
  })
}

function captureBrowserFailures(page: Page) {
  const failures: string[] = []
  page.on('pageerror', (error) => failures.push(`pageerror:${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      failures.push(`${message.type()}:${message.text()}`)
    }
  })
  return failures
}

async function diagnosticError(
  error: unknown,
  page: Page,
  failures: string[],
  child: ChildProcess | undefined
) {
  const sourceError =
    error instanceof Error ? error.stack || error.message : String(error)
  const content = await page
    .content()
    .then((value) => value.slice(0, diagnosticLimit))
    .catch((contentError) => `<page.content failed: ${String(contentError)}>`)

  return new Error(
    [
      sourceError,
      `page URL: ${page.url()}`,
      `browser failures:\n${failures.join('\n').slice(-diagnosticLimit) || '<none captured>'}`,
      `bounded page content:\n${content}`,
      formatChildLogs(child),
    ].join('\n\n')
  )
}

async function assertCanary(page: Page, url: string, child: ChildProcess) {
  const failures = captureBrowserFailures(page)
  try {
    await page.goto(url)

    await expect(page.getByTestId('canary-root')).toBeVisible()
    await expect(page.getByTestId('canary-heading')).toHaveCSS(
      'color',
      'rgb(15, 118, 110)'
    )
    await expect(page.getByTestId('canary-claimed')).toHaveCSS('padding-top', '18px')
    await expect(page.getByTestId('canary-claimed')).toHaveCSS(
      'background-color',
      'rgb(124, 58, 237)'
    )
    await expect(page.getByTestId('canary-cascade')).toHaveCSS(
      'background-color',
      'oklch(0.623 0.214 259.815)'
    )
    await expect(page.getByTestId('canary-tailwind')).toHaveCSS('display', 'grid')
    await expect(page.getByTestId('canary-tailwind')).toHaveCSS('opacity', '0.75')
    await expect(page.getByTestId('canary-cross-file')).toHaveCSS('min-height', '12px')
    await expect(page.getByTestId('canary-button-compound')).toHaveCSS('width', '30px')
    await expect(page.getByTestId('canary-select-trigger')).toHaveCSS('height', '32px')

    await page.getByTestId('canary-button').click()
    await expect(page.getByTestId('canary-button')).toContainText('presses:1')

    await page.getByTestId('canary-select-trigger').click()
    await page.getByTestId('canary-select-banana').click()
    await expect(page.getByTestId('canary-selected-value')).toHaveText('selected:banana')

    await page.getByTestId('canary-sheet-open').click()
    await expect(page.getByTestId('canary-sheet-container')).toBeVisible()
    await expect(page.getByTestId('canary-sheet-handle')).toHaveCSS('height', '10px')
    await page.getByTestId('canary-sheet-close').click()

    expect(failures).toEqual([])
    return failures
  } catch (error) {
    throw await diagnosticError(error, page, failures, child)
  }
}

test.describe.serial('v3 integrated canary', () => {
  test('shares the tree with Vite dev and invalidates a cross-file styled value', async ({
    page,
  }) => {
    const original = await readFile(hmrValuePath, 'utf8')
    let server: ChildProcess | undefined

    try {
      server = start('web:dev')
      await waitForURL('http://127.0.0.1:5188', server)
      const failures = await assertCanary(page, 'http://127.0.0.1:5188', server)

      await writeFile(
        hmrValuePath,
        original.replace('importedMinimumHeight = 12', 'importedMinimumHeight = 16')
      )
      try {
        await expect(page.getByTestId('canary-cross-file')).toHaveCSS(
          'min-height',
          '16px'
        )
        await expect(page.getByTestId('canary-press-count')).toHaveText('presses:1')
      } catch (error) {
        throw await diagnosticError(error, page, failures, server)
      }
      expect(failures).toEqual([])
    } finally {
      await writeFile(hmrValuePath, original)
      await stop(server)
    }
  })

  test('builds production and hydrates real SSR markup without browser failures', async ({
    page,
  }) => {
    execFileSync('bun', ['run', 'web:build'], { cwd: root, stdio: 'inherit' })
    execFileSync('bun', ['run', 'web:ssr'], { cwd: root, stdio: 'inherit' })

    const serverEntry = join(root, 'dist-ssr/ssr.mjs')
    const serverModule = await import(
      `${pathToFileURL(serverEntry).href}?g0=${Date.now()}`
    )
    const markup = serverModule.render()
    const htmlPath = join(root, 'dist/index.html')
    const html = await readFile(htmlPath, 'utf8')
    await writeFile(
      htmlPath,
      html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    )

    let server: ChildProcess | undefined
    try {
      server = start('web:preview')
      await waitForURL('http://127.0.0.1:5189', server)
      await assertCanary(page, 'http://127.0.0.1:5189', server)
    } finally {
      await stop(server)
    }
  })
})
