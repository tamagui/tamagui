import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests that non-animatable CSS properties (display, position, flexDirection, etc.)
 * use className (atomic CSS) instead of inline styles for animated components.
 * Animatable properties remain as inline styles for the driver to animate.
 */

test.describe('Driver disableAnimationProps className optimization', () => {
  // non-animatable props the motion driver declares it won't animate
  const NON_ANIMATABLE = [
    'display',
    'alignItems',
    'justifyContent',
    'position',
    'overflow',
    'flexDirection',
  ]

  // props that should be animated (kept as inline styles)
  const ANIMATABLE = ['opacity']

  test.beforeEach(async ({ page }) => {
    const driver = (test.info().project?.metadata as any)?.animationDriver
    // this optimization only applies to inline animation drivers that don't use RNW
    // css driver already uses classNames, native/reanimated use RNW's Animated.View
    // which doesn't forward className prop
    test.skip(
      driver === 'css' || driver === 'native' || driver === 'reanimated',
      'only motion driver benefits from this optimization on web'
    )

    await setupPage(page, {
      name: 'DriverDisableAnimationPropsCase',
      type: 'useCase',
    })
    await page.waitForTimeout(500)
  })

  test('non-animatable props should use className, not inline style', async ({
    page,
  }) => {
    const result = await page.evaluate((nonAnimatableProps) => {
      const el = document.querySelector('[data-testid="animated-box"]')
      if (!el) return null

      const inlineStyle = (el as HTMLElement).style
      const classNames = el.className

      const inlineNonAnimatable: Record<string, string> = {}
      const hasClassName = classNames.length > 0

      for (const prop of nonAnimatableProps) {
        const inlineVal = inlineStyle.getPropertyValue(prop) || inlineStyle[prop as any]
        if (inlineVal) {
          inlineNonAnimatable[prop] = inlineVal
        }
      }

      return {
        hasClassName,
        classNameLength: classNames.split(' ').length,
        inlineNonAnimatable,
        inlineStyleCssText: inlineStyle.cssText,
      }
    }, NON_ANIMATABLE)

    expect(result, 'element should exist').toBeTruthy()

    // element should have classNames (atomic CSS)
    expect(result?.hasClassName, 'should have className').toBe(true)
    expect(
      result?.classNameLength,
      'should have multiple atomic CSS classes'
    ).toBeGreaterThan(1)

    // non-animatable props should NOT be in inline style
    for (const prop of NON_ANIMATABLE) {
      expect(
        result?.inlineNonAnimatable[prop],
        `${prop} should not be in inline style (should be className)`
      ).toBeFalsy()
    }
  })

  test('animatable props should be inline style for driver to animate', async ({
    page,
  }) => {
    // trigger active state to start animation
    await page.getByTestId('trigger').click()
    await page.waitForTimeout(200)

    const result = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="animated-box"]')
      if (!el) return null

      const s = getComputedStyle(el)
      return {
        hasNonDefaultOpacity: Number.parseFloat(s.opacity) < 1,
        opacity: s.opacity,
      }
    })

    expect(result, 'element should exist').toBeTruthy()

    // opacity should be animating (not at the start value of 1)
    expect(
      result?.hasNonDefaultOpacity,
      'opacity should be animating after trigger'
    ).toBe(true)
  })

  test('animation still works correctly with className optimization', async ({
    page,
  }) => {
    // verify initial opacity
    const initialOpacity = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="animated-box"]')
      return el ? Number.parseFloat(getComputedStyle(el).opacity) : -1
    })
    expect(initialOpacity, 'initial opacity should be 1').toBeCloseTo(1, 1)

    // trigger animation
    await page.getByTestId('trigger').click()
    await page.waitForTimeout(1000)

    // verify end state
    const endOpacity = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="animated-box"]')
      return el ? Number.parseFloat(getComputedStyle(el).opacity) : -1
    })
    expect(endOpacity, 'end opacity should be ~0.5').toBeCloseTo(0.5, 1)

    // verify non-animatable props still work correctly
    const layoutProps = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="animated-box"]')
      if (!el) return null
      const s = getComputedStyle(el)
      return {
        display: s.display,
        alignItems: s.alignItems,
        justifyContent: s.justifyContent,
        position: s.position,
        overflow: s.overflow,
        flexDirection: s.flexDirection,
      }
    })

    expect(layoutProps?.display).toBe('flex')
    expect(layoutProps?.alignItems).toBe('center')
    expect(layoutProps?.justifyContent).toBe('center')
    expect(layoutProps?.position).toBe('relative')
    expect(layoutProps?.overflow).toBe('hidden')
    expect(layoutProps?.flexDirection).toBe('column')
  })
})
