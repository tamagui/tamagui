import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuSubLeftCase', type: 'useCase' })
})

/**
 * Tests for Menu Submenu SafePolygon behavior when submenu opens to the LEFT
 */

test('left-side submenu has data-side="left" attribute required for safePolygon', async ({
  page,
}) => {
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
  // for left-side submenus, this should be 'left'
  const dataSide = await submenuContent.getAttribute('data-side')
  expect(dataSide).toBe('left')
})

test('safePolygon keeps left-side submenu open when mouse crosses parent menu items', async ({
  page,
}) => {
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

  // get positions
  const triggerBox = await submenuTrigger.boundingBox()
  const submenuBox = await submenuContent.boundingBox()

  if (!triggerBox || !submenuBox) {
    throw new Error('Could not get bounding boxes')
  }

  // start at the submenu trigger
  const startX = triggerBox.x + triggerBox.width / 2
  const startY = triggerBox.y + triggerBox.height / 2

  // end inside submenu content - moving LEFT and DOWN
  // the submenu is to the LEFT of the trigger
  const endX = submenuBox.x + submenuBox.width / 2
  const endY = submenuBox.y + submenuBox.height - 20

  await page.mouse.move(startX, startY)
  await page.waitForTimeout(30)

  // move diagonally DOWN and LEFT
  // this path crosses through menu items below the trigger
  // safePolygon should prevent those items from stealing focus
  const steps = 12
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps
    const x = startX + (endX - startX) * progress
    const y = startY + (endY - startY) * progress
    await page.mouse.move(x, y)
    await page.waitForTimeout(20)
  }

  // submenu should stay open because safePolygon correctly identifies
  // side='left' from the placement and matches it with pointerDir='left'
  await expect(submenuContent).toBeVisible()
})
