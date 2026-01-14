/**
 * Detox tests for v2 web alignment - verifying web-standard props work on native
 *
 * These tests verify that aria-*, role, and other web-standard props
 * correctly map to their RN equivalents on native platforms.
 */

import { by, device, element, expect, waitFor } from 'detox'

describe('WebAlignment', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToWebAlignment()
  })

  describe('aria-label mapping', () => {
    it('should find element by testID with aria-label', async () => {
      // aria-label should map to accessibilityLabel on native
      // Element should be findable and have correct accessibility label
      await expect(element(by.id('aria-label-button'))).toBeVisible()
    })

    it('should allow pressing button with aria-label', async () => {
      await element(by.id('aria-label-button')).tap()
      await expect(element(by.id('last-action-text'))).toHaveText(
        'aria-label button pressed'
      )
    })
  })

  describe('role mapping', () => {
    it('should find Stack with role="button"', async () => {
      // role="button" should map to accessibilityRole="button"
      await expect(element(by.id('role-button-stack'))).toBeVisible()
    })

    it('should allow pressing Stack with role="button"', async () => {
      await element(by.id('role-button-stack')).tap()
      await expect(element(by.id('last-action-text'))).toHaveText('role button pressed')
    })

    it('should find Text with role="link"', async () => {
      // role="link" should map to accessibilityRole="link"
      await expect(element(by.id('role-link-text'))).toBeVisible()
    })

    it('should allow pressing Text with role="link"', async () => {
      await element(by.id('role-link-text')).tap()
      await expect(element(by.id('last-action-text'))).toHaveText('role link pressed')
    })
  })

  describe('aria-disabled mapping', () => {
    it('should find disabled button', async () => {
      // aria-disabled should map to accessibilityState.disabled
      await expect(element(by.id('aria-disabled-button'))).toBeVisible()
    })
  })

  describe('aria-hidden mapping', () => {
    it('should find aria-hidden element', async () => {
      // aria-hidden should map to accessibilityElementsHidden
      // Note: Element may still be visible but hidden from accessibility tree
      await expect(element(by.id('aria-hidden-element'))).toExist()
    })
  })

  describe('tabIndex mapping', () => {
    it('should find focusable element with tabIndex', async () => {
      // tabIndex={0} should make element focusable
      await expect(element(by.id('tabindex-focusable'))).toBeVisible()
    })
  })

  describe('Input with aria props', () => {
    it('should find input with aria props', async () => {
      // aria-label and aria-required should map correctly
      await expect(element(by.id('aria-input'))).toBeVisible()
    })

    it('should allow typing in input with aria props', async () => {
      await element(by.id('aria-input')).typeText('test input')
      await expect(element(by.id('aria-input'))).toHaveText('test input')
    })
  })
})

async function navigateToWebAlignment() {
  // Wait for app to load
  await waitFor(element(by.text('Kitchen Sink')))
    .toExist()
    .withTimeout(60000)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Navigate to Test Cases
  await waitFor(element(by.id('home-test-cases-link')))
    .toBeVisible()
    .withTimeout(10000)
  await element(by.id('home-test-cases-link')).tap()

  // Wait for Test Cases screen
  await waitFor(element(by.text('All Test Cases')))
    .toExist()
    .withTimeout(10000)

  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find and tap WebAlignment test case
  await waitFor(element(by.id('test-case-WebAlignment')))
    .toBeVisible()
    .whileElement(by.id('test-cases-scroll-view'))
    .scroll(600, 'down', Number.NaN, Number.NaN)

  await element(by.id('test-case-WebAlignment')).tap()

  // Wait for test screen to load
  await waitFor(element(by.id('aria-label-button')))
    .toExist()
    .withTimeout(10000)
}
