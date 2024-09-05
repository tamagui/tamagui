import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'VariantFontFamily', type: 'useCase' })
})

test(`testing things...`, async ({ page }) => {
  await expect(page.getByTestId('heading').first()).toHaveCSS('font-size', '11px')
})
