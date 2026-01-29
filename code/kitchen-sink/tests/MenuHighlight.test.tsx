import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Menu Highlight Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuHighlightCase', type: 'useCase', waitExtra: true })
  })

  test('hovering an item focuses it', async ({ page }) => {
    const trigger = page.getByTestId('menu-trigger')
    await expect(trigger).toBeVisible()

    // use keyboard to open menu (avoids overlay click interception in dev)
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // hover over item 2
    const item2 = page.getByTestId('menu-item-2')
    await item2.hover()
    await page.waitForTimeout(100)

    // item should be focused (not just hovered)
    await expect(item2).toBeFocused()
  })

  test('only one item is highlighted at a time when switching mouse to keyboard', async ({
    page,
  }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // hover item 2 to highlight it
    const item2 = page.getByTestId('menu-item-2')
    await item2.hover()
    await page.waitForTimeout(100)
    await expect(item2).toBeFocused()

    // now use keyboard to move to item 3
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const item3 = page.getByTestId('menu-item-3')
    await expect(item3).toBeFocused()

    // item 2 should no longer be focused
    await expect(item2).not.toBeFocused()

    // verify only item3 has the highlighted data attribute
    const item2Highlighted = await item2.getAttribute('data-highlighted')
    const item3Highlighted = await item3.getAttribute('data-highlighted')
    expect(item2Highlighted).toBeNull()
    expect(item3Highlighted).toBe('')
  })

  test('hover then arrow down shows only ONE highlighted item (no double highlight)', async ({
    page,
  }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const item1 = page.getByTestId('menu-item-1')
    const item2 = page.getByTestId('menu-item-2')

    // hover item 1 - it should get background highlight
    await item1.hover()
    await page.waitForTimeout(100)

    const item1BgAfterHover = await item1.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )
    const item2BgAfterHover = await item2.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )

    // item1 should have highlight bg, item2 should not
    expect(item1BgAfterHover).not.toBe(item2BgAfterHover)

    // now press ArrowDown to move to item 2
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    const item1BgAfterArrow = await item1.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )
    const item2BgAfterArrow = await item2.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )

    // CRITICAL: item1 should NO LONGER have highlight bg
    // item2 should now have the highlight bg
    // they should NOT both be highlighted
    expect(item1BgAfterArrow).toBe(item2BgAfterHover) // item1 now has default bg
    expect(item2BgAfterArrow).toBe(item1BgAfterHover) // item2 now has highlight bg
  })

  test('keyboard navigation then mouse hover transfers highlight cleanly', async ({
    page,
  }) => {
    const trigger = page.getByTestId('menu-trigger')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    // keyboard opens menu and focuses first item
    const item1 = page.getByTestId('menu-item-1')
    await expect(item1).toBeFocused()

    // navigate down with keyboard
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)
    const item2 = page.getByTestId('menu-item-2')
    await expect(item2).toBeFocused()

    // now hover item 1 with mouse
    await item1.hover()
    await page.waitForTimeout(100)

    // item 1 should now be focused, item 2 should not
    await expect(item1).toBeFocused()
    await expect(item2).not.toBeFocused()
  })

  test('item has consistent background on focus regardless of input method', async ({
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

    // hover item 1
    await item1.hover()
    await page.waitForTimeout(100)
    const item1BgOnHover = await item1.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )

    // move to item 2 via keyboard
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)
    const item2BgOnKeyboard = await item2.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    )

    // backgrounds should match (same highlight style for both input methods)
    expect(item1BgOnHover).toBe(item2BgOnKeyboard)
  })
})
