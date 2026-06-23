import { expect, test } from '@playwright/test'

/**
 * Regression test for the Sheet mobile-web keyboard AUTOFOCUS-ON-OPEN bug.
 *
 * Runs under the `webkit-sheet` project (Safari engine + touch) like
 * SheetWebKeyboard.test.tsx — iOS Safari's touch/scroll/viewport behavior
 * differs from chromium and this bug is about that viewport timing.
 *
 * Bug: when the sheet autofocuses its first input as it opens, the soft keyboard
 * rises SIMULTANEOUSLY with the open animation, so it is already up at the
 * sheet's first layout pass. layouts measured while the keyboard is up are
 * dropped (they carry the shrunk viewport), so the frame must keep its natural
 * pre-keyboard fit height and translate up by the keyboard height, capped at the
 * top safe area. Before the fix the frame instead COLLAPSED to the shrunk
 * useWindowDimensions*0.7 cap with the bottom "Post Thread" button occluded under
 * the keyboard, and it could not be scrolled to reveal the footer — exactly the
 * consumer's report.
 *
 * Reproduction: the keyboard is emulated by shrinking visualViewport.height and
 * dispatching one 'resize' (what a real iOS keyboard fires). To deterministically
 * hit the autofocus race — the keyboard already up when the sheet first lays out
 * — the page starts with the sheet open (?open=1) and we shrink the viewport +
 * keep an editable focused BEFORE the sheet's first layout lands. That is exactly
 * the state autofocus produces on a real device, where the keyboard animates up
 * alongside the sheet open and the first measured layout is keyboard-shrunk.
 */

const KB_HEIGHT = 320
const VH = 844
const KEYBOARD_TOP = VH - KB_HEIGHT // 524

test.use({ viewport: { width: 390, height: VH }, hasTouch: true, isMobile: true })

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

// open the sheet with the keyboard already up at first layout (autofocus race).
//
// the keyboard is shrunk via an init script that runs BEFORE the app bundle, so
// the visual viewport is already collapsed (and an editable focused) when React
// mounts and the sheet does its very first layout. that's the deterministic
// encoding of the autofocus race: the keyboard is up at first layout, so the
// keyboard-free baseline is never captured. (?open=1 mounts the sheet open.)
async function openWithAutofocusKeyboard(page: import('@playwright/test').Page) {
  await page.addInitScript((kb) => {
    const apply = () => {
      const vv = window.visualViewport
      if (!vv) return
      const base = window.innerHeight || 844
      Object.defineProperty(vv, 'height', { configurable: true, get: () => base - kb })
      Object.defineProperty(vv, 'offsetTop', { configurable: true, get: () => 0 })
    }
    apply()
    // keep an editable focused so the sheet's keyboard-visible check holds.
    window.addEventListener('DOMContentLoaded', () => {
      apply()
      const i = document.createElement('input')
      i.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.appendChild(i)
      i.focus()
      window.visualViewport?.dispatchEvent(new Event('resize'))
    })
  }, KB_HEIGHT)

  await page.goto('/?test=SheetWebKeyboardAutoFocusCase&animationDriver=css&open=1', {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForFunction(
    () => {
      const root = document.getElementById('root')
      return root && root.children.length > 0
    },
    { timeout: 8000, polling: 50 }
  )
  await expect(page.getByTestId('sheet-web-kb-af-frame')).toBeVisible({ timeout: 5000 })
  // let the open animation settle (anchor seed).
  await page.waitForTimeout(1200)
  // a real soft keyboard fires resize events as it animates up over ~250ms — the
  // keyboard hook's viewport listener (attached on mount) latches the height from
  // those. fire one now that the sheet has settled and the autofocused input
  // holds focus, mirroring that, so the keyboardOccludedHeight tail padding that
  // makes the footer reachable engages.
  await page.evaluate(() => window.visualViewport?.dispatchEvent(new Event('resize')))
  await page.waitForTimeout(500)
}

// touch drag that works in BOTH engines (see SheetWebKeyboard.test.tsx for the
// WebKit vs chromium TouchList rationale). samples the frame bottom each step.
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

// open with autofocus on a field that STARTS BEHIND the keyboard (?focus=body).
// this is the real-world case — the consumer's autofocused field isn't at the very
// top of the sheet — and it exercises the auto-scroll-into-view (an autofocused
// field below the fold must be lifted/scrolled above the keyboard on open, not
// stay cut off).
async function openWithBehindKeyboardAutofocus(page: import('@playwright/test').Page) {
  await page.addInitScript((kb) => {
    const apply = () => {
      const vv = window.visualViewport
      if (!vv) return
      const base = window.innerHeight || 844
      Object.defineProperty(vv, 'height', { configurable: true, get: () => base - kb })
      Object.defineProperty(vv, 'offsetTop', { configurable: true, get: () => 0 })
    }
    apply()
    window.addEventListener('DOMContentLoaded', apply)
  }, KB_HEIGHT)

  await page.goto(
    '/?test=SheetWebKeyboardAutoFocusCase&animationDriver=css&open=1&focus=body',
    { waitUntil: 'domcontentloaded' }
  )
  await page.waitForFunction(
    () => {
      const root = document.getElementById('root')
      return root && root.children.length > 0
    },
    { timeout: 8000, polling: 50 }
  )
  await expect(page.getByTestId('sheet-web-kb-af-frame')).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(1200)
  // the fixture autofocused the Body; fire a resize so the keyboard hook latches the
  // height, then give the keyboard translation + auto-scroll-into-view a beat to
  // clear the field.
  await page.evaluate(() => window.visualViewport?.dispatchEvent(new Event('resize')))
  await page.waitForTimeout(800)
}

test.describe('Sheet web keyboard avoidance — autofocus on open', () => {
  test('keyboard rising with the open animation lifts the sheet and keeps its fit height', async ({
    page,
  }) => {
    await openWithAutofocusKeyboard(page)

    const frame = await rect(page, 'sheet-web-kb-af-frame')
    expect(frame).toBeTruthy()

    // the sheet keeps a real (un-collapsed) height. before the fix the frame
    // collapsed to the shrunk useWindowDimensions*0.7 cap.
    expect(frame!.height).toBeGreaterThan(KB_HEIGHT)
    // it lifts so the bottom reaches the keyboard top when the natural fit height
    // can fit in the visible band. It is not expanded to full height.
    expect(frame!.bottom).toBeLessThanOrEqual(KEYBOARD_TOP + 8)
    expect(frame!.bottom).toBeLessThan(VH - 100)
    expect(frame!.top).toBeGreaterThanOrEqual(-4)
  })

  test('content becomes scrollable when the keyboard opens with autofocus', async ({
    page,
  }) => {
    await openWithAutofocusKeyboard(page)

    const canScroll = await page.evaluate(() => {
      const n = document.querySelector(
        '[data-testid="sheet-web-kb-af-scrollview"]'
      ) as HTMLElement
      return n ? n.scrollHeight - n.clientHeight : 0
    })
    // when the safe-area cap leaves lower content behind the keyboard, the
    // keyboardOccludedHeight spacer enables it to scroll above the keyboard.
    expect(canScroll).toBeGreaterThan(40)
  })

  test('the bottom "Post Thread" button can be scrolled above the keyboard', async ({
    page,
  }) => {
    await openWithAutofocusKeyboard(page)

    // scroll the content to the bottom — with the height freeze + tail padding
    // the footer scrolls into view above the keyboard. (the consumer report: the
    // footer was stuck under the keyboard and scrolling didn't work.)
    await page.evaluate(() => {
      const n = document.querySelector(
        '[data-testid="sheet-web-kb-af-scrollview"]'
      ) as HTMLElement
      if (n) n.scrollTop = n.scrollHeight
    })
    await page.waitForTimeout(300)

    const post = await rect(page, 'sheet-web-kb-af-post')
    expect(post).toBeTruthy()
    expect(post!.bottom).toBeLessThanOrEqual(KEYBOARD_TOP + 8)
  })

  test('pull-down follows the finger monotonically (no double-drive jitter) with autofocus keyboard', async ({
    page,
  }) => {
    await openWithAutofocusKeyboard(page)

    // pull the sheet DOWN; the frame bottom should increase monotonically. before
    // the fix the sheet was un-anchored/collapsed and the two gesture systems
    // fought, so the trajectory reversed between frames.
    const samples = await touchDragSampling(
      page,
      'sheet-web-kb-af-scrollview',
      'sheet-web-kb-af-frame',
      90
    )
    expect(samples.length).toBeGreaterThan(5)

    let maxBackward = 0
    for (let i = 1; i < samples.length; i++) {
      const back = samples[i - 1] - samples[i] // positive => moved up (wrong way)
      if (back > maxBackward) maxBackward = back
    }
    expect(maxBackward).toBeLessThan(12)
  })

  test('an autofocused field that starts behind the keyboard is scrolled above it', async ({
    page,
  }) => {
    await openWithBehindKeyboardAutofocus(page)

    // the sheet lifts with the keyboard, capped at the safe-area top.
    const frame = await rect(page, 'sheet-web-kb-af-frame')
    expect(frame).toBeTruthy()
    expect(frame!.bottom).toBeLessThanOrEqual(KEYBOARD_TOP + 8)
    expect(frame!.top).toBeGreaterThanOrEqual(-4)

    // the autofocused Body — which lays out BELOW the keyboard line at rest — ends
    // up clear of the keyboard by translation plus inner scrolling, not cut off
    // under it.
    const body = await rect(page, 'sheet-web-kb-af-body')
    expect(body).toBeTruthy()
    expect(body!.bottom).toBeLessThanOrEqual(KEYBOARD_TOP + 8)
  })
})
