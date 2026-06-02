export function getKeyboardAdjustedSheetY({
  sheetY,
  screenSize,
  isKeyboardVisible,
  keyboardHeight,
  shouldTranslate,
  safeAreaTop,
}: {
  sheetY: number
  screenSize: number
  isKeyboardVisible: boolean
  keyboardHeight: number
  shouldTranslate: boolean
  safeAreaTop: number
}) {
  if (
    !shouldTranslate ||
    !isKeyboardVisible ||
    keyboardHeight <= 0 ||
    screenSize <= 0 ||
    sheetY >= screenSize
  ) {
    return sheetY
  }

  return Math.max(safeAreaTop, sheetY - keyboardHeight)
}

export function getSheetReleasePosition({
  positions,
  projectedEnd,
  currentPosition,
  frameSize,
  dismissOnSnapToBottom,
  snapPointsMode,
  isKeyboardVisible,
}: {
  positions: number[]
  projectedEnd: number
  currentPosition: number
  frameSize: number
  dismissOnSnapToBottom: boolean
  snapPointsMode: 'percent' | 'constant' | 'fit' | 'mixed'
  isKeyboardVisible: boolean
}) {
  let closestPoint = 0
  let dist = Number.POSITIVE_INFINITY

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i]
    const curDist = Math.abs(projectedEnd - position)
    if (curDist < dist) {
      dist = curDist
      closestPoint = i
    }
  }

  const dismissPoint = positions.length - 1
  const isKeyboardFitDismiss =
    dismissOnSnapToBottom &&
    isKeyboardVisible &&
    snapPointsMode === 'fit' &&
    positions.length === 2 &&
    closestPoint === dismissPoint

  if (!isKeyboardFitDismiss) {
    return closestPoint
  }

  const openPosition = positions[0]
  const dismissPosition = positions[dismissPoint]
  const dismissDistance = dismissPosition - openPosition
  if (dismissDistance <= 0 || frameSize <= 0) {
    return closestPoint
  }

  const draggedDistance = Math.max(0, currentPosition - openPosition)
  const thresholdBase = Math.min(frameSize, dismissDistance)
  const dismissThreshold = Math.max(120, thresholdBase * 0.35)

  return draggedDistance >= dismissThreshold ? closestPoint : 0
}

export function getKeyboardOccludedHeight({
  frameSize,
  isKeyboardVisible,
  keyboardHeight,
  screenSize,
  sheetY,
}: {
  frameSize: number
  isKeyboardVisible: boolean
  keyboardHeight: number
  screenSize: number
  sheetY: number | undefined
}) {
  if (
    !isKeyboardVisible ||
    keyboardHeight <= 0 ||
    screenSize <= 0 ||
    frameSize <= 0 ||
    sheetY === undefined ||
    sheetY >= screenSize
  ) {
    return 0
  }

  const keyboardTop = screenSize - keyboardHeight
  const sheetBottom = sheetY + frameSize
  const occludedHeight = Math.ceil(sheetBottom - keyboardTop)

  return Math.min(frameSize, Math.max(0, occludedHeight))
}
