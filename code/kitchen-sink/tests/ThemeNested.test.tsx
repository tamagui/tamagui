import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for GitHub issue #3673: Nested theme regression
 *
 * When using nested themes like <Theme name="blue"><Theme name="level3">,
 * the parent color context (blue) should be preserved, resulting in
 * light_blue_level3 theme being applied.
 *
 * The bug causes the nested theme to lose the color context, resulting in
 * just light_level3 being applied instead.
 */

test.beforeEach(async ({ page }) => {
  // Test the nested theme regression (issue #3673)
  await setupPage(page, {
    name: 'ThemeNested',
    type: 'useCase',
  })
})

test('Nested blue theme with level3 matches direct light_blue_level3', async ({
  page,
}) => {
  // Get the direct theme element
  const directSquare = page.locator(`#${TEST_IDS.nestedThemeDirect}`)
  await expect(directSquare).toBeVisible()

  // Get the nested theme element
  const nestedSquare = page.locator(`#${TEST_IDS.nestedThemeNested}`)
  await expect(nestedSquare).toBeVisible()

  // Get computed styles for both
  const directStyles = await getStyles(directSquare)
  const nestedStyles = await getStyles(nestedSquare)

  // The nested theme should produce the same background color as the direct theme
  // If the bug is present, the nested path loses the blue palette.
  expect(nestedStyles.backgroundColor).toBe(directStyles.backgroundColor)
})

test('Nested light → blue → level3 matches direct light_blue_level3', async ({
  page,
}) => {
  // Get the direct theme element
  const directSquare = page.locator(`#${TEST_IDS.nestedThemeDirect}`)
  await expect(directSquare).toBeVisible()

  // Get the nested theme with explicit light parent
  const nestedWithParent = page.locator(`#${TEST_IDS.nestedThemeWithParent}`)
  await expect(nestedWithParent).toBeVisible()

  // Get computed styles for both
  const directStyles = await getStyles(directSquare)
  const nestedStyles = await getStyles(nestedWithParent)

  // The nested theme should produce the same background color as the direct theme
  expect(nestedStyles.backgroundColor).toBe(directStyles.backgroundColor)
})

test('Nested red theme with level2 matches direct light_red_level2', async ({
  page,
}) => {
  // Get the direct red theme element
  const redDirectSquare = page.locator(`#${TEST_IDS.nestedThemeRedDirect}`)
  await expect(redDirectSquare).toBeVisible()

  // Get the nested red theme element
  const redNestedSquare = page.locator(`#${TEST_IDS.nestedThemeRedNested}`)
  await expect(redNestedSquare).toBeVisible()

  // Get computed styles for both
  const redDirectStyles = await getStyles(redDirectSquare)
  const redNestedStyles = await getStyles(redNestedSquare)

  // The nested theme should produce the same background color as the direct theme
  expect(redNestedStyles.backgroundColor).toBe(redDirectStyles.backgroundColor)
})

test('Blue level3 differs from neutral level3', async ({ page }) => {
  // Get the blue nested theme
  const blueNestedSquare = page.locator(`#${TEST_IDS.nestedThemeNested}`)
  await expect(blueNestedSquare).toBeVisible()

  // Get the neutral level3 theme
  const noColorSquare = page.locator(`#${TEST_IDS.nestedThemeNoColor}`)
  await expect(noColorSquare).toBeVisible()

  // Get computed styles for both
  const blueStyles = await getStyles(blueNestedSquare)
  const noColorStyles = await getStyles(noColorSquare)

  // The blue level should have a different background than the neutral level.
  // This verifies that color context actually makes a difference
  expect(blueStyles.backgroundColor).not.toBe(noColorStyles.backgroundColor)
})

test('Blue level3 differs from red level2', async ({ page }) => {
  // Get the blue nested theme
  const blueNestedSquare = page.locator(`#${TEST_IDS.nestedThemeNested}`)
  await expect(blueNestedSquare).toBeVisible()

  // Get the red nested theme
  const redNestedSquare = page.locator(`#${TEST_IDS.nestedThemeRedNested}`)
  await expect(redNestedSquare).toBeVisible()

  // Get computed styles for both
  const blueStyles = await getStyles(blueNestedSquare)
  const redStyles = await getStyles(redNestedSquare)

  // Different color contexts should produce different backgrounds
  expect(blueStyles.backgroundColor).not.toBe(redStyles.backgroundColor)
})

test('Nested blue → level2 → level2 composes to level3', async ({
  page,
}) => {
  // Repeating the one-level boundary composes relative to the current level.

  const directSquare = page.locator(`#${TEST_IDS.nestedLevel3Direct}`)
  await expect(directSquare).toBeVisible()

  const nestedSquare = page.locator(`#${TEST_IDS.nestedLevel3Composed}`)
  await expect(nestedSquare).toBeVisible()

  // Get computed styles for both
  const directStyles = await getStyles(directSquare)
  const nestedStyles = await getStyles(nestedSquare)

  // The nested theme should produce the same background color as the direct theme
  // Both paths resolve the same generated level-3 map.
  expect(nestedStyles.backgroundColor).toBe(directStyles.backgroundColor)
})
