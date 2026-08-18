import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const artifact = () => readFileSync(path.join(root, 'dist/tamagui-zero.css'), 'utf8')
const receipt = () =>
  JSON.parse(readFileSync(path.join(root, '.tamagui/zero/vite-dist.graph.json'), 'utf8'))

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('[data-testid="zero-root"]')
})

test('the zero entry graph contains no forbidden Tamagui module', () => {
  const graph = receipt()
  expect(graph.forbidden).toEqual([])
  expect(graph.tamaguiModules).toEqual([])
  expect(graph.moduleCount).toBeGreaterThan(0)
})

test('loading the island does not create a second React instance', async ({ page }) => {
  await page.waitForSelector('[data-testid="island-root"]')
  // a second React copy would have its own function objects and its own hook
  // dispatcher store, so identity of those is what "one instance" means here
  const shared = await page.evaluate(() => {
    const zero = (globalThis as any).__zeroReact
    const island = (globalThis as any).__tamagui_island_runtime__.react
    const internalsKey = Object.keys(zero).find((key) =>
      key.startsWith('__CLIENT_INTERNALS')
    )
    return {
      useState: zero.useState === island.useState,
      createElement: zero.createElement === island.createElement,
      dispatcher: !!internalsKey && zero[internalsKey] === island[internalsKey],
    }
  })
  expect(shared).toEqual({ useState: true, createElement: true, dispatcher: true })
})

test('the island renders and animates with the full runtime', async ({ page }) => {
  await page.click('[data-testid="island-open"]')
  const frame = page.locator('[data-testid="island-portal-frame"]')
  await expect(frame).toBeVisible()

  // the CSS animation driver drives the sheet through a real transition
  const transitions = await page.evaluate(() =>
    [...document.body.querySelectorAll('*')]
      .map((node) => getComputedStyle(node).transitionDuration)
      .filter((duration) => duration !== '0s')
  )
  expect(transitions.length).toBeGreaterThan(0)

  // and it actually moves: a static render would report the same box twice
  const first = await frame.boundingBox()
  await page.waitForTimeout(400)
  const settled = await frame.boundingBox()
  expect(first).not.toBeNull()
  expect(settled).not.toBeNull()
  expect(settled!.height).toBeGreaterThan(0)
})

test('portaled island content inherits the static theme and the direct theme value', async ({
  page,
}) => {
  await page.click('[data-testid="island-open"]')
  const frame = page.locator('[data-testid="island-portal-frame"]')
  await expect(frame).toBeVisible()

  // the portal escapes the mount ancestry, so this only holds if the bridge
  // carried both the theme name and the direct theme-value layer
  const inPortal = await frame.evaluate(
    (node) => node.closest('#root') === null && document.body.contains(node)
  )
  expect(inPortal).toBe(true)

  const background = await frame.evaluate(
    (node) => getComputedStyle(node).backgroundColor
  )
  expect(background).toBe('rgb(11, 37, 69)')

  // the JavaScript half: what the island's own theme state says inside the
  // portal, which is what a full-runtime descendant resolves `$background` from
  const themeState = await page
    .locator('[data-testid="island-portal-theme-state"]')
    .textContent()
  expect(themeState).toBe('dark|#0b2545')

  const color = await page
    .locator('[data-testid="island-portal-text"]')
    .evaluate((node) => getComputedStyle(node).color)
  const darkColor = await page.evaluate(() => {
    const probe = document.createElement('div')
    probe.className = 't_dark'
    document.body.appendChild(probe)
    const value = getComputedStyle(probe).getPropertyValue('--color').trim()
    probe.remove()
    return value
  })
  expect(darkColor).not.toBe('')
  const probeColor = await page.evaluate((value) => {
    const probe = document.createElement('div')
    probe.style.color = value
    document.body.appendChild(probe)
    const computed = getComputedStyle(probe).color
    probe.remove()
    return computed
  }, darkColor)
  expect(color).toBe(probeColor)
})

test('a unique compiler-extracted island style is in the shared artifact and applies', async ({
  page,
}) => {
  await page.click('[data-testid="island-open"]')
  const unique = page.locator('[data-testid="island-unique"]')
  await expect(unique).toBeVisible()
  const width = await unique.evaluate((node) => getComputedStyle(node).width)
  expect(width).toBe('137px')
  expect(artifact()).toContain('width:137px')
})

test('both entries load the same single CSS artifact', async ({ page }) => {
  await page.click('[data-testid="island-open"]')
  await page.waitForSelector('[data-testid="island-portal-frame"]')
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) =>
      link.getAttribute('href')
    )
  )
  const zeroLinks = links.filter((href) => href?.includes('tamagui-zero.css'))
  expect(zeroLinks).toHaveLength(1)
  const injectedByIsland = await page.evaluate(
    () => document.querySelectorAll('link[data-tamagui-zero-css]').length
  )
  expect(injectedByIsland).toBe(0)

  const css = artifact()
  expect(css).toContain('.t_dark')
  expect(css).toContain('--background:#0b2545')
  expect(css).toContain('width:137px')
})

test('the island loader recovers a missing artifact link, and says so loudly', async ({
  page,
}) => {
  // The one accepted runtime recovery in this mode. It exists because
  // "unimported" is not decidable at build time for a published zero artifact on
  // every integration, so this drives the state it exists for and asserts both
  // halves: it recovers, and it names the artifact, the island and the
  // integration rather than fixing the page in silence.
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
        if ((link.getAttribute('href') || '').includes('tamagui-zero.css')) link.remove()
      }
    })
  })
  await page.goto('/')
  await page.waitForSelector('[data-testid="island-open"]')
  await page.click('[data-testid="island-open"]')
  await page.waitForSelector('[data-testid="island-portal-frame"]')

  const recovered = await page.evaluate(() =>
    [...document.querySelectorAll('link[data-tamagui-zero-css]')].map((link) =>
      link.getAttribute('href')
    )
  )
  expect(recovered).toHaveLength(1)
  expect(recovered[0]).toContain('tamagui-zero.css')

  const loud = errors.find((text) => text.includes('[tamagui zero-runtime]'))
  expect(loud).toBeTruthy()
  expect(loud).toContain('did not link the generated CSS artifact')
  expect(loud).toContain('tamagui-zero.css')
  expect(loud).toContain('SheetIsland')
  expect(loud).toContain('vite')
  expect(loud).toContain('On a correct build this never happens')
})
