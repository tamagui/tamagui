import { execSync, spawn } from 'node:child_process'
import { gzipSync } from 'node:zlib'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import waitPort from 'wait-port'

const devPort = 5008
const hmrPort = 5011
const prodPort = 5009
const hydratePort = 5010

test.describe.configure({ mode: 'serial' })

function spawnServer(command, args) {
  const proc = spawn(command, args, {
    cwd: process.cwd(),
    stdio: 'pipe',
    detached: true,
  })
  proc.stdout.on('data', (d) => process.stdout.write(d))
  proc.stderr.on('data', (d) => console.log(d.toString()))
  return proc
}

async function killServer(proc) {
  if (proc.exitCode !== null || proc.signalCode) return

  await new Promise((resolve) => {
    let timeout
    let forceTimeout
    const finish = () => {
      clearTimeout(timeout)
      clearTimeout(forceTimeout)
      resolve()
    }
    timeout = setTimeout(() => {
      try {
        process.kill(-proc.pid, 'SIGKILL')
      } catch {
        // process may have exited between the timeout and the signal
      }
    }, 5000)
    forceTimeout = setTimeout(finish, 7000)

    proc.once('exit', finish)
    try {
      // Kill the entire process group so child processes release the port too.
      process.kill(-proc.pid, 'SIGTERM')
    } catch {
      finish()
    }
  })
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

  expect(pageErrors).toHaveLength(0)
  expect(logs.error.length).toBe(0)
  expect(logs.warn.length).toBe(0)

  await expect(page.locator('#hybrid-grid')).toHaveCSS('grid-template-columns', /.+ .+/)
  await expect(page.locator('#hybrid-grid')).toHaveCSS('display', 'grid')
  await expect(page.locator('#hybrid-grid')).toHaveCSS('opacity', '0.75')
  await expect(page.locator('#hybrid-grid')).toHaveCSS('backdrop-filter', /blur\(/)
  await expect(page.locator('#hybrid-arbitrary-child')).toHaveCSS(
    'color',
    'oklch(0.637 0.237 25.331)'
  )
  await expect(page.locator('#hybrid-container-child')).toHaveCSS(
    'grid-template-columns',
    /.+ .+ .+/
  )
  await expect(page.locator('#hybrid-container-child')).toHaveCSS('transform', /13/)
  await expect(page.locator('#hybrid-scanner-owned')).toHaveCSS(
    'grid-template-columns',
    '77px'
  )
  await expect(page.locator('#hybrid-cascade')).toHaveCSS(
    'background-color',
    'oklch(0.623 0.214 259.815)'
  )
  await expect(page.locator('#hybrid-cascade')).toHaveCSS('padding', '18px')
}

test(`loads dev mode no error or warning logs`, async ({ page }) => {
  const server = spawnServer('bun', ['run', 'dev', '--port', String(devPort)])
  try {
    await waitPort({ port: devPort, host: 'localhost' })
    await waitForContent(page, devPort)
  } finally {
    await killServer(server)
  }
})

test(`updates passthrough candidates on add, remove, and re-add`, async ({ page }) => {
  const fixturePath = path.resolve('src/HmrCandidate.jsx')
  const tokensPath = path.resolve('src/tokens.ts')
  const configPath = path.resolve('src/tamagui.config.ts')
  const original = readFileSync(fixturePath, 'utf8')
  const originalTokens = readFileSync(tokensPath, 'utf8')
  const originalConfig = readFileSync(configPath, 'utf8')
  const server = spawnServer('bun', ['run', 'dev', '--port', String(hmrPort)])
  try {
    await waitPort({ port: hmrPort, host: 'localhost' })
    await page.goto(`http://localhost:${hmrPort}`)
    await expect(page.locator('#hybrid-hmr')).toHaveCSS('grid-template-columns', '121px')

    writeFileSync(fixturePath, original.replace('grid-cols-[121px]', 'grid-cols-[137px]'))
    await expect(page.locator('#hybrid-hmr')).toHaveCSS('grid-template-columns', '137px')

    writeFileSync(fixturePath, original.replace(' grid-cols-[121px]', ''))
    await expect(page.locator('#hybrid-hmr')).toHaveCSS('grid-template-columns', 'none')

    writeFileSync(fixturePath, original)
    await expect(page.locator('#hybrid-hmr')).toHaveCSS('grid-template-columns', '121px')

    writeFileSync(tokensPath, originalTokens.replace('  4: 44,', '  4: 48,'))
    await expect(page.locator('#hybrid-cascade')).toHaveCSS('padding', '21px')
    writeFileSync(tokensPath, originalTokens)
    await expect(page.locator('#hybrid-cascade')).toHaveCSS('padding', '18px')

    const pureTailwindReload = page.waitForEvent('load')
    writeFileSync(
      configPath,
      originalConfig.replace("|| 'tamagui-and-tailwind'", "|| 'tailwind'")
    )
    await pureTailwindReload
    await expect(page.locator('#hybrid-cascade')).toHaveCSS(
      'background-color',
      'oklch(0.623 0.214 259.815)'
    )
    await expect(page.locator('#hybrid-grid')).toHaveCSS('display', 'grid')
    const hybridReload = page.waitForEvent('load')
    writeFileSync(configPath, originalConfig)
    await hybridReload
  } finally {
    writeFileSync(fixturePath, original)
    writeFileSync(tokensPath, originalTokens)
    writeFileSync(configPath, originalConfig)
    await killServer(server)
  }
})

test(`builds to prod same thing`, async ({ page }) => {
  execSync(
    'TAMAGUI_INTEGRATION_STYLE_MODE=tamagui bunx vite build --outDir dist-tamagui',
    { stdio: 'pipe' }
  )
  execSync('bun run build:prod', { stdio: 'pipe' })
  const server = spawnServer('bun', ['run', 'preview', '--port', String(prodPort)])

  try {
    await waitPort({ port: prodPort, host: 'localhost' })
    await waitForContent(page, prodPort)
  } finally {
    await killServer(server)
  }

  const assets = readdirSync(path.resolve('dist/assets'))
  const css = assets
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(path.resolve('dist/assets', file), 'utf8'))
    .join('\n')
  const js = assets
    .filter((file) => file.endsWith('.js'))
    .map((file) => readFileSync(path.resolve('dist/assets', file)))
  const clientJS = Buffer.concat(js).toString('utf8')
  const tamaguiCSS = readdirSync(path.resolve('dist-tamagui/assets'))
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(path.resolve('dist-tamagui/assets', file), 'utf8'))
    .join('\n')
  const selectorCount = (css.match(/{/g) || []).length
  const tamaguiSelectorCount = (tamaguiCSS.match(/{/g) || []).length
  const metrics = {
    cssBytes: Buffer.byteLength(css),
    cssGzipBytes: gzipSync(css).byteLength,
    tamaguiCSSBytes: Buffer.byteLength(tamaguiCSS),
    tamaguiCSSGzipBytes: gzipSync(tamaguiCSS).byteLength,
    cssDeltaBytes: Buffer.byteLength(css) - Buffer.byteLength(tamaguiCSS),
    cssDeltaGzipBytes: gzipSync(css).byteLength - gzipSync(tamaguiCSS).byteLength,
    selectorCount,
    tamaguiSelectorCount,
  }
  console.info(`D0 CSS metrics ${JSON.stringify(metrics)}`)

  expect(css).toContain('.grid')
  expect(css).toContain('.grid-cols-2')
  expect(css).not.toMatch(/\.p-4(?:[,{:]|\s)/)
  expect(css).not.toContain('box-sizing: border-box; border: 0 solid')
  expect(css).not.toMatch(/\*,\s*::before,\s*::after/)
  expect(css).not.toMatch(/body\s*{\s*margin:\s*0/)
  expect(css.indexOf('@layer tamagui')).toBeLessThan(css.indexOf('@layer utilities'))
  expect(clientJS).not.toMatch(
    /tailwindcss|@tailwindcss\/oxide|\bScanner\b|compiler\.build/
  )
  expect(metrics.cssDeltaBytes).toBeGreaterThan(0)
  expect(metrics.cssDeltaGzipBytes).toBeGreaterThan(0)
  expect(metrics.selectorCount).toBeGreaterThan(metrics.tamaguiSelectorCount)
  expect(gzipSync(css).byteLength).toBeLessThan(60_000)
  expect(js.reduce((size, chunk) => size + gzipSync(chunk).byteLength, 0)).toBeLessThan(
    500_000
  )
})

test('builds SSR without virtual CSS and hydrates it with the hybrid client', async ({
  page,
}) => {
  execSync('bun run build:ssr', { stdio: 'pipe' })
  execSync('bun run build:prod', { stdio: 'pipe' })
  const output = readdirSync(path.resolve('dist-ssr')).find((file) =>
    file.endsWith('.js')
  )
  expect(output).toBeTruthy()
  const outputPath = path.resolve('dist-ssr', output)
  const serverCode = readFileSync(outputPath, 'utf8')
  expect(serverCode).not.toContain('virtual:tamagui-tailwind.css')
  const serverModule = await import(`${outputPath}?test=${Date.now()}`)
  const markup = serverModule.render()
  expect(markup).toContain('Hello world')

  const clientHTMLPath = path.resolve('dist/index.html')
  const clientHTML = readFileSync(clientHTMLPath, 'utf8')
  const hydratedHTML = clientHTML.replace(
    /(<div id="root"[^>]*>)(<\/div>)/,
    `$1${markup}$2`
  )
  expect(hydratedHTML).not.toBe(clientHTML)
  writeFileSync(clientHTMLPath, hydratedHTML)

  const server = spawnServer('bun', ['run', 'preview', '--port', String(hydratePort)])
  try {
    await waitPort({ port: hydratePort, host: 'localhost' })
    await waitForContent(page, hydratePort)
  } finally {
    writeFileSync(clientHTMLPath, clientHTML)
    await killServer(server)
  }
})
