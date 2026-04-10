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
 * Uses a grace period to allow child gestures to steal ownership from parent,
 * since RNGH fires parent gestures before child gestures.
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

      // Grace period for child gestures to steal ownership from parent.
      // RNGH fires parent before child, but we want innermost to win.
      // Claims typically span 2-3ms, 6ms gives buffer for slower devices.
      const GRACE_PERIOD_MS = process.env.TAMAGUI_RNGH_PRESS_DELAY
        ? +process.env.TAMAGUI_RNGH_PRESS_DELAY
        : 6

      const tryClaimOwnership = () => {
        const now = Date.now()
        // reset if stale (component may have unmounted mid-press)
        if (now - pressState.timestamp > 2000) {
          pressState.owner = null
          pressState.timestamp = 0
        }

        // within grace period, last claimer wins (child fires after parent)
        const withinGrace = now - pressState.timestamp < GRACE_PERIOD_MS
        if (pressState.owner === null || withinGrace) {
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
          tryClaimOwnership()
          // defer onPressIn until after grace period to ensure we're the final owner
          setTimeout(() => {
            if (isOwner()) {
              config.onPressIn?.(e)
            }
          }, GRACE_PERIOD_MS + 1)
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
          tryClaimOwnership()
          setTimeout(() => {
            if (isOwner()) {
              config.onPressIn?.(e)
            }
          }, GRACE_PERIOD_MS + 1)
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
