import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ToastMultipleCase', type: 'useCase' })
})

test.describe('toast hover behavior', () => {
  test('maintains expanded state when mouse moves between toasts', async ({ page }) => {
    // create multiple toasts
    await page.getByTestId('toast-multiple').click()
    await page.waitForTimeout(1000)

    // get toaster container and toasts
    const toaster = page.locator('[data-y-position="bottom"]')
    const toasts = page.locator('[role="status"]')

    // verify we have multiple toasts
    const count = await toasts.count()
    expect(count).toBeGreaterThanOrEqual(3)

    // hover over first toast to expand
    const toast1Box = await toasts.nth(0).boundingBox()
    expect(toast1Box).not.toBeNull()

    // move mouse to first toast
    await page.mouse.move(toast1Box!.x + 50, toast1Box!.y + toast1Box!.height / 2)
    await page.waitForTimeout(400)

    // verify toasts are expanded
    const firstToast = toasts.first()
    await expect(firstToast).toHaveAttribute('data-expanded', 'true')

    // get positions of visible toasts for movement test (re-query after expand animation)
    const toast1BoxExpanded = await toasts.nth(0).boundingBox()
    const toast2BoxExpanded = await toasts.nth(1).boundingBox()
    expect(toast1BoxExpanded).not.toBeNull()
    expect(toast2BoxExpanded).not.toBeNull()

    // move mouse from first toast through gap to second toast
    // this is the critical test - the expand state should NOT flicker

    // start at first toast
    await page.mouse.move(toast1BoxExpanded!.x + 50, toast1BoxExpanded!.y + toast1BoxExpanded!.height / 2)
    await page.waitForTimeout(100)

    // move through the gap area (between toasts)
    const gapY = toast1BoxExpanded!.y - 7 // 7px above first toast (in the gap)
    await page.mouse.move(toast1BoxExpanded!.x + 50, gapY)
    await page.waitForTimeout(100)

    // verify still expanded (this would fail with the flicker bug)
    await expect(firstToast).toHaveAttribute('data-expanded', 'true')

    // continue to second toast
    await page.mouse.move(toast2BoxExpanded!.x + 50, toast2BoxExpanded!.y + toast2BoxExpanded!.height / 2)
    await page.waitForTimeout(100)

    // still expanded
    await expect(firstToast).toHaveAttribute('data-expanded', 'true')
  })

  test('collapses when mouse leaves toaster area', async ({ page }) => {
    // create multiple toasts
    await page.getByTestId('toast-multiple').click()
    await page.waitForTimeout(1000)

    const toasts = page.locator('[role="status"]')

    // hover over first toast to expand
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()
    await page.mouse.move(toastBox!.x + 50, toastBox!.y + toastBox!.height / 2)
    await page.waitForTimeout(400)

    // verify expanded
    const firstToast = toasts.first()
    await expect(firstToast).toHaveAttribute('data-expanded', 'true')

    // move mouse far away from toaster
    await page.mouse.move(100, 100)
    await page.waitForTimeout(400)

    // should be collapsed now
    await expect(firstToast).toHaveAttribute('data-expanded', 'false')
  })

  test('pauses auto-dismiss timer when hovering', async ({ page }) => {
    // show a single toast with short duration
    await page.getByTestId('toast-default').click()
    await page.waitForTimeout(400)

    const toasts = page.locator('[role="status"]')

    // verify toast exists
    await expect(toasts.first()).toBeVisible()

    // hover over the toast to pause timer
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()
    await page.mouse.move(toastBox!.x + 50, toastBox!.y + toastBox!.height / 2)

    // wait longer than default duration (4s) while hovering
    await page.waitForTimeout(5000)

    // toast should still be visible because timer is paused
    await expect(toasts.first()).toBeVisible()

    // move mouse away
    await page.mouse.move(100, 100)

    // wait for the full remaining duration + extra buffer
    // default is 4000ms, we hovered at 400ms so ~3600ms remains, plus buffer
    await page.waitForTimeout(5000)

    // toast should be gone now
    const count = await toasts.count()
    expect(count).toBe(0)
  })
})
