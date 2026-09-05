import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ButtonCircular', type: 'useCase' })
})

test(`copied skin default circular button is square`, async ({ page }) => {
  const styles = await page.locator('button#circular').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  // the default named size (md): 20px line + 8px padding each side + 1px border
  expect(styles.width).toBe(`38px`)
  expect(styles.height).toBe(styles.width)
  expect(styles.borderRadius).toBe(`1000px`)
})
