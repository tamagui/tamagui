import { expect, test } from '@playwright/test'

test.describe('toast demo verification', () => {
  test('toast demo renders and shows toasts in kitchen-sink', async ({ page }) => {
    // Test against kitchen-sink demo page
    await page.goto('http://localhost:9000/?demo=Toast', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    // Take initial screenshot
    await page.screenshot({ path: 'test-results/toast-demo-initial.png', fullPage: true })

    // Click success button
    const successBtn = page.getByRole('button', { name: 'Success' })
    await expect(successBtn).toBeVisible()
    await successBtn.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/toast-demo-success.png', fullPage: true })

    // Verify toast appeared
    const toast = page.locator('[role="status"]').first()
    await expect(toast).toBeVisible()

    // Click error button
    const errorBtn = page.getByRole('button', { name: 'Error' })
    await errorBtn.click()
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/toast-demo-stacked.png', fullPage: true })

    // Verify multiple toasts visible
    const toasts = page.locator('[role="status"]')
    const count = await toasts.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('top positions render toasts inside viewport', async ({ page }) => {
    await page.goto('http://localhost:9000/?demo=Toast', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)

    // Change to top-center position
    const topCenterBtn = page.getByRole('button', { name: 'top-center' })
    await topCenterBtn.click()
    await page.waitForTimeout(200)

    // Show a toast
    const defaultBtn = page.getByRole('button', { name: 'Default' })
    await defaultBtn.click()
    await page.waitForTimeout(500)

    // Verify toast is visible in viewport (y >= 0)
    const toast = page.locator('[role="status"]').first()
    const toastBox = await toast.boundingBox()
    expect(toastBox).toBeTruthy()
    expect(toastBox!.y).toBeGreaterThanOrEqual(0)
    console.log('Toast top position verified:', toastBox)
  })
})
