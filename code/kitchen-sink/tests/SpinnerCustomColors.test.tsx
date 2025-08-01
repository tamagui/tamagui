import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SpinnerCustomColors', type: 'useCase' })
})

test('custom color tokens are applied to spinners', async ({ page }) => {
  // Test custom red spinner - check the circle element's stroke
  const redSpinnerStyle = page.locator('#spinner-custom-red circle').first()
  const redSpinnerStroke = (await getStyles(redSpinnerStyle)).stroke
  expect(redSpinnerStroke).toBe('rgb(255, 0, 0)')

  // Test custom blue spinner
  const blueSpinnerStyle = page.locator('#spinner-custom-blue circle').first()
  const blueSpinnerStroke = (await getStyles(blueSpinnerStyle)).stroke
  expect(blueSpinnerStroke).toBe('rgb(0, 0, 255)')

  // Test custom green spinner
  const greenSpinnerStyle = page.locator('#spinner-custom-green circle').first()
  const greenSpinnerStroke = (await getStyles(greenSpinnerStyle)).stroke
  expect(greenSpinnerStroke).toBe('rgb(0, 255, 0)')

  // Test testsomethingdifferent custom color
  const testDifferentStyle = page.locator('#spinner-test-different circle').first()
  const testDifferentStroke = (await getStyles(testDifferentStyle)).stroke
  expect(testDifferentStroke).toBe('rgb(255, 0, 0)') // testsomethingdifferent is also red (#ff0000)
})

test('custom color tokens are available in themes', async ({ page }) => {
  // Verify that custom colors are used through CSS variables
  const customColorVariables = await page.evaluate(() => {
    // Check that the CSS variables exist and have correct values
    const rootStyles = window.getComputedStyle(document.documentElement)
    return {
      customRed: rootStyles.getPropertyValue('--c-color-customRed').trim(),
      customBlue: rootStyles.getPropertyValue('--c-color-customBlue').trim(),
      customGreen: rootStyles.getPropertyValue('--c-color-customGreen').trim(),
    }
  })

  // Verify CSS variables exist
  expect(customColorVariables.customRed).toBe('#ff0000')
  expect(customColorVariables.customBlue).toBe('#0000ff')
  expect(customColorVariables.customGreen).toBe('#00ff00')
})

test('custom color tokens have correct CSS variables', async ({ page }) => {
  // Check that CSS variables are created for custom colors
  const cssVariables = await page.evaluate(() => {
    const rootStyles = window.getComputedStyle(document.documentElement)
    return {
      customRed: rootStyles.getPropertyValue('--c-color-customRed').trim(),
      customBlue: rootStyles.getPropertyValue('--c-color-customBlue').trim(),
      customGreen: rootStyles.getPropertyValue('--c-color-customGreen').trim(),
      testDifferent: rootStyles.getPropertyValue('--c-color-testsomethingdifferent').trim(),
    }
  })

  expect(cssVariables.customRed).toBe('#ff0000')
  expect(cssVariables.customBlue).toBe('#0000ff')
  expect(cssVariables.customGreen).toBe('#00ff00')
  expect(cssVariables.testDifferent).toBe('#ff0000')
})
