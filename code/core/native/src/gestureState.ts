import type { GestureState } from './types'

const GLOBAL_KEY = '__tamagui_native_gesture_state__'

function getGlobalState(): GestureState {
  const g = globalThis as any
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      enabled: false,
      Gesture: null,
      GestureDetector: null,
      ScrollView: null,
    }
  }
  return g[GLOBAL_KEY]
}

export type PressGestureConfig = {
  onPressIn?: (e: any) => void
  onPressOut?: (e: any) => void
  onPress?: (e: any) => void
  onLongPress?: (e: any) => void
  delayLongPress?: number
  hitSlop?: any
}

export interface GestureHandlerAccessor {
  readonly isEnabled: boolean
  readonly state: GestureState
  set(updates: Partial<GestureState>): void
  disable(): void
  createPressGesture(config: PressGestureConfig): any
}

export function getGestureHandler(): GestureHandlerAccessor {
  return {
    get isEnabled(): boolean {
      return getGlobalState().enabled
    },
    get state(): GestureState {
      return getGlobalState()
    },
    set(updates: Partial<GestureState>): void {
      const state = getGlobalState()
      Object.assign(state, updates)
    },

    disable(): void {
      const state = getGlobalState()
      state.enabled = false
    },

    createPressGesture(config: PressGestureConfig): any {
      const { Gesture } = getGlobalState()
      if (!Gesture) return null

      const tap = Gesture.Tap()
        .runOnJS(true) // run callbacks on JS thread
        .onBegin((e: any) => config.onPressIn?.(e))
        .onEnd((e: any) => config.onPress?.(e))
        .onFinalize((e: any) => config.onPressOut?.(e))

      if (config.hitSlop) tap.hitSlop(config.hitSlop)

      if (!config.onLongPress) return tap

      const longPress = Gesture.LongPress()
        .runOnJS(true) // run callbacks on JS thread
        .minDuration(config.delayLongPress ?? 500)
        .onStart((e: any) => config.onLongPress?.(e))
        .onFinalize((e: any) => config.onPressOut?.(e))

      if (config.hitSlop) longPress.hitSlop(config.hitSlop)

      return Gesture.Exclusive(longPress, tap)
    },
  }
}
