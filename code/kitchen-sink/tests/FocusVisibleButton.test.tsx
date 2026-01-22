import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FocusVisibleButton', type: 'useCase' })
})

test(`button + focusVisibleStyle`, async ({ page }) => {
  const button = page.locator('#focus-visible-button')

  // Ensure the button is visible and ready
  await button.waitFor({ state: 'visible' })

  // Click the button first to ensure it's interactable, then focus via keyboard
  await button.click()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Shift+Tab')

  // Wait for focus to be applied and styles to update
  await page.waitForTimeout(100)

  // Verify the button is focused
  const isFocused = await button.evaluate((el) => {
    return document.activeElement === el
  })

  expect(isFocused).toBe(true)

  // Check if focus-visible pseudo-class is applied
  const hasFocusVisible = await button.evaluate((el) => {
    return el.matches(':focus-visible')
  })

  // Get computed styles
  const styles = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(hasFocusVisible).toBe(true)
  expect(styles.borderWidth).toBe(`2px`)
})
