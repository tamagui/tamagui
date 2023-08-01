import { expect, test } from '@playwright/test'

import { getStyles } from './utils'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: "ButtonCustom", type: "useCase" })
})

test(`keeps flex direction for styled(Button)`, async ({ page }) => {
  const styles1 = await getStyles(page.getByTestId('button').first())
  const styles2 = await getStyles(page.getByTestId('button-styled').first())

  // should match
  expect(styles1.flexDirection).toBe('row')
  expect(styles2.flexDirection).toBe('row')
})
