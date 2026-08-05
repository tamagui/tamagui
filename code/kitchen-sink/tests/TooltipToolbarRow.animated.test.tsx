import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// covers the shared-tooltip-over-icon-row pattern (single controlled Tooltip,
// label + anchor swap as the pointer crosses adjacent triggers):
//
// 1. content resize while open must recompute position — previously nothing
//    watched the floating element, so a label swap left the bubble off-center
//    (stuck at the x computed for the old width) until an unrelated event
//    triggered an update
// 2. a fast sweep across the row must end with the tooltip centered on the
//    final trigger with its label, without teleport-sized single-frame jumps

async function getIconCenter(page, i: number) {
  const box = await page.locator(`[data-testid="icon-${i}"]`).boundingBox()
  if (!box) throw new Error(`icon-${i} not found`)
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

const CONTENT_SEL = '[data-popper-animate-position]'

test.describe('Tooltip toolbar row (shared tooltip across adjacent triggers)', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // the react-native web driver can't drive the shared-tooltip animatePosition
    // pattern (same skip as TooltipGlobalPattern/TooltipPositionJump, which
    // restrict further to motion-only — css and reanimated pass here)
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver === 'native') {
      test.skip()
    }
    await setupPage(page, { name: 'TooltipToolbarRowCase', type: 'useCase' })
    await page.waitForSelector('[data-testid="icon-0"]', { timeout: 15000 })
  })

  test('recenters when the open tooltip content resizes', async ({ page }) => {
    const anchor = await getIconCenter(page, 3)
    await page.mouse.move(anchor.x, anchor.y, { steps: 4 })
    await page.waitForSelector(CONTENT_SEL, { timeout: 5000 })
    await page.waitForTimeout(600)

    // widen the label without moving the anchor
    await page.evaluate((sel) => {
      const el = document.querySelector(sel)!
      const label = el.querySelector('span') || el.lastElementChild!
      label.textContent = 'Toggle appearance with a much longer label'
    }, CONTENT_SEL)
    await page.waitForTimeout(600)

    const { center, width } = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
      return { center: m.e + el.offsetWidth / 2, width: el.offsetWidth }
    }, CONTENT_SEL)

    expect(width).toBeGreaterThan(150) // the label actually widened
    expect(Math.abs(center - anchor.x)).toBeLessThan(3)
  })

  test('fast sweep across the row settles centered on the last icon', async ({
    page,
  }) => {
    const right = await getIconCenter(page, 7)
    const left = await getIconCenter(page, 0)

    await page.mouse.move(right.x, right.y, { steps: 4 })
    await page.waitForSelector(CONTENT_SEL, { timeout: 5000 })
    await page.waitForTimeout(500)

    // ~300ms sweep across all 8 icons
    const steps = 24
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(right.x + ((left.x - right.x) * i) / steps, right.y)
      await page.waitForTimeout(12)
    }
    await page.waitForTimeout(800)

    // no per-frame smoothness assertion. it was tried both ways and neither
    // discriminates in the lane this actually runs in, where four animation
    // driver projects share a machine. as distance it failed CI at 183px
    // against a 150px bound; rebuilt as frame-rate-independent velocity the
    // teleport boundary is 9.06px/ms, and legitimate motion in that same CI
    // run measured ~11px/ms. under 8 local CPU burners it ran 16-48px/ms.
    // reanimated does not glide on a contended machine, so real motion
    // outruns the teleport boundary and the check reports a regression that
    // is not there. the settle assertions below are what hold.

    const state = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
      return { center: m.e + el.offsetWidth / 2, text: el.textContent }
    }, CONTENT_SEL)
    expect(state.text).toContain('Back')
    expect(Math.abs(state.center - left.x)).toBeLessThan(4)
  })
})
