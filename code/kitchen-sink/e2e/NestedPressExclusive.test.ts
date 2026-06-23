/**
 * Detox E2E tests for nested press exclusivity
 *
 * Tests verify that when Tamagui components (using RNGH) are nested inside
 * RN Pressable or other Tamagui pressables, only the innermost fires onPress.
 * This matches RN Pressable/responder semantics.
 */

import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'
import { safeLaunchApp, withSync } from './utils/detox'

async function tapForCurrentPlatform(testID: string, point?: { x: number; y: number }) {
  if (device.getPlatform() === 'android') {
    if (point) {
      await element(by.id(testID)).tap(point)
    } else {
      await element(by.id(testID)).tap()
    }
    return
  }

  await withSync(() => element(by.id(testID)).tap(point as any))
}

describe('NestedPressExclusive', () => {
  beforeAll(async () => {
    await safeLaunchApp({ newInstance: true })
    await navigateToTestCase('NestedPressExclusive', 'nested-press-root')
  })

  it('should render the test case screen', async () => {
    await expect(element(by.id('tamagui-button-solo'))).toBeVisible()
    await expect(element(by.id('rn-pressable-parent'))).toBeVisible()
    await expect(element(by.id('tamagui-button-child'))).toBeVisible()
  })

  it('should fire a standalone Tamagui button press', async () => {
    await expect(element(by.id('solo-press-count'))).toHaveText('Solo: 0')
    await expect(element(by.id('solo-press-in-count'))).toHaveText('Solo in: 0')
    await expect(element(by.id('solo-press-out-count'))).toHaveText('Solo out: 0')

    await tapForCurrentPlatform('tamagui-button-solo')
    await new Promise((resolve) => setTimeout(resolve, 400))

    await expect(element(by.id('solo-press-in-count'))).toHaveText('Solo in: 1')
    await expect(element(by.id('solo-press-out-count'))).toHaveText('Solo out: 1')
    await expect(element(by.id('solo-press-count'))).toHaveText('Solo: 1')
  })

  it('should fire only the child on child tap', async () => {
    await expect(element(by.id('parent-press-count'))).toHaveText('Parent: 0')
    await expect(element(by.id('child-press-count'))).toHaveText('Child: 0')
    await expect(element(by.id('child-press-in-count'))).toHaveText('Child in: 0')
    await expect(element(by.id('child-press-out-count'))).toHaveText('Child out: 0')

    await tapForCurrentPlatform('tamagui-button-child')
    await new Promise((resolve) => setTimeout(resolve, 400))

    await expect(element(by.id('parent-press-count'))).toHaveText('Parent: 0')
    await expect(element(by.id('child-press-in-count'))).toHaveText('Child in: 1')
    await expect(element(by.id('child-press-out-count'))).toHaveText('Child out: 1')
    await expect(element(by.id('child-press-count'))).toHaveText('Child: 1')
    await expect(element(by.id('last-pressed'))).toHaveText('Last pressed: child')
  })

  it('should fire the parent when tapping outside the child button', async () => {
    await tapForCurrentPlatform('nested-press-reset')
    await waitFor(element(by.id('parent-press-count')))
      .toHaveText('Parent: 0')
      .withTimeout(3000)
    await waitFor(element(by.id('child-press-count')))
      .toHaveText('Child: 0')
      .withTimeout(3000)

    // the parent has 20px padding, so tap near the top-left padding area away from the child
    await tapForCurrentPlatform('rn-pressable-parent', { x: 10, y: 10 })
    await waitFor(element(by.id('parent-press-count')))
      .toHaveText('Parent: 1')
      .withTimeout(3000)

    await expect(element(by.id('parent-press-count'))).toHaveText('Parent: 1')
    await expect(element(by.id('child-press-count'))).toHaveText('Child: 0')
    await expect(element(by.id('last-pressed'))).toHaveText('Last pressed: parent')
  })
})
