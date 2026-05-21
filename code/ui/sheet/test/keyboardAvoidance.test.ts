import { describe, expect, test } from 'vitest'

import { getKeyboardOccludedHeight } from '../src/keyboardAvoidance'

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
