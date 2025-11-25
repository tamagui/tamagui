import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for GitHub issue #3620: Theme switching broken after v1.132.15
 *
 * Color tokens should act as fallbacks - if a theme defines a value for the same key,
 * the theme value should take precedence over the color token.
 *
 * The bug was that Object.assign(theme, colorTokens) was overwriting theme values
 * with color token values instead of the other way around.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ColorTokenFallback', type: 'useCase' })
})

test('theme value takes precedence over color token', async ({ page }) => {
  // The light_ColorTokenTest theme defines customRed as #00ff00 (green)
  // The color token customRed is #ff0000 (red)
  // The theme value should win, so the background should be green
  const square = page.locator(`#${TEST_IDS.colorTokenFallbackThemeValue}`)
  await expect(square).toBeVisible()

  const styles = await getStyles(square)
  // rgb(0, 255, 0) is #00ff00 (green) - the theme value
  // rgb(255, 0, 0) would be #ff0000 (red) - the color token value (wrong)
  expect(styles.backgroundColor).toBe('rgb(0, 255, 0)')
})

test('color token is used as fallback when theme does not define it', async ({
  page,
}) => {
  // The light_ColorTokenTest theme does NOT define customBlue
  // The color token customBlue is #0000ff (blue)
  // The color token should be used as a fallback
  const square = page.locator(`#${TEST_IDS.colorTokenFallbackTokenValue}`)
  await expect(square).toBeVisible()

  const styles = await getStyles(square)
  // rgb(0, 0, 255) is #0000ff (blue) - the color token fallback
  expect(styles.backgroundColor).toBe('rgb(0, 0, 255)')
})
