import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const graph = () =>
  JSON.parse(
    readFileSync(
      path.join(root, '.tamagui/zero/vite-dist-animated-number.graph.json'),
      'utf8'
    )
  )

test.beforeEach(async ({ page }) => {
  await page.goto('/.tamagui/rules/animated-number.html')
  await page.waitForSelector('[data-testid="animated-box"]')
})

test('the zero graph keeps only the animated-number leaf', () => {
  const receipt = graph()
  expect(receipt.forbidden).toEqual([])
  expect(receipt.tamaguiModules).toHaveLength(1)
  expect(receipt.tamaguiModules[0]).toContain('animated-number')
  // the public barrel would bring config-bound driver resolution with it
  expect(receipt.tamaguiModules[0]).not.toContain('/tamagui/dist')
})

test('the leaf animates the value and runs its completion callback', async ({ page }) => {
  const box = page.locator('[data-testid="animated-box"]')
  await expect(box).toHaveAttribute('style', /translateX/)
  await expect
    .poll(async () => page.title(), { timeout: 5000 })
    .toBe('animated-number settled')
  const settled = await box.evaluate((node) => (node as HTMLElement).style.transform)
  expect(settled).toBe('translateX(120px)')
})
