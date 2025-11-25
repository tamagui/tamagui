import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles, whilePressed } from './utils'

// Issue #3613: $group-press not applied when in variant

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'GroupPressInVariant', type: 'useCase' })
})

test(`$group-press in variant with unnamed group - initial state`, async ({ page }) => {
  const text = page.locator('#test-variant-primary')
  const styles = await getStyles(text)
  // Should have the variant's base color (blue)
  expect(styles.color).toBe('rgb(0, 0, 255)')
})

test(`$group-press in variant with unnamed group - pressed state`, async ({ page }) => {
  const group = page.locator('#test-unnamed-group')
  const text = page.locator('#test-variant-primary')

  // Get text styles while the group is pressed
  const textStyles = await whilePressed(
    group,
    async () => {
      return await getStyles(text)
    },
    { delay: 1000 }
  )

  // The text should turn red when the group is pressed
  expect(textStyles.color).toBe('rgb(255, 0, 0)')
})

test(`$group-press at root level - initial state`, async ({ page }) => {
  const text = page.locator('#test-root-press')
  const styles = await getStyles(text)
  // Should have the root level base color (blue)
  expect(styles.color).toBe('rgb(0, 0, 255)')
})

test(`$group-press at root level - pressed state`, async ({ page }) => {
  const group = page.locator('#test-root-group')
  const text = page.locator('#test-root-press')

  // Get text styles while the group is pressed
  const textStyles = await whilePressed(
    group,
    async () => {
      return await getStyles(text)
    },
    { delay: 1000 }
  )

  // The text should turn red when the group is pressed (this should already work)
  expect(textStyles.color).toBe('rgb(255, 0, 0)')
})

test(`$group-press in secondary variant - initial state`, async ({ page }) => {
  const text = page.locator('#test-variant-secondary')
  const styles = await getStyles(text)
  // Should have the secondary variant's base color (green)
  expect(styles.color).toBe('rgb(0, 128, 0)')
})

test(`$group-press in secondary variant - pressed state`, async ({ page }) => {
  const group = page.locator('#test-secondary-group')
  const text = page.locator('#test-variant-secondary')

  // Get text styles while the group is pressed
  const textStyles = await whilePressed(
    group,
    async () => {
      return await getStyles(text)
    },
    { delay: 1000 }
  )

  // The text should turn yellow when the group is pressed
  expect(textStyles.color).toBe('rgb(255, 255, 0)')
})
