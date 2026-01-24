import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SelectStopPropagation', type: 'useCase' })
})

test(`selecting an item should not trigger click on element behind viewport`, async ({ page }) => {
  const trigger = page.locator('#select-trigger')
  const buttonStatus = page.locator('#button-status')
  const selectedValue = page.locator('#selected-value')

  await trigger.waitFor({ state: 'visible' })

  // Verify initial state
  await expect(buttonStatus).toContainText('Background button clicked: no')
  await expect(selectedValue).toContainText('Selected: none')

  // Open the select
  await trigger.click()

  // Wait for viewport to be visible
  const appleItem = page.locator('#select-item-apple')
  await appleItem.waitFor({ state: 'visible' })

  // Click an item (which is positioned over the background button)
  await appleItem.click()

  // Wait for state changes
  await page.waitForTimeout(100)

  // The item should be selected
  await expect(selectedValue).toContainText('Selected: apple')

  // The background button should NOT have been clicked
  await expect(buttonStatus).toContainText('Background button clicked: no')
})
