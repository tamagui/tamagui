import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuPlacementCase', type: 'useCase' })
})

/**
 * Tests for Menu.Placement render prop component.
 *
 * Menu.Placement provides placement-aware values that can be used for animations:
 * - side: 'left' | 'right' | 'top' | 'bottom'
 * - xDir: 1 for right-opening, -1 for left-opening
 * - yDir: 1 for bottom-opening, -1 for top-opening
 * - isLeft, isRight, isTop, isBottom: boolean helpers
 */

test('right-side submenu has xDir=1', async ({ page }) => {
  await page.waitForLoadState('networkidle')

  const menuTrigger = page.locator('#menu-trigger-right')
  const menuContent = page.locator('#menu-content-right')
  const submenuTrigger = page.locator('#submenu-trigger-right')
  const submenuContent = page.locator('#submenu-content-right')

  await menuTrigger.click()
  await expect(menuContent).toBeVisible({ timeout: 5000 })

  await submenuTrigger.hover()
  await page.waitForTimeout(300)
  await expect(submenuContent).toBeVisible({ timeout: 5000 })

  // verify xDir is 1 for right-opening submenu
  const xDir = await submenuContent.getAttribute('data-x-dir')
  expect(xDir).toBe('1')

  // verify side is 'right'
  const side = await submenuContent.getAttribute('data-side-info')
  expect(side).toBe('right')
})

test('left-side submenu has xDir=-1', async ({ page }) => {
  await page.waitForLoadState('networkidle')

  const menuTrigger = page.locator('#menu-trigger-left')
  const menuContent = page.locator('#menu-content-left')
  const submenuTrigger = page.locator('#submenu-trigger-left')
  const submenuContent = page.locator('#submenu-content-left')

  await menuTrigger.click()
  await expect(menuContent).toBeVisible({ timeout: 5000 })

  await submenuTrigger.hover()
  await page.waitForTimeout(300)
  await expect(submenuContent).toBeVisible({ timeout: 5000 })

  // verify xDir is -1 for left-opening submenu
  const xDir = await submenuContent.getAttribute('data-x-dir')
  expect(xDir).toBe('-1')

  // verify side is 'left'
  const side = await submenuContent.getAttribute('data-side-info')
  expect(side).toBe('left')
})
