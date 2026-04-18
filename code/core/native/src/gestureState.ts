import { createGlobalState } from './globalState'
import type { GestureState } from './types'

const state = createGlobalState<GestureState>(`gesture`, {
  enabled: false,
  Gesture: null,
  GestureDetector: null,
  ScrollView: null,
})

let pressGestureDebugId = 0
let externalPressDebugId = 0

type PressOwnerSource = 'internal' | 'external' | null

function getEventPointerId(e: any): number | null {
  const pointerId =
    e?.pointerId ??
    e?.pointer?.id ??
    e?.event?.pointerId ??
    e?.event?.pointer?.id ??
    e?.nativeEvent?.pointerId ??
    e?.nativeEvent?.id ??
    e?.event?.nativeEvent?.pointerId ??
    e?.event?.nativeEvent?.id ??
    null

  return pointerId == null || Number.isNaN(pointerId) ? null : Number(pointerId)
}

/**
 * Global press coordination - ensures only innermost pressable fires press events,
 * matching RN Pressable/responder system semantics where deepest component wins.
 * Uses a grace period to allow child gestures to steal ownership from parent,
 * since RNGH fires parent gestures before child gestures.
 */
const pressState = {
  owner: null as object | null,
  ownerId: null as number | null,
  ownerSource: null as PressOwnerSource,
  ownerPointerId: null as number | null,
  timestamp: 0,
}

export interface Insets {
  top?: number
  left?: number
  bottom?: number
  right?: number
}

export type PressGestureConfig = {
  debugName?: string | null
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

export type ExternalPressOwnershipToken = object

function resetPressOwner() {
  pressState.owner = null
  pressState.ownerId = null
  pressState.ownerSource = null
  pressState.ownerPointerId = null
  pressState.timestamp = 0
}

function resetStaleOwner(now: number, debugName?: string | null) {
  if (now - pressState.timestamp > 2000) {
    resetPressOwner()
  }
}

export function claimExternalPressOwnership(
  debugName?: string | null
): ExternalPressOwnershipToken {
  const now = Date.now()
  resetStaleOwner(now, debugName)

  const token = {}
  const ownerId = ++externalPressDebugId

  pressState.owner = token
  pressState.ownerId = ownerId
  pressState.ownerSource = 'external'
  pressState.timestamp = now

  return token
}

export function releaseExternalPressOwnership(
  token: ExternalPressOwnershipToken | null | undefined,
  debugName?: string | null
): void {
  if (!token || pressState.owner !== token) {
    return
  }
  resetPressOwner()
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
      const myDebugId = ++pressGestureDebugId
      let didLongPress = false
      let didPressIn = false
      let pressInTimer: ReturnType<typeof setTimeout> | null = null

      // Grace period for child gestures to steal ownership from parent.
      // RNGH fires parent before child, but we want innermost to win.
      // Claims typically span a few ms, 24ms gives enough room to observe
      // ordering while debugging slower frames.
      const GRACE_PERIOD_MS = process.env.TAMAGUI_RNGH_PRESS_DELAY
        ? +process.env.TAMAGUI_RNGH_PRESS_DELAY
        : 24

      const tryClaimOwnership = (e: any) => {
        const now = Date.now()
        resetStaleOwner(now, config.debugName)

        const currentPointerId = getEventPointerId(e)
        const isSameTouchPointer =
          currentPointerId == null ||
          pressState.ownerPointerId == null ||
          pressState.ownerPointerId === currentPointerId

        if (
          pressState.owner === null ||
          (pressState.ownerSource === 'internal' && isSameTouchPointer)
        ) {
          pressState.owner = myToken
          pressState.ownerId = myDebugId
          pressState.ownerSource = 'internal'
          pressState.ownerPointerId = currentPointerId
          pressState.timestamp = now
        }
        return pressState.owner === myToken
      }

      const isOwner = () => pressState.owner === myToken

      const releaseOwnership = () => {
        if (pressInTimer) {
          clearTimeout(pressInTimer)
          pressInTimer = null
        }
        if (pressState.owner === myToken) {
          resetPressOwner()
        }
      }

      const firePressIn = (e: any) => {
        if (!didPressIn && isOwner()) {
          didPressIn = true
          config.onPressIn?.(e)
        }
      }

      const schedulePressIn = (e: any) => {
        if (pressInTimer) {
          clearTimeout(pressInTimer)
        }
        pressInTimer = setTimeout(() => {
          pressInTimer = null
          if (isOwner()) {
            firePressIn(e)
          }
        }, GRACE_PERIOD_MS + 1)
      }

      // Tap gesture for regular presses
      // Use long maxDuration to not cancel during long presses
      const tap = Gesture.Tap()
        .runOnJS(true)
        .maxDuration(10000) // allow very long presses
        .onBegin((e: unknown) => {
          didLongPress = false
          didPressIn = false
          tryClaimOwnership(e)
          // Defer onPressIn until after the grace window so child pressables
          // can steal ownership, but flush it on tap end for very fast taps.
          schedulePressIn(e)
        })
        .onEnd((e: unknown) => {
          if (isOwner() && !didLongPress) {
            firePressIn(e)
            config.onPress?.(e)
          }
        })
        .onFinalize((e: unknown) => {
          if (isOwner()) {
            config.onPressOut?.(e)
            releaseOwnership()
          } else if (didPressIn) {
            // we already fired onPressIn but lost ownership before finalize
            // (e.g. finger dragged onto a sibling pressable and that one
            // claimed ownership). fire onPressOut so callers can clear their
            // press state — otherwise pressStyle stays stuck on this view.
            didPressIn = false
            config.onPressOut?.(e)
          }
        })

      if (config.hitSlop) tap.hitSlop(config.hitSlop)

      // if no long press handler, just use tap
      if (!config.onLongPress) return tap

      // LongPress gesture for long press handling
      const longPress = Gesture.LongPress()
        .runOnJS(true)
        .minDuration(longPressDuration)
        .onStart((e: any) => {
          didLongPress = true
          if (isOwner()) {
            firePressIn(e)
            config.onLongPress?.(e)
          }
        })

      if (config.hitSlop) longPress.hitSlop(config.hitSlop)

      // exclusive: longPress has priority, tap is fallback for quick presses
      return Gesture.Exclusive(longPress, tap)
    },
  }
}
