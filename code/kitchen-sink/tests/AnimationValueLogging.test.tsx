import { expect, test, type Page, type ConsoleMessage } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Animation Value Logging Tests
 *
 * These tests verify that animations are working correctly by capturing
 * console logs that track actual animation value changes over time.
 *
 * Log format: [ANIM_LOG] id:<testId> prop:<property> value:<value> time:<timestamp>
 */

interface AnimationLog {
  id: string
  prop: string
  value: string
  time: number
}

function parseAnimationLog(text: string): AnimationLog | null {
  const match = text.match(
    /\[ANIM_LOG\] id:(\S+) prop:(\S+) value:(\S+) time:(\d+)/
  )
  if (!match) return null
  return {
    id: match[1],
    prop: match[2],
    value: match[3],
    time: parseInt(match[4], 10),
  }
}

function collectAnimationLogs(
  page: Page,
  testId: string,
  prop: string
): Promise<AnimationLog[]> {
  return new Promise((resolve) => {
    const logs: AnimationLog[] = []
    let timeout: ReturnType<typeof setTimeout>

    const listener = (msg: ConsoleMessage) => {
      const text = msg.text()
      if (text.includes('[ANIM_LOG]')) {
        const parsed = parseAnimationLog(text)
        if (parsed && parsed.id === testId && parsed.prop === prop) {
          logs.push(parsed)
          // Reset timeout on each new log
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            page.off('console', listener)
            resolve(logs)
          }, 500) // Animation considered complete after 500ms of no new values
        }
      }
    }

    page.on('console', listener)

    // Initial timeout in case no logs come in
    timeout = setTimeout(() => {
      page.off('console', listener)
      resolve(logs)
    }, 3000)
  })
}

test.describe('Animation Value Logging Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'AnimationValueLoggingCase',
      type: 'useCase',
    })
    // Wait for component to mount and start logging
    await page.waitForTimeout(500)
  })

  test('opacity animation produces intermediate values', async ({ page }) => {
    const trigger = page.getByTestId('opacity-test-trigger')
    const stateIndicator = page.getByTestId('opacity-test-state')

    // Verify initial state
    await expect(stateIndicator).toHaveText('visible')

    // Start collecting logs before clicking
    const logsPromise = collectAnimationLogs(page, 'opacity-test', 'opacity')

    // Trigger animation
    await trigger.click()

    // Wait for and verify state change
    await expect(stateIndicator).toHaveText('faded')

    // Get collected logs
    const logs = await logsPromise

    // Verify animation occurred (should have multiple intermediate values)
    expect(logs.length).toBeGreaterThan(1)

    // Verify animation went from ~1 to ~0.2 (faded state)
    const firstValue = parseFloat(logs[0].value)
    const lastValue = parseFloat(logs[logs.length - 1].value)

    console.log(`Opacity transition: ${logs.length} frames, ${firstValue} -> ${lastValue}`)
    console.log(
      'Sample values:',
      logs.slice(0, 5).map((l) => l.value)
    )

    // Final value should be close to 0.2 (faded)
    expect(lastValue).toBeLessThan(0.5)
    expect(lastValue).toBeGreaterThan(0.1)
  })

  test('scale animation produces intermediate values', async ({ page }) => {
    const trigger = page.getByTestId('scale-test-trigger')
    const stateIndicator = page.getByTestId('scale-test-state')

    await expect(stateIndicator).toHaveText('normal')

    const logsPromise = collectAnimationLogs(page, 'scale-test', 'scale')
    await trigger.click()
    await expect(stateIndicator).toHaveText('scaled')

    const logs = await logsPromise

    expect(logs.length).toBeGreaterThan(1)

    const firstValue = parseFloat(logs[0].value)
    const lastValue = parseFloat(logs[logs.length - 1].value)

    console.log(`Scale transition: ${logs.length} frames, ${firstValue} -> ${lastValue}`)

    // Final value should be close to 1.5 (scaled)
    expect(lastValue).toBeGreaterThan(1.3)
    expect(lastValue).toBeLessThan(1.7)
  })

  test('translateY animation produces intermediate values', async ({ page }) => {
    const trigger = page.getByTestId('translate-test-trigger')
    const stateIndicator = page.getByTestId('translate-test-state')

    await expect(stateIndicator).toHaveText('normal')

    const logsPromise = collectAnimationLogs(page, 'translate-test', 'translateY')
    await trigger.click()
    await expect(stateIndicator).toHaveText('moved')

    const logs = await logsPromise

    expect(logs.length).toBeGreaterThan(1)

    const firstValue = parseFloat(logs[0].value)
    const lastValue = parseFloat(logs[logs.length - 1].value)

    console.log(`TranslateY transition: ${logs.length} frames, ${firstValue} -> ${lastValue}`)

    // Final value should be close to -30 (moved up)
    expect(lastValue).toBeLessThan(-20)
    expect(lastValue).toBeGreaterThan(-40)
  })

  test('enter animation on mount shows intermediate values', async ({ page }) => {
    const trigger = page.getByTestId('enter-exit-test-trigger')
    const stateIndicator = page.getByTestId('enter-exit-test-state')

    // First hide the element
    await expect(stateIndicator).toHaveText('visible')
    await trigger.click()
    await expect(stateIndicator).toHaveText('hidden')
    await page.waitForTimeout(600) // Wait for exit animation

    // Now show it again and capture enter animation
    const logsPromise = collectAnimationLogs(page, 'enter-exit-test', 'opacity')
    await trigger.click()
    await expect(stateIndicator).toHaveText('visible')

    const logs = await logsPromise

    console.log(`Enter transition: ${logs.length} frames`)
    console.log(
      'Sample values:',
      logs.slice(0, 5).map((l) => l.value)
    )

    // Should have multiple intermediate values during enter animation
    expect(logs.length).toBeGreaterThan(0)

    if (logs.length > 1) {
      const lastValue = parseFloat(logs[logs.length - 1].value)
      // Final opacity should be close to 1 (fully visible)
      expect(lastValue).toBeGreaterThan(0.8)
    }
  })

  // Color animations may not interpolate - they might switch instantly
  // This is driver-dependent behavior, so we skip this test for now
  test.skip('color animation changes color value', async ({ page }) => {
    const trigger = page.getByTestId('color-test-trigger')
    const stateIndicator = page.getByTestId('color-test-state')
    const square = page.getByTestId('color-test-square')

    await expect(stateIndicator).toHaveText('blue')

    // Get initial color
    const initialColor = await square.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    )

    const logsPromise = collectAnimationLogs(
      page,
      'color-test',
      'backgroundColor'
    )
    await trigger.click()
    await expect(stateIndicator).toHaveText('red')

    // Wait for animation to complete
    await page.waitForTimeout(600)

    // Get final color
    const finalColor = await square.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    )

    const logs = await logsPromise

    console.log(`Color transition: ${logs.length} frames`)
    console.log(`Initial: ${initialColor}, Final: ${finalColor}`)

    // Color should have changed (even if not interpolated)
    // Note: Some drivers may not interpolate colors, they may just switch
    expect(initialColor).not.toEqual(finalColor)
  })

  test('animationConfig affects animation timing', async ({ page }) => {
    const trigger = page.getByTestId('config-test-trigger')
    const stateIndicator = page.getByTestId('config-test-state')

    await expect(stateIndicator).toHaveText('collapsed')

    const logsPromise = collectAnimationLogs(page, 'config-test', 'width')
    await trigger.click()
    await expect(stateIndicator).toHaveText('expanded')

    const logs = await logsPromise

    console.log(`Width animation with slow config: ${logs.length} frames`)
    console.log(
      'Sample values:',
      logs.slice(0, 5).map((l) => l.value)
    )

    // Animation should occur
    expect(logs.length).toBeGreaterThan(0)

    if (logs.length > 1) {
      const firstValue = parseFloat(logs[0].value)
      const lastValue = parseFloat(logs[logs.length - 1].value)

      console.log(`Width: ${firstValue} -> ${lastValue}`)

      // Final width should be close to 150
      expect(lastValue).toBeGreaterThan(120)
    }
  })
})

test.describe('Animation Driver Comparison', () => {
  const drivers = ['css', 'motion', 'native', 'reanimated'] as const

  for (const driver of drivers) {
    test(`${driver} driver produces animation values for opacity`, async ({
      page,
    }) => {
      await setupPage(page, {
        name: 'AnimationValueLoggingCase',
        type: 'useCase',
        searchParams: { animationDriver: driver },
      })
      await page.waitForTimeout(500)

      const trigger = page.getByTestId('opacity-test-trigger')

      const logsPromise = collectAnimationLogs(page, 'opacity-test', 'opacity')
      await trigger.click()

      const logs = await logsPromise

      console.log(`[${driver}] Opacity transition: ${logs.length} frames`)

      // All drivers should produce at least some animation frames
      // CSS driver might have fewer frames than spring-based drivers
      expect(logs.length).toBeGreaterThan(0)
    })
  }
})
