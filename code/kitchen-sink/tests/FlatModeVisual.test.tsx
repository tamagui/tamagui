import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FlatModeVisual', type: 'useCase' })
  await page.mouse.move(0, 0)
})

// visual comparison tests - verify flat mode renders identically to regular tamagui syntax

test(`base styles - flat vs regular should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-base').first()
  const flat = page.locator('#flat-base').first()

  const regularStyles = await getStyles(regular)
  const flatStyles = await getStyles(flat)

  // compare all relevant style properties
  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
  expect(flatStyles.width).toBe(regularStyles.width)
  expect(flatStyles.height).toBe(regularStyles.height)
  expect(flatStyles.padding).toBe(regularStyles.padding)
  expect(flatStyles.borderRadius).toBe(regularStyles.borderRadius)
})

test(`hover styles - flat vs regular base state should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-hover').first()
  const flat = page.locator('#flat-hover').first()

  const regularStyles = await getStyles(regular)
  const flatStyles = await getStyles(flat)

  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
})

test(`hover styles - flat vs regular hovered state should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-hover').first()
  const flat = page.locator('#flat-hover').first()

  // hover on regular
  await regular.hover()
  const regularStyles = await getStyles(regular)

  // hover on flat
  await flat.hover()
  const flatStyles = await getStyles(flat)

  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
})

test(`press styles - flat vs regular base state should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-press').first()
  const flat = page.locator('#flat-press').first()

  const regularStyles = await getStyles(regular)
  const flatStyles = await getStyles(flat)

  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
})

test(`press styles - flat vs regular pressed state should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-press').first()
  const flat = page.locator('#flat-press').first()

  // press regular
  await regular.hover()
  await page.mouse.down()
  const regularStyles = await getStyles(regular)
  await page.mouse.up()

  // press flat
  await flat.hover()
  await page.mouse.down()
  const flatStyles = await getStyles(flat)
  await page.mouse.up()

  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
})

test(`media styles - flat vs regular should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-media').first()
  const flat = page.locator('#flat-media').first()

  const regularStyles = await getStyles(regular)
  const flatStyles = await getStyles(flat)

  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
})

test(`media + hover combined - flat vs regular should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-media-hover').first()
  const flat = page.locator('#flat-media-hover').first()

  // base state
  const regularBaseStyles = await getStyles(regular)
  const flatBaseStyles = await getStyles(flat)
  expect(flatBaseStyles.backgroundColor).toBe(regularBaseStyles.backgroundColor)

  // hovered state
  await regular.hover()
  const regularHoverStyles = await getStyles(regular)
  await flat.hover()
  const flatHoverStyles = await getStyles(flat)
  expect(flatHoverStyles.backgroundColor).toBe(regularHoverStyles.backgroundColor)
})

test(`styled components - flat vs regular should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-styled').first()
  const flat = page.locator('#flat-styled').first()

  const regularStyles = await getStyles(regular)
  const flatStyles = await getStyles(flat)

  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
  expect(flatStyles.width).toBe(regularStyles.width)
  expect(flatStyles.height).toBe(regularStyles.height)
  expect(flatStyles.borderRadius).toBe(regularStyles.borderRadius)
})

test(`complex multi-prop - flat vs regular should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-complex').first()
  const flat = page.locator('#flat-complex').first()

  const regularStyles = await getStyles(regular)
  const flatStyles = await getStyles(flat)

  // compare all props
  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
  expect(flatStyles.width).toBe(regularStyles.width)
  expect(flatStyles.height).toBe(regularStyles.height)
  expect(flatStyles.padding).toBe(regularStyles.padding)
  expect(flatStyles.margin).toBe(regularStyles.margin)
  expect(flatStyles.borderRadius).toBe(regularStyles.borderRadius)
  expect(flatStyles.borderWidth).toBe(regularStyles.borderWidth)
  // borderColor may expand to individual sides, check top as representative
  expect(flatStyles.borderTopColor).toBe(regularStyles.borderTopColor)
})

test(`complex multi-prop hover - flat vs regular should be identical`, async ({ page }) => {
  const regular = page.locator('#regular-complex').first()
  const flat = page.locator('#flat-complex').first()

  await regular.hover()
  const regularStyles = await getStyles(regular)

  await flat.hover()
  const flatStyles = await getStyles(flat)

  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
  // borderColor may expand to individual sides, check top as representative
  expect(flatStyles.borderTopColor).toBe(regularStyles.borderTopColor)
})

// visual screenshot comparison - take screenshots and compare pixel-by-pixel
test(`visual screenshot - base comparison`, async ({ page }) => {
  const comparison = page.locator('#base-comparison').first()
  await expect(comparison).toHaveScreenshot('flat-base-comparison.png', {
    maxDiffPixelRatio: 0.01, // allow 1% difference for anti-aliasing
  })
})

test(`visual screenshot - hover comparison (base state)`, async ({ page }) => {
  const comparison = page.locator('#hover-comparison').first()
  await expect(comparison).toHaveScreenshot('flat-hover-comparison-base.png', {
    maxDiffPixelRatio: 0.01,
  })
})

test(`visual screenshot - press comparison (base state)`, async ({ page }) => {
  const comparison = page.locator('#press-comparison').first()
  await expect(comparison).toHaveScreenshot('flat-press-comparison-base.png', {
    maxDiffPixelRatio: 0.01,
  })
})

test(`visual screenshot - media comparison`, async ({ page }) => {
  const comparison = page.locator('#media-comparison').first()
  await expect(comparison).toHaveScreenshot('flat-media-comparison.png', {
    maxDiffPixelRatio: 0.01,
  })
})

test(`visual screenshot - styled comparison`, async ({ page }) => {
  const comparison = page.locator('#styled-comparison').first()
  await expect(comparison).toHaveScreenshot('flat-styled-comparison.png', {
    maxDiffPixelRatio: 0.01,
  })
})

test(`visual screenshot - complex comparison`, async ({ page }) => {
  const comparison = page.locator('#complex-comparison').first()
  await expect(comparison).toHaveScreenshot('flat-complex-comparison.png', {
    maxDiffPixelRatio: 0.01,
  })
})
