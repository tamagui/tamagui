import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledCheckboxTheme', type: 'useCase' })
})

test(`theme passes through .styleable HOC`, async ({ page }) => {
  const styles = await page.locator('button[role=checkbox]').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  // Green theme background from themeDev
  expect(styles.backgroundColor).toBe(`rgb(232, 242, 235)`)
})
