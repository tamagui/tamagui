import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuSubCase', type: 'useCase' })
})

/**
 * Tests for Menu Submenu SafePolygon behavior
 */

test('submenu has data-side attribute required for safePolygon', async ({ page }) => {
  await page.waitForLoadState('networkidle')

  const menuTrigger = page.locator('#menu-trigger')
  const menuContent = page.locator('#menu-content')
  const submenuTrigger = page.locator('#submenu-trigger')
  const submenuContent = page.locator('#submenu-content')

  await menuTrigger.click()
  await expect(menuContent).toBeVisible({ timeout: 5000 })

  await submenuTrigger.hover()
  await page.waitForTimeout(200)
  await expect(submenuContent).toBeVisible({ timeout: 5000 })

  // data-side tells safePolygon which direction the submenu is
  // Without it, isPointerMovingToSubmenu always returns false
  const dataSide = await submenuContent.getAttribute('data-side')
  expect(dataSide).toBe('right')
})

test('safePolygon keeps submenu open when mouse crosses parent menu items', async ({
  page,
}) => {
  await page.waitForLoadState('networkidle')

  const menuTrigger = page.locator('#menu-trigger')
  const menuContent = page.locator('#menu-content')
  const submenuTrigger = page.locator('#submenu-trigger')
  const submenuContent = page.locator('#submenu-content')
  const menuItem4 = page.locator('#menu-item-4') // Below the submenu trigger

  await menuTrigger.click()
  await expect(menuContent).toBeVisible({ timeout: 5000 })

  await submenuTrigger.hover()
  await page.waitForTimeout(200)
  await expect(submenuContent).toBeVisible({ timeout: 5000 })

  // Get positions
  const triggerBox = await submenuTrigger.boundingBox()
  const submenuBox = await submenuContent.boundingBox()
  const item4Box = await menuItem4.boundingBox()

  if (!triggerBox || !submenuBox || !item4Box) {
    throw new Error('Could not get bounding boxes')
  }

  // Start at the submenu trigger
  const startX = triggerBox.x + triggerBox.width / 2
  const startY = triggerBox.y + triggerBox.height / 2

  // End inside submenu content - but path goes DOWN through item4's vertical space
  // then RIGHT into the submenu
  const endX = submenuBox.x + submenuBox.width / 2
  const endY = submenuBox.y + submenuBox.height - 20 // Bottom of submenu

  await page.mouse.move(startX, startY)
  await page.waitForTimeout(30)

  // Move diagonally DOWN and RIGHT
  // This path crosses through the area where item4 is located horizontally
  // Without safePolygon, hovering over item4 would close the submenu
  const steps = 12
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps
    const x = startX + (endX - startX) * progress
    const y = startY + (endY - startY) * progress
    await page.mouse.move(x, y)
    await page.waitForTimeout(20)
  }

  // With safePolygon working:
  // - When leaving trigger, polygon is created with side='right'
  // - Mouse moving right matches side='right', so isPointerMovingToSubmenu=true
  // - onItemEnter on item4 calls preventDefault, item4 doesn't steal focus
  // - Submenu stays open
  //
  // Without fix (side=undefined):
  // - isPointerMovingToSubmenu returns false (pointerDir 'right' !== undefined)
  // - onItemEnter doesn't preventDefault
  // - item4 gets focused, triggering onFocusOutside on submenu
  // - Submenu closes
  await expect(submenuContent).toBeVisible()
})
