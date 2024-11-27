import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'
import { TEST_IDS } from '../src/constants/test-ids'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ThemeChange', type: 'useCase' })
})

test('Initial theme (yellow) renders with correct colors', async ({ page }) => {
  // The expected yellow theme color in RGB format
  const expectedYellowColor = 'rgb(247, 206, 0)' // Updated to match actual color

  // Get the theme info text to verify we're on yellow theme
  const themeInfo0 = await page.locator(`#${TEST_IDS.themeInfo}-0`).textContent()
  const themeInfo1 = await page.locator(`#${TEST_IDS.themeInfo}-1`).textContent()

  // Verify both levels show yellow theme
  expect(themeInfo0).toContain('"theme":"yellow"')
  expect(themeInfo1).toContain('"theme":"yellow"')

  // Get the styles for all squares
  const staticSquare0Styles = await getStyles(page.locator(`#${TEST_IDS.staticSquare}-0`))
  const staticSquare1Styles = await getStyles(page.locator(`#${TEST_IDS.staticSquare}-1`))
  const dynamicSquare0Styles = await getStyles(
    page.locator(`#${TEST_IDS.dynamicSquare}-0`)
  )
  const dynamicSquare1Styles = await getStyles(
    page.locator(`#${TEST_IDS.dynamicSquare}-1`)
  )

  // Verify all squares have the yellow theme color
  expect(staticSquare0Styles.backgroundColor).toBe(expectedYellowColor)
  expect(staticSquare1Styles.backgroundColor).toBe(expectedYellowColor)
  expect(dynamicSquare0Styles.backgroundColor).toBe(expectedYellowColor)
  expect(dynamicSquare1Styles.backgroundColor).toBe(expectedYellowColor)
})

test('Inner theme change does not affect outer theme', async ({ page }) => {
  // Initial colors
  const initialYellowColor = 'rgb(247, 206, 0)'

  // Get initial styles for both levels
  const outerSquareInitial = await getStyles(page.locator(`#${TEST_IDS.staticSquare}-0`))
  const innerSquareInitial = await getStyles(page.locator(`#${TEST_IDS.staticSquare}-1`))

  // Verify both start with yellow
  expect(outerSquareInitial.backgroundColor).toBe(initialYellowColor)
  expect(innerSquareInitial.backgroundColor).toBe(initialYellowColor)

  // Click the inner theme change button
  await page.locator(`#${TEST_IDS.changeThemeButton}-1`).click()

  // Get updated styles
  const outerSquareAfter = await getStyles(page.locator(`#${TEST_IDS.staticSquare}-0`))
  const innerSquareAfter = await getStyles(page.locator(`#${TEST_IDS.staticSquare}-1`))

  // Verify outer square remains yellow
  expect(outerSquareAfter.backgroundColor).toBe(initialYellowColor)

  // Verify inner square has changed (not yellow anymore)
  expect(innerSquareAfter.backgroundColor).not.toBe(initialYellowColor)

  // Verify theme info text reflects changes
  const outerThemeInfo = await page.locator(`#${TEST_IDS.themeInfo}-0`).textContent()
  const innerThemeInfo = await page.locator(`#${TEST_IDS.themeInfo}-1`).textContent()

  expect(outerThemeInfo).toContain('"theme":"yellow"')
  expect(innerThemeInfo).not.toContain('"theme":"yellow"')
})
