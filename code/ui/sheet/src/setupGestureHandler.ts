/**
 * Legacy setup - prefer `import '@tamagui/native/setup-gesture-handler'` instead.
 */

import { getGestureHandler } from '@tamagui/native'

export function isGestureHandlerEnabled(): boolean {
  return getGestureHandler().isEnabled
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
    getGestureHandler().set({
      enabled: true,
      Gesture,
      GestureDetector,
      ScrollView: ScrollView || null,
    })
  }
}
