import { expect, test } from '@playwright/test'
import { TEST_IDS } from '../src/constants/test-ids'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

/**
 * Accent and color child themes, covering the documented usage patterns:
 *
 * 1. <Theme name="accent"> - theme-builder.mdx, how-to-upgrade.mdx
 * 2. <Button theme="accent"> - ButtonDemo.tsx
 * 3. accent-background / accent-color
 * 4. color1-color11 inside the accent theme
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    name: 'AccentAndColorThemes',
    type: 'useCase',
  })
})

function rgb(color: string): number[] {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) throw new Error(`not an rgb color: ${color}`)
  return match.slice(1).map(Number)
}

function luminance(color: string): number {
  const [r, g, b] = rgb(color)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

// --- <Theme name="accent"> ---

test('<Theme name="accent"> background differs from base background', async ({
  page,
}) => {
  const baseEl = page.getByTestId(TEST_IDS.baseBackground)
  const accentEl = page.getByTestId(TEST_IDS.accentThemeBackground)

  await expect(baseEl).toBeVisible()
  await expect(accentEl).toBeVisible()

  const baseStyles = await getStyles(baseEl)
  const accentStyles = await getStyles(accentEl)

  // The accent theme should produce a visually different background from the base theme
  expect(accentStyles.backgroundColor).not.toBe(baseStyles.backgroundColor)
})

test('<Theme name="accent"> background uses the brand tint', async ({ page }) => {
  const accentEl = page.getByTestId(TEST_IDS.accentThemeBackground)
  await expect(accentEl).toBeVisible()

  const accent = rgb((await getStyles(accentEl)).backgroundColor)

  expect(Math.max(...accent) - Math.min(...accent)).toBeGreaterThan(10)
})

test('<Theme name="accent"> color is defined', async ({ page }) => {
  const textEl = page.getByTestId(TEST_IDS.accentThemeColor)
  await expect(textEl).toBeVisible()

  const styles = await getStyles(textEl)
  expect(styles.color).toBeDefined()
  expect(styles.color).not.toBe('')
})

// --- <Button theme="accent"> ---

test('<Button theme="accent"> has different background than base button', async ({
  page,
}) => {
  const baseBtn = page.getByTestId(TEST_IDS.baseButton)
  const accentBtn = page.getByTestId(TEST_IDS.accentPropButton)

  await expect(baseBtn).toBeVisible()
  await expect(accentBtn).toBeVisible()

  const baseStyles = await getStyles(baseBtn)
  const accentStyles = await getStyles(accentBtn)

  // Accent button should look different from the default button
  expect(accentStyles.backgroundColor).not.toBe(baseStyles.backgroundColor)
})

test('<Button theme="accent"> uses the brand tint', async ({ page }) => {
  const accentBtn = page.getByTestId(TEST_IDS.accentPropButton)
  await expect(accentBtn).toBeVisible()

  const accent = rgb((await getStyles(accentBtn)).backgroundColor)

  expect(Math.max(...accent) - Math.min(...accent)).toBeGreaterThan(10)
})

// --- accent-background token ---

test('accent-background token resolves to the fixed brand surface', async ({ page }) => {
  const el = page.getByTestId(TEST_IDS.accentBgToken)
  const baseEl = page.getByTestId(TEST_IDS.baseBackground)
  await expect(el).toBeVisible()
  await expect(baseEl).toBeVisible()

  const token = luminance((await getStyles(el)).backgroundColor)
  const base = luminance((await getStyles(baseEl)).backgroundColor)

  expect(Math.abs(token - base)).toBeGreaterThan(0.5)
})

// --- adaptive accent ramp ---

test('color1-11 render the accent gradient (not all identical)', async ({ page }) => {
  const colors: string[] = []

  for (let i = 1; i <= 11; i++) {
    const swatch = page.getByTestId(`palette-accent-${i}`)
    await expect(swatch).toBeVisible()

    const styles = await getStyles(swatch)
    expect(styles.backgroundColor).toBeDefined()
    colors.push(styles.backgroundColor)
  }

  // Palette should have multiple distinct values (a gradient, not flat)
  const uniqueColors = new Set(colors)
  expect(uniqueColors.size).toBeGreaterThan(1)
})

// --- Color child themes ---

test('color child themes (yellow, red, green) have distinct backgrounds', async ({
  page,
}) => {
  const yellowBtn = page.getByTestId('button-yellow')
  const redBtn = page.getByTestId('button-red')
  const greenBtn = page.getByTestId('button-green')

  await expect(yellowBtn).toBeVisible()
  await expect(redBtn).toBeVisible()
  await expect(greenBtn).toBeVisible()

  const yellowStyles = await getStyles(yellowBtn)
  const redStyles = await getStyles(redBtn)
  const greenStyles = await getStyles(greenBtn)

  expect(yellowStyles.backgroundColor).not.toBe(redStyles.backgroundColor)
  expect(redStyles.backgroundColor).not.toBe(greenStyles.backgroundColor)
  expect(yellowStyles.backgroundColor).not.toBe(greenStyles.backgroundColor)
})
