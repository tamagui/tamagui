import { test, expect } from '@playwright/test'

test.describe('Next Theme Provider', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/pages-example')
    await page.evaluate(() => localStorage.clear())
  })

  test('initial theme class is applied before hydration', async ({ page }) => {
    await page.goto('/pages-example')

    // Check that the theme script ran (document should have theme class)
    const themeClass = await page.evaluate(() => {
      const html = document.documentElement
      if (html.classList.contains('t_light')) return 't_light'
      if (html.classList.contains('t_dark')) return 't_dark'
      return null
    })

    expect(themeClass).toBeTruthy()
    console.log('Initial theme class:', themeClass)
  })

  test('theme persists after reload', async ({ page }) => {
    await page.goto('/pages-example')
    await page.waitForLoadState('networkidle')

    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('t_dark') ? 'dark' : 'light'
    })
    console.log('Initial theme:', initialTheme)

    // Click theme button to toggle
    const themeButton = page.locator('button:has-text("Theme")')
    await themeButton.waitFor({ state: 'visible' })
    await themeButton.click()
    await page.waitForTimeout(500)

    // Get new theme after click
    const afterClickTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('t_dark') ? 'dark' : 'light'
    })
    console.log('After click theme:', afterClickTheme)

    // Check what's in localStorage
    const storedValue = await page.evaluate(() => localStorage.getItem('theme'))
    console.log('localStorage theme:', storedValue)

    // Reload
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    // Check theme immediately after reload (before hydration completes)
    const afterReloadTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('t_dark') ? 'dark' : 'light'
    })
    console.log('After reload theme:', afterReloadTheme)

    // The theme after reload should match what we set
    expect(afterReloadTheme).toBe(afterClickTheme)
  })

  test('theme script sets correct class from localStorage', async ({ page }) => {
    // Pre-set localStorage to dark theme
    await page.goto('/pages-example')
    await page.evaluate(() => localStorage.setItem('theme', 'dark'))

    // Reload to trigger theme script
    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    // Check theme class immediately
    const themeClass = await page.evaluate(() => {
      const html = document.documentElement
      return {
        hasDark: html.classList.contains('t_dark'),
        hasLight: html.classList.contains('t_light'),
        classList: Array.from(html.classList),
      }
    })

    console.log('Theme class after reload with dark in localStorage:', themeClass)
    expect(themeClass.hasDark).toBe(true)
    expect(themeClass.hasLight).toBe(false)
  })

  test('no hydration mismatch errors', async ({ page }) => {
    const errors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/pages-example')
    await page.waitForLoadState('networkidle')

    const hydrationErrors = errors.filter(
      (err) => err.toLowerCase().includes('hydration') || err.toLowerCase().includes('mismatch')
    )

    console.log('All errors:', errors)
    console.log('Hydration errors:', hydrationErrors)

    expect(hydrationErrors).toHaveLength(0)
  })
})
