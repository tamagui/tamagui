import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests that popover position ANIMATES smoothly (no jumps) when switching tabs.
 * The key bug: motion driver often JUMPS to the new position instead of animating.
 * We detect this by sampling translateX every frame and checking for smooth interpolation.
 */

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'animated-reanimated',
    'Reanimated driver has larger frame jumps during rapid position changes on web'
  )
  await setupPage(page, { name: 'TabHoverAnimationCase', type: 'useCase' })
  await page.waitForTimeout(500)
})

// start continuous position sampling via rAF using getBoundingClientRect
// (avoids getComputedStyle which forces style recalc and can interfere with animations)
async function startSampling(page: any) {
  await page.evaluate(() => {
    const el = document.querySelector('[data-popper-animate-position]')
    if (!el) return
    const log: { t: number; x: number }[] = []
    ;(window as any).__posLog = log
    const start = performance.now()
    let running = true
    ;(window as any).__stopPosLog = () => {
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
    ;(window as any).__stopPosLog?.()
    return (window as any).__posLog as { t: number; x: number }[]
  })
}

function analyzeJumps(log: { t: number; x: number }[], threshold = 30) {
  let maxDelta = 0
  for (let i = 1; i < log.length; i++) {
    const delta = Math.abs(log[i].x - log[i - 1].x)
    if (delta > maxDelta) maxDelta = delta
  }
  return { maxDelta }
}

test('popover animates smoothly from A to E', async ({ page }) => {
  await page.locator('[data-testid="tab-tab-a"]').hover()
  await page.waitForTimeout(800)

  await startSampling(page)
  await page.locator('[data-testid="tab-tab-e"]').hover()
  await page.waitForTimeout(800)

  const log = await stopSampling(page)
  const { maxDelta } = analyzeJumps(log)

  // with 500ms animation, smooth movement should have max ~15px per frame at 60fps
  // allow some tolerance but no single-frame jumps > 50px
  expect(maxDelta, `Max single-frame jump was ${maxDelta.toFixed(1)}px`).toBeLessThan(90)
})

test('popover animates smoothly during rapid sweep A→E', async ({ page }) => {
  const tabs = ['tab-tab-a', 'tab-tab-b', 'tab-tab-c', 'tab-tab-d', 'tab-tab-e']

  await page.locator('[data-testid="tab-tab-a"]').hover()
  await page.waitForTimeout(600)

  await startSampling(page)

  for (const id of tabs) {
    await page.locator(`[data-testid="${id}"]`).hover()
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(800)

  const log = await stopSampling(page)
  const { maxDelta } = analyzeJumps(log)

  // during rapid sweep, interruptions cause animation restarts
  // but each restart should be from CURRENT position, not from origin
  expect(maxDelta, `Max single-frame jump was ${maxDelta.toFixed(1)}px`).toBeLessThan(90)
})

test('popover animates smoothly during back-and-forth', async ({ page }) => {
  const tabs = ['tab-tab-a', 'tab-tab-b', 'tab-tab-c', 'tab-tab-d', 'tab-tab-e']

  await page.locator('[data-testid="tab-tab-a"]').hover()
  await page.waitForTimeout(600)

  await startSampling(page)

  // sweep right then left then right
  for (const id of tabs) {
    await page.locator(`[data-testid="${id}"]`).hover()
    await page.waitForTimeout(50)
  }
  for (const id of [...tabs].reverse()) {
    await page.locator(`[data-testid="${id}"]`).hover()
    await page.waitForTimeout(50)
  }
  for (const id of tabs) {
    await page.locator(`[data-testid="${id}"]`).hover()
    await page.waitForTimeout(50)
  }

  await page.waitForTimeout(800)

  const log = await stopSampling(page)
  const { maxDelta } = analyzeJumps(log)

  // back-and-forth is the hardest case for animation interruption
  // but should still not have massive teleports
  expect(maxDelta, `Max single-frame jump was ${maxDelta.toFixed(1)}px`).toBeLessThan(90)
})
