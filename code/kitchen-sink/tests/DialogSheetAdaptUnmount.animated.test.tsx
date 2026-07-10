import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Repro for: "Sheet body unmounts before exit animation completes"
 *
 * Bug context:
 *   When a Tamagui Dialog adapts to a Sheet (Adapt + Sheet + Adapt.Contents),
 *   the children mounted into Adapt.Contents are driven by Dialog.open, NOT
 *   by Sheet.open. On close, Dialog tears its tree down immediately while the
 *   Sheet is still animating out, so the body of the sheet vanishes mid-slide.
 *
 *   In takeout this is masked by an opaque BlurView + $color5 layer painted on
 *   Sheet.Container itself, so the empty contents area still looks "full" until
 *   the slide finishes. The 3PC Dialog is just bg="$backgroundSurface" with no
 *   inner cover, so the unmount is visible.
 *
 * What this test asserts:
 *   1. Open dialog at narrow viewport so Adapt platform="touch" + when="maxMd"
 *      activates and Dialog.Adapt swaps in the Sheet.
 *   2. The marker text inside the body must be visible (it lives in the sheet).
 *   3. After clicking close, sample the marker for several frames during the
 *      sheet's slide-out. The marker must remain in the DOM with non-zero
 *      layout for the duration of the slide-out, NOT vanish on the first frame.
 *   4. After the animation finishes, the marker should be gone.
 */
test.describe('Dialog Sheet Adapt - body persists during exit animation', () => {
  // narrow viewport so `when="maxMd"` triggers the adapted code path
  test.use({ viewport: { width: 600, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'DialogSheetAdaptUnmountCase',
      type: 'useCase',
    })
  })

  test('marker stays mounted while the sheet slides out', async ({ page }) => {
    const marker = page.getByTestId('dialog-content-marker')
    const sheetFrame = page.locator('.is_SheetContainer[data-state]')

    // open the dialog (which adapts to a sheet on this viewport)
    await page.getByTestId('open-dialog').click()

    // wait for the sheet to be open and the marker to exist in the DOM.
    // we don't assert visibility (toBeVisible) because the css driver can
    // leave the sheet positioned just outside the viewport during/after the
    // enter animation in this layout — the question this test is about is
    // *DOM lifecycle* (mount/unmount), not pixel position.
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

    // start the close. clicking elements isn't viable here:
    //   - the SheetOverlay covers the entire viewport so every element looks
    //     obstructed,
    //   - Tamagui Buttons use Pressable (pointer events), so synthetic
    //     .click() from page.evaluate doesn't fire onPress.
    // the use case exposes window.__dialogSetOpen so we can drive the dialog
    // imperatively, which is what we actually want to test.
    // sanity: the close call must actually flip the sheet's data-state, else
    // the persistence assertions below are meaningless. start the sampler and
    // close in the same in-page task so playwright round-trip latency cannot
    // shift the samples past the short exit animation under parallel load.
    type Sample = { t: number; exists: boolean; state: string | null; top: number | null }
    const samples: Sample[] = await page.evaluate(
      () =>
        new Promise<Sample[]>((resolve) => {
          const startedAt = performance.now()
          const samples: Sample[] = []

          const record = () => {
            samples.push({
              t: performance.now() - startedAt,
              exists: !!document.querySelector('[data-testid="dialog-content-marker"]'),
              state:
                document
                  .querySelector('.is_SheetContainer[data-state]')
                  ?.getAttribute('data-state') ?? null,
              top:
                document
                  .querySelector('.is_SheetContainer[data-state]')
                  ?.getBoundingClientRect().top ?? null,
            })
          }

          ;(window as any).__dialogSetOpen?.(false)
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

    // mid-slide window is empirical, not a fixed duration: with real spring
    // rest detection the exit can complete almost instantly under CPU
    // starvation (time-based physics + starved frames = the sheet really is
    // done by the first frame we see). a sample counts as mid-animation only
    // if the sheet had flipped to closed AND was still visibly short of its
    // final resting position — if there are no such frames the exit was
    // legitimately instant and there is nothing to assert mid-slide (the
    // mount/unmount sanity checks below still run).
    const finalTop = [...samples].reverse().find((s) => s.top != null)?.top
    const midAnimationSamples = samples.filter(
      (s) =>
        firstClosedAt != null &&
        s.t >= firstClosedAt &&
        s.state === 'closed' &&
        s.top != null &&
        finalTop != null &&
        Math.abs(s.top - finalTop) > 2
    )

    // every early sample taken during the slide-out should still find the
    // marker DOM node. if the bug reproduces, the Adapt.Contents portal slot
    // is torn down on the very first frame after `dialog.open` flips false,
    // because the teardown is driven by Dialog.open and not by Sheet.open.
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

    // sanity: eventually the sheet should be fully closed
    await expect
      .poll(
        async () =>
          page.evaluate(
            () =>
              document
                .querySelector('.is_SheetContainer[data-state]')
                ?.getAttribute('data-state') ?? 'gone'
          ),
        { timeout: 3000 }
      )
      .toBe('closed')

    // and after the slide-out completes, the marker SHOULD unmount —
    // this is the other half of the fix (no permanent mount / memory leak).
    // Adapt handoff onAnimationComplete marks the target fully hidden,
    // DialogContent then returns null, and the live slot empties.
    await expect
      .poll(
        async () =>
          page.evaluate(
            () => !!document.querySelector('[data-testid="dialog-content-marker"]')
          ),
        { timeout: 3000 }
      )
      .toBe(false)
  })
})
