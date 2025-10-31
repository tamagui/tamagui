/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const currentCentroidXOfTouchesChangedAfter = () => 0
const currentCentroidYOfTouchesChangedAfter = () => 0
const previousCentroidXOfTouchesChangedAfter = () => 0
const previousCentroidYOfTouchesChangedAfter = () => 0

const PanResponder = {
  _initializeGestureState(gestureState) {
    gestureState.moveX = 0
    gestureState.moveY = 0
    gestureState.x0 = 0
    gestureState.y0 = 0
    gestureState.dx = 0
    gestureState.dy = 0
    gestureState.vx = 0
    gestureState.vy = 0
    gestureState.numberActiveTouches = 0
    gestureState._accountsForMovesUpTo = 0
  },

  _updateGestureStateOnMove(gestureState, touchHistory) {
    gestureState.numberActiveTouches = touchHistory.numberActiveTouches
    gestureState.moveX = currentCentroidXOfTouchesChangedAfter(
      touchHistory,
      gestureState._accountsForMovesUpTo
    )
    gestureState.moveY = currentCentroidYOfTouchesChangedAfter(
      touchHistory,
      gestureState._accountsForMovesUpTo
    )
    const movedAfter = gestureState._accountsForMovesUpTo
    const prevX = previousCentroidXOfTouchesChangedAfter(touchHistory, movedAfter)
    const prevY = previousCentroidYOfTouchesChangedAfter(touchHistory, movedAfter)
    const nextDX = gestureState.dx + (gestureState.moveX - prevX)
    const nextDY = gestureState.dy + (gestureState.moveY - prevY)

    const dt = touchHistory.mostRecentTimeStamp - gestureState._accountsForMovesUpTo

    gestureState.vx = (nextDX - gestureState.dx) / dt
    gestureState.vy = (nextDY - gestureState.dy) / dt

    gestureState.dx = nextDX
    gestureState.dy = nextDY
    gestureState._accountsForMovesUpTo = touchHistory.mostRecentTimeStamp
  },

  create(config) {
    const interactionState = {
      handle: null,
    }

    const gestureState = {
      stateID: Math.random(),
      moveX: 0,
      moveY: 0,
      x0: 0,
      y0: 0,
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0,
      numberActiveTouches: 0,
      _accountsForMovesUpTo: 0,
    }

    const panHandlers = {
      onStartShouldSetResponder: (evt) => {
        return config.onStartShouldSetPanResponder
          ? config.onStartShouldSetPanResponder(evt, gestureState)
          : false
      },
      onMoveShouldSetResponder: (evt) => {
        return config.onMoveShouldSetPanResponder
          ? config.onMoveShouldSetPanResponder(evt, gestureState)
          : false
      },
      onResponderGrant: (evt) => {
        this._initializeGestureState(gestureState)
        gestureState.x0 = evt.nativeEvent.pageX || 0
        gestureState.y0 = evt.nativeEvent.pageY || 0
        if (config.onPanResponderGrant) {
          config.onPanResponderGrant(evt, gestureState)
        }
      },
      onResponderMove: (evt) => {
        if (evt.nativeEvent.touches && evt.nativeEvent.touches.length === 1) {
          this._updateGestureStateOnMove(gestureState, evt.nativeEvent)
        }
        if (config.onPanResponderMove) {
          config.onPanResponderMove(evt, gestureState)
        }
      },
      onResponderRelease: (evt) => {
        if (config.onPanResponderRelease) {
          config.onPanResponderRelease(evt, gestureState)
        }
        if (interactionState.handle) {
          interactionState.handle = null
        }
      },
      onResponderTerminate: (evt) => {
        if (config.onPanResponderTerminate) {
          config.onPanResponderTerminate(evt, gestureState)
        }
        if (interactionState.handle) {
          interactionState.handle = null
        }
      },
      onResponderTerminationRequest: (evt) => {
        return config.onPanResponderTerminationRequest
          ? config.onPanResponderTerminationRequest(evt, gestureState)
          : true
      },
    }

    return {
      panHandlers,
      getInteractionHandle() {
        return interactionState.handle
      },
    }
  },
}

export { PanResponder }
export default PanResponder
