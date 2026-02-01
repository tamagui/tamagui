import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Menu hover/keyboard bug fixes', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuAccessibilityCase', type: 'useCase' })
  })

  /**
   * Bug 1: hoverStyle should not cause double highlighting
   * When you hover an item and then use keyboard to navigate away WITHOUT moving the mouse,
   * the hovered item's hoverStyle can persist alongside the keyboard-focused item's highlight,
   * resulting in two items appearing highlighted at once.
   *
   * The key scenario: mouse is still over item1, but keyboard navigates to item2.
   * Both items should NOT have highlighted background - only item2 should.
   */
  test('no double highlight: when keyboard navigates while mouse stays over original item', async ({
    page,
  }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    const item1 = page.getByTestId('menu-item-1')
    const item2 = page.getByTestId('menu-item-2')

    // get the default (non-highlighted) background color of item2
    const defaultBg = await item2.evaluate((el) => getComputedStyle(el).backgroundColor)

    // hover item 1 with mouse - it should get highlighted
    await item1.hover()
    await page.waitForTimeout(150)

    // item1 should be focused and highlighted
    await expect(item1).toBeFocused()
    const item1BgAfterHover = await item1.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )

    // item1 should have a different (highlighted) background
    expect(item1BgAfterHover).not.toBe(defaultBg)

    // now use keyboard to move to item 2
    // CRITICAL: do NOT move the mouse - it stays over item1
    // this is the exact scenario where hoverStyle causes double highlight
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(150)

    // item2 should now be focused and highlighted
    await expect(item2).toBeFocused()

    // get backgrounds - CRITICAL TEST: only item2 should have highlight bg
    const item1BgAfterArrow = await item1.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )
    const item2BgAfterArrow = await item2.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )

    // item2 should have highlighted bg (via data-highlighted/focusStyle)
    expect(item2BgAfterArrow).not.toBe(defaultBg)

    // CRITICAL: item1 should NOT have highlighted background even though mouse is still over it
    // If this fails, it means hoverStyle is causing double highlight
    expect(item1BgAfterArrow).toBe(defaultBg)
  })

  /**
   * Bug 2: After hovering a submenu trigger (before the auto-open timer fires),
   * pressing ArrowRight should open the submenu and focus its first item.
   *
   * When you hover over a submenu trigger with the mouse and IMMEDIATELY press ArrowRight
   * (before the 100ms auto-open delay), the submenu should open and focus should move into it.
   */
  test('hovering submenu trigger then immediately pressing ArrowRight opens and focuses submenu', async ({
    page,
  }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    const submenuTrigger = page.getByTestId('submenu-trigger')

    // hover the submenu trigger with mouse
    await submenuTrigger.hover()
    // don't wait for the auto-open timer - press arrow key immediately
    await page.waitForTimeout(50) // just enough for the focus to happen

    // the submenu trigger should be focused from the hover
    await expect(submenuTrigger).toBeFocused()

    // now press ArrowRight to open the submenu - the submenu might not be open yet
    // because the 100ms auto-open timer hasn't fired
    const submenuContent = page.getByTestId('submenu-content')

    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)

    // the submenu should be open
    await expect(submenuContent).toBeVisible({ timeout: 2000 })

    // CRITICAL: the first submenu item should now be focused
    // this is the key difference from mouse-hover behavior
    const submenuItem1 = page.getByTestId('submenu-item-1')
    await expect(submenuItem1).toBeFocused()
  })

  /**
   * Bug 2b: When submenu is already open via hover, pressing ArrowRight should focus
   * the first submenu item (moving focus into the submenu).
   *
   * Scenario: User hovers submenu trigger, submenu auto-opens, user presses ArrowRight
   * expecting to move focus into the already-open submenu.
   */
  test('when submenu is already open via hover, ArrowRight focuses first submenu item', async ({
    page,
  }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    const submenuTrigger = page.getByTestId('submenu-trigger')

    // hover the submenu trigger and wait for it to auto-open
    await submenuTrigger.hover()
    await page.waitForTimeout(200) // wait for 100ms auto-open delay

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible({ timeout: 2000 })

    // at this point, submenu is open but trigger is still focused (from hover)
    await expect(submenuTrigger).toBeFocused()

    // pressing ArrowRight should move focus INTO the submenu
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(150)

    // the first submenu item should now be focused
    const submenuItem1 = page.getByTestId('submenu-item-1')
    await expect(submenuItem1).toBeFocused()
  })

  /**
   * Bug 2c: When a submenu is open via mouse hover (not keyboard), pressing keyboard keys
   * should still work to navigate within it.
   *
   * Scenario: User opens menu, hovers over submenu trigger (which opens submenu),
   * then hovers over a submenu item, then tries to use keyboard to navigate.
   */
  test('submenu opened via hover then keyboard navigation works', async ({ page }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // hover the submenu trigger - this should open the submenu after a delay
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.hover()
    await page.waitForTimeout(300) // wait for the 100ms delay to open

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible({ timeout: 2000 })

    // now hover a submenu item
    const submenuItem1 = page.getByTestId('submenu-item-1')
    await submenuItem1.hover()
    await page.waitForTimeout(150)
    await expect(submenuItem1).toBeFocused()

    // now try keyboard navigation - ArrowDown should go to submenu-item-2
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(150)

    const submenuItem2 = page.getByTestId('submenu-item-2')
    await expect(submenuItem2).toBeFocused()

    // ArrowLeft should close submenu and return to parent
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)

    await expect(submenuContent).not.toBeVisible()
    await expect(submenuTrigger).toBeFocused()
  })

  /**
   * Bug 2c: After hovering a submenu item (inside an open submenu), pressing ArrowRight
   * should NOT do anything weird (or should do the right thing depending on context).
   *
   * This tests that after the user hovers items in the submenu with their mouse,
   * then switches to keyboard navigation, it works correctly.
   */
  test('hovering submenu item then using keyboard navigation works', async ({ page }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // open the submenu via keyboard first
    const submenuTrigger = page.getByTestId('submenu-trigger')
    await submenuTrigger.focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(300)

    const submenuContent = page.getByTestId('submenu-content')
    await expect(submenuContent).toBeVisible()

    // now hover the first submenu item with mouse
    const submenuItem1 = page.getByTestId('submenu-item-1')
    await submenuItem1.hover()
    await page.waitForTimeout(150)
    await expect(submenuItem1).toBeFocused()

    // hover the second submenu item
    const submenuItem2 = page.getByTestId('submenu-item-2')
    await submenuItem2.hover()
    await page.waitForTimeout(150)
    await expect(submenuItem2).toBeFocused()

    // now use keyboard to navigate back up
    await page.keyboard.press('ArrowUp')
    await page.waitForTimeout(150)

    // the first item should now be focused (keyboard navigation should work)
    await expect(submenuItem1).toBeFocused()

    // pressing ArrowLeft should close the submenu and return focus to the trigger
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)

    await expect(submenuContent).not.toBeVisible()
    await expect(submenuTrigger).toBeFocused()
  })
})
