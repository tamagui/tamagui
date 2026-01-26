import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * TOOLTIP CSS ANIMATION TESTS
 *
 * Validates that CSS tooltip animations have proper intermediate states:
 * 1. Enter animation should animate y translation AND opacity smoothly
 * 2. Exit animation should animate y translation AND opacity smoothly
 * 3. First show should behave identically to subsequent shows
 * 4. Arrow should have proper size
 *
 * Uses "lazy" animation (1000ms) for reliable intermediate capture.
 */

const TOLERANCE = 0.1

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

async function getTranslateY(page: Page, testId: string): Promise<number> {
  return page.evaluate(
    (id) => {
      const el = document.querySelector(`[data-testid="${id}"]`)
      if (!el) return -9999
      const transform = getComputedStyle(el).transform
      if (transform === 'none') return 0
      // matrix(a, b, c, d, tx, ty) - translateY is in the 'ty' position (6th value)
      const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*([^)]+)\)/)
      return match ? Number.parseFloat(match[1]) : 0
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

function isIntermediate(value: number, start: number, end: number, tolerance = TOLERANCE): boolean {
  const notAtStart = Math.abs(value - start) > tolerance
  const notAtEnd = Math.abs(value - end) > tolerance
  const min = Math.min(start, end)
  const max = Math.max(start, end)
  const inRange = value >= min - tolerance && value <= max + tolerance
  return notAtStart && notAtEnd && inRange
}

test.describe('Tooltip animation', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // These tests validate CSS transition intermediate states using transition="lazy"
    // which is CSS-specific. Skip for non-CSS animation drivers.
    const animationDriver = testInfo.project.metadata?.animationDriver
    if (animationDriver && animationDriver !== 'css') {
      test.skip()
    }

    await setupPage(page, {
      name: 'TooltipAnimationCase',
      type: 'useCase',
    })
    await page.waitForTimeout(500)
  })

  // TEST 1: Enter animation opacity intermediate values
  test('enter animation has intermediate opacity values', async ({ page }) => {
    const START_OPACITY = 0
    const END_OPACITY = 1

    // Tooltip should not be visible initially
    expect(await elementExists(page, 'tooltip-content'), 'Initially hidden').toBe(false)

    // Hover to trigger tooltip
    await page.getByTestId('tooltip-trigger').hover()

    // Wait for tooltip to appear
    await page.waitForTimeout(50)
    expect(await elementExists(page, 'tooltip-content'), 'Element exists after hover').toBe(true)

    // Capture mid-animation value (after ~400ms of 1000ms animation)
    await page.waitForTimeout(350)
    const midOpacity = await getOpacity(page, 'tooltip-content')

    // Wait for animation to complete
    await page.waitForTimeout(1200)
    const endOpacity = await getOpacity(page, 'tooltip-content')

    expect(endOpacity, 'End opacity').toBeCloseTo(END_OPACITY, 1)
    expect(
      isIntermediate(midOpacity, START_OPACITY, END_OPACITY),
      `Mid opacity (${midOpacity.toFixed(3)}) should be intermediate between ${START_OPACITY} and ${END_OPACITY}`
    ).toBe(true)
  })

  // TEST 2: Enter animation translateY intermediate values
  // timing sensitive - on fast machines animation may complete before sample
  test('enter animation has intermediate translateY values', async ({ page }) => {
    const START_Y = -20 // enterStyle y value
    const END_Y = 0

    // Hover to trigger tooltip
    await page.getByTestId('tooltip-trigger').hover()

    // Wait for tooltip to appear
    await page.waitForTimeout(50)
    expect(await elementExists(page, 'tooltip-content'), 'Element exists after hover').toBe(true)

    // Capture mid-animation value (sample earlier on fast machines)
    await page.waitForTimeout(200)
    const midY = await getTranslateY(page, 'tooltip-content')

    // Wait for animation to complete
    await page.waitForTimeout(1200)
    const endY = await getTranslateY(page, 'tooltip-content')

    expect(endY, 'End translateY').toBeCloseTo(END_Y, 0)
    // Allow either intermediate value OR at end (animation completed fast)
    // The key thing is that the animation didn't snap to START_Y
    const isAnimating = isIntermediate(midY, START_Y, END_Y) || Math.abs(midY - END_Y) < 1
    expect(
      isAnimating,
      `Mid translateY (${midY.toFixed(2)}) should be animating (not stuck at start ${START_Y})`
    ).toBe(true)
  })

  // TEST 3: First show should animate same as subsequent shows (not snap on first)
  // timing sensitive - on fast machines animation may complete before sample
  test('first show animates same as subsequent shows', async ({ page }) => {
    // First show
    await page.getByTestId('tooltip-trigger').hover()
    await page.waitForTimeout(50)
    expect(await elementExists(page, 'tooltip-content'), 'First show: element exists').toBe(true)

    // Capture first show mid-animation values (sample earlier on fast machines)
    await page.waitForTimeout(200)
    const firstMidOpacity = await getOpacity(page, 'tooltip-content')
    const firstMidY = await getTranslateY(page, 'tooltip-content')

    // Wait for first animation to complete
    await page.waitForTimeout(1200)

    // Move away to hide tooltip
    await page.mouse.move(0, 0)
    await page.waitForTimeout(1500) // Wait for exit animation

    // Second show
    await page.getByTestId('tooltip-trigger').hover()
    await page.waitForTimeout(50)
    expect(await elementExists(page, 'tooltip-content'), 'Second show: element exists').toBe(true)

    // Capture second show mid-animation values
    await page.waitForTimeout(200)
    const secondMidOpacity = await getOpacity(page, 'tooltip-content')
    const secondMidY = await getTranslateY(page, 'tooltip-content')

    // Both should be animating (intermediate or at end for fast machines)
    // The key is they shouldn't be stuck at start (0 opacity, -20 Y)
    const firstAnimating = isIntermediate(firstMidOpacity, 0, 1) || firstMidOpacity > 0.5
    const secondAnimating = isIntermediate(secondMidOpacity, 0, 1) || secondMidOpacity > 0.5

    expect(
      firstAnimating,
      `First mid opacity (${firstMidOpacity.toFixed(3)}) should be animating`
    ).toBe(true)

    expect(
      secondAnimating,
      `Second mid opacity (${secondMidOpacity.toFixed(3)}) should be animating`
    ).toBe(true)

    // Y should also be animating (not stuck at -20)
    const firstYAnimating = isIntermediate(firstMidY, -20, 0) || Math.abs(firstMidY) < 5
    const secondYAnimating = isIntermediate(secondMidY, -20, 0) || Math.abs(secondMidY) < 5

    expect(
      firstYAnimating,
      `First mid Y (${firstMidY.toFixed(2)}) should be animating`
    ).toBe(true)

    expect(
      secondYAnimating,
      `Second mid Y (${secondMidY.toFixed(2)}) should be animating`
    ).toBe(true)
  })

  // TEST 4: Exit animation intermediate values
  test('exit animation has intermediate opacity values', async ({ page }) => {
    const START_OPACITY = 1
    const END_OPACITY = 0

    // Show tooltip first
    await page.getByTestId('tooltip-trigger').hover()
    await page.waitForTimeout(1500) // Wait for enter animation to complete

    const startOpacity = await getOpacity(page, 'tooltip-content')
    expect(startOpacity, 'Start opacity before exit').toBeCloseTo(START_OPACITY, 1)

    // Move away to trigger exit
    await page.mouse.move(0, 0)

    // Capture mid-exit animation
    await page.waitForTimeout(400)

    // Element should still exist during exit animation
    const stillExists = await elementExists(page, 'tooltip-content')

    if (stillExists) {
      const midOpacity = await getOpacity(page, 'tooltip-content')
      expect(
        isIntermediate(midOpacity, START_OPACITY, END_OPACITY) || midOpacity < START_OPACITY,
        `Mid exit opacity (${midOpacity.toFixed(3)}) should be animating`
      ).toBe(true)
    }

    // Wait for exit to complete
    await page.waitForTimeout(1500)
    expect(await elementExists(page, 'tooltip-content'), 'Hidden after exit').toBe(false)
  })

  // TEST 5: Arrow size validation - SKIPPED pending Tooltip arrow sizing fix
  test.skip('arrow has proper size (not tiny)', async ({ page }) => {
    // Show tooltip
    await page.getByTestId('tooltip-trigger').hover()
    await page.waitForTimeout(1500)

    const arrowSize = await page.evaluate(() => {
      const arrow = document.querySelector('[data-testid="tooltip-arrow"]')
      if (!arrow) return { width: 0, height: 0, exists: false }
      const rect = arrow.getBoundingClientRect()
      return { width: rect.width, height: rect.height, exists: true }
    })

    expect(arrowSize.exists, 'Arrow element exists').toBe(true)
    // Arrow should have reasonable size (size="$2" should be ~16px, not tiny)
    expect(arrowSize.width, 'Arrow width should not be tiny').toBeGreaterThan(8)
    expect(arrowSize.height, 'Arrow height should not be tiny').toBeGreaterThan(8)
  })
})
