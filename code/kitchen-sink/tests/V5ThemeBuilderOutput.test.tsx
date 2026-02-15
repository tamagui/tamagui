import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  // Use generatedV5 to test with the actual theme builder output
  await setupPage(page, {
    name: 'V5ThemeBuilderOutput',
    type: 'useCase',
    searchParams: { generatedV5: 'true' },
  })
})

test('renders base light and dark theme buttons', async ({ page }) => {
  const lightButton = page.getByTestId('button-light')
  const darkButton = page.getByTestId('button-dark')

  await expect(lightButton).toBeVisible()
  await expect(darkButton).toBeVisible()

  const lightStyles = await getStyles(lightButton)
  const darkStyles = await getStyles(darkButton)
  expect(lightStyles.backgroundColor).toBeDefined()
  expect(darkStyles.backgroundColor).toBeDefined()
})

test('renders accent theme buttons with correct colors (not gray)', async ({ page }) => {
  const accentLight = page.getByTestId('button-accent-light')
  const accentDark = page.getByTestId('button-accent-dark')

  await expect(accentLight).toBeVisible()
  await expect(accentDark).toBeVisible()

  const lightStyles = await getStyles(accentLight)
  const darkStyles = await getStyles(accentDark)
  expect(lightStyles.backgroundColor).toBeDefined()
  expect(darkStyles.backgroundColor).toBeDefined()

  // Accent palette uses purple (hue 250) — verify buttons aren't gray
  const isPurple = (color: string) => {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (!match) return false
    const [, r, g, b] = match.map(Number)
    return b > r && r > g && b - g > 30
  }

  expect(isPurple(lightStyles.backgroundColor)).toBe(true)
  expect(isPurple(darkStyles.backgroundColor)).toBe(true)
  expect(lightStyles.backgroundColor).not.toBe(darkStyles.backgroundColor)
})

test('renders semantic color theme buttons (yellow, red, green)', async ({ page }) => {
  const yellowButton = page.getByTestId('button-yellow')
  const redButton = page.getByTestId('button-red')
  const greenButton = page.getByTestId('button-green')

  await expect(yellowButton).toBeVisible()
  await expect(redButton).toBeVisible()
  await expect(greenButton).toBeVisible()

  const yellowStyles = await getStyles(yellowButton)
  const redStyles = await getStyles(redButton)
  const greenStyles = await getStyles(greenButton)

  // Each color theme should have different background colors in v5
  expect(yellowStyles.backgroundColor).not.toBe(redStyles.backgroundColor)
  expect(redStyles.backgroundColor).not.toBe(greenStyles.backgroundColor)
  expect(yellowStyles.backgroundColor).not.toBe(greenStyles.backgroundColor)
})

test('renders color theme cards (blue, red, green)', async ({ page }) => {
  const blueCard = page.getByTestId('card-blue')
  const redCard = page.getByTestId('card-red')
  const greenCard = page.getByTestId('card-green')

  await expect(blueCard).toBeVisible()
  await expect(redCard).toBeVisible()
  await expect(greenCard).toBeVisible()

  const blueStyles = await getStyles(blueCard)
  const redStyles = await getStyles(redCard)
  const greenStyles = await getStyles(greenCard)

  // Each color theme should have different background colors
  expect(blueStyles.backgroundColor).not.toBe(redStyles.backgroundColor)
  expect(redStyles.backgroundColor).not.toBe(greenStyles.backgroundColor)
})

test('renders palette color swatches', async ({ page }) => {
  // Check that all 12 palette colors are rendered
  for (let i = 1; i <= 12; i++) {
    const swatch = page.getByTestId(`palette-color-${i}`)
    await expect(swatch).toBeVisible()

    const styles = await getStyles(swatch)
    // Each swatch should have a background color
    expect(styles.backgroundColor).toBeDefined()
    expect(styles.backgroundColor).not.toBe('')
  }
})

test('palette colors form a gradient (different values)', async ({ page }) => {
  const colors: string[] = []

  for (let i = 1; i <= 12; i++) {
    const swatch = page.getByTestId(`palette-color-${i}`)
    const styles = await getStyles(swatch)
    colors.push(styles.backgroundColor)
  }

  // Not all colors should be the same (they form a gradient)
  const uniqueColors = new Set(colors)
  expect(uniqueColors.size).toBeGreaterThan(1)
})
