/**
 * Test for $safeAreaTop, $safeAreaBottom, $safeAreaLeft, $safeAreaRight tokens
 * Verifies that safe area tokens resolve and render correctly on native
 */

import { by, device, element, expect } from 'detox'
import { navigateToTestCase } from './utils/navigation'

describe('SafeArea', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('SafeAreaCase', 'safe-area-case')
  })

  it('should navigate to SafeAreaCase test case', async () => {
    await expect(element(by.id('safe-area-case'))).toBeVisible()
  })

  it('should render paddingTop with $safeAreaTop token', async () => {
    await expect(element(by.id('token-padding-top'))).toBeVisible()
  })

  it('should render paddingBottom with $safeAreaBottom token', async () => {
    await expect(element(by.id('token-padding-bottom'))).toBeVisible()
  })

  it('should render marginLeft with $safeAreaLeft token', async () => {
    await expect(element(by.id('token-margin-left'))).toBeVisible()
  })

  it('should render marginRight with $safeAreaRight token', async () => {
    await expect(element(by.id('token-margin-right'))).toBeVisible()
  })

  it('should render combined safe area tokens', async () => {
    await expect(element(by.id('token-combined'))).toBeVisible()
  })

  it('should display safe area status', async () => {
    await expect(element(by.id('safe-area-status'))).toBeVisible()
  })

  it('should display initial insets', async () => {
    await expect(element(by.id('initial-insets'))).toBeVisible()
  })

  it('should display visual safe area bars', async () => {
    await expect(element(by.id('safe-area-top-bar'))).toBeVisible()
    await expect(element(by.id('safe-area-bottom-bar'))).toBeVisible()
  })
})
