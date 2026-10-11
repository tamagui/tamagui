import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Repro for: "adapted sheet never shows again after the first open/close"
 *
 * Bug context:
 *   On reopen, Adapt.Contents remounts the sheet children a beat after the
 *   frame, so a fit-mode sheet briefly measures a near-empty frame and
 *   animateTo retargets to a nearly-closed position. Starting that second
 *   animation makes the driver fire the superseded first animation's owed
 *   completion callback, which synced at.current back to the first target.
 *   When the real content height landed, animateTo computed that same target,
 *   saw at.current already equal to it, and bailed — leaving the frame parked
 *   at the bottom of the screen with no animation running.
 *
 * What this test asserts:
 *   open → close → reopen, then the sheet frame's top must settle well inside
 *   the viewport (not hang at the close target just past the bottom edge).
 */
test.describe('Dialog Sheet Adapt - sheet shows again on reopen', () => {
  // narrow viewport so `when="maxMd"` triggers the adapted code path
  test.use({ viewport: { width: 600, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'DialogSheetAdaptReopenCase',
      type: 'useCase',
    })
  })

  test('sheet frame is visible on second open after an interrupted first open', async ({
    page,
  }) => {
    const sheetState = () =>
      page.evaluate(
        () =>
          document
            .querySelector('[data-testid="sheet-frame"][data-state]')
            ?.getAttribute('data-state') ?? null
      )
    const frameTop = () =>
      page.evaluate(() => {
        const frame = document.querySelector('[data-testid="sheet-frame"]')
        return frame ? Math.round(frame.getBoundingClientRect().top) : null
      })

    // open, close while the slide-in is still in flight, then reopen while
    // the slide-out is still in flight. the interrupted open's completion
    // callback fires when the close supersedes it; without the guard it syncs
    // at.current back to the open target, so the reopen's animateTo sees
    // at === target and bails while the frame keeps sliding down. everything
    // runs in-page so playwright round-trip latency cannot let an animation
    // finish between the steps.
    await page.getByTestId('open-dialog').click()
    await expect.poll(sheetState, { timeout: 5000 }).toBe('open')
    const interrupted = await page.evaluate(
      () =>
        new Promise<{ closedMidFlight: boolean; reopenedMidFlight: boolean }>(
          (resolve) => {
            const startedAt = performance.now()
            const top = () =>
              document
                .querySelector('[data-testid="sheet-frame"]')
                ?.getBoundingClientRect().top ?? Number.MAX_VALUE
            const waitForClose = (closeStartTop: number) => {
              const t = top()
              if (t > closeStartTop + 30) {
                // the frame is visibly sliding back down: reopen mid-close
                ;(window as any).__dialogSetOpen?.(true)
                resolve({ closedMidFlight: true, reopenedMidFlight: true })
                return
              }
              if (performance.now() - startedAt > 4000) {
                resolve({ closedMidFlight: true, reopenedMidFlight: false })
                return
              }
              requestAnimationFrame(() => waitForClose(closeStartTop))
            }
            const waitForOpenMoving = () => {
              const t = top()
              if (t < 890) {
                // the frame has started sliding up but has not settled: close
                ;(window as any).__dialogSetOpen?.(false)
                requestAnimationFrame(() => waitForClose(t))
                return
              }
              if (performance.now() - startedAt > 4000) {
                resolve({ closedMidFlight: false, reopenedMidFlight: false })
                return
              }
              requestAnimationFrame(waitForOpenMoving)
            }
            requestAnimationFrame(waitForOpenMoving)
          }
        )
    )
    expect(interrupted.closedMidFlight, 'must interrupt the enter animation').toBe(true)
    expect(interrupted.reopenedMidFlight, 'must reopen during the exit animation').toBe(
      true
    )

    // the reopened sheet must come back inside the viewport, not keep sliding
    // to the close target with no animation running
    await expect.poll(sheetState, { timeout: 5000 }).toBe('open')
    await expect.poll(frameTop, { timeout: 5000 }).toBeLessThan(800)
  })
})
