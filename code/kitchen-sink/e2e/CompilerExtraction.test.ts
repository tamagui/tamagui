/**
 * Tests compiler extraction with theme functionality.
 *
 * Verifies that extracted components work correctly with:
 * - Simple extraction (static values)
 * - Advanced extraction ($colorN tokens)
 * - Light/dark mode switching
 * - Sub-theme changes
 *
 * The test case has "// debug" at the top which outputs extraction
 * info during build. If extraction is working, you'll see optimized
 * styles in the Metro console.
 */

import * as assert from 'assert'
import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'
import {
  getDominantColor,
  isBlueish,
  isGreenish,
  isReddish,
  formatRGB,
} from './utils/colors'

describe('CompilerExtraction', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('CompilerExtraction', 'compiler-extraction-root')
  })

  it('should render all extracted components', async () => {
    await expect(element(by.id('compiler-extraction-root'))).toBeVisible()
    await expect(element(by.id('compiler-simple-box'))).toBeVisible()
    await expect(element(by.id('compiler-advanced-box'))).toBeVisible()
    await expect(element(by.id('compiler-subtheme-box'))).toBeVisible()
  })

  it('should show correct initial state (light mode, red sub-theme)', async () => {
    await expect(element(by.id('compiler-mode-label'))).toHaveText('Mode: light')
    await expect(element(by.id('compiler-subtheme-label'))).toHaveText('Sub-theme (red):')
  })

  it('should toggle between light and dark mode', async () => {
    // start in light mode
    await expect(element(by.id('compiler-mode-label'))).toHaveText('Mode: light')

    // toggle to dark
    await element(by.id('compiler-toggle-mode')).tap()
    await waitFor(element(by.id('compiler-mode-label')))
      .toHaveText('Mode: dark')
      .withTimeout(3000)

    // toggle back to light
    await element(by.id('compiler-toggle-mode')).tap()
    await waitFor(element(by.id('compiler-mode-label')))
      .toHaveText('Mode: light')
      .withTimeout(3000)
  })

  it('should update advanced box colors on light/dark toggle', async () => {
    // take screenshot in light mode
    await new Promise((r) => setTimeout(r, 300))
    const lightScreenshot = await element(by.id('compiler-advanced-box')).takeScreenshot(
      'advanced-light'
    )
    const lightColor = getDominantColor(lightScreenshot)
    console.log(`Light mode color: ${formatRGB(lightColor)}`)

    // toggle to dark mode
    await element(by.id('compiler-toggle-mode')).tap()
    await waitFor(element(by.id('compiler-mode-label')))
      .toHaveText('Mode: dark')
      .withTimeout(3000)

    // small delay for visual update
    await new Promise((r) => setTimeout(r, 300))
    const darkScreenshot = await element(by.id('compiler-advanced-box')).takeScreenshot(
      'advanced-dark'
    )
    const darkColor = getDominantColor(darkScreenshot)
    console.log(`Dark mode color: ${formatRGB(darkColor)}`)

    // colors should be different between light and dark modes
    const colorsDiffer =
      Math.abs(lightColor.r - darkColor.r) > 20 ||
      Math.abs(lightColor.g - darkColor.g) > 20 ||
      Math.abs(lightColor.b - darkColor.b) > 20
    assert.ok(
      colorsDiffer,
      `Expected light/dark colors to differ: light=${formatRGB(lightColor)}, dark=${formatRGB(darkColor)}`
    )
  })

  it('should cycle sub-theme colors (red -> blue -> green)', async () => {
    // initial state: red sub-theme
    await expect(element(by.id('compiler-subtheme-label'))).toHaveText('Sub-theme (red):')
    await new Promise((r) => setTimeout(r, 300))
    const redScreenshot = await element(by.id('compiler-subtheme-box')).takeScreenshot(
      'subtheme-red'
    )
    const redColor = getDominantColor(redScreenshot)
    console.log(`Red sub-theme color: ${formatRGB(redColor)}`)
    assert.ok(isReddish(redColor), `Expected reddish color, got ${formatRGB(redColor)}`)

    // cycle to blue
    await element(by.id('compiler-cycle-subtheme')).tap()
    await waitFor(element(by.id('compiler-subtheme-label')))
      .toHaveText('Sub-theme (blue):')
      .withTimeout(3000)
    await new Promise((r) => setTimeout(r, 300))
    const blueScreenshot = await element(by.id('compiler-subtheme-box')).takeScreenshot(
      'subtheme-blue'
    )
    const blueColor = getDominantColor(blueScreenshot)
    console.log(`Blue sub-theme color: ${formatRGB(blueColor)}`)
    assert.ok(isBlueish(blueColor), `Expected blueish color, got ${formatRGB(blueColor)}`)

    // cycle to green
    await element(by.id('compiler-cycle-subtheme')).tap()
    await waitFor(element(by.id('compiler-subtheme-label')))
      .toHaveText('Sub-theme (green):')
      .withTimeout(3000)
    await new Promise((r) => setTimeout(r, 300))
    const greenScreenshot = await element(by.id('compiler-subtheme-box')).takeScreenshot(
      'subtheme-green'
    )
    const greenColor = getDominantColor(greenScreenshot)
    console.log(`Green sub-theme color: ${formatRGB(greenColor)}`)
    assert.ok(isGreenish(greenColor), `Expected greenish color, got ${formatRGB(greenColor)}`)
  })

  it('should maintain sub-theme colors after light/dark toggle', async () => {
    // set sub-theme to blue
    await element(by.id('compiler-cycle-subtheme')).tap()
    await waitFor(element(by.id('compiler-subtheme-label')))
      .toHaveText('Sub-theme (blue):')
      .withTimeout(3000)

    // verify blue in light mode
    await new Promise((r) => setTimeout(r, 300))
    const blueLightScreenshot = await element(
      by.id('compiler-subtheme-box')
    ).takeScreenshot('subtheme-blue-light')
    const blueLightColor = getDominantColor(blueLightScreenshot)
    assert.ok(
      isBlueish(blueLightColor),
      `Expected blueish in light mode, got ${formatRGB(blueLightColor)}`
    )

    // toggle to dark mode
    await element(by.id('compiler-toggle-mode')).tap()
    await waitFor(element(by.id('compiler-mode-label')))
      .toHaveText('Mode: dark')
      .withTimeout(3000)

    // verify still blue (different shade) in dark mode
    await new Promise((r) => setTimeout(r, 300))
    const blueDarkScreenshot = await element(by.id('compiler-subtheme-box')).takeScreenshot(
      'subtheme-blue-dark'
    )
    const blueDarkColor = getDominantColor(blueDarkScreenshot)
    // should still be predominantly blue
    assert.ok(
      isBlueish(blueDarkColor),
      `Expected blueish in dark mode, got ${formatRGB(blueDarkColor)}`
    )
  })
})
