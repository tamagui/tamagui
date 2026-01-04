import { test, expect } from '@playwright/test'

test.describe('Next Theme Provider (Turbopack)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('initial theme class is applied', async ({ page }) => {
    await page.goto('/')

    const themeClass = await page.evaluate(() => {
      const html = document.documentElement
      if (html.classList.contains('t_light')) return 't_light'
      if (html.classList.contains('t_dark')) return 't_dark'
      return null
    })

    expect(themeClass).toBeTruthy()
    console.log('Initial theme class:', themeClass)
  })

  test('theme switching works', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('t_dark') ? 'dark' : 'light'
    })
    console.log('Initial theme:', initialTheme)

    // Click dark button
    await page.locator('button:has-text("Dark")').click()
    await page.waitForTimeout(300)

    const afterDarkClick = await page.evaluate(() => {
      return document.documentElement.classList.contains('t_dark') ? 'dark' : 'light'
    })
    console.log('After Dark click:', afterDarkClick)
    expect(afterDarkClick).toBe('dark')

    // Click light button
    await page.locator('button:has-text("Light")').click()
    await page.waitForTimeout(300)

    const afterLightClick = await page.evaluate(() => {
      return document.documentElement.classList.contains('t_dark') ? 'dark' : 'light'
    })
    console.log('After Light click:', afterLightClick)
    expect(afterLightClick).toBe('light')
  })

  test('theme persists in localStorage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Set dark theme
    await page.locator('button:has-text("Dark")').click()
    await page.waitForTimeout(300)

    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'))
    console.log('Stored theme:', storedTheme)
    expect(storedTheme).toBe('dark')
  })

  test('theme persists after reload', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('theme', 'dark'))

    await page.reload()
    await page.waitForLoadState('domcontentloaded')

    const themeClass = await page.evaluate(() => {
      return {
        hasDark: document.documentElement.classList.contains('t_dark'),
        hasLight: document.documentElement.classList.contains('t_light'),
        classList: Array.from(document.documentElement.classList),
      }
    })

    console.log('Theme class after reload:', themeClass)
    expect(themeClass.hasDark).toBe(true)
    expect(themeClass.hasLight).toBe(false)
  })

  test('no hydration errors', async ({ page }) => {
    const errors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const hydrationErrors = errors.filter(
      (err) => err.toLowerCase().includes('hydration') || err.toLowerCase().includes('mismatch')
    )

    console.log('All errors:', errors)
    expect(hydrationErrors).toHaveLength(0)
  })
})
