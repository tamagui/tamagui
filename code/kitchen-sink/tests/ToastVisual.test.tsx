import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ToastMultipleCase', type: 'useCase' })
})

test.describe('toast visual verification', () => {
  test('collapsed stack appearance', async ({ page }) => {
    // create multiple toasts
    await page.getByTestId('toast-multiple').click()
    await page.waitForTimeout(1000)

    // take screenshot of collapsed state
    await page.screenshot({ path: 'test-results/toast-collapsed.png', fullPage: true })

    const toasts = page.locator('[role="status"]')
    const count = await toasts.count()
    expect(count).toBeGreaterThanOrEqual(3)

    // verify collapsed state
    await expect(toasts.first()).toHaveAttribute('data-expanded', 'false')
  })

  test('expanded stack appearance', async ({ page }) => {
    // create multiple toasts
    await page.getByTestId('toast-multiple').click()
    await page.waitForTimeout(1000)

    const toasts = page.locator('[role="status"]')

    // hover to expand
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()
    await page.mouse.move(toastBox!.x + 50, toastBox!.y + toastBox!.height / 2)
    await page.waitForTimeout(500)

    // take screenshot of expanded state
    await page.screenshot({ path: 'test-results/toast-expanded.png', fullPage: true })

    // verify expanded state
    await expect(toasts.first()).toHaveAttribute('data-expanded', 'true')
  })

  test('swipe to dismiss works', async ({ page }) => {
    // show a toast
    await page.getByTestId('toast-default').click()
    await page.waitForTimeout(500)

    const toasts = page.locator('[role="status"]')
    await expect(toasts.first()).toBeVisible()

    // get toast position
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()

    // swipe right to dismiss
    const startX = toastBox!.x + 50
    const startY = toastBox!.y + toastBox!.height / 2
    const endX = startX + 200 // swipe 200px right

    // perform swipe
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(endX, startY, { steps: 10 })
    await page.mouse.up()

    // wait for dismiss animation
    await page.waitForTimeout(500)

    // toast should be gone
    const count = await toasts.count()
    expect(count).toBe(0)
  })

  test('swipe resistance in wrong direction', async ({ page }) => {
    // show a toast
    await page.getByTestId('toast-default').click()
    await page.waitForTimeout(500)

    const toasts = page.locator('[role="status"]')
    await expect(toasts.first()).toBeVisible()

    // get toast position
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()

    // try to swipe left (wrong direction - default swipe is right)
    const startX = toastBox!.x + 150
    const startY = toastBox!.y + toastBox!.height / 2
    const endX = startX - 100 // swipe 100px left

    // perform swipe
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(endX, startY, { steps: 10 })

    // take screenshot during swipe to show resistance
    await page.screenshot({ path: 'test-results/toast-swipe-resist.png', fullPage: true })

    await page.mouse.up()

    // wait a bit
    await page.waitForTimeout(300)

    // toast should still be there (swipe was resisted)
    await expect(toasts.first()).toBeVisible()
  })
})
