/**
 * Native press style tests WITHOUT gesture handler (usePressability fallback)
 *
 * This test runs with RNGH disabled via launch args to verify that press handling
 * works correctly when falling back to RN's usePressability.
 */

import { by, device, element, expect, waitFor } from 'detox'
import * as fs from 'fs'
import * as assert from 'assert'
import { PNG } from 'pngjs'
import { navigateToTestCase } from './utils/navigation'
import { getDominantColor, isBlueish, formatRGB } from './utils/colors'

async function navigateToPressStyleNative() {
  await navigateToTestCase('PressStyleNative', 'color-test-pressable')
  // navigateToTestCase re-enables sync, but we need it disabled for no-RNGH tests
  // because the RNManualRecognizer gesture blocks Detox synchronization in CI
  await device.disableSynchronization()
}

describe('PressStyleNative (no RNGH)', () => {
  beforeAll(async () => {
    // launch with RNGH disabled
    await device.launchApp({
      newInstance: true,
      launchArgs: { disableGestureHandler: true },
    })
    // disable synchronization for the entire suite - without RNGH, there's a
    // RNManualRecognizer gesture that stays in "Possible" state which blocks Detox
    await device.disableSynchronization()
  })

  afterAll(async () => {
    await device.enableSynchronization()
  })

  beforeEach(async () => {
    // reload but keep the launch args
    await device.reloadReactNative()
    // wait for app to stabilize after reload
    await new Promise((resolve) => setTimeout(resolve, 800))
    await navigateToPressStyleNative()
  })

  it('should render the test case screen', async () => {
    await waitFor(element(by.id('color-test-pressable'))).toBeVisible().withTimeout(5000)
    await waitFor(element(by.id('animated-color-test-pressable'))).toBeVisible().withTimeout(5000)
  })

  describe('pressStyle without transition', () => {
    it('should fire pressIn and pressOut events on tap', async () => {
      await waitFor(element(by.id('simple-press-in-count'))).toHaveText('In: 0').withTimeout(5000)
      await waitFor(element(by.id('simple-press-out-count'))).toHaveText('Out: 0').withTimeout(5000)

      await element(by.id('color-test-pressable')).tap()
      await new Promise((resolve) => setTimeout(resolve, 300))

      await waitFor(element(by.id('simple-press-in-count'))).toHaveText('In: 1').withTimeout(5000)
      await waitFor(element(by.id('simple-press-out-count'))).toHaveText('Out: 1').withTimeout(5000)
    })

    it('should not be stuck in pressed state after tap', async () => {
      await element(by.id('color-test-pressable')).tap()
      await new Promise((resolve) => setTimeout(resolve, 300))
      await waitFor(element(by.id('simple-is-pressed'))).toHaveText('Pressed: NO').withTimeout(5000)
    })

    it('should show blue background at rest', async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const restScreenshot = await element(by.id('color-test-pressable')).takeScreenshot(
        'color-test-rest-norngh'
      )
      const color = getDominantColor(restScreenshot)
      assert.ok(isBlueish(color), `Expected blue at rest, got ${formatRGB(color)}`)
    })

    it('should unpress when finger drags off element', async () => {
      await waitFor(element(by.id('simple-press-in-count'))).toHaveText('In: 0').withTimeout(5000)
      await waitFor(element(by.id('simple-press-out-count'))).toHaveText('Out: 0').withTimeout(5000)

      await element(by.id('color-test-pressable')).longPressAndDrag(
        500,
        0.5,
        0.5,
        element(by.id('press-style-native-root')),
        0.5,
        0.1,
        'slow',
        100
      )

      await new Promise((resolve) => setTimeout(resolve, 400))

      await waitFor(element(by.id('simple-press-in-count'))).toHaveText('In: 1').withTimeout(5000)
      await waitFor(element(by.id('simple-press-out-count'))).toHaveText('Out: 1').withTimeout(5000)
      await waitFor(element(by.id('simple-is-pressed'))).toHaveText('Pressed: NO').withTimeout(5000)
    })

    it('should return to blue after drag off', async () => {
      await element(by.id('color-test-pressable')).longPressAndDrag(
        500,
        0.5,
        0.5,
        element(by.id('press-style-native-root')),
        0.5,
        0.1,
        'slow',
        100
      )

      await new Promise((resolve) => setTimeout(resolve, 400))

      const afterScreenshot = await element(by.id('color-test-pressable')).takeScreenshot(
        'color-test-after-drag-norngh'
      )
      const color = getDominantColor(afterScreenshot)
      assert.ok(isBlueish(color), `Expected blue after drag off, got ${formatRGB(color)}`)
    })
  })

  describe('pressStyle with transition (animation driver)', () => {
    it('should fire pressIn and pressOut events on animated pressable', async () => {
      await waitFor(element(by.id('animated-press-in-count'))).toHaveText('In: 0').withTimeout(5000)
      await waitFor(element(by.id('animated-press-out-count'))).toHaveText('Out: 0').withTimeout(5000)

      await element(by.id('animated-color-test-pressable')).tap()
      await new Promise((resolve) => setTimeout(resolve, 300))

      await waitFor(element(by.id('animated-press-in-count'))).toHaveText('In: 1').withTimeout(5000)
      await waitFor(element(by.id('animated-press-out-count'))).toHaveText('Out: 1').withTimeout(5000)
    })

    it('should not be stuck in pressed state after tap (animated)', async () => {
      await element(by.id('animated-color-test-pressable')).tap()
      await new Promise((resolve) => setTimeout(resolve, 300))
      await waitFor(element(by.id('animated-is-pressed'))).toHaveText('Pressed: NO').withTimeout(5000)
    })

    it('should show blue background at rest (animated)', async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const restScreenshot = await element(by.id('animated-color-test-pressable')).takeScreenshot(
        'animated-color-test-rest-norngh'
      )
      const color = getDominantColor(restScreenshot)
      assert.ok(isBlueish(color), `Expected blue at rest (animated), got ${formatRGB(color)}`)
    })
  })
})
