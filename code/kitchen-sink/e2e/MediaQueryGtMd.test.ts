/**
 * Detox E2E Test for Media Query Regression (Issue starting in v1.132.17)
 *
 * Tests that the max-md and md media queries correctly apply based on screen size.
 *
 * Bug: On small screens (iPhone ~390px), the min-width styles were incorrectly
 * applying when they should not. Only max-md should apply on mobile devices.
 *
 * Breakpoints (config v5, mobile-first):
 * - max-md: maxWidth 767 (matches when width < 768)
 * - md: minWidth 768 (matches when width >= 768)
 *
 * Note: Detox doesn't have built-in style inspection, so this test:
 * 1. Verifies elements render correctly
 * 2. Takes screenshots for visual verification
 * 3. Future: Could use pixel sampling to verify actual colors
 *
 * Launch model: directUseCase renders the case at app root, so we launch the
 * native app ONCE in beforeAll and never relaunch. The three assertions are
 * read-only against the same render, so no per-test reset is needed. This
 * removes the per-test app relaunch (the only place the Detox connect-flake
 * bites) and the navigation round-trip.
 */

import { by, device, element, expect, waitFor } from 'detox'
import { safeLaunchApp } from './utils/detox'

describe('MediaQueryGtMd', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'MediaQueryGtMd' },
    })
    await waitFor(element(by.id('media-test-both')))
      .toExist()
      .withTimeout(180000)
  })

  it('should render all media query test elements', async () => {
    // Verify all test elements are visible
    await expect(element(by.id('media-test-both'))).toBeVisible()
    await expect(element(by.id('media-test-md-only'))).toBeVisible()
    await expect(element(by.id('media-test-max-md-only'))).toBeVisible()
    await expect(element(by.id('media-test-all'))).toBeVisible()
  })

  it('should have correct media query state - tests both TRUE and FALSE cases', async () => {
    // On iPhone (~390px width), we verify the useMedia() hook returns correct values.
    // This tests BOTH truthy and falsy breakpoints on the same device:
    //
    // TRUE cases (breakpoint matches):
    // - max-sm: true (maxWidth 639, 390 < 640) ✓
    // - max-md: true (maxWidth 767, 390 < 768) ✓
    //
    // FALSE cases (breakpoint does NOT match):
    // - md: false (minWidth 768, 390 >= 768 is false) ✓

    // Test TRUE case: max-md should be true on mobile
    await expect(element(by.id('media-state-max-md'))).toHaveText('max-md: true')

    // Test FALSE case: md should be false on mobile
    // THIS IS THE KEY REGRESSION TEST - the bug was the min-width query returning true
    await expect(element(by.id('media-state-md'))).toHaveText('md: false')

    // Test another TRUE case: max-sm should be true
    await expect(element(by.id('media-state-max-sm'))).toHaveText('max-sm: true')
  })

  it('should take screenshot for visual verification', async () => {
    // Take a screenshot for visual regression testing
    // On iPhone:
    // - media-test-both: should be YELLOW (not green) - max-md applies, not md
    // - media-test-md-only: should be RED - md doesn't match
    // - media-test-max-md-only: should be YELLOW - max-md applies
    // - media-test-all: should be BLUE - max-sm is declared after max-md
    await device.takeScreenshot('media-query-mobile')
  })
})
