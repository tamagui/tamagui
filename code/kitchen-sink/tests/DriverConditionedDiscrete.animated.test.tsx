import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Conditioned discrete (non-animatable) props on an inline animation driver.
 *
 * The direct emitter promotes unconditioned non-animatable props to atomic
 * classNames, but active-condition values (hover:, press:) stay inline and
 * reach the driver. The driver must apply them instantly - never interpolate
 * them or defer them to the end of a concurrently running animation.
 */

// ownership contract for the discrete-application fix: the motion driver's
// partition set is the inspectable place where "the driver does not animate
// this prop" lives. if the driver DID manage a discrete prop, that prop would
// be missing from this set and getMotionAnimatedProps would send it into
// framer's animate(), whose committed values the flush never clears. asserting
// the derivation here fails the moment anyone reverts the set to a hand list.
test('motion driver declares every emitter-discrete prop as non-animated', async () => {
  process.env.TAMAGUI_TARGET = 'web'
  const { disableAnimationProps } = await import('@tamagui/animations-motion')
  const { nonAnimatableStyleProps } = await import('@tamagui/helpers')
  const missing = Object.keys(nonAnimatableStyleProps).filter(
    (key) => !disableAnimationProps.has(key)
  )
  expect(missing, 'every non-animatable style prop is in the discrete set').toEqual([])
  // the two props this contract exists for: the derived border default
  // (fixStyles adds it inline on animated components) and the conditioned
  // discrete regression this file pins
  expect(disableAnimationProps.has('borderTopStyle')).toBe(true)
  expect(disableAnimationProps.has('cursor')).toBe(true)
})

test.describe('Conditioned discrete props with inline animation driver', () => {
  test.beforeEach(async ({ page }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    // css driver applies conditions via CSS classes; reanimated uses
    // an Animated.View where this promotion never applied. only inline
    // web drivers (motion) receive conditioned values as inline styles.
    test.skip(
      driver === 'css' || driver === 'reanimated',
      'only the motion driver receives conditioned values inline on web'
    )

    await setupPage(page, {
      name: 'DriverConditionedDiscreteCase',
      type: 'useCase',
    })
    await page.waitForTimeout(500)
  })

  test('hover-conditioned discrete props apply instantly while animation runs', async ({
    page,
  }) => {
    const box = page.getByTestId('box')

    const initial = await box.evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        cursor: s.cursor,
        borderTopStyle: s.borderTopStyle,
        opacity: Number.parseFloat(s.opacity),
      }
    })
    expect(initial.cursor).toBe('default')
    expect(initial.borderTopStyle).toBe('solid')
    expect(initial.opacity).toBeCloseTo(1, 1)

    // move onto the box: starts the 1000ms opacity animation and activates
    // the hover-conditioned discrete values
    const bounds = await box.boundingBox()
    if (!bounds) throw new Error('box not found')
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)

    // sample well inside the 1000ms animation window
    await page.waitForTimeout(200)
    const mid = await box.evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        cursor: s.cursor,
        borderTopStyle: s.borderTopStyle,
        opacity: Number.parseFloat(s.opacity),
      }
    })

    // the animation must still be in flight, proving we sampled mid-animation
    expect(
      mid.opacity,
      'opacity should be mid-animation (between 0.3 and 1)'
    ).toBeGreaterThan(0.35)
    expect(mid.opacity).toBeLessThan(0.98)

    // discrete values must already be applied, not deferred to animation end
    expect(mid.cursor, 'cursor should apply instantly').toBe('pointer')
    expect(mid.borderTopStyle, 'borderStyle should apply instantly').toBe('dashed')

    // settle and verify end state
    await page.waitForTimeout(1200)
    const end = await box.evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        cursor: s.cursor,
        borderTopStyle: s.borderTopStyle,
        opacity: Number.parseFloat(s.opacity),
      }
    })
    expect(end.opacity).toBeCloseTo(0.3, 1)
    expect(end.cursor).toBe('pointer')
    expect(end.borderTopStyle).toBe('dashed')

    // move away: discrete values revert instantly, opacity animates back
    await page.mouse.move(5, 5)
    await page.waitForTimeout(200)
    const after = await box.evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        cursor: s.cursor,
        borderTopStyle: s.borderTopStyle,
        opacity: Number.parseFloat(s.opacity),
      }
    })
    expect(after.cursor, 'cursor should revert instantly').toBe('default')
    expect(after.borderTopStyle, 'borderStyle should revert instantly').toBe('solid')
    expect(after.opacity, 'opacity should be animating back').toBeLessThan(0.95)
  })
})
