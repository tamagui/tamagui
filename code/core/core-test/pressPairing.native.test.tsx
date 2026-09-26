import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import {
  getGestureHandler,
  unstable_claimExternalPressOwnership,
  unstable_releaseExternalPressOwnership,
} from '@tamagui/native'
import type { ReactNode } from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

// A press look is driven by a single pressIn/pressOut pair. These tests pin the
// two ways that pair used to break and leave a row latched in its press wash:
//  * the Manual observer (press-clause-only views) losing the release event
//  * the responder path (real onPress) dropping onPressOut when external press
//    ownership is claimed mid-press or when a grant interrupts a pending release

const conf = createTamagui(getDefaultTamaguiConfig('native'))
const GESTURE_ENABLED_FREEZE_KEY = '__tamagui_gesture_enabled_freeze__'

function resetGestureHandlerFreeze() {
  delete (globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]
}

function createGestureStub() {
  const gesture: any = {}
  for (const method of [
    'runOnJS',
    'maxDuration',
    'minDuration',
    'manualActivation',
    'hitSlop',
    'onBegin',
    'onStart',
    'onEnd',
    'onFinalize',
    'onTouchesDown',
    'onTouchesMove',
    'onTouchesUp',
    'onTouchesCancelled',
  ]) {
    gesture[method] = () => gesture
  }
  return gesture
}

// captures the callbacks Tamagui registers on the Manual observer so the test
// can drive them directly (standing in for RNGH's native touch pipeline).
function captureManualObserver() {
  const capture: Record<string, (e?: any) => void> = {}
  const gesture: any = {}
  for (const method of ['runOnJS', 'manualActivation', 'hitSlop', 'maxDuration']) {
    gesture[method] = () => gesture
  }
  for (const method of [
    'onTouchesDown',
    'onTouchesUp',
    'onTouchesCancelled',
    'onFinalize',
  ]) {
    gesture[method] = (fn: (e?: any) => void) => {
      capture[method] = fn
      return gesture
    }
  }
  return { capture, gesture }
}

function setGestureHandlerEnabled(
  enabled: boolean,
  GestureDetector?: any,
  GestureOverrides?: Record<string, any>
) {
  getGestureHandler().set({
    enabled,
    GestureDetector: enabled ? GestureDetector : null,
    Gesture: enabled
      ? {
          Tap: createGestureStub,
          LongPress: createGestureStub,
          Manual: createGestureStub,
          Exclusive: (...gestures: any[]) => gestures[0],
          ...GestureOverrides,
        }
      : null,
    ScrollView: null,
    RootView: null,
  })
}

async function render(element: ReactNode) {
  let rendered: TestRenderer.ReactTestRenderer | null = null
  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={conf} defaultTheme="light">
        {element}
      </TamaguiProvider>
    )
  })
  return rendered!
}

function flattenStyle(style: any): Record<string, any> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle))
  }
  return style || {}
}

function hostByTestID(rendered: TestRenderer.ReactTestRenderer, testID: string) {
  return rendered.root.find(
    (node) => typeof node.type === 'string' && node.props.testID === testID
  )
}

function backgroundOf(rendered: TestRenderer.ReactTestRenderer, testID: string) {
  return flattenStyle(hostByTestID(rendered, testID).props.style).backgroundColor
}

function responderNode(rendered: TestRenderer.ReactTestRenderer) {
  return rendered.root.find(
    (node) =>
      typeof node.props.onStartShouldSetResponder === 'function' &&
      typeof node.props.onResponderGrant === 'function' &&
      typeof node.props.onResponderRelease === 'function' &&
      typeof node.props.onResponderTerminate === 'function'
  )
}

beforeEach(() => {
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

describe('Manual press observer pairs pressIn with one pressOut', () => {
  async function renderPressRow() {
    const { capture, gesture } = captureManualObserver()
    setGestureHandlerEnabled(true, ({ children }: { children: ReactNode }) => children, {
      Manual: () => gesture,
    })
    const rendered = await render(<View testID="row" background="white press:red" />)
    return { rendered, capture }
  }

  test('touch down shows the wash and touch up clears it', async () => {
    const { rendered, capture } = await renderPressRow()

    await act(async () => capture.onTouchesDown())
    expect(backgroundOf(rendered, 'row')).toBe('red')

    await act(async () => capture.onTouchesUp())
    expect(backgroundOf(rendered, 'row')).not.toBe('red')
  })

  test('a release RNGH never delivers as a touch event is cleared by onFinalize', async () => {
    const { rendered, capture } = await renderPressRow()

    await act(async () => capture.onTouchesDown())
    expect(backgroundOf(rendered, 'row')).toBe('red')

    // the gesture ends/cancels without a touch-up reaching JS
    await act(async () => capture.onFinalize())
    expect(backgroundOf(rendered, 'row')).not.toBe('red')
  })

  test('overlapping touch-downs still clear on the single up that follows', async () => {
    const { rendered, capture } = await renderPressRow()

    await act(async () => {
      capture.onTouchesDown()
      capture.onTouchesDown()
    })
    expect(backgroundOf(rendered, 'row')).toBe('red')

    await act(async () => capture.onTouchesUp())
    expect(backgroundOf(rendered, 'row')).not.toBe('red')
  })

  test('touch cancel clears the wash', async () => {
    const { rendered, capture } = await renderPressRow()

    await act(async () => capture.onTouchesDown())
    expect(backgroundOf(rendered, 'row')).toBe('red')

    await act(async () => capture.onTouchesCancelled())
    expect(backgroundOf(rendered, 'row')).not.toBe('red')
  })
})

describe('responder press events pair pressIn with one pressOut', () => {
  test('release while external ownership is held still fires onPressOut', async () => {
    vi.useFakeTimers()
    setGestureHandlerEnabled(true, ({ children }: { children: ReactNode }) => children)

    const onPressIn = vi.fn()
    const onPressOut = vi.fn()
    const rendered = await render(
      <View
        testID="row"
        minPressDuration={0}
        onPress={() => {}}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      />
    )
    const responder = responderNode(rendered)

    await act(async () => {
      responder.props.onResponderGrant({})
    })
    expect(onPressIn).toHaveBeenCalledTimes(1)

    // a native menu boundary claims press ownership *after* this press started
    const owner = unstable_claimExternalPressOwnership('pairing-test')
    await act(async () => {
      responder.props.onResponderRelease({})
      vi.runAllTimers()
    })
    unstable_releaseExternalPressOwnership(owner, 'pairing-test')

    expect(onPressOut).toHaveBeenCalledTimes(1)
  })

  test('a grant blocked by external ownership still flushes the prior pending release', async () => {
    vi.useFakeTimers()
    setGestureHandlerEnabled(true, ({ children }: { children: ReactNode }) => children)

    const onPressIn = vi.fn()
    const onPressOut = vi.fn()
    const rendered = await render(
      // delayPressOut holds the pressOut open so the next grant can race it
      <View
        testID="row"
        delayPressOut={200}
        onPress={() => {}}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      />
    )
    const responder = responderNode(rendered)

    await act(async () => {
      responder.props.onResponderGrant({})
    })
    await act(async () => {
      responder.props.onResponderRelease({})
    })
    // the release is still waiting in the delayed pressOut timer here
    expect(onPressOut).not.toHaveBeenCalled()

    const owner = unstable_claimExternalPressOwnership('pairing-test')
    await act(async () => {
      responder.props.onResponderGrant({})
    })
    unstable_releaseExternalPressOwnership(owner, 'pairing-test')

    expect(onPressIn).toHaveBeenCalledTimes(1)
    expect(onPressOut).toHaveBeenCalledTimes(1)
  })

  test('terminate after a scheduled release fires onPressOut exactly once', async () => {
    vi.useFakeTimers()
    setGestureHandlerEnabled(true, ({ children }: { children: ReactNode }) => children)

    const onPressOut = vi.fn()
    const rendered = await render(
      <View testID="row" delayPressOut={200} onPress={() => {}} onPressOut={onPressOut} />
    )
    const responder = responderNode(rendered)

    await act(async () => {
      responder.props.onResponderGrant({})
      responder.props.onResponderRelease({})
      responder.props.onResponderTerminate({})
      vi.runAllTimers()
    })

    expect(onPressOut).toHaveBeenCalledTimes(1)
  })

  test('a normal press fires one pressIn, one press, one pressOut', async () => {
    vi.useFakeTimers()
    setGestureHandlerEnabled(true, ({ children }: { children: ReactNode }) => children)

    const onPressIn = vi.fn()
    const onPress = vi.fn()
    const onPressOut = vi.fn()
    const rendered = await render(
      <View
        testID="row"
        minPressDuration={0}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      />
    )
    const responder = responderNode(rendered)

    await act(async () => {
      responder.props.onResponderGrant({})
      responder.props.onResponderRelease({})
      vi.runAllTimers()
    })

    expect(onPressIn).toHaveBeenCalledTimes(1)
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onPressOut).toHaveBeenCalledTimes(1)
  })
})
