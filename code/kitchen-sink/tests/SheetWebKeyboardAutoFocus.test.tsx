import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Regression test for the Sheet mobile-web keyboard AUTOFOCUS bug.
 *
 * Runs under the `webkit-sheet` project (Safari engine + touch) like
 * SheetWebKeyboard.test.tsx.
 *
 * Bug: when the sheet autofocuses its first input as it opens, the soft
 * keyboard rises SIMULTANEOUSLY with the open animation. The sheet's first
 * layout pass is skipped (handleAnimationViewLayout ignores layout while the
 * keyboard is up), so the keyboard-free frame baseline (stableKbGeom.frame) is
 * never captured. freezeForKb stays false and keyboardStableFrameHeight stays 0,
 * so the anchor freeze never engages: the frame collapses to the shrunk
 * useWindowDimensions cap instead of keeping its full height, and the bottom
 * "Post Thread" button is occluded under the keyboard.
 *
 * The keyboard is simulated by shrinking visualViewport.height and dispatching
 * one 'resize' (exactly what a real iOS keyboard fires). To reproduce the
 * autofocus race we raise the keyboard IMMEDIATELY after opening — before the
 * open animation settles — while the autofocused title input holds focus.
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

// open the sheet and raise the keyboard during the open animation, so the
// keyboard is up before the sheet captures a keyboard-free layout baseline —
// the exact ordering the autofocus consumer produces.
async function openWithKeyboardOnOpen(page: import('@playwright/test').Page) {
  await setupPage(page, {
    name: 'SheetWebKeyboardAutoFocusCase',
    type: 'useCase',
    searchParams: { animationDriver: 'css' },
  })
  await page.getByTestId('sheet-web-kb-af-open').click()
  await expect(page.getByTestId('sheet-web-kb-af-frame')).toBeVisible({ timeout: 5000 })
  // raise the keyboard immediately (autofocus would have done this on a real
  // device) — BEFORE the open spring settles, so the keyboard-free layout pass
  // never lands.
  await simulateKeyboard(page, KB_HEIGHT)
  // now let the open animation + keyboard handling settle.
  await page.waitForTimeout(1500)
}

test.describe('Sheet web keyboard avoidance — autofocus on open', () => {
  test('keyboard rising with the open animation still anchors the sheet (frame keeps height)', async ({
    page,
  }) => {
    await openWithKeyboardOnOpen(page)

    const frame = await rect(page, 'sheet-web-kb-af-frame')
    expect(frame).toBeTruthy()

    const keyboardTop = 844 - KB_HEIGHT // 524

    // the sheet must keep a real (un-collapsed) height. before the fix the frame
    // collapsed to the shrunk useWindowDimensions*0.7 cap (~366) or less because
    // the height freeze never engaged.
    expect(frame!.height).toBeGreaterThan(KB_HEIGHT + 80)

    // and it must reach above the keyboard: the frame top sits well above the
    // keyboard top so its content (incl. the title input) is visible.
    expect(frame!.top).toBeLessThan(keyboardTop)
  })

  test('the bottom "Post Thread" button stays above the keyboard', async ({ page }) => {
    await openWithKeyboardOnOpen(page)

    // scroll the content to the bottom so the submit button is in view — with
    // the anchor freeze + keyboardOccludedHeight tail padding the content is
    // scrollable and the button can sit above the keyboard.
    await page.evaluate(() => {
      const n = document.querySelector(
        '[data-testid="sheet-web-kb-af-scrollview"]'
      ) as HTMLElement
      if (n) n.scrollTop = n.scrollHeight
    })
    await page.waitForTimeout(300)

    const post = await rect(page, 'sheet-web-kb-af-post')
    expect(post).toBeTruthy()

    const keyboardTop = 844 - KB_HEIGHT // 524
    // the submit button bottom must clear the keyboard (small tolerance).
    expect(post!.bottom).toBeLessThanOrEqual(keyboardTop + 8)
  })

  test('content becomes scrollable when the keyboard opens with autofocus', async ({
    page,
  }) => {
    await openWithKeyboardOnOpen(page)

    const canScroll = await page.evaluate(() => {
      const n = document.querySelector(
        '[data-testid="sheet-web-kb-af-scrollview"]'
      ) as HTMLElement
      return n ? n.scrollHeight - n.clientHeight : 0
    })
    // the keyboardOccludedHeight tail padding makes the content scrollable so the
    // focused input/footer can scroll above the keyboard.
    expect(canScroll).toBeGreaterThan(KB_HEIGHT - 40)
  })
})
