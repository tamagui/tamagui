import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ButtonCircular', type: 'useCase' })
})

test(`copied skin default circular button is square`, async ({ page }) => {
  const styles = await page.locator('button#circular').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  // default size resolves settings.defaultSize ($4 -> size token 44 in v5)
  expect(styles.width).toBe(`44px`)
  expect(styles.height).toBe(styles.width)
  expect(styles.borderRadius).toBe(`1000px`)
})
