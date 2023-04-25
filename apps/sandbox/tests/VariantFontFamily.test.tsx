import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=VariantFontFamily')
})

test(`testing things...`, async ({ page }) => {
  await expect(page.getByTestId('heading').first()).toHaveCSS('font-size', '11px')
})
