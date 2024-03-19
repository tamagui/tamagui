import type { SheetContextValue } from './useSheetProviderProps'

export const useSheetOffscreenSize = ({
  snapPoints,
  position,
  screenSize,
  frameSize,
  snapPointsMode,
}: SheetContextValue) => {
  if (snapPointsMode === 'fit') {
    return 0
  }

  if (snapPointsMode === 'constant') {
    const maxSize = Number(snapPoints[0])
    const currentSize = Number(snapPoints[position] ?? 0)
    const offscreenSize = maxSize - currentSize
    return offscreenSize
  }

  if (snapPointsMode === 'percent') {
    const maxPercentOpened = Number(snapPoints[0]) / 100
    const percentOpened = Number(snapPoints[position] ?? 0) / 100
    const percentHidden = maxPercentOpened - percentOpened
    const offscreenSize = percentHidden * screenSize
    return offscreenSize
  }

  // mixed:
  const maxSnapPoint = snapPoints[0]
  if (maxSnapPoint === 'fit') {
    return 0
  }

  const maxSize =
    typeof maxSnapPoint === 'string'
      ? (Number(maxSnapPoint.slice(0, -1)) / 100) * screenSize
      : maxSnapPoint
  const currentSnapPoint = snapPoints[position] ?? 0
  const currentSize =
    typeof currentSnapPoint === 'string'
      ? (Number(currentSnapPoint.slice(0, -1)) / 100) * screenSize
      : currentSnapPoint
  const offscreenSize = maxSize - currentSize
  if (Number.isNaN(offscreenSize)) {
    return 0
  }
  return offscreenSize
}
