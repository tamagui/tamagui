import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ButtonCircular', type: 'useCase' })
})

test(`copied skin default circular button is square`, async ({ page }) => {
  const styles = await page.locator('button#circular').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  // the opt-in size policy keeps the default control frame at 44px
  expect(styles.width).toBe(`44px`)
  expect(styles.height).toBe(styles.width)
  expect(styles.borderRadius).toBe(`1000px`)
})
