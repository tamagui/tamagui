import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledButtonTheme', type: 'useCase' })
})

test(`button + styled + styleable + theme works`, async ({ page }) => {
  const styles = await page.locator('#test').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.backgroundColor).toBe(`rgb(0, 128, 0)`)

  const styles2 = await page.locator('#test2').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles2.backgroundColor).toBe(`rgb(0, 0, 0)`)
})
