import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Select sibling of PopoverAdaptSheetUnmount.
 *
 * When a Select adapts to a Sheet (Adapt + Sheet + Adapt.Contents), the items
 * published into Adapt.Contents are gated by SelectContent's unmount logic,
 * which after the adapt-handoff migration follows adaptContext.targetFullyHidden
 * (the sheet slide-out), NOT Select.open. On close the body must persist through
 * the slide-out and only unmount once the sheet finishes animating out.
 */
test.describe('Select Sheet Adapt - body persists during exit animation', () => {
  test.use({ viewport: { width: 600, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'SelectAdaptSheetUnmountCase',
      type: 'useCase',
    })
  })

  test('marker stays mounted while the sheet slides out', async ({ page }) => {
    const marker = page.getByTestId('select-content-marker')

    // open the select (which adapts to a sheet)
    await page.getByTestId('open-select').click()

    // wait for the sheet to be open and the marker to exist in the DOM
    await expect
      .poll(
        async () =>
          page.evaluate(() =>
            document
              .querySelector('.is_SheetContainer[data-state]')
              ?.getAttribute('data-state')
          ),
        { timeout: 5000 }
      )
      .toBe('open')

    await expect(marker).toBeAttached({ timeout: 5000 })

    // start the sampler and close in the same in-page task so playwright
    // round-trip latency cannot shift samples past the short exit animation.
    type Sample = { t: number; exists: boolean; state: string | null }
    const samples: Sample[] = await page.evaluate(
      () =>
        new Promise<Sample[]>((resolve) => {
          const startedAt = performance.now()
          const samples: Sample[] = []

          const record = () => {
            samples.push({
              t: performance.now() - startedAt,
              exists: !!document.querySelector('[data-testid="select-content-marker"]'),
              state:
                document
                  .querySelector('.is_SheetContainer[data-state]')
                  ?.getAttribute('data-state') ?? null,
            })
          }

          ;(window as any).__selectSetOpen?.(false)
          record()

          const sample = () => {
            record()

            if (performance.now() - startedAt >= 500) {
              resolve(samples)
              return
            }

            requestAnimationFrame(sample)
          }

          requestAnimationFrame(sample)
        })
    )

    const firstClosedAt = samples.find((s) => s.state === 'closed')?.t
    expect(
      firstClosedAt,
      'close call should flip the sheet data-state while sampling'
    ).toBeDefined()

    const midAnimationSamples = samples.filter(
      (s) => firstClosedAt != null && s.t >= firstClosedAt && s.t - firstClosedAt <= 250
    )
    expect(midAnimationSamples.length).toBeGreaterThan(0)

    for (const s of midAnimationSamples) {
      expect
        .soft(
          s.exists,
          `marker should still be in DOM at +${Math.round(
            firstClosedAt == null ? s.t : s.t - firstClosedAt
          )}ms after closed state (mid-animation)`
        )
        .toBe(true)
    }

    // after the slide-out completes, the marker SHOULD unmount (no leak).
    await expect
      .poll(
        async () =>
          page.evaluate(
            () => !!document.querySelector('[data-testid="select-content-marker"]')
          ),
        { timeout: 3000 }
      )
      .toBe(false)
  })
})
