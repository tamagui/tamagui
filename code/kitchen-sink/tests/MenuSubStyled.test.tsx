import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuSubStyledCase', type: 'useCase' })
})

test('styled(Menu.SubContent) positions submenu correctly', async ({ page }) => {
  await page.waitForLoadState('networkidle')

  // open the menu
  await page.click('#menu-trigger')
  await page.waitForTimeout(300)

  // hover on submenu trigger to open submenu
  await page.hover('#submenu-trigger')
  await page.waitForTimeout(500)

  // check that submenu is visible
  const submenuContent = page.locator('#submenu-content')
  await expect(submenuContent).toBeVisible()

  // get positions
  const triggerBox = await page.locator('#submenu-trigger').boundingBox()
  const submenuBox = await submenuContent.boundingBox()

  expect(triggerBox).toBeTruthy()
  expect(submenuBox).toBeTruthy()

  // submenu should be positioned to the right of the trigger, not at top-left (0,0)
  // the submenu's left edge should be near or to the right of the trigger's right edge
  expect(submenuBox!.x).toBeGreaterThan(triggerBox!.x)
  // the submenu should not be at y=0 (top of viewport)
  expect(submenuBox!.y).toBeGreaterThan(50)

  // verify submenu has items
  await expect(page.locator('#submenu-item-1')).toBeVisible()
  await expect(page.locator('#submenu-item-2')).toBeVisible()
})
