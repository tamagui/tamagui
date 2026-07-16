import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledCheckboxTheme', type: 'useCase' })
})

test(`theme passes through createStyledHOC`, async ({ page }) => {
  const styles = await page.locator('button[role=checkbox]').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  // green theme backgroundPress: the checkbox is defaultChecked so its checked
  // state applies $backgroundPress (was base background while $backgroundActive no-oped)
  expect(styles.backgroundColor).toBe(`rgb(184, 209, 194)`)
})
