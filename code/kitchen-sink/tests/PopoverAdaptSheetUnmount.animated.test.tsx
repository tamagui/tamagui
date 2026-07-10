import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Repro for: "Popover sheet body unmounts before exit animation completes"
 *
 * Bug context (sibling of DialogSheetAdaptUnmount):
 *   When a Tamagui Popover adapts to a Sheet (Adapt + Sheet + Adapt.Contents),
 *   the children mounted into Adapt.Contents are gated by PopoverContent's
 *   unmount logic, which is driven by the popup exit animation (isFullyHidden),
 *   NOT by Sheet.open. On close the popover tears its tree down on the first
 *   frame while the Sheet is still sliding out, so the sheet body vanishes
 *   mid-slide (no exit animation, it just disappears).
 *
 * What this test asserts:
 *   1. Open the popover at a narrow viewport so Adapt when="maxMd" activates and
 *      swaps in the Sheet.
 *   2. The marker text inside the body must be in the DOM (it lives in the sheet).
 *   3. After closing, sample the marker for several frames during the slide-out.
 *      The marker must remain in the DOM for the duration, NOT vanish on the
 *      first frame.
 *   4. After the animation finishes, the marker should unmount (no leak).
 */
test.describe('Popover Sheet Adapt - body persists during exit animation', () => {
  // narrow viewport so `when="maxMd"` triggers the adapted code path
  test.use({ viewport: { width: 600, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'PopoverAdaptSheetUnmountCase',
      type: 'useCase',
    })
  })

  test('marker stays mounted while the sheet slides out', async ({ page }) => {
    const marker = page.getByTestId('popover-content-marker')

    // open the popover (which adapts to a sheet on this viewport)
    await page.getByTestId('open-popover').click()

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

    // drive the close imperatively (overlay covers the viewport; Pressable
    // ignores synthetic clicks). __popoverSetOpen is exposed by the use case.
    // sanity: the close call must actually flip the sheet's data-state, else
    // the persistence assertions below are meaningless. start the sampler and
    // close in the same in-page task so playwright round-trip latency cannot
    // shift the samples past the short exit animation under parallel load.
    type Sample = { t: number; exists: boolean; state: string | null }
    const samples: Sample[] = await page.evaluate(
      () =>
        new Promise<Sample[]>((resolve) => {
          const startedAt = performance.now()
          const samples: Sample[] = []

          const record = () => {
            samples.push({
              t: performance.now() - startedAt,
              exists: !!document.querySelector('[data-testid="popover-content-marker"]'),
              state:
                document
                  .querySelector('.is_SheetContainer[data-state]')
                  ?.getAttribute('data-state') ?? null,
            })
          }

          ;(window as any).__popoverSetOpen?.(false)
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

    // `medium` css driver is ~400ms, so anything <250ms after the browser
    // observes the closed state is solidly mid-slide. assert only that early
    // window so we don't race the legitimate post-animation cleanup.
    const midAnimationSamples = samples.filter(
      (s) => firstClosedAt != null && s.t >= firstClosedAt && s.t - firstClosedAt <= 250
    )
    expect(midAnimationSamples.length).toBeGreaterThan(0)

    // every early sample during the slide-out should still find the marker. if
    // the bug reproduces, the Adapt.Contents slot is torn down on the first
    // frame after popover.open flips false, because PopoverContent unmounts on
    // its own (popup) exit, not on the sheet's slide-out.
    for (const s of midAnimationSamples) {
      expect
        .soft(
          s.exists,
          `marker should still be in DOM at +${Math.round(
            firstClosedAt == null ? s.t : s.t - firstClosedAt
          )}ms after closed state (mid-animation, before sheet finishes sliding)`
        )
        .toBe(true)
    }

    // and after the slide-out completes, the marker SHOULD unmount, the other
    // half of the fix (no permanent mount). the Adapt handoff flips
    // adaptContext.targetFullyHidden true, so PopoverContent returns null.
    await expect
      .poll(
        async () =>
          page.evaluate(
            () => !!document.querySelector('[data-testid="popover-content-marker"]')
          ),
        { timeout: 3000 }
      )
      .toBe(false)
  })
})
