import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'InputTextShorthand', type: 'useCase' })
})

test('text shorthand applies textAlign on Input', async ({ page }) => {
  const input = page.locator('[data-testid="input-text-shorthand"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveCSS('text-align', 'center')
})

test('textAlign longhand still applies on Input', async ({ page }) => {
  const input = page.locator('[data-testid="input-textalign-longhand"]')
  await expect(input).toBeVisible()
  await expect(input).toHaveCSS('text-align', 'right')
})

test('text shorthand applies textAlign on TextArea', async ({ page }) => {
  const textarea = page.locator('[data-testid="textarea-text-shorthand"]')
  await expect(textarea).toBeVisible()
  await expect(textarea).toHaveCSS('text-align', 'center')
})
