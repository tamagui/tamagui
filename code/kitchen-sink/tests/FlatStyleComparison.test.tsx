import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FlatStyleComparison', type: 'useCase' })
  await page.mouse.move(0, 0)
})

// ── parity tests: flat vs regular tamagui should match ──

test('basic box - flat matches regular', async ({ page }) => {
  const flat = await getStyles(page.locator('#cmp-basic-flat').first())
  const regular = await getStyles(page.locator('#cmp-basic-regular').first())

  expect(flat.backgroundColor).toBe(regular.backgroundColor)
  expect(flat.width).toBe(regular.width)
  expect(flat.height).toBe(regular.height)
  expect(flat.borderRadius).toBe(regular.borderRadius)
})

test('padding + border - flat matches regular', async ({ page }) => {
  const flat = await getStyles(page.locator('#cmp-pad-flat').first())
  const regular = await getStyles(page.locator('#cmp-pad-regular').first())

  expect(flat.backgroundColor).toBe(regular.backgroundColor)
  expect(flat.padding).toBe(regular.padding)
  expect(flat.borderRadius).toBe(regular.borderRadius)
  expect(flat.borderWidth).toBe(regular.borderWidth)
  expect(flat.borderColor).toBe(regular.borderColor)
})

test('flexbox - flat matches regular', async ({ page }) => {
  const flat = await getStyles(page.locator('#cmp-flex-flat').first())
  const regular = await getStyles(page.locator('#cmp-flex-regular').first())

  expect(flat.flexDirection).toBe(regular.flexDirection)
  expect(flat.gap).toBe(regular.gap)
  expect(flat.alignItems).toBe(regular.alignItems)
  expect(flat.padding).toBe(regular.padding)
  expect(flat.backgroundColor).toBe(regular.backgroundColor)
})

test('transforms - flat matches regular', async ({ page }) => {
  const flat = await getStyles(page.locator('#cmp-xform-flat').first())
  const regular = await getStyles(page.locator('#cmp-xform-regular').first())

  expect(flat.backgroundColor).toBe(regular.backgroundColor)
  expect(flat.width).toBe(regular.width)
  expect(flat.height).toBe(regular.height)
})

test('effects - flat matches regular', async ({ page }) => {
  const flat = await getStyles(page.locator('#cmp-fx-flat').first())
  const regular = await getStyles(page.locator('#cmp-fx-regular').first())

  expect(flat.backgroundColor).toBe(regular.backgroundColor)
  expect(flat.opacity).toBe(regular.opacity)
  expect(flat.borderRadius).toBe(regular.borderRadius)
})

// ── screenshot tests: full page and per-row ──
// wait for tamagui elements to render (don't depend on tailwind CDN loading)

async function waitForRendered(page: any) {
  await page.waitForSelector('#cmp-basic-flat', { state: 'visible', timeout: 5000 })
  // small settle time for styles
  await page.waitForTimeout(500)
}

test('screenshot - full comparison page', async ({ page }) => {
  await waitForRendered(page)
  await expect(page).toHaveScreenshot('comparison-full.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.05,
  })
})

test('screenshot - basic box row', async ({ page }) => {
  await waitForRendered(page)
  const row = page.locator('#cmp-basic')
  await expect(row).toHaveScreenshot('comparison-basic.png', {
    maxDiffPixelRatio: 0.05,
  })
})

test('screenshot - padding row', async ({ page }) => {
  await waitForRendered(page)
  const row = page.locator('#cmp-padding')
  await expect(row).toHaveScreenshot('comparison-padding.png', {
    maxDiffPixelRatio: 0.05,
  })
})

test('screenshot - flexbox row', async ({ page }) => {
  await waitForRendered(page)
  const row = page.locator('#cmp-flex')
  await expect(row).toHaveScreenshot('comparison-flex.png', {
    maxDiffPixelRatio: 0.05,
  })
})

test('screenshot - card layout row', async ({ page }) => {
  await waitForRendered(page)
  const row = page.locator('#cmp-card')
  await expect(row).toHaveScreenshot('comparison-card.png', {
    maxDiffPixelRatio: 0.05,
  })
})

test('screenshot - hover row (base state)', async ({ page }) => {
  await waitForRendered(page)
  const row = page.locator('#cmp-hover')
  await expect(row).toHaveScreenshot('comparison-hover-base.png', {
    maxDiffPixelRatio: 0.05,
  })
})
