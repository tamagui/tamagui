import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for GitHub issue #3616: Select initial viewport position
 *
 * When a Select has a default value that's not the first item,
 * the dropdown viewport should scroll to show the selected item when opened.
 */

test.describe('Select initial scroll position', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectInitialScroll', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('Selected item is visible when dropdown opens', async ({ page }) => {
    const trigger = page.locator(`#${TEST_IDS.selectInitialScrollTrigger}`)
    await expect(trigger).toBeVisible()

    // Open the select
    await trigger.click()

    // Wait for the listbox to be visible
    const listbox = page.getByRole('listbox').first()
    await expect(listbox).toBeVisible({ timeout: 5000 })

    // The selected item (Papaya) should be visible in the viewport
    const selectedItem = page.locator(`#${TEST_IDS.selectInitialScrollItem}`)
    await expect(selectedItem).toBeVisible()

    // Check that the selected item is actually in view (not hidden by scroll)
    const isInViewport = await selectedItem.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const listboxRect = el.closest('[role="listbox"]')?.getBoundingClientRect()
      if (!listboxRect) return false

      // Check if the element is within the listbox's visible area
      return (
        rect.top >= listboxRect.top &&
        rect.bottom <= listboxRect.bottom
      )
    })

    expect(isInViewport).toBe(true)
  })

  test('Selected item has aria-selected attribute', async ({ page }) => {
    const trigger = page.locator(`#${TEST_IDS.selectInitialScrollTrigger}`)
    await trigger.click()

    const listbox = page.getByRole('listbox').first()
    await expect(listbox).toBeVisible({ timeout: 5000 })

    const selectedItem = page.locator(`#${TEST_IDS.selectInitialScrollItem}`)
    await expect(selectedItem).toHaveAttribute('aria-selected', 'true')
  })
})
