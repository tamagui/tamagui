import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// a fully closed web sheet is parked below the largest viewport the page has
// seen (iOS Safari grows it as its chrome collapses), which is taller than the
// visible viewport. a reopen must start at the visible edge, not spend its
// first frames out of sight. pinned to the motion driver, the one the site's
// menu sheet runs on (it applies direct writes a frame late).
test.use({ viewport: { width: 390, height: 900 } })

const trigger = 'animation-quick-trigger'
const frame = 'animation-quick-frame'
const close = 'animation-quick-close'

// the sheet frame's top on each animation frame after the click, until it moves
// no further for several frames. reads no geometry before the click.
async function openAndSampleTops(page: any) {
  return page.evaluate(
    ({ triggerId, frameId }: { triggerId: string; frameId: string }) =>
      new Promise<number[]>((resolve) => {
        const frameEl = document.querySelector(`[data-testid="${frameId}"]`)!
        const tops: number[] = []
        let still = 0
        const sample = () => {
          const rect = frameEl.getBoundingClientRect()
          if (rect.height > 0) {
            if (tops.length && Math.abs(rect.top - tops[tops.length - 1]) < 0.5) still++
            else still = 0
            tops.push(rect.top)
          }
          if (still >= 5 || tops.length > 240) resolve(tops)
          else requestAnimationFrame(sample)
        }
        ;(document.querySelector(`[data-testid="${triggerId}"]`) as HTMLElement).click()
        requestAnimationFrame(sample)
      }),
    { triggerId: trigger, frameId: frame }
  )
}

test.describe('Sheet opening origin', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'SheetAnimationCase',
      type: 'useCase',
      searchParams: { animationDriver: 'motion' },
    })
    // the viewport shrinks from its high-water mark, as when Safari chrome expands
    await page.setViewportSize({ width: 390, height: 600 })
    await page.waitForFunction(() => innerHeight === 600)
  })

  test('reopening from fully closed starts at the visible viewport edge', async ({
    page,
  }) => {
    const viewport = page.viewportSize()!.height

    // first open, then close fully (frame is display:none once parked)
    await openAndSampleTops(page)
    await page.getByTestId(close).click()
    await expect
      .poll(() => page.getByTestId(frame).isVisible(), { timeout: 5000 })
      .toBe(false)

    const tops = await openAndSampleTops(page)
    expect(Math.max(...tops)).toBeLessThanOrEqual(viewport + 1)
    // and still lands at its resting snap point
    expect(tops[tops.length - 1]).toBeLessThan(viewport * 0.7)
  })

  test('reopening mid-close continues from where the close left off', async ({
    page,
  }) => {
    await openAndSampleTops(page)
    await page.getByTestId(close).click()
    // reverse in the page, in the first frame after the sheet has dropped well
    // below its resting point but is still visible
    const { reversedAt, tops } = await page.evaluate(
      ({ triggerId, frameId }: { triggerId: string; frameId: string }) =>
        new Promise<{ reversedAt: number; tops: number[] }>((resolve) => {
          const frameEl = document.querySelector(`[data-testid="${frameId}"]`)!
          const tick = () => {
            const reversedAt = frameEl.getBoundingClientRect().top
            if (reversedAt < 480) return requestAnimationFrame(tick)
            ;(
              document.querySelector(`[data-testid="${triggerId}"]`) as HTMLElement
            ).click()
            const tops: number[] = []
            const sample = () => {
              tops.push(frameEl.getBoundingClientRect().top)
              if (tops.length < 8) requestAnimationFrame(sample)
              else resolve({ reversedAt, tops })
            }
            requestAnimationFrame(sample)
          }
          requestAnimationFrame(tick)
        }),
      { triggerId: trigger, frameId: frame }
    )
    // a spring reversal carries a few frames of momentum, but it must never
    // jump to the visible edge or the parked position
    expect(Math.max(...tops)).toBeLessThanOrEqual(reversedAt + 60)
  })
})
