import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Dismiss Layer Stacking', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'DismissLayerStackingCase', type: 'useCase' })
  })

  test('ESC closes dialog first when dialog is open over popover', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // open popover
    const popoverTrigger = page.getByTestId('popover-trigger')
    await popoverTrigger.click()

    const popoverContent = page.getByTestId('popover-content')
    await expect(popoverContent).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // open dialog from inside popover
    const dialogTrigger = page.getByTestId('dialog-trigger')
    await dialogTrigger.click()

    const dialogContent = page.getByTestId('dialog-content')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // both should be open
    await expect(popoverContent).toBeVisible()
    await expect(dialogContent).toBeVisible()

    // press ESC - should close dialog, NOT popover
    await page.keyboard.press('Escape')
    await page.waitForTimeout(800) // longer wait for state + effect cleanup

    // dialog should be closed
    await expect(dialogContent).not.toBeVisible({ timeout: 5000 })

    // popover should STILL be open
    await expect(popoverContent).toBeVisible()

    // press ESC again - now popover should close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    await expect(popoverContent).not.toBeVisible({ timeout: 5000 })
  })

  test('ESC closes popover when only popover is open', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // open popover
    const popoverTrigger = page.getByTestId('popover-trigger')
    await popoverTrigger.click()

    const popoverContent = page.getByTestId('popover-content')
    await expect(popoverContent).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // press ESC - should close popover
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    await expect(popoverContent).not.toBeVisible({ timeout: 5000 })
  })

  test('dialog can be reopened after ESC close', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // open popover
    const popoverTrigger = page.getByTestId('popover-trigger')
    await popoverTrigger.click()

    const popoverContent = page.getByTestId('popover-content')
    await expect(popoverContent).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // open dialog
    const dialogTrigger = page.getByTestId('dialog-trigger')
    await dialogTrigger.click()

    const dialogContent = page.getByTestId('dialog-content')
    await expect(dialogContent).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // close dialog with ESC
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    await expect(dialogContent).not.toBeVisible({ timeout: 5000 })

    // reopen dialog
    await dialogTrigger.click()
    await expect(dialogContent).toBeVisible({ timeout: 5000 })

    // close with button this time
    const dialogClose = page.getByTestId('dialog-close')
    await dialogClose.click()
    await page.waitForTimeout(400)
    await expect(dialogContent).not.toBeVisible({ timeout: 5000 })

    // popover should still be open
    await expect(popoverContent).toBeVisible()
  })
})
