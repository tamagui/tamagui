import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * ANIMATION BEHAVIOR TESTS
 *
 * Tests animation behavior across all configured drivers.
 * Driver is determined by the playwright project (css, native, reanimated, motion).
 * All tests verify start, intermediate, and end states.
 * Uses scenario-36 (1000ms timing) for reliable intermediate capture.
 */

const TOLERANCE = 0.05

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

test.describe('Animation Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Skip native driver - it has issues with data-testid attributes on web
    const driver = (test.info().project?.metadata as any)?.animationDriver
    test.skip(driver === 'native', 'native driver has element detection issues on web')

    await setupPage(page, {
      name: 'AnimationComprehensiveCase',
      type: 'useCase',
    })
    await page.waitForTimeout(500)
  })

  test('timing animation has start, intermediate, and end states', async ({ page }) => {
    const testInfo = test.info()
    const driver = (testInfo.project?.metadata as any)?.animationDriver

    const START = 1, END = 0.2

    const startOpacity = await getOpacity(page, 'scenario-36-target')
    expect(startOpacity, 'Start').toBeCloseTo(START, 1)

    await page.getByTestId('scenario-36-trigger').click()
    // wait 500ms into a 1000ms animation for reliable intermediate capture
    await page.waitForTimeout(500)
    const midOpacity = await getOpacity(page, 'scenario-36-target')

    await page.waitForTimeout(1500)
    const endOpacity = await getOpacity(page, 'scenario-36-target')

    expect(endOpacity, 'End').toBeCloseTo(END, 1)
    expect(isIntermediate(midOpacity, START, END), `Mid (${midOpacity.toFixed(2)}) should be intermediate`).toBe(true)
  })

  test('scale timing animation has intermediate values', async ({ page }) => {
    const testInfo = test.info()
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    const START = 1, END = 1.5

    const startScale = await getScale(page, 'scenario-36-target')
    expect(startScale, 'Start').toBeCloseTo(START, 1)

    await page.getByTestId('scenario-36-trigger').click()
    // wait 500ms into a 1000ms animation for reliable intermediate capture
    await page.waitForTimeout(500)
    const midScale = await getScale(page, 'scenario-36-target')

    await page.waitForTimeout(1500)
    const endScale = await getScale(page, 'scenario-36-target')

    expect(endScale, 'End').toBeCloseTo(END, 1)
    expect(isIntermediate(midScale, START, END), `Mid (${midScale.toFixed(2)}) should be intermediate`).toBe(true)
  })

  test('animation with delay completes correctly', async ({ page }) => {
    const START = 1, END = 0.3

    const startOpacity = await getOpacity(page, 'scenario-20-target')
    expect(startOpacity, 'Start').toBeCloseTo(START, 1)

    await page.getByTestId('scenario-20-trigger').click()
    await page.waitForTimeout(2500)
    const endOpacity = await getOpacity(page, 'scenario-20-target')

    expect(endOpacity, 'End').toBeCloseTo(END, 1)
  })

  test('multi-property animation completes correctly', async ({ page }) => {
    const OPACITY_END = 0.5, SCALE_END = 1.3

    await page.getByTestId('scenario-28-trigger').click()
    await page.waitForTimeout(3000)

    const endOpacity = await getOpacity(page, 'scenario-28-target')
    const endScale = await getScale(page, 'scenario-28-target')

    expect(endOpacity, 'End opacity').toBeCloseTo(OPACITY_END, 0)
    expect(endScale, 'End scale').toBeCloseTo(SCALE_END, 0)
  })

  test('per-property configs complete correctly', async ({ page }) => {
    const OPACITY_END = 0.3, SCALE_END = 1.5

    await page.getByTestId('scenario-31-trigger').click()
    await page.waitForTimeout(3000)

    const endOpacity = await getOpacity(page, 'scenario-31-target')
    const endScale = await getScale(page, 'scenario-31-target')

    expect(endOpacity, 'End opacity').toBeCloseTo(OPACITY_END, 0)
    expect(endScale, 'End scale').toBeCloseTo(SCALE_END, 0)
  })

  test('enterStyle animates on mount', async ({ page }) => {
    const trigger = page.getByTestId('scenario-21-trigger')
    await trigger.click() // Hide
    await page.waitForTimeout(1000)

    expect(await elementExists(page, 'scenario-21-target'), 'Hidden').toBe(false)

    await trigger.click() // Show
    await page.waitForTimeout(2000)

    expect(await elementExists(page, 'scenario-21-target'), 'Shown').toBe(true)
    expect(await getOpacity(page, 'scenario-21-target'), 'End opacity').toBeCloseTo(1, 0)
    expect(await getScale(page, 'scenario-21-target'), 'End scale').toBeCloseTo(1, 0)
  })

  test('exitStyle has intermediate values during exit animation', async ({ page }, testInfo) => {
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    const START_OPACITY = 1, END_OPACITY = 0

    // Element should be visible initially
    expect(await elementExists(page, 'scenario-22-target'), 'Initially visible').toBe(true)
    expect(await getOpacity(page, 'scenario-22-target'), 'Start opacity').toBeCloseTo(START_OPACITY, 1)

    // Click to trigger exit animation
    await page.getByTestId('scenario-22-trigger').click()

    // CSS bouncy is 200ms, spring bouncy takes longer
    // for CSS, check at 100ms; for spring, check at 150ms
    const checkTime = driver === 'css' ? 100 : 150
    await page.waitForTimeout(checkTime)

    const exists = await elementExists(page, 'scenario-22-target')
    if (exists) {
      const midOpacity = await getOpacity(page, 'scenario-22-target')
      // Mid values should be intermediate (not at start, not at end)
      expect(
        isIntermediate(midOpacity, START_OPACITY, END_OPACITY) || midOpacity < START_OPACITY,
        `Mid opacity (${midOpacity.toFixed(2)}) should be animating`
      ).toBe(true)
    }

    // Wait for animation to complete (spring animations can be slow)
    await page.waitForTimeout(2500)

    // Element should be gone after exit animation completes
    expect(await elementExists(page, 'scenario-22-target'), 'Hidden after exit').toBe(false)
  })

  test('interruption redirects to new target', async ({ page }) => {
    const START = 0, FINAL = 100

    expect(await getTranslateX(page, 'scenario-25-target'), 'Start').toBeCloseTo(START, 0)

    await page.getByTestId('scenario-25-trigger').click()
    await page.waitForTimeout(3000)

    expect(await getTranslateX(page, 'scenario-25-target'), 'End').toBeCloseTo(FINAL, 0)
  })

  test('complex multi-property completes correctly', async ({ page }) => {
    const OPACITY_END = 0.7, SCALE_END = 1.2

    await page.getByTestId('scenario-34-trigger').click()
    await page.waitForTimeout(4000)

    const endOpacity = await getOpacity(page, 'scenario-34-target')
    const endScale = await getScale(page, 'scenario-34-target')

    expect(endOpacity, 'End opacity').toBeCloseTo(OPACITY_END, 0)
    expect(endScale, 'End scale').toBeCloseTo(SCALE_END, 0)
  })

  test('enterStyle with scaleX animates from 0 to 1', async ({ page }) => {
    const END_SCALE_X = 1
    const END_OPACITY = 1

    // Element should not exist initially
    expect(await elementExists(page, 'scenario-37-target'), 'Initially hidden').toBe(false)

    // Click to show element
    await page.getByTestId('scenario-37-trigger').click()

    // Wait a moment for the element to appear and start animating
    await page.waitForTimeout(100)

    // Element should exist now
    expect(await elementExists(page, 'scenario-37-target'), 'Should exist after click').toBe(true)

    // Get scaleX value (first value in matrix transform)
    const getScaleX = async () => {
      return page.evaluate(() => {
        const el = document.querySelector('[data-testid="scenario-37-target"]')
        if (!el) return -1
        const transform = getComputedStyle(el).transform
        if (transform === 'none') return 1
        // matrix(a, b, c, d, tx, ty) - scaleX is in the 'a' position
        const match = transform.match(/matrix\(([^,]+),/)
        return match ? Number.parseFloat(match[1]) : 1
      })
    }

    // Wait for animation to complete (lazy animation takes a while)
    await page.waitForTimeout(2000)

    const endScaleX = await getScaleX()
    const endOpacity = await getOpacity(page, 'scenario-37-target')

    expect(endScaleX, 'End scaleX').toBeCloseTo(END_SCALE_X, 1)
    expect(endOpacity, 'End opacity').toBeCloseTo(END_OPACITY, 1)
  })

  test('per-property config with transform: unlisted properties still animate', async ({ page }) => {
    // this tests the "animationClamped" pattern fix
    // transition={['quick', { opacity: '200ms', backgroundColor: '200ms' }]}
    // scale and y are NOT in the per-property config but should still animate
    const OPACITY_END = 0.5
    const SCALE_END = 1.3

    // scroll to the element first (it's at the bottom of the page)
    await page.getByTestId('scenario-38-trigger').scrollIntoViewIfNeeded()

    // initial state
    const initialOpacity = await getOpacity(page, 'scenario-38-target')
    const initialScale = await getScale(page, 'scenario-38-target')
    expect(initialOpacity, 'Initial opacity').toBeCloseTo(1, 1)
    expect(initialScale, 'Initial scale').toBeCloseTo(1, 1)

    // trigger animation
    await page.getByTestId('scenario-38-trigger').click()
    await page.waitForTimeout(1500)

    // both should reach end state - the key test is that scale animates
    // even though it wasn't listed in the per-property config
    const endOpacity = await getOpacity(page, 'scenario-38-target')
    const endScale = await getScale(page, 'scenario-38-target')

    expect(endOpacity, 'End opacity').toBeCloseTo(OPACITY_END, 1)
    expect(endScale, 'End scale').toBeCloseTo(SCALE_END, 1)
  })

  test('object format per-property config: unlisted properties still animate', async ({ page }) => {
    // same as above but using object format: { opacity: '200ms', default: 'quick' }
    const OPACITY_END = 0.5
    const SCALE_END = 1.3

    const initialScale = await getScale(page, 'scenario-39-target')
    expect(initialScale, 'Initial scale').toBeCloseTo(1, 1)

    await page.getByTestId('scenario-39-trigger').click()
    await page.waitForTimeout(1500)

    const endOpacity = await getOpacity(page, 'scenario-39-target')
    const endScale = await getScale(page, 'scenario-39-target')

    expect(endOpacity, 'End opacity').toBeCloseTo(OPACITY_END, 1)
    expect(endScale, 'End scale').toBeCloseTo(SCALE_END, 1)
  })

  test('object format WITHOUT default: only specified properties animate', async ({ page }, testInfo) => {
    // this test is CSS-driver specific - other drivers may handle transitions differently
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver !== 'css') {
      test.skip()
      return
    }

    // transition={{ opacity: '200ms' }} - NO default key
    // opacity should animate, scale should snap instantly
    const OPACITY_END = 0.5
    const SCALE_END = 1.3

    const initialScale = await getScale(page, 'scenario-40-target')
    expect(initialScale, 'Initial scale').toBeCloseTo(1, 1)

    await page.getByTestId('scenario-40-trigger').click()

    // check immediately - scale should snap to end value (no transition)
    await page.waitForTimeout(50)
    const immediateScale = await getScale(page, 'scenario-40-target')
    expect(immediateScale, 'Scale should snap immediately').toBeCloseTo(SCALE_END, 1)

    // wait for opacity animation to complete (500ms animation + buffer)
    await page.waitForTimeout(800)
    const endOpacity = await getOpacity(page, 'scenario-40-target')
    expect(endOpacity, 'Opacity should animate to end').toBeCloseTo(OPACITY_END, 1)
  })

  test('per-property config with delay: both delay and per-property work together', async ({ page }) => {
    // transition={['quick', { delay: 300, opacity: '500ms' }]}
    // 300ms delay, then opacity=500ms, scale=quick
    const OPACITY_START = 1, OPACITY_END = 0.5
    const SCALE_END = 1.3

    const initialOpacity = await getOpacity(page, 'scenario-41-target')
    expect(initialOpacity, 'Initial opacity').toBeCloseTo(OPACITY_START, 1)

    await page.getByTestId('scenario-41-trigger').click()

    // at 150ms (before delay ends), values should still be at start
    await page.waitForTimeout(150)
    const duringDelay = await getOpacity(page, 'scenario-41-target')
    expect(duringDelay, 'During delay, opacity should be near start').toBeCloseTo(OPACITY_START, 0)

    // wait for delay + animations to complete (300ms delay + 500ms opacity + buffer)
    await page.waitForTimeout(1000)

    const endOpacity = await getOpacity(page, 'scenario-41-target')
    const endScale = await getScale(page, 'scenario-41-target')

    expect(endOpacity, 'End opacity').toBeCloseTo(OPACITY_END, 1)
    expect(endScale, 'End scale').toBeCloseTo(SCALE_END, 1)
  })
})
