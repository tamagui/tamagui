import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuSubLeftTransformOriginCase', type: 'useCase' })
})

/**
 * Tests for Menu Submenu transform-origin when submenu opens to the LEFT.
 *
 * When a submenu opens to the left (placement="left-start"), the transform-origin
 * should be set to the RIGHT edge (e.g., "right top" or a pixel value representing
 * the right edge) so scale animations appear to grow from where the menu connects
 * to its trigger.
 *
 * Bug: The transform-origin is not properly adjusted when submenus open to the left,
 * causing animations to appear from the wrong corner.
 */

test('left-side submenu has correct transform-origin on right edge', async ({ page }) => {
  await page.waitForLoadState('networkidle')

  const menuTrigger = page.locator('#menu-trigger')
  const menuContent = page.locator('#menu-content')
  const submenuTrigger = page.locator('#submenu-trigger')
  const submenuContent = page.locator('#submenu-content')

  await menuTrigger.click()
  await expect(menuContent).toBeVisible({ timeout: 5000 })

  await submenuTrigger.hover()
  await page.waitForTimeout(300) // wait for animation
  await expect(submenuContent).toBeVisible({ timeout: 5000 })

  // verify placement is left
  const placement = await submenuContent.getAttribute('data-placement')
  expect(placement).toMatch(/^left/)

  // get the computed transform-origin style
  const transformOrigin = await submenuContent.evaluate((el) => {
    return window.getComputedStyle(el).transformOrigin
  })

  // get the bounding box to know the element width
  const box = await submenuContent.boundingBox()
  if (!box) throw new Error('Could not get bounding box')

  // the transform-origin should be on the RIGHT side for left-placed menus
  // format is typically "Xpx Ypx" or "X% Y%"
  // for left placement, X should be near the width (right edge)
  const [xStr] = transformOrigin.split(' ')
  const xValue = parseFloat(xStr)

  // if it's a percentage, 100% means right edge
  // if it's pixels, it should be close to the element width
  if (xStr.includes('%')) {
    // should be close to 100% (right edge)
    expect(xValue).toBeGreaterThanOrEqual(90)
  } else {
    // should be close to the element width (right edge)
    // allow some tolerance for borders/padding
    expect(xValue).toBeGreaterThanOrEqual(box.width * 0.8)
  }
})

test('data-placement attribute is set correctly for left-side submenu', async ({
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
  await page.waitForTimeout(300)
  await expect(submenuContent).toBeVisible({ timeout: 5000 })

  // verify data-placement reflects left-start
  const placement = await submenuContent.getAttribute('data-placement')
  expect(placement).toBe('left-start')

  // verify data-side is set for safe polygon
  const dataSide = await submenuContent.getAttribute('data-side')
  expect(dataSide).toBe('left')
})
