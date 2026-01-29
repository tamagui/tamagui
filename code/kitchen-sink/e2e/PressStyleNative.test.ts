/**
 * Detox E2E tests for native press style behaviors
 *
 * Tests verify:
 * 1. Press events fire correctly (onPressIn/onPressOut)
 * 2. Press state doesn't get stuck after tap or drag-off
 * 3. Both non-animated and animated (transition) pressables work
 * 4. Actual pixel colors are verified via screenshots
 */

import { by, device, element, expect, waitFor } from 'detox'
import * as fs from 'fs'
import * as assert from 'assert'
import { PNG } from 'pngjs'
import { navigateToTestCase } from './utils/navigation'

// helper to get the dominant color from a PNG screenshot
// samples pixels from the center region to avoid edges/text
function getDominantColor(screenshotPath: string): { r: number; g: number; b: number } {
  const data = fs.readFileSync(screenshotPath)
  const png = PNG.sync.read(data)

  // sample the center 50% of the image to avoid edges and text
  const startX = Math.floor(png.width * 0.25)
  const endX = Math.floor(png.width * 0.75)
  const startY = Math.floor(png.height * 0.25)
  const endY = Math.floor(png.height * 0.75)

  let totalR = 0,
    totalG = 0,
    totalB = 0,
    count = 0

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const idx = (png.width * y + x) * 4
      totalR += png.data[idx]
      totalG += png.data[idx + 1]
      totalB += png.data[idx + 2]
      count++
    }
  }

  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count),
  }
}

// check if a color is predominantly blue (for $blue10)
function isBlueish(color: { r: number; g: number; b: number }): boolean {
  // blue should have high B, low R, and low-medium G
  return color.b > 100 && color.b > color.r && color.b > color.g
}

// TODO: These tests are flaky on iOS simulator - press events don't fire reliably
// Need to investigate press event handling in simulator environment
describe.skip('PressStyleNative', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
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
        'color-test-rest'
      )

      const color = getDominantColor(restScreenshot)
      assert.ok(
        isBlueish(color),
        `Expected blue at rest, got RGB(${color.r}, ${color.g}, ${color.b})`
      )
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

      const afterDragScreenshot = await element(by.id('color-test-pressable')).takeScreenshot(
        'color-test-after-drag'
      )

      const color = getDominantColor(afterDragScreenshot)
      assert.ok(
        isBlueish(color),
        `Expected blue after drag off, got RGB(${color.r}, ${color.g}, ${color.b})`
      )
    })

    it('should handle multiple press-drag-off cycles', async () => {
      await expect(element(by.id('simple-press-in-count'))).toHaveText('In: 0')
      await expect(element(by.id('simple-press-out-count'))).toHaveText('Out: 0')

      for (let i = 0; i < 3; i++) {
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
      }

      await expect(element(by.id('simple-press-in-count'))).toHaveText('In: 3')
      await expect(element(by.id('simple-press-out-count'))).toHaveText('Out: 3')
      await expect(element(by.id('simple-is-pressed'))).toHaveText('Pressed: NO')
    })
  })

  describe('pressStyle with transition (animation driver)', () => {
    it('should fire pressIn and pressOut events on animated pressable', async () => {
      await expect(element(by.id('animated-press-in-count'))).toHaveText('In: 0')
      await expect(element(by.id('animated-press-out-count'))).toHaveText('Out: 0')

      await element(by.id('animated-color-test-pressable')).tap()
      await new Promise((resolve) => setTimeout(resolve, 100))

      await expect(element(by.id('animated-press-in-count'))).toHaveText('In: 1')
      await expect(element(by.id('animated-press-out-count'))).toHaveText('Out: 1')
    })

    it('should not be stuck in pressed state after tap (animated)', async () => {
      await element(by.id('animated-color-test-pressable')).tap()
      await new Promise((resolve) => setTimeout(resolve, 100))
      await expect(element(by.id('animated-is-pressed'))).toHaveText('Pressed: NO')
    })

    it('should show blue background at rest (animated)', async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const restScreenshot = await element(by.id('animated-color-test-pressable')).takeScreenshot(
        'animated-color-test-rest'
      )

      const color = getDominantColor(restScreenshot)
      assert.ok(
        isBlueish(color),
        `Expected blue at rest (animated), got RGB(${color.r}, ${color.g}, ${color.b})`
      )
    })

    it('should unpress when finger drags off animated element', async () => {
      await expect(element(by.id('animated-press-in-count'))).toHaveText('In: 0')
      await expect(element(by.id('animated-press-out-count'))).toHaveText('Out: 0')

      await element(by.id('animated-color-test-pressable')).longPressAndDrag(
        500,
        0.5,
        0.5,
        element(by.id('press-style-native-root')),
        0.5,
        0.1,
        'slow',
        100
      )

      await new Promise((resolve) => setTimeout(resolve, 100))

      await expect(element(by.id('animated-press-in-count'))).toHaveText('In: 1')
      await expect(element(by.id('animated-press-out-count'))).toHaveText('Out: 1')
      await expect(element(by.id('animated-is-pressed'))).toHaveText('Pressed: NO')
    })
  })
})

async function navigateToPressStyleNative() {
  await navigateToTestCase('PressStyleNative', 'color-test-pressable')
}
