import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ToastMultipleCase', type: 'useCase' })
})

test.describe('toast action buttons', () => {
  test('action buttons render correctly without overlap', async ({ page }) => {
    // show toast with action + cancel
    await page.getByRole('button', { name: 'With Action + Cancel' }).click()
    await page.waitForTimeout(500)

    const toast = page.locator('[role="status"]').first()
    await expect(toast).toBeVisible()

    // take screenshot to verify buttons look correct
    await page.screenshot({ path: 'test-results/toast-action-buttons.png', fullPage: true })

    // verify both buttons are visible
    const cancelButton = toast.getByRole('button', { name: 'Cancel' })
    const confirmButton = toast.getByRole('button', { name: 'Confirm' })

    await expect(cancelButton).toBeVisible()
    await expect(confirmButton).toBeVisible()

    // verify buttons don't overlap (confirm should be to the right of cancel)
    const cancelBox = await cancelButton.boundingBox()
    const confirmBox = await confirmButton.boundingBox()

    expect(cancelBox).not.toBeNull()
    expect(confirmBox).not.toBeNull()

    // confirm button should start after cancel button ends (no overlap)
    expect(confirmBox!.x).toBeGreaterThan(cancelBox!.x + cancelBox!.width - 5) // allow 5px overlap tolerance
  })
})
