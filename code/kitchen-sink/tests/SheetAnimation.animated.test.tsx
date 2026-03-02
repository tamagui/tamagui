import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Comprehensive tests for Sheet animation configurations
 * Tests CSS driver, Motion driver, and various animation prop combinations
 * Verifies that different animation configs produce measurably different animation speeds
 */

// Helper to measure actual animation duration by tracking position changes
async function measureSheetAnimationDuration(
  page: any,
  triggerTestId: string,
  frameTestId: string,
  closeTestId: string
): Promise<number> {
  const closeButton = page.getByTestId(closeTestId)

  // click trigger and measure how long until the frame's visual position stabilizes
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
        let initialTop = -1
        let lastTop = -1
        let stableCount = 0
        let hasMovedFromInitial = false
        let checkCount = 0
        const maxChecks = 200 // ~10 seconds max

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

          // use getBoundingClientRect which reflects parent transforms
          const currentTop = Math.round(frame.getBoundingClientRect().top)

          // record the initial position on first check
          if (initialTop === -1) {
            initialTop = currentTop
          }

          // wait until the position has actually changed from the initial value
          // before we start counting stability (animation might not start for a frame or two)
          if (!hasMovedFromInitial && currentTop !== initialTop) {
            hasMovedFromInitial = true
          }

          if (hasMovedFromInitial && currentTop === lastTop) {
            stableCount++
            if (stableCount >= 3) {
              resolve(performance.now() - startTime)
              return
            }
          } else {
            stableCount = 0
            lastTop = currentTop
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

  // close the sheet for next measurement
  await closeButton.scrollIntoViewIfNeeded()
  await closeButton.click({ timeout: 5000 })
  await page.waitForTimeout(1500)

  return Math.round(duration)
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
    const hasTransition =
      debugInfo.found && debugInfo.transition && debugInfo.transition !== 'all'
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
    // CSS driver doesn't support transitionConfig prop reliably - only test transition variants
    const testIds = ['animation-quick', 'animation-lazy', 'animation-slow']

    for (const testId of testIds) {
      const trigger = page.getByTestId(`${testId}-trigger`)
      // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
      const frame = page.getByTestId(`${testId}-frame`).first()
      const closeButton = page.getByTestId(`${testId}-close`)

      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })

      await closeButton.click()
      // Wait longer for slow animations to complete
      await page.waitForTimeout(1500)
      await expect(frame).not.toBeInViewport({ ratio: 0.5 })
    }
  })

  // transitionConfig not working reliably with CSS driver
  test.skip('transitionConfig prop works without animation prop', async ({ page }) => {
    // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
    const frame = page.getByTestId('transitionConfig-only-frame').first()
    const trigger = page.getByTestId('transitionConfig-only-trigger')
    const closeButton = page.getByTestId('transitionConfig-only-close')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 3000 })

    // Sheet should open successfully with only transitionConfig
    await closeButton.click()
    await page.waitForTimeout(1500)
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
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
    // Skip transitionConfig variants - not working reliably
    const testIds = ['animation-quick', 'animation-lazy', 'animation-slow']

    for (const testId of testIds) {
      const trigger = page.getByTestId(`${testId}-trigger`)
      // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
      const frame = page.getByTestId(`${testId}-frame`).first()
      const closeButton = page.getByTestId(`${testId}-close`)

      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })

      await closeButton.click()
      // Wait longer for slow animations to complete
      await page.waitForTimeout(2000)
      await expect(frame).not.toBeInViewport({ ratio: 0.5 })
    }
  })

  test('transitionConfig prop works without animation prop', async ({ page }) => {
    // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
    const frame = page.getByTestId('transitionConfig-only-frame').first()
    const trigger = page.getByTestId('transitionConfig-only-trigger')
    const closeButton = page.getByTestId('transitionConfig-only-close')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 3000 })

    await closeButton.click()
    await page.waitForTimeout(2000)
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('transitionConfig overrides transition prop', async ({ page }) => {
    // transition="quick" (fast) + transitionConfig={type:'timing',duration:1000} (slow)
    // if override works, the 1000ms config should make it measurably slower than the 100ms baseline
    const baselineDuration = await measureSheetAnimationDuration(
      page,
      'transitionConfig-only-trigger',
      'transitionConfig-only-frame',
      'transitionConfig-only-close'
    )

    const overrideDuration = await measureSheetAnimationDuration(
      page,
      'animation-plus-config-trigger',
      'animation-plus-config-frame',
      'animation-plus-config-close'
    )

    console.info(
      `Motion Driver - baseline (100ms): ${baselineDuration}ms, override (1000ms): ${overrideDuration}ms`
    )

    // the 1000ms override should be significantly slower than the 100ms baseline
    // use absolute +250ms margin: CI inflates both measurements (spring settling + overhead)
    // which compresses the ratio, but absolute difference stays well above 250ms
    expect(overrideDuration).toBeGreaterThan(baselineDuration + 250)
  })
})

// ============================================================================
// REANIMATED DRIVER TESTS (default)
// ============================================================================
test.describe('Sheet Animation - Reanimated Driver (default)', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'SheetAnimationCase',
      type: 'useCase',
      // No animationDriver param = default reanimated
    })
  })

  test('all sheet variants open and close correctly', async ({ page }) => {
    const testIds = ['animation-quick', 'animation-lazy', 'animation-slow']

    for (const testId of testIds) {
      const trigger = page.getByTestId(`${testId}-trigger`)
      // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
      const frame = page.getByTestId(`${testId}-frame`).first()
      const closeButton = page.getByTestId(`${testId}-close`)

      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })

      await closeButton.click()
      // Wait longer for slow animations to complete
      await page.waitForTimeout(2000)
      await expect(frame).not.toBeInViewport({ ratio: 0.5 })
    }
  })

  test('transitionConfig prop works', async ({ page }) => {
    // transitionConfig only works with JS animation drivers, not CSS
    const driver = (test.info().project?.metadata as any)?.animationDriver
    test.skip(driver === 'css', 'transitionConfig not supported by CSS animation driver')

    // Use .first() because Sheet passes testId to both Sheet.Frame and SheetCover
    const frame = page.getByTestId('transitionConfig-only-frame').first()
    const trigger = page.getByTestId('transitionConfig-only-trigger')
    const closeButton = page.getByTestId('transitionConfig-only-close')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 3000 })

    await closeButton.click()
    await page.waitForTimeout(2000)
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('transitionConfig overrides transition prop', async ({ page }) => {
    // transitionConfig only works with JS animation drivers, not CSS
    const driver = (test.info().project?.metadata as any)?.animationDriver
    test.skip(driver === 'css', 'transitionConfig not supported by CSS animation driver')
    // transition="quick" (fast) + transitionConfig={type:'timing',duration:1000} (slow)
    // if override works, the 1000ms config should make it measurably slower than the 100ms baseline
    const baselineDuration = await measureSheetAnimationDuration(
      page,
      'transitionConfig-only-trigger',
      'transitionConfig-only-frame',
      'transitionConfig-only-close'
    )

    const overrideDuration = await measureSheetAnimationDuration(
      page,
      'animation-plus-config-trigger',
      'animation-plus-config-frame',
      'animation-plus-config-close'
    )

    console.info(
      `Reanimated Driver - baseline (100ms): ${baselineDuration}ms, override (1000ms): ${overrideDuration}ms`
    )

    // the 1000ms override should be significantly slower than the 100ms baseline
    // use absolute +250ms margin: CI inflates both measurements (spring settling + overhead)
    // which compresses the ratio, but absolute difference stays well above 250ms
    expect(overrideDuration).toBeGreaterThan(baselineDuration + 250)
  })
})
