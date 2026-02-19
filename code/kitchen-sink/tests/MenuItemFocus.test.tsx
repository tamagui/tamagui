import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Menu Item Focus Preservation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuItemFocusCase', type: 'useCase' })
  })

  test('menu item that focuses a new element keeps focus on that element', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // click the item that shows and focuses an input
    const focusInputItem = page.getByTestId('focus-input-item')
    await focusInputItem.click()
    await page.waitForTimeout(300)

    // menu should be closed
    await expect(menuContent).not.toBeVisible()

    // the dynamic input should be focused, NOT the trigger
    const dynamicInput = page.getByTestId('dynamic-input')
    await expect(dynamicInput).toBeVisible()
    await expect(dynamicInput).toBeFocused()
  })

  test('menu item that focuses existing element keeps focus on that element', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // click the item that focuses the always-visible input
    const focusExistingItem = page.getByTestId('focus-existing-item')
    await focusExistingItem.click()
    await page.waitForTimeout(300)

    // menu should be closed
    await expect(menuContent).not.toBeVisible()

    // the always-visible input should be focused, NOT the trigger
    const alwaysVisibleInput = page.getByTestId('always-visible-input')
    await expect(alwaysVisibleInput).toBeFocused()
  })
})
