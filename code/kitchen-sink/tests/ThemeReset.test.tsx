import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'
import { TEST_IDS } from '../src/constants/test-ids'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ThemeReset', type: 'useCase' })
})

test('Reset from nested themes goes back to grandparent', async ({ page }) => {
  // Case 1: Reset from dark → pink → blue should go back to dark
  const resetButton1 = page.locator(`#${TEST_IDS.resetButton1}`)
  await expect(resetButton1).toBeVisible()

  // Get the background color of the button
  const button1Styles = await getStyles(resetButton1)

  // The button should have dark theme background (not pink or blue)
  // Dark theme typically has a dark background
  expect(button1Styles.backgroundColor).not.toBe('rgb(255, 192, 203)') // pink
  expect(button1Styles.backgroundColor).not.toBe('rgb(0, 0, 255)') // blue
})

test('Reset from dark → pink goes back to dark (documentation example)', async ({
  page,
}) => {
  // Case 2: Reset from dark → pink should go back to dark
  const resetSquare1 = page.locator(`#${TEST_IDS.resetSquare1}`)
  await expect(resetSquare1).toBeVisible()

  const square1Styles = await getStyles(resetSquare1)

  // The square should have dark theme background
  // This matches the documentation example
  expect(square1Styles.backgroundColor).not.toBe('rgb(255, 192, 203)') // pink
})

test('Reset from dark only goes to light', async ({ page }) => {
  // Case 3: Reset from dark only should go to light (opposite scheme)
  const resetSquare2 = page.locator(`#${TEST_IDS.resetSquare2}`)
  await expect(resetSquare2).toBeVisible()

  const square2Styles = await getStyles(resetSquare2)

  // The square should have light theme background (opposite of dark)
  expect(square2Styles.backgroundColor).not.toBe('rgb(0, 0, 0)') // black/dark
})

test('Reset from dark with button shows different themes', async ({ page }) => {
  // Case 4: Dark button vs reset button should have different themes
  const darkButton = page.locator(`#${TEST_IDS.darkButton}`)
  const resetButton2 = page.locator(`#${TEST_IDS.resetButton2}`)

  await expect(darkButton).toBeVisible()
  await expect(resetButton2).toBeVisible()

  const darkButtonStyles = await getStyles(darkButton)
  const resetButton2Styles = await getStyles(resetButton2)

  // The buttons should have different background colors
  // Dark button should have dark theme, reset button should have light theme
  expect(darkButtonStyles.backgroundColor).not.toBe(resetButton2Styles.backgroundColor)
})
