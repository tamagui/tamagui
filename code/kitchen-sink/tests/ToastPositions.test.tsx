import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ToastMultipleCase', type: 'useCase' })
})

test.describe('toast position verification', () => {
  test('top-center position shows toasts inside viewport', async ({ page }) => {
    // click top-center position button
    await page.getByRole('button', { name: 'top-center' }).click()
    await page.waitForTimeout(200)

    // show a toast
    await page.getByTestId('toast-default').click()
    await page.waitForTimeout(1000)

    const toasts = page.locator('[role="status"]')
    await expect(toasts.first()).toBeVisible()

    // verify toast is inside viewport (not cut off at top)
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()
    expect(toastBox!.y).toBeGreaterThanOrEqual(0)
  })

  test('top-right stacked toasts expand downward', async ({ page }) => {
    // click top-right position button
    await page.getByRole('button', { name: 'top-right' }).click()
    await page.waitForTimeout(200)

    // show multiple toasts
    await page.getByTestId('toast-multiple').click()
    await page.waitForTimeout(1000)

    const toasts = page.locator('[role="status"]')
    const count = await toasts.count()
    expect(count).toBeGreaterThanOrEqual(3)

    // hover to expand
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()
    await page.mouse.move(toastBox!.x + 50, toastBox!.y + toastBox!.height / 2)
    await page.waitForTimeout(500)

    // verify first toast is higher than subsequent toasts (expanded downward)
    const firstToastBox = await toasts.nth(0).boundingBox()
    const secondToastBox = await toasts.nth(1).boundingBox()
    expect(firstToastBox).not.toBeNull()
    expect(secondToastBox).not.toBeNull()
    expect(secondToastBox!.y).toBeGreaterThan(firstToastBox!.y)
  })

  test('bottom-right stacked toasts expand upward', async ({ page }) => {
    // default is bottom-right, show multiple toasts
    await page.getByTestId('toast-multiple').click()
    await page.waitForTimeout(1000)

    const toasts = page.locator('[role="status"]')
    const count = await toasts.count()
    expect(count).toBeGreaterThanOrEqual(3)

    // hover to expand
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()
    await page.mouse.move(toastBox!.x + 50, toastBox!.y + toastBox!.height / 2)
    await page.waitForTimeout(500)

    // verify first toast is lower than subsequent toasts (expanded upward)
    const firstToastBox = await toasts.nth(0).boundingBox()
    const secondToastBox = await toasts.nth(1).boundingBox()
    expect(firstToastBox).not.toBeNull()
    expect(secondToastBox).not.toBeNull()
    expect(secondToastBox!.y).toBeLessThan(firstToastBox!.y)
  })
})
