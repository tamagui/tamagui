import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests that clicking a hoverable popover trigger while the enter animation
 * is still playing produces a smooth exit - no snap-back, no re-enter cycle.
 *
 * Bug: when clicking during enter, the popover:
 * 1. Snaps to closed (no animation)
 * 2. Starts animating back in
 * 3. Then finally animates out
 */

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'animated-native',
    'Native driver does not support hover animations on web'
  )
  await setupPage(page, { name: 'PopoverHoverableDelayCase', type: 'useCase' })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
})

test('click during enter animation produces smooth exit (no snap-back)', async ({
  page,
}) => {
  const trigger = page.locator('#delay-trigger')
  const content = page.locator('#delay-content')

  await expect(content).not.toBeVisible()

  // start per-frame opacity sampling
  await page.evaluate(() => {
    ;(window as any).__opLog = [] as number[]
    ;(window as any).__rafOn = true
    const track = () => {
      if (!(window as any).__rafOn) return
      const el = document.getElementById('delay-content')
      if (el) {
        ;(window as any).__opLog.push(parseFloat(getComputedStyle(el).opacity))
      }
      requestAnimationFrame(track)
    }
    requestAnimationFrame(track)
  })

  // hover to trigger open (delay is 400ms)
  await trigger.hover()
  // wait for delay + a bit of animation time
  await page.waitForTimeout(500)

  // popover should be visible and animating
  const isVisible = await content.isVisible().catch(() => false)
  if (!isVisible) {
    // if not visible yet, wait more
    await page.waitForTimeout(300)
  }

  // now click the trigger (should close the popover)
  await trigger.click()

  // wait for exit animation
  await page.waitForTimeout(1500)

  // stop sampling
  await page.evaluate(() => {
    ;(window as any).__rafOn = false
  })

  const frames: number[] = await page.evaluate(() => (window as any).__opLog || [])

  console.log(
    'opacity timeline:',
    JSON.stringify(frames.slice(0, 40).map((f) => +f.toFixed(3)))
  )

  if (frames.length < 3) {
    // not enough data, skip analysis
    console.log('Not enough frames captured')
    return
  }

  // find the peak opacity
  const peak = Math.max(...frames)
  const peakIdx = frames.indexOf(peak)

  // look for dips (snap-back indicators)
  let maxDip = 0
  for (let i = 1; i < frames.length - 1; i++) {
    const prev = frames[i - 1]
    const curr = frames[i]
    const next = frames[i + 1]
    if (curr < prev && curr < next) {
      const dip = Math.min(prev - curr, next - curr)
      if (dip > maxDip) maxDip = dip
    }
  }

  // look for re-enter pattern: after opacity decreases, it increases again significantly
  let foundDecrease = false
  let maxReIncrease = 0
  for (let i = peakIdx + 1; i < frames.length; i++) {
    if (frames[i] < frames[i - 1] - 0.01) {
      foundDecrease = true
    }
    if (foundDecrease && frames[i] > frames[i - 1] + 0.05) {
      const increase = frames[i] - frames[i - 1]
      if (increase > maxReIncrease) maxReIncrease = increase
    }
  }

  console.log(`peak: ${peak.toFixed(3)} at frame ${peakIdx}`)
  console.log(`max dip: ${maxDip.toFixed(3)}`)
  console.log(`max re-increase after exit starts: ${maxReIncrease.toFixed(3)}`)

  // no significant dip (snap-back)
  expect(
    maxDip,
    `Opacity dip of ${maxDip.toFixed(3)} detected - element snapped back during exit`
  ).toBeLessThan(0.15)

  // no significant re-increase after exit starts (re-enter)
  expect(
    maxReIncrease,
    `Opacity increased by ${maxReIncrease.toFixed(3)} after exit started - re-enter detected`
  ).toBeLessThan(0.15)
})

test('click during mid-enter: transform should not jump', async ({ page }) => {
  const trigger = page.locator('#delay-trigger')
  const content = page.locator('#delay-content')

  await expect(content).not.toBeVisible()

  // start per-frame Y position sampling
  await page.evaluate(() => {
    ;(window as any).__yLog = [] as number[]
    ;(window as any).__rafOn = true
    const track = () => {
      if (!(window as any).__rafOn) return
      const el = document.getElementById('delay-content')
      if (el) {
        const transform = getComputedStyle(el).transform
        let y = 0
        if (transform && transform !== 'none') {
          const matrix = new DOMMatrix(transform)
          y = matrix.m42
        }
        ;(window as any).__yLog.push(y)
      }
      requestAnimationFrame(track)
    }
    requestAnimationFrame(track)
  })

  // hover to trigger open
  await trigger.hover()
  await page.waitForTimeout(500)

  const isVisible = await content.isVisible().catch(() => false)
  if (!isVisible) {
    await page.waitForTimeout(300)
  }

  // click to close during enter animation
  await trigger.click()
  await page.waitForTimeout(1500)

  await page.evaluate(() => {
    ;(window as any).__rafOn = false
  })

  const frames: number[] = await page.evaluate(() => (window as any).__yLog || [])

  console.log(
    'Y positions:',
    JSON.stringify(frames.slice(0, 30).map((f) => +f.toFixed(2)))
  )

  if (frames.length < 3) {
    console.log('Not enough frames captured')
    return
  }

  // check for single-frame jumps
  let maxJump = 0
  for (let i = 1; i < frames.length; i++) {
    const jump = Math.abs(frames[i] - frames[i - 1])
    if (jump > maxJump) maxJump = jump
  }

  console.log(`max Y jump: ${maxJump.toFixed(2)}`)

  expect(maxJump, `Y position jumped ${maxJump.toFixed(1)}px in one frame`).toBeLessThan(
    5
  )
})
