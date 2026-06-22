import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Regression test for the tamagui.dev logo "dot" jitter.
 *
 * The dot is a Circle with transition="medium" whose x is updated continuously
 * from onMouseMove. Moving the mouse rapidly left/right over the letters
 * interrupts the transform animation every frame. The motion driver must
 * redirect from the CURRENT animated position; the regression restarts the
 * animation from origin, producing a visible stutter / teleport.
 *
 * We sample the dot's painted x (getBoundingClientRect().left) every frame and
 * assert there are no large single-frame jumps (which only happen on a restart
 * from a stale/zero base).
 *
 * Ported from the old TamaguiSiteMotion.test.ts "Logo Jitter Bug" harness so it
 * runs in kitchen-sink without rebuilding the whole site.
 */

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'animated-native',
    'Native driver does not support hover animations on web'
  )
  test.skip(
    testInfo.project.name === 'animated-reanimated',
    'Reanimated driver has larger frame jumps during rapid position changes on web'
  )
  await setupPage(page, { name: 'LogoDotInterruptCase', type: 'useCase' })
  await page.waitForTimeout(500)
})

async function startSampling(page: any) {
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="logo-dot"]')
    if (!el) return
    const log: { t: number; x: number }[] = []
    ;(window as any).__dotLog = log
    const start = performance.now()
    let running = true
    ;(window as any).__stopDotLog = () => {
      running = false
    }
    function tick() {
      if (!running) return
      log.push({ t: performance.now() - start, x: el!.getBoundingClientRect().left })
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

async function stopSampling(page: any) {
  return page.evaluate(() => {
    ;(window as any).__stopDotLog?.()
    return (window as any).__dotLog as { t: number; x: number }[]
  })
}

function analyze(log: { t: number; x: number }[]) {
  let maxDelta = 0
  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  for (let i = 0; i < log.length; i++) {
    minX = Math.min(minX, log[i].x)
    maxX = Math.max(maxX, log[i].x)
    if (i > 0) {
      const delta = Math.abs(log[i].x - log[i - 1].x)
      if (delta > maxDelta) maxDelta = delta
    }
  }
  return { maxDelta, minX, maxX, span: maxX - minX, samples: log.length }
}

test('logo dot stays smooth during rapid left-right flicks over the letters', async ({
  page,
}) => {
  const strip = page.locator('[data-testid="logo-strip"]')
  await expect(strip).toBeVisible()
  const box = await strip.boundingBox()
  if (!box) throw new Error('no logo-strip box')
  const cy = box.y + box.height / 2

  // activate: hover into the strip first
  await page.mouse.move(box.x + 10, cy)
  await page.waitForTimeout(200)

  await startSampling(page)

  // rapid back-and-forth flicks: left -> right -> mid every ~frame, repeated.
  // this is the exact user gesture: "moving mouse rapidly left and right over
  // the letters".
  for (let s = 0; s < 20; s++) {
    await page.mouse.move(box.x + box.width * 0.12, cy)
    await page.waitForTimeout(16)
    await page.mouse.move(box.x + box.width * 0.88, cy)
    await page.waitForTimeout(16)
    await page.mouse.move(box.x + box.width * 0.5, cy)
    await page.waitForTimeout(16)
  }
  await page.waitForTimeout(500)

  const log = await stopSampling(page)
  const { maxDelta, minX, maxX, span, samples } = analyze(log)

  console.log(
    `[logo-dot] samples=${samples} span=${span.toFixed(0)} minX=${minX.toFixed(0)} maxX=${maxX.toFixed(0)} maxDelta=${maxDelta.toFixed(1)}`
  )

  // a smooth medium transition moves at most ~15-25px/frame. a restart from a
  // stale/zero base teleports the dot by the full travel distance in 1 frame.
  expect(
    maxDelta,
    `Max single-frame jump was ${maxDelta.toFixed(1)}px (restart-from-origin regression)`
  ).toBeLessThan(90)
})
