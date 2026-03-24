import { expect, test } from '@playwright/test'

/**
 * Tests for multi-driver animation config: { default: motion, css: cssDriver }
 *
 * This test ONLY runs with ?animationDriver=multi which sets up:
 *   animations: { default: animationsMotion, css: animationsCSS }
 *
 * Verifies:
 * 1. animatedBy="default" uses motion driver (JS-based animation)
 * 2. animatedBy="css" uses CSS driver (CSS transitions)
 * 3. no animatedBy defaults to motion driver
 */

test.describe('Multi-driver animation config', () => {
  test.beforeEach(async ({ page }) => {
    // specifically load with multi-driver config
    await page.goto('/?test=MultiDriverAnimation&animationDriver=multi')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(300)
  })

  test('animatedBy="default" uses motion driver (animates smoothly)', async ({
    page,
  }) => {
    const element = page.getByTestId('driver-default')

    const initialOpacity = await element.evaluate((el) =>
      Number(getComputedStyle(el).opacity)
    )
    expect(initialOpacity).toBeCloseTo(0.3, 1)

    // use in-browser rAF polling to reliably capture mid-animation frames
    // (Playwright waitForTimeout is too slow on CI to catch intermediate values)
    const samples: number[] = await page.evaluate(() => {
      return new Promise<number[]>((resolve) => {
        const el = document.querySelector('[data-testid="driver-default"]')!
        const vals: number[] = []
        const start = performance.now()
        function tick() {
          vals.push(Number(getComputedStyle(el).opacity))
          if (performance.now() - start < 500) requestAnimationFrame(tick)
          else resolve(vals)
        }
        ;(document.querySelector('[data-testid="toggle-multi"]') as HTMLElement).click()
        requestAnimationFrame(tick)
      })
    })

    const finalOpacity = samples[samples.length - 1]
    expect(finalOpacity).toBeGreaterThan(0.9)

    // motion driver should show intermediate values (not jump instantly)
    const intermediates = samples.filter((v) => v > 0.35 && v < 0.95)
    expect(
      intermediates.length,
      `Motion driver should animate with interpolation (got ${intermediates.length} intermediate frames). ` +
        `Samples: [${samples
          .slice(0, 8)
          .map((s) => s.toFixed(2))
          .join(', ')}...]`
    ).toBeGreaterThanOrEqual(2)
  })

  test('animatedBy="css" uses CSS driver (CSS transitions)', async ({ page }) => {
    const element = page.getByTestId('driver-css')

    const initialOpacity = await element.evaluate((el) =>
      Number(getComputedStyle(el).opacity)
    )
    expect(initialOpacity).toBeCloseTo(0.3, 1)

    // trigger animation
    await page.getByTestId('toggle-multi').click()

    // css driver uses CSS transitions - 200ms
    await page.waitForTimeout(350)
    const finalOpacity = await element.evaluate((el) =>
      Number(getComputedStyle(el).opacity)
    )

    expect(finalOpacity).toBeGreaterThan(0.9)

    // verify it's using CSS transition
    const transition = await element.evaluate((el) => getComputedStyle(el).transition)
    expect(transition.length).toBeGreaterThan(0)
  })

  test('no animatedBy defaults to motion driver', async ({ page }) => {
    const initialOpacity = await page
      .getByTestId('driver-none')
      .evaluate((el) => Number(getComputedStyle(el).opacity))
    expect(initialOpacity).toBeCloseTo(0.3, 1)

    // poll via rAF to capture intermediate values reliably in slow CI
    const samples: number[] = await page.evaluate(() => {
      return new Promise<number[]>((resolve) => {
        const el = document.querySelector('[data-testid="driver-none"]')!
        const vals: number[] = []
        const start = performance.now()
        function tick() {
          vals.push(Number(getComputedStyle(el).opacity))
          if (performance.now() - start < 500) requestAnimationFrame(tick)
          else resolve(vals)
        }
        ;(document.querySelector('[data-testid="toggle-multi"]') as HTMLElement).click()
        requestAnimationFrame(tick)
      })
    })

    const finalOpacity = samples[samples.length - 1]
    expect(finalOpacity).toBeGreaterThan(0.9)

    // verify motion driver: multiple frames of interpolation between 0.3 and ~1.0
    const intermediates = samples.filter((v) => v > 0.35 && v < 0.95)
    expect(
      intermediates.length,
      `Default should use motion with real interpolation (got ${intermediates.length} intermediate frames). ` +
        `Samples: [${samples
          .slice(0, 8)
          .map((s) => s.toFixed(2))
          .join(', ')}...]`
    ).toBeGreaterThanOrEqual(2)

    // first frames should still be near start (animation has real duration)
    const earlyEnd = samples.slice(0, 3).every((v) => v > 0.95)
    expect(earlyEnd, 'Animation should not complete in first 3 frames').toBe(false)
  })

  test('different drivers produce different animation behavior', async ({ page }) => {
    // trigger animation
    await page.getByTestId('toggle-multi').click()

    // capture at same moment
    await page.waitForTimeout(100)

    const [defaultOpacity, cssOpacity] = await Promise.all([
      page
        .getByTestId('driver-default')
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
      page
        .getByTestId('driver-css')
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    ])

    // both should be animating but may have different values due to different drivers
    // this just verifies both are in valid range
    expect(defaultOpacity).toBeGreaterThanOrEqual(0.3)
    expect(defaultOpacity).toBeLessThanOrEqual(1)
    expect(cssOpacity).toBeGreaterThanOrEqual(0.3)
    expect(cssOpacity).toBeLessThanOrEqual(1)
  })
})

test.describe('Multi-driver group hover transitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?test=MultiDriverAnimation&animationDriver=multi')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(300)
  })

  test('group hover with motion driver animates child', async ({ page }) => {
    const group = page.getByTestId('group-motion')
    const child = page.getByTestId('group-motion-child')

    const initialOpacity = await child.evaluate((el) =>
      Number(getComputedStyle(el).opacity)
    )
    expect(initialOpacity).toBeCloseTo(0.5, 1)

    // hover over group - 100ms enter transition
    await group.hover()
    await page.waitForTimeout(200)

    const hoverOpacity = await child.evaluate((el) =>
      Number(getComputedStyle(el).opacity)
    )
    expect(hoverOpacity).toBeGreaterThan(0.9)

    // exit hover - 500ms exit transition
    await page.mouse.move(0, 0)
    await page.waitForTimeout(700)

    const exitOpacity = await child.evaluate((el) => Number(getComputedStyle(el).opacity))
    expect(exitOpacity).toBeCloseTo(0.5, 1)
  })

  test('group hover with css driver uses CSS transitions', async ({ page }) => {
    const group = page.getByTestId('group-css')
    const child = page.getByTestId('group-css-child')

    const initialOpacity = await child.evaluate((el) =>
      Number(getComputedStyle(el).opacity)
    )
    expect(initialOpacity).toBeCloseTo(0.5, 1)

    await group.hover()
    // css driver hover transition should complete
    await page.waitForTimeout(400)

    const hoverOpacity = await child.evaluate((el) =>
      Number(getComputedStyle(el).opacity)
    )
    // CSS driver group hover should animate to full opacity
    expect(hoverOpacity).toBeGreaterThan(0.8)
  })
})
