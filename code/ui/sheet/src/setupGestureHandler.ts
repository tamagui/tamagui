/**
 * Legacy setup - prefer `import '@tamagui/native/setup-gesture-handler'` instead.
 */

import { getGestureHandler } from '@tamagui/native'

import type { GestureState } from '@tamagui/native'

const SHEET_GESTURE_STATE_KEY = '__tamagui_sheet_gesture_state__'

export function isGestureHandlerEnabled(): boolean {
  const g = globalThis as typeof globalThis & {
    [SHEET_GESTURE_STATE_KEY]?: GestureState
  }

  return g[SHEET_GESTURE_STATE_KEY]?.enabled ?? getGestureHandler().isEnabled
}

export interface SetupGestureHandlerConfig {
  Gesture: any
  GestureDetector: any
  ScrollView?: any
}

export function setupGestureHandler(config: SetupGestureHandlerConfig): void {
  const g = globalThis as any
  if (g.__tamagui_sheet_gesture_handler_setup) {
    return
  }
  g.__tamagui_sheet_gesture_handler_setup = true

  const { Gesture, GestureDetector, ScrollView } = config

  if (Gesture && GestureDetector) {
    g[SHEET_GESTURE_STATE_KEY] = {
      enabled: true,
      Gesture,
      GestureDetector,
      ScrollView: ScrollView || null,
      RootView: null,
    } satisfies GestureState
  }
}
