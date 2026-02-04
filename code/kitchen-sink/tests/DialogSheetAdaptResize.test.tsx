import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Test for Dialog → Sheet content portaling on viewport resize
 *
 * This tests the fix for: When resizing from wide (Dialog) to narrow (Sheet via Adapt),
 * the Sheet appears empty because the portal content isn't properly transferred.
 */
test.describe('Dialog Sheet Adapt - viewport resize', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'DialogSheetAdaptResizeCase', type: 'useCase' })
  })

  test('content is visible in dialog at wide viewport', async ({ page }) => {
    // set viewport to wide (above maxMd breakpoint of 768px)
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.waitForTimeout(300)

    // open the dialog
    const trigger = page.getByTestId('open-dialog')
    await trigger.click({ force: true })
    await page.waitForTimeout(500)

    // dialog content should be visible
    const title = page.getByTestId('dialog-title')
    await expect(title).toBeVisible({ timeout: 5000 })

    const content = page.getByTestId('dialog-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // close button should work
    const closeButton = page.getByTestId('close-dialog')
    await closeButton.click({ force: true })
    await expect(title).not.toBeVisible({ timeout: 5000 })
  })

  test('content is visible in sheet at narrow viewport', async ({ page }) => {
    // set viewport to narrow (below maxMd breakpoint of 768px)
    await page.setViewportSize({ width: 600, height: 768 })
    await page.waitForTimeout(300)

    // open - should show as sheet due to adapt
    const trigger = page.getByTestId('open-dialog')
    await trigger.click({ force: true })
    await page.waitForTimeout(500)

    // sheet content should be visible
    const title = page.getByTestId('dialog-title')
    await expect(title).toBeVisible({ timeout: 5000 })

    const content = page.getByTestId('dialog-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // extra content should also be visible
    const extra1 = page.getByTestId('extra-content-1')
    await expect(extra1).toBeVisible({ timeout: 5000 })
  })

  test('content transfers from dialog to sheet on resize narrow', async ({ page }) => {
    // start at wide viewport
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.waitForTimeout(300)

    // open the dialog at wide width
    const trigger = page.getByTestId('open-dialog')
    await trigger.click({ force: true })
    await page.waitForTimeout(500)

    // verify content visible in dialog
    const title = page.getByTestId('dialog-title')
    await expect(title).toBeVisible({ timeout: 5000 })

    const content = page.getByTestId('dialog-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // resize to narrow - should adapt to sheet
    await page.setViewportSize({ width: 600, height: 768 })
    await page.waitForTimeout(500) // give time for adapt to trigger and animations

    // content should still be visible (now in sheet)
    await expect(title).toBeVisible({ timeout: 5000 })
    await expect(content).toBeVisible({ timeout: 5000 })

    // extra content should also be visible
    const extra1 = page.getByTestId('extra-content-1')
    await expect(extra1).toBeVisible({ timeout: 5000 })
  })

  test('content transfers from sheet to dialog on resize wide', async ({ page }) => {
    // start at narrow viewport
    await page.setViewportSize({ width: 600, height: 768 })
    await page.waitForTimeout(300)

    // open at narrow width - should show as sheet
    const trigger = page.getByTestId('open-dialog')
    await trigger.click({ force: true })
    await page.waitForTimeout(500)

    // verify content visible in sheet
    const title = page.getByTestId('dialog-title')
    await expect(title).toBeVisible({ timeout: 5000 })

    const content = page.getByTestId('dialog-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // resize to wide - should adapt back to dialog
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.waitForTimeout(500) // give time for adapt to trigger and animations

    // content should still be visible (now in dialog)
    await expect(title).toBeVisible({ timeout: 5000 })
    await expect(content).toBeVisible({ timeout: 5000 })

    // extra content should also be visible
    const extra1 = page.getByTestId('extra-content-1')
    await expect(extra1).toBeVisible({ timeout: 5000 })
  })

  test('multiple resize cycles preserve content', async ({ page }) => {
    // start wide
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.waitForTimeout(300)

    // open dialog
    const trigger = page.getByTestId('open-dialog')
    await trigger.click({ force: true })
    await page.waitForTimeout(500)

    const title = page.getByTestId('dialog-title')
    const content = page.getByTestId('dialog-content')

    // verify initial state
    await expect(title).toBeVisible({ timeout: 5000 })
    await expect(content).toBeVisible({ timeout: 5000 })

    // cycle 1: wide -> narrow
    await page.setViewportSize({ width: 600, height: 768 })
    await page.waitForTimeout(500)
    await expect(title).toBeVisible({ timeout: 5000 })
    await expect(content).toBeVisible({ timeout: 5000 })

    // cycle 1: narrow -> wide
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.waitForTimeout(500)
    await expect(title).toBeVisible({ timeout: 5000 })
    await expect(content).toBeVisible({ timeout: 5000 })

    // cycle 2: wide -> narrow
    await page.setViewportSize({ width: 600, height: 768 })
    await page.waitForTimeout(500)
    await expect(title).toBeVisible({ timeout: 5000 })
    await expect(content).toBeVisible({ timeout: 5000 })

    // cycle 2: narrow -> wide
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.waitForTimeout(500)
    await expect(title).toBeVisible({ timeout: 5000 })
    await expect(content).toBeVisible({ timeout: 5000 })
  })
})
