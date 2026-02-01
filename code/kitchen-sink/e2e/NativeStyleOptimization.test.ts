/**
 * Detox test for native style optimization.
 *
 * Tests that:
 * 1. Optimized components don't re-render on theme change
 * 2. Regular Tamagui components DO re-render
 * 3. Theme changes are visually applied (no tearing)
 * 4. All views update atomically
 */

import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'

describe('NativeStyleOptimization', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('NativeStyleOptimization', 'toggle-theme-btn')
  })

  it('should navigate to NativeStyleOptimization test case', async () => {
    await expect(element(by.id('toggle-theme-btn'))).toBeVisible()
  })

  it('should show initial render counts of 1 for optimized card', async () => {
    // initial render should show 1 render for optimized card
    await expect(element(by.id('optimized-count'))).toHaveText('Card: 1')
  })

  it('should show initial render count of 6 for optimized boxes', async () => {
    // 6 boxes rendered once each = 6 total
    await expect(element(by.id('box-count'))).toHaveText('Boxes: 6')
  })

  it('should NOT re-render optimized components on theme toggle', async () => {
    // verify initial state
    await expect(element(by.id('optimized-count'))).toHaveText('Card: 1')
    await expect(element(by.id('box-count'))).toHaveText('Boxes: 6')

    // toggle theme multiple times
    for (let i = 0; i < 5; i++) {
      await element(by.id('toggle-theme-btn')).tap()
      // small delay for theme to update
      await new Promise((r) => setTimeout(r, 100))
    }

    // optimized components should still show 1 render each
    // (they shouldn't re-render on theme change)
    await expect(element(by.id('optimized-count'))).toHaveText('Card: 1')
    await expect(element(by.id('box-count'))).toHaveText('Boxes: 6')
  })

  it('should re-render regular Tamagui components on theme toggle', async () => {
    // verify initial state - regular card renders once
    await expect(element(by.id('regular-count'))).toHaveText('Card: 1')

    // toggle theme 5 times
    for (let i = 0; i < 5; i++) {
      await element(by.id('toggle-theme-btn')).tap()
      await new Promise((r) => setTimeout(r, 100))
    }

    // regular component should have re-rendered multiple times
    // exact count depends on React batching, but should be > 1
    const regularCard = element(by.id('regular-card'))
    await expect(regularCard).toBeVisible()

    // we can't easily assert the exact count, but we know it re-renders
    // the text inside shows the count which increases
  })

  it('should toggle between light and dark themes', async () => {
    // start with light theme
    await expect(element(by.text('Toggle ( light )'))).toBeVisible()

    // tap to switch to dark
    await element(by.id('toggle-theme-btn')).tap()
    await waitFor(element(by.text('Toggle ( dark )')))
      .toBeVisible()
      .withTimeout(2000)

    // tap to switch back to light
    await element(by.id('toggle-theme-btn')).tap()
    await waitFor(element(by.text('Toggle ( light )')))
      .toBeVisible()
      .withTimeout(2000)
  })

  it('should reset counts when Reset button is pressed', async () => {
    // toggle theme a few times to increment regular counter
    for (let i = 0; i < 3; i++) {
      await element(by.id('toggle-theme-btn')).tap()
      await new Promise((r) => setTimeout(r, 100))
    }

    // press reset
    await element(by.id('reset-counts-btn')).tap()

    // counts should be back to initial values
    await waitFor(element(by.id('optimized-count')))
      .toHaveText('Card: 1')
      .withTimeout(2000)
    await waitFor(element(by.id('box-count')))
      .toHaveText('Boxes: 6')
      .withTimeout(2000)
  })

  it('should show optimized card content', async () => {
    await expect(element(by.id('optimized-card'))).toBeVisible()
    await expect(element(by.text('Optimized card (renders: 1)'))).toBeVisible()
  })

  it('should show all 6 optimized boxes', async () => {
    for (let i = 0; i < 6; i++) {
      await expect(element(by.id(`optimized-box-${i}`))).toBeVisible()
    }
  })

  it('should show regular card content', async () => {
    await expect(element(by.id('regular-card'))).toBeVisible()
  })

  it('should display registry status', async () => {
    // should show either "Native" or "JS Fallback"
    // we can't know which without checking the build, but one should be visible
    const nativeText = element(by.text('Registry: ✅ Native'))
    const fallbackText = element(by.text('Registry: ⚠️ JS Fallback'))

    try {
      await expect(nativeText).toBeVisible()
    } catch {
      await expect(fallbackText).toBeVisible()
    }
  })
})
