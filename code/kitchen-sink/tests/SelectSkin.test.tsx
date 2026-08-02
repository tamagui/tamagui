import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SelectSkin', type: 'useCase' })
})

test('keeps two copied skins isolated while preserving selection labels', async ({
  page,
}) => {
  const normal = page.getByTestId('select-skin-default-trigger')
  const alternate = page.getByTestId('select-skin-alt-trigger')

  // token sizing: $3 -> size token 36 / radius token 7 in the v5 config
  await expect(normal).toHaveCSS('height', '36px')
  await expect(normal).toHaveCSS('border-radius', '7px')
  // $5 -> size token 52; the alt skin overrides radius to a pill
  await expect(alternate).toHaveCSS('height', '52px')
  await expect(alternate).toHaveCSS('border-radius', '1000px')

  await normal.click()
  await page.getByTestId('select-skin-default-banana').click()
  await expect(normal).toContainText('Banana')
  await expect(alternate).toContainText('Orange')
  await expect(page.getByTestId('select-skin-caller-handlers')).toHaveText('1:1')

  await alternate.click()
  await page.getByTestId('select-skin-alt-apple').click()
  await expect(alternate).toContainText('Apple')
  await expect(normal).toContainText('Banana')
})

test('suppresses disabled item selection', async ({ page }) => {
  const trigger = page.getByTestId('select-skin-default-trigger')
  await trigger.click()

  const disabled = page.getByTestId('select-skin-default-orange')
  await expect(disabled).toHaveAttribute('aria-disabled', 'true')
  await disabled.click({ force: true })
  await expect(trigger).toContainText('Apple')
})

test('forwards the copied viewport through the adapted Sheet', async ({ page }) => {
  await page.getByTestId('select-skin-adapt-trigger').click()
  await expect(page.getByTestId('select-skin-sheet')).toBeVisible()
  await expect(page.getByTestId('select-skin-adapt-viewport')).toBeVisible()
  await page.getByTestId('select-skin-adapt-banana').click()
  await expect(page.getByTestId('select-skin-adapt-trigger')).toContainText('Banana')
})
