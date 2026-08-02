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
const NOMINAL_FRAME_MS = 1000 / 60
const TELEPORT_VELOCITY = 150 / NOMINAL_FRAME_MS

type PositionSample = {
  at: number
  tx: number
}

function getMaxPositionVelocity(samples: PositionSample[]) {
  let maxVelocity = 0
  for (let i = 1; i < samples.length; i++) {
    const elapsed = samples[i].at - samples[i - 1].at
    if (elapsed > 0) {
      maxVelocity = Math.max(
        maxVelocity,
        Math.abs(samples[i].tx - samples[i - 1].tx) / elapsed
      )
    }
  }
  return maxVelocity
}

test.describe('Tooltip toolbar row (shared tooltip across adjacent triggers)', () => {
  test.beforeEach(async ({ page }) => {
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
      const style = getComputedStyle(el)
      const x =
        style.translate !== 'none'
          ? Number.parseFloat(style.translate)
          : style.transform === 'none'
            ? 0
            : new DOMMatrixReadOnly(style.transform).e
      return { center: x + el.offsetWidth / 2, width: el.offsetWidth }
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

    // Record time as well as position. Distance per sample confuses a delayed
    // rAF under concurrent CI load with a teleport; velocity preserves the
    // original 150px-per-60Hz-frame boundary without depending on frame rate.
    await page.evaluate((sel) => {
      ;(window as any).__tips = []
      const sample = (at: number) => {
        const el = document.querySelector(sel) as HTMLElement | null
        if (el) {
          const style = getComputedStyle(el)
          ;(window as any).__tips.push({
            at,
            tx:
              style.translate !== 'none'
                ? Number.parseFloat(style.translate)
                : style.transform === 'none'
                  ? 0
                  : new DOMMatrixReadOnly(style.transform).e,
          })
        }
        requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    }, CONTENT_SEL)

    // ~300ms sweep across all 8 icons
    const steps = 24
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(right.x + ((left.x - right.x) * i) / steps, right.y)
      await page.waitForTimeout(12)
    }
    await page.waitForTimeout(800)

    const samples = await page.evaluate(() => (window as any).__tips as PositionSample[])
    expect(samples.length).toBeGreaterThan(1)

    // Negative control: the metric must still reject the same 150px-per-frame
    // class of jump that this regression test was written to catch.
    const syntheticTeleport = getMaxPositionVelocity([
      { at: 0, tx: 0 },
      { at: NOMINAL_FRAME_MS, tx: 151 },
    ])
    expect(syntheticTeleport).toBeGreaterThan(TELEPORT_VELOCITY)

    const maxVelocity = getMaxPositionVelocity(samples)
    expect(maxVelocity, `tooltip moved at ${maxVelocity.toFixed(2)}px/ms`).toBeLessThan(
      TELEPORT_VELOCITY
    )

    const state = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement
      const style = getComputedStyle(el)
      const x =
        style.translate !== 'none'
          ? Number.parseFloat(style.translate)
          : style.transform === 'none'
            ? 0
            : new DOMMatrixReadOnly(style.transform).e
      return { center: x + el.offsetWidth / 2, text: el.textContent }
    }, CONTENT_SEL)
    expect(state.text).toContain('Back')
    expect(Math.abs(state.center - left.x)).toBeLessThan(4)
  })
})
