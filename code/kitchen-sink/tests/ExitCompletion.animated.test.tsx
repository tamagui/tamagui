import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * EXIT COMPLETION INVARIANT TESTS
 *
 * Tests that sendExitComplete is called exactly once per exit cycle,
 * at the correct time (after animations complete), and handles edge cases
 * like rapid toggling, interruptions, and zero-duration animations.
 *
 * These tests catch bugs in exit completion tracking across all animation drivers.
 */

interface ExitTrackingData {
  counts: Record<string, number>
  times: Record<string, number[]>
}

async function getExitTrackingData(page: Page): Promise<ExitTrackingData> {
  return page.evaluate(() => ({
    counts: (window as any).__exitCompletionCounts || {},
    times: (window as any).__exitCompletionTimes || {},
  }))
}

async function resetExitTracking(page: Page): Promise<void> {
  await page.evaluate(() => {
    ;(window as any).__resetExitTracking?.()
  })
}

async function waitForExitComplete(
  page: Page,
  scenarioId: string,
  timeout = 2000
): Promise<number> {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    const data = await getExitTrackingData(page)
    if (data.counts[scenarioId] && data.counts[scenarioId] > 0) {
      return data.counts[scenarioId]
    }
    await page.waitForTimeout(50)
  }
  // return count even if zero (timed out)
  const data = await getExitTrackingData(page)
  return data.counts[scenarioId] || 0
}

async function expectStableCompletionCount(
  page: Page,
  scenarioId: string,
  expectedCount: number,
  settleMs = 300
): Promise<void> {
  await page.waitForTimeout(settleMs)
  const data = await getExitTrackingData(page)
  expect(
    data.counts[scenarioId] || 0,
    `${scenarioId} should remain at ${expectedCount} completion(s)`
  ).toBe(expectedCount)
}

async function elementExists(page: Page, testId: string): Promise<boolean> {
  return page.evaluate((id) => !!document.querySelector(`[data-testid="${id}"]`), testId)
}

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ExitCompletionCase', type: 'useCase' })
  await page.waitForTimeout(500) // let initial render settle
  await resetExitTracking(page)
})

test.describe('Basic Exit Completion', () => {
  test('scenario 01: basic exit completes exactly once', async ({ page }) => {
    await page.getByTestId('exit-01-trigger').click()

    // wait for exit to complete
    const count = await waitForExitComplete(page, '01-basic-exit')

    expect(count, 'Exit should complete exactly once').toBe(1)
    await expectStableCompletionCount(page, '01-basic-exit', 1, 400)
    expect(await elementExists(page, 'exit-01-target'), 'Element should be gone').toBe(
      false
    )
  })

  test('scenario 02: zero duration exit completes exactly once', async ({ page }) => {
    await page.getByTestId('exit-02-trigger').click()

    // zero duration should still complete once
    const count = await waitForExitComplete(page, '02-zero-duration', 500)

    expect(count, 'Zero duration exit should complete exactly once').toBe(1)
    await expectStableCompletionCount(page, '02-zero-duration', 1, 200)
    expect(await elementExists(page, 'exit-02-target'), 'Element should be gone').toBe(
      false
    )
  })

  test('scenario 03: very short duration (30ms) completes exactly once', async ({
    page,
  }) => {
    await page.getByTestId('exit-03-trigger').click()

    const count = await waitForExitComplete(page, '03-short-duration', 500)

    expect(count, 'Short duration exit should complete exactly once').toBe(1)
    await expectStableCompletionCount(page, '03-short-duration', 1, 250)
    expect(await elementExists(page, 'exit-03-target'), 'Element should be gone').toBe(
      false
    )
  })
})

test.describe('Duplicate Completion Guards', () => {
  test('scenario 04: rapid toggle does not cause duplicate completions', async ({
    page,
  }) => {
    // this test catches finding #4/#5: duplicate completions on re-renders
    await page.getByTestId('exit-04-trigger').click()

    // wait for the sequence to complete (off -> on -> off)
    await page.waitForTimeout(800)

    const data = await getExitTrackingData(page)
    const count = data.counts['04-rapid-toggle'] || 0

    // first exit is interrupted; only final exit should complete
    expect(count, 'Rapid toggle should complete exactly once for the final exit').toBe(1)
    expect(await elementExists(page, 'exit-04-target'), 'Element should be gone').toBe(
      false
    )
  })

  test('scenario 05: re-renders during exit do not cause duplicate completions', async ({
    page,
  }) => {
    // this test catches finding #4: flush restart causing duplicate completions
    await page.getByTestId('exit-05-trigger').click()

    // wait for exit + re-renders to complete
    await page.waitForTimeout(800)

    const data = await getExitTrackingData(page)
    const count = data.counts['05-rerender-during-exit'] || 0

    expect(count, 'Re-renders during exit should not cause duplicate completions').toBe(1)
    expect(await elementExists(page, 'exit-05-target'), 'Element should be gone').toBe(
      false
    )
  })

  test('scenario 06: multiple children exiting fires completion once', async ({
    page,
  }) => {
    await page.getByTestId('exit-06-trigger').click()

    // wait for all 3 children to exit
    await page.waitForTimeout(800)

    const data = await getExitTrackingData(page)
    const count = data.counts['06-multiple-children'] || 0

    // AnimatePresence should fire onExitComplete once after ALL children exit
    expect(count, 'Multiple children should trigger one completion').toBe(1)
    expect(await elementExists(page, 'exit-06-target-1'), 'Child 1 should be gone').toBe(
      false
    )
    expect(await elementExists(page, 'exit-06-target-2'), 'Child 2 should be gone').toBe(
      false
    )
    expect(await elementExists(page, 'exit-06-target-3'), 'Child 3 should be gone').toBe(
      false
    )
  })
})

test.describe('Timing Validation', () => {
  test('scenario 07: long animation (500ms) completes after animation finishes', async ({
    page,
  }) => {
    await page.getByTestId('exit-07-trigger').click()

    const startTime = Date.now()
    await waitForExitComplete(page, '07-long-animation', 2000)
    const elapsed = Date.now() - startTime

    const data = await getExitTrackingData(page)
    const completionTime = data.times['07-long-animation']?.[0] || 0

    // completion should happen after ~500ms, not immediately
    // allow some tolerance for CI variance
    expect(
      completionTime,
      'Exit should complete after animation (>350ms)'
    ).toBeGreaterThan(350)
    expect(data.counts['07-long-animation'], 'Should complete exactly once').toBe(1)
  })

  test('scenario 08: interrupted exit completes at most once', async ({ page }) => {
    // this test catches finding #2: canceled animations counted as complete
    await page.getByTestId('exit-08-trigger').click()

    // wait for the full sequence: exit -> interrupt -> exit again
    await page.waitForTimeout(1200)

    const data = await getExitTrackingData(page)
    const count = data.counts['08-interrupted'] || 0

    // the interrupted exit should not count as complete:
    // only the final successful exit should complete
    expect(count, 'Interrupted exit should complete exactly once').toBe(1)

    const completionTime = data.times['08-interrupted']?.[0] || 0
    expect(
      completionTime,
      'Interrupted scenario should not complete early (final completion should be late)'
    ).toBeGreaterThan(350)

    // final state should be hidden
    const status = await page.getByTestId('exit-08-status').textContent()
    expect(status).toBe('hidden')
  })

  test('scenario 09: stress test with many cancel/restart cycles', async ({ page }) => {
    await page.getByTestId('exit-09-trigger').click()

    // wait for the stress test sequence to complete
    await page.waitForTimeout(1500)

    const data = await getExitTrackingData(page)
    const count = data.counts['09-cancel-restart'] || 0

    // all interim exits are interrupted; only the final exit should complete
    expect(count, 'Stress test should complete exactly once').toBe(1)

    // final state should be hidden
    const status = await page.getByTestId('exit-09-status').textContent()
    expect(status).toBe('hidden')
  })
})

test.describe('Per-Property Exit', () => {
  test('scenario 10: per-property exit waits for longest animation', async ({
    page,
  }, testInfo) => {
    // motion driver can't differentiate transform sub-keys (scale becomes transform)
    // so per-property timing for scale vs opacity doesn't work
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver === 'motion') {
      test.skip()
      return
    }

    // this test catches finding #1: emitter-driven keys not tracked
    // opacity=100ms, scale=500ms - should wait for scale
    await page.getByTestId('exit-10-trigger').click()

    await waitForExitComplete(page, '10-per-property', 2000)

    const data = await getExitTrackingData(page)
    const completionTime = data.times['10-per-property']?.[0] || 0

    // should wait for the slow scale animation (500ms), not just opacity (100ms)
    // allow tolerance for CI
    expect(
      completionTime,
      'Per-property exit should wait for longest animation (>350ms)'
    ).toBeGreaterThan(350)
    expect(data.counts['10-per-property'], 'Should complete exactly once').toBe(1)
    await expectStableCompletionCount(page, '10-per-property', 1, 350)
  })

  test('scenario 11: mixed duration exit completes after slowest property', async ({
    page,
  }, testInfo) => {
    // motion driver can't differentiate transform sub-keys
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver === 'motion') {
      test.skip()
      return
    }

    // opacity=100ms, scale/y=400ms
    await page.getByTestId('exit-11-trigger').click()

    await waitForExitComplete(page, '11-mixed-duration', 2000)

    const data = await getExitTrackingData(page)
    const completionTime = data.times['11-mixed-duration']?.[0] || 0

    // should wait for 400ms animations, not 100ms opacity
    expect(
      completionTime,
      'Mixed duration should wait for slowest property (>300ms)'
    ).toBeGreaterThan(300)
    expect(data.counts['11-mixed-duration'], 'Should complete exactly once').toBe(1)
    await expectStableCompletionCount(page, '11-mixed-duration', 1, 350)
  })
})

test.describe('Element removal timing', () => {
  test('element should exist during exit animation', async ({ page }) => {
    // verify element stays in DOM during exit animation
    await page.getByTestId('exit-07-trigger').click()

    // immediately after triggering, element should still exist
    await page.waitForTimeout(50)
    expect(
      await elementExists(page, 'exit-07-target'),
      'Element should exist during exit animation'
    ).toBe(true)

    // at 200ms into 500ms animation, should still exist
    await page.waitForTimeout(150)
    expect(
      await elementExists(page, 'exit-07-target'),
      'Element should still exist at 200ms into 500ms animation'
    ).toBe(true)

    // after animation completes, should be gone
    await page.waitForTimeout(500)
    expect(
      await elementExists(page, 'exit-07-target'),
      'Element should be gone after animation completes'
    ).toBe(false)
  })
})

test.describe('AnimateOnly & Transform Sub-Keys', () => {
  test('scenario 51: animateOnly excludes scale from pending set', async ({
    page,
  }, testInfo) => {
    // this test uses CSS-style duration strings which only CSS driver supports
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver !== 'css') {
      test.skip()
      return
    }

    // animateOnly=['opacity'] with scale=500ms, opacity=100ms
    // should complete based on opacity timing (~100ms), not scale
    await page.getByTestId('exit-51-trigger').click()

    await waitForExitComplete(page, '51-animateonly-exclusion', 2000)

    const data = await getExitTrackingData(page)
    const completionTime = data.times['51-animateonly-exclusion']?.[0] || 0

    // should complete after opacity (100ms) finishes, not wait for excluded scale (500ms)
    // allow tolerance but should NOT wait 400-500ms
    expect(
      completionTime,
      'AnimateOnly should exclude scale - complete around opacity time (not 400+ms)'
    ).toBeLessThan(400)
    expect(data.counts['51-animateonly-exclusion'], 'Should complete exactly once').toBe(
      1
    )
    await expectStableCompletionCount(page, '51-animateonly-exclusion', 1, 350)
    expect(await elementExists(page, 'exit-51-target'), 'Element should be gone').toBe(
      false
    )
  })

  test('scenario 53: transform sub-keys with different durations wait for longest', async ({
    page,
  }, testInfo) => {
    // this test uses CSS-style duration strings ('100ms', '500ms') which only CSS driver supports
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver !== 'css') {
      test.skip()
      return
    }

    // scale=100ms, y=500ms - should wait for y
    await page.getByTestId('exit-53-trigger').click()

    await waitForExitComplete(page, '53-transform-subkeys', 2000)

    const data = await getExitTrackingData(page)
    const completionTime = data.times['53-transform-subkeys']?.[0] || 0

    // should wait for the slower y animation (500ms), not just scale (100ms)
    expect(
      completionTime,
      'Transform sub-keys should wait for longest (y=500ms, should be >350ms)'
    ).toBeGreaterThan(350)
    expect(data.counts['53-transform-subkeys'], 'Should complete exactly once').toBe(1)
    await expectStableCompletionCount(page, '53-transform-subkeys', 1, 350)
    expect(await elementExists(page, 'exit-53-target'), 'Element should be gone').toBe(
      false
    )
  })

  test('scenario 55: zero animatable props completes immediately', async ({ page }) => {
    // animateOnly=[] means nothing should animate, immediate completion
    await page.getByTestId('exit-55-trigger').click()

    const startTime = Date.now()
    await waitForExitComplete(page, '55-zero-animatable', 1000)
    const elapsed = Date.now() - startTime

    const data = await getExitTrackingData(page)
    const completionTime = data.times['55-zero-animatable']?.[0] || 0

    // should complete almost immediately since no animations
    expect(
      completionTime,
      'Zero animatable props should complete immediately (<100ms)'
    ).toBeLessThan(100)
    expect(data.counts['55-zero-animatable'], 'Should complete exactly once').toBe(1)
    await expectStableCompletionCount(page, '55-zero-animatable', 1, 200)
    expect(await elementExists(page, 'exit-55-target'), 'Element should be gone').toBe(
      false
    )
  })
})
