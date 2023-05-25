import { SheetContextValue } from './useSheetProviderProps'

export const useSheetOffscreenSize = ({
  snapPoints,
  position,
  screenSize,
}: SheetContextValue) => {
  const maxPercentOpened = snapPoints[0] / 100
  const percentOpened = (snapPoints[position] || 0) / 100
  const percentHidden = 1 - maxPercentOpened - percentOpened
  const offscreenSize = percentHidden * screenSize
  return offscreenSize
}
