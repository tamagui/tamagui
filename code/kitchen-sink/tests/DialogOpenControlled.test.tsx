import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Test for issue #3565
 * Verifies that Dialog works when controlled with open={true}
 *
 * In JSDOM (Jest), this fails with "node.show is not a function"
 * because JSDOM doesn't implement HTMLDialogElement.show()
 *
 * This test ensures the dialog renders correctly in a real browser.
 */
test.describe('Dialog Open Controlled', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'DialogOpenControlled', type: 'useCase' })
  })

  test('dialog renders when controlled with open={true}', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // The dialog should be visible immediately since open={true}
    const dialogContent = page.getByTestId('dialog-content')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })
    await expect(dialogContent).toHaveText('Hiya!')
  })

  test('dialog can be closed via close button', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Dialog should be visible
    const dialogContent = page.getByTestId('dialog-content')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })

    // Click close button
    const closeButton = page.getByTestId('dialog-close')
    await closeButton.click()

    // Dialog should still be visible because it's controlled with open={true}
    // (no state management in the component - it's always open)
    await expect(dialogContent).toBeVisible()
  })
})
