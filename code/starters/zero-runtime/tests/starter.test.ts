import { expect, test, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The starter's behavior half of the end-to-end gate. `scripts/measure.mjs`
 * owns the byte figures and the graph gate; this owns first render and theme
 * switching, which is the part a size number cannot tell you.
 *
 * The same spec runs against all three integrations, and each one is qualified
 * on its own result.
 */

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const receipts = () => JSON.parse(readFileSync(path.join(root, 'receipts.json'), 'utf8'))

// the two theme backgrounds this starter's config declares
const LIGHT_BACKGROUND = 'rgb(250, 250, 250)'
const DARK_BACKGROUND = 'rgb(10, 10, 10)'

const backgroundOf = (page: Page, testId: string) =>
  page
    .locator(`[data-testid="${testId}"]`)
    .evaluate((node) => getComputedStyle(node).backgroundColor)

// the config emits a prefers-color-scheme fallback, so leaving the scheme to
// the runner would decide these assertions instead of the theme classes
test.use({ colorScheme: 'light' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('[data-testid="starter-root"]')
})

test('the page renders its first paint from the generated stylesheet', async ({
  page,
  browserName,
}) => {
  expect(browserName).toBe('chromium')

  await expect(page.locator('[data-testid="starter-title"]')).toHaveText(
    'Zero-runtime starter'
  )
  await expect(page.locator('[data-testid="starter-value-latency"]')).toHaveText('84ms')

  // the colors come from the artifact's theme classes, not from any JavaScript
  expect(await backgroundOf(page, 'starter-root')).toBe(LIGHT_BACKGROUND)

  // and the styling really is class based: no element carries an inline
  // background, which is what a runtime style engine would have produced
  const inlineBackgrounds = await page.evaluate(
    () =>
      [...document.querySelectorAll<HTMLElement>('[data-testid^="starter-"]')].filter(
        (node) => node.style.backgroundColor
      ).length
  )
  expect(inlineBackgrounds).toBe(0)
})

test('the static CSS transition is on the element with no animation runtime', async ({
  page,
}) => {
  const duration = await page
    .locator('[data-testid="starter-pill"]')
    .evaluate((node) => getComputedStyle(node).transitionDuration)
  // the `medium` preset resolved against the config at build time
  expect(duration).not.toBe('0s')
})

test('switching themes swaps classes with no theme runtime in the graph', async ({
  page,
}, testInfo) => {
  const tier =
    receipts()[
      { vite: 'vite', next: 'next-webpack', metro: 'metro-web' }[testInfo.project.name]!
    ].islands
  expect(tier.tamaguiModules).toEqual([])
  expect(tier.forbiddenModules).toBe(0)

  expect(await backgroundOf(page, 'starter-root')).toBe(LIGHT_BACKGROUND)
  await page.click('[data-testid="starter-theme-toggle"]')
  await expect.poll(() => backgroundOf(page, 'starter-root')).toBe(DARK_BACKGROUND)
  await page.click('[data-testid="starter-theme-toggle"]')
  await expect.poll(() => backgroundOf(page, 'starter-root')).toBe(LIGHT_BACKGROUND)
})

test('the island mounts on demand and runs the full runtime', async ({ page }) => {
  await page.waitForSelector('[data-testid="island-open"]')
  await page.click('[data-testid="island-open"]')
  await expect(page.locator('[data-testid="island-frame"]')).toBeVisible()
  await expect(page.locator('[data-testid="island-text"]')).toHaveText(
    'this subtree runs the full Tamagui runtime'
  )

  const runtimeInline = page.locator('[data-testid="island-runtime-inline"]')
  await expect(runtimeInline).toHaveCSS('width', '137px')
  await expect(runtimeInline).toHaveAttribute('style', /width:\s*137px/)
  await runtimeInline.hover()
  await expect(runtimeInline).toHaveCSS('width', '147px')
  await expect(runtimeInline).toHaveAttribute('style', /width:\s*147px/)
})
