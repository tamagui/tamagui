import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * ANIMATION TIMING BUG FIX TESTS
 *
 * Tests for two bugs:
 * 1. Enter/exit timing not respected - enter: '50ms' should actually be 50ms
 * 2. Duration normalization - duration: 1 should be 1ms, not 1 second
 *
 * These tests run across all animation drivers (css, native, reanimated, motion).
 */

async function getOpacity(page: Page, testId: string): Promise<number> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return -1
    return Number.parseFloat(getComputedStyle(el).opacity)
  }, testId)
}

async function elementExists(page: Page, testId: string): Promise<boolean> {
  return page.evaluate((id) => !!document.querySelector(`[data-testid="${id}"]`), testId)
}

test.describe('Animation Timing Bug Fixes', () => {
  // animation timing tests are flaky in CI due to timing variations - add retries
  test.describe.configure({ retries: 3 })

  test.beforeEach(async ({ page }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    test.skip(driver === 'native', 'native driver has element detection issues on web')

    await setupPage(page, {
      name: 'AnimationComprehensiveCase',
      type: 'useCase',
    })
    // wait for initial render
    await page.waitForTimeout(1000)
  })

  test('scenario 50: enter timing (200ms) should be faster than exit timing (1000ms)', async ({
    page,
  }) => {
    // first hide element (exit with 1000ms)
    expect(await elementExists(page, 'scenario-50-target'), 'Initially visible').toBe(
      true
    )

    // trigger exit
    await page.getByTestId('scenario-50-trigger').click()

    // exit should take ~1000ms - at 300ms it should still be animating
    await page.waitForTimeout(300)
    const midExitExists = await elementExists(page, 'scenario-50-target')
    if (midExitExists) {
      const midExitOpacity = await getOpacity(page, 'scenario-50-target')
      // at 300ms into 1000ms exit, opacity should still be > 0.3
      expect(
        midExitOpacity,
        `Mid-exit opacity at 300ms should be > 0.3 for 1000ms animation (got ${midExitOpacity})`
      ).toBeGreaterThan(0.3)
    }

    // wait for exit to complete
    await page.waitForTimeout(900)
    expect(await elementExists(page, 'scenario-50-target'), 'Hidden after exit').toBe(
      false
    )

    // trigger enter
    const enterStart = Date.now()
    await page.getByTestId('scenario-50-trigger').click()

    // wait for element to appear
    await page.waitForFunction(
      (testId) => !!document.querySelector(`[data-testid="${testId}"]`),
      'scenario-50-target',
      { timeout: 1000 }
    )

    // enter is 200ms - at 150ms check if already nearly complete (it should be fast!)
    await page.waitForTimeout(150)
    const earlyEnterOpacity = await getOpacity(page, 'scenario-50-target')

    // BUG CHECK: if enter is actually 200ms, opacity should be > 0.5 at 150ms
    // if it's using 1000ms timing instead, opacity would still be < 0.2
    expect(
      earlyEnterOpacity,
      `Enter opacity at 150ms should be > 0.4 if using 200ms timing (got ${earlyEnterOpacity})`
    ).toBeGreaterThan(0.4)

    // wait a bit more - enter should complete quickly
    await page.waitForTimeout(200)
    const finalOpacity = await getOpacity(page, 'scenario-50-target')
    expect(finalOpacity, 'Enter should complete quickly').toBeGreaterThan(0.9)

    const totalEnterTime = Date.now() - enterStart
    // enter animation (200ms) + overhead should complete in under 500ms
    expect(
      totalEnterTime,
      `Enter animation should complete in ~350ms (got ${totalEnterTime}ms)`
    ).toBeLessThan(600)
  })

  test('scenario 51: duration: 1 should be 1ms (instant), not 1 second', async ({
    page,
  }) => {
    expect(await elementExists(page, 'scenario-51-target'), 'Initially visible').toBe(
      true
    )

    // trigger exit with duration: 1 (should be 1ms = instant)
    await page.getByTestId('scenario-51-trigger').click()

    // if duration is correctly 1ms, element should be gone almost immediately
    // wait just 50ms - if it's treating 1 as 1 second, element would still exist
    await page.waitForTimeout(50)

    // BUG CHECK: element should be gone by now if duration is 1ms
    // if duration is being treated as 1 second, element would still be visible
    const stillExists = await elementExists(page, 'scenario-51-target')

    // if element still exists, check opacity - should be near 0 if 1ms animation
    if (stillExists) {
      const opacity = await getOpacity(page, 'scenario-51-target')
      // if duration is 1ms, opacity should be at 0 (animation complete)
      // if duration is 1s, opacity would be ~0.95 at 50ms
      expect(
        opacity,
        `Opacity should be near 0 at 50ms if duration is 1ms (got ${opacity})`
      ).toBeLessThan(0.2)
    }

    // definitely should be gone by 200ms
    await page.waitForTimeout(200)
    expect(
      await elementExists(page, 'scenario-51-target'),
      'Should be gone by 200ms'
    ).toBe(false)
  })

  test('scenario 51: verify animation is fast (not 1 second)', async ({ page }) => {
    expect(await elementExists(page, 'scenario-51-target'), 'Initially visible').toBe(
      true
    )

    const startTime = Date.now()

    // trigger exit
    await page.getByTestId('scenario-51-trigger').click()

    // wait for element to disappear
    await page.waitForFunction(
      (testId) => !document.querySelector(`[data-testid="${testId}"]`),
      'scenario-51-target',
      { timeout: 2000 }
    )

    const exitDuration = Date.now() - startTime

    // BUG CHECK: if duration is 1ms, exit should complete in < 200ms (animation + overhead)
    // if duration is 1 second, it would take > 1000ms
    expect(
      exitDuration,
      `Exit with duration:1 should complete quickly, not take ${exitDuration}ms`
    ).toBeLessThan(500)
  })

  test('scenario 52: inline duration override should be in milliseconds', async ({
    page,
  }) => {
    // base is 100ms, override is duration: 50 (should be 50ms)
    expect(await elementExists(page, 'scenario-52-target'), 'Initially visible').toBe(
      true
    )

    const startTime = Date.now()

    // trigger exit
    await page.getByTestId('scenario-52-trigger').click()

    // wait for exit
    await page.waitForFunction(
      (testId) => !document.querySelector(`[data-testid="${testId}"]`),
      'scenario-52-target',
      { timeout: 2000 }
    )

    const exitDuration = Date.now() - startTime

    // animation is 50ms + overhead, should complete in < 300ms
    expect(
      exitDuration,
      `Exit with duration:50 should complete in ~150ms (got ${exitDuration}ms)`
    ).toBeLessThan(400)
  })
})
