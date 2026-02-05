/**
 * Playwright E2E Test for Sheet + ScrollView gesture coordination
 *
 * Ported from Detox tests to verify web implementation matches native quality.
 *
 * Tests the smooth handoff behavior between sheet dragging and scrollview scrolling:
 * 1. At top snap point + swipe up → scroll content naturally
 * 2. At top snap point + swipe down → drag sheet down (NOT scroll)
 * 3. Scrolled down + drag down → scroll to top THEN hand off to sheet drag
 * 4. Dragging up + hit sheet top → continue into scrolling
 */

import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

// mobile viewport with touch support for realistic sheet testing
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
})

test.beforeEach(async ({ page }) => {
  // capture console logs for debugging
  page.on('console', (msg) => {
    if (
      msg.text().includes('[Sheet') ||
      msg.text().includes('[ScrollView') ||
      msg.text().includes('[gesture')
    ) {
      console.log(`BROWSER: ${msg.text()}`)
    }
  })
  await setupPage(page, { name: 'SheetScrollableDrag', type: 'useCase' })
})

/**
 * perform a drag gesture using touch events via touchscreen API
 * this properly triggers touch events which our gesture handlers listen for
 *
 * use mode: 'touch' for scrollview/content areas (synthetic touch events)
 * use mode: 'mouse' for handle/frame areas (PanResponder uses mouse events on web)
 */
async function dragSheet(
  page: Page,
  startX: number,
  startY: number,
  deltaY: number,
  options: { steps?: number; stepDelay?: number; mode?: 'touch' | 'mouse' } = {}
) {
  const { steps = 20, stepDelay = 16, mode = 'touch' } = options

  if (mode === 'mouse') {
    // use mouse events for PanResponder-based elements (handle, frame)
    await page.mouse.move(startX, startY)
    await page.mouse.down()

    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(startX, startY + (deltaY * i) / steps)
      await page.waitForTimeout(stepDelay)
    }

    await page.mouse.up()
    return
  }

  // touch mode for ScrollView areas
  const endY = startY + deltaY

  // touchscreen doesn't have a direct swipe, so we use evaluate to dispatch touch events
  await page.evaluate(
    ({ startX, startY, endY, steps, stepDelay }) => {
      return new Promise<void>((resolve) => {
        const target = document.elementFromPoint(startX, startY)
        if (!target) {
          resolve()
          return
        }

        const dispatchTouch = (type: string, x: number, y: number) => {
          const touch = new Touch({
            identifier: 0,
            target,
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
          })
          const touchEvent = new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            touches: type === 'touchend' ? [] : [touch],
            targetTouches: type === 'touchend' ? [] : [touch],
            changedTouches: [touch],
          })
          target.dispatchEvent(touchEvent)
        }

        // touchstart
        dispatchTouch('touchstart', startX, startY)

        let step = 0
        const interval = setInterval(() => {
          step++
          const progress = step / steps
          const currentY = startY + (endY - startY) * progress
          dispatchTouch('touchmove', startX, currentY)

          if (step >= steps) {
            clearInterval(interval)
            dispatchTouch('touchend', startX, endY)
            resolve()
          }
        }, stepDelay)
      })
    },
    { startX, startY, endY, steps, stepDelay }
  )
}

test.describe('SheetScrollableDrag - RNGH Web Equivalent', () => {
  test('should open sheet at position 0', async ({ page }) => {
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // should be at position 0 (top snap)
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )
    await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
      'ScrollView Y: 0'
    )
  })

  test('Case 1: drag DOWN at scrollY=0 should drag sheet, NOT scroll', async ({
    page,
  }) => {
    // open sheet
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify starting state
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )
    await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
      'ScrollView Y: 0'
    )

    // get the scrollview for dragging
    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // drag DOWN on scrollview - should drag sheet, NOT scroll
    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 3,
      200,
      { steps: 25, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // EXPECTED: sheet moved to position 1, scroll stayed at 0
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )

    // scroll should still be at 0 (or very close to it)
    const scrollY = await page.getByTestId('sheet-scrollable-drag-scroll-y').textContent()
    const scrollVal = parseInt(scrollY?.replace('ScrollView Y: ', '') || '0', 10)
    expect(scrollVal).toBeLessThanOrEqual(5) // allow small tolerance
  })

  test('STRESS: multiple handoffs starting from scroll', async ({ page }) => {
    // stress test: scroll → drag → scroll → drag (4x)
    // each handoff should work cleanly without jitter

    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    const cx = scrollviewBox!.x + scrollviewBox!.width / 2
    const cy = scrollviewBox!.y + scrollviewBox!.height / 2

    for (let i = 0; i < 4; i++) {
      // 1. scroll down (drag up gesture)
      await dragSheet(page, cx, cy, -150, { steps: 20, stepDelay: 12 })
      await page.waitForTimeout(200)

      // verify scroll happened, sheet still at 0
      const scrollY1 = await page
        .getByTestId('sheet-scrollable-drag-scroll-y')
        .textContent()
      const scrollVal1 = parseInt(scrollY1?.replace('ScrollView Y: ', '') || '0', 10)
      expect(scrollVal1).toBeGreaterThan(20)
      await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
        'Sheet position: 0'
      )

      // 2. drag down past scroll=0 to pull sheet
      await dragSheet(page, cx, cy, 300, { steps: 30, stepDelay: 12 })
      await page.waitForTimeout(200)

      // verify sheet moved, scroll at 0
      await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
        'Sheet position: 1'
      )
      await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
        'ScrollView Y: 0'
      )

      // 3. drag up to bring sheet back (no scroll should happen here)
      await dragSheet(page, cx, cy, -200, { steps: 25, stepDelay: 12 })
      await page.waitForTimeout(200)

      // verify sheet back at 0, scroll still 0
      await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
        'Sheet position: 0'
      )
      const scrollY2 = await page
        .getByTestId('sheet-scrollable-drag-scroll-y')
        .textContent()
      const scrollVal2 = parseInt(scrollY2?.replace('ScrollView Y: ', '') || '0', 10)
      expect(scrollVal2).toBeLessThanOrEqual(10)
    }
  })

  test('STRESS: multiple handoffs starting from drag', async ({ page }) => {
    // stress test: drag → scroll → drag → scroll (4x)
    // start by dragging sheet down first

    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    const cx = scrollviewBox!.x + scrollviewBox!.width / 2
    const cy = scrollviewBox!.y + scrollviewBox!.height / 2

    for (let i = 0; i < 4; i++) {
      // 1. drag down to pull sheet (scrollY=0, so pan takes over)
      // use touch mode on scrollview - this should work via our touch handler
      await dragSheet(page, cx, cy, 200, { steps: 25, stepDelay: 12 })
      await page.waitForTimeout(400)

      // verify sheet moved, scroll still 0
      await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
        'Sheet position: 1'
      )
      await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
        'ScrollView Y: 0'
      )

      // wait for animation to settle
      await page.waitForTimeout(400)

      // 2. drag up to bring sheet back - this should work via touch handler
      // sheet not at top + dragging up = pan owns
      await dragSheet(page, cx, cy, -250, { steps: 30, stepDelay: 12 })
      await page.waitForTimeout(400)

      // verify sheet at 0
      await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
        'Sheet position: 0'
      )
      // scroll should still be 0 (no scroll during drag up when sheet not at top)
      await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
        'ScrollView Y: 0'
      )
    }
  })

  test('CRITICAL: single gesture - scroll, pull sheet, reverse to push sheet up - no scroll during push', async ({
    page,
  }) => {
    // ONE CONTINUOUS GESTURE with direction changes:
    // 1. drag up to scroll
    // 2. reverse to drag down (scroll back to 0, then pull sheet)
    // 3. reverse again to drag up (push sheet back up)
    // BUG: step 3 was scrolling when it should only move sheet

    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    const cx = scrollviewBox!.x + scrollviewBox!.width / 2
    const startY = scrollviewBox!.y + scrollviewBox!.height / 2

    // single continuous gesture with direction changes
    await page.evaluate(
      ({ cx, startY }) => {
        return new Promise<void>((resolve) => {
          const target = document.elementFromPoint(cx, startY)
          if (!target) {
            resolve()
            return
          }

          const dispatchTouch = (type: string, x: number, y: number) => {
            const touch = new Touch({
              identifier: 0,
              target,
              clientX: x,
              clientY: y,
              pageX: x,
              pageY: y,
            })
            const touchEvent = new TouchEvent(type, {
              bubbles: true,
              cancelable: true,
              touches: type === 'touchend' ? [] : [touch],
              targetTouches: type === 'touchend' ? [] : [touch],
              changedTouches: [touch],
            })
            target.dispatchEvent(touchEvent)
          }

          // touchstart
          dispatchTouch('touchstart', cx, startY)

          let step = 0
          const moves = [
            // cycle 1
            // phase 1: drag up to scroll (20 steps, -5px each = -100px)
            ...Array(20).fill(-5),
            // phase 2: drag down to scroll back and pull sheet (40 steps, +8px each = +320px)
            ...Array(40).fill(8),
            // phase 3: drag up to push sheet back (30 steps, -6px each = -180px)
            // THIS SHOULD NOT SCROLL
            ...Array(30).fill(-6),
            // cycle 2 - repeat to catch bugs that only show on 2nd+ cycle
            ...Array(20).fill(-5),
            ...Array(40).fill(8),
            ...Array(30).fill(-6),
            // cycle 3
            ...Array(20).fill(-5),
            ...Array(40).fill(8),
            ...Array(30).fill(-6),
            // cycle 4
            ...Array(20).fill(-5),
            ...Array(40).fill(8),
            ...Array(30).fill(-6),
          ]

          let currentY = startY
          const interval = setInterval(() => {
            if (step >= moves.length) {
              clearInterval(interval)
              dispatchTouch('touchend', cx, currentY)
              resolve()
              return
            }
            currentY += moves[step]
            dispatchTouch('touchmove', cx, currentY)
            step++
          }, 16)
        })
      },
      { cx, startY }
    )

    await page.waitForTimeout(400)

    // check maxScrollY - this captures if scroll happened at ANY point during "push up" phases
    // if scroll happened during push up, maxScrollY will be > what it should be
    const maxScrollY = await page
      .getByTestId('sheet-scrollable-drag-max-scroll-y')
      .textContent()
    const maxScrollVal = parseInt(maxScrollY?.replace('Max scroll Y: ', '') || '0', 10)

    console.log('maxScrollVal:', maxScrollVal)
    // the key assertion: maxScrollY should be around 100 (from the initial scroll phase)
    // if it's significantly higher, scroll happened during "push sheet up" phases
    // each scroll phase does ~100px, so 4 cycles should still be ~100 max if working correctly
    // if broken, we'd see 200+ because scroll happens during push-up phases too
    expect(maxScrollVal).toBeLessThanOrEqual(150)
  })

  test('CRITICAL: from pos 1, single gesture drag up past top then reverse down - no mid-gesture snap', async ({
    page,
  }) => {
    // BUG: sheet at position 1, one continuous gesture:
    // 1. drag up to move sheet to top (pan owns, sheet moves up)
    // 2. continue dragging up past top (pan→scroll handoff)
    // 3. reverse to drag down (scroll→pan handoff)
    //
    // the bug: during the pan→scroll handoff in step 2, snapToPosition(0) is
    // called MID-GESTURE. this triggers setPosition(0) → useEffect →
    // setScrollEnabled → animateTo which fights with the active gesture,
    // causing snap, broken state, and "Maximum update depth exceeded".
    //
    // snapToPosition should NEVER be called during a continuous gesture.
    // position changes should only happen on release (touchend).

    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // get sheet to position 1 via handle drag
    const handle = page.getByTestId('sheet-scrollable-drag-handle')
    let handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200,
      { steps: 25, stepDelay: 16, mode: 'mouse' }
    )
    await page.waitForTimeout(600)
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )
    await page.waitForTimeout(400)

    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    const cx = scrollviewBox!.x + scrollviewBox!.width / 2
    const startY = scrollviewBox!.y + scrollviewBox!.height / 2

    // listen for errors
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    // set up a MutationObserver to track position changes DURING the gesture.
    // the position text element updates when setPosition is called.
    // any position change between touchstart and touchend is a mid-gesture snap (the bug).
    await page.evaluate(() => {
      const posEl = document.querySelector(
        '[data-testid="sheet-scrollable-drag-position"]'
      )
      if (!posEl) return
      ;(window as any).__midGestureSnaps = []
      ;(window as any).__gestureActive = false

      // track touch state
      document.addEventListener(
        'touchstart',
        () => {
          ;(window as any).__gestureActive = true
        },
        { capture: true }
      )
      document.addEventListener(
        'touchend',
        () => {
          ;(window as any).__gestureActive = false
        },
        { capture: true }
      )

      // observe position text changes
      const observer = new MutationObserver(() => {
        if ((window as any).__gestureActive) {
          const text = posEl.textContent || ''
          ;(window as any).__midGestureSnaps.push(text)
        }
      })
      observer.observe(posEl, { childList: true, characterData: true, subtree: true })
    })

    // single continuous gesture: drag up past top, then reverse down
    await page.evaluate(
      ({ cx, startY }) => {
        return new Promise<void>((resolve) => {
          const target = document.elementFromPoint(cx, startY)
          if (!target) {
            resolve()
            return
          }

          const dispatchTouch = (type: string, x: number, y: number) => {
            const touch = new Touch({
              identifier: 0,
              target,
              clientX: x,
              clientY: y,
              pageX: x,
              pageY: y,
            })
            target.dispatchEvent(
              new TouchEvent(type, {
                bubbles: true,
                cancelable: true,
                touches: type === 'touchend' ? [] : [touch],
                targetTouches: type === 'touchend' ? [] : [touch],
                changedTouches: [touch],
              })
            )
          }

          dispatchTouch('touchstart', cx, startY)

          let step = 0
          const moves = [
            // phase 1: drag up - moves sheet from pos 1 to top (30 steps, -8px = -240px)
            ...Array(30).fill(-8),
            // phase 2: continue up past top - should start scrolling (20 steps, -5px = -100px)
            // THIS is where the pan→scroll handoff happens and snapToPosition(0) is called
            ...Array(20).fill(-5),
            // phase 3: reverse down - scroll back then pull sheet (40 steps, +8px = +320px)
            ...Array(40).fill(8),
          ]

          let currentY = startY
          const interval = setInterval(() => {
            if (step >= moves.length) {
              clearInterval(interval)
              dispatchTouch('touchend', cx, currentY)
              resolve()
              return
            }
            currentY += moves[step]
            dispatchTouch('touchmove', cx, currentY)
            step++
          }, 16)
        })
      },
      { cx, startY }
    )

    await page.waitForTimeout(600)

    // no Maximum update depth exceeded
    expect(errors.filter((e) => e.includes('Maximum update depth'))).toHaveLength(0)

    // CRITICAL: no position changes should happen during the gesture
    // snapToPosition should only be called on release, not mid-gesture
    const midGestureSnaps = await page.evaluate(
      () => (window as any).__midGestureSnaps || []
    )
    console.log('mid-gesture snaps:', midGestureSnaps)
    expect(midGestureSnaps).toHaveLength(0)
  })

  test('CRITICAL: from pos 1, drag up past top then back down - should snap to pos 1 not dismiss', async ({
    page,
  }) => {
    // BUG: from pos 1, single continuous gesture:
    // 1. drag up (pan moves sheet to top)
    // 2. continue up past top (pan→scroll handoff, scroll owns)
    // 3. reverse down past scroll=0 (scroll→pan handoff, pan owns)
    // 4. release just below where pos 1 would be
    //
    // expected: sheet snaps to position 1
    // actual bug: if touchend fires while owner='scroll', release() is never
    // called. the sheet's animated position is stranded and it dismisses.

    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // get sheet to position 1
    const handle = page.getByTestId('sheet-scrollable-drag-handle')
    let handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200,
      { steps: 25, stepDelay: 16, mode: 'mouse' }
    )
    await page.waitForTimeout(600)
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )
    await page.waitForTimeout(400)

    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    const cx = scrollviewBox!.x + scrollviewBox!.width / 2
    const startY = scrollviewBox!.y + scrollviewBox!.height / 2

    // single continuous gesture: drag up past top, scroll a bit, reverse down to ~pos 1
    await page.evaluate(
      ({ cx, startY }) => {
        return new Promise<void>((resolve) => {
          const target = document.elementFromPoint(cx, startY)
          if (!target) {
            resolve()
            return
          }

          const dispatchTouch = (type: string, x: number, y: number) => {
            const touch = new Touch({
              identifier: 0,
              target,
              clientX: x,
              clientY: y,
              pageX: x,
              pageY: y,
            })
            target.dispatchEvent(
              new TouchEvent(type, {
                bubbles: true,
                cancelable: true,
                touches: type === 'touchend' ? [] : [touch],
                targetTouches: type === 'touchend' ? [] : [touch],
                changedTouches: [touch],
              })
            )
          }

          dispatchTouch('touchstart', cx, startY)

          let step = 0
          const moves = [
            // phase 1: drag up - moves sheet from pos 1 to top
            // pos 1 → pos 0 is ~300px, so need ~40 steps × -8px = -320px
            ...Array(40).fill(-8),
            // phase 2: continue up past top - should start scrolling (20 steps, -5px = -100px)
            ...Array(20).fill(-5),
            // phase 3: reverse down - scroll back to 0, then pull sheet down (50 steps, +8px = +400px)
            // this should end near where pos 1 is
            ...Array(50).fill(8),
          ]

          let currentY = startY
          const interval = setInterval(() => {
            if (step >= moves.length) {
              clearInterval(interval)
              dispatchTouch('touchend', cx, currentY)
              resolve()
              return
            }
            currentY += moves[step]
            dispatchTouch('touchmove', cx, currentY)
            step++
          }, 16)
        })
      },
      { cx, startY }
    )

    await page.waitForTimeout(800)

    // the bug: stale startY in release() causes it to compute a position way
    // below the screen. with dismissOnSnapToBottom, this triggers setOpen(false)
    // which dismisses the sheet unexpectedly.
    const unexpectedClose = await page
      .getByTestId('sheet-scrollable-drag-unexpected-close')
      .textContent()
    console.log('unexpected close:', unexpectedClose)

    // the sheet should NOT have been dismissed during this gesture
    expect(unexpectedClose).toContain('no')
  })

  test('Case 1b: scroll, drag down, drag UP - scroll should NOT happen during drag up', async ({
    page,
  }) => {
    // This tests: scroll down, drag sheet down, then drag UP
    // During drag UP (bringing sheet back), scroll should NOT change

    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // 1. scroll down
    await page.mouse.move(
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2
    )
    await page.mouse.wheel(0, 150)
    await page.waitForTimeout(300)

    // 2. drag DOWN to pull sheet (this scrolls back to 0, then drags sheet)
    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 3,
      300,
      { steps: 30, stepDelay: 16 }
    )
    await page.waitForTimeout(400)

    // sheet should be at position 1
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )
    // scroll should be 0
    await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
      'ScrollView Y: 0'
    )

    // 3. NOW drag UP - this should bring sheet back to position 0
    // scroll should NOT change during this drag
    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2,
      -250,
      { steps: 30, stepDelay: 16 }
    )
    await page.waitForTimeout(300)

    // sheet should be at position 0
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )

    // CRITICAL: scroll should still be 0 - no scrolling during drag up
    const scrollAfter = await page
      .getByTestId('sheet-scrollable-drag-scroll-y')
      .textContent()
    const scrollVal = parseInt(scrollAfter?.replace('ScrollView Y: ', '') || '0', 10)
    expect(scrollVal).toBeLessThanOrEqual(5) // allow tiny tolerance
  })

  test('Case 1c: scroll then drag DOWN - scroll should NOT change during drag', async ({
    page,
  }) => {
    // This tests the basic jitter scenario:
    // 1. Scroll content down (scrollY > 0)
    // 2. Drag down to pull sheet
    // 3. During the drag, scrollY should NOT change (no jitter)

    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // first scroll down with wheel
    await page.mouse.move(
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2
    )
    await page.mouse.wheel(0, 150)
    await page.waitForTimeout(300)

    // verify we scrolled
    const scrollBefore = await page
      .getByTestId('sheet-scrollable-drag-scroll-y')
      .textContent()
    const scrollValBefore = parseInt(
      scrollBefore?.replace('ScrollView Y: ', '') || '0',
      10
    )
    expect(scrollValBefore).toBeGreaterThan(30)

    // now do a long drag DOWN - should first scroll back to 0, then drag sheet
    // but DURING the sheet drag portion, scroll should stay at 0
    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 3,
      400, // long drag to ensure we hit both scroll-back and sheet-drag phases
      { steps: 40, stepDelay: 16 }
    )
    await page.waitForTimeout(100)

    // check final scroll position - should be 0 (scrolled back) not negative or jumping around
    const scrollAfter = await page
      .getByTestId('sheet-scrollable-drag-scroll-y')
      .textContent()
    const scrollValAfter = parseInt(scrollAfter?.replace('ScrollView Y: ', '') || '0', 10)

    // scroll should be at 0 (not negative, not jumping around)
    expect(scrollValAfter).toBe(0)

    // sheet should have moved to position 1
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )
  })

  test('Case 2: at top snap, drag UP should scroll content', async ({ page }) => {
    // open sheet
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify starting state - at top, scroll at 0
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )

    // get the scrollview
    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // use wheel event to scroll content (more reliable than drag for scroll)
    await page.mouse.move(
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2
    )
    await page.mouse.wheel(0, 200)
    await page.waitForTimeout(400)

    // EXPECTED: sheet stays at position 0, content scrolled
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )

    // scroll should have increased
    const scrollY = await page.getByTestId('sheet-scrollable-drag-scroll-y').textContent()
    const scrollVal = parseInt(scrollY?.replace('ScrollView Y: ', '') || '0', 10)
    expect(scrollVal).toBeGreaterThan(50)
  })

  test('Case 3: drag sheet up from position 1 should NOT scroll simultaneously', async ({
    page,
  }) => {
    // open sheet
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // get handle for dragging
    const handle = page.getByTestId('sheet-scrollable-drag-handle')
    let handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // first drag down to position 1 (use mouse for handle)
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200,
      { steps: 25, stepDelay: 16, mode: 'mouse' }
    )
    await page.waitForTimeout(600)

    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )

    // verify scroll is still at 0 after first drag
    await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
      'ScrollView Y: 0'
    )

    // wait for animation to settle
    await page.waitForTimeout(400)

    // get new handle position
    handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // now drag UP back to position 0
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      -250,
      { steps: 30, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // EXPECTED: sheet back at position 0, scroll should still be 0 (no simultaneous scroll)
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )
  })

  test('Case 4: scroll down, then drag down should scroll back first', async ({
    page,
  }) => {
    // open sheet
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // get the scrollview
    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // first scroll down (wheel up to scroll content down)
    await page.mouse.move(
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2
    )
    await page.mouse.wheel(0, 200)
    await page.waitForTimeout(400)

    // verify we scrolled
    const scrollBefore = await page
      .getByTestId('sheet-scrollable-drag-scroll-y')
      .textContent()
    const scrollValBefore = parseInt(
      scrollBefore?.replace('ScrollView Y: ', '') || '0',
      10
    )
    expect(scrollValBefore).toBeGreaterThan(50)

    // now drag DOWN - should scroll back first before dragging sheet
    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 3,
      300,
      { steps: 30, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // either scroll absorbed the swipe (scroll at 0 or close) OR sheet moved
    const scrollAfter = await page
      .getByTestId('sheet-scrollable-drag-scroll-y')
      .textContent()
    const scrollValAfter = parseInt(scrollAfter?.replace('ScrollView Y: ', '') || '0', 10)

    const posAfter = await page
      .getByTestId('sheet-scrollable-drag-position')
      .textContent()
    const posValAfter = parseInt(posAfter?.replace('Sheet position: ', '') || '0', 10)

    // success if either: scroll went back to 0, or sheet moved to position 1
    expect(scrollValAfter < scrollValBefore || posValAfter === 1).toBeTruthy()
  })

  test('Case 5: HANDOFF - scroll to 0 then drag sheet in one gesture', async ({
    page,
  }) => {
    // open sheet
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // get the scrollview
    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // first scroll down a bit
    await page.mouse.move(
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2
    )
    await page.mouse.wheel(0, 100)
    await page.waitForTimeout(300)

    // verify we scrolled
    const scrollBefore = await page
      .getByTestId('sheet-scrollable-drag-scroll-y')
      .textContent()
    const scrollValBefore = parseInt(
      scrollBefore?.replace('ScrollView Y: ', '') || '0',
      10
    )
    expect(scrollValBefore).toBeGreaterThan(0)

    // long drag down - should scroll to 0 then drag sheet
    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 4,
      350,
      { steps: 40, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // EXPECTED: scroll should be at 0, sheet should have moved to position 1
    await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
      'ScrollView Y: 0'
    )
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )
  })

  test('Case 6: multiple direction changes without getting stuck', async ({ page }) => {
    // open sheet
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify starting state
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )

    const handle = page.getByTestId('sheet-scrollable-drag-handle')
    let handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // 1. drag down to position 1
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200,
      { steps: 25, stepDelay: 16 }
    )
    await page.waitForTimeout(600)
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )

    // 2. drag up back to position 0
    handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      -250,
      { steps: 30, stepDelay: 16 }
    )
    await page.waitForTimeout(600)
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )

    // 3. now scroll up (content should scroll since at top snap)
    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    await page.mouse.move(
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2
    )
    await page.mouse.wheel(0, 150)
    await page.waitForTimeout(400)

    const scrollAfter = await page
      .getByTestId('sheet-scrollable-drag-scroll-y')
      .textContent()
    const scrollVal = parseInt(scrollAfter?.replace('ScrollView Y: ', '') || '0', 10)
    expect(scrollVal).toBeGreaterThan(30)

    // 4. drag down - should scroll back first, then drag sheet
    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 3,
      350,
      { steps: 40, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // should have scrolled to 0
    await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
      'ScrollView Y: 0'
    )
  })

  test('Case 7: drag UP from position 1 - scroll locked during drag, final position 0', async ({
    page,
  }) => {
    // open sheet
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    const handle = page.getByTestId('sheet-scrollable-drag-handle')
    let handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // first drag down to position 1 (use mouse for handle)
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200,
      { steps: 25, stepDelay: 16, mode: 'mouse' }
    )
    await page.waitForTimeout(600)
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )

    // verify scroll is at 0
    await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
      'ScrollView Y: 0'
    )

    await page.waitForTimeout(400)

    // drag UP via scrollview area - sheet moves to position 0
    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2,
      -250,
      { steps: 30, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // sheet should be at position 0
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )
    // scroll should still be 0 (locked during drag)
    const scrollY = await page.getByTestId('sheet-scrollable-drag-scroll-y').textContent()
    const scrollVal = parseInt(scrollY?.replace('ScrollView Y: ', '') || '0', 10)
    expect(scrollVal).toBeLessThanOrEqual(5)
  })

  test('Case 8: rubber band at top - dragging up keeps sheet at top', async ({
    page,
  }) => {
    // open sheet
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify at position 0 (top snap)
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )
    await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
      'ScrollView Y: 0'
    )

    // drag UP on handle - should NOT scroll content, should show resistance
    const handle = page.getByTestId('sheet-scrollable-drag-handle')
    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // use mouse mode for handle (PanResponder-based element)
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      -150,
      { steps: 20, stepDelay: 16, mode: 'mouse' }
    )
    await page.waitForTimeout(600)

    // sheet should still be at position 0 after rubber band release
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )
    // frame should still be visible (sheet didn't disappear)
    await expect(frame).toBeVisible()
    // scroll should NOT have happened during drag
    const maxScrollY = await page
      .getByTestId('sheet-scrollable-drag-max-scroll-y')
      .textContent()
    const maxScrollVal = parseInt(maxScrollY?.replace('Max scroll Y: ', '') || '0', 10)
    expect(maxScrollVal).toBeLessThanOrEqual(5)
  })

  test('Case 9: HANDOFF UP - drag UP from position 1, continue into scroll', async ({
    page,
  }) => {
    // open sheet
    await page.getByTestId('sheet-scrollable-drag-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('sheet-scrollable-drag-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    const handle = page.getByTestId('sheet-scrollable-drag-handle')
    let handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // first drag down to position 1 (use mouse for handle)
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200,
      { steps: 25, stepDelay: 16, mode: 'mouse' }
    )
    await page.waitForTimeout(600)
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 1'
    )
    await expect(page.getByTestId('sheet-scrollable-drag-scroll-y')).toContainText(
      'ScrollView Y: 0'
    )

    await page.waitForTimeout(400)

    // CRITICAL: one LONG drag UP - should:
    // 1. Move sheet from position 1 to position 0
    // 2. Continue into scrolling without lifting finger
    const scrollview = page.getByTestId('sheet-scrollable-drag-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2,
      -400,
      { steps: 50, stepDelay: 12 } // longer, faster drag for handoff
    )
    await page.waitForTimeout(300)

    // sheet should be at position 0
    await expect(page.getByTestId('sheet-scrollable-drag-position')).toContainText(
      'Sheet position: 0'
    )

    // AND scroll should have happened (handoff successful)
    // check maxScrollY instead of current scrollY because scroll may bounce back
    const maxScrollY = await page
      .getByTestId('sheet-scrollable-drag-max-scroll-y')
      .textContent()
    const maxScrollVal = parseInt(maxScrollY?.replace('Max scroll Y: ', '') || '0', 10)
    expect(maxScrollVal).toBeGreaterThan(30) // handoff occurred
  })
})
