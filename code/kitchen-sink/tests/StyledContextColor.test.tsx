import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

// Test for GitHub issue #3676 - Context Values Not Accessible in Children Styles

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledContextColor', type: 'useCase' })
})

test(`standard Button passes color to text children`, async ({ page }) => {
  // Find the button and get the text element inside
  const button = page.getByTestId('standard-button-green')
  await expect(button).toBeVisible()

  // The text inside the button should have green color
  const text = button.locator('span').first()
  const styles = await getStyles(text)

  // Color should be green (rgb format)
  expect(styles.color).toContain('0, 128, 0') // green in rgb
})

test(`custom button with color variant passes color to ButtonText via context`, async ({
  page,
}) => {
  const button = page.getByTestId('custom-button-green')
  await expect(button).toBeVisible()

  // Find the text element inside
  const text = button.locator('span').first()
  const textStyles = await getStyles(text)

  // Text should be green - this is the core issue from #3676
  // The color variant on the parent should propagate to children via context
  expect(textStyles.color).toContain('0, 128, 0') // green in rgb
})

test(`custom button with red color variant passes to text`, async ({ page }) => {
  const button = page.getByTestId('custom-button-red')
  await expect(button).toBeVisible()

  const text = button.locator('span').first()
  const textStyles = await getStyles(text)

  // Text should be red
  expect(textStyles.color).toContain('255, 0, 0') // red in rgb
})

test(`explicit context provider passes color to children`, async ({ page }) => {
  const text = page.getByTestId('context-text-blue')
  await expect(text).toBeVisible()

  const textStyles = await getStyles(text)

  // Text should be blue
  expect(textStyles.color).toContain('0, 0, 255') // blue in rgb
})

// This is the key test for issue #3676 - $color reference to context value
// Test with explicit Provider (like direct Button usage with color prop)
test(`$color reference in child variant gets parent color from Provider (issue #3676)`, async ({
  page,
}) => {
  const text = page.getByTestId('context-ref-text-link')
  await expect(text).toBeVisible()

  const textStyles = await getStyles(text)

  // Text should be green because:
  // 1. Provider sets color: 'green'
  // 2. Child uses color: '$color' which should resolve to 'green' from context
  expect(textStyles.color).toContain('0, 128, 0') // green in rgb
})

// Test with variant setting color (more complex case)
test(`$color reference works when parent variant sets color`, async ({ page }) => {
  const button = page.getByTestId('context-ref-button-primary')
  await expect(button).toBeVisible()

  const text = button.locator('span').first()
  const textStyles = await getStyles(text)

  // Text should be blue from the primary variant's color
  expect(textStyles.color).toContain('0, 0, 255') // blue in rgb
})

// Issue #3670 - pressStyle color not working on styled Button
// Requires disableClassName to enable runtime press handling (not CSS transitions)
test(`pressStyle color propagates to children via context (issue #3670)`, async ({
  page,
}) => {
  const button = page.getByTestId('press-style-button')
  await expect(button).toBeVisible()

  const text = button.locator('span').first()

  // Initially should be green
  const initialStyles = await getStyles(text)
  expect(initialStyles.color).toContain('0, 128, 0') // green in rgb

  // Press and hold the button using mouse down (triggers onPressIn)
  await button.hover()
  await page.mouse.down()
  await page.waitForTimeout(200)

  // While pressed, text should be red
  const pressedStyles = await getStyles(text)
  expect(pressedStyles.color).toContain('255, 0, 0') // red in rgb

  // Release
  await page.mouse.up()
  await page.waitForTimeout(100)

  // After release, should be back to green
  const releasedStyles = await getStyles(text)
  expect(releasedStyles.color).toContain('0, 128, 0') // green in rgb
})
