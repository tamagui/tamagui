/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  ResponderEvent,
  TouchHistory,
} from '@tamagui/react-native-use-responder-events'

import type {
  PanResponderConfig,
  PanResponderGestureState,
  PanResponderHandlers,
  PanResponderInstance,
} from './types'
import {
  currentCentroidX,
  currentCentroidXOfTouchesChangedAfter,
  currentCentroidY,
  currentCentroidYOfTouchesChangedAfter,
  previousCentroidXOfTouchesChangedAfter,
  previousCentroidYOfTouchesChangedAfter,
} from './TouchHistoryMath'

// react-native types the callbacks with its own synthetic event, which is what
// callers write against. the responder system hands us its own event, and the
// only field this reads off it is `touchHistory`.
type Handler = (event: ResponderEvent) => any

function initializeGestureState(gestureState: PanResponderGestureState) {
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
}

function updateGestureStateOnMove(
  gestureState: PanResponderGestureState,
  touchHistory: TouchHistory
) {
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
}

/**
 * The same PanResponder react-native ships, over the responder system in
 * `@tamagui/react-native-use-responder-events`, so a drag can be written once
 * and behave the same on both platforms without the web build importing
 * react-native.
 *
 * `create` returns `panHandlers`, which go straight into `useResponderEvents`,
 * except `onClickCapture`: it is a plain React prop that swallows the click a
 * finished drag would otherwise fire.
 */
export const PanResponder = {
  create(config: PanResponderConfig): PanResponderInstance {
    // a drag ends with a click the caller never wanted, so grant arms a
    // suppressor and release disarms it a beat later
    const clickState = {
      shouldCancelClick: false,
      timeout: undefined as ReturnType<typeof setTimeout> | undefined,
    }

    const gestureState: PanResponderGestureState = {
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

    const call = (
      callback: ((event: any, gestureState: PanResponderGestureState) => any) | undefined,
      event: ResponderEvent
    ) => callback?.(event, gestureState)

    const panHandlers: Record<string, Handler> = {
      onStartShouldSetResponder(event) {
        return config.onStartShouldSetPanResponder == null
          ? false
          : call(config.onStartShouldSetPanResponder, event)
      },

      onMoveShouldSetResponder(event) {
        return config.onMoveShouldSetPanResponder == null
          ? false
          : call(config.onMoveShouldSetPanResponder, event)
      },

      onStartShouldSetResponderCapture(event) {
        if (event.nativeEvent.touches.length === 1) {
          initializeGestureState(gestureState)
        }
        gestureState.numberActiveTouches = event.touchHistory.numberActiveTouches
        return config.onStartShouldSetPanResponderCapture != null
          ? call(config.onStartShouldSetPanResponderCapture, event)
          : false
      },

      onMoveShouldSetResponderCapture(event) {
        const touchHistory = event.touchHistory
        if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
          return false
        }
        updateGestureStateOnMove(gestureState, touchHistory)
        return config.onMoveShouldSetPanResponderCapture
          ? call(config.onMoveShouldSetPanResponderCapture, event)
          : false
      },

      onResponderGrant(event) {
        clearTimeout(clickState.timeout)
        clickState.shouldCancelClick = true
        gestureState.x0 = currentCentroidX(event.touchHistory)
        gestureState.y0 = currentCentroidY(event.touchHistory)
        gestureState.dx = 0
        gestureState.dy = 0
        call(config.onPanResponderGrant, event)
        return config.onShouldBlockNativeResponder == null
          ? true
          : call(config.onShouldBlockNativeResponder, event)
      },

      onResponderReject(event) {
        call(config.onPanResponderReject, event)
      },

      onResponderRelease(event) {
        call(config.onPanResponderRelease, event)
        allowClicksAgainSoon()
        initializeGestureState(gestureState)
      },

      onResponderStart(event) {
        gestureState.numberActiveTouches = event.touchHistory.numberActiveTouches
        call(config.onPanResponderStart, event)
      },

      onResponderMove(event) {
        const touchHistory = event.touchHistory
        if (gestureState._accountsForMovesUpTo === touchHistory.mostRecentTimeStamp) {
          return
        }
        updateGestureStateOnMove(gestureState, touchHistory)
        call(config.onPanResponderMove, event)
      },

      onResponderEnd(event) {
        gestureState.numberActiveTouches = event.touchHistory.numberActiveTouches
        call(config.onPanResponderEnd, event)
      },

      onResponderTerminate(event) {
        call(config.onPanResponderTerminate, event)
        allowClicksAgainSoon()
        initializeGestureState(gestureState)
      },

      onResponderTerminationRequest(event) {
        return config.onPanResponderTerminationRequest == null
          ? true
          : call(config.onPanResponderTerminationRequest, event)
      },

      onClickCapture(event: any) {
        if (clickState.shouldCancelClick === true) {
          event.stopPropagation()
          event.preventDefault()
        }
      },
    }

    function allowClicksAgainSoon() {
      clickState.timeout = setTimeout(() => {
        clickState.shouldCancelClick = false
      }, 250)
    }

    return { panHandlers: panHandlers as unknown as PanResponderHandlers }
  },
}
