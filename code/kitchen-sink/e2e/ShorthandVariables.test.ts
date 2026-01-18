/**
 * Test for CSS shorthand properties with embedded $variables on native.
 *
 * This tests that boxShadow with $variable tokens properly resolves
 * and renders on React Native 0.76+ with the New Architecture.
 *
 * Since we can't directly inspect computed styles in Detox, we verify:
 * 1. Elements render without crashing
 * 2. Elements are visible (which means the boxShadow style was accepted)
 * 3. The app doesn't show any red box errors
 */

import { by, device, element, expect, waitFor } from 'detox'

describe('ShorthandVariables', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToShorthandVariables()
  })

  it('should render boxShadow with $variable without crashing', async () => {
    // If this element is visible, the boxShadow="0px 0px 10px $shadowColor" was accepted
    await expect(element(by.id('boxshadow-var'))).toBeVisible()
  })

  it('should render boxShadow with multiple $variables', async () => {
    // boxShadow="0px 0px 5px $shadowColor, 0px 0px 15px $color"
    await expect(element(by.id('boxshadow-multi'))).toBeVisible()
  })

  it('should render border with $variable on native (via individual props)', async () => {
    // On native, this uses borderWidth + borderColor + borderStyle
    await expect(element(by.id('border-var'))).toBeVisible()
  })

  it('should render plain boxShadow without variables', async () => {
    // boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
    await expect(element(by.id('boxshadow-plain'))).toBeVisible()
  })

  it('should render all four test boxes', async () => {
    // Verify all elements render together without layout issues
    await expect(element(by.id('boxshadow-var'))).toBeVisible()
    await expect(element(by.id('boxshadow-multi'))).toBeVisible()
    await expect(element(by.id('border-var'))).toBeVisible()
    await expect(element(by.id('boxshadow-plain'))).toBeVisible()
  })
})

async function navigateToShorthandVariables() {
  // Wait for app to load
  await waitFor(element(by.text('Kitchen Sink')))
    .toExist()
    .withTimeout(60000)

  // Give the app a moment to fully render
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Tap "Test Cases" using testID
  await waitFor(element(by.id('home-test-cases-link')))
    .toBeVisible()
    .withTimeout(10000)
  await element(by.id('home-test-cases-link')).tap()

  // Wait for Test Cases screen to load
  await waitFor(element(by.text('All Test Cases')))
    .toExist()
    .withTimeout(10000)

  // Small delay for the list to render
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Scroll to and tap ShorthandVariables test case
  await waitFor(element(by.id('test-case-ShorthandVariables')))
    .toBeVisible()
    .whileElement(by.id('test-cases-scroll-view'))
    .scroll(600, 'down', Number.NaN, Number.NaN)

  await element(by.id('test-case-ShorthandVariables')).tap()

  // Wait for the test screen to load
  await waitFor(element(by.id('boxshadow-var')))
    .toExist()
    .withTimeout(10000)
}
