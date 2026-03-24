import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests that clicking to close while an enter animation is still playing
 * doesn't cause a visual snap-back (the element shouldn't jump back to
 * its enterStyle values before starting the exit animation).
 *
 * Bug: motion driver calls controls.stop() before the mid-flight capture,
 * causing the WAAPI animation to cancel and the element to snap back to
 * its pre-animation inline styles for one frame.
 */

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'animated-css',
    'CSS transitions handle mid-flight interruption differently — this tests WAAPI behavior'
  )
  await setupPage(page, { name: 'ClickDuringEnterCase', type: 'useCase' })
  await page.waitForTimeout(500)
})

test('no opacity snap-back when exit triggered during enter animation', async ({
  page,
}) => {
  // start per-frame opacity sampling
  await page.evaluate(() => {
    ;(window as any).__opacityLog = [] as number[]
    ;(window as any).__rafRunning = true
    const track = () => {
      if (!(window as any).__rafRunning) return
      const el = document.querySelector('[data-testid="click-enter-target"]')
      if (el) {
        ;(window as any).__opacityLog.push(parseFloat(getComputedStyle(el).opacity))
      }
      requestAnimationFrame(track)
    }
    requestAnimationFrame(track)
  })

  // show element (starts enter animation: opacity 0 -> 1)
  await page.getByTestId('click-enter-show').click()
  // wait just enough for animation to start (50-100ms into a ~300ms animation)
  await page.waitForTimeout(80)
  // immediately hide (triggers exit while enter is mid-flight)
  await page.getByTestId('click-enter-hide').click()
  // wait for exit animation to complete
  await page.waitForTimeout(1500)

  // stop sampling
  await page.evaluate(() => {
    ;(window as any).__rafRunning = false
  })

  const frames: number[] = await page.evaluate(() => (window as any).__opacityLog)

  // find the peak opacity (the highest opacity reached during enter)
  const peakOpacity = Math.max(...frames)
  const peakIndex = frames.indexOf(peakOpacity)

  // after the peak, opacity should monotonically decrease (exit animation)
  // but the bug causes a snap-back: opacity jumps DOWN then back UP then down
  // detect this by looking for any frame after peak where opacity increases
  // significantly compared to a previous lower value

  // simpler check: look for any frame that drops significantly below its
  // neighbors (a "dip" indicates snap-back)
  let maxDip = 0
  for (let i = 1; i < frames.length - 1; i++) {
    const prev = frames[i - 1]
    const curr = frames[i]
    const next = frames[i + 1]
    // a dip is when current is significantly lower than both neighbors
    if (curr < prev && curr < next) {
      const dip = Math.min(prev - curr, next - curr)
      if (dip > maxDip) maxDip = dip
    }
  }

  // also check for any opacity increase after exit begins
  // find the first frame where opacity starts decreasing after the peak
  let exitStartIndex = peakIndex
  for (let i = peakIndex + 1; i < frames.length; i++) {
    if (frames[i] < frames[i - 1] - 0.01) {
      exitStartIndex = i
      break
    }
  }

  // after exit starts, look for any significant increase (snap-back indicator)
  let maxIncrease = 0
  for (let i = exitStartIndex + 1; i < frames.length; i++) {
    const increase = frames[i] - frames[i - 1]
    if (increase > maxIncrease) maxIncrease = increase
  }

  console.log('opacity frames:', JSON.stringify(frames.map((f) => +f.toFixed(3))))
  console.log(`peak: ${peakOpacity.toFixed(3)} at frame ${peakIndex}`)
  console.log(`max dip: ${maxDip.toFixed(3)}`)
  console.log(`max increase after exit: ${maxIncrease.toFixed(3)}`)

  // there should be no significant dip (snap-back)
  // tolerance: 0.15 allows for minor animation interpolation variance
  expect(
    maxDip,
    `Opacity had a snap-back dip of ${maxDip.toFixed(3)} - element jumped to enterStyle then back. Frames: ${JSON.stringify(frames.slice(0, 30).map((f) => +f.toFixed(2)))}`
  ).toBeLessThan(0.15)

  // there should be no significant increase after exit starts
  expect(
    maxIncrease,
    `Opacity increased by ${maxIncrease.toFixed(3)} after exit started - indicates snap-back. Frames: ${JSON.stringify(frames.slice(0, 30).map((f) => +f.toFixed(2)))}`
  ).toBeLessThan(0.15)
})

test('no transform snap-back when exit triggered during enter animation', async ({
  page,
}) => {
  // start per-frame transform sampling
  await page.evaluate(() => {
    ;(window as any).__transformLog = [] as { y: number; scale: number }[]
    ;(window as any).__rafRunning = true
    const track = () => {
      if (!(window as any).__rafRunning) return
      const el = document.querySelector('[data-testid="click-enter-target"]')
      if (el) {
        const transform = getComputedStyle(el).transform
        let y = 0
        let scale = 1
        if (transform && transform !== 'none') {
          const matrix = new DOMMatrix(transform)
          y = matrix.m42 // translateY
          scale = matrix.a // scaleX (assuming uniform)
        }
        ;(window as any).__transformLog.push({ y, scale })
      }
      requestAnimationFrame(track)
    }
    requestAnimationFrame(track)
  })

  await page.getByTestId('click-enter-show').click()
  await page.waitForTimeout(80)
  await page.getByTestId('click-enter-hide').click()
  await page.waitForTimeout(1500)

  await page.evaluate(() => {
    ;(window as any).__rafRunning = false
  })

  const frames: { y: number; scale: number }[] = await page.evaluate(
    () => (window as any).__transformLog
  )

  // check for Y-position jumps (snap-back to enterStyle y: -10)
  let maxYJump = 0
  for (let i = 1; i < frames.length; i++) {
    const jump = Math.abs(frames[i].y - frames[i - 1].y)
    if (jump > maxYJump) maxYJump = jump
  }

  console.log(
    'Y positions:',
    JSON.stringify(frames.slice(0, 30).map((f) => +f.y.toFixed(2)))
  )
  console.log(`max Y jump: ${maxYJump.toFixed(2)}`)

  // with smooth animation, max per-frame jump should be small
  // a snap-back would show a jump of 5+ pixels in one frame
  expect(
    maxYJump,
    `Y position jumped ${maxYJump.toFixed(1)}px in one frame - indicates snap-back to enterStyle`
  ).toBeLessThan(5)
})
