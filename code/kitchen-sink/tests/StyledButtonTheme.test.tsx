import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledButtonTheme', type: 'useCase' })
})

test(`button + styled + createStyledHOC + theme works`, async ({ page }) => {
  const styles = await page.locator('#test').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  const referenceStyles = await page.locator('#test-theme-reference').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  // The copied Button skin resolves its $background from the authored green Theme.
  expect(styles.backgroundColor).toBe(referenceStyles.backgroundColor)
  expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

  const styles2 = await page.locator('#test2').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles2.backgroundColor).toBe(`rgb(0, 0, 0)`)
})
