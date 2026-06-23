import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * regression tests for #4011 (previously #2847): the progress indicator must
 * paint at its correct position on the first frame and never flash to full
 * (100%) before settling. animated drivers seed their value to the indicator's
 * initial style, so if the spring transition is active during the mount handoff
 * the bar springs from 0 (full) up to the real value, flashing full first.
 *
 * value=60 with an indicator that is 200% the container width means the correct
 * translateX is -70% of the indicator's own width. a "full" bar would be at
 * roughly -50% (or 0 / none). we assert the indicator stays at ~-70% and never
 * gets close to full while loading, then that real value changes still animate.
 */

// the indicator must sit at -70% of its width for value=60. anything closer to
// 0 than -55% means it flashed toward full.
const FULL_THRESHOLD_RATIO = -0.55

function translateXPx(transform: string): number | null {
  if (!transform || transform === 'none') return 0
  const m = transform.match(/matrix\(1, 0, 0, 1, (-?[\d.]+),/)
  return m ? Number.parseFloat(m[1]) : null
}

test.describe('Progress first paint (#4011)', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'ProgressFirstPaint', type: 'useCase' })
  })

  test('indicator never flashes to full while loading', async ({ page }) => {
    const indicator = page.getByTestId('progress-indicator')
    await indicator.waitFor({ state: 'visible' })

    // sample the indicator's transform across the first ~1.2s (covering the
    // post-mount re-render the usecase forces, where the flash used to appear).
    const samples = await page.evaluate(() => {
      return new Promise<{ tx: string; w: number }[]>((resolve) => {
        const out: { tx: string; w: number }[] = []
        const start = performance.now()
        const tick = () => {
          const el = document.querySelector('[data-testid="progress-indicator"]')
          if (el) {
            const cs = getComputedStyle(el)
            out.push({ tx: cs.transform, w: Number.parseFloat(cs.width) })
          }
          if (performance.now() - start < 1200) requestAnimationFrame(tick)
          else resolve(out)
        }
        requestAnimationFrame(tick)
      })
    })

    expect(samples.length, 'should have captured frames').toBeGreaterThan(0)

    const width = samples[samples.length - 1].w
    const expectedX = -0.7 * width
    const fullThreshold = FULL_THRESHOLD_RATIO * width

    // every sampled frame must be at the value-based position, never near full
    for (const s of samples) {
      const x = translateXPx(s.tx)
      expect(x, `unexpected transform ${s.tx}`).not.toBeNull()
      expect(
        x!,
        `indicator flashed toward full: x=${x} (full threshold ${fullThreshold.toFixed(0)})`
      ).toBeLessThan(fullThreshold)
    }

    // and the final/initial resting position is the correct value (~-70%)
    const finalX = translateXPx(samples[samples.length - 1].tx)!
    expect(finalX, `resting position should be ~${expectedX.toFixed(0)}px`).toBeCloseTo(
      expectedX,
      -1
    )
  })

  test('value changes still animate smoothly', async ({ page }) => {
    const indicator = page.getByTestId('progress-indicator')
    await indicator.waitFor({ state: 'visible' })
    await page.waitForTimeout(500)

    const samples: (number | null)[] = await page.evaluate(() => {
      return new Promise<(number | null)[]>((resolve) => {
        const el = document.querySelector('[data-testid="progress-indicator"]')!
        const vals: (number | null)[] = []
        const start = performance.now()
        const read = () => {
          const m = getComputedStyle(el).transform.match(
            /matrix\(1, 0, 0, 1, (-?[\d.]+),/
          )
          return m ? Number.parseFloat(m[1]) : null
        }
        const tick = () => {
          vals.push(read())
          if (performance.now() - start < 700) requestAnimationFrame(tick)
          else resolve(vals)
        }
        ;(
          document.querySelector('[data-testid="progress-set-90"]') as HTMLElement
        ).click()
        requestAnimationFrame(tick)
      })
    })

    const distinct = new Set(
      samples.filter((v): v is number => v != null).map((v) => Math.round(v))
    )

    // a smooth animation produces multiple intermediate positions; an instant
    // snap (or cut-off transition) would only produce one or two.
    expect(
      distinct.size,
      `value change should animate (got ${distinct.size} distinct positions)`
    ).toBeGreaterThanOrEqual(3)
  })
})
