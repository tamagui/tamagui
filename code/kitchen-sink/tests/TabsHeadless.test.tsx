import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// the skinned Tabs consumes these same hooks, so this suite is what proves the
// headless package is a real base layer rather than a parallel implementation

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'TabsHeadlessCase', type: 'useCase' })
})

test('the hook alone wires aria-controls to the matching panel', async ({ page }) => {
  const alpha = page.getByTestId('automatic-tab-alpha')

  await expect(alpha).toHaveAttribute('role', 'tab')
  await expect(alpha).toHaveAttribute('aria-selected', 'true')
  await expect(alpha).toHaveAttribute('data-state', 'active')

  const panel = page.getByTestId('automatic-content-alpha')
  await expect(panel).toHaveAttribute('role', 'tabpanel')
  await expect(panel).toHaveAttribute('id', (await alpha.getAttribute('aria-controls'))!)
  await expect(panel).toHaveAttribute(
    'aria-labelledby',
    (await alpha.getAttribute('id'))!
  )
})

test('clicking a trigger activates it and swaps the mounted panel', async ({ page }) => {
  await page.getByTestId('automatic-tab-beta').click()

  await expect(page.getByTestId('automatic-selected')).toHaveText('selected: beta')
  await expect(page.getByTestId('automatic-tab-beta')).toHaveAttribute(
    'aria-selected',
    'true'
  )
  await expect(page.getByTestId('automatic-tab-alpha')).toHaveAttribute(
    'aria-selected',
    'false'
  )
  await expect(page.getByTestId('automatic-content-beta')).toBeVisible()
  await expect(page.getByTestId('automatic-content-alpha')).toHaveCount(0)
})

test('automatic activation selects on focus, manual does not', async ({ page }) => {
  await page.getByTestId('automatic-tab-beta').focus()
  await expect(page.getByTestId('automatic-selected')).toHaveText('selected: beta')

  await page.getByTestId('manual-tab-beta').focus()
  await expect(page.getByTestId('manual-selected')).toHaveText('selected: alpha')
})

test('Enter activates a focused trigger under manual activation', async ({ page }) => {
  await page.getByTestId('manual-tab-beta').focus()
  await expect(page.getByTestId('manual-selected')).toHaveText('selected: alpha')

  await page.keyboard.press('Enter')
  await expect(page.getByTestId('manual-selected')).toHaveText('selected: beta')
  await expect(page.getByTestId('manual-content-beta')).toBeVisible()
})

test('a disabled trigger reports itself disabled and never activates', async ({
  page,
}) => {
  const gamma = page.getByTestId('automatic-tab-gamma')

  await expect(gamma).toHaveAttribute('data-disabled', '')
  await gamma.click({ force: true })

  await expect(page.getByTestId('automatic-selected')).toHaveText('selected: alpha')
  await expect(page.getByTestId('automatic-content-gamma')).toHaveCount(0)
})
