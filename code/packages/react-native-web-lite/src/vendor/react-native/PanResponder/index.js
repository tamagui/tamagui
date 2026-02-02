/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { InteractionManager } from '@tamagui/react-native-web-internals'
import TouchHistoryMath from '../TouchHistoryMath/index'

const currentCentroidXOfTouchesChangedAfter =
  TouchHistoryMath.currentCentroidXOfTouchesChangedAfter
const currentCentroidYOfTouchesChangedAfter =
  TouchHistoryMath.currentCentroidYOfTouchesChangedAfter
const previousCentroidXOfTouchesChangedAfter =
  TouchHistoryMath.previousCentroidXOfTouchesChangedAfter
const previousCentroidYOfTouchesChangedAfter =
  TouchHistoryMath.previousCentroidYOfTouchesChangedAfter
const currentCentroidX = TouchHistoryMath.currentCentroidX
const currentCentroidY = TouchHistoryMath.currentCentroidY

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
    const x = currentCentroidXOfTouchesChangedAfter(touchHistory, movedAfter)
    const prevY = previousCentroidYOfTouchesChangedAfter(touchHistory, movedAfter)
    const y = currentCentroidYOfTouchesChangedAfter(touchHistory, movedAfter)
    const nextDX = gestureState.dx + (x - prevX)
    const nextDY = gestureState.dy + (y - prevY)

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
      shouldCancelClick: false,
      timeout: null,
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
      onStartShouldSetResponder(event) {
        return config.onStartShouldSetPanResponder == null
          ? false
          : config.onStartShouldSetPanResponder(event, gestureState)
      },

      onMoveShouldSetResponder(event) {
        return config.onMoveShouldSetPanResponder == null
          ? false
          : config.onMoveShouldSetPanResponder(event, gestureState)
      },

      onStartShouldSetResponderCapture(event) {
        if (event.nativeEvent.touches.length === 1) {
          PanResponder._initializeGestureState(gestureState)
        }
        gestureState.numberActiveTouches = event.touchHistory.numberActiveTouches
        return config.onStartShouldSetPanResponderCapture != null
          ? config.onStartShouldSetPanResponderCapture(event, gestureState)
          : false
      },

      onMoveShouldSetResponderCapture(event) {
        const touchHistory = event.touchHistory
        if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
          return false
        }
        PanResponder._updateGestureStateOnMove(gestureState, touchHistory)
        return config.onMoveShouldSetPanResponderCapture
          ? config.onMoveShouldSetPanResponderCapture(event, gestureState)
          : false
      },

      onResponderGrant(event) {
        if (!interactionState.handle) {
          interactionState.handle = InteractionManager.createInteractionHandle()
        }
        if (interactionState.timeout) {
          clearInteractionTimeout(interactionState)
        }
        interactionState.shouldCancelClick = true
        gestureState.x0 = currentCentroidX(event.touchHistory)
        gestureState.y0 = currentCentroidY(event.touchHistory)
        gestureState.dx = 0
        gestureState.dy = 0
        if (config.onPanResponderGrant) {
          config.onPanResponderGrant(event, gestureState)
        }
        return config.onShouldBlockNativeResponder == null
          ? true
          : config.onShouldBlockNativeResponder(event, gestureState)
      },

      onResponderReject(event) {
        clearInteractionHandle(
          interactionState,
          config.onPanResponderReject,
          event,
          gestureState
        )
      },

      onResponderRelease(event) {
        clearInteractionHandle(
          interactionState,
          config.onPanResponderRelease,
          event,
          gestureState
        )
        setInteractionTimeout(interactionState)
        PanResponder._initializeGestureState(gestureState)
      },

      onResponderStart(event) {
        const touchHistory = event.touchHistory
        gestureState.numberActiveTouches = touchHistory.numberActiveTouches
        if (config.onPanResponderStart) {
          config.onPanResponderStart(event, gestureState)
        }
      },

      onResponderMove(event) {
        const touchHistory = event.touchHistory
        if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
          return
        }
        PanResponder._updateGestureStateOnMove(gestureState, touchHistory)
        if (config.onPanResponderMove) {
          config.onPanResponderMove(event, gestureState)
        }
      },

      onResponderEnd(event) {
        const touchHistory = event.touchHistory
        gestureState.numberActiveTouches = touchHistory.numberActiveTouches
        clearInteractionHandle(
          interactionState,
          config.onPanResponderEnd,
          event,
          gestureState
        )
      },

      onResponderTerminate(event) {
        clearInteractionHandle(
          interactionState,
          config.onPanResponderTerminate,
          event,
          gestureState
        )
        setInteractionTimeout(interactionState)
        PanResponder._initializeGestureState(gestureState)
      },

      onResponderTerminationRequest(event) {
        return config.onPanResponderTerminationRequest == null
          ? true
          : config.onPanResponderTerminationRequest(event, gestureState)
      },

      onClickCapture: (event) => {
        if (interactionState.shouldCancelClick === true) {
          event.stopPropagation()
          event.preventDefault()
        }
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

function clearInteractionHandle(interactionState, callback, event, gestureState) {
  if (interactionState.handle) {
    InteractionManager.clearInteractionHandle(interactionState.handle)
    interactionState.handle = null
  }
  if (callback) {
    callback(event, gestureState)
  }
}

function clearInteractionTimeout(interactionState) {
  clearTimeout(interactionState.timeout)
}

function setInteractionTimeout(interactionState) {
  interactionState.timeout = setTimeout(() => {
    interactionState.shouldCancelClick = false
  }, 250)
}

export { PanResponder }
export default PanResponder
