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
    await page.waitForTimeout(800)

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

  test('ESC closes select inside popover first, then popover', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // open popover
    const popoverTrigger = page.getByTestId('popover-trigger')
    await popoverTrigger.click()

    const popoverContent = page.getByTestId('popover-content')
    await expect(popoverContent).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // open select inside popover
    const selectTrigger = page.getByTestId('popover-select-trigger')
    await selectTrigger.click()

    const selectViewport = page.getByTestId('popover-select-viewport')
    await expect(selectViewport).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // press ESC - should close select, NOT popover
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    // select should be closed
    await expect(selectViewport).not.toBeVisible({ timeout: 5000 })

    // popover should STILL be open
    await expect(popoverContent).toBeVisible()

    // press ESC again - now popover should close
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    await expect(popoverContent).not.toBeVisible({ timeout: 5000 })
  })

  test('ESC closes select inside dialog first, then dialog', async ({ page }) => {
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

    // open select inside dialog
    const selectTrigger = page.getByTestId('dialog-select-trigger')
    await selectTrigger.click()

    const selectViewport = page.getByTestId('dialog-select-viewport')
    await expect(selectViewport).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    // press ESC - should close select first
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    await expect(selectViewport).not.toBeVisible({ timeout: 5000 })
    await expect(dialogContent).toBeVisible()
    await expect(popoverContent).toBeVisible()

    // press ESC - should close dialog
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    await expect(dialogContent).not.toBeVisible({ timeout: 5000 })
    await expect(popoverContent).toBeVisible()

    // press ESC - should close popover
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    await expect(popoverContent).not.toBeVisible({ timeout: 5000 })
  })

  test('useHasDismissableLayers hook updates correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // initially no layers
    const hasLayersStatus = page.getByTestId('has-layers-status')
    await expect(hasLayersStatus).toContainText('false')

    // open popover
    const popoverTrigger = page.getByTestId('popover-trigger')
    await popoverTrigger.click()
    await page.waitForTimeout(400)

    // should have layers now
    await expect(hasLayersStatus).toContainText('true')

    // close popover
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    // back to no layers
    await expect(hasLayersStatus).toContainText('false')
  })

  test('getDismissableLayerCount updates correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const layerCountStatus = page.getByTestId('layer-count-status')

    // initially 0
    await expect(layerCountStatus).toContainText('0')

    // open popover - should be 1
    const popoverTrigger = page.getByTestId('popover-trigger')
    await popoverTrigger.click()
    await page.waitForTimeout(400)
    await expect(layerCountStatus).toContainText('1')

    // open dialog - should be 2
    const dialogTrigger = page.getByTestId('dialog-trigger')
    await dialogTrigger.click()
    await page.waitForTimeout(400)
    await expect(layerCountStatus).toContainText('2')

    // open select - should be 3
    const selectTrigger = page.getByTestId('dialog-select-trigger')
    await selectTrigger.click()
    await page.waitForTimeout(400)
    await expect(layerCountStatus).toContainText('3')

    // close select - should be 2
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    await expect(layerCountStatus).toContainText('2')

    // close dialog - should be 1
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    await expect(layerCountStatus).toContainText('1')

    // close popover - should be 0
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    await expect(layerCountStatus).toContainText('0')
  })

  test('two dialogs can be opened side by side', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // open popover with dialog inside
    const popoverTrigger = page.getByTestId('popover-trigger')
    await popoverTrigger.click()
    await page.waitForTimeout(300)

    const dialogTrigger = page.getByTestId('dialog-trigger')
    await dialogTrigger.click()
    await page.waitForTimeout(300)

    const dialogContent = page.getByTestId('dialog-content')
    await expect(dialogContent).toBeVisible()

    // close this dialog
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    await expect(dialogContent).not.toBeVisible()

    // close popover
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)

    // open the standalone dialog
    const dialog2Trigger = page.getByTestId('dialog2-trigger')
    await dialog2Trigger.click()
    await page.waitForTimeout(300)

    const dialog2Content = page.getByTestId('dialog2-content')
    await expect(dialog2Content).toBeVisible()

    // close with ESC
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    await expect(dialog2Content).not.toBeVisible()
  })
})
