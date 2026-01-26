import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ToastMultipleCase', type: 'useCase' })
})

test.describe('toast interrupt behavior', () => {
  test('toast closing does not interrupt on mouse re-entry', async ({ page }) => {
    // show a toast
    await page.getByTestId('toast-default').click()
    await page.waitForTimeout(300)

    const toasts = page.locator('[role="status"]')
    await expect(toasts.first()).toBeVisible()

    // hover over toast
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()
    await page.mouse.move(toastBox!.x + 50, toastBox!.y + toastBox!.height / 2)
    await page.waitForTimeout(100)

    // move away to start auto-close timer
    await page.mouse.move(100, 100)

    // wait for auto-close timer to be most of the way done
    await page.waitForTimeout(3500)

    // move mouse back over toast (timer should be nearly done)
    await page.mouse.move(toastBox!.x + 50, toastBox!.y + toastBox!.height / 2)
    await page.waitForTimeout(100)

    // toast should still be visible since timer paused on hover
    await expect(toasts.first()).toBeVisible()

    // move away again
    await page.mouse.move(100, 100)

    // wait for remaining timer + buffer
    await page.waitForTimeout(1000)

    // toast should now be gone
    const count = await toasts.count()
    expect(count).toBe(0)
  })

  test('drag gesture moves toast visually', async ({ page }) => {
    // show a toast
    await page.getByTestId('toast-default').click()
    await page.waitForTimeout(500)

    const toasts = page.locator('[role="status"]')
    await expect(toasts.first()).toBeVisible()

    // get initial position
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()

    // start drag
    const startX = toastBox!.x + 50
    const startY = toastBox!.y + toastBox!.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()

    // drag partway right SLOWLY (many steps = low velocity)
    // this ensures we don't trigger velocity-based dismiss
    await page.mouse.move(startX + 25, startY, { steps: 30 })
    await page.waitForTimeout(100) // add delay to ensure low velocity

    // take screenshot during drag
    await page.screenshot({ path: 'test-results/toast-drag-mid.png', fullPage: true })

    // release without reaching threshold (50px) or velocity
    await page.mouse.up()
    await page.waitForTimeout(500)

    // toast should snap back and still be visible
    await expect(toasts.first()).toBeVisible()
  })

  test('fast swipe dismisses toast via velocity', async ({ page }) => {
    // show a toast
    await page.getByTestId('toast-default').click()
    await page.waitForTimeout(500)

    const toasts = page.locator('[role="status"]')
    await expect(toasts.first()).toBeVisible()

    // get position
    const toastBox = await toasts.first().boundingBox()
    expect(toastBox).not.toBeNull()

    // fast swipe - short distance but high velocity
    const startX = toastBox!.x + 50
    const startY = toastBox!.y + toastBox!.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()
    // fast swipe: 35px in one step (below 50px threshold but fast)
    await page.mouse.move(startX + 35, startY, { steps: 1 })
    await page.mouse.up()

    // wait for dismiss animation
    await page.waitForTimeout(500)

    // toast should be gone due to velocity-based dismiss
    const count = await toasts.count()
    expect(count).toBe(0)
  })
})
