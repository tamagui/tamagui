import { expect, test } from '@playwright/test'

test.describe('Toast v2 Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // use CSS animation driver for proper exit animation support
    await page.goto('http://localhost:9000/?test=ToastMultipleCase&animationDriver=css')
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('visual: stacking collapses multiple toasts', async ({ page }) => {
    // start video recording by taking screenshots at key moments

    // add 4 toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(800) // wait for all toasts to appear

    // take screenshot of stacked toasts
    await page.screenshot({ path: '/tmp/toast-stacked.png', fullPage: true })

    // verify we have 4 toasts
    const toasts = await page.$$('[data-type]')
    expect(toasts.length).toBe(4)

    // verify front toast properties
    const frontToast = await page.$('[data-front="true"]')
    expect(frontToast).toBeTruthy()

    // verify stacking - toasts behind should have lower z-index
    const zIndices = await page.$$eval('[data-type]', els =>
      els.map(el => getComputedStyle(el).zIndex)
    )
    console.log('z-indices:', zIndices)

    // front toast should have highest z-index
    const frontZIndex = Number.parseInt(zIndices[0])
    expect(frontZIndex).toBeGreaterThanOrEqual(Number.parseInt(zIndices[1]))
  })

  test('visual: hover expands stacked toasts', async ({ page }) => {
    // add 4 toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(800)

    // screenshot before hover
    await page.screenshot({ path: '/tmp/toast-before-hover.png', fullPage: true })

    // hover over the toast area (bottom-right)
    const toaster = await page.$('[data-y-position="bottom"]')
    expect(toaster).toBeTruthy()
    await toaster!.hover()

    await page.waitForTimeout(300) // wait for expand animation

    // screenshot after hover
    await page.screenshot({ path: '/tmp/toast-after-hover.png', fullPage: true })

    // check that toasts are now expanded (data-expanded should be true)
    const expandedToasts = await page.$$('[data-expanded="true"]')
    expect(expandedToasts.length).toBeGreaterThan(0)
  })

  test('visual: toast shows proper type icons', async ({ page }) => {
    // click each type button and verify icon
    const types = ['success', 'error', 'warning', 'info', 'loading']

    for (const type of types) {
      // dismiss all first
      await page.click('[data-testid="toast-dismiss-all"]')
      await page.waitForTimeout(300)

      // click the type button
      await page.click(`[data-testid="toast-${type}"]`)
      await page.waitForTimeout(300)

      // verify toast appears with correct type
      const toast = await page.$(`[data-type="${type}"]`)
      expect(toast).toBeTruthy()
    }

    // take final screenshot with loading toast visible
    await page.screenshot({ path: '/tmp/toast-types.png', fullPage: true })
  })

  test('visual: swipe to dismiss works', async ({ page }) => {
    // add a toast
    await page.click('[data-testid="toast-default"]')
    await page.waitForSelector('[data-type="default"]', { timeout: 5000 })

    // get toast position
    const toast = await page.$('[data-type="default"]')
    const box = await toast!.boundingBox()
    expect(box).toBeTruthy()

    // screenshot before swipe
    await page.screenshot({ path: '/tmp/toast-before-swipe.png', fullPage: true })

    // perform swipe gesture (drag from center to right)
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width + 100, box!.y + box!.height / 2, { steps: 10 })
    await page.mouse.up()

    await page.waitForTimeout(500) // wait for dismiss animation

    // screenshot after swipe
    await page.screenshot({ path: '/tmp/toast-after-swipe.png', fullPage: true })

    // verify toast is gone
    const toastsAfter = await page.$$('[data-type="default"]')
    expect(toastsAfter.length).toBe(0)
  })

  test('visual: close button dismisses toast', async ({ page }) => {
    // add a toast
    await page.click('[data-testid="toast-success"]')
    await page.waitForSelector('[data-type="success"]', { timeout: 5000 })

    // click close button
    const closeButton = await page.$('[aria-label="Close toast"]')
    expect(closeButton).toBeTruthy()
    await closeButton!.click()

    await page.waitForTimeout(300) // wait for dismiss animation

    // verify toast is gone
    const toastsAfter = await page.$$('[data-type="success"]')
    expect(toastsAfter.length).toBe(0)
  })
})
