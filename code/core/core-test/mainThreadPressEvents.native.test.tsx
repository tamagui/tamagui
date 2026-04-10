process.env.TAMAGUI_TARGET = 'native'

import { describe, expect, test, vi, beforeEach } from 'vitest'

// ─── Platform mock ──────────────────────────────────────────────────────────
// vi.mock factories are hoisted above all imports and const declarations by
// Vitest's transform. vi.hoisted() runs at hoist time too, so variables
// declared inside it are accessible inside vi.mock factories without TDZ errors.
const platformState = vi.hoisted(() => ({ OS: 'android' as string, isTV: false }))

vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>()
  return {
    ...actual,
    // Spread actual then override Platform so @testing-library/react-native
    // still gets all the real RN exports it needs.
    Platform: platformState,
  }
})

// Import AFTER mock (vi.mock is hoisted, so these see the mocked react-native)
import { renderHook } from '@testing-library/react-native'
// Import the .native. file explicitly — bare path resolves to the web stub in vitest
import { useMainThreadPressEvents } from '../web/src/helpers/mainThreadPressEvents.native'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function runHook(events: any, enabled = true) {
  const viewProps: Record<string, any> = {}
  renderHook(() => useMainThreadPressEvents(events, viewProps, enabled))
  return viewProps
}

// ─── Non-TV (standard responder path) ────────────────────────────────────────

describe('non-TV: responder system', () => {
  beforeEach(() => {
    platformState.isTV = false
    platformState.OS = 'android'
  })

  test('sets onStartShouldSetResponder and core responder handlers', () => {
    const onPress = vi.fn()
    const props = runHook({ onPress })
    expect(typeof props.onStartShouldSetResponder).toBe('function')
    expect(typeof props.onResponderGrant).toBe('function')
    expect(typeof props.onResponderRelease).toBe('function')
  })

  test('fires onPress on release', () => {
    const onPress = vi.fn()
    const props = runHook({ onPress })
    props.onResponderGrant({})
    props.onResponderRelease({})
    expect(onPress).toHaveBeenCalledOnce()
  })

  test('fires onPressIn on grant and onPressOut on release', () => {
    const onPressIn = vi.fn()
    const onPressOut = vi.fn()
    // minPressDuration: 0 avoids the default 130ms defer on onPressOut
    const props = runHook({ onPress: vi.fn(), onPressIn, onPressOut, minPressDuration: 0 })
    props.onResponderGrant({})
    expect(onPressIn).toHaveBeenCalledOnce()
    expect(onPressOut).not.toHaveBeenCalled()
    props.onResponderRelease({})
    expect(onPressOut).toHaveBeenCalledOnce()
  })

  test('does not fire onPress after long press', async () => {
    vi.useFakeTimers()
    const onPress = vi.fn()
    const onLongPress = vi.fn()
    const props = runHook({ onPress, onLongPress, delayLongPress: 500 })
    props.onResponderGrant({})
    vi.advanceTimersByTime(600)
    props.onResponderRelease({})
    expect(onLongPress).toHaveBeenCalledOnce()
    expect(onPress).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  test('does nothing when disabled', () => {
    const onPress = vi.fn()
    const props = runHook({ onPress }, false)
    expect(props.onStartShouldSetResponder).toBeUndefined()
    expect(props.onResponderGrant).toBeUndefined()
  })
})

// ─── Android TV ───────────────────────────────────────────────────────────────

describe('Android TV: onClick / onPressIn / onPressOut', () => {
  beforeEach(() => {
    platformState.isTV = true
    platformState.OS = 'android'
  })

  test('maps onPress → onClick (not onPress) on viewProps', () => {
    const onPress = vi.fn()
    const props = runHook({ onPress })
    expect(props.onClick).toBe(onPress)
    expect(props.onPress).toBeUndefined()
  })

  test('maps onLongPress → onLongClick (not onLongPress) on viewProps', () => {
    // onLongPress is not a recognised Fabric setter in Android TV TVViewConfig.
    // The native long-click event is exposed as onLongClick instead.
    const onLongPress = vi.fn()
    const props = runHook({ onPress: vi.fn(), onLongPress })
    expect(props.onLongClick).toBe(onLongPress)
    expect(props.onLongPress).toBeUndefined()
  })

  test('passes onPressIn and onPressOut through directly', () => {
    const onPressIn = vi.fn()
    const onPressOut = vi.fn()
    const props = runHook({ onPress: vi.fn(), onPressIn, onPressOut })
    expect(props.onPressIn).toBe(onPressIn)
    expect(props.onPressOut).toBe(onPressOut)
  })

  test('onClick fires the onPress callback directly', () => {
    const onPress = vi.fn()
    const props = runHook({ onPress })
    props.onClick({})
    expect(onPress).toHaveBeenCalledOnce()
  })

  // NOTE: responder handlers (onStartShouldSetResponder, onResponderGrant, etc.)
  // ARE still set by useMainThreadPressEvents on Android TV, but are subsequently
  // deleted by eventHandling.native.ts via androidTVFabricIncompatibleHandlers
  // before the props reach the native view. Testing that deletion is the
  // responsibility of eventHandling.native.ts tests.
})

// ─── tvOS ─────────────────────────────────────────────────────────────────────

describe('tvOS: onPress / onLongPress pass-through', () => {
  beforeEach(() => {
    platformState.isTV = true
    platformState.OS = 'ios'
  })

  test('sets onPress directly (not onClick)', () => {
    const onPress = vi.fn()
    const props = runHook({ onPress })
    expect(props.onPress).toBe(onPress)
    expect(props.onClick).toBeUndefined()
  })

  test('sets onLongPress directly', () => {
    const onLongPress = vi.fn()
    const props = runHook({ onPress: vi.fn(), onLongPress })
    expect(props.onLongPress).toBe(onLongPress)
  })

  test('sets onPressIn and onPressOut directly', () => {
    const onPressIn = vi.fn()
    const onPressOut = vi.fn()
    const props = runHook({ onPress: vi.fn(), onPressIn, onPressOut })
    expect(props.onPressIn).toBe(onPressIn)
    expect(props.onPressOut).toBe(onPressOut)
  })
})
