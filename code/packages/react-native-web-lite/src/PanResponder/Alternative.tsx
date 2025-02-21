

import { InteractionManager } from '@tamagui/react-native-web-internals'

import TouchHistoryMath from '../vendor/react-native/TouchHistoryMath/index'

type PressEvent = any

export type GestureState = {
  // ID of the gestureState; persisted as long as there's a pointer on screen
  stateID: number
  // The latest screen coordinates of the gesture
  x: number
  // The latest screen coordinates of the gesture
  y: number
  // The screen coordinates of the responder grant
  initialX: number
  // The screen coordinates of the responder grant
  initialY: number
  // Accumulated distance of the gesture since it started
  deltaX: number
  // Accumulated distance of the gesture since it started
  deltaY: number
  // Current velocity of the gesture
  velocityX: number
  // Current velocity of the gesture
  velocityY: number
  // Number of touches currently on screen
  numberActiveTouches: number
  _accountsForMovesUpTo: number
}

type ActiveCallback = (event: PressEvent, gestureState: GestureState) => boolean
type PassiveCallback = (event: PressEvent, gestureState: GestureState) => void

type PanResponderConfig = {
  // Negotiate for the responder
  readonly onMoveShouldSetResponder?: ActiveCallback | null
  readonly onMoveShouldSetResponderCapture?: ActiveCallback | null
  readonly onStartShouldSetResponder?: ActiveCallback | null
  readonly onStartShouldSetResponderCapture?: ActiveCallback | null
  readonly onPanTerminationRequest?: ActiveCallback | null
  // Gesture started
  readonly onPanGrant?: PassiveCallback | null
  // Gesture rejected
  readonly onPanReject?: PassiveCallback | null
  // A pointer touched the screen
  readonly onPanStart?: PassiveCallback | null
  // A pointer moved
  readonly onPanMove?: PassiveCallback | null
  // A pointer was removed from the screen
  readonly onPanEnd?: PassiveCallback | null
  // All pointers removed, gesture successful
  readonly onPanRelease?: PassiveCallback | null
  // Gesture cancelled
  readonly onPanTerminate?: PassiveCallback | null
}

const {
  currentCentroidX,
  currentCentroidY,
  currentCentroidXOfTouchesChangedAfter,
  currentCentroidYOfTouchesChangedAfter,
  previousCentroidXOfTouchesChangedAfter,
  previousCentroidYOfTouchesChangedAfter,
} = TouchHistoryMath

const PanResponder = {
  _initializeGestureState(gestureState: GestureState) {
    gestureState.x = 0
    gestureState.y = 0
    gestureState.initialX = 0
    gestureState.initialY = 0
    gestureState.deltaX = 0
    gestureState.deltaY = 0
    gestureState.velocityX = 0
    gestureState.velocityY = 0
    gestureState.numberActiveTouches = 0
    // All `gestureState` accounts for timeStamps up until:
    gestureState._accountsForMovesUpTo = 0
  },

  /**
   * Take all recently moved touches, calculate how the centroid has changed just for those
   * recently moved touches, and append that change to an accumulator. This is
   * to (at least) handle the case where the user is moving three fingers, and
   * then one of the fingers stops but the other two continue.
   *
   * This is very different than taking all of the recently moved touches and
   * storing their centroid as `dx/dy`. For correctness, we must *accumulate
   * changes* in the centroid of recently moved touches.
   *
   * There is also some nuance with how we handle multiple moved touches in a
   * single event. Multiple touches generate two 'move' events, each of
   * them triggering `onResponderMove`. But with the way `PanResponder` works,
   * all of the gesture inference is performed on the first dispatch, since it
   * looks at all of the touches. Therefore, `PanResponder` does not call
   * `onResponderMove` passed the first dispatch. This diverges from the
   * typical responder callback pattern (without using `PanResponder`), but
   * avoids more dispatches than necessary.
   *
   * When moving two touches in opposite directions, the cumulative
   * distance is zero in each dimension. When two touches move in parallel five
   * pixels in the same direction, the cumulative distance is five, not ten. If
   * two touches start, one moves five in a direction, then stops and the other
   * touch moves fives in the same direction, the cumulative distance is ten.
   *
   * This logic requires a kind of processing of time "clusters" of touch events
   * so that two touch moves that essentially occur in parallel but move every
   * other frame respectively, are considered part of the same movement.
   *
   * x/y: If a move event has been observed, `(x, y)` is the centroid of the most
   * recently moved "cluster" of active touches.
   * deltaX/deltaY: Cumulative touch distance. Accounts for touch moves that are
   * clustered together in time, moving the same direction. Only valid when
   * currently responder (otherwise, it only represents the drag distance below
   * the threshold).
   */
  _updateGestureStateOnMove(
    gestureState: GestureState,
    touchHistory: PressEvent['touchHistory']
  ) {
    const movedAfter = gestureState._accountsForMovesUpTo
    const prevX = previousCentroidXOfTouchesChangedAfter(touchHistory, movedAfter)
    const prevY = previousCentroidYOfTouchesChangedAfter(touchHistory, movedAfter)
    const prevDeltaX = gestureState.deltaX
    const prevDeltaY = gestureState.deltaY

    const x = currentCentroidXOfTouchesChangedAfter(touchHistory, movedAfter)
    const y = currentCentroidYOfTouchesChangedAfter(touchHistory, movedAfter)
    const deltaX = prevDeltaX + (x - prevX)
    const deltaY = prevDeltaY + (y - prevY)
    // TODO: This must be filtered intelligently.
    const dt = touchHistory.mostRecentTimeStamp - gestureState._accountsForMovesUpTo

    gestureState.deltaX = deltaX
    gestureState.deltaY = deltaY
    gestureState.numberActiveTouches = touchHistory.numberActiveTouches
    gestureState.velocityX = (deltaX - prevDeltaX) / dt
    gestureState.velocityY = (deltaY - prevDeltaY) / dt
    gestureState.x = x
    gestureState.y = y
    gestureState._accountsForMovesUpTo = touchHistory.mostRecentTimeStamp
  },

  /**
   * Enhanced versions of all of the responder callbacks that provide not only
   * the `ResponderEvent`, but also the `PanResponder` gesture state.
   *
   * In general, for events that have capture equivalents, we update the
   * gestureState once in the capture phase and can use it in the bubble phase
   * as well.
   */
  create(config: PanResponderConfig): {
    getInteractionHandle: () => number | null
    panHandlers: {
      onMoveShouldSetResponder: (event: PressEvent) => boolean
      onMoveShouldSetResponderCapture: (event: PressEvent) => boolean
      onResponderEnd: (event: PressEvent) => void
      onResponderGrant: (event: PressEvent) => void
      onResponderMove: (event: PressEvent) => void
      onResponderReject: (event: PressEvent) => void
      onResponderRelease: (event: PressEvent) => void
      onResponderStart: (event: PressEvent) => void
      onResponderTerminate: (event: PressEvent) => void
      onResponderTerminationRequest: (event: PressEvent) => boolean
      onStartShouldSetResponder: (event: PressEvent) => boolean
      onStartShouldSetResponderCapture: (event: PressEvent) => boolean
    }
  } {
    const interactionState = {
      handle: null as number | null,
    }
    const gestureState: GestureState = {
      // Useful for debugging
      stateID: Math.random(),
      x: 0,
      y: 0,
      initialX: 0,
      initialY: 0,
      deltaX: 0,
      deltaY: 0,
      velocityX: 0,
      velocityY: 0,
      numberActiveTouches: 0,
      _accountsForMovesUpTo: 0,
    }

    const {
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture,
      onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture,
      onPanGrant,
      onPanStart,
      onPanMove,
      onPanEnd,
      onPanRelease,
      onPanReject,
      onPanTerminate,
      onPanTerminationRequest,
    } = config

    const panHandlers = {
      onStartShouldSetResponder(event: PressEvent): boolean {
        return onStartShouldSetResponder != null
          ? onStartShouldSetResponder(event, gestureState)
          : false
      },
      onMoveShouldSetResponder(event: PressEvent): boolean {
        return onMoveShouldSetResponder != null
          ? onMoveShouldSetResponder(event, gestureState)
          : false
      },
      onStartShouldSetResponderCapture(event: PressEvent): boolean {
        // TODO: Actually, we should reinitialize the state any time
        // touches.length increases from 0 active to > 0 active.
        if (event.nativeEvent.touches.length === 1) {
          PanResponder._initializeGestureState(gestureState)
        }
        gestureState.numberActiveTouches = event.touchHistory.numberActiveTouches
        return onStartShouldSetResponderCapture != null
          ? onStartShouldSetResponderCapture(event, gestureState)
          : false
      },

      onMoveShouldSetResponderCapture(event: PressEvent): boolean {
        const touchHistory = event.touchHistory
        // Responder system incorrectly dispatches should* to current responder
        // Filter out any touch moves past the first one - we would have
        // already processed multi-touch geometry during the first event.
        // NOTE: commented out because new responder system should get it right.
        //if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
        //  return false;
        //}
        PanResponder._updateGestureStateOnMove(gestureState, touchHistory)
        return onMoveShouldSetResponderCapture != null
          ? onMoveShouldSetResponderCapture(event, gestureState)
          : false
      },

      onResponderGrant(event: PressEvent): void {
        if (!interactionState.handle) {
          interactionState.handle = InteractionManager.createInteractionHandle()
        }
        gestureState.initialX = currentCentroidX(event.touchHistory)
        gestureState.initialY = currentCentroidY(event.touchHistory)
        gestureState.deltaX = 0
        gestureState.deltaY = 0
        if (onPanGrant != null) {
          onPanGrant(event, gestureState)
        }
      },

      onResponderReject(event: PressEvent): void {
        // @ts-ignore
        clearInteractionHandle(interactionState, onPanReject, event, gestureState)
      },

      onResponderStart(event: PressEvent): void {
        const { numberActiveTouches } = event.touchHistory
        gestureState.numberActiveTouches = numberActiveTouches
        if (onPanStart != null) {
          onPanStart(event, gestureState)
        }
      },

      onResponderMove(event: PressEvent): void {
        const touchHistory = event.touchHistory
        // Guard against the dispatch of two touch moves when there are two
        // simultaneously changed touches.
        if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
          return
        }
        // Filter out any touch moves past the first one - we would have
        // already processed multi-touch geometry during the first event.
        PanResponder._updateGestureStateOnMove(gestureState, touchHistory)
        if (onPanMove != null) {
          onPanMove(event, gestureState)
        }
      },

      onResponderEnd(event: PressEvent): void {
        const { numberActiveTouches } = event.touchHistory
        gestureState.numberActiveTouches = numberActiveTouches
        // @ts-ignore
        clearInteractionHandle(interactionState, onPanEnd, event, gestureState)
      },

      onResponderRelease(event: PressEvent): void {
        // @ts-ignore
        clearInteractionHandle(interactionState, onPanRelease, event, gestureState)
        PanResponder._initializeGestureState(gestureState)
      },

      onResponderTerminate(event: PressEvent): void {
        // @ts-ignore
        clearInteractionHandle(interactionState, onPanTerminate, event, gestureState)
        PanResponder._initializeGestureState(gestureState)
      },

      onResponderTerminationRequest(event: PressEvent): boolean {
        return onPanTerminationRequest != null
          ? onPanTerminationRequest(event, gestureState)
          : true
      },
    }
    return {
      panHandlers,
      getInteractionHandle(): number | null {
        return interactionState.handle
      },
    }
  },
}

function clearInteractionHandle(
  interactionState: {
    handle: number | null
  },
  callback: ActiveCallback | PassiveCallback | null,
  event: PressEvent,
  gestureState: GestureState
) {
  if (interactionState.handle) {
    InteractionManager.clearInteractionHandle(interactionState.handle)
    interactionState.handle = null
  }
  if (callback) {
    callback(event, gestureState)
  }
}

export default PanResponder
