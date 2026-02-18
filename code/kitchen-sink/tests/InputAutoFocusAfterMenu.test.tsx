import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'InputAutoFocusAfterMenuCase', type: 'useCase' })
})

test('standalone Input with autoFocus should be focused on mount', async ({ page }) => {
  const input = page.locator('[data-testid="autofocus-input"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
})

test('Input with autoFocus should receive focus after menu close', async ({ page }) => {
  const trigger = page.locator('[data-testid="menu-trigger"]')
  await trigger.click()

  const menuContent = page.locator('[data-testid="menu-content"]')
  await expect(menuContent).toBeVisible()

  const menuItem = page.locator('[data-testid="menu-item-show-input"]')
  await menuItem.click()

  const afterMenuInput = page.locator('[data-testid="after-menu-input"]')
  await expect(afterMenuInput).toBeVisible()

  await page.waitForTimeout(300)
  await expect(afterMenuInput).toBeFocused()
})

test('onCloseAutoFocus preventDefault should prevent default focus restore and allow custom focus', async ({
  page,
}) => {
  const trigger = page.locator('[data-testid="prevent-default-trigger"]')
  await trigger.click()

  const menuContent = page.locator('[data-testid="prevent-default-menu-content"]')
  await expect(menuContent).toBeVisible()

  const menuItem = page.locator('[data-testid="prevent-default-menu-item"]')
  await menuItem.click()

  // menu should close
  await expect(menuContent).not.toBeVisible()

  await page.waitForTimeout(300)

  // custom focus target should be focused (not the trigger)
  const customTarget = page.locator('[data-testid="custom-focus-target"]')
  await expect(customTarget).toBeFocused()

  // trigger should NOT be focused
  const triggerFocused = await trigger.evaluate((el) => el === document.activeElement)
  expect(triggerFocused).toBe(false)
})
