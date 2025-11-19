import { test, expect } from '@playwright/test'

test.describe('Bento production build', () => {
  test('should load /bento homepage without errors', async ({ page }) => {
    const errors: string[] = []
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    // Navigate to bento homepage
    const response = await page.goto('http://localhost:8081/bento', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Check response is OK
    expect(response?.status()).toBe(200)

    // Wait for heading to be visible
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 15000 })

    // Verify no page errors
    expect(errors).toHaveLength(0)

    // Check that main content is visible
    const body = await page.textContent('body')
    expect(body).toBeTruthy()
    expect(body).not.toContain('Error rendering')

    // Verify bento content is present (should have sections/categories)
    const bentoContent = page.locator('[class*="bento"], a[href*="/bento/"]')
    await expect(bentoContent.first()).toBeVisible({ timeout: 10000 })
  })

  test('should load /bento/forms/inputs component page', async ({ page }) => {
    const errors: string[] = []
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    // Navigate to specific bento component
    const response = await page.goto('http://localhost:8081/bento/forms/inputs', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Check response is OK
    expect(response?.status()).toBe(200)

    // Wait for heading
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 15000 })

    // Verify no page errors
    expect(errors).toHaveLength(0)

    // Check that the page shows Forms content
    const body = await page.textContent('body')
    expect(body).toBeTruthy()
    expect(body).not.toContain('Error rendering')

    // Verify breadcrumb or navigation shows we're in forms > inputs
    const pageContent = await page.textContent('body')
    const hasFormsContent =
      pageContent?.toLowerCase().includes('forms') ||
      pageContent?.toLowerCase().includes('input')
    expect(hasFormsContent).toBe(true)

    // Check for actual input components being rendered
    const inputs = page.locator('input, textarea, [role="textbox"]')
    const inputCount = await inputs.count()
    expect(inputCount).toBeGreaterThan(0)
  })

  test('should navigate from /bento to a component page', async ({ page }) => {
    // Start at bento homepage
    await page.goto('http://localhost:8081/bento', {
      waitUntil: 'load',
      timeout: 15000,
    })

    // Find a link to a bento component
    const bentoLinks = page.locator('a[href^="/bento/"]:not([href="/bento"])')
    await bentoLinks.first().waitFor({ timeout: 10000 })
    const linkCount = await bentoLinks.count()
    expect(linkCount).toBeGreaterThan(0)

    // Click the first bento component link
    const firstLink = bentoLinks.first()
    const href = await firstLink.getAttribute('href')

    await firstLink.click()

    // Wait for navigation
    await page.waitForURL(`**${href}`, { timeout: 15000 })

    // Verify we navigated to a component page
    const url = page.url()
    expect(url).toContain('/bento/')
    expect(url).not.toBe('http://localhost:8081/bento')

    // Verify content loaded
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible({ timeout: 10000 })
  })
})
