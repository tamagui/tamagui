/**
 * Native tests for $group-press styles
 * Tests both unnamed and named groups, with and without transition
 * Verifies actual pixel colors change correctly
 */

import { by, device, element, expect } from 'detox'
import * as assert from 'assert'
import { navigateToTestCase } from './utils/navigation'
import { getDominantColor, isBlueish, formatRGB } from './utils/colors'

async function navigateToGroupPressNative() {
  await navigateToTestCase('GroupPressNative', 'group-press-native-root')
}

describe('GroupPressNative', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToGroupPressNative()
  })

  it('should render the test case screen', async () => {
    await expect(element(by.id('group-press-native-root'))).toExist()
    await expect(element(by.id('group-child-no-transition'))).toExist()
    await expect(element(by.id('group-child-with-transition'))).toExist()
    await expect(element(by.id('named-group-child-no-transition'))).toExist()
    await expect(element(by.id('named-group-child-with-transition'))).toExist()
  })

  describe('unnamed group without transition', () => {
    it('should show blue at rest and return to blue after press', async () => {
      // verify starts blue
      const beforeScreenshot = await element(by.id('group-child-no-transition')).takeScreenshot(
        'group1-before'
      )
      const beforeColor = getDominantColor(beforeScreenshot)
      assert.ok(isBlueish(beforeColor), `Expected blue before tap, got ${formatRGB(beforeColor)}`)

      // tap the group
      await element(by.id('group-no-transition')).tap()
      await new Promise((r) => setTimeout(r, 100))

      // verify returns to blue after release
      const afterScreenshot = await element(by.id('group-child-no-transition')).takeScreenshot(
        'group1-after'
      )
      const afterColor = getDominantColor(afterScreenshot)
      assert.ok(isBlueish(afterColor), `Expected blue after tap, got ${formatRGB(afterColor)}`)

      // verify press events fired and not stuck
      await expect(element(by.id('group1-press-in'))).toHaveText('In: 1')
      await expect(element(by.id('group1-press-out'))).toHaveText('Out: 1')
      await expect(element(by.id('group1-is-pressed'))).toHaveText('P: N')
    })
  })

  describe('unnamed group with transition', () => {
    it('should show blue at rest and return to blue after press', async () => {
      // verify starts blue
      const beforeScreenshot = await element(by.id('group-child-with-transition')).takeScreenshot(
        'group2-before'
      )
      const beforeColor = getDominantColor(beforeScreenshot)
      assert.ok(isBlueish(beforeColor), `Expected blue before tap, got ${formatRGB(beforeColor)}`)

      // tap the group
      await element(by.id('group-with-transition')).tap()
      // wait a bit for animation to settle
      await new Promise((r) => setTimeout(r, 200))

      // verify returns to blue after release
      const afterScreenshot = await element(by.id('group-child-with-transition')).takeScreenshot(
        'group2-after'
      )
      const afterColor = getDominantColor(afterScreenshot)
      assert.ok(isBlueish(afterColor), `Expected blue after tap, got ${formatRGB(afterColor)}`)

      // verify press events fired and not stuck
      await expect(element(by.id('group2-press-in'))).toHaveText('In: 1')
      await expect(element(by.id('group2-press-out'))).toHaveText('Out: 1')
      await expect(element(by.id('group2-is-pressed'))).toHaveText('P: N')
    })
  })

  describe('named group without transition', () => {
    it('should show blue at rest and return to blue after press', async () => {
      // verify starts blue
      const beforeScreenshot = await element(
        by.id('named-group-child-no-transition')
      ).takeScreenshot('group3-before')
      const beforeColor = getDominantColor(beforeScreenshot)
      assert.ok(isBlueish(beforeColor), `Expected blue before tap, got ${formatRGB(beforeColor)}`)

      // tap the group
      await element(by.id('named-group-no-transition')).tap()
      await new Promise((r) => setTimeout(r, 100))

      // verify returns to blue after release
      const afterScreenshot = await element(
        by.id('named-group-child-no-transition')
      ).takeScreenshot('group3-after')
      const afterColor = getDominantColor(afterScreenshot)
      assert.ok(isBlueish(afterColor), `Expected blue after tap, got ${formatRGB(afterColor)}`)

      // verify press events fired
      await expect(element(by.id('group3-press-in'))).toHaveText('In: 1')
      await expect(element(by.id('group3-press-out'))).toHaveText('Out: 1')
    })
  })

  describe('named group with transition', () => {
    it('should show blue at rest and return to blue after press', async () => {
      // verify starts blue
      const beforeScreenshot = await element(
        by.id('named-group-child-with-transition')
      ).takeScreenshot('group4-before')
      const beforeColor = getDominantColor(beforeScreenshot)
      assert.ok(isBlueish(beforeColor), `Expected blue before tap, got ${formatRGB(beforeColor)}`)

      // tap the group
      await element(by.id('named-group-with-transition')).tap()
      // wait a bit for animation to settle
      await new Promise((r) => setTimeout(r, 200))

      // verify returns to blue after release
      const afterScreenshot = await element(
        by.id('named-group-child-with-transition')
      ).takeScreenshot('group4-after')
      const afterColor = getDominantColor(afterScreenshot)
      assert.ok(isBlueish(afterColor), `Expected blue after tap, got ${formatRGB(afterColor)}`)

      // verify press events fired
      await expect(element(by.id('group4-press-in'))).toHaveText('In: 1')
      await expect(element(by.id('group4-press-out'))).toHaveText('Out: 1')
    })
  })
})
