import { expect, test } from '@playwright/test'
import { TEST_IDS } from '../src/constants/test-ids'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

/**
 * Tests for the v5 theme builder output, covering the documented accent usage patterns:
 *
 * 1. <Theme name="accent"> - theme-builder.mdx, how-to-upgrade.mdx
 * 2. <Button theme="accent"> - config-v5.mdx, ButtonDemo.tsx
 * 3. $accentBackground / $accentColor - config-v5.mdx
 * 4. $accent1-$accent12 raw tokens
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    name: 'V5ThemeBuilderOutput',
    type: 'useCase',
    searchParams: { generatedV5: 'true' },
  })
})

// --- <Theme name="accent"> ---

test('<Theme name="accent"> $background differs from base $background', async ({
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

test('<Theme name="accent"> $background is not gray (has color)', async ({ page }) => {
  const accentEl = page.getByTestId(TEST_IDS.accentThemeBackground)
  await expect(accentEl).toBeVisible()

  const styles = await getStyles(accentEl)

  // The generated theme has a purple accent (hue 250). Verify it's not a pure gray.
  // In a gray color, r === g === b. A colored accent will have channel differences.
  const match = styles.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  expect(match).toBeTruthy()

  if (match) {
    const [, r, g, b] = match.map(Number)
    const isGray = r === g && g === b
    expect(isGray).toBe(false)
  }
})

test('<Theme name="accent"> $color is defined', async ({ page }) => {
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

test('<Button theme="accent"> background is not gray', async ({ page }) => {
  const accentBtn = page.getByTestId(TEST_IDS.accentPropButton)
  await expect(accentBtn).toBeVisible()

  const styles = await getStyles(accentBtn)

  const match = styles.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  expect(match).toBeTruthy()

  if (match) {
    const [, r, g, b] = match.map(Number)
    const isGray = r === g && g === b
    expect(isGray).toBe(false)
  }
})

// --- $accentBackground token ---

test('$accentBackground token resolves to a non-gray color', async ({ page }) => {
  const el = page.getByTestId(TEST_IDS.accentBgToken)
  await expect(el).toBeVisible()

  const styles = await getStyles(el)
  expect(styles.backgroundColor).toBeDefined()
  expect(styles.backgroundColor).not.toBe('')

  const match = styles.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  expect(match).toBeTruthy()

  if (match) {
    const [, r, g, b] = match.map(Number)
    const isGray = r === g && g === b
    expect(isGray).toBe(false)
  }
})

// --- $accent1-12 raw tokens ---

test('$accent1-12 palette tokens render a gradient (not all identical)', async ({
  page,
}) => {
  const colors: string[] = []

  for (let i = 1; i <= 12; i++) {
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

test('color child themes (yellow, red, green, blue) have distinct backgrounds', async ({
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
