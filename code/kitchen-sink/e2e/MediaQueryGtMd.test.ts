/**
 * Detox E2E Test for Media Query Regression (Issue starting in v1.132.17)
 *
 * Tests that $md and $gtMd media queries correctly apply based on screen size.
 *
 * Bug: On small screens (iPhone ~390px), $gtMd styles were incorrectly applying
 * when they should not. Only $md should apply on mobile devices.
 *
 * Breakpoints:
 * - md: maxWidth 1020 (matches when width <= 1020)
 * - gtMd: minWidth 1021 (matches when width > 1020)
 *
 * Note: Detox doesn't have built-in style inspection, so this test:
 * 1. Verifies elements render correctly
 * 2. Takes screenshots for visual verification
 * 3. Future: Could use pixel sampling to verify actual colors
 */

import { by, device, element, expect } from 'detox'
import { navigateToTestCase } from './utils/navigation'

describe('MediaQueryGtMd', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('MediaQueryGtMd', 'media-test-both')
  })

  it('should render all media query test elements', async () => {
    // Verify all test elements are visible
    await expect(element(by.id('media-test-both'))).toBeVisible()
    await expect(element(by.id('media-test-gtmd-only'))).toBeVisible()
    await expect(element(by.id('media-test-md-only'))).toBeVisible()
    await expect(element(by.id('media-test-all'))).toBeVisible()
  })

  it('should have correct media query state - tests both TRUE and FALSE cases', async () => {
    // On iPhone (~390px width), we verify the useMedia() hook returns correct values.
    // This tests BOTH truthy and falsy breakpoints on the same device:
    //
    // TRUE cases (breakpoint matches):
    // - sm: true (maxWidth 800, 390 <= 800) ✓
    // - md: true (maxWidth 1020, 390 <= 1020) ✓
    //
    // FALSE cases (breakpoint does NOT match):
    // - gtMd: false (minWidth 1021, 390 >= 1021 is false) ✓

    // Test TRUE case: md should be true on mobile
    await expect(element(by.id('media-state-md'))).toHaveText('md: true')

    // Test FALSE case: gtMd should be false on mobile
    // THIS IS THE KEY REGRESSION TEST - bug was gtMd incorrectly returning true
    await expect(element(by.id('media-state-gtMd'))).toHaveText('gtMd: false')

    // Test another TRUE case: sm should be true
    await expect(element(by.id('media-state-sm'))).toHaveText('sm: true')
  })

  it('should take screenshot for visual verification', async () => {
    // Take a screenshot for visual regression testing
    // On iPhone:
    // - media-test-both: should be YELLOW (not green) - $md applies, not $gtMd
    // - media-test-gtmd-only: should be RED - $gtMd doesn't match
    // - media-test-md-only: should be YELLOW - $md applies
    // - media-test-all: should be YELLOW - $md has priority over $sm
    await device.takeScreenshot('media-query-mobile')
  })
})
