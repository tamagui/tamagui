import { expect, test } from '@playwright/test'

import { getStyles, whilePressed } from './utils'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=Shadows')
})

test(`shadows work`, async ({ page }) => {
  const button = page.locator('#shadowed')
  const styles = await getStyles(button)
  expect(styles.boxShadow).toBe(`rgba(0, 0, 0, 0.067) 0px 0px 60px 0px`)
})
