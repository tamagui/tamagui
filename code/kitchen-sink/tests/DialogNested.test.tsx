import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Dialog Nested Stacking', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'DialogNestedCase', type: 'useCase' })
  })

  test('nested dialog appears above parent dialog (z-index stacking)', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // Open parent dialog
    const parentTrigger = page.getByTestId('parent-dialog-trigger')
    await parentTrigger.click()

    const parentDialog = page.getByTestId('parent-dialog-content')
    await expect(parentDialog).toBeVisible({ timeout: 5000 })

    // Wait for animation to complete
    await page.waitForTimeout(300)

    // Open nested dialog
    const nestedTrigger = page.getByTestId('nested-dialog-trigger')
    await nestedTrigger.click()

    const nestedDialog = page.getByTestId('nested-dialog-content')
    await expect(nestedDialog).toBeVisible({ timeout: 5000 })

    // Wait for animation to complete
    await page.waitForTimeout(300)

    // Get the z-index values of both dialog portal containers
    // TamaguiRoot wraps portal content in Theme > span, so z-index is on the inner span
    const zIndexInfo = await page.evaluate(() => {
      const portals = document.querySelectorAll('span[style*="z-index"]')
      const zIndices: number[] = []

      portals.forEach((portal) => {
        const style = window.getComputedStyle(portal)
        const zIndex = parseInt(style.zIndex, 10)
        if (!isNaN(zIndex)) {
          zIndices.push(zIndex)
        }
      })

      return zIndices.sort((a, b) => a - b)
    })

    // Should have at least 2 different z-index values
    expect(zIndexInfo.length).toBeGreaterThanOrEqual(2)

    // The nested dialog should have a higher z-index than the parent
    const parentZIndex = zIndexInfo[0]
    const nestedZIndex = zIndexInfo[zIndexInfo.length - 1]

    expect(nestedZIndex).toBeGreaterThan(parentZIndex)

    // Verify the nested dialog is visually on top by checking element at center
    const nestedBounds = await nestedDialog.boundingBox()
    if (nestedBounds) {
      const centerX = nestedBounds.x + nestedBounds.width / 2
      const centerY = nestedBounds.y + nestedBounds.height / 2

      const elementAtPoint = await page.evaluate(
        ({ x, y }) => {
          const el = document.elementFromPoint(x, y)
          return el?.closest('[data-testid="nested-dialog-content"]') !== null
        },
        { x: centerX, y: centerY }
      )

      expect(elementAtPoint).toBe(true)
    }
  })

  test('three levels of nested dialogs stack correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Open level 1 dialog
    const level1Trigger = page.getByTestId('parent-dialog-trigger')
    await level1Trigger.click()

    const level1Dialog = page.getByTestId('parent-dialog-content')
    await expect(level1Dialog).toBeVisible({ timeout: 5000 })

    // Wait for animation
    await page.waitForTimeout(300)

    // Open level 2 dialog
    const level2Trigger = page.getByTestId('nested-dialog-trigger')
    await level2Trigger.click()

    const level2Dialog = page.getByTestId('nested-dialog-content')
    await expect(level2Dialog).toBeVisible({ timeout: 5000 })

    // Wait for animation
    await page.waitForTimeout(300)

    // Open level 3 dialog
    const level3Trigger = page.getByTestId('level-3-dialog-trigger')
    await level3Trigger.click()

    const level3Dialog = page.getByTestId('level-3-dialog-content')
    await expect(level3Dialog).toBeVisible({ timeout: 5000 })

    // Wait for animation
    await page.waitForTimeout(300)

    // Verify level 3 is on top visually
    const level3Bounds = await level3Dialog.boundingBox()
    if (level3Bounds) {
      const centerX = level3Bounds.x + level3Bounds.width / 2
      const centerY = level3Bounds.y + level3Bounds.height / 2

      const elementAtPoint = await page.evaluate(
        ({ x, y }) => {
          const el = document.elementFromPoint(x, y)
          return el?.closest('[data-testid="level-3-dialog-content"]') !== null
        },
        { x: centerX, y: centerY }
      )

      expect(elementAtPoint).toBe(true)
    }
  })
})
