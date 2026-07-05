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
