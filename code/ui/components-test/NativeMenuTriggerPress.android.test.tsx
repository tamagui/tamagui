import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { NativeMenuContext, getGestureHandler } from '@tamagui/native'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, describe, expect, test, vi } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig('native'))

// captures the Manual gesture's touch callbacks so the test can drive them
function createManualStub(handlers: Record<string, (...args: any[]) => void>) {
  const gesture: any = {}
  for (const method of [
    'runOnJS',
    'manualActivation',
    'hitSlop',
    'maxDuration',
    'minDuration',
  ]) {
    gesture[method] = () => gesture
  }
  for (const method of [
    'onTouchesDown',
    'onTouchesUp',
    'onTouchesCancelled',
    'onBegin',
    'onStart',
    'onEnd',
    'onFinalize',
    'onTouchesMove',
  ]) {
    gesture[method] = (fn: any) => {
      handlers[method] = fn
      return gesture
    }
  }
  return gesture
}

// gesture handler enablement freezes on first read; tests reset it
const GESTURE_ENABLED_FREEZE_KEY = '__tamagui_gesture_enabled_freeze__'

function setGestureHandler(state: Record<string, unknown>) {
  delete (globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]
  getGestureHandler().set({ ScrollView: null, RootView: null, ...state } as any)
}

afterEach(() => {
  vi.useRealTimers()
  setGestureHandler({ enabled: false, GestureDetector: null, Gesture: null })
})

describe('press handlers inside an android native menu trigger (#4241)', () => {
  test('leave the touch to the menu adapter and fire onLongPress instead of onPress', async () => {
    vi.useFakeTimers()
    const handlers: Record<string, (...args: any[]) => void> = {}
    const GestureDetector = ({ children }: any) => children
    setGestureHandler({
      enabled: true,
      GestureDetector,
      Gesture: { Manual: () => createManualStub(handlers) },
    })

    const onPress = vi.fn()
    const onLongPress = vi.fn()
    let rendered: TestRenderer.ReactTestRenderer
    await act(async () => {
      rendered = TestRenderer.create(
        <TamaguiProvider config={conf} defaultTheme="light">
          <NativeMenuContext.Provider value>
            <View testID="trigger" onPress={onPress} onLongPress={onLongPress} />
          </NativeMenuContext.Provider>
        </TamaguiProvider>
      )
    })

    // no responder claim anywhere, so the adapter's pressable receives the touch
    const claimers = rendered!.root.findAll(
      (node) => typeof node.props.onStartShouldSetResponder === 'function'
    )
    expect(claimers).toHaveLength(0)

    await act(async () => {
      handlers.onTouchesDown()
      vi.advanceTimersByTime(600)
      handlers.onTouchesUp()
    })
    expect(onLongPress).toHaveBeenCalledTimes(1)
    expect(onPress).not.toHaveBeenCalled()

    await act(async () => {
      handlers.onTouchesDown()
      vi.advanceTimersByTime(100)
      handlers.onTouchesUp()
      vi.advanceTimersByTime(600)
    })
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onLongPress).toHaveBeenCalledTimes(1)
  })
})
