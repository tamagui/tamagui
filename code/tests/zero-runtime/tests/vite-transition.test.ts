import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const graph = () =>
  JSON.parse(
    readFileSync(path.join(root, '.tamagui/zero/vite-dist-transition.graph.json'), 'utf8')
  )

test.beforeEach(async ({ page }) => {
  await page.goto('/.tamagui/rules/transition.html')
  await page.waitForSelector('[data-testid="transition-box"]')
})

test('the static transition graph has no animation runtime at all', () => {
  const receipt = graph()
  expect(receipt.forbidden).toEqual([])
  // not even the animated-number leaf: a static transition is CSS only
  expect(receipt.tamaguiModules).toEqual([])
})

test('a configured transition preset resolves to CSS and interpolates', async ({
  page,
}) => {
  const box = page.locator('[data-testid="transition-box"]')
  // `medium` is a config preset, so this value only exists if the compiler
  // resolved it against the config rather than copying an authored string
  expect(await box.evaluate((node) => getComputedStyle(node).transitionDuration)).toBe(
    '0.3s'
  )
  expect(await box.evaluate((node) => getComputedStyle(node).width)).toBe('50px')

  await page.click('[data-testid="transition-toggle"]')
  // partway through a 300ms transition. a class swap with no transition would
  // already read the settled width here
  await page.waitForTimeout(120)
  const midFlight = await box.evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).width)
  )
  expect(midFlight).toBeGreaterThan(50)
  expect(midFlight).toBeLessThan(200)

  await expect
    .poll(async () => box.evaluate((node) => getComputedStyle(node).width), {
      timeout: 2000,
    })
    .toBe('200px')
})

// The lowering decision reads the styled definition's defaults as well as the
// call site. A definition-only preset used to flatten with the prop dropped, so
// the element rendered with no transition and the build stayed green. Each box
// carries a different preset, so the duration the browser reports names which
// of the three places was lowered; the plain box above is the control, and a
// run where it reads no transition is a broken fixture rather than a finding.
test('a preset lowers from every place it can be written', async ({ page }) => {
  const duration = (testId: string) =>
    page
      .locator(`[data-testid="${testId}"]`)
      .evaluate((node) => getComputedStyle(node).transitionDuration)

  expect(await duration('transition-box')).toBe('0.3s')
  expect(await duration('definition-box')).toBe('0.5s')
  expect(await duration('call-site-box')).toBe('0.15s')

  const definition = page.locator('[data-testid="definition-box"]')
  await page.click('[data-testid="transition-toggle"]')
  // 120ms into `lazy`'s 500ms. without the transition this reads 200 already
  await page.waitForTimeout(120)
  const midFlight = await definition.evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).width)
  )
  expect(midFlight).toBeGreaterThan(50)
  expect(midFlight).toBeLessThan(200)

  await expect
    .poll(async () => definition.evaluate((node) => getComputedStyle(node).width), {
      timeout: 2000,
    })
    .toBe('200px')
})
