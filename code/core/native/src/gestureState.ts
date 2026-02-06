import { createGlobalState } from './globalState'
import type { GestureState } from './types'

const state = createGlobalState<GestureState>(`gesture`, {
  enabled: false,
  Gesture: null,
  GestureDetector: null,
  ScrollView: null,
})

export interface Insets {
  top?: number
  left?: number
  bottom?: number
  right?: number
}

export type PressGestureConfig = {
  onPressIn?: (e: any) => void
  onPressOut?: (e: any) => void
  onPress?: (e: any) => void
  onLongPress?: (e: any) => void
  delayLongPress?: number
  hitSlop?: number | Insets | null
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
      return state.get().enabled
    },
    get state(): GestureState {
      return state.get()
    },
    set(updates: Partial<GestureState>): void {
      Object.assign(state.get(), updates)
    },

    disable(): void {
      state.get().enabled = false
    },

    createPressGesture(config: PressGestureConfig): any {
      const { Gesture } = state.get()
      if (!Gesture) return null

      const longPressDuration = config.delayLongPress ?? 500

      // Tap gesture for regular presses
      // Use long maxDuration to not cancel during long presses
      const tap = Gesture.Tap()
        .runOnJS(true)
        .maxDuration(10000) // allow very long presses
        .onBegin((e: any) => {
          config.onPressIn?.(e)
        })
        .onEnd((e: any) => {
          config.onPress?.(e)
        })
        .onFinalize((e: any) => {
          config.onPressOut?.(e)
        })

      if (config.hitSlop) tap.hitSlop(config.hitSlop)

      // if no long press handler, just use tap
      if (!config.onLongPress) return tap

      // LongPress gesture for long press handling
      const longPress = Gesture.LongPress()
        .runOnJS(true)
        .minDuration(longPressDuration)
        .onBegin((e: any) => config.onPressIn?.(e))
        .onStart((e: any) => config.onLongPress?.(e))
        .onFinalize((e: any) => config.onPressOut?.(e))

      if (config.hitSlop) longPress.hitSlop(config.hitSlop)

      // exclusive: longPress has priority, tap is fallback for quick presses
      return Gesture.Exclusive(longPress, tap)
    },
  }
}
