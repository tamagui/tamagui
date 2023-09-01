import { SheetContextValue } from './useSheetProviderProps'

export const useSheetOffscreenSize = ({
  snapPoints,
  position,
  screenSize,
  snapPointsMode,
}: SheetContextValue) => {
  if (snapPointsMode === 'constant') {
    const maxSize = snapPoints[0]
    const currentSize = snapPoints[position] ?? 0
    const offscreenSize = maxSize - currentSize
    return offscreenSize
  }

  const maxPercentOpened = snapPoints[0] / 100
  const percentOpened = (snapPoints[position] || 0) / 100
  const percentHidden = 1 - maxPercentOpened - percentOpened
  const offscreenSize = percentHidden * screenSize
  return offscreenSize
}
