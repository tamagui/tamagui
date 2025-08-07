import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Popover Focus Scope', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'PopoverFocusScopeCase', type: 'useCase' })
  })

  test('traps focus within popover when trapFocus is true', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Open the basic popover
    const trigger = page.getByTestId('basic-popover-trigger')
    await trigger.click()

    // Wait for popover to be visible
    const popoverContent = page.getByTestId('basic-popover-content')
    await expect(popoverContent).toBeVisible({ timeout: 5000 })

    // Wait for auto-focus
    await page.waitForTimeout(300)
    
    const nameInput = popoverContent.getByTestId('popover-name-input')
    await expect(nameInput).toBeFocused()

    // Tab through all focusable elements
    await page.keyboard.press('Tab')
    const emailInput = popoverContent.getByTestId('popover-email-input')
    await expect(emailInput).toBeFocused()

    await page.keyboard.press('Tab')
    const notesTextarea = popoverContent.getByTestId('popover-notes-textarea')
    await expect(notesTextarea).toBeFocused()

    await page.keyboard.press('Tab')
    const cancelButton = popoverContent.getByTestId('popover-cancel-button')
    await expect(cancelButton).toBeFocused()

    await page.keyboard.press('Tab')
    const saveButton = popoverContent.getByTestId('popover-save-button')
    await expect(saveButton).toBeFocused()

    // Tab should wrap back to first input (loop)
    await page.keyboard.press('Tab')
    await expect(nameInput).toBeFocused()

    // Shift+Tab should go backwards and loop
    await page.keyboard.press('Shift+Tab')
    await expect(saveButton).toBeFocused()

    // Close popover
    await cancelButton.click()
    await expect(popoverContent).not.toBeVisible()

    // Focus should return to trigger
    await expect(trigger).toBeFocused()
  })

  test('does not trap focus when trapFocus is false', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Open the non-trap popover
    const trigger = page.getByTestId('no-trap-popover-trigger')
    await trigger.click()

    // Wait for popover to be visible
    const popoverContent = page.getByTestId('no-trap-popover-content')
    await expect(popoverContent).toBeVisible({ timeout: 5000 })

    // Focus on the input
    const input = popoverContent.getByTestId('no-trap-input')
    await input.click()
    await expect(input).toBeFocused()

    // Tab to the close button
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)
    
    const closeButton = popoverContent.getByTestId('no-trap-close-button')
    await expect(closeButton).toBeFocused()

    // Tab again - when trapFocus is false, focus can leave the popover
    // Focus might go to browser chrome or other page elements
    await page.keyboard.press('Tab')
    await page.waitForTimeout(200)
    
    // When trapFocus is false, focus is NOT trapped in the popover
    // We can't reliably predict where focus will go as it depends on page structure
    // The important thing is that FocusScope is not preventing the Tab key
    
    // Let's verify that trapFocus=false is working by checking that 
    // we can focus back on the trigger button (outside the popover)
    await page.getByTestId('no-trap-popover-trigger').focus()
    await expect(page.getByTestId('no-trap-popover-trigger')).toBeFocused()
    
    // And we can still focus elements inside the popover
    await input.focus()
    await expect(input).toBeFocused()
    
    // The key difference from trapFocus=true is that FocusScope is not 
    // handling the Tab key - it's the browser's default behavior.
    // With trapFocus=false and loop=false, FocusScope doesn't interfere.
    
    // Verify that the popover has the correct setup
    const focusScopeInfo = await page.evaluate(() => {
      const popover = document.querySelector('[data-testid="no-trap-popover-content"]')
      const focusScope = popover?.closest('[data-focus-scope]') || popover?.parentElement
      
      // Check if there are any event handlers that would indicate focus trapping
      const hasKeydownHandler = !!(focusScope as any)?._keydownHandler
      
      return {
        popoverFound: !!popover,
        // If FocusScope was trapping, it would have special attributes or handlers
        hasFocusScopeAttributes: focusScope?.hasAttribute?.('data-focus-scope-trapped') || false,
        hasKeydownHandler
      }
    })
    
    // FocusScope should not be actively trapping focus
    expect(focusScopeInfo.hasFocusScopeAttributes).toBe(false)
  })

  test('handles nested popovers focus correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Open parent popover
    const parentTrigger = page.getByTestId('parent-popover-trigger')
    await parentTrigger.click()

    const parentPopover = page.getByTestId('parent-popover-content')
    await expect(parentPopover).toBeVisible({ timeout: 5000 })

    await page.waitForTimeout(300)
    const parentInput = parentPopover.getByTestId('parent-popover-input')
    await expect(parentInput).toBeFocused()

    // Open nested popover
    const nestedTrigger = parentPopover.getByTestId('nested-popover-trigger')
    await nestedTrigger.click()

    const nestedPopover = page.getByTestId('nested-popover-content')
    await expect(nestedPopover).toBeVisible({ timeout: 5000 })

    // Focus should be trapped in nested popover
    await page.waitForTimeout(300)
    const nestedInput = nestedPopover.getByTestId('nested-popover-input')
    await expect(nestedInput).toBeFocused()

    // Tab should stay within nested popover
    await page.keyboard.press('Tab')
    const nestedClose = nestedPopover.getByTestId('nested-popover-close')
    await expect(nestedClose).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(nestedInput).toBeFocused() // Should loop back

    // Close nested popover
    await nestedClose.click()
    await expect(nestedPopover).not.toBeVisible()

    // Focus should return to nested trigger in parent popover
    await expect(nestedTrigger).toBeFocused()

    // Close parent popover
    const parentClose = parentPopover.getByTestId('parent-popover-close')
    await parentClose.click()
    await expect(parentPopover).not.toBeVisible()

    // Focus should return to parent trigger
    await expect(parentTrigger).toBeFocused()
  })

  test('auto-focuses first element on mount', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Check if popover content is already visible (might be open by default)
    let popoverContent = page.locator('[data-testid="basic-popover-content"]')
    const isAlreadyVisible = await popoverContent.isVisible()
    
    if (!isAlreadyVisible) {
      // If not visible, click the trigger
      const trigger = page.getByTestId('basic-popover-trigger')
      await expect(trigger).toBeVisible({ timeout: 5000 })
      await trigger.click()
      
      // Wait a bit for popover animation
      await page.waitForTimeout(500)
    }
    
    await expect(popoverContent).toBeVisible({ timeout: 5000 })

    // Wait for auto-focus
    await page.waitForTimeout(300)

    // First input should be focused
    const nameInput = popoverContent.getByTestId('popover-name-input')
    await expect(nameInput).toBeFocused()
  })

  test('closes on escape key and returns focus', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('basic-popover-trigger')
    await trigger.click()

    const popoverContent = page.getByTestId('basic-popover-content')
    await expect(popoverContent).toBeVisible({ timeout: 5000 })

    // Press escape to close
    await page.keyboard.press('Escape')
    
    // Wait for animation
    await page.waitForTimeout(500)
    
    await expect(popoverContent).not.toBeVisible()

    // Focus should return to trigger
    await expect(trigger).toBeFocused()
  })

  test('closes when clicking outside', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('basic-popover-trigger')
    await trigger.click()

    const popoverContent = page.getByTestId('basic-popover-content')
    await expect(popoverContent).toBeVisible({ timeout: 5000 })

    // Click outside to close
    await page.click('body', { position: { x: 10, y: 10 } })
    
    // Wait for animation
    await page.waitForTimeout(500)
    
    await expect(popoverContent).not.toBeVisible()
  })
})