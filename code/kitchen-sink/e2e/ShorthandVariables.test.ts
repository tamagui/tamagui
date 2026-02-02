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

import { by, device, element, expect } from 'detox'
import { navigateToTestCase } from './utils/navigation'

describe('ShorthandVariables', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('ShorthandVariables', 'boxshadow-var')
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
