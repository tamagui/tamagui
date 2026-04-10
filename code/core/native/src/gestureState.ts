import { createGlobalState } from './globalState'
import type { GestureState } from './types'

const state = createGlobalState<GestureState>(`gesture`, {
  enabled: false,
  Gesture: null,
  GestureDetector: null,
  ScrollView: null,
})

/**
 * Global press coordination - ensures only innermost pressable fires press events,
 * matching RN Pressable/responder system semantics where deepest component wins.
 * First gesture to fire onBegin claims ownership of the entire press sequence.
 */
const pressState = {
  owner: null as object | null,
  timestamp: 0,
}

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

      // unique token for this gesture instance - used to track ownership
      const myToken = {}

      // helper to check/claim ownership
      const tryClaimOwnership = () => {
        const now = Date.now()
        // reset if stale (component may have unmounted mid-press)
        if (now - pressState.timestamp > 2000) {
          pressState.owner = null
        }
        if (pressState.owner === null) {
          pressState.owner = myToken
          pressState.timestamp = now
        }
        return pressState.owner === myToken
      }

      const isOwner = () => pressState.owner === myToken

      const releaseOwnership = () => {
        if (pressState.owner === myToken) {
          pressState.owner = null
        }
      }

      // Tap gesture for regular presses
      // Use long maxDuration to not cancel during long presses
      const tap = Gesture.Tap()
        .runOnJS(true)
        .maxDuration(10000) // allow very long presses
        .onBegin((e: any) => {
          // first gesture to fire onBegin claims ownership of the press sequence
          // this matches RN Pressable/responder semantics (deepest wins)
          if (tryClaimOwnership()) {
            config.onPressIn?.(e)
          }
        })
        .onEnd((e: any) => {
          if (isOwner()) {
            config.onPress?.(e)
          }
        })
        .onFinalize((e: any) => {
          if (isOwner()) {
            config.onPressOut?.(e)
            releaseOwnership()
          }
        })

      if (config.hitSlop) tap.hitSlop(config.hitSlop)

      // if no long press handler, just use tap
      if (!config.onLongPress) return tap

      // LongPress gesture for long press handling
      const longPress = Gesture.LongPress()
        .runOnJS(true)
        .minDuration(longPressDuration)
        .onBegin((e: any) => {
          if (tryClaimOwnership()) {
            config.onPressIn?.(e)
          }
        })
        .onStart((e: any) => {
          if (isOwner()) {
            config.onLongPress?.(e)
          }
        })
        .onFinalize((e: any) => {
          if (isOwner()) {
            config.onPressOut?.(e)
            releaseOwnership()
          }
        })

      if (config.hitSlop) longPress.hitSlop(config.hitSlop)

      // exclusive: longPress has priority, tap is fallback for quick presses
      return Gesture.Exclusive(longPress, tap)
    },
  }
}
