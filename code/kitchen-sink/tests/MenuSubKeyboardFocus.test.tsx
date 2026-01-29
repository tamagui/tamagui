import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.describe('Menu Submenu Keyboard Focus', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuAccessibilityCase', type: 'useCase' })
  })

  test('submenu trigger should have focusVisible style when opened via ArrowRight', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // open menu via keyboard
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // navigate to submenu trigger via keyboard
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.focus()
    await expect(submenuTrigger).toBeFocused()

    // press ArrowRight to open submenu
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()

    // the first submenu item should be focused AND have focusVisible
    const firstSubmenuItem = page.getByTestId('submenu-item-1')
    await expect(firstSubmenuItem).toBeFocused()

    // check that the focused item has the data-highlighted attribute (indicates focus style)
    const hasHighlight = await firstSubmenuItem.getAttribute('data-highlighted')
    expect(hasHighlight).toBe('')
  })

  test('submenu trigger should have focusVisible style when opened via Enter', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // open menu via keyboard
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // navigate to submenu trigger via keyboard
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.focus()
    await expect(submenuTrigger).toBeFocused()

    // press Enter to open submenu
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()

    // the first submenu item should be focused AND have focusVisible
    const firstSubmenuItem = page.getByTestId('submenu-item-1')
    await expect(firstSubmenuItem).toBeFocused()

    // check that the focused item has the data-highlighted attribute
    const hasHighlight = await firstSubmenuItem.getAttribute('data-highlighted')
    expect(hasHighlight).toBe('')
  })

  test('submenu trigger should have focusVisible when escape returns focus from submenu', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // open menu via keyboard
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // navigate to submenu trigger and open via keyboard
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()

    // press Escape to close submenu
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // submenu should be closed
    await expect(submenuContent).not.toBeVisible()

    // parent menu should still be open
    await expect(menuContent).toBeVisible()

    // focus should return to submenu trigger WITH focusVisible
    await expect(submenuTrigger).toBeFocused()

    // check that the submenu trigger has the data-highlighted attribute (focus visible)
    const hasHighlight = await submenuTrigger.getAttribute('data-highlighted')
    expect(hasHighlight).toBe('')
  })

  test('submenu trigger should have focusVisible when ArrowLeft returns focus from submenu', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // open menu via keyboard
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // navigate to submenu trigger and open via keyboard
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()

    // focus first item in submenu
    const submenuItem = page.getByTestId('submenu-item-1')
    await expect(submenuItem).toBeFocused()

    // press ArrowLeft to close submenu and return to parent
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)

    // submenu should be closed
    await expect(submenuContent).not.toBeVisible()

    // parent menu should still be open
    await expect(menuContent).toBeVisible()

    // focus should return to submenu trigger WITH focusVisible
    await expect(submenuTrigger).toBeFocused()

    // check that the submenu trigger has the data-highlighted attribute (focus visible)
    const hasHighlight = await submenuTrigger.getAttribute('data-highlighted')
    expect(hasHighlight).toBe('')
  })
})

test.describe('Menu Submenu Left-Side Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuSubLeftCase', type: 'useCase' })
  })

  test('ArrowLeft opens left-side submenu', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // open menu
    const menuTrigger = page.locator('#menu-trigger')
    await menuTrigger.click()
    await page.waitForTimeout(200)

    const menuContent = page.locator('#menu-content')
    await expect(menuContent).toBeVisible()

    // focus submenu trigger
    const submenuTrigger = page.locator('#submenu-trigger')
    await submenuTrigger.focus()
    await expect(submenuTrigger).toBeFocused()

    // ArrowLeft should open left-side submenu (not ArrowRight)
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)

    const submenuContent = page.locator('#submenu-content')
    await expect(submenuContent).toBeVisible()
  })

  test('ArrowRight does NOT open left-side submenu', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // open menu
    const menuTrigger = page.locator('#menu-trigger')
    await menuTrigger.click()
    await page.waitForTimeout(200)

    const menuContent = page.locator('#menu-content')
    await expect(menuContent).toBeVisible()

    // focus submenu trigger
    const submenuTrigger = page.locator('#submenu-trigger')
    await submenuTrigger.focus()
    await expect(submenuTrigger).toBeFocused()

    // ArrowRight should NOT open left-side submenu
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)

    const submenuContent = page.locator('#submenu-content')
    await expect(submenuContent).not.toBeVisible()
  })

  test('ArrowRight closes left-side submenu', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // open menu
    const menuTrigger = page.locator('#menu-trigger')
    await menuTrigger.click()
    await page.waitForTimeout(200)

    // open submenu via ArrowLeft
    const submenuTrigger = page.locator('#submenu-trigger')
    await submenuTrigger.focus()
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)

    const submenuContent = page.locator('#submenu-content')
    await expect(submenuContent).toBeVisible()

    // ArrowRight should close left-side submenu
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)

    await expect(submenuContent).not.toBeVisible()
    await expect(submenuTrigger).toBeFocused()
  })
})
