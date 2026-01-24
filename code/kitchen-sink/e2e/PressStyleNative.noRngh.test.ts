/**
 * Native press style tests WITHOUT gesture handler (usePressability fallback)
 *
 * This test runs with RNGH disabled via launch args to verify that press handling
 * works correctly when falling back to RN's usePressability.
 */

import { by, device, element, expect } from 'detox'
import * as fs from 'fs'
import * as assert from 'assert'
import { PNG } from 'pngjs'
import { navigateToTestCase } from './utils/navigation'
import { getDominantColor, isBlueish, formatRGB } from './utils/colors'

async function navigateToPressStyleNative() {
  await navigateToTestCase('PressStyleNative', 'color-test-pressable')
}

describe('PressStyleNative (no RNGH)', () => {
  beforeAll(async () => {
    // launch with RNGH disabled
    await device.launchApp({
      newInstance: true,
      launchArgs: { disableGestureHandler: true },
    })
  })

  beforeEach(async () => {
    // reload but keep the launch args
    await device.reloadReactNative()
    await navigateToPressStyleNative()
  })

  it('should render the test case screen', async () => {
    await expect(element(by.id('color-test-pressable'))).toBeVisible()
    await expect(element(by.id('animated-color-test-pressable'))).toBeVisible()
  })

  describe('pressStyle without transition', () => {
    it('should fire pressIn and pressOut events on tap', async () => {
      await expect(element(by.id('simple-press-in-count'))).toHaveText('In: 0')
      await expect(element(by.id('simple-press-out-count'))).toHaveText('Out: 0')

      await element(by.id('color-test-pressable')).tap()

      await expect(element(by.id('simple-press-in-count'))).toHaveText('In: 1')
      await expect(element(by.id('simple-press-out-count'))).toHaveText('Out: 1')
    })

    it('should not be stuck in pressed state after tap', async () => {
      await element(by.id('color-test-pressable')).tap()
      await new Promise((resolve) => setTimeout(resolve, 100))
      await expect(element(by.id('simple-is-pressed'))).toHaveText('Pressed: NO')
    })

    it('should show blue background at rest', async () => {
      const restScreenshot = await element(by.id('color-test-pressable')).takeScreenshot(
        'color-test-rest-norngh'
      )
      const color = getDominantColor(restScreenshot)
      assert.ok(isBlueish(color), `Expected blue at rest, got ${formatRGB(color)}`)
    })

    it('should unpress when finger drags off element', async () => {
      await expect(element(by.id('simple-press-in-count'))).toHaveText('In: 0')
      await expect(element(by.id('simple-press-out-count'))).toHaveText('Out: 0')

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

      await new Promise((resolve) => setTimeout(resolve, 200))

      await expect(element(by.id('simple-press-in-count'))).toHaveText('In: 1')
      await expect(element(by.id('simple-press-out-count'))).toHaveText('Out: 1')
      await expect(element(by.id('simple-is-pressed'))).toHaveText('Pressed: NO')
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

      await new Promise((resolve) => setTimeout(resolve, 200))

      const afterScreenshot = await element(by.id('color-test-pressable')).takeScreenshot(
        'color-test-after-drag-norngh'
      )
      const color = getDominantColor(afterScreenshot)
      assert.ok(isBlueish(color), `Expected blue after drag off, got ${formatRGB(color)}`)
    })
  })

  describe('pressStyle with transition (animation driver)', () => {
    it('should fire pressIn and pressOut events on animated pressable', async () => {
      await expect(element(by.id('animated-press-in-count'))).toHaveText('In: 0')
      await expect(element(by.id('animated-press-out-count'))).toHaveText('Out: 0')

      await element(by.id('animated-color-test-pressable')).tap()

      await expect(element(by.id('animated-press-in-count'))).toHaveText('In: 1')
      await expect(element(by.id('animated-press-out-count'))).toHaveText('Out: 1')
    })

    it('should not be stuck in pressed state after tap (animated)', async () => {
      await element(by.id('animated-color-test-pressable')).tap()
      await new Promise((resolve) => setTimeout(resolve, 100))
      await expect(element(by.id('animated-is-pressed'))).toHaveText('Pressed: NO')
    })

    it('should show blue background at rest (animated)', async () => {
      const restScreenshot = await element(by.id('animated-color-test-pressable')).takeScreenshot(
        'animated-color-test-rest-norngh'
      )
      const color = getDominantColor(restScreenshot)
      assert.ok(isBlueish(color), `Expected blue at rest (animated), got ${formatRGB(color)}`)
    })
  })
})
