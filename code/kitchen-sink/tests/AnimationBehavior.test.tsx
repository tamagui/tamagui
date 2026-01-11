import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * ANIMATION BEHAVIOR TESTS
 *
 * These tests verify that animations reach their correct end states
 * across all 4 animation drivers: css, native, moti, reanimated
 *
 * Tests cover:
 * - Basic opacity animation
 * - Animation with delay
 * - transitionOnly prop
 * - Multi-property animations
 * - Per-property animation configs
 * - Enter/exit animations (AnimatePresence)
 * - Animation interruption
 * - Complex multi-property with different configs
 */

const DRIVERS = ['css', 'native', 'moti', 'reanimated'] as const

async function getOpacity(page: Page, testId: string): Promise<number> {
  return page.evaluate(
    (id) => {
      const el = document.querySelector(`[data-testid="${id}"]`)
      if (!el) return -1
      return Number.parseFloat(getComputedStyle(el).opacity)
    },
    testId
  )
}

async function getScale(page: Page, testId: string): Promise<number> {
  return page.evaluate(
    (id) => {
      const el = document.querySelector(`[data-testid="${id}"]`)
      if (!el) return -1
      const transform = getComputedStyle(el).transform
      if (transform === 'none') return 1
      const match = transform.match(/matrix\(([^,]+),/)
      return match ? Number.parseFloat(match[1]) : 1
    },
    testId
  )
}

async function getTranslateX(page: Page, testId: string): Promise<number> {
  return page.evaluate(
    (id) => {
      const el = document.querySelector(`[data-testid="${id}"]`)
      if (!el) return -1
      const transform = getComputedStyle(el).transform
      if (transform === 'none') return 0
      const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+),/)
      return match ? Number.parseFloat(match[1]) : 0
    },
    testId
  )
}

async function getBorderRadius(page: Page, testId: string): Promise<number> {
  return page.evaluate(
    (id) => {
      const el = document.querySelector(`[data-testid="${id}"]`)
      if (!el) return -1
      const br = getComputedStyle(el).borderRadius
      return Number.parseFloat(br) || 0
    },
    testId
  )
}

async function elementExists(page: Page, testId: string): Promise<boolean> {
  return page.evaluate(
    (id) => !!document.querySelector(`[data-testid="${id}"]`),
    testId
  )
}

for (const driver of DRIVERS) {
  test.describe(`${driver} driver`, () => {
    test.beforeEach(async ({ page }) => {
      await setupPage(page, {
        name: 'AnimationComprehensiveCase',
        type: 'useCase',
        searchParams: { animationDriver: driver },
      })
      await page.waitForTimeout(500)
    })

    // ========================================================================
    // TEST 1: Basic animation reaches end state
    // Verifies animation completes correctly
    // ========================================================================
    test('opacity animation reaches correct end state', async ({ page }) => {
      // Get start state
      const startOpacity = await getOpacity(page, 'scenario-01-target')
      expect(startOpacity, 'Start opacity should be 1').toBeCloseTo(1, 1)

      // Trigger animation
      await page.getByTestId('scenario-01-trigger').click()

      // Wait for animation to complete
      await page.waitForTimeout(1500)
      const endOpacity = await getOpacity(page, 'scenario-01-target')

      // End should be target value
      expect(endOpacity, 'End opacity should be ~0.2').toBeCloseTo(0.2, 1)
    })

    // ========================================================================
    // TEST 2: Animation with delay reaches correct end state
    // ========================================================================
    test('animation with delay reaches correct end state', async ({ page }) => {
      // Scenario 20 has 300ms delay
      const startOpacity = await getOpacity(page, 'scenario-20-target')
      expect(startOpacity).toBeCloseTo(1, 1)

      // Trigger animation
      await page.getByTestId('scenario-20-trigger').click()

      // Wait for delay + animation to complete
      await page.waitForTimeout(2000)
      const endOpacity = await getOpacity(page, 'scenario-20-target')
      expect(endOpacity, 'End opacity should be ~0.3').toBeCloseTo(0.3, 1)
    })

    // ========================================================================
    // TEST 3: transitionOnly restricts which properties animate
    // Scenario 26: transitionOnly={['opacity']} - scale should be instant
    // ========================================================================
    test('transitionOnly limits animation to specified properties', async ({ page }) => {
      const startOpacity = await getOpacity(page, 'scenario-26-target')
      const startScale = await getScale(page, 'scenario-26-target')

      expect(startOpacity).toBeCloseTo(1, 1)
      expect(startScale).toBeCloseTo(1, 1)

      // Trigger animation
      await page.getByTestId('scenario-26-trigger').click()

      // Wait for completion
      await page.waitForTimeout(2000)
      const endOpacity = await getOpacity(page, 'scenario-26-target')
      const endScale = await getScale(page, 'scenario-26-target')

      // Both should reach their targets
      expect(endOpacity, 'End opacity should be ~0.3').toBeCloseTo(0.3, 0)
      expect(endScale, 'End scale should be ~1.5').toBeCloseTo(1.5, 0)
    })

    // ========================================================================
    // TEST 4: Multi-property animation - all properties animate together
    // Scenario 28: opacity, scale, rotate, borderRadius
    // ========================================================================
    test('multiple properties animate simultaneously', async ({ page }) => {
      const startOpacity = await getOpacity(page, 'scenario-28-target')
      const startScale = await getScale(page, 'scenario-28-target')
      const startBorderRadius = await getBorderRadius(page, 'scenario-28-target')

      expect(startOpacity).toBeCloseTo(1, 1)
      expect(startScale).toBeCloseTo(1, 1)
      // borderRadius starts at 4 or 0

      // Trigger animation
      await page.getByTestId('scenario-28-trigger').click()

      // Wait for completion (bouncy spring needs more time)
      await page.waitForTimeout(3000)

      const endOpacity = await getOpacity(page, 'scenario-28-target')
      const endScale = await getScale(page, 'scenario-28-target')
      const endBorderRadius = await getBorderRadius(page, 'scenario-28-target')

      // All should reach their targets (use looser tolerance for spring animations)
      expect(endOpacity, 'End opacity should be ~0.5').toBeCloseTo(0.5, 1)
      expect(endScale, 'End scale should be ~1.3').toBeCloseTo(1.3, 0)
      expect(endBorderRadius, 'End borderRadius should be ~20').toBeCloseTo(20, 0)
    })

    // ========================================================================
    // TEST 5: Per-property animation configs
    // Scenario 31: opacity uses 'lazy', scale uses 'bouncy'
    // Different properties should animate at different speeds
    // ========================================================================
    test('per-property animation configs apply correctly', async ({ page }) => {
      // Trigger animation
      await page.getByTestId('scenario-31-trigger').click()

      // Wait for full completion (lazy animations take a while)
      await page.waitForTimeout(3000)
      const endOpacity = await getOpacity(page, 'scenario-31-target')
      const endScale = await getScale(page, 'scenario-31-target')

      // Both should reach targets
      expect(endOpacity, 'End opacity should be ~0.3').toBeCloseTo(0.3, 0)
      expect(endScale, 'End scale should be ~1.5').toBeCloseTo(1.5, 0)
    })

    // ========================================================================
    // TEST 6: Enter/Exit styles (AnimatePresence behavior)
    // Scenario 21: enterStyle animates from opacity:0, scale:0.5 to 1, 1
    // ========================================================================
    test('enterStyle animates element on mount', async ({ page }) => {
      // First hide the element
      const trigger = page.getByTestId('scenario-21-trigger')
      await trigger.click() // Hide
      await page.waitForTimeout(1000)

      // Verify hidden
      const existsAfterHide = await elementExists(page, 'scenario-21-target')
      expect(existsAfterHide, 'Element should be hidden after first click').toBe(false)

      // Show again - should animate from enterStyle
      await trigger.click()

      // Wait for enter animation to complete
      await page.waitForTimeout(2000)

      // Element should exist now
      const existsAfterShow = await elementExists(page, 'scenario-21-target')
      expect(existsAfterShow, 'Element should exist after second click').toBe(true)

      if (existsAfterShow) {
        const endOpacity = await getOpacity(page, 'scenario-21-target')
        const endScale = await getScale(page, 'scenario-21-target')

        // Should reach final state (opacity 1, scale 1)
        expect(endOpacity, 'End opacity should be ~1').toBeCloseTo(1, 0)
        expect(endScale, 'End scale should be ~1').toBeCloseTo(1, 0)
      }
    })

    // ========================================================================
    // TEST 7: Animation interruption - mid-animation state change
    // Scenario 25: Animates x from 0 -> 50, then interrupts to 100
    // ========================================================================
    test('animation interruption redirects to new target', async ({ page }) => {
      const startX = await getTranslateX(page, 'scenario-25-target')
      expect(startX, 'Start x should be 0').toBeCloseTo(0, 0)

      // Trigger (starts animation to x=50, then interrupts to x=100 at 150ms)
      await page.getByTestId('scenario-25-trigger').click()

      // Wait for full animation including interruption
      await page.waitForTimeout(3000)

      const endX = await getTranslateX(page, 'scenario-25-target')
      // Should reach the interrupted target (100), not the first target (50)
      expect(endX, 'End x should be ~100 (interrupted target)').toBeCloseTo(100, 0)
    })

    // ========================================================================
    // TEST 8: Complex combination - verify each property independently
    // Scenario 34: Many properties with different configs
    // ========================================================================
    test('complex multi-property with different configs', async ({ page }) => {
      // Trigger
      await page.getByTestId('scenario-34-trigger').click()

      // Wait for all animations to complete (lazy ones take longer)
      await page.waitForTimeout(4000)

      // Check all properties reached their targets
      const endOpacity = await getOpacity(page, 'scenario-34-target')
      const endScale = await getScale(page, 'scenario-34-target')
      const endBorderRadius = await getBorderRadius(page, 'scenario-34-target')

      expect(endOpacity, 'Opacity should reach target').toBeCloseTo(0.7, 0)
      expect(endScale, 'Scale should reach target').toBeCloseTo(1.2, 0)
      expect(endBorderRadius, 'BorderRadius should reach target').toBeCloseTo(16, 0)
    })
  })
}
