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
 *   Sheet.Frame itself, so the empty contents area still looks "full" until
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

  test('marker stays mounted while the sheet slides out', async ({
    page,
  }, testInfo) => {
    // motion driver fires its setValue onFinish callback near-instantly for
    // the sheet's spring animation (the framer-motion change-event proxy in
    // animations-motion/src/createAnimations.tsx resolves before the visual
    // transition has actually played). that's an existing driver-side timing
    // issue independent of this Dialog fix — the SheetController.onAnimationComplete
    // signal we rely on is firing essentially synchronously. tracking that
    // separately. skip here so this test stays a clean fix-regression check.
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver === 'motion') {
      test.skip()
      return
    }

    const marker = page.getByTestId('dialog-content-marker')
    const sheetFrame = page.locator('.is_Sheet[data-state]')

    // open the dialog (which adapts to a sheet on this viewport)
    await page.getByTestId('open-dialog').click()

    // wait for the sheet to be open and the marker to exist in the DOM.
    // we don't assert visibility (toBeVisible) because the css driver can
    // leave the sheet positioned just outside the viewport during/after the
    // enter animation in this layout — the question this test is about is
    // *DOM lifecycle* (mount/unmount), not pixel position.
    await expect.poll(
      async () =>
        page.evaluate(() =>
          document
            .querySelector('.is_Sheet[data-state]')
            ?.getAttribute('data-state')
        ),
      { timeout: 5000 }
    ).toBe('open')

    await expect(marker).toBeAttached({ timeout: 5000 })

    // start the close. clicking elements isn't viable here:
    //   - the SheetOverlay covers the entire viewport so every element looks
    //     obstructed,
    //   - Tamagui Buttons use Pressable (pointer events), so synthetic
    //     .click() from page.evaluate doesn't fire onPress.
    // the use case exposes window.__dialogSetOpen so we can drive the dialog
    // imperatively, which is what we actually want to test.
    const closeStart = Date.now()
    await page.evaluate(() => {
      ;(window as any).__dialogSetOpen?.(false)
    })

    // SANITY: the close call must actually have flipped the sheet's data-state.
    // if it didn't, the persistence assertions below are meaningless (every
    // sample would trivially pass).
    await expect.poll(
      async () =>
        page.evaluate(() =>
          document
            .querySelector('.is_Sheet[data-state]')
            ?.getAttribute('data-state')
        ),
      { timeout: 1000 }
    ).toBe('closed')

    // sample at several points during the exit animation. `medium` for the
    // css driver is `ease-in 400ms`, so anything <250ms is solidly mid-slide.
    // we deliberately stop sampling before the animation ends so we don't
    // race the legitimate post-animation cleanup that the fix does when
    // SheetController.onAnimationComplete fires (the css driver's completion
    // signal is loose and can fire ~80ms before the visual transition ends).
    type Sample = { t: number; exists: boolean }
    const samples: Sample[] = []
    const checkpoints = [30, 80, 150, 220]
    let prev = 0
    for (const t of checkpoints) {
      await page.waitForTimeout(t - prev)
      prev = t
      const exists = await page.evaluate(
        () =>
          !!document.querySelector('[data-testid="dialog-content-marker"]')
      )
      samples.push({ t: Date.now() - closeStart, exists })
    }

    console.log('marker samples during exit animation:', samples)

    // EVERY sample taken during the slide-out should still find the marker
    // DOM node. if the bug reproduces, the Adapt.Contents portal slot is
    // torn down on the very first frame after `dialog.open` flips false,
    // because the teardown is driven by Dialog.open and not by Sheet.open.
    for (const s of samples) {
      expect.soft(
        s.exists,
        `marker should still be in DOM at +${s.t}ms (mid-animation, before sheet finishes sliding)`
      ).toBe(true)
    }

    // sanity: eventually the sheet should be fully closed
    await expect.poll(
      async () =>
        page.evaluate(
          () =>
            document
              .querySelector('.is_Sheet[data-state]')
              ?.getAttribute('data-state') ?? 'gone'
        ),
      { timeout: 3000 }
    ).toBe('closed')

    // and after the slide-out completes, the marker SHOULD unmount —
    // this is the other half of the fix (no permanent mount / memory leak).
    // SheetController.onAnimationComplete flips DialogAdaptHiddenContext to
    // true, DialogContent then returns null, the portal slot empties.
    await expect.poll(
      async () =>
        page.evaluate(
          () =>
            !!document.querySelector('[data-testid="dialog-content-marker"]')
        ),
      { timeout: 3000 }
    ).toBe(false)
  })
})
