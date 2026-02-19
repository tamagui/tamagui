import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { type: 'useCase', name: 'MenuAboveDialogCase' })
})

test('menu renders above dialog overlay', async ({ page }) => {
  await page.waitForLoadState('networkidle')

  // open dialog
  const dialogTrigger = page.getByTestId('dialog-trigger')
  await dialogTrigger.click()

  const dialogContent = page.getByTestId('dialog-content')
  await expect(dialogContent).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(300)

  // open menu inside dialog
  const menuTrigger = page.getByTestId('menu-trigger')
  await menuTrigger.click()

  const menuContent = page.getByTestId('menu-content')
  await expect(menuContent).toBeVisible({ timeout: 5000 })

  // verify menu is clickable (proves it's above dialog)
  const menuItem = page.getByTestId('menu-item-1')
  await expect(menuItem).toBeVisible()

  // get z-index values to verify stacking
  const dialogZIndex = await dialogContent.evaluate((el) => {
    return window.getComputedStyle(el).zIndex
  })
  const menuZIndex = await menuContent.evaluate((el) => {
    return window.getComputedStyle(el).zIndex
  })

  // menu should have higher z-index than dialog
  const dialogZ = parseInt(dialogZIndex) || 0
  const menuZ = parseInt(menuZIndex) || 0

  // log for debugging
  console.log(`Dialog z-index: ${dialogZ}, Menu z-index: ${menuZ}`)

  expect(menuZ).toBeGreaterThan(dialogZ)
})

test('menu closes on ESC, dialog stays open', async ({ page }) => {
  await page.waitForLoadState('networkidle')

  // open dialog
  await page.getByTestId('dialog-trigger').click()
  await expect(page.getByTestId('dialog-content')).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(300)

  // open menu
  await page.getByTestId('menu-trigger').click()
  await expect(page.getByTestId('menu-content')).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(200)

  // press ESC - menu should close, dialog should stay open
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)

  await expect(page.getByTestId('menu-content')).not.toBeVisible({ timeout: 5000 })
  await expect(page.getByTestId('dialog-content')).toBeVisible()
})

test('clicking menu item works when menu is above dialog', async ({ page }) => {
  await page.waitForLoadState('networkidle')

  // open dialog
  await page.getByTestId('dialog-trigger').click()
  await expect(page.getByTestId('dialog-content')).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(300)

  // open menu
  await page.getByTestId('menu-trigger').click()
  await expect(page.getByTestId('menu-content')).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(200)

  // click menu item - should work without being blocked by dialog
  const menuItem = page.getByTestId('menu-item-2')
  await menuItem.click()

  // menu should close after item click
  await expect(page.getByTestId('menu-content')).not.toBeVisible({ timeout: 5000 })
  // dialog should still be open
  await expect(page.getByTestId('dialog-content')).toBeVisible()
})
