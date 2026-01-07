import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for GitHub issue #3627: Select RTL positioning
 *
 * When the document direction is set to RTL dynamically,
 * the Select.Content should be positioned correctly on first open.
 *
 * The main bug was that on FIRST open after switching to RTL, the dropdown
 * was positioned way off-screen or at the wrong location. On second open
 * it would be correct.
 */

test.describe('Select RTL positioning', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectRTL', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('Select content is visible and in viewport after switching to RTL', async ({ page }) => {
    const trigger = page.locator(`#${TEST_IDS.selectRTLTrigger}`)
    const rtlButton = page.locator(`#${TEST_IDS.selectRTLToggle}`)

    await expect(trigger).toBeVisible()
    await expect(rtlButton).toBeVisible()

    // Switch to RTL
    await rtlButton.click()
    await page.waitForTimeout(200)

    // Verify the document direction changed
    const htmlDir = await page.evaluate(() => document.documentElement.dir)
    expect(htmlDir).toBe('rtl')

    // Open the select
    await trigger.click()

    // Wait for the listbox to be visible
    const listbox = page.getByRole('listbox').first()
    await expect(listbox).toBeVisible({ timeout: 5000 })

    // Get positions
    const listboxBox = await listbox.boundingBox()
    expect(listboxBox).not.toBeNull()
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).not.toBeNull()

    const viewportSize = page.viewportSize()
    expect(viewportSize).not.toBeNull()

    // Key assertions:
    // 1. Listbox should be visible (within viewport)
    expect(listboxBox!.x).toBeGreaterThanOrEqual(-10) // Allow small overflow
    expect(listboxBox!.x + listboxBox!.width).toBeLessThanOrEqual(viewportSize!.width + 50)

    // 2. Listbox should be vertically positioned near the trigger
    // (below or above it, not completely elsewhere)
    const verticalDistance = Math.abs(listboxBox!.y - triggerBox!.y)
    expect(verticalDistance).toBeLessThan(500) // Should be relatively close vertically

    // 3. Listbox horizontal position should overlap with trigger area
    // (not way off to one side)
    const triggerCenter = triggerBox!.x + triggerBox!.width / 2
    const listboxLeft = listboxBox!.x
    const listboxRight = listboxBox!.x + listboxBox!.width

    // The trigger center should be within or near the listbox horizontal bounds
    const horizontallyReasonable =
      triggerCenter >= listboxLeft - 50 && triggerCenter <= listboxRight + 50
    expect(horizontallyReasonable).toBe(true)
  })

  test('Select content positions consistently on first and second open in RTL', async ({ page }) => {
    const trigger = page.locator(`#${TEST_IDS.selectRTLTrigger}`)
    const rtlButton = page.locator(`#${TEST_IDS.selectRTLToggle}`)

    await expect(trigger).toBeVisible()

    // Switch to RTL first
    await rtlButton.click()
    await page.waitForTimeout(200)

    // First open
    await trigger.click()

    const listbox = page.getByRole('listbox').first()
    await expect(listbox).toBeVisible({ timeout: 5000 })

    const firstOpenBox = await listbox.boundingBox()
    expect(firstOpenBox).not.toBeNull()

    // Close by pressing Escape
    await page.keyboard.press('Escape')
    await expect(listbox).not.toBeVisible({ timeout: 3000 })

    // Second open
    await trigger.click()
    await expect(listbox).toBeVisible({ timeout: 5000 })

    const secondOpenBox = await listbox.boundingBox()
    expect(secondOpenBox).not.toBeNull()

    // The positions should be the same (or very close) on first and second open
    // The bug was that first open was wrong, second was correct
    const xDiff = Math.abs(firstOpenBox!.x - secondOpenBox!.x)
    const yDiff = Math.abs(firstOpenBox!.y - secondOpenBox!.y)

    // Allow for minor rendering differences (10px tolerance)
    expect(xDiff).toBeLessThan(10)
    expect(yDiff).toBeLessThan(10)
  })
})
