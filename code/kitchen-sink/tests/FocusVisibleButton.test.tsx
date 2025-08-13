import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FocusVisibleButton', type: 'useCase' })
})

test(`button + focusVisibleStyle`, async ({ page }) => {
  const button = page.locator('#focus-visible-button')

  await page.keyboard.press('Tab')

  // some flake prevention on slower cpu
  await page.waitForTimeout(300)

  const styles = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.borderWidth).toBe(`2px`)
})
