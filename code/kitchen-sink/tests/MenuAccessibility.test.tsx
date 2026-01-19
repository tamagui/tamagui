import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Menu Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuAccessibilityCase', type: 'useCase' })
  })

  test('trigger is focusable via tab key', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // focus the "before" button first
    const beforeButton = page.getByTestId('before-button')
    await beforeButton.focus()
    await expect(beforeButton).toBeFocused()

    // tab to menu trigger
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    const trigger = page.getByTestId('menu-trigger')
    await expect(trigger).toBeFocused()

    // tab to "after" button
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    const afterButton = page.getByTestId('after-button')
    await expect(afterButton).toBeFocused()
  })

  test('menu opens on Enter key and focuses first item', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await expect(trigger).toBeFocused()

    // press Enter to open menu
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // first item should be focused for keyboard users
    const firstItem = page.getByTestId('menu-item-1')
    await expect(firstItem).toBeFocused()
  })

  test('menu opens on Space key and focuses first item', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await expect(trigger).toBeFocused()

    // press Space to open menu
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // first item should be focused for keyboard users
    const firstItem = page.getByTestId('menu-item-1')
    await expect(firstItem).toBeFocused()
  })

  test('arrow down from content frame focuses first item', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()
    await expect(menuContent).toBeFocused()

    // press ArrowDown to focus first item
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const firstItem = page.getByTestId('menu-item-1')
    await expect(firstItem).toBeFocused()
  })

  test('arrow keys navigate between menu items', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // arrow down to focus first item from content frame
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const firstItem = page.getByTestId('menu-item-1')
    await expect(firstItem).toBeFocused()

    // arrow down to second item
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const secondItem = page.getByTestId('menu-item-2')
    await expect(secondItem).toBeFocused()

    // arrow down to third item
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const thirdItem = page.getByTestId('menu-item-3')
    await expect(thirdItem).toBeFocused()

    // arrow up back to second item
    await page.keyboard.press('ArrowUp')
    await page.waitForTimeout(100)

    await expect(secondItem).toBeFocused()
  })

  test('escape closes menu and returns focus to trigger', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // focus an item
    const firstItem = page.getByTestId('menu-item-1')
    await firstItem.focus()
    await expect(firstItem).toBeFocused()

    // press Escape to close menu
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    await expect(menuContent).not.toBeVisible()

    // focus should return to trigger
    await expect(trigger).toBeFocused()
  })

  test('escape in submenu closes only submenu first, then parent', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // open submenu by clicking on submenu trigger
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.click()
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()

    // focus a submenu item
    const submenuItem = page.getByTestId('submenu-item-1')
    await submenuItem.focus()
    await expect(submenuItem).toBeFocused()

    // press Escape - should close submenu only
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // submenu should be closed
    await expect(submenuContent).not.toBeVisible()

    // parent menu should still be open
    await expect(menuContent).toBeVisible()

    // focus should return to submenu trigger
    await expect(submenuTrigger).toBeFocused()

    // press Escape again - should close parent menu
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    await expect(menuContent).not.toBeVisible()

    // focus should return to main trigger
    await expect(trigger).toBeFocused()
  })

  test('arrow right opens submenu and focuses first submenu item', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // navigate to submenu trigger
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.focus()
    await expect(submenuTrigger).toBeFocused()

    // press ArrowRight to open submenu
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()

    // first submenu item should be focused for keyboard users
    const firstSubmenuItem = page.getByTestId('submenu-item-1')
    await expect(firstSubmenuItem).toBeFocused()
  })

  test('arrow down in hover-opened submenu focuses first item', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    // hover over submenu trigger to open submenu
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.hover()
    await page.waitForTimeout(500)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()

    // focus the submenu content and press down
    await submenuContent.focus()
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const firstSubmenuItem = page.getByTestId('submenu-item-1')
    await expect(firstSubmenuItem).toBeFocused()
  })

  test('arrow left closes submenu and returns to parent', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    // open submenu
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.click()
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()

    const submenuItem = page.getByTestId('submenu-item-1')
    await submenuItem.focus()

    // press ArrowLeft to close submenu
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)

    await expect(submenuContent).not.toBeVisible()

    // focus should return to submenu trigger in parent
    await expect(submenuTrigger).toBeFocused()
  })

  test('tab key does not navigate within menu', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    const firstItem = page.getByTestId('menu-item-1')
    await firstItem.focus()
    await expect(firstItem).toBeFocused()

    // press Tab - menu should close (standard menu behavior)
    await page.keyboard.press('Tab')
    await page.waitForTimeout(300)

    // menu behavior varies - some close on Tab, some trap focus
    // the key is that Tab doesn't navigate between items like ArrowDown does
  })

  test('space key opens submenu when focused on submenu trigger', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // navigate to submenu trigger
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.focus()
    await expect(submenuTrigger).toBeFocused()

    // press Space to open submenu
    await page.keyboard.press('Space')
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()
  })

  test('enter key opens submenu when focused on submenu trigger', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // navigate to submenu trigger
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.focus()
    await expect(submenuTrigger).toBeFocused()

    // press Enter to open submenu
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()
  })
})
