import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for theme component resolution (commit 5839319146 goals)
 *
 * These tests verify that the theme resolution algorithm correctly handles:
 * 1. Explicit scheme overrides (e.g., dark_green inside blue parent)
 * 2. Inheriting scheme from parent for component themes
 * 3. Preserving sub-themes when only componentName is provided (no backtracking)
 */

test.beforeEach(async ({ page }) => {
  // Use v4 themes as these tests require theme names like light_green, dark_green, etc.
  await setupPage(page, {
    name: 'ThemeComponentResolution',
    type: 'useCase',
    searchParams: { v4theme: 'true' },
  })
})

test.describe('Goal 1a: Explicit scheme override', () => {
  test('dark_green theme is preserved when nested inside blue parent', async ({
    page,
  }) => {
    // Direct dark_green theme
    const directSquare = page.locator(`#${TEST_IDS.themeExplicitSchemeDirect}`)
    await expect(directSquare).toBeVisible()

    // Nested: blue → dark_green
    const nestedSquare = page.locator(`#${TEST_IDS.themeExplicitSchemeNested}`)
    await expect(nestedSquare).toBeVisible()

    // Both should have the same theme name (dark_green)
    const directText = await directSquare.innerText()
    const nestedText = await nestedSquare.innerText()

    expect(directText).toBe('dark_green')
    expect(nestedText).toBe('dark_green')
  })
})

test.describe('Goal 1b: Inherit scheme from parent', () => {
  test('green theme inherits light scheme from parent', async ({ page }) => {
    // Direct light_green theme
    const directSquare = page.locator(`#${TEST_IDS.themeInheritSchemeDirect}`)
    await expect(directSquare).toBeVisible()

    // Nested: light → green
    const nestedSquare = page.locator(`#${TEST_IDS.themeInheritSchemeNested}`)
    await expect(nestedSquare).toBeVisible()

    // Both should resolve to light_green
    const directText = await directSquare.innerText()
    const nestedText = await nestedSquare.innerText()

    expect(directText).toBe('light_green')
    expect(nestedText).toBe('light_green')
  })
})

test.describe('Goal 2: Sub-theme preservation', () => {
  test('surface1 sub-theme is preserved when nested (no backtracking)', async ({
    page,
  }) => {
    // Direct light_blue_surface1
    const directSquare = page.locator(`#${TEST_IDS.themeSurface1Direct}`)
    await expect(directSquare).toBeVisible()

    // Nested: blue → surface1
    const nestedSquare = page.locator(`#${TEST_IDS.themeSurface1WithComponent}`)
    await expect(nestedSquare).toBeVisible()

    // Both should be light_blue_surface1
    const directText = await directSquare.innerText()
    const nestedText = await nestedSquare.innerText()

    expect(directText).toBe('light_blue_surface1')
    expect(nestedText).toBe('light_blue_surface1')
  })
})
