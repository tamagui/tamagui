/**
 * Test for theme mutation with DynamicColorIOS optimization.
 *
 * This tests that updateTheme() properly triggers re-renders on iOS
 * even when using DynamicColorIOS optimization (which avoids tracking
 * theme keys for performance).
 *
 * The fix ensures forceUpdateThemes() properly forces re-renders
 * regardless of whether theme keys were tracked.
 *
 * NOTE: Uses launchApp({ newInstance: true }) instead of reloadReactNative() to
 * avoid transient Metro module resolution errors during reload (the addTheme/
 * updateTheme runtime mutations can confuse Metro's module cache on reload).
 */

import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'

describe('ThemeMutation', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    // use launchApp instead of reloadReactNative to avoid transient Metro errors
    await device.launchApp({ newInstance: true })
    await navigateToTestCase('ThemeMutation', 'theme-mutation-button')
  })

  it('should navigate to ThemeMutation test case', async () => {
    await expect(element(by.id('theme-mutation-button'))).toBeVisible()
  })

  it('should show initial red color', async () => {
    // verify the initial color text shows red
    await expect(element(by.id('theme-mutation-color-text'))).toHaveText(
      'Expected color: red'
    )
    // verify the square is visible
    await expect(element(by.id('theme-mutation-square'))).toBeVisible()
  })

  it('should update theme color when button is pressed', async () => {
    // initial state should be red
    await expect(element(by.id('theme-mutation-color-text'))).toHaveText(
      'Expected color: red'
    )

    // tap the button to change theme color
    await element(by.id('theme-mutation-button')).tap()

    // wait for the color to update to blue
    await waitFor(element(by.id('theme-mutation-color-text')))
      .toHaveText('Expected color: blue')
      .withTimeout(5000)

    // verify the square is still visible (component re-rendered)
    await expect(element(by.id('theme-mutation-square'))).toBeVisible()
  })

  it('should cycle through multiple theme colors', async () => {
    const colors = ['red', 'blue', 'green', 'purple', 'orange']

    for (let i = 0; i < colors.length; i++) {
      const expectedColor = colors[i]
      await expect(element(by.id('theme-mutation-color-text'))).toHaveText(
        `Expected color: ${expectedColor}`
      )

      // tap to cycle to next color (except on last iteration)
      if (i < colors.length - 1) {
        await element(by.id('theme-mutation-button')).tap()
        await waitFor(element(by.id('theme-mutation-color-text')))
          .toHaveText(`Expected color: ${colors[i + 1]}`)
          .withTimeout(5000)
      }
    }

    // verify it cycles back to red after orange
    await element(by.id('theme-mutation-button')).tap()
    await waitFor(element(by.id('theme-mutation-color-text')))
      .toHaveText('Expected color: red')
      .withTimeout(5000)
  })
})
