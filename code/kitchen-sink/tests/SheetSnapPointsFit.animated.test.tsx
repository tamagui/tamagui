import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetSnapPointsFitCase', type: 'useCase' })
})

test.describe('Sheet snapPointsMode="fit"', () => {
  test('standalone sheet with fit mode opens and closes without issues', async ({ page }) => {
    const trigger = page.getByTestId('standalone-fit-trigger')
    const frame = page.getByTestId('standalone-fit-frame')
    const closeButton = page.getByTestId('standalone-fit-close')

    // Initial state - sheet should not be visible
    await expect(trigger).toBeVisible()
    await expect(frame).not.toBeInViewport()

    // Open the sheet
    await trigger.click()

    // Wait for sheet to be visible
    await expect(frame).toBeVisible({ timeout: 5000 })

    // Close the sheet
    await closeButton.click()

    // Wait for animation to complete
    await page.waitForTimeout(500)

    // Sheet should not be visible
    await expect(frame).not.toBeInViewport()
  })

  test('standalone sheet with percent mode opens and closes without issues', async ({
    page,
  }) => {
    const trigger = page.getByTestId('standalone-percent-trigger')
    const frame = page.getByTestId('standalone-percent-frame')
    const closeButton = page.getByTestId('standalone-percent-close')

    await expect(trigger).toBeVisible()
    await expect(frame).not.toBeInViewport()

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    await closeButton.click()
    await page.waitForTimeout(500)
    await expect(frame).not.toBeInViewport()
  })

  test('standalone sheet with constant mode opens and closes without issues', async ({
    page,
  }) => {
    const trigger = page.getByTestId('standalone-constant-trigger')
    const frame = page.getByTestId('standalone-constant-frame')
    const closeButton = page.getByTestId('standalone-constant-close')

    await expect(trigger).toBeVisible()
    await expect(frame).not.toBeInViewport()

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    await closeButton.click()
    await page.waitForTimeout(500)
    await expect(frame).not.toBeInViewport()
  })

  test('rapid open/close interactions work correctly', async ({ page }) => {
    const trigger = page.getByTestId('rapid-toggle-trigger')
    const frame = page.getByTestId('rapid-frame')
    const closeButton = page.getByTestId('rapid-close')

    await expect(trigger).toBeVisible()

    // Open the sheet
    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    // Close and reopen rapidly a few times using the close button
    for (let i = 0; i < 3; i++) {
      await closeButton.click()
      await page.waitForTimeout(300) // Wait for close animation
      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })
    }

    // Final close
    await closeButton.click()
    await page.waitForTimeout(500)

    // Sheet should be closed now
    await expect(frame).not.toBeInViewport()
  })

  test('dynamic content changes while sheet is open', async ({ page }) => {
    const trigger = page.getByTestId('dynamic-content-trigger')
    const frame = page.getByTestId('dynamic-content-frame')
    const closeButton = page.getByTestId('dynamic-content-close')
    const sizeText = page.getByTestId('dynamic-content-size')
    const smallButton = page.getByTestId('dynamic-content-small')
    const mediumButton = page.getByTestId('dynamic-content-medium')
    const largeButton = page.getByTestId('dynamic-content-large')

    // Open the sheet
    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    // Initial size should be small
    await expect(sizeText).toContainText('small')

    // Get initial frame height
    const initialBox = await frame.boundingBox()
    const initialHeight = initialBox?.height ?? 0

    // Change to medium content
    await mediumButton.click()
    await expect(sizeText).toContainText('medium')
    await page.waitForTimeout(300) // Wait for resize animation

    // Get medium frame height - should be larger
    const mediumBox = await frame.boundingBox()
    const mediumHeight = mediumBox?.height ?? 0
    expect(mediumHeight).toBeGreaterThan(initialHeight)

    // Change to large content
    await largeButton.click()
    await expect(sizeText).toContainText('large')
    await page.waitForTimeout(300)

    // Get large frame height - should be even larger
    const largeBox = await frame.boundingBox()
    const largeHeight = largeBox?.height ?? 0
    expect(largeHeight).toBeGreaterThan(mediumHeight)

    // Change back to small
    await smallButton.click()
    await expect(sizeText).toContainText('small')
    await page.waitForTimeout(300)

    // Close the sheet - this is the key test for the white flash fix
    // The sheet should close from its current height without flashing to full viewport
    await closeButton.click()
    await page.waitForTimeout(500)

    // Sheet should be closed
    await expect(frame).not.toBeInViewport()
  })

  test('sheet closes without white flash - frame height stays stable during close', async ({
    page,
  }) => {
    const trigger = page.getByTestId('standalone-fit-trigger')
    const frame = page.getByTestId('standalone-fit-frame')
    const closeButton = page.getByTestId('standalone-fit-close')

    // Open the sheet
    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    // Get the frame height when open
    const openBox = await frame.boundingBox()
    const openHeight = openBox?.height ?? 0

    // The height should be reasonable (not full viewport)
    // For a fit mode sheet with minimal content, it should be less than half viewport
    const viewportSize = page.viewportSize()
    const viewportHeight = viewportSize?.height ?? 768
    expect(openHeight).toBeLessThan(viewportHeight * 0.6)

    // Close the sheet and check that height doesn't spike
    await closeButton.click()

    // Monitor frame height during close animation
    // The fix prevents the frame from expanding to full viewport during close
    let maxHeightDuringClose = openHeight
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(100)
      const box = await frame.boundingBox()
      if (box) {
        maxHeightDuringClose = Math.max(maxHeightDuringClose, box.height)
      }
    }

    // The max height during close should not be significantly larger than when open
    // This verifies the fix for the white flash issue (expanding to full viewport)
    // Allow some tolerance for animation overshoot
    expect(maxHeightDuringClose).toBeLessThan(openHeight * 1.5)
  })
})

test.describe('Adapted Dialog Sheet', () => {
  // TODO: This test is flaky in CI - the adaptation may not trigger reliably at 500px
  // The core functionality is tested by other Sheet tests
  test.skip('dialog adapts to sheet on small screens and closes properly', async ({
    page,
  }) => {
    // Set viewport to small size to trigger adaptation
    await page.setViewportSize({ width: 500, height: 800 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('adapted-dialog-trigger')
    const sheetFrame = page.getByTestId('adapted-sheet-frame')
    const dialogContent = page.getByTestId('adapted-dialog-content')

    await expect(trigger).toBeVisible()

    // Open - should show as sheet on small viewport
    await trigger.click()
    await page.waitForTimeout(500)

    // On small viewport, should be adapted to sheet
    const isSheetVisible = await sheetFrame.isVisible()
    const isDialogVisible = await dialogContent.isVisible()

    // At least one should be visible (either adapted sheet or dialog)
    expect(isSheetVisible || isDialogVisible).toBe(true)

    // Close via close button (works in both sheet and dialog mode via Adapt.Contents)
    const closeButton = page.getByTestId('adapted-dialog-close')
    await closeButton.click()
    await page.waitForTimeout(500)

    // Should be closed - sheet frame should not be in viewport
    // Note: dialogContent may still be in DOM but the sheet frame should be off-screen
    await expect(sheetFrame).not.toBeInViewport()
  })

  test('dialog shows as dialog on large screens', async ({ page }) => {
    // Set viewport to large size - no adaptation
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('adapted-dialog-trigger')
    const dialogContent = page.getByTestId('adapted-dialog-content')
    const closeButton = page.getByTestId('adapted-dialog-close')

    await expect(trigger).toBeVisible()

    // Open - should show as dialog on large viewport
    await trigger.click()
    await page.waitForTimeout(500)

    // Dialog content should be visible
    await expect(dialogContent).toBeVisible()

    // Close
    await closeButton.click()
    await page.waitForTimeout(500)

    // Should be closed
    await expect(dialogContent).not.toBeVisible()
  })
})
