import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for GitHub issue #3628: Select doesn't close when selecting same item
 *
 * On touch devices, selecting the same item that is already selected should
 * close the dropdown. The bug causes the dropdown to remain open.
 *
 * These tests use page.touchscreen.tap() which requires hasTouch: true.
 * We enable touch simulation at the context level.
 */

test.describe('Select same item on touch devices', () => {
  test('Selecting the same item closes the dropdown on touch', async ({ browser }) => {
    // Create a new context with touch enabled for proper touch simulation
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 }, // iPhone-like viewport
    })
    const page = await context.newPage()

    try {
      await page.goto('http://localhost:9000/?test=SelectSameItem&type=useCase')
      await page.waitForLoadState('networkidle')

      const trigger = page.locator(`#${TEST_IDS.selectSameItemTrigger}`)
      await expect(trigger).toBeVisible()

      // Get trigger position for tap
      const triggerBox = await trigger.boundingBox()
      expect(triggerBox).not.toBeNull()

      // Use touchscreen.tap() for authentic touch interaction
      await page.touchscreen.tap(
        triggerBox!.x + triggerBox!.width / 2,
        triggerBox!.y + triggerBox!.height / 2
      )

      // Wait for the listbox to be visible (Select renders content in a portal)
      const listbox = page.getByRole('listbox').first()
      await expect(listbox).toBeVisible({ timeout: 5000 })

      // Apple is already selected (initial value), find it
      const appleItem = page.locator(`#${TEST_IDS.selectSameItemApple}`)
      await expect(appleItem).toBeVisible()

      // Get the bounding box for tap coordinates
      const appleBox = await appleItem.boundingBox()
      expect(appleBox).not.toBeNull()

      // Use touchscreen.tap() for authentic touch on the already-selected item
      // Note: tap() only fires touchstart/touchend, so we also dispatch click
      // to simulate the browser's synthesized click after touch
      await page.touchscreen.tap(
        appleBox!.x + appleBox!.width / 2,
        appleBox!.y + appleBox!.height / 2
      )
      // Dispatch the click event that browsers synthesize after touch
      await appleItem.dispatchEvent('click')

      // Wait for state updates - the dropdown should close
      await page.waitForTimeout(300)

      // The dropdown should now be closed
      await expect(listbox).not.toBeVisible({ timeout: 3000 })
    } finally {
      await context.close()
    }
  })

  test('Selecting a different item works normally on touch', async ({ browser }) => {
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
    })
    const page = await context.newPage()

    try {
      await page.goto('http://localhost:9000/?test=SelectSameItem&type=useCase')
      await page.waitForLoadState('networkidle')

      const trigger = page.locator(`#${TEST_IDS.selectSameItemTrigger}`)
      await expect(trigger).toBeVisible()

      // Get trigger position for tap
      const triggerBox = await trigger.boundingBox()
      expect(triggerBox).not.toBeNull()

      // Tap to open the select
      await page.touchscreen.tap(
        triggerBox!.x + triggerBox!.width / 2,
        triggerBox!.y + triggerBox!.height / 2
      )

      // Wait for listbox
      const listbox = page.getByRole('listbox').first()
      await expect(listbox).toBeVisible({ timeout: 5000 })

      // Select banana (different from initial apple)
      const bananaItem = page.locator(`#${TEST_IDS.selectSameItemBanana}`)
      await expect(bananaItem).toBeVisible()

      // Get the bounding box for tap coordinates
      const bananaBox = await bananaItem.boundingBox()
      expect(bananaBox).not.toBeNull()

      // Tap on banana and dispatch click
      await page.touchscreen.tap(
        bananaBox!.x + bananaBox!.width / 2,
        bananaBox!.y + bananaBox!.height / 2
      )
      await bananaItem.dispatchEvent('click')

      // Wait for state updates
      await page.waitForTimeout(300)

      // The dropdown should close
      await expect(listbox).not.toBeVisible({ timeout: 3000 })

      // The trigger should now show "Banana"
      await expect(trigger).toContainText('Banana')
    } finally {
      await context.close()
    }
  })

  test('Opening and closing works with consecutive taps', async ({ browser }) => {
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
    })
    const page = await context.newPage()

    try {
      await page.goto('http://localhost:9000/?test=SelectSameItem&type=useCase')
      await page.waitForLoadState('networkidle')

      const trigger = page.locator(`#${TEST_IDS.selectSameItemTrigger}`)
      await expect(trigger).toBeVisible()

      const triggerBox = await trigger.boundingBox()
      expect(triggerBox).not.toBeNull()

      // First tap - open
      await page.touchscreen.tap(
        triggerBox!.x + triggerBox!.width / 2,
        triggerBox!.y + triggerBox!.height / 2
      )

      const listbox = page.getByRole('listbox').first()
      await expect(listbox).toBeVisible({ timeout: 5000 })

      // Tap the selected item
      const appleItem = page.locator(`#${TEST_IDS.selectSameItemApple}`)
      const appleBox = await appleItem.boundingBox()
      expect(appleBox).not.toBeNull()

      await page.touchscreen.tap(
        appleBox!.x + appleBox!.width / 2,
        appleBox!.y + appleBox!.height / 2
      )
      await appleItem.dispatchEvent('click')

      await page.waitForTimeout(300)
      await expect(listbox).not.toBeVisible({ timeout: 3000 })

      // Re-open and verify it works again
      // Need to get fresh bounding box since UI may have shifted
      const newTriggerBox = await trigger.boundingBox()
      expect(newTriggerBox).not.toBeNull()

      await page.touchscreen.tap(
        newTriggerBox!.x + newTriggerBox!.width / 2,
        newTriggerBox!.y + newTriggerBox!.height / 2
      )

      await expect(listbox).toBeVisible({ timeout: 5000 })
    } finally {
      await context.close()
    }
  })
})

// Test desktop/mouse behavior separately
test.describe('Select same item with mouse', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectSameItem', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('Regular click on same item closes the dropdown', async ({ page }) => {
    const trigger = page.locator(`#${TEST_IDS.selectSameItemTrigger}`)
    await expect(trigger).toBeVisible()

    // Open the select
    await trigger.click()

    // Wait for listbox
    const listbox = page.getByRole('listbox').first()
    await expect(listbox).toBeVisible({ timeout: 5000 })

    // Apple is already selected, click it again
    const appleItem = page.locator(`#${TEST_IDS.selectSameItemApple}`)
    await expect(appleItem).toBeVisible()
    await appleItem.click()

    // The dropdown should close
    await expect(listbox).not.toBeVisible()
  })
})
