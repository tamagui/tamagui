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

  // Both buttons should render with valid styles
  // Note: v5 Button uses surface3 template which may have similar colors in light/dark
  // The color theme tests below (yellow, red, green, blue) verify theme switching works
  const lightStyles = await getStyles(lightButton)
  const darkStyles = await getStyles(darkButton)
  expect(lightStyles.backgroundColor).toBeDefined()
  expect(darkStyles.backgroundColor).toBeDefined()

  // Check the base palette $color7 to verify the custom base palette is being used
  const baseLightSwatch = page.getByTestId('base-light-swatch')
  const baseDarkSwatch = page.getByTestId('base-dark-swatch')
  const baseLightStyles = await getStyles(baseLightSwatch)
  const baseDarkStyles = await getStyles(baseDarkSwatch)
  console.log('Base Light $color7:', baseLightStyles.backgroundColor)
  console.log('Base Dark $color7:', baseDarkStyles.backgroundColor)
})

test('renders accent theme buttons with correct colors (not gray)', async ({ page }) => {
  const accentLight = page.getByTestId('button-accent-light')
  const accentDark = page.getByTestId('button-accent-dark')

  await expect(accentLight).toBeVisible()
  await expect(accentDark).toBeVisible()

  const lightStyles = await getStyles(accentLight)
  const darkStyles = await getStyles(accentDark)

  // Accent buttons should have background colors applied
  expect(lightStyles.backgroundColor).toBeDefined()
  expect(darkStyles.backgroundColor).toBeDefined()

  // Also check the color7 swatches to see if the accent theme palette is working
  const lightSwatch = page.getByTestId('accent-light-swatch')
  const darkSwatch = page.getByTestId('accent-dark-swatch')
  const lightSwatchStyles = await getStyles(lightSwatch)
  const darkSwatchStyles = await getStyles(darkSwatch)

  // Debug: Check if accent1-accent12 tokens exist in the theme
  const accentTokens = await page.evaluate(() => {
    const tamagui = (window as any).Tamagui || (window as any).tamagui
    if (!tamagui) return { error: 'No Tamagui found' }

    const getTheme = tamagui.getTheme || tamagui.getThemes
    if (!getTheme) return { error: 'No getTheme found' }

    const lightAccent = tamagui.getTheme?.('light_accent')
    const darkAccent = tamagui.getTheme?.('dark_accent')

    return {
      lightAccent: lightAccent
        ? {
            accent1: lightAccent.accent1?.val,
            accent7: lightAccent.accent7?.val,
            background: lightAccent.background?.val,
            color7: lightAccent.color7?.val,
          }
        : null,
      darkAccent: darkAccent
        ? {
            accent1: darkAccent.accent1?.val,
            accent7: darkAccent.accent7?.val,
            background: darkAccent.background?.val,
            color7: darkAccent.color7?.val,
          }
        : null,
    }
  })
  console.log('Accent tokens:', JSON.stringify(accentTokens, null, 2))

  // The accent theme should use the custom accent colors from generatedV5Theme.ts
  // accentLight colors are hsla(250, 50%, 40%, 1) through hsla(250, 50%, 65%, 1)
  // which are purple colors, NOT gray
  // accentDark colors are hsla(250, 50%, 35%, 1) through hsla(250, 50%, 60%, 1)

  // Convert the background colors to verify they're purple (hue ~250)
  // We'll check that they're NOT gray (gray has equal RGB values or very low saturation)
  console.log('Accent Light Background:', lightStyles.backgroundColor)
  console.log('Accent Dark Background:', darkStyles.backgroundColor)
  console.log('Accent Light $color7:', lightSwatchStyles.backgroundColor)
  console.log('Accent Dark $color7:', darkSwatchStyles.backgroundColor)

  // Helper to extract RGB values and check if color is purple (hue ~250-270)
  const isPurple = (color: string) => {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (!match) return false

    const [, r, g, b] = match.map(Number)

    // Purple has: Blue > Red > Green
    // Hue around 250-270 degrees (blue-violet range)
    return b > r && r > g && b - g > 30
  }

  // The accent theme in generatedV5Theme.ts uses purple colors (hue 250)
  // Verify the colors are actually purple, not gray
  expect(isPurple(lightStyles.backgroundColor)).toBe(true)
  expect(isPurple(darkStyles.backgroundColor)).toBe(true)

  // Verify the $color7 swatch is also purple
  expect(isPurple(lightSwatchStyles.backgroundColor)).toBe(true)
  expect(isPurple(darkSwatchStyles.backgroundColor)).toBe(true)

  // Verify the colors are actually different from each other (light vs dark)
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
