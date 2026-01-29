/**
 * Basic theme change test - verifies Theme component correctly updates children
 * when theme name changes (no animations involved).
 *
 * This tests the core theme switching functionality that was broken
 * with react-native and reanimated animation drivers.
 */

import * as assert from 'assert'
import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'
import { getDominantColor, isBlueish, isReddish, formatRGB } from './utils/colors'

describe('ThemeChangeBasic', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('ThemeChangeBasic', 'theme-change-basic-root')
  })

  it('should show initial red theme', async () => {
    await expect(element(by.id('theme-change-basic-label'))).toHaveText('Current theme: red')
    await expect(element(by.id('theme-change-basic-square'))).toBeVisible()
  })

  it('should change theme color when toggle is pressed', async () => {
    // verify initial red state
    await expect(element(by.id('theme-change-basic-label'))).toHaveText('Current theme: red')

    // take screenshot of red state
    const redScreenshot = await element(by.id('theme-change-basic-square')).takeScreenshot(
      'theme-red'
    )
    const redColor = getDominantColor(redScreenshot)
    console.log(`Red theme color: ${formatRGB(redColor)}`)

    // tap to change to blue
    await element(by.id('theme-change-basic-toggle')).tap()

    // wait for theme to update
    await waitFor(element(by.id('theme-change-basic-label')))
      .toHaveText('Current theme: blue')
      .withTimeout(5000)

    // small delay for any potential visual updates
    await new Promise((r) => setTimeout(r, 300))

    // take screenshot of blue state
    const blueScreenshot = await element(by.id('theme-change-basic-square')).takeScreenshot(
      'theme-blue'
    )
    const blueColor = getDominantColor(blueScreenshot)
    console.log(`Blue theme color: ${formatRGB(blueColor)}`)

    // verify colors changed
    // red theme $color4 should be reddish
    assert.ok(isReddish(redColor), `Expected red color to be reddish, got ${formatRGB(redColor)}`)
    // blue theme $color4 should be blueish
    assert.ok(isBlueish(blueColor), `Expected blue color to be blueish, got ${formatRGB(blueColor)}`)

    // extra verification: the colors should be different
    const colorsDiffer =
      Math.abs(redColor.r - blueColor.r) > 30 || Math.abs(redColor.b - blueColor.b) > 30
    assert.ok(colorsDiffer, `Expected colors to be different: red=${formatRGB(redColor)}, blue=${formatRGB(blueColor)}`)
  })

  it('should toggle theme multiple times', async () => {
    // start at red
    await expect(element(by.id('theme-change-basic-label'))).toHaveText('Current theme: red')

    // toggle to blue
    await element(by.id('theme-change-basic-toggle')).tap()
    await waitFor(element(by.id('theme-change-basic-label')))
      .toHaveText('Current theme: blue')
      .withTimeout(5000)

    // verify blue color
    await new Promise((r) => setTimeout(r, 300))
    const blueScreenshot = await element(by.id('theme-change-basic-square')).takeScreenshot(
      'theme-blue-toggle'
    )
    const blueColor = getDominantColor(blueScreenshot)
    assert.ok(isBlueish(blueColor), `Expected blue color to be blueish, got ${formatRGB(blueColor)}`)

    // toggle back to red
    await element(by.id('theme-change-basic-toggle')).tap()
    await waitFor(element(by.id('theme-change-basic-label')))
      .toHaveText('Current theme: red')
      .withTimeout(5000)

    // verify red color
    await new Promise((r) => setTimeout(r, 300))
    const redScreenshot = await element(by.id('theme-change-basic-square')).takeScreenshot(
      'theme-red-toggle'
    )
    const redColor = getDominantColor(redScreenshot)
    assert.ok(isReddish(redColor), `Expected red color to be reddish, got ${formatRGB(redColor)}`)
  })
})
