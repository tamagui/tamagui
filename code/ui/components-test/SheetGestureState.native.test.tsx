import { getGestureHandler } from '@tamagui/native'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import {
  getGestureHandlerState,
  isGestureHandlerEnabled,
  setGestureHandlerState,
} from '../sheet/src/gestureState'
import {
  isGestureHandlerEnabled as isLegacyGestureHandlerEnabled,
  setupGestureHandler,
} from '../sheet/src/setupGestureHandler'

const SHEET_GESTURE_STATE_KEY = '__tamagui_sheet_gesture_state__'
const SHEET_LEGACY_SETUP_KEY = '__tamagui_sheet_gesture_handler_setup'
const GESTURE_ENABLED_FREEZE_KEY = '__tamagui_gesture_enabled_freeze__'

function resetGlobals() {
  delete (globalThis as any)[SHEET_GESTURE_STATE_KEY]
  delete (globalThis as any)[SHEET_LEGACY_SETUP_KEY]
  delete (globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]
}

function setPressGestureHandlerEnabled(enabled: boolean) {
  getGestureHandler().set({
    enabled,
    Gesture: null,
    GestureDetector: null,
    ScrollView: null,
    RootView: null,
  })
}

beforeEach(() => {
  resetGlobals()
  setPressGestureHandlerEnabled(false)
})

afterEach(() => {
  resetGlobals()
  setPressGestureHandlerEnabled(false)
})

describe('Sheet gesture state', () => {
  test('reads sheet RNGH state independently from pressEvents state', () => {
    const sheetState = {
      enabled: true,
      Gesture: { Pan: () => null },
      GestureDetector: () => null,
      ScrollView: {},
      RootView: {},
    }

    ;(globalThis as any)[SHEET_GESTURE_STATE_KEY] = sheetState

    expect(getGestureHandler().isEnabled).toBe(false)
    expect(isGestureHandlerEnabled()).toBe(true)
    expect(getGestureHandlerState()).toBe(sheetState)

    setGestureHandlerState({ enabled: false })

    expect(sheetState.enabled).toBe(false)
    expect(getGestureHandler().isEnabled).toBe(false)
  })

  test('legacy sheet setup does not enable global press events', () => {
    setupGestureHandler({
      Gesture: { Pan: () => null },
      GestureDetector: () => null,
      ScrollView: {},
    })

    expect(isLegacyGestureHandlerEnabled()).toBe(true)
    expect(isGestureHandlerEnabled()).toBe(true)
    expect(getGestureHandler().isEnabled).toBe(false)
  })
})
