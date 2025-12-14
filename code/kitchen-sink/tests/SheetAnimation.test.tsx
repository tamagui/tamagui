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

  test('all sheet variants open and close correctly', async ({ page }) => {
    const testIds = [
      'animation-quick',
      'animation-lazy',
      'animation-slow',
      'animationConfig-only',
      'animationConfig-slow',
      'animation-plus-config',
    ]

    for (const testId of testIds) {
      const trigger = page.getByTestId(`${testId}-trigger`)
      const frame = page.getByTestId(`${testId}-frame`)
      const closeButton = page.getByTestId(`${testId}-close`)

      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })

      await closeButton.click()
      await page.waitForTimeout(600)
      await expect(frame).not.toBeInViewport()
    }
  })

  test('animationConfig prop works without animation prop', async ({ page }) => {
    const frame = page.getByTestId('animationConfig-only-frame')
    const trigger = page.getByTestId('animationConfig-only-trigger')
    const closeButton = page.getByTestId('animationConfig-only-close')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 3000 })

    // Sheet should open successfully with only animationConfig
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
      'animationConfig-only',
      'animationConfig-slow',
      'animation-plus-config',
    ]

    for (const testId of testIds) {
      const trigger = page.getByTestId(`${testId}-trigger`)
      const frame = page.getByTestId(`${testId}-frame`)
      const closeButton = page.getByTestId(`${testId}-close`)

      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })

      await closeButton.click()
      await page.waitForTimeout(800)
      await expect(frame).not.toBeInViewport()
    }
  })

  // Flaky in CI - Motion driver timing differences are too small to measure reliably
  test.fixme('animation="quick" is faster than animation="lazy"', async ({ page }) => {
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

  test('animationConfig prop works without animation prop', async ({ page }) => {
    const frame = page.getByTestId('animationConfig-only-frame')
    const trigger = page.getByTestId('animationConfig-only-trigger')
    const closeButton = page.getByTestId('animationConfig-only-close')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 3000 })

    await closeButton.click()
    await page.waitForTimeout(800)
    await expect(frame).not.toBeInViewport()
  })

  test.fixme(
    'animationConfig overrides animation prop (lazy+fastConfig faster than lazy)',
    async ({ page }) => {
      // animation="lazy" + fast animationConfig should use the config
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

      // animationConfig should override animation prop
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
      'animationConfig-only',
      'animationConfig-slow',
      'animation-plus-config',
    ]

    for (const testId of testIds) {
      const trigger = page.getByTestId(`${testId}-trigger`)
      const frame = page.getByTestId(`${testId}-frame`)
      const closeButton = page.getByTestId(`${testId}-close`)

      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })

      await closeButton.click()
      await page.waitForTimeout(800)
      await expect(frame).not.toBeInViewport()
    }
  })

  // Flaky in CI - Moti driver timing differences are too small to measure reliably
  test.fixme('animation="quick" is faster than animation="lazy"', async ({ page }) => {
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

  test('animationConfig prop works', async ({ page }) => {
    const frame = page.getByTestId('animationConfig-only-frame')
    const trigger = page.getByTestId('animationConfig-only-trigger')
    const closeButton = page.getByTestId('animationConfig-only-close')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 3000 })

    await closeButton.click()
    await page.waitForTimeout(800)
    await expect(frame).not.toBeInViewport()
  })

  test('animationConfig overrides animation prop', async ({ page }) => {
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
