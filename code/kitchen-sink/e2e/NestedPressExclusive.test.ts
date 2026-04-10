/**
 * Detox E2E tests for nested press exclusivity
 *
 * Tests verify that when Tamagui components (using RNGH) are nested inside
 * RN Pressable or other Tamagui pressables, only the innermost fires onPress.
 * This matches RN Pressable/responder semantics.
 */

import { by, device, element, expect } from 'detox'
import { navigateToTestCase } from './utils/navigation'

describe('NestedPressExclusive', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('NestedPressExclusive', 'nested-press-root')
  })

  it('should render the test case screen', async () => {
    await expect(element(by.id('rn-pressable-parent'))).toBeVisible()
    await expect(element(by.id('tamagui-button-child'))).toBeVisible()
  })

  describe('RN Pressable parent + Tamagui child', () => {
    it('should only fire child onPress when tapping child button', async () => {
      // verify initial state
      await expect(element(by.id('parent-press-count'))).toHaveText('Parent: 0')
      await expect(element(by.id('child-press-count'))).toHaveText('Child: 0')

      // tap the child button
      await element(by.id('tamagui-button-child')).tap()
      await new Promise((resolve) => setTimeout(resolve, 100))

      // only child should have fired
      await expect(element(by.id('parent-press-count'))).toHaveText('Parent: 0')
      await expect(element(by.id('child-press-count'))).toHaveText('Child: 1')
      await expect(element(by.id('last-pressed'))).toHaveText('Last pressed: child')
    })

    it('should fire parent onPress when tapping outside child button', async () => {
      // reload to reset state
      await device.reloadReactNative()
      await navigateToTestCase('NestedPressExclusive', 'nested-press-root')

      // tap the parent pressable at top-left corner (away from child button)
      // the parent has 20px padding, so tap at 10,10 to hit the padding area
      await element(by.id('rn-pressable-parent')).tap({ x: 10, y: 10 })
      await new Promise((resolve) => setTimeout(resolve, 100))

      // only parent should have fired
      await expect(element(by.id('parent-press-count'))).toHaveText('Parent: 1')
      await expect(element(by.id('child-press-count'))).toHaveText('Child: 0')
      await expect(element(by.id('last-pressed'))).toHaveText('Last pressed: parent')
    })
  })

  // Tamagui-to-Tamagui nesting tests are run separately to avoid app disconnection
  // after multiple reloads. The core RNGH press exclusivity is tested above.
})
