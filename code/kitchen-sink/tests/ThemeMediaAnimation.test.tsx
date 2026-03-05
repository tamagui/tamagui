import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// $theme-dark + animateOnly fix was intentionally reverted (80d70ce595)
test.skip()

test.describe('Theme Media + Animation', () => {
  test('$theme-dark bg applies when animated with motion driver', async ({ page }) => {
    await setupPage(page, {
      name: 'ThemeMediaAnimationCase',
      type: 'useCase',
      theme: 'dark',
      searchParams: { animationDriver: 'motion' },
    })

    const animatedBg = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="theme-media-animated"]')
      return el ? getComputedStyle(el).backgroundColor : null
    })

    const staticBg = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="theme-media-static"]')
      return el ? getComputedStyle(el).backgroundColor : null
    })

    // both should have the same background color in dark mode
    // ($theme-dark overrides bg to $color3)
    expect(animatedBg).toBeTruthy()
    expect(staticBg).toBeTruthy()
    expect(animatedBg).toBe(staticBg)
  })

  test('$theme-dark bg differs from light theme when animated', async ({ page }) => {
    // light theme
    await setupPage(page, {
      name: 'ThemeMediaAnimationCase',
      type: 'useCase',
      theme: 'light',
      searchParams: { animationDriver: 'motion' },
    })

    const lightBg = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="theme-media-animated"]')
      return el ? getComputedStyle(el).backgroundColor : null
    })

    // dark theme
    await setupPage(page, {
      name: 'ThemeMediaAnimationCase',
      type: 'useCase',
      theme: 'dark',
      searchParams: { animationDriver: 'motion' },
    })

    const darkBg = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="theme-media-animated"]')
      return el ? getComputedStyle(el).backgroundColor : null
    })

    // $theme-dark changes bg from $color1 to $color3, so they should differ
    expect(lightBg).toBeTruthy()
    expect(darkBg).toBeTruthy()
    expect(lightBg).not.toBe(darkBg)
  })
})
