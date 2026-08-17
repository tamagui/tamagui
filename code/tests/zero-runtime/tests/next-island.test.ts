import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const artifact = () => readFileSync(path.join(root, 'public/tamagui-zero.css'), 'utf8')
const receipt = () =>
  JSON.parse(readFileSync(path.join(root, '.tamagui/zero/next-zero.graph.json'), 'utf8'))
const bridges = () =>
  JSON.parse(
    readFileSync(path.join(root, '.tamagui/zero/next-zero.bridges.json'), 'utf8')
  )

test('the zero entry graph contains no forbidden Tamagui module', () => {
  const graph = receipt()
  expect(graph.forbidden).toEqual([])
  expect(graph.tamaguiModules).toEqual([])
  expect(graph.moduleCount).toBeGreaterThan(0)
})

test('server HTML has the deterministic placeholder and no full-runtime island markup', async ({
  request,
}) => {
  const html = await (await request.get('/')).text()
  const bridgeId = Object.values<any>(bridges().bridges)[0][0].id

  expect(html).toContain(
    `<div data-tamagui-island="SheetIsland" data-tamagui-bridge="${bridgeId}"></div>`
  )
  // the island's own runtime markup must not be server rendered
  expect(html).not.toContain('is_SheetContainer')
  expect(html).not.toContain('data-testid="island-root"')
  // the zero page itself is fully lowered host markup
  expect(html).toContain('data-testid="zero-root"')
  // the static Theme lowers to one node carrying both the theme class and the
  // inline-value class, matching what the runtime Theme composes
  const inlineClassName = Object.values<any>(bridges().bridges)[0][0].layers[0]
    .inlineClassName
  expect(html).toContain(`class="t_dark is_Theme ${inlineClassName}"`)
})

test('the island mounts only after hydration, with no hydration mismatch', async ({
  page,
}) => {
  const problems: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(message.text())
  })
  page.on('pageerror', (error) => problems.push(error.message))

  await page.goto('/')
  await page.waitForSelector('[data-testid="island-root"]')
  expect(
    problems.filter((text) => /hydrat|did not match|Minified React error/i.test(text))
  ).toEqual([])
})

test('loading the island does not create a second React instance', async ({ page }) => {
  await page.goto('/')
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
  await page.goto('/')
  await page.click('[data-testid="island-open"]')
  const frame = page.locator('[data-testid="island-portal-frame"]')
  await expect(frame).toBeVisible()
  const transitions = await page.evaluate(() =>
    [...document.body.querySelectorAll('*')]
      .map((node) => getComputedStyle(node).transitionDuration)
      .filter((duration) => duration !== '0s')
  )
  expect(transitions.length).toBeGreaterThan(0)
})

test('portaled island content inherits the static theme and the direct theme value', async ({
  page,
}) => {
  await page.goto('/')
  await page.click('[data-testid="island-open"]')
  const frame = page.locator('[data-testid="island-portal-frame"]')
  await expect(frame).toBeVisible()

  const inPortal = await frame.evaluate(
    (node) => node.closest('#__next') === null && document.body.contains(node)
  )
  expect(inPortal).toBe(true)
  expect(await frame.evaluate((node) => getComputedStyle(node).backgroundColor)).toBe(
    'rgb(11, 37, 69)'
  )

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
  const probeColor = await page.evaluate((value) => {
    const probe = document.createElement('div')
    probe.style.color = value
    document.body.appendChild(probe)
    const computed = getComputedStyle(probe).color
    probe.remove()
    return computed
  }, darkColor)
  expect(darkColor).not.toBe('')
  expect(color).toBe(probeColor)
})

test('a unique compiler-extracted island style is in the shared artifact and applies', async ({
  page,
}) => {
  await page.goto('/')
  await page.click('[data-testid="island-open"]')
  const unique = page.locator('[data-testid="island-unique"]')
  await expect(unique).toBeVisible()
  expect(await unique.evaluate((node) => getComputedStyle(node).width)).toBe('137px')
  expect(artifact()).toContain('width:137px')
})

test('both entries load the same single CSS artifact', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="island-open"]')
  await page.waitForSelector('[data-testid="island-portal-frame"]')
  const zeroLinks = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="stylesheet"]')]
      .map((link) => link.getAttribute('href'))
      .filter((href) => href?.includes('tamagui-zero.css'))
  )
  expect(zeroLinks).toHaveLength(1)
  expect(
    await page.evaluate(
      () => document.querySelectorAll('link[data-tamagui-zero-css]').length
    )
  ).toBe(0)

  const css = artifact()
  expect(css).toContain('.t_dark')
  expect(css).toContain('--background:#0b2545')
  expect(css).toContain('width:137px')
})
