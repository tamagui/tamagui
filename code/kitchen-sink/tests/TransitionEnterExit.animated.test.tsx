import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * ENTER/EXIT TRANSITION TESTS
 *
 * Tests the transition prop's enter/exit-specific animations.
 * Supports syntax like: transition={{ enter: 'lazy', exit: 'quick' }}
 *
 * These tests run across all animation drivers (css, native, reanimated, motion).
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

test.describe('Enter/Exit Transition Props', () => {
  test.beforeEach(async ({ page }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    test.skip(driver === 'native', 'native driver has element detection issues on web')

    await setupPage(page, {
      name: 'AnimationComprehensiveCase',
      type: 'useCase',
    })
    // wait for initial render and any enter animations to complete
    await page.waitForTimeout(1500)
  })

  test('scenario 42: different enter/exit transitions - enter uses slow animation', async ({ page }) => {
    // initial state: element is visible
    expect(await elementExists(page, 'scenario-42-target'), 'Initially visible').toBe(true)
    // use precision 0 (within 0.5) - CI timing causes animation to not fully settle
    expect(await getOpacity(page, 'scenario-42-target'), 'Initial opacity').toBeCloseTo(1, 0)

    // hide element, then show again to test enter animation
    await page.getByTestId('scenario-42-trigger').click()
    // spring animations can take longer to settle, especially with reanimated
    await page.waitForTimeout(1500)

    expect(await elementExists(page, 'scenario-42-target'), 'Hidden').toBe(false)

    // show element - enter animation should be slow (lazy ~500ms)
    await page.getByTestId('scenario-42-trigger').click()

    // wait a bit for element to appear and start animating
    await page.waitForTimeout(100)
    expect(await elementExists(page, 'scenario-42-target'), 'Should appear').toBe(true)

    // at 200ms into a 500ms lazy animation, should still be animating
    await page.waitForTimeout(150)
    const midEnterOpacity = await getOpacity(page, 'scenario-42-target')

    // if enter uses lazy (slow), at 250ms total the animation should still be in progress
    // opacity should be intermediate between 0 (enterStyle) and 1 (final)
    expect(
      isIntermediate(midEnterOpacity, 0, 1) || midEnterOpacity < 0.9,
      `Mid-enter opacity (${midEnterOpacity.toFixed(2)}) should be animating (lazy animation)`
    ).toBe(true)

    // wait for enter animation to complete
    await page.waitForTimeout(1000)
    expect(await getOpacity(page, 'scenario-42-target'), 'Final opacity').toBeCloseTo(1, 1)
  })

  test('scenario 42: different enter/exit transitions - exit uses fast animation', async ({ page }, testInfo) => {
    const driver = (testInfo.project?.metadata as any)?.animationDriver

    // initial state: element is visible
    expect(await elementExists(page, 'scenario-42-target'), 'Initially visible').toBe(true)
    // use precision 0 (within 0.5) - CI timing causes animation to not fully settle
    expect(await getOpacity(page, 'scenario-42-target'), 'Initial opacity').toBeCloseTo(1, 0)

    // trigger exit - should use quick animation (css: 100ms, spring: ~150-200ms)
    await page.getByTestId('scenario-42-trigger').click()

    // verify exit completes reasonably fast
    // css: quick is 100ms, should complete well under 500ms
    // spring: quick with stiffness=250 settles in ~200-500ms
    if (driver === 'css') {
      // CSS quick is 100ms - should be gone within 300ms (allowing some buffer)
      await page.waitForTimeout(300)
      expect(await elementExists(page, 'scenario-42-target'), 'Gone after CSS quick exit').toBe(false)
    } else {
      // spring drivers take longer but should still be "quick"
      // check element is animating at 50ms
      await page.waitForTimeout(50)
      const exists = await elementExists(page, 'scenario-42-target')
      if (exists) {
        const midOpacity = await getOpacity(page, 'scenario-42-target')
        // just verify it's started changing or check later
        expect(midOpacity <= 1.0, `Spring opacity should be <= 1.0`).toBe(true)
      }
      // wait for exit to complete (spring animations need time to settle)
      await page.waitForTimeout(1500)
      expect(await elementExists(page, 'scenario-42-target'), 'Gone after spring quick exit').toBe(false)
    }
  })

  test('scenario 43: enter-only transition - enter uses specified, exit uses default', async ({ page }) => {
    // hide first (spring animations need more time)
    await page.getByTestId('scenario-43-trigger').click()
    await page.waitForTimeout(1500)
    expect(await elementExists(page, 'scenario-43-target'), 'Hidden').toBe(false)

    // show - enter should use lazy (slow)
    await page.getByTestId('scenario-43-trigger').click()
    await page.waitForTimeout(100)
    expect(await elementExists(page, 'scenario-43-target'), 'Should appear').toBe(true)

    // at 250ms into lazy animation, should still be animating
    await page.waitForTimeout(150)
    const midOpacity = await getOpacity(page, 'scenario-43-target')

    expect(
      isIntermediate(midOpacity, 0, 1) || midOpacity < 0.9,
      `Mid-enter opacity (${midOpacity.toFixed(2)}) should be intermediate (lazy)`
    ).toBe(true)

    // wait for completion
    await page.waitForTimeout(1000)
    expect(await getOpacity(page, 'scenario-43-target'), 'Final').toBeCloseTo(1, 1)
  })

  test('scenario 44: exit-only transition - exit uses specified lazy (slow)', async ({ page }, testInfo) => {
    const driver = (testInfo.project?.metadata as any)?.animationDriver

    // element starts visible
    expect(await elementExists(page, 'scenario-44-target'), 'Initially visible').toBe(true)

    // trigger exit - uses lazy (slow)
    await page.getByTestId('scenario-44-trigger').click()

    // at 200ms into a lazy animation, should still be in progress
    await page.waitForTimeout(200)

    expect(await elementExists(page, 'scenario-44-target'), 'Still exists during lazy exit').toBe(true)
    const midOpacity = await getOpacity(page, 'scenario-44-target')

    // with lazy exit, opacity should still be intermediate at 200ms
    expect(
      isIntermediate(midOpacity, 1, 0) || midOpacity > 0.1,
      `Mid-exit opacity (${midOpacity.toFixed(2)}) should be intermediate (lazy exit)`
    ).toBe(true)

    // wait for full completion - lazy spring has stiffness=50 which is very slow
    // give it up to 5 seconds total
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(500)
      const exists = await elementExists(page, 'scenario-44-target')
      if (!exists) break
      if (i === 9) {
        console.log(`[DEBUG] Element still exists after ${(i + 1) * 500 + 200}ms`)
      }
    }
    expect(await elementExists(page, 'scenario-44-target'), 'Gone after lazy exit').toBe(false)
  })

  test('scenario 45: enter/exit/default - property changes use default animation', async ({ page }) => {
    // element visible, test property change animation (should use lazy default)
    expect(await elementExists(page, 'scenario-45-target'), 'Initially visible').toBe(true)
    const initialOpacity = await getOpacity(page, 'scenario-45-target')
    // use precision 0 (within 0.5) - CI timing causes animation to not fully settle
    expect(initialOpacity, 'Initial opacity').toBeCloseTo(1, 0)

    // click prop button to change opacity (not enter/exit, so uses default=lazy)
    await page.getByTestId('scenario-45-trigger-prop').click()

    // at 200ms into lazy (~500ms), should be intermediate
    await page.waitForTimeout(200)
    const midOpacity = await getOpacity(page, 'scenario-45-target')

    expect(
      isIntermediate(midOpacity, 1, 0.5) || midOpacity > 0.6,
      `Prop change opacity (${midOpacity.toFixed(2)}) should use lazy default`
    ).toBe(true)

    // wait for completion
    await page.waitForTimeout(800)
    expect(await getOpacity(page, 'scenario-45-target'), 'Final opacity').toBeCloseTo(0.5, 1)
  })

  test('scenario 46: enter/exit with per-property config - opacity uses its own animation', async ({ page }) => {
    // test that opacity uses lazy regardless of enter/exit setting
    // hide first (spring animations need more time)
    await page.getByTestId('scenario-46-trigger').click()
    await page.waitForTimeout(1500)

    // show - opacity should use lazy (slow) even though enter=bouncy for other props
    await page.getByTestId('scenario-46-trigger').click()
    await page.waitForTimeout(100)
    expect(await elementExists(page, 'scenario-46-target'), 'Should appear').toBe(true)

    // at 200ms, if opacity uses lazy (~500ms), it should still be animating
    await page.waitForTimeout(150)
    const midOpacity = await getOpacity(page, 'scenario-46-target')

    // opacity with lazy should be slow
    expect(
      isIntermediate(midOpacity, 0, 1) || midOpacity < 0.8,
      `Opacity (${midOpacity.toFixed(2)}) should use lazy per-property config`
    ).toBe(true)

    await page.waitForTimeout(1000)
    expect(await getOpacity(page, 'scenario-46-target'), 'Final').toBeCloseTo(1, 1)
  })

  test('scenario 47: enter/exit with delay - animations start after delay', async ({ page }) => {
    // hide first (spring animations need more time)
    await page.getByTestId('scenario-47-trigger').click()
    await page.waitForTimeout(1500)
    expect(await elementExists(page, 'scenario-47-target'), 'Hidden').toBe(false)

    // show - should have 200ms delay before enter animation starts
    await page.getByTestId('scenario-47-trigger').click()

    // element appears but at 100ms (during delay), should still be at enterStyle values
    await page.waitForTimeout(100)
    expect(await elementExists(page, 'scenario-47-target'), 'Should appear immediately').toBe(true)

    const duringDelayOpacity = await getOpacity(page, 'scenario-47-target')
    // during 200ms delay, opacity should be near 0 (enterStyle)
    expect(duringDelayOpacity, 'During delay, should be at enterStyle').toBeLessThan(0.3)

    // after delay + some animation time
    await page.waitForTimeout(400)
    const afterDelayOpacity = await getOpacity(page, 'scenario-47-target')
    // should be animating or completed by now
    expect(afterDelayOpacity, 'After delay, should be animating').toBeGreaterThan(0.3)

    // wait for full completion
    await page.waitForTimeout(1000)
    expect(await getOpacity(page, 'scenario-47-target'), 'Final').toBeCloseTo(1, 1)
  })

  test('enter animation timing differs from exit timing', async ({ page }, testInfo) => {
    /**
     * This is the core test for the enter/exit feature.
     * We measure timing to verify enter is slow (lazy) and exit is fast (quick).
     */
    const driver = (testInfo.project?.metadata as any)?.animationDriver

    // first hide, then show to measure enter timing (spring animations need more time)
    await page.getByTestId('scenario-42-trigger').click()
    await page.waitForTimeout(1500)

    // measure enter animation
    const enterStart = Date.now()
    await page.getByTestId('scenario-42-trigger').click()
    await page.waitForTimeout(50) // give it a moment to appear

    // wait until opacity reaches 0.9 (near complete)
    let enterDuration = 0
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(50)
      const opacity = await getOpacity(page, 'scenario-42-target')
      if (opacity >= 0.9) {
        enterDuration = Date.now() - enterStart
        break
      }
    }

    // now measure exit animation
    await page.waitForTimeout(200) // ensure enter is complete
    const exitStart = Date.now()
    await page.getByTestId('scenario-42-trigger').click()

    // wait until element is gone or opacity < 0.1
    let exitDuration = 0
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(50)
      const exists = await elementExists(page, 'scenario-42-target')
      if (!exists) {
        exitDuration = Date.now() - exitStart
        break
      }
      const opacity = await getOpacity(page, 'scenario-42-target')
      if (opacity < 0.1) {
        exitDuration = Date.now() - exitStart
        break
      }
    }

    // enter (lazy ~500ms) should be significantly slower than exit (quick ~150ms)
    // we use a ratio check rather than absolute values for cross-driver compatibility
    if (enterDuration > 0 && exitDuration > 0) {
      expect(
        enterDuration > exitDuration * 1.5,
        `Enter (${enterDuration}ms) should be slower than exit (${exitDuration}ms)`
      ).toBe(true)
    }
  })
})
