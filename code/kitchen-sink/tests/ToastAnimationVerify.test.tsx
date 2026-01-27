import { expect, test } from '@playwright/test'

test.describe('Toast Animation Verification', () => {
  test.beforeEach(async ({ page }) => {
    // use CSS animation driver for proper CSS transition support
    await page.goto('/?test=ToastMultipleCase&animationDriver=css')
    await page.waitForLoadState('networkidle')
  })

  test('toast enter animation has smooth opacity transition', async ({ page }) => {
    // capture frames during animation
    const frames: { time: number, opacity: number }[] = []

    // click button
    await page.click('[data-testid="toast-success"]')

    // capture animation frames
    const startTime = Date.now()
    while (Date.now() - startTime < 400) {
      try {
        const toast = page.locator('[role="status"]').first()
        const opacity = await toast.evaluate((el) =>
          parseFloat(window.getComputedStyle(el).opacity)
        )
        frames.push({ time: Date.now() - startTime, opacity })
      } catch {
        // toast not yet in DOM
      }
      await page.waitForTimeout(8) // ~120fps sampling
    }

    // verify we captured intermediate opacity values (animation occurring)
    const opacities = frames.map(f => f.opacity)
    const uniqueOpacities = [...new Set(opacities.map(o => o.toFixed(2)))]

    console.log('Animation frames captured:', frames.length)
    console.log('Unique opacity values:', uniqueOpacities)
    console.log('Sample frames:', frames.slice(0, 10))

    // should have intermediate values between 0 and 1
    const hasIntermediateValues = opacities.some(o => o > 0 && o < 1)

    expect(hasIntermediateValues).toBe(true)
    expect(opacities[opacities.length - 1]).toBe(1) // final opacity should be 1
  })

  test('toast stacking positions are correct', async ({ page }) => {
    // show 4 toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(800) // wait for all toasts

    // get all toast transforms
    const toasts = page.locator('[role="status"]')
    const count = await toasts.count()

    expect(count).toBe(4)

    const transforms: string[] = []
    for (let i = 0; i < count; i++) {
      const transform = await toasts.nth(i).evaluate((el) =>
        window.getComputedStyle(el).transform
      )
      transforms.push(transform)
    }

    console.log('Toast transforms:', transforms)

    // front toast should have scale 1, back toasts should have smaller scale
    // transforms are in format: matrix(scaleX, 0, 0, scaleY, translateX, translateY)
    const scales = transforms.map(t => {
      const match = t.match(/matrix\(([^,]+),/)
      return match ? parseFloat(match[1]) : 1
    })

    console.log('Toast scales:', scales)

    // first toast scale ~= 1 (may have slight overshoot from bouncy animation)
    expect(scales[0]).toBeCloseTo(1, 1) // within 0.1 of 1
    expect(scales[1]).toBeLessThan(1)
    expect(scales[2]).toBeLessThan(scales[1])
  })

  test('toast hover expand animation occurs', async ({ page }) => {
    // show 4 toasts
    await page.click('[data-testid="toast-multiple"]')
    await page.waitForTimeout(800)

    // get initial y positions
    const getYPositions = async () => {
      const toasts = page.locator('[role="status"]')
      const count = await toasts.count()
      const positions: number[] = []
      for (let i = 0; i < count; i++) {
        const transform = await toasts.nth(i).evaluate((el) =>
          window.getComputedStyle(el).transform
        )
        // extract translateY from matrix
        const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*([^)]+)\)/)
        positions.push(match ? parseFloat(match[1]) : 0)
      }
      return positions
    }

    const collapsedPositions = await getYPositions()
    console.log('Collapsed Y positions:', collapsedPositions)

    // hover to expand
    const toaster = page.locator('[aria-label*="Notifications"]')
    await toaster.hover()
    await page.waitForTimeout(300) // wait for expand animation

    const expandedPositions = await getYPositions()
    console.log('Expanded Y positions:', expandedPositions)

    // expanded positions should be further apart
    const collapsedSpread = Math.abs(collapsedPositions[0] - collapsedPositions[3])
    const expandedSpread = Math.abs(expandedPositions[0] - expandedPositions[3])

    console.log('Collapsed spread:', collapsedSpread, 'Expanded spread:', expandedSpread)

    expect(expandedSpread).toBeGreaterThan(collapsedSpread)
  })
})
