import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ToastCase', type: 'useCase' })
})

test.describe('toast focus and keyboard navigation', () => {
  test('should not interrupt natural tab order when no toasts exist', async ({ page }) => {
    await page.getByTestId('button-before').focus()

    await page.keyboard.press('Tab')

    await expect(page.getByTestId('button-after')).toBeFocused()

    await page.keyboard.press('Shift+Tab')

    await expect(page.getByTestId('button-before')).toBeFocused()
  })

  test('toasts are focusable via keyboard', async ({ page }) => {
    // add a toast
    await page.getByTestId('button-add-toast').click()
    await page.waitForTimeout(500)

    // toast should be visible
    const toast = page.locator('[role="status"]').first()
    await expect(toast).toBeVisible()

    // toast should be focusable
    await toast.focus()
    await expect(toast).toBeFocused()
  })

  test('escape key dismisses focused toast', async ({ page }) => {
    // add a toast
    await page.getByTestId('button-add-toast').click()
    await page.waitForTimeout(500)

    // focus the toast
    const toast = page.locator('[role="status"]').first()
    await toast.focus()
    await expect(toast).toBeFocused()

    // press escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    // toast should be gone
    const toasts = page.locator('[role="status"]')
    const count = await toasts.count()
    expect(count).toBe(0)
  })

  test('action button in toast is keyboard accessible', async ({ page }) => {
    // add a toast
    await page.getByTestId('button-add-toast').click()
    await page.waitForTimeout(500)

    // toast action button should be visible and focusable
    const actionButton = page.locator('[role="status"]').first().getByRole('button', { name: 'Action' })
    await expect(actionButton).toBeVisible()

    // should be able to focus the action button
    await actionButton.focus()
    await expect(actionButton).toBeFocused()
  })
})
