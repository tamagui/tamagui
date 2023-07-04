import { expect, test } from '@playwright/test'

import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=ButtonCustom', { waitUntil: 'networkidle' })
})

test(`keeps flex direction for styled(Button)`, async ({ page }) => {
  const styles1 = await getStyles(page.getByTestId('button').first())
  const styles2 = await getStyles(page.getByTestId('button-styled').first())

  // should match
  expect(styles1.flexDirection).toBe('row')
  expect(styles2.flexDirection).toBe('row')
})
