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
 *     tracks — shrinks by the keyboard height). The correct behavior: keep the
 *     natural pre-keyboard fit height, translate the frame up by the keyboard
 *     height, and cap at the top safe area. When that cap leaves a tail behind
 *     the keyboard, bottom scroll padding makes the lower content reachable.
 *     (the frame-height teleport / "goes back down".)
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
  test('keyboard open lifts the sheet by keyboard height, capped at the safe area, without resizing', async ({
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

    // the frame translates up to preserve its visible height. It is not expanded
    // to full height: the fit height is preserved, and the shift caps at the top
    // safe area when the sheet is taller than the visible band.
    const shift = before!.bottom - after!.bottom
    const expectedShift = Math.min(KB_HEIGHT, before!.top)
    expect(Math.abs(shift - expectedShift)).toBeLessThan(12)
    expect(Math.abs(after!.height - before!.height)).toBeLessThan(8)
    expect(after!.top).toBeGreaterThanOrEqual(-4)
  })

  test('a tall lifted sheet can scroll its lower content above the keyboard', async ({
    page,
  }) => {
    await openSheet(page)
    await page.getByTestId('sheet-web-kb-body').click()
    await simulateKeyboard(page, KB_HEIGHT)
    await page.waitForTimeout(700)

    // this fixture's sheet is tall enough that, after lifting to the safe-area
    // cap, its lower tail still sits behind the keyboard. the spacer makes that
    // tail scrollable so the footer can reach above the keyboard.
    const canScroll = await page.evaluate(() => {
      const n = document.querySelector(
        '[data-testid="sheet-web-kb-scrollview"]'
      ) as HTMLElement
      return n ? n.scrollHeight - n.clientHeight : 0
    })
    expect(canScroll).toBeGreaterThan(40)
  })

  test('keyboard close returns the sheet to its original fit position (no teleport)', async ({
    page,
  }) => {
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
    // back exactly where it started after the keyboard translation is removed.
    expect(Math.abs(reopened!.bottom - closed!.bottom)).toBeLessThan(8)
    expect(Math.abs(reopened!.height - closed!.height)).toBeLessThan(8)
  })

  test('moveOnKeyboardChange OFF: reproduces the bug — sheet shrinks without the freeze', async ({
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
    // the exact bug the ON path fixes by preserving height + translating up.
    expect(after!.height).toBeLessThan(before!.height - 100)
  })

  test('overlay exit fades out once without restarting from the open state', async ({
    page,
  }) => {
    await openSheet(page)

    const openOpacity = await page.getByTestId('sheet-web-kb-overlay').evaluate((el) => {
      return Number(getComputedStyle(el).opacity)
    })
    expect(openOpacity).toBeGreaterThan(0.3)

    await page.getByTestId('sheet-web-kb-cancel').click()

    const samples: number[] = []
    for (let i = 0; i < 14; i++) {
      await page.waitForTimeout(60)
      const opacity = await page.evaluate(() => {
        const el = document.querySelector('[data-testid="sheet-web-kb-overlay"]')
        return el ? Number(getComputedStyle(el).opacity) : null
      })
      if (opacity !== null) {
        samples.push(opacity)
      }
    }

    expect(samples.length).toBeGreaterThan(4)
    expect(Math.max(...samples)).toBeLessThanOrEqual(openOpacity + 0.08)

    let maxRise = 0
    for (let i = 1; i < samples.length; i++) {
      maxRise = Math.max(maxRise, samples[i] - samples[i - 1])
    }
    expect(maxRise).toBeLessThan(0.04)
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
  // position (activePositions); the PanResponder must clamp against that target
  // instead of rubber-banding back toward the pre-keyboard position.
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

  test('a fast short pull with the keyboard open bounces back instead of dismissing', async ({
    page,
  }) => {
    await openSheet(page)
    await page.getByTestId('sheet-web-kb-body').click()
    await simulateKeyboard(page, KB_HEIGHT)
    await page.waitForTimeout(800)

    const before = await rect(page, 'sheet-web-kb-frame')
    await touchDragSampling(page, 'sheet-web-kb-scrollview', 'sheet-web-kb-frame', 200, 4)
    await page.waitForTimeout(900)
    const after = await rect(page, 'sheet-web-kb-frame')

    await expect(page.getByTestId('sheet-web-kb-overlay')).toBeVisible()
    expect(Math.abs(after!.top - before!.top)).toBeLessThan(60)
  })
})
