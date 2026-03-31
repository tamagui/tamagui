/**
 * Native press style tests WITHOUT gesture handler (responder fallback)
 *
 * This test runs with RNGH disabled via launch args to verify that press handling
 * works correctly when falling back to the responder system.
 *
 * IMPORTANT: Detox sync must be enabled for tap/gesture actions on RN 0.83 Fabric.
 * With sync disabled, Detox doesn't properly deliver touch events through the
 * responder system. We keep sync disabled for navigation (animation driver blocks
 * it) but enable it briefly around each interaction.
 */

import { by, device, element, expect, waitFor } from 'detox'
import * as fs from 'fs'
import * as assert from 'assert'
import { PNG } from 'pngjs'
import { navigateToTestCase } from './utils/navigation'
import { getDominantColor, isBlueish, formatRGB } from './utils/colors'
import { safeLaunchApp, safeReloadApp, withSync } from './utils/detox'

async function navigateToPressStyleNative() {
  await navigateToTestCase('PressStyleNative', 'color-test-pressable', {
    skipEnableSync: true,
  })
}

describe('PressStyleNative (no RNGH)', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { disableGestureHandler: true },
    })
  })

  afterAll(async () => {
    await device.enableSynchronization()
  })

  beforeEach(async () => {
    await safeReloadApp()
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await navigateToPressStyleNative()
  })

  it('should render the test case screen', async () => {
    await waitFor(element(by.id('color-test-pressable')))
      .toBeVisible()
      .withTimeout(5000)
    await waitFor(element(by.id('animated-color-test-pressable')))
      .toBeVisible()
      .withTimeout(5000)
  })

  describe('pressStyle without transition', () => {
    it('should fire pressIn and pressOut events on tap', async () => {
      await waitFor(element(by.id('simple-press-in-count')))
        .toHaveText('In: 0')
        .withTimeout(5000)
      await waitFor(element(by.id('simple-press-out-count')))
        .toHaveText('Out: 0')
        .withTimeout(5000)

      await withSync(() => element(by.id('color-test-pressable')).tap())
      await new Promise((resolve) => setTimeout(resolve, 500))

      await waitFor(element(by.id('simple-press-in-count')))
        .toHaveText('In: 1')
        .withTimeout(5000)
      await waitFor(element(by.id('simple-press-out-count')))
        .toHaveText('Out: 1')
        .withTimeout(5000)
    })

    it('should not be stuck in pressed state after tap', async () => {
      await withSync(() => element(by.id('color-test-pressable')).tap())
      await new Promise((resolve) => setTimeout(resolve, 500))
      await waitFor(element(by.id('simple-is-pressed')))
        .toHaveText('Pressed: NO')
        .withTimeout(5000)
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
      await waitFor(element(by.id('simple-press-in-count')))
        .toHaveText('In: 0')
        .withTimeout(5000)
      await waitFor(element(by.id('simple-press-out-count')))
        .toHaveText('Out: 0')
        .withTimeout(5000)

      await withSync(() =>
        element(by.id('color-test-pressable')).longPressAndDrag(
          500,
          0.5,
          0.5,
          element(by.id('press-style-native-root')),
          0.5,
          0.1,
          'slow',
          100
        )
      )

      await new Promise((resolve) => setTimeout(resolve, 500))

      await waitFor(element(by.id('simple-press-in-count')))
        .toHaveText('In: 1')
        .withTimeout(5000)
      await waitFor(element(by.id('simple-press-out-count')))
        .toHaveText('Out: 1')
        .withTimeout(5000)
      await waitFor(element(by.id('simple-is-pressed')))
        .toHaveText('Pressed: NO')
        .withTimeout(5000)
    })

    it('should return to blue after drag off', async () => {
      await withSync(() =>
        element(by.id('color-test-pressable')).longPressAndDrag(
          500,
          0.5,
          0.5,
          element(by.id('press-style-native-root')),
          0.5,
          0.1,
          'slow',
          100
        )
      )

      await new Promise((resolve) => setTimeout(resolve, 500))

      const afterScreenshot = await element(by.id('color-test-pressable')).takeScreenshot(
        'color-test-after-drag-norngh'
      )
      const color = getDominantColor(afterScreenshot)
      assert.ok(isBlueish(color), `Expected blue after drag off, got ${formatRGB(color)}`)
    })
  })

  describe('pressStyle with transition (animation driver)', () => {
    it('should fire pressIn and pressOut events on animated pressable', async () => {
      await waitFor(element(by.id('animated-press-in-count')))
        .toHaveText('In: 0')
        .withTimeout(5000)
      await waitFor(element(by.id('animated-press-out-count')))
        .toHaveText('Out: 0')
        .withTimeout(5000)

      await withSync(() => element(by.id('animated-color-test-pressable')).tap())
      await new Promise((resolve) => setTimeout(resolve, 500))

      await waitFor(element(by.id('animated-press-in-count')))
        .toHaveText('In: 1')
        .withTimeout(5000)
      await waitFor(element(by.id('animated-press-out-count')))
        .toHaveText('Out: 1')
        .withTimeout(5000)
    })

    it('should not be stuck in pressed state after tap (animated)', async () => {
      await withSync(() => element(by.id('animated-color-test-pressable')).tap())
      await new Promise((resolve) => setTimeout(resolve, 500))
      await waitFor(element(by.id('animated-is-pressed')))
        .toHaveText('Pressed: NO')
        .withTimeout(5000)
    })

    it('should show blue background at rest (animated)', async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const restScreenshot = await element(
        by.id('animated-color-test-pressable')
      ).takeScreenshot('animated-color-test-rest-norngh')
      const color = getDominantColor(restScreenshot)
      assert.ok(
        isBlueish(color),
        `Expected blue at rest (animated), got ${formatRGB(color)}`
      )
    })
  })
})
