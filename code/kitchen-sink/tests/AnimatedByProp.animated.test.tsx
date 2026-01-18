import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests for the animatedBy prop.
 *
 * The key test: animatedBy="default" should work the same as not setting it,
 * meaning the animation driver is properly looked up and applied.
 *
 * If the lookup is broken (returns null), the element with animatedBy="default"
 * won't animate, while the one without animatedBy will still animate via context.
 */

const TOLERANCE = 0.05

function isIntermediate(value: number, start: number, end: number, tolerance = TOLERANCE): boolean {
  const notAtStart = Math.abs(value - start) > tolerance
  const notAtEnd = Math.abs(value - end) > tolerance
  const min = Math.min(start, end)
  const max = Math.max(start, end)
  const inRange = value >= min - tolerance && value <= max + tolerance
  return notAtStart && notAtEnd && inRange
}

test.describe('animatedBy prop', () => {
  // Skip native driver - it doesn't work on web
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'native', 'Native driver not supported on web')

    await setupPage(page, {
      name: 'AnimatedByProp',
      type: 'useCase',
    })
    await page.waitForTimeout(500)
  })

  test('animatedBy="default" element animates properly', async ({ page }) => {
    const START = 0.5, END = 1
    const explicitElement = page.getByTestId('explicit-default')

    // Initial state
    const initialOpacity = await explicitElement.evaluate(
      (el) => Number(getComputedStyle(el).opacity)
    )
    expect(initialOpacity).toBeCloseTo(START, 1)

    // Trigger animation
    await page.getByTestId('toggle-trigger').click()

    // Capture shortly after click
    // If broken (no driver), opacity jumps instantly to END
    // If working, opacity should NOT be at END yet (animation in progress)
    await page.waitForTimeout(16) // ~1 frame
    const immediateOpacity = await explicitElement.evaluate(
      (el) => Number(getComputedStyle(el).opacity)
    )

    // Wait for animation to complete
    await page.waitForTimeout(600)

    const finalOpacity = await explicitElement.evaluate(
      (el) => Number(getComputedStyle(el).opacity)
    )

    // Should reach end state eventually
    expect(
      finalOpacity,
      `Should reach end state (${END}), got ${finalOpacity.toFixed(2)}`
    ).toBeCloseTo(END, 1)

    // Key test: with proper animation driver, opacity should NOT jump instantly to END
    // When broken, it jumps to 1.0 immediately. When working, it stays at ~0.5 initially.
    const jumpedInstantly = Math.abs(immediateOpacity - END) < TOLERANCE
    expect(
      jumpedInstantly,
      `With animatedBy="default", opacity should not jump instantly to ${END}. ` +
      `Got immediate=${immediateOpacity.toFixed(2)}. If it jumped, the driver lookup is broken.`
    ).toBe(false)
  })

  test('context default (no animatedBy) also animates', async ({ page }) => {
    const START = 0.5, END = 1

    const contextElement = page.getByTestId('context-driver')

    const initialOpacity = await contextElement.evaluate(
      (el) => Number(getComputedStyle(el).opacity)
    )
    expect(initialOpacity).toBeCloseTo(START, 1)

    await page.getByTestId('toggle-trigger').click()
    await page.waitForTimeout(50)

    const midOpacity = await contextElement.evaluate(
      (el) => Number(getComputedStyle(el).opacity)
    )

    await page.waitForTimeout(500)
    const finalOpacity = await contextElement.evaluate(
      (el) => Number(getComputedStyle(el).opacity)
    )

    expect(finalOpacity, 'End opacity').toBeCloseTo(END, 1)
    expect(
      isIntermediate(midOpacity, START, END) || midOpacity > START,
      `Context default mid opacity (${midOpacity.toFixed(2)}) should show animation progress`
    ).toBe(true)
  })

  test('both elements animate in sync', async ({ page }) => {
    const explicitElement = page.getByTestId('explicit-default')
    const contextElement = page.getByTestId('context-driver')

    // Trigger animation
    await page.getByTestId('toggle-trigger').click()
    await page.waitForTimeout(500)

    // Both should reach end state
    const [explicitFinal, contextFinal] = await Promise.all([
      explicitElement.evaluate((el) => Number(getComputedStyle(el).opacity)),
      contextElement.evaluate((el) => Number(getComputedStyle(el).opacity)),
    ])

    expect(explicitFinal, 'animatedBy="default" end state').toBeCloseTo(1, 1)
    expect(contextFinal, 'context default end state').toBeCloseTo(1, 1)
  })
})
