import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Regression tests for Sheet on mobile web with the soft keyboard.
 *
 * These run under the `webkit-sheet` project (Safari engine + touch) because
 * iOS Safari's touch/scroll/rubber-band/viewport behavior differs from chromium.
 *
 * Bugs covered:
 *  1. Keyboard avoidance: a fit-mode sheet sized off useWindowDimensions shrank
 *     when the keyboard opened (window.visualViewport — which RNW Dimensions
 *     tracks — shrinks by the keyboard height). The correct behavior: the sheet
 *     is always full device height, slid down via translate to its resting
 *     position; when the keyboard opens the WHOLE frame translates UP by the
 *     keyboard height (capped so its top never crosses the top safe area), so
 *     its content clears the keyboard. It keeps its height — it does not resize,
 *     collapse, or stay anchored. (the frame-height teleport / "goes back down".)
 *  2. Drag double-drive: on web the PanResponder and the scroll-view touch hook
 *     both drove the animated position, so a pull-down jittered/jumped. With one
 *     owner the pull-down follows the finger monotonically.
 *  3. A small scroll must not snap the sheet down when the keyboard is open.
 *
 * The keyboard is simulated by shrinking visualViewport.height and dispatching
 * one 'resize' — exactly the event a real iOS keyboard fires (a single step, not
 * a ramp), which is what exposes the height teleport.
 */

const KB_HEIGHT = 320

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

async function simulateKeyboard(page: import('@playwright/test').Page, kb: number) {
  await page.evaluate((kbHeight) => {
    const vv = window.visualViewport!
    const base = window.innerHeight
    Object.defineProperty(vv, 'height', {
      configurable: true,
      get: () => base - kbHeight,
    })
    Object.defineProperty(vv, 'offsetTop', { configurable: true, get: () => 0 })
    vv.dispatchEvent(new Event('resize'))
  }, kb)
}

async function rect(page: import('@playwright/test').Page, testID: string) {
  return page.evaluate((t) => {
    const e = document.querySelector(`[data-testid="${t}"]`)
    if (!e) return null
    const r = e.getBoundingClientRect()
    return {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      height: Math.round(r.height),
    }
  }, testID)
}

async function openSheet(
  page: import('@playwright/test').Page,
  opts: { kb?: string } = {}
) {
  await setupPage(page, {
    name: 'SheetWebKeyboardCase',
    type: 'useCase',
    searchParams: { animationDriver: 'css', ...(opts.kb ? { kb: opts.kb } : {}) },
  })
  await page.getByTestId('sheet-web-kb-open').click()
  await expect(page.getByTestId('sheet-web-kb-frame')).toBeVisible({ timeout: 5000 })
  // wait for the open animation to fully settle (slide-up spring) before any
  // baseline measurement, else `before` is captured mid-animation
  await page.waitForTimeout(1500)
}

test.describe('Sheet web keyboard avoidance', () => {
  test('keyboard open LIFTS the whole sheet up by the keyboard height (capped at the safe area), keeping its height', async ({
    page,
  }) => {
    await openSheet(page)

    const before = await rect(page, 'sheet-web-kb-frame')
    expect(before).toBeTruthy()

    await page.getByTestId('sheet-web-kb-body').click()
    await simulateKeyboard(page, KB_HEIGHT)
    await page.waitForTimeout(700)

    const after = await rect(page, 'sheet-web-kb-frame')
    expect(after).toBeTruthy()

    // the WHOLE frame translates UP so its content clears the keyboard — it does
    // NOT stay anchored and it does NOT resize. the shift is the keyboard height,
    // capped so the frame top never crosses the safe-area top (~0 in the test).
    // before the fix it either stayed put (occluded) or collapsed/flew off-frame.
    const shift = before!.bottom - after!.bottom
    const expectedShift = Math.min(KB_HEIGHT, before!.top) // capped at safe-area top
    expect(Math.abs(shift - expectedShift)).toBeLessThan(12)
    // height is preserved (no resize/collapse)
    expect(Math.abs(after!.height - before!.height)).toBeLessThan(8)
    // capped: the top never goes above the safe area
    expect(after!.top).toBeGreaterThanOrEqual(-4)
  })

  test('a tall sheet whose lift is capped can scroll its lower content above the keyboard', async ({
    page,
  }) => {
    await openSheet(page)
    await page.getByTestId('sheet-web-kb-body').click()
    await simulateKeyboard(page, KB_HEIGHT)
    await page.waitForTimeout(700)

    // this fixture's sheet is taller than the visible band, so once it has lifted
    // as far as the safe-area cap allows, its lowest content still sits behind the
    // keyboard. the keyboardOccludedHeight spacer (= exactly that occluded amount)
    // makes the content scrollable so the footer can reach above the keyboard.
    const canScroll = await page.evaluate(() => {
      const n = document.querySelector(
        '[data-testid="sheet-web-kb-scrollview"]'
      ) as HTMLElement
      return n ? n.scrollHeight - n.clientHeight : 0
    })
    expect(canScroll).toBeGreaterThan(40)
  })

  test('keyboard close keeps the sheet anchored (no teleport)', async ({ page }) => {
    await openSheet(page)
    const closed = await rect(page, 'sheet-web-kb-frame')

    await page.getByTestId('sheet-web-kb-body').click()
    await simulateKeyboard(page, KB_HEIGHT)
    await page.waitForTimeout(700)

    // close the keyboard: restore viewport + blur
    await page.evaluate(() => {
      const vv = window.visualViewport!
      const base = window.innerHeight
      Object.defineProperty(vv, 'height', { configurable: true, get: () => base })
      ;(document.activeElement as HTMLElement | null)?.blur?.()
      vv.dispatchEvent(new Event('resize'))
    })
    await page.waitForTimeout(700)

    const reopened = await rect(page, 'sheet-web-kb-frame')
    // back exactly where it started — it never moved or resized
    expect(Math.abs(reopened!.bottom - closed!.bottom)).toBeLessThan(8)
    expect(Math.abs(reopened!.height - closed!.height)).toBeLessThan(8)
  })

  test('moveOnKeyboardChange OFF: reproduces the bug — sheet shrinks instead of moving up', async ({
    page,
  }) => {
    await openSheet(page, { kb: '0' })
    const before = await rect(page, 'sheet-web-kb-frame')

    await page.getByTestId('sheet-web-kb-body').click()
    await simulateKeyboard(page, KB_HEIGHT)
    await page.waitForTimeout(700)

    const after = await rect(page, 'sheet-web-kb-frame')
    // with the hook disabled, the consumer maxHeight (useWindowDimensions * 0.7)
    // shrinks with the viewport and nothing freezes it, so the frame collapses —
    // the exact bug the ON path fixes by preserving height + moving up.
    expect(after!.height).toBeLessThan(before!.height - 100)
  })
})

// touch drag that works in BOTH engines. WebKit can't `new Touch(...)` (Illegal
// constructor) and its TouchEvent ctor rejects plain Touch[] (Type error) — it
// needs real TouchList objects from createTouchList. chromium has neither legacy
// API, so use new Touch + arrays there. records the frame's bottom edge each
// step so the trajectory can be asserted.
async function touchDragSampling(
  page: import('@playwright/test').Page,
  testID: string,
  frameTestID: string,
  deltaY: number,
  steps = 14
): Promise<number[]> {
  return page.evaluate(
    ({ t, frameT, dy, steps }) => {
      return new Promise<number[]>((resolve) => {
        const wrap = document.querySelector(`[data-testid="${t}"]`) as HTMLElement
        const frame = document.querySelector(`[data-testid="${frameT}"]`) as HTMLElement
        const r = wrap.getBoundingClientRect()
        const x = Math.round(r.left + r.width / 2)
        const startY = Math.round(r.top + r.height / 2)
        const samples: number[] = []
        const hasLegacy = typeof (document as any).createTouchList === 'function'
        const makeTouch = (tgt: EventTarget, y: number): Touch =>
          typeof (document as any).createTouch === 'function'
            ? (document as any).createTouch(window, tgt, 0, x, y, x, y)
            : new Touch({
                identifier: 0,
                target: tgt as any,
                clientX: x,
                clientY: y,
                pageX: x,
                pageY: y,
              })
        const list = (touches: Touch[]): any =>
          hasLegacy ? (document as any).createTouchList(...touches) : touches
        const fire = (type: string, y: number) => {
          const tgt = (document.elementFromPoint(x, y) as HTMLElement) || wrap
          const touch = makeTouch(tgt, y)
          const empty = type === 'touchend'
          tgt.dispatchEvent(
            new TouchEvent(type, {
              bubbles: true,
              cancelable: true,
              touches: empty ? list([]) : list([touch]),
              targetTouches: empty ? list([]) : list([touch]),
              changedTouches: list([touch]),
            })
          )
        }
        const sample = () =>
          samples.push(Math.round(frame.getBoundingClientRect().bottom))
        fire('touchstart', startY)
        sample()
        let step = 0
        const id = setInterval(() => {
          step++
          fire('touchmove', startY + (dy * step) / steps)
          sample()
          if (step >= steps) {
            clearInterval(id)
            fire('touchend', startY + dy)
            resolve(samples)
          }
        }, 16)
      })
    },
    { t: testID, frameT: frameTestID, dy: deltaY, steps }
  )
}

test.describe('Sheet web keyboard — drag & scroll', () => {
  test('pull-down follows the finger monotonically (no double-drive jitter)', async ({
    page,
  }) => {
    await openSheet(page)
    await page.getByTestId('sheet-web-kb-body').click()
    await simulateKeyboard(page, KB_HEIGHT)
    await page.waitForTimeout(800)

    // pull the sheet DOWN; the frame bottom should increase monotonically while
    // the finger moves down. before the fix two gesture systems fought and the
    // trajectory reversed by 10-45px between frames.
    const samples = await touchDragSampling(
      page,
      'sheet-web-kb-scrollview',
      'sheet-web-kb-frame',
      90
    )
    expect(samples.length).toBeGreaterThan(5)

    // largest backward step (movement opposite to the downward drag) must be tiny
    let maxBackward = 0
    for (let i = 1; i < samples.length; i++) {
      const back = samples[i - 1] - samples[i] // positive => moved up (wrong way)
      if (back > maxBackward) maxBackward = back
    }
    expect(maxBackward).toBeLessThan(12)
  })

  // regression: with the keyboard open the sheet sits at the keyboard-adjusted
  // position (activePositions); the web PanResponder used to clamp drags against
  // the un-adjusted positions[0], so a tiny scroll rubber-banded it down.
  test('a small scroll does NOT snap the sheet down when the keyboard is open', async ({
    page,
  }) => {
    await openSheet(page)
    await page.getByTestId('sheet-web-kb-body').click()
    await simulateKeyboard(page, KB_HEIGHT)
    await page.waitForTimeout(800)

    const before = await rect(page, 'sheet-web-kb-frame')
    await touchDragSampling(page, 'sheet-web-kb-scrollview', 'sheet-web-kb-frame', 40)
    await page.waitForTimeout(600)
    const after = await rect(page, 'sheet-web-kb-frame')

    // before the fix a "barely scrolled" drag snapped the sheet ~280px down
    expect(Math.abs(after!.top - before!.top)).toBeLessThan(60)
  })
})
