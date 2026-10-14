import { describe, expect, test, vi } from 'vitest'

vi.mock('react', () => ({ useRef: (current: unknown) => ({ current }) }))

import { useSheetScrollViewGestures } from '../src/useSheetScrollViewGestures.native'

const touch = (pageY: number) => ({ nativeEvent: { pageY } }) as any

// sheet at its top snap point, finger swipes up inside a scrollable list
function scrollUpInList() {
  const scrollBridge = {
    y: 0,
    scrollStartY: -1,
    scrollLock: false,
    paneY: 0,
    paneMinY: 0,
    drag: vi.fn(),
    release: vi.fn(),
  } as any
  const gestures = useSheetScrollViewGestures({
    scrollRef: { current: null },
    scrollBridge,
    hasScrollableContent: true,
    scrollEnabled: true,
    setScrollEnabled: () => {},
  })

  gestures.onTouchStart(touch(500))
  gestures.onMoveShouldSetResponder(touch(480))
  gestures.onResponderMove(touch(480))
  gestures.onResponderMove(touch(440))

  return { gestures, scrollBridge }
}

describe('useSheetScrollViewGestures (native)', () => {
  test('a tap with small drift does not claim the responder after a gesture elsewhere', () => {
    const gestures = useSheetScrollViewGestures({
      scrollRef: { current: null },
      scrollBridge: { y: 0, scrollStartY: -1 } as any,
      hasScrollableContent: true,
      scrollEnabled: true,
      setScrollEnabled: () => {},
    })

    // a previous gesture ends at y=100
    gestures.onTouchStart(touch(100))
    gestures.onMoveShouldSetResponder(touch(100))

    // a tap on a button at y=400 drifts 3px
    gestures.onTouchStart(touch(400))
    expect(gestures.onMoveShouldSetResponder(touch(403))).toBe(false)

    // a real drag from the same touch still claims it
    expect(gestures.onMoveShouldSetResponder(touch(420))).toBe(true)
  })

  test('frees scrollLock when the touch ends after the list scrolled', () => {
    const { gestures, scrollBridge } = scrollUpInList()
    expect(scrollBridge.scrollLock).toBe(true)

    // the native ScrollView kept the touch, so no responder release arrives
    gestures.onScrollEndDrag()
    gestures.onTouchEnd()

    expect(scrollBridge.scrollLock).toBe(false)
  })

  test('frees scrollLock when the native ScrollView takes the responder', () => {
    const { gestures, scrollBridge } = scrollUpInList()
    expect(scrollBridge.scrollLock).toBe(true)

    gestures.onResponderTerminate()

    expect(scrollBridge.scrollLock).toBe(false)
  })
})
