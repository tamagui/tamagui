import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for generated theme path resolution.
 *
 * These tests verify that the theme resolution algorithm correctly handles:
 * 1. Explicit scheme overrides (e.g., dark_green inside blue parent)
 * 2. Inheriting scheme from the parent
 * 3. Preserving a relative level under a color theme
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    name: 'ThemeComponentResolution',
    type: 'useCase',
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

test.describe('Goal 2: Relative level preservation', () => {
  test('level2 keeps its blue palette when nested', async ({ page }) => {
    const directSquare = page.locator(`#${TEST_IDS.themeLevel2Direct}`)
    await expect(directSquare).toBeVisible()

    const nestedSquare = page.locator(`#${TEST_IDS.themeLevel2Nested}`)
    await expect(nestedSquare).toBeVisible()

    const directText = await directSquare.innerText()
    const nestedText = await nestedSquare.innerText()

    expect(directText).toBe('light_blue_level2')
    expect(nestedText).toBe('light_blue_level2')
  })
})
