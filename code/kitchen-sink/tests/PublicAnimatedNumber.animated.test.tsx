import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// verifies the public useAnimatedNumber / useAnimatedNumberStyle hooks exported
// from `tamagui` drive a real, visible animation that settles at the target on
// every animation driver.

const START = 0
const END = 200
const TOLERANCE = 5

test.describe('public useAnimatedNumber', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'PublicAnimatedNumberCase',
      type: 'useCase',
    })
    await page.waitForTimeout(500)
  })

  test('animates translateX and settles at the target', async ({ page }) => {
    const initial = await page.getByTestId('animated-number-box').evaluate((el) => {
      const t = getComputedStyle(el).transform
      if (!t || t === 'none') return 0
      const m = t.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([^,]+),\s*[^)]+\)/)
      return m && m[1] ? parseFloat(m[1]) : 0
    })
    expect(initial).toBeCloseTo(START, 0)

    // trigger the toggle and sample translateX over time via rAF
    const samples: number[] = await page.evaluate((testId) => {
      return new Promise<number[]>((resolve) => {
        const readX = (el: Element) => {
          const t = getComputedStyle(el).transform
          if (!t || t === 'none') return 0
          const m = t.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,\s*([^,]+),\s*[^)]+\)/)
          return m && m[1] ? parseFloat(m[1]) : 0
        }
        const el = document.querySelector(`[data-testid="${testId}"]`)!
        const vals: number[] = []
        const start = performance.now()
        function tick() {
          vals.push(readX(el))
          if (performance.now() - start < 2500) requestAnimationFrame(tick)
          else resolve(vals)
        }
        ;(
          document.querySelector('[data-testid="animated-number-trigger"]') as HTMLElement
        ).click()
        requestAnimationFrame(tick)
      })
    }, 'animated-number-box')

    const final = samples[samples.length - 1]
    expect(
      Math.abs(final - END),
      `should settle at ${END}, got ${final.toFixed(1)}`
    ).toBeLessThan(TOLERANCE)

    // must have real intermediate frames (not an instant snap)
    const intermediates = samples.filter(
      (v) => Math.abs(v - START) > TOLERANCE && Math.abs(v - END) > TOLERANCE
    )
    expect(
      intermediates.length,
      `expected multiple intermediate frames, got ${intermediates.length}. ` +
        `samples: [${samples
          .slice(0, 10)
          .map((s) => s.toFixed(0))
          .join(', ')}...]`
    ).toBeGreaterThanOrEqual(2)

    // animation must not have completed in the first few frames
    const earlyEnd = samples.slice(0, 3).every((v) => Math.abs(v - END) < TOLERANCE)
    expect(earlyEnd, 'animation should not finish in first 3 frames').toBe(false)
  })
})
