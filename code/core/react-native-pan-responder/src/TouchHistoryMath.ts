/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { TouchHistory } from '@tamagui/react-native-use-responder-events'

export const noCentroid = -1

/**
 * Centroid of the touches that moved after `touchesChangedAfter`, in one
 * dimension. `ofCurrent` picks the current position over the previous one, so
 * the two together give the delta a pan is built from.
 */
function centroidDimension(
  touchHistory: TouchHistory,
  touchesChangedAfter: number,
  isXAxis: boolean,
  ofCurrent: boolean
): number {
  const touchBank = touchHistory.touchBank
  let total = 0
  let count = 0

  const oneTouchData =
    touchHistory.numberActiveTouches === 1
      ? touchHistory.touchBank[touchHistory.indexOfSingleActiveTouch]
      : null

  if (oneTouchData !== null) {
    if (oneTouchData.touchActive && oneTouchData.currentTimeStamp > touchesChangedAfter) {
      total +=
        ofCurrent && isXAxis
          ? oneTouchData.currentPageX
          : ofCurrent && !isXAxis
            ? oneTouchData.currentPageY
            : !ofCurrent && isXAxis
              ? oneTouchData.previousPageX
              : oneTouchData.previousPageY
      count = 1
    }
  } else {
    for (let i = 0; i < touchBank.length; i++) {
      const touchTrack = touchBank[i]
      if (
        touchTrack !== null &&
        touchTrack !== undefined &&
        touchTrack.touchActive &&
        touchTrack.currentTimeStamp >= touchesChangedAfter
      ) {
        let toAdd: number
        if (ofCurrent && isXAxis) {
          toAdd = touchTrack.currentPageX
        } else if (ofCurrent && !isXAxis) {
          toAdd = touchTrack.currentPageY
        } else if (!ofCurrent && isXAxis) {
          toAdd = touchTrack.previousPageX
        } else {
          toAdd = touchTrack.previousPageY
        }
        total += toAdd
        count++
      }
    }
  }

  return count > 0 ? total / count : noCentroid
}

export function currentCentroidXOfTouchesChangedAfter(
  touchHistory: TouchHistory,
  touchesChangedAfter: number
): number {
  return centroidDimension(touchHistory, touchesChangedAfter, true, true)
}

export function currentCentroidYOfTouchesChangedAfter(
  touchHistory: TouchHistory,
  touchesChangedAfter: number
): number {
  return centroidDimension(touchHistory, touchesChangedAfter, false, true)
}

export function previousCentroidXOfTouchesChangedAfter(
  touchHistory: TouchHistory,
  touchesChangedAfter: number
): number {
  return centroidDimension(touchHistory, touchesChangedAfter, true, false)
}

export function previousCentroidYOfTouchesChangedAfter(
  touchHistory: TouchHistory,
  touchesChangedAfter: number
): number {
  return centroidDimension(touchHistory, touchesChangedAfter, false, false)
}

export function currentCentroidX(touchHistory: TouchHistory): number {
  return centroidDimension(touchHistory, 0, true, true)
}

export function currentCentroidY(touchHistory: TouchHistory): number {
  return centroidDimension(touchHistory, 0, false, true)
}
