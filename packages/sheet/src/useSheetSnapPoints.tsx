import { useEffect, useMemo } from 'react'

import { SheetContextValue } from './useSheetProviderProps'

export const useSheetSnapPoints = ({
  position,
  setPosition,
  dismissOnSnapToBottom,
  snapPoints,
  setPositionImmediate,
  open,
  frameSize,
}: SheetContextValue) => {
  if (process.env.NODE_ENV === 'development') {
    if (snapPoints.some((p) => p < 0 || p > 100)) {
      console.warn(
        '⚠️ Invalid snapPoint given, snapPoints must be between 0 and 100, equal to percent height of frame'
      )
    }
  }

  // reset position to fully open on re-open after dismissOnSnapToBottom
  if (open && dismissOnSnapToBottom && position === snapPoints.length - 1) {
    setPositionImmediate(0)
  }

  // open must set position
  const shouldSetPositionOpen = open && position < 0
  useEffect(() => {
    if (shouldSetPositionOpen) {
      setPosition(0)
    }
  }, [setPosition, shouldSetPositionOpen])

  const maxSnapPoint = snapPoints.reduce((prev, cur) => Math.max(prev, cur))
  const screenSize = frameSize / (maxSnapPoint / 100)

  const positions = useMemo(
    () => snapPoints.map((point) => getPercentSize(point, screenSize)),
    [frameSize, snapPoints]
  )

  return {
    positions,
    maxSnapPoint,
    screenSize,
  }
}

function getPercentSize(point?: number, screenSize?: number) {
  if (!screenSize) return 0
  if (point === undefined) {
    console.warn('No snapPoint')
    return 0
  }
  const pct = point / 100
  const next = Math.round(screenSize - pct * screenSize)

  return next
}
