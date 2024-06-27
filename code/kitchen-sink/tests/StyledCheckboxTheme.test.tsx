import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledCheckboxTheme', type: 'useCase' })
})

test(`theme passes through .extractable HOC`, async ({ page }) => {
  const styles = await page.locator('button[role=checkbox]').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.backgroundColor).toBe(`rgb(233, 249, 238)`)
})
