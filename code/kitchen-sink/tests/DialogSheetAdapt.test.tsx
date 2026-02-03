import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Test for styled(Dialog.Overlay) with onPress
 *
 * This tests the fix for: "Cannot read property '_internalInstanceHandle' of null"
 * which occurred on Android when using styled(Dialog.Overlay) with onPress.
 *
 * The fix skips GestureDetector wrapping for HOC components and passes press
 * events down via props instead, allowing the inner component to handle gesture
 * detection at the correct level where a native view exists.
 */
test.describe('Dialog Sheet Adapt - styled(Dialog.Overlay) with onPress', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'DialogSheetAdaptCase', type: 'useCase' })
  })

  test('styled(Dialog.Overlay) with onPress should render without crashing', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // Open the dialog
    const trigger = page.getByTestId('open-dialog')
    await trigger.click()

    // Wait for dialog overlay to be visible (the styled DialogOverlay)
    // On web, this should work. The fix ensures HOC components pass press events
    // down instead of wrapping with GestureDetector (which would crash on native
    // when the inner component returns null during adapt)
    await page.waitForTimeout(500)

    // Dialog content should be visible
    const dialogContent = page.locator('text=Dialog with Sheet Adapt')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })

    // Close button should work
    const closeButton = page.getByTestId('close-dialog')
    await closeButton.click()

    // Dialog should close
    await expect(dialogContent).not.toBeVisible({ timeout: 5000 })
  })

  test('can open and close dialog multiple times without errors', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Test multiple open/close cycles to ensure stability
    for (let i = 0; i < 3; i++) {
      // Open the dialog
      const trigger = page.getByTestId('open-dialog')
      await trigger.click()

      // Wait for dialog to be visible
      await page.waitForTimeout(300)
      const dialogContent = page.locator('text=Dialog with Sheet Adapt')
      await expect(dialogContent).toBeVisible({ timeout: 5000 })

      // Close via button
      const closeButton = page.getByTestId('close-dialog')
      await closeButton.click()

      // Wait for dialog to close
      await expect(dialogContent).not.toBeVisible({ timeout: 5000 })
    }
  })
})
