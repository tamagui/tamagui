import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// Use mobile viewport with touch support (chromium-based to avoid webkit deps in CI)
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
})

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'GroupHoverMobile', type: 'useCase' })
})

test(`group hover styles should not stick after touch on icon`, async ({ page }) => {
  const container = page.locator('#group-hover-container')
  const text = page.locator('#group-hover-text')

  await expect(container).toBeVisible()
  await expect(text).toBeVisible()

  const iconSvg = container.locator('svg').first()
  await expect(iconSvg).toBeVisible()

  // Get initial colors
  const initialTextColor = await text.evaluate((el) => {
    return window.getComputedStyle(el).color
  })
  const initialIconColor = await iconSvg.evaluate((el) => {
    return window.getComputedStyle(el).color
  })

  // Tap on the container using touchscreen
  const box = await container.boundingBox()
  if (box) {
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
  }

  await page.waitForTimeout(300)

  // After touch release, both should return to initial color
  const afterTouchTextColor = await text.evaluate((el) => {
    return window.getComputedStyle(el).color
  })
  const afterTouchIconColor = await iconSvg.evaluate((el) => {
    return window.getComputedStyle(el).color
  })

  expect(afterTouchTextColor).toBe(initialTextColor)
  expect(afterTouchIconColor).toBe(initialIconColor)
})
