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
