import { createGlobalState } from './globalState'
import type { GestureState } from './types'

const state = createGlobalState<GestureState>(`gesture`, {
  enabled: false,
  Gesture: null,
  GestureDetector: null,
  ScrollView: null,
  RootView: null,
})

type GestureEnabledFreezeState = {
  frozen: boolean
  enabled: boolean
  warned: boolean
}

const GESTURE_ENABLED_FREEZE_KEY = '__tamagui_gesture_enabled_freeze__'

function getGestureEnabledFreezeState(): GestureEnabledFreezeState {
  const g = globalThis as typeof globalThis & {
    [GESTURE_ENABLED_FREEZE_KEY]?: GestureEnabledFreezeState
  }

  if (!g[GESTURE_ENABLED_FREEZE_KEY]) {
    g[GESTURE_ENABLED_FREEZE_KEY] = {
      frozen: false,
      enabled: false,
      warned: false,
    }
  }

  return g[GESTURE_ENABLED_FREEZE_KEY]!
}

function warnGestureEnabledMutationIgnored(source: string) {
  const freezeState = getGestureEnabledFreezeState()

  if (freezeState.warned || process.env.NODE_ENV === 'production') {
    return
  }

  freezeState.warned = true

  console.warn(
    `[Tamagui] Ignored ${source} because gesture handler press events were already ` +
      `${freezeState.enabled ? 'enabled' : 'disabled'} when TamaguiProvider mounted. ` +
      `Configure gesture handler mode before the first render.`
  )
}

export function canChangeGestureHandlerEnabled(
  nextEnabled: boolean,
  source: string
): boolean {
  const freezeState = getGestureEnabledFreezeState()

  if (!freezeState.frozen || freezeState.enabled === nextEnabled) {
    return true
  }

  warnGestureEnabledMutationIgnored(source)
  return false
}

let pressGestureDebugId = 0
let externalPressDebugId = 0

// distance in dp the finger may travel before a press is treated as a
// scroll/drag and cancelled. tracked in absolute (screen) coordinates by the
// Tap's onTouchesMove (see createPressGesture) so a view translating under a
// stationary finger - a sheet sliding on keyboard open/close, a sheet open
// animation - does not cancel the press; only genuine finger travel does.
// this also makes scroll-cancels-press work for any scroll container (a plain
// RN ScrollView/FlatList or an RNGH one), since the press cancels itself
// rather than relying on a parent RNGH gesture to steal it.
const PRESS_MOVE_CANCEL_DISTANCE = 12
const PRESS_MOVE_CANCEL_DISTANCE_SQ =
  PRESS_MOVE_CANCEL_DISTANCE * PRESS_MOVE_CANCEL_DISTANCE

// minimal shapes of the RNGH gesture events createPressGesture reads. RNGH is
// injected at runtime (GestureState.Gesture is untyped), so this module keeps
// no type dependency on react-native-gesture-handler - these name just the
// fields the press gesture touches.
type GesturePoint = {
  absoluteX: number
  absoluteY: number
}
type GestureBeginEvent = Partial<GesturePoint>
type GestureTouchEvent = {
  changedTouches?: GesturePoint[]
  allTouches?: GesturePoint[]
}

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
      if (
        updates.enabled !== undefined &&
        !canChangeGestureHandlerEnabled(updates.enabled, 'getGestureHandler().set()')
      ) {
        return
      }

      Object.assign(state.get(), updates)
    },

    disable(): void {
      if (!canChangeGestureHandlerEnabled(false, 'getGestureHandler().disable()')) {
        return
      }

      state.get().enabled = false
    },

    createPressGesture(config: PressGestureConfig): any {
      const { Gesture } = state.get()
      if (!Gesture) return null

      const longPressDuration = config.delayLongPress ?? 500

      // unique token for this gesture instance - used to track ownership
      const myToken = {}
      const myDebugId = ++pressGestureDebugId
      // mutable gesture state kept on an object so handler bodies that get
      // workletized by react-native-worklets (>=0.7.4) see live values.
      // primitive `let`s get frozen into the worklet's serialized __closure
      // at factory time, so reassignments from workletized handlers never
      // propagate out. object property mutation goes through the captured
      // reference and is always observed.
      const flags = {
        didLongPress: false,
        didPressIn: false,
        pressInTimer: null as ReturnType<typeof setTimeout> | null,
        // absolute (screen) coords of the press start, and whether the finger
        // has since travelled far enough to be treated as a scroll/drag.
        moveStartX: null as number | null,
        moveStartY: 0,
        cancelledByMove: false,
      }

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
        if (flags.pressInTimer) {
          clearTimeout(flags.pressInTimer)
          flags.pressInTimer = null
        }
        if (pressState.owner === myToken) {
          resetPressOwner()
        }
      }

      const firePressIn = (e: any) => {
        if (!flags.didPressIn && isOwner()) {
          flags.didPressIn = true
          config.onPressIn?.(e)
        }
      }

      const schedulePressIn = (e: any) => {
        if (flags.pressInTimer) {
          clearTimeout(flags.pressInTimer)
        }
        flags.pressInTimer = setTimeout(() => {
          flags.pressInTimer = null
          if (isOwner()) {
            firePressIn(e)
          }
        }, GRACE_PERIOD_MS + 1)
      }

      // Tap gesture for regular presses.
      //
      // maxDuration is long so long-presses aren't cut off. We deliberately do
      // not use RNGH's .maxDistance(): it measures finger travel in the gesture
      // view's own coordinate space, so a view that translates under a
      // stationary finger (a sheet sliding on keyboard open/close, a sheet open
      // animation) reads as finger movement and silently cancels the press -
      // onPress never fires. Instead onTouchesMove tracks the finger in
      // absolute (screen) coordinates and cancels only on genuine finger
      // travel. That also makes scroll-cancels-press work for any scroll
      // container, since the press cancels itself instead of depending on a
      // parent RNGH gesture to steal the touch.
      const tap = Gesture.Tap()
        .runOnJS(true)
        .maxDuration(10000) // allow very long presses
        .onBegin((e: GestureBeginEvent) => {
          flags.didLongPress = false
          flags.didPressIn = false
          flags.cancelledByMove = false
          flags.moveStartX = typeof e.absoluteX === 'number' ? e.absoluteX : null
          flags.moveStartY = typeof e.absoluteY === 'number' ? e.absoluteY : 0
          tryClaimOwnership(e)
          // Defer onPressIn until after the grace window so child pressables
          // can steal ownership, but flush it on tap end for very fast taps.
          schedulePressIn(e)
        })
        .onTouchesMove((e: GestureTouchEvent) => {
          if (flags.cancelledByMove || flags.moveStartX === null) return
          const touch = e.changedTouches?.[0] ?? e.allTouches?.[0]
          if (!touch) return
          const dx = touch.absoluteX - flags.moveStartX
          const dy = touch.absoluteY - flags.moveStartY
          if (dx * dx + dy * dy <= PRESS_MOVE_CANCEL_DISTANCE_SQ) return
          // finger has travelled far enough to be a scroll/drag, not a tap.
          // release the pressStyle now (mid-scroll, so it doesn't stay stuck)
          // and make onEnd skip onPress on finger lift.
          flags.cancelledByMove = true
          if (flags.pressInTimer) {
            clearTimeout(flags.pressInTimer)
            flags.pressInTimer = null
          }
          if (flags.didPressIn) {
            flags.didPressIn = false
            config.onPressOut?.(e)
          }
          releaseOwnership()
        })
        .onEnd((e: unknown) => {
          if (isOwner() && !flags.didLongPress && !flags.cancelledByMove) {
            firePressIn(e)
            config.onPress?.(e)
          }
        })
        .onFinalize((e: unknown) => {
          if (isOwner()) {
            config.onPressOut?.(e)
            releaseOwnership()
          } else if (flags.didPressIn) {
            // we already fired onPressIn but lost ownership before finalize
            // (e.g. finger dragged onto a sibling pressable and that one
            // claimed ownership). fire onPressOut so callers can clear their
            // press state - otherwise pressStyle stays stuck on this view.
            flags.didPressIn = false
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
          flags.didLongPress = true
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
