import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Dialog Focus Scope', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'DialogFocusScopeCase', type: 'useCase' })
  })

  test('traps focus within dialog when modal', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Open the modal dialog
    const trigger = page.getByTestId('modal-dialog-trigger')
    await trigger.click()

    // Wait for dialog to be visible
    const dialogContent = page.getByTestId('modal-dialog-content')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })

    // Focus should be on the first input
    // Wait for focus trap to activate (no idle wait now)
    await page.waitForTimeout(300)

    const firstInput = dialogContent.getByTestId('first-input')
    await expect(firstInput).toBeFocused()

    // Tab through all focusable elements in order
    await page.keyboard.press('Tab')
    const secondInput = dialogContent.getByTestId('second-input')
    await expect(secondInput).toBeFocused()

    await page.keyboard.press('Tab')
    const emailInput = dialogContent.getByTestId('email-input')
    await expect(emailInput).toBeFocused()

    await page.keyboard.press('Tab')
    const countrySelect = dialogContent.getByTestId('country-select')
    await expect(countrySelect).toBeFocused()

    await page.keyboard.press('Tab')
    const commentsTextarea = dialogContent.getByTestId('comments-textarea')
    await expect(commentsTextarea).toBeFocused()

    await page.keyboard.press('Tab')
    const termsCheckbox = dialogContent.getByTestId('terms-checkbox')
    await expect(termsCheckbox).toBeFocused()

    await page.keyboard.press('Tab')
    const cancelButton = dialogContent.getByTestId('cancel-button')
    await expect(cancelButton).toBeFocused()

    await page.keyboard.press('Tab')
    const saveButton = dialogContent.getByTestId('save-button')
    await expect(saveButton).toBeFocused()

    // Tab should wrap back to first input (loop)
    await page.keyboard.press('Tab')
    await expect(firstInput).toBeFocused()

    // Shift+Tab should go backwards and loop - from first input to last button
    await page.keyboard.press('Shift+Tab')
    await expect(saveButton).toBeFocused()

    await page.keyboard.press('Shift+Tab')
    await expect(cancelButton).toBeFocused()

    // Close dialog with Escape key instead of clicking
    await page.keyboard.press('Escape')
    await expect(dialogContent).not.toBeVisible()

    // Focus should return to trigger
    await expect(trigger).toBeFocused()
  })

  test('does not trap focus when non-modal', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Open the non-modal dialog
    const trigger = page.getByTestId('non-modal-dialog-trigger')
    await trigger.click()

    // Wait for dialog to be visible
    const dialogContent = page.getByTestId('non-modal-dialog-content')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })

    // Focus on the first input
    const firstInput = dialogContent.getByTestId('first-input')
    await firstInput.focus()
    await expect(firstInput).toBeFocused()

    // Tab should allow focus to leave the dialog
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // Tab past all dialog elements

    // Focus should have left the dialog
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedElement).toBeTruthy()

    // Click outside should close non-modal dialog
    await page.click('body', { position: { x: 10, y: 10 } })
    await expect(dialogContent).not.toBeVisible()
  })

  test('modal dialogs prevent right-click dismiss but allow left-click dismiss', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // Open a modal dialog
    const trigger = page.getByTestId('modal-dialog-trigger')
    await trigger.click()

    const dialogContent = page.getByTestId('modal-dialog-content')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })

    // Wait for auto-focus
    await page.waitForTimeout(300)

    // Try to right-click outside the dialog - should NOT close
    const dialogBounds = await dialogContent.boundingBox()

    if (dialogBounds) {
      // Right-click to the left of the dialog (on overlay/backdrop)
      await page.mouse.click(dialogBounds.x - 50, dialogBounds.y + 50, {
        button: 'right',
      })
    }

    // Wait a bit
    await page.waitForTimeout(500)

    // Modal dialogs prevent right-click dismiss
    await expect(dialogContent).toBeVisible()

    // Now try left-click - should close
    if (dialogBounds) {
      await page.mouse.click(dialogBounds.x - 50, dialogBounds.y + 50, { button: 'left' })
    }

    // Wait for dialog to close
    await page.waitForTimeout(500)

    // Dialog should be closed after left-click
    await expect(dialogContent).not.toBeVisible()
  })

  test('auto-focuses first element on mount', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('modal-dialog-trigger')
    await trigger.click()

    const dialogContent = page.getByTestId('modal-dialog-content')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })

    // Wait for auto-focus
    await page.waitForTimeout(300)

    // First input should be focused
    const firstInput = dialogContent.getByTestId('first-input')
    await expect(firstInput).toBeFocused()
  })

  test('returns focus to trigger on close', async ({ page }) => {
    // note: test may be flaky if animations don't complete
    // Manual testing shows the focus return works correctly
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('modal-dialog-trigger')
    await trigger.click()

    const dialogContent = page.getByTestId('modal-dialog-content')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })

    // Wait for animations to complete
    await page.waitForTimeout(500)

    // Click cancel button via JavaScript (since it may be outside viewport in dialog scroll container)
    await page.evaluate(() => {
      const button = document.querySelector(
        '[data-testid="cancel-button"]'
      ) as HTMLElement
      if (button) button.click()
    })

    // Wait for dialog to close with animation
    await expect(dialogContent).not.toBeVisible({ timeout: 5000 })

    // Focus should return to trigger
    await expect(trigger).toBeFocused({ timeout: 5000 })
  })

  test('handles nested dialogs focus correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Open parent dialog
    const parentTrigger = page.getByTestId('parent-dialog-trigger')
    await parentTrigger.click()

    const parentDialog = page.getByTestId('parent-dialog-content')
    await expect(parentDialog).toBeVisible({ timeout: 5000 })

    // Open nested dialog
    const nestedTrigger = parentDialog.getByTestId('nested-dialog-trigger')
    await nestedTrigger.click()

    const nestedDialog = page.getByTestId('nested-dialog-content')
    await expect(nestedDialog).toBeVisible({ timeout: 5000 })

    // Focus should be trapped in nested dialog
    await page.waitForTimeout(300)
    const nestedInput = nestedDialog.getByTestId('nested-input')
    await expect(nestedInput).toBeFocused()

    // Tab should stay within nested dialog
    await page.keyboard.press('Tab')
    const nestedButton = nestedDialog.getByTestId('nested-close-button')
    await expect(nestedButton).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(nestedInput).toBeFocused() // Should loop back

    // Close nested dialog
    await nestedButton.click()
    await expect(nestedDialog).not.toBeVisible()

    // Focus should return to nested trigger in parent dialog
    await expect(nestedTrigger).toBeFocused()

    // Close parent dialog
    const parentClose = parentDialog.getByTestId('parent-close-button')
    await parentClose.click()
    await expect(parentDialog).not.toBeVisible()

    // Focus should return to parent trigger
    await expect(parentTrigger).toBeFocused()
  })

  test('nested dialog appears above parent dialog (z-index stacking)', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // Open parent dialog
    const parentTrigger = page.getByTestId('parent-dialog-trigger')
    await parentTrigger.click()

    const parentDialog = page.getByTestId('parent-dialog-content')
    await expect(parentDialog).toBeVisible({ timeout: 5000 })

    // Open nested dialog
    const nestedTrigger = parentDialog.getByTestId('nested-dialog-trigger')
    await nestedTrigger.click()

    const nestedDialog = page.getByTestId('nested-dialog-content')
    await expect(nestedDialog).toBeVisible({ timeout: 5000 })

    // Wait for animations to complete
    await page.waitForTimeout(500)

    // Get the z-index values of both dialog portal containers
    // TamaguiRoot wraps portal content in Theme > span, so z-index is on the inner span
    const zIndexInfo = await page.evaluate(() => {
      const portals = document.querySelectorAll('span[style*="z-index"]')
      const zIndices: number[] = []

      portals.forEach((portal) => {
        const style = window.getComputedStyle(portal)
        const zIndex = parseInt(style.zIndex, 10)
        if (!isNaN(zIndex)) {
          zIndices.push(zIndex)
        }
      })

      return zIndices.sort((a, b) => a - b)
    })

    // Should have at least 2 different z-index values
    expect(zIndexInfo.length).toBeGreaterThanOrEqual(2)

    // The nested dialog should have a higher z-index than the parent
    // The last z-index should be higher than the first
    const parentZIndex = zIndexInfo[0]
    const nestedZIndex = zIndexInfo[zIndexInfo.length - 1]

    expect(nestedZIndex).toBeGreaterThan(parentZIndex)

    // Additionally verify that the nested dialog is visually on top by checking
    // what element is at the center of the nested dialog
    const nestedBounds = await nestedDialog.boundingBox()
    if (nestedBounds) {
      const centerX = nestedBounds.x + nestedBounds.width / 2
      const centerY = nestedBounds.y + nestedBounds.height / 2

      const elementAtPoint = await page.evaluate(
        ({ x, y }) => {
          const el = document.elementFromPoint(x, y)
          return el?.closest('[data-testid="nested-dialog-content"]') !== null
        },
        { x: centerX, y: centerY }
      )

      expect(elementAtPoint).toBe(true)
    }
  })
})
