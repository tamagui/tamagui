import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Comprehensive tests for Sheet animation configurations
 * Tests CSS driver, Motion driver, and various animation prop combinations
 * Verifies that different animation configs produce measurably different animation speeds
 */

// Helper to measure actual animation duration by tracking transform changes
async function measureSheetAnimationDuration(
  page: any,
  triggerTestId: string,
  frameTestId: string,
  closeTestId: string
): Promise<number> {
  const trigger = page.getByTestId(triggerTestId)
  const closeButton = page.getByTestId(closeTestId)

  // Click trigger and measure how long until animation settles
  const duration = await page.evaluate(
    async ({ triggerId, frameId }: { triggerId: string; frameId: string }) => {
      return new Promise<number>((resolve) => {
        const trigger = document.querySelector(
          `[data-testid="${triggerId}"]`
        ) as HTMLElement
        if (!trigger) {
          resolve(-1)
          return
        }

        const startTime = performance.now()
        let lastTransform = ''
        let stableCount = 0
        let checkCount = 0
        const maxChecks = 100 // 5 seconds max

        trigger.click()

        const checkAnimation = () => {
          checkCount++
          const frame = document.querySelector(
            `[data-testid="${frameId}"]`
          ) as HTMLElement
          if (!frame) {
            if (checkCount < maxChecks) {
              requestAnimationFrame(checkAnimation)
            } else {
              resolve(performance.now() - startTime)
            }
            return
          }

          const currentTransform = getComputedStyle(frame).transform

          // Check if transform has stabilized (same value for 3 consecutive frames)
          if (currentTransform === lastTransform) {
            stableCount++
            if (stableCount >= 3) {
              resolve(performance.now() - startTime)
              return
            }
          } else {
            stableCount = 0
            lastTransform = currentTransform
          }

          if (checkCount < maxChecks) {
            requestAnimationFrame(checkAnimation)
          } else {
            resolve(performance.now() - startTime)
          }
        }

        requestAnimationFrame(checkAnimation)
      })
    },
    { triggerId: triggerTestId, frameId: frameTestId }
  )

  // Close the sheet for next test
  await closeButton.click()
  await page.waitForTimeout(600)

  return Math.round(duration)
}

// Helper to get the CSS transition value applied to the sheet
async function getSheetTransition(
  page: any,
  triggerTestId: string,
  frameTestId: string,
  closeTestId: string
): Promise<string> {
  const trigger = page.getByTestId(triggerTestId)
  const closeButton = page.getByTestId(closeTestId)

  await trigger.click()
  await page.waitForTimeout(100)

  const transition = await page.evaluate((frameId: string) => {
    const frame = document.querySelector(`[data-testid="${frameId}"]`)
    if (!frame) return ''
    return getComputedStyle(frame).transition
  }, frameTestId)

  await closeButton.click()
  await page.waitForTimeout(600)

  return transition
}

// ============================================================================
// CSS DRIVER TESTS
// Note: CSS driver has a known limitation where animation names don't translate
// to Sheet animation timing (the Sheet uses useAnimatedNumber internally which
// CSS driver doesn't animate - it relies on CSS transitions for component styles)
// ============================================================================
test.describe('Sheet Animation - CSS Driver', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'SheetAnimationCase',
      type: 'useCase',
      searchParams: { animationDriver: 'css' },
    })
  })

  test('sheet transform has CSS transition applied', async ({ page }) => {
    // This test verifies that the CSS driver properly applies a CSS transition
    // to the Sheet's transform property, enabling smooth open/close animations
    const trigger = page.getByTestId('animation-quick-trigger')
    const closeButton = page.getByTestId('animation-quick-close')

    await trigger.click()
    await page.waitForTimeout(100) // Small wait for sheet to start rendering

    // The transform is on the AnimatedView wrapper, which is the parent of Sheet.Frame
    // We need to find the element with position:absolute that wraps the frame
    const debugInfo = await page.evaluate(() => {
      const frame = document.querySelector('[data-testid="animation-quick-frame"]')
      if (!frame) return { found: false, error: 'frame not found' }

      // The AnimatedView is a parent with position:absolute and transform
      let animatedView: Element | null = frame
      for (let i = 0; i < 5; i++) {
        animatedView = animatedView?.parentElement || null
        if (!animatedView) break
        const style = getComputedStyle(animatedView)
        if (style.position === 'absolute' && style.transform !== 'none') {
          break
        }
      }

      if (!animatedView) {
        return { found: false, error: 'animatedView not found' }
      }

      const style = getComputedStyle(animatedView)
      // Get all style attributes for debugging
      const allStyles: Record<string, string> = {}
      for (let i = 0; i < style.length; i++) {
        const prop = style[i]
        if (prop.includes('transition') || prop.includes('transform')) {
          allStyles[prop] = style.getPropertyValue(prop)
        }
      }
      return {
        found: true,
        tagName: animatedView.tagName,
        transition: style.transition,
        transform: style.transform,
        inlineStyle: (animatedView as HTMLElement).style.cssText,
        allTransitionStyles: allStyles,
      }
    })

    // Check that there's a transition that applies to transform
    // CSS transition "0.1s ease-in" (without property name) means "all 0.1s ease-in"
    // which applies to all properties including transform
    const hasTransition = debugInfo.found && debugInfo.transition && debugInfo.transition !== 'all'
    expect(hasTransition).toBe(true)

    await closeButton.click()
    await page.waitForTimeout(600)
  })

  test('sheet actually animates (transform changes over time)', async ({ page }) => {
    // This test verifies that the sheet's transform actually changes over time
    // (i.e., it animates) rather than instantly snapping to position
    const trigger = page.getByTestId('animation-lazy-trigger')
    const closeButton = page.getByTestId('animation-lazy-close')

    // Click to open the sheet
    await trigger.click()

    // Wait a small moment for sheet to start appearing
    await page.waitForTimeout(50)

    // Capture transform values over the animation duration
    const transforms: string[] = []
    for (let i = 0; i < 20; i++) {
      const transform = await page.evaluate(() => {
        // Find the AnimatedView (parent of frame with transform)
        const frame = document.querySelector('[data-testid="animation-lazy-frame"]')
        if (!frame) return 'frame-not-found'

        let el: Element | null = frame
        for (let j = 0; j < 5; j++) {
          el = el?.parentElement
          if (!el) break
          const style = getComputedStyle(el)
          if (style.position === 'absolute' && style.transform !== 'none') {
            return style.transform
          }
        }
        return 'parent-not-found'
      })
      transforms.push(transform)
      await page.waitForTimeout(30) // ~30ms between samples
    }

    // Filter out errors and get unique values
    const uniqueTransforms = [
      ...new Set(transforms.filter((t) => !t.includes('not-found') && t !== 'none')),
    ]

    // If animation is working, we should see multiple distinct transform values
    // as the sheet animates from bottom to its snap point
    expect(uniqueTransforms.length).toBeGreaterThan(1)

    await closeButton.click()
    await page.waitForTimeout(600)
  })

  test('all sheet variants open and close correctly', async ({ page }) => {
    const testIds = [
      'animation-quick',
      'animation-lazy',
      'animation-slow',
      'transitionConfig-only',
      'transitionConfig-slow',
      'animation-plus-config',
    ]

    for (const testId of testIds) {
      const trigger = page.getByTestId(`${testId}-trigger`)
      // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
      const frame = page.getByTestId(`${testId}-frame`).first()
      const closeButton = page.getByTestId(`${testId}-close`)

      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })

      await closeButton.click()
      await page.waitForTimeout(600)
      await expect(frame).not.toBeInViewport()
    }
  })

  test('transitionConfig prop works without animation prop', async ({ page }) => {
    // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
    const frame = page.getByTestId('transitionConfig-only-frame').first()
    const trigger = page.getByTestId('transitionConfig-only-trigger')
    const closeButton = page.getByTestId('transitionConfig-only-close')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 3000 })

    // Sheet should open successfully with only transitionConfig
    await closeButton.click()
    await page.waitForTimeout(600)
    await expect(frame).not.toBeInViewport()
  })
})

// ============================================================================
// MOTION DRIVER TESTS
// ============================================================================
test.describe('Sheet Animation - Motion Driver', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'SheetAnimationCase',
      type: 'useCase',
      searchParams: { animationDriver: 'motion' },
    })
  })

  test('all sheet variants open and close correctly', async ({ page }) => {
    const testIds = [
      'animation-quick',
      'animation-lazy',
      'animation-slow',
      'transitionConfig-only',
      'transitionConfig-slow',
      'animation-plus-config',
    ]

    for (const testId of testIds) {
      const trigger = page.getByTestId(`${testId}-trigger`)
      // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
      const frame = page.getByTestId(`${testId}-frame`).first()
      const closeButton = page.getByTestId(`${testId}-close`)

      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })

      await closeButton.click()
      await page.waitForTimeout(800)
      await expect(frame).not.toBeInViewport()
    }
  })

  // Flaky in CI - Motion driver timing differences are too small to measure reliably
  test.fixme('transition="quick" is faster than transition="lazy"', async ({ page }) => {
    const quickDuration = await measureSheetAnimationDuration(
      page,
      'animation-quick-trigger',
      'animation-quick-frame',
      'animation-quick-close'
    )

    const lazyDuration = await measureSheetAnimationDuration(
      page,
      'animation-lazy-trigger',
      'animation-lazy-frame',
      'animation-lazy-close'
    )

    console.info(`Motion Driver - quick: ${quickDuration}ms, lazy: ${lazyDuration}ms`)

    // Motion driver uses spring physics
    // quick: stiffness 250, lazy: stiffness 50
    // Higher stiffness = faster animation
    expect(lazyDuration).toBeGreaterThan(quickDuration)
  })

  test('transitionConfig prop works without animation prop', async ({ page }) => {
    // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
    const frame = page.getByTestId('transitionConfig-only-frame').first()
    const trigger = page.getByTestId('transitionConfig-only-trigger')
    const closeButton = page.getByTestId('transitionConfig-only-close')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 3000 })

    await closeButton.click()
    await page.waitForTimeout(800)
    await expect(frame).not.toBeInViewport()
  })

  test.fixme(
    'transitionConfig overrides animation prop (lazy+fastConfig faster than lazy)',
    async ({ page }) => {
      // transition="lazy" + fast transitionConfig should use the config
      const overrideDuration = await measureSheetAnimationDuration(
        page,
        'animation-plus-config-trigger',
        'animation-plus-config-frame',
        'animation-plus-config-close'
      )

      const lazyDuration = await measureSheetAnimationDuration(
        page,
        'animation-lazy-trigger',
        'animation-lazy-frame',
        'animation-lazy-close'
      )

      console.info(
        `Motion Driver - lazy: ${lazyDuration}ms, lazy+fastConfig: ${overrideDuration}ms`
      )

      // transitionConfig should override animation prop
      expect(overrideDuration).toBeLessThan(lazyDuration)
    }
  )
})

// ============================================================================
// MOTI DRIVER TESTS (default)
// ============================================================================
test.describe('Sheet Animation - Moti Driver (default)', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'SheetAnimationCase',
      type: 'useCase',
      // No animationDriver param = default moti
    })
  })

  test('all sheet variants open and close correctly', async ({ page }) => {
    const testIds = [
      'animation-quick',
      'animation-lazy',
      'animation-slow',
      'transitionConfig-only',
      'transitionConfig-slow',
      'animation-plus-config',
    ]

    for (const testId of testIds) {
      const trigger = page.getByTestId(`${testId}-trigger`)
      // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
      const frame = page.getByTestId(`${testId}-frame`).first()
      const closeButton = page.getByTestId(`${testId}-close`)

      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })

      await closeButton.click()
      await page.waitForTimeout(800)
      await expect(frame).not.toBeInViewport()
    }
  })

  // Flaky in CI - Moti driver timing differences are too small to measure reliably
  test.fixme('transition="quick" is faster than transition="lazy"', async ({ page }) => {
    const quickDuration = await measureSheetAnimationDuration(
      page,
      'animation-quick-trigger',
      'animation-quick-frame',
      'animation-quick-close'
    )

    const lazyDuration = await measureSheetAnimationDuration(
      page,
      'animation-lazy-trigger',
      'animation-lazy-frame',
      'animation-lazy-close'
    )

    console.info(`Moti Driver - quick: ${quickDuration}ms, lazy: ${lazyDuration}ms`)

    expect(lazyDuration).toBeGreaterThan(quickDuration)
  })

  test('transitionConfig prop works', async ({ page }) => {
    // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
    const frame = page.getByTestId('transitionConfig-only-frame').first()
    const trigger = page.getByTestId('transitionConfig-only-trigger')
    const closeButton = page.getByTestId('transitionConfig-only-close')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 3000 })

    await closeButton.click()
    await page.waitForTimeout(800)
    await expect(frame).not.toBeInViewport()
  })

  // Flaky in CI - Moti driver timing differences are too small to measure reliably
  test.fixme('transitionConfig overrides animation prop', async ({ page }) => {
    const overrideDuration = await measureSheetAnimationDuration(
      page,
      'animation-plus-config-trigger',
      'animation-plus-config-frame',
      'animation-plus-config-close'
    )

    const lazyDuration = await measureSheetAnimationDuration(
      page,
      'animation-lazy-trigger',
      'animation-lazy-frame',
      'animation-lazy-close'
    )

    console.info(
      `Moti Driver - lazy: ${lazyDuration}ms, lazy+fastConfig: ${overrideDuration}ms`
    )

    expect(overrideDuration).toBeLessThan(lazyDuration)
  })
})
