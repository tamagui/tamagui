import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetSnapPointsFitCase', type: 'useCase' })
})

test.describe('Sheet snapPointsMode="fit"', () => {
  test('standalone sheet with fit mode opens and closes without issues', async ({
    page,
  }) => {
    const trigger = page.getByTestId('standalone-fit-trigger')
    const frame = page.getByTestId('standalone-fit-frame')
    const closeButton = page.getByTestId('standalone-fit-close')

    // Initial state - sheet should not be visible
    await expect(trigger).toBeVisible()
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })

    // Open the sheet
    await trigger.click()

    // Wait for sheet to be visible
    await expect(frame).toBeVisible({ timeout: 5000 })

    // Close the sheet
    await closeButton.click()

    // Wait for animation to complete
    await page.waitForTimeout(500)

    // Sheet should not be visible
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('standalone sheet with percent mode opens and closes without issues', async ({
    page,
  }) => {
    const trigger = page.getByTestId('standalone-percent-trigger')
    const frame = page.getByTestId('standalone-percent-frame')
    const closeButton = page.getByTestId('standalone-percent-close')

    await expect(trigger).toBeVisible()
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    await closeButton.click()
    await page.waitForTimeout(500)
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('standalone sheet with constant mode opens and closes without issues', async ({
    page,
  }) => {
    const trigger = page.getByTestId('standalone-constant-trigger')
    const frame = page.getByTestId('standalone-constant-frame')
    const closeButton = page.getByTestId('standalone-constant-close')

    await expect(trigger).toBeVisible()
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    await closeButton.click()
    await page.waitForTimeout(500)
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('rapid open/close interactions work correctly', async ({ page }) => {
    const trigger = page.getByTestId('rapid-toggle-trigger')
    const frame = page.getByTestId('rapid-frame')
    const closeButton = page.getByTestId('rapid-close')

    await expect(trigger).toBeVisible()

    // Open the sheet
    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    // Close and reopen rapidly a few times using the close button
    for (let i = 0; i < 3; i++) {
      await closeButton.click()
      await page.waitForTimeout(300) // Wait for close animation
      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })
    }

    // Final close
    await closeButton.click()
    await page.waitForTimeout(500)

    // Sheet should be closed now
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('dynamic content changes while sheet is open', async ({ page }) => {
    const trigger = page.getByTestId('dynamic-content-trigger')
    const frame = page.getByTestId('dynamic-content-frame')
    const closeButton = page.getByTestId('dynamic-content-close')
    const sizeText = page.getByTestId('dynamic-content-size')
    const smallButton = page.getByTestId('dynamic-content-small')
    const mediumButton = page.getByTestId('dynamic-content-medium')
    const largeButton = page.getByTestId('dynamic-content-large')

    // Open the sheet
    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    // Initial size should be small
    await expect(sizeText).toContainText('small')

    // Get initial frame height
    const initialBox = await frame.boundingBox()
    const initialHeight = initialBox?.height ?? 0

    // Change to medium content
    await mediumButton.click()
    await expect(sizeText).toContainText('medium')
    await page.waitForTimeout(300) // Wait for resize animation

    // Get medium frame height - should be larger
    const mediumBox = await frame.boundingBox()
    const mediumHeight = mediumBox?.height ?? 0
    expect(mediumHeight).toBeGreaterThan(initialHeight)

    // Change to large content
    await largeButton.click()
    await expect(sizeText).toContainText('large')
    await page.waitForTimeout(300)

    // Get large frame height - should be even larger
    const largeBox = await frame.boundingBox()
    const largeHeight = largeBox?.height ?? 0
    expect(largeHeight).toBeGreaterThan(mediumHeight)

    // Change back to small
    await smallButton.click()
    await expect(sizeText).toContainText('small')
    await page.waitForTimeout(300)

    // Close the sheet - this is the key test for the white flash fix
    // The sheet should close from its current height without flashing to full viewport
    await closeButton.click()
    await page.waitForTimeout(500)

    // Sheet should be closed
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('sheet closes without white flash - frame height stays stable during close', async ({
    page,
  }) => {
    const trigger = page.getByTestId('standalone-fit-trigger')
    const frame = page.getByTestId('standalone-fit-frame')
    const closeButton = page.getByTestId('standalone-fit-close')

    // Open the sheet
    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    // Get the frame height when open
    const openBox = await frame.boundingBox()
    const openHeight = openBox?.height ?? 0

    // The height should be reasonable (not full viewport)
    // For a fit mode sheet with minimal content, it should be less than half viewport
    const viewportSize = page.viewportSize()
    const viewportHeight = viewportSize?.height ?? 768
    expect(openHeight).toBeLessThan(viewportHeight * 0.6)

    // Close the sheet and check that height doesn't spike
    await closeButton.click()

    // Monitor frame height during close animation
    // The fix prevents the frame from expanding to full viewport during close
    let maxHeightDuringClose = openHeight
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(100)
      const box = await frame.boundingBox()
      if (box) {
        maxHeightDuringClose = Math.max(maxHeightDuringClose, box.height)
      }
    }

    // The max height during close should not be significantly larger than when open
    // This verifies the fix for the white flash issue (expanding to full viewport)
    // Allow some tolerance for animation overshoot
    expect(maxHeightDuringClose).toBeLessThan(openHeight * 1.5)
  })
})

test.describe('Sheet.ScrollView inside snapPointsMode="fit"', () => {
  // regression test for 7b03b3fcdc:
  // ScrollView hardcoded flex:1 collapsed inside a hasFit Frame (flex:0/auto/undefined),
  // so both ScrollView and Frame measured to 0 — overlay rendered, sheet did not.

  test('short content: sheet renders with non-zero height (not collapsed)', async ({
    page,
  }) => {
    const trigger = page.getByTestId('scrollview-fit-trigger')
    const frame = page.getByTestId('scrollview-fit-frame')
    const scrollview = page.getByTestId('scrollview-fit-scrollview')
    const closeButton = page.getByTestId('scrollview-fit-close')

    await expect(trigger).toBeVisible()
    await trigger.click()

    // sheet frame must be visible with measurable height — this is the bug
    await expect(frame).toBeVisible({ timeout: 5000 })

    const frameBox = await frame.boundingBox()
    expect(frameBox).toBeTruthy()
    // before the fix, frame height was 0 (collapsed) — assert real height
    expect(frameBox!.height).toBeGreaterThan(80)

    // scrollview should be visible too
    await expect(scrollview).toBeVisible()
    const svBox = await scrollview.boundingBox()
    expect(svBox).toBeTruthy()
    expect(svBox!.height).toBeGreaterThan(40)

    // first content item visible
    await expect(page.getByTestId('scrollview-fit-item-0')).toBeVisible()

    // close
    await closeButton.click()
    await page.waitForTimeout(500)
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('short content: sheet height fits content, does NOT fill viewport', async ({
    page,
  }) => {
    const trigger = page.getByTestId('scrollview-fit-trigger')
    const frame = page.getByTestId('scrollview-fit-frame')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })

    // wait for animation to settle
    await page.waitForTimeout(400)

    const frameBox = await frame.boundingBox()
    const viewport = page.viewportSize()
    expect(frameBox).toBeTruthy()
    expect(viewport).toBeTruthy()

    // short content (~4 paragraphs + button + handle) should be well under viewport
    // before fix: frame was 0; if maxHeight cap is wrong it'd be full viewport.
    // fit mode with short content should be < 60% viewport.
    expect(frameBox!.height).toBeLessThan(viewport!.height * 0.6)
  })

  test('tall content: scrollview is capped at viewport and scrolls', async ({ page }) => {
    const trigger = page.getByTestId('scrollview-fit-tall-trigger')
    const frame = page.getByTestId('scrollview-fit-tall-frame')
    const scrollview = page.getByTestId('scrollview-fit-tall-scrollview')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)

    const scrollviewBox = await scrollview.boundingBox()
    const viewport = page.viewportSize()
    expect(scrollviewBox).toBeTruthy()
    expect(viewport).toBeTruthy()

    // the fix caps the SCROLLVIEW (not the frame) at screenSize. frame is scrollview
    // + handle + frame padding so it can be slightly larger. assert the scrollview cap.
    expect(scrollviewBox!.height).toBeLessThanOrEqual(viewport!.height + 1)
    expect(scrollviewBox!.height).toBeGreaterThan(viewport!.height * 0.5)

    // first row is visible, last row should NOT be visible without scrolling.
    await expect(page.getByTestId('scrollview-fit-tall-item-0')).toBeVisible()

    // scroll the scrollview to bottom via evaluate
    const scrolled = await scrollview.evaluate((el) => {
      const scroller = el.scrollHeight > el.clientHeight ? el : el.querySelector('*')
      // walk up/down to find a scrollable element
      let target: Element | null = el
      while (target && target.scrollHeight <= target.clientHeight) {
        target = target.firstElementChild
      }
      if (!target) return { ok: false, sh: 0, ch: 0 }
      target.scrollTop = target.scrollHeight
      return {
        ok: target.scrollTop > 0,
        sh: target.scrollHeight,
        ch: target.clientHeight,
        st: target.scrollTop,
      }
    })

    // content must be taller than viewport (scrollable)
    expect(scrolled.sh).toBeGreaterThan(scrolled.ch)
    expect(scrolled.ok).toBe(true)
  })

  test('tall content: close button dismisses sheet', async ({ page }) => {
    const trigger = page.getByTestId('scrollview-fit-tall-trigger')
    const frame = page.getByTestId('scrollview-fit-tall-frame')
    const scrollview = page.getByTestId('scrollview-fit-tall-scrollview')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)

    // scroll to bottom of the scrollview to bring the close button into view
    await scrollview.evaluate((el) => {
      const all: HTMLElement[] = [el as HTMLElement].concat(
        Array.from(el.querySelectorAll('*')) as HTMLElement[]
      )
      for (const e of all) {
        if (e.scrollHeight > e.clientHeight && e.clientHeight > 0) {
          e.scrollTop = e.scrollHeight
          return
        }
      }
    })
    await page.waitForTimeout(200)

    const closeButton = page.getByTestId('scrollview-fit-tall-close')
    await expect(closeButton).toBeVisible()
    await closeButton.click()

    await page.waitForTimeout(600)
    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('open/close cycle with ScrollView+fit does not collapse on reopen', async ({
    page,
  }) => {
    const trigger = page.getByTestId('scrollview-fit-trigger')
    const frame = page.getByTestId('scrollview-fit-frame')
    const closeButton = page.getByTestId('scrollview-fit-close')

    for (let i = 0; i < 3; i++) {
      await trigger.click()
      await expect(frame).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(300)
      const box = await frame.boundingBox()
      expect(box).toBeTruthy()
      // every reopen must have non-zero height
      expect(box!.height).toBeGreaterThan(80)
      await closeButton.click()
      await page.waitForTimeout(400)
    }
  })
})

test.describe('Sheet fit-mode through Dialog.Adapt (3pc filter-by-event style)', () => {
  // mirrors the real 3PunchConvo "filter by event" sheet: a dialog adapting to a
  // fit-mode sheet on xs, frame with absolute background layers, scrollview given an
  // explicit consumer maxHeight, moveOnKeyboardChange, content taller than screen.
  // regression: a flex:1 body collapsed the fit sheet to ~just the title height, so it
  // hung as a sliver at the bottom edge. with a content-sized body it must fill to the
  // capped height and scroll.
  test('tall dialog sheet fills to capped height and scrolls, does not collapse', async ({
    page,
  }) => {
    // xs (maxWidth 660) triggers the dialog sheet adaptation
    await page.setViewportSize({ width: 400, height: 800 })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(300)

    const trigger = page.getByTestId('repro-3pc-trigger')
    const frame = page.getByTestId('repro-3pc-frame')
    const scrollview = page.getByTestId('repro-3pc-scrollview')

    await expect(trigger).toBeVisible()
    await trigger.click()

    // the adapted sheet, not the dialog, must render. frame/scrollview only exist
    // in the Adapt branch, so their visibility confirms we got the sheet.
    await expect(frame).toBeVisible({ timeout: 5000 })
    await expect(scrollview).toBeVisible()
    // let the open spring fully settle (spring drivers take longer than css)
    await page.waitForTimeout(900)

    const svBox = await scrollview.boundingBox()
    const viewport = page.viewportSize()
    expect(svBox).toBeTruthy()
    expect(viewport).toBeTruthy()

    // regression: must not collapse to a sliver (was ~100px). fills most of the
    // viewport, capped at the consumer maxHeight (0.86 * height).
    expect(svBox!.height).toBeGreaterThan(viewport!.height * 0.6)
    expect(svBox!.height).toBeLessThanOrEqual(Math.round(viewport!.height * 0.86) + 12)

    // and it is actually shown on-screen (not hanging below / off the viewport).
    // boundingBox stays driver-agnostic; toBeInViewport tolerates sub-pixel
    // spring settling that a strict bottom-edge pixel check would flake on.
    await expect(scrollview).toBeInViewport({ ratio: 0.95 })

    await expect
      .poll(
        async () =>
          frame.evaluate((frameEl) => {
            const frameBox = frameEl.getBoundingClientRect()
            const covers = Array.from(
              document.querySelectorAll('[data-sheet-cover]')
            ).map((el) => {
              const box = el.getBoundingClientRect()
              return {
                backgroundColor: getComputedStyle(el).backgroundColor,
                height: box.height,
                topDelta: Math.abs(box.top - frameBox.bottom),
              }
            })

            return (
              covers.find(
                (candidate) =>
                  candidate.topDelta <= 2 &&
                  candidate.height >= window.innerHeight &&
                  candidate.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                  candidate.backgroundColor !== 'transparent'
              ) ?? null
            )
          }),
        { timeout: 5000 }
      )
      .toBeTruthy()

    // content is taller than the cap, so it should scroll.
    const scrolled = await scrollview.evaluate((el) => {
      let target: Element | null = el
      while (target && target.scrollHeight <= target.clientHeight) {
        target = target.firstElementChild
      }
      if (!target) return { ok: false, sh: 0, ch: 0 }
      target.scrollTop = target.scrollHeight
      return {
        ok: target.scrollTop > 0,
        sh: target.scrollHeight,
        ch: target.clientHeight,
      }
    })
    expect(scrolled.sh).toBeGreaterThan(scrolled.ch)
    expect(scrolled.ok).toBe(true)
  })
})

test.describe('Adapted Dialog Sheet', () => {
  // TODO: This test is flaky in CI - the adaptation may not trigger reliably at 500px
  // The core functionality is tested by other Sheet tests
  test.skip('dialog adapts to sheet on small screens and closes properly', async ({
    page,
  }) => {
    // Set viewport to small size to trigger adaptation
    await page.setViewportSize({ width: 500, height: 800 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('adapted-dialog-trigger')
    const sheetFrame = page.getByTestId('adapted-sheet-frame')
    const dialogContent = page.getByTestId('adapted-dialog-content')

    await expect(trigger).toBeVisible()

    // Open - should show as sheet on small viewport
    await trigger.click()
    await page.waitForTimeout(500)

    // On small viewport, should be adapted to sheet
    const isSheetVisible = await sheetFrame.isVisible()
    const isDialogVisible = await dialogContent.isVisible()

    // At least one should be visible (either adapted sheet or dialog)
    expect(isSheetVisible || isDialogVisible).toBe(true)

    // Close via close button (works in both sheet and dialog mode via Adapt.Contents)
    const closeButton = page.getByTestId('adapted-dialog-close')
    await closeButton.click()
    await page.waitForTimeout(500)

    // Should be closed - sheet frame should not be in viewport
    // Note: dialogContent may still be in DOM but the sheet frame should be off-screen
    await expect(sheetFrame).not.toBeInViewport({ ratio: 0.5 })
  })

  test('dialog shows as dialog on large screens', async ({ page }) => {
    // Set viewport to large size - no adaptation
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('adapted-dialog-trigger')
    const dialogContent = page.getByTestId('adapted-dialog-content')
    const closeButton = page.getByTestId('adapted-dialog-close')

    await expect(trigger).toBeVisible()

    // Open - should show as dialog on large viewport
    await trigger.click()
    await page.waitForTimeout(500)

    // Dialog content should be visible
    await expect(dialogContent).toBeVisible()

    // Close
    await closeButton.click()
    await page.waitForTimeout(500)

    // Should be closed
    await expect(dialogContent).not.toBeVisible()
  })
})
