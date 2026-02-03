import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests for Select click-and-hold-to-select behavior.
 *
 * This behavior allows users to:
 * 1. Press and hold on the select trigger
 * 2. Drag to an item while holding
 * 3. Release to select that item
 *
 * This is a common native select pattern that was broken by Safari fixes.
 */
test.describe('Select Click and Hold', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectFocusScopeCase', type: 'useCase' })
  })

  test('click-and-hold-to-select works', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).toBeTruthy()

    // Get position of banana item (need to open first to measure)
    await trigger.click()
    await page.waitForTimeout(400) // Wait for menu to open and 300ms guard to pass

    const bananaItem = page.getByTestId('select-banana')
    await expect(bananaItem).toBeVisible()
    const bananaBox = await bananaItem.boundingBox()
    expect(bananaBox).toBeTruthy()

    // Close the menu
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)

    // Now perform click-and-hold-to-select:
    // 1. Mouse down on trigger
    // 2. Wait for menu to open (> 300ms to pass guard)
    // 3. Move to banana item
    // 4. Release to select

    await page.mouse.move(
      triggerBox!.x + triggerBox!.width / 2,
      triggerBox!.y + triggerBox!.height / 2
    )
    await page.mouse.down()

    // Wait for menu to open and the 300ms mouseUp guard to pass
    await page.waitForTimeout(400)

    // Menu should be open
    await expect(bananaItem).toBeVisible()

    // Move to banana item
    await page.mouse.move(
      bananaBox!.x + bananaBox!.width / 2,
      bananaBox!.y + bananaBox!.height / 2
    )
    await page.waitForTimeout(50)

    // Release to select
    await page.mouse.up()
    await page.waitForTimeout(200)

    // Menu should close and banana should be selected
    const selectViewport = page.getByTestId('basic-select-viewport')
    await expect(selectViewport).not.toBeVisible()

    // Trigger should show "Banana"
    const triggerText = await trigger.textContent()
    expect(triggerText).toContain('Banana')
  })

  test('quick click does not select item under cursor (Safari fix)', async ({ page }) => {
    // This tests that the Safari fix still works - a quick click-release
    // should NOT select an item even if the cursor happens to be over one

    const trigger = page.getByTestId('basic-select-trigger')
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).toBeTruthy()

    // Quick click to open
    await trigger.click()

    // Wait a moment for menu to open but NOT long enough for the guard to pass
    await page.waitForTimeout(100)

    const selectViewport = page.getByTestId('basic-select-viewport')
    await expect(selectViewport).toBeVisible()

    // The menu should be open and nothing should be selected yet
    // (The initial click's mouseUp is blocked)
    const triggerText = await trigger.textContent()
    expect(triggerText).not.toContain('Apple')
    expect(triggerText).not.toContain('Banana')

    // Close menu
    await page.keyboard.press('Escape')
  })

  test('click-and-release-too-fast does not select', async ({ page }) => {
    // If user clicks and releases before the 300ms guard passes,
    // nothing should be selected even if mouse is over an item

    const trigger = page.getByTestId('basic-select-trigger')
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).toBeTruthy()

    // First, open and get item positions
    await trigger.click()
    await page.waitForTimeout(400)

    const appleItem = page.getByTestId('select-apple')
    await expect(appleItem).toBeVisible()
    const appleBox = await appleItem.boundingBox()
    expect(appleBox).toBeTruthy()

    // Close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)

    // Now do a fast click-move-release (under 300ms)
    await page.mouse.move(
      triggerBox!.x + triggerBox!.width / 2,
      triggerBox!.y + triggerBox!.height / 2
    )
    await page.mouse.down()

    // Wait just a tiny bit - not enough for the guard
    await page.waitForTimeout(50)

    // Move toward where apple would be and release quickly
    await page.mouse.move(
      appleBox!.x + appleBox!.width / 2,
      appleBox!.y + appleBox!.height / 2
    )
    await page.mouse.up()

    await page.waitForTimeout(200)

    // The menu might still be open (that's fine) but nothing should be selected
    const triggerText = await trigger.textContent()
    expect(triggerText).not.toContain('Apple')
    expect(triggerText).not.toContain('Banana')
  })
})
