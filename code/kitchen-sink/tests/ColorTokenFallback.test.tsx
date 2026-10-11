import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for GitHub issue #3620: Theme switching broken after v1.132.15
 *
 * V3 flat values resolve the property's configured token category before the
 * unified theme namespace. A theme value remains the fallback when the bound
 * color category has no matching token.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ColorTokenFallback', type: 'useCase' })
})

test('bound color token takes precedence over a same-named theme value', async ({
  page,
}) => {
  // The light_ColorTokenTest theme defines customRed as #00ff00 (green)
  // The color token customRed is #ff0000 (red)
  // The property-bound color token wins, so the background should be red.
  const square = page.locator(`#${TEST_IDS.colorTokenFallbackThemeValue}`)
  await expect(square).toBeVisible()

  const styles = await getStyles(square)
  expect(styles.backgroundColor).toBe('rgb(255, 0, 0)')
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
