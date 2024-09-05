import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ButtonCircular', type: 'useCase' })
})

test(`tag button + circular prop works`, async ({ page }) => {
  const styles = await page.locator('button#circular').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.width).toBe(`44px`)
  expect(styles.height).toBe(styles.width)
  expect(styles.borderRadius).toBe(`100000px`)
})
