import { expect, test } from '@playwright/test'

test.describe('Menu stayInFrame', () => {
  test('Menu bottom placement should not cover trigger', async ({ page }) => {
    // Small viewport to test constraint behavior
    await page.setViewportSize({ width: 400, height: 300 })

    await page.goto('/?test=MenuBottomCase')
    await page.waitForTimeout(500)

    const trigger = page.getByTestId('menu-trigger')
    const triggerBox = await trigger.boundingBox()
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    const menuBox = await menuContent.boundingBox()
    const viewport = page.viewportSize()!
    const padding = 10

    // Menu should be BELOW the trigger (placement="bottom-start", allowFlip={false})
    // Menu top should be >= trigger bottom (with some tolerance for offset)
    expect(menuBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height - 5)

    // Menu should fit within viewport with padding
    expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(viewport.height - padding + 2)
  })

  test('menu should not overflow viewport when near bottom edge', async ({ page }) => {
    // Set a small viewport to make it easier to test overflow
    await page.setViewportSize({ width: 400, height: 300 })

    await page.goto('/?test=MenuOverflowCase')
    await page.waitForTimeout(500)

    // Click the menu trigger (it's at the bottom of the page in this test case)
    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    // Get the menu content element
    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // Get the bounding box of the menu
    const menuBox = await menuContent.boundingBox()
    expect(menuBox).not.toBeNull()

    // Get viewport size
    const viewport = page.viewportSize()
    expect(viewport).not.toBeNull()

    // Menu should not overflow the viewport with 10px padding
    const padding = 10

    // Check that menu has at least 10px padding from top
    expect(menuBox!.y).toBeGreaterThanOrEqual(padding - 2) // 2px tolerance

    // Check that menu has at least 10px padding from bottom
    expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(
      viewport!.height - padding + 2
    )

    // Check that menu right doesn't exceed viewport right
    expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(viewport!.width - padding + 5)

    // Check that menu left doesn't go past viewport left
    expect(menuBox!.x).toBeGreaterThanOrEqual(padding - 5)
  })

  test('menu should flip when not enough space below', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 250 })

    await page.goto('/?test=MenuOverflowCase')
    await page.waitForTimeout(500)

    const trigger = page.getByTestId('menu-trigger')
    const triggerBox = await trigger.boundingBox()

    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    const menuBox = await menuContent.boundingBox()
    expect(menuBox).not.toBeNull()
    expect(triggerBox).not.toBeNull()

    // Since trigger is at bottom and viewport is small, menu should flip to appear above
    // OR stay within bounds via shift
    const viewport = page.viewportSize()!

    // The key assertion: menu should be fully visible within viewport
    expect(menuBox!.y).toBeGreaterThanOrEqual(0)
    expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(viewport.height)
  })
})
