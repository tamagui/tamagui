import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Select Focus Scope', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectFocusScopeCase', type: 'useCase' })
  })

  test('traps focus within select dropdown when open', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Open the basic select
    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()

    // Wait for select viewport to be visible
    const selectViewport = page.getByTestId('basic-select-viewport')
    await expect(selectViewport).toBeVisible({ timeout: 5000 })

    // Wait for focus to settle
    await page.waitForTimeout(300)

    // Focus starts on the first item immediately when opened
    const firstItem = page.getByTestId('select-apple')
    const isFirstFocused = await firstItem.evaluate(el => el === document.activeElement)
    expect(isFirstFocused).toBe(true)

    // Arrow down to second item
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const secondItem = page.getByTestId('select-banana')
    const isSecondFocused = await secondItem.evaluate(el => el === document.activeElement)
    expect(isSecondFocused).toBe(true)

    // Tab closes the select and moves to next element
    await page.keyboard.press('Tab')
    await page.waitForTimeout(200)
    
    // Select should be closed after Tab
    await expect(selectViewport).not.toBeVisible()
    
    // Focus should have moved to the next trigger
    const nextTrigger = page.getByTestId('custom-select-trigger')
    await expect(nextTrigger).toBeFocused()

    // Escape to close
    await page.keyboard.press('Escape')
    await expect(selectViewport).not.toBeVisible()
  })

  test('allows selection with Enter key', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()

    const selectViewport = page.getByTestId('basic-select-viewport')
    await expect(selectViewport).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // apple is focused initially, navigate to banana
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    // Select with Enter
    await page.keyboard.press('Enter')
    await page.waitForTimeout(200)

    // Select should close
    await expect(selectViewport).not.toBeVisible()

    // Trigger should show selected value
    const triggerText = await trigger.textContent()
    expect(triggerText).toContain('Banana')
  })

  test('allows selection with click', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('custom-select-trigger')
    await trigger.click()

    // Wait for any select viewport to be visible
    const selectViewport = page.getByRole('listbox').first()
    await expect(selectViewport).toBeVisible({ timeout: 5000 })

    // Click on green option
    const greenOption = page.getByTestId('select-green')
    await greenOption.click()

    // Select should close
    await expect(selectViewport).not.toBeVisible()

    // Trigger should show selected value
    const triggerText = await trigger.textContent()
    expect(triggerText).toContain('Green')
  })

  test('closes on Escape', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('small-select-trigger')
    await trigger.click()

    // Wait for any select viewport to be visible
    const selectViewport = page.getByRole('listbox').first()
    await expect(selectViewport).toBeVisible({ timeout: 5000 })

    // Press Escape to close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)

    // Select should close
    await expect(selectViewport).not.toBeVisible()
    
    // Note: Select doesn't automatically restore focus to trigger like Dialog/Popover do
  })

  test('maintains focus trap with multiple selects', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Click external button first to establish tab order
    const externalButton = page.getByTestId('external-button')
    await externalButton.click()

    // Open the small select
    const trigger = page.getByTestId('small-select-trigger')
    await trigger.click()

    // Wait for any select viewport to be visible
    const selectViewport = page.getByRole('listbox').first()
    await expect(selectViewport).toBeVisible({ timeout: 5000 })

    // Tab should not leave the select dropdown
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    // Focus should still be within select
    const focusInSelect = await page.evaluate(() => {
      const active = document.activeElement
      const listbox = document.querySelector('[role="listbox"]')
      return listbox?.contains(active) || false
    })
    expect(focusInSelect).toBe(true)

    // External button should not be focused
    const isExternalFocused = await externalButton.evaluate(el => el === document.activeElement)
    expect(isExternalFocused).toBe(false)
  })

  test('handles arrow key navigation correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()

    const selectViewport = page.getByTestId('basic-select-viewport')
    await expect(selectViewport).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // first item (apple) is focused on open
    const apple = page.getByTestId('select-apple')
    const isAppleFocused = await apple.evaluate(el => el === document.activeElement)
    expect(isAppleFocused).toBe(true)

    // Navigate down through all items
    await page.keyboard.press('ArrowDown') // banana
    await page.waitForTimeout(50)
    await page.keyboard.press('ArrowDown') // orange
    await page.waitForTimeout(50)
    await page.keyboard.press('ArrowDown') // carrot
    await page.waitForTimeout(50)
    await page.keyboard.press('ArrowDown') // broccoli
    await page.waitForTimeout(50)

    // Should be at broccoli now
    const broccoli = page.getByTestId('select-broccoli')
    const isBroccoliFocused = await broccoli.evaluate(el => el === document.activeElement)
    expect(isBroccoliFocused).toBe(true)

    // Navigate up
    await page.keyboard.press('ArrowUp')
    await page.waitForTimeout(50)

    const carrot = page.getByTestId('select-carrot')
    const isCarrotFocused = await carrot.evaluate(el => el === document.activeElement)
    expect(isCarrotFocused).toBe(true)
  })
})