import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * PSEUDO TRANSITION TESTS
 *
 * Tests for the `transition` prop inside pseudo-style props (hoverStyle, pressStyle, etc.)
 *
 * CSS semantics:
 * - Enter pseudo state (e.g., hover): use that pseudo's transition (200ms)
 * - Exit pseudo state (e.g., unhover): use base transition (1000ms)
 *
 * These tests run across all animation drivers (css, native, reanimated, motion).
 */

async function getBackgroundColor(page: Page, testId: string): Promise<string> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return ''
    return getComputedStyle(el).backgroundColor
  }, testId)
}

async function getOpacity(page: Page, testId: string): Promise<number> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return -1
    return Number.parseFloat(getComputedStyle(el).opacity)
  }, testId)
}

function parseRgb(color: string): { r: number; g: number; b: number } | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return null
  return {
    r: Number.parseInt(match[1], 10),
    g: Number.parseInt(match[2], 10),
    b: Number.parseInt(match[3], 10),
  }
}

test.describe('Pseudo Transition Tests', () => {
  test.beforeEach(async ({ page }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    test.skip(driver === 'native', 'native driver has issues on web')

    await setupPage(page, {
      name: 'PseudoTransitionCase',
      type: 'useCase',
    })
    // wait for initial render
    await page.waitForTimeout(500)
  })

  test('scenario 1: hoverStyle transition - fast enter (200ms), slow exit (1000ms)', async ({
    page,
  }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    // CSS driver has limitations with pseudo-class transition timing
    test.skip(driver === 'css', 'CSS pseudo-class transitions have timing limitations')

    const target = page.getByTestId('scenario-1-target')
    const initialColor = await getBackgroundColor(page, 'scenario-1-target')

    // hover to trigger enter animation (should be fast - 200ms)
    await target.hover()

    // wait for enter to complete
    await page.waitForTimeout(350)
    const hoverColor = await getBackgroundColor(page, 'scenario-1-target')
    expect(hoverColor, 'Color should change on hover').not.toBe(initialColor)

    // move mouse away to trigger exit animation (should be slow - 1000ms)
    await page.mouse.move(0, 0)

    // at 400ms, exit should still be in progress (1000ms animation)
    await page.waitForTimeout(400)
    const midExitColor = await getBackgroundColor(page, 'scenario-1-target')
    const midExitRgb = parseRgb(midExitColor)
    const hoverRgb = parseRgb(hoverColor)
    const initialRgb = parseRgb(initialColor)

    // check that exit is still in progress (color not yet back to initial)
    if (midExitRgb && hoverRgb && initialRgb) {
      expect(
        midExitColor,
        'At 400ms into 1000ms exit, color should not be fully reset'
      ).not.toBe(initialColor)
    }

    // wait for full exit
    await page.waitForTimeout(800)
    const finalColor = await getBackgroundColor(page, 'scenario-1-target')
    expect(finalColor, 'Color should return to initial').toBe(initialColor)
  })

  test('scenario 2: pressStyle transition - fast press (200ms), slow release (1000ms)', async ({
    page,
  }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    // CSS driver has limitations with pseudo-class transition timing
    test.skip(driver === 'css', 'CSS pseudo-class transitions have timing limitations')

    const target = page.getByTestId('scenario-2-target')
    const initialColor = await getBackgroundColor(page, 'scenario-2-target')

    // press to trigger enter animation
    const box = await target.boundingBox()
    if (!box) throw new Error('Target not found')

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()

    // wait for press animation (200ms + buffer)
    await page.waitForTimeout(350)
    const pressColor = await getBackgroundColor(page, 'scenario-2-target')
    expect(pressColor, 'Color should change on press').not.toBe(initialColor)

    // release to trigger exit animation (should be slow - 1000ms)
    await page.mouse.up()

    // at 400ms, exit should still be in progress if using 1000ms base
    await page.waitForTimeout(400)
    const midReleaseColor = await getBackgroundColor(page, 'scenario-2-target')

    // check exit is still in progress across drivers
    const midRgb = parseRgb(midReleaseColor)
    const pressRgb = parseRgb(pressColor)
    const initRgb = parseRgb(initialColor)

    if (midRgb && pressRgb && initRgb) {
      expect(
        midReleaseColor,
        'At 400ms into 1000ms release, color should not be fully reset'
      ).not.toBe(initialColor)
    }

    // wait for full exit
    await page.waitForTimeout(800)
    const finalColor = await getBackgroundColor(page, 'scenario-2-target')
    expect(finalColor, 'Color should return to initial').toBe(initialColor)
  })

  test('scenario 6: opacity hover - fast fade in (200ms), slow fade out (1000ms)', async ({
    page,
  }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    // CSS driver has limitations with pseudo-class transition timing
    test.skip(driver === 'css', 'CSS pseudo-class transitions have timing limitations')

    const target = page.getByTestId('scenario-6-target')
    const initialOpacity = await getOpacity(page, 'scenario-6-target')
    expect(initialOpacity, 'Initial opacity should be ~0.3').toBeCloseTo(0.3, 1)

    // hover to trigger opacity increase
    await target.hover()

    // wait for enter to complete (200ms + buffer for springs)
    await page.waitForTimeout(400)
    const hoverOpacity = await getOpacity(page, 'scenario-6-target')
    expect(hoverOpacity, 'Hover opacity should be > 0.6').toBeGreaterThan(0.6)

    // move away to trigger opacity decrease (slow - 1000ms)
    await page.mouse.move(0, 0)

    // at 300ms, opacity should still be elevated if using 1000ms exit
    await page.waitForTimeout(300)
    const midExitOpacity = await getOpacity(page, 'scenario-6-target')

    expect(
      midExitOpacity,
      'Opacity at 300ms of 1000ms exit should still be elevated'
    ).toBeGreaterThan(0.4)

    // wait for full exit
    await page.waitForTimeout(800)
    const finalOpacity = await getOpacity(page, 'scenario-6-target')
    expect(finalOpacity, 'Final opacity should be ~0.3').toBeCloseTo(0.3, 1)
  })

  // BUG TEST: First pseudo interaction should use pseudo transition
  // Regression test for: prevPseudoState not initialized, causing first hover to use base transition
  test('first hover should use pseudo transition (not base)', async ({ page }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    // CSS driver has limitations with pseudo-class transition timing
    test.skip(driver === 'css', 'CSS pseudo-class transitions have timing limitations')

    const target = page.getByTestId('scenario-6-target')
    const initialOpacity = await getOpacity(page, 'scenario-6-target')
    expect(initialOpacity, 'Initial opacity should be ~0.3').toBeCloseTo(0.3, 1)

    // FIRST hover - should use fast 200ms pseudo transition
    await target.hover()

    // at 350ms, a 200ms animation should be complete (extra buffer for springs)
    await page.waitForTimeout(350)
    const firstHoverOpacity = await getOpacity(page, 'scenario-6-target')

    // if prevPseudoState wasn't initialized, this would use 1000ms base transition
    // and opacity would still be low (~0.4-0.5). with proper 200ms, should be > 0.6
    expect(
      firstHoverOpacity,
      `First hover should complete quickly with pseudo transition (got ${firstHoverOpacity}, driver: ${driver})`
    ).toBeGreaterThan(0.6)
  })

  // BUG TEST: Exit should use base transition, not cached pseudo transition
  // Regression test for: reanimated keeps pseudo config on exit instead of restoring base
  test('exit should use base transition timing (not cached pseudo)', async ({ page }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    // CSS driver has limitations with pseudo-class transition timing
    test.skip(driver === 'css', 'CSS pseudo-class transitions have timing limitations')

    const target = page.getByTestId('scenario-6-target')

    // hover to enter (fast 200ms) - wait longer for springs
    await target.hover()
    await page.waitForTimeout(400)
    const hoverOpacity = await getOpacity(page, 'scenario-6-target')
    expect(hoverOpacity, 'Should be at hover state').toBeGreaterThan(0.7)

    // exit hover - should use SLOW 1000ms base transition
    await page.mouse.move(0, 0)

    // at 250ms into a 1000ms exit, should still be > 0.4
    // if using cached 200ms pseudo transition, would already be near 0.3
    await page.waitForTimeout(250)
    const midExitOpacity = await getOpacity(page, 'scenario-6-target')

    expect(
      midExitOpacity,
      `Exit at 250ms of 1000ms should still be > 0.4 (got ${midExitOpacity}, driver: ${driver})`
    ).toBeGreaterThan(0.4)

    // wait for exit to complete
    await page.waitForTimeout(900)
    const finalOpacity = await getOpacity(page, 'scenario-6-target')
    expect(finalOpacity, 'Should return to initial').toBeCloseTo(0.3, 1)
  })

  test('scenario 6: repeated hover cycles keep slow exit timing (reanimated regression)', async ({
    page,
  }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    test.skip(
      driver !== 'reanimated',
      'Reanimated-specific config cache regression coverage'
    )

    const target = page.getByTestId('scenario-6-target')
    const initialOpacity = await getOpacity(page, 'scenario-6-target')
    expect(initialOpacity, 'Initial opacity should be ~0.3').toBeCloseTo(0.3, 1)

    const runCycle = async () => {
      await target.hover()
      await page.waitForTimeout(350)
      const hoveredOpacity = await getOpacity(page, 'scenario-6-target')
      expect(
        hoveredOpacity,
        'Enter should move quickly toward hover opacity'
      ).toBeGreaterThan(0.7)

      await page.mouse.move(0, 0)
      await page.waitForTimeout(300)
      const midExitOpacity = await getOpacity(page, 'scenario-6-target')
      expect(
        midExitOpacity,
        'Exit should still be in progress at 300ms (base 1000ms transition)'
      ).toBeGreaterThan(0.5)

      await page.waitForTimeout(900)
      const finalOpacity = await getOpacity(page, 'scenario-6-target')
      expect(finalOpacity, 'Cycle should return to base opacity').toBeCloseTo(0.3, 1)
    }

    await runCycle()
    await runCycle()
  })

  test('scenario 4: group hover transition - slow exit (1000ms base)', async ({
    page,
  }) => {
    // NOTE: CSS driver doesn't properly apply fast enter transition for group pseudo yet
    // This test focuses on verifying the slow exit (base transition) works correctly
    const container = page.getByTestId('scenario-4-container')
    const initialOpacity = await getOpacity(page, 'scenario-4-target')
    expect(initialOpacity, 'Initial opacity should be ~0.3').toBeCloseTo(0.3, 1)

    // hover over container to trigger group hover
    await container.hover()

    // wait for hover state to be fully applied (use longer time for all drivers)
    await page.waitForTimeout(1200)
    const hoverOpacity = await getOpacity(page, 'scenario-4-target')
    expect(hoverOpacity, 'Hover opacity should be ~1').toBeGreaterThan(0.9)

    // move away to trigger exit (slow - 1000ms base transition)
    await page.mouse.move(0, 0)

    // KEY TEST: at 300ms into 1000ms linear exit, opacity should still be > 0.5
    await page.waitForTimeout(300)
    const midExitOpacity = await getOpacity(page, 'scenario-4-target')
    expect(
      midExitOpacity,
      'Opacity should still be elevated during slow group-hover exit'
    ).toBeGreaterThan(0.5)

    // wait for full exit
    await page.waitForTimeout(900)
    const finalOpacity = await getOpacity(page, 'scenario-4-target')
    expect(finalOpacity, 'Final opacity should be ~0.3').toBeCloseTo(0.3, 1)
  })
})
