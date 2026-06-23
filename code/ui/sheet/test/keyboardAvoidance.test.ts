import { afterEach, describe, expect, test } from 'vitest'

import {
  getKeyboardAdjustedSheetY,
  getKeyboardOccludedHeight,
  getSheetReleasePosition,
} from '../src/keyboardAvoidance'
import {
  getWebKeyboardBottomInset,
  getWebKeyboardResizeHeight,
  getWebVisualViewportOffsetTop,
} from '../src/webViewport'

const originalWindow = globalThis.window
const originalDocument = globalThis.document

function setWebViewport({
  clientHeight,
  visualViewportHeight,
  offsetTop = 0,
}: {
  clientHeight: number
  visualViewportHeight: number
  offsetTop?: number
}) {
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      documentElement: {
        clientHeight,
      },
    },
  })
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      innerHeight: clientHeight,
      visualViewport: {
        height: visualViewportHeight,
        offsetTop,
      },
    },
  })
}

afterEach(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: originalWindow,
  })
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: originalDocument,
  })
})

describe('getKeyboardAdjustedSheetY', () => {
  const base = {
    sheetY: 320,
    screenSize: 844,
    isKeyboardVisible: true,
    keyboardHeight: 300,
    safeAreaTop: 44,
  }

  test('keeps the original position when translation is disabled', () => {
    expect(
      getKeyboardAdjustedSheetY({
        ...base,
        shouldTranslate: false,
      })
    ).toBe(base.sheetY)
  })

  test('shifts sheets up by keyboard height and caps at safe area', () => {
    expect(
      getKeyboardAdjustedSheetY({
        ...base,
        shouldTranslate: true,
      })
    ).toBe(44)
  })

  test('keeps a smaller fit sheet at its natural height and moves it with the keyboard', () => {
    expect(
      getKeyboardAdjustedSheetY({
        ...base,
        sheetY: 500,
        shouldTranslate: true,
      })
    ).toBe(200)
  })

  test('does not shift hidden keyboard or offscreen close positions', () => {
    expect(
      getKeyboardAdjustedSheetY({
        ...base,
        isKeyboardVisible: false,
        shouldTranslate: true,
      })
    ).toBe(base.sheetY)
    expect(
      getKeyboardAdjustedSheetY({
        ...base,
        sheetY: base.screenSize,
        shouldTranslate: true,
      })
    ).toBe(base.screenSize)
  })
})

describe('getKeyboardOccludedHeight', () => {
  const base = {
    frameSize: 700,
    isKeyboardVisible: true,
    keyboardHeight: 300,
    screenSize: 844,
    sheetY: 59,
  }

  test('returns overflow below the keyboard top after the sheet is clamped', () => {
    expect(getKeyboardOccludedHeight(base)).toBe(215)
  })

  test('returns zero when the keyboard-adjusted sheet clears the keyboard', () => {
    expect(
      getKeyboardOccludedHeight({
        ...base,
        frameSize: 400,
        sheetY: 144,
      })
    ).toBe(0)
  })

  test('ignores hidden keyboard and offscreen sheet positions', () => {
    expect(
      getKeyboardOccludedHeight({
        ...base,
        isKeyboardVisible: false,
      })
    ).toBe(0)
    expect(
      getKeyboardOccludedHeight({
        ...base,
        sheetY: base.screenSize,
      })
    ).toBe(0)
  })

  test('clamps occlusion to the frame height', () => {
    expect(
      getKeyboardOccludedHeight({
        ...base,
        frameSize: 120,
        keyboardHeight: 1000,
        sheetY: 0,
      })
    ).toBe(120)
  })
})

describe('getSheetReleasePosition', () => {
  // WEB keyboard-fit-dismiss threshold (the 75de9c9694 web keyboard-handoff fix):
  // when the keyboard is up, a fit+dismiss sheet only dismisses after enough
  // ACTUAL travel, ignoring a velocity-projected short drag.
  test('web: keeps a keyboard-fit sheet open when velocity projects a short drag to dismiss', () => {
    expect(
      getSheetReleasePosition({
        positions: [0, 844],
        projectedEnd: 480,
        currentPosition: 150,
        frameSize: 591,
        dismissOnSnapToBottom: true,
        snapPointsMode: 'fit',
        isKeyboardVisible: true,
        isWeb: true,
      })
    ).toBe(0)
  })

  test('web: allows a keyboard-fit sheet to dismiss after enough actual travel', () => {
    expect(
      getSheetReleasePosition({
        positions: [0, 844],
        projectedEnd: 560,
        currentPosition: 225,
        frameSize: 591,
        dismissOnSnapToBottom: true,
        snapPointsMode: 'fit',
        isKeyboardVisible: true,
        isWeb: true,
      })
    ).toBe(1)
  })

  // NATIVE must NOT apply the web threshold — it snaps purely by projected
  // position (the pre-rework v2.1.0 behavior). regression guard: with the
  // threshold leaking into native, this short-projected drag wrongly stayed open
  // (0); native should snap to the nearest point (here: dismiss, index 1).
  test('native: snaps a keyboard-fit sheet by projected position, ignoring the web threshold', () => {
    expect(
      getSheetReleasePosition({
        positions: [0, 844],
        projectedEnd: 480,
        currentPosition: 150,
        frameSize: 591,
        dismissOnSnapToBottom: true,
        snapPointsMode: 'fit',
        isKeyboardVisible: true,
        isWeb: false,
      })
    ).toBe(1)
  })

  test('native: a projected-open drag snaps back open', () => {
    expect(
      getSheetReleasePosition({
        positions: [0, 844],
        projectedEnd: 200,
        currentPosition: 300,
        frameSize: 591,
        dismissOnSnapToBottom: true,
        snapPointsMode: 'fit',
        isKeyboardVisible: true,
        isWeb: false,
      })
    ).toBe(0)
  })

  test('keeps normal multi-snap release behavior outside keyboard-fit dismiss', () => {
    expect(
      getSheetReleasePosition({
        positions: [0, 360, 844],
        projectedEnd: 310,
        currentPosition: 90,
        frameSize: 591,
        dismissOnSnapToBottom: true,
        snapPointsMode: 'percent',
        isKeyboardVisible: true,
        isWeb: true,
      })
    ).toBe(1)
  })
})

describe('web viewport keyboard metrics', () => {
  test('separates keyboard resize height from bottom inset when Safari pans the visual viewport', () => {
    setWebViewport({
      clientHeight: 678,
      visualViewportHeight: 452,
      offsetTop: 158,
    })

    expect(getWebKeyboardResizeHeight()).toBe(226)
    expect(getWebVisualViewportOffsetTop()).toBe(158)
    expect(getWebKeyboardBottomInset()).toBe(68)
  })

  test('matches resize height and bottom inset when the visual viewport is not panned', () => {
    setWebViewport({
      clientHeight: 678,
      visualViewportHeight: 452,
    })

    expect(getWebKeyboardResizeHeight()).toBe(226)
    expect(getWebVisualViewportOffsetTop()).toBe(0)
    expect(getWebKeyboardBottomInset()).toBe(226)
  })
})
