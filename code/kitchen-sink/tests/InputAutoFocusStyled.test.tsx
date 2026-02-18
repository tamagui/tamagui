import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'InputAutoFocusStyledCase', type: 'useCase' })
})

test('plain Input with autoFocus gets focused on mount', async ({ page }) => {
  await page.locator('[data-testid="show-plain"]').click()
  const input = page.locator('[data-testid="plain-autofocus"]')
  await expect(input).toBeVisible()
  await page.waitForTimeout(200)
  await expect(input).toBeFocused()
})

test('styled(Input) with autoFocus gets focused on mount', async ({ page }) => {
  await page.locator('[data-testid="show-styled"]').click()
  const input = page.locator('[data-testid="styled-autofocus"]')
  await expect(input).toBeVisible()
  await page.waitForTimeout(200)
  await expect(input).toBeFocused()
})
