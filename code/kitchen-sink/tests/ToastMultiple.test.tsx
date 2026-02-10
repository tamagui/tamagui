import { expect, test } from '@playwright/test'

// single test run with CSS driver (no need to run with all drivers for this test)
test.describe('Toast v2 API', () => {
  test.beforeEach(async ({ page }) => {
    // use CSS animation driver for proper exit animation support
    await page.goto('http://localhost:7979/?test=ToastMultipleCase&animationDriver=css')
    // wait for app to load
    await page.waitForSelector('[data-testid="toast-default"]', { timeout: 10000 })
  })

  test('shows default toast when clicking Default button', async ({ page }) => {
    await page.click('[data-testid="toast-default"]')

    // wait for toast to appear
    const toast = await page.waitForSelector('[role="status"]', { timeout: 5000 })
    expect(toast).toBeTruthy()

    // check toast content
    const toastText = await toast.textContent()
    expect(toastText).toContain('This is a default toast')
  })

  test('shows success toast with correct icon', async ({ page }) => {
    await page.click('[data-testid="toast-success"]')

    const toast = await page.waitForSelector('[data-type="success"]', { timeout: 5000 })
    expect(toast).toBeTruthy()

    const toastText = await toast.textContent()
    expect(toastText).toContain('Operation completed successfully')
  })

  test('shows error toast', async ({ page }) => {
    await page.click('[data-testid="toast-error"]')

    const toast = await page.waitForSelector('[data-type="error"]', { timeout: 5000 })
    expect(toast).toBeTruthy()
  })

  test('shows warning toast', async ({ page }) => {
    await page.click('[data-testid="toast-warning"]')

    const toast = await page.waitForSelector('[data-type="warning"]', { timeout: 5000 })
    expect(toast).toBeTruthy()
  })

  test('shows info toast', async ({ page }) => {
    await page.click('[data-testid="toast-info"]')

    const toast = await page.waitForSelector('[data-type="info"]', { timeout: 5000 })
    expect(toast).toBeTruthy()
  })

  test('shows loading toast', async ({ page }) => {
    await page.click('[data-testid="toast-loading"]')

    const toast = await page.waitForSelector('[data-type="loading"]', { timeout: 5000 })
    expect(toast).toBeTruthy()
  })

  test('shows toast with description', async ({ page }) => {
    await page.click('[data-testid="toast-with-desc"]')

    const toast = await page.waitForSelector('[role="status"]', { timeout: 5000 })
    expect(toast).toBeTruthy()

    const toastText = await toast.textContent()
    expect(toastText).toContain('File uploaded')
    expect(toastText).toContain('Your file has been uploaded to the cloud')
  })

  test('shows multiple toasts stacked', async ({ page }) => {
    await page.click('[data-testid="toast-multiple"]')

    // wait for all 4 toasts to appear (they have staggered delays)
    await page.waitForTimeout(1000)

    const toasts = await page.$$('[role="status"]')
    expect(toasts.length).toBeGreaterThanOrEqual(4)

    // check front toast has data-front="true"
    const frontToast = await page.$('[data-front="true"]')
    expect(frontToast).toBeTruthy()
  })

  test('dismiss all toasts', async ({ page }) => {
    // first add some toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(1000)

    // verify toasts exist
    let toasts = await page.$$('[role="status"]')
    expect(toasts.length).toBeGreaterThanOrEqual(1)

    // dismiss all
    await page.click('[data-testid="toast-dismiss-all"]')

    // wait for animation
    await page.waitForTimeout(500)

    // verify all toasts are gone
    toasts = await page.$$('[role="status"]')
    expect(toasts.length).toBe(0)
  })

  test('toast with action button', async ({ page }) => {
    await page.click('[data-testid="toast-action"]')

    const toast = await page.waitForSelector('[role="status"]', { timeout: 5000 })
    expect(toast).toBeTruthy()

    // look for action button
    const actionButton = await toast.$('button')
    expect(actionButton).toBeTruthy()
  })

  test('promise toast transitions from loading to success', async ({ page }) => {
    await page.click('[data-testid="toast-promise-success"]')

    // should show loading first
    const loadingToast = await page.waitForSelector('[data-type="loading"]', {
      timeout: 5000,
    })
    expect(loadingToast).toBeTruthy()

    // wait for promise to resolve (2s + some buffer)
    await page.waitForTimeout(2500)

    // should show success
    const successToast = await page.$('[data-type="success"]')
    expect(successToast).toBeTruthy()
  })

  test('promise toast transitions from loading to error', async ({ page }) => {
    await page.click('[data-testid="toast-promise-error"]')

    // should show loading first
    const loadingToast = await page.waitForSelector('[data-type="loading"]', {
      timeout: 5000,
    })
    expect(loadingToast).toBeTruthy()

    // wait for promise to reject (2s + some buffer)
    await page.waitForTimeout(2500)

    // should show error
    const errorToast = await page.$('[data-type="error"]')
    expect(errorToast).toBeTruthy()
  })

  test('toast can be updated with same id', async ({ page }) => {
    await page.click('[data-testid="toast-update"]')

    // should show loading first
    const loadingToast = await page.waitForSelector('[data-type="loading"]', {
      timeout: 5000,
    })
    expect(loadingToast).toBeTruthy()

    // wait for update (2s + some buffer)
    await page.waitForTimeout(2500)

    // should show success
    const successToast = await page.$('[data-type="success"]')
    expect(successToast).toBeTruthy()
  })
})
