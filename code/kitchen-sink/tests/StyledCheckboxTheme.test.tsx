import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledCheckboxTheme', type: 'useCase' })
})

test(`theme passes through createStyledHOC`, async ({ page }) => {
  const styles = await page.locator('button[role=checkbox]').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  // green theme base background: in v3 the checked-state look is skin-owned via
  // activeStyle, and this case passes none, so the frame keeps the theme background
  expect(styles.backgroundColor).toBe(`rgb(232, 242, 235)`)
})
