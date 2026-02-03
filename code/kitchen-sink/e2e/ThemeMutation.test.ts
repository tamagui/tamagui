/**
 * Test for theme mutation with DynamicColorIOS optimization.
 *
 * This tests that updateTheme() properly triggers re-renders on iOS
 * even when using DynamicColorIOS optimization (which avoids tracking
 * theme keys for performance).
 *
 * The fix ensures forceUpdateThemes() properly forces re-renders
 * regardless of whether theme keys were tracked.
 */

import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'

describe('ThemeMutation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('ThemeMutation', 'theme-mutation-button')
  })

  it('should navigate to ThemeMutation test case', async () => {
    await expect(element(by.id('theme-mutation-button'))).toBeVisible()
  })

  it('should show initial red color', async () => {
    // Verify the initial color text shows red
    await expect(element(by.id('theme-mutation-color-text'))).toHaveText(
      'Expected color: red'
    )
    // Verify the square is visible
    await expect(element(by.id('theme-mutation-square'))).toBeVisible()
  })

  it('should update theme color when button is pressed', async () => {
    // Initial state should be red
    await expect(element(by.id('theme-mutation-color-text'))).toHaveText(
      'Expected color: red'
    )

    // Tap the button to change theme color
    await element(by.id('theme-mutation-button')).tap()

    // Wait for the color to update to blue
    await waitFor(element(by.id('theme-mutation-color-text')))
      .toHaveText('Expected color: blue')
      .withTimeout(5000)

    // Verify the square is still visible (component re-rendered)
    await expect(element(by.id('theme-mutation-square'))).toBeVisible()
  })

  it('should cycle through multiple theme colors', async () => {
    const colors = ['red', 'blue', 'green', 'purple', 'orange']

    for (let i = 0; i < colors.length; i++) {
      const expectedColor = colors[i]
      await expect(element(by.id('theme-mutation-color-text'))).toHaveText(
        `Expected color: ${expectedColor}`
      )

      // Tap to cycle to next color (except on last iteration)
      if (i < colors.length - 1) {
        await element(by.id('theme-mutation-button')).tap()
        await waitFor(element(by.id('theme-mutation-color-text')))
          .toHaveText(`Expected color: ${colors[i + 1]}`)
          .withTimeout(5000)
      }
    }

    // Verify it cycles back to red after orange
    await element(by.id('theme-mutation-button')).tap()
    await waitFor(element(by.id('theme-mutation-color-text')))
      .toHaveText('Expected color: red')
      .withTimeout(5000)
  })
})
