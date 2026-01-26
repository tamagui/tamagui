import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * ENTER/EXIT TRANSITION TESTS
 *
 * Tests the transition prop's enter/exit-specific animations using timing animations.
 * Supports syntax like: transition={{ enter: '500ms', exit: '100ms' }}
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
    await page.waitForTimeout(1000)
  })

  test('scenario 42: different enter/exit transitions - enter uses slow animation', async ({ page }) => {
    expect(await elementExists(page, 'scenario-42-target'), 'Initially visible').toBe(true)
    expect(await getOpacity(page, 'scenario-42-target'), 'Initial opacity').toBeCloseTo(1, 1)

    // hide then show to test enter animation (enter=500ms)
    await page.getByTestId('scenario-42-trigger').click()
    await page.waitForTimeout(300) // exit=100ms + buffer

    expect(await elementExists(page, 'scenario-42-target'), 'Hidden').toBe(false)

    await page.getByTestId('scenario-42-trigger').click()
    await page.waitForTimeout(50)
    expect(await elementExists(page, 'scenario-42-target'), 'Should appear').toBe(true)

    await page.waitForTimeout(150)
    const midEnterOpacity = await getOpacity(page, 'scenario-42-target')

    expect(
      isIntermediate(midEnterOpacity, 0, 1),
      `Mid-enter opacity (${midEnterOpacity.toFixed(2)}) should be intermediate at 200ms into 500ms`
    ).toBe(true)

    await page.waitForTimeout(500)
    expect(await getOpacity(page, 'scenario-42-target'), 'Final opacity').toBeCloseTo(1, 1)
  })

  test('scenario 42: different enter/exit transitions - exit uses fast animation', async ({ page }) => {
    expect(await elementExists(page, 'scenario-42-target'), 'Initially visible').toBe(true)

    // trigger exit (exit=100ms - fast)
    await page.getByTestId('scenario-42-trigger').click()
    await page.waitForTimeout(300) // 100ms + buffer

    expect(await elementExists(page, 'scenario-42-target'), 'Gone after fast exit').toBe(false)
  })

  test('scenario 43: enter-only transition - enter uses specified, exit uses default', async ({ page }) => {
    // enter=500ms, exit uses default=100ms
    expect(await elementExists(page, 'scenario-43-target'), 'Initially visible').toBe(true)

    // hide - uses default=100ms (fast)
    await page.getByTestId('scenario-43-trigger').click()
    await page.waitForTimeout(300)
    expect(await elementExists(page, 'scenario-43-target'), 'Hidden').toBe(false)

    // show - uses enter=500ms (slow)
    await page.getByTestId('scenario-43-trigger').click()
    await page.waitForTimeout(200)
    const midOpacity = await getOpacity(page, 'scenario-43-target')

    expect(
      isIntermediate(midOpacity, 0, 1),
      `Enter opacity (${midOpacity.toFixed(2)}) should be intermediate at 200ms into 500ms`
    ).toBe(true)

    await page.waitForTimeout(500)
    expect(await getOpacity(page, 'scenario-43-target'), 'Final').toBeCloseTo(1, 1)
  })

  test('scenario 44: exit-only transition - exit uses specified 500ms (slow)', async ({ page }) => {
    // exit=500ms, enter uses default=100ms
    expect(await elementExists(page, 'scenario-44-target'), 'Initially visible').toBe(true)

    // trigger exit - uses 500ms (slow)
    await page.getByTestId('scenario-44-trigger').click()

    // at 200ms into a 500ms animation, should still be in progress
    await page.waitForTimeout(200)

    expect(await elementExists(page, 'scenario-44-target'), 'Still exists during 500ms exit').toBe(true)
    const midOpacity = await getOpacity(page, 'scenario-44-target')

    // with 500ms exit, opacity should still be intermediate at 200ms
    expect(
      isIntermediate(midOpacity, 1, 0),
      `Mid-exit opacity (${midOpacity.toFixed(2)}) should be intermediate at 200ms into 500ms`
    ).toBe(true)

    // wait for completion (500ms + buffer)
    await page.waitForTimeout(500)
    expect(await elementExists(page, 'scenario-44-target'), 'Gone after 500ms exit').toBe(false)
  })

  test('scenario 45: enter/exit/default - property changes use default animation', async ({ page }) => {
    // enter=300ms, exit=100ms, default=500ms for property changes
    expect(await elementExists(page, 'scenario-45-target'), 'Initially visible').toBe(true)
    const initialOpacity = await getOpacity(page, 'scenario-45-target')
    expect(initialOpacity, 'Initial opacity').toBeCloseTo(1, 1)

    // click prop button to change opacity (not enter/exit, so uses default=500ms)
    await page.getByTestId('scenario-45-trigger-prop').click()

    // at 300ms into 500ms animation, should be intermediate (between 1 and 0.5)
    await page.waitForTimeout(300)
    const midOpacity = await getOpacity(page, 'scenario-45-target')

    expect(
      isIntermediate(midOpacity, 1, 0.5),
      `Prop change opacity (${midOpacity.toFixed(2)}) should be intermediate at 300ms into 500ms animation`
    ).toBe(true)

    // wait for completion (500ms animation + buffer)
    await page.waitForTimeout(400)
    expect(await getOpacity(page, 'scenario-45-target'), 'Final opacity').toBeCloseTo(0.5, 1)
  })

  test('scenario 46: enter/exit with per-property config - opacity uses its own animation', async ({ page }) => {
    // enter=300ms for scale, exit=100ms for scale, but opacity always=500ms
    // hide first
    await page.getByTestId('scenario-46-trigger').click()
    await page.waitForTimeout(700) // opacity=500ms + buffer

    expect(await elementExists(page, 'scenario-46-target'), 'Hidden').toBe(false)

    // show - opacity should use 500ms even though enter=300ms for other props
    await page.getByTestId('scenario-46-trigger').click()
    await page.waitForTimeout(200)

    const midOpacity = await getOpacity(page, 'scenario-46-target')

    // at 200ms into 500ms opacity animation, should be intermediate
    expect(
      isIntermediate(midOpacity, 0, 1),
      `Mid-enter opacity (${midOpacity.toFixed(2)}) should be intermediate at 200ms into 500ms`
    ).toBe(true)

    await page.waitForTimeout(500)
    expect(await getOpacity(page, 'scenario-46-target'), 'Final').toBeCloseTo(1, 1)
  })

  test('scenario 47: enter/exit with delay - animations start after delay', async ({ page }) => {
    // enter=300ms, exit=100ms, delay=200ms
    expect(await elementExists(page, 'scenario-47-target'), 'Initially visible').toBe(true)

    // trigger exit
    await page.getByTestId('scenario-47-trigger').click()

    // at 100ms, still within 200ms delay - should still be visible at full opacity
    await page.waitForTimeout(100)
    expect(await elementExists(page, 'scenario-47-target'), 'Still visible during delay').toBe(true)
    const delayOpacity = await getOpacity(page, 'scenario-47-target')
    expect(delayOpacity, 'Opacity during delay').toBeGreaterThan(0.8)

    // wait for delay + animation to complete
    await page.waitForTimeout(400) // 200ms delay + 100ms exit + buffer
    expect(await elementExists(page, 'scenario-47-target'), 'Gone after delay + exit').toBe(false)
  })

  test('enter animation timing differs from exit timing', async ({ page }) => {
    // scenario 42 uses enter=500ms, exit=100ms
    const startTime = Date.now()

    // trigger exit
    await page.getByTestId('scenario-42-trigger').click()

    // wait for element to disappear
    await page.waitForFunction(
      (testId) => !document.querySelector(`[data-testid="${testId}"]`),
      'scenario-42-target',
      { timeout: 5000 }
    )

    const exitDuration = Date.now() - startTime

    // exit should be fast (100ms + overhead)
    expect(exitDuration, 'Exit should be fast').toBeLessThan(500)

    // now trigger enter
    const enterStart = Date.now()
    await page.getByTestId('scenario-42-trigger').click()

    // wait for element to fully appear
    await page.waitForTimeout(100)
    await page.waitForFunction(
      (testId) => {
        const el = document.querySelector(`[data-testid="${testId}"]`)
        if (!el) return false
        return Number.parseFloat(getComputedStyle(el).opacity) > 0.9
      },
      'scenario-42-target',
      { timeout: 5000 }
    )

    const enterDuration = Date.now() - enterStart

    // enter should be slower than exit
    expect(enterDuration, 'Enter should be slower than exit').toBeGreaterThan(exitDuration)
  })
})
