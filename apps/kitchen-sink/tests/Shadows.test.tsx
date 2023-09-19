import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'Shadows', type: 'useCase' })
})

test(`shadows work`, async ({ page }) => {
  const button = page.locator('#shadowed')
  const styles = await getStyles(button)
  expect(styles.boxShadow).toBe(`rgba(0, 0, 0, 0.086) 0px 0px 60px 0px`)
})
