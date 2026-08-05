import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * A lifecycle-only property (`opacity="enter:0 exit:0"`) has no base value, so
 * its resting value is synthesized. Every driver has to paint the enter clause
 * before the resting value replaces it, otherwise the element appears at full
 * opacity with no ramp at all.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'LifecycleOnlyEnterCase', type: 'useCase' })
  await page.waitForTimeout(500)
})

test('enter clause paints before the synthesized resting value', async ({ page }) => {
  await page.evaluate(() => {
    ;(window as any).__opacityLog = [] as number[]
    ;(window as any).__rafRunning = true
    const track = () => {
      if (!(window as any).__rafRunning) return
      const el = document.querySelector('[data-testid="lifecycle-enter-target"]')
      if (el) {
        ;(window as any).__opacityLog.push(parseFloat(getComputedStyle(el).opacity))
      }
      requestAnimationFrame(track)
    }
    requestAnimationFrame(track)
  })

  await page.getByTestId('lifecycle-enter-show').click()
  await page.waitForTimeout(1200)

  await page.evaluate(() => {
    ;(window as any).__rafRunning = false
  })

  const frames: number[] = await page.evaluate(() => (window as any).__opacityLog)

  console.log('opacity frames:', JSON.stringify(frames.map((f) => +f.toFixed(3))))

  expect(frames.length, 'the square never rendered').toBeGreaterThan(10)

  // the first painted frame carries the enter clause
  expect(
    frames[0],
    `first painted frame was ${frames[0].toFixed(3)}, so the enter clause never reached the screen. Frames: ${JSON.stringify(frames.slice(0, 12).map((f) => +f.toFixed(2)))}`
  ).toBeLessThan(0.5)

  // and it ramps up to the synthesized resting value rather than staying put
  const last = frames[frames.length - 1]
  expect(
    last,
    `opacity settled at ${last.toFixed(3)} instead of the synthesized resting 1`
  ).toBeGreaterThan(0.9)

  // the ramp is animated, not a single-frame jump
  const intermediate = frames.filter((f) => f > 0.05 && f < 0.95).length
  expect(
    intermediate,
    `only ${intermediate} intermediate frames, so opacity jumped instead of animating. Frames: ${JSON.stringify(frames.slice(0, 20).map((f) => +f.toFixed(2)))}`
  ).toBeGreaterThan(2)
})
