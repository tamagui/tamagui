import { describe, expect, test, vi } from 'vitest'

vi.mock('react', () => ({ useRef: (current: unknown) => ({ current }) }))

import { useSheetScrollViewGestures } from '../src/useSheetScrollViewGestures.native'

const touch = (pageY: number) => ({ nativeEvent: { pageY } }) as any

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
})
