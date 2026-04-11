import { createGlobalState } from './globalState'
import type { GestureState } from './types'

const state = createGlobalState<GestureState>(`gesture`, {
  enabled: false,
  Gesture: null,
  GestureDetector: null,
  ScrollView: null,
})

const shouldDebugPress =
  process.env.TAMAGUI_DEBUG_PRESS === '1' ||
  process.env.TAMAGUI_DEBUG_PRESS === 'true' ||
  process.env.NODE_ENV === 'development'

let pressGestureDebugId = 0
let externalPressDebugId = 0

type PressOwnerSource = 'internal' | 'external' | null

function debugPress(message: string, payload?: Record<string, unknown>) {
  if (!shouldDebugPress) return
  console.info('[tamagui press]', message, payload ?? '')
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
  pressState.timestamp = 0
}

function resetStaleOwner(now: number, debugName?: string | null) {
  if (now - pressState.timestamp > 2000) {
    debugPress('reset-stale-owner', {
      name: debugName ?? null,
      previousOwnerId: pressState.ownerId,
      previousOwnerSource: pressState.ownerSource,
      ageMs: now - pressState.timestamp,
    })
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
  const previousOwnerId = pressState.ownerId
  const previousOwnerSource = pressState.ownerSource

  pressState.owner = token
  pressState.ownerId = ownerId
  pressState.ownerSource = 'external'
  pressState.timestamp = now

  debugPress('external-claim', {
    id: ownerId,
    name: debugName ?? null,
    previousOwnerId,
    previousOwnerSource,
    ownerSource: pressState.ownerSource,
    now,
  })

  return token
}

export function releaseExternalPressOwnership(
  token: ExternalPressOwnershipToken | null | undefined,
  debugName?: string | null
): void {
  if (!token || pressState.owner !== token) {
    return
  }

  debugPress('external-release', {
    name: debugName ?? null,
    ownerId: pressState.ownerId,
    ownerSource: pressState.ownerSource,
  })

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

      // Grace period for child gestures to steal ownership from parent.
      // RNGH fires parent before child, but we want innermost to win.
      // Claims typically span a few ms, 24ms gives enough room to observe
      // ordering while debugging slower frames.
      const GRACE_PERIOD_MS = process.env.TAMAGUI_RNGH_PRESS_DELAY
        ? +process.env.TAMAGUI_RNGH_PRESS_DELAY
        : 24

      debugPress('createPressGesture', {
        id: myDebugId,
        name: config.debugName ?? null,
        graceMs: GRACE_PERIOD_MS,
        hasLongPress: !!config.onLongPress,
        longPressDuration,
        hitSlop: config.hitSlop ?? null,
      })

      const tryClaimOwnership = () => {
        const now = Date.now()
        resetStaleOwner(now, config.debugName)

        // within grace period, last claimer wins (child fires after parent)
        const withinGrace = now - pressState.timestamp < GRACE_PERIOD_MS
        const previousOwnerId = pressState.ownerId
        const previousOwnerSource = pressState.ownerSource
        if (
          pressState.owner === null ||
          (withinGrace && pressState.ownerSource !== 'external')
        ) {
          pressState.owner = myToken
          pressState.ownerId = myDebugId
          pressState.ownerSource = 'internal'
          pressState.timestamp = now
        }
        debugPress('claim', {
          id: myDebugId,
          name: config.debugName ?? null,
          previousOwnerId,
          previousOwnerSource,
          ownerId: pressState.ownerId,
          ownerSource: pressState.ownerSource,
          withinGrace,
          now,
        })
        return pressState.owner === myToken
      }

      const isOwner = () => pressState.owner === myToken

      const releaseOwnership = () => {
        if (pressState.owner === myToken) {
          debugPress('release', {
            id: myDebugId,
            name: config.debugName ?? null,
            ownerId: pressState.ownerId,
            ownerSource: pressState.ownerSource,
          })
          resetPressOwner()
        }
      }

      // Tap gesture for regular presses
      // Use long maxDuration to not cancel during long presses
      const tap = Gesture.Tap()
        .runOnJS(true)
        .maxDuration(10000) // allow very long presses
        .onBegin((e: any) => {
          tryClaimOwnership()
          debugPress('tap-begin', {
            id: myDebugId,
            name: config.debugName ?? null,
            ownerId: pressState.ownerId,
          })
          // defer onPressIn until after grace period to ensure we're the final owner
          setTimeout(() => {
            if (isOwner()) {
              debugPress('tap-press-in', {
                id: myDebugId,
                name: config.debugName ?? null,
              })
              config.onPressIn?.(e)
            } else {
              debugPress('tap-press-in-skipped', {
                id: myDebugId,
                name: config.debugName ?? null,
                ownerId: pressState.ownerId,
              })
            }
          }, GRACE_PERIOD_MS + 1)
        })
        .onEnd((e: any) => {
          if (isOwner()) {
            debugPress('tap-press', {
              id: myDebugId,
              name: config.debugName ?? null,
            })
            config.onPress?.(e)
          } else {
            debugPress('tap-press-skipped', {
              id: myDebugId,
              name: config.debugName ?? null,
              ownerId: pressState.ownerId,
            })
          }
        })
        .onFinalize((e: any) => {
          if (isOwner()) {
            debugPress('tap-finalize', {
              id: myDebugId,
              name: config.debugName ?? null,
            })
            config.onPressOut?.(e)
            releaseOwnership()
          } else {
            debugPress('tap-finalize-skipped', {
              id: myDebugId,
              name: config.debugName ?? null,
              ownerId: pressState.ownerId,
            })
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
          debugPress('long-press-begin', {
            id: myDebugId,
            name: config.debugName ?? null,
            ownerId: pressState.ownerId,
          })
          setTimeout(() => {
            if (isOwner()) {
              debugPress('long-press-in', {
                id: myDebugId,
                name: config.debugName ?? null,
              })
              config.onPressIn?.(e)
            } else {
              debugPress('long-press-in-skipped', {
                id: myDebugId,
                name: config.debugName ?? null,
                ownerId: pressState.ownerId,
              })
            }
          }, GRACE_PERIOD_MS + 1)
        })
        .onStart((e: any) => {
          if (isOwner()) {
            debugPress('long-press', {
              id: myDebugId,
              name: config.debugName ?? null,
            })
            config.onLongPress?.(e)
          } else {
            debugPress('long-press-skipped', {
              id: myDebugId,
              name: config.debugName ?? null,
              ownerId: pressState.ownerId,
            })
          }
        })
        .onFinalize((e: any) => {
          if (isOwner()) {
            debugPress('long-press-finalize', {
              id: myDebugId,
              name: config.debugName ?? null,
            })
            config.onPressOut?.(e)
            releaseOwnership()
          } else {
            debugPress('long-press-finalize-skipped', {
              id: myDebugId,
              name: config.debugName ?? null,
              ownerId: pressState.ownerId,
            })
          }
        })

      if (config.hitSlop) longPress.hitSlop(config.hitSlop)

      // exclusive: longPress has priority, tap is fallback for quick presses
      return Gesture.Exclusive(longPress, tap)
    },
  }
}
