import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StylePlatform', type: 'useCase' })
})

test(`styles: $platform-web styles work`, async ({ page }) => {
  const view = page.locator('#style-platform')

  const styles = await view.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.marginTop).toBe(`10px`)
  expect(styles.marginBottom).toBe(`10px`)
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
  expect(styles.overflowY).toBe(`scroll`)
})

test(`styles: $platform-web hoverStyle works`, async ({ page }) => {
  const view = page.locator('#style-platform-hover')

  // Before hover: should be blue (base backgroundColor)
  const baseStyles = await view.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor
  })
  expect(baseStyles).toBe(`rgb(0, 0, 255)`)

  // Hover: should be green ($platform-web hoverStyle overrides base hoverStyle)
  await view.hover()
  await page.waitForTimeout(100)

  const hoverStyles = await view.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor
  })
  expect(hoverStyles).toBe(`rgb(0, 128, 0)`)
})
